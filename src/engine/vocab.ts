// The game dictionary. Each word carries the three bytes ZILCH stored with it:
// a parts-of-speech byte and two values (verb, preposition, adjective or
// direction numbers), which the parser reads with GETB at offsets 4, 5 and 6.
import { dictKey, dictText } from "./zchars.ts";

export class Word {
  constructor(
    /** Dictionary key (the first six Z-characters). */
    readonly key: string,
    /** How the original prints this word (PRINTB), e.g. "flashl". */
    readonly text: string,
    readonly ps: number,
    readonly v1: number,
    readonly v2: number,
  ) {}

  getByte(off: number): number {
    if (off === 4) return this.ps;
    if (off === 5) return this.v1;
    if (off === 6) return this.v2;
    throw new Error(`GETB of dictionary word "${this.text}" at offset ${off}`);
  }

  toString(): string {
    return `W?${this.text}`;
  }
}

export const dictionary = new Map<string, Word>();

/** Adds a word: [text, ps, v1, v2]. */
export function defineWord(text: string, ps: number, v1: number, v2: number): Word {
  const key = dictKey(text);
  const w = new Word(key, dictText(text), ps, v1, v2);
  dictionary.set(key, w);
  return w;
}

export function lookupWord(text: string): Word | undefined {
  return dictionary.get(dictKey(text));
}

export function word(text: string): Word {
  const w = lookupWord(text);
  if (!w) throw new Error(`no dictionary word "${text}"`);
  return w;
}

/** Characters that are words on their own (the dictionary's separators). */
export const SEPARATORS = [".", ",", '"'];
