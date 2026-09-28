// globals.ts — from GLOBALS.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  defineObject, to,
} from "../engine/define.ts";
import {
  A, AR, D, PD, T, TR, apply, clearFlag, crlf, eq, first, get, getp, hasFlag, isIn, loc, move, next,
  printb, printn, prob, putp, random, read, remove, setFlag, tell,
} from "../engine/runtime.ts";
import {
  bedroomExitF, plummetToPavement,
} from "./cleveland.ts";
import {
  iUrge,
} from "./earth.ts";
import {
  canalLoc, circleIsntBlack, pickWife, torchOff,
} from "./mars.ts";
import {
  dequeue, isRunning, perform, performPrsa, queue, tprint,
} from "./misc.ts";
import {
  P_ADJW, P_INBUF, P_ITBL, P_LEXV, P_NAMW, bufferPrint, cantUse, isName, mobyFind, prsiPrint,
  prsoPrint, thisIsIt,
} from "./parser.ts";
import {
  examinationRoomDesc,
} from "./phobos.ts";
import {
  splatteredDesc,
} from "./spaceship.ts";
import {
  applyStain, iMadScientist,
} from "./venus.ts";
import {
  doWalk, findIn, goto, iReply, impossibles, isAccessible, isGlobalIn, isUltimatelyIn, isVisible,
  jigsUp, notGoingAnywhere, rob, senseAgain, sidekickFollowsYou, stop, vApplaud, vInventory, vLook,
  vPee, vSwim, vWalkAround, wastes, yuks,
} from "./verbs.ts";
import {
  ACTORBIT, ADJ, ALREADY_IS, AT_MAIN_HATCH, BACK_DOOR, BARGE, BED, BEDROOM, BLANKET, BOUGHT_AND_SOLD,
  BURIAL_CHAMBER, CAGE, CANAL, CANAL_OBJECT, CANT_FROM_HERE, CANT_SMELL, CATACOMBS,
  CATACOMBS_WATER_DESC, CEILING, CELL, CHOCOLATE, CLEVELAND, CLOTHES_PIN, COCK, COMIC_BOOK, CONTBIT,
  COTTON_BALLS, CUNT, DEXTERITY, DONT_WANT_TO, DOORBIT, DUNETOP, DUST, EACH_OTHER, EARS, ELLIPSIS,
  END_OF_HALLWAY, EXIT_SHOP, EYES, FEMALEBIT, FIRST_SLAB, FLEXIBLE_HOLE, FORD, FORGOTTEN_STOREHOUSE,
  FRONT_DOOR, FRONT_STOOP, G, GARDEN, GARMENT, GLOBAL_OBJECTS, GLOBAL_ROOM, GLOBAL_SLEEP, GROUND,
  HANDS, HANDS_OVER_EYES, HAND_DWINDLES, HAREM, HAREM_GUARD, HEAD, HEADLIGHT, HER, HIM, HIT_RETURN,
  HOLD, HOLE, HOUSE, HUH, INDOORSBIT, INNER_HAREM, INTDIR, INTNUM, INVISIBLE, IN_SPACE, IT, JOES_BAR,
  KNEECAPS, LABORATORY, LADDER_ROOM, LADIES_ROOM, LGOP, LGOP_CAPS, LIGHTBIT, LIP_BALM, LOCAL_GLOBALS,
  LOCKEDBIT, LONG_CORRIDOR, LOOKS_CAN_BE_DECEIVING, LOOK_AROUND, LOVE, MAD_SCIENTIST,
  MAIN_HALL_OF_PALACE, MAN_WOMAN, ME, MENS_ROOM, MINARET, MITRE, MOUTH, MUFFLED, MUNGBIT,
  MY_KIND_OF_DOCK, M_SMELL, NARTICLEBIT, NDESCBIT, NOSE, NOTHING_HAPPENS, NOTHING_NEW, NOT_HERE_OBJECT,
  OASIS, OBSERVATION_ROOM, ODOR, ONBIT, OOZY_WITH_SLIME, OPENBIT, ORPHANAGE_FOYER, OTHER_CELL, P,
  PAINTING, PARTBIT, PASSENGER_SHIP, PENGUIN_PARK, PERIOD_CR, PLAZA, PLURALBIT, PROPRIETOR,
  PROTAGONIST, PSEUDO_OBJECT, P_NC1, P_NC1L, P_NC2, P_NC2L, RAFT, READBIT, RLANDBIT, ROOF, ROOMS,
  RUINED_CASTLE_2, SACK, SALESMAN, SEARCHBIT, SECOND_SLAB, SENILITY_STRIKES, SHEET, SIDEKICK, SIGN,
  SMELLEDBIT, SOD, SOUTH_POLE, SPACE_YACHT, SPAWNING_GROUND, STABLE, STAIN, STAIRS, STALLION,
  STARING_INTO_VOID, STOOL, SULTAN, SULTANS_WIFE, SURFACEBIT, TEENSY_WEENSY_HOUSE, THERES_NOTHING,
  THETA, THORBAST, THRONE_ROOM, TITS, TOILET, TOO_DARK, TORCH, TOUCHBIT, TRANSBIT, TREE, TRYTAKEBIT,
  UNTEEDBIT, V, VEHBIT, VIZICOMM, VIZICOMM_BOOTH, VOWELBIT, W, WATER, WATTZ_UPP_DOCK, WEARBIT,
  WELL_BOTTOM, WHITE_SUIT, WINDOW, WORNBIT, YECHH, YOULL_HAVE_TO, YOUNG_WOMAN, YOUR_BODY, YOU_CANT,
  YOU_CANT_SEE_ANY, YOU_SEE, prsiIs, prsoIs, verbIs,
} from "./world.ts";

G.lit = true;

G.rank = 0;

G.moves = 0;

G.score = 0;

G.here = false;

G.intMax = 429;

G.extMax = 9309;

export function incrementScore(base: any, var_: any, incRank: any = false): any {
  let change: any = 0;
  let dif: any = 0;
  if (incRank) {
    G.rank = G.rank + 1;
  }
  change = random(var_) + base;
  dif = base + var_ - change;
  G.intMax = G.intMax - dif;
  G.extMax = G.intMax + random(G.extMax - G.intMax);
  return G.score = G.score + change;
}

defineObject(GLOBAL_OBJECTS, 1, {
  synonym: ["ZZMGCK"],
  desc: "it",
  flags: [INVISIBLE, TOUCHBIT, SURFACEBIT, TRYTAKEBIT, OPENBIT, SEARCHBIT, TRANSBIT, WEARBIT, MUNGBIT, ONBIT, LIGHTBIT, RLANDBIT, WORNBIT, VEHBIT, INDOORSBIT, CONTBIT, VOWELBIT, LOCKEDBIT, NDESCBIT, DOORBIT, ACTORBIT, SMELLEDBIT, UNTEEDBIT],
});

defineObject(LOCAL_GLOBALS, 2, {
  in: GLOBAL_OBJECTS,
  desc: "it",
  synonym: ["ZZMGCK"],
});

defineObject(ROOMS, 3, {
  desc: "it",
  exits: {
    IN: to(ROOMS),
  },
});

defineObject(INTDIR, 4, {
  in: GLOBAL_OBJECTS,
  desc: "direction",
  synonym: ["DIRECT"],
  adjective: ["NORTH", "SOUTH", "EAST", "WEST", "NW", "NE", "SW", "SE"],
  props: {
    [P.ACTION]: intdirF,
  },
});

export function intdirF(): any {
  if (verbIs(V.BOARD) && eq(G.pPrsaWord, W.RIDE)) {
    if (isIn(PROTAGONIST, STALLION)) {
      return doWalk(G.pDirection);
    } else if (isIn(STALLION, G.here)) {
      return doFirst("mount");
    } else {
      tell(THERES_NOTHING, "to ride!\n");
      return true;
    }
  }
  return false;
}

defineObject(INTNUM, 5, {
  in: GLOBAL_OBJECTS,
  desc: "number",
  synonym: ["NUMBER"],
  adjective: ["WIFE", "HUSBAND", "#"],
  props: {
    [P.ACTION]: intnumF,
  },
});

export function intnumF(): any {
  if (adjUsed(ADJ.WIFE) && (!eq(G.here, INNER_HAREM) || !G.male) && !pickingWife()) {
    G.pWon = false;
    tell(YOU_CANT_SEE_ANY, "wife here!\n");
    return true;
  } else if (adjUsed(ADJ.HUSBAND) && (!eq(G.here, INNER_HAREM) || G.male) && !pickingWife()) {
    G.pWon = false;
    tell(YOU_CANT_SEE_ANY, "husband here!\n");
    return true;
  } else if (verbIs(V.ANSWER_KLUDGE)) {
    perform(V.USE_QUOTES, INTNUM);
    return true;
  } else if (eq(G.pNumber, G.choiceNumber) && isIn(SULTANS_WIFE, G.here)) {
    if (prsoIs(INTNUM)) {
      performPrsa(SULTANS_WIFE, G.prsi);
      return true;
    } else {
      performPrsa(G.prso, SULTANS_WIFE);
      return true;
    }
  } else if (verbIs(V.ASK_NO_ONE_FOR, V.PICK) && isIn(HAREM_GUARD, G.here) || verbIs(V.ASK_FOR) && prsoIs(HAREM_GUARD)) {
    return pickWife(INTNUM);
  } else if (eq(G.here, VIZICOMM_BOOTH) && verbIs(V.SET)) {
    performPrsa(VIZICOMM);
    return true;
  }
  return false;
}

export function pickingWife(): any {
  if (verbIs(V.ASK_NO_ONE_FOR, V.PICK) && isIn(HAREM_GUARD, G.here)) {
    return true;
  } else if (verbIs(V.ASK_FOR) && prsoIs(HAREM_GUARD)) {
    return true;
  } else {
    return false;
  }
}

defineObject(PSEUDO_OBJECT, 6, {
  in: LOCAL_GLOBALS,
  desc: "pseudo",
  props: {
    [P.ACTION]: meF,
  },
});

defineObject(IT, 7, {
  in: GLOBAL_OBJECTS,
  synonym: ["IT", "THEM"],
  desc: "it",
  flags: [VOWELBIT, NARTICLEBIT, TOUCHBIT],
});

defineObject(HIM, 8, {
  in: GLOBAL_OBJECTS,
  synonym: ["HIM", "HIMSELF"],
  desc: "him",
  flags: [NARTICLEBIT, TOUCHBIT],
});

defineObject(HER, 9, {
  in: GLOBAL_OBJECTS,
  synonym: ["HER", "HERSELF"],
  desc: "her",
  flags: [NARTICLEBIT, TOUCHBIT],
});

defineObject(EACH_OTHER, 10, {
  in: GLOBAL_OBJECTS,
  desc: "it",
  synonym: ["OTHER", "ITSELF"],
  adjective: ["EACH"],
  props: {
    [P.ACTION]: eachOtherF,
  },
});

export function eachOtherF(): any {
  if (prsiIs(EACH_OTHER)) {
    performPrsa(G.prso, G.prso);
    return true;
  } else if (!nounUsed(W.ITSELF, EACH_OTHER)) {
    G.pWon = false;
    if (adjUsed(ADJ.EACH)) {
      cantUse(ADJ.EACH, true);
    } else {
      cantUse(W.OTHER, true);
    }
    return true;
  }
  return false;
}

defineObject(MAN_WOMAN, 11, {
  in: GLOBAL_OBJECTS,
  synonym: ["MAN", "WOMAN"],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "man",
    [P.ACTION]: manWomanF,
  },
});

export function manWomanF(): any {
  let person: any = 0;
  if (verbIs(V.FOLLOW)) {
    if (eq(G.followFlag, 4)) {
      tell(DONT_WANT_TO);
      return true;
    } else if (eq(G.followFlag, 5)) {
      return doWalk(P.NORTH);
    } else if (eq(G.followFlag, 6)) {
      return doWalk(P.EAST);
    } else {
      return vWalkAround();
    }
  } else if (eq(get(P_NAMW, 0), W.MAN) && prsoIs(MAN_WOMAN)) {
    if (person = findMan()) {
      performPrsa(person, G.prsi);
      return true;
    } else {
      return cantSee(MAN_WOMAN);
    }
  } else if (eq(get(P_NAMW, 0), W.WOMAN) && prsoIs(MAN_WOMAN)) {
    if (person = findWoman()) {
      performPrsa(person, G.prsi);
      return true;
    } else {
      return cantSee(MAN_WOMAN);
    }
  } else if (eq(get(P_NAMW, 1), W.MAN) && prsiIs(MAN_WOMAN)) {
    if (person = findMan()) {
      performPrsa(G.prso, person);
      return true;
    } else {
      return cantSee(MAN_WOMAN);
    }
  } else if (eq(get(P_NAMW, 1), W.WOMAN) && prsiIs(MAN_WOMAN)) {
    if (person = findWoman()) {
      performPrsa(G.prso, person);
      return true;
    } else {
      return cantSee(MAN_WOMAN);
    }
  }
  return false;
}

export function findMan(): any {
  putp(MAN_WOMAN, P.SDESC, "man");
  if (isIn(SALESMAN, G.here)) {
    return SALESMAN;
  } else if (isIn(MAD_SCIENTIST, G.here)) {
    return MAD_SCIENTIST;
  } else if (isIn(MITRE, G.here)) {
    return MITRE;
  } else if (isIn(PROPRIETOR, G.here)) {
    return PROPRIETOR;
  } else if (isIn(THORBAST, G.here) && G.male) {
    return THORBAST;
  } else if (isIn(YOUNG_WOMAN, G.here) && !G.male) {
    return YOUNG_WOMAN;
  } else if (isIn(SULTAN, G.here) && G.male) {
    return SULTAN;
  } else if (isIn(SULTANS_WIFE, G.here) && !G.male) {
    return SULTANS_WIFE;
  } else if (isVisible(SIDEKICK) && G.male) {
    return SIDEKICK;
  } else {
    return false;
  }
}

export function findWoman(): any {
  putp(MAN_WOMAN, P.SDESC, "woman");
  if (isIn(THORBAST, G.here) && !G.male) {
    return THORBAST;
  } else if (isIn(YOUNG_WOMAN, G.here) && G.male) {
    return YOUNG_WOMAN;
  } else if (isIn(THETA, G.here) && !hasFlag(THETA, MUNGBIT)) {
    return THETA;
  } else if (isIn(LGOP, G.here)) {
    return LGOP;
  } else if (isIn(SULTAN, G.here) && !G.male) {
    return SULTAN;
  } else if (isIn(SULTANS_WIFE, G.here) && G.male) {
    return SULTANS_WIFE;
  } else if (isVisible(SIDEKICK) && !G.male) {
    return SIDEKICK;
  } else {
    return false;
  }
}

defineObject(NOT_HERE_OBJECT, 12, {
  desc: "it",
  flags: [NARTICLEBIT],
  props: {
    [P.ACTION]: notHereObjectF,
  },
});

export function notHereObjectF(): any {
  let tbl: any = 0;
  let isPrso: any = true;
  let obj: any = 0;
  let x: any = false;
  if (prsoIs(NOT_HERE_OBJECT) && prsiIs(NOT_HERE_OBJECT)) {
    tell("Those things aren't here!\n");
    return true;
  } else if (eq(G.pXnam, W.BODY) && eq(G.pXadjn, W.MY, false)) {
    if (prsoIs(NOT_HERE_OBJECT)) {
      G.prso = ME;
    } else {
      G.prsi = ME;
    }
    return false;
  } else if (eq(G.pXnam, W.HAND, W.HANDS) && eq(G.pXadjn, W.MITRE, W["KING'S"]) && verbIs(V.SHAKE, V.TAKE)) {
    perform(V.SHAKE_WITH, HANDS, MITRE);
    return true;
  } else if ((eq(G.pXnam, W.HANDS, W.HAND, W.PALM) || eq(G.pXnam, W.FINGER, W.EYE, W.EYES) || eq(G.pXnam, W.HEAD, W.EARS, W.EAR) || eq(G.pXnam, W.LIP, W.LIPS, W.MOUTH) || eq(G.pXnam, W.KNEECAP, W.KNEE, W.KNEES) || eq(G.pXnam, W.NOSE, W.NOSTRIL, W.BALLS) || eq(G.pXnam, W.PENIS, W.COCK, W.ASS) || eq(G.pXnam, W.TITS, W.BREAST, W.BOSOM) || eq(G.pXnam, W.CUNT, W.VAGINA, W.PUSSY) || eq(G.pXnam, W.TIT, W.BODY)) && (eq(G.pXadjn, W.TRENT, W.TIFFAN, W["TIFF'S"]) || eq(G.pXadjn, W.GODDESSES, W.SHAPE, W.COUCHMATE) || eq(G.pXadjn, W.THORBAST, W.ASSASSIN, W.SALESMAN) || eq(G.pXadjn, W.SCIENTIST, W.GORILLA, W.MONKEY) || eq(G.pXadjn, W["KING'S"], W.MITRE, W.SULTAN) || eq(G.pXadjn, W.PROPRIETOR, W.OWNER, W.GUARD) || eq(G.pXadjn, W.PRINCE, W.DAUGHTER, W.THETA) || eq(G.pXadjn, W.BARTENDER, W["WIFE'S"], W.HUSBAND) || eq(G.pXadjn, W.ELYSIA, W.ELYSIUM, W.WOMAN) || eq(G.pXadjn, W.ROBOT, W["BABY'S"]) || eq(G.pXadjn, W["MAN'S"], W.HIS, W.HER))) {
    tell("[Sorry. Given limited space, we can't handle everything. Therefore, you can only refer to characters in the story, not individual body parts. For example, you can KISS IRWIN but you can't KISS IRWIN'S ELBOW.]\n");
    return true;
  } else if (prsoIs(NOT_HERE_OBJECT)) {
    tbl = G.pPrso;
  } else {
    tbl = G.pPrsi;
    isPrso = false;
  }
  if (isPrso && isPrsoMobyVerb()) {
    x = true;
  } else if (!isPrso && isPrsiMobyVerb()) {
    x = true;
  }
  if (x) {
    if (obj = findNotHere(tbl, isPrso)) {
      if (!eq(obj, NOT_HERE_OBJECT)) {
        return true;
      }
    } else {
      return false;
    }
    if (verbIs(V.WALK_TO, V.FOLLOW)) {
      vWalkAround();
    } else {
      tell("[", YOULL_HAVE_TO, "be more specific.]\n");
    }
  } else {
    if (eq(G.winner, PROTAGONIST)) {
      tell("You");
    } else {
      tell("Looking confused,", T(G.winner), " says, \"I");
    }
    tell(" can't ");
    if (eq(G.pXnam, W.ODOR, W.SMELL, W.SCENT)) {
      tell("smell");
    } else {
      tell("see");
    }
    if (!isName(G.pXnam) || eq(G.pXnam, W.FORD)) {
      tell(" any");
    }
    notHerePrint(isPrso);
    tell(" here!");
    if (!eq(G.winner, PROTAGONIST)) {
      tell("\"");
    }
    crlf();
  }
  return stop();
}

export function isPrsoMobyVerb(): any {
  if (eq(G.prsa, V.WHAT, V.WHERE) || eq(G.prsa, V.WAIT_FOR, V.WALK_TO, V.MAKE) || eq(G.prsa, V.BUY, V.CALL, V.SAY) || eq(G.prsa, V.FIND, V.FOLLOW, V.PHONE) || eq(G.prsa, V.USE_QUOTES, V.ANSWER_KLUDGE)) {
    return true;
  } else {
    return false;
  }
}

export function isPrsiMobyVerb(): any {
  if (eq(G.prsa, V.ASK_ABOUT, V.ASK_FOR, V.TELL_ABOUT)) {
    return true;
  } else {
    return false;
  }
}

export function findNotHere(tbl: any, isPrso: any): any {
  let mF: any = 0;
  let obj: any = 0;
  mF = mobyFind(tbl);
  if (eq(1, mF)) {
    if (isPrso) {
      G.prso = G.pMobyFound;
      thisIsIt(G.prso);
    } else {
      G.prsi = G.pMobyFound;
    }
    return false;
  } else if (1 < mF && (obj = apply(getp(obj = get(tbl, 1), P.GENERIC)))) {
    if (eq(obj, NOT_HERE_OBJECT)) {
      return true;
    } else if (isPrso) {
      G.prso = obj;
      thisIsIt(G.prso);
    } else {
      G.prsi = obj;
    }
    return false;
  } else {
    return NOT_HERE_OBJECT;
  }
}

export function notHerePrint(isPrso: any): any {
  if (G.pOflag) {
    if (G.pXadj) {
      tell(" ");
      printb(G.pXadjn);
    }
    if (G.pXnam) {
      tell(" ");
      printb(G.pXnam);
      return true;
    }
    return false;
  } else if (isPrso) {
    return bufferPrint(get(P_ITBL, P_NC1), get(P_ITBL, P_NC1L), false);
  } else {
    return bufferPrint(get(P_ITBL, P_NC2), get(P_ITBL, P_NC2L), false);
  }
}

defineObject(LOVE, 13, {
  in: GLOBAL_OBJECTS,
  desc: "love",
  synonym: ["LOVE"],
  flags: [NARTICLEBIT],
  props: {
    [P.ACTION]: loveF,
  },
});

export function loveF(): any {
  let lover: any = 0;
  if (verbIs(V.MAKE)) {
    if (lover = findIn(G.here, ACTORBIT, "to")) {
      perform(V.FUCK, lover);
      return true;
    } else {
      tell("Alone? How odd.\n");
      return true;
    }
  }
  return false;
}

defineObject(GLOBAL_SLEEP, 14, {
  in: GLOBAL_OBJECTS,
  desc: "sleep",
  synonym: ["SLEEP", "NAP", "SNOOZE"],
  flags: [NARTICLEBIT],
  props: {
    [P.ACTION]: globalSleepF,
  },
});

export function globalSleepF(): any {
  if (verbIs(V.WALK_TO, V.TAKE)) {
    perform(V.SLEEP);
    return true;
  } else if (verbIs(V.PUT_TO) && prsiIs(GLOBAL_SLEEP)) {
    tell("You're not a hypnotist.\n");
    return true;
  }
  return false;
}

defineObject(GROUND, 15, {
  in: GLOBAL_OBJECTS,
  synonym: ["FLOOR", "GROUND"],
  props: {
    [P.SDESC]: "ground",
    [P.ACTION]: groundF,
  },
});

export function groundF(): any {
  if (eq(G.here, IN_SPACE)) {
    cantSee(GROUND);
    return true;
  } else if (hasFlag(G.here, INDOORSBIT) || eq(loc(PROTAGONIST), BARGE)) {
    putp(GROUND, P.SDESC, "floor");
  } else {
    putp(GROUND, P.SDESC, "ground");
  }
  if (verbIs(V.EXAMINE)) {
    if (eq(G.here, SPAWNING_GROUND)) {
      tell(OOZY_WITH_SLIME, "\n");
      return true;
    } else if (isGlobalIn(HOLE, G.here) && !holeInvisible()) {
      tell("You notice", AR(HOLE));
      return true;
    } else if (eq(G.here, CELL)) {
      tell("Soft. Cushiony.\n");
      return true;
    } else if (eq(G.here, OTHER_CELL)) {
      tell("Rock-hard.\n");
      return true;
    } else if (eq(G.here, HOLD) && eq(G.sidekickExploded, 1)) {
      splatteredDesc();
      crlf();
      return true;
    } else if (inCatacombs()) {
      tell(CATACOMBS_WATER_DESC, "\n");
      return true;
    }
    return false;
  } else if (verbIs(V.TOUCH) && eq(G.here, CELL, OTHER_CELL)) {
    perform(V.EXAMINE, GROUND);
    return true;
  } else if (verbIs(V.CLIMB_UP, V.CLIMB_ON, V.CLIMB, V.BOARD)) {
    return wastes();
  } else if (verbIs(V.LOOK_UNDER)) {
    return impossibles();
  } else if (verbIs(V.LEAVE)) {
    return doWalk(P.UP);
  } else if (verbIs(V.LEAP, V.STAND_ON) && eq(G.here, ROOF)) {
    perform(V.LEAP, ROOMS);
    return true;
  }
  return false;
}

defineObject(CEILING, 16, {
  in: GLOBAL_OBJECTS,
  flags: [NDESCBIT, TOUCHBIT],
  desc: "ceiling",
  synonym: ["CEILIN", "ROOF"],
  adjective: ["TOWERING"],
  props: {
    [P.ACTION]: ceilingF,
  },
});

export function ceilingF(): any {
  if (verbIs(V.EXAMINE)) {
    if (eq(G.here, HOLD) && eq(G.sidekickExploded, 1)) {
      splatteredDesc();
      crlf();
      return true;
    } else if (eq(G.here, CELL) && G.holeOpen) {
      tell("There's a hole in the ceiling.\n");
      return true;
    } else if (eq(G.here, BEDROOM) && hasFlag(BEDROOM, MUNGBIT)) {
      tell("Most of the ceiling is now gone.\n");
      return true;
    }
    return false;
  } else if (!hasFlag(G.here, INDOORSBIT)) {
    return cantSee(CEILING);
  } else if (verbIs(V.ENTER) && eq(G.here, CELL) && G.holeOpen) {
    return doWalk(P.UP);
  } else if (verbIs(V.LOOK_UNDER)) {
    perform(V.LOOK);
    return true;
  }
  return false;
}

defineObject(ODOR, 17, {
  in: LOCAL_GLOBALS,
  desc: "odor",
  synonym: ["SMELL", "ODOR", "SCENT", "AROMA"],
  adjective: ["STRONG", "FAMILIAR", "FOUL", "HEADY", "PLEASANT"],
  flags: [VOWELBIT],
  props: {
    [P.ACTION]: odorF,
  },
});

export function odorF(): any {
  if (eq(G.here, IN_SPACE) && !isIn(THORBAST, G.here)) {
    tell(CANT_SMELL);
    return true;
  } else if (eq(G.here, MENS_ROOM, LADIES_ROOM) && isRunning(iUrge)) {
    tell(CANT_SMELL);
    return true;
  } else if (eq(G.here, PLAZA) && G.plazaCounter < 9) {
    tell(CANT_SMELL);
    return true;
  } else if (verbIs(V.SMELL) || verbIs(V.EXAMINE) && eq(G.pPrsaWord, W.DESCRIBE)) {
    if (getp(G.here, P.ODOR)) {
      if (hasFlag(G.here, SMELLEDBIT)) {
        tell("There is a strong odor of ", getp(G.here, P.ODOR), " in the air.\n");
        return true;
      } else {
        setFlag(G.here, SMELLEDBIT);
        scratchNSniff();
        apply(getp(G.here, P.ACTION), M_SMELL);
        crlf();
        return true;
      }
    } else if (eq(G.here, INNER_HAREM)) {
      G.here = HAREM;
      perform(V.SMELL, ODOR);
      G.here = INNER_HAREM;
      return true;
    } else if (eq(G.here, GARDEN)) {
      return noScratchNSniff("fresh honeysuckle");
    } else if (isAccessible(CHOCOLATE) && !hasFlag(CHOCOLATE, UNTEEDBIT)) {
      tell("[the ", D(CHOCOLATE), "]\n");
      perform(V.SMELL, CHOCOLATE);
      return true;
    } else {
      tell(CANT_SMELL);
      return true;
    }
  }
  return false;
}

export function scratchNSniff(num: any = false): any {
  tell("[Scratch 'n' sniff spot number ");
  if (num) {
    printn(num);
  } else {
    printn(getp(G.here, P.ODOR_NUMBER));
  }
  tell(HIT_RETURN, "continue.]");
  read(P_INBUF, P_LEXV);
  crlf();
  return true;
}

export function noScratchNSniff(string: any): any {
  tell("[Too bad there's no scratch 'n' sniff for this one, huh?]\n\nAhhh, the odor of ", string, "!\n");
  return true;
}

defineObject(WATER, 18, {
  in: LOCAL_GLOBALS,
  desc: "water",
  synonym: ["WATER", "FOUNTAIN", "POOL", "OASIS"],
  adjective: ["FRESH", "CANAL", "DARK", "BRACKISH", "STAGNANT", "WARM", "LARGE", "REFLECTING"],
  flags: [NARTICLEBIT],
  props: {
    [P.ACTION]: waterF,
  },
});

export function waterF(): any {
  if (eq(G.here, MINARET, DUNETOP) && isTouching(WATER)) {
    return cantReach(WATER);
  } else if (verbIs(V.DRINK, V.BUY)) {
    tell("You're not thirsty.\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE, V.LOOK_UNDER, V.EXAMINE)) {
    tell("The water is dark and murky.\n");
    return true;
  } else if (verbIs(V.PASS, V.MAKE)) {
    return vPee();
  } else if (verbIs(V.REACH_IN)) {
    tell("Your hand is now wet.\n");
    return true;
  } else if (verbIs(V.PUT_ON) && prsiIs(WATER)) {
    perform(V.PUT, G.prso, WATER);
    return true;
  } else if (isGlobalIn(CANAL_OBJECT, G.here)) {
    if (prsoIs(WATER)) {
      performPrsa(CANAL_OBJECT, G.prsi);
      return true;
    } else {
      performPrsa(G.prso, CANAL_OBJECT);
      return true;
    }
  } else if (verbIs(V.PUT) && prsiIs(WATER)) {
    if (prsoIs(RAFT) && eq(G.here, OASIS)) {
      tell("Next you'll be putting yachts in bathtubs!\n");
      return true;
    } else if (prsoIs(RAFT) && inCatacombs()) {
      perform(V.DROP, RAFT);
      return true;
    } else {
      return wastes();
    }
  } else if (verbIs(V.ON, V.WALK) && eq(G.here, MENS_ROOM, LADIES_ROOM)) {
    perform(V.FLUSH, TOILET);
    return true;
  } else if (verbIs(V.BOARD, V.ENTER, V.CRAWL_UNDER)) {
    return vSwim();
  }
  return false;
}

defineObject(HANDS, 19, {
  in: GLOBAL_OBJECTS,
  synonym: ["HANDS", "HAND", "PALM", "FINGER"],
  adjective: ["BARE", "MY", "YOUR"],
  desc: "your hand",
  flags: [NDESCBIT, TOUCHBIT, NARTICLEBIT, PARTBIT],
  props: {
    [P.ACTION]: handsF,
  },
});

export function handsF(): any {
  let actor: any = 0;
  if (verbIs(V.APPLAUD)) {
    G.prso = false;
    return vApplaud();
  } else if (verbIs(V.SHAKE)) {
    if (eq(G.here, THRONE_ROOM)) {
      perform(V.SHAKE_WITH, HANDS, MITRE);
      return true;
    } else if (actor = findIn(G.here, ACTORBIT, "with")) {
      perform(V.SHAKE_WITH, HANDS, actor);
      return true;
    } else {
      tell("Pleased to meet you.\n");
      return true;
    }
  } else if (verbIs(V.COUNT)) {
    if (nounUsed(W.FINGER, HANDS)) {
      tell("Ten");
    } else {
      tell("Two");
    }
    tell(", as usual.\n");
    return true;
  } else if (verbIs(V.CLEAN)) {
    tell("Done.\n");
    return true;
  } else if (verbIs(V.TAKE_WITH) && prsiIs(HANDS)) {
    perform(V.TAKE, G.prso);
    return true;
  } else if (verbIs(V.PUT_ON) && prsiIs(EYES)) {
    perform(V.SPUT_ON, EYES, HANDS);
    return true;
  } else if (verbIs(V.PUT_ON, V.PUT) && prsiIs(EARS)) {
    perform(V.SPUT_ON, EARS, HANDS);
    return true;
  } else if (verbIs(V.SPUT_ON) && prsoIs(EYES, EARS, NOSE)) {
    if (G.goneApe) {
      tell(DEXTERITY);
      return true;
    } else if (itemsCarried() > 0) {
      tell(YOU_CANT, "do that with ", PD(HANDS), "s full!\n");
      return true;
    } else {
      if (G.handCover) {
        tell("You're already");
      } else {
        G.handCover = G.prso;
        setFlag(G.prso, MUNGBIT);
        if (eq(G.handCover, EARS)) {
          tell(MUFFLED, "'re");
        } else {
          tell("Okay, you're now");
        }
      }
      tell(" covering ", D(G.handCover), " with ", PD(HANDS), "s.\n");
      return true;
    }
  }
  return false;
}

export function itemsCarried(): any {
  let x: any = 0;
  let cnt: any = 0;
  x = first(PROTAGONIST);
  for (;;) {
    if (!x) {
      break;
    } else if (!hasFlag(x, WORNBIT) && !eq(x, COMIC_BOOK)) {
      cnt = cnt + 1;
    }
    x = next(x);
  }
  return cnt;
}

G.handCover = false;

defineObject(HEAD, 20, {
  in: GLOBAL_OBJECTS,
  desc: "your head",
  synonym: ["HEAD"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PARTBIT],
  props: {
    [P.ACTION]: headF,
  },
});

export function headF(): any {
  if (verbIs(V.PUT_ON) && prsoIs(BLANKET, SHEET, SACK)) {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Where do you think you are, Traal?\n");
    return true;
  }
  return false;
}

defineObject(EYES, 21, {
  in: GLOBAL_OBJECTS,
  desc: "your eyes",
  synonym: ["EYE", "EYES"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PLURALBIT, PARTBIT],
  props: {
    [P.ACTION]: eyesF,
  },
});

export function eyesF(): any {
  if (verbIs(V.CLOSE)) {
    if (G.goneApe) {
      return wastes();
    } else if (hasFlag(EYES, MUNGBIT)) {
      if (eq(EYES, G.handCover)) {
        tell(HANDS_OVER_EYES);
        return true;
      } else {
        tell(SENILITY_STRIKES);
        return true;
      }
    } else {
      setFlag(EYES, MUNGBIT);
      return eyesAreNow("closed");
    }
  } else if (verbIs(V.OPEN)) {
    if (hasFlag(EYES, MUNGBIT)) {
      if (eq(EYES, G.handCover)) {
        tell(HANDS_OVER_EYES);
        return true;
      } else {
        return senseAgain(EYES);
      }
    } else {
      tell("They are open!\n");
      return true;
    }
  }
  return false;
}

export function eyesAreNow(string: any): any {
  tell("Your eyes are now ", string, PERIOD_CR);
  return true;
}

export function openEyesAndRemoveHands(): any {
  clearFlag(EYES, MUNGBIT);
  if (G.handCover) {
    clearFlag(G.handCover, MUNGBIT);
    return G.handCover = false;
  }
  return false;
}

defineObject(EARS, 22, {
  in: GLOBAL_OBJECTS,
  desc: "your ears",
  synonym: ["EAR", "EARS"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PLURALBIT, PARTBIT],
  props: {
    [P.ACTION]: earsF,
  },
});

export function earsF(): any {
  if (verbIs(V.TAKE) && eq(G.pPrsaWord, W.HOLD)) {
    perform(V.SPUT_ON, EARS, HANDS);
    return true;
  } else if (verbIs(V.UNCOVER) && hasFlag(COTTON_BALLS, WORNBIT) && !G.goneApe) {
    if (eq(EARS, G.handCover)) {
      G.handCover = false;
    }
    perform(V.REMOVE, COTTON_BALLS);
    return true;
  }
  return false;
}

defineObject(NOSE, 23, {
  in: GLOBAL_OBJECTS,
  desc: "your nose",
  synonym: ["NOSE", "NOSTRIL"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PARTBIT],
  props: {
    [P.ACTION]: noseF,
  },
});

export function noseF(): any {
  if (verbIs(V.BLOW, V.PICK)) {
    tell(YECHH);
    return true;
  } else if (verbIs(V.TAKE) && eq(G.pPrsaWord, W.HOLD)) {
    perform(V.SPUT_ON, NOSE, HANDS);
    return true;
  } else if (verbIs(V.UNCOVER) && hasFlag(CLOTHES_PIN, WORNBIT) && !G.goneApe) {
    if (eq(NOSE, G.handCover)) {
      G.handCover = false;
    }
    perform(V.REMOVE, CLOTHES_PIN);
    return true;
  }
  return false;
}

defineObject(MOUTH, 24, {
  in: GLOBAL_OBJECTS,
  desc: "your mouth",
  synonym: ["MOUTH", "LIP", "LIPS"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PARTBIT],
  props: {
    [P.ACTION]: mouthF,
  },
});

export function mouthF(): any {
  if (verbIs(V.CLEAN) && hasFlag(LIP_BALM, WORNBIT)) {
    perform(V.REMOVE, LIP_BALM);
    return true;
  } else if (verbIs(V.EXAMINE) && hasFlag(LIP_BALM, WORNBIT)) {
    rob(PROTAGONIST, TOILET);
    move(LIP_BALM, PROTAGONIST);
    vInventory();
    return rob(TOILET, PROTAGONIST);
  } else if (verbIs(V.PUT) && prsiIs(MOUTH)) {
    perform(V.EAT, G.prso);
    return true;
  } else if (verbIs(V.OPEN)) {
    tell("This fails to catch any flies.\n");
    return true;
  }
  return false;
}

defineObject(KNEECAPS, 25, {
  in: GLOBAL_OBJECTS,
  desc: "your kneecaps",
  synonym: ["KNEECAP", "KNEE", "KNEES"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PLURALBIT, PARTBIT],
});

defineObject(COCK, 26, {
  in: GLOBAL_OBJECTS,
  desc: "your naughty bits",
  synonym: ["COCK", "PENIS", "BALLS", "ASS"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PARTBIT],
  props: {
    [P.ACTION]: naughtyBitsF,
  },
});

defineObject(CUNT, 27, {
  in: GLOBAL_OBJECTS,
  desc: "your naughty bits",
  synonym: ["CUNT", "VAGINA", "PUSSY"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PARTBIT],
  props: {
    [P.ACTION]: naughtyBitsF,
  },
});

defineObject(TITS, 28, {
  in: GLOBAL_OBJECTS,
  desc: "your naughty bits",
  synonym: ["TIT", "TITS", "BREAST", "BOSOM"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, PLURALBIT, PARTBIT],
  props: {
    [P.ACTION]: naughtyBitsF,
  },
});

export function naughtyBitsF(): any {
  if (nounUsed(W.PUSSY, CUNT) && !adjUsed(ADJ.MY) && isVisible(PAINTING)) {
    if (prsoIs(CUNT)) {
      performPrsa(PAINTING, G.prsi);
      return true;
    } else {
      performPrsa(G.prsi, PAINTING);
      return true;
    }
  } else {
    tell("You don't need to refer to ", PD(COCK), " to complete ", LGOP_CAPS, PERIOD_CR);
    return true;
  }
}

defineObject(PROTAGONIST, 29, {
  in: JOES_BAR,
  synonym: ["PROTAG"],
  desc: "it",
  flags: [NDESCBIT, INVISIBLE, ACTORBIT],
});

defineObject(ME, 30, {
  in: GLOBAL_OBJECTS,
  synonym: ["I", "ME", "MYSELF", "SELF"],
  desc: "yourself",
  flags: [TOUCHBIT, NARTICLEBIT],
  props: {
    [P.ACTION]: meF,
  },
});

export function meF(): any {
  if (verbIs(V.TELL)) {
    tell("Talking to yourself is a sign of impending mental collapse.\n");
    return stop();
  } else if (verbIs(V.RELIEVE)) {
    return vPee();
  } else if (verbIs(V.PUT) && prsiIs(ME) && !G.male && !eq(G.naughtyLevel, 0)) {
    perform(V.FUCK, ME);
    return true;
  } else if (verbIs(V.TOUCH, V.FUCK, V.EAT) && !eq(G.naughtyLevel, 0)) {
    tell("Encouraging such behavior would endanger the possibility of landing a lucrative Hollywood contract to make a film of ", LGOP_CAPS, PERIOD_CR);
    return true;
  } else if (verbIs(V.GIVE) && prsiIs(ME)) {
    perform(V.TAKE, G.prso);
    return true;
  } else if (verbIs(V.SHOW) && prsiIs(ME)) {
    perform(V.EXAMINE, G.prso);
    return true;
  } else if (verbIs(V.MOVE)) {
    return vWalkAround();
  } else if (verbIs(V.SEARCH)) {
    vInventory();
    return true;
  } else if (verbIs(V.EXAMINE)) {
    if (G.goneApe) {
      tell("You've gone ape!\n");
      return true;
    } else {
      tell("You're wearing");
      if (hasFlag(WHITE_SUIT, WORNBIT)) {
        tell(AR(WHITE_SUIT));
        return true;
      } else {
        tell(AR(GARMENT));
        return true;
      }
    }
  } else if (verbIs(V.KILL, V.MUNG)) {
    return jigsUp("Done.");
  } else if (verbIs(V.FIND, V.WHERE)) {
    tell("You're in", TR(G.here));
    return true;
  } else if (verbIs(V.MEASURE)) {
    tell("You don't measure up.\n");
    return true;
  } else if (verbIs(V.UNTIE) && G.bodyTiedToSlab) {
    if (G.goneApe) {
      performPrsa(YOUR_BODY);
      return true;
    } else {
      return yuks();
    }
  } else if (verbIs(V.TIE) && prsiIs(FIRST_SLAB, SECOND_SLAB)) {
    if (G.bodyTiedToSlab && !G.goneApe) {
      tell("You are!\n");
      return true;
    } else {
      tell(YOU_CANT, "tie yourself down!\n");
      return true;
    }
  } else if (verbIs(V.FOLLOW)) {
    tell("Like most computers, I don't have legs.\n");
    return true;
  }
  return false;
}

defineObject(GLOBAL_ROOM, 31, {
  in: GLOBAL_OBJECTS,
  desc: "room",
  synonym: ["ROOM", "PLACE", "LOCATI", "AREA"],
  props: {
    [P.ACTION]: globalRoomF,
  },
});

export function globalRoomF(): any {
  if (verbIs(V.LOOK, V.LOOK_INSIDE, V.EXAMINE)) {
    return vLook();
  } else if (verbIs(V.ENTER, V.WALK_TO)) {
    return vWalkAround();
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    return doWalk(P.OUT);
  } else if (verbIs(V.SEARCH)) {
    if (eq(G.here, EXIT_SHOP)) {
      performPrsa(DUST);
      return true;
    } else {
      tell(NOTHING_NEW);
      return true;
    }
  } else if (verbIs(V.PUT) && prsiIs(GLOBAL_ROOM)) {
    if (eq(G.pPrsaWord, W.THROW)) {
      perform(V.THROW, G.prso);
      return true;
    } else {
      perform(V.DROP, G.prso);
      return true;
    }
  }
  return false;
}

defineObject(HOUSE, 32, {
  in: LOCAL_GLOBALS,
  desc: "house",
  synonym: ["HOUSE", "HOME"],
  adjective: ["SMALL", "RICKETY", "MAD", "SCIENTIST", "PLASTIC"],
  props: {
    [P.ACTION]: houseF,
  },
});

export function houseF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, BEDROOM, TEENSY_WEENSY_HOUSE) || eq(G.here, LABORATORY, LOOKS_CAN_BE_DECEIVING)) {
      tell(LOOK_AROUND);
      return true;
    } else if (eq(G.here, FRONT_DOOR)) {
      return doWalk(P.NORTH);
    } else if (eq(G.here, BACK_DOOR)) {
      return doWalk(P.SOUTH);
    } else if (eq(G.here, CLEVELAND)) {
      return doWalk(P.NE);
    } else if (eq(G.here, BEDROOM, GARDEN)) {
      return doWalk(P.WEST);
    }
    return false;
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (eq(G.here, LABORATORY, BEDROOM)) {
      tell(CANT_FROM_HERE);
      return true;
    } else if (eq(G.here, TEENSY_WEENSY_HOUSE, LABORATORY)) {
      return vWalkAround();
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.LOOK_INSIDE)) {
    if (eq(G.here, FRONT_DOOR, BACK_DOOR, GARDEN)) {
      tell(CANT_FROM_HERE);
      return true;
    } else {
      return vLook();
    }
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

defineObject(SIGN, 33, {
  in: LOCAL_GLOBALS,
  desc: "sign",
  synonym: ["SIGN"],
  adjective: ["LARGE", "RED", "FADED"],
  flags: [READBIT],
  props: {
    [P.ACTION]: signF,
  },
});

export function signF(): any {
  let num: any = 0;
  num = canalLoc();
  if (eq(G.here, CANAL) && !eq(num, 15)) {
    return cantSee(SIGN);
  } else if (verbIs(V.READ)) {
    if (eq(G.here, END_OF_HALLWAY)) {
      tell("\"Up To Observation Room.\"\n");
      return true;
    } else if (eq(G.here, OBSERVATION_ROOM)) {
      tell("\"Down to Cells.\"\n");
      return true;
    } else if (eq(G.here, EXIT_SHOP)) {
      tell("\"E", BOUGHT_AND_SOLD, ".\"\n");
      return true;
    } else if (eq(G.here, VIZICOMM_BOOTH)) {
      tell("\"Out of order.\"\n");
      return true;
    } else if (eq(G.here, SOUTH_POLE)) {
      tell("\"Martian Orphanages, Inc.\n   South Polar Branch\"\n");
      return true;
    } else if (eq(G.here, PENGUIN_PARK)) {
      tell("\"Give generously to the Penguin Retirement Fund.\"\n");
      return true;
    } else if (eq(G.here, CANAL, WATTZ_UPP_DOCK)) {
      tell("The sign has no writing, only the skull and crossbones.\n");
      return true;
    }
    return false;
  }
  return false;
}

defineObject(STAIRS, 34, {
  in: LOCAL_GLOBALS,
  desc: "stair",
  synonym: ["STAIR", "STAIRS", "STAIRW", "STEP"],
  adjective: ["WINDING"],
  props: {
    [P.ACTION]: stairsF,
  },
});

export function stairsF(): any {
  if (verbIs(V.CLIMB, V.CLIMB_UP)) {
    return doWalk(P.UP);
  } else if (verbIs(V.CLIMB_DOWN)) {
    if (eq(G.here, BEDROOM)) {
      if (!bedroomExitF(true)) {
        return true;
      }
      return goto(TEENSY_WEENSY_HOUSE);
    } else {
      return doWalk(P.DOWN);
    }
  } else if (verbIs(V.THROW) && prsiIs(STAIRS)) {
    return wastes();
  }
  return false;
}

defineObject(WINDOW, 35, {
  in: LOCAL_GLOBALS,
  desc: "window",
  synonym: ["WINDOW", "VIEWPORT", "GLASS"],
  adjective: ["RECTAN", "STAINED", "GLASS", "BARRED", "SMALL", "GRIMY"],
  props: {
    [P.ACTION]: windowF,
  },
});

export function windowF(): any {
  if (verbIs(V.LOOK_INSIDE)) {
    if (eq(G.here, OBSERVATION_ROOM)) {
      G.seenExaminationRoom = true;
      tell(YOU_SEE, " a large room below. ");
      return examinationRoomDesc(true);
    } else if (eq(G.here, BEDROOM)) {
      move(FORD, G.here);
      if (hasFlag(HEADLIGHT, TRYTAKEBIT)) {
        move(HEADLIGHT, G.here);
      }
      move(FORD, G.here);
      tell("A car is parked on the street, twenty feet below. It's a Ford, a 1933 Ford ... and one of its ", PD(HEADLIGHT), "s is ");
      if (isIn(HEADLIGHT, G.here) && hasFlag(HEADLIGHT, TRYTAKEBIT)) {
        tell("loose");
      } else {
        tell("missing");
      }
      tell(PERIOD_CR);
      return true;
    } else if (eq(G.here, HOLD)) {
      tell(YOU_SEE, " Saturn and her ample rings.");
      if (!eq(G.spaceshipSceneStatus, 1)) {
        tell(" Much closer, no more than a hundred feet away, is", A(PASSENGER_SHIP), ". Judging by the steam blowing from her ion engines, she's preparing to depart.");
      }
      crlf();
      return true;
    } else if (eq(G.here, JOES_BAR)) {
      tell("It's raw and blowy outside. Little whirlpools of dust dance by.\n");
      return true;
    } else if (eq(G.here, SOUTH_POLE)) {
      if (hasFlag(ORPHANAGE_FOYER, TOUCHBIT)) {
        tell("The window is fogged.\n");
        return true;
      } else {
        G.cottonBallsSeen = true;
        move(COTTON_BALLS, G.here);
        tell(YOU_SEE, " a ", PD(COTTON_BALLS), " sitting in an entrance foyer.\n");
        return true;
      }
    } else if (eq(G.here, ORPHANAGE_FOYER)) {
      tell(YOU_SEE, " an icy plain.\n");
      return true;
    } else if (eq(G.here, MAIN_HALL_OF_PALACE)) {
      tell("Colored light spills through the window.\n");
      return true;
    }
    return false;
  } else if (verbIs(V.OPEN)) {
    if (eq(G.here, BEDROOM)) {
      tell(ALREADY_IS);
      return true;
    } else {
      tell("It's not that kind of window.\n");
      return true;
    }
  } else if (verbIs(V.CLOSE)) {
    if (eq(G.here, BEDROOM)) {
      tell("It seems stuck.\n");
      return true;
    } else {
      tell(ALREADY_IS);
      return true;
    }
  } else if (verbIs(V.PUT_THROUGH, V.PUT) && prsiIs(WINDOW) && eq(G.here, BEDROOM)) {
    if (prsoIs(HANDS)) {
      tell(HUH);
      return true;
    } else if (isIn(PROTAGONIST, BED)) {
      return cantReach(G.prsi);
    } else if (prsoIs(SHEET) && (G.sheetHanging || G.sheetTied)) {
      return false;
    } else {
      remove(G.prso);
      pronoun();
      tell(" land");
      if (!hasFlag(G.prso, PLURALBIT)) {
        tell("s");
      }
      tell(" on the street below. An urchin dashes up and runs off with", TR(G.prso));
      return true;
    }
  } else if (verbIs(V.EMPTY_FROM) && prsiIs(WINDOW) && eq(G.here, BEDROOM)) {
    perform(V.EMPTY, G.prso, WINDOW);
    return true;
  } else if (verbIs(V.ENTER, V.EXIT, V.DISEMBARK, V.LEAP_OFF)) {
    if (eq(G.here, BEDROOM)) {
      if (G.sheetHanging) {
        perform(V.CLIMB_DOWN, SHEET);
        return true;
      } else {
        return plummetToPavement();
      }
    } else if (eq(G.here, SOUTH_POLE, ORPHANAGE_FOYER)) {
      tell("It's barred!\n");
      return true;
    } else if (eq(G.here, OBSERVATION_ROOM)) {
      return doWalk(P.WEST);
    } else {
      return doFirst("open", WINDOW);
    }
  }
  return false;
}

defineObject(TREE, 36, {
  in: LOCAL_GLOBALS,
  desc: "tree",
  synonym: ["TREE", "TREES"],
  props: {
    [P.ACTION]: treeF,
  },
});

export function treeF(): any {
  if (verbIs(V.CLIMB, V.CLIMB_UP)) {
    tell("The trees are all unclimbable.\n");
    return true;
  }
  return false;
}

defineObject(HOLE, 37, {
  in: LOCAL_GLOBALS,
  synonym: ["HOLE", "CIRCLE"],
  adjective: ["BLACK", "WHITE"],
  props: {
    [P.SDESC]: "black circle",
    [P.ACTION]: holeF,
  },
});

G.holeMove = false;

export function holeF(): any {
  let oldHere: any = 0;
  if (!circleIsntBlack() && prsoIs(HOLE) && eq(get(P_ADJW, 0), ADJ.WHITE) || !circleIsntBlack() && prsiIs(HOLE) && eq(get(P_ADJW, 1), ADJ.WHITE) || circleIsntBlack() && prsoIs(HOLE) && eq(get(P_ADJW, 0), ADJ.BLACK) || circleIsntBlack() && prsiIs(HOLE) && eq(get(P_ADJW, 1), ADJ.BLACK)) {
    return cantSee(HOLE);
  } else if (holeInvisible()) {
    return cantSee(HOLE);
  } else if (eq(G.here, CELL) && nounUsed(W.HOLE, HOLE) && verbIs(V.BOARD, V.ENTER, V.WALK_TO, V.LOOK_INSIDE)) {
    return doWalk(P.UP);
  } else if (eq(loc(PROTAGONIST), CAGE, FIRST_SLAB, SECOND_SLAB) && isTouching(HOLE)) {
    cantReach(HOLE);
    return true;
  } else if (verbIs(V.STAND_ON, V.ENTER, V.BOARD)) {
    if (circleIsntBlack()) {
      tell(NOTHING_HAPPENS);
      return true;
    } else if (!isIn(PROTAGONIST, G.here)) {
      notGoingAnywhere();
      return true;
    }
    fallThroughHole();
    G.longCorridorLoc = 1;
    G.madScientistCounter = 0;
    G.impatienceCounter = 0;
    dequeue(iMadScientist);
    oldHere = G.here;
    if (eq(G.here, LONG_CORRIDOR)) {
      tell("Geronimo!\n   Yow! You appear in midair, high above a canal-studded desertscape. The ground is approaching uncomfortably fast.\n   Caw! Caw! A pterodactyl snatches you");
      andSidekick();
      tell(" in midair and deposits you safely in", ELLIPSIS);
      if (hasFlag(MY_KIND_OF_DOCK, TOUCHBIT) && prob(60)) {
        goto(MY_KIND_OF_DOCK);
      } else if (hasFlag(OASIS, TOUCHBIT) && prob(40)) {
        goto(OASIS);
      } else {
        goto(RUINED_CASTLE_2);
      }
    } else {
      goto(getp(G.here, P.HOLE_DESTINATION));
    }
    if (eq(oldHere, WELL_BOTTOM) && isIn(SIDEKICK, WELL_BOTTOM)) {
      G.holeMove = true;
      sidekickFollowsYou();
      G.holeMove = false;
    }
    return true;
  } else if (verbIs(V.LOOK_UNDER, V.TAKE)) {
    tell("It's not liftable.\n");
    return true;
  } else if (verbIs(V.POUR, V.RUB, V.PUT_ON) && nounUsed(W.STAIN, STAIN) && prsoIs(STAIN)) {
    return applyStain(HOLE);
  } else if (verbIs(V.PUT, V.PUT_ON, V.PUT_THROUGH) && prsiIs(HOLE)) {
    if (circleIsntBlack()) {
      return wastes();
    } else if (prsoIs(SOD)) {
      return false;
    } else {
      if (eq(G.here, LONG_CORRIDOR)) {
        remove(G.prso);
      } else {
        if (prsoIs(TORCH) && eq(G.here, WELL_BOTTOM)) {
          torchOff();
        }
        move(G.prso, getp(G.here, P.HOLE_DESTINATION));
      }
      return nonDimensionalJourney();
    }
  } else if (circleIsntBlack()) {
    return false;
  } else if (verbIs(V.REACH_IN, V.TOUCH)) {
    tell(HAND_DWINDLES);
    return true;
  } else if (verbIs(V.EXAMINE, V.LOOK_INSIDE)) {
    tell(STARING_INTO_VOID);
    return true;
  } else if (verbIs(V.MEASURE)) {
    performPrsa(FLEXIBLE_HOLE);
    return true;
  }
  return false;
}

export function holeInvisible(): any {
  if (eq(G.here, GARDEN) && !hasFlag(SOD, MUNGBIT) || eq(G.here, CELL) && !G.holeOpen || eq(G.here, LONG_CORRIDOR) && !eq(G.longCorridorLoc, 3)) {
    return true;
  } else {
    return false;
  }
}

export function nonDimensionalJourney(): any {
  tell("You get all cross-eyed trying to follow the non-dimensional journey of", T(G.prso), " into", T(HOLE), ". When you get your eyeballs untangled again,", T(G.prso), " is gone.\n");
  return true;
}

export function fallThroughHole(): any {
  G.holeMove = true;
  G.raftHeld = false;
  tell("You're sucked into the hole in a direction that isn't down, but neither is it one of the other directions with which you're familiar.");
  if (isUltimatelyIn(WHITE_SUIT)) {
    move(WHITE_SUIT, AT_MAIN_HATCH);
    clearFlag(WHITE_SUIT, TOUCHBIT);
    clearFlag(WHITE_SUIT, WORNBIT);
    if (isVisible(WHITE_SUIT)) {
      tell(" Oddly, your ", D(WHITE_SUIT), " vanishes without a trace.");
    }
  }
  crlf();
  crlf();
  return true;
}

export function isTouching(thing: any): any {
  if (prsoIs(thing) && (eq(G.prsa, V.TAKE, V.TOUCH, V.SHAKE) || eq(G.prsa, V.CLEAN, V.KISS, V.SWIM) || eq(G.prsa, V.PUSH, V.CLOSE, V.LOOK_UNDER) || eq(G.prsa, V.MOVE, V.OPEN, V.KNOCK) || eq(G.prsa, V.SET, V.SHAKE, V.RAISE) || eq(G.prsa, V.UNLOCK, V.LOCK, V.CLIMB_UP) || eq(G.prsa, V.CLIMB, V.CLIMB_DOWN, V.CLIMB_ON) || eq(G.prsa, V.BOARD, V.ENTER, V.ON) || eq(G.prsa, V.OFF, V.SET, V.THROW) || eq(G.prsa, V.TASTE, V.FUCK, V.RAPE) || eq(G.prsa, V.LOOK_INSIDE, V.STAND_ON, V.TIE) || eq(G.prsa, V.MUNG, V.KICK, V.KILL) || eq(G.prsa, V.KNOCK, V.CUT, V.WHIP) || eq(G.prsa, V.BITE, V.PUSH))) {
    return true;
  } else if (prsiIs(thing) && verbIs(V.GIVE, V.PUT, V.PUT_ON)) {
    return true;
  } else {
    return false;
  }
}

export function inCatacombs(): any {
  if (eq(G.here, CATACOMBS, WELL_BOTTOM, LADDER_ROOM)) {
    return true;
  } else if (eq(G.here, BURIAL_CHAMBER, FORGOTTEN_STOREHOUSE)) {
    return true;
  } else {
    return false;
  }
}

export function isInSpace(): any {
  if (eq(G.here, HOLD, STABLE, AT_MAIN_HATCH) || eq(G.here, LONG_CORRIDOR, IN_SPACE, SPACE_YACHT)) {
    return true;
  } else {
    return false;
  }
}

export function cantSee(obj: any = false, string: any = false): any {
  G.pWon = false;
  tell(YOU_CANT);
  if (eq(obj, ODOR)) {
    tell("smell");
  } else {
    tell("see");
  }
  if (!obj || obj && !isName(obj)) {
    tell(" any");
  }
  if (!obj) {
    tell(" ", string);
  } else if (eq(obj, G.prsi)) {
    prsiPrint();
  } else {
    prsoPrint();
  }
  tell(" here.\n");
  return stop();
}

export function cantVerbAPrso(string: any): any {
  tell(YOU_CANT, string, A(G.prso), "!\n");
  return true;
}

export function openYourEyes(): any {
  if (hasFlag(EYES, MUNGBIT)) {
    return doFirst("open", EYES);
  } else {
    return doFirst("uncover", EYES);
  }
}

export function nowTied(obj: any): any {
  tell("Okay,", T(G.prso), " is now tied to", TR(obj));
  return true;
}

export function tellHitHead(): any {
  tell("You bang your bean against", T(G.prso), " as you attempt this.\n");
  return true;
}

export function nounUsed(testNoun: any, obj: any): any {
  if (prsoIs(obj) && eq(get(P_NAMW, 0), testNoun)) {
    return true;
  } else if (prsiIs(obj) && eq(get(P_NAMW, 1), testNoun)) {
    return true;
  } else {
    return false;
  }
}

export function adjUsed(testAdj: any): any {
  if (eq(testAdj, get(P_ADJW, 0), get(P_ADJW, 1))) {
    return true;
  } else {
    return false;
  }
}

export function isOffVehicle(obj: any): any {
  if (eq(obj, STOOL, TOILET, FRONT_STOOP) || eq(obj, FIRST_SLAB, SECOND_SLAB)) {
    return true;
  } else {
    return false;
  }
}

export function openClosed(obj: any): any {
  if (hasFlag(obj, OPENBIT)) {
    tell("open");
    return true;
  } else {
    tell("closed");
    return true;
  }
}

export function wee(): any {
  G.awaitingReply = 2;
  queue(iReply, 2);
  tell("Wasn't that fun?\n");
  return true;
}

export function inYourPackage(string: any): any {
  tell("This is the ", string);
  return inPackage();
}

export function inPackage(): any {
  tell(" that came in your ", LGOP_CAPS, " package.");
  return true;
}

export function hisHer(capH: any = false): any {
  if (capH) {
    tell("H");
  } else {
    tell("h");
  }
  if (G.male) {
    tell("is");
    return true;
  } else {
    tell("er");
    return true;
  }
}

export function herHis(capH: any = false): any {
  if (capH) {
    tell("H");
  } else {
    tell("h");
  }
  if (G.male) {
    tell("er");
    return true;
  } else {
    tell("is");
    return true;
  }
}

export function himHer(): any {
  if (G.male) {
    tell("him");
    return true;
  } else {
    tell("her");
    return true;
  }
}

export function herHim(): any {
  if (G.male) {
    tell("her");
    return true;
  } else {
    tell("him");
    return true;
  }
}

export function heShe(cap: any = false): any {
  if (G.male) {
    if (cap) {
      tell("H");
    } else {
      tell("h");
    }
  } else {
    if (cap) {
      tell("Sh");
    } else {
      tell("sh");
    }
  }
  tell("e");
  return true;
}

export function sheHe(cap: any = false): any {
  if (G.male) {
    if (cap) {
      tell("Sh");
    } else {
      tell("sh");
    }
  } else {
    if (cap) {
      tell("H");
    } else {
      tell("h");
    }
  }
  tell("e");
  return true;
}

export function cantReach(obj: any): any {
  tell(YOU_CANT, "reach", T(obj));
  if (!isIn(PROTAGONIST, G.here)) {
    tell(" from", T(loc(PROTAGONIST)));
  }
  tell(PERIOD_CR);
  return true;
}

export function eagerlyAccepts(): any {
  move(G.prso, G.prsi);
  tell("Eagerly,", T(G.prsi), " accepts", T(G.prso));
  return true;
}

export function notOnGround(vehicle: any): any {
  tell("But", T(vehicle), " isn't on the ground!\n");
  return true;
}

export function andSidekick(newSidekickLoc: any = false): any {
  if (isVisible(SIDEKICK)) {
    if (newSidekickLoc) {
      move(SIDEKICK, newSidekickLoc);
    }
    tell(" and ", D(SIDEKICK));
    return true;
  }
  return false;
}

export function playerCantSee(): any {
  if (hasFlag(EYES, MUNGBIT) || eq(G.handCover, EYES)) {
    return openYourEyes();
  } else if (!G.lit) {
    tell(TOO_DARK, "\n");
    return true;
  } else {
    return false;
  }
}

export function doFirst(string: any, obj: any = false): any {
  tell(YOULL_HAVE_TO, string);
  if (obj) {
    tprint(obj);
  }
  tell(" first.\n");
  return true;
}

export function notIn(): any {
  tell("But", T(G.prso), " isn't ");
  if (hasFlag(G.prsi, ACTORBIT)) {
    tell("being held by");
  } else if (hasFlag(G.prsi, SURFACEBIT)) {
    tell("on");
  } else {
    tell("in");
  }
  tell(TR(G.prsi));
  return true;
}

export function noLid(): any {
  tell("The ", D(G.prso), " has no lid.\n");
  return true;
}

export function sore(string: any): any {
  tell("You begin to get a sore ", string, PERIOD_CR);
  return true;
}

export function cantUseThatWay(string: any): any {
  tell("[", YOU_CANT, "use ", string, " that way.]\n");
  return true;
}

export function recognize(): any {
  G.pWon = false;
  tell("[That sentence isn't one I recognize.]\n");
  return true;
}

export function expletive(): any {
  tell(" \"Oh ");
  if (eq(G.naughtyLevel, 0)) {
    tell("shucks");
  } else if (eq(G.naughtyLevel, 1)) {
    tell("damn");
  } else {
    tell("shit");
  }
  tell("! ");
  return true;
}

export function pronoun(): any {
  if (prsoIs(ME)) {
    tell("You");
    return true;
  } else if (hasFlag(G.prso, PLURALBIT)) {
    tell("They");
    return true;
  } else if (hasFlag(G.prso, FEMALEBIT)) {
    tell("She");
    return true;
  } else if (hasFlag(G.prso, ACTORBIT)) {
    tell("He");
    return true;
  } else {
    tell("It");
    return true;
  }
}

export function referring(himHer_: any = false): any {
  tell("I don't see wh");
  if (himHer_) {
    tell("o");
  } else {
    tell("at");
  }
  tell(" you're referring to.\n");
  return true;
}

export function noOneHere(string: any): any {
  tell("There's no one here to ", string, PERIOD_CR);
  return true;
}

export function seeManual(string: any): any {
  tell("[You need quotes to ", string, " See the instruction manual section entitled \"Communicating With Infocom's Interactive Fiction.\"]\n");
  return true;
}

export function unimportantThingF(): any {
  tell("That's not important; leave it alone.\n");
  return true;
}
