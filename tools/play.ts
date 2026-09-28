// Plays the port in a terminal: `npm run play` (add `-- --seed 123` for a
// repeatable game, or pipe commands in: `npm run play < commands.txt`).
import readline from "readline";
import fs from "fs";
import { createGame } from "../src/game/index.ts";
import type { OutputEvent, SavedGame, SaveStorage, StepResult } from "../src/engine/machine.ts";

const args = process.argv.slice(2);
const seedArg = args.indexOf("--seed");
const seed = seedArg >= 0 ? Number(args[seedArg + 1]) : undefined;

const saves = new Map<string, SavedGame>();
const storage: SaveStorage = {
  write: (slot, data) => (saves.set(slot, data), true),
  read: (slot) => saves.get(slot) ?? null,
};

const game = createGame(storage, seed);

function render(events: OutputEvent[]): void {
  for (const e of events) {
    if (e.type === "text") process.stdout.write(e.text);
    else if (e.type === "input") process.stdout.write(e.text + "\n");
    else if (e.type === "clear") process.stdout.write("\n\n");
    else if (e.type === "notice") process.stdout.write(`[${e.text}]\n`);
  }
}

const piped = !process.stdin.isTTY;
const lines: string[] = piped ? fs.readFileSync(0, "utf8").split(/\r?\n/) : [];

let result: StepResult = game.start();
render(result.events);

function prompt(r: StepResult): string {
  if (r.waiting === "save") return "[save to slot] ";
  if (r.waiting === "restore") return "[restore slot] ";
  return "";
}

if (piped) {
  for (const line of lines) {
    if (result.ended) break;
    process.stdout.write(prompt(result));
    result = game.send(line);
    render(result.events);
  }
  process.stdout.write("\n");
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = () => {
    if (result.ended) {
      rl.close();
      return;
    }
    rl.question(prompt(result), (line) => {
      if (line === "#undo") {
        const r = game.undo();
        if (r) result = r;
        render(result.events);
      } else {
        result = game.send(line);
        render(result.events);
      }
      ask();
    });
  };
  ask();
}
