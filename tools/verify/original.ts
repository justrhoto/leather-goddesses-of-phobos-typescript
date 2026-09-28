// Plays the same commands through the original story file (on the oracle in
// zmachine.ts) and through the port, with the same random seed, and compares
// the transcripts line by line.
//
//   STORY_FILE=path/to/x1.z3 npx tsx tools/verify/original.ts walk [seeds...]
//   STORY_FILE=path/to/x1.z3 npx tsx tools/verify/original.ts fuzz [runs] [seed]
//   STORY_FILE=path/to/x1.z3 npx tsx tools/verify/original.ts file commands.txt [seed]
//
// walk: the complete winning playthrough (seeds 1-5 by default).
// fuzz: a random prefix of the playthrough followed by 40 random commands
//       built from the game's own vocabulary and syntaxes, per run.
// file: one command per line.
import fs from "fs";
import { ZM } from "./zmachine.ts";
import { createGame } from "../../src/game/index.ts";
import { dictionary } from "../../src/engine/vocab.ts";
import { get, getb } from "../../src/engine/runtime.ts";
import { VERBS } from "../../src/game/syntax.ts";
import { ACT, V } from "../../src/game/world.ts";
import { runWalkthrough } from "../../tests/walkthrough-runner.ts";
import { WALKTHROUGH } from "../../tests/walkthrough.ts";

if (!process.env.STORY_FILE) {
  console.error("Set STORY_FILE to the release 59 story file (COMPILED/x1.z3 in historicalsource/leathergoddesses).");
  process.exit(2);
}
const story = new Uint8Array(fs.readFileSync(process.env.STORY_FILE));

export function runOriginal(cmds: string[], seed: number): string {
  const zm = new ZM(story, seed);
  let t = zm.run();
  for (const c of cmds) {
    if (zm.ended) break;
    zm.inputs.push(c);
    t += zm.run();
  }
  return t;
}

export function runPort(cmds: string[], seed: number): string {
  const g = createGame({ write: () => true, read: () => null }, seed);
  const txt = (r: any) => r.events.map((e: any) => (e.type === "text" ? e.text : e.type === "input" ? e.text + "\n" : "")).join("");
  let r = g.start();
  let t = txt(r);
  for (const c of cmds) {
    if (r.ended) break;
    r = g.send(c);
    t += txt(r);
  }
  return t;
}

/**
 * Deliberate differences (see PORTING.md): V-UNCOVER on a character undresses
 * the undefined ,OBJECT in the original, which prints garbage for its name.
 */
const KNOWN = [
  (o: string, p: string) =>
    o.startsWith("A slap across the face alerts you that the  s  already r") &&
    p.startsWith("A slap across the face alerts you that ") &&
    o.endsWith(" isn't that hot to trot. And not a goddam single cold shower in sight!") &&
    p.endsWith(" isn't that hot to trot. And not a goddam single cold shower in sight!"),
];

/**
 * The first differing line, or null. Blank lines are ignored: the original
 * clears the screen by printing them, where the port emits a clear event.
 */
export function firstDiff(orig: string, port: string): string | null {
  const la = orig.split("\n").filter((l) => l.trim() !== "");
  const lb = port.split("\n").filter((l) => l.trim() !== "");
  for (let i = 0; i < Math.max(la.length, lb.length); i++) {
    if (la[i] !== lb[i] && !(la[i] !== undefined && lb[i] !== undefined && KNOWN.some((k) => k(la[i], lb[i])))) {
      const context = la.slice(Math.max(0, i - 6), i).join("\n           ");
      return `line ${i}:\n  orig: ${JSON.stringify(la[i])}\n  port: ${JSON.stringify(lb[i])}\n  context: ${context}`;
    }
  }
  return null;
}

function compare(label: string, cmds: string[], seed: number): boolean {
  const o = runOriginal(cmds, seed);
  let p: string;
  try {
    p = runPort(cmds, seed);
  } catch (e: any) {
    console.log(`\n=== ${label}: PORT CRASH ${String(e.stack).split("\n").slice(0, 6).join("\n")}`);
    return false;
  }
  const d = firstDiff(o, p);
  if (d) console.log(`\n=== ${label}: ${d}`);
  return !d;
}

// ---------------------------------------------------------------------------
// Random commands

let state = 12345;
const rnd = (n: number) => {
  state = (Math.imul(state, 1103515245) + 12345) >>> 0;
  return (state >>> 8) % n;
};
const pick = <T>(xs: T[]): T => xs[rnd(xs.length)];

function commandMaker(): () => string {
  createGame({ write: () => true, read: () => null }, 1);
  const words = [...dictionary.values()];
  const nouns = words.filter((w) => w.ps & 128).map((w) => w.text);
  const adjs = words.filter((w) => w.ps & 32).map((w) => w.text);
  const dirs = ["n", "s", "e", "w", "ne", "nw", "se", "sw", "up", "down", "in", "out"];
  const prepWord = new Map<number, string>();
  for (const w of words) {
    if (!(w.ps & 8)) continue;
    const v = (w.ps & 3) === 0 ? w.v1 : w.v2;
    if (!prepWord.has(v)) prepWord.set(v, w.text);
  }
  const verbWords = new Map<number, string[]>();
  for (const w of words) {
    if (!(w.ps & 64)) continue;
    const v = (w.ps & 3) === 1 ? w.v1 : w.v2;
    if (!verbWords.has(v)) verbWords.set(v, []);
    verbWords.get(v)!.push(w.text);
  }
  const syntaxes = (act: number) => {
    const t = get(VERBS, 255 - act);
    return Array.from({ length: getb(t, 0) }, (_, i) => (k: number) => getb(t, 1 + 8 * i + k));
  };
  // SAVE and RESTORE need a file system the oracle doesn't have.
  const acts = (Object.values(ACT) as number[]).filter((a) =>
    syntaxes(a).every((b) => b(7) !== V.SAVE && b(7) !== V.RESTORE));

  const noun = () => {
    const r = rnd(10);
    if (r < 2) return `${pick(adjs)} ${pick(nouns)}`;
    if (r < 3) return pick(["all", "it", "him", "her", "me", "all but " + pick(nouns)]);
    return pick(nouns);
  };
  return () => {
    const r = rnd(20);
    if (r < 4) return pick(dirs);
    if (r < 5) return pick(["look", "inventory", "wait", "score", "diagnose", "again", "yes", "no", "smell", "listen"]);
    const act = pick(acts);
    const b = pick(syntaxes(act));
    const parts = [pick(verbWords.get(act) ?? ["look"])];
    if (b(1)) parts.push(prepWord.get(b(1)) ?? "");
    if (b(0) >= 1) parts.push(noun());
    if (b(2)) parts.push(prepWord.get(b(2)) ?? "");
    if (b(0) >= 2) parts.push(noun());
    return parts.filter(Boolean).join(" ");
  };
}

// ---------------------------------------------------------------------------

const [mode = "walk", ...args] = process.argv.slice(2);
let failures = 0;
let total = 0;
if (mode === "walk") {
  const seeds = args.length ? args.map(Number) : [1, 2, 3, 4, 5];
  for (const seed of seeds) {
    total++;
    const w = runWalkthrough(WALKTHROUGH, seed);
    if (compare(`walkthrough seed ${seed}`, w.commands, seed)) console.log(`seed ${seed}: ${w.commands.length} commands, identical`);
    else failures++;
  }
} else if (mode === "fuzz") {
  const runs = Number(args[0] ?? 100);
  state = Number(args[1] ?? 12345);
  const randomCommand = commandMaker();
  for (let k = 0; k < runs; k++) {
    total++;
    const seed = 1 + rnd(1000);
    const w = runWalkthrough(WALKTHROUGH, seed).commands;
    const cut = rnd(w.length);
    const cmds = w.slice(0, cut);
    for (let j = 0; j < 40; j++) cmds.push(randomCommand());
    if (!compare(`run ${k} seed ${seed} cut ${cut}`, cmds, seed)) {
      failures++;
      console.log(`  commands: ${JSON.stringify(cmds.slice(cut))}`);
    }
  }
} else if (mode === "file") {
  total = 1;
  const cmds = fs.readFileSync(args[0], "utf8").split(/\r?\n/);
  if (compare(args[0], cmds, Number(args[1] ?? 1))) console.log("identical");
  else failures++;
} else {
  console.error(`unknown mode ${mode}`);
  process.exit(2);
}
console.log(`\n${total} compared, ${failures} with differences`);
process.exit(failures ? 1 : 0);
