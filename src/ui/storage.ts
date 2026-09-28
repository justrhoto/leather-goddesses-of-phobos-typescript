// Browser persistence: saved games, the running session, and preferences.
// localStorage can be unavailable (private windows, blocked storage), so every
// access is guarded and the game still runs without it.
import type { SavedGame, SaveStorage } from "../engine/machine.ts";
import type { TranscriptData } from "./transcript.ts";

const SAVES_KEY = "lgop.saves.v1";
const SESSION_KEY = "lgop.session.v1";
const PREFS_KEY = "lgop.prefs.v1";

export interface SaveSlot {
  game: SavedGame;
  transcript: TranscriptData;
}

export interface Prefs {
  size: "s" | "m" | "l";
  theme: "auto" | "light" | "dark";
  scratched: number[];
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export class BrowserStorage {
  /** Set by the UI so saves can carry the story so far. */
  transcriptSource: () => TranscriptData = () => [];

  listSaves(): [string, SaveSlot][] {
    const all = read<Record<string, SaveSlot>>(SAVES_KEY, {});
    return Object.entries(all).sort((a, b) => b[1].game.savedAt.localeCompare(a[1].game.savedAt));
  }

  getSave(name: string): SaveSlot | null {
    return read<Record<string, SaveSlot>>(SAVES_KEY, {})[name] ?? null;
  }

  putSave(name: string, game: SavedGame): boolean {
    const all = read<Record<string, SaveSlot>>(SAVES_KEY, {});
    all[name] = { game, transcript: this.transcriptSource() };
    return write(SAVES_KEY, all);
  }

  deleteSave(name: string): void {
    const all = read<Record<string, SaveSlot>>(SAVES_KEY, {});
    delete all[name];
    write(SAVES_KEY, all);
  }

  /** The adapter the game's SAVE and RESTORE commands use. */
  gameAdapter(): SaveStorage {
    return {
      write: (slot, data) => this.putSave(slot, data),
      read: (slot) => this.getSave(slot)?.game ?? null,
    };
  }

  loadSession(): SaveSlot | null {
    return read<SaveSlot | null>(SESSION_KEY, null);
  }

  saveSession(game: SavedGame, transcript: TranscriptData): void {
    write(SESSION_KEY, { game, transcript });
  }

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // storage unavailable; nothing to clear
    }
  }

  prefs(): Prefs {
    return { size: "m", theme: "auto", scratched: [], ...read<Partial<Prefs>>(PREFS_KEY, {}) };
  }

  setPrefs(p: Prefs): void {
    write(PREFS_KEY, p);
  }
}
