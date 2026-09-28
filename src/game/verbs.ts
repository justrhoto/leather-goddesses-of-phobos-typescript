// verbs.ts — from VERBS.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  A, AR, D, HEADER, N, PD, T, TR, apply, btst, clearFlag, crlf, dirin, dirout, eq, first, get, getb,
  getp, getpt, hasFlag, isIn, loc, move, next, nextp, print, printc, prob, ptsize, put, putb, putp,
  quit, random, read, remove, restart, restore, save, setFlag, tell, value, verify,
} from "../engine/runtime.ts";
import {
  ltable, table,
} from "../engine/table.ts";
import {
  undoTrap,
} from "./cleveland.ts";
import {
  iKidnapping, iUrge, noticePizzaOdor,
} from "./earth.ts";
import {
  cantReach, cantSee, cantVerbAPrso, doFirst, expletive, heShe, himHer, inCatacombs, inPackage,
  incrementScore, isInSpace, isOffVehicle, noOneHere, notIn, nounUsed, openClosed,
  openEyesAndRemoveHands, openYourEyes, playerCantSee, pronoun, recognize, seeManual, sore,
  tellHitHead, wee,
} from "./globals.ts";
import {
  ION_TABLE, canalLoc, iBeetles, iCrabs, iGator, iSneeze, iSultan, pickWife, riddleAnswer, riddleDeath,
  tigerEatsSidekick,
} from "./mars.ts";
import {
  clocker, dequeue, isRunning, perform, performPrsa, pickOne, queue,
} from "./misc.ts";
import {
  P_INBUF, P_ITBL, P_LEXV, P_NAMW, P_OTBL, P_OVTBL, P_VTBL, isLit, isNumber, prsiPrint, prsoPrint,
  thisIsIt, zmemqb,
} from "./parser.ts";
import {
  holeEnterF, notAloneOnDivan,
} from "./phobos.ts";
import {
  applyStain, iFlytrap,
} from "./venus.ts";
import {
  ACT, ACTORBIT, ALREADY_IN_MODE, ALREADY_IS, AUDIENCE_CHAMBER, BABY, BARGE, BASKET, BED, BEDROOM,
  BEER, BEM, BLANKET, BOUDOIR, BURIAL_CHAMBER, BURNBIT, CAGE, CANAL, CANAL_OBJECT, CANT_FROM_HERE,
  CANT_GO, CATACOMBS, CEILING, CELL, CEXIT, CEXITFLAG, CEXITSTR, CHOCOLATE, CLOSET, CLOTHES_PIN, COCK,
  CODED_MESSAGE, COMIC_BOOK, CONTBIT, COTTON_BALLS, CREAM, CUNT, DEXIT, DEXITOBJ, DEXITSTR, DIVAN,
  DOCK_OBJECT, DOORBIT, DUST, D_ALL_Q, D_PARA_Q, D_RECORD_OFF, D_RECORD_ON, EARS, EXIT_SHOP, EYES,
  FAILED, FEMALEBIT, FEMALE_GORILLA, FEXIT, FEXITFCN, FIRST_SLAB, FLASHLIGHT, FLEXIBLE_HOLE, FLYTRAP,
  FORGOTTEN_STOREHOUSE, G, GARMENT, GLOBAL_OBJECTS, GORILLA_ATE_CHOCOLATE, GROUND, HANDS, HAREM_GUARD,
  HEAD, HOLDING_IT, HOLE, HUH, HUMAN_ATE_CHOCOLATE, INBIT, INDOORSBIT, INNER_HAREM, INTDIR, INTNUM,
  INVISIBLE, IN_SPACE, IT_SEEMS_THAT, JOES_BAR, LABORATORY, LADDER_ROOM, LADIES_ROOM, LEAVES,
  LGOP_CAPS, LIGHTBIT, LIP_BALM, LOCAL_GLOBALS, LOCKEDBIT, LONG_CORRIDOR, LOOK_AROUND, LOVE,
  LOW_DIRECTION, MALE_GORILLA, MAP, MATCHBOOK, ME, MENS_ROOM, MINARET, MOUTH, MUNGBIT, MY_KIND_OF_DOCK,
  M_ENTER, M_FATAL, M_LOOK, M_OBJDESC, M_OBJDESC_Q, N45_DEGREE_ANGLE, NARTICLEBIT, NDESCBIT, NEXIT,
  NEXITSTR, NOSE, NO_VERB, ODD_MACHINE, ODOR, OK, ONBIT, ONE_MARSMID_COIN, ONLY_BLACKNESS,
  ONLY_ONE_THING_IN_COMPARTMENT, ONLY_WITH_A_RAKE, OPENBIT, P, PARTBIT, PERIOD_CR, PIZZA, PLURALBIT,
  POCKET, POWER_SWITCH, PR, PROTAGONIST, PSEUDO_OBJECT, P_LEXSTART, P_NC1, P_NC1L, P_NC2, P_NC2L,
  P_PREP1, P_PREP1N, P_PREP2, P_VERB, P_VERBN, RAFT, RAKE, READBIT, REXIT, ROCKY_CLIFFTOP, ROOF, ROOMS,
  RUINED_CASTLE_2, SACK, SCRAP_OF_PAPER, SEARCHBIT, SECOND_SLAB, SENILITY_STRIKES, SERIAL, SHEET,
  SHELF, SIDEKICK, SOD, STAIN, STALLION, STOOL, SULTAN, SULTANS_WIFE, SURFACEBIT, TAKEBIT,
  TEN_MARSMID_COIN, THERES_NOTHING, THETA, THRONE_ROOM, TITS, TOO_DARK, TORCH, TOUCHBIT, TRANSBIT,
  TREE_HOLE, TRELLIS, UEXIT, UNTEEDBIT, V, VEHBIT, VIZICOMM, VIZICOMM_BOOTH, W, WATER, WEARBIT,
  WELL_BOTTOM, WHITE_SUIT, WINDOW, WORNBIT, YNH, YOULL_HAVE_TO, YOU_CANT, YOU_CANT_SEE_ANY, YOU_SEE,
  prsiIs, prsoIs, verbIs,
} from "./world.ts";

G.verbosity = 1;

export function vVerbose(): any {
  G.verbosity = 2;
  tell("Maximum verbosity.\n\n");
  return vLook();
}

export function vBrief(): any {
  G.verbosity = 1;
  tell("Brief descriptions.\n");
  return true;
}

export function vSuperBrief(): any {
  G.verbosity = 0;
  tell("Super-brief descriptions.\n");
  return true;
}

G.naughtyLevel = 1;

G.age = -1;

export function vTame(): any {
  if (eq(G.naughtyLevel, 0)) {
    tell(ALREADY_IN_MODE);
    return true;
  } else {
    G.naughtyLevel = 0;
    tell("Tame descriptions. [Yawn.]\n");
    return true;
  }
}

export function vSuggestive(): any {
  if (eq(G.naughtyLevel, 1)) {
    tell(ALREADY_IN_MODE);
    return true;
  } else {
    G.naughtyLevel = 1;
    tell("Suggestive descriptions.\n");
    return true;
  }
}

export function vLewd(): any {
  let acceptableAge: any = false;
  if (eq(G.naughtyLevel, 2)) {
    tell(ALREADY_IN_MODE);
    return true;
  } else if (G.age > 17) {
    acceptableAge = true;
  } else {
    putb(P_LEXV, 0, 10);
    tell("What is your age? >");
    for (;;) {
      read(P_INBUF, P_LEXV);
      crlf();
      if (eq(isNumber(P_LEXSTART), W.NUMBER)) {
        if (G.pNumber < 18) {
          G.age = G.pNumber;
          if (G.pNumber < 5) {
            tell("Precocious, aren't you! Unfortunately");
          } else {
            tell("Sorry");
          }
          tell(", you must be at least 18 to enter LEWD mode.\n");
          break;
        } else if (G.pNumber > 120) {
          tell("Bullpuckies. Tell the truth. >");
        } else if (G.age > -1 && G.age < 19) {
          tell("Liar! You said before that you were ", N(G.age), PERIOD_CR);
          break;
        } else {
          G.age = G.pNumber;
          tell("Acceptable age. ");
          acceptableAge = true;
          break;
        }
      } else {
        tell("Please tell me your age! >");
      }
    }
    putb(P_LEXV, 0, 60);
  }
  if (acceptableAge) {
    tell("Switching to LEWD level.\n");
    return G.naughtyLevel = 2;
  }
  return false;
}

export function vSave(): any {
  if (eq(G.here, AUDIENCE_CHAMBER) && !G.riddleAnswered) {
    tell("\"Oh, all right,\" says", T(SULTAN), ", \"I'll bend the rules a tad. You may SAVE.\"\n\n");
  }
  G.pCont = false;
  G.quoteFlag = false;
  if (save()) {
    tell(OK);
    return true;
  } else {
    tell(FAILED);
    return true;
  }
}

export function vRestore(): any {
  if (restore()) {
    tell(OK);
    return true;
  } else {
    tell(FAILED);
    return true;
  }
}

export function tellScore(): any {
  tell("In ", N(G.moves), " turn");
  if (!eq(G.moves, 1)) {
    tell("s");
  }
  tell(", you have achieved a score of, um, oh, call it ", N(G.score), " out of ", N(G.extMax), " points. This gives you the rank of ");
  if (G.male) {
    tell(get(MALE_RANKS, G.rank));
  } else {
    tell(get(FEMALE_RANKS, G.rank));
  }
  tell(PERIOD_CR);
  return true;
}

export const MALE_RANKS = table("MALE-RANKS", [
    "Sandusky Stablehand",
    "Knight of Columbus",
    "Baron of Buffalo",
    "Viscount of Van Wert County",
    "Earl of Altoona",
    "Marquess of McKeesport",
    "Duke of Detroit",
    "Prince of Pike's Peak",
    "King of Queens",
    "Interplanetary Emperor",
  ]);

export const FEMALE_RANKS = table("FEMALE-RANKS", [
    "Sandusky Stablehand",
    "Dame of Dayton",
    "Baroness of Buffalo",
    "Viscountess of Van Wert County",
    "Countess of Cleveland",
    "Marchioness of McKeesport",
    "Duchess of Detroit",
    "Princess of Pike's Peak",
    "Queen of King of Prussia",
    "Interplanetary Empress",
  ]);

export function vScript(): any {
  put(HEADER, 8, get(HEADER, 8) | 1);
  corpNotice("begins");
  return vVersion();
}

export function vUnscript(): any {
  corpNotice("ends");
  vVersion();
  put(HEADER, 8, get(HEADER, 8) & -2);
  return true;
}

export function corpNotice(string: any): any {
  tell("Here ", string, " a transcript of interaction with ", LGOP_CAPS, PERIOD_CR);
  return true;
}

export function vDiagnose(): any {
  if (!hasFlag(CELL, TOUCHBIT)) {
    tell("You're pretty drunk");
    if (isRunning(iUrge)) {
      tell(", and your bladder is about to burst");
    }
  } else if (G.ionDeathCounter > 0) {
    tell("You now have a ", get(ION_TABLE, G.ionDeathCounter), " headache");
  } else if (hasFlag(CATACOMBS, MUNGBIT) && inCatacombs()) {
    tell("You have some tiny wounds");
  } else if (G.goneApe && eq(G.sugarRush, GORILLA_ATE_CHOCOLATE) || !G.goneApe && eq(G.sugarRush, HUMAN_ATE_CHOCOLATE)) {
    tell("You're experiencing a sugar rush");
  } else if (eq(G.here, RUINED_CASTLE_2) && hasFlag(G.here, MUNGBIT) && !eq(G.naughtyLevel, 0)) {
    tell("You feel ");
    if (eq(G.naughtyLevel, 1)) {
      tell("sexually unsatisfied");
    } else {
      tell("horny");
    }
  } else if (eq(G.here, IN_SPACE) && !hasFlag(WHITE_SUIT, WORNBIT)) {
    tell("Brrr");
  } else {
    tell("You are in good health");
    if (G.goneApe) {
      tell(" (for a gorilla)");
    }
  }
  tell(PERIOD_CR);
  return true;
}

export function vInventory(): any {
  if (G.goneApe && !first(PROTAGONIST)) {
    tell("You are empty-pawed.\n");
    return true;
  } else {
    describeContents(PROTAGONIST, false);
    if (isUltimatelyIn(FLASHLIGHT) && eq(G.here, JOES_BAR, MENS_ROOM, LADIES_ROOM)) {
      tell(" It's not clear why you've carried", A(FLASHLIGHT), " into ", PD(JOES_BAR), ", except that the lighting in the bathrooms isn't too reliable.");
    }
    crlf();
    return true;
  }
}

export function vQuit(): any {
  tellScore();
  doYouWish("leave the game");
  if (isYes()) {
    return quit();
  } else {
    tell(OK);
    return true;
  }
}

export function vRestart(): any {
  tellScore();
  doYouWish("restart");
  if (isYes()) {
    tell("Restarting.\n");
    restart();
    tell(FAILED);
    return true;
  }
  return false;
}

export function doYouWish(string: any): any {
  tell("\nDo you wish to ", string, "? (Y is affirmative): ");
  return true;
}

export function isYes(): any {
  restart: for (;;) {
    print(">");
    read(P_INBUF, P_LEXV);
    if (yesWord(get(P_LEXV, 1))) {
      return true;
    } else if (noWord(get(P_LEXV, 1)) || eq(get(P_LEXV, 1), W.N)) {
      return false;
    } else {
      tell("Please answer YES or NO. ");
      continue restart;
    }
  }
}

export function finish(): any {
  let repeating: any = false;
  let cnt: any = 0;
  for (;;) {
    crlf();
    if (!repeating) {
      repeating = true;
      tellScore();
    }
    tell("Would you like to start over, restore a saved position, or end this session of the game?\n(Type RESTART, RESTORE, or QUIT): >");
    putb(P_LEXV, 0, 10);
    read(P_INBUF, P_LEXV);
    putb(P_LEXV, 0, 60);
    cnt = cnt + 1;
    if (eq(get(P_LEXV, 1), W.RESTAR)) {
      restart();
      tell(FAILED);
      continue;
    } else if (eq(get(P_LEXV, 1), W.RESTOR) && !restore()) {
      tell(FAILED);
      continue;
    } else if (eq(get(P_LEXV, 1), W.QUIT, W.Q) || cnt > 10) {
      quit();
    }
    continue;
  }
}

export function vStatus(): any {
  tell("You are currently in ");
  if (eq(G.naughtyLevel, 0)) {
    tell("tame");
  } else if (eq(G.naughtyLevel, 1)) {
    tell("suggestive");
  } else {
    tell("lewd");
  }
  tell(" mode and are getting ");
  if (eq(G.verbosity, 0)) {
    tell("super-brief");
  } else if (eq(G.verbosity, 1)) {
    tell("brief");
  } else {
    tell("verbose");
  }
  tell(" descriptions. ");
  return tellScore();
}

export function vVersion(): any {
  let cnt: any = 17;
  let v: any = 0;
  v = get(HEADER, 1) & 2047;
  tell(LGOP_CAPS, "\nInfocom interactive fiction -- a racy space-age spoof\nCopyright (c) 1986 by Infocom, Inc. All rights reserved.\n", LGOP_CAPS, " is a trademark of Infocom, Inc.\nRelease ", N(v), " / Serial number ");
  for (;;) {
    if ((cnt = cnt + 1) > 23) {
      break;
    } else {
      printc(getb(HEADER, cnt));
    }
  }
  crlf();
  return true;
}

export function vDollarCommand(): any {
  dirin(1);
  return true;
}

export function vDollarRandom(): any {
  if (!prsoIs(INTNUM)) {
    tell("ILLEGAL.\n");
    return true;
  } else {
    random(0 - G.pNumber);
    return true;
  }
}

export function vDollarRecord(): any {
  dirout(D_RECORD_ON);
  return true;
}

export function vDollarUnrecord(): any {
  dirout(D_RECORD_OFF);
  return true;
}

export function vDollarVerify(): any {
  if (prsoIs(INTNUM) && eq(G.pNumber, 69)) {
    tell(N(SERIAL), "\n");
    return true;
  } else {
    tell("Verifying.\n");
    if (verify()) {
      tell(OK);
      return true;
    } else {
      tell("\n** Bad **\n");
      return true;
    }
  }
}

export function vAlarm(): any {
  if (prsoIs(ROOMS)) {
    performPrsa(ME);
    return true;
  } else {
    tell("But", T(G.prso), " isn't asleep.\n");
    return true;
  }
}

export function vAnswer(): any {
  if (G.awaitingReply && yesWord(get(P_LEXV, G.pCont))) {
    vYes();
    return stop();
  } else if (G.awaitingReply && noWord(get(P_LEXV, G.pCont))) {
    vNo();
    return stop();
  } else if (isRunning(iSneeze)) {
    return riddleAnswer();
  } else if (isIn(HAREM_GUARD, G.here)) {
    return pickWife();
  } else {
    tell("Nobody is awaiting your answer.\n");
    return stop();
  }
}

export function vAnswerKludge(): any {
  if (nounUsed(W.I, ME)) {
    return vInventory();
  } else {
    G.pWon = false;
    tell(NO_VERB);
    return stop();
  }
}

G.awaitingFakeOrphan = false;

export function orphanVerb(): any {
  if (!eq(G.here, AUDIENCE_CHAMBER, BEDROOM)) {
    G.awaitingFakeOrphan = false;
    return false;
  }
  put(P_VTBL, 0, W.ZZMGCK);
  put(P_OVTBL, 0, W.ANSWER);
  put(P_OTBL, P_VERB, ACT.ZZMGCK);
  put(P_OTBL, P_VERBN, P_VTBL);
  put(P_OTBL, P_PREP1, 0);
  put(P_OTBL, P_PREP1N, 0);
  put(P_OTBL, P_PREP2, 0);
  put(P_OTBL, 5, 0);
  put(P_OTBL, P_NC1, 1);
  put(P_OTBL, P_NC1L, 0);
  put(P_OTBL, P_NC2, 0);
  put(P_OTBL, P_NC2L, 0);
  return G.pOflag = true;
}

export function vApplaud(): any {
  if (inCatacombs()) {
    queue(iBeetles, 6);
  }
  tell("Clap.\n");
  return true;
}

export function vApply(): any {
  if (hasFlag(G.prso, WEARBIT)) {
    perform(V.WEAR, G.prso);
    return true;
  } else {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Apply", T(G.prso), " for what? A job?\n");
    return true;
  }
}

export function preSpeak(): any {
  if (G.goneApe) {
    tell("You open ", PD(MOUTH), " to speak, but all that comes out are a few grunts.\n");
    return stop();
  } else if (hasFlag(EARS, MUNGBIT)) {
    tell(YOU_CANT, "carry on a conversation when ", PD(EARS), " are");
    if (eq(EARS, G.handCover)) {
      tell(" covered");
    } else {
      tell(" plugged up");
    }
    tell(PERIOD_CR);
    return stop();
  }
  return false;
}

export function vAskAbout(): any {
  let owinner: any = 0;
  if (prsoIs(ME)) {
    perform(V.TELL, ME);
    return true;
  } else if (hasFlag(G.prso, ACTORBIT) || prsoIs(INTNUM) && eq(G.pNumber, G.choiceNumber) && isIn(SULTANS_WIFE, G.here)) {
    owinner = G.winner;
    G.winner = G.prso;
    perform(V.TELL_ABOUT, ME, G.prsi);
    G.winner = owinner;
    thisIsIt(G.prsi);
    thisIsIt(G.prso);
    return true;
  } else {
    perform(V.TELL, G.prso);
    return true;
  }
}

export function vAskFor(): any {
  tell("Unsurprisingly,", T(G.prso), " doesn't oblige.\n");
  return true;
}

export function vAskNoOneFor(): any {
  let actor: any = 0;
  if (actor = findIn(G.here, ACTORBIT)) {
    perform(V.ASK_FOR, actor, G.prso);
    return true;
  } else {
    return noOneHere("ask");
  }
}

export function vBarterWith(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    tell("But", T(G.prso), " has nothing worth trading for.\n");
    return true;
  } else {
    return impossibles();
  }
}

export function vBarterFor(): any {
  return impossibles();
}

export function vBend(): any {
  if (eq(G.pPrsaWord, W.SPREAD)) {
    if (hasFlag(G.prso, ACTORBIT)) {
      return vBoard();
    } else {
      return hackHack("Spreading");
    }
  } else {
    return hackHack("Bending");
  }
}

export function vBite(): any {
  return hackHack("Biting");
}

export function vBlow(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    perform(V.EAT, G.prso);
    return true;
  } else {
    return cantVerbAPrso("blow");
  }
}

export function preBoard(): any {
  if (isIn(PROTAGONIST, G.prso)) {
    tell(LOOK_AROUND);
    return true;
  } else if (isUltimatelyIn(G.prso) && !prsoIs(FLEXIBLE_HOLE)) {
    tell(HOLDING_IT);
    return true;
  } else if (isUntouchable(G.prso)) {
    return cantReach(G.prso);
  }
  return false;
}

export function vBoard(): any {
  if (hasFlag(G.prso, VEHBIT)) {
    if (!eq(loc(G.prso), G.here, LOCAL_GLOBALS)) {
      tell(YOU_CANT, "board", T(G.prso), " when it's ");
      if (hasFlag(loc(G.prso), SURFACEBIT)) {
        tell("on");
      } else {
        tell("in");
      }
      tell(TR(loc(G.prso)));
      return true;
    }
    move(PROTAGONIST, G.prso);
    tell("You are now ");
    if (hasFlag(G.prso, INBIT)) {
      tell("i");
    } else {
      tell("o");
    }
    tell("n", T(G.prso), ".");
    if (isIn(SIDEKICK, G.here) && prsoIs(BARGE, RAFT, STALLION, TREE_HOLE)) {
      move(SIDEKICK, G.prso);
      tell(" ", D(SIDEKICK), " gets ");
      if (hasFlag(G.prso, INBIT)) {
        tell("i");
      } else {
        tell("o");
      }
      tell("n behind you.");
    }
    if (prsoIs(BARGE) && !hasFlag(BARGE, TOUCHBIT)) {
      tell(" You notice some simple controls.");
    }
    setFlag(G.prso, TOUCHBIT);
    crlf();
    return true;
  } else if (hasFlag(G.prso, ACTORBIT)) {
    tell("Let's not beat around the bush. Come out and say what you mean.\n");
    return true;
  } else if (eq(get(P_ITBL, P_PREP1), PR.IN)) {
    return cantVerbAPrso("get into");
  } else {
    return cantVerbAPrso("get onto");
  }
}

export function vBoardDir(): any {
  return recognize();
}

export function vBurn(): any {
  if (!G.prsi) {
    if (isUltimatelyIn(TORCH) && hasFlag(TORCH, ONBIT)) {
      G.prsi = TORCH;
      tell("[with the torch]\n");
    } else {
      tell("You have no source of fire.\n");
      return true;
    }
  }
  if (!prsiIs(TORCH) || !hasFlag(TORCH, ONBIT)) {
    tell(YOU_CANT, "burn something with", AR(G.prsi));
    return true;
  } else if (prsoIs(SHEET) && G.sheetTied) {
    return doFirst("untie", G.prso);
  } else if (isIn(PROTAGONIST, G.prso)) {
    return doFirst("leave", G.prso);
  } else if (isUltimatelyIn(G.prso)) {
    return doFirst("drop", G.prso);
  } else if (hasFlag(G.prso, BURNBIT)) {
    if (prsoIs(LEAVES) && G.leavesPlaced) {
      G.prso = TRELLIS;
    }
    remove(G.prso);
    tell("In an instant,", T(G.prso));
    if (prsoIs(TRELLIS) && G.leavesPlaced) {
      remove(LEAVES);
      G.leavesPlaced = false;
      tell(" and leaves are");
    } else {
      tell(" is");
    }
    if (prsoIs(TRELLIS)) {
      undoTrap();
    } else if (prsoIs(LEAVES)) {
      G.leavesPlaced = false;
    }
    tell(" consumed by fire.\n");
    return true;
  } else {
    return cantVerbAPrso("burn");
  }
}

export function vBuy(): any {
  tell("Sorry, there aren't any on sale here.\n");
  return true;
}

export function vBuyWith(): any {
  if (prsiIs(ONE_MARSMID_COIN, TEN_MARSMID_COIN)) {
    perform(V.BUY, G.prso);
    return true;
  } else {
    tell("That must be a queer planet you come from, where", A(G.prsi), " is a unit of money.\n");
    return true;
  }
}

export function vCall(): any {
  if (eq(G.here, VIZICOMM_BOOTH)) {
    perform(V.SET, VIZICOMM);
    return true;
  } else if (!isVisible(G.prso)) {
    return cantSee(G.prso);
  } else {
    perform(V.TELL, G.prso);
    return true;
  }
}

export function vCastOff(): any {
  if (prsoIs(ROOMS)) {
    perform(V.LAUNCH, loc(PROTAGONIST));
    return true;
  } else {
    perform(V.TAKE_OFF, G.prso);
    return true;
  }
}

export function vCatch(): any {
  tell("The only thing you're good at catching is a cold.\n");
  return true;
}

export function vChastise(): any {
  if (prsoIs(INTDIR)) {
    tell(YOULL_HAVE_TO, "go in that direction to see what's there.\n");
    return true;
  } else {
    tell("Use prepositions to indicate precisely what you want to do: LOOK AT the object, LOOK INSIDE it, LOOK UNDER it, etc.\n");
    return true;
  }
}

export function vCheer(): any {
  if (prsoIs(ROOMS)) {
    tell(OK);
    return true;
  } else {
    tell("Probably,", T(G.prso), " is as happy as possible.\n");
    return true;
  }
}

export function vClean(): any {
  G.awaitingReply = 2;
  queue(iReply, 2);
  tell("Do you also do windows?\n");
  return true;
}

export function vClick(): any {
  tell("\"Click.\"\n");
  return true;
}

export function vClimb(): any {
  if (prsoIs(ROOMS)) {
    return doWalk(P.UP);
  } else if (isUltimatelyIn(G.prso)) {
    tell(HOLDING_IT);
    return true;
  } else {
    return impossibles();
  }
}

export function vClimbDown(): any {
  if (prsoIs(ROOMS)) {
    return doWalk(P.DOWN);
  } else if (isUltimatelyIn(G.prso)) {
    tell(HOLDING_IT);
    return true;
  } else if (hasFlag(G.prso, ACTORBIT) && eq(G.pPrsaWord, W.GO)) {
    perform(V.EAT, G.prso);
    return true;
  } else {
    return impossibles();
  }
}

export function vClimbOn(): any {
  if (hasFlag(G.prso, VEHBIT) || hasFlag(G.prso, ACTORBIT)) {
    perform(V.BOARD, G.prso);
    return true;
  } else if (isUltimatelyIn(G.prso)) {
    tell(HOLDING_IT);
    return true;
  } else if (eq(get(P_ITBL, P_PREP1), PR.IN)) {
    return cantVerbAPrso("climb into");
  } else {
    return cantVerbAPrso("climb onto");
  }
}

export function vClimbOver(): any {
  if (isUltimatelyIn(G.prso)) {
    tell(HOLDING_IT);
    return true;
  } else {
    return impossibles();
  }
}

export function vClimbUp(): any {
  if (prsoIs(ROOMS)) {
    return doWalk(P.UP);
  } else if (isUltimatelyIn(G.prso)) {
    tell(HOLDING_IT);
    return true;
  } else {
    return impossibles();
  }
}

export function vClose(): any {
  if (hasFlag(G.prso, SURFACEBIT) || hasFlag(G.prso, ACTORBIT) || hasFlag(G.prso, VEHBIT)) {
    return cantVerbAPrso("close");
  } else if (hasFlag(G.prso, DOORBIT) || hasFlag(G.prso, CONTBIT)) {
    if (hasFlag(G.prso, OPENBIT)) {
      clearFlag(G.prso, OPENBIT);
      tell("Okay,", T(G.prso), " is now closed.\n");
      return isNowDark();
    } else {
      tell(ALREADY_IS);
      return true;
    }
  } else {
    return cantVerbAPrso("close");
  }
}

export function vCome(): any {
  if (eq(G.naughtyLevel, 0)) {
    tell("Go.\n");
    return true;
  } else {
    tell("You're not even breathing hard.\n");
    return true;
  }
}

export function vCopulate(): any {
  let lover: any = false;
  if (lover = findIn(G.here, ACTORBIT, "with")) {
    perform(V.FUCK, lover);
    return true;
  } else {
    perform(V.MAKE, LOVE);
    return true;
  }
}

export function vCount(): any {
  return impossibles();
}

export function vCrawlUnder(): any {
  if (!hasFlag(G.prso, TAKEBIT)) {
    return tellHitHead();
  } else {
    return impossibles();
  }
}

export function vCross(): any {
  return vWalkAround();
}

export function vCut(): any {
  if (!G.prsi) {
    return impossibles();
  } else {
    tell("To put it bluntly, neither", T(G.prsi), " nor you are very sharp.\n");
    return true;
  }
}

export function vDecode(): any {
  tell(YOULL_HAVE_TO, "figure it out yourself.\n");
  return true;
}

export function vDeflate(): any {
  return impossibles();
}

export function vDig(): any {
  return wastes();
}

export function vDisembark(): any {
  if (!G.prso) {
    if (!isIn(PROTAGONIST, G.here)) {
      performPrsa(loc(PROTAGONIST));
      return true;
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (eq(G.pPrsaWord, W.TAKE)) {
    perform(V.TAKE, G.prso);
    return true;
  } else if (!isIn(PROTAGONIST, G.prso)) {
    tell(LOOK_AROUND);
    return M_FATAL;
  } else if (eq(G.here, CANAL)) {
    perform(V.ENTER, CANAL_OBJECT);
    return true;
  } else {
    move(PROTAGONIST, G.here);
    tell("You");
    if (isIn(SIDEKICK, G.prso)) {
      move(SIDEKICK, G.here);
      tell(" and ", D(SIDEKICK));
    }
    tell(" get o");
    if (isOffVehicle(G.prso)) {
      tell("ff");
    } else {
      tell("ut of");
    }
    tell(T(G.prso), ".");
    if (isIn(SIDEKICK, SECOND_SLAB)) {
      move(SIDEKICK, G.here);
      tell(" You also ");
      if (G.sidekicksBodyTiedToSlab) {
        tell("untie ", D(SIDEKICK), " and help ");
        himHer();
      } else {
        tell("help ", D(SIDEKICK));
      }
      tell(" up from", T(SECOND_SLAB), ".");
    }
    crlf();
    return true;
  }
}

export function vDress(): any {
  if (G.prso) {
    if (hasFlag(G.prso, ACTORBIT)) {
      if (hasFlag(G.prso, FEMALEBIT)) {
        tell("Sh");
      } else {
        tell("H");
      }
      tell("e is dressed!\n");
      return true;
    } else {
      return impossibles();
    }
  } else {
    G.prso = ROOMS;
    return vGetDressed();
  }
}

export function vDrink(): any {
  return cantVerbAPrso("drink");
}

export function vDrinkFrom(): any {
  return impossibles();
}

export function vDrop(): any {
  if (!specialDrop()) {
    if (eq(loc(PROTAGONIST), BARGE, RAFT) || eq(loc(PROTAGONIST), TREE_HOLE, CAGE)) {
      move(G.prso, loc(PROTAGONIST));
    } else {
      move(G.prso, G.here);
    }
    tell("Dropped.\n");
    return true;
  }
  return false;
}

export function specialDrop(): any {
  if (inCatacombs()) {
    remove(G.prso);
    tell("With a splash,", T(G.prso), " is lost forever.\n");
    return true;
  } else if (isInSpace()) {
    move(G.prso, PROTAGONIST);
    tell("In the absence of gravity,", T(G.prso), " floats back into ", PD(HANDS), "s.\n");
    return true;
  } else if (eq(G.here, EXIT_SHOP)) {
    move(G.prso, DUST);
    tell("You lose", T(G.prso), " in the dust.\n");
    return true;
  } else if (prsoIs(TORCH) && hasFlag(TORCH, ONBIT) && isIn(PROTAGONIST, BARGE)) {
    perform(V.PUT, TORCH, BARGE);
    return true;
  }
  return false;
}

export function vEat(): any {
  if (hasFlag(G.prso, ACTORBIT) && !G.goneApe && !eq(G.naughtyLevel, 0)) {
    tell("As you try,", T(G.prso), " slaps you across the face.");
    if (!prsoIs(MALE_GORILLA, FEMALE_GORILLA)) {
      tell(" \"Really, we hardly know each other.\"");
    }
    crlf();
    return true;
  } else {
    tell("While the foodstuffs of the universe are many and varied,", A(G.prso));
    if (hasFlag(G.prso, PLURALBIT)) {
      tell(" are");
    } else {
      tell(" is");
    }
    tell(" not one of them.\n");
    return true;
  }
}

export function vEmpty(): any {
  let obj: any = 0;
  let nxt: any = 0;
  if (!G.prsi) {
    G.prsi = GROUND;
  }
  if (!hasFlag(G.prso, CONTBIT)) {
    tell(HUH);
    return true;
  } else if (!hasFlag(G.prso, OPENBIT)) {
    tell("But", T(G.prso), " isn't open.\n");
    return true;
  } else if (!first(G.prso)) {
    tell("But", T(G.prso), " is already empty!\n");
    return true;
  } else if (prsiIs(first(G.prso)) && !next(G.prsi)) {
    tell(THERES_NOTHING, "in", T(G.prso), " but", TR(G.prsi));
    return true;
  } else if (isInSpace()) {
    tell(YOU_CANT, "empty", T(G.prso), " without gravity!\n");
    return true;
  } else {
    obj = first(G.prso);
    for (;;) {
      nxt = next(obj);
      if (!eq(obj, PROTAGONIST)) {
        tell(D(obj), ": ");
        if (prsiIs(TRELLIS) && eq(obj, LEAVES)) {
          perform(V.PUT_ON, LEAVES, TRELLIS);
        } else if (hasFlag(obj, TAKEBIT)) {
          move(obj, PROTAGONIST);
          if (prsiIs(HANDS)) {
            tell("Taken.\n");
          } else if (prsiIs(GROUND)) {
            perform(V.DROP, obj);
          } else if (hasFlag(G.prsi, SURFACEBIT)) {
            perform(V.PUT_ON, obj, G.prsi);
          } else {
            perform(V.PUT, obj, G.prsi);
          }
        } else {
          yuks();
        }
      }
      if (nxt) {
        obj = nxt;
      } else {
        return true;
      }
    }
  }
}

export function vEmptyFrom(): any {
  if (isIn(G.prso, G.prsi)) {
    if (hasFlag(G.prso, TAKEBIT)) {
      move(G.prso, PROTAGONIST);
      perform(V.DROP, G.prso);
      return true;
    } else {
      return yuks();
    }
  } else {
    return notIn();
  }
}

export function vEnter(): any {
  if (hasFlag(G.prso, DOORBIT)) {
    doWalk(otherSide(G.prso));
    return true;
  } else if (hasFlag(G.prso, VEHBIT)) {
    perform(V.BOARD, G.prso);
    return true;
  } else if (hasFlag(G.prso, ACTORBIT)) {
    perform(V.BOARD, G.prso);
    return true;
  } else if (!hasFlag(G.prso, TAKEBIT)) {
    return tellHitHead();
  } else if (isUltimatelyIn(G.prso)) {
    tell(HOLDING_IT);
    return true;
  } else {
    return impossibles();
  }
}

export function vExamine(): any {
  if (hasFlag(G.prso, UNTEEDBIT)) {
    tell("It looks just like", A(G.prso), ", whatever that is.\n");
    return true;
  } else if (hasFlag(G.prso, ACTORBIT)) {
    if (first(G.prso)) {
      perform(V.LOOK_INSIDE, G.prso);
      return true;
    } else {
      nothingInteresting();
      tell("about", TR(G.prso));
      return true;
    }
  } else if (hasFlag(G.prso, DOORBIT) || hasFlag(G.prso, SURFACEBIT)) {
    return vLookInside();
  } else if (hasFlag(G.prso, CONTBIT)) {
    if (hasFlag(G.prso, OPENBIT)) {
      return vLookInside();
    } else {
      tell("It's closed.\n");
      return true;
    }
  } else if (hasFlag(G.prso, LIGHTBIT)) {
    tell("It's o");
    if (hasFlag(G.prso, ONBIT)) {
      tell("n");
    } else {
      tell("ff");
    }
    tell(PERIOD_CR);
    return true;
  } else if (hasFlag(G.prso, READBIT)) {
    perform(V.READ, G.prso);
    return true;
  } else if (hasFlag(G.prso, NARTICLEBIT)) {
    return senseObject("look");
  } else if (prob(25) || prsoIs(PSEUDO_OBJECT)) {
    tell("Totally ordinary looking ", D(G.prso), PERIOD_CR);
    return true;
  } else if (prob(60)) {
    nothingInteresting();
    tell("about", TR(G.prso));
    return true;
  } else {
    pronoun();
    tell(" look");
    if (!hasFlag(G.prso, PLURALBIT) && !prsoIs(ME)) {
      tell("s");
    }
    tell(" like every other ", D(G.prso), " you've ever seen.\n");
    return true;
  }
}

export function nothingInteresting(): any {
  tell(THERES_NOTHING);
  if (prob(25)) {
    tell("unusual");
  } else if (prob(33)) {
    tell("noteworthy");
  } else if (prob(50)) {
    tell("eye-catching");
  } else {
    tell("special");
  }
  tell(" ");
  return true;
}

export function vExit(): any {
  if (G.prso && hasFlag(G.prso, VEHBIT)) {
    perform(V.DISEMBARK, G.prso);
    return true;
  } else if (!isInExitableVehicle()) {
    return doWalk(P.OUT);
  }
  return false;
}

export function isInExitableVehicle(): any {
  let av: any = 0;
  av = loc(PROTAGONIST);
  if (eq(av, RAFT, BARGE, CAGE) || eq(av, TREE_HOLE)) {
    perform(V.DISEMBARK, loc(PROTAGONIST));
    return true;
  } else {
    return false;
  }
}

export function vFeed(): any {
  if (isUltimatelyIn(CHOCOLATE)) {
    perform(V.GIVE, CHOCOLATE, G.prso);
    return true;
  } else {
    tell("You have no food for", TR(G.prso));
    return true;
  }
}

export function vFill(): any {
  if ((hasFlag(G.prso, CONTBIT) || prsoIs(STAIN, CREAM) && hasFlag(STAIN, MUNGBIT)) && (prsiIs(WATER) || isGlobalIn(WATER, G.here))) {
    return wastes();
  } else if (!G.prsi) {
    tell(THERES_NOTHING, "to fill it with.\n");
    return true;
  } else {
    return impossibles();
  }
}

export function vFind(where: any = false): any {
  let l: any = loc(G.prso);
  if (!l) {
    pronoun();
    tell(" could be anywhere!\n");
    return true;
  } else if (isIn(G.prso, PROTAGONIST)) {
    tell("You have it!\n");
    return true;
  } else if (isIn(G.prso, G.here)) {
    tell("Right in front of you.\n");
    return true;
  } else if (isIn(G.prso, GLOBAL_OBJECTS) || isGlobalIn(G.prso, G.here) || prsoIs(PSEUDO_OBJECT)) {
    return vDecode();
  } else if (hasFlag(l, ACTORBIT) && isVisible(l)) {
    tell("Looks as if", T(l), " has it.\n");
    return true;
  } else if (hasFlag(l, CONTBIT) && isVisible(G.prso) && !isIn(l, GLOBAL_OBJECTS)) {
    if (hasFlag(l, SURFACEBIT)) {
      tell("O");
    } else if (hasFlag(l, VEHBIT) && !hasFlag(l, INBIT)) {
      tell("O");
    } else {
      tell("I");
    }
    tell("n", TR(l));
    return true;
  } else if (where) {
    tell("Beats me.\n");
    return true;
  } else {
    return vDecode();
  }
}

export function vFlush(): any {
  tell("It's your brain that needs flushing.\n");
  return true;
}

export function vFollow(): any {
  if (isVisible(G.prso)) {
    tell("But", T(G.prso), " is right here!\n");
    return true;
  } else if (!hasFlag(G.prso, ACTORBIT)) {
    return impossibles();
  } else {
    tell("You have no idea where", T(G.prso), " is.\n");
    return true;
  }
}

G.followFlag = false;

export function iFollow(): any {
  G.followFlag = false;
  return false;
}

export function preFuck(): any {
  if (G.ionDeathCounter > 0) {
    tell("Not tonight; you have a headache.\n");
    return true;
  }
  return false;
}

export function vFuck(): any {
  if (eq(G.naughtyLevel, 0)) {
    tell("Shocking! What if your mother saw you typing inputs like that?\n");
    return true;
  } else if (!hasFlag(G.prso, ACTORBIT)) {
    tell("Not in my game, you pansexual pervert!\n");
    return true;
  } else if (eq(G.naughtyLevel, 1)) {
    tell("Unfortunately,", T(G.prso), " doesn't seem interested, and it takes two to tango.\n");
    return true;
  } else {
    tell("A slap across the face alerts you that", T(G.prso), " isn't that hot to trot. And not a goddam single cold shower in sight!\n");
    return true;
  }
}

export function preGive(): any {
  if (verbIs(V.GIVE) && prsoIs(HANDS)) {
    perform(V.SHAKE_WITH, G.prsi);
    return true;
  } else if (idrop()) {
    return true;
  }
  return false;
}

export function vGetDressed(): any {
  if (prsoIs(ROOMS)) {
    tell("You are!\n");
    return true;
  } else {
    return recognize();
  }
}

export function vGetDrunk(): any {
  if (!prsoIs(ROOMS)) {
    return recognize();
  } else if (eq(G.here, JOES_BAR)) {
    perform(V.BUY, BEER);
    return true;
  } else {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Here?\n");
    return true;
  }
}

export function vGetUndressed(): any {
  if (prsoIs(ROOMS)) {
    perform(V.TAKE_OFF, GARMENT);
    return true;
  } else {
    return recognize();
  }
}

export function vGiddyap(): any {
  if (isIn(STALLION, G.here)) {
    perform(V.KICK, STALLION);
    return true;
  } else {
    tell(HUH);
    return true;
  }
}

export function vGive(): any {
  if (hasFlag(G.prsi, ACTORBIT)) {
    tell("Briskly,", T(G.prsi), " refuses your offer.\n");
    return true;
  } else {
    tell(YOU_CANT, "give", A(G.prso), " to", A(G.prsi), "!\n");
    return true;
  }
}

export function vGiveUp(): any {
  if (prsoIs(ROOMS)) {
    return vQuit();
  } else {
    return recognize();
  }
}

export function vHello(): any {
  if (G.prso) {
    tell("[The proper way to talk to characters in the story is PERSON, HELLO.]\n");
    return true;
  } else {
    perform(V.TELL, ME);
    return true;
  }
}

export function vHelp(): any {
  tell("If you're in a bind, maps and hint booklets are available from your \"dealer,\" or via mail order with the form");
  inPackage();
  crlf();
  return true;
}

export function vHide(): any {
  tell(YOU_CANT, "hide ");
  if (G.prso) {
    tell("t");
  }
  tell("here.\n");
  return true;
}

export function vHiss(): any {
  if (isVisible(FLYTRAP)) {
    if (!hasFlag(FLYTRAP, MUNGBIT)) {
      incrementScore(2, 15);
    }
    dequeue(iFlytrap);
    remove(FLYTRAP);
    tell("The ", PD(FLYTRAP), " assumes the hissing is a spray can of weed killer, dies of fright, and is immediately consumed by parasites who live inside flytraps waiting for just such an occasion.\n");
    return true;
  } else {
    tell("\"Ssss.\"\n");
    return true;
  }
}

export function vIn(): any {
  return doWalk(P.IN);
}

export function vInflate(): any {
  return impossibles();
}

export function vInhale(): any {
  if (!G.prso) {
    tell(OK);
    return true;
  } else if (prsoIs(ROOMS)) {
    tell("You begin to get light-headed.\n");
    return true;
  } else {
    return recognize();
  }
}

export function vKick(): any {
  return hackHack("Kicking");
}

export function vKill(): any {
  tell("Relax.\n");
  return true;
}

export function vKiss(): any {
  tell("\"Smack.\"\n");
  return true;
}

export function vKissOn(): any {
  return vKiss();
}

export function vKneel(): any {
  if (eq(G.pPrsaWord, W.BOW)) {
    return sore("waist");
  } else if (!prePour()) {
    return sore("knee");
  }
  return false;
}

export function vKnock(): any {
  if (hasFlag(G.prso, DOORBIT)) {
    tell("Silence answers back.\n");
    return true;
  } else {
    return hackHack("Knocking on");
  }
}

export function vKweepa(): any {
  if (inCatacombs()) {
    queue(iGator, 12);
  }
  tell("A Martian hawk, hearing the cry of a possible mate, flies up and begins squawking and flapping a mating ritual. As it pauses to catch its breath, it takes a better look at you, rubs its eyes, and flies quickly away.\n");
  return true;
}

export function vLand(): any {
  if (!G.prso && eq(loc(PROTAGONIST), RAFT, BARGE)) {
    performPrsa(loc(PROTAGONIST));
    return true;
  } else {
    tell(HUH);
    return true;
  }
}

export function vLaugh(): any {
  tell("\"Tee hee.\"\n");
  return true;
}

export function vLaunch(): any {
  tell("Your brain is out to launch.\n");
  return true;
}

export function vLeap(): any {
  if (prsoIs(ROOMS) || !G.prso) {
    if (eq(G.here, ROOF)) {
      return jigsUp("You leap, and the gravity of Phobos is so weak that you sail up, up, and away! You achieve escape velocity and sail into the icy depths of space.");
    } else if (eq(G.here, CLOSET)) {
      tell("You still can't reach the shelf.\n");
      return true;
    } else if (eq(G.here, ROCKY_CLIFFTOP, MINARET)) {
      return jigsUp("\"Aaaiieeee!\"");
    } else {
      return wee();
    }
  } else if (G.prso && !isIn(G.prso, G.here)) {
    return impossibles();
  } else {
    return wee();
  }
}

export function vLeapOff(): any {
  if (hasFlag(G.prso, VEHBIT)) {
    perform(V.DISEMBARK, G.prso);
    return true;
  } else {
    perform(V.LEAP, G.prso);
    return true;
  }
}

export function vLeave(): any {
  if (!G.prso) {
    G.prso = ROOMS;
  }
  if (prsoIs(ROOMS)) {
    return doWalk(P.OUT);
  } else if (isIn(PROTAGONIST, G.prso)) {
    perform(V.DISEMBARK, G.prso);
    return true;
  } else {
    perform(V.DROP, G.prso);
    return true;
  }
}

export function vLick(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    perform(V.EAT, G.prso);
    return true;
  } else {
    perform(V.TASTE, G.prso);
    return true;
  }
}

export function vLieDown(): any {
  if (eq(G.here, BEDROOM) && prsoIs(ROOMS)) {
    G.prso = BED;
  }
  if (hasFlag(G.prso, VEHBIT) || hasFlag(G.prso, ACTORBIT)) {
    perform(V.BOARD, G.prso);
    return true;
  } else {
    return wastes();
  }
}

export function vLimber(): any {
  tell("Ahhh. Nothing like a little muscle-loosening.\n");
  return true;
}

export function preListen(): any {
  if (hasFlag(EARS, MUNGBIT) && !G.goneApe) {
    tell("You hear the sound of ");
    if (eq(EARS, G.handCover)) {
      tell("sweating palms");
    } else {
      tell("rustling cotton");
    }
    tell(PERIOD_CR);
    return true;
  }
  return false;
}

export function vListen(): any {
  if (G.prso) {
    return senseObject("sound");
  } else if (eq(G.here, BOUDOIR)) {
    notAloneOnDivan();
    crlf();
    return true;
  } else {
    tell("You hear nothing of interest.\n");
    return true;
  }
}

export function vLock(): any {
  return yuks();
}

export function preLook(): any {
  if (verbIs(V.EXAMINE) && eq(G.pPrsaWord, W.DESCRIBE) && prsoIs(ODOR)) {
    return false;
  } else if (playerCantSee()) {
    return true;
  }
  return false;
}

export function vLook(): any {
  if (eq(G.handCover, EYES)) {
    return uniformlyColored("Palm", "hands over your eyes");
  } else if (hasFlag(EYES, MUNGBIT)) {
    return uniformlyColored("Eyelids", "eyes closed");
  } else {
    if (describeRoom(true)) {
      describeObjects();
    }
    return true;
  }
}

export function uniformlyColored(roomName: any, string: any): any {
  tell(roomName, " Room\n   This location is dim and uniformly colored, resembling what you see when you have your ", string, ". In fact, you have your ", string, PERIOD_CR);
  return true;
}

export function vLookBehind(): any {
  if (hasFlag(G.prso, DOORBIT)) {
    perform(V.LOOK_INSIDE, G.prso);
    return true;
  }
  tell("There is nothing behind", TR(G.prso));
  return true;
}

export function vLookDown(): any {
  if (prsoIs(ROOMS)) {
    perform(V.EXAMINE, GROUND);
    return true;
  } else {
    perform(V.LOOK_INSIDE, G.prso);
    return true;
  }
}

export function vLookInside(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    tell(IT_SEEMS_THAT, T(G.prso), " has");
    if (!describeNothing()) {
      tell(PERIOD_CR);
    }
    return true;
  } else if (isIn(PROTAGONIST, G.prso)) {
    return describeVehicle();
  } else if (hasFlag(G.prso, SURFACEBIT)) {
    tell(YOU_SEE);
    if (!describeNothing()) {
      tell(" on", TR(G.prso));
    }
    return true;
  } else if (hasFlag(G.prso, DOORBIT)) {
    tell("All you can tell is that", T(G.prso), " is ");
    openClosed(G.prso);
    tell(PERIOD_CR);
    return true;
  } else if (hasFlag(G.prso, CONTBIT)) {
    if (isSeeInside(G.prso)) {
      tell(YOU_SEE);
      if (!describeNothing()) {
        tell(" in", TR(G.prso));
      }
      return true;
    } else if (!hasFlag(G.prso, OPENBIT) && first(G.prso)) {
      if (preTouch()) {
        return true;
      }
      perform(V.OPEN, G.prso);
      return true;
    } else {
      return doFirst("open", G.prso);
    }
  } else if (eq(get(P_ITBL, P_PREP1), PR.IN)) {
    return cantVerbAPrso("look inside");
  } else {
    tell("Even Superman would have trouble seeing through", AR(G.prso));
    return true;
  }
}

export function vLookOver(): any {
  return vExamine();
}

export function vLookUnder(): any {
  if (isUltimatelyIn(G.prso)) {
    if (hasFlag(G.prso, WORNBIT)) {
      tell("You're wearing it!\n");
      return true;
    } else {
      tell(HOLDING_IT);
      return true;
    }
  } else {
    nothingInteresting();
    tell("under", TR(G.prso));
    return true;
  }
}

export function vLookUp(): any {
  if (prsoIs(ROOMS)) {
    if (eq(G.here, WELL_BOTTOM)) {
      tell(YOU_SEE, " a dot of light.\n");
      return true;
    } else if (inCatacombs()) {
      tell(ONLY_BLACKNESS);
      return true;
    } else if (hasFlag(G.here, INDOORSBIT)) {
      perform(V.EXAMINE, CEILING);
      return true;
    } else {
      tell("The sky is an inky black.\n");
      return true;
    }
  } else {
    perform(V.LOOK_INSIDE, G.prso);
    return true;
  }
}

export function vLove(): any {
  tell("Not difficult, considering how lovable", T(G.prso), " ");
  if (hasFlag(G.prso, PLURALBIT)) {
    tell("are");
  } else {
    tell("is");
  }
  tell(PERIOD_CR);
  return true;
}

export function vLower(): any {
  return vRaise();
}

export function vMake(): any {
  return cantVerbAPrso("make");
}

export function vMakeLove(): any {
  if (prsoIs(LOVE)) {
    perform(V.FUCK, G.prsi);
    return true;
  } else {
    return recognize();
  }
}

export function vMakeOut(): any {
  let kissee: any = 0;
  if (!prsoIs(ROOMS)) {
    kissee = G.prso;
  } else if (!(kissee = findIn(G.here, ACTORBIT, "with"))) {
    kissee = ME;
  }
  perform(V.KISS, kissee);
  return true;
}

export function vMakeWith(): any {
  return vMake();
}

export function vMarry(): any {
  tell("I doubt that", T(G.prso), " is the marrying type.\n");
  return true;
}

export function vMasturbate(): any {
  if (G.prso && !prsoIs(ROOMS)) {
    return recognize();
  } else if (eq(G.naughtyLevel, 0)) {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Don't you know that this causes blindness?\n");
    return true;
  } else {
    perform(V.FUCK, ME);
    return true;
  }
}

export function vMeasure(): any {
  if (hasFlag(G.prso, PARTBIT) || prsoIs(ME)) {
    tell("Usual size.\n");
    return true;
  } else {
    tell("The same size as any other ", D(G.prso), PERIOD_CR);
    return true;
  }
}

export function vMoan(): any {
  tell("\"Ohhhh...\"\n");
  return true;
}

export function vMove(): any {
  if (isUltimatelyIn(G.prso)) {
    return wastes();
  } else if (locClosed()) {
    return true;
  } else if (hasFlag(G.prso, TAKEBIT)) {
    tell("Moving", T(G.prso), " reveals nothing.\n");
    return true;
  } else if (eq(G.pPrsaWord, W.PULL)) {
    return hackHack("Pulling");
  } else {
    return cantVerbAPrso("move");
  }
}

export function vMung(): any {
  if (prsoIs(ROOMS)) {
    if (isIn(PROTAGONIST, CAGE)) {
      performPrsa(CAGE);
      return true;
    } else {
      tell("Argh! Pimples!\n");
      return true;
    }
  } else {
    return hackHack("Trying to destroy");
  }
}

export function vNo(): any {
  if (eq(G.awaitingReply, 1)) {
    tell("\"Too bad.\" ");
    return riddleDeath();
  } else if (eq(G.awaitingReply, 2)) {
    return vYes();
  } else {
    return youSound("nega");
  }
}

export function noWord(wrd: any): any {
  if (eq(wrd, W.NO, W.NOPE) || eq(wrd, W.NAH, W.UH_UH)) {
    return true;
  } else {
    return false;
  }
}

export function vOff(): any {
  if (hasFlag(G.prso, LIGHTBIT)) {
    if (hasFlag(G.prso, ONBIT)) {
      clearFlag(G.prso, ONBIT);
      tell("Okay,", T(G.prso), " is now off.\n");
      return isNowDark();
    } else {
      tell("It isn't on!\n");
      return true;
    }
  } else {
    return cantTurn("ff");
  }
}

export function vOn(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    tell("Hopefully, your sexy body will do the trick.\n");
    return true;
  } else if (hasFlag(G.prso, LIGHTBIT)) {
    if (hasFlag(G.prso, ONBIT)) {
      tell(ALREADY_IS);
      return true;
    } else {
      setFlag(G.prso, ONBIT);
      tell("Okay,", T(G.prso), " is now on.\n");
      return isNowLit();
    }
  } else {
    return cantTurn("n");
  }
}

export function cantTurn(string: any): any {
  tell(YOU_CANT, "turn that o", string, PERIOD_CR);
  return true;
}

export function vOpen(): any {
  if (hasFlag(G.prso, SURFACEBIT) || hasFlag(G.prso, ACTORBIT) || hasFlag(G.prso, VEHBIT)) {
    return impossibles();
  } else if (hasFlag(G.prso, OPENBIT)) {
    tell(ALREADY_IS);
    return true;
  } else if (hasFlag(G.prso, DOORBIT)) {
    if (hasFlag(G.prso, LOCKEDBIT)) {
      tell("It's locked. Very locked.\n");
      return true;
    } else {
      setFlag(G.prso, OPENBIT);
      setFlag(G.prso, TOUCHBIT);
      tell("The ", D(G.prso), " swings open.\n");
      return true;
    }
  } else if (hasFlag(G.prso, CONTBIT)) {
    setFlag(G.prso, OPENBIT);
    setFlag(G.prso, TOUCHBIT);
    if (!first(G.prso) || hasFlag(G.prso, TRANSBIT)) {
      tell("Opened.\n");
      return true;
    } else {
      tell("Opening", T(G.prso), " reveals");
      if (!describeNothing()) {
        tell(PERIOD_CR);
      }
      return isNowLit();
    }
  } else {
    return cantVerbAPrso("open");
  }
}

export function vPass(): any {
  tell(YOULL_HAVE_TO, "say who you want to pass it to.\n");
  return true;
}

export function vPay(): any {
  if (isUltimatelyIn(ONE_MARSMID_COIN)) {
    perform(V.GIVE, ONE_MARSMID_COIN, G.prso);
    return true;
  } else if (isUltimatelyIn(TEN_MARSMID_COIN)) {
    perform(V.GIVE, TEN_MARSMID_COIN, G.prso);
    return true;
  } else {
    tell("You have no money!\n");
    return true;
  }
}

export function vPee(): any {
  if (isRunning(iUrge)) {
    if (eq(G.here, MENS_ROOM, LADIES_ROOM)) {
      dequeue(iUrge);
      queue(iKidnapping, 5);
      if (isIn(PROTAGONIST, STOOL)) {
        move(PROTAGONIST, G.here);
        tell("[getting off the stool first]\n");
      }
      tell("Ahhh...");
      return noticePizzaOdor();
    } else {
      G.awaitingReply = 3;
      queue(iReply, 2);
      tell("What, on the floor?\n");
      return true;
    }
  } else {
    return vShit(true);
  }
}

export function vPeeIn(): any {
  tell("Miss Manners would be shocked.\n");
  return true;
}

export function vPhone(): any {
  if (eq(G.here, VIZICOMM_BOOTH)) {
    return vCall();
  } else {
    tell(YOU_CANT_SEE_ANY, "phone here!\n");
    return true;
  }
}

export function vPick(): any {
  return cantVerbAPrso("pick");
}

export function vPickUp(): any {
  perform(V.TAKE, G.prso, G.prsi);
  return true;
}

export function vPin(): any {
  if (G.prsi) {
    tell(HUH);
    return true;
  } else if (isVisible(CLOTHES_PIN)) {
    perform(V.PUT_ON, CLOTHES_PIN, G.prso);
    return true;
  } else {
    tell("You have no pin.\n");
    return true;
  }
}

export function vPoint(): any {
  tell("That would be pointless.\n");
  return true;
}

export function prePour(): any {
  if (isInSpace()) {
    tell("There's no gravity!\n");
    return true;
  }
  return false;
}

export function vPour(): any {
  return impossibles();
}

export function vPush(): any {
  return hackHack("Pushing");
}

export function vPushDir(): any {
  if (prsiIs(INTDIR)) {
    return vPush();
  } else {
    return recognize();
  }
}

export function vPushOff(): any {
  if (prsoIs(ROOMS, DOCK_OBJECT, RAFT, BARGE) && !isIn(PROTAGONIST, G.here)) {
    perform(V.LAUNCH, loc(PROTAGONIST));
    return true;
  } else {
    tell(HUH);
    return true;
  }
}

export function prePut(): any {
  if (prsoIs(COCK, TITS, CUNT)) {
    return false;
  } else if (prsiIs(GROUND)) {
    if (nounUsed(W.STAIN, STAIN)) {
      return false;
    } else if (prsoIs(CREAM) && !eq(get(P_NAMW, 0), W.JAR)) {
      return false;
    }
    perform(V.DROP, G.prso);
    return true;
  } else if (prsoIs(HANDS)) {
    if (verbIs(V.PUT_ON, V.PUT) && hasFlag(G.prsi, PARTBIT)) {
      return false;
    } else if (verbIs(V.PUT)) {
      perform(V.REACH_IN, G.prsi);
      return true;
    } else {
      return impossibles();
    }
  } else if (!hasFlag(G.prsi, PARTBIT) && playerCantSee()) {
    return true;
  } else if (isUltimatelyIn(G.prsi, G.prso)) {
    if (prsoIs(BABY) && prsiIs(BLANKET)) {
      tell(ALREADY_IS);
      return true;
    } else {
      tell(YOU_CANT, "put", T(G.prso));
      if (eq(get(P_ITBL, P_PREP2), PR.ON)) {
        tell(" on");
      } else {
        tell(" in");
      }
      tell(T(G.prsi), " when", T(G.prsi), " is already ");
      if (hasFlag(G.prso, SURFACEBIT)) {
        tell("on");
      } else {
        tell("in");
      }
      tell(T(G.prso), "!\n");
      return true;
    }
  } else if (verbIs(V.PUT_ON) && prsoIs(SOD) && prsiIs(HOLE)) {
    return false;
  } else if (isUntouchable(G.prsi)) {
    return cantReach(G.prsi);
  } else if (idrop()) {
    return true;
  }
  return false;
}

export function vPut(): any {
  if (!hasFlag(G.prsi, OPENBIT) && !hasFlag(G.prsi, CONTBIT) && !hasFlag(G.prsi, SURFACEBIT) && !hasFlag(G.prsi, VEHBIT)) {
    tell(YOU_CANT, "put", T(G.prso), " in", A(G.prsi), "!\n");
    return true;
  } else if (prsiIs(G.prso) || isUltimatelyIn(G.prso) && !hasFlag(G.prso, TAKEBIT)) {
    tell("How can you do that?\n");
    return true;
  } else if (hasFlag(G.prsi, DOORBIT)) {
    tell(CANT_FROM_HERE);
    return true;
  } else if (!hasFlag(G.prsi, OPENBIT) && !hasFlag(G.prsi, SURFACEBIT)) {
    thisIsIt(G.prsi);
    return doFirst("open", G.prsi);
  } else if (isIn(G.prso, G.prsi)) {
    tell("But", T(G.prso), " is already in", TR(G.prsi));
    return true;
  } else if (hasFlag(G.prsi, ACTORBIT) || prsiIs(STALLION, BABY)) {
    tell(HUH);
    return true;
  } else if (weight(G.prsi) + weight(G.prso) - getp(G.prsi, P.SIZE) > getp(G.prsi, P.CAPACITY) && !isUltimatelyIn(G.prso, G.prsi)) {
    tell("There's no room ");
    if (hasFlag(G.prsi, SURFACEBIT)) {
      tell("on");
    } else {
      tell("in");
    }
    tell(T(G.prsi), " for", TR(G.prso));
    return true;
  } else if (!isUltimatelyIn(G.prso) && eq(itake(), M_FATAL, false)) {
    return true;
  } else if ((prsoIs(TORCH) || isUltimatelyIn(TORCH, G.prso)) && hasFlag(TORCH, ONBIT) && prsiIs(BASKET, SACK)) {
    return doFirst("extinguish", TORCH);
  } else if (isIn(G.prsi, ODD_MACHINE)) {
    tell(ONLY_ONE_THING_IN_COMPARTMENT);
    return true;
  } else {
    move(G.prso, G.prsi);
    setFlag(G.prso, TOUCHBIT);
    tell("Done.\n");
    return true;
  }
}

export function vPutAgainst(): any {
  return wastes();
}

export function vPutBehind(): any {
  return wastes();
}

export function vPutNear(): any {
  return wastes();
}

export function vPutOn(): any {
  if (prsiIs(ME)) {
    perform(V.WEAR, G.prso);
    return true;
  } else if (hasFlag(G.prsi, SURFACEBIT)) {
    return vPut();
  } else {
    tell("There's no good surface on", TR(G.prsi));
    return true;
  }
}

export function vPutThrough(): any {
  if (hasFlag(G.prsi, DOORBIT)) {
    if (hasFlag(G.prsi, OPENBIT)) {
      return vThrow();
    } else {
      return doFirst("open", G.prsi);
    }
  } else if (prsiIs(loc(PROTAGONIST)) && eq(G.pPrsaWord, W.THROW, W.TOSS, W.HURL)) {
    G.prsi = false;
    return vThrow();
  } else {
    return impossibles();
  }
}

export function vPutTo(): any {
  return recognize();
}

export function vPutUnder(): any {
  return wastes();
}

export function vRaise(): any {
  return hackHack("Playing in this way with");
}

export function preRake(): any {
  if (!isUltimatelyIn(RAKE)) {
    tell(ONLY_WITH_A_RAKE);
    return true;
  }
  return false;
}

export function vRake(): any {
  if (!G.prsi) {
    G.prsi = RAKE;
  }
  if (prsiIs(RAKE)) {
    tell("You'll never make it as a gardener.\n");
    return true;
  } else {
    tell(ONLY_WITH_A_RAKE);
    return true;
  }
}

export function vRape(): any {
  tell("Unacceptably ungallant behavior.\n");
  return true;
}

export function vReachIn(): any {
  let obj: any = 0;
  obj = first(G.prso);
  if (hasFlag(G.prso, ACTORBIT) || hasFlag(G.prso, SURFACEBIT) || !hasFlag(G.prso, CONTBIT)) {
    return yuks();
  } else if (!hasFlag(G.prso, OPENBIT)) {
    return doFirst("open", G.prso);
  } else if (!obj || hasFlag(obj, INVISIBLE) || !hasFlag(obj, TAKEBIT)) {
    tell(THERES_NOTHING, "in", TR(G.prso));
    return true;
  } else {
    tell("You feel something inside", TR(G.prso));
    return true;
  }
}

export function vRead(): any {
  if (hasFlag(G.prso, READBIT)) {
    tell(getp(G.prso, P.TEXT), "\n");
    return true;
  } else {
    return cantVerbAPrso("read");
  }
}

export function vRelieve(): any {
  tell(HUH);
  return true;
}

export function vRemove(): any {
  if (hasFlag(G.prso, WEARBIT)) {
    perform(V.TAKE_OFF, G.prso);
    return true;
  } else if (prsoIs(HANDS) && G.handCover) {
    perform(V.UNCOVER, G.handCover);
    return true;
  } else if (prsoIs(HANDS) && G.raftHeld) {
    perform(V.DROP, RAFT);
    return true;
  } else {
    perform(V.TAKE, G.prso);
    return true;
  }
}

export function vReturn(): any {
  let actor: any = 0;
  if (!G.prsi) {
    if (actor = findIn(G.here, ACTORBIT, "to")) {
      perform(V.GIVE, G.prso, actor);
      return true;
    } else {
      return noOneHere("return it to");
    }
  } else if (hasFlag(G.prsi, ACTORBIT)) {
    perform(V.GIVE, G.prso, G.prsi);
    return true;
  } else {
    perform(V.PUT, G.prso, G.prsi);
    return true;
  }
}

export function vRip(): any {
  if (prsoIs(SCRAP_OF_PAPER, CODED_MESSAGE, MATCHBOOK, MAP)) {
    return wastes();
  } else {
    tell("Unrippable.\n");
    return true;
  }
}

export function vRoll(): any {
  tell("A rolling ", D(G.prso), " gathers no moss.\n");
  return true;
}

export function vRub(): any {
  perform(V.TOUCH, G.prsi, G.prso);
  return true;
}

export function vSaveSomething(): any {
  tell("Sorry, but", T(G.prso), " is beyond help.\n");
  return true;
}

export function vSay(): any {
  let v: any = 0;
  if (G.awaitingReply && yesWord(get(P_LEXV, G.pCont))) {
    vYes();
    return stop();
  } else if (G.awaitingReply && noWord(get(P_LEXV, G.pCont))) {
    vNo();
    return stop();
  } else if (isRunning(iSneeze)) {
    return riddleAnswer();
  } else if (isIn(HAREM_GUARD, G.here)) {
    return pickWife();
  } else if (eq(get(P_LEXV, G.pCont), W.KWEEPA)) {
    vKweepa();
    return stop();
  } else if (eq(get(P_LEXV, G.pCont), W.GIDDAP, W.GIDDYAP) && isIn(STALLION, G.here)) {
    vGiddyap();
    return stop();
  } else if ((isVisible(BEM) || isVisible(FLYTRAP)) && (eq(get(P_LEXV, G.pCont), W.SCAT, W.BOO) || eq(get(P_LEXV, G.pCont), W.SCRAM, W.SHOO))) {
    vScat();
    return stop();
  } else if (v = findIn(G.here, ACTORBIT)) {
    tell("You must address", T(v), " directly.\n");
    return stop();
  } else {
    perform(V.TELL, ME);
    return stop();
  }
}

export function vScat(): any {
  let scatee: any = false;
  if (isVisible(FLYTRAP)) {
    scatee = FLYTRAP;
  } else if (isVisible(BEM)) {
    scatee = BEM;
  }
  if (scatee) {
    tell("A weak attempt to scare away", AR(scatee));
    return true;
  } else {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("\"Scat\" to you too!\n");
    return true;
  }
}

export function vScore(): any {
  let actor: any = 0;
  if (G.prso) {
    perform(V.FUCK, G.prso);
    return true;
  } else if (eq(G.naughtyLevel, 0)) {
    return vStatus();
  } else if (actor = findIn(loc(PROTAGONIST), ACTORBIT, "with")) {
    perform(V.FUCK, actor);
    return true;
  } else {
    return noOneHere("score with");
  }
}

export function vSearch(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    return vShake();
  } else if (isIn(PROTAGONIST, G.prso)) {
    return describeVehicle();
  } else if (hasFlag(G.prso, CONTBIT) && !hasFlag(G.prso, OPENBIT)) {
    return doFirst("open", G.prso);
  } else if (hasFlag(G.prso, CONTBIT)) {
    tell("You find");
    if (!describeNothing()) {
      tell(PERIOD_CR);
    }
    return true;
  } else {
    return cantVerbAPrso("search");
  }
}

export function vSet(): any {
  if (prsoIs(ROOMS)) {
    return wee();
  } else if (prsoIs(INTDIR) && eq(loc(PROTAGONIST), BARGE, RAFT)) {
    performPrsa(loc(PROTAGONIST), INTNUM);
    return true;
  } else if (!G.prsi) {
    if (hasFlag(G.prso, TAKEBIT)) {
      return hackHack("Turning");
    } else {
      tell(YNH, TR(G.prso));
      return true;
    }
  } else {
    return impossibles();
  }
}

export function vSgive(): any {
  perform(V.GIVE, G.prsi, G.prso);
  return true;
}

export function vShake(): any {
  if (hasFlag(G.prso, ACTORBIT)) {
    tell("That wouldn't be polite.\n");
    return true;
  } else {
    return hackHack("Shaking");
  }
}

export function vShakeWith(): any {
  if (!prsoIs(HANDS)) {
    return recognize();
  } else if (!hasFlag(G.prsi, ACTORBIT)) {
    tell("I don't think", T(G.prsi), " even has hands.\n");
    return true;
  } else {
    perform(V.THANK, G.prsi);
    return true;
  }
}

export function vShit(numberOne: any = false): any {
  tell("You don't have to go ");
  if (numberOne) {
    tell("wee-wee");
  } else {
    tell("poo-poo");
  }
  tell(" at the moment.\n");
  return true;
}

export function vShow(): any {
  tell("It doesn't look like", T(G.prsi), " is interested.\n");
  return true;
}

export function vShutUp(): any {
  if (prsoIs(ROOMS)) {
    tell("[I hope you're not addressing me...]\n");
    return true;
  } else {
    perform(V.CLOSE, G.prso);
    return true;
  }
}

export function vSigh(): any {
  tell("\"Ahhhh...\"\n");
  return true;
}

export function vSink(): any {
  return impossibles();
}

export function vSit(): any {
  let vehicle: any = 0;
  if (vehicle = findIn(G.here, VEHBIT)) {
    perform(V.BOARD, vehicle);
    return true;
  } else {
    return wastes();
  }
}

export function vSkip(): any {
  if (inCatacombs() && isIn(PROTAGONIST, G.here)) {
    queue(iCrabs, 10);
    tell("Splash.\n");
    return true;
  } else {
    return wee();
  }
}

export function vSleep(): any {
  tell("You're not tired.\n");
  return true;
}

export function preSmell(): any {
  if (hasFlag(NOSE, MUNGBIT) && !G.goneApe) {
    tell(YOU_CANT, "smell a thing with ", PD(NOSE), " blocked.\n");
    return true;
  }
  return false;
}

export function vSmell(): any {
  if (!G.prso) {
    performPrsa(ODOR);
    return true;
  } else {
    return senseObject("smell");
  }
}

export function senseObject(string: any): any {
  pronoun();
  tell(" ", string);
  if (!hasFlag(G.prso, PLURALBIT) && !prsoIs(ME)) {
    tell("s");
  }
  tell(" just like", AR(G.prso));
  return true;
}

export function vSputOn(): any {
  perform(V.PUT_ON, G.prsi, G.prso);
  return true;
}

export function vSrub(): any {
  perform(V.RUB, G.prsi, G.prso);
  return true;
}

export function vSshow(): any {
  perform(V.SHOW, G.prsi, G.prso);
  return true;
}

export function vStain(): any {
  if (!G.prsi) {
    if (isUltimatelyIn(STAIN) && !hasFlag(STAIN, UNTEEDBIT)) {
      return applyStain(G.prso);
    } else {
      tell("You have no stain.\n");
      return true;
    }
  } else if (eq(G.prsi, STAIN)) {
    return applyStain(G.prso);
  } else {
    return impossibles();
  }
}

export function vStand(): any {
  if (eq(G.pPrsaWord, W.HOLD)) {
    return wastes();
  } else if (eq(G.pPrsaWord, W.GET) && prsoIs(ROOMS) && eq(G.here, INNER_HAREM, BOUDOIR) && eq(G.naughtyLevel, 2) && G.male) {
    tell("You're already quite hard.\n");
    return true;
  } else if (hasFlag(loc(PROTAGONIST), VEHBIT) && !eq(loc(PROTAGONIST), TREE_HOLE, CAGE)) {
    perform(V.DISEMBARK, loc(PROTAGONIST));
    return true;
  } else if (G.prso && hasFlag(G.prso, TAKEBIT)) {
    return wastes();
  } else if (eq(G.here, INNER_HAREM) && !eq(G.naughtyLevel, 0)) {
    tell(D(SULTANS_WIFE), " tugs you back down.\n");
    return true;
  } else {
    tell("You're already standing.\n");
    return true;
  }
}

export function vStandOn(): any {
  if (prsoIs(STOOL)) {
    perform(V.BOARD, STOOL);
    return true;
  } else {
    return wastes();
  }
}

export function vStell(): any {
  perform(V.TELL, G.prsi);
  return true;
}

export function vSthrow(): any {
  perform(V.THROW_TO, G.prsi, G.prso);
  return true;
}

export function vSuck(): any {
  if (hasFlag(G.prso, ACTORBIT) || eq(G.naughtyLevel, 0)) {
    perform(V.EAT, G.prso);
    return true;
  } else {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Done. Some turn-on, huh?\n");
    return true;
  }
}

export function vSuckle(): any {
  return impossibles();
}

export function vSwim(): any {
  if (prsoIs(WATER) || !G.prso && isGlobalIn(WATER, G.here)) {
    tell("This is no time for");
  } else {
    tell("Your head must be");
  }
  tell(" swimming.\n");
  return true;
}

export function vSwing(): any {
  if (G.prsi) {
    perform(V.KILL, G.prsi, G.prso);
    return true;
  } else {
    tell("\"Whoosh.\"\n");
    return true;
  }
}

export function vSwrap(): any {
  perform(V.WRAP, G.prsi, G.prso);
  return true;
}

export function preTake(): any {
  if (prsoIs(HANDS) && G.prsi && prsiIs(G.handCover)) {
    perform(V.UNCOVER, G.handCover);
    return true;
  } else if (prsoIs(CLOTHES_PIN) && prsiIs(NOSE) && hasFlag(CLOTHES_PIN, WORNBIT) || prsoIs(COTTON_BALLS) && prsiIs(EARS) && hasFlag(COTTON_BALLS, WORNBIT) || prsoIs(LIP_BALM) && prsiIs(MOUTH) && hasFlag(LIP_BALM, WORNBIT)) {
    perform(V.REMOVE, G.prso);
    return true;
  } else if (!hasFlag(G.prso, PARTBIT) && playerCantSee()) {
    return true;
  } else if (locClosed()) {
    return true;
  } else if (isIn(PROTAGONIST, G.prso)) {
    tell("You're ");
    if (hasFlag(G.prso, INBIT)) {
      tell("i");
    } else {
      tell("o");
    }
    tell("n it!\n");
    return true;
  } else if (isIn(G.prso, PROTAGONIST) || isUltimatelyIn(G.prso) && !hasFlag(G.prso, TAKEBIT)) {
    if (prsoIs(COMIC_BOOK) && prsiIs(POCKET)) {
      return false;
    } else if (hasFlag(G.prso, WORNBIT)) {
      tell("You're already wearing");
    } else {
      tell("You already have");
    }
    tell(T(G.prso), PERIOD_CR);
    return true;
  } else if (G.handCover && !prsoIs(EYES, EARS, NOSE)) {
    tell(YOU_CANT, "pick up anything while using ", PD(HANDS), "s to cover", TR(G.handCover));
    return true;
  } else if (isIn(G.prso, TREE_HOLE) && isIn(FLYTRAP, TREE_HOLE)) {
    perform(V.REACH_IN, TREE_HOLE);
    return true;
  } else if (!G.prsi) {
    return false;
  } else if (isIn(G.prso, G.prsi)) {
    return false;
  } else if (prsoIs(ME)) {
    perform(V.DROP, G.prsi);
    return true;
  } else if (prsoIs(SHEET) && prsiIs(WINDOW) && G.sheetHanging) {
    perform(V.MOVE, SHEET);
    return true;
  } else if (prsoIs(SHEET) && prsiIs(BED) && !hasFlag(SHEET, TOUCHBIT)) {
    return false;
  } else if (prsoIs(BABY, BLANKET) && prsiIs(BABY, BLANKET) && isIn(BLANKET, BABY)) {
    perform(V.REMOVE, BABY);
    return true;
  } else if (prsoIs(BLANKET) && prsiIs(BABY) && isIn(BLANKET, BABY)) {
    return false;
  } else if (!isIn(G.prso, G.prsi)) {
    return notIn();
  } else {
    G.prsi = false;
    return false;
  }
}

export function vTake(): any {
  if (eq(itake(), true)) {
    if (prsoIs(COTTON_BALLS) && hasFlag(COTTON_BALLS, WORNBIT)) {
      clearFlag(COTTON_BALLS, WORNBIT);
      clearFlag(EARS, MUNGBIT);
    } else if (prsoIs(CLOTHES_PIN) && hasFlag(CLOTHES_PIN, WORNBIT)) {
      clearFlag(CLOTHES_PIN, WORNBIT);
      clearFlag(NOSE, MUNGBIT);
    }
    tell("Taken.\n");
    return true;
  }
  return false;
}

export function vTakeALeak(): any {
  if (prsoIs(ROOMS)) {
    return vPee();
  } else {
    return recognize();
  }
}

export function vTakeAShit(): any {
  if (prsoIs(ROOMS)) {
    return vShit();
  } else {
    return recognize();
  }
}

export function vTakeOff(): any {
  if (prsoIs(ROOMS)) {
    if (eq(G.pPrsaWord, W.GET)) {
      if (hasFlag(loc(PROTAGONIST), VEHBIT)) {
        tell("[of", T(loc(PROTAGONIST)), "]\n");
        perform(V.DISEMBARK, loc(PROTAGONIST));
        return true;
      } else if (eq(G.naughtyLevel, 0)) {
        return vStand();
      } else {
        perform(V.FUCK, ME);
        return true;
      }
    } else {
      performPrsa(GARMENT);
      return true;
    }
  } else if (hasFlag(G.prso, WORNBIT)) {
    clearFlag(G.prso, WORNBIT);
    tell("Okay, you're no longer wearing", TR(G.prso));
    return true;
  } else if (hasFlag(G.prso, VEHBIT)) {
    perform(V.DISEMBARK, G.prso);
    return true;
  } else {
    tell("You aren't wearing", TR(G.prso));
    return true;
  }
}

export function vTakeWith(): any {
  tell("Sorry,", T(G.prsi), " is no help in getting", TR(G.prso));
  return true;
}

export function vTaste(): any {
  return senseObject("taste");
}

export function vTell(): any {
  if (prsoIs(STALLION) && G.pCont) {
    G.clockWait = true;
    G.winner = STALLION;
    return true;
  } else if (hasFlag(G.prso, ACTORBIT) || prsoIs(INTNUM) && isIn(SULTANS_WIFE, G.here)) {
    if (prsoIs(INTNUM) && !eq(G.pNumber, G.choiceNumber)) {
      tell("\"That's not my number!\"\n");
      return stop();
    } else if (G.pCont) {
      if (prsoIs(INTNUM)) {
        G.winner = SULTANS_WIFE;
      } else {
        G.winner = G.prso;
      }
      G.clockWait = true;
      return true;
    } else {
      tell("Hmmm ...", T(G.prso), " looks at you expectantly, as if you seemed to be about to talk.\n");
      return true;
    }
  } else if (prsoIs(FLYTRAP, BEM) && (eq(get(P_LEXV, G.pCont), W.SCAT, W.BOO) || eq(get(P_LEXV, G.pCont), W.SCRAM, W.SHOO))) {
    vScat();
    return stop();
  } else {
    cantVerbAPrso("talk to");
    return stop();
  }
}

export function vTellAbout(): any {
  if (prsoIs(ME)) {
    perform(V.WHAT, G.prsi);
    return true;
  } else {
    perform(V.SHOW, G.prsi, G.prso);
    return true;
  }
}

export function vThank(): any {
  if (!G.prso) {
    tell("[Just doing my job.]\n");
    return true;
  } else if (hasFlag(G.prso, ACTORBIT)) {
    tell("\"You're welcome.\"\n");
    return true;
  } else {
    return impossibles();
  }
}

export function vThrow(): any {
  if (!specialDrop()) {
    if (eq(G.here, CANAL)) {
      perform(V.PUT, G.prso, CANAL_OBJECT);
      return true;
    } else if (G.prsi) {
      move(G.prso, G.here);
      tell("You missed.\n");
      return true;
    } else {
      move(G.prso, G.here);
      tell("Thrown.\n");
      return true;
    }
  }
  return false;
}

export function vThrowTo(): any {
  if (hasFlag(G.prsi, ACTORBIT)) {
    perform(V.GIVE, G.prso, G.prsi);
    return true;
  } else {
    perform(V.THROW, G.prso, G.prsi);
    return true;
  }
}

export function vThrowUp(): any {
  if (prsoIs(ROOMS)) {
    return vVomit();
  } else {
    perform(V.THROW, G.prso);
    return true;
  }
}

export function vTie(): any {
  if ((hasFlag(G.prso, ACTORBIT) || hasFlag(G.prsi, ACTORBIT)) && !eq(G.naughtyLevel, 0)) {
    tell("Kinky!\n");
    return true;
  } else if (eq(G.pPrsaWord, W.TIE)) {
    tell("You've tied", T(G.prso), "! In the third quarter, with forty seconds on the clock, the score is ", D(G.prso), " 17, player 17!!! But seriously, folks, y");
  } else {
    tell("Y");
  }
  tell("ou can't tie", TR(G.prso));
  return true;
}

export function vTieTogether(): any {
  return impossibles();
}

export function preTouch(): any {
  if (isUntouchable(G.prso)) {
    return cantReach(G.prso);
  }
  return false;
}

export function vTouch(): any {
  if (locClosed()) {
    return true;
  } else if (eq(G.naughtyLevel, 0)) {
    return hackHack("Touching");
  } else {
    return hackHack("Fondling");
  }
}

export function vUncover(): any {
  if (prsoIs(G.handCover)) {
    senseAgain(G.handCover);
    G.handCover = false;
    return true;
  } else if (hasFlag(G.prso, ACTORBIT)) {
    perform(V.UNDRESS, G.prso);
    return true;
  } else {
    if (hasFlag(G.prso, PLURALBIT)) {
      tell("They're");
    } else if (hasFlag(G.prso, FEMALEBIT)) {
      tell("She's");
    } else if (hasFlag(G.prso, ACTORBIT)) {
      tell("He's");
    } else {
      tell("It's");
    }
    tell(" not covered!\n");
    return true;
  }
}

export function senseAgain(bodyPart: any): any {
  clearFlag(bodyPart, MUNGBIT);
  tell("You can once again sense with", TR(bodyPart));
  return true;
}

export function vUndress(): any {
  if (G.prso) {
    if (hasFlag(G.prso, ACTORBIT)) {
      perform(V.FUCK, G.prso);
      return true;
    } else {
      return impossibles();
    }
  } else {
    G.prso = ROOMS;
    return vGetUndressed();
  }
}

export function vUnlock(): any {
  if (G.prsi) {
    return impossibles();
  } else if (hasFlag(G.prso, LOCKEDBIT)) {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Your nose is key-shaped, I suppose?\n");
    return true;
  } else if (hasFlag(G.prso, DOORBIT)) {
    tell("But", T(G.prso), " isn't locked.\n");
    return true;
  } else {
    return yuks();
  }
}

export function vUnroll(): any {
  return impossibles();
}

export function vUntie(): any {
  return impossibles();
}

export function vUse(): any {
  tell(YOULL_HAVE_TO, "be more specific about how you want to use", TR(G.prso));
  return true;
}

export function vUseQuotes(): any {
  if (isIn(HAREM_GUARD, G.here)) {
    return pickWife(G.prso);
  } else {
    return seeManual("say something \"out loud.\"");
  }
}

export function vVomit(): any {
  if (isIn(PIZZA, G.here) && hasFlag(PIZZA, TOUCHBIT)) {
    tell("Just keep trying to eat that ", D(PIZZA), PERIOD_CR);
    return true;
  } else {
    tell("You stick a finger down your throat, but to no avail.\n");
    return true;
  }
}

export function vWalk(): any {
  let av: any = 0;
  let vehicle: any = 0;
  let pt: any = 0;
  let pts: any = 0;
  let str: any = 0;
  let obj: any = 0;
  let rm: any = 0;
  av = loc(PROTAGONIST);
  if (!G.pWalkDir) {
    perform(V.WALK_TO, G.prso);
    return true;
  } else if (prsoIs(P.OUT) && isInExitableVehicle()) {
    return true;
  } else if (prsoIs(P.DOWN) && eq(av, STOOL, STALLION)) {
    perform(V.DISEMBARK, av);
    return true;
  } else if (prsoIs(P.IN) && eq(G.here, LABORATORY)) {
    perform(V.BOARD, CAGE);
    return true;
  } else if (prsoIs(P.IN) && !getpt(G.here, P.IN) && (vehicle = findIn(G.here, VEHBIT)) && !isUltimatelyIn(vehicle)) {
    perform(V.BOARD, vehicle);
    return true;
  } else if (G.raftHeld && !isIn(PROTAGONIST, RAFT)) {
    tell("If you want to walk away, you'll either have to take the raft or let go of it!\n");
    return M_FATAL;
  } else if (hasFlag(av, VEHBIT) && !eq(av, STALLION)) {
    if (eq(G.here, CELL) && eq(av, STOOL) && G.holeOpen && eq(G.prso, P.UP)) {
      holeEnterF();
      return true;
    } else {
      return notGoingAnywhere();
    }
  } else if (hasFlag(EYES, MUNGBIT) || eq(G.handCover, EYES)) {
    openYourEyes();
    return M_FATAL;
  } else if (pt = getpt(G.here, G.prso)) {
    if (eq(pts = ptsize(pt), UEXIT)) {
      return goto(getb(pt, REXIT));
    } else if (eq(pts, NEXIT)) {
      tell(get(pt, NEXITSTR), "\n");
      return M_FATAL;
    } else if (eq(pts, FEXIT)) {
      if (rm = apply(get(pt, FEXITFCN))) {
        if (eq(rm, ROOMS)) {
          return true;
        }
        return goto(rm);
      } else {
        return M_FATAL;
      }
    } else if (eq(pts, CEXIT)) {
      if (value(getb(pt, CEXITFLAG))) {
        return goto(getb(pt, REXIT));
      } else if (str = get(pt, CEXITSTR)) {
        tell(str, "\n");
        return M_FATAL;
      } else {
        tell(CANT_GO);
        return M_FATAL;
      }
    } else if (eq(pts, DEXIT)) {
      if (hasFlag(obj = getb(pt, DEXITOBJ), OPENBIT)) {
        return goto(getb(pt, REXIT));
      } else if (str = get(pt, DEXITSTR)) {
        thisIsIt(obj);
        tell(str, "\n");
        return M_FATAL;
      } else {
        thisIsIt(obj);
        doFirst("open", obj);
        return M_FATAL;
      }
    }
    return false;
  } else {
    if (prsoIs(P.OUT, P.IN)) {
      vWalkAround();
    } else if (eq(G.here, WELL_BOTTOM, FORGOTTEN_STOREHOUSE) || eq(G.here, BURIAL_CHAMBER, LADDER_ROOM)) {
      tell("You wade into the dark, but find no passage in that direction.\n");
    } else {
      tell(CANT_GO);
    }
    return M_FATAL;
  }
}

export function notGoingAnywhere(): any {
  let av: any = 0;
  av = loc(PROTAGONIST);
  tell("You're not going anywhere until you get ");
  if (isOffVehicle(av)) {
    tell("off");
  } else {
    tell("out of");
  }
  tell(TR(av));
  return M_FATAL;
}

export function vWalkAround(): any {
  G.awaitingReply = 2;
  queue(iReply, 2);
  tell("Did you have any particular direction in mind?\n");
  return true;
}

export function vWalkTo(): any {
  if (eq(G.prso, INTDIR)) {
    return doWalk(G.pDirection);
  } else {
    return vWalkAround();
  }
}

export function vWait(num: any = 3): any {
  tell("Time passes...\n");
  for (;;) {
    if ((num = num - 1) < 0) {
      break;
    } else if (clocker()) {
      break;
    }
  }
  return G.clockWait = true;
}

export function vWaitFor(): any {
  if (isVisible(G.prso)) {
    return vFollow();
  } else {
    tell("You may be waiting quite a while.\n");
    return true;
  }
}

export function vWear(): any {
  if (!hasFlag(G.prso, WEARBIT)) {
    return cantVerbAPrso("wear");
  } else {
    tell("You're ");
    if (hasFlag(G.prso, WORNBIT)) {
      tell("already");
    } else {
      move(G.prso, PROTAGONIST);
      setFlag(G.prso, WORNBIT);
      tell("now");
    }
    tell(" wearing", TR(G.prso));
    return true;
  }
}

export function vWhat(): any {
  tell("Good question.\n");
  return true;
}

export function vWhere(): any {
  return vFind(true);
}

export function vWhip(): any {
  if (eq(G.naughtyLevel, 0)) {
    return vKill();
  } else {
    tell("Oooo! S & M! Love it!!!\n");
    return true;
  }
}

export function vWrap(): any {
  return wastes();
}

export function vYell(): any {
  sore("throat");
  return stop();
}

export function iReply(): any {
  G.awaitingReply = false;
  return false;
}

G.awaitingReply = false;

export function vYes(): any {
  if (eq(G.awaitingReply, 1)) {
    G.awaitingReply = false;
    G.awaitingFakeOrphan = true;
    G.sultanCounter = 0;
    queue(iSneeze, 2);
    dequeue(iSultan);
    tell("\"Here, then, is the riddle. Don't strain ", PD(HEAD), "; no one's ever gotten it right.\" You hear a growling snarl from somewhere nearby.\n   \"Some say I'm pointless,\n       yet many are obsessed by me.\n    I have caused heroic gambles\n       and sown endless frustration.\n    Uncounted deaths have I caused.\n       What am I?\"\n");
    if (isIn(SIDEKICK, G.here)) {
      tell("   ", D(SIDEKICK), " steps briskly forward. \"That's easy!\" ");
      heShe();
      tell(" yells. \"A grapefruit!\" As the eunuchs snicker behind their weapons, the ", D(SULTAN), " cries \"Wrongo!\" and ");
      tigerEatsSidekick();
      tell("   \"Your turn to guess,\" says the ", D(SULTAN), ", looking gleeful.\n");
    }
    return true;
  } else if (eq(G.awaitingReply, 2)) {
    tell("That was just a rhetorical question.\n");
    return true;
  } else if (eq(G.awaitingReply, 3)) {
    return vPeeIn();
  } else {
    return youSound("posi");
  }
}

export function youSound(string: any): any {
  tell("You sound rather ", string, "tive.\n");
  return true;
}

export function yesWord(wrd: any): any {
  if (eq(wrd, W.YES, W.Y, W.YUP) || eq(wrd, W.OK, W.OKAY, W.SURE)) {
    return true;
  } else {
    return false;
  }
}

export function itake(vb: any = true): any {
  if (!hasFlag(G.prso, TAKEBIT)) {
    if (vb) {
      yuks();
    }
    return M_FATAL;
  } else if (preTouch()) {
    return M_FATAL;
  } else if (ccount(PROTAGONIST) > 10) {
    if (vb) {
      tell("You're already juggling as many items as you could possibly carry.\n");
    }
    return M_FATAL;
  }
  setFlag(G.prso, TOUCHBIT);
  clearFlag(G.prso, NDESCBIT);
  if (isIn(PROTAGONIST, G.prso)) {
    return false;
  } else if (prsoIs(RAFT) && G.raftHeld) {
    G.raftHeld = false;
  }
  move(G.prso, PROTAGONIST);
  return true;
}

export function idrop(): any {
  if (prsoIs(COCK, CUNT, TITS)) {
    return false;
  } else if (prsoIs(HANDS)) {
    if (verbIs(V.DROP, V.THROW, V.GIVE)) {
      return impossibles();
    } else {
      return false;
    }
  } else if (prsoIs(POWER_SWITCH) && verbIs(V.THROW)) {
    return false;
  } else if (prsoIs(HEAD) && verbIs(V.PUT) && prsiIs(HOLE)) {
    tell("Hey wow! Vertigo city!\n");
    return true;
  } else if (prsoIs(ME) && verbIs(V.PUT) && hasFlag(G.prsi, ACTORBIT)) {
    perform(V.BOARD, G.prsi);
    return true;
  } else if (prsiIs(ME) && verbIs(V.PUT) && hasFlag(G.prso, ACTORBIT)) {
    perform(V.BOARD, G.prso);
    return true;
  } else if (verbIs(V.PUT, V.PUT_THROUGH) && prsoIs(SHEET) && prsiIs(WINDOW)) {
    return false;
  } else if (prsoIs(G.handCover)) {
    perform(V.UNCOVER, G.prso);
    return true;
  } else if (prsoIs(NOSE) && prsiIs(CLOTHES_PIN)) {
    return false;
  } else if (prsoIs(COMIC_BOOK)) {
    if (prsiIs(POCKET)) {
      tell(ALREADY_IS);
      return true;
    } else {
      perform(V.REMOVE, COMIC_BOOK);
      return true;
    }
  } else if (!isUltimatelyIn(G.prso) && !prsoIs(LEAVES) && !(prsoIs(RAFT) && G.raftHeld)) {
    if (prsoIs(ME) || hasFlag(G.prso, PARTBIT)) {
      impossibles();
    } else if (prsoIs(SOD) && prsiIs(HOLE)) {
      return false;
    } else {
      tell("That's easy for you to say since you don't even have", TR(G.prso));
    }
    return M_FATAL;
  } else if (!isIn(G.prso, PROTAGONIST) && hasFlag(loc(G.prso), CONTBIT) && !hasFlag(loc(G.prso), OPENBIT)) {
    return doFirst("open", loc(G.prso));
  } else if (hasFlag(G.prso, WORNBIT)) {
    if (verbIs(V.PUT, V.PUT_ON) && (prsoIs(CLOTHES_PIN) && prsiIs(NOSE) || prsoIs(COTTON_BALLS) && prsiIs(EARS) || prsoIs(LIP_BALM) && prsiIs(MOUTH))) {
      tell(SENILITY_STRIKES);
      return true;
    } else {
      return doFirst("remove", G.prso);
    }
  } else {
    return false;
  }
}

export function ccount(obj: any): any {
  let cnt: any = 0;
  let x: any = 0;
  if (x = first(obj)) {
    for (;;) {
      if (!hasFlag(x, WORNBIT)) {
        cnt = cnt + 1;
      }
      if (!(x = next(x))) {
        break;
      }
    }
  }
  return cnt;
}

export function weight(obj: any): any {
  let cont: any = 0;
  let wt: any = 0;
  if (cont = first(obj)) {
    for (;;) {
      wt = wt + weight(cont);
      if (!(cont = next(cont))) {
        break;
      }
    }
  }
  return wt + getp(obj, P.SIZE);
}

export function describeRoom(verbIsLook: any = false): any {
  let firstVisit: any = false;
  let num: any = 0;
  if (!G.lit) {
    tell(TOO_DARK);
    if (eq(G.here, CLOSET) && !hasFlag(NOSE, MUNGBIT)) {
      tell(" There's a distinctive odor here, though.");
    }
    crlf();
    return false;
  }
  if (!hasFlag(G.here, TOUCHBIT)) {
    if (!eq(G.here, CANAL, CATACOMBS, LONG_CORRIDOR)) {
      setFlag(G.here, TOUCHBIT);
    }
    firstVisit = true;
  }
  tell(D(G.here));
  num = canalLoc();
  if (eq(num, 10)) {
    tell(", near the ");
    if (eq(G.nearerDock, MY_KIND_OF_DOCK)) {
      tell("ea");
    } else {
      tell("we");
    }
    tell("st bank");
  }
  if (hasFlag(loc(PROTAGONIST), VEHBIT) && !G.dontPrintVehicle) {
    tell(", ");
    if (hasFlag(loc(PROTAGONIST), INBIT)) {
      tell("i");
    } else {
      tell("o");
    }
    tell("n", T(loc(PROTAGONIST)));
  }
  crlf();
  if (verbIsLook || eq(G.verbosity, 2) || firstVisit && eq(G.verbosity, 1)) {
    tell("   ");
    if (!apply(getp(G.here, P.ACTION), M_LOOK)) {
      tell(getp(G.here, P.LDESC));
    }
    crlf();
  }
  return true;
}

export function describeObjects(): any {
  let o: any = 0;
  let str: any = 0;
  let av: any = loc(G.winner);
  o = first(G.here);
  if (!o) {
    return false;
  }
  for (;;) {
    if (!o) {
      break;
    } else if (isDescribable(o) && !hasFlag(o, TOUCHBIT) && (str = getp(o, P.FDESC))) {
      tell("   ", str);
      if (hasFlag(o, CONTBIT)) {
        describeContents(o, true, D_ALL_Q + D_PARA_Q);
      }
      crlf();
    }
    o = next(o);
  }
  o = first(G.here);
  true;
  for (;;) {
    if (!o) {
      break;
    } else if (!isDescribable(o) || getp(o, P.FDESC) && !hasFlag(o, TOUCHBIT)) {
    } else if ((str = getp(o, P.DESCFCN)) && (str = apply(str, M_OBJDESC))) {
      if (hasFlag(o, CONTBIT) && !eq(str, M_FATAL)) {
        describeContents(o, true, D_ALL_Q + D_PARA_Q);
      }
      crlf();
    } else if (str = getp(o, P.LDESC)) {
      tell("   ", str);
      if (hasFlag(o, CONTBIT)) {
        describeContents(o, true, D_ALL_Q + D_PARA_Q);
      }
      crlf();
    }
    o = next(o);
  }
  describeContents(G.here, false, 0);
  if (av && !eq(G.here, av)) {
    return describeContents(av, false, 0);
  }
  return false;
}

export function describeContents(obj: any, level: any = -1, isAll: any = D_ALL_Q): any {
  let f: any = false;
  let n: any = 0;
  let is1st: any = true;
  let isIt: any = false;
  let isStart: any = false;
  let isTwo: any = false;
  let isPara: any = false;
  let _t1: any;
  if (eq(level, 2)) {
    level = true;
    isPara = true;
    isStart = true;
  } else if (btst(isAll, D_PARA_Q)) {
    isPara = true;
  }
  n = first(obj);
  if (isStart || isIn(obj, ROOMS) || hasFlag(obj, ACTORBIT) || hasFlag(obj, CONTBIT) && (hasFlag(obj, OPENBIT) || hasFlag(obj, TRANSBIT)) && hasFlag(obj, SEARCHBIT) && n) {
    for (;;) {
      if (!n || isDescribable(n) && (btst(isAll, D_ALL_Q) || isSimpleDesc(n))) {
        if (f) {
          if (is1st) {
            is1st = false;
            if (eq(level, false, true)) {
              if (!isStart) {
                if (!isPara) {
                  if (!eq(obj, PROTAGONIST)) {
                    tell("   ");
                  }
                  isPara = true;
                } else if (eq(level, true)) {
                  tell(" ");
                }
                if (eq(obj, G.here)) {
                  tell(YOU_SEE);
                } else if (eq(obj, PROTAGONIST)) {
                  tell("You have");
                } else if (hasFlag(obj, SURFACEBIT)) {
                  tell("Sitting on", T(obj), " is");
                } else {
                  tell(IT_SEEMS_THAT, T(obj));
                  if (hasFlag(obj, ACTORBIT)) {
                    tell(" has");
                  } else {
                    tell(" contains");
                  }
                }
              }
            } else if (!eq(level, -1)) {
              tell(level);
            }
          } else {
            if (n) {
              tell(",");
            } else {
              tell(" and");
            }
          }
          tell(A(f));
          if (hasFlag(f, WORNBIT)) {
            if (eq(f, LIP_BALM)) {
              tell(" (smeared all over your lips)");
            } else if (eq(f, COTTON_BALLS)) {
              tell(" (stuffed in ", PD(EARS), ")");
            } else if (eq(f, CLOTHES_PIN)) {
              tell(" (pinned to ", PD(NOSE), ")");
            } else {
              tell(" (being worn)");
            }
          } else if (hasFlag(f, ONBIT)) {
            tell(" (providing light)");
          } else if (eq(f, COMIC_BOOK)) {
            tell(" (stuck in your back pocket)");
          }
          if (!isIt && !isTwo) {
            isIt = f;
          } else {
            isTwo = true;
            isIt = false;
          }
        }
        f = n;
      }
      if (n) {
        n = next(n);
      }
      if (!f && !n) {
        if (isIt && !isTwo) {
          thisIsIt(isIt);
        }
        if (is1st && isStart) {
          tell(" nothing");
          return false;
        }
        if (!is1st && eq(level, false, true)) {
          if (eq(obj, G.here)) {
            tell(" here");
          }
          tell(".");
        }
        break;
      }
    }
    f = first(obj);
    for (;;) {
      if (!f) {
        break;
      } else if (hasFlag(f, CONTBIT) && isDescribable(f, true) && (btst(isAll, D_ALL_Q) || isSimpleDesc(f))) {
        if (isPara) {
          _t1 = D_ALL_Q + D_PARA_Q;
        } else {
          _t1 = D_ALL_Q;
        }
        if (describeContents(f, true, _t1)) {
          is1st = false;
          isPara = true;
        }
      }
      f = next(f);
    }
    if (!is1st && eq(level, false, true) && eq(obj, G.here, loc(G.winner))) {
      crlf();
    }
    return !is1st;
  }
  return false;
}

export function isDescribable(obj: any, isCont: any = false): any {
  if (hasFlag(obj, INVISIBLE)) {
    return false;
  } else if (eq(obj, G.winner)) {
    return false;
  } else if (eq(obj, loc(G.winner)) && !eq(G.here, loc(G.winner))) {
    return false;
  } else if (!isCont && hasFlag(obj, NDESCBIT)) {
    return false;
  } else if (eq(obj, RAFT, BARGE) && eq(G.here, CANAL) && !isUltimatelyIn(obj) && !isIn(obj, BARGE) && !eq(G.raftLocNum, G.bargeLocNum)) {
    return false;
  } else {
    return true;
  }
}

export function isSimpleDesc(obj: any): any {
  let str: any = 0;
  if (getp(obj, P.FDESC) && !hasFlag(obj, TOUCHBIT)) {
    return false;
  } else if ((str = getp(obj, P.DESCFCN)) && apply(str, M_OBJDESC_Q)) {
    return false;
  } else if (getp(obj, P.LDESC)) {
    return false;
  } else {
    return true;
  }
}

export function describeVehicle(): any {
  if (prsoIs(DIVAN)) {
    notAloneOnDivan();
    crlf();
    return true;
  } else {
    tell("Other than yourself, you can see");
    if (!describeNothing()) {
      if (hasFlag(G.prso, INBIT)) {
        tell(" in");
      } else {
        tell(" on");
      }
      tell(TR(G.prso));
    }
    return true;
  }
}

export function describeNothing(): any {
  if (describeContents(G.prso, 2)) {
    if (!isIn(PROTAGONIST, G.prso)) {
      crlf();
    }
    return true;
  } else {
    return false;
  }
}

export function goto(newLoc: any, dontDescribeSidekick: any = false): any {
  let oldHere: any = 0;
  if (eq(G.here, THRONE_ROOM) && !hasFlag(THETA, MUNGBIT)) {
    setFlag(THETA, MUNGBIT);
    setFlag(THETA, NDESCBIT);
    clearFlag(THETA, ACTORBIT);
    clearFlag(THETA, FEMALEBIT);
    clearFlag(THETA, NARTICLEBIT);
    putp(THETA, P.SDESC, "different-looking angle");
    tell("As you leave, you hear behind you a sound like a", N45_DEGREE_ANGLE, " landing on a pile of", N45_DEGREE_ANGLE, "s.");
    expletive();
    tell("Not again!\" you hear Mitre moan.\n\n");
  }
  oldHere = G.here;
  openEyesAndRemoveHands();
  move(PROTAGONIST, newLoc);
  if (isIn(newLoc, ROOMS)) {
    G.here = newLoc;
  } else {
    G.here = loc(newLoc);
  }
  G.lit = isLit(G.here);
  apply(getp(G.here, P.ACTION), M_ENTER);
  if (describeRoom() && !eq(G.verbosity, 0)) {
    describeObjects();
  }
  if (isIn(SIDEKICK, oldHere) && isIn(PROTAGONIST, G.here) && !dontDescribeSidekick) {
    sidekickFollowsYou();
  }
  G.holeMove = false;
  return true;
}

export function sidekickFollowsYou(): any {
  if (eq(G.here, BOUDOIR)) {
    move(SIDEKICK, G.here);
  } else {
    move(SIDEKICK, loc(PROTAGONIST));
  }
  if (G.holeMove) {
    tell("   A few seconds later, you ");
    if (isLit(G.here)) {
      tell("see ");
    } else {
      tell("feel ");
    }
    tell(D(SIDEKICK), "'s ", () => pickOne(SIDEKICK_PARTS), " appear, followed almost immediately by the rest of ");
    himHer();
    tell(PERIOD_CR);
    return true;
  } else {
    return normalSidekickFollow();
  }
}

export function normalSidekickFollow(): any {
  tell("   ", D(SIDEKICK), () => pickOne(FOLLOWS), "\n");
  return true;
}

export const SIDEKICK_PARTS = ltable("SIDEKICK-PARTS", [0, "earlobe", "nose", "big toe", "elbow", "left buttock"]);

export const FOLLOWS = ltable("FOLLOWS", [
    0,
    " trails along.",
    " follows you.",
    " enters just a few steps behind you.",
    " loyally stays at your side.",
  ]);

export function jigsUp(desc: any): any {
  tell(desc);
  tell("\n\n      ****  You have died  ****\n");
  return finish();
}

export function isAccessible(obj: any): any {
  let l: any = 0;
  if (!obj) {
    return false;
  }
  l = loc(obj);
  if (hasFlag(obj, INVISIBLE)) {
    return false;
  } else if (eq(obj, PSEUDO_OBJECT)) {
    if (eq(G.lastPseudoLoc, G.here)) {
      return true;
    } else {
      return false;
    }
  } else if (!l) {
    return false;
  } else if (eq(l, GLOBAL_OBJECTS)) {
    return true;
  } else if (eq(l, LOCAL_GLOBALS) && isGlobalIn(obj, G.here)) {
    return true;
  } else if (!eq(metaLoc(obj), G.here)) {
    return false;
  } else if (eq(l, G.winner, G.here)) {
    return true;
  } else if (hasFlag(l, OPENBIT) && isAccessible(l)) {
    return true;
  } else {
    return false;
  }
}

export function isVisible(obj: any): any {
  let l: any = 0;
  if (!obj) {
    return false;
  }
  l = loc(obj);
  if (isAccessible(obj)) {
    return true;
  } else if (isSeeInside(l) && isVisible(l)) {
    return true;
  } else {
    return false;
  }
}

export function isUntouchable(obj: any): any {
  if (!obj) {
    return false;
  } else if (isUltimatelyIn(obj, SHELF) || eq(obj, SHELF)) {
    if (isIn(PROTAGONIST, STOOL)) {
      return false;
    } else {
      return true;
    }
  } else if (isUltimatelyIn(obj, TREE_HOLE) && !isIn(PROTAGONIST, TREE_HOLE)) {
    return true;
  } else if (isUltimatelyIn(obj, CAGE) && !isIn(PROTAGONIST, CAGE)) {
    return true;
  } else if (isIn(PROTAGONIST, FIRST_SLAB) && (nounUsed(W.STRAP, PSEUDO_OBJECT) || nounUsed(W.STRAPS, PSEUDO_OBJECT))) {
    return false;
  } else if (isIn(PROTAGONIST, G.here)) {
    return false;
  } else if (isUltimatelyIn(obj, loc(PROTAGONIST)) || eq(obj, loc(PROTAGONIST)) || isIn(obj, GLOBAL_OBJECTS)) {
    return false;
  } else if (eq(obj, RAFT) && G.raftHeld) {
    return false;
  } else if (eq(obj, CANAL_OBJECT, WATER, BARGE) && eq(loc(PROTAGONIST), BARGE, RAFT)) {
    return false;
  } else if (prsoIs(SHEET) && G.sheetTied) {
    return false;
  } else if (prsoIs(SHEET) && isIn(PROTAGONIST, BED) && !hasFlag(SHEET, TOUCHBIT)) {
    return false;
  } else {
    return true;
  }
}

export function metaLoc(obj: any): any {
  for (;;) {
    if (!obj) {
      return false;
    } else if (isIn(obj, GLOBAL_OBJECTS)) {
      return GLOBAL_OBJECTS;
    }
    if (isIn(obj, ROOMS)) {
      return obj;
    } else {
      obj = loc(obj);
    }
  }
}

export function otherSide(dobj: any): any {
  let p: any = 0;
  let tee: any = 0;
  for (;;) {
    if ((p = nextp(G.here, p)) < LOW_DIRECTION) {
      return false;
    } else {
      tee = getpt(G.here, p);
      if (eq(ptsize(tee), DEXIT) && eq(getb(tee, DEXITOBJ), dobj)) {
        return p;
      }
    }
  }
}

export function isUltimatelyIn(obj: any, cont: any = false): any {
  if (!cont) {
    cont = G.winner;
  }
  if (!obj) {
    return false;
  } else if (isIn(obj, cont)) {
    return true;
  } else if (isIn(obj, ROOMS)) {
    return false;
  } else {
    return isUltimatelyIn(loc(obj), cont);
  }
}

export function isSeeInside(obj: any): any {
  return obj && !hasFlag(obj, INVISIBLE) && (hasFlag(obj, TRANSBIT) || hasFlag(obj, OPENBIT));
}

export function isGlobalIn(obj1: any, obj2: any): any {
  let tee: any = 0;
  if (tee = getpt(obj2, P.GLOBAL)) {
    return zmemqb(obj1, tee, ptsize(tee) - 1);
  }
  return false;
}

export function findIn(where: any, flagInQuestion: any, string: any = false): any {
  let obj: any = 0;
  let recursiveObj: any = 0;
  obj = first(where);
  if (!obj) {
    return false;
  }
  for (;;) {
    if (hasFlag(obj, flagInQuestion) && !hasFlag(obj, INVISIBLE)) {
      if (string) {
        tell("[", string, T(obj), "]\n");
      }
      return obj;
    } else if (recursiveObj = findIn(obj, flagInQuestion)) {
      return recursiveObj;
    } else if (!(obj = next(obj))) {
      return false;
    }
  }
}

export function isNowDark(): any {
  if (G.lit && !isLit(G.here)) {
    G.lit = false;
    tell("   It is now too dark to see.\n");
    return true;
  }
  return false;
}

export function isNowLit(): any {
  if (!G.lit && isLit(G.here)) {
    G.lit = true;
    crlf();
    return vLook();
  }
  return false;
}

export function locClosed(): any {
  let l: any = loc(G.prso);
  if (hasFlag(l, CONTBIT) && !hasFlag(l, OPENBIT) && hasFlag(G.prso, TAKEBIT)) {
    return doFirst("open", l);
  } else {
    return false;
  }
}

export function doWalk(dir: any): any {
  G.pWalkDir = dir;
  return perform(V.WALK, dir);
}

export function stop(): any {
  G.pCont = false;
  G.quoteFlag = false;
  return M_FATAL;
}

export function rob(who: any, where: any = false): any {
  let n: any = 0;
  let x: any = 0;
  x = first(who);
  for (;;) {
    if (!x) {
      return true;
    }
    n = next(x);
    move(x, where);
    x = n;
  }
}

export function wrongSexWord(obj: any, maleWord: any, femaleWord: any): any {
  if (!G.sexChosen) {
    return false;
  } else if (G.male && nounUsed(femaleWord, obj) || !G.male && nounUsed(maleWord, obj)) {
    tell("There's no");
    if (eq(obj, SIDEKICK)) {
      tell(" one by that name");
    } else if (prsoIs(obj)) {
      prsoPrint();
    } else {
      prsiPrint();
    }
    tell(" here.");
    if (!eq(G.naughtyLevel, 0)) {
      tell(" [I see you've been playing both as a male and as a female! I guess you're the type who goes both ways, eh? Nudge, nudge, wink, wink!]");
    }
    G.pWon = false;
    crlf();
    return true;
  } else {
    return false;
  }
}

export function hackHack(str: any): any {
  tell(str, T(G.prso));
  return hoHum();
}

export function hoHum(): any {
  tell(() => pickOne(HO_HUM_LIST), "\n");
  return true;
}

export const HO_HUM_LIST = ltable("HO-HUM-LIST", [
    0,
    " doesn't do anything.",
    " accomplishes nothing.",
    " has no desirable effect.",
  ]);

export function yuks(): any {
  tell(() => pickOne(YUK_LIST), "\n");
  return true;
}

export const YUK_LIST = ltable("YUK-LIST", [
    0,
    "What a concept.",
    "Nice try.",
    "You've gotta be kidding.",
    "Think again, humanoid.",
  ]);

export function impossibles(): any {
  tell(() => pickOne(IMPOSSIBLE_LIST), "\n");
  return true;
}

export const IMPOSSIBLE_LIST = ltable("IMPOSSIBLE-LIST", [
    0,
    "Fat chance.",
    "Imposterous!",
    "Dream on.",
    "Prepossible!",
    "It's the looney bin for you!",
    "You have lost your mind.",
  ]);

export function wastes(): any {
  tell(() => pickOne(WASTE_LIST), "\n");
  return true;
}

export const WASTE_LIST = ltable("WASTE-LIST", [
    0,
    "A bigger waste of time than selling green cheese to the man in the moon.",
    "It's not worth it. Believe me.",
    "Useless. Unhelpful. Non-productivish. Ineffectivoid.",
    "There's another turn down the drain.",
    "Why bother?",
  ]);
