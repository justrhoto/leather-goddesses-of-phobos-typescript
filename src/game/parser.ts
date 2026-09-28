// parser.ts — from PARSER.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  D, T, TR, apply, back, btst, clearFlag, crlf, div, eq, first, get, getb, getp, getpt, hasFlag, isIn,
  loc, next, printb, printc, printd, ptsize, put, putb, putp, read, rest, setFlag, tell,
} from "../engine/runtime.ts";
import {
  byte, itable, table,
} from "../engine/table.ts";
import {
  cantUseThatWay, recognize, referring, seeManual,
} from "./globals.ts";
import {
  PREPOSITIONS, VERBS,
} from "./syntax.ts";
import {
  isAccessible, isUltimatelyIn, isUntouchable, isVisible, itake, stop,
} from "./verbs.ts";
import {
  ACT, ACTORBIT, CC_OCLAUSE, CC_SBPTR, CC_SEPTR, FEMALEBIT, G, GLOBAL_OBJECTS, GLOBAL_ROOM, HANDS, HER,
  HIM, INTNUM, INVISIBLE, IT, LAST_OBJECT, ME, NARTICLEBIT, NOT_HERE_OBJECT, NOUN_MISSING, NO_VERB,
  ONBIT, OPENBIT, O_END, O_LENGTH, O_PTR, O_START, P, P1, PR, PROTAGONIST, PS, PSEUDO_OBJECT, P_ALL,
  P_INBUF_LENGTH, P_INHIBIT, P_ITBLLEN, P_LEXELEN, P_LEXSTART, P_LEXWORDS, P_MATCHLEN, P_MOBY_FLAG,
  P_NC1, P_NC1L, P_NC2, P_NC2L, P_ONE, P_P1BITS, P_P1OFF, P_PREP1, P_PREP1N, P_PREP2, P_PSOFF,
  P_SACTION, P_SBITS, P_SFWIM1, P_SFWIM2, P_SLOC1, P_SLOC2, P_SONUMS, P_SPREP1, P_SPREP2, P_SRCALL,
  P_SRCBOT, P_SRCTOP, P_SYNLEN, P_VERB, P_VERBN, P_WORDLEN, RAFT, RLANDBIT, ROOMS, SC, SEARCHBIT, SH,
  SHAVE, SIR, SMANY, SOG, STAKE, SURFACEBIT, TOO_DARK, TRANSBIT, TRYTAKEBIT, V, VEHBIT, W, YNH,
  YOU_CANT, prsoIs, verbIs,
} from "./world.ts";

G.pAnd = false;

G.prsa = false;

G.prsi = false;

G.prso = false;

G.pTable = 0;

G.pOneobj = 0;

G.pSyntax = 0;

export const P_CCTBL = table("P-CCTBL", [0, 0, 0]);

G.pLen = 0;

G.winner = 0;

export const P_LEXV = itable("P-LEXV", 60, ["LEXV"], [0, byte(0), byte(0)]);

export const AGAIN_LEXV = itable("AGAIN-LEXV", 60, ["LEXV"], [0, byte(0), byte(0)]);

export const RESERVE_LEXV = itable("RESERVE-LEXV", 60, ["LEXV"], [0, byte(0), byte(0)]);

G.reservePtr = false;

export const P_INBUF = itable("P-INBUF", 120, ["BYTE","LENGTH"], [0]);

export const RESERVE_INBUF = itable("RESERVE-INBUF", 120, ["BYTE","LENGTH"], [0]);

export const OOPS_INBUF = itable("OOPS-INBUF", 120, ["BYTE","LENGTH"], [0]);

export const OOPS_TABLE = table("OOPS-TABLE", [false, false, false, false]);

G.pCont = false;

G.pItObject = false;

G.pHimObject = false;

G.pHerObject = false;

export function thisIsIt(obj: any): any {
  if (!obj || verbIs(V.WALK) && prsoIs(obj) || eq(obj, PROTAGONIST) || eq(obj, NOT_HERE_OBJECT, ME, GLOBAL_ROOM)) {
    return true;
  } else if (hasFlag(obj, FEMALEBIT)) {
    return G.pHerObject = obj;
  } else if (hasFlag(obj, ACTORBIT)) {
    return G.pHimObject = obj;
  } else {
    return G.pItObject = obj;
  }
}

G.lastPseudoLoc = false;

G.pOflag = false;

G.pMerged = false;

G.pAclause = false;

G.pAnam = false;

G.pAadj = false;

export const P_ITBL = table("P-ITBL", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

export const P_OTBL = table("P-OTBL", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

export const P_VTBL = table("P-VTBL", [0, byte(0), byte(0)]);

export const P_OVTBL = table("P-OVTBL", [0, byte(0), byte(0)]);

G.pNcn = 0;

G.quoteFlag = false;

G.pEndOnPrep = false;

G.pPrsaWord = false;

export function parser(): any {
  let ptr: any = P_LEXSTART;
  let wrd: any = 0;
  let val: any = 0;
  let verb: any = false;
  let omerged: any = 0;
  let owinner: any = 0;
  let len: any = 0;
  let dir: any = false;
  let nw: any = 0;
  let cnt: any = -1;
  let _t1: any;
  for (;;) {
    if ((cnt = cnt + 1) > P_ITBLLEN) {
      break;
    } else {
      if (!G.pOflag) {
        put(P_OTBL, cnt, get(P_ITBL, cnt));
      }
      put(P_ITBL, cnt, 0);
    }
  }
  omerged = G.pMerged;
  owinner = G.winner;
  G.pAdverb = false;
  G.pMerged = false;
  G.pEndOnPrep = false;
  put(G.pPrso, P_MATCHLEN, 0);
  put(G.pPrsi, P_MATCHLEN, 0);
  put(P_BUTS, P_MATCHLEN, 0);
  if (!G.quoteFlag && !eq(G.winner, PROTAGONIST)) {
    G.winner = PROTAGONIST;
    if (!hasFlag(loc(G.winner), VEHBIT)) {
      G.here = loc(G.winner);
    }
    G.lit = isLit(G.here);
  }
  if (G.reservePtr) {
    ptr = G.reservePtr;
    stuff(P_LEXV, RESERVE_LEXV);
    inbufStuff(P_INBUF, RESERVE_INBUF);
    if (!eq(G.verbosity, 0) && eq(PROTAGONIST, G.winner)) {
      crlf();
    }
    G.reservePtr = false;
    G.pCont = false;
  } else if (G.pCont) {
    ptr = G.pCont;
    if (!eq(G.verbosity, 0) && eq(PROTAGONIST, G.winner)) {
      crlf();
    }
    G.pCont = false;
  } else {
    G.winner = PROTAGONIST;
    G.quoteFlag = false;
    if (!hasFlag(loc(G.winner), VEHBIT)) {
      G.here = loc(G.winner);
    }
    G.lit = isLit(G.here);
    if (!eq(G.verbosity, 0)) {
      crlf();
    }
    tell(">");
    read(P_INBUF, P_LEXV);
    getb(P_LEXV, P_LEXWORDS);
  }
  G.pLen = getb(P_LEXV, P_LEXWORDS);
  if (!G.pLen) {
    tell("[Come again?]\n");
    return false;
  } else if (eq(get(P_LEXV, ptr), W.OOPS)) {
    if (eq(get(P_LEXV, ptr + P_LEXELEN), W.PERIOD, W.COMMA)) {
      ptr = ptr + P_LEXELEN;
      G.pLen = G.pLen - 1;
    }
    if (!(G.pLen > 1)) {
      cantUseThatWay("OOPS");
      return false;
    } else if (get(OOPS_TABLE, O_PTR)) {
      if (G.pLen > 2) {
        tell("[Warning: Only the first word after OOPS is used.]\n");
      }
      put(AGAIN_LEXV, get(OOPS_TABLE, O_PTR), get(P_LEXV, ptr + P_LEXELEN));
      G.winner = owinner;
      inbufAdd(getb(P_LEXV, ptr * P_LEXELEN + 6), getb(P_LEXV, ptr * P_LEXELEN + 7), get(OOPS_TABLE, O_PTR) * P_LEXELEN + 3);
      stuff(P_LEXV, AGAIN_LEXV);
      G.pLen = getb(P_LEXV, P_LEXWORDS);
      ptr = get(OOPS_TABLE, O_START);
      inbufStuff(P_INBUF, OOPS_INBUF);
    } else {
      put(OOPS_TABLE, O_END, false);
      tell("[There was no word to replace!]\n");
      return false;
    }
  } else {
    put(OOPS_TABLE, O_END, false);
  }
  if (eq(get(P_LEXV, ptr), W.AGAIN, W.G)) {
    if (G.pOflag) {
      cantUseThatWay("AGAIN");
      return false;
    } else if (!G.pWon) {
      tell("[That would just repeat a mistake!]\n");
      return false;
    } else if (!eq(owinner, PROTAGONIST) && !isVisible(owinner)) {
      tell("[", YOU_CANT, "see ", D(owinner), " any more.]\n");
      return false;
    } else if (G.pLen > 1) {
      if (eq(get(P_LEXV, ptr + P_LEXELEN), W.PERIOD, W.COMMA, W.THEN) || eq(get(P_LEXV, ptr + P_LEXELEN), W.AND)) {
        ptr = ptr + 2 * P_LEXELEN;
        putb(P_LEXV, P_LEXWORDS, getb(P_LEXV, P_LEXWORDS) - 2);
      } else {
        recognize();
        return false;
      }
    } else {
      ptr = ptr + P_LEXELEN;
      putb(P_LEXV, P_LEXWORDS, getb(P_LEXV, P_LEXWORDS) - 1);
    }
    if (getb(P_LEXV, P_LEXWORDS) > 0) {
      stuff(RESERVE_LEXV, P_LEXV);
      inbufStuff(RESERVE_INBUF, P_INBUF);
      G.reservePtr = ptr;
    } else {
      G.reservePtr = false;
    }
    G.winner = owinner;
    G.pMerged = omerged;
    inbufStuff(P_INBUF, OOPS_INBUF);
    stuff(P_LEXV, AGAIN_LEXV);
    cnt = -1;
    dir = G.againDir;
    for (;;) {
      if (++cnt > P_ITBLLEN) {
        break;
      } else {
        put(P_ITBL, cnt, get(P_OTBL, cnt));
      }
    }
  } else {
    stuff(AGAIN_LEXV, P_LEXV);
    inbufStuff(OOPS_INBUF, P_INBUF);
    put(OOPS_TABLE, O_START, ptr);
    put(OOPS_TABLE, O_LENGTH, 4 * G.pLen);
    len = 2 * (ptr + P_LEXELEN * getb(P_LEXV, P_LEXWORDS));
    put(OOPS_TABLE, O_END, getb(P_LEXV, len - 1) + getb(P_LEXV, len - 2));
    G.reservePtr = false;
    len = G.pLen;
    G.pNcn = 0;
    G.pGetflags = 0;
    for (;;) {
      if ((G.pLen = G.pLen - 1) < 0) {
        G.quoteFlag = false;
        break;
      } else if (isNaughtyWord(wrd = get(P_LEXV, ptr))) {
        return false;
      } else if ((wrd = get(P_LEXV, ptr)) || (wrd = isNumber(ptr))) {
        nw = nextWord(ptr);
        if (eq(wrd, W.TO) && eq(verb, ACT.TELL, ACT.ASK) && isWt(nw, PS.VERB, P1.VERB)) {
          put(P_ITBL, P_VERB, ACT.TELL);
          wrd = W.QUOTE;
        } else if (eq(wrd, W.THEN) && G.pLen > 0 && !verb && !G.quoteFlag) {
          put(P_ITBL, P_VERB, ACT.TELL);
          put(P_ITBL, P_VERBN, 0);
          wrd = W.QUOTE;
        }
        if (eq(wrd, W.THEN, W.PERIOD) || eq(wrd, W.QUOTE)) {
          if (eq(wrd, W.QUOTE)) {
            if (G.quoteFlag) {
              G.quoteFlag = false;
            } else {
              G.quoteFlag = true;
            }
          }
          !G.pLen || (G.pCont = ptr + P_LEXELEN);
          putb(P_LEXV, P_LEXWORDS, G.pLen);
          break;
        } else if ((val = isWt(wrd, PS.DIRECTION, P1.DIRECTION)) && eq(verb, false, ACT.WALK, ACT.GO) && (eq(len, 1) || eq(len, 2) && eq(verb, ACT.WALK, ACT.GO) || eq(nw, W.THEN, W.PERIOD, W.QUOTE) && !(len < 2) || G.quoteFlag && eq(len, 2) && eq(nw, W.QUOTE) || len > 2 && eq(nw, W.COMMA, W.AND))) {
          dir = val;
          if (eq(nw, W.COMMA, W.AND)) {
            changeLexv(ptr + P_LEXELEN, W.THEN);
          }
          if (!(len > 2)) {
            G.quoteFlag = false;
            break;
          }
        } else if ((val = isWt(wrd, PS.VERB, P1.VERB)) && !verb) {
          G.pPrsaWord = wrd;
          verb = val;
          put(P_ITBL, P_VERB, val);
          put(P_ITBL, P_VERBN, P_VTBL);
          put(P_VTBL, 0, wrd);
          putb(P_VTBL, 2, getb(P_LEXV, cnt = ptr * 2 + 2));
          putb(P_VTBL, 3, getb(P_LEXV, cnt + 1));
        } else if ((val = isWt(wrd, PS.PREPOSITION, 0)) || (eq(wrd, W.ALL, W.ONE, W.BOTH) || eq(wrd, W.EVERYT) || isWt(wrd, PS.ADJECTIVE) || isWt(wrd, PS.OBJECT)) && (val = 0)) {
          if (val && eq(wrd, W.BACK) && !eq(verb, ACT.HAND)) {
            val = 0;
          }
          if (G.pLen > 0 && eq(nw, W.OF) && !val && !eq(wrd, W.ALL, W.ONE, W.A) && !eq(wrd, W.BOTH, W.EVERYT)) {
          } else if (!!val && (!G.pLen || eq(nw, W.THEN, W.PERIOD))) {
            G.pEndOnPrep = true;
            if (G.pNcn < 2) {
              put(P_ITBL, P_PREP1, val);
              put(P_ITBL, P_PREP1N, wrd);
            }
          } else if (eq(G.pNcn, 2)) {
            tell("[There were too many nouns in that sentence.]\n");
            return false;
          } else {
            G.pNcn = G.pNcn + 1;
            _t1 = ptr = clause(ptr, val, wrd);
            if (!_t1) {
              return false;
              _t1 = false;
            }
            _t1;
            if (ptr < 0) {
              G.quoteFlag = false;
              break;
            }
          }
        } else if (isWt(wrd, PS.BUZZ_WORD)) {
        } else if (eq(verb, ACT.TELL) && isWt(wrd, PS.VERB, P1.VERB) && eq(G.winner, PROTAGONIST)) {
          seeManual("talk to characters.");
          return false;
        } else {
          cantUse(ptr);
          return false;
        }
      } else {
        unknownWord(ptr);
        return false;
      }
      wrd;
      ptr = ptr + P_LEXELEN;
    }
  }
  put(OOPS_TABLE, O_PTR, false);
  if (dir) {
    G.prsa = V.WALK;
    G.prso = dir;
    G.pOflag = false;
    G.pWalkDir = dir;
    G.againDir = dir;
    return true;
  }
  G.pWalkDir = false;
  G.againDir = false;
  if (G.pOflag) {
    orphanMerge();
  }
  if (syntaxCheck() && snarfObjects() && manyCheck() && takeCheck()) {
    return true;
  }
  return false;
}

export function changeLexv(ptr: any, wrd: any, isPtrs: any = false): any {
  let x: any = 0;
  let y: any = 0;
  let z: any = 0;
  if (isPtrs) {
    x = 2 + 2 * (ptr - P_LEXELEN);
    y = getb(P_LEXV, x);
    z = 2 + 2 * ptr;
    putb(P_LEXV, z, y);
    putb(AGAIN_LEXV, z, y);
    y = getb(P_LEXV, 1 + x);
    z = 3 + 2 * ptr;
    putb(P_LEXV, z, y);
    putb(AGAIN_LEXV, z, y);
  }
  put(P_LEXV, ptr, wrd);
  put(AGAIN_LEXV, ptr, wrd);
  return true;
}

G.pWalkDir = false;

G.againDir = false;

G.pDirection = false;

export function stuff(dest: any, src: any, max: any = 29): any {
  let ptr: any = P_LEXSTART;
  let ctr: any = 1;
  let bptr: any = 0;
  putb(dest, 0, getb(src, 0));
  putb(dest, 1, getb(src, 1));
  for (;;) {
    put(dest, ptr, get(src, ptr));
    bptr = ptr * 2 + 2;
    putb(dest, bptr, getb(src, bptr));
    bptr = ptr * 2 + 3;
    putb(dest, bptr, getb(src, bptr));
    ptr = ptr + P_LEXELEN;
    if (++ctr > max) {
      return true;
    }
  }
}

export function inbufStuff(dest: any, src: any): any {
  let cnt: any = -1;
  for (;;) {
    if (++cnt > P_INBUF_LENGTH) {
      return true;
    } else {
      putb(dest, cnt, getb(src, cnt));
    }
  }
}

export function inbufAdd(len: any, beg: any, slot: any): any {
  let dbeg: any = 0;
  let ctr: any = 0;
  let tmp: any = 0;
  if (tmp = get(OOPS_TABLE, O_END)) {
    dbeg = tmp;
  } else {
    dbeg = getb(AGAIN_LEXV, tmp = get(OOPS_TABLE, O_LENGTH)) + getb(AGAIN_LEXV, tmp + 1);
  }
  put(OOPS_TABLE, O_END, dbeg + len);
  for (;;) {
    putb(OOPS_INBUF, dbeg + ctr, getb(P_INBUF, beg + ctr));
    ctr = ctr + 1;
    if (eq(ctr, len)) {
      break;
    }
  }
  putb(AGAIN_LEXV, slot, dbeg);
  putb(AGAIN_LEXV, slot - 1, len);
  return true;
}

export function isWt(ptr: any, bit: any, b1: any = 5): any {
  let offs: any = P_P1OFF;
  let typ: any = 0;
  if (btst(typ = getb(ptr, P_PSOFF), bit)) {
    if (b1 > 4) {
      return true;
    } else if (eq(bit, PS.OBJECT)) {
      return 1;
    } else {
      typ = typ & P_P1BITS;
      if (!eq(typ, b1)) {
        offs = offs + 1;
      }
      return getb(ptr, offs);
    }
  }
  return false;
}

export function nextWord(ptr: any): any {
  let nw: any = 0;
  if (!!G.pLen) {
    if (nw = get(P_LEXV, ptr + P_LEXELEN)) {
      return nw;
    } else {
      return isNumber(ptr + P_LEXELEN);
    }
  }
  return false;
}

export function clause(ptr: any, val: any, wrd: any): any {
  let off: any = 0;
  let num: any = 0;
  let andflg: any = false;
  let isFirst: any = true;
  let nw: any = 0;
  off = (G.pNcn - 1) * 2;
  if (!eq(val, 0)) {
    put(P_ITBL, num = P_PREP1 + off, val);
    put(P_ITBL, num + 1, wrd);
    ptr = ptr + P_LEXELEN;
  } else {
    G.pLen = G.pLen + 1;
  }
  if (!G.pLen) {
    G.pNcn = G.pNcn - 1;
    return -1;
  }
  put(P_ITBL, num = P_NC1 + off, rest(P_LEXV, ptr * 2));
  for (;;) {
    if ((G.pLen = G.pLen - 1) < 0) {
      put(P_ITBL, num + 1, rest(P_LEXV, ptr * 2));
      return -1;
    }
    wrd = get(P_LEXV, ptr);
    if (isNaughtyWord(wrd)) {
      return false;
    } else if (wrd || (wrd = isNumber(ptr))) {
      nw = nextWord(ptr);
      if (isFirst && (eq(wrd, W.THE, W.A, W.AN) || val && isWt(wrd, PS.PREPOSITION) && !isWt(wrd, PS.ADJECTIVE))) {
        put(P_ITBL, num, rest(get(P_ITBL, num), 4));
      } else if (eq(wrd, W.AND, W.COMMA)) {
        andflg = true;
      } else if (eq(wrd, W.ALL, W.ONE, W.BOTH) || eq(wrd, W.EVERYT)) {
        if (eq(nw, W.OF)) {
          G.pLen = G.pLen - 1;
          ptr = ptr + P_LEXELEN;
        }
      } else if (eq(wrd, W.THEN, W.PERIOD) || isWt(wrd, PS.PREPOSITION) && get(P_ITBL, P_VERB) && !isFirst) {
        G.pLen = G.pLen + 1;
        put(P_ITBL, num + 1, rest(P_LEXV, ptr * 2));
        return ptr - P_LEXELEN;
      } else if (andflg && eq(get(P_ITBL, P_VERB), 0)) {
        ptr = ptr - 4;
        changeLexv(ptr + 2, W.THEN);
        G.pLen = G.pLen + 2;
      } else if (isWt(wrd, PS.OBJECT)) {
        if (G.pLen > 0 && eq(nw, W.OF) && !eq(wrd, W.ALL, W.EVERYT, W.ONE)) {
        } else if (eq(get(P_ITBL, P_VERB), ACT.SHOW, ACT.HAND, ACT.FEED) && eq(wrd, W.HER) && eq(nw, W.SWORD)) {
        } else if (isWt(wrd, PS.ADJECTIVE, P1.ADJECTIVE) && !!nw && !eq(nw, W.HIS, W.HER, W.MY) && (isWt(nw, PS.OBJECT) || isWt(nw, PS.ADJECTIVE)) && !eq(get(P_ITBL, P_VERB), ACT.SHOW, ACT.HAND, ACT.FEED)) {
        } else if (!andflg && !eq(nw, W.BUT, W.EXCEPT) && !eq(nw, W.AND, W.COMMA)) {
          put(P_ITBL, num + 1, rest(P_LEXV, (ptr + 2) * 2));
          return ptr;
        } else {
          andflg = false;
        }
      } else if (isWt(wrd, PS.ADJECTIVE) || isWt(wrd, PS.BUZZ_WORD)) {
      } else if (isWt(wrd, PS.PREPOSITION)) {
      } else {
        cantUse(ptr);
        return false;
      }
    } else {
      unknownWord(ptr);
      return false;
    }
    wrd;
    isFirst = false;
    ptr = ptr + P_LEXELEN;
  }
}

export function isNumber(ptr: any): any {
  let cnt: any = 0;
  let bptr: any = 0;
  let chr: any = 0;
  let sum: any = 0;
  let cctr: any = 0;
  let tmp: any = 0;
  let xptr: any = 0;
  cnt = getb(rest(P_LEXV, ptr * 2), 2);
  bptr = getb(rest(P_LEXV, ptr * 2), 3);
  for (;;) {
    if (sum > 10000) {
      return false;
    } else if ((cnt = cnt - 1) < 0) {
      break;
    } else {
      chr = getb(P_INBUF, bptr);
      if (chr < 58 && chr > 47) {
        sum = sum * 10 + (chr - 48);
      } else if (!eq(chr, 35)) {
        return false;
      }
      bptr = bptr + 1;
    }
  }
  changeLexv(ptr, W.NUMBER);
  if (eq(get(P_LEXV, ptr + P_LEXELEN), W.COMMA) && G.pLen > 1) {
    xptr = ptr + P_LEXELEN * 2;
    if (tmp = afterCommaCheck(xptr)) {
      cctr = getb(P_LEXV, ptr * 2 + 2);
      cctr = cctr + getb(P_LEXV, xptr * 2 + 2);
      cctr = cctr + 1;
      putb(P_LEXV, ptr * 2 + 2, cctr);
      if (eq(tmp, 1000)) {
        tmp = 0;
      }
      sum = 1000 * sum + tmp;
      cctr = G.pLen - 2;
      for (;;) {
        if (--cctr < 0) {
          break;
        } else {
          ptr = ptr + P_LEXELEN;
          xptr = ptr + 2 * P_LEXELEN;
          changeLexv(ptr, get(P_LEXV, xptr));
          putb(P_LEXV, ptr * 2 + 2, getb(P_LEXV, xptr * 2 + 2));
          putb(P_LEXV, ptr * 2 + 3, getb(P_LEXV, xptr * 2 + 3));
        }
      }
      G.pLen = G.pLen - 2;
      putb(P_LEXV, P_LEXWORDS, getb(P_LEXV, P_LEXWORDS) - 2);
    }
  }
  if (sum > 10000) {
    return false;
  }
  G.pNumber = sum;
  return W.NUMBER;
}

export function afterCommaCheck(ptr: any): any {
  let cnt: any = 0;
  let bptr: any = 0;
  let cctr: any = 0;
  let chr: any = 0;
  let sum: any = 0;
  cnt = getb(rest(P_LEXV, ptr * 2), 2);
  bptr = getb(rest(P_LEXV, ptr * 2), 3);
  for (;;) {
    if ((cnt = cnt - 1) < 0) {
      break;
    } else {
      chr = getb(P_INBUF, bptr);
      cctr = cctr + 1;
      if (cctr > 3) {
        break;
      } else if (chr < 58 && chr > 47) {
        sum = sum * 10 + (chr - 48);
      } else {
        return false;
      }
      bptr = bptr + 1;
    }
  }
  if (!eq(cctr, 3)) {
    return false;
  } else if (!sum) {
    return 1000;
  } else {
    return sum;
  }
}

G.pNumber = 0;

export function orphanMerge(): any {
  let cnt: any = -1;
  let temp: any = 0;
  let verb: any = 0;
  let beg: any = 0;
  let end: any = 0;
  let adj: any = false;
  let wrd: any = 0;
  G.pOflag = false;
  if (eq(isWt(wrd = get(get(P_ITBL, P_VERBN), 0), PS.VERB, P1.VERB), get(P_OTBL, P_VERB)) || isWt(wrd, PS.ADJECTIVE)) {
    adj = true;
  } else if (isWt(wrd, PS.OBJECT, P1.OBJECT) && eq(G.pNcn, 0)) {
    put(P_ITBL, P_VERB, 0);
    put(P_ITBL, P_VERBN, 0);
    put(P_ITBL, P_NC1, rest(P_LEXV, 2));
    put(P_ITBL, P_NC1L, rest(P_LEXV, 6));
    G.pNcn = 1;
  }
  if (!!(verb = get(P_ITBL, P_VERB)) && !adj && !eq(verb, get(P_OTBL, P_VERB))) {
    return false;
  } else if (eq(G.pNcn, 2)) {
    return false;
  } else if (eq(get(P_OTBL, P_NC1), 1)) {
    if (eq(temp = get(P_ITBL, P_PREP1), get(P_OTBL, P_PREP1)) || !temp) {
      if (adj) {
        put(P_OTBL, P_NC1, rest(P_LEXV, 2));
        if (!get(P_ITBL, P_NC1L)) {
          put(P_ITBL, P_NC1L, rest(P_LEXV, 6));
        }
        if (!G.pNcn) {
          G.pNcn = 1;
        }
      } else {
        put(P_OTBL, P_NC1, get(P_ITBL, P_NC1));
      }
      put(P_OTBL, P_NC1L, get(P_ITBL, P_NC1L));
    } else {
      return false;
    }
  } else if (eq(get(P_OTBL, P_NC2), 1)) {
    if (eq(temp = get(P_ITBL, P_PREP1), get(P_OTBL, P_PREP2)) || !temp) {
      if (adj) {
        put(P_ITBL, P_NC1, rest(P_LEXV, 2));
        if (!get(P_ITBL, P_NC1L)) {
          put(P_ITBL, P_NC1L, rest(P_LEXV, 6));
        }
      }
      put(P_OTBL, P_NC2, get(P_ITBL, P_NC1));
      put(P_OTBL, P_NC2L, get(P_ITBL, P_NC1L));
      G.pNcn = 2;
    } else {
      return false;
    }
  } else if (G.pAclause) {
    if (!eq(G.pNcn, 1) && !adj) {
      G.pAclause = false;
      return false;
    } else {
      beg = get(P_ITBL, P_NC1);
      if (adj) {
        beg = rest(P_LEXV, 2);
        adj = false;
      }
      end = get(P_ITBL, P_NC1L);
      for (;;) {
        wrd = get(beg, 0);
        if (eq(beg, end)) {
          if (adj) {
            clauseWin(adj);
            break;
          } else {
            G.pAclause = false;
            return false;
          }
        } else if (eq(wrd, W.ALL, W.EVERYT, W.ONE) || btst(getb(wrd, P_PSOFF), PS.ADJECTIVE) && adjCheck(wrd, adj, adj)) {
          adj = wrd;
        } else if (eq(wrd, W.ONE)) {
          clauseWin(adj);
          break;
        } else if (btst(getb(wrd, P_PSOFF), PS.OBJECT)) {
          if (eq(wrd, G.pAnam)) {
            clauseWin(adj);
          } else {
            clauseWin();
          }
          break;
        }
        beg = rest(beg, P_WORDLEN);
        if (eq(end, 0)) {
          end = beg;
          G.pNcn = 1;
          put(P_ITBL, P_NC1, back(beg, 4));
          put(P_ITBL, P_NC1L, beg);
        }
      }
    }
  }
  put(P_VTBL, 0, get(P_OVTBL, 0));
  putb(P_VTBL, 2, getb(P_OVTBL, 2));
  putb(P_VTBL, 3, getb(P_OVTBL, 3));
  put(P_OTBL, P_VERBN, P_VTBL);
  putb(P_VTBL, 2, 0);
  for (;;) {
    if ((cnt = cnt + 1) > P_ITBLLEN) {
      G.pMerged = true;
      return true;
    } else {
      put(P_ITBL, cnt, get(P_OTBL, cnt));
    }
  }
  return true;
}

export function clauseWin(adj: any = false): any {
  if (adj) {
    put(P_ITBL, P_VERB, get(P_OTBL, P_VERB));
  } else {
    adj = true;
  }
  put(P_CCTBL, CC_SBPTR, G.pAclause);
  put(P_CCTBL, CC_SEPTR, G.pAclause + 1);
  if (eq(G.pAclause, P_NC1)) {
    put(P_CCTBL, CC_OCLAUSE, P_OCL1);
  } else {
    put(P_CCTBL, CC_OCLAUSE, P_OCL2);
  }
  clauseCopy(P_OTBL, P_OTBL, adj);
  !eq(get(P_OTBL, P_NC2), 0) && (G.pNcn = 2);
  G.pAclause = false;
  return true;
}

export function wordPrint(cnt: any, buf: any): any {
  for (;;) {
    if (--cnt < 0) {
      return true;
    } else {
      printc(getb(P_INBUF, buf));
      buf = buf + 1;
    }
  }
}

export function unknownWord(ptr: any): any {
  let buf: any = 0;
  put(OOPS_TABLE, O_PTR, ptr);
  tell("[I don't know the word \"");
  wordPrint(getb(rest(P_LEXV, buf = ptr * 2), 2), getb(rest(P_LEXV, buf), 3));
  tell(".\"]\n");
  G.quoteFlag = false;
  return G.pOflag = false;
}

export function cantUse(ptr: any, forEachOther: any = false): any {
  let buf: any = 0;
  tell("[You used the word \"");
  if (forEachOther) {
    if (eq(ptr, W.EACH)) {
      tell("each");
    } else {
      tell("other");
    }
  } else {
    wordPrint(getb(rest(P_LEXV, buf = ptr * 2), 2), getb(rest(P_LEXV, buf), 3));
  }
  tell("\" in a way that I don't understand.]\n");
  return stop();
}

G.pSlocbits = 0;

export function syntaxCheck(): any {
  let syn: any = 0;
  let len: any = 0;
  let num: any = 0;
  let obj: any = 0;
  let drive1: any = false;
  let drive2: any = false;
  let prep: any = 0;
  let verb: any = 0;
  let _t1: any;
  if (!(verb = get(P_ITBL, P_VERB))) {
    tell(NO_VERB);
    return false;
  }
  syn = get(VERBS, 255 - verb);
  len = getb(syn, 0);
  syn = rest(syn);
  for (;;) {
    num = getb(syn, P_SBITS) & P_SONUMS;
    if (G.pNcn > num) {
    } else if (!(num < 1) && !G.pNcn && (!(prep = get(P_ITBL, P_PREP1)) || eq(prep, getb(syn, P_SPREP1)))) {
      drive1 = syn;
    } else if (eq(getb(syn, P_SPREP1), get(P_ITBL, P_PREP1))) {
      if (eq(num, 2) && eq(G.pNcn, 1)) {
        drive2 = syn;
      } else if (eq(getb(syn, P_SPREP2), get(P_ITBL, P_PREP2))) {
        syntaxFound(syn);
        return true;
      }
    }
    if (--len < 1) {
      if (drive1 || drive2) {
        break;
      } else {
        recognize();
        return false;
      }
    } else {
      syn = rest(syn, P_SYNLEN);
    }
  }
  if (drive1 && (obj = gwim(getb(drive1, P_SFWIM1), getb(drive1, P_SLOC1), getb(drive1, P_SPREP1)))) {
    put(G.pPrso, P_MATCHLEN, 1);
    put(G.pPrso, 1, obj);
    return syntaxFound(drive1);
  } else if (drive2 && (obj = gwim(getb(drive2, P_SFWIM2), getb(drive2, P_SLOC2), getb(drive2, P_SPREP2)))) {
    put(G.pPrsi, P_MATCHLEN, 1);
    put(G.pPrsi, 1, obj);
    return syntaxFound(drive2);
  } else {
    if (eq(G.winner, PROTAGONIST)) {
      orphan(drive1, drive2);
      tell("[Wh");
    } else {
      tell("[Your command was not complete. Next time, type wh");
    }
    if (eq(verb, ACT.WALK, ACT.GO)) {
      tell("ere");
    } else if (drive1 && eq(getb(drive1, P_SFWIM1), ACTORBIT) || drive2 && eq(getb(drive2, P_SFWIM2), ACTORBIT)) {
      tell("om");
    } else {
      tell("at");
    }
    if (eq(G.winner, PROTAGONIST)) {
      tell(" do you want to ");
    } else {
      tell(" you want", T(G.winner), " to ");
    }
    verbPrint();
    G.pOflag = false;
    if (drive2) {
      prep = G.pMerged;
      G.pMerged = false;
      clausePrint(P_NC1, P_NC1L);
      G.pMerged = prep;
    }
    if (drive1) {
      _t1 = getb(drive1, P_SPREP1);
    } else {
      _t1 = getb(drive2, P_SPREP2);
    }
    prepPrint(_t1);
    if (eq(G.winner, PROTAGONIST)) {
      G.pOflag = true;
      tell("?]\n");
    } else {
      G.pOflag = false;
      tell(".]\n");
    }
    return false;
  }
}

export function verbPrint(): any {
  let tmp: any = 0;
  tmp = get(P_ITBL, P_VERBN);
  if (eq(tmp, 0)) {
    tell("tell");
    return true;
  } else if (eq(tmp, W.ZZMGCK)) {
    tell("answer");
    return true;
  } else if (!getb(tmp, 2)) {
    printb(get(tmp, 0));
    return true;
  } else {
    wordPrint(getb(tmp, 2), getb(tmp, 3));
    putb(tmp, 2, 0);
    return true;
  }
}

export function cantOrphan(): any {
  tell("\"I don't understand! What are you referring to?\"\n");
  return false;
}

export function orphan(d1: any, d2: any): any {
  let cnt: any = -1;
  if (!G.pMerged) {
    put(P_OCL1, P_MATCHLEN, 0);
    put(P_OCL2, P_MATCHLEN, 0);
  }
  put(P_OVTBL, 0, get(P_VTBL, 0));
  putb(P_OVTBL, 2, getb(P_VTBL, 2));
  putb(P_OVTBL, 3, getb(P_VTBL, 3));
  for (;;) {
    if (++cnt > P_ITBLLEN) {
      break;
    } else {
      put(P_OTBL, cnt, get(P_ITBL, cnt));
    }
  }
  if (eq(G.pNcn, 2)) {
    put(P_CCTBL, CC_SBPTR, P_NC2);
    put(P_CCTBL, CC_SEPTR, P_NC2L);
    put(P_CCTBL, CC_OCLAUSE, P_OCL2);
    clauseCopy(P_ITBL, P_OTBL);
  }
  if (!(G.pNcn < 1)) {
    put(P_CCTBL, CC_SBPTR, P_NC1);
    put(P_CCTBL, CC_SEPTR, P_NC1L);
    put(P_CCTBL, CC_OCLAUSE, P_OCL1);
    clauseCopy(P_ITBL, P_OTBL);
  }
  if (d1) {
    put(P_OTBL, P_PREP1, getb(d1, P_SPREP1));
    put(P_OTBL, P_NC1, 1);
    return true;
  } else if (d2) {
    put(P_OTBL, P_PREP2, getb(d2, P_SPREP2));
    put(P_OTBL, P_NC2, 1);
    return true;
  }
  return false;
}

export function clausePrint(bptr: any, eptr: any, isThe: any = true): any {
  return bufferPrint(get(P_ITBL, bptr), get(P_ITBL, eptr), isThe);
}

export function bufferPrint(beg: any, end: any, cp: any): any {
  let nosp: any = false;
  let wrd: any = 0;
  let isFirst: any = true;
  let pn: any = false;
  for (;;) {
    if (eq(beg, end)) {
      return true;
    } else {
      if (nosp) {
        nosp = false;
      } else {
        tell(" ");
      }
      if (eq(wrd = get(beg, 0), W.PERIOD)) {
        nosp = true;
      } else if (eq(wrd, W.ME, W.MYSELF)) {
        printd(ME);
        pn = true;
      } else if (isName(wrd)) {
        capitalize(beg);
        pn = true;
      } else {
        if (isFirst && !pn && cp && !eq(wrd, W.MY, W.HIS, W.HER)) {
          tell("the ");
        }
        if (G.pOflag || G.pMerged) {
          printb(wrd);
        } else if (eq(wrd, W.IT, W.THEM) && isAccessible(G.pItObject)) {
          tell(D(G.pItObject));
        } else if (eq(wrd, W.HIM, W.HIMSELF) && isAccessible(G.pHimObject)) {
          tell(D(G.pHimObject));
        } else if (eq(wrd, W.HER, W.HERSELF) && isAccessible(G.pHerObject)) {
          tell(D(G.pHerObject));
        } else {
          wordPrint(getb(beg, 2), getb(beg, 3));
        }
        isFirst = false;
      }
    }
    beg = rest(beg, P_WORDLEN);
  }
}

export function isName(wrd: any): any {
  if (eq(wrd, W.TRENT, W.TIFFAN, W.TIFF) || eq(wrd, W.THETA, W.ELYSIA, W.ELYSIUM) || eq(wrd, W.MITRE, W.THORBAST, W.FORD) || eq(wrd, W.VENUS, W.CLEVELAND)) {
    return true;
  } else {
    return false;
  }
}

export function capitalize(ptr: any): any {
  if (G.pOflag || G.pMerged) {
    printb(get(ptr, 0));
    return true;
  } else {
    printc(getb(P_INBUF, getb(ptr, 3)) - 32);
    return wordPrint(getb(ptr, 2) - 1, getb(ptr, 3) + 1);
  }
}

export function prepPrint(prep: any): any {
  let wrd: any = 0;
  if (!!prep) {
    tell(" ");
    if (eq(prep, PR.THROUGH)) {
      tell("through");
      return true;
    } else {
      wrd = prepFind(prep);
      printb(wrd);
      return true;
    }
  }
  return false;
}

export function clauseCopy(src: any, dest: any, insrt: any = false): any {
  let ocl: any = 0;
  let beg: any = 0;
  let end: any = 0;
  let bb: any = 0;
  let ee: any = 0;
  let obeg: any = 0;
  let cnt: any = 0;
  let b: any = 0;
  let e: any = 0;
  bb = get(P_CCTBL, CC_SBPTR);
  ee = get(P_CCTBL, CC_SEPTR);
  ocl = get(P_CCTBL, CC_OCLAUSE);
  beg = get(src, bb);
  end = get(src, ee);
  obeg = get(ocl, P_MATCHLEN);
  for (;;) {
    if (eq(beg, end)) {
      break;
    }
    if (insrt && eq(G.pAnam, get(beg, 0))) {
      if (eq(insrt, true)) {
        b = get(P_ITBL, P_NC1);
        e = get(P_ITBL, P_NC1L);
        for (;;) {
          if (eq(b, e)) {
            break;
          }
          clauseAdd(get(b, 0));
          b = rest(b, P_WORDLEN);
        }
      } else if (!eq(insrt, get(ocl, 1))) {
        clauseAdd(insrt);
        clauseAdd(get(beg, 0));
      }
    } else {
      clauseAdd(get(beg, 0));
    }
    beg = rest(beg, P_WORDLEN);
  }
  if (eq(src, dest) && obeg > 0) {
    cnt = get(ocl, P_MATCHLEN) - obeg;
    put(ocl, P_MATCHLEN, 0);
    obeg = obeg + 1;
    for (;;) {
      clauseAdd(get(ocl, obeg));
      if (!(cnt = cnt - 2)) {
        break;
      }
      obeg = obeg + 2;
    }
    obeg = 0;
  }
  put(dest, bb, rest(ocl, obeg * P_LEXELEN + 2));
  put(dest, ee, rest(ocl, get(ocl, P_MATCHLEN) * P_LEXELEN + 2));
  return true;
}

export function clauseAdd(wrd: any): any {
  let ocl: any = 0;
  let ptr: any = 0;
  ocl = get(P_CCTBL, CC_OCLAUSE);
  ptr = get(ocl, P_MATCHLEN) + 2;
  put(ocl, ptr - 1, wrd);
  put(ocl, ptr, 0);
  put(ocl, P_MATCHLEN, ptr);
  return true;
}

export function prepFind(prep: any): any {
  let cnt: any = 0;
  let size: any = 0;
  size = get(PREPOSITIONS, 0) * 2;
  for (;;) {
    if (++cnt > size) {
      return false;
    } else if (eq(get(PREPOSITIONS, cnt), prep)) {
      return get(PREPOSITIONS, cnt - 1);
    }
  }
}

export function syntaxFound(syn: any): any {
  G.pSyntax = syn;
  return G.prsa = getb(syn, P_SACTION);
}

G.pGwimbit = 0;

export function gwim(gbit: any, lbit: any, prep: any): any {
  let obj: any = 0;
  if (eq(gbit, RLANDBIT)) {
    return ROOMS;
  }
  G.pGwimbit = gbit;
  G.pSlocbits = lbit;
  put(G.pMerge, P_MATCHLEN, 0);
  if (getObject(G.pMerge, false)) {
    G.pGwimbit = 0;
    if (eq(get(G.pMerge, P_MATCHLEN), 1)) {
      obj = get(G.pMerge, 1);
      tell("[");
      if (!!prep && !G.pEndOnPrep) {
        printb(prep = prepFind(prep));
        if (eq(prep, W.OUT)) {
          tell(" of");
        }
        if (!hasFlag(obj, NARTICLEBIT)) {
          tell(" the ");
        } else {
          tell(" ");
        }
      }
      tell(D(obj), "]\n");
      return obj;
    }
    return false;
  } else {
    G.pGwimbit = 0;
    return false;
  }
}

export function snarfObjects(): any {
  let ptr: any = 0;
  let _t1: any;
  let _t2: any;
  if (!eq(ptr = get(P_ITBL, P_NC1), 0)) {
    G.pPhr = 0;
    G.pSlocbits = getb(G.pSyntax, P_SLOC1);
    _t1 = snarfem(ptr, get(P_ITBL, P_NC1L), G.pPrso);
    if (!_t1) {
      return false;
      _t1 = false;
    }
    _t1;
    !get(P_BUTS, P_MATCHLEN) || (G.pPrso = butMerge(G.pPrso));
  }
  if (!eq(ptr = get(P_ITBL, P_NC2), 0)) {
    G.pPhr = 1;
    G.pSlocbits = getb(G.pSyntax, P_SLOC2);
    _t2 = snarfem(ptr, get(P_ITBL, P_NC2L), G.pPrsi);
    if (!_t2) {
      return false;
      _t2 = false;
    }
    _t2;
    if (!!get(P_BUTS, P_MATCHLEN)) {
      if (eq(get(G.pPrsi, P_MATCHLEN), 1)) {
        G.pPrso = butMerge(G.pPrso);
      } else {
        G.pPrsi = butMerge(G.pPrsi);
      }
    }
  }
  return true;
}

export function butMerge(tbl: any): any {
  let len: any = 0;
  let cnt: any = 1;
  let matches: any = 0;
  let obj: any = 0;
  let ntbl: any = 0;
  len = get(tbl, P_MATCHLEN);
  put(G.pMerge, P_MATCHLEN, 0);
  for (;;) {
    if (--len < 0) {
      break;
    } else if (zmemq(obj = get(tbl, cnt), P_BUTS)) {
    } else {
      put(G.pMerge, matches + 1, obj);
      matches = matches + 1;
    }
    cnt = cnt + 1;
  }
  put(G.pMerge, P_MATCHLEN, matches);
  ntbl = G.pMerge;
  G.pMerge = tbl;
  return ntbl;
}

G.pNam = false;

export const P_NAMW = table("P-NAMW", [0, 0]);

G.pAdj = false;

export const P_ADJW = table("P-ADJW", [0, 0]);

G.pPhr = 0;

G.pAdverb = false;

G.pAdjn = false;

G.pPrso = itable("P-PRSO", 50, ["NONE"], []);

G.pPrsi = itable("P-PRSI", 50, ["NONE"], []);

export const P_BUTS = itable("P-BUTS", 50, ["NONE"], []);

G.pMerge = itable("P-MERGE", 50, ["NONE"], []);

export const P_OCL1 = itable("P-OCL1", 50, ["NONE"], []);

export const P_OCL2 = itable("P-OCL2", 50, ["NONE"], []);

G.pGetflags = 0;

export function snarfem(ptr: any, eptr: any, tbl: any): any {
  let but: any = false;
  let wv: any = 0;
  let wrd: any = 0;
  let nw: any = 0;
  let wasAll: any = false;
  let _t1: any;
  let _t2: any;
  let _t3: any;
  let _t4: any;
  G.pAnd = false;
  if (eq(G.pGetflags, P_ALL)) {
    wasAll = true;
  }
  G.pGetflags = 0;
  put(P_BUTS, P_MATCHLEN, 0);
  put(tbl, P_MATCHLEN, 0);
  wrd = get(ptr, 0);
  for (;;) {
    if (eq(ptr, eptr)) {
      wv = getObject(but || tbl);
      if (wasAll) {
        G.pGetflags = P_ALL;
      }
      return wv;
    } else {
      if (eq(eptr, rest(ptr, P_WORDLEN))) {
        nw = 0;
      } else {
        nw = get(ptr, P_LEXELEN);
      }
      if (eq(wrd, W.ALL, W.BOTH, W.EVERYT)) {
        if (!manyCheck(G.pPhr)) {
          return false;
        }
        G.pGetflags = P_ALL;
        if (eq(nw, W.OF)) {
          ptr = rest(ptr, P_WORDLEN);
        }
      } else if (isNaughtyWord(wrd)) {
        return false;
      } else if (eq(wrd, W.BUT, W.EXCEPT)) {
        _t1 = getObject(but || tbl);
        if (!_t1) {
          return false;
          _t1 = false;
        }
        _t1;
        but = P_BUTS;
        put(but, P_MATCHLEN, 0);
      } else if (eq(wrd, W.A, W.ONE)) {
        if (!G.pAdj) {
          G.pGetflags = P_ONE;
          if (eq(nw, W.OF)) {
            ptr = rest(ptr, P_WORDLEN);
          }
        } else {
          G.pNam = G.pOneobj;
          _t2 = getObject(but || tbl);
          if (!_t2) {
            return false;
            _t2 = false;
          }
          _t2;
          _t3 = !nw;
          if (_t3) {
            return true;
            _t3 = false;
          }
          _t3;
        }
      } else if (eq(wrd, W.AND, W.COMMA) && !eq(nw, W.AND, W.COMMA)) {
        G.pAnd = true;
        _t4 = getObject(but || tbl);
        if (!_t4) {
          return false;
          _t4 = false;
        }
        _t4;
      } else if (isWt(wrd, PS.BUZZ_WORD)) {
      } else if (eq(wrd, W.AND, W.COMMA)) {
      } else if (eq(wrd, W.OF)) {
        if (!G.pGetflags) {
          G.pGetflags = P_INHIBIT;
        }
      } else if ((wv = isWt(wrd, PS.ADJECTIVE, P1.ADJECTIVE)) && adjCheck(wrd, G.pAdj, G.pAdjn) && !eq(nw, W.OF)) {
        G.pAdj = wv;
        G.pAdjn = wrd;
      } else if (isWt(wrd, PS.OBJECT, P1.OBJECT)) {
        G.pNam = wrd;
        G.pOneobj = wrd;
      }
    }
    if (!eq(ptr, eptr)) {
      ptr = rest(ptr, P_WORDLEN);
      wrd = nw;
    }
  }
}

export function isNaughtyWord(word: any): any {
  if (!eq(G.naughtyLevel, 0)) {
    return false;
  } else if (eq(word, W.ASS, W.ASSHOLE)) {
    return knowWord("A");
  } else if (eq(word, W.BASTARD, W.BITCH)) {
    return knowWord("B");
  } else if (eq(word, W.COCK, W.COCKSU, W.CUNT)) {
    return knowWord("C");
  } else if (eq(word, W.DAMN, W.DAMNED)) {
    return knowWord("D");
  } else if (eq(word, W.FUCK, W.FUCKED, W.FUCKING)) {
    return knowWord("F");
  } else if (eq(word, W.SHIT, W.SHITHEAD)) {
    return knowWord("S");
  } else {
    return false;
  }
}

export function knowWord(letter: any): any {
  tell("[I don't know the ", letter, "-word.]\n");
  return true;
}

export function adjCheck(wrd: any, adj: any, adjn: any): any {
  if (!adj) {
    return true;
  } else if (eq(wrd, W.RETURN) && eq(adjn, W.COIN)) {
    return true;
  } else if (eq(wrd, W.NARROW, W.WIDE)) {
    return true;
  } else if (eq(wrd, W.PURPLE, W.ORANGE)) {
    return true;
  } else {
    return false;
  }
}

export function getObject(tbl: any, vrb: any = true): any {
  let bits: any = 0;
  let len: any = 0;
  let xbits: any = 0;
  let tlen: any = 0;
  let gcheck: any = false;
  let olen: any = 0;
  let obj: any = 0;
  let _t1: any;
  xbits = G.pSlocbits;
  tlen = get(tbl, P_MATCHLEN);
  if (btst(G.pGetflags, P_INHIBIT)) {
    return true;
  }
  if (!G.pNam && G.pAdj) {
    if (isWt(G.pAdjn, PS.OBJECT, P1.OBJECT)) {
      G.pNam = G.pAdjn;
      G.pAdj = false;
      G.pAdjn = false;
    } else if (bits = isWt(G.pAdjn, PS.DIRECTION, P1.DIRECTION)) {
      G.pDirection = bits;
    }
  }
  if (!G.pNam && !G.pAdj && !eq(G.pGetflags, P_ALL) && !G.pGwimbit) {
    if (vrb) {
      tell(NOUN_MISSING);
    }
    return false;
  }
  if (!eq(G.pGetflags, P_ALL) || !G.pSlocbits) {
    G.pSlocbits = -1;
  }
  G.pTable = tbl;
  for (;;) {
    if (gcheck) {
      globalCheck(tbl);
    } else {
      if (G.lit || verbIs(V.TELL)) {
        clearFlag(PROTAGONIST, TRANSBIT);
        doSl(G.here, SOG, SIR);
        setFlag(PROTAGONIST, TRANSBIT);
      } else if (hasFlag(loc(PROTAGONIST), VEHBIT) && isThisIt(loc(PROTAGONIST))) {
        objFound(loc(PROTAGONIST), tbl);
      }
      doSl(PROTAGONIST, SH, SC);
    }
    len = get(tbl, P_MATCHLEN) - tlen;
    if (btst(G.pGetflags, P_ALL)) {
    } else if (!eq(G.pGetflags, P_ALL) && (len > 1 || !len && !eq(G.pSlocbits, -1))) {
      if (eq(G.pSlocbits, -1)) {
        G.pSlocbits = xbits;
        olen = len;
        put(tbl, P_MATCHLEN, get(tbl, P_MATCHLEN) - len);
        continue;
      } else {
        putAdjNam();
        if (!len) {
          len = olen;
        }
        if (G.pNam && (obj = get(tbl, tlen + 1)) && (obj = apply(getp(obj, P.GENERIC)))) {
          if (eq(obj, NOT_HERE_OBJECT)) {
            return false;
          }
          put(tbl, 1, obj);
          put(tbl, P_MATCHLEN, 1);
          G.pNam = false;
          G.pAdj = false;
          return true;
        } else if (vrb && !eq(G.winner, PROTAGONIST)) {
          cantOrphan();
          G.pNam = false;
          G.pAdj = false;
          return false;
        } else if (vrb && G.pNam) {
          whichPrint(tlen, len, tbl);
          if (eq(tbl, G.pPrso)) {
            _t1 = P_NC1;
          } else {
            _t1 = P_NC2;
          }
          G.pAclause = _t1;
          G.pAadj = G.pAdj;
          G.pAnam = G.pNam;
          orphan(false, false);
          G.pOflag = true;
        } else if (vrb) {
          tell(NOUN_MISSING);
        }
        G.pNam = false;
        G.pAdj = false;
        return false;
      }
    } else if (!len && gcheck) {
      putAdjNam();
      if (vrb) {
        G.pSlocbits = xbits;
        if (G.lit || eq(G.prsa, V.TELL) || eq(G.prsa, V.WHERE, V.WHAT)) {
          objFound(NOT_HERE_OBJECT, tbl);
          G.pXnam = G.pNam;
          G.pXadj = G.pAdj;
          G.pXadjn = G.pAdjn;
          G.pNam = false;
          G.pAdj = false;
          G.pAdjn = false;
          return true;
        } else {
          tell(TOO_DARK, "\n");
        }
      }
      G.pNam = false;
      G.pAdj = false;
      return false;
    } else if (!len) {
      gcheck = true;
      continue;
    }
    G.pSlocbits = xbits;
    putAdjNam();
    G.pNam = false;
    G.pAdj = false;
    return true;
  }
}

export function putAdjNam(): any {
  if (!eq(G.pNam, W.IT)) {
    put(P_NAMW, G.pPhr, G.pNam);
    put(P_ADJW, G.pPhr, G.pAdj);
    return true;
  }
  return false;
}

export function mobyFind(tbl: any): any {
  let obj: any = 1;
  let len: any = 0;
  let nam: any = 0;
  let adj: any = 0;
  nam = G.pNam;
  adj = G.pAdj;
  G.pNam = G.pXnam;
  G.pAdj = G.pXadj;
  put(tbl, P_MATCHLEN, 0);
  for (;;) {
    if (!isIn(obj, ROOMS) && isThisIt(obj)) {
      objFound(obj, tbl);
    }
    if (++obj > LAST_OBJECT) {
      break;
    }
  }
  if (eq(len = get(tbl, P_MATCHLEN), 1)) {
    G.pMobyFound = get(tbl, 1);
  }
  G.pNam = nam;
  G.pAdj = adj;
  return len;
}

G.pMobyFound = false;

G.pXnam = false;

G.pXadj = false;

G.pXadjn = false;

export function whichPrint(tlen: any, len: any, tbl: any): any {
  let obj: any = 0;
  let rlen: any = 0;
  rlen = len;
  tell("[Which");
  if (G.pOflag || G.pMerged || G.pAnd) {
    tell(" ");
    printb(G.pNam);
  } else if (eq(tbl, G.pPrso)) {
    clausePrint(P_NC1, P_NC1L, false);
  } else {
    clausePrint(P_NC2, P_NC2L, false);
  }
  tell(" do you mean, ");
  for (;;) {
    tlen = tlen + 1;
    obj = get(tbl, tlen);
    if (!hasFlag(obj, NARTICLEBIT)) {
      tell("the ");
    }
    tell(D(obj));
    if (eq(len, 2)) {
      if (!eq(rlen, 2)) {
        tell(",");
      }
      tell(" or ");
    } else if (len > 2) {
      tell(", ");
    }
    if ((len = len - 1) < 1) {
      tell("?]\n");
      return true;
    }
  }
}

export function globalCheck(tbl: any): any {
  let len: any = 0;
  let rmg: any = 0;
  let rmgl: any = 0;
  let cnt: any = 0;
  let obj: any = 0;
  let obits: any = 0;
  let foo: any = 0;
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
        foo = back(getpt(PSEUDO_OBJECT, P.ACTION), 5);
        rmg = get(rmg, cnt + 1);
        put(foo, 0, get(rmg, 0));
        put(foo, 1, get(rmg, 1));
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
}

export function doSl(obj: any, bit1: any, bit2: any): any {
  if (btst(G.pSlocbits, bit1 + bit2)) {
    return searchList(obj, G.pTable, P_SRCALL);
  } else {
    if (btst(G.pSlocbits, bit1)) {
      return searchList(obj, G.pTable, P_SRCTOP);
    } else if (btst(G.pSlocbits, bit2)) {
      return searchList(obj, G.pTable, P_SRCBOT);
    } else {
      return true;
    }
  }
}

export function searchList(obj: any, tbl: any, lvl: any): any {
  let _t1: any;
  if (obj = first(obj)) {
    for (;;) {
      if (!eq(lvl, P_SRCBOT) && getpt(obj, P.SYNONYM) && isThisIt(obj)) {
        objFound(obj, tbl);
      }
      if ((!eq(lvl, P_SRCTOP) || hasFlag(obj, SEARCHBIT) || hasFlag(obj, SURFACEBIT)) && first(obj)) {
        if (hasFlag(obj, OPENBIT) || hasFlag(obj, TRANSBIT) || P_MOBY_FLAG) {
          if (hasFlag(obj, SURFACEBIT)) {
            _t1 = P_SRCALL;
          } else if (hasFlag(obj, SEARCHBIT)) {
            _t1 = P_SRCALL;
          } else {
            _t1 = P_SRCTOP;
          }
          searchList(obj, tbl, _t1);
        }
      }
      if (obj = next(obj)) {
      } else {
        return true;
      }
    }
  }
  return false;
}

export function objFound(obj: any, tbl: any): any {
  let ptr: any = 0;
  ptr = get(tbl, P_MATCHLEN);
  put(tbl, ptr + 1, obj);
  put(tbl, P_MATCHLEN, ptr + 1);
  return true;
}

export function takeCheck(): any {
  return itakeCheck(G.pPrso, getb(G.pSyntax, P_SLOC1)) && itakeCheck(G.pPrsi, getb(G.pSyntax, P_SLOC2));
}

export function itakeCheck(tbl: any, ibits: any): any {
  let ptr: any = 0;
  let obj: any = 0;
  let taken: any = 0;
  if ((ptr = get(tbl, P_MATCHLEN)) && (btst(ibits, SHAVE) || btst(ibits, STAKE))) {
    for (;;) {
      if ((ptr = ptr - 1) < 0) {
        return true;
      } else {
        obj = get(tbl, ptr + 1);
        if (eq(obj, IT)) {
          if (!isVisible(G.pItObject)) {
            referring();
            return false;
          } else {
            obj = G.pItObject;
          }
        } else if (eq(obj, HIM)) {
          if (!isVisible(G.pHimObject)) {
            referring(true);
            return false;
          } else {
            obj = G.pHimObject;
          }
        } else if (eq(obj, HER)) {
          if (!isVisible(G.pHerObject)) {
            referring(true);
            return false;
          } else {
            obj = G.pHerObject;
          }
        }
        if (isUltimatelyIn(obj) || eq(obj, RAFT) && G.raftHeld || eq(obj, INTNUM, HANDS, G.handCover)) {
        } else {
          G.prso = obj;
          if (hasFlag(obj, TRYTAKEBIT)) {
            taken = true;
          } else if (isUntouchable(obj)) {
            taken = true;
          } else if (!eq(G.winner, PROTAGONIST)) {
            taken = false;
          } else if (btst(ibits, STAKE) && eq(itake(false), true)) {
            taken = false;
          } else {
            taken = true;
          }
          if (taken && btst(ibits, SHAVE)) {
            if (1 < get(tbl, P_MATCHLEN)) {
              tell(YNH, " all those things!\n");
              return false;
            } else if (eq(obj, NOT_HERE_OBJECT)) {
              tell(YOU_CANT, "see that here!\n");
              return false;
            }
            if (eq(G.winner, PROTAGONIST)) {
              tell(YNH);
            } else {
              tell("It doesn't look like", T(G.winner), " has");
            }
            thisIsIt(obj);
            tell(TR(obj));
            return false;
          } else if (!taken && !isIn(PROTAGONIST, obj) && eq(G.winner, PROTAGONIST)) {
            tell("[taking", T(obj), " first]\n");
          }
        }
      }
    }
  } else {
    return true;
  }
}

export function manyCheck(phr: any = 2): any {
  let loss: any = false;
  let tmp: any = 0;
  if (!phr && !btst(getb(G.pSyntax, P_SLOC1), SMANY)) {
    loss = 1;
  } else if (eq(phr, 1) && !btst(getb(G.pSyntax, P_SLOC2), SMANY)) {
    loss = 2;
  } else if (eq(phr, 2) && get(G.pPrso, P_MATCHLEN) > 1 && !btst(getb(G.pSyntax, P_SLOC1), SMANY)) {
    loss = 1;
  } else if (eq(phr, 2) && get(G.pPrsi, P_MATCHLEN) > 1 && !btst(getb(G.pSyntax, P_SLOC2), SMANY)) {
    loss = 2;
  }
  if (loss) {
    tell("[", YOU_CANT, "use multiple ");
    if (eq(loss, 2)) {
      tell("in");
    }
    tell("direct objects with \"");
    tmp = get(P_ITBL, P_VERBN);
    if (!tmp) {
      tell("tell");
    } else if (G.pOflag || G.pMerged) {
      printb(get(tmp, 0));
    } else {
      wordPrint(getb(tmp, 2), getb(tmp, 3));
    }
    tell("\".]\n");
    return false;
  } else {
    return true;
  }
}

export function zmemq(itm: any, tbl: any, size: any = -1): any {
  let cnt: any = 1;
  if (!tbl) {
    return false;
  }
  if (!(size < 0)) {
    cnt = 0;
  } else {
    size = get(tbl, 0);
  }
  for (;;) {
    if (eq(itm, get(tbl, cnt))) {
      return true;
    } else if (++cnt > size) {
      return false;
    }
  }
}

export function zmemqb(itm: any, tbl: any, size: any): any {
  let cnt: any = 0;
  for (;;) {
    if (eq(itm, getb(tbl, cnt))) {
      return true;
    } else if (++cnt > size) {
      return false;
    }
  }
}

export function isLit(rm: any, rmbit: any = true): any {
  let ohere: any = 0;
  let lit: any = false;
  G.pGwimbit = ONBIT;
  ohere = G.here;
  G.here = rm;
  if (rmbit && hasFlag(rm, ONBIT)) {
    lit = true;
  } else {
    put(G.pMerge, P_MATCHLEN, 0);
    G.pTable = G.pMerge;
    G.pSlocbits = -1;
    if (eq(ohere, rm)) {
      doSl(G.winner, 1, 1);
      if (!eq(G.winner, PROTAGONIST) && isIn(PROTAGONIST, rm)) {
        doSl(PROTAGONIST, 1, 1);
      }
    }
    doSl(rm, 1, 1);
    if (get(G.pTable, P_MATCHLEN) > 0) {
      lit = true;
    }
  }
  G.here = ohere;
  G.pGwimbit = 0;
  return lit;
}

export function prsoPrint(): any {
  let ptr: any = 0;
  if (G.pMerged || eq(get(ptr = get(P_ITBL, P_NC1), 0), W.IT)) {
    tell(" ", D(G.prso));
    return true;
  } else {
    return bufferPrint(ptr, get(P_ITBL, P_NC1L), false);
  }
}

export function prsiPrint(): any {
  let ptr: any = 0;
  if (G.pMerged || eq(get(ptr = get(P_ITBL, P_NC2), 0), W.IT)) {
    tell(" ", D(G.prsi));
    return true;
  } else {
    return bufferPrint(ptr, get(P_ITBL, P_NC2L), false);
  }
}

export function isThisIt(obj: any): any {
  let syns: any = 0;
  if (hasFlag(obj, INVISIBLE)) {
    return false;
  } else if (G.pNam && !zmemq(G.pNam, syns = getpt(obj, P.SYNONYM), div(ptsize(syns), 2) - 1)) {
    return false;
  } else if (G.pAdj && (!(syns = getpt(obj, P.ADJECTIVE)) || !zmemqb(G.pAdj, syns, ptsize(syns) - 1))) {
    return false;
  } else if (!!G.pGwimbit && !hasFlag(obj, G.pGwimbit)) {
    return false;
  }
  return true;
}
