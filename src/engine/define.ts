// Declarative object definitions, encoded into property tables exactly as the
// original compiler laid them out (so code that inspects property tables with
// GETPT/PTSIZE/GETB keeps working).
import { newProp, ZObject } from "./object.ts";
import { ltable, Table } from "./table.ts";
import { GlobalRef } from "./runtime.ts";
import { word, Word } from "./vocab.ts";

// Exit kinds, distinguished by property size as in the original.
export const UEXIT = 1; // TO room
export const NEXIT = 2; // "can't go" message
export const FEXIT = 3; // PER routine
export const CEXIT = 4; // TO room IF global [ELSE message]
export const DEXIT = 5; // TO room IF door IS OPEN [ELSE message]

export type Exit =
  | { kind: typeof UEXIT; to: ZObject }
  | { kind: typeof NEXIT; message: string }
  | { kind: typeof FEXIT; fn: Function }
  | { kind: typeof CEXIT; to: ZObject; flag: string; message?: string }
  | { kind: typeof DEXIT; to: ZObject; door: ZObject; message?: string };

/** (DIR TO room) */
export const to = (room: ZObject): Exit => ({ kind: UEXIT, to: room });
/** (DIR "message") */
export const blocked = (message: string): Exit => ({ kind: NEXIT, message });
/** (DIR PER routine) */
export const per = (fn: Function): Exit => ({ kind: FEXIT, fn });
/** (DIR TO room IF global [ELSE message]) */
export const toIf = (room: ZObject, flag: string, message?: string): Exit => ({ kind: CEXIT, to: room, flag, message });
/** (DIR TO room IF door IS OPEN [ELSE message]) */
export const toIfOpen = (room: ZObject, door: ZObject, message?: string): Exit => ({
  kind: DEXIT, to: room, door, message,
});

export interface Pseudo {
  adjective: string | null;
  noun: string | null;
  action: Function;
}

export interface ObjectSpec {
  in?: ZObject;
  desc?: string;
  flags?: number[];
  synonym?: string[];
  adjective?: string[];
  global?: ZObject[];
  things?: Pseudo[];
  exits?: Partial<Record<Direction, Exit>>;
  /** Any other property: property number -> value (routine, string or number). */
  props?: Record<number, any>;
}

export type Direction = "NORTH" | "NE" | "EAST" | "SE" | "SOUTH" | "SW" | "WEST" | "NW" | "UP" | "DOWN" | "IN" | "OUT";

/** Property numbers of the compiler-defined properties. */
export interface PropertyNumbers {
  SYNONYM: number;
  ADJECTIVE: number;
  GLOBAL: number;
  THINGS: number;
  directions: Record<Direction, number>;
}

interface Registered {
  obj: ZObject;
  index: number;
  spec: ObjectSpec;
}

const registered: Registered[] = [];

/** Registers an object's definition; `index` is its position in the original source. */
export function defineObject(obj: ZObject, index: number, spec: ObjectSpec): void {
  registered.push({ obj, index, spec });
}

/** Adjective number of a word (its ADJECTIVE value byte). */
function adjectiveValue(w: Word): number {
  const PS_ADJECTIVE = 32;
  const P1_ADJECTIVE = 2;
  if (!(w.ps & PS_ADJECTIVE)) throw new Error(`"${w.text}" is not an adjective`);
  return (w.ps & 3) === P1_ADJECTIVE ? w.v1 : w.v2;
}

/**
 * Builds every registered object: properties first, then the containment
 * tree in source order. Inserting each object as its parent's first child
 * reproduces the original's initial ordering (reverse of definition order).
 */
export function buildObjects(P: PropertyNumbers): void {
  registered.sort((a, b) => a.index - b.index);
  for (const { obj, spec } of registered) {
    obj.desc = spec.desc ?? "";
    obj.flags = 0;
    for (const f of spec.flags ?? []) obj.flags |= 1 << f;

    // Properties, as their compiled tables.
    if (spec.synonym) {
      const t = newProp(obj, P.SYNONYM, 2 * spec.synonym.length);
      spec.synonym.forEach((s, i) => t.buf.putWord(2 * i, word(s)));
    }
    if (spec.adjective) {
      const t = newProp(obj, P.ADJECTIVE, spec.adjective.length);
      spec.adjective.forEach((s, i) => t.buf.putByte(i, adjectiveValue(word(s))));
    }
    if (spec.global) {
      const t = newProp(obj, P.GLOBAL, spec.global.length);
      spec.global.forEach((g, i) => t.buf.putByte(i, g));
    }
    if (spec.things) {
      const items: any[] = [];
      for (const p of spec.things) {
        items.push(p.noun ? word(p.noun) : 0, p.adjective ? word(p.adjective) : 0, p.action);
      }
      const t = newProp(obj, P.THINGS, 2);
      t.buf.putWord(0, ltable(`${obj.name}.things`, items));
    }
    for (const [dir, exit] of Object.entries(spec.exits ?? {}) as [Direction, Exit][]) {
      const t = newProp(obj, P.directions[dir], exit.kind);
      writeExit(t, exit);
    }
    for (const [num, value] of Object.entries(spec.props ?? {})) {
      const t = newProp(obj, Number(num), 2);
      t.buf.putWord(0, value);
    }
  }
  for (const { obj } of registered) {
    obj.parent = obj.sibling = obj.child = null;
  }
  for (const { obj, spec } of registered) {
    if (!spec.in) continue;
    obj.parent = spec.in;
    obj.sibling = spec.in.child;
    spec.in.child = obj;
  }
}

function writeExit(t: Table, e: Exit): void {
  const b = t.buf;
  switch (e.kind) {
    case UEXIT:
      b.putByte(0, e.to);
      break;
    case NEXIT:
      b.putWord(0, e.message);
      break;
    case FEXIT:
      b.putWord(0, e.fn);
      b.putByte(2, 0);
      break;
    case CEXIT:
      b.putByte(0, e.to);
      b.putByte(1, new GlobalRef(e.flag));
      b.putWord(2, e.message ?? 0);
      break;
    case DEXIT:
      b.putByte(0, e.to);
      b.putByte(1, e.door);
      b.putWord(2, e.message ?? 0);
      b.putByte(4, 0);
      break;
  }
}
