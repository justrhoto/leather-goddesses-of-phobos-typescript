// The ZIL primitive operations used by the ported game code.
import { machine } from "./machine.ts";
import { asObj, ZObject } from "./object.ts";
import { Table, TableBuf, sameTable } from "./table.ts";
import { lookupWord, Word, SEPARATORS } from "./vocab.ts";
import { registerEmptyString } from "./state.ts";

export {
  loc, isIn, first, next, move, remove, hasFlag, setFlag, clearFlag,
  getp, putp, getpt, ptsize, nextp,
} from "./object.ts";
export { Table } from "./table.ts";

// ---------------------------------------------------------------------------
// Values

/**
 * ZIL's empty string "". In ZIL every string is a (non-zero) address and so
 * counts as true, unlike JavaScript's "". This truthy stand-in prints nothing.
 */
export const EMPTY: string = Object.freeze(new String("")) as unknown as string;
registerEmptyString(EMPTY as unknown as object);

function norm(v: any): any {
  if (v === false || v === null || v === undefined) return 0;
  if (v === true) return 1;
  if (v instanceof ZObject) return v.num; // objects compare equal to their numbers
  return v;
}

/** EQUAL?: is `a` equal to any of the others? */
export function eq(a: any, ...others: any[]): boolean {
  const x = norm(a);
  for (const o of others) {
    const y = norm(o);
    if (x === y) return true;
    if (x instanceof Table && sameTable(x, y)) return true;
  }
  return false;
}

/** BTST: are all the bits of `mask` set in `value`? */
export function btst(value: number, mask: number): boolean {
  return (value & mask) === mask;
}

/** Integer division, truncating toward zero like the Z-machine. */
export function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

/** APPLY: calls a routine value; applying 0/false does nothing and yields false. */
export function apply(fn: any, ...args: any[]): any {
  if (!fn) return false;
  if (typeof fn !== "function") throw new Error(`APPLY of a non-routine: ${String(fn)}`);
  return fn(...args);
}

export function random(n: number): number {
  return machine().random(n);
}

/** PROB: true `n` percent of the time. */
export function prob(n: number): boolean {
  return !(n < random(100));
}

/** A reference to a global variable, as stored in a conditional exit. */
export class GlobalRef {
  constructor(readonly name: string) {}
}

let globals: Record<string, any> = {};
export function setGlobalsForValue(g: Record<string, any>): void {
  globals = g;
}

/** VALUE: reads the global a GlobalRef names. */
export function value(ref: any): any {
  if (!(ref instanceof GlobalRef)) throw new Error("VALUE of something that is not a global reference");
  return globals[ref.name];
}

// ---------------------------------------------------------------------------
// Tables

/** The first bytes of the original story file's header (release 59, serial 860730). */
const HEADER_BYTES = [
  0x03, 0x00, 0x00, 0x3b, 0x5c, 0x64, 0x5f, 0x5f, 0x41, 0x9f, 0x02, 0x9a, 0x20, 0x87, 0x2c, 0xac,
  0x00, 0x00, 0x38, 0x36, 0x30, 0x37, 0x33, 0x30,
];
const headerBuf = new TableBuf(64, "header");
HEADER_BYTES.forEach((b, i) => headerBuf.putByte(i, b));
/** Table 0: the story header. Flags 2 (word 8) holds the script and fixed-pitch bits. */
export const HEADER = new Table(headerBuf, 0);

function tbl(t: any, op: string): Table {
  if (t instanceof Table) return t;
  if (t === 0) return HEADER;
  throw new Error(`${op} on a non-table: ${String(t)}`);
}

export function get(t: any, i: number): any {
  const x = tbl(t, "GET");
  return x.buf.getWord(x.off + 2 * i);
}

export function put(t: any, i: number, v: any): true {
  const x = tbl(t, "PUT");
  x.buf.putWord(x.off + 2 * i, v);
  return true;
}

/**
 * Bytes of the original story file that the game can read through a stray
 * numeric address. When the parser merges an orphaned command whose new input
 * has no verb, it treats header word 0 (768) as a dictionary entry and reads
 * its "parts of speech" at 772-774; in the original these bytes marked it as an
 * adjective. Any other such read is reported as an error.
 */
const STRAY_MEMORY = new Map<number, number>([[772, 41], [773, 0], [774, 0]]);

export function getb(t: any, i: number): any {
  if (t instanceof Word) return t.getByte(i);
  if (typeof t === "number" && t !== 0) {
    const v = STRAY_MEMORY.get(t + i);
    if (v === undefined) throw new Error(`GETB of unknown memory address ${t + i}`);
    return v;
  }
  const x = tbl(t, "GETB");
  return x.buf.getByte(x.off + i);
}

export function putb(t: any, i: number, v: any): true {
  const x = tbl(t, "PUTB");
  x.buf.putByte(x.off + i, v);
  return true;
}

export function rest(t: any, n = 1): Table {
  const x = tbl(t, "REST");
  return new Table(x.buf, x.off + n);
}

export function back(t: any, n = 1): Table {
  const x = tbl(t, "BACK");
  return new Table(x.buf, x.off - n);
}

export function isFixedPitch(): boolean {
  return (headerBuf.getWord(16) & 2) !== 0;
}

// ---------------------------------------------------------------------------
// Output

export const CR = "\n";

type TellKind = "D" | "A" | "T" | "AR" | "TR" | "N" | "C" | "PD";
class TellToken {
  constructor(readonly kind: TellKind, readonly value: any) {}
}

/** TELL tokens: D = name, A = "a name", T = "the name", AR/TR add ".\n". */
export const D = (x: any) => new TellToken("D", x);
export const A = (x: any) => new TellToken("A", x);
export const T = (x: any) => new TellToken("T", x);
export const AR = (x: any) => new TellToken("AR", x);
export const TR = (x: any) => new TellToken("TR", x);
export const N = (x: any) => new TellToken("N", x);
export const C = (x: any) => new TellToken("C", x);
/** 'OBJ in a TELL: the object's raw short name. */
export const PD = (x: any) => new TellToken("PD", x);

type Printer = (x: any) => unknown;
const tellHooks: Partial<Record<TellKind, Printer>> = {};
export function setTellHooks(h: Partial<Record<TellKind, Printer>>): void {
  Object.assign(tellHooks, h);
}

/**
 * TELL: prints each part in order. Parts are strings, TELL tokens, or
 * zero-argument functions (routine calls, evaluated at their turn).
 */
export function tell(...parts: any[]): true {
  for (const p of parts) {
    if (typeof p === "string" || p instanceof String) print(String(p));
    else if (p instanceof TellToken) {
      switch (p.kind) {
        case "N": printn(p.value); break;
        case "C": printc(p.value); break;
        case "PD": printd(p.value); break;
        default: {
          const hook = tellHooks[p.kind];
          if (!hook) throw new Error(`no TELL handler for ${p.kind}`);
          hook(p.value);
        }
      }
    } else if (typeof p === "function") {
      const v = p();
      if (typeof v === "string" || v instanceof String) print(String(v));
      else throw new Error(`TELL of a non-string value: ${String(v)}`);
    } else {
      throw new Error(`TELL of a non-string value: ${String(p)}`);
    }
  }
  return true;
}

export function print(s: string): true {
  machine().print(String(s));
  return true;
}

export function crlf(): true {
  return print("\n");
}

export function printn(n: number): true {
  return print(String(norm(n)));
}

export function printc(c: number): true {
  return print(String.fromCharCode(c));
}

/** PRINTD: an object's short name. */
export function printd(o: any): true {
  const obj = asObj(o, "PRINTD");
  if (!obj) throw new Error(`PRINTD of a non-object: ${String(o)}`);
  return print(obj.desc);
}

/** PRINTB: a dictionary word, as the original stored it (at most six letters). */
export function printb(w: any): true {
  if (!(w instanceof Word)) throw new Error(`PRINTB of a non-word: ${String(w)}`);
  return print(w.text);
}

/** USL: refresh the status line. */
export function usl(): true {
  machine().emitStatus();
  return true;
}

export function clearScreen(): true {
  machine().clearScreen();
  return true;
}

// ---------------------------------------------------------------------------
// Input

/**
 * READ: waits for a line of input, stores it (lower-cased) in the text
 * buffer from byte 1, and tokenizes it into the parse buffer: byte 1 holds
 * the word count and each 4-byte entry holds the dictionary word (or 0), the
 * word's length and its position in the text buffer.
 */
export function read(inbuf: any, lexv: any): true {
  const text = machine().readLine("line");
  const ib = tbl(inbuf, "READ");
  const lx = tbl(lexv, "READ");
  const maxChars = Math.max(0, ib.buf.getByte(ib.off) - 1);
  let chars = "";
  for (const ch of text.toLowerCase()) {
    if (chars.length >= maxChars) break;
    const code = ch.charCodeAt(0);
    chars += code >= 32 && code < 127 ? ch : " ";
  }
  for (let i = 0; i < chars.length; i++) ib.buf.putByte(ib.off + 1 + i, chars.charCodeAt(i));
  if (1 + chars.length < ib.buf.size - ib.off) ib.buf.putByte(ib.off + 1 + chars.length, 0);

  const maxWords = lx.buf.getByte(lx.off);
  let count = 0;
  let i = 0;
  while (i < chars.length && count < maxWords) {
    const ch = chars[i];
    if (ch === " ") {
      i++;
      continue;
    }
    let j = i + 1;
    if (!SEPARATORS.includes(ch)) {
      while (j < chars.length && chars[j] !== " " && !SEPARATORS.includes(chars[j])) j++;
    }
    const w = chars.slice(i, j);
    const entry = lx.off + 2 + 4 * count;
    lx.buf.putWord(entry, lookupWord(w) ?? 0);
    lx.buf.putByte(entry + 2, w.length);
    lx.buf.putByte(entry + 3, i + 1);
    count++;
    i = j;
  }
  lx.buf.putByte(lx.off + 1, count);
  return true;
}

// ---------------------------------------------------------------------------
// Game control

export function save(): boolean {
  return machine().save();
}

export function restore(): boolean {
  return machine().restore();
}

export function restart(): never {
  return machine().restartGame();
}

export function quit(): never {
  return machine().quit();
}

export function verify(): boolean {
  return true;
}

/** DIROUT/DIRIN (command recording): not supported in the browser. */
export function dirout(_stream: number): true {
  return true;
}
export function dirin(_stream: number): true {
  return true;
}

/**
 * Names a pseudo-object after a dictionary word. The original copied the
 * word's encoded text over the object's short name, so it prints the word as
 * the dictionary stored it (at most six letters).
 */
export function setPseudoName(o: any, w: any): true {
  const obj = asObj(o, "setPseudoName");
  if (!obj || !(w instanceof Word)) throw new Error("setPseudoName needs an object and a word");
  obj.desc = w.text;
  return true;
}
