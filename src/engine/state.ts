// Whole-world snapshots. Everything mutable in the game lives in exactly three
// places: the object tree, table buffers (which include all property tables)
// and the globals record G. Capturing those plus the RNG state is enough to
// rewind the game to any turn boundary.
import { allObjects, ZObject } from "./object.ts";
import { allBuffers, Table } from "./table.ts";
import { Word, dictionary } from "./vocab.ts";
import type { Rng } from "./rng.ts";

export interface Snapshot {
  objs: Int32Array; // per object: parent, sibling, child, flags
  descs: string[];
  bufs: { v: any[]; k: Uint8Array }[];
  g: Record<string, any>;
  rng: number[];
}

let globalsRecord: Record<string, any> = {};

export function registerGlobals(g: Record<string, any>): void {
  globalsRecord = g;
}

export function takeSnapshot(rng: Rng): Snapshot {
  const n = allObjects.length;
  const objs = new Int32Array(n * 4);
  const descs: string[] = new Array(n);
  for (let i = 1; i < n; i++) {
    const o = allObjects[i];
    if (!o) continue;
    objs[i * 4] = o.parent?.num ?? 0;
    objs[i * 4 + 1] = o.sibling?.num ?? 0;
    objs[i * 4 + 2] = o.child?.num ?? 0;
    objs[i * 4 + 3] = o.flags;
    descs[i] = o.desc;
  }
  const bufs = allBuffers.map((b) => ({ v: b.vals.slice(), k: b.kinds.slice() }));
  return { objs, descs, bufs, g: { ...globalsRecord }, rng: rng.getState() };
}

export function restoreSnapshot(s: Snapshot, rng: Rng): void {
  const n = allObjects.length;
  const at = (num: number) => (num ? allObjects[num] : null);
  for (let i = 1; i < n; i++) {
    const o = allObjects[i];
    if (!o) continue;
    o.parent = at(s.objs[i * 4]);
    o.sibling = at(s.objs[i * 4 + 1]);
    o.child = at(s.objs[i * 4 + 2]);
    o.flags = s.objs[i * 4 + 3];
    o.desc = s.descs[i];
  }
  if (s.bufs.length !== allBuffers.length) throw new Error("snapshot does not match this build");
  s.bufs.forEach((b, i) => {
    const buf = allBuffers[i];
    for (let j = 0; j < b.v.length; j++) buf.vals[j] = b.v[j];
    buf.kinds.set(b.k);
  });
  for (const k of Object.keys(globalsRecord)) delete globalsRecord[k];
  Object.assign(globalsRecord, s.g);
  rng.setState(s.rng);
}

// ---------------------------------------------------------------------------
// JSON encoding for saved games

const routinesByName = new Map<string, Function>();
const namesByRoutine = new Map<Function, string>();

export function registerRoutines(routines: Record<string, Function>): void {
  for (const [name, fn] of Object.entries(routines)) {
    routinesByName.set(name, fn);
    namesByRoutine.set(fn, name);
  }
}

export function routineName(fn: Function): string | undefined {
  return namesByRoutine.get(fn);
}

let emptyString: object | null = null;
export function registerEmptyString(e: object): void {
  emptyString = e;
}

function encodeValue(v: any): any {
  if (v === null || typeof v !== "object" && typeof v !== "function") return v;
  if (v instanceof ZObject) return { $o: v.num };
  if (v instanceof Word) return { $w: v.key };
  if (v instanceof Table) return { $t: v.buf.id, o: v.off };
  if (v === emptyString) return { $e: 1 };
  if (typeof v === "function") {
    const name = namesByRoutine.get(v);
    if (!name) throw new Error("cannot save an unregistered routine");
    return { $f: name };
  }
  throw new Error(`cannot encode value ${String(v)}`);
}

function decodeValue(v: any): any {
  if (v === null || typeof v !== "object") return v;
  if ("$o" in v) return allObjects[v.$o];
  if ("$w" in v) {
    const w = dictionary.get(v.$w);
    if (!w) throw new Error(`unknown word in save: ${v.$w}`);
    return w;
  }
  if ("$t" in v) return new Table(allBuffers[v.$t], v.o);
  if ("$e" in v) return emptyString;
  if ("$f" in v) {
    const fn = routinesByName.get(v.$f);
    if (!fn) throw new Error(`unknown routine in save: ${v.$f}`);
    return fn;
  }
  throw new Error("bad saved value");
}

export interface EncodedSnapshot {
  objs: number[];
  descs: string[];
  bufs: [any[], number[]][];
  g: Record<string, any>;
  rng: number[];
}

export function encodeSnapshot(s: Snapshot): EncodedSnapshot {
  const g: Record<string, any> = {};
  for (const [k, v] of Object.entries(s.g)) g[k] = encodeValue(v);
  return {
    objs: [...s.objs],
    descs: s.descs,
    bufs: s.bufs.map((b) => [b.v.map(encodeValue), [...b.k]]),
    g,
    rng: s.rng,
  };
}

export function decodeSnapshot(e: EncodedSnapshot): Snapshot {
  const g: Record<string, any> = {};
  for (const [k, v] of Object.entries(e.g)) g[k] = decodeValue(v);
  return {
    objs: Int32Array.from(e.objs),
    descs: e.descs,
    bufs: e.bufs.map(([v, k]) => ({ v: v.map(decodeValue), k: Uint8Array.from(k) })),
    g,
    rng: e.rng,
  };
}
