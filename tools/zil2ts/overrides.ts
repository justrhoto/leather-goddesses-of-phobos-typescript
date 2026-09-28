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
