# Porting notes

How Leather Goddesses of Phobos got from ZIL to TypeScript, which parts of
the original's behaviour had to be reproduced beyond what the source says,
where the port deliberately differs, and how it was checked against the
released game.

## Starting point

The source is Infocom's development directory for the game, published in the
historicalsource collection:
<https://github.com/historicalsource/leathergoddesses>. It holds the ZIL files
(`x1.zil` includes the rest), the assembly files the ZIL compiler (ZILCH)
produced from them (`*.zap`, including `x1dat.zap` with the object, dictionary
and syntax tables and `x1str.zap` with the strings), and a compiled story file,
`COMPILED/x1.z3`: release 59, serial 860730.

The ZIL files are copied into `reference/zil/` unchanged. The collection's own
README warns that the source is a snapshot of the development system and may
not be exactly what shipped. For this game the two turned out to match
everywhere the checks below could reach, except one object
([the scrap of paper](#the-scrap-of-paper)).

## Translation, not emulation

The port does not run the story file. Every routine, object, room, global,
table and syntax in the ZIL source becomes TypeScript, and the result runs
directly on a small runtime (`src/engine/`) that provides what ZIL code expects
of the Z-machine.

The translation is done by a program, `tools/zil2ts/`, not by hand:

| file          | role                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| `reader.ts`   | reads MDL/ZIL syntax (forms, lists, strings, `%<...>` macros, `#BYTE`, …)      |
| `analyze.ts`  | collects routines, objects, rooms, globals, constants and syntaxes            |
| `vocab.ts`    | builds the dictionary and the syntax tables the way ZILCH laid them out       |
| `emit.ts`     | translates routine bodies: `COND`, `REPEAT`, `PROG`, `RETURN`, `AGAIN`, …      |
| `main.ts`     | decides where everything lives and writes `src/game/`                         |
| `names.ts`    | naming: `V-TAKE` → `vTake`, `ACCESSIBLE?` → `isAccessible`, `,HERE` → `G.here` |
| `overrides.ts`| the few hand-written routines and data fixes (listed below)                   |

`npm run translate` regenerates all of `src/game/` (763 routines, 228 objects,
978 dictionary words) and must reproduce the checked-in files exactly. So the
port can always be traced back to the original source and rebuilt from it.
Nothing under `src/game/` is edited by hand.

Each ZIL file becomes a module of the same name, in the same order, with the
same routines. For example, from `verbs.zil`:

```
<ROUTINE V-READ ()
	 <COND (<FSET? ,PRSO ,READBIT>
		<TELL <GETP ,PRSO ,P?TEXT> CR>)
               (T
                <CANT-VERB-A-PRSO "read">)>>
```

becomes, in `verbs.ts`:

```ts
export function vRead(): any {
  if (hasFlag(G.prso, READBIT)) {
    tell(getp(G.prso, P.TEXT), "\n");
    return true;
  } else {
    return cantVerbAPrso("read");
  }
}
```

Globals that the code assigns to live in the record `G`. Globals that are
never assigned become constants. Tables stay tables, because the parser and
much of the game treat them as memory.

## The runtime

ZIL programs assume a machine with byte-addressed memory. The runtime keeps
that model wherever game code can see it, but it holds real values rather
than numbers:

- **Tables** (`table.ts`) support word and byte access (`GET`/`GETB`), pointers
  into the middle of a table (`REST`, `BACK`) and pointer comparison, as ZIL
  code expects. A cell can hold an object, a dictionary word, a string or a
  routine, so the original algorithms run unchanged while the data stays
  readable.
- **Objects** (`object.ts`, `define.ts`) have the parent/sibling/child tree, 31
  attribute flags and numbered property tables. Their byte layout is the one
  ZILCH produced, so code that inspects properties with `GETPT`/`PTSIZE`/`GETB`
  (exits, `GLOBAL`, `THINGS`) works on them directly.
- **The dictionary** (`vocab.ts`, `zchars.ts`) stores each word with its three
  ZILCH bytes (part of speech and two values), which the parser reads with
  `GETB`. It also keeps the version-3 limit of six Z-characters per word, so
  `flashlight` and `flashl` are the same word.
- **I/O** (`runtime.ts`, `machine.ts`): `READ` can be called from deep inside a
  routine, as in death prompts, yes/no questions and "hit RETURN" pauses.
  Rather than make every routine asynchronous, the machine snapshots the world
  at the start of each turn. When a `READ` needs input the player hasn't typed
  yet, the turn is abandoned. When the answer arrives, the turn is replayed
  from the snapshot with the answer queued, and output already shown is
  suppressed. This works because the game is deterministic, random numbers
  included (`rng.ts`). The same snapshots provide undo, autosave, `SAVE` and
  `RESTORE`.

## Matching the release, not just the source

Translating the source faithfully is not enough, because the released game
also carries the behaviour of ZILCH and the Z-machine. A few of the source's
bugs are observable, and the release players knew is the result of compiling
them. These are reproduced:

- **Numbering.** Objects, attribute flags and dictionary words keep their
  release-59 numbers and addresses (`tools/zil2ts/original-layout.json`),
  because game code can observe them. Examples are object order in the
  containment tree, `NEXTP` order, and bytes read through a stray pointer.
- **Syntax order.** ZILCH stored each verb's syntaxes in reverse order of
  definition, and the parser takes the last match, so the port stores them the
  same way. Initial object trees are likewise built in the order that gives
  ZILCH's sibling order.
- **Compiled strings.** `|` is a newline, a line break right after `|` is
  dropped, and any other line break is a space.
- **`<SET X constant>` as a condition** counts as true: ZILCH compiled it as a
  store whose branch was discarded. The parser relies on this with
  `<SET VAL 0>`.
- **`V-FILL`** has an `<AND <OR ...> <OR ...>>` that ZILCH mis-compiled. The
  released game fills things the source says it shouldn't, and the port
  follows the release (`overrides.ts`).
- **Empty strings.** ZILCH assembled `""` as zero bytes, so a property holding
  `""` pointed at whichever string came next in the story file. Fourteen
  placeholder `SDESC`/`ODOR` properties start out with that unrelated text,
  which shows up if one is printed before the game replaces it, for example
  "You're not holding the man." (`COMPILED_EMPTY_STRINGS` in `overrides.ts`).
- **Stray reads.** When the parser merges an orphaned command that has no
  verb, it reads header word 0 as if it were a dictionary entry, and its
  "parts of speech" bytes make it an adjective. `NUMBER?` called with no
  argument reads a dictionary word's address as a length and position, and
  can run off the end of the input buffer into the ones after it. The runtime
  has the release's header bytes and word addresses, and links the input
  buffers as if adjacent, as they were in memory. Any other read of raw memory
  is an error, so a new case can't pass silently.
- **`GLOBAL-CHECK`** named the pseudo-object by copying the noun's encoded
  dictionary text over the object's short name. The port does the same with
  `setPseudoName()`.
- **`RESTART`** reloads the world but leaves the random number generator
  running, as the Z-machine does.
- **`IN? x 0`** is true for an object with no parent.

## Where the port differs

Deliberate differences, each small:

- **`V-UNCOVER`** refers to `,OBJECT`, which is not defined anywhere. ZILCH
  assembled it as the object table's address, so in the released game
  `uncover trent` performs `UNDRESS` on a garbage object number and prints
  corrupted text:
  "A slap across the face alerts you that the  s  already rYou'll ruzkgz…".
  The port uses `PRSO`, the evident intent: "A slap across the face alerts
  you that Trent isn't that hot to trot." (`SOURCE_FIXES` in `overrides.ts`).
- **Hardware.** `CLEAR-SCREEN` clears the story view instead of printing 24
  blank lines. The status line is drawn by the browser. `SCRIPT` sets the
  header bit but there is no printer; the browser offers the transcript as a
  download instead. `VERIFY` always succeeds.
- **Saved games** are JSON snapshots, stored relative to the freshly built
  world (about 10 KB), not Quetzal files. They can't be exchanged with a
  Z-machine interpreter.
- **Random numbers** come from a seedable xoshiro128** generator, not an
  interpreter's. Random events follow the same rules and odds as the original,
  but a given seed won't reproduce a particular interpreter's sequence.

### The scrap of paper

The scrap of paper in Trent's cell is the one place where release 59 was built
from a different version of the source. In the published source the paper has
an action routine, `SCRAP-OF-PAPER-F`, that prints a word-search matrix and
turns on fixed-pitch output ("for Mac"). In the release (`x1dat.zap` and
`x1.z3` agree), the paper has no action routine, and the matrix is its `TEXT`
property, printed by `V-READ`. The difference shows up in two ways: the
source's routine also answered `read trent with paper`, which the release
refuses ("You can't read Trent!"), and the release ends the matrix with a
newline.

The port keeps the routine, because the browser uses its fixed-pitch switch to
set the grid in a monospaced font, a word search being unreadable otherwise.
It narrows the routine to `READ` with the paper as the direct object and adds
the newline, so the text matches the release exactly (`overrides.ts`).

## How it was checked

### Data against the compiled game

Three scripts in `tools/verify/` compare the port's generated data with the
original compiled game:

| script                  | compares                                                              | result                        |
| ----------------------- | --------------------------------------------------------------------- | ----------------------------- |
| `npm run verify:dictionary` | every dictionary word and its parts of speech, against `x1.z3`    | 978 of 978 words, identical   |
| `npm run verify:syntax`     | every verb's syntaxes (prepositions, `FIND` flags, search bits, action), against `x1dat.zap` | 183 verbs, identical |
| `npm run verify:objects`    | every object's initial tree position, flags, name and property values, against `x1dat.zap` | 228 objects, identical apart from the scrap of paper |

### Transcripts against the original game

`tools/verify/zmachine.ts` is a minimal version-3 Z-machine, written only as a
test oracle. It runs the original story file with the port's random number
generator, so a seed produces the same random events in both games.
`tools/verify/original.ts` plays the same commands through the original and
through the port, and compares the transcripts line by line. Blank lines are
ignored, since the original clears the screen with them, and so is the
`V-UNCOVER` line described above, the one deliberate difference in text.

```sh
npm run verify:original -- walk          # the winning playthrough, seeds 1-5
npm run verify:original -- fuzz 600      # random-command runs
npm run verify:original -- file cmds.txt # your own commands, one per line
```

- **Walkthrough.** The complete winning playthrough (about 325 commands, as a
  male character in `lewd` mode) gives transcripts identical to the original
  under seeds 1–5.
- **Fuzzing.** Each run plays a random-length prefix of the walkthrough, which
  puts the player somewhere in the middle of the game with some of it solved.
  It then adds 40 random commands built from the game's own vocabulary and
  syntaxes: every verb and syntax form, random nouns, adjectives, `all`,
  `it`, `all but`, directions, `again`, `yes`/`no`. `SAVE` and `RESTORE` are
  left out because the oracle has no file system. 600 runs (fuzzer seed
  12345) are all identical to the original. Of 2000 runs with fuzzer seed
  777, 1999 are identical. The remaining one (run 505) uncovers a character,
  the `V-UNCOVER` case above; later in that run a command using `him` is
  answered differently too. With the uncover command removed, the run is
  identical. That one garbage `PERFORM` in the original leaves effects the
  port, which doesn't make it, can't reproduce.

Differences found this way are how several of the release behaviours above
came to light, among them `V-FILL`, `RESTART` and the scrap of paper.

### Running the checks yourself

The reference files are not in this repository. Clone
<https://github.com/historicalsource/leathergoddesses> and point the scripts
at it:

```sh
export ZAP_DIR=path/to/leathergoddesses          # x1dat.zap, x1str.zap
export STORY_FILE=$ZAP_DIR/COMPILED/x1.z3        # release 59
npm run verify:dictionary
npm run verify:syntax
npm run verify:objects
npm run verify:original -- walk
npm run verify:original -- fuzz 600
```

### The test suite

`npm test` needs no reference files. It plays the walkthrough to a winning
finish (top rank, full score) under five seeds, and tests the session machine
(undo, `SAVE`/`RESTORE`, questions asked mid-turn, restart, resuming a saved
session) and the parser (`all`, `it`, `oops`, six-letter truncation).

## Changing the port

Change the translator or `tools/zil2ts/overrides.ts`, never `src/game/`
directly, then:

```sh
npm run translate   # regenerate src/game/
npm test
npm run verify:original -- walk && npm run verify:original -- fuzz 600
```

An override replaces one routine's translation with hand-written TypeScript
and should say why. The current overrides are `MAIN-LOOP` (the machine's turn
boundary), `GLOBAL-CHECK` (pseudo-object naming), `V-FILL` (the compiled
branch), `SCRAP-OF-PAPER-F` (the release's version of the paper) and
`CLEAR-SCREEN` (the browser's screen).
