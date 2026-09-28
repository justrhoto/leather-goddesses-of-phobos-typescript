// Compares the port's dictionary with the dictionary of the original story
// file ($STORY_FILE): the same words, with the same parts of speech.
import fs from "fs";
import { createGame } from "../../src/game/index.ts";
import { dictionary } from "../../src/engine/vocab.ts";
import { dictKey } from "../../src/engine/zchars.ts";
import { ZM } from "./zmachine.ts";

createGame({ write: () => true, read: () => null }, 1);
const zm = new ZM(new Uint8Array(fs.readFileSync(process.env.STORY_FILE!)), 1);
const m = zm.m;
const d = zm.w(8);
const nsep = m[d];
const entryLength = m[d + 1 + nsep];
const count = zm.w(d + 2 + nsep);
const orig = new Map<string, number>();
for (let i = 0, p = d + 4 + nsep; i < count; i++, p += entryLength) {
  // ZILCH used a different alphabet code for "-" (it decodes as ":" with the standard table).
  orig.set(dictKey(zm.zstr(p).s.replace(/:/g, "-")), m[p + 4]);
}
let bad = 0;
for (const [k, ps] of orig) {
  const w = dictionary.get(k);
  if (!w) { console.log("missing in port:", k, ps.toString(2)); bad++; continue; }
  if ((w.ps & 0xfc) !== (ps & 0xfc)) { console.log("ps differs:", w.text, "port", w.ps.toString(2).padStart(8, "0"), "orig", ps.toString(2).padStart(8, "0")); bad++; }
}
for (const [k, w] of dictionary) if (!orig.has(k)) { console.log("extra in port:", w.text, w.ps.toString(2)); bad++; }
console.log("original", orig.size, "port", dictionary.size, "problems", bad);
