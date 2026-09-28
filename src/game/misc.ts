// misc.ts — from MISC.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  defineObject,
} from "../engine/define.ts";
import {
  machine,
} from "../engine/machine.ts";
import {
  D, apply, clearScreen as rtClearScreen, crlf, eq, get, getb, getp, hasFlag, isIn, loc, printb,
  printd, printn, put, putb, random, read, rest, tell, usl,
} from "../engine/runtime.ts";
import {
  itable,
} from "../engine/table.ts";
import {
  iUrge,
} from "./earth.ts";
import {
  notHereObjectF, referring,
} from "./globals.ts";
import {
  P_INBUF, P_ITBL, P_LEXV, P_OTBL, P_VTBL, orphan, parser, prepPrint, thisIsIt, wordPrint,
} from "./parser.ts";
import {
  ACTIONS, PREACTIONS,
} from "./syntax.ts";
import {
  isAccessible, isUltimatelyIn, isVisible, orphanVerb, stop, vLook, vVersion,
} from "./verbs.ts";
import {
  C_INTLEN, C_RTN, C_TABLELEN, C_TICK, G, HER, HIM, HIT_RETURN, IT, JOES_BAR, LGOP_CAPS, M_END,
  M_FATAL, NARTICLEBIT, NOT_HERE_OBJECT, P, PERIOD_CR, PROTAGONIST, P_ALL, P_MATCHLEN, P_NC1, P_SBITS,
  P_SONUMS, P_SPREP1, P_VERBN, ROOMS, SIDEKICK, SULTANS_WIFE, SURFACEBIT, TAKEBIT, TOO_DARK,
  TRYTAKEBIT, UNTEEDBIT, V, VOWELBIT, W, WARNING, prsoIs, verbIs,
} from "./world.ts";

export function pickOne(tbl: any): any {
  let length: any = 0;
  let cnt: any = 0;
  let rnd: any = 0;
  let msg: any = 0;
  let rfrob: any = 0;
  length = get(tbl, 0);
  cnt = get(tbl, 1);
  length = length - 1;
  tbl = rest(tbl, 2);
  rfrob = rest(tbl, cnt * 2);
  rnd = random(length - cnt);
  msg = get(rfrob, rnd);
  put(rfrob, rnd, get(rfrob, 1));
  put(rfrob, 1, msg);
  cnt = cnt + 1;
  if (eq(cnt, length)) {
    cnt = 0;
  }
  put(tbl, 0, cnt);
  return msg;
}

export function dprint(obj: any): any {
  if (eq(obj, SULTANS_WIFE)) {
    tell("Sultan");
    if (G.male) {
      tell("'s wife #");
    } else {
      tell("ess' husband #");
    }
    printn(G.choiceNumber);
    return true;
  } else if (hasFlag(obj, UNTEEDBIT)) {
    tell(getp(obj, P.NO_T_DESC));
    return true;
  } else if (getp(obj, P.SDESC)) {
    tell(getp(obj, P.SDESC));
    return true;
  } else {
    printd(obj);
    return true;
  }
}

export function dprintSidekick(): any {
  return dprint(SIDEKICK);
}

export function aprint(obj: any): any {
  if (hasFlag(obj, NARTICLEBIT)) {
    tell(" ");
  } else if (hasFlag(obj, VOWELBIT)) {
    tell(" an ");
  } else {
    tell(" a ");
  }
  return dprint(obj);
}

export function tprint(obj: any): any {
  if (hasFlag(obj, NARTICLEBIT)) {
    tell(" ");
  } else {
    tell(" the ");
  }
  return dprint(obj);
}

export function tprintPrso(): any {
  return tprint(G.prso);
}

export function tprintPrsi(): any {
  return tprint(G.prsi);
}

export function arprint(obj: any): any {
  aprint(obj);
  tell(PERIOD_CR);
  return true;
}

export function trprint(obj: any): any {
  tprint(obj);
  tell(PERIOD_CR);
  return true;
}

defineObject(WARNING, 0, {
  in: ROOMS,
  desc: "WARNING!",
  synonym: ["ZZMGCK"],
});

export function go(): any {
  restart: for (;;) {
    G.here = WARNING;
    usl();
    tell("   Some material in this story may not be suitable for children, especially the parts involving sex, which no one should know anything about until reaching the age of eighteen (twenty-one in certain states). This story is also unsuitable for censors, members of the Moral Majority, and anyone else who thinks that sex is dirty rather than fun.\n   The attitudes expressed and language used in this story are representative only of the views of the author, and in no way represent the views of Infocom, Inc. or its employees, many of whom are children, censors, and members of the Moral Majority. (But very few of whom, based on last year's Christmas Party, think that sex is dirty.)\n   By now, all the folks who might be offended by ", LGOP_CAPS, " have whipped their disk out of their drive and, evidence in hand, are indignantly huffing toward their dealer, their lawyer, or their favorite repression-oriented politico. So..", HIT_RETURN, "begin!");
    read(P_INBUF, P_LEXV);
    clearScreen();
    G.winner = PROTAGONIST;
    G.here = JOES_BAR;
    usl();
    tell("The place: Upper Sandusky, Ohio. The time: 1936. The beer: at a nickel a mug, you don't ask for brand names. All you know is that your fifth one tasted as bad as the first.\n\n");
    vVersion();
    crlf();
    vLook();
    iUrge();
    mainLoop();
    continue restart;
  }
}

/** CLEAR-SCREEN: the original scrolled 24 blank lines; the browser clears the story view. */
export function clearScreen(): any {
  return rtClearScreen();
}

/** MAIN-LOOP: each pass is one turn; the machine checkpoints at the top of every pass. */
export function mainLoop(): any {
  for (;;) {
    machine().turnBoundary();
    mainLoop1();
  }
}

export function mainLoop1(): any {
  let icnt: any = 0;
  let ocnt: any = 0;
  let num: any = 0;
  let cnt: any = 0;
  let obj: any = 0;
  let v: any = 0;
  let ptbl: any = 0;
  let obj1: any = 0;
  let tmp: any = 0;
  let _t1: any;
  let _t2: any;
  let _t3: any;
  cnt = 0;
  obj = false;
  ptbl = true;
  if (G.pWon = parser()) {
    icnt = get(G.pPrsi, P_MATCHLEN);
    ocnt = get(G.pPrso, P_MATCHLEN);
    if (G.pItObject && isAccessible(G.pItObject)) {
      tmp = false;
      for (;;) {
        if ((cnt = cnt + 1) > icnt) {
          break;
        } else {
          if (eq(get(G.pPrsi, cnt), IT)) {
            if (isTooDarkForIt()) {
              return true;
            }
            put(G.pPrsi, cnt, G.pItObject);
            tmp = true;
            break;
          }
        }
      }
      if (!tmp) {
        cnt = 0;
        for (;;) {
          if ((cnt = cnt + 1) > ocnt) {
            break;
          } else {
            if (eq(get(G.pPrso, cnt), IT)) {
              if (isTooDarkForIt()) {
                return true;
              }
              put(G.pPrso, cnt, G.pItObject);
              break;
            }
          }
        }
      }
      cnt = 0;
    }
    if (!ocnt) {
      _t1 = ocnt;
    } else if (ocnt > 1) {
      G.pPrso;
      if (!icnt) {
        obj = false;
      } else {
        obj = get(G.pPrsi, 1);
      }
      _t1 = ocnt;
    } else if (icnt > 1) {
      ptbl = false;
      G.pPrsi;
      obj = get(G.pPrso, 1);
      _t1 = icnt;
    } else {
      _t1 = 1;
    }
    num = _t1;
    if (!obj && eq(icnt, 1)) {
      obj = get(G.pPrsi, 1);
    }
    if (eq(G.prsa, V.WALK)) {
      v = performPrsa(G.prso);
    } else if (!num) {
      if (!(getb(G.pSyntax, P_SBITS) & P_SONUMS)) {
        v = performPrsa();
        G.prso = false;
      } else if (!G.lit) {
        tell(TOO_DARK, "\n");
        stop();
      } else {
        tell("There isn't anything to ");
        tmp = get(P_ITBL, P_VERBN);
        if (verbIs(V.TELL)) {
          tell("talk to");
        } else if (G.pOflag || G.pMerged) {
          printb(get(tmp, 0));
        } else {
          wordPrint(getb(tmp, 2), getb(tmp, 3));
        }
        tell("!\n");
        v = false;
        stop();
      }
    } else {
      G.pNotHere = 0;
      G.pMult = false;
      if (num > 1) {
        G.pMult = true;
      }
      tmp = false;
      for (;;) {
        if ((cnt = cnt + 1) > num) {
          if (G.pNotHere > 0) {
            tell("[The ");
            if (!eq(G.pNotHere, num)) {
              tell("other ");
            }
            tell("object");
            if (!eq(G.pNotHere, 1)) {
              tell("s");
            }
            tell(" that you mentioned ");
            if (!eq(G.pNotHere, 1)) {
              tell("are");
            } else {
              tell("is");
            }
            tell("n't here.]\n");
          } else if (!tmp) {
            referring();
          }
          break;
        } else {
          if (ptbl) {
            obj1 = get(G.pPrso, cnt);
          } else {
            obj1 = get(G.pPrsi, cnt);
          }
          if (ptbl) {
            _t2 = obj1;
          } else {
            _t2 = obj;
          }
          G.prso = _t2;
          if (ptbl) {
            _t3 = obj;
          } else {
            _t3 = obj1;
          }
          G.prsi = _t3;
          if (num > 1 || eq(get(get(P_ITBL, P_NC1), 0), W.ALL, W.EVERYT)) {
            if (dontAll(obj1)) {
              continue;
            } else {
              if (eq(obj1, IT)) {
                tell(D(G.pItObject));
              } else if (eq(obj1, HIM)) {
                tell(D(G.pHimObject));
              } else if (eq(obj1, HER)) {
                tell(D(G.pHerObject));
              } else {
                tell(D(obj1));
              }
              tell(": ");
            }
          }
          tmp = true;
          v = performPrsa(G.prso, G.prsi);
          if (eq(v, M_FATAL)) {
            break;
          }
        }
      }
    }
    if (eq(v, M_FATAL)) {
      G.pCont = false;
    }
    if (isClockerVerb() && !verbIs(V.TELL) && G.pWon) {
      v = apply(getp(G.here, P.ACTION), M_END);
    }
  } else {
    G.pCont = false;
  }
  if (G.pWon) {
    if (isClockerVerb()) {
      v = clocker();
    }
    G.pPrsaWord = false;
    G.prsa = false;
    G.prso = false;
    G.prsi = false;
  }
  if (G.awaitingFakeOrphan && !G.pOflag) {
    return orphanVerb();
  }
  return false;
}

export function isTooDarkForIt(): any {
  if (!G.lit && !isUltimatelyIn(G.pItObject, G.winner) && !isIn(G.winner, G.pItObject)) {
    tell(TOO_DARK, "\n");
    return true;
  }
  return false;
}

export function dontAll(obj1: any): any {
  let l: any = loc(obj1);
  if (eq(obj1, NOT_HERE_OBJECT)) {
    G.pNotHere = G.pNotHere + 1;
    return true;
  } else if (verbIs(V.TAKE) && G.prsi && !isIn(G.prso, G.prsi)) {
    return true;
  } else if (!isAccessible(obj1)) {
    return true;
  } else if (eq(G.pGetflags, P_ALL)) {
    if (G.prsi && prsoIs(G.prsi)) {
      return true;
    } else if (verbIs(V.TAKE)) {
      if (!hasFlag(obj1, TAKEBIT) && !hasFlag(obj1, TRYTAKEBIT)) {
        return true;
      } else if (!eq(l, G.winner, G.here, G.prsi) && !eq(l, loc(G.winner))) {
        if (hasFlag(l, SURFACEBIT) && !hasFlag(l, TAKEBIT)) {
          return false;
        } else {
          return true;
        }
      } else if (!G.prsi && isUltimatelyIn(G.prso)) {
        return true;
      } else {
        return false;
      }
    } else if (verbIs(V.DROP, V.PUT, V.PUT_ON, V.GIVE, V.SGIVE) && !isIn(obj1, G.winner)) {
      return true;
    } else if (verbIs(V.PUT, V.PUT_ON) && !isIn(G.prso, G.winner) && isUltimatelyIn(G.prso, G.prsi)) {
      return true;
    }
    return false;
  }
  return false;
}

export function isClockerVerb(): any {
  if (verbIs(V.VERSION, V.HELP, V.STATUS, V.$RECORD, V.$UNRECORD, V.$COMMAND, V.$RANDOM, V.SAVE, V.RESTORE, V.RESTART, V.QUIT, V.SCRIPT, V.UNSCRIPT, V.BRIEF, V.SUPER_BRIEF, V.VERBOSE, V.LEWD, V.TAME, V.SUGGESTIVE)) {
    return false;
  } else {
    return true;
  }
}

G.pWon = false;

G.pMult = false;

G.pNotHere = 0;

export function fakeOrphan(itWasUsed: any = false): any {
  let tmp: any = 0;
  orphan(G.pSyntax, false);
  tmp = get(P_OTBL, P_VERBN);
  tell("[Be specific: Wh");
  if (itWasUsed) {
    tell("at object");
  } else {
    tell("o");
  }
  tell(" do you want to ");
  if (eq(tmp, 0)) {
    tell("tell");
  } else if (!getb(P_VTBL, 2)) {
    printb(get(tmp, 0));
  } else {
    wordPrint(getb(tmp, 2), getb(tmp, 3));
    putb(P_VTBL, 2, 0);
  }
  G.pOflag = true;
  G.pWon = false;
  prepPrint(getb(G.pSyntax, P_SPREP1));
  tell("?]\n");
  return true;
}

export function performPrsa(o: any = false, i: any = false): any {
  return perform(G.prsa, o, i);
}

export function perform(a: any, o: any = false, i: any = false): any {
  let v: any = 0;
  let oa: any = 0;
  let oo: any = 0;
  let oi: any = 0;
  oa = G.prsa;
  oo = G.prso;
  oi = G.prsi;
  G.prsa = a;
  if (eq(IT, o, i)) {
    if (isVisible(G.pItObject)) {
      if (eq(IT, o)) {
        o = G.pItObject;
      } else {
        i = G.pItObject;
      }
    } else {
      if (!i) {
        fakeOrphan(true);
      } else {
        referring();
      }
      return M_FATAL;
    }
  }
  if (eq(HIM, o, i)) {
    if (isVisible(G.pHimObject)) {
      if (eq(HIM, o)) {
        o = G.pHimObject;
      } else {
        i = G.pHimObject;
      }
    } else {
      if (!i) {
        fakeOrphan();
      } else {
        referring(true);
      }
      return M_FATAL;
    }
  }
  if (eq(HER, o, i)) {
    if (isVisible(G.pHerObject)) {
      if (eq(HER, o)) {
        o = G.pHerObject;
      } else {
        i = G.pHerObject;
      }
    } else {
      if (!i) {
        fakeOrphan();
      } else {
        referring(true);
      }
      return M_FATAL;
    }
  }
  G.prso = o;
  G.prsi = i;
  if (!eq(a, V.WALK) && eq(NOT_HERE_OBJECT, G.prso, G.prsi) && (v = dApply("Not Here", notHereObjectF))) {
    G.pWon = false;
  } else {
    o = G.prso;
    i = G.prsi;
    thisIsIt(G.prsi);
    thisIsIt(G.prso);
    if (v = dApply("Actor", getp(G.winner, P.ACTION))) {
    } else if (v = dApply("Preaction", get(PREACTIONS, a))) {
    } else if (i && (v = dApply("PRSI", getp(i, P.ACTION)))) {
    } else if (o && !eq(a, V.WALK) && (v = dApply("PRSO", getp(o, P.ACTION)))) {
    } else if (v = dApply(false, get(ACTIONS, a))) {
    }
  }
  G.prsa = oa;
  G.prso = oo;
  G.prsi = oi;
  return v;
}

export function dApply(_str: any, fcn: any, foo: any = false): any {
  let res: any = 0;
  let _t1: any;
  if (!fcn) {
    return false;
  } else {
    if (foo) {
      _t1 = apply(fcn, foo);
    } else {
      _t1 = apply(fcn);
    }
    res = _t1;
    return res;
  }
}

export const C_TABLE = itable("C-TABLE", 30, ["NONE"], []);

G.clockWait = false;

G.cInts = 60;

G.cMaxints = 60;

G.clockHand = false;

export function dequeue(rtn: any): any {
  if (rtn = isQueued(rtn)) {
    put(rtn, C_RTN, 0);
    return true;
  }
  return false;
}

export function isQueued(rtn: any): any {
  let c: any = 0;
  let e: any = 0;
  e = rest(C_TABLE, C_TABLELEN);
  c = rest(C_TABLE, G.cInts);
  for (;;) {
    if (eq(c, e)) {
      return false;
    } else if (eq(get(c, C_RTN), rtn)) {
      if (!get(c, C_TICK)) {
        return false;
      } else {
        return c;
      }
    }
    c = rest(c, C_INTLEN);
  }
}

export function isRunning(rtn: any): any {
  let c: any = 0;
  let e: any = 0;
  e = rest(C_TABLE, C_TABLELEN);
  c = rest(C_TABLE, G.cInts);
  for (;;) {
    if (eq(c, e)) {
      return false;
    } else if (eq(get(c, C_RTN), rtn)) {
      if (!get(c, C_TICK) || get(c, C_TICK) > 1) {
        return false;
      } else {
        return true;
      }
    }
    c = rest(c, C_INTLEN);
  }
}

export function queue(rtn: any, tick: any): any {
  let c: any = 0;
  let e: any = 0;
  let int: any = false;
  e = rest(C_TABLE, C_TABLELEN);
  c = rest(C_TABLE, G.cInts);
  for (;;) {
    if (eq(c, e)) {
      if (int) {
        c = int;
      } else {
        if (G.cInts < C_INTLEN) {
          tell("**Too many ints!**\n");
        }
        G.cInts = G.cInts - C_INTLEN;
        if (G.cInts < G.cMaxints) {
          G.cMaxints = G.cInts;
        }
        int = rest(C_TABLE, G.cInts);
      }
      put(int, C_RTN, rtn);
      break;
    } else if (eq(get(c, C_RTN), rtn)) {
      int = c;
      break;
    } else if (!get(c, C_RTN)) {
      int = c;
    }
    c = rest(c, C_INTLEN);
  }
  if (int > G.clockHand) {
    tick = -(tick + 3);
  }
  put(int, C_TICK, tick);
  return int;
}

export function clocker(): any {
  let e: any = 0;
  let tick: any = 0;
  let rtn: any = 0;
  let flg: any = false;
  let isQ: any = false;
  let owinner: any = 0;
  if (G.clockWait) {
    G.clockWait = false;
    return false;
  }
  G.clockHand = rest(C_TABLE, G.cInts);
  e = rest(C_TABLE, C_TABLELEN);
  owinner = G.winner;
  G.winner = PROTAGONIST;
  for (;;) {
    if (eq(G.clockHand, e)) {
      G.clockHand = e;
      G.moves = G.moves + 1;
      G.winner = owinner;
      return flg;
    } else if (!!get(G.clockHand, C_RTN)) {
      tick = get(G.clockHand, C_TICK);
      if (tick < -1) {
        put(G.clockHand, C_TICK, -tick - 3);
        isQ = G.clockHand;
      } else if (!!tick) {
        if (tick > 0) {
          tick = tick - 1;
          put(G.clockHand, C_TICK, tick);
        }
        if (!!tick) {
          isQ = G.clockHand;
        }
        if (!(tick > 0)) {
          rtn = get(G.clockHand, C_RTN);
          if (!tick) {
            put(G.clockHand, C_RTN, 0);
          }
          if (apply(rtn)) {
            flg = true;
          }
          if (!isQ && !!get(G.clockHand, C_RTN)) {
            isQ = true;
          }
        }
      }
    }
    G.clockHand = rest(G.clockHand, C_INTLEN);
    if (!isQ) {
      G.cInts = G.cInts + C_INTLEN;
    }
  }
}
