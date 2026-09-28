import { describe, expect, it } from "vitest";
import { createGame } from "../src/game/index.ts";
import type { OutputEvent, SavedGame, SaveStorage, StepResult } from "../src/engine/machine.ts";

function text(r: StepResult): string {
  return r.events
    .map((e: OutputEvent) => (e.type === "text" ? e.text : e.type === "input" ? e.text + "\n" : ""))
    .join("");
}

function memoryStorage(): SaveStorage & { saves: Map<string, SavedGame> } {
  const saves = new Map<string, SavedGame>();
  return { saves, write: (k, v) => (saves.set(k, v), true), read: (k) => saves.get(k) ?? null };
}

function newGame(seed = 1) {
  const storage = memoryStorage();
  const game = createGame(storage, seed);
  const first = game.start();
  return { game, storage, first };
}

describe("session machine", () => {
  it("starts with the content warning and waits for RETURN", () => {
    const { first } = newGame();
    expect(text(first)).toContain("Some material in this story may not be suitable for children");
    expect(first.waiting).toBe("line");
  });

  it("echoes commands and reports status", () => {
    const { game } = newGame();
    game.send("");
    const r = game.send("inventory");
    expect(text(r)).toContain("inventory\n");
    expect(text(r)).toContain("You have a flashlight");
    const status = r.events.filter((e) => e.type === "status").pop();
    expect(status).toMatchObject({ location: "Joe's Bar" });
  });

  it("undo rewinds the last turn", () => {
    const { game } = newGame();
    game.send("");
    game.send("northwest");
    game.send("take stool");
    const undone = game.undo()!;
    expect(undone).not.toBeNull();
    const r = game.send("look");
    expect(text(r)).toContain("You can see a stool here");
  });

  it("saves with SAVE and restores with RESTORE", () => {
    const { game, storage } = newGame();
    game.send("");
    game.send("northwest");
    const askSlot = game.send("save");
    expect(askSlot.waiting).toBe("save");
    const saved = game.send("slot one");
    expect(text(saved)).toContain("Okay.");
    expect(storage.saves.has("slot one")).toBe(true);
    game.send("take stool");
    game.send("southeast");
    game.send("restore");
    const restored = game.send("slot one");
    expect(text(restored)).toContain("Okay.");
    expect(text(game.send("look"))).toContain("Gents' Room");
    expect(text(game.send("look"))).toContain("stool");
  });

  it("answers a mid-turn question (yes/no) without losing the turn", () => {
    const { game } = newGame();
    game.send("");
    const q = game.send("restart");
    expect(text(q)).toContain("Do you wish to restart?");
    const r = game.send("no");
    expect(text(r)).not.toContain("Restarting");
    expect(text(game.send("look"))).toContain("Joe's Bar");
  });

  it("restarts from the beginning", () => {
    const { game } = newGame();
    game.send("");
    game.send("northwest");
    game.send("restart");
    const r = game.send("yes");
    expect(r.events.some((e) => e.type === "clear")).toBe(true);
    expect(text(r)).toContain("Some material in this story");
  });

  it("resumes an exported session", () => {
    const { game, storage } = newGame(7);
    game.send("");
    game.send("northwest");
    const session = game.exportSession();
    const again = createGame(storage, 99);
    again.importSession(session);
    expect(text(again.send("look"))).toContain("Gents' Room");
  });
});

describe("parser", () => {
  it("handles ALL, IT and OOPS", () => {
    const { game } = newGame();
    game.send("");
    game.send("northwest");
    expect(text(game.send("take stool"))).toContain("Taken.");
    expect(text(game.send("drop it"))).toContain("Dropped.");
    expect(text(game.send("take stoll"))).toContain("[I don't know the word \"stoll.\"]");
    expect(text(game.send("oops stool"))).toContain("Taken.");
  });

  it("knows six-letter truncation like the original", () => {
    const { game } = newGame();
    game.send("");
    // "flashlamp" matches "flashlight": only six letters count.
    expect(text(game.send("examine flashlamp"))).toContain("It's off.");
  });
});
