// Compares the port's verb syntax tables with the original compiler's output
// (x1dat.zap from the historical source repository, in $ZAP_DIR).
import fs from "fs";
import { createGame } from "../../src/game/index.ts";
import { ACT, PR, V } from "../../src/game/world.ts";
import * as world from "../../src/game/world.ts";
import { VERBS } from "../../src/game/syntax.ts";
import { get, getb } from "../../src/engine/runtime.ts";

createGame({ write: () => true, read: () => null }, 1);
const zap = fs.readFileSync(`${process.env.ZAP_DIR}/x1dat.zap`, "latin1").replace(/\r/g, "");

const prName = new Map(Object.entries(PR).map(([k, v]) => [v, k.replace(/_/g, "-")]));
const vName = new Map(Object.entries(V).map(([k, v]) => [v, k.replace(/_/g, "-")]));
const flagName = new Map<number, string>();
for (const [k, v] of Object.entries(world)) if (/BIT$|^INVISIBLE$/.test(k) && typeof v === "number") flagName.set(v, k);
const LOC: [number, string][] = [[128, "SH"], [64, "SC"], [32, "SIR"], [16, "SOG"], [8, "STAKE"], [4, "SMANY"], [2, "SHAVE"]];
const locSet = (n: number) => LOC.filter(([b]) => n & b).map(([, s]) => s).sort().join("+") || "0";

function portEntries(verb: string): string[] {
  const act = (ACT as Record<string, number>)[verb.replace(/-/g, "_")];
  const t = get(VERBS, 255 - act);
  const n = getb(t, 0);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const b = (k: number) => getb(t, 1 + 8 * i + k);
    out.push([
      b(0), prName.get(b(1)) ?? "0", prName.get(b(2)) ?? "0", flagName.get(b(3)) ?? "0", flagName.get(b(4)) ?? "0",
      locSet(b(5)), locSet(b(6)), vName.get(b(7)),
    ].join(" "));
  }
  return out;
}

function zapEntries(verb: string): string[] | null {
  const start = zap.indexOf(`\nST?${verb}::`);
  if (start < 0) return null;
  const lines = zap.slice(start + 1).split("\n");
  const vals: string[] = [];
  for (const l of lines.slice(1)) {
    if (l.includes(".ENDT")) break;
    const m = /\.BYTE\s+([^;\s]+)/.exec(l);
    if (m) vals.push(m[1]);
  }
  const n = Number(vals[0]);
  const out: string[] = [];
  const sym = (s: string, prefix: string) => (s === "0" ? "0" : s.replace(prefix, ""));
  const loc = (s: string) => (s === "0" ? "0" : s.split("+").sort().join("+"));
  for (let i = 0; i < n; i++) {
    const b = vals.slice(1 + 8 * i, 9 + 8 * i);
    out.push([b[0], sym(b[1], "PR?"), sym(b[2], "PR?"), b[3], b[4], loc(b[5]), loc(b[6]), sym(b[7], "V?")].join(" "));
  }
  return out;
}

let problems = 0;
let checked = 0;
for (const verb of Object.keys(ACT)) {
  const name = verb.replace(/_/g, "-");
  const z = zapEntries(name) ?? zapEntries(name.replace(/^DOLLAR-/, "$"));
  if (!z) {
    console.log("no original table for", name);
    problems++;
    continue;
  }
  const p = portEntries(verb);
  checked++;
  if (JSON.stringify(p) !== JSON.stringify(z)) {
    problems++;
    console.log(`${name}:\n  port: ${p.join(" | ")}\n  orig: ${z.join(" | ")}`);
  }
}
console.log(`verbs checked ${checked}, problems ${problems}`);
