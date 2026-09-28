// Builds the game's vocabulary (parts of speech + values per dictionary word)
// and the syntax tables, mirroring how ZILCH laid them out.
import type { Node } from "./reader.ts";
import type { Program } from "./analyze.ts";
import { dictKey, dictText } from "../../src/engine/zchars.ts";

export const PS = { OBJECT: 128, VERB: 64, ADJECTIVE: 32, DIRECTION: 16, PREPOSITION: 8, BUZZ: 4 } as const;
export const P1 = { OBJECT: 0, VERB: 1, ADJECTIVE: 2, DIRECTION: 3, PREPOSITION: 0 } as const;

type Part = "VERB" | "ADJECTIVE" | "DIRECTION" | "PREPOSITION" | "OBJECT" | "BUZZ";

export interface WordInfo {
  key: string;
  text: string; // lowercase source spelling (first seen)
  parts: Part[]; // in the order they were added
  values: Partial<Record<Part, number>>;
  linkTo?: string; // SYNONYM target key
}

export interface SyntaxEntry {
  objects: number;
  prep1: string | null; // canonical preposition atom
  prep2: string | null;
  find1: string | null; // flag atom
  find2: string | null;
  loc1: string[];
  loc2: string[];
  action: string; // action name without V- (e.g. "TAKE")
  line: number;
}

export interface Vocabulary {
  words: Map<string, WordInfo>;
  acts: Map<string, number>; // canonical verb atom -> ACT number
  actOrder: string[];
  preps: Map<string, number>; // canonical prep atom -> PR number
  prepCanon: Map<string, string>; // any prep word -> canonical
  adjs: Map<string, number>; // canonical adjective key -> A number
  actions: Map<string, { v: number; routine: string; pre: string | null }>;
  syntaxes: Map<string, SyntaxEntry[]>; // canonical verb -> entries (compiled order)
  directionProps: Map<string, number>;
}

/** Special word atoms the parser refers to by name. */
export const SPECIAL_WORDS: Record<string, string> = { PERIOD: ".", COMMA: ",", QUOTE: '"' };

export const PROPERTY_NUMBERS: Record<string, number> = {
  SYNONYM: 31, NORTH: 30, NE: 29, EAST: 28, SE: 27, SOUTH: 26, SW: 25, WEST: 24, NW: 23, UP: 22, DOWN: 21,
  IN: 20, OUT: 19, ADJECTIVE: 18, ACTION: 17, SDESC: 16, GLOBAL: 15, THINGS: 14, ODOR: 13, "ODOR-NUMBER": 12,
  GENERIC: 11, CAPACITY: 10, "NO-T-DESC": 9, SIZE: 8, LDESC: 7, DESCFCN: 6, "HOLE-DESTINATION": 5, FDESC: 4,
  TEXT: 3,
};

const LOC_BITS = ["HELD", "CARRIED", "IN-ROOM", "ON-GROUND", "TAKE", "MANY", "HAVE"];

function atom(n: Node): string {
  if (n.kind === "atom") return n.name;
  if (n.kind === "string") return n.value;
  throw new Error(`expected atom at line ${n.line}`);
}

export function buildVocabulary(prog: Program, codeWordRefs: Set<string>): Vocabulary {
  const words = new Map<string, WordInfo>();
  const get = (text: string): WordInfo => {
    const t = (SPECIAL_WORDS[text] ?? text).toLowerCase();
    const key = dictKey(t);
    let w = words.get(key);
    if (!w) {
      w = { key, text: t, parts: [], values: {} };
      words.set(key, w);
    }
    return w;
  };
  const add = (text: string, part: Part, value?: number): WordInfo => {
    const w = get(text);
    if (!w.parts.includes(part)) w.parts.push(part);
    if (value !== undefined && w.values[part] === undefined) w.values[part] = value;
    return w;
  };

  // Numbering pools. Values only need to be distinct; they are compared by identity.
  const acts = new Map<string, number>();
  const actOrder: string[] = [];
  const preps = new Map<string, number>();
  const prepCanon = new Map<string, string>();
  const adjs = new Map<string, number>();
  const directionProps = new Map<string, number>();
  const actions = new Map<string, { v: number; routine: string; pre: string | null }>();

  const act = (verb: string): number => {
    let n = acts.get(verb);
    if (n === undefined) {
      n = 255 - acts.size;
      acts.set(verb, n);
      actOrder.push(verb);
    }
    return n;
  };
  const prep = (p: string): number => {
    const canon = prepCanon.get(p) ?? p;
    let n = preps.get(canon);
    if (n === undefined) {
      n = 255 - preps.size;
      preps.set(canon, n);
      prepCanon.set(canon, canon);
    }
    return n;
  };
  const adjSyn = new Map<string, string>(); // adjective word -> canonical
  for (const group of prog.adjSynonyms) for (const w of group.slice(1)) adjSyn.set(dictKey(w.toLowerCase()), group[0]);
  const adj = (a: string): number => {
    const canonKey = dictKey((adjSyn.get(dictKey(a.toLowerCase())) ?? a).toLowerCase());
    let n = adjs.get(canonKey);
    if (n === undefined) {
      n = adjs.size + 1;
      adjs.set(canonKey, n);
    }
    return n;
  };
  for (const group of prog.prepSynonyms) for (const w of group.slice(1)) prepCanon.set(w, group[0]);

  // Buzz words.
  for (const b of prog.buzz) add(b, "BUZZ", 0);

  // Directions: property numbers count down from NORTH = 30.
  for (const d of prog.directions) {
    const num = PROPERTY_NUMBERS[d];
    if (num === undefined) throw new Error(`unknown direction ${d}`);
    directionProps.set(d, num);
    add(d, "DIRECTION", num);
  }

  // Syntax definitions.
  const verbSyn = new Map<string, string>();
  for (const group of prog.verbSynonyms) for (const w of group.slice(1)) verbSyn.set(w, group[0]);
  const syntaxes = new Map<string, SyntaxEntry[]>();
  let vCount = 0;
  const action = (name: string, pre: string | null) => {
    const key = name.replace(/^V-/, "");
    let a = actions.get(key);
    if (!a) {
      a = { v: ++vCount, routine: name, pre };
      actions.set(key, a);
    } else if (pre && !a.pre) a.pre = pre;
    return key;
  };
  for (const syn of prog.syntaxes) {
    const items = syn.items;
    const verb = atom(items[0]);
    act(verb);
    add(verb, "VERB", acts.get(verb)!);
    const e: SyntaxEntry = {
      objects: 0, prep1: null, prep2: null, find1: null, find2: null, loc1: [], loc2: [], action: "", line: syn.line,
    };
    let i = 1;
    for (; i < items.length; i++) {
      const it = items[i];
      if (it.kind === "atom" && it.name === "=") break;
      if (it.kind === "atom" && it.name === "OBJECT") {
        e.objects++;
        continue;
      }
      if (it.kind === "list") {
        const head = atom(it.items[0]);
        const slot = e.objects; // applies to the object just read
        if (head === "FIND") {
          if (slot === 1) e.find1 = atom(it.items[1]);
          else e.find2 = atom(it.items[1]);
        } else {
          const bits = it.items.map(atom);
          for (const b of bits) if (!LOC_BITS.includes(b)) throw new Error(`unknown loc bit ${b}`);
          if (slot === 1) e.loc1 = bits;
          else e.loc2 = bits;
        }
        continue;
      }
      const p = atom(it);
      const canon = prepCanon.get(p) ?? p;
      prep(canon);
      add(p, "PREPOSITION", preps.get(canon));
      if (e.objects === 0) e.prep1 = canon;
      else e.prep2 = canon;
    }
    const actionName = atom(items[i + 1]);
    const pre = items[i + 2] ? atom(items[i + 2]) : null;
    e.action = action(actionName, pre);
    if (!syntaxes.has(verb)) syntaxes.set(verb, []);
    syntaxes.get(verb)!.push(e);
  }
  // ZILCH stores each verb's syntaxes in reverse order of definition.
  for (const list of syntaxes.values()) list.reverse();

  for (const [syn, canon] of verbSyn) add(syn, "VERB", act(canon));
  for (const group of prog.prepSynonyms) {
    const n = prep(group[0]);
    for (const w of group.slice(1)) add(w, "PREPOSITION", n);
  }
  for (const group of prog.adjSynonyms) for (const w of group) add(w, "ADJECTIVE", adj(w));

  // VOC declarations.
  for (const v of prog.vocs) {
    if (v.part === "ADJ" || v.part === "ADJECTIVE") add(v.word, "ADJECTIVE", adj(v.word));
    else if (v.part === "NOUN" || v.part === "OBJECT") add(v.word, "OBJECT");
    else if (v.part === "BUZZ") add(v.word, "BUZZ", 0);
    else throw new Error(`unknown VOC part ${v.part}`);
  }

  // Object vocabulary.
  for (const obj of prog.objects.values()) {
    for (const p of obj.props) {
      const name = atom(p[0]);
      if (name === "SYNONYM") for (const w of p.slice(1)) add(atom(w), "OBJECT");
      else if (name === "ADJECTIVE") for (const w of p.slice(1)) add(atom(w), "ADJECTIVE", adj(atom(w)));
      else if (name === "THINGS") {
        for (const triple of pseudoTriples(p[1], obj.name)) {
          if (triple.noun) add(triple.noun, "OBJECT");
          if (triple.adj) add(triple.adj, "ADJECTIVE", adj(triple.adj));
        }
      }
    }
  }

  // General synonyms share the canonical word's final data.
  for (const group of prog.synonyms) {
    for (const w of group.slice(1)) get(w).linkTo = get(group[0]).key;
  }
  // Words the code refers to directly (,W?FOO) must exist.
  for (const w of codeWordRefs) get(w);

  return { words, acts, actOrder, preps, prepCanon, adjs, actions, syntaxes, directionProps };
}

export interface PseudoTriple {
  adj: string | null;
  noun: string | null;
  routine: string;
}

export function pseudoTriples(node: Node, where: string): PseudoTriple[] {
  if (node.kind !== "form" || node.items[0]?.kind !== "atom" || node.items[0].name !== "PSEUDO") {
    throw new Error(`${where}: THINGS must be <PSEUDO ...>`);
  }
  return node.items.slice(1).map((t) => {
    if (t.kind !== "list" || t.items.length !== 3) throw new Error(`${where}: bad PSEUDO triple`);
    const part = (n: Node) => (n.kind === "form" && n.items.length === 0 ? null : atom(n));
    return { adj: part(t.items[0]), noun: part(t.items[1]), routine: atom(t.items[2]) };
  });
}

/** Final (resolved) parts/values for a word, following SYNONYM links. */
export function resolvedWord(v: Vocabulary, w: WordInfo): { parts: Part[]; values: Partial<Record<Part, number>> } {
  const parts = [...w.parts];
  const values = { ...w.values };
  if (w.linkTo) {
    const target = resolvedWord(v, v.words.get(w.linkTo)!);
    for (const p of target.parts) {
      if (!parts.includes(p)) parts.push(p);
      if (target.values[p] !== undefined) values[p] = target.values[p];
    }
  }
  return { parts, values };
}

/** Encodes a word as the three bytes ZILCH stored after the text: PS byte, value 1, value 2. */
export function wordBytes(v: Vocabulary, w: WordInfo): [number, number, number] {
  const { parts, values } = resolvedWord(v, w);
  let ps = 0;
  for (const p of parts) ps |= PS[p];
  const valued = parts.filter((p) => p === "VERB" || p === "ADJECTIVE" || p === "DIRECTION" || p === "PREPOSITION");
  if (valued.length > 2) throw new Error(`word ${w.text} has more than two valued parts of speech`);
  let v1 = 0;
  let v2 = 0;
  if (valued.length > 0) {
    ps |= P1[valued[0] as keyof typeof P1];
    v1 = values[valued[0]] ?? 0;
    if (valued.length > 1) v2 = values[valued[1]] ?? 0;
  } else if (parts.includes("BUZZ")) v1 = values.BUZZ ?? 0;
  return [ps, v1, v2];
}

export { dictText };
