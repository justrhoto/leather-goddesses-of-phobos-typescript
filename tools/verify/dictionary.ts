// Compares the port's dictionary with the original story file's dictionary.
import fs from "fs";
import { createGame } from "../../src/game/index.ts";
import { dictionary } from "../../src/engine/vocab.ts";
import { dictKey } from "../../src/engine/zchars.ts";
createGame({ write: () => true, read: () => null }, 1);
const lines = fs.readFileSync(process.env.REF_DIR + "/dict.txt", "utf8").trim().split("\n").slice(1);
const orig = new Map<string, number>();
for (const l of lines) {
  const m = /^\S+ (".*") ([01]{8}) (\d+) (\d+)$/.exec(l)!;
  // ZILCH used a different alphabet code for "-" (it decodes as ":" with the standard table).
  orig.set(dictKey(JSON.parse(m[1]).replace(/:/g, "-")), parseInt(m[2], 2));
}
let bad = 0;
for (const [k, ps] of orig) {
  const w = dictionary.get(k);
  if (!w) { console.log("missing in port:", k, ps.toString(2)); bad++; continue; }
  if ((w.ps & 0xfc) !== (ps & 0xfc)) { console.log("ps differs:", w.text, "port", w.ps.toString(2).padStart(8, "0"), "orig", ps.toString(2).padStart(8, "0")); bad++; }
}
for (const [k, w] of dictionary) if (!orig.has(k)) { console.log("extra in port:", w.text, w.ps.toString(2)); bad++; }
console.log("original", orig.size, "port", dictionary.size, "problems", bad);
