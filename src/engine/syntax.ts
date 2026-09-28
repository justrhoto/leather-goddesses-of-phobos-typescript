// Builders for the parser's compiled tables (VERBS, ACTIONS, PREACTIONS,
// PREPOSITIONS), in the byte layout parser code reads with GETB/GET.
import { byte, table, ltable, type Table } from "./table.ts";
import type { Word } from "./vocab.ts";

export interface SyntaxSpec {
  objects: number;
  prep1?: number;
  prep2?: number;
  find1?: number;
  find2?: number;
  loc1?: number;
  loc2?: number;
  action: number;
}

/** One verb's syntax list: a count byte, then 8 bytes per syntax. */
export function syntaxTable(verb: string, specs: SyntaxSpec[]): Table {
  const items: any[] = [byte(specs.length)];
  for (const s of specs) {
    items.push(
      byte(s.objects), byte(s.prep1 ?? 0), byte(s.prep2 ?? 0), byte(s.find1 ?? 0), byte(s.find2 ?? 0),
      byte(s.loc1 ?? 0), byte(s.loc2 ?? 0), byte(s.action),
    );
  }
  return table(`syntax ${verb}`, items);
}

/** VERBS: indexed by 255 - verb number. */
export function verbsTable(entries: [number, Table][]): Table {
  const items: any[] = [];
  for (const [act, t] of entries) items[255 - act] = t;
  return table("VERBS", Array.from(items, (x) => x ?? 0));
}

/** ACTIONS / PREACTIONS: routine per action number. */
export function actionTable(name: string, entries: [number, Function | 0][]): Table {
  const items: any[] = [];
  for (const [v, fn] of entries) items[v] = fn;
  return table(name, Array.from(items, (x) => x ?? 0));
}

/** PREPOSITIONS: a count, then (word, preposition number) pairs. */
export function prepositionTable(pairs: [Word, number][]): Table {
  const t = ltable("PREPOSITIONS", pairs.flat());
  // The count is of pairs, not words.
  t.buf.putWord(0, pairs.length);
  return t;
}
