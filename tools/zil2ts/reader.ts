// A reader for the MDL/ZIL surface syntax used by the Leather Goddesses of
// Phobos sources. It produces a small tree of nodes that the translator walks.

export type Node =
  | { kind: "form"; items: Node[]; line: number } // <...>
  | { kind: "list"; items: Node[]; line: number } // (...)
  | { kind: "vector"; items: Node[]; line: number } // [...]
  | { kind: "atom"; name: string; line: number }
  | { kind: "string"; value: string; line: number }
  | { kind: "number"; value: number; line: number }
  | { kind: "char"; value: string; line: number } // !\x
  | { kind: "gval"; name: string; line: number } // ,X
  | { kind: "lval"; name: string; line: number } // .X
  | { kind: "quote"; node: Node; line: number } // 'X
  | { kind: "segment"; node: Node; line: number } // !X (macro splice)
  | { kind: "macro"; node: Node; line: number } // %<...>  (compile-time)
  | { kind: "hash"; type: string; node: Node; line: number }; // #TYPE value

const DELIMS = new Set([" ", "\t", "\n", "\r", "\f", "<", ">", "(", ")", "[", "]", '"', ";"]);

export class ZilReader {
  private pos = 0;
  private line = 1;

  constructor(private readonly src: string, private readonly file: string) {}

  readAll(): Node[] {
    const out: Node[] = [];
    for (;;) {
      this.skipWs();
      if (this.pos >= this.src.length) return out;
      const n = this.readNode();
      if (n) out.push(n);
    }
  }

  private error(msg: string): never {
    throw new Error(`${this.file}:${this.line}: ${msg}`);
  }

  private peek(off = 0): string {
    return this.src[this.pos + off] ?? "";
  }

  private next(): string {
    const c = this.src[this.pos++];
    if (c === "\n") this.line++;
    return c;
  }

  private skipWs(): void {
    while (this.pos < this.src.length) {
      const c = this.peek();
      if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\u001a") this.next();
      else break;
    }
  }

  /** Reads one node; comments (;x) are consumed and yield null. */
  private readNode(): Node | null {
    this.skipWs();
    const line = this.line;
    const c = this.peek();
    if (c === "") this.error("unexpected end of input");
    if (c === ";") {
      this.next();
      this.readNonComment(); // the commented-out object
      return null;
    }
    if (c === "<") {
      this.next();
      return { kind: "form", items: this.readSeq(">"), line };
    }
    if (c === "(") {
      this.next();
      return { kind: "list", items: this.readSeq(")"), line };
    }
    if (c === "[") {
      this.next();
      return { kind: "vector", items: this.readSeq("]"), line };
    }
    if (c === '"') return this.readString();
    if (c === ",") {
      this.next();
      const inner = this.readNonComment();
      if (inner.kind !== "atom") return { kind: "form", items: [{ kind: "atom", name: "GVAL", line }, inner], line };
      return { kind: "gval", name: inner.name, line };
    }
    if (c === ".") {
      this.next();
      const inner = this.readNonComment();
      if (inner.kind !== "atom") this.error("bad LVAL");
      return { kind: "lval", name: inner.name, line };
    }
    if (c === "'") {
      this.next();
      return { kind: "quote", node: this.readNonComment(), line };
    }
    if (c === "%") {
      this.next();
      if (this.peek() === "%") this.next();
      return { kind: "macro", node: this.readNonComment(), line };
    }
    if (c === "#") {
      this.next();
      const type = this.readAtomText();
      return { kind: "hash", type, node: this.readNonComment(), line };
    }
    if (c === "!") {
      if (this.peek(1) === "\\") {
        this.next();
        this.next();
        return { kind: "char", value: this.next(), line };
      }
      this.next();
      return { kind: "segment", node: this.readNonComment(), line };
    }
    if (c === ">" || c === ")" || c === "]") this.error(`unexpected '${c}'`);
    const text = this.readAtomText();
    if (/^-?\d+$/.test(text)) return { kind: "number", value: parseInt(text, 10), line };
    const octal = /^\*([0-7]+)\*$/.exec(text);
    if (octal) return { kind: "number", value: parseInt(octal[1], 8), line };
    return { kind: "atom", name: text, line };
  }

  private readNonComment(): Node {
    for (;;) {
      const n = this.readNode();
      if (n) return n;
    }
  }

  private readSeq(close: string): Node[] {
    const items: Node[] = [];
    for (;;) {
      this.skipWs();
      if (this.peek() === close) {
        this.next();
        return items;
      }
      if (this.pos >= this.src.length) this.error(`unterminated sequence, expected '${close}'`);
      const n = this.readNode();
      if (n) items.push(n);
    }
  }

  private readAtomText(): string {
    let text = "";
    while (this.pos < this.src.length) {
      const c = this.peek();
      if (c === "\\") {
        this.next();
        text += this.next();
        continue;
      }
      if (DELIMS.has(c)) break;
      // A comma directly inside an atom run ends it (e.g. "EARS, NOSE").
      if (c === "," && text.length > 0) break;
      text += this.next();
    }
    if (text === "") this.error(`empty atom at '${this.peek()}'`);
    return text;
  }

  private readString(): Node {
    const line = this.line;
    this.next(); // opening quote
    let raw = "";
    for (;;) {
      if (this.pos >= this.src.length) this.error("unterminated string");
      const c = this.next();
      if (c === '"') break;
      if (c === "\\") {
        raw += "\u0000" + this.next(); // mark escaped char so '|' escapes survive
        continue;
      }
      raw += c;
    }
    return { kind: "string", value: raw, line };
  }
}

/**
 * Converts a raw ZIL string literal to the text the game prints, following
 * ZILCH's rules: '|' is a newline, a line break directly after '|' is dropped,
 * and any other line break becomes a single space.
 */
export function zilStringText(raw: string): string {
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === "\u0000") {
      out += raw[++i];
      continue;
    }
    if (c === "|") {
      out += "\n";
      if (raw[i + 1] === "\r") i++;
      if (raw[i + 1] === "\n") i++;
      continue;
    }
    if (c === "\r") continue;
    if (c === "\n") {
      out += " ";
      continue;
    }
    out += c;
  }
  return out;
}

export function readZilFile(src: string, file: string): Node[] {
  return new ZilReader(src, file).readAll();
}
