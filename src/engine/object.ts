// The object tree: rooms, things and characters, with ZIL's parent/sibling/child
// links, 31 attribute flags and numbered property tables.
import { Table, TableBuf } from "./table.ts";

export class ZObject {
  parent: ZObject | null = null;
  sibling: ZObject | null = null;
  child: ZObject | null = null;
  flags = 0;
  /** The printed short name (DESC). */
  desc = "";
  /** Property number -> property table. */
  readonly props = new Map<number, Table>();

  constructor(readonly name: string, readonly num: number) {}

  toString(): string {
    return `#${this.num} ${this.name}`;
  }
}

/** All objects, indexed by object number (index 0 unused). */
export const allObjects: ZObject[] = [];

export function createObject(name: string, num: number): ZObject {
  const o = new ZObject(name, num);
  allObjects[num] = o;
  return o;
}

export function objectByName(name: string): ZObject {
  const o = allObjects.find((x) => x?.name === name);
  if (!o) throw new Error(`no object ${name}`);
  return o;
}

// ---------------------------------------------------------------------------
// Tree operations

/** Objects may also be referred to by number, as on the Z-machine. */
export function asObj(o: any, op: string): ZObject | null {
  if (o === false || o === 0 || o === null || o === undefined) return null;
  if (o instanceof ZObject) return o;
  if (typeof o === "number" && allObjects[o]) return allObjects[o];
  throw new Error(`${op}: not an object: ${String(o)}`);
}

export function loc(o: any): ZObject | false {
  return asObj(o, "LOC")?.parent ?? false;
}

export function isIn(o: any, p: any): boolean {
  const obj = asObj(o, "IN?");
  if (!obj) return false;
  const parent = asObj(p, "IN?");
  return obj.parent === parent; // like the Z-machine, IN? x 0 is true for an orphan
}

export function first(o: any): ZObject | false {
  return asObj(o, "FIRST?")?.child ?? false;
}

export function next(o: any): ZObject | false {
  return asObj(o, "NEXT?")?.sibling ?? false;
}

export function remove(o: any): true {
  const obj = asObj(o, "REMOVE");
  if (!obj || !obj.parent) return true;
  const p = obj.parent;
  if (p.child === obj) p.child = obj.sibling;
  else {
    let c = p.child;
    while (c && c.sibling !== obj) c = c.sibling;
    if (c) c.sibling = obj.sibling;
  }
  obj.parent = null;
  obj.sibling = null;
  return true;
}

/** MOVE: makes `o` the first child of `dest`. */
export function move(o: any, dest: any): true {
  const obj = asObj(o, "MOVE");
  const d = asObj(dest, "MOVE");
  if (!obj) throw new Error("MOVE of nothing");
  remove(obj);
  if (!d) return true;
  obj.parent = d;
  obj.sibling = d.child;
  d.child = obj;
  return true;
}

// ---------------------------------------------------------------------------
// Flags

export function hasFlag(o: any, flag: number): boolean {
  const obj = asObj(o, "FSET?");
  if (!obj) return false;
  return (obj.flags & (1 << flag)) !== 0;
}

export function setFlag(o: any, flag: number): true {
  const obj = asObj(o, "FSET");
  if (obj) obj.flags |= 1 << flag;
  return true;
}

export function clearFlag(o: any, flag: number): true {
  const obj = asObj(o, "FCLEAR");
  if (obj) obj.flags &= ~(1 << flag);
  return true;
}

// ---------------------------------------------------------------------------
// Properties

/** Default property values (PROPDEF); anything else defaults to 0. */
export const propDefaults = new Map<number, any>();

export function getpt(o: any, prop: number): Table | false {
  const obj = asObj(o, "GETPT");
  return obj?.props.get(prop) ?? false;
}

export function getp(o: any, prop: number): any {
  const obj = asObj(o, "GETP");
  const t = obj?.props.get(prop);
  if (!t) return propDefaults.get(prop) ?? 0;
  return t.buf.size === 1 ? t.buf.getByte(0) : t.buf.getWord(0);
}

export function putp(o: any, prop: number, value: any): true {
  const obj = asObj(o, "PUTP");
  const t = obj?.props.get(prop);
  if (!t) throw new Error(`PUTP: ${obj} has no property ${prop}`);
  if (t.buf.size === 1) t.buf.putByte(0, value);
  else t.buf.putWord(0, value);
  return true;
}

export function ptsize(t: any): number {
  if (!(t instanceof Table)) return 0;
  return t.buf.size - t.off;
}

/** NEXTP: property numbers are visited from highest to lowest; 0 starts. */
export function nextp(o: any, prop: number): number {
  const obj = asObj(o, "NEXTP");
  if (!obj) return 0;
  const nums = [...obj.props.keys()].sort((a, b) => b - a);
  if (prop === 0) return nums[0] ?? 0;
  const i = nums.indexOf(prop);
  return i >= 0 && i + 1 < nums.length ? nums[i + 1] : 0;
}

/** Creates (or replaces) a property table of the given byte size. */
export function newProp(o: ZObject, prop: number, size: number): Table {
  const t = new Table(new TableBuf(size, `${o.name}.p${prop}`), 0);
  o.props.set(prop, t);
  return t;
}
