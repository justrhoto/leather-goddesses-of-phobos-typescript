// Whole-world snapshots. Everything mutable in the game lives in exactly three
// places: the object tree, table buffers (which include all property tables)
// and the globals record G. Capturing those plus the RNG state is enough to
// rewind the game to any turn boundary.
import { allObjects, ZObject } from "./object.ts";
import { allBuffers, Table } from "./table.ts";
import { Word, dictionary } from "./vocab.ts";
import type { Rng } from "./rng.ts";
import { GlobalRef } from "./globalref.ts";

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
  if (v instanceof GlobalRef) return { $g: v.name };
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
  if ("$g" in v) return new GlobalRef(v.$g);
  if ("$f" in v) {
    const fn = routinesByName.get(v.$f);
    if (!fn) throw new Error(`unknown routine in save: ${v.$f}`);
    return fn;
  }
  throw new Error("bad saved value");
}

/**
 * A snapshot as JSON. Only table buffers and object names that differ from
 * the freshly built world are stored, which keeps saves small.
 */
export interface EncodedSnapshot {
  objs: number[];
  descs: Record<number, string>;
  bufs: Record<number, [any[], number[]]>;
  g: Record<string, any>;
  rng: number[];
}

let baseline: Snapshot | null = null;

/** Records the freshly built world, which encoded snapshots are relative to. */
export function setBaselineSnapshot(s: Snapshot): void {
  baseline = s;
}

function sameBuffer(a: { v: any[]; k: Uint8Array }, b: { v: any[]; k: Uint8Array }): boolean {
  if (a.v.length !== b.v.length) return false;
  for (let i = 0; i < a.v.length; i++) {
    if (a.k[i] !== b.k[i]) return false;
    const x = a.v[i];
    const y = b.v[i];
    if (x === y) continue;
    if (x instanceof Table && y instanceof Table && x.buf === y.buf && x.off === y.off) continue;
    if (x instanceof GlobalRef && y instanceof GlobalRef && x.name === y.name) continue;
    return false;
  }
  return true;
}

export function encodeSnapshot(s: Snapshot): EncodedSnapshot {
  if (!baseline) throw new Error("no baseline snapshot");
  const g: Record<string, any> = {};
  for (const [k, v] of Object.entries(s.g)) g[k] = encodeValue(v);
  const bufs: EncodedSnapshot["bufs"] = {};
  s.bufs.forEach((b, i) => {
    if (!sameBuffer(b, baseline!.bufs[i])) bufs[i] = [b.v.map(encodeValue), [...b.k]];
  });
  const descs: Record<number, string> = {};
  s.descs.forEach((d, i) => {
    if (d !== baseline!.descs[i]) descs[i] = d;
  });
  return { objs: [...s.objs], descs, bufs, g, rng: s.rng };
}

export function decodeSnapshot(e: EncodedSnapshot): Snapshot {
  if (!baseline) throw new Error("no baseline snapshot");
  const g: Record<string, any> = {};
  for (const [k, v] of Object.entries(e.g)) g[k] = decodeValue(v);
  const descs = baseline.descs.slice();
  for (const [i, d] of Object.entries(e.descs)) descs[Number(i)] = d;
  const bufs = baseline.bufs.map((b, i) => {
    const enc = e.bufs[i];
    return enc ? { v: enc[0].map(decodeValue), k: Uint8Array.from(enc[1]) } : { v: b.v.slice(), k: b.k.slice() };
  });
  return { objs: Int32Array.from(e.objs), descs, bufs, g, rng: e.rng };
}
