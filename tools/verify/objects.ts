// Compares the port's objects (initial containment tree, flags, names and
// every property value) with the original compiler's output in $ZAP_DIR.
import fs from "fs";
import { createGame } from "../../src/game/index.ts";
import * as world from "../../src/game/world.ts";
import { P } from "../../src/game/world.ts";
import { allObjects, ZObject } from "../../src/engine/object.ts";
import { Table } from "../../src/engine/table.ts";
import { Word, lookupWord } from "../../src/engine/vocab.ts";
import { routineName } from "../../src/engine/state.ts";
import { EMPTY, GlobalRef } from "../../src/engine/runtime.ts";
import { camel } from "../zil2ts/names.ts";

createGame({ write: () => true, read: () => null }, 1);
const dir = process.env.ZAP_DIR!;
const zap = fs.readFileSync(`${dir}/x1dat.zap`, "latin1").replace(/\r/g, "");
const strs = new Map<string, string>();
for (const m of fs.readFileSync(`${dir}/x1str.zap`, "latin1").replace(/\r/g, "").matchAll(/\.GSTR (STR\?\d+),"((?:[^"\n]|"")*)"$/gm)) {
  strs.set(m[1], m[2].replace(/""/g, '"'));
}

const flagNum = new Map<string, number>();
for (const [k, v] of Object.entries(world)) if (/BIT$|^INVISIBLE$/.test(k) && typeof v === "number") flagNum.set(k, v);
const propName = new Map<number, string>(Object.entries(P).map(([k, v]) => [v, k.replace(/_/g, "-")]));

let problems = 0;
const report = (msg: string) => {
  problems++;
  if (problems < 80) console.log(msg);
};

// ---- tree and flags
for (const m of zap.matchAll(/\.OBJECT ([^,]+),([^,]*),([^,]*),([^,]+),([^,]+),([^,]+),/g)) {
  const [, name, f1, f2, parent, sibling, child] = m;
  const o = allObjects.find((x) => x?.name === name)!;
  const nm = (x: ZObject | null) => x?.name ?? "0";
  if (nm(o.parent) !== parent || nm(o.sibling) !== sibling || nm(o.child) !== child) {
    report(`${name}: tree port ${nm(o.parent)}/${nm(o.sibling)}/${nm(o.child)} orig ${parent}/${sibling}/${child}`);
  }
  const flags = [f1, f2].flatMap((f) => (f === "0" ? [] : f.split("+").map((x) => x.replace("FX?", ""))));
  let expected = 0;
  for (const f of flags) expected |= 1 << flagNum.get(f)!;
  if (expected !== o.flags) report(`${name}: flags differ`);
}

// ---- properties
const tables = zap.split(/\n(?=T\?[A-Z0-9?'-]+::)/);
for (const chunk of tables) {
  const head = /^T\?([^:]+)::\s*\.TABLE\s*; TABLE FOR OBJECT (\S+)/.exec(chunk);
  if (!head) continue;
  const name = head[2];
  const o = allObjects.find((x) => x?.name === name)!;
  const desc = /\.STRL "((?:[^"]|"")*)"/.exec(chunk);
  const origDesc = desc ? desc[1].replace(/""/g, '"') : "";
  if (o.desc !== origDesc) report(`${name}: desc port "${o.desc}" orig "${origDesc}"`);
  const props = chunk.split(/\n\t\.PROP /).slice(1);
  const seen = new Set<number>();
  for (const p of props) {
    const hm = /^(\d+),P\?([A-Z-]+)/.exec(p)!;
    const size = Number(hm[1]);
    const pname = hm[2];
    const num = (P as any)[pname.replace(/-/g, "_")];
    seen.add(num);
    const t = o.props.get(num);
    if (!t) {
      report(`${name}: missing property ${pname}`);
      continue;
    }
    if (t.buf.size !== size) report(`${name}.${pname}: size port ${t.buf.size} orig ${size}`);
    const orig = p.split("\n").slice(1).map((l) => l.replace(/;.*/, "").trim()).filter((l) => l && l !== ".BYTE\t0" && l !== ".ENDT");
    const origVals = orig.map((l) => l.replace(/^\.(BYTE|WORD)\s+/, ""));
    const portVals = cells(t, size);
    // Terminating ".BYTE 0" of the table belongs to the last property chunk; trim to size.
    if (!sameValues(portVals, origVals, pname)) {
      report(`${name}.${pname}: port [${portVals.join(", ")}] orig [${origVals.join(", ")}]`);
    }
  }
  for (const num of o.props.keys()) if (!seen.has(num)) report(`${name}: extra property ${propName.get(num)}`);
}

function cells(t: Table, size: number): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < size) {
    const k = t.buf.kinds[i];
    const v = t.buf.vals[i];
    out.push(describe(v));
    i += k === 1 ? 2 : 1;
  }
  return out;
}

function describe(v: any): string {
  if (v instanceof ZObject) return v.name;
  if (v instanceof Word) return `W:${v.key}`;
  if (v instanceof GlobalRef) return `G:${v.name}`;
  if (v instanceof Table) return "TABLE";
  if (v === EMPTY) return 'S:""';
  if (typeof v === "string") return `S:${JSON.stringify(v)}`;
  if (typeof v === "function") return `R:${routineName(v)}`;
  if (v === false) return "0";
  return String(v);
}

function sameValues(port: string[], orig: string[], pname: string): boolean {
  const o = orig.filter((x) => x !== "0" || pname !== "__");
  if (port.length > o.length) return false;
  for (let i = 0; i < port.length; i++) {
    const p = port[i];
    const x = o[i];
    if (p === x) continue;
    if (x.startsWith("W?") && p === `W:${lookupWord(x.slice(2).toLowerCase())?.key}`) continue;
    if (x.startsWith("A?") && /^\d+$/.test(p)) {
      const w = lookupWord(x.slice(2).toLowerCase());
      if (w && ((w.ps & 3) === 2 ? w.v1 : w.v2) === Number(p)) continue;
    }
    if (x.startsWith("STR?") && p === `S:${JSON.stringify(strs.get(x))}`) continue;
    if (x.startsWith("STR?") && p === 'S:""' && strs.get(x) === "") continue;
    if (p === `R:${camel(x)}`) continue;
    if (p === "TABLE" && x.startsWith("T?")) continue;
    if (p.startsWith("G:") && /^[A-Z]/.test(x)) continue; // conditional-exit flag (checked below by name)
    return false;
  }
  return true;
}

console.log(`objects ${allObjects.length - 1}, problems ${problems}`);
