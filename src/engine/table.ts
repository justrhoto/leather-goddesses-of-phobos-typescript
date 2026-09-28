// ZIL tables.
//
// ZIL code addresses tables by word index (GET/PUT) and by byte offset
// (GETB/PUTB), takes pointers into the middle of them (REST/BACK), and
// compares those pointers. The original stored raw numbers in Z-machine
// memory; here each byte cell can hold any TypeScript value (an object, a
// dictionary word, a string, a routine...) so that the original algorithms
// run unchanged while the data stays symbolic.

const BYTE = 0;
const WORD_HI = 1; // first byte of a word value
const WORD_LO = 2; // second byte of a word value

/** Every table buffer ever created, so that snapshots can capture them all. */
export const allBuffers: TableBuf[] = [];

export class TableBuf {
  readonly vals: any[];
  readonly kinds: Uint8Array;
  readonly id: number;

  constructor(readonly size: number, readonly label = "") {
    this.vals = new Array(size).fill(0);
    this.kinds = new Uint8Array(size);
    this.id = allBuffers.length;
    allBuffers.push(this);
  }

  getWord(off: number): any {
    this.check(off, 2);
    const k = this.kinds[off];
    if (k === WORD_HI) return this.vals[off];
    const hi = this.byteValue(off);
    const lo = this.byteValue(off + 1);
    return ((hi << 8) | lo) << 16 >> 16;
  }

  putWord(off: number, v: any): void {
    this.check(off, 2);
    this.vals[off] = v;
    this.kinds[off] = WORD_HI;
    this.vals[off + 1] = 0;
    this.kinds[off + 1] = WORD_LO;
  }

  getByte(off: number): any {
    this.check(off, 1);
    return this.byteValue(off);
  }

  putByte(off: number, v: any): void {
    this.check(off, 1);
    const k = this.kinds[off];
    if (k === WORD_HI || k === WORD_LO) this.splitWord(k === WORD_HI ? off : off - 1);
    this.vals[off] = typeof v === "number" ? v & 0xff : v;
    this.kinds[off] = BYTE;
  }

  private byteValue(off: number): any {
    const k = this.kinds[off];
    if (k === BYTE) return this.vals[off];
    const wordOff = k === WORD_HI ? off : off - 1;
    const v = this.vals[wordOff];
    const n = toWordNumber(v);
    return k === WORD_HI ? (n >> 8) & 0xff : n & 0xff;
  }

  /** Converts a stored word into two plain bytes before one of them is overwritten. */
  private splitWord(off: number): void {
    const n = toWordNumber(this.vals[off]);
    this.vals[off] = (n >> 8) & 0xff;
    this.kinds[off] = BYTE;
    this.vals[off + 1] = n & 0xff;
    this.kinds[off + 1] = BYTE;
  }

  private check(off: number, len: number): void {
    if (off < 0 || off + len > this.size) {
      throw new Error(`table access out of range: ${this.label || "#" + this.id} offset ${off} size ${this.size}`);
    }
  }
}

function toWordNumber(v: any): number {
  if (typeof v === "number") return v & 0xffff;
  if (v === false || v === null || v === undefined) return 0;
  if (v === true) return 1;
  throw new Error(`cannot take bytes of a non-numeric table value: ${String(v)}`);
}

/** A pointer into a table buffer (a ZIL table address). */
export class Table {
  constructor(readonly buf: TableBuf, readonly off = 0) {}

  /** Lets relational operators compare pointers into the same table. */
  valueOf(): number {
    return this.off;
  }

  toString(): string {
    return `<table ${this.buf.label || this.buf.id}+${this.off}>`;
  }
}

export function sameTable(a: unknown, b: unknown): boolean {
  return a instanceof Table && b instanceof Table && a.buf === b.buf && a.off === b.off;
}

// ---------------------------------------------------------------------------
// Table construction

/** Marks a table element that occupies one byte instead of a word. */
export class ByteItem {
  constructor(readonly value: any) {}
}
export const byte = (value: any): ByteItem => new ByteItem(value);

function layout(items: any[], label: string, prefix?: "word" | "byte" | "lexv", count?: number): Table {
  let size = 0;
  for (const it of items) size += it instanceof ByteItem ? 1 : 2;
  const header = prefix === "word" ? 2 : prefix === "byte" ? 1 : prefix === "lexv" ? 2 : 0;
  const buf = new TableBuf(header + size, label);
  if (prefix === "word") buf.putWord(0, count ?? items.length);
  if (prefix === "byte") buf.putByte(0, count ?? items.length);
  if (prefix === "lexv") {
    buf.putByte(0, count ?? 0);
    buf.putByte(1, 0);
  }
  let off = header;
  for (const it of items) {
    if (it instanceof ByteItem) {
      buf.putByte(off, it.value);
      off += 1;
    } else {
      buf.putWord(off, it);
      off += 2;
    }
  }
  return new Table(buf, 0);
}

/** <TABLE ...> */
export function table(label: string, items: any[]): Table {
  return layout(items, label);
}

/** <LTABLE ...>: a word table whose first word is the element count. */
export function ltable(label: string, items: any[]): Table {
  return layout(items, label, "word", items.length);
}

/**
 * <ITABLE count (flags) pattern...>: `count` repetitions of the pattern.
 * Flags: "NONE" (no prefix), "BYTE" (byte elements), "LENGTH" (length prefix),
 * "LEXV" (parse-buffer header: max-count byte + count byte).
 */
export function itable(label: string, count: number, flags: string[], pattern: any[]): Table {
  const byteElems = flags.includes("BYTE");
  const pat = pattern.length ? pattern : [0];
  const items: any[] = [];
  for (let i = 0; i < count; i++) {
    for (const p of pat) items.push(byteElems && !(p instanceof ByteItem) ? new ByteItem(p) : p);
  }
  if (flags.includes("LEXV")) return layout(items, label, "lexv", count);
  if (flags.includes("LENGTH")) return layout(items, label, byteElems ? "byte" : "word", count);
  return layout(items, label);
}

/** A raw table of `size` zero bytes (used for object property tables). */
export function rawTable(size: number, label: string): Table {
  return new Table(new TableBuf(size, label), 0);
}
