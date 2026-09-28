// Hand-written replacements for the few routines that talk to the hardware
// or rely on Z-machine memory layout in ways that have no direct equivalent.
import type { Where } from "./emit.ts";

export interface Override {
  comment?: string;
  code: string;
  imports: Where[];
}

const RT = "../engine/runtime.ts";
const M = "../engine/machine.ts";
const W = "./world.ts";

export const OVERRIDES: Record<string, Override> = {
  "MAIN-LOOP": {
    comment: "/** MAIN-LOOP: each pass is one turn; the machine checkpoints at the top of every pass. */",
    code: `
export function mainLoop(): any {
  for (;;) {
    machine().turnBoundary();
    mainLoop1();
  }
}`,
    imports: [{ module: M, name: "machine" }],
  },

  "GLOBAL-CHECK": {
    comment: `/**
 * GLOBAL-CHECK. The original named the pseudo-object by copying the noun's
 * encoded dictionary text over the object's short name (<PUT <BACK <GETPT
 * ,PSEUDO-OBJECT ,P?ACTION> 5> ...>); here that is setPseudoName().
 */`,
    code: `
export function globalCheck(tbl: any): any {
  let len: any = 0;
  let rmg: any = 0;
  let rmgl: any = 0;
  let cnt: any = 0;
  let obj: any = 0;
  let obits: any = 0;
  len = get(tbl, P_MATCHLEN);
  obits = G.pSlocbits;
  if (rmg = getpt(G.here, P.GLOBAL)) {
    rmgl = ptsize(rmg) - 1;
    for (;;) {
      if (isThisIt(obj = getb(rmg, cnt))) {
        objFound(obj, tbl);
      }
      if (++cnt > rmgl) {
        break;
      }
    }
  }
  if (rmg = getp(G.here, P.THINGS)) {
    rmgl = get(rmg, 0);
    cnt = 0;
    for (;;) {
      if (G.pNam && !eq(G.pNam, get(rmg, cnt + 1))) {
      } else if (G.pAdj && !eq(G.pAdj, isWt(get(rmg, cnt + 2), PS.ADJECTIVE, P1.ADJECTIVE))) {
      } else if (G.pNam || G.pAdj) {
        G.lastPseudoLoc = G.here;
        putp(PSEUDO_OBJECT, P.ACTION, get(rmg, cnt + 3));
        setPseudoName(PSEUDO_OBJECT, get(rmg, cnt + 1));
        objFound(PSEUDO_OBJECT, tbl);
        break;
      }
      cnt = cnt + 3;
      if (!(cnt < rmgl)) {
        break;
      }
    }
  }
  if (eq(get(tbl, P_MATCHLEN), len)) {
    G.pSlocbits = -1;
    G.pTable = tbl;
    doSl(GLOBAL_OBJECTS, 1, 1);
    return G.pSlocbits = obits;
  }
  return false;
}`,
    imports: [
      { module: RT, name: "get" }, { module: RT, name: "getb" }, { module: RT, name: "getp" }, { module: RT, name: "getpt" },
      { module: RT, name: "putp" }, { module: RT, name: "ptsize" }, { module: RT, name: "eq" },
      { module: RT, name: "setPseudoName" }, { module: W, name: "G" }, { module: W, name: "P" }, { module: W, name: "PS" },
      { module: W, name: "P1" }, { module: W, name: "PSEUDO_OBJECT" }, { module: W, name: "GLOBAL_OBJECTS" },
      { module: W, name: "P_MATCHLEN" },
    ],
  },

  "V-FILL": {
    comment: `/**
 * V-FILL, as the original compiler actually built it. The source reads
 *   <AND <OR <FSET? ,PRSO ,CONTBIT>
 *            <AND <PRSO? ,STAIN ,CREAM> <FSET? ,STAIN ,MUNGBIT>>>
 *        <OR <PRSI? ,WATER> <GLOBAL-IN? ,WATER ,HERE>>>
 * but ZILCH sent the failure of <PRSO? ,STAIN ,CREAM> to the "OR succeeded"
 * branch, so in the released game the first test only fails for the cream or
 * stain before the stain is munged. (This is the only place the source uses
 * that shape of expression.)
 */`,
    code: `
export function vFill(): any {
  const fillable = hasFlag(G.prso, CONTBIT) || !prsoIs(STAIN, CREAM) || hasFlag(STAIN, MUNGBIT);
  if (fillable && (prsiIs(WATER) || isGlobalIn(WATER, G.here))) {
    return wastes();
  } else if (!G.prsi) {
    tell(THERES_NOTHING, "to fill it with.\\n");
    return true;
  } else {
    return impossibles();
  }
}`,
    imports: [
      { module: RT, name: "hasFlag" }, { module: RT, name: "tell" }, { module: W, name: "G" },
      { module: W, name: "CONTBIT" }, { module: W, name: "MUNGBIT" }, { module: W, name: "STAIN" },
      { module: W, name: "CREAM" }, { module: W, name: "WATER" }, { module: W, name: "THERES_NOTHING" },
      { module: W, name: "prsoIs" }, { module: W, name: "prsiIs" },
      { module: "./verbs.ts", name: "isGlobalIn" }, { module: "./verbs.ts", name: "wastes" },
      { module: "./verbs.ts", name: "impossibles" },
    ],
  },

  "SCRAP-OF-PAPER-F": {
    comment: `/**
 * SCRAP-OF-PAPER-F. Release 59 was built from an earlier version of the paper:
 * it had no action routine, and READ printed its TEXT property (the matrix,
 * then CR). So READ only shows the matrix when the paper is the direct object
 * ("read trent with paper" is refused by V-READ), and the matrix ends with CR.
 * The source's fixed-pitch switch is kept so the browser prints the grid in a
 * monospaced font; it does not change the text.
 */`,
    code: `
export function scrapOfPaperF(): any {
  if (verbIs(V.READ) && prsoIs(SCRAP_OF_PAPER)) {
    tell("There's a seemingly meaningless matrix of letters on the paper:\\n");
    put(HEADER, 8, get(HEADER, 8) | 2);
    tell("   HESOHREBBUR\\n   ILSSSIPNGEF\\n   RGIUGHTHDEN\\n   SNKOOBENOHP\\n   FALYTMERATP\\n   SHEADLIGHTO\\n   SLLABNOTTOC");
    put(HEADER, 8, get(HEADER, 8) & -3);
    tell("\\n");
    return true;
  }
  return false;
}`,
    imports: [
      { module: RT, name: "tell" }, { module: RT, name: "get" }, { module: RT, name: "put" }, { module: RT, name: "HEADER" },
      { module: W, name: "V" }, { module: W, name: "SCRAP_OF_PAPER" }, { module: W, name: "verbIs" }, { module: W, name: "prsoIs" },
    ],
  },

  "CLEAR-SCREEN": {
    comment: "/** CLEAR-SCREEN: the original scrolled 24 blank lines; the browser clears the story view. */",
    code: `
export function clearScreen(): any {
  return rtClearScreen();
}`,
    imports: [{ module: RT, name: "clearScreen as rtClearScreen" }],
  },
};

/**
 * References in the original that have no meaningful value. Each is listed in
 * PORTING.md. Maps "ROUTINE ,NAME" to the global used instead.
 */
export const SOURCE_FIXES: Record<string, { use: string; why: string }> = {
  "V-UNCOVER ,OBJECT": {
    use: "PRSO",
    why: "OBJECT is undefined in the source; ZILCH assembled it as the object table's address, so the original performed UNDRESS on a garbage object number. PRSO is the evident intent.",
  },
};

/**
 * The original compiler assembled an empty string ("") as zero bytes, so its
 * address was that of whichever string came next in the story file. Objects
 * whose placeholder SDESC/ODOR was "" therefore started out with an unrelated
 * text, which the original shows if one is printed before the game replaces
 * it (e.g. "You're not holding the man."). These are the texts in release 59.
 */
export const COMPILED_EMPTY_STRINGS: Record<string, string> = {
  "THORBAST-SWORD SDESC": "get past the monster",
  "SIDEKICKS-BODY SDESC": "Stepping off the cliff would mean a fatal plunge to the jungle below.",
  "SIDEKICK SDESC": "A crumpled paper lies discarded in the corner. There seems to be some writing on it.",
  "PHOTO SDESC": "phoo",
  "SPLATTERED-SIDEKICK SDESC": "sword",
  "MAN-WOMAN SDESC": "man",
  "THORBAST SDESC": "get past the monster",
  "SULTAN SDESC": "you answer incorrectly",
  "POWER-TRANSMITTER SDESC": "slight",
  "RUINED-CASTLE-1 SDESC":
    "Princess Theta stands demurely by her father's throne, buried up to her thighs in forty-five degree angles.",
  "RUINED-CASTLE-2 SDESC": "east",
  "RUINED-CASTLE-3 SDESC":
    "This dock, which extends north into a broad canal, is crafted of fine woods from across the solar system: hickory wood from the forests of Earth, and dickory wood from the jungles of Venus. A path leads south.",
  "YOUNG-WOMAN SDESC": "get past the monster",
  "HAREM ODOR": " forewarned, the guards reduce you to three dots.",
};
