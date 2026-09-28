// The session machine: runs the game, supplies input, and turns ZIL's blocking
// I/O into a step-by-step API for the browser.
//
// ZIL routines call READ from deep inside their logic (death prompts, yes/no
// questions, "hit RETURN" pauses). Rather than making every routine async, the
// machine takes a snapshot at the start of each turn. When a READ needs input
// that hasn't been typed yet, the turn is abandoned; once the player answers,
// the world is restored to the snapshot and the turn is replayed with the
// answers queued. Because the game (including its random numbers) is fully
// deterministic, the replay reaches the same point, and output that was
// already shown is suppressed.
import { Rng } from "./rng.ts";
import {
  decodeSnapshot,
  encodeSnapshot,
  restoreSnapshot,
  takeSnapshot,
  type EncodedSnapshot,
  type Snapshot,
} from "./state.ts";

export type InputKind = "line" | "save" | "restore";

export type OutputEvent =
  | { type: "text"; text: string; fixed: boolean }
  | { type: "input"; text: string }
  | { type: "status"; location: string; score: number; moves: number }
  | { type: "clear" }
  | { type: "turn"; id: number }
  | { type: "notice"; text: string };

export interface StepResult {
  events: OutputEvent[];
  /** What kind of input the game is waiting for, or null if it has ended. */
  waiting: InputKind | null;
  ended: boolean;
}

export interface SavedGame {
  version: string;
  snapshot: EncodedSnapshot;
  entry: Entry;
  inputs: string[];
  shown: number;
  location: string;
  score: number;
  moves: number;
  savedAt: string;
}

export interface SaveStorage {
  write(slot: string, data: SavedGame): boolean;
  read(slot: string): SavedGame | null;
}

export interface GameHooks {
  /** The ZSTART routine. */
  go(): unknown;
  /** Continues the main loop (after a checkpoint taken at a turn boundary). */
  mainLoop(): unknown;
  /** Returns the status line (location name, score, moves). */
  status(): { location: string; score: number; moves: number };
  /** Whether the "fixed-pitch" header bit is on. */
  fixedPitch(): boolean;
}

type Entry = "go" | "main";

interface Checkpoint {
  id: number;
  snapshot: Snapshot;
  entry: Entry;
}

class NeedInput {
  constructor(readonly kind: InputKind) {}
}
class RestartSignal {}
class QuitSignal {}
class RestoreSignal {
  constructor(readonly saved: SavedGame) {}
}

export const BUILD_VERSION = "lgop-port-1";

let current: Machine | null = null;

/** The machine currently running game code (used by the runtime I/O functions). */
export function machine(): Machine {
  if (!current) throw new Error("no game is running");
  return current;
}

export class Machine {
  readonly rng: Rng;
  private initial!: Checkpoint;
  private checkpoint!: Checkpoint;
  private pending: string[] = []; // inputs typed since the checkpoint
  private queueIndex = 0;
  private eventCount = 0; // events produced by this run since the checkpoint
  private shown = 0; // events already delivered since the checkpoint
  private out: OutputEvent[] = [];
  private resumedAtCheckpoint = false;
  private restoringSave = false;
  private savesWritten = new Set<number>();
  private history: Checkpoint[] = [];
  private nextId = 1;
  private ended = false;
  private turnHadInput = false;

  constructor(
    private readonly game: GameHooks,
    private readonly storage: SaveStorage,
    seed?: number,
  ) {
    this.rng = new Rng(seed);
  }

  /** Captures the freshly initialised world. Call once, before start(). */
  init(): void {
    this.initial = { id: 0, snapshot: takeSnapshot(this.rng), entry: "go" };
    this.checkpoint = this.initial;
  }

  start(): StepResult {
    return this.run();
  }

  send(text: string): StepResult {
    if (this.ended) return { events: [], waiting: null, ended: true };
    this.pending.push(text);
    return this.run();
  }

  get canUndo(): boolean {
    return this.history.length > 0;
  }

  /** Rewinds to the start of the previous turn. */
  undo(): StepResult | null {
    const cp = this.history.pop();
    if (!cp) return null;
    this.checkpoint = cp;
    this.pending = [];
    this.shown = 0;
    this.ended = false;
    return this.run([{ type: "turn", id: cp.id }]);
  }

  /** Starts over from the very beginning (as the RESTART command does). */
  restart(): StepResult {
    this.resetToInitial();
    return this.run([{ type: "clear" }]);
  }

  /** Loads a saved game directly (from the UI rather than the RESTORE verb). */
  load(saved: SavedGame): StepResult {
    this.applySave(saved);
    return this.run([{ type: "notice", text: "Restored." }]);
  }

  /** State needed to resume this session later (e.g. after a page reload). */
  exportSession(): SavedGame {
    return this.makeSave(this.checkpoint, this.pending, this.shown);
  }

  importSession(saved: SavedGame): StepResult {
    this.applySave(saved, false);
    return this.run();
  }

  // -------------------------------------------------------------------------
  // Called by game code

  /** Marks the start of a turn (called at the top of each main-loop pass). */
  turnBoundary(): void {
    if (this.resumedAtCheckpoint) {
      // Replaying from this checkpoint: produce the same event as the first pass did.
      this.resumedAtCheckpoint = false;
      this.emit({ type: "turn", id: this.checkpoint.id });
      return;
    }
    if (this.turnHadInput) this.history.push(this.checkpoint);
    if (this.history.length > 200) this.history.shift();
    this.checkpoint = { id: this.nextId++, snapshot: takeSnapshot(this.rng), entry: "main" };
    this.pending = this.pending.slice(this.queueIndex);
    this.queueIndex = 0;
    this.eventCount = 0;
    this.shown = 0;
    this.turnHadInput = false;
    this.emit({ type: "turn", id: this.checkpoint.id });
  }

  /** READ: returns the next line of input, or suspends the game until it is typed. */
  readLine(kind: InputKind = "line"): string {
    this.emitStatus();
    if (this.queueIndex < this.pending.length) {
      const text = this.pending[this.queueIndex++];
      this.turnHadInput = true;
      if (kind === "line") this.emit({ type: "input", text });
      return text;
    }
    throw new NeedInput(kind);
  }

  print(text: string): void {
    if (text.length === 0) return;
    this.emit({ type: "text", text, fixed: this.game.fixedPitch() });
  }

  emitStatus(): void {
    this.emit({ type: "status", ...this.game.status() });
  }

  clearScreen(): void {
    this.emit({ type: "clear" });
  }

  random(n: number): number {
    if (n > 0) return this.rng.range(n);
    if (n < 0) this.rng.seed(-n);
    else this.rng.seed(Date.now() ^ Math.floor(Math.random() * 0x7fffffff));
    return 0;
  }

  save(): boolean {
    const slot = this.readLine("save").trim();
    if (!slot) return false;
    const index = this.queueIndex;
    if (this.restoringSave && index === this.pending.length) {
      // Replaying up to the SAVE we are restoring: it "succeeds" here.
      this.restoringSave = false;
      return true;
    }
    if (this.savesWritten.has(index)) return true;
    const data = this.makeSave(this.checkpoint, this.pending.slice(0, index), this.eventCount);
    const ok = this.storage.write(slot, data);
    if (ok) this.savesWritten.add(index);
    return ok;
  }

  restore(): boolean {
    const slot = this.readLine("restore").trim();
    if (!slot) return false;
    const saved = this.storage.read(slot);
    if (!saved || saved.version !== BUILD_VERSION) return false;
    throw new RestoreSignal(saved);
  }

  restartGame(): never {
    throw new RestartSignal();
  }

  quit(): never {
    throw new QuitSignal();
  }

  // -------------------------------------------------------------------------

  private emit(e: OutputEvent): void {
    this.eventCount++;
    if (this.eventCount > this.shown) {
      this.shown = this.eventCount;
      this.out.push(e);
    }
  }

  private run(prefix: OutputEvent[] = []): StepResult {
    this.out = [...prefix];
    for (;;) {
      restoreSnapshot(this.checkpoint.snapshot, this.rng);
      this.queueIndex = 0;
      this.eventCount = 0;
      this.turnHadInput = false;
      this.resumedAtCheckpoint = this.checkpoint.entry === "main";
      const previous = current;
      current = this;
      try {
        if (this.checkpoint.entry === "go") this.game.go();
        else this.game.mainLoop();
        throw new Error("the game's main loop returned");
      } catch (e) {
        if (e instanceof NeedInput) return this.result(e.kind);
        if (e instanceof RestartSignal) {
          this.resetToInitial();
          this.out.push({ type: "clear" });
          continue;
        }
        if (e instanceof QuitSignal) {
          this.ended = true;
          return this.result(null);
        }
        if (e instanceof RestoreSignal) {
          this.applySave(e.saved);
          continue;
        }
        throw e;
      } finally {
        current = previous;
      }
    }
  }

  private result(waiting: InputKind | null): StepResult {
    const events = this.out;
    this.out = [];
    return { events, waiting, ended: this.ended };
  }

  private resetToInitial(): void {
    this.checkpoint = this.initial;
    this.pending = [];
    this.shown = 0;
    this.history = [];
    this.ended = false;
    this.restoringSave = false;
  }

  private makeSave(cp: Checkpoint, inputs: string[], shown: number): SavedGame {
    const st = this.game.status();
    return {
      version: BUILD_VERSION,
      snapshot: encodeSnapshot(cp.snapshot),
      entry: cp.entry,
      inputs: [...inputs],
      shown,
      location: st.location,
      score: st.score,
      moves: st.moves,
      savedAt: new Date().toISOString(),
    };
  }

  private applySave(saved: SavedGame, viaSaveVerb = true): void {
    this.checkpoint = { id: this.nextId++, snapshot: decodeSnapshot(saved.snapshot), entry: saved.entry };
    this.pending = [...saved.inputs];
    this.shown = saved.shown;
    this.history = [];
    this.ended = false;
    this.savesWritten.clear();
    this.restoringSave = viaSaveVerb && saved.inputs.length > 0;
  }
}
