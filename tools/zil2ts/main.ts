// zil2ts: translates the Leather Goddesses of Phobos ZIL sources into the
// TypeScript game modules under src/game/.
//
//   npx tsx tools/zil2ts/main.ts
import fs from "fs";
import path from "path";
import { loadProgram, SOURCE_FILES, type ObjectDef } from "./analyze.ts";
import type { Node } from "./reader.ts";
import { zilStringText } from "./reader.ts";
import { camel, screaming, member } from "./names.ts";
import {
  buildVocabulary, wordBytes, pseudoTriples, PROPERTY_NUMBERS, PS, P1, SPECIAL_WORDS, type Vocabulary,
} from "./vocab.ts";
import { Imports, RoutineEmitter, RUNTIME, type SymbolTable, type Where } from "./emit.ts";
import { OVERRIDES } from "./overrides.ts";
import { dictKey } from "../../src/engine/zchars.ts";
import layout from "./original-layout.json" with { type: "json" };

const ROOT = path.resolve(import.meta.dirname, "../..");
const ZIL_DIR = path.join(ROOT, "reference/zil");
const OUT_DIR = path.join(ROOT, "src/game");
const WORLD = "./world.ts";
const SYNTAX = "./syntax.ts";
const DEFINE = "../engine/define.ts";
const TABLES = "../engine/table.ts";

const HEADER = (what: string) => `// ${what}
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.
`;

const prog = loadProgram(ZIL_DIR);

// ---------------------------------------------------------------------------
// Pass 1: what the code refers to

const assignedGlobals = new Set<string>();
const wordRefs = new Set<string>();
const adjRefs = new Set<string>();

function walk(n: Node, locals: Set<string>): void {
  if (n.kind === "gval") {
    if (n.name.startsWith("W?")) wordRefs.add(n.name.slice(2));
    if (n.name.startsWith("A?")) adjRefs.add(n.name.slice(2));
  }
  if (n.kind === "form" && n.items[0]?.kind === "atom") {
    const h = n.items[0].name;
    const t = n.items[1];
    const target = t && (t.kind === "atom" || t.kind === "gval" || t.kind === "lval") ? t.name : null;
    if (target && (h === "SETG" || ((h === "SET" || h === "IGRTR?" || h === "DLESS?") && !locals.has(target)))) {
      assignedGlobals.add(target);
    }
  }
  if (n.kind === "form" || n.kind === "list" || n.kind === "vector") n.items.forEach((c) => walk(c, locals));
  if (n.kind === "quote" || n.kind === "macro" || n.kind === "segment" || n.kind === "hash") walk(n.node, locals);
}
for (const r of prog.routines.values()) {
  const locals = new Set([...r.required, ...r.optional, ...r.aux].map((p) => p.name));
  r.body.forEach((n) => walk(n, locals));
  [...r.optional, ...r.aux].forEach((p) => p.init && walk(p.init, locals));
}
// Globals named in conditional exits are read with VALUE, so they must live in G.
for (const o of prog.objects.values()) {
  for (const p of o.props) {
    const i = p.findIndex((x) => x.kind === "atom" && x.name === "IF");
    const isDoor = p[i + 2]?.kind === "atom" && (p[i + 2] as any).name === "IS";
    if (i > 0 && !isDoor) assignedGlobals.add(atomOf(p[i + 1]));
  }
}
for (const g of prog.globals.values()) if (g.init) walk(g.init, new Set());

function atomOf(n: Node): string {
  if (n.kind === "atom" || n.kind === "gval") return n.name;
  if (n.kind === "string") return n.value;
  throw new Error(`expected atom at line ${n.line}`);
}

const vocab: Vocabulary = buildVocabulary(prog, wordRefs);

// ---------------------------------------------------------------------------
// Classification of globals

function isTableInit(n: Node | null): boolean {
  if (!n) return false;
  if (n.kind === "macro") return isTableInit(selectMacro(n.node));
  return n.kind === "form" && n.items[0]?.kind === "atom" && /^(P?L?TABLE|ITABLE)$/.test(n.items[0].name);
}

function selectMacro(f: Node): Node {
  if (f.kind === "form" && f.items[0]?.kind === "atom" && f.items[0].name === "COND") {
    for (const c of f.items.slice(1)) {
      if (c.kind !== "list") continue;
      const t = c.items[0];
      const ok = (t.kind === "atom" && (t.name === "T" || t.name === "ELSE")) ||
        (t.kind === "form" && t.items[0]?.kind === "atom" && t.items[0].name === "GASSIGNED?");
      if (ok) {
        const v = c.items[c.items.length - 1];
        return v.kind === "quote" ? v.node : v;
      }
    }
  }
  throw new Error(`unsupported compile-time form at line ${f.line}`);
}

type GlobalKind = "state" | "constTable" | "constValue";
const globalKind = new Map<string, GlobalKind>();
for (const g of prog.globals.values()) {
  if (assignedGlobals.has(g.name)) globalKind.set(g.name, "state");
  else if (isTableInit(g.init)) globalKind.set(g.name, "constTable");
  else globalKind.set(g.name, "constValue");
}
for (const name of assignedGlobals) {
  if (!prog.globals.has(name)) throw new Error(`assignment to undeclared global ${name}`);
}

// Identifier assignments.
const objIdent = new Map<string, string>();
for (const name of prog.objects.keys()) objIdent.set(name, screaming(name));
const constIdent = new Map<string, string>();
for (const name of prog.constants.keys()) constIdent.set(name, screaming(name));
const routineIdent = new Map<string, string>();
for (const name of prog.routines.keys()) routineIdent.set(name, camel(name));
const globalKey = new Map<string, string>();
for (const [name, kind] of globalKind) globalKey.set(name, kind === "state" ? camel(name).replace(/^is(?=[A-Z])/, (m) => m) : screaming(name));

function checkUnique(label: string, idents: Iterable<string>) {
  const seen = new Set<string>();
  for (const id of idents) {
    if (seen.has(id)) throw new Error(`${label}: duplicate identifier ${id}`);
    seen.add(id);
  }
}
checkUnique("screaming", [
  ...objIdent.values(), ...constIdent.values(),
  ...[...globalKind].filter(([, k]) => k !== "state").map(([n]) => globalKey.get(n)!),
  ...Object.keys(layout.flags),
]);
checkUnique("routines", routineIdent.values());
checkUnique("G keys", [...globalKind].filter(([, k]) => k === "state").map(([n]) => globalKey.get(n)!));

const moduleOf = (file: string) => `./${file}.ts`;

// Inline tables in routine bodies become module-level constants.
const inlineTables: { file: string; ident: string; node: Node }[] = [];

const syms: SymbolTable = {
  gval: (name) => resolveGval(name),
  routine(name) {
    const r = prog.routines.get(name);
    if (!r) return null;
    const ident = routineIdent.get(name)!;
    return { ident, imp: { module: moduleOf(r.file), name: ident } };
  },
  isAssignedGlobal: (name) => globalKind.get(name) === "state",
  globalKey: (name) => globalKey.get(name)!,
  inlineTable(node, file) {
    const ident = `TABLE_${inlineTables.length + 1}`;
    inlineTables.push({ file, ident, node });
    return { c: ident, imp: { module: moduleOf(file), name: ident } };
  },
  special(name) {
    const r = resolveGval(name);
    return r ? { c: r.c, imp: r.imp! } : null;
  },
};

function resolveGval(name: string): { c: string; imp?: Where } | null {
  const w = (n: string) => ({ module: WORLD, name: n });
  if (objIdent.has(name)) return { c: objIdent.get(name)!, imp: w(objIdent.get(name)!) };
  if (constIdent.has(name)) return { c: constIdent.get(name)!, imp: w(constIdent.get(name)!) };
  if (name in layout.flags) return { c: name, imp: w(name) };
  if (name === "LAST-OBJECT") return { c: "LAST_OBJECT", imp: w("LAST_OBJECT") };
  if (name === "LOW-DIRECTION") return { c: "LOW_DIRECTION", imp: w("LOW_DIRECTION") };
  if (["VERBS", "ACTIONS", "PREACTIONS", "PREPOSITIONS"].includes(name)) return { c: name, imp: { module: SYNTAX, name } };
  const kind = globalKind.get(name);
  if (kind === "state") return { c: `G.${globalKey.get(name)}`, imp: w("G") };
  if (kind === "constValue") return { c: globalKey.get(name)!, imp: w(globalKey.get(name)!) };
  if (kind === "constTable") {
    const g = prog.globals.get(name)!;
    return { c: globalKey.get(name)!, imp: { module: moduleOf(g.file), name: globalKey.get(name)! } };
  }
  const r = prog.routines.get(name);
  if (r) return { c: routineIdent.get(name)!, imp: { module: moduleOf(r.file), name: routineIdent.get(name)! } };
  const m = /^(P|V|W|ACT|PR|PS|P1|A)\?(.+)$/.exec(name);
  if (m) {
    const [, prefix, rest] = m;
    const rec = prefix === "A" ? "ADJ" : prefix;
    if (prefix === "P" && PROPERTY_NUMBERS[rest] === undefined) return null;
    if (prefix === "V" && !vocab.actions.has(rest)) return null;
    if (prefix === "ACT" && !vocab.acts.has(rest)) return null;
    if (prefix === "PR" && !vocab.preps.has(rest)) return null;
    return { c: `${rec}${member(rest)}`, imp: w(rec) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Data expressions (global initial values, object properties, tables)

function dataExpr(n: Node, imports: Imports, label: string, where: string): string {
  switch (n.kind) {
    case "number":
      return String(n.value);
    case "string": {
      const t = zilStringText(n.value);
      if (t === "") {
        imports.add({ module: RUNTIME, name: "EMPTY" });
        return "EMPTY";
      }
      return JSON.stringify(t);
    }
    case "atom": {
      if (n.name === "T") return "true";
      const r = resolveGval(n.name);
      if (!r) throw new Error(`${where}: unknown atom ${n.name}`);
      imports.add(r.imp);
      return r.c;
    }
    case "gval": {
      const r = resolveGval(n.name);
      if (!r) throw new Error(`${where}: unknown ,${n.name}`);
      imports.add(r.imp);
      return r.c;
    }
    case "quote":
      return dataExpr(n.node, imports, label, where);
    case "macro":
      return dataExpr(selectMacro(n.node), imports, label, where);
    case "hash":
      if (n.type === "BYTE") {
        imports.add({ module: TABLES, name: "byte" });
        return `byte(${dataExpr(n.node, imports, label, where)})`;
      }
      throw new Error(`${where}: unsupported #${n.type}`);
    case "form": {
      if (n.items.length === 0) return "false";
      const h = n.items[0].kind === "atom" ? n.items[0].name : "";
      const args = n.items.slice(1);
      const elems = (xs: Node[]) => xs.filter((x) => x.kind !== "list").map((x) => dataExpr(x, imports, label, where));
      if (h === "BYTE") {
        imports.add({ module: TABLES, name: "byte" });
        return `byte(${dataExpr(args[0], imports, label, where)})`;
      }
      if (h === "TABLE" || h === "PTABLE") {
        imports.add({ module: TABLES, name: "table" });
        return `table(${JSON.stringify(label)}, [${fmtList(elems(args))}])`;
      }
      if (h === "LTABLE" || h === "PLTABLE") {
        imports.add({ module: TABLES, name: "ltable" });
        return `ltable(${JSON.stringify(label)}, [${fmtList(elems(args))}])`;
      }
      if (h === "ITABLE") {
        imports.add({ module: TABLES, name: "itable" });
        let i = 0;
        const flags: string[] = [];
        if (args[i]?.kind === "atom") flags.push((args[i++] as any).name);
        const count = args[i++];
        if (count.kind !== "number") throw new Error(`${where}: ITABLE count`);
        if (args[i]?.kind === "list") flags.push(...(args[i++] as any).items.map(atomOf));
        const pattern = args.slice(i).map((x) => dataExpr(x, imports, label, where));
        return `itable(${JSON.stringify(label)}, ${count.value}, ${JSON.stringify(flags)}, [${pattern.join(", ")}])`;
      }
      throw new Error(`${where}: unsupported data form <${h}>`);
    }
    default:
      throw new Error(`${where}: unsupported ${n.kind} in data`);
  }
}

function fmtList(items: string[]): string {
  const oneLine = items.join(", ");
  if (oneLine.length < 80 && !oneLine.includes("\n")) return oneLine;
  return "\n    " + items.join(",\n    ") + ",\n  ";
}

// ---------------------------------------------------------------------------
// Object definitions

const DIRS = new Set(prog.directions);

function objectSpec(o: ObjectDef, imports: Imports): string {
  const where = `${o.file}.zil ${o.name}`;
  const fields: string[] = [];
  const exits: string[] = [];
  const props: string[] = [];
  const add = (w: Where) => imports.add(w);
  for (const p of o.props) {
    const name = atomOf(p[0]);
    const rest = p.slice(1);
    if ((name === "IN" || name === "LOC") && rest.length === 1 && rest[0].kind === "atom") {
      fields.push(`in: ${dataExpr(rest[0], imports, "", where)}`);
      continue;
    }
    if (DIRS.has(name)) {
      exits.push(`${name}: ${exitExpr(rest, imports, where)}`);
      continue;
    }
    switch (name) {
      case "DESC":
        fields.push(`desc: ${JSON.stringify(zilStringText((rest[0] as any).value))}`);
        break;
      case "FLAGS":
        fields.push(`flags: [${rest.map((f) => dataExpr(f, imports, "", where)).join(", ")}]`);
        break;
      case "SYNONYM":
        fields.push(`synonym: [${rest.map((x) => JSON.stringify(atomOf(x))).join(", ")}]`);
        break;
      case "ADJECTIVE":
        fields.push(`adjective: [${rest.map((x) => JSON.stringify(atomOf(x))).join(", ")}]`);
        break;
      case "GLOBAL":
        fields.push(`global: [${rest.map((x) => dataExpr(x, imports, "", where)).join(", ")}]`);
        break;
      case "THINGS": {
        const triples = pseudoTriples(rest[0], o.name).map((t) => {
          const r = resolveGval(t.routine);
          if (!r) throw new Error(`${where}: unknown pseudo routine ${t.routine}`);
          add(r.imp!);
          return `{ adjective: ${t.adj ? JSON.stringify(t.adj) : "null"}, noun: ${t.noun ? JSON.stringify(t.noun) : "null"}, action: ${r.c} }`;
        });
        fields.push(`things: [\n    ${triples.join(",\n    ")},\n  ]`);
        break;
      }
      default: {
        const num = PROPERTY_NUMBERS[name];
        if (num === undefined) throw new Error(`${where}: unknown property ${name}`);
        if (rest.length !== 1) throw new Error(`${where}: property ${name} with ${rest.length} values`);
        add({ module: WORLD, name: "P" });
        props.push(`[P${member(name)}]: ${dataExpr(rest[0], imports, "", where)}`);
      }
    }
  }
  if (exits.length) fields.push(`exits: {\n    ${exits.join(",\n    ")},\n  }`);
  if (props.length) fields.push(`props: {\n    ${props.join(",\n    ")},\n  }`);
  return `{\n  ${fields.join(",\n  ")},\n}`;
}

function exitExpr(rest: Node[], imports: Imports, where: string): string {
  const d = (x: string) => {
    imports.add({ module: DEFINE, name: x });
    return x;
  };
  const val = (n: Node) => dataExpr(n, imports, "", where);
  if (rest.length === 1 && rest[0].kind === "string") return `${d("blocked")}(${val(rest[0])})`;
  const kw = (i: number) => (rest[i]?.kind === "atom" ? (rest[i] as any).name : null);
  if (kw(0) === "PER") return `${d("per")}(${val(rest[1])})`;
  if (kw(0) === "TO") {
    const room = val(rest[1]);
    if (rest.length === 2) return `${d("to")}(${room})`;
    if (kw(2) === "IF") {
      const flag = atomOf(rest[3]);
      if (kw(4) === "IS") {
        if (kw(5) !== "OPEN") throw new Error(`${where}: bad door exit`);
        const msg = kw(6) === "ELSE" ? `, ${val(rest[7])}` : "";
        return `${d("toIfOpen")}(${room}, ${val(rest[3])}${msg})`;
      }
      const msg = kw(4) === "ELSE" ? `, ${val(rest[5])}` : "";
      return `${d("toIf")}(${room}, ${JSON.stringify(globalKey.get(flag))}${msg})`;
    }
  }
  throw new Error(`${where}: unsupported exit form`);
}

// ---------------------------------------------------------------------------
// Emit area modules

const allWarnings: string[] = [];
const reservedIdents = new Set<string>([
  ...routineIdent.values(), "G", "P", "V", "W", "A", "ACT", "PR", "PS", "P1", "CR", "D", "T", "N", "C", "AR", "TR", "PD",
  "tell", "eq", "get", "put", "getb", "putb", "rest", "back", "loc", "first", "next", "move", "remove", "getp", "putp",
  "getpt", "ptsize", "nextp", "hasFlag", "setFlag", "clearFlag", "isIn", "print", "printd", "printb", "printn", "printc",
  "crlf", "read", "usl", "save", "restore", "restart", "quit", "verify", "random", "prob", "apply", "value", "div",
  "btst", "dirout", "dirin", "verbIs", "prsoIs", "prsiIs", "hereIs", "EMPTY", "HEADER", "table", "ltable", "itable",
  "byte", "machine", "clearScreen",
]);

const emittedFiles = new Map<string, string>();

for (const file of SOURCE_FILES) {
  if (file === "syntax") continue;
  const imports = new Imports();
  const chunks: string[] = [];
  const self = moduleOf(file);
  const routineChunks = new Map<string, string>();
  for (const entry of prog.fileOrder.get(file)!) {
    if (entry.kind === "routine") {
      const r = prog.routines.get(entry.name)!;
      const ident = routineIdent.get(r.name)!;
      const ov = OVERRIDES[r.name];
      if (ov) {
        for (const w of ov.imports) imports.add(w);
        routineChunks.set(r.name, `${ov.comment ? ov.comment + "\n" : ""}${ov.code.trim()}`);
        chunks.push(`@@ROUTINE ${r.name}`);
        continue;
      }
      const em = new RoutineEmitter(prog, syms, imports, r, reservedIdents);
      const before = inlineTables.length;
      const code = em.emit(ident);
      allWarnings.push(...em.warnings);
      const tables = inlineTables.slice(before).map((t) =>
        `const ${t.ident} = ${dataExpr(t.node, imports, `${r.name} table`, `${file}.zil ${r.name}`)};`);
      routineChunks.set(r.name, [...tables, code].join("\n\n"));
      chunks.push(`@@ROUTINE ${r.name}`);
    } else if (entry.kind === "object") {
      const o = prog.objects.get(entry.name)!;
      imports.add({ module: DEFINE, name: "defineObject" });
      imports.add({ module: WORLD, name: objIdent.get(o.name)! });
      chunks.push(`defineObject(${objIdent.get(o.name)}, ${o.index}, ${objectSpec(o, imports)});`);
    } else if (entry.kind === "global") {
      const g = prog.globals.get(entry.name)!;
      const kind = globalKind.get(g.name)!;
      const key = globalKey.get(g.name)!;
      const init = g.init ? dataExpr(g.init, imports, g.name, `${file}.zil ${g.name}`) : "false";
      if (kind === "state") {
        imports.add({ module: WORLD, name: "G" });
        chunks.push(`G.${key} = ${init};`);
      } else if (kind === "constTable") {
        chunks.push(`export const ${key} = ${init};`);
      }
      // constValue globals live in world.ts
    }
  }
  const body = chunks
    .map((c) => (c.startsWith("@@ROUTINE ") ? routineChunks.get(c.slice(10))! : c))
    .join("\n\n");
  const text = `${HEADER(`${file}.ts — from ${file.toUpperCase()}.ZIL`)}\n${imports.render(self)}\n\n${body}\n`;
  emittedFiles.set(file, text);
}

// ---------------------------------------------------------------------------
// world.ts

function emitWorld(): string {
  const imports = new Imports();
  imports.add({ module: "../engine/object.ts", name: "createObject" });
  imports.add({ module: "../engine/vocab.ts", name: "defineWord" });
  imports.add({ module: "../engine/vocab.ts", name: "word" });
  imports.add({ module: RUNTIME, name: "eq" });
  const out: string[] = [];
  out.push("// ---------------------------------------------------------------------------\n// Attribute flags (numbered as in the original)\n");
  for (const [name, num] of Object.entries(layout.flags)) out.push(`export const ${name} = ${num};`);

  out.push("\n// Property numbers\n");
  out.push(`export const P = {\n${Object.entries(PROPERTY_NUMBERS).map(([k, v]) => `  ${member(k).slice(1).replace(/^\["(.*)"\]$/, '"$1"')}: ${v},`).join("\n")}\n} as const;`);
  out.push(`\n/** The lowest-numbered direction property. */\nexport const LOW_DIRECTION = ${Math.min(...vocab.directionProps.values())};`);

  out.push("\n// Parts of speech (dictionary byte 4)\n");
  out.push(`export const PS = { OBJECT: ${PS.OBJECT}, VERB: ${PS.VERB}, ADJECTIVE: ${PS.ADJECTIVE}, DIRECTION: ${PS.DIRECTION}, PREPOSITION: ${PS.PREPOSITION}, BUZZ_WORD: ${PS.BUZZ} } as const;`);
  out.push(`export const P1 = { NONE: 0, OBJECT: ${P1.OBJECT}, VERB: ${P1.VERB}, ADJECTIVE: ${P1.ADJECTIVE}, DIRECTION: ${P1.DIRECTION} } as const;`);

  const rec = (name: string, doc: string, entries: [string, number][]) =>
    `\n/** ${doc} */\nexport const ${name} = {\n${entries.map(([k, v]) => `  ${recKey(k)}: ${v},`).join("\n")}\n} as const;`;
  out.push(rec("V", "Action numbers (PRSA values).", [...vocab.actions].map(([k, a]) => [k, a.v])));
  out.push(rec("ACT", "Verb numbers (the parser's verb-word values).", [...vocab.acts]));
  out.push(rec("PR", "Preposition numbers.", [...vocab.preps]));
  const adjByWord: [string, number][] = [];
  for (const a of adjRefs) {
    const w = vocab.words.get(dictKey(a.toLowerCase()));
    if (!w) throw new Error(`A?${a}: no such word`);
    const num = wordBytes(vocab, w);
    adjByWord.push([a, (num[0] & 3) === P1.ADJECTIVE ? num[1] : num[2]]);
  }
  out.push(rec("ADJ", "Adjective numbers referred to by the code (A?FOO).", adjByWord));

  out.push("\n// ---------------------------------------------------------------------------\n// Objects, numbered as in the original\n");
  layout.objects.forEach((name: string, i: number) => {
    if (!prog.objects.has(name)) throw new Error(`layout object ${name} not in source`);
    out.push(`export const ${objIdent.get(name)} = createObject(${JSON.stringify(name)}, ${i + 1});`);
  });
  if (layout.objects.length !== prog.objects.size) throw new Error("object count mismatch");

  out.push("\n// ---------------------------------------------------------------------------\n// Constants\n");
  for (const c of prog.constants.values()) {
    const value = c.name === "LAST-OBJECT" ? String(layout.objects.length) : dataExpr(c.value, imports, c.name, c.name);
    out.push(`export const ${constIdent.get(c.name)} = ${value};`);
  }
  out.push("\n// Global values that never change\n");
  for (const g of prog.globals.values()) {
    if (globalKind.get(g.name) !== "constValue") continue;
    const v = g.init ? dataExpr(g.init, imports, g.name, g.name) : "false";
    if (/^[a-z]/.test(v) && !["true", "false"].includes(v)) throw new Error(`constant global ${g.name} needs a routine`);
    out.push(`export const ${globalKey.get(g.name)} = ${v};`);
  }

  out.push("\n// ---------------------------------------------------------------------------\n// Global variables (initial values are set where each is declared)\n");
  const keys = [...globalKind].filter(([, k]) => k === "state").map(([n]) => [n, globalKey.get(n)!] as const);
  out.push(`export interface Globals {\n${keys.map(([n, k]) => `  /** ${n} */\n  ${k}: any;`).join("\n")}\n}`);
  out.push(`\nexport const G = {} as Globals;`);

  out.push("\n// ---------------------------------------------------------------------------\n// Vocabulary: word, parts-of-speech byte, value 1, value 2\n");
  const wordsSorted = [...vocab.words.values()].sort((a, b) => (a.key < b.key ? -1 : 1));
  for (const w of wordsSorted) {
    const [ps, v1, v2] = wordBytes(vocab, w);
    out.push(`defineWord(${JSON.stringify(w.text)}, 0b${ps.toString(2).padStart(8, "0")}, ${v1}, ${v2});`);
  }
  const refs = [...wordRefs].sort();
  out.push(`\n/** Dictionary words referred to by the code (,W?FOO). */\nexport const W = {\n${refs.map((r) => `  ${recKey(r)}: word(${JSON.stringify((SPECIAL_WORDS[r] ?? r).toLowerCase())}),`).join("\n")}\n} as const;`);

  out.push(`\n// ---------------------------------------------------------------------------
// MISC macros

/** VERB? */
export const verbIs = (...actions: number[]): boolean => eq(G.prsa, ...actions);
/** PRSO? */
export const prsoIs = (...xs: any[]): boolean => eq(G.prso, ...xs);
/** PRSI? */
export const prsiIs = (...xs: any[]): boolean => eq(G.prsi, ...xs);
/** ROOM? */
export const hereIs = (...xs: any[]): boolean => eq(G.here, ...xs);`);

  return `${HEADER("world.ts — objects, vocabulary, numbering and globals")}\n${imports.render(WORLD)}\n\n${out.join("\n")}\n`;
}

function recKey(k: string): string {
  const id = k.replace(/-/g, "_").toUpperCase();
  return /^[A-Z_$][A-Z0-9_$]*$/.test(id) ? id : JSON.stringify(k.toUpperCase());
}

// ---------------------------------------------------------------------------
// syntax.ts

function emitSyntax(): string {
  const imports = new Imports();
  imports.add({ module: "../engine/syntax.ts", name: "syntaxTable" });
  imports.add({ module: "../engine/syntax.ts", name: "verbsTable" });
  imports.add({ module: "../engine/syntax.ts", name: "actionTable" });
  imports.add({ module: "../engine/syntax.ts", name: "prepositionTable" });
  for (const n of ["ACT", "PR", "V"]) imports.add({ module: WORLD, name: n });
  const locName: Record<string, string> = {
    HELD: "SH", CARRIED: "SC", "IN-ROOM": "SIR", "ON-GROUND": "SOG", TAKE: "STAKE", MANY: "SMANY", HAVE: "SHAVE",
  };
  const bits = (list: string[]) => {
    list.forEach((b) => imports.add({ module: WORLD, name: locName[b] }));
    return list.map((b) => locName[b]).join(" | ");
  };
  const flag = (f: string) => {
    imports.add({ module: WORLD, name: f });
    return f;
  };
  const verbs: string[] = [];
  for (const verb of vocab.actOrder) {
    const entries = vocab.syntaxes.get(verb) ?? [];
    const specs = entries.map((e) => {
      const f: string[] = [`objects: ${e.objects}`];
      if (e.prep1) f.push(`prep1: PR${member(e.prep1)}`);
      if (e.prep2) f.push(`prep2: PR${member(e.prep2)}`);
      if (e.find1) f.push(`find1: ${flag(e.find1)}`);
      if (e.find2) f.push(`find2: ${flag(e.find2)}`);
      if (e.loc1.length) f.push(`loc1: ${bits(e.loc1)}`);
      if (e.loc2.length) f.push(`loc2: ${bits(e.loc2)}`);
      f.push(`action: V${member(e.action)}`);
      return `    { ${f.join(", ")} },`;
    });
    verbs.push(`  [ACT${member(verb)}, syntaxTable(${JSON.stringify(verb)}, [\n${specs.join("\n")}\n  ])],`);
  }
  const actions: string[] = [];
  const pre: string[] = [];
  for (const [key, a] of vocab.actions) {
    const r = resolveGval(a.routine);
    if (!r) throw new Error(`no action routine ${a.routine}`);
    imports.add(r.imp);
    actions.push(`  [V${member(key)}, ${r.c}],`);
    if (a.pre) {
      const p = resolveGval(a.pre);
      if (!p) throw new Error(`no preaction ${a.pre}`);
      imports.add(p.imp);
      pre.push(`  [V${member(key)}, ${p.c}],`);
    }
  }
  const preps: string[] = [];
  for (const [canon, num] of vocab.preps) {
    preps.push(`  [word(${JSON.stringify(canon.toLowerCase())}), PR${member(canon)}],`);
    void num;
  }
  imports.add({ module: "../engine/vocab.ts", name: "word" });
  return `${HEADER("syntax.ts — the parser's verb syntaxes and action tables")}
${imports.render(SYNTAX)}

/**
 * Each verb's syntaxes, in the order the original compiler stored them
 * (reverse of their order in SYNTAX.ZIL). The parser uses the last match.
 */
export const VERBS = verbsTable([
${verbs.join("\n")}
]);

/** The routine that carries out each action. */
export const ACTIONS = actionTable("ACTIONS", ${vocab.actions.size}, [
${actions.join("\n")}
]);

/** Routines run before an action's own handlers get a chance. */
export const PREACTIONS = actionTable("PREACTIONS", ${vocab.actions.size}, [
${pre.join("\n")}
]);

/** Canonical word for each preposition number. */
export const PREPOSITIONS = prepositionTable([
${preps.join("\n")}
]);
`;
}

// ---------------------------------------------------------------------------
// Write everything

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "world.ts"), emitWorld());
fs.writeFileSync(path.join(OUT_DIR, "syntax.ts"), emitSyntax());
for (const [file, text] of emittedFiles) fs.writeFileSync(path.join(OUT_DIR, `${file}.ts`), text);
for (const w of allWarnings) console.warn("warning:", w);
console.log(`wrote world.ts, syntax.ts and ${emittedFiles.size} game modules (${prog.routines.size} routines, ${prog.objects.size} objects, ${vocab.words.size} words)`);
