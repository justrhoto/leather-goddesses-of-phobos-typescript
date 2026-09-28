// earth.ts — from EARTH.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  blocked, defineObject, per, to,
} from "../engine/define.ts";
import {
  A, D, PD, T, clearFlag, eq, first, hasFlag, isIn, move, printd, putp, setFlag, tell,
} from "../engine/runtime.ts";
import {
  andSidekick, doFirst, inYourPackage, incrementScore, noLid, unimportantThingF,
} from "./globals.ts";
import {
  dequeue, isRunning, perform, performPrsa, queue,
} from "./misc.ts";
import {
  thisIsIt,
} from "./parser.ts";
import {
  cellF,
} from "./phobos.ts";
import {
  describeRoom, doWalk, finish, goto, rob, stop, vLook, vPee, wrongSexWord,
} from "./verbs.ts";
import {
  ACTORBIT, BEER, BURNBIT, CANT_FROM_HERE, CELL, COMIC_BOOK, CONTBIT, DOORS_MARKED, ELLIPSIS,
  FEMALEBIT, FLASHLIGHT, G, GARMENT, GLOBAL_OBJECTS, HAREM, HAREM_GUARD, INDOORSBIT, JOE, JOES_BAR,
  LADIES_ROOM, LADIES_ROOM_OBJECT, LGOP, LIGHTBIT, LOCAL_GLOBALS, LOOK_AROUND, ME, MENS_ROOM,
  MENS_ROOM_OBJECT, MUNGBIT, M_END, M_LOOK, M_SMELL, NARTICLEBIT, NDESCBIT, NOSE, NOTHING_NEW,
  NOT_HERE_OBJECT, ODOR, ONBIT, OPENBIT, P, PERIOD_CR, PHOTO, PIZZA, PLURALBIT, POCKET, PROTAGONIST,
  READBIT, RLANDBIT, ROOMS, SEARCHBIT, SIDEKICK, SIDEKICKS_BODY, SPLATTERED_SIDEKICK,
  STICK_IT_IN_POCKET, STOOL, SULTAN, SULTANS_WIFE, SURFACEBIT, TAKEBIT, THORBAST, THORBAST_SWORD,
  TOILET, TOUCHBIT, TREE_HOLE, TRYTAKEBIT, V, VEHBIT, VOWELBIT, W, WATER, WEARBIT, WINDOW, WORNBIT,
  YECHH, YOUNG_WOMAN, YOU_CANT, prsiIs, prsoIs, verbIs,
} from "./world.ts";

defineObject(JOES_BAR, 38, {
  in: ROOMS,
  desc: "Joe's Bar",
  flags: [ONBIT, RLANDBIT, INDOORSBIT, NARTICLEBIT],
  global: [MENS_ROOM_OBJECT, LADIES_ROOM_OBJECT, WINDOW],
  things: [
    { adjective: null, noun: "DUST", action: unimportantThingF },
    { adjective: "FRONT", noun: "DOOR", action: barDoorF },
    { adjective: null, noun: "BAR", action: barF },
  ],
  exits: {
    NW: per(mensRoomEnterF),
    NE: per(ladiesRoomEnterF),
    SOUTH: blocked("A gust of wind blows you back into the bar."),
    OUT: blocked("A gust of wind blows you back into the bar."),
  },
  props: {
    [P.ACTION]: joesBarF,
  },
});

export function joesBarF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("An undistinguished bar, yet the social center of Upper Sandusky. The front door is almost lost amidst the hazy maze of neon that shrouds the grimy glass of the south wall. ", DOORS_MARKED);
    return true;
  }
  return false;
}

export function barDoorF(): any {
  if (verbIs(V.ENTER)) {
    return doWalk(P.SOUTH);
  } else if (verbIs(V.OPEN, V.CLOSE)) {
    tell("It's a swinging door.\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    performPrsa(WINDOW);
    return true;
  }
  return false;
}

export function barF(): any {
  if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    return doWalk(P.SOUTH);
  } else if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    tell(LOOK_AROUND);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    return vLook();
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

defineObject(JOE, 39, {
  in: JOES_BAR,
  desc: "Joe",
  synonym: ["JOE", "BARTENDER"],
  flags: [ACTORBIT, NDESCBIT, NARTICLEBIT],
  props: {
    [P.ACTION]: joeF,
  },
});

export function joeF(): any {
  if (verbIs(V.TELL) || verbIs(V.ASK_FOR) && prsiIs(BEER)) {
    tell("\"You've had enough.\"\n");
    return stop();
  } else if (verbIs(V.EXAMINE)) {
    tell("Joe is bartending.\n");
    return true;
  }
  return false;
}

defineObject(BEER, 40, {
  desc: "mug of beer",
  synonym: ["DRINK", "MUG", "BEER"],
  props: {
    [P.ACTION]: beerF,
  },
});

export function beerF(): any {
  if (verbIs(V.BUY) && eq(G.here, JOES_BAR)) {
    tell("The bartender");
    if (isRunning(iUrge)) {
      tell(", a keen judge of bladders,");
    }
    tell(" says, ");
    perform(V.TELL, JOE);
    return true;
  }
  return false;
}

defineObject(GARMENT, 41, {
  in: PROTAGONIST,
  synonym: ["OVERALL", "CLOTHES", "LOINCLOTH", "BIKINI"],
  adjective: ["MY", "YOUR", "BRASS", "TIGHT"],
  flags: [TAKEBIT, WEARBIT, WORNBIT, VOWELBIT, NARTICLEBIT, PLURALBIT],
  props: {
    [P.SDESC]: "your overalls",
    [P.ACTION]: garmentF,
  },
});

export function garmentF(): any {
  if (wrongSexWord(GARMENT, W.LOINCLOTH, W.BIKINI)) {
    return stop();
  } else if (verbIs(V.EXAMINE) && hasFlag(CELL, TOUCHBIT)) {
    tell("The ", D(GARMENT), ", tight but comfy, covers only the \"bare essentials.\"\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    tell("1. You\n2. A ", D(COMIC_BOOK), "\n");
    return true;
  } else if (verbIs(V.TAKE_OFF) || verbIs(V.TAKE) && G.goneApe) {
    tell("But", T(GARMENT));
    if (hasFlag(GARMENT, PLURALBIT)) {
      tell(" are");
    } else {
      tell(" is");
    }
    tell(" so becoming!\n");
    return true;
  }
  return false;
}

defineObject(POCKET, 42, {
  in: GLOBAL_OBJECTS,
  desc: "pocket",
  synonym: ["POCKET"],
  adjective: ["BACK"],
  props: {
    [P.ACTION]: pocketF,
  },
});

export function pocketF(): any {
  if (verbIs(V.LOOK_INSIDE)) {
    tell("There's", A(COMIC_BOOK), " there.\n");
    return true;
  } else if (verbIs(V.PUT) && prsiIs(POCKET)) {
    tell("There's no room. ");
    perform(V.LOOK_INSIDE, POCKET);
    return true;
  }
  return false;
}

defineObject(COMIC_BOOK, 43, {
  in: PROTAGONIST,
  synonym: ["BOOK", "RULES"],
  adjective: ["RULE", "COMIC", "3-D"],
  flags: [READBIT, TAKEBIT],
  props: {
    [P.SDESC]: "comic book",
    [P.ACTION]: comicBookF,
  },
});

export function comicBookF(): any {
  if (verbIs(V.REMOVE, V.TAKE, V.BURN) && prsoIs(COMIC_BOOK)) {
    tell("You change your mind and", STICK_IT_IN_POCKET, " instead.\n");
    return true;
  } else if (verbIs(V.READ, V.LOOK_INSIDE, V.OPEN)) {
    if (hasFlag(CELL, TOUCHBIT)) {
      tell("\"Hello, Prisoner!\n   You are a captive of ", PD(LGOP), ". As an experimental subject, your unspeakably painful death will help our effort to enslave humanity and turn the Earth into our private pleasure world. Consider this to be a great honor, human.\"\n   The remainder of the book covers the exacting rules of behavior expected of a prisoner of ", PD(LGOP), ". For example, it mentions that escapees will be killed immediately and painfully by crack Leckbandi guards.");
    } else {
      inYourPackage("3-D comic book");
    }
    tell(" After reading it, you", STICK_IT_IN_POCKET, PERIOD_CR);
    return true;
  }
  return false;
}

defineObject(FLASHLIGHT, 44, {
  in: PROTAGONIST,
  desc: "flashlight",
  synonym: ["FLASHLIGHT", "LIGHT"],
  adjective: ["FLASH"],
  flags: [TAKEBIT, LIGHTBIT],
  props: {
    [P.ACTION]: flashlightF,
  },
});

export function flashlightF(): any {
  if (verbIs(V.OPEN, V.LOOK_INSIDE)) {
    tell("The ", PD(FLASHLIGHT), " has rusted shut.\n");
    return true;
  } else if (verbIs(V.POINT) && hasFlag(FLASHLIGHT, ONBIT) && G.prsi) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

defineObject(MENS_ROOM, 45, {
  in: ROOMS,
  desc: "Gents' Room",
  flags: [ONBIT, RLANDBIT, INDOORSBIT],
  global: [TOILET, ODOR, WATER, MENS_ROOM_OBJECT],
  things: [
    { adjective: null, noun: "SINK", action: sinkF },
  ],
  exits: {
    SE: to(JOES_BAR),
    OUT: to(JOES_BAR),
  },
  props: {
    [P.ODOR]: "pizza",
    [P.ODOR_NUMBER]: 1,
    [P.ACTION]: bathroomF,
  },
});

defineObject(LADIES_ROOM, 46, {
  in: ROOMS,
  desc: "Ladies' Room",
  flags: [ONBIT, RLANDBIT, INDOORSBIT],
  global: [TOILET, ODOR, WATER, LADIES_ROOM_OBJECT],
  things: [
    { adjective: null, noun: "SINK", action: sinkF },
  ],
  exits: {
    SW: to(JOES_BAR),
    OUT: to(JOES_BAR),
  },
  props: {
    [P.ODOR]: "pizza",
    [P.ODOR_NUMBER]: 1,
    [P.ACTION]: bathroomF,
  },
});

export function mensRoomEnterF(): any {
  if (!G.sexChosen) {
    G.sexChosen = true;
    G.male = true;
    move(STOOL, MENS_ROOM);
    setFlag(SULTANS_WIFE, FEMALEBIT);
    setFlag(HAREM_GUARD, FEMALEBIT);
    setFlag(YOUNG_WOMAN, FEMALEBIT);
    putp(SIDEKICK, P.SDESC, "Trent");
    putp(SIDEKICKS_BODY, P.SDESC, "Trent's body");
    putp(SPLATTERED_SIDEKICK, P.SDESC, "bits of splattered Trent");
    putp(THORBAST, P.SDESC, "Thorbast");
    putp(THORBAST_SWORD, P.SDESC, "his sword");
    putp(SULTAN, P.SDESC, "Sultan");
    putp(YOUNG_WOMAN, P.SDESC, "young woman");
    putp(PHOTO, P.SDESC, "photo of Jean Harlow");
    putp(HAREM, P.ODOR, "perfume");
    return MENS_ROOM;
  } else if (G.male) {
    return MENS_ROOM;
  } else {
    printd(MENS_ROOM);
    wrongBathroom("burly man in a partial state of undress unleashes a torrent of lewd remarks");
    return false;
  }
}

export function ladiesRoomEnterF(): any {
  if (!G.sexChosen) {
    G.sexChosen = true;
    move(STOOL, LADIES_ROOM);
    setFlag(ME, FEMALEBIT);
    setFlag(SULTAN, FEMALEBIT);
    setFlag(SIDEKICK, FEMALEBIT);
    setFlag(THORBAST, FEMALEBIT);
    putp(SIDEKICK, P.SDESC, "Tiffany");
    putp(SIDEKICKS_BODY, P.SDESC, "Tiffany's body");
    putp(SPLATTERED_SIDEKICK, P.SDESC, "bits of splattered Tiffany");
    putp(THORBAST, P.SDESC, "Thorbala");
    putp(THORBAST_SWORD, P.SDESC, "her sword");
    putp(SULTAN, P.SDESC, "Sultaness");
    putp(YOUNG_WOMAN, P.SDESC, "young man");
    putp(PHOTO, P.SDESC, "photo of Douglas Fairbanks");
    putp(HAREM, P.ODOR, "cologne");
    return LADIES_ROOM;
  } else if (G.male) {
    printd(LADIES_ROOM);
    wrongBathroom("female patron begins pummelling you with a purse that must surely contain concrete");
    return false;
  } else {
    return LADIES_ROOM;
  }
}

export function wrongBathroom(string: any): any {
  tell("\n   As you enter the wrong bathroom, a ", string, ". You hustle out.\n\n");
  return describeRoom();
}

export function bathroomF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This filthy bathroom belies the existence of disinfectant. A single toilet and sink are the only fixtures. More breathable air can be found to the south");
    if (eq(G.here, MENS_ROOM)) {
      tell("ea");
    } else {
      tell("we");
    }
    tell("st.");
    return true;
  } else if (eq(rarg, M_SMELL)) {
    thisIsIt(PIZZA);
    move(PIZZA, G.here);
    tell("You trace the smell to", A(PIZZA), ", crumpled in the corner. [Incidentally, we had some pretty putrid scents available, all of which would've seemed right at home in a filthy restroom. In the end, we were too kind to use them -- but we were sorely tempted!]");
    return true;
  }
  return false;
}

defineObject(MENS_ROOM_OBJECT, 47, {
  in: LOCAL_GLOBALS,
  desc: "gents' restroom",
  synonym: ["BATHROOM", "RESTROOM", "ROOM"],
  adjective: ["MEN'S", "GENT'S", "MENS", "GENTS", "FILTHY"],
  props: {
    [P.GENERIC]: genericRestroomF,
    [P.ACTION]: mensRoomObjectF,
  },
});

export function mensRoomObjectF(): any {
  if (verbIs(V.FIND, V.ENTER)) {
    if (eq(G.here, JOES_BAR)) {
      return doWalk(P.NW);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.WALK_TO)) {
    if (eq(G.here, JOES_BAR)) {
      return doWalk(P.NW);
    } else if (eq(G.here, MENS_ROOM)) {
      return vPee();
    }
    return false;
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (eq(G.here, MENS_ROOM)) {
      return doWalk(P.SE);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.LOOK_INSIDE)) {
    if (eq(G.here, MENS_ROOM)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      tell(CANT_FROM_HERE);
      return true;
    }
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.USE)) {
    if (eq(G.here, JOES_BAR)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      return vPee();
    }
  } else if (verbIs(V.EXAMINE)) {
    tell("Filthy.\n");
    return true;
  }
  return false;
}

defineObject(LADIES_ROOM_OBJECT, 48, {
  in: LOCAL_GLOBALS,
  desc: "ladies' restroom",
  synonym: ["BATHROOM", "RESTROOM", "ROOM"],
  adjective: ["LADIES", "WOMEN", "FILTHY"],
  props: {
    [P.GENERIC]: genericRestroomF,
    [P.ACTION]: ladiesRoomObjectF,
  },
});

export function ladiesRoomObjectF(): any {
  if (verbIs(V.FIND, V.ENTER)) {
    if (eq(G.here, JOES_BAR)) {
      return doWalk(P.NE);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.WALK_TO)) {
    if (eq(G.here, JOES_BAR)) {
      return doWalk(P.NE);
    } else if (eq(G.here, LADIES_ROOM)) {
      return vPee();
    }
    return false;
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (eq(G.here, LADIES_ROOM)) {
      return doWalk(P.SW);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.LOOK_INSIDE)) {
    if (eq(G.here, LADIES_ROOM)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      tell(CANT_FROM_HERE);
      return true;
    }
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.USE, V.EXAMINE)) {
    performPrsa(MENS_ROOM_OBJECT);
    return true;
  }
  return false;
}

export function genericRestroomF(): any {
  if (verbIs(V.WALK_TO, V.FIND, V.ENTER) && eq(G.here, JOES_BAR)) {
    tell(DOORS_MARKED, "\n");
    return NOT_HERE_OBJECT;
  } else if (verbIs(V.WALK_TO)) {
    vPee();
    return NOT_HERE_OBJECT;
  } else if (G.sexChosen) {
    if (G.male) {
      return MENS_ROOM_OBJECT;
    } else {
      return LADIES_ROOM_OBJECT;
    }
  } else {
    return false;
  }
}

defineObject(TOILET, 49, {
  in: LOCAL_GLOBALS,
  desc: "toilet",
  synonym: ["TOILET"],
  flags: [VEHBIT, CONTBIT, OPENBIT],
  props: {
    [P.CAPACITY]: 2,
    [P.ACTION]: toiletF,
  },
});

export function toiletF(): any {
  if (verbIs(V.PEE_IN, V.USE)) {
    return vPee();
  } else if (verbIs(V.CLOSE)) {
    return noLid();
  } else if (verbIs(V.FLUSH)) {
    tell("Probably the first fresh water to enter this john in a month.\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE, V.EXAMINE)) {
    tell(YECHH);
    return true;
  }
  return false;
}

export function sinkF(): any {
  if (verbIs(V.LOOK_INSIDE, V.EXAMINE)) {
    perform(V.EXAMINE, TOILET);
    return true;
  }
  return false;
}

defineObject(STOOL, 50, {
  desc: "stool",
  synonym: ["STOOL", "SOOL"],
  adjective: ["SMALL", "WOODEN"],
  flags: [TAKEBIT, VEHBIT, SURFACEBIT, CONTBIT, OPENBIT, SEARCHBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "sool",
    [P.SIZE]: 50,
    [P.CAPACITY]: 20,
    [P.ACTION]: stoolF,
  },
});

export function stoolF(): any {
  if (verbIs(V.EXAMINE) && !hasFlag(STOOL, TOUCHBIT)) {
    tell("It's safe to take, if you receive my meaning.\n");
    return true;
  } else if (verbIs(V.BOARD, V.CLIMB)) {
    if (first(STOOL)) {
      return doFirst("clear off", STOOL);
    } else if (isIn(PROTAGONIST, TREE_HOLE)) {
      move(PROTAGONIST, G.here);
      tell("Using the stool, you");
      andSidekick(G.here);
      tell(" climb out of the hole.\n");
      return true;
    }
    return false;
  }
  return false;
}

G.male = false;

G.sexChosen = false;

G.urgeCounter = 0;

export function iUrge(): any {
  queue(iUrge, -1);
  G.urgeCounter = G.urgeCounter + 1;
  tell("   ");
  if (eq(G.urgeCounter, 1)) {
    tell("You feel an urge.\n");
    return true;
  } else if (eq(G.urgeCounter, 2)) {
    tell("You trace the urge to the region of your bladder.\n");
    return true;
  } else if (eq(G.urgeCounter, 3)) {
    tell("Though operating at far below normal speed, your mind begins to conclude that it would be best at this point to ");
    if (eq(G.here, MENS_ROOM, LADIES_ROOM)) {
      tell("use the");
    } else {
      tell("find a");
    }
    tell(" bathroom.\n");
    return true;
  } else if (eq(G.urgeCounter, 4)) {
    tell("Even if you don't care about your clothes, imagine the embarrassment!\n");
    return true;
  } else {
    tell(YOU_CANT, "wait another second. ");
    if (eq(G.here, MENS_ROOM, LADIES_ROOM)) {
      queue(iKidnapping, 3);
      dequeue(iUrge);
      move(PROTAGONIST, G.here);
      tell("Fortunately, you've stumbled upon a bathroom. A moment later, you are feeling much better, although your thigh muscles are still quivering a tad.");
      return noticePizzaOdor();
    } else {
      tell("Without going into embarrassing detail, you've made a mess. A moment later, before even half the people in Joe's have begun tittering, a flash of green light precedes the arrival of two VERY odd patrons. They rotate their bellies to get a better look at you. As their mouth stalks open you find that, despite an evolution that occurred dozens of astronomical units from Upper Sandusky, these fellows speak in perfect midwestern English.\n   \"This one?\"\n   \"A pitiful specimen ... can't even control simple bodily functions ... the tests would be worthless...\"\n   \"Agreed. Must've been a screw-up somewhere. Let's take this one instead.\"\n   They grab a blonde woman, whose scream is cut short by another green flash. Three weeks later, when the Earth is invaded and everyone is enslaved by ", PD(LGOP), ", you wonder if there was a connection.\n");
      return finish();
    }
  }
}

defineObject(PIZZA, 51, {
  desc: "dubious slice of pizza",
  synonym: ["SLICE", "PIZZA"],
  adjective: ["DUBIOUS", "AGING", "CRUMPLED"],
  flags: [TRYTAKEBIT],
  props: {
    [P.ACTION]: pizzaF,
  },
});

export function pizzaF(): any {
  if (verbIs(V.EAT, V.TASTE, V.TAKE)) {
    setFlag(PIZZA, TOUCHBIT);
    tell("The very thought is enough to make stronger ");
    if (!G.male) {
      tell("wo");
    }
    tell("men than yourself ");
    if (eq(G.naughtyLevel, 0)) {
      tell("become quite ill");
    } else if (eq(G.naughtyLevel, 1)) {
      tell("vomit");
    } else {
      tell("puke their guts out");
    }
    tell(PERIOD_CR);
    return true;
  }
  return false;
}

export function noticePizzaOdor(): any {
  if (!hasFlag(NOSE, MUNGBIT)) {
    thisIsIt(ODOR);
    tell("\n   Now that the \"crisis\" has passed, you notice a strong and familiar odor pervading the room.\n");
    return true;
  }
  return false;
}

export function iKidnapping(): any {
  if (isIn(PROTAGONIST, STOOL)) {
    move(STOOL, CELL);
  }
  move(PROTAGONIST, G.here);
  if (G.male) {
    putp(GARMENT, P.SDESC, "brass loincloth");
  } else {
    putp(GARMENT, P.SDESC, "brass bikini");
  }
  putp(COMIC_BOOK, P.SDESC, "rule book");
  clearFlag(GARMENT, NARTICLEBIT);
  clearFlag(GARMENT, VOWELBIT);
  clearFlag(GARMENT, PLURALBIT);
  rob(PROTAGONIST, CELL);
  move(GARMENT, PROTAGONIST);
  move(COMIC_BOOK, PROTAGONIST);
  incrementScore(1, 7);
  if (!eq(G.verbosity, 0)) {
    tell("   A brilliant flash of green light seems less unusual when followed by the appearance of tentacled aliens, as is the case with the current flash of green light. The tentacles wrap roughly around you as you faint.\n   After an unknown amount of time... Well, let's ");
    if (eq(G.naughtyLevel, 0)) {
      tell("be frank");
    } else {
      tell("cut the ");
      if (eq(G.naughtyLevel, 1)) {
        tell("crap");
      } else {
        tell("bullshit");
      }
    }
    tell(". 7.3 hours later, you wake. Your head feels as if it's been run over by several locomotives, or at least one very large locomotive, and your clothes are now unrecognizable", ELLIPSIS);
  }
  goto(CELL);
  return cellF(M_END);
}
