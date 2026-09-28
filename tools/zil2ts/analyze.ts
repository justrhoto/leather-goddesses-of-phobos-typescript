// Collects every top-level definition from the ZIL sources into symbol tables.
import fs from "fs";
import path from "path";
import { readZilFile, type Node } from "./reader.ts";

export const SOURCE_FILES = [
  "misc", "parser", "syntax", "verbs", "globals", "earth", "mars", "venus", "cleveland", "spaceship", "phobos",
];

export interface Param {
  name: string;
  init?: Node; // default (OPTIONAL) or initial value (AUX)
}

export interface RoutineDef {
  name: string;
  file: string;
  required: Param[];
  optional: Param[];
  aux: Param[];
  body: Node[];
  line: number;
}

export interface ObjectDef {
  name: string;
  kind: "OBJECT" | "ROOM";
  file: string;
  props: Node[][]; // each property clause's items
  index: number; // definition order
}

export interface GlobalDef {
  name: string;
  file: string;
  init: Node | null;
}

export interface Program {
  routines: Map<string, RoutineDef>;
  objects: Map<string, ObjectDef>;
  globals: Map<string, GlobalDef>;
  constants: Map<string, { name: string; file: string; value: Node }>;
  syntaxes: { items: Node[]; file: string; line: number }[];
  verbSynonyms: string[][];
  synonyms: string[][];
  prepSynonyms: string[][];
  adjSynonyms: string[][];
  buzz: string[];
  vocs: { word: string; part: string }[];
  directions: string[];
  /** Order in which top-level definitions appeared, per file. */
  fileOrder: Map<string, { kind: string; name: string }[]>;
}

function atomName(n: Node | undefined): string {
  if (!n) throw new Error("expected atom, got nothing");
  if (n.kind === "atom") return n.name;
  if (n.kind === "string") return n.value;
  throw new Error(`expected atom at line ${n.line}, got ${n.kind}`);
}

function parseParams(list: Node, where: string): Pick<RoutineDef, "required" | "optional" | "aux"> {
  if (list.kind !== "list") throw new Error(`${where}: bad arg list`);
  const out = { required: [] as Param[], optional: [] as Param[], aux: [] as Param[] };
  let mode: "required" | "optional" | "aux" = "required";
  for (const item of list.items) {
    if (item.kind === "string") {
      if (item.value === "OPTIONAL" || item.value === "OPT") mode = "optional";
      else if (item.value === "AUX" || item.value === "EXTRA") mode = "aux";
      else throw new Error(`${where}: unsupported arg spec "${item.value}"`);
      continue;
    }
    if (item.kind === "atom") out[mode].push({ name: item.name });
    else if (item.kind === "list" && item.items[0]?.kind === "atom") {
      out[mode].push({ name: item.items[0].name, init: item.items[1] });
    } else throw new Error(`${where}: bad param`);
  }
  return out;
}

export function loadProgram(zilDir: string): Program {
  const prog: Program = {
    routines: new Map(),
    objects: new Map(),
    globals: new Map(),
    constants: new Map(),
    syntaxes: [],
    verbSynonyms: [],
    synonyms: [],
    prepSynonyms: [],
    adjSynonyms: [],
    buzz: [],
    vocs: [],
    directions: [],
    fileOrder: new Map(),
  };
  let objIndex = 0;
  for (const file of SOURCE_FILES) {
    const src = fs.readFileSync(path.join(zilDir, `${file}.zil`), "latin1");
    const order: { kind: string; name: string }[] = [];
    prog.fileOrder.set(file, order);
    for (const node of readZilFile(src, file)) {
      if (node.kind !== "form" || node.items[0]?.kind !== "atom") continue;
      const head = node.items[0].name;
      const it = node.items;
      switch (head) {
        case "ROUTINE": {
          const name = atomName(it[1]);
          prog.routines.set(name, { name, file, ...parseParams(it[2], name), body: it.slice(3), line: node.line });
          order.push({ kind: "routine", name });
          break;
        }
        case "OBJECT":
        case "ROOM": {
          const name = atomName(it[1]);
          const props = it.slice(2).map((p) => {
            if (p.kind !== "list") throw new Error(`${name}: bad property`);
            return p.items;
          });
          prog.objects.set(name, { name, kind: head, file, props, index: objIndex++ });
          order.push({ kind: "object", name });
          break;
        }
        case "GLOBAL": {
          const name = atomName(it[1]);
          prog.globals.set(name, { name, file, init: it[2] ?? null });
          order.push({ kind: "global", name });
          break;
        }
        case "CONSTANT": {
          const name = atomName(it[1]);
          prog.constants.set(name, { name, file, value: it[2] });
          order.push({ kind: "constant", name });
          break;
        }
        case "SYNTAX":
          prog.syntaxes.push({ items: it.slice(1), file, line: node.line });
          break;
        case "VERB-SYNONYM":
          prog.verbSynonyms.push(it.slice(1).map(atomName));
          break;
        case "SYNONYM":
          prog.synonyms.push(it.slice(1).map(atomName));
          break;
        case "PREP-SYNONYM":
          prog.prepSynonyms.push(it.slice(1).map(atomName));
          break;
        case "ADJ-SYNONYM":
          prog.adjSynonyms.push(it.slice(1).map(atomName));
          break;
        case "BUZZ":
          prog.buzz.push(...it.slice(1).map(atomName));
          break;
        case "VOC":
          prog.vocs.push({ word: atomName(it[1]), part: atomName(it[2]) });
          break;
        case "DIRECTIONS":
          prog.directions.push(...it.slice(1).map(atomName));
          break;
        case "TELL-TOKENS":
        case "DEFMAC":
        case "DEFINE":
        case "SETG":
        case "ZSTART":
          break; // compile-time only; handled by the translator itself
        default:
          throw new Error(`${file}:${node.line}: unhandled top-level form ${head}`);
      }
    }
  }
  return prog;
}
