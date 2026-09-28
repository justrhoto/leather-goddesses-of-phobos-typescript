// Verification oracle only (not part of the port): a minimal version-3
// Z-machine that runs the ORIGINAL story file with the port's random number
// generator, so transcripts from the original and the port can be diffed.
// It implements just what Leather Goddesses uses; SAVE and RESTORE fail and
// the status line is not drawn.
import { Rng } from "../../src/engine/rng.ts";

class NeedInput extends Error {}
class Quit extends Error {}

export class ZM {
  m: Uint8Array;
  orig: Uint8Array;
  pc = 0;
  stack: number[] = [];
  frames: { ret: number; locals: number[]; sp: number; store: number }[] = [];
  locals: number[] = [];
  out = "";
  inputs: string[] = [];
  rng: Rng;
  ended = false;

  constructor(story: Uint8Array, seed: number) {
    this.orig = story;
    this.m = story.slice();
    this.rng = new Rng(seed);
    this.pc = this.w(6);
  }
  w(a: number) { return (this.m[a] << 8) | this.m[a + 1]; }
  sw(a: number, v: number) { this.m[a] = (v >> 8) & 255; this.m[a + 1] = v & 255; }
  s16(v: number) { return (v << 16) >> 16; }

  readVar(v: number): number {
    if (v === 0) return this.stack.pop()!;
    if (v < 16) return this.locals[v - 1];
    return this.w(this.w(0xc) + 2 * (v - 16));
  }
  writeVar(v: number, x: number) {
    x &= 0xffff;
    if (v === 0) this.stack.push(x);
    else if (v < 16) this.locals[v - 1] = x;
    else this.sw(this.w(0xc) + 2 * (v - 16), x);
  }
  peekVar(v: number) { return v === 0 ? this.stack[this.stack.length - 1] : this.readVar(v); }
  setVarInPlace(v: number, x: number) { if (v === 0) this.stack[this.stack.length - 1] = x & 0xffff; else this.writeVar(v, x); }

  // text
  A2 = " \n0123456789.,!?_#'\"/\\-:()";
  zstr(a: number): { s: string; end: number } {
    let out = "", alpha = 0; const zs: number[] = [];
    for (;;) { const x = this.w(a); a += 2; zs.push((x >> 10) & 31, (x >> 5) & 31, x & 31); if (x & 0x8000) break; }
    for (let i = 0; i < zs.length; i++) {
      const c = zs[i];
      if (alpha === 2 && c === 6) { const code = (zs[i + 1] << 5) | zs[i + 2]; i += 2; out += String.fromCharCode(code); alpha = 0; continue; }
      if (c === 0) { out += " "; alpha = 0; continue; }
      if (c >= 1 && c <= 3) { const idx = 32 * (c - 1) + zs[++i]; out += this.zstr(this.w(this.w(0x18) + 2 * idx) * 2).s; alpha = 0; continue; }
      if (c === 4) { alpha = 1; continue; } if (c === 5) { alpha = 2; continue; }
      out += (alpha === 0 ? "abcdefghijklmnopqrstuvwxyz" : alpha === 1 ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : this.A2)[c - 6]; alpha = 0;
    }
    return { s: out, end: a };
  }

  // objects (v3)
  oa(o: number) { return this.w(0xa) + 62 + 9 * (o - 1); }
  parent(o: number) { return this.m[this.oa(o) + 4]; }
  sibling(o: number) { return this.m[this.oa(o) + 5]; }
  child(o: number) { return this.m[this.oa(o) + 6]; }
  unlink(o: number) {
    const p = this.parent(o); if (!p) return;
    const oa = this.oa(o);
    if (this.child(p) === o) this.m[this.oa(p) + 6] = this.sibling(o);
    else { let c = this.child(p); while (this.sibling(c) !== o) c = this.sibling(c); this.m[this.oa(c) + 5] = this.sibling(o); }
    this.m[oa + 4] = 0; this.m[oa + 5] = 0;
  }
  propTable(o: number) { return this.w(this.oa(o) + 7); }
  propAddr(o: number, p: number): number {
    let a = this.propTable(o); a += 1 + 2 * this.m[a];
    while (this.m[a]) { const num = this.m[a] & 31, sz = (this.m[a] >> 5) + 1; if (num === p) return a + 1; a += 1 + sz; }
    return 0;
  }

  // decoding
  fetchOps(types: number[]): number[] {
    const ops: number[] = [];
    for (const t of types) {
      if (t === 0) { ops.push(this.w(this.pc)); this.pc += 2; }
      else if (t === 1) ops.push(this.m[this.pc++]);
      else if (t === 2) ops.push(this.readVar(this.m[this.pc++]));
    }
    return ops;
  }
  branch(cond: boolean) {
    const b = this.m[this.pc++]; let off: number;
    if (b & 0x40) off = b & 63; else { off = ((b & 63) << 8) | this.m[this.pc++]; if (off & 0x2000) off -= 0x4000; }
    if (!!(b & 0x80) === cond) {
      if (off === 0) this.ret(0); else if (off === 1) this.ret(1); else this.pc += off - 2;
    }
  }
  store(v: number) { this.writeVar(this.m[this.pc++], v); }
  call(addr: number, args: number[], storeVar: number) {
    if (addr === 0) { if (storeVar >= 0) this.writeVar(storeVar, 0); return; }
    let a = addr * 2; const n = this.m[a++]; const locals: number[] = [];
    for (let i = 0; i < n; i++) { locals.push(this.w(a)); a += 2; }
    for (let i = 0; i < args.length && i < n; i++) locals[i] = args[i];
    this.frames.push({ ret: this.pc, locals: this.locals, sp: this.stack.length, store: storeVar });
    this.locals = locals; this.pc = a;
  }
  ret(v: number) {
    const f = this.frames.pop()!;
    this.stack.length = f.sp; this.locals = f.locals; this.pc = f.ret;
    if (f.store >= 0) this.writeVar(f.store, v);
  }

  print(s: string) { this.out += s; }

  sread(tb: number, pb: number) {
    if (!this.inputs.length) throw new NeedInput();
    const raw = this.inputs.shift()!;
    this.out += raw + "\n";
    const max = this.m[tb] - 1;
    let s = "";
    for (const ch of raw.toLowerCase()) { if (s.length >= max) break; const c = ch.charCodeAt(0); s += c >= 32 && c < 127 ? ch : " "; }
    for (let i = 0; i < s.length; i++) this.m[tb + 1 + i] = s.charCodeAt(i);
    this.m[tb + 1 + s.length] = 0;
    // tokenize
    const d = this.w(8); const nsep = this.m[d]; const seps = Array.from(this.m.slice(d + 1, d + 1 + nsep)).map((c) => String.fromCharCode(c));
    const el = this.m[d + 1 + nsep]; const cnt = this.w(d + 2 + nsep); const base = d + 4 + nsep;
    const maxw = this.m[pb]; let nw = 0; let i = 0;
    while (i < s.length && nw < maxw) {
      if (s[i] === " ") { i++; continue; }
      let j = i + 1;
      if (!seps.includes(s[i])) while (j < s.length && s[j] !== " " && !seps.includes(s[j])) j++;
      const word = s.slice(i, j);
      const enc = this.encode(word);
      let found = 0;
      for (let k = 0; k < cnt; k++) { const e = base + k * el; if (this.w(e) === enc[0] && this.w(e + 2) === enc[1]) { found = e; break; } }
      const ent = pb + 2 + 4 * nw;
      this.sw(ent, found); this.m[ent + 2] = word.length; this.m[ent + 3] = i + 1;
      nw++; i = j;
    }
    this.m[pb + 1] = nw;
  }
  encode(word: string): [number, number] {
    const z: number[] = [];
    for (const ch of word) {
      if (ch >= "a" && ch <= "z") z.push(ch.charCodeAt(0) - 97 + 6);
      else { const k = this.A2.indexOf(ch); if (k >= 2) z.push(5, k + 6); else { const c = ch.charCodeAt(0); z.push(5, 6, c >> 5, c & 31); } }
      if (z.length >= 6) break;
    }
    while (z.length < 6) z.push(5);
    return [(z[0] << 10) | (z[1] << 5) | z[2], 0x8000 | (z[3] << 10) | (z[4] << 5) | z[5]];
  }

  /** Runs until input is needed. Returns the new output. */
  run(): string {
    this.out = "";
    try { for (;;) this.step(); } catch (e) {
      if (e instanceof NeedInput) { this.pc = this.instrStart; return this.out; }
      if (e instanceof Quit) { this.ended = true; return this.out; }
      throw e;
    }
  }

  instrStart = 0;
  step() {
    this.instrStart = this.pc;
    const op = this.m[this.pc++];
    let form: string, num: number, types: number[] = [];
    if (op >= 0xc0) { form = op & 0x20 ? "VAR" : "2OP"; num = op & 0x1f; const tb = this.m[this.pc++]; for (let s = 6; s >= 0; s -= 2) { const t = (tb >> s) & 3; if (t === 3) break; types.push(t); } }
    else if (op >= 0x80) { num = op & 0x0f; const t = (op >> 4) & 3; if (t === 3) form = "0OP"; else { form = "1OP"; types = [t]; } }
    else { form = "2OP"; num = op & 0x1f; types = [op & 0x40 ? 2 : 1, op & 0x20 ? 2 : 1]; }
    const o = this.fetchOps(types);
    const s = (x: number) => this.s16(x);
    if (form === "2OP") {
      switch (num) {
        case 1: return this.branch(o.slice(1).some((x) => x === o[0]));
        case 2: return this.branch(s(o[0]) < s(o[1]));
        case 3: return this.branch(s(o[0]) > s(o[1]));
        case 4: { const v = s(this.peekVar(o[0])) - 1; this.setVarInPlace(o[0], v); return this.branch(s(v & 0xffff) < s(o[1])); }
        case 5: { const v = s(this.peekVar(o[0])) + 1; this.setVarInPlace(o[0], v); return this.branch(s(v & 0xffff) > s(o[1])); }
        case 6: return this.branch(this.parent(o[0]) === o[1]);
        case 7: return this.branch((o[0] & o[1]) === o[1]);
        case 8: return this.store(o[0] | o[1]);
        case 9: return this.store(o[0] & o[1]);
        case 10: return this.branch(!!(this.m[this.oa(o[0]) + (o[1] >> 3)] & (0x80 >> (o[1] & 7))));
        case 11: this.m[this.oa(o[0]) + (o[1] >> 3)] |= 0x80 >> (o[1] & 7); return;
        case 12: this.m[this.oa(o[0]) + (o[1] >> 3)] &= ~(0x80 >> (o[1] & 7)); return;
        case 13: return this.setVarInPlace(o[0], o[1]);
        case 14: { this.unlink(o[0]); const oa = this.oa(o[0]); this.m[oa + 4] = o[1]; this.m[oa + 5] = this.child(o[1]); this.m[this.oa(o[1]) + 6] = o[0]; return; }
        case 15: return this.store(this.w((o[0] + 2 * s(o[1])) & 0xffff));
        case 16: return this.store(this.m[(o[0] + s(o[1])) & 0xffff]);
        case 17: { const a = this.propAddr(o[0], o[1]); if (!a) return this.store(this.w(this.w(0xa) + 2 * (o[1] - 1))); const sz = (this.m[a - 1] >> 5) + 1; return this.store(sz === 1 ? this.m[a] : this.w(a)); }
        case 18: return this.store(this.propAddr(o[0], o[1]));
        case 19: { let a: number; if (o[1] === 0) { a = this.propTable(o[0]); a += 1 + 2 * this.m[a]; } else { a = this.propAddr(o[0], o[1]); a += (this.m[a - 1] >> 5) + 1; } return this.store(this.m[a] & 31); }
        case 20: return this.store(s(o[0]) + s(o[1]));
        case 21: return this.store(s(o[0]) - s(o[1]));
        case 22: return this.store(Math.imul(s(o[0]), s(o[1])));
        case 23: return this.store(Math.trunc(s(o[0]) / s(o[1])));
        case 24: return this.store(s(o[0]) % s(o[1]));
      }
    } else if (form === "1OP") {
      const a = o[0];
      switch (num) {
        case 0: return this.branch(a === 0);
        case 1: { const x = this.sibling(a); this.store(x); return this.branch(x !== 0); }
        case 2: { const x = this.child(a); this.store(x); return this.branch(x !== 0); }
        case 3: return this.store(this.parent(a));
        case 4: return this.store(a === 0 ? 0 : (this.m[a - 1] >> 5) + 1);
        case 5: { const v = this.peekVar(a); return this.setVarInPlace(a, s(v) + 1); }
        case 6: { const v = this.peekVar(a); return this.setVarInPlace(a, s(v) - 1); }
        case 7: return this.print(this.zstr(a).s);
        case 9: return this.unlink(a);
        case 10: { const t = this.propTable(a); return this.print(this.m[t] ? this.zstr(t + 1).s : ""); }
        case 11: return this.ret(a);
        case 12: this.pc += s(a) - 2; return;
        case 13: return this.print(this.zstr(a * 2).s);
        case 14: return this.store(this.peekVar(a));
        case 15: return this.store(~a);
      }
    } else if (form === "0OP") {
      switch (num) {
        case 0: return this.ret(1);
        case 1: return this.ret(0);
        case 2: { const r = this.zstr(this.pc); this.pc = r.end; return this.print(r.s); }
        case 3: { const r = this.zstr(this.pc); this.pc = r.end; this.print(r.s + "\n"); return this.ret(1); }
        case 4: return;
        case 5: return this.branch(false);
        case 6: return this.branch(false);
        case 7: { this.m = this.orig.slice(); this.stack = []; this.frames = []; this.locals = []; this.pc = this.w(6); return; }
        case 8: return this.ret(this.stack.pop()!);
        case 9: this.stack.pop(); return;
        case 10: throw new Quit();
        case 11: return this.print("\n");
        case 12: return;
        case 13: return this.branch(true);
      }
    } else {
      switch (num) {
        case 0: { const st = this.m[this.pc++]; return this.call(o[0], o.slice(1), st); }
        case 1: this.sw((o[0] + 2 * s(o[1])) & 0xffff, o[2]); return;
        case 2: this.m[(o[0] + s(o[1])) & 0xffff] = o[2] & 255; return;
        case 3: { const a = this.propAddr(o[0], o[1]); const sz = (this.m[a - 1] >> 5) + 1; if (sz === 1) this.m[a] = o[2] & 255; else this.sw(a, o[2]); return; }
        case 4: { const save = { pc: this.pc - 1 - 1 - 2 * types.length }; void save; return this.sread(o[0], o[1]); }
        case 5: return this.print(String.fromCharCode(o[0]));
        case 6: return this.print(String(s(o[0])));
        case 7: { const n = s(o[0]); if (n > 0) return this.store(this.rng.range(n)); this.rng.seed(-n); return this.store(0); }
        case 8: this.stack.push(o[0]); return;
        case 9: { const v = this.stack.pop()!; return this.setVarInPlace(o[0], v); }
        case 10: case 11: case 19: case 20: case 21: return;
      }
    }
    throw new Error(`unimplemented ${form} ${num} at ${(this.pc).toString(16)}`);
  }
}
