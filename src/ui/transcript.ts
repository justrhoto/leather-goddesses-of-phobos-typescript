// Renders the game's output stream into the story view.
//
// Output arrives as events: text (with a fixed-pitch flag), the player's
// typed input, turn markers, and screen clears. Each turn gets its own
// <section>, so undo can remove exactly the turns that were taken back.
import type { OutputEvent } from "../engine/machine.ts";

type Item = { kind: "text"; text: string; fixed: boolean } | { kind: "input"; text: string } | { kind: "notice"; text: string };

interface Turn {
  id: number;
  items: Item[];
  /** Locations the status line showed during this turn (for spotting room headings). */
  places: string[];
  el: HTMLElement;
  dirty: boolean;
}

/** A saved-and-restorable form of the transcript. */
export type TranscriptData = { id: number; items: Item[]; places?: string[] }[];

export class Transcript {
  private turns: Turn[] = [];
  private location = "";

  constructor(private readonly root: HTMLElement) {
    this.startTurn(0);
  }

  setLocation(name: string): void {
    this.location = name;
  }

  /** Applies a batch of events; returns the first turn element that changed. */
  apply(events: OutputEvent[]): HTMLElement | null {
    let firstChanged: HTMLElement | null = null;
    const touch = (t: Turn) => {
      t.dirty = true;
      firstChanged ??= t.el;
    };
    for (const e of events) {
      switch (e.type) {
        case "turn": {
          const at = this.turns.findIndex((t) => t.id === e.id);
          if (at >= 0) this.truncate(at);
          touch(this.startTurn(e.id));
          break;
        }
        case "clear":
          this.truncate(0);
          touch(this.startTurn(-1));
          break;
        case "text": {
          const t = this.current;
          const last = t.items[t.items.length - 1];
          if (last?.kind === "text" && last.fixed === e.fixed) last.text += e.text;
          else t.items.push({ kind: "text", text: e.text, fixed: e.fixed });
          touch(t);
          break;
        }
        case "input":
          this.current.items.push({ kind: "input", text: e.text });
          touch(this.current);
          break;
        case "notice":
          this.current.items.push({ kind: "notice", text: e.text });
          touch(this.current);
          break;
        case "status":
          this.location = e.location;
          // The status line is updated at the next prompt, so a new location also
          // belongs to the turn before (where the room was described).
          for (const t of this.turns.slice(-2)) {
            if (!t.places.includes(e.location)) {
              t.places.push(e.location);
              touch(t);
            }
          }
          break;
      }
    }
    for (const t of this.turns) if (t.dirty) this.render(t);
    return firstChanged;
  }

  /** The text shown since the last input (what the game is asking now). */
  pendingText(): string {
    const items = this.current.items;
    let s = "";
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (it.kind === "input") break;
      if (it.kind === "text") s = it.text + s;
    }
    return s;
  }

  /** Plain text of the whole transcript, for download. */
  plainText(): string {
    let s = "";
    for (const t of this.turns) {
      for (const it of t.items) {
        if (it.kind === "text") s += it.text;
        else if (it.kind === "input") s += it.text + "\n";
        else s += `[${it.text}]\n`;
      }
    }
    return s;
  }

  /** The most recent turns, compactly (used when saving). */
  export(maxTurns = 60): TranscriptData {
    return this.turns.slice(-maxTurns).map((t) => ({ id: t.id, items: t.items, places: t.places }));
  }

  restore(data: TranscriptData): void {
    this.truncate(0);
    for (const d of data) {
      const t = this.startTurn(d.id);
      t.items = d.items.map((x) => ({ ...x }));
      t.places = [...(d.places ?? [])];
      this.render(t);
    }
    if (this.turns.length === 0) this.startTurn(0);
  }

  clear(): void {
    this.truncate(0);
    this.startTurn(0);
  }

  get lastElement(): HTMLElement {
    return this.current.el;
  }

  private get current(): Turn {
    return this.turns[this.turns.length - 1];
  }

  private startTurn(id: number): Turn {
    const el = document.createElement("section");
    el.className = "turn";
    this.root.append(el);
    const t: Turn = { id, items: [], places: [], el, dirty: false };
    this.turns.push(t);
    return t;
  }

  private truncate(index: number): void {
    for (const t of this.turns.slice(index)) t.el.remove();
    this.turns.length = index;
  }

  // ------------------------------------------------------------------------

  private render(t: Turn): void {
    t.dirty = false;
    const frag = document.createDocumentFragment();
    let line: { text: string; fixed: boolean }[] = [];
    let blank = 0;
    const isLast = t === this.current;

    const flush = (answer?: string) => {
      const text = line.map((s) => s.text).join("");
      if (answer !== undefined) {
        const prompt = text.replace(/\s*>\s*$/, "");
        if (prompt.trim() === "") {
          const p = document.createElement("p");
          p.className = answer === "" ? "cmd empty" : "cmd";
          p.textContent = answer;
          frag.append(p);
        } else {
          const p = this.lineElement(prompt, line, t.places);
          const a = document.createElement("span");
          a.className = "answer";
          a.textContent = answer === "" ? "(RETURN)" : answer;
          p.append(a);
          frag.append(p);
        }
        blank = 0;
      } else if (text.trim() === "") {
        blank++;
        if (blank === 1 && frag.childNodes.length) {
          const g = document.createElement("div");
          g.className = "gap";
          frag.append(g);
        }
      } else {
        frag.append(this.lineElement(text, line, t.places));
        blank = 0;
      }
      line = [];
    };

    for (const it of t.items) {
      if (it.kind === "input") {
        flush(it.text);
        continue;
      }
      if (it.kind === "notice") {
        // A bare ">" prompt before a notice is still waiting for its answer; don't print it.
        if (/^\s*>\s*$/.test(line.map((s) => s.text).join(""))) line = [];
        if (line.length) flush();
        const p = document.createElement("p");
        p.className = "notice";
        p.textContent = it.text;
        frag.append(p);
        continue;
      }
      const parts = it.text.split("\n");
      parts.forEach((part, i) => {
        if (part) line.push({ text: part, fixed: it.fixed });
        if (i < parts.length - 1) flush();
      });
    }
    if (line.length) {
      // An unanswered prompt: hide the ">" the input box stands in for.
      const text = line.map((s) => s.text).join("");
      if (isLast && /^\s*>\s*$/.test(text)) line = [];
      else if (isLast && />\s*$/.test(text)) {
        const trimmed = text.replace(/\s*>\s*$/, "");
        line = [{ text: trimmed, fixed: false }];
        flush();
      } else flush();
    }
    t.el.replaceChildren(frag);
  }

  private lineElement(text: string, spans: { text: string; fixed: boolean }[], places: string[]): HTMLElement {
    const trimmed = text.trim();
    const loc = [...places, this.location].find((p) => p && (trimmed === p || trimmed.startsWith(p + ",")));
    if (
      loc &&
      !/[.!?"]$/.test(trimmed) &&
      trimmed.length < 90
    ) {
      const h = document.createElement("h2");
      h.className = "room";
      h.append(loc);
      if (trimmed.length > loc.length) {
        const where = document.createElement("span");
        where.className = "room-where";
        where.textContent = trimmed.slice(loc.length);
        h.append(where);
      }
      return h;
    }
    const p = document.createElement("p");
    if (/^\s*\*{4}.*\*{4}\s*$/.test(text)) {
      p.className = "death";
      p.textContent = trimmed.replace(/\*/g, "").trim();
      return p;
    }
    if (/^ {3}\S/.test(text)) p.className = "indent";
    else if (/^\[.*\]$/.test(trimmed)) p.className = "meta";
    let first = true;
    for (const s of spans) {
      const piece = first && !s.fixed ? s.text.replace(/^ {3}/, "") : s.text;
      first = false;
      if (s.fixed) {
        const span = document.createElement("span");
        span.className = "fixed";
        span.textContent = piece;
        p.append(span);
      } else p.append(piece);
    }
    return p;
  }
}
