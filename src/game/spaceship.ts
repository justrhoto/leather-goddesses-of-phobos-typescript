// spaceship.ts — from SPACESHIP.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  defineObject, per, to, toIfOpen,
} from "../engine/define.ts";
import {
  A, AR, D, PD, T, TR, clearFlag, crlf, eq, hasFlag, isIn, move, prob, putp, remove, setFlag, tell,
} from "../engine/runtime.ts";
import {
  andSidekick, cantSee, doFirst, heShe, herHim, herHis, himHer, hisHer, incrementScore, isInSpace,
  isTouching, nounUsed, openClosed, playerCantSee, sheHe, unimportantThingF,
} from "./globals.ts";
import {
  dequeue, perform, performPrsa, queue,
} from "./misc.ts";
import {
  thisIsIt,
} from "./parser.ts";
import {
  genericSidekickF, memoriam,
} from "./phobos.ts";
import {
  describeRoom, doWalk, iFollow, impossibles, isGlobalIn, isUltimatelyIn, isVisible, jigsUp,
  sidekickFollowsYou, stop, vRape, wastes,
} from "./verbs.ts";
import {
  ACTORBIT, ATTACK_FLEET, AT_MAIN_HATCH, BATTLESHIP, BATTLESHIP_DESC, BEM, BURNBIT, CANT_FROM_HERE,
  CANT_GO, CONTBIT, DONT_WANT_TO, DOORBIT, ELLIPSIS, G, HANDS, HATCH, HEAD, HOLD, HOLE, HORSE_CANT_FIT,
  INDOORSBIT, INTDIR, IN_SPACE, LGOP, LOCAL_GLOBALS, LOCKEDBIT, LONG_CORRIDOR, LOOK_AROUND,
  MALE_GORILLA, MAN_WOMAN, ME, MUNGBIT, M_END, M_ENTER, M_FATAL, M_LOOK, M_OBJDESC, M_OBJDESC_Q,
  M_SMELL, NARTICLEBIT, NDESCBIT, NOSE, NOTHING_NEW, ODOR, ONBIT, OPENBIT, P, PASSENGER_SHIP,
  PERIOD_CR, PHOTO, PLURALBIT, PRIVATE_CABIN_DOOR, PROTAGONIST, READBIT, RLANDBIT, ROOMS, SEARCHBIT,
  SIDEKICK, SPACE_YACHT, SPLATTERED_SIDEKICK, STABLE, STALLION, SWORD, TAKEBIT, THORBAST,
  THORBAST_SWORD, TOUCHBIT, UNTEEDBIT, V, VEHBIT, W, WEARBIT, WHITE_SUIT, WINDOW, WORNBIT, YECHH,
  YOUNG_WOMAN, YOU_CANT, prsiIs, prsoIs, verbIs,
} from "./world.ts";

defineObject(HOLD, 182, {
  in: ROOMS,
  desc: "Hold",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [WINDOW, BATTLESHIP, PASSENGER_SHIP],
  exits: {
    SOUTH: to(STABLE),
    SW: to(LONG_CORRIDOR),
  },
  props: {
    [P.ACTION]: holdF,
  },
});

G.spaceshipSceneStatus = 0;

export function holdF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !hasFlag(G.here, TOUCHBIT)) {
    return queue(iPassengerShipDeparts, 12);
  } else if (eq(rarg, M_LOOK)) {
    tell("You are in the cargo hold of a giant spaceship. ");
    if (eq(G.sidekickExploded, 1)) {
      splatteredDesc();
      tell(" ");
    }
    tell("A tiny viewport is set into the curving steel hull, and arched passageways lead in directions that we will arbitrarily call south and southwest.");
    return true;
  } else if (eq(rarg, M_END) && eq(G.sidekickExploded, 0)) {
    tell("   A radium-powered grenade clatters against the deck! You glimpse a shadowy figure, dressed in black, slipping away. ");
    if (isIn(SIDEKICK, G.here)) {
      G.followFlag = 12;
      queue(iFollow, 2);
      G.sidekickExploded = 1;
      remove(SIDEKICK);
      move(SPLATTERED_SIDEKICK, G.here);
      tell(D(SIDEKICK), " yells to hit the deck, and hurls ");
      himHer();
      tell("self onto the grenade!\n   A sickening explosion splatters ", D(SIDEKICK), " all around the room! As you struggle to control your shock and nausea");
      return memoriam();
    } else {
      return jigsUp("The resulting explosion makes you go all to pieces.");
    }
  }
  return false;
}

export function splatteredDesc(): any {
  tell("Little ", D(SPLATTERED_SIDEKICK), " cover all the walls, the floor, and the ceiling.");
  return true;
}

defineObject(SPLATTERED_SIDEKICK, 183, {
  synonym: ["BITS", "TRENT", "TIFFAN", "TIFF"],
  adjective: ["SMALL", "SPLATTERED"],
  flags: [NDESCBIT, NARTICLEBIT, PLURALBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "sword",
    [P.GENERIC]: genericSidekickF,
    [P.ACTION]: splatteredSidekickF,
  },
});

export function splatteredSidekickF(): any {
  if (verbIs(V.EAT, V.LICK, V.TASTE)) {
    tell(YECHH);
    return true;
  }
  return false;
}

defineObject(SWORD, 184, {
  in: HOLD,
  synonym: ["SWORD", "SWORDS", "BLADE"],
  adjective: ["GLISTENING", "MY", "YOUR"],
  flags: [TAKEBIT],
  props: {
    [P.SDESC]: "sword",
    [P.FDESC]: "One item in the hold is a sword, a potent weapon with a long, hard blade of glistening steel.",
  },
});

defineObject(STABLE, 185, {
  in: ROOMS,
  desc: "Stable",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [BATTLESHIP],
  exits: {
    NORTH: per(holdEnterF),
    WEST: per(longCorridorEnterF),
  },
  props: {
    [P.ACTION]: stableF,
  },
});

export function stableF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This must be the flagship for ", PD(LGOP), ATTACK_FLEET, ", since this stable contains ", PD(LGOP), ATTACK_FLEET, " Cavalry Mounts. ");
    if (hasFlag(STALLION, NDESCBIT)) {
      tell("The most striking horse is a magnificent white stallion. ");
    }
    tell("There are exits to the \"north\" and \"west.\"");
    return true;
  }
  return false;
}

export function holdEnterF(): any {
  if (isIn(PROTAGONIST, STALLION) || hasFlag(STALLION, MUNGBIT)) {
    tell(HORSE_CANT_FIT);
    return false;
  } else {
    return HOLD;
  }
}

defineObject(STALLION, 186, {
  in: STABLE,
  desc: "stallion",
  synonym: ["MOUNT", "STALLION", "HORSE", "STUD"],
  adjective: ["MAGNIFICENT", "WHITE"],
  flags: [VEHBIT, CONTBIT, OPENBIT, SEARCHBIT, NDESCBIT],
  props: {
    [P.ACTION]: stallionF,
  },
});

export function stallionF(): any {
  if (eq(STALLION, G.winner)) {
    if (verbIs(V.WALK) && isIn(PROTAGONIST, STALLION)) {
      G.winner = PROTAGONIST;
      doWalk(G.prso);
      return G.winner = STALLION;
    } else if (verbIs(V.GIDDYAP)) {
      G.winner = PROTAGONIST;
      perform(V.KICK, STALLION);
      G.winner = STALLION;
      return true;
    } else {
      tell("\"Neighhh!!!\"\n");
      return true;
    }
  } else if (verbIs(V.DISEMBARK) && isIn(PROTAGONIST, STALLION)) {
    move(PROTAGONIST, G.here);
    tell("You");
    andSidekick(G.here);
    tell(" dismount.\n");
    return true;
  } else if (verbIs(V.BOARD)) {
    clearFlag(STALLION, NDESCBIT);
    return false;
  } else if (verbIs(V.PUSH_DIR) && prsiIs(INTDIR)) {
    setFlag(STALLION, MUNGBIT);
    doWalk(G.pDirection);
    clearFlag(STALLION, MUNGBIT);
    clearFlag(STALLION, NDESCBIT);
    move(STALLION, G.here);
    return true;
  } else if (verbIs(V.BOARD_DIR) && eq(G.pPrsaWord, W.RIDE) && prsiIs(INTDIR)) {
    perform(V.BOARD, INTDIR);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("The stallion is a magnificent white stud.\n");
    return true;
  } else if (verbIs(V.FUCK)) {
    if (eq(G.naughtyLevel, 0)) {
      performPrsa(MALE_GORILLA);
      return true;
    } else {
      tell("You and Catherine the Great.\n");
      return true;
    }
  } else if (verbIs(V.KICK)) {
    tell("The horse gallops around in a circle.\n");
    return true;
  }
  return false;
}

defineObject(LONG_CORRIDOR, 187, {
  in: ROOMS,
  desc: "Long Corridor",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [HOLE, BATTLESHIP],
  things: [
    { adjective: null, noun: "LIGHT", action: unimportantThingF },
  ],
  exits: {
    EAST: per(longCorridorMovementF),
    WEST: per(longCorridorMovementF),
    NE: per(longCorridorExitF),
  },
  props: {
    [P.ACTION]: longCorridorF,
  },
});

export function longCorridorF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("You are partway along an \"east-west\" hall of mind-numbing length. Rings of light pulsate along the corridor in rhythm with the ship's throbbing engines");
    if (eq(G.longCorridorLoc, 3)) {
      tell(". A tiny alcove contains", A(HOLE));
    } else if (eq(G.longCorridorLoc, 1)) {
      tell(". Openings lead \"east\" and \"northeast\"");
    }
    tell(".");
    return true;
  } else if (eq(rarg, M_END) && isIn(STALLION, G.here)) {
    tell("   The stallion whinnies then gallops ");
    if (eq(G.longCorridorLoc, 1)) {
      move(STALLION, STABLE);
      tell("ea");
    } else {
      move(STALLION, AT_MAIN_HATCH);
      tell("we");
    }
    tell("st.\n");
    return true;
  }
  return false;
}

G.longCorridorLoc = 1;

export function longCorridorExitF(): any {
  if (eq(G.longCorridorLoc, 1)) {
    if (isIn(PROTAGONIST, STALLION) || hasFlag(STALLION, MUNGBIT)) {
      tell(HORSE_CANT_FIT);
      return false;
    } else {
      return HOLD;
    }
  } else {
    tell(CANT_GO);
    return false;
  }
}

export function longCorridorMovementF(): any {
  if (isIn(PROTAGONIST, STALLION)) {
    return longCorridorEnterF(true);
  } else if (prsoIs(P.EAST)) {
    if (eq(G.longCorridorLoc, 1)) {
      return STABLE;
    } else {
      G.longCorridorLoc = G.longCorridorLoc - 1;
    }
  } else if (eq(G.longCorridorLoc, 10)) {
    return AT_MAIN_HATCH;
  } else {
    G.longCorridorLoc = G.longCorridorLoc + 1;
  }
  describeRoom();
  if (isIn(SIDEKICK, G.here)) {
    sidekickFollowsYou();
  }
  return ROOMS;
}

defineObject(AT_MAIN_HATCH, 188, {
  in: ROOMS,
  desc: "At Main Hatch",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [HATCH, BATTLESHIP],
  exits: {
    EAST: per(longCorridorEnterF),
    NORTH: per(hatchEnterF),
    OUT: per(hatchEnterF),
  },
  props: {
    [P.ACTION]: atMainHatchF,
  },
});

export function atMainHatchF(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    setFlag(PRIVATE_CABIN_DOOR, LOCKEDBIT);
    return true;
  } else if (eq(rarg, M_LOOK)) {
    tell("To the \"north,\" the main hatch of the flagship is ");
    openClosed(HATCH);
    tell(". A long corridor leads \"east.\"");
    return true;
  } else if (eq(rarg, M_END) && (isUltimatelyIn(THORBAST_SWORD) || eq(G.spaceshipSceneStatus, 3)) && !eq(G.spaceshipSceneStatus, 1)) {
    return iPassengerShipDeparts();
  } else if (eq(rarg, M_END) && hasFlag(SPACE_YACHT, TOUCHBIT) && eq(G.sidekickExploded, 1)) {
    G.sidekickExploded = 2;
    move(SIDEKICK, G.here);
    remove(SPLATTERED_SIDEKICK);
    tell("   You hear panting as ", D(SIDEKICK), " dashes up behind you, somewhat out of breath. \"Good, you're still here! Thank God that time traveller who wandered by the hold had a matter reconstituter!\"\n");
    return true;
  }
  return false;
}

export function longCorridorEnterF(onHorseInLongCorridor: any = false): any {
  if (isIn(PROTAGONIST, STALLION)) {
    tell("Kicking your proud mount forcefully in the flank, you gallop down a long corridor pulsing with light. Above the echoes of the hoofbeats, you can hear, almost feel, the throbbing of mighty engines. After a minute of wild riding", ELLIPSIS);
    if (onHorseInLongCorridor) {
      if (prsoIs(P.EAST)) {
        G.here = AT_MAIN_HATCH;
      } else {
        G.here = STABLE;
      }
    }
    if (eq(G.here, AT_MAIN_HATCH)) {
      G.longCorridorLoc = 1;
      move(STALLION, STABLE);
    } else {
      G.longCorridorLoc = 10;
      move(STALLION, AT_MAIN_HATCH);
    }
    return STALLION;
  } else {
    return LONG_CORRIDOR;
  }
}

export function hatchEnterF(): any {
  if (!hasFlag(HATCH, OPENBIT)) {
    doFirst("open", HATCH);
    thisIsIt(HATCH);
    return false;
  } else if (isIn(PROTAGONIST, STALLION) || hasFlag(STALLION, MUNGBIT)) {
    tell(HORSE_CANT_FIT);
    return false;
  } else {
    return IN_SPACE;
  }
}

defineObject(WHITE_SUIT, 189, {
  in: AT_MAIN_HATCH,
  desc: "white suit",
  synonym: ["SUIT", "SUI", "THERMA"],
  adjective: ["THERMA", "WHITE", "WHIE"],
  flags: [WEARBIT, TAKEBIT],
  props: {
    [P.NO_T_DESC]: "whie sui",
    [P.FDESC]: "Hanging by the hatch is a white, form-fitting therma suit.",
    [P.ACTION]: whiteSuitF,
  },
});

export function whiteSuitF(): any {
  if (verbIs(V.TAKE_OFF) && eq(G.here, IN_SPACE)) {
    queue(iChill, -1);
    return false;
  } else if (verbIs(V.PUT_ON) && hasFlag(G.prsi, ACTORBIT)) {
    return wastes();
  }
  return false;
}

defineObject(HATCH, 190, {
  in: LOCAL_GLOBALS,
  desc: "hatch",
  synonym: ["HATCH", "HATCHWAY", "DOOR"],
  flags: [DOORBIT],
});

defineObject(IN_SPACE, 191, {
  in: ROOMS,
  desc: "In Space",
  flags: [ONBIT],
  global: [HATCH, ODOR, BATTLESHIP, PASSENGER_SHIP],
  things: [
    { adjective: "THORBAST", noun: "SUIT", action: thorbastSuitF },
    { adjective: "BLACK", noun: "SUIT", action: thorbastSuitF },
  ],
  exits: {
    SOUTH: toIfOpen(AT_MAIN_HATCH, HATCH),
    NORTH: per(spaceYachtEnterF),
  },
  props: {
    [P.ODOR]: "garlic",
    [P.ODOR_NUMBER]: 5,
    [P.ACTION]: inSpaceF,
  },
});

export function spaceYachtEnterF(): any {
  if (isIn(THORBAST, G.here)) {
    doFirst("get past your opponent");
    return false;
  } else if (eq(G.spaceshipSceneStatus, 1)) {
    tell(CANT_GO);
    return false;
  } else {
    return SPACE_YACHT;
  }
}

export function inSpaceF(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    dequeue(iPassengerShipDeparts);
    G.chillCounter = 0;
    queue(iChill, -1);
    thisIsIt(YOUNG_WOMAN);
    thisIsIt(BEM);
    thisIsIt(THORBAST);
    if (eq(G.spaceshipSceneStatus, 0)) {
      remove(BEM);
      remove(YOUNG_WOMAN);
      remove(THORBAST);
      G.thorbastAttacked = false;
      G.fightCounter = 0;
      G.disarmProb = 0;
      G.freeMoveCounter = 0;
      setFlag(SWORD, NARTICLEBIT);
      clearFlag(IN_SPACE, MUNGBIT);
      putp(SWORD, P.SDESC, "your sword");
      queue(iFight, -1);
      G.bemCounter = 0;
      return queue(iBem, -1);
    }
    return false;
  } else if (eq(rarg, M_LOOK)) {
    tell("You are floating in outer space near a ", PD(BATTLESHIP), " (to the \"south\")");
    if (!eq(G.spaceshipSceneStatus, 1)) {
      tell(" and", A(PASSENGER_SHIP), " (to the \"north\")");
    }
    tell(". ", BATTLESHIP_DESC, " Saturn looms above (below?) you, her rings sparkling in the sunlight.");
    return true;
  } else if (eq(rarg, M_SMELL)) {
    tell("The rumors that ", D(THORBAST), " enjoys munching on hunks of raw garlic seem to be true. Let's hope ");
    heShe();
    tell(" doesn't talk anymore.");
    return true;
  }
  return false;
}

defineObject(BATTLESHIP, 192, {
  in: LOCAL_GLOBALS,
  desc: "battleship",
  synonym: ["BATTLE", "SPACESHIP", "FLAGSHIP", "SHIP"],
  adjective: ["BATTLE", "LONG", "LARGE", "SPACE", "FLAG"],
  props: {
    [P.GENERIC]: genericShipF,
    [P.ACTION]: battleshipF,
  },
});

export function battleshipF(): any {
  if (verbIs(V.EXAMINE)) {
    tell(BATTLESHIP_DESC);
    crlf();
    return true;
  } else if (verbIs(V.ENTER, V.BOARD, V.WALK_TO)) {
    if (eq(G.here, IN_SPACE)) {
      return doWalk(P.SOUTH);
    } else if (isGlobalIn(BATTLESHIP, G.here)) {
      tell(LOOK_AROUND);
      return true;
    }
    return false;
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    if (eq(G.here, AT_MAIN_HATCH)) {
      return doWalk(P.NORTH);
    } else if (eq(G.here, IN_SPACE)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      tell(CANT_FROM_HERE);
      return true;
    }
  }
  return false;
}

defineObject(PASSENGER_SHIP, 193, {
  in: LOCAL_GLOBALS,
  desc: "small passenger spaceship",
  synonym: ["SPACESHIP", "SHIP", "YACHT"],
  adjective: ["SPACE", "PASSENGER", "SMALL"],
  props: {
    [P.GENERIC]: genericShipF,
    [P.ACTION]: passengerShipF,
  },
});

export function passengerShipF(): any {
  if (eq(G.spaceshipSceneStatus, 1)) {
    return cantSee(PASSENGER_SHIP);
  } else if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, IN_SPACE)) {
      return doWalk(P.NORTH);
    } else if (eq(G.here, SPACE_YACHT)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      tell(CANT_FROM_HERE);
      return true;
    }
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    if (eq(G.here, SPACE_YACHT)) {
      return doWalk(P.SOUTH);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

export function genericShipF(): any {
  if (eq(G.spaceshipSceneStatus, 1)) {
    return BATTLESHIP;
  } else {
    return false;
  }
}

export function iChill(): any {
  G.chillCounter = G.chillCounter + 1;
  if (!eq(G.here, IN_SPACE) || hasFlag(WHITE_SUIT, WORNBIT)) {
    G.chillCounter = 0;
    dequeue(iChill);
    return false;
  }
  tell("   ");
  if (eq(G.chillCounter, 1)) {
    tell("It sure gets chilly this far from the sun!\n");
    return true;
  } else if (eq(G.chillCounter, 2, 3)) {
    tell("You're becoming frigid.\n");
    return true;
  } else {
    return jigsUp("Oops! You've frozen to death!");
  }
}

G.chillCounter = 0;

G.thorbastAttacked = false;

G.fightCounter = 0;

G.freeMoveCounter = 0;

G.disarmProb = 0;

G.bemCounter = 0;

export function iBem(): any {
  G.bemCounter = G.bemCounter + 1;
  if (!eq(G.here, IN_SPACE)) {
    if (eq(G.bemCounter, 12)) {
      G.spaceshipSceneStatus = 3;
      dequeue(iBem);
      remove(BEM);
      remove(YOUNG_WOMAN);
    }
    return false;
  } else if (eq(G.bemCounter, 1)) {
    return false;
  }
  tell("   ");
  if (eq(G.bemCounter, 2)) {
    move(BEM, G.here);
    tell("A ", PD(BEM), ", sort of a cross between a space squid and a humanoid tree, swims into view. Its hideous \"bark\" is covered with squirmy little suckers, and its branches wave about like tentacles. It takes one look around and heads straight towards the defenseless ", D(YOUNG_WOMAN), PERIOD_CR);
    return true;
  } else if (eq(G.bemCounter, 3)) {
    tell("The alien monstrosity reaches the ", D(YOUNG_WOMAN), ", and its tentacles begin undulating toward ");
    herHis();
    tell(" clothing.\n");
    return true;
  } else if (eq(G.bemCounter, 12)) {
    G.followFlag = 4;
    queue(iFollow, 2);
    remove(BEM);
    remove(YOUNG_WOMAN);
    dequeue(iBem);
    G.spaceshipSceneStatus = 3;
    tell("The tree-squid finishes disrobing and untying the frenzied ", D(YOUNG_WOMAN), ". Wrapping a suckered tentacle around ");
    herHis();
    tell(" midsection, it swims away. You hear a shriek from the void, which slowly fades.\n");
    return true;
  } else {
    tell("The monster ");
    beginContinue();
    tell("undress the poor ", D(YOUNG_WOMAN), ", who ");
    beginContinue();
    tell("shriek in terror.\n");
    return true;
  }
}

export function beginContinue(): any {
  if (eq(G.bemCounter, 4)) {
    tell("begin");
  } else {
    tell("continue");
  }
  tell("s to ");
  return true;
}

export function iFight(): any {
  G.fightCounter = G.fightCounter + 1;
  if (!eq(G.here, IN_SPACE)) {
    queue(iPassengerShipDeparts, 6);
    dequeue(iFight);
    return false;
  } else if (hasFlag(THORBAST, MUNGBIT)) {
    dequeue(iFight);
    return false;
  }
  tell("   ");
  if (eq(G.fightCounter, 1)) {
    move(THORBAST, G.here);
    move(YOUNG_WOMAN, G.here);
    tell("A figure in black, doubtless the same person who tossed the grenade into the hold, is near the smaller ship. Given ");
    hisHer();
    tell(" mean expression and characteristic black outfit, it must be ", D(THORBAST), ", the Chief Assassin for ", PD(LGOP), ".\n   ", D(THORBAST), " is struggling with a ", D(YOUNG_WOMAN), " of wealthy garb and demeanor. Noticing you, ");
    heShe();
    tell(" straps the ");
    if (G.male) {
      tell("wo");
    }
    tell("man to the hull of", T(PASSENGER_SHIP), " and jumps toward you, stopping just a few feet away.\n   With a chillingly evil grin, ");
    heShe();
    tell(" draws a long, pointed sword.");
    if (!hasFlag(THORBAST, TOUCHBIT)) {
      setFlag(THORBAST, TOUCHBIT);
      tell(" \"Ah, the escaped prisoner. Disposing of you will be a small but enjoyable feather in my cap.\"");
      if (!hasFlag(NOSE, MUNGBIT)) {
        tell(" As ");
        heShe();
        tell(" speaks, a foul odor wafts toward you.");
      }
    }
    crlf();
  } else if (!isIn(THORBAST_SWORD, THORBAST)) {
    G.fightCounter = G.fightCounter - 1;
    tell(D(THORBAST), " eyes you warily.\n");
  } else if (G.fightCounter > 1 && !G.thorbastAttacked) {
    tell(D(THORBAST), " takes advantage of your inactivity and ");
    if (eq(G.freeMoveCounter, 2)) {
      shishkabob();
    } else {
      G.freeMoveCounter = G.freeMoveCounter + 1;
      tell("launches a fierce attack. You dodge, avoiding the blade more by luck than by skill.\n");
    }
  } else if (prob(G.disarmProb)) {
    G.disarmProb = 0;
    move(THORBAST_SWORD, G.here);
    setFlag(THORBAST_SWORD, TAKEBIT);
    clearFlag(THORBAST_SWORD, NDESCBIT);
    thisIsIt(THORBAST_SWORD);
    tell(D(THORBAST), " feints backward and then launches a blow straight at your neck! Moving with a speed rarely associated with anything besides self-preservation, you parry, knocking the sword out of ", D(THORBAST), "'s hands! It drifts toward you, spinning slowly.\n");
  } else if (G.fightCounter > 24) {
    tell("Fatigue overcomes you. ", D(THORBAST), ", exhibiting more stamina, ");
    shishkabob();
  } else {
    if (eq(G.fightCounter, 6, 12, 18)) {
      tell("Your strength ");
      if (!hasFlag(IN_SPACE, MUNGBIT)) {
        setFlag(IN_SPACE, MUNGBIT);
        tell("begin");
      } else {
        tell("continue");
      }
      tell("s to ebb. ");
    }
    G.disarmProb = G.disarmProb + 12;
    if (prob(33)) {
      tell(D(THORBAST), "'s blade whirls invisibly toward you. Ducking, you feel the blade whiz by an inch above ", PD(HEAD), "!");
    } else if (prob(50)) {
      tell("You fend off a volley of powerful blows, leaving you dizzy.");
    } else {
      tell(D(THORBAST), " lunges at your chest, but your own blade knocks ");
      hisHer();
      tell(" away in the nick of time.");
    }
    crlf();
  }
  G.thorbastAttacked = false;
  return true;
}

export function shishkabob(): any {
  return jigsUp("turns you into a human shish kabob.");
}

defineObject(THORBAST, 194, {
  synonym: ["THORBAST", "ASSASSIN", "FIGURE"],
  adjective: ["CHIEF", "SHADOWY"],
  flags: [ACTORBIT, CONTBIT, SEARCHBIT, OPENBIT, NARTICLEBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "get past the monster",
    [P.DESCFCN]: thorbastF,
    [P.ACTION]: thorbastF,
  },
});

export function thorbastF(oarg: any = false): any {
  if (oarg) {
    if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    if (!verbIs(V.EXAMINE)) {
      tell("   ");
    }
    tell("Chief Assassin ", D(THORBAST), " floats before you, ");
    hisHer();
    tell(" black-garbed body almost invisible against the backdrop of space. ");
    heShe(true);
    tell(" is ");
    if (isIn(THORBAST_SWORD, THORBAST)) {
      tell("brandishing a deadly-looking sword.");
      return true;
    } else {
      tell("tensed, as though ready to strike like a snake.");
      return true;
    }
  } else if (eq(THORBAST, G.winner)) {
    if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"Just the name is enough to psych out a wimp like you. In fact, they simply liked the initials L.G.O.P. and ", PD(LGOP), " was the first thing they thought of.\"\n");
      return true;
    } else {
      tell(D(THORBAST), " ignores you, although ");
      hisHer();
      tell(" evil grin widens a bit.\n");
      return stop();
    }
  } else if (verbIs(V.FOLLOW)) {
    if (eq(G.followFlag, 7)) {
      tell(DONT_WANT_TO);
      return true;
    } else if (eq(G.followFlag, 12)) {
      return doWalk(P.SW);
    }
    return false;
  } else if (verbIs(V.WALK_AROUND, V.LEAP)) {
    tell(D(THORBAST), ", who's nobody's fool, keeps you in front of ");
    himHer();
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.GIVE) && prsoIs(SWORD)) {
    tell(D(THORBAST));
    tell(", delighted by your gift, ");
    return shishkabob();
  } else if (verbIs(V.KILL, V.CUT)) {
    if (playerCantSee()) {
      return true;
    } else if (!G.prsi) {
      if (isIn(SWORD, PROTAGONIST) || isIn(THORBAST_SWORD, PROTAGONIST)) {
        G.prsi = SWORD;
        tell("[with the sword]\n");
      } else {
        G.prsi = HANDS;
      }
    }
    if (prsiIs(SWORD, THORBAST_SWORD)) {
      move(G.prsi, PROTAGONIST);
      G.thorbastAttacked = true;
      if (isIn(THORBAST_SWORD, THORBAST)) {
        if (prob(25)) {
          tell("Your sword misses ", D(THORBAST), " by inches!");
        } else if (prob(33)) {
          tell("You nick ", D(THORBAST), " on the arm, drawing blood!");
        } else if (prob(50)) {
          tell("With a clang of steel, your sword smashes against ", D(THORBAST), "'s!");
        } else {
          tell("A mighty swing, but ", D(THORBAST), " easily dodges in this light gravity.");
        }
        crlf();
        return true;
      } else {
        tell(D(THORBAST), " somersaults in a neat circle, easily avoiding your thrust and ending up back in front of you. Further proof of ", D(THORBAST), "'s uncanny ");
        if (isVisible(THORBAST_SWORD)) {
          tell("agility");
        } else {
          tell("legerdemain");
        }
        move(THORBAST_SWORD, THORBAST);
        setFlag(THORBAST_SWORD, NDESCBIT);
        clearFlag(THORBAST_SWORD, TAKEBIT);
        tell(": ");
        heShe();
        tell(" is again holding", TR(THORBAST_SWORD));
        return true;
      }
    } else {
      tell(YOU_CANT, "expect to kill a tough g");
      if (G.male) {
        tell("uy");
      } else {
        tell("al");
      }
      tell(" like ", D(THORBAST), " with", AR(G.prsi));
      return true;
    }
  } else if (verbIs(V.GIVE) && prsoIs(THORBAST_SWORD)) {
    G.spaceshipSceneStatus = 2;
    remove(THORBAST);
    remove(THORBAST_SWORD);
    G.followFlag = 7;
    queue(iFollow, 2);
    dequeue(iFight);
    setFlag(THORBAST, MUNGBIT);
    tell("As ", D(THORBAST), " accepts the sword, ");
    incrementScore(5, 15);
    heShe();
    tell(" realizes that such a gesture is the final proof that you are the good guy, and therefore ");
    heShe();
    tell(" hasn't got a chance of winning. Being a practical person, ", D(THORBAST), " saves both of you a lot of time and aggravation by goring ");
    himHer();
    tell("self on ");
    hisHer();
    tell(" own blade. Spewing droplets of blood, ");
    hisHer();
    tell(" body drifts away into the blackness of space.\n");
    return M_FATAL;
  } else if (verbIs(V.SMELL)) {
    performPrsa(ODOR);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    thorbastF(M_OBJDESC);
    crlf();
    return true;
  }
  return false;
}

export function thorbastSuitF(): any {
  if (verbIs(V.TAKE, V.TAKE_OFF)) {
    return impossibles();
  }
  return false;
}

defineObject(THORBAST_SWORD, 195, {
  in: THORBAST,
  synonym: ["SWORD", "SWORDS", "BLADE"],
  adjective: ["THORBAST", "ASSASSIN", "HIS", "HER", "LONG", "POINTED"],
  flags: [NARTICLEBIT, NDESCBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "get past the monster",
    [P.ACTION]: thorbastSwordF,
  },
});

export function thorbastSwordF(): any {
  if (verbIs(V.RETURN) && !G.prsi && isIn(THORBAST, G.here)) {
    perform(V.GIVE, THORBAST_SWORD, THORBAST);
    return true;
  }
  return false;
}

defineObject(YOUNG_WOMAN, 196, {
  synonym: ["WOMAN", "MAN", "ELYSIA", "ELYSIUM"],
  adjective: ["YOUNG"],
  flags: [ACTORBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "get past the monster",
    [P.DESCFCN]: youngWomanF,
    [P.ACTION]: youngWomanF,
  },
});

export function youngWomanF(oarg: any): any {
  if (oarg) {
    if (eq(G.here, IN_SPACE)) {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      tell("   A ", D(YOUNG_WOMAN), " of refined bearing");
      return describeYoungWoman();
    } else {
      return false;
    }
  } else if (G.male && nounUsed(W.MAN, YOUNG_WOMAN) || !G.male && nounUsed(W.WOMAN, YOUNG_WOMAN)) {
    if (prsoIs(YOUNG_WOMAN)) {
      performPrsa(MAN_WOMAN, G.prsi);
      return true;
    } else {
      performPrsa(G.prso, MAN_WOMAN);
      return true;
    }
  } else if (eq(YOUNG_WOMAN, G.winner)) {
    if (isIn(BEM, G.here) && verbIs(V.SHUT_UP) && prsoIs(ROOMS)) {
      tell("You might as well tell the stars not to shine.\n");
    } else if (isIn(BEM, G.here)) {
      tell("The ", D(YOUNG_WOMAN), " is too busy screaming to reply.\n");
    } else if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"They've built up a real interplanetary rep for debauchery, but actually they're just plain Kansas girls -- a group of sisters from Wichita, the daughters of Gus and Elmira Leather.\"\n");
    } else {
      tell("The ", D(YOUNG_WOMAN), " blinks shyly, but says nothing.\n");
    }
    return stop();
  } else if (isTouching(YOUNG_WOMAN) && isIn(THORBAST, G.here)) {
    perform(V.KILL, BEM);
    return true;
  } else if (verbIs(V.EXAMINE) && eq(G.here, IN_SPACE)) {
    tell("The ", D(YOUNG_WOMAN));
    describeYoungWoman();
    crlf();
    return true;
  } else if (verbIs(V.FOLLOW)) {
    if (eq(G.followFlag, 4)) {
      tell(DONT_WANT_TO);
      return true;
    } else if (eq(G.followFlag, 5)) {
      return doWalk(P.NORTH);
    } else if (eq(G.followFlag, 6)) {
      return doWalk(P.EAST);
    }
    return false;
  } else if (verbIs(V.SAVE_SOMETHING) && eq(G.here, IN_SPACE)) {
    tell("Psst! ");
    if (isIn(BEM, G.here)) {
      tell("Kill", TR(BEM));
      return true;
    } else {
      tell("Untie", TR(YOUNG_WOMAN));
      return true;
    }
  } else if (verbIs(V.UNTIE) && eq(G.here, IN_SPACE)) {
    if (isIn(THORBAST, G.here)) {
      perform(V.TOUCH, YOUNG_WOMAN);
      return true;
    } else if (isIn(BEM, G.here)) {
      return doFirst("get past the monster");
    } else {
      move(YOUNG_WOMAN, SPACE_YACHT);
      G.followFlag = 5;
      queue(iFollow, 2);
      tell("You untie", T(YOUNG_WOMAN), " who, beckoning you to follow, enters", TR(PASSENGER_SHIP));
      return true;
    }
  } else if (verbIs(V.TOUCH, V.FUCK, V.KISS, V.EAT) && eq(G.here, IN_SPACE) && !eq(G.naughtyLevel, 0)) {
    return vRape();
  }
  return false;
}

export function describeYoungWoman(): any {
  tell(" is tied to the hull of the ", PD(PASSENGER_SHIP), ". ");
  herHis(true);
  tell(" elegantly expensive tunic is torn, exposing delicate white skin.");
  if (isIn(BEM, G.here)) {
    tell(" A ", PD(BEM), " is attacking", T(YOUNG_WOMAN), ", who is understandably screaming at the top of ");
    herHis();
    tell(" lungs.");
  }
  return true;
}

defineObject(BEM, 197, {
  desc: "bug-eyed monster",
  synonym: ["MONSTER", "TREE", "TREE-", "SQUID"],
  adjective: ["BUG", "EYED", "BUG-EYED", "HUMANOID", "ALIEN", "TENTAC"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: bemF,
  },
});

export function bemF(): any {
  if (isTouching(BEM)) {
    if (isIn(THORBAST, G.here)) {
      return doWalk(P.NORTH);
    } else {
      remove(BEM);
      dequeue(iBem);
      G.followFlag = 4;
      queue(iFollow, 2);
      G.bemCounter = 12;
      tell("The tree-monster squawks and flees, proving that its bark is worse than its bite.\n");
      return true;
    }
  } else if (verbIs(V.FOLLOW) && eq(G.followFlag, 4)) {
    tell(DONT_WANT_TO);
    return true;
  }
  return false;
}

export function iPassengerShipDeparts(): any {
  if (eq(G.spaceshipSceneStatus, 1)) {
    return false;
  }
  G.spaceshipSceneStatus = 1;
  remove(THORBAST);
  remove(BEM);
  remove(YOUNG_WOMAN);
  dequeue(iBem);
  if (isIn(THORBAST_SWORD, IN_SPACE)) {
    remove(THORBAST_SWORD);
  }
  if (!isInSpace()) {
    return false;
  }
  tell("   A rumbling from outside the ship sends shivers running through the deck.");
  if (eq(G.here, HOLD) || eq(G.here, AT_MAIN_HATCH) && hasFlag(HATCH, OPENBIT)) {
    tell(" Through the ");
    if (eq(G.here, HOLD)) {
      tell("viewport");
    } else {
      tell("hatchway");
    }
    tell(", you see", T(PASSENGER_SHIP), " roaring away on a tail of ion flame!");
  }
  crlf();
  return true;
}

defineObject(SPACE_YACHT, 198, {
  in: ROOMS,
  desc: "Space Yacht",
  flags: [ONBIT, RLANDBIT, INDOORSBIT],
  global: [PASSENGER_SHIP],
  exits: {
    SOUTH: to(IN_SPACE),
    OUT: to(IN_SPACE),
    EAST: per(privateCabinEnterF),
    IN: per(privateCabinEnterF),
  },
  props: {
    [P.LDESC]: "This is the main cabin of a fashionable passenger ship, with exits to the \"east\" and \"south.\"",
    [P.ACTION]: spaceYachtF,
  },
});

export function spaceYachtF(rarg: any): any {
  if (eq(rarg, M_END) && isIn(YOUNG_WOMAN, G.here)) {
    G.followFlag = 6;
    queue(iFollow, 2);
    remove(YOUNG_WOMAN);
    clearFlag(PRIVATE_CABIN_DOOR, LOCKEDBIT);
    move(PHOTO, PROTAGONIST);
    incrementScore(17, 13, true);
    tell("   The ", D(YOUNG_WOMAN), " turns to you. \"I am called Elysi");
    if (G.male) {
      tell("a");
    } else {
      tell("um");
    }
    tell("; my ");
    if (G.male) {
      tell("fa");
    } else {
      tell("mo");
    }
    tell("ther is the wealthiest ");
    if (!G.male) {
      tell("wo");
    }
    tell("man in the system. You will be grandly rewarded for saving me from that horrid kidnapper.\"\n   ");
    sheHe(true);
    tell(" grabs a photo off the wall, scribbles on the back of it, and hands it to you. \"Here is ");
    if (G.male) {
      tell("fa");
    } else {
      tell("mo");
    }
    tell("ther's address; see ");
    himHer();
    tell(" the next time you're on Ganymede, and you will be handsomely repaid. But now, I must retire to my cabin to recover from this hideous ordeal.\" ");
    if (G.male) {
      tell("She curtsie");
    } else {
      tell("He bow");
    }
    tell("s, a bit unsteadily, and exits to the east, closing the door behind ");
    herHim();
    tell(PERIOD_CR);
    return true;
  }
  return false;
}

defineObject(PRIVATE_CABIN_DOOR, 199, {
  in: SPACE_YACHT,
  desc: "door",
  synonym: ["DOOR"],
  flags: [NDESCBIT, DOORBIT, LOCKEDBIT],
  props: {
    [P.ACTION]: privateCabinDoorF,
  },
});

export function privateCabinDoorF(): any {
  if (verbIs(V.KNOCK) && !isIn(YOUNG_WOMAN, IN_SPACE) && !eq(G.spaceshipSceneStatus, 3)) {
    tell("\"Please leave me to rest!\"");
    if (!hasFlag(PRIVATE_CABIN_DOOR, LOCKEDBIT)) {
      setFlag(PRIVATE_CABIN_DOOR, LOCKEDBIT);
      if (hasFlag(PRIVATE_CABIN_DOOR, OPENBIT)) {
        clearFlag(PRIVATE_CABIN_DOOR, OPENBIT);
        tell(" The door closes and y");
      } else {
        tell(" Y");
      }
      tell("ou hear a click as the door is locked.");
    }
    crlf();
    return true;
  }
  return false;
}

export function privateCabinEnterF(): any {
  if (hasFlag(PRIVATE_CABIN_DOOR, OPENBIT)) {
    clearFlag(PRIVATE_CABIN_DOOR, OPENBIT);
    setFlag(PRIVATE_CABIN_DOOR, LOCKEDBIT);
    tell("Private Cabin\n   You have entered a plush sleeping cabin. The ", D(YOUNG_WOMAN), " is standing in the center of the cabin, clutching ");
    herHis();
    tell(" clothes, looking shocked to see you.");
    if (eq(G.naughtyLevel, 0)) {
      tell(" Naturally, you apologize and beat a hasty retreat.");
    } else {
      tell("\n   \"How dare you come in here without knocking! Am I to be allowed no privacy at all? Will my horror never end? Will...\" ");
      sheHe(true);
      tell(" trails off and, as the multiple shocks of the day set in, begins sobbing. Moved, you take ");
      herHim();
      tell(" in your arms.");
      if (eq(G.naughtyLevel, 1)) {
        tell(" One thing leads to another...");
      } else {
        tell("\n   You dry ");
        herHis();
        tell(" tears, and as your bodies press closer, hysteria slowly turns to lust. You tenderly lead Elysi");
        if (G.male) {
          tell("a");
        } else {
          tell("um");
        }
        tell(" to the bed, and within seconds, your bodies lock together in slow rhythm.\n   After a series of spectacular climaxes, Elysi");
        if (G.male) {
          tell("a");
        } else {
          tell("um");
        }
        tell(" is struck with an idea. \"Would ... would you like to tie me up? It really turns me on...\"");
      }
      tell("\n   Much, much later, making sure that Elysi");
      if (G.male) {
        tell("a");
      } else {
        tell("um");
      }
      tell(" is sleeping peacefully, you tiptoe out of the cabin, closing the door.");
    }
    crlf();
    crlf();
    describeRoom();
  } else {
    thisIsIt(PRIVATE_CABIN_DOOR);
    doFirst("open", PRIVATE_CABIN_DOOR);
  }
  return false;
}

defineObject(PHOTO, 200, {
  synonym: ["PHOTO", "PICTURE", "HARLOW", "FAIRBANKS"],
  adjective: ["JEAN", "DOUGLAS", "PHOO", "ADDRESS"],
  flags: [TAKEBIT, BURNBIT, READBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "phoo",
    [P.NO_T_DESC]: "phoo",
    [P.SIZE]: 3,
    [P.ACTION]: photoF,
  },
});

export function photoF(): any {
  if (hasFlag(PHOTO, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.READ)) {
    tell("  \"Elysi");
    if (G.male) {
      tell("a's Dadd");
    } else {
      tell("um's Momm");
    }
    tell("y\n   The Big House With All The Windows\n   Ganymede\"\n");
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("It is a ", D(PHOTO), " with writing on the back:\n");
    perform(V.READ, PHOTO);
    return true;
  }
  return false;
}
