// Drives a game session through a scripted walkthrough.
import { createGame } from "../src/game/index.ts";
import type { OutputEvent, SavedGame } from "../src/engine/machine.ts";

export type Step =
  | string // a command
  | { cmd: string; until: RegExp; max?: number } // repeat until the output matches
  | { cmd: string; expect: RegExp } // run once; output must match
  | { expect: RegExp } // the latest output must match
  | { from: (lastOutput: string) => string }; // a command computed from the latest output

export interface WalkResult {
  transcript: string;
  score: number;
  moves: number;
  ended: boolean;
  failure?: string;
}

function text(events: OutputEvent[]): string {
  let s = "";
  for (const e of events) {
    if (e.type === "text") s += e.text;
    else if (e.type === "input") s += e.text + "\n";
  }
  return s;
}

export function runWalkthrough(steps: Step[], seed = 1): WalkResult {
  const saves = new Map<string, SavedGame>();
  const game = createGame({ write: (k, v) => (saves.set(k, v), true), read: (k) => saves.get(k) ?? null }, seed);
  let r = game.start();
  let transcript = text(r.events);
  let last = transcript;
  let score = 0;
  let moves = 0;
  const track = (events: OutputEvent[]) => {
    for (const e of events) if (e.type === "status") ({ score, moves } = e);
  };
  track(r.events);
  const send = (cmd: string) => {
    r = game.send(cmd);
    track(r.events);
    last = text(r.events);
    transcript += last;
    return last;
  };
  for (const [i, step] of steps.entries()) {
    const fail = (msg: string): WalkResult => ({ transcript, score, moves, ended: r.ended, failure: `step ${i}: ${msg}` });
    if (r.ended) return fail("the game ended early");
    if (typeof step === "string") send(step);
    else if ("until" in step) {
      let ok = false;
      for (let n = 0; n < (step.max ?? 20); n++) {
        if (step.until.test(send(step.cmd))) {
          ok = true;
          break;
        }
      }
      if (!ok) return fail(`"${step.cmd}" never produced ${step.until}`);
    } else if ("from" in step) {
      send(step.from(last));
    } else if ("cmd" in step) {
      if (!step.expect.test(send(step.cmd))) return fail(`"${step.cmd}" did not produce ${step.expect}`);
    } else if (!step.expect.test(last)) return fail(`expected ${step.expect}`);
  }
  return { transcript, score, moves, ended: r.ended };
}
