// The browser front end for the TypeScript port of Leather Goddesses of Phobos.
import { createGame } from "../game/index.ts";
import type { InputKind, Machine, StepResult } from "../engine/machine.ts";
import { BUILD_VERSION } from "../engine/machine.ts";
import { Transcript } from "./transcript.ts";
import { BrowserStorage, type Prefs } from "./storage.ts";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const story = $<HTMLElement>("story");
const input = $<HTMLInputElement>("command-input");
const form = $<HTMLFormElement>("command-form");
const chips = $<HTMLDivElement>("chips");
const undoButton = $<HTMLButtonElement>("undo-button");
const place = $<HTMLSpanElement>("place");
const score = $<HTMLSpanElement>("score");
const moves = $<HTMLSpanElement>("moves");

const storage = new BrowserStorage();
const transcript = new Transcript(story);
storage.transcriptSource = () => transcript.export();

let prefs: Prefs = storage.prefs();
let game: Machine = createGame(storage.gameAdapter());
let waiting: InputKind | null = null;
let ended = false;

// ---------------------------------------------------------------------------
// Running the game

function show(result: StepResult): void {
  const changed = transcript.apply(result.events);
  for (const e of result.events) {
    if (e.type === "status") {
      place.textContent = e.location;
      score.textContent = `Score ${e.score}`;
      moves.textContent = `Moves ${e.moves}`;
    }
  }
  waiting = result.waiting;
  ended = result.ended;
  if (ended) {
    transcript.apply([{ type: "notice", text: "The game has ended. Start over or restore a saved game." }]);
  }
  scrollToNews(changed);
  updatePrompt();
  persistSession();
}

function send(text: string): void {
  if (ended) return;
  show(game.send(text));
}

/** Keeps the start of new output in view; long passages are read from their top. */
function scrollToNews(changed: HTMLElement | null): void {
  requestAnimationFrame(() => {
    const target = changed ?? transcript.lastElement;
    const top = Math.max(0, target.offsetTop - 16);
    const bottom = story.scrollHeight - story.clientHeight;
    // If everything new fits on screen, show it all; otherwise start reading at its top.
    story.scrollTop = Math.min(bottom, top);
  });
}

function persistSession(): void {
  if (ended) {
    storage.clearSession();
    return;
  }
  try {
    storage.saveSession(game.exportSession(), transcript.export(200));
  } catch {
    // Saving the session is a convenience; ignore failures.
  }
}

// ---------------------------------------------------------------------------
// Prompts and quick replies

function updatePrompt(): void {
  chips.replaceChildren();
  undoButton.disabled = !game.canUndo;
  input.disabled = ended;
  const pending = transcript.pendingText();

  if (ended) {
    addChip("Start over", () => restartGame(), true);
    addChip("Restore a save", () => openMenu());
    return;
  }
  if (waiting === "save" || waiting === "restore") {
    openSlotDialog(waiting);
    return;
  }
  const sniff = /\[Scratch 'n' sniff spot number (\d+)/.exec(pending);
  if (sniff) {
    addChip("Continue", () => send(""), true);
    openSniff(Number(sniff[1]));
    return;
  }
  if (/Hit the RETURN\/ENTER key to/.test(pending)) {
    addChip("Continue", () => send(""), true);
  } else if (/\(Y is affirmative\)|Please answer YES or NO/.test(pending)) {
    addChip("Yes", () => send("yes"), true);
    addChip("No", () => send("no"));
  } else if (/\(Type RESTART, RESTORE, or QUIT\)/.test(pending)) {
    addChip("Restart", () => send("restart"), true);
    addChip("Restore", () => send("restore"));
    addChip("Quit", () => send("quit"));
    if (game.canUndo) addChip("Undo", () => undo());
  }
  if (!matchMedia("(pointer: coarse)").matches) input.focus();
}

function addChip(label: string, action: () => void, primary = false): void {
  const b = document.createElement("button");
  b.type = "button";
  b.className = primary ? "chip primary" : "chip";
  b.textContent = label;
  b.addEventListener("click", action);
  chips.append(b);
}

// ---------------------------------------------------------------------------
// Command line, history and undo

const history: string[] = [];
let historyIndex = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value;
  input.value = "";
  if (text.trim()) {
    if (history[history.length - 1] !== text) history.push(text);
  }
  historyIndex = history.length;
  if (/^\s*undo\s*$/i.test(text) && waiting === "line") {
    undo();
    return;
  }
  send(text);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && history.length) {
    e.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = history[historyIndex] ?? "";
  } else if (e.key === "ArrowDown" && history.length) {
    e.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    input.value = history[historyIndex] ?? "";
  } else if (e.key === "z" && (e.ctrlKey || e.metaKey) && input.value === "") {
    e.preventDefault();
    undo();
  }
});

undoButton.addEventListener("click", () => undo());

function undo(): void {
  const r = game.undo();
  if (!r) {
    transcript.apply([{ type: "notice", text: "There is nothing to undo. (Undo remembers the turns played since this page was opened.)" }]);
    scrollToNews(null);
    return;
  }
  ended = false;
  show(r);
}

// Typing anywhere goes to the command line.
document.addEventListener("keydown", (e) => {
  if (document.querySelector("dialog[open]") || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key.length === 1 && document.activeElement !== input && !input.disabled) input.focus();
});

// ---------------------------------------------------------------------------
// Menu: saves, reading preferences, transcript, restart

const menu = $<HTMLDialogElement>("menu");
$("menu-button").addEventListener("click", () => openMenu());

function openMenu(): void {
  renderSaves();
  renderSniffCard();
  menu.showModal();
}
menu.addEventListener("close", () => input.focus());

$<HTMLFormElement>("save-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = $<HTMLInputElement>("save-name");
  const name = nameInput.value.trim() || defaultSaveName();
  if (storage.putSave(name, game.exportSession())) {
    nameInput.value = "";
    renderSaves();
  } else {
    alertInMenu("This browser won't let the game store saves. Check that site data is allowed.");
  }
});

function defaultSaveName(): string {
  const where = place.textContent || "Save";
  return `${where}, move ${moves.textContent?.replace(/\D/g, "") || 0}`;
}

function renderSaves(): void {
  const list = $<HTMLUListElement>("save-list");
  list.replaceChildren();
  const saves = storage.listSaves();
  if (saves.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No saved games yet. Name one above to save your place.";
    list.append(li);
    return;
  }
  for (const [name, slot] of saves) {
    const li = document.createElement("li");
    li.append(saveInfo(name, slot.game));
    const load = document.createElement("button");
    load.type = "button";
    load.className = "text-button strong";
    load.textContent = "Load";
    load.addEventListener("click", () => {
      loadSave(name);
      menu.close();
    });
    const del = document.createElement("button");
    del.type = "button";
    del.className = "text-button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", `Delete ${name}`);
    del.addEventListener("click", () => {
      storage.deleteSave(name);
      renderSaves();
    });
    li.append(load, del);
    list.append(li);
  }
}

function saveInfo(name: string, g: { location: string; moves: number; savedAt: string; version: string }): HTMLElement {
  const info = document.createElement("span");
  info.className = "save-info";
  const n = document.createElement("span");
  n.className = "save-name";
  n.textContent = name;
  const d = document.createElement("span");
  d.className = "save-detail";
  const when = new Date(g.savedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  d.textContent = g.version === BUILD_VERSION ? `${g.location}, move ${g.moves} · ${when}` : "From an older version; can't be loaded";
  info.append(n, d);
  return info;
}

function loadSave(name: string): void {
  const slot = storage.getSave(name);
  if (!slot || slot.game.version !== BUILD_VERSION) return;
  transcript.restore(slot.transcript);
  const r = game.load(slot.game);
  ended = false;
  show(r);
}

function alertInMenu(message: string): void {
  const list = $<HTMLUListElement>("save-list");
  const li = document.createElement("li");
  li.className = "empty";
  li.textContent = message;
  list.prepend(li);
}

$("download-button").addEventListener("click", () => {
  const blob = new Blob([transcript.plainText()], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leather-goddesses-transcript.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$("restart-button").addEventListener("click", () => {
  if (confirm("Start the story over from the beginning? Your current progress will be lost unless you've saved it.")) {
    menu.close();
    restartGame();
  }
});

function restartGame(): void {
  storage.clearSession();
  transcript.clear();
  game = createGame(storage.gameAdapter());
  ended = false;
  show(game.start());
}

// Reading preferences
function applyPrefs(): void {
  const root = document.documentElement;
  root.dataset.size = prefs.size;
  if (prefs.theme === "auto") delete root.dataset.theme;
  else root.dataset.theme = prefs.theme;
  for (const b of document.querySelectorAll<HTMLButtonElement>("#size-group button")) {
    b.setAttribute("aria-pressed", String(b.dataset.size === prefs.size));
  }
  for (const b of document.querySelectorAll<HTMLButtonElement>("#theme-group button")) {
    b.setAttribute("aria-pressed", String(b.dataset.themeChoice === prefs.theme));
  }
}
$("size-group").addEventListener("click", (e) => {
  const size = (e.target as HTMLElement).closest("button")?.dataset.size as Prefs["size"] | undefined;
  if (!size) return;
  prefs = { ...prefs, size };
  storage.setPrefs(prefs);
  applyPrefs();
});
$("theme-group").addEventListener("click", (e) => {
  const theme = (e.target as HTMLElement).closest("button")?.dataset.themeChoice as Prefs["theme"] | undefined;
  if (!theme) return;
  prefs = { ...prefs, theme };
  storage.setPrefs(prefs);
  applyPrefs();
});

// ---------------------------------------------------------------------------
// SAVE / RESTORE typed in the story: pick a slot

const slotDialog = $<HTMLDialogElement>("slot-dialog");
const slotInput = $<HTMLInputElement>("slot-input");
let slotAnswered = false;

function openSlotDialog(kind: "save" | "restore"): void {
  if (slotDialog.open) return;
  slotAnswered = false;
  const saving = kind === "save";
  $("slot-title").textContent = saving ? "Save the game" : "Restore a saved game";
  $("slot-note").textContent = saving
    ? "Name this save, or pick one to replace."
    : "Choose the save to go back to.";
  $("slot-ok").hidden = !saving; // when restoring, choosing a save is the action
  slotInput.hidden = !saving;
  slotInput.value = saving ? defaultSaveName() : "";
  const list = $<HTMLUListElement>("slot-list");
  list.replaceChildren();
  const saves = storage.listSaves();
  if (!saving && saves.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "There are no saved games in this browser yet.";
    list.append(li);
  }
  for (const [name, slot] of saves) {
    const li = document.createElement("li");
    const pick = document.createElement("button");
    pick.type = "button";
    pick.className = "pick";
    pick.disabled = !saving && slot.game.version !== BUILD_VERSION;
    pick.append(saveInfo(name, slot.game));
    pick.addEventListener("click", () => {
      if (saving) slotInput.value = name;
      else answerSlot(name);
    });
    li.append(pick);
    list.append(li);
  }
  slotDialog.showModal();
  if (saving) slotInput.select();
}

function answerSlot(name: string): void {
  slotAnswered = true;
  slotDialog.close();
  send(name);
}

$<HTMLFormElement>("slot-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (slotInput.hidden) return;
  answerSlot(slotInput.value.trim() || defaultSaveName());
});
$("slot-cancel").addEventListener("click", () => slotDialog.close());
slotDialog.addEventListener("close", () => {
  if (!slotAnswered && (waiting === "save" || waiting === "restore")) send(""); // an empty name cancels
});

// ---------------------------------------------------------------------------
// The Scratch 'n' Sniff card

/** The seven spots on the card, and what each one smells of. */
const SCENTS: { name: string; color: string }[] = [
  { name: "pizza", color: "#c8553d" },
  { name: "chocolate", color: "#6b3e26" },
  { name: "mothballs", color: "#8c93a8" },
  { name: "perfume", color: "#b0558f" },
  { name: "garlic", color: "#b9a86e" },
  { name: "leather", color: "#6d4a2f" },
  { name: "banana", color: "#d9b21f" },
];

const sniffDialog = $<HTMLDialogElement>("sniff-dialog");
const sniffSpot = $<HTMLButtonElement>("sniff-spot");
let sniffing = 0;

function openSniff(n: number): void {
  if (sniffDialog.open) return;
  sniffing = n;
  const scent = SCENTS[n - 1];
  $("sniff-number").textContent = String(n);
  $("sniff-scent").textContent = scent?.name ?? "";
  sniffSpot.style.setProperty("--scent-color", scent?.color ?? "");
  sniffSpot.classList.remove("scratched", "scratching");
  sniffSpot.setAttribute("aria-label", `Scratch spot ${n}`);
  sniffDialog.showModal();
}

sniffSpot.addEventListener("click", () => {
  sniffSpot.classList.add("scratching", "scratched");
  sniffSpot.setAttribute("aria-label", `Spot ${sniffing} smells of ${SCENTS[sniffing - 1]?.name}`);
  if (!prefs.scratched.includes(sniffing)) {
    prefs = { ...prefs, scratched: [...prefs.scratched, sniffing] };
    storage.setPrefs(prefs);
  }
});
sniffDialog.addEventListener("close", () => {
  if (sniffing && /\[Scratch 'n' sniff spot number/.test(transcript.pendingText())) {
    sniffing = 0;
    send("");
  }
});

function renderSniffCard(): void {
  const card = $<HTMLOListElement>("sniff-card");
  card.replaceChildren();
  SCENTS.forEach((s, i) => {
    const li = document.createElement("li");
    const spot = document.createElement("span");
    spot.className = "sniff-spot" + (prefs.scratched.includes(i + 1) ? " scratched" : "");
    spot.style.setProperty("--scent-color", s.color);
    const num = document.createElement("span");
    num.className = "num";
    num.textContent = String(i + 1);
    spot.append(num);
    li.append(spot, prefs.scratched.includes(i + 1) ? s.name : "Unscratched");
    card.append(li);
  });
}

// ---------------------------------------------------------------------------
// Start: resume the last session if there is one

function start(): void {
  applyPrefs();
  const session = storage.loadSession();
  if (session && session.game.version === BUILD_VERSION) {
    try {
      transcript.restore(session.transcript);
      show(game.importSession(session.game));
      return;
    } catch {
      storage.clearSession();
      transcript.clear();
      game = createGame(storage.gameAdapter());
    }
  }
  show(game.start());
}

start();
