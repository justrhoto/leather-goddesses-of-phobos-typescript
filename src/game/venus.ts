// venus.ts — from VENUS.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  blocked, defineObject, per, to, toIfOpen,
} from "../engine/define.ts";
import {
  A, D, PD, T, TR, clearFlag, crlf, eq, first, get, getp, hasFlag, isIn, loc, move, printd, put, putp,
  remove, setFlag, tell,
} from "../engine/runtime.ts";
import {
  ltable, table,
} from "../engine/table.ts";
import {
  describeTrellisOnHole, undoTrap,
} from "./cleveland.ts";
import {
  andSidekick, cantReach, doFirst, eagerlyAccepts, hisHer, incrementScore, isTouching, noLid, nounUsed,
  nowTied, openClosed, openEyesAndRemoveHands, wee,
} from "./globals.ts";
import {
  circleIsntBlack, iIonDeath, iTorch,
} from "./mars.ts";
import {
  dequeue, isQueued, perform, performPrsa, pickOne, queue,
} from "./misc.ts";
import {
  P_ADJW, P_NAMW, thisIsIt,
} from "./parser.ts";
import {
  genericMachineF, genericSidekickF,
} from "./phobos.ts";
import {
  describeRoom, doWalk, goto, hoHum, iFollow, isGlobalIn, isUltimatelyIn, isVisible, jigsUp,
  normalSidekickFollow, rob, stop, vLeap, vLook, wastes, yuks,
} from "./verbs.ts";
import {
  ACTORBIT, ALREADY_IS, BABY, BACK_DOOR, BACK_DOOR_OBJECT, BOOTH_OBJECT, CAGE, CANAL, CANAL_OBJECT,
  CANT_FROM_HERE, CHOCOLATE, CLEARING, COIN_RETURN_BOX, COIN_RETURN_KNOB, CONTBIT, CREAM, DONT_WANT_TO,
  DOORBIT, EIGHTY_TWO_DEGREE_ANGLE, ELLIPSIS, EVOLVED, FEMALEBIT, FEMALE_GORILLA, FIRST_SLAB,
  FLASHLIGHT, FLEXIBLE_HOLE, FLYTRAP, FORK_OF_SORTS, FRONT_DOOR, FRONT_DOOR_OBJECT, G,
  GORILLA_ATE_CHOCOLATE, GROUND, HANDS, HANDSET, HOLD, HOLE, HOUSE, HUH, INBIT, INDOORSBIT, IN_SPACE,
  JUNGLE, LABORATORY, LEAVES, LGOP, LOCAL_GLOBALS, LOCKEDBIT, LOOKS_CAN_BE_DECEIVING, LOOK_AROUND,
  MAD_SCIENTIST, MALE_GORILLA, ME, MITRE, MUNGBIT, M_END, M_ENTER, M_FATAL, M_LOOK, M_OBJDESC_Q,
  NARTICLEBIT, NDESCBIT, NOTHING_HAPPENS, NOTHING_NEW, ODD_MACHINE, ONBIT, ONE_MARSMID_COIN,
  ONLY_BLACKNESS, ONLY_ONE_THING_IN_COMPARTMENT, OOZY_WITH_SLIME, OPENBIT, P, PART_OF_VIZICOMM,
  PERIOD_CR, PILE_OF_ANGLES, PLURALBIT, POWER_SWITCH, POWER_TRANSMITTER, PROTAGONIST, RABBIT, READBIT,
  RLANDBIT, ROCKY_CLIFFTOP, ROOMS, ROYAL_DOCKS, RUBBER_HOSE, SALESMAN, SEARCHBIT, SECOND_SLAB,
  SENILITY_STRIKES, SIDEKICK, SIDEKICKS_BODY, SIGN, SMELLEDBIT, SPAWNING_GROUND, SPREAD_APART, STAIN,
  STAIRS, SURFACEBIT, TAKEBIT, TEN_MARSMID_COIN, THETA, THRONE_ROOM, TORCH, TOUCHBIT, TREE, TREE_HOLE,
  TRELLIS, TRELLIS_TOO_WIDE, TRYTAKEBIT, TUBE, UNTEEDBIT, V, VEHBIT, VENUS, VIZICOMM, VIZICOMM_BOOTH,
  VIZICOMM_DESC, VOWELBIT, W, WATER, WEARBIT, WIDE_CELL_DOOR, YECHH, YOULL_HAVE_TO, YOUR_BODY,
  YOU_CANT, prsiIs, prsoIs, verbIs,
} from "./world.ts";

defineObject(VENUS, 131, {
  in: LOCAL_GLOBALS,
  desc: "Venus",
  synonym: ["VENUS"],
  flags: [NARTICLEBIT],
  props: {
    [P.ACTION]: venusF,
  },
});

export function venusF(): any {
  if (verbIs(V.EXAMINE)) {
    return vLook();
  } else if (verbIs(V.LEAVE, V.DISEMBARK, V.EXIT)) {
    tell("How?\n");
    return true;
  }
  return false;
}

defineObject(JUNGLE, 132, {
  in: ROOMS,
  desc: "Jungle",
  flags: [RLANDBIT, ONBIT],
  global: [TREE, VENUS],
  exits: {
    EAST: to(FORK_OF_SORTS),
    WEST: per(passFlytrapF),
  },
  props: {
    [P.ACTION]: jungleF,
  },
});

export function jungleF(rarg: any): any {
  if (eq(rarg, M_ENTER) && isIn(FLYTRAP, G.here)) {
    return queue(iFlytrap, -1);
  } else if (eq(rarg, M_LOOK)) {
    tell("You are surrounded by hot, steamy, primitive rain forest. Judging by the overpowering heat, the excessive humidity, and ");
    if (isIn(FLYTRAP, G.here)) {
      tell("especially by the gigantic ", PD(FLYTRAP), " sidling your way, ");
    } else {
      tell("the odd flora, ");
    }
    tell("you must be in the death-clogged jungles of Venus.\n   A path runs east-west through the jungle");
    if (isIn(FLYTRAP, G.here)) {
      tell(", but don't even think about going west unless you love wading into four tons of ");
      if (!G.male) {
        tell("wo");
      }
      tell("man-eating lettuce");
    }
    tell(".");
    return true;
  }
  return false;
}

export function passFlytrapF(): any {
  if (isIn(FLYTRAP, G.here)) {
    tell("Despite being warned, you walk right into the orifice of the ", PD(FLYTRAP), ". ");
    return flytrapDeath();
  } else if (eq(G.here, JUNGLE)) {
    return SPAWNING_GROUND;
  } else {
    return JUNGLE;
  }
}

export function flytrapDeath(): any {
  tell("A little known fact about ", PD(FLYTRAP), "s: they secrete an enzyme which stimulates the pleasure centers of their victim. Hence, you experience ");
  if (eq(G.naughtyLevel, 0)) {
    tell("a feeling similar to eating a really good hot fudge sundae");
  } else {
    tell("multiple orgasms");
  }
  return jigsUp(" as your flesh is quietly dissolved away. What a way to go.");
}

defineObject(FLYTRAP, 133, {
  in: JUNGLE,
  desc: "Venus flytrap",
  synonym: ["FLYTRAP", "LETTUCE"],
  adjective: ["VENUS", "LARGE"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: flytrapF,
  },
});

export function flytrapF(): any {
  if (verbIs(V.EXAMINE)) {
    tell("It looks just like the Terrestrial variety -- except that ", PD(FLYTRAP), "s on Earth", EVOLVED, "n ounce, and Venusian ", PD(FLYTRAP), "s", EVOLVED, " ton. Oh, one other thing. Terrestrial ", PD(FLYTRAP), "s don't usually stalk their prey.\n");
    return true;
  } else if (verbIs(V.FOLLOW)) {
    if (eq(G.followFlag, 9)) {
      return doWalk(P.WEST);
    } else if (eq(G.followFlag, 10)) {
      perform(V.DISEMBARK, TREE_HOLE);
      return true;
    } else if (eq(G.followFlag, 11)) {
      perform(V.ENTER, TREE_HOLE);
      return true;
    }
    return false;
  } else if (isTouching(FLYTRAP)) {
    tell("You don't want to get that close to the flytrap -- and it has nothing to do with its breath.\n");
    return true;
  }
  return false;
}

G.flytrapCounter = 0;

G.tooLate = false;

export function iFlytrap(): any {
  G.flytrapCounter = G.flytrapCounter + 1;
  tell("   ");
  if (!isIn(FLYTRAP, G.here)) {
    G.flytrapCounter = 0;
    if (eq(G.here, CLEARING)) {
      if (G.leavesPlaced && !G.tooLate) {
        trapFlytrap();
        tell("You hear a crash from the west");
      } else {
        move(FLYTRAP, JUNGLE);
        G.tooLate = false;
        dequeue(iFlytrap);
        G.followFlag = 9;
        queue(iFollow, 2);
        tell("Holy tropism! The ", PD(FLYTRAP), " loses interest in you and crawls away");
      }
      tell(PERIOD_CR);
      return true;
    } else {
      move(FLYTRAP, G.here);
      if (!G.leavesPlaced) {
        G.tooLate = true;
      }
      tell("As", T(FLYTRAP), " scurries along, you dash to the eastern side of the hole in order to be as far from it as possible.\n");
      return true;
    }
  } else if (isIn(PROTAGONIST, TREE_HOLE)) {
    move(FLYTRAP, JUNGLE);
    G.followFlag = 10;
    queue(iFollow, 2);
    G.tooLate = false;
    G.flytrapCounter = 0;
    dequeue(iFlytrap);
    tell("The ", PD(FLYTRAP), " peers down, decides that it's not worth getting trapped for such a measly scrap of meat, and shuffles away.\n");
    return true;
  } else if (eq(G.flytrapCounter, 1) && hasFlag(FLYTRAP, TOUCHBIT) && eq(G.here, JUNGLE)) {
    tell("Flies must be in short supply, because the ", PD(FLYTRAP), " nearby expectantly rustles a few stalks and begins creeping in your direction.\n");
    return true;
  } else if (G.flytrapCounter < 4) {
    setFlag(FLYTRAP, TOUCHBIT);
    tell("The ", PD(FLYTRAP), " sidles ");
    if (eq(G.here, FORK_OF_SORTS) && (!G.leavesPlaced || G.tooLate)) {
      tell("around the hole toward you.\n");
      return true;
    } else {
      tell("closer.\n");
      return true;
    }
  } else if (eq(G.here, FORK_OF_SORTS) && G.leavesPlaced && !G.tooLate) {
    trapFlytrap();
    tell("Never before has splintering wood sounded so sweet or tossed salad looked so lovely. The amazing flying flytrap tumbles into your flytrap trap, covered with leaves and bits of shattered trellis, giving the plant the amusing appearance of a tar-and-feather victim.\n");
    return true;
  } else {
    return flytrapDeath();
  }
}

export function trapFlytrap(): any {
  setFlag(FLYTRAP, MUNGBIT);
  incrementScore(2, 15);
  move(FLYTRAP, TREE_HOLE);
  G.followFlag = 11;
  queue(iFollow, 2);
  rob(TRELLIS, TREE_HOLE);
  remove(TRELLIS);
  clearFlag(FLYTRAP, NDESCBIT);
  undoTrap();
  return dequeue(iFlytrap);
}

defineObject(SPAWNING_GROUND, 134, {
  in: ROOMS,
  desc: "Spawning Ground",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE, VENUS],
  exits: {
    EAST: to(JUNGLE),
  },
  props: {
    [P.HOLE_DESTINATION]: HOLD,
    [P.ACTION]: spawningGroundF,
  },
});

export function spawningGroundF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("As if this hasn't already been a rough enough day, you have stumbled upon a spawning ground for Venusian slime beasts. ", OOZY_WITH_SLIME, " Fortunately, these beasts are still in the earliest (and least deadly) stage. Only one spot is free of slime:", T(HOLE), " near the path to the east.");
    return true;
  }
  return false;
}

defineObject(CREAM, 135, {
  in: SPAWNING_GROUND,
  synonym: ["JAR", "OINTMENT", "LOTION", "CREAM"],
  adjective: ["UNTANG", "UNANGL"],
  flags: [TAKEBIT, READBIT],
  props: {
    [P.SDESC]: "jar of untangling cream",
    [P.NO_T_DESC]: "jar of unangling cream",
    [P.FDESC]: "Inexplicably, sitting next to the circle, untouched by time or slime, is a jar of ointment.",
    [P.SIZE]: 4,
    [P.ACTION]: creamF,
  },
});

export function creamF(): any {
  if (verbIs(V.EXAMINE, V.LOOK_INSIDE)) {
    return examineCreamAndStain();
  } else if (verbIs(V.READ)) {
    tell("The jar is marked \"Un");
    if (!hasFlag(CREAM, UNTEEDBIT)) {
      tell("t");
    }
    tell("angling cream.\"\n");
    return true;
  } else if (verbIs(V.EMPTY) && prsoIs(CREAM)) {
    if (!G.prsi) {
      put(P_NAMW, 1, false);
      G.prsi = GROUND;
    }
    if (hasFlag(CREAM, MUNGBIT)) {
      tell(ALREADY_IS);
      return true;
    } else {
      put(P_NAMW, 0, W.CREAM);
      perform(V.PUT_ON, CREAM, G.prsi);
      return true;
    }
  } else if (verbIs(V.OPEN, V.CLOSE)) {
    return noLid();
  } else if (verbIs(V.EAT)) {
    tell(YECHH);
    return true;
  } else if (verbIs(V.POUR, V.PUT_ON, V.RUB) && prsoIs(CREAM) && !eq(get(P_NAMW, 0), W.JAR, false)) {
    if (hasFlag(CREAM, MUNGBIT)) {
      examineCreamAndStain();
      return true;
    }
    move(CREAM, PROTAGONIST);
    setFlag(CREAM, MUNGBIT);
    tell("As the lotion soaks in,");
    if (hasFlag(CREAM, UNTEEDBIT) && prsiIs(THETA)) {
      move(EIGHTY_TWO_DEGREE_ANGLE, THRONE_ROOM);
      clearFlag(THETA, MUNGBIT);
      clearFlag(THETA, NDESCBIT);
      setFlag(THETA, ACTORBIT);
      setFlag(THETA, FEMALEBIT);
      setFlag(THETA, NARTICLEBIT);
      putp(THETA, P.SDESC, "Princess Theta");
      incrementScore(16, 10, true);
      tell(" the angle slowly transforms into a beautiful princess. Mitre, gushing tears of happiness, cries, \"You have restored my beloved Theta to me!\" He reveals a perfect ", D(EIGHTY_TWO_DEGREE_ANGLE), ". \"I only brushed against it,\" explains the King. \"Please accept it, along with my thanks.\" He reaches out to shake ", PD(HANDS), PERIOD_CR);
      return true;
    } else if (prsiIs(PILE_OF_ANGLES) && hasFlag(CREAM, UNTEEDBIT)) {
      return jigsUp(" the angles return to their former forms: a golden chariot, a velvet tapestry, various fruits, some handcuffs, a flock of ducks ... and a huge hungry tiger.");
    } else if (prsiIs(ME)) {
      tell(" your skin tingles a bit.\n");
      return true;
    } else {
      tell(T(G.prsi), " seem");
      if (!hasFlag(G.prsi, PLURALBIT)) {
        tell("s");
      }
      tell(" unchanged. ");
      if (prsiIs(MITRE) && hasFlag(CREAM, UNTEEDBIT)) {
        tell("(Like fighting a forest fire with a water pistol.)\n");
        return true;
      } else {
        tell("I guess ");
        if (hasFlag(G.prsi, PLURALBIT)) {
          tell("they were");
        } else {
          if (hasFlag(G.prsi, FEMALEBIT)) {
            tell("she");
          } else if (hasFlag(G.prsi, ACTORBIT)) {
            tell("he");
          } else {
            tell("it");
          }
          tell(" was");
        }
        tell("n't very ");
        if (!hasFlag(CREAM, UNTEEDBIT)) {
          tell("t");
        }
        tell("angled.\n");
        return true;
      }
    }
  }
  return false;
}

defineObject(FORK_OF_SORTS, 136, {
  in: ROOMS,
  desc: "Fork, Of Sorts",
  flags: [RLANDBIT, ONBIT],
  global: [TREE, VENUS],
  exits: {
    WEST: per(passFlytrapF),
    EAST: to(CLEARING),
  },
  props: {
    [P.ACTION]: forkOfSortsF,
  },
});

export function forkOfSortsF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !hasFlag(G.here, TOUCHBIT) && !eq(G.verbosity, 0)) {
    tell("A mighty tree rises before you in the center of the path. Suddenly and without warning (as is the nature of the jungle) it dies. Within seconds, the tree is consumed by Venusian hypertermites, which then move off in search of other dead trees, leaving a massive hole in the ground.\n\n");
    return true;
  } else if (eq(rarg, M_LOOK)) {
    tell("This jungle path once split here, went around a mighty tree, and rejoined off to the east. Now, it splits here, goes around a ");
    if (G.leavesPlaced) {
      printd(LEAVES);
    } else {
      tell("mighty hole");
    }
    tell(", and rejoins off to the east.");
    return true;
  }
  return false;
}

G.leavesPlaced = false;

defineObject(TREE_HOLE, 137, {
  in: FORK_OF_SORTS,
  desc: "tree hole",
  synonym: ["HOLE"],
  adjective: ["TREE", "LARGE"],
  flags: [NDESCBIT, CONTBIT, SEARCHBIT, OPENBIT, VEHBIT, INBIT],
  props: {
    [P.CAPACITY]: 200,
    [P.ACTION]: treeHoleF,
  },
});

export function treeHoleF(): any {
  if (verbIs(V.OPEN, V.CLOSE)) {
    tell(HUH);
    return true;
  } else if (verbIs(V.DISEMBARK) && isIn(PROTAGONIST, TREE_HOLE)) {
    tell(YOU_CANT, "climb out. You're trapped.\n");
    return true;
  } else if (verbIs(V.REACH_IN) && isIn(FLYTRAP, TREE_HOLE)) {
    tell("The ", PD(FLYTRAP), " pulls you in. ");
    return flytrapDeath();
  } else if (verbIs(V.BOARD)) {
    if (hasFlag(TRELLIS, MUNGBIT)) {
      tell("The hole's covered.\n");
      return true;
    } else if (isUltimatelyIn(TRELLIS)) {
      tell(TRELLIS_TOO_WIDE);
      return true;
    } else if (isIn(FLYTRAP, TREE_HOLE)) {
      tell("Hey! There's a big, hungry, angry ", PD(FLYTRAP));
      return jigsUp(" down here also!");
    }
    return false;
  } else if (verbIs(V.MEASURE)) {
    tell("The hole is about six feet across.\n");
    return true;
  } else if (verbIs(V.WALK_AROUND)) {
    if (isIn(FLYTRAP, G.here)) {
      tell("You circle the hole completely, with", T(FLYTRAP), " in hot pursuit.\n");
      return true;
    } else {
      return wee();
    }
  } else if (verbIs(V.LOOK_INSIDE) && G.leavesPlaced) {
    perform(V.BOARD, TREE_HOLE);
    return true;
  } else if (verbIs(V.PUT_ON) && prsoIs(LEAVES) && hasFlag(TRELLIS, MUNGBIT)) {
    performPrsa(LEAVES, TRELLIS);
    return true;
  } else if (verbIs(V.EXAMINE) && hasFlag(TRELLIS, MUNGBIT)) {
    describeTrellisOnHole();
    crlf();
    return true;
  } else if (verbIs(V.UNCOVER) && hasFlag(TRELLIS, MUNGBIT)) {
    perform(V.MOVE, TRELLIS);
    return true;
  } else if (verbIs(V.HIDE) && isIn(FLYTRAP, G.here)) {
    perform(V.WALK_AROUND, TREE_HOLE);
    return true;
  }
  return false;
}

defineObject(CLEARING, 138, {
  in: ROOMS,
  desc: "Clearing",
  flags: [RLANDBIT, ONBIT],
  global: [TREE, VENUS],
  exits: {
    NW: per(clearingExitF),
    NE: per(clearingExitF),
    EAST: per(clearingExitF),
    SOUTH: per(clearingExitF),
    WEST: to(FORK_OF_SORTS),
  },
  props: {
    [P.ACTION]: clearingF,
  },
});

export function clearingF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This is a tiny anti-oasis of barrenness amidst the teeming Venusian jungle. Winding paths enter the jungle in most directions.");
    return true;
  }
  return false;
}

export function clearingExitF(): any {
  tell("You walk swiftly down the trail! It turns! It twists! It narrows! Vines grab at your ankles and bird-sized insects close in for a kill! Suddenly", ELLIPSIS);
  if (prsoIs(P.NE)) {
    return FRONT_DOOR;
  } else if (prsoIs(P.NW)) {
    return BACK_DOOR;
  } else {
    describeRoom();
    if (isIn(SIDEKICK, G.here)) {
      normalSidekickFollow();
    }
    return false;
  }
}

defineObject(STAIN, 139, {
  in: CLEARING,
  desc: "can of black stain",
  synonym: ["CAN", "STAIN", "SAIN", "PAINT"],
  adjective: ["BLACK"],
  flags: [TAKEBIT, READBIT],
  props: {
    [P.NO_T_DESC]: "can of black sain",
    [P.ACTION]: stainF,
    [P.TEXT]: "\"MarsCo Brand Black Hyperdimensional Transport Circle Stain.\"",
  },
});

export function stainF(): any {
  if (hasFlag(STAIN, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.EXAMINE, V.LOOK_INSIDE)) {
    return examineCreamAndStain();
  } else if (verbIs(V.APPLY) && isGlobalIn(HOLE, G.here)) {
    return applyStain(HOLE);
  } else if (verbIs(V.EMPTY) && prsoIs(STAIN)) {
    if (hasFlag(STAIN, MUNGBIT)) {
      return examineCreamAndStain();
    } else if (!G.prsi || prsiIs(GROUND, CANAL_OBJECT, WATER, TREE_HOLE)) {
      setFlag(STAIN, MUNGBIT);
      tell("Done. What a waste of good stain!\n");
      return true;
    } else {
      return applyStain(G.prsi);
    }
  } else if (verbIs(V.OPEN, V.CLOSE)) {
    return noLid();
  } else if (verbIs(V.DRINK)) {
    tell(YECHH);
    return true;
  } else if (verbIs(V.POUR) && prsiIs(GROUND, CANAL_OBJECT, WATER, TREE_HOLE)) {
    perform(V.EMPTY, STAIN, GROUND);
    return true;
  } else if (verbIs(V.POUR, V.PUT_ON, V.RUB) && prsoIs(STAIN) && nounUsed(W.STAIN, STAIN)) {
    return applyStain(G.prsi);
  }
  return false;
}

export function applyStain(obj: any): any {
  if (hasFlag(STAIN, MUNGBIT)) {
    G.prso = STAIN;
    return examineCreamAndStain();
  } else if (eq(obj, HOLE)) {
    thisIsIt(HOLE);
    tell("The circle is ");
    if (circleIsntBlack()) {
      G.circleBlack = true;
      setFlag(STAIN, MUNGBIT);
      put(P_ADJW, 0, false);
      put(P_ADJW, 1, false);
      putp(HOLE, P.SDESC, "black circle");
      tell("once again");
    } else {
      tell("already");
    }
    tell(" black!\n");
    return true;
  } else if (eq(obj, FLYTRAP)) {
    perform(V.TOUCH, FLYTRAP);
    return true;
  } else {
    tell("You apply a tiny dab to", T(obj), " but it doesn't stick.\n");
    return true;
  }
}

export function examineCreamAndStain(): any {
  tell("The ", D(G.prso), " is ");
  if (hasFlag(G.prso, MUNGBIT)) {
    tell("empty");
  } else {
    tell("full");
  }
  if (verbIs(V.EXAMINE)) {
    tell(", and has some writing on it");
  }
  tell(PERIOD_CR);
  return true;
}

defineObject(FRONT_DOOR, 140, {
  in: ROOMS,
  desc: "Front Door",
  flags: [RLANDBIT, ONBIT],
  global: [FRONT_DOOR_OBJECT, HOUSE, TREE, VENUS],
  exits: {
    NORTH: toIfOpen(LOOKS_CAN_BE_DECEIVING, FRONT_DOOR_OBJECT),
    IN: toIfOpen(LOOKS_CAN_BE_DECEIVING, FRONT_DOOR_OBJECT),
    SOUTH: to(CLEARING),
    EAST: to(ROCKY_CLIFFTOP),
  },
  props: {
    [P.LDESC]: "To the north: the entrance to a plasticoid house, the only type of structure that lasts more than three minutes in the volatile Venusian biosphere. To the south and east: paths into the jungle.",
  },
});

defineObject(BACK_DOOR, 141, {
  in: ROOMS,
  desc: "Back Door",
  flags: [RLANDBIT, ONBIT],
  global: [BACK_DOOR_OBJECT, HOUSE, TREE, VENUS],
  exits: {
    WEST: to(CLEARING),
    EAST: to(ROCKY_CLIFFTOP),
    SOUTH: toIfOpen(LOOKS_CAN_BE_DECEIVING, BACK_DOOR_OBJECT),
    IN: toIfOpen(LOOKS_CAN_BE_DECEIVING, BACK_DOOR_OBJECT),
  },
  props: {
    [P.LDESC]: "You're near the rear entrance of a house, to the south. Trails enter the jungle to the east and the west.",
    [P.ACTION]: backDoorF,
  },
});

export function backDoorF(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    return queue(iSalesman, -1);
  }
  return false;
}

defineObject(SALESMAN, 142, {
  in: BACK_DOOR,
  desc: "salesman",
  synonym: ["SALESMAN", "MAN"],
  adjective: ["SALES"],
  flags: [ACTORBIT, CONTBIT, OPENBIT],
  props: {
    [P.LDESC]: "An extraordinary number of door-to-door salesmen are camped out here, having been booted away from the front door, but still hopeful of making a sale.",
    [P.ACTION]: salesmanF,
  },
});

export function salesmanF(): any {
  if (eq(SALESMAN, G.winner)) {
    queue(iSalesman, 2);
    if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"I know the ones you mean. Made a fortune in interplanetary shoe and briefcase peddling. They really know the territory.\"\n");
      return true;
    } else {
      tell("\"Let's cut the gab and cut a deal instead!\"\n");
      return stop();
    }
  } else if (verbIs(V.GIVE) && prsiIs(SALESMAN)) {
    if (prsoIs(FLASHLIGHT)) {
      remove(FLASHLIGHT);
      move(ODD_MACHINE, G.here);
      clearFlag(ODD_MACHINE, TRYTAKEBIT);
      remove(SALESMAN);
      G.followFlag = 8;
      queue(iFollow, 2);
      incrementScore(3, 7);
      eagerlyAccepts();
      tell(", mentioning that he knows a Plutonian plutocrat who'll trade his life fortune for one, and drops", A(ODD_MACHINE), " at your feet. \"It's a TEE remover,\" he explains. You ponder what it removes -- tea stains, hallway T-intersections -- even TV star Mr. T crosses your mind, until you recall that it's only 1936. But before you have a chance to ask the salesman, he ");
      if (hasFlag(FLASHLIGHT, ONBIT)) {
        tell("points", T(FLASHLIGHT), " upwards");
      } else {
        tell("turns on", T(FLASHLIGHT));
      }
      tell(" and a giant Venusian MegaMoth swoops down and carries him off. The other salesmen scatter like frightened salesmen.\n");
      return M_FATAL;
    } else {
      queue(iSalesman, 2);
      if (prsoIs(TEN_MARSMID_COIN, ONE_MARSMID_COIN)) {
        perform(V.BUY, ODD_MACHINE);
        return true;
      } else {
        tell(() => pickOne(SALESMAN_REFUSALS));
      }
      tell(" Offer me something else.\"\n");
      return true;
    }
  } else if (verbIs(V.SHOW) && prsoIs(FLASHLIGHT) || verbIs(V.ASK_ABOUT) && prsiIs(FLASHLIGHT)) {
    tell("The salesman tries to look disinterested.\n");
    return true;
  } else if (verbIs(V.FOLLOW) && eq(G.followFlag, 8)) {
    tell(DONT_WANT_TO);
    return true;
  } else if (verbIs(V.BARTER_WITH)) {
    tell("Just give him something!\n");
    return true;
  } else if (verbIs(V.COUNT)) {
    tell("Lots.\n");
    return true;
  }
  return false;
}

export const SALESMAN_REFUSALS = ltable("SALESMAN-REFUSALS", [
    0,
    "\"No thanks, I've already got one.",
    "\"Stop insulting me. There's a glut of those on the market.",
    "\"That model went out of style before I was born!",
  ]);

export const SALESMANISMS = ltable("SALESMANISMS", [
    0,
    "\"I'll throw in a free two-week service contract.\"",
    "\"Barter-back guarantee!\"",
    "\"Never had a complaint in 37 years of selling these babies.\"",
    "\"Includes a three-day warranty!\"",
  ]);

export function iSalesman(): any {
  queue(iSalesman, -1);
  if (!isIn(SALESMAN, G.here)) {
    clearFlag(SALESMAN, TOUCHBIT);
    dequeue(iSalesman);
    return false;
  }
  tell("   ");
  if (hasFlag(SALESMAN, TOUCHBIT)) {
    tell(() => pickOne(SALESMANISMS), "\n");
    return true;
  } else {
    setFlag(SALESMAN, TOUCHBIT);
    clearFlag(ODD_MACHINE, NDESCBIT);
    thisIsIt(SALESMAN);
    tell("A salesman approaches you. \"You look like a ");
    if (G.male) {
      tell("fella");
    } else {
      tell("doll");
    }
    tell(" who can spot a good deal. One of my machines could change your life! Let's barter; offer me something as an even-up trade.\"\n");
    return true;
  }
}

defineObject(ODD_MACHINE, 143, {
  in: SALESMAN,
  desc: "odd machine",
  synonym: ["REMOVE", "MACHINE", "COMPAR", "T-REMOVER"],
  adjective: ["YOUR", "ODD", "SMALL", "T", "TEE", "TEA", "TEE-REMOVER", "TEA-REMOVER"],
  flags: [VOWELBIT, TAKEBIT, TRYTAKEBIT, CONTBIT, SEARCHBIT, NDESCBIT],
  props: {
    [P.CAPACITY]: 60,
    [P.SIZE]: 8,
    [P.GENERIC]: genericMachineF,
    [P.ACTION]: oddMachineF,
  },
});

export function oddMachineF(): any {
  let objInMachine: any = 0;
  objInMachine = first(ODD_MACHINE);
  if (verbIs(V.BUY) && isIn(ODD_MACHINE, SALESMAN)) {
    queue(iSalesman, 2);
    tell("\"I wouldn't part with this baby for a hundred marsmids!\"\n");
    return true;
  } else if (verbIs(V.PUT) && hasFlag(ODD_MACHINE, OPENBIT) && prsiIs(ODD_MACHINE)) {
    if (objInMachine && !prsoIs(objInMachine)) {
      tell(ONLY_ONE_THING_IN_COMPARTMENT);
      return true;
    } else if (prsoIs(BABY)) {
      tell("The baby cries so ferociously, you reconsider.\n");
      return true;
    } else if (first(G.prso)) {
      tell(YOULL_HAVE_TO, "empty", T(G.prso), " first. ", ONLY_ONE_THING_IN_COMPARTMENT);
      return true;
    }
    return false;
  } else if (verbIs(V.EXAMINE)) {
    tell("The ", PD(ODD_MACHINE), " is off, and has a small, ");
    openClosed(ODD_MACHINE);
    tell(" compartment");
    if (objInMachine && hasFlag(ODD_MACHINE, OPENBIT)) {
      tell(" containing", A(objInMachine));
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.TAKE, V.OPEN, V.ON) && hasFlag(ODD_MACHINE, TRYTAKEBIT)) {
    queue(iSalesman, 2);
    tell("\"Hey!\" The salesman jumps back. \"No deal, no merchandise.\"\n");
    return true;
  } else if (verbIs(V.BARTER_FOR)) {
    if (prsiIs(ODD_MACHINE)) {
      perform(V.GIVE, G.prso, SALESMAN);
      return true;
    } else {
      perform(V.BARTER_WITH, SALESMAN);
      return true;
    }
  } else if (verbIs(V.OFF)) {
    tell(ALREADY_IS);
    return true;
  } else if (verbIs(V.ON)) {
    if (hasFlag(ODD_MACHINE, OPENBIT)) {
      tell(NOTHING_HAPPENS);
      return true;
    } else {
      if (objInMachine && getp(objInMachine, P.NO_T_DESC)) {
        if (eq(objInMachine, TUBE, TORCH)) {
          setFlag(objInMachine, VOWELBIT);
        }
        if (eq(objInMachine, TORCH)) {
          dequeue(iTorch);
        }
        clearFlag(objInMachine, CONTBIT);
        clearFlag(objInMachine, SEARCHBIT);
        clearFlag(objInMachine, OPENBIT);
        clearFlag(objInMachine, READBIT);
        clearFlag(objInMachine, VEHBIT);
        clearFlag(objInMachine, WEARBIT);
        clearFlag(objInMachine, ONBIT);
        clearFlag(objInMachine, SURFACEBIT);
        setFlag(objInMachine, UNTEEDBIT);
      } else if (eq(objInMachine, RABBIT)) {
        setFlag(RABBIT, UNTEEDBIT);
      }
      if (eq(objInMachine, CHOCOLATE) && !hasFlag(CHOCOLATE, SMELLEDBIT)) {
        clearFlag(CHOCOLATE, UNTEEDBIT);
      }
      tell("Sparks! Explosions! \"Pockita pockita pockita FEEP!\" exclaims the machine.\n");
      return true;
    }
  } else if (verbIs(V.OPEN) && isIn(RABBIT, ODD_MACHINE) && hasFlag(RABBIT, UNTEEDBIT)) {
    setFlag(ODD_MACHINE, OPENBIT);
    remove(RABBIT);
    tell("A bearded rabbi wearing a prayer shawl leaps out of the machine, recites a Torah blessing, and ");
    if (eq(G.here, CANAL, IN_SPACE)) {
      tell("swim");
    } else {
      tell("dashe");
    }
    tell("s off in search of a minyan.\n");
    return true;
  }
  return false;
}

defineObject(BACK_DOOR_OBJECT, 144, {
  in: LOCAL_GLOBALS,
  desc: "back door",
  synonym: ["DOOR"],
  adjective: ["BACK", "REAR"],
  flags: [DOORBIT, LOCKEDBIT],
  props: {
    [P.ACTION]: madScientistDoorF,
  },
});

defineObject(FRONT_DOOR_OBJECT, 145, {
  in: LOCAL_GLOBALS,
  desc: "front door",
  synonym: ["DOOR"],
  adjective: ["FRONT"],
  flags: [DOORBIT, LOCKEDBIT],
  props: {
    [P.ACTION]: madScientistDoorF,
  },
});

export function madScientistDoorF(): any {
  if (verbIs(V.KNOCK) && !eq(G.here, LOOKS_CAN_BE_DECEIVING) && !hasFlag(CAGE, MUNGBIT)) {
    setFlag(G.prso, OPENBIT);
    tell("The door is thrown open by a wild-eyed ", PD(MAD_SCIENTIST), ". \"");
    if (hasFlag(LOOKS_CAN_BE_DECEIVING, TOUCHBIT)) {
      tell("Ach! You haf returned! Ve can continue der experiment!");
    } else {
      tell("Nein! Nein! Nein! I don't need any!\" Then, taking a closer look at you through spectacles thick enough to stop gamma rays, he says, \"Oh! Not ein salesman! In fact, just der type I need for mein experiment.");
    }
    if (isUltimatelyIn(FLEXIBLE_HOLE)) {
      tell(" But leaf your ");
      if (isIn(FLEXIBLE_HOLE, TUBE)) {
        printd(TUBE);
        move(TUBE, G.here);
      } else {
        printd(FLEXIBLE_HOLE);
        move(FLEXIBLE_HOLE, G.here);
      }
      tell(" outsite,\" he says, knocking it to the ground, \"I'm allergic.");
    }
    tell("\" He grips your wrist with surprising strength and drags you inside.\n\n");
    move(MAD_SCIENTIST, LOOKS_CAN_BE_DECEIVING);
    return goto(LOOKS_CAN_BE_DECEIVING);
  }
  return false;
}

defineObject(LOOKS_CAN_BE_DECEIVING, 146, {
  in: ROOMS,
  desc: "Looks Can Be Deceiving",
  flags: [RLANDBIT, ONBIT, INDOORSBIT, NARTICLEBIT],
  global: [STAIRS, FRONT_DOOR_OBJECT, BACK_DOOR_OBJECT, HOUSE, VENUS],
  exits: {
    SOUTH: toIfOpen(FRONT_DOOR, FRONT_DOOR_OBJECT),
    NORTH: toIfOpen(BACK_DOOR, BACK_DOOR_OBJECT),
    DOWN: to(LABORATORY),
  },
  props: {
    [P.ACTION]: looksCanBeDeceivingF,
  },
});

export function looksCanBeDeceivingF(rarg: any): any {
  let openDoor: any = false;
  if (hasFlag(FRONT_DOOR_OBJECT, OPENBIT)) {
    openDoor = FRONT_DOOR_OBJECT;
  } else if (hasFlag(BACK_DOOR_OBJECT, OPENBIT)) {
    openDoor = BACK_DOOR_OBJECT;
  }
  if (eq(rarg, M_LOOK)) {
    tell("From the innocent appearance of this quiet living area, you'd never guess that all sorts of twisted, maniacal, perverted experiments are in progress a short flight of stairs below. There are doors to the north");
    if (eq(openDoor, BACK_DOOR_OBJECT)) {
      tell(" (open)");
    }
    tell(" and south");
    if (eq(openDoor, FRONT_DOOR_OBJECT)) {
      tell(" (open)");
    }
    if (!openDoor) {
      tell(", both closed");
    }
    tell(".");
    return true;
  } else if (eq(rarg, M_END) && openDoor) {
    queue(iMadScientist, 2);
    clearFlag(openDoor, OPENBIT);
    tell("   You feel uneasy as", T(MAD_SCIENTIST), " locks the door behind you and dissolves the key in a vat of acid.\n");
    return true;
  }
  return false;
}

defineObject(MAD_SCIENTIST, 147, {
  desc: "mad scientist",
  synonym: ["SCIENTIST"],
  adjective: ["MAD"],
  flags: [ACTORBIT],
  props: {
    [P.DESCFCN]: madScientistF,
    [P.ACTION]: madScientistF,
  },
});

export function madScientistF(oarg: any = false): any {
  if (oarg) {
    if (eq(G.impatienceCounter, 0)) {
      return false;
    } else if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    tell("   The wild-eyed ", PD(MAD_SCIENTIST), " is ", get(MAD_SCIENTIST_DESCS, G.madScientistCounter));
    return true;
  } else if (eq(MAD_SCIENTIST, G.winner)) {
    if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"Eh?\" yells", T(MAD_SCIENTIST), ", cupping his ear. \"Heather bodices of no-doze? Vat in heck are you jabbering about?\"\n");
      return true;
    } else {
      tell("The ", PD(MAD_SCIENTIST), " ignores you, cackling with inner glee.\n");
      return stop();
    }
  } else if (verbIs(V.FOLLOW) && eq(G.followFlag, 17)) {
    return doWalk(P.NORTH);
  }
  return false;
}

export const MAD_SCIENTIST_DESCS = table("MAD-SCIENTIST-DESCS", [
    "waiting impatiently for you to descend.",
    "stalking around the room, rubbing his hands and cackling madly.",
    "stalking around the room, rubbing his hands and cackling madly.",
    "watching you intently and scrawling an occasional note.",
  ]);

G.madScientistCounter = 0;

G.impatienceCounter = 0;

export function iMadScientist(): any {
  tell("   ");
  if (eq(G.madScientistCounter, 0)) {
    G.impatienceCounter = G.impatienceCounter + 1;
    queue(iMadScientist, 2);
    if (eq(G.impatienceCounter, 1)) {
      tell("\"Let us retire to der laboratory,\" suggests", TR(MAD_SCIENTIST));
      return true;
    } else if (eq(G.impatienceCounter, 2)) {
      tell("\"Downstairs, please,\" says", T(MAD_SCIENTIST), ", impatiently.\n");
      return true;
    } else if (eq(G.impatienceCounter, 3)) {
      tell("The ", PD(MAD_SCIENTIST), ", fidgeting himself into a frenzy, motions toward the stairs.\n");
      return true;
    } else {
      tell("The ", PD(MAD_SCIENTIST), " loses his patience and opens the trapdoor, dumping you");
      andSidekick(LABORATORY);
      tell(" down a chute", ELLIPSIS);
      goto(LABORATORY);
      laboratoryF(M_END);
      return true;
    }
  } else if (eq(G.madScientistCounter, 1)) {
    move(PROTAGONIST, FIRST_SLAB);
    queue(iMadScientist, 3);
    G.madScientistCounter = 2;
    G.bodyTiedToSlab = true;
    tell("Again exhibiting extraordinary strength,", T(MAD_SCIENTIST), " straps you down on", T(FIRST_SLAB));
    if (isVisible(SIDEKICK)) {
      move(SIDEKICK, SECOND_SLAB);
      G.sidekicksBodyTiedToSlab = true;
      tell(" and ", D(SIDEKICK), " onto", T(SECOND_SLAB));
    }
    tell(PERIOD_CR);
    return true;
  } else if (eq(G.madScientistCounter, 2)) {
    queue(iMadScientist, 6);
    G.madScientistCounter = 3;
    identityTransfer();
    tell("The ", PD(MAD_SCIENTIST), " flips", T(POWER_SWITCH), ", and you suddenly find yourself within the cage. Oddly, you can also see yourself still strapped to", T(FIRST_SLAB), ". As you swing across the cage to get a better look, you realize that you're now inside the body of a gorilla.\n");
    return true;
  } else if (eq(G.madScientistCounter, 3)) {
    return mineTheory();
  }
  return false;
}

defineObject(LABORATORY, 148, {
  in: ROOMS,
  desc: "Laboratory",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [HOLE, STAIRS, HOUSE, VENUS],
  things: [
    { adjective: null, noun: "DOOR", action: labDoorF },
    { adjective: null, noun: "STRAP", action: strapF },
    { adjective: null, noun: "STRAPS", action: strapF },
  ],
  exits: {
    UP: per(laboratoryExitF),
    NORTH: per(labDoorEnterF),
  },
  props: {
    [P.HOLE_DESTINATION]: VIZICOMM_BOOTH,
    [P.ACTION]: laboratoryF,
  },
});

export function laboratoryF(rarg: any): any {
  if (eq(rarg, M_ENTER) && isQueued(iIonDeath)) {
    setFlag(POWER_TRANSMITTER, MUNGBIT);
    return queue(iIonDeath, 1);
  } else if (eq(rarg, M_LOOK)) {
    tell("The scientist's madness is finally evident by his lab, filled with many expressions of insane genius, such as the ");
    if (hasFlag(MALE_GORILLA, NDESCBIT) && hasFlag(FEMALE_GORILLA, NDESCBIT)) {
      tell("two caged gorillas, one male and one female");
    } else {
      tell("cage");
    }
    tell(", the two slabs for strapping down human victims, and", T(POWER_SWITCH), ". A closed door leads north; at the foot of the winding stone stairs is", A(HOLE), ".");
    return true;
  } else if (eq(rarg, M_END) && isIn(MAD_SCIENTIST, LOOKS_CAN_BE_DECEIVING)) {
    clearFlag(MALE_GORILLA, NDESCBIT);
    clearFlag(FEMALE_GORILLA, NDESCBIT);
    move(MAD_SCIENTIST, G.here);
    queue(iMadScientist, 5);
    G.madScientistCounter = 1;
    tell("   The ", PD(MAD_SCIENTIST), " bounds down from the first floor, activating a (guaranteed 100% effective) Vaporo-Zap Energy Barrier across the foot of the stairs.\n");
    return true;
  }
  return false;
}

export function labDoorEnterF(): any {
  doFirst("open the door");
  return false;
}

export function labDoorF(): any {
  if (verbIs(V.OPEN, V.CLOSE)) {
    performPrsa(BACK_DOOR_OBJECT);
    return true;
  } else if (verbIs(V.KNOCK)) {
    performPrsa(WIDE_CELL_DOOR);
    return true;
  }
  return false;
}

export function strapF(): any {
  if (verbIs(V.UNTIE, V.OPEN)) {
    perform(V.UNTIE, ME);
    return true;
  }
  return false;
}

defineObject(POWER_SWITCH, 149, {
  in: LABORATORY,
  desc: "huge red power switch",
  synonym: ["SWITCH"],
  adjective: ["LARGE", "RED", "POWER"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: powerSwitchF,
  },
});

export function powerSwitchF(): any {
  if (isTouching(POWER_SWITCH) && !isIn(PROTAGONIST, G.here)) {
    return cantReach(POWER_SWITCH);
  } else if (verbIs(V.SET, V.ON, V.OFF, V.THROW, V.MOVE, V.PUSH, V.RAISE, V.LOWER, V.OPEN, V.CLOSE) && prsoIs(POWER_SWITCH)) {
    if (isIn(MAD_SCIENTIST, G.here)) {
      tell("The ", PD(MAD_SCIENTIST), " stops you.\n");
      return true;
    } else {
      identityTransfer();
      tell("Zap! You're back in ");
      if (G.goneApe) {
        tell("the body of the ");
        if (!G.male) {
          tell("fe");
        }
        tell(PD(MALE_GORILLA), ".");
      } else {
        if (!hasFlag(RUBBER_HOSE, MUNGBIT)) {
          setFlag(RUBBER_HOSE, MUNGBIT);
          incrementScore(19, 24, true);
        }
        move(MALE_GORILLA, CAGE);
        move(FEMALE_GORILLA, CAGE);
        tell("your own body! The gorilla looks confused and slinks back into the comfortingly familiar environment of the cage.");
      }
      if (G.bodyTiedToSlab && !G.sidekicksBodyTiedToSlab && isVisible(SIDEKICK)) {
        G.bodyTiedToSlab = false;
        move(SIDEKICK, G.here);
        tell(" ", D(SIDEKICK), " rushes over and unties you.");
      }
      crlf();
      return true;
    }
  }
  return false;
}

export function identityTransfer(): any {
  openEyesAndRemoveHands();
  if (G.goneApe) {
    if (G.male) {
      rob(PROTAGONIST, MALE_GORILLA);
      move(MALE_GORILLA, loc(PROTAGONIST));
      clearFlag(MALE_GORILLA, NDESCBIT);
    } else {
      rob(PROTAGONIST, FEMALE_GORILLA);
      move(FEMALE_GORILLA, loc(PROTAGONIST));
      clearFlag(FEMALE_GORILLA, NDESCBIT);
    }
    if (isVisible(SIDEKICKS_BODY)) {
      move(SIDEKICK, loc(SIDEKICKS_BODY));
      remove(SIDEKICKS_BODY);
    }
    move(PROTAGONIST, loc(YOUR_BODY));
    rob(YOUR_BODY, PROTAGONIST);
    remove(YOUR_BODY);
    return G.goneApe = false;
  } else {
    G.goneApe = true;
    move(YOUR_BODY, loc(PROTAGONIST));
    rob(PROTAGONIST, YOUR_BODY);
    if (G.male) {
      move(PROTAGONIST, loc(MALE_GORILLA));
      setFlag(MALE_GORILLA, NDESCBIT);
      rob(MALE_GORILLA, PROTAGONIST);
    } else {
      move(PROTAGONIST, loc(FEMALE_GORILLA));
      setFlag(FEMALE_GORILLA, NDESCBIT);
      rob(FEMALE_GORILLA, PROTAGONIST);
    }
    if (isVisible(SIDEKICK)) {
      move(SIDEKICKS_BODY, loc(SIDEKICK));
      remove(SIDEKICK);
      return true;
    }
    return false;
  }
}

export function laboratoryExitF(): any {
  return jigsUp("If you were a representative of the Vaporo-Zap Energy Barrier Company, you'd be pleased to see that the firm's 100% effective guarantee had once again proven to be a solid claim.");
}

defineObject(CAGE, 150, {
  in: LABORATORY,
  desc: "cage",
  synonym: ["CAGE", "BAR", "BARS"],
  flags: [NDESCBIT, VEHBIT, OPENBIT, CONTBIT, SEARCHBIT, INBIT],
  props: {
    [P.CAPACITY]: 200,
    [P.ACTION]: cageF,
  },
});

export function cageF(): any {
  if (verbIs(V.EXAMINE)) {
    tell("The bars ");
    if (hasFlag(CAGE, MUNGBIT)) {
      tell("have been", SPREAD_APART);
    } else {
      tell("seem sturdy");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.ENTER, V.BOARD, V.WALK_TO, V.DISEMBARK, V.LEAVE, V.EXIT) && eq(G.here, LABORATORY) && !hasFlag(CAGE, MUNGBIT)) {
    tell("You don't fit between the bars.\n");
    return true;
  } else if (verbIs(V.OPEN, V.MUNG, V.BEND) || verbIs(V.MOVE) && !nounUsed(W.CAGE, CAGE)) {
    if (hasFlag(CAGE, MUNGBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else if (!G.goneApe) {
      tell("This cage was built to hold an ape! Mere human strength is nothing against these bars!\n");
      return true;
    } else {
      tell("Bellowing madly, you pull at the bars! ");
      if (eq(G.sugarRush, GORILLA_ATE_CHOCOLATE)) {
        setFlag(CAGE, MUNGBIT);
        tell("Slowly, they", SPREAD_APART, ".");
        if (isIn(MAD_SCIENTIST, G.here)) {
          tell(" The ", PD(MAD_SCIENTIST));
          return jigsUp(" yells, \"Mein Gott! Mad gorilla on der loose!\" He pulls out a ray gun and puts a bolt through your chest.");
        } else {
          crlf();
          return true;
        }
      } else {
        tell("They almost give, but you haven't got quite enough strength.\n");
        return true;
      }
    }
  } else if (verbIs(V.PUT) && prsiIs(CAGE) && eq(loc(PROTAGONIST), FIRST_SLAB, SECOND_SLAB)) {
    return cantReach(CAGE);
  } else if (verbIs(V.REACH_IN)) {
    if (isIn(PROTAGONIST, CAGE)) {
      tell(LOOK_AROUND);
      return true;
    } else if (isIn(RUBBER_HOSE, CAGE)) {
      return cantReach(RUBBER_HOSE);
    }
    return false;
  }
  return false;
}

G.bodyTiedToSlab = false;

G.sidekicksBodyTiedToSlab = false;

G.goneApe = false;

G.gorillaExamined = false;

defineObject(MALE_GORILLA, 151, {
  in: CAGE,
  desc: "male gorilla",
  synonym: ["GORILLA", "APE", "MONKEY"],
  adjective: ["MALE", "OTHER"],
  flags: [ACTORBIT, NDESCBIT, OPENBIT, CONTBIT, SEARCHBIT],
  props: {
    [P.GENERIC]: genericGorillaF,
    [P.ACTION]: gorillaF,
  },
});

defineObject(FEMALE_GORILLA, 152, {
  in: CAGE,
  desc: "female gorilla",
  synonym: ["GORILLA", "APE", "MONKEY"],
  adjective: ["FEMALE", "OTHER"],
  flags: [ACTORBIT, FEMALEBIT, NDESCBIT, OPENBIT, CONTBIT, SEARCHBIT],
  props: {
    [P.GENERIC]: genericGorillaF,
    [P.ACTION]: gorillaF,
  },
});

export function gorillaF(): any {
  if (G.goneApe && G.male && prsoIs(MALE_GORILLA)) {
    performPrsa(ME, G.prsi);
    return true;
  } else if (G.goneApe && G.male && prsiIs(MALE_GORILLA)) {
    performPrsa(G.prso, ME);
    return true;
  } else if (G.goneApe && !G.male && prsoIs(FEMALE_GORILLA)) {
    performPrsa(ME, G.prsi);
    return true;
  } else if (G.goneApe && !G.male && prsiIs(FEMALE_GORILLA)) {
    performPrsa(G.prso, ME);
    return true;
  } else if (verbIs(V.TELL)) {
    tell("\"Ooo oo ee ee ee!\"\n");
    return stop();
  } else if (verbIs(V.GIVE) && prsiIs(MALE_GORILLA, FEMALE_GORILLA)) {
    if (eq(loc(PROTAGONIST), FIRST_SLAB, SECOND_SLAB)) {
      return cantReach(G.prsi);
    } else {
      eagerlyAccepts();
      tell(PERIOD_CR);
      return true;
    }
  } else if (verbIs(V.EXAMINE)) {
    if (G.goneApe) {
      G.gorillaExamined = true;
      notBadLooking();
    } else {
      tell("An uglier beast cannot possibly exist.");
    }
    if (first(G.prso)) {
      tell(" ");
      return false;
    } else {
      crlf();
      return true;
    }
  } else if (verbIs(V.FUCK, V.KISS, V.TOUCH)) {
    if (!G.goneApe) {
      tell("What a repulsive, bestial idea!\n");
      return true;
    } else {
      if (eq(G.naughtyLevel, 0)) {
        tell("Normally, we wouldn't allow this in TAME mode, but it's okay in this case since you're only a gorilla. This sort of thing appears all the time in National Geographic.");
      } else {
        if (!G.gorillaExamined) {
          G.gorillaExamined = true;
          notBadLooking();
          tell(" ");
        }
        tell("You begin nuzzling, and things quickly get hot and heavy.");
        if (eq(G.naughtyLevel, 2)) {
          tell(" The ", PD(G.prso), " screams, \"Eee oo oo ah!\" which translates roughly as \"Oh, you animal!\"");
        }
      }
      if (isIn(MAD_SCIENTIST, G.here)) {
        tell(" ");
        return mineTheory(true);
      } else {
        crlf();
        return true;
      }
    }
  }
  return false;
}

export function genericGorillaF(): any {
  if (!G.goneApe) {
    return false;
  } else if (G.male) {
    return FEMALE_GORILLA;
  } else {
    return MALE_GORILLA;
  }
}

export function notBadLooking(): any {
  tell("Hey! The ", PD(G.prso), " isn't bad-looking!");
  return true;
}

export function mineTheory(right: any = false): any {
  remove(MAD_SCIENTIST);
  dequeue(iMadScientist);
  G.followFlag = 17;
  queue(iFollow, 2);
  tell("\"Ach!\" yells", T(MAD_SCIENTIST), ", \"mein theory iss ");
  if (right) {
    tell("correct");
  } else {
    tell("wronk");
  }
  tell("! Der sex drive uf a species resides in der b");
  if (right) {
    tell("ody");
  } else {
    tell("rain");
  }
  tell(", not in der b");
  if (right) {
    tell("rain");
  } else {
    tell("ody");
  }
  tell("!\" He dashes off.\n");
  if (isVisible(SIDEKICKS_BODY)) {
    tell("   Through the briefly open door, you see two ", PD(FLYTRAP), "s running madly around the next room. One is chasing, while the other is frantically trying to stay as far away as possible.\n");
  }
  return true;
}

defineObject(RUBBER_HOSE, 153, {
  in: CAGE,
  desc: "rubber hose",
  synonym: ["HOSE"],
  adjective: ["RUBBER"],
  flags: [TAKEBIT],
  props: {
    [P.SIZE]: 3,
    [P.ACTION]: rubberHoseF,
  },
});

export function rubberHoseF(): any {
  if (verbIs(V.EXAMINE, V.MEASURE)) {
    tell("The hose is around six feet long.\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    tell(ONLY_BLACKNESS);
    return true;
  }
  return false;
}

defineObject(FIRST_SLAB, 154, {
  in: LABORATORY,
  desc: "first slab",
  synonym: ["SLAB"],
  adjective: ["FIRST"],
  flags: [NDESCBIT, VEHBIT, CONTBIT, SURFACEBIT, OPENBIT, SEARCHBIT],
  props: {
    [P.GENERIC]: genericSlabF,
    [P.CAPACITY]: 100,
    [P.ACTION]: firstSlabF,
  },
});

export function firstSlabF(): any {
  if (verbIs(V.DISEMBARK) && !G.goneApe && G.bodyTiedToSlab) {
    tell("You're strapped down.\n");
    return true;
  } else if (verbIs(V.PUT_ON) && prsiIs(FIRST_SLAB) && isIn(PROTAGONIST, CAGE)) {
    return cantReach(FIRST_SLAB);
  }
  return false;
}

defineObject(SECOND_SLAB, 155, {
  in: LABORATORY,
  desc: "second slab",
  synonym: ["SLAB"],
  adjective: ["SECOND"],
  flags: [NDESCBIT, VEHBIT, CONTBIT, SURFACEBIT, OPENBIT, SEARCHBIT],
  props: {
    [P.GENERIC]: genericSlabF,
    [P.CAPACITY]: 100,
    [P.ACTION]: secondSlabF,
  },
});

export function secondSlabF(): any {
  if (verbIs(V.PUT_ON) && prsiIs(SECOND_SLAB) && isIn(PROTAGONIST, CAGE)) {
    return cantReach(SECOND_SLAB);
  }
  return false;
}

export function genericSlabF(): any {
  if (eq(loc(PROTAGONIST), FIRST_SLAB, SECOND_SLAB)) {
    return loc(PROTAGONIST);
  } else {
    return false;
  }
}

defineObject(YOUR_BODY, 156, {
  desc: "your body",
  synonym: ["BODY"],
  adjective: ["YOUR", "MY"],
  flags: [NARTICLEBIT, CONTBIT, ACTORBIT, SEARCHBIT, OPENBIT],
  props: {
    [P.ACTION]: yourBodyF,
  },
});

export function yourBodyF(): any {
  if (verbIs(V.TELL)) {
    performPrsa(MALE_GORILLA);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("Your body");
    if (isIn(YOUR_BODY, FIRST_SLAB)) {
      tell(" on", T(FIRST_SLAB));
    }
    tell(" is grunting, scratching itself with its foot, and looking around the room for a banana.\n");
    return true;
  } else if (verbIs(V.GIVE) && prsiIs(YOUR_BODY)) {
    eagerlyAccepts();
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.TAKE) && prsoIs(YOUR_BODY)) {
    tell("Carrying ", PD(YOUR_BODY), " around");
    return hoHum();
  } else if (verbIs(V.TIE) && prsoIs(FIRST_SLAB, SECOND_SLAB) && !G.bodyTiedToSlab) {
    if (prsoIs(SECOND_SLAB)) {
      tell("[the first slab is closer]\n");
    }
    G.bodyTiedToSlab = true;
    return nowTied(FIRST_SLAB);
  } else if (verbIs(V.UNTIE)) {
    if (isIn(PROTAGONIST, CAGE)) {
      return cantReach(YOUR_BODY);
    } else if (G.goneApe) {
      if (G.bodyTiedToSlab) {
        G.bodyTiedToSlab = false;
        tell("Your body leaps for a rafter and lands back on", T(FIRST_SLAB), " with a loud \"whump,\" looking momentarily stunned.\n");
        return true;
      } else {
        tell(SENILITY_STRIKES);
        return true;
      }
    } else if (G.bodyTiedToSlab) {
      return yuks();
    } else {
      tell("Your body isn't tied down!\n");
      return true;
    }
  }
  return false;
}

defineObject(SIDEKICKS_BODY, 157, {
  synonym: ["BODY", "TRENT", "TIFFAN", "TIFF"],
  adjective: ["TRENT", "TIFFAN", "TIFF'S"],
  flags: [NARTICLEBIT, CONTBIT, ACTORBIT, SEARCHBIT, OPENBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "Stepping off the cliff would mean a fatal plunge to the jungle below.",
    [P.GENERIC]: genericSidekickF,
    [P.ACTION]: sidekicksBodyF,
  },
});

export function sidekicksBodyF(): any {
  if (verbIs(V.EXAMINE)) {
    hisHer(true);
    tell(" eyes are darting around the room, as though following a fly.\n");
    return true;
  } else if (verbIs(V.TIE)) {
    if (prsoIs(SECOND_SLAB) && G.sidekicksBodyTiedToSlab) {
      tell(D(SIDEKICK), " already is!\n");
      return true;
    } else if (prsoIs(SECOND_SLAB) && G.goneApe) {
      G.sidekicksBodyTiedToSlab = true;
      return nowTied(SECOND_SLAB);
    } else {
      return wastes();
    }
  } else if (verbIs(V.UNTIE)) {
    if (eq(loc(PROTAGONIST), CAGE, FIRST_SLAB)) {
      return cantReach(SIDEKICKS_BODY);
    } else if (G.goneApe) {
      if (G.sidekicksBodyTiedToSlab) {
        G.sidekicksBodyTiedToSlab = false;
        tell("As you untie ", D(SIDEKICKS_BODY), ", it attempts to wrap its arms around you as though they were tentacles.\n");
        return true;
      } else {
        tell(SENILITY_STRIKES);
        return true;
      }
    } else {
      tell(D(SIDEKICKS_BODY), " isn't tied down!\n");
      return true;
    }
  }
  return false;
}

defineObject(ROCKY_CLIFFTOP, 158, {
  in: ROOMS,
  desc: "Rocky Clifftop",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE, TREE, BOOTH_OBJECT, VENUS],
  things: [
    { adjective: "ROCKY", noun: "CLIFF", action: cliffObjectF },
  ],
  exits: {
    NW: to(VIZICOMM_BOOTH),
    NORTH: to(BACK_DOOR),
    WEST: to(FRONT_DOOR),
    DOWN: blocked("Stepping off the cliff would mean a fatal plunge to the jungle below."),
    EAST: blocked("Stepping off the cliff would mean a fatal plunge to the jungle below."),
    SE: blocked("Stepping off the cliff would mean a fatal plunge to the jungle below."),
    SOUTH: blocked("Stepping off the cliff would mean a fatal plunge to the jungle below."),
  },
  props: {
    [P.HOLE_DESTINATION]: ROYAL_DOCKS,
    [P.ACTION]: rockyClifftopF,
  },
});

export function rockyClifftopF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("Even the most adaptable Venusian flora can't gain a foothold on this outcropping, so the jungle (which can be entered to the north or west) peters out here. To the southeast, your clifftop vantage offers a stunning view of more lush jungle, stretching unbroken to the horizon.\n   To the northwest, between the two paths into the jungle, is a vizicomm booth. At the edge of the cliff is", A(HOLE), ".");
    return true;
  } else if (eq(rarg, M_END) && G.goneApe) {
    return jigsUp("   A tranquilizer dart pierces your rump and you spend your remaining years in the gorilla cage of the Venusian Planetary Zoo.");
  }
  return false;
}

export function cliffObjectF(): any {
  if (verbIs(V.LEAP_OFF)) {
    G.prso = false;
    return vLeap();
  } else if (verbIs(V.EXAMINE)) {
    return vLook();
  }
  return false;
}

defineObject(BOOTH_OBJECT, 159, {
  in: LOCAL_GLOBALS,
  desc: "booth",
  synonym: ["BOOTH"],
  adjective: ["VIZICOMM", "SMALL"],
  props: {
    [P.ACTION]: boothObjectF,
  },
});

export function boothObjectF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, ROCKY_CLIFFTOP)) {
      return doWalk(P.NW);
    } else if (eq(G.here, VIZICOMM_BOOTH)) {
      tell(LOOK_AROUND);
      return true;
    }
    return false;
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    if (eq(G.here, ROCKY_CLIFFTOP)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      return doWalk(P.SE);
    }
  } else if (verbIs(V.EXAMINE) && eq(G.here, VIZICOMM_BOOTH)) {
    return vLook();
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.LOOK_INSIDE) && eq(G.here, ROCKY_CLIFFTOP)) {
    tell(CANT_FROM_HERE);
    return true;
  }
  return false;
}

defineObject(VIZICOMM_BOOTH, 160, {
  in: ROOMS,
  desc: "Vizicomm Booth",
  flags: [ONBIT, RLANDBIT],
  global: [SIGN, BOOTH_OBJECT, VENUS],
  things: [
    { adjective: null, noun: "DIAL", action: dialF },
    { adjective: "COIN", noun: "SLOT", action: coinSlotF },
  ],
  exits: {
    SE: to(ROCKY_CLIFFTOP),
    OUT: to(ROCKY_CLIFFTOP),
  },
  props: {
    [P.ACTION]: vizicommBoothF,
  },
});

export function vizicommBoothF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This small booth, which opens to the southeast, contains", VIZICOMM_DESC, " A red sign is posted over the vizicomm.");
    return true;
  } else if (eq(rarg, M_END) && G.goneApe && isVisible(FLEXIBLE_HOLE)) {
    return rockyClifftopF(M_END);
  }
  return false;
}

defineObject(VIZICOMM, 161, {
  in: VIZICOMM_BOOTH,
  desc: "vizicomm",
  synonym: ["VIZICOMM"],
  adjective: ["PAY"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: vizicommF,
  },
});

export function vizicommF(): any {
  if (verbIs(V.EXAMINE)) {
    tell("It's", VIZICOMM_DESC, "\n");
    return true;
  } else if (verbIs(V.SET)) {
    tell("The dial is stuck and won't turn.\n");
    return true;
  }
  return false;
}

export function dialF(): any {
  if (verbIs(V.SET, V.MOVE)) {
    perform(V.SET, VIZICOMM);
    return true;
  } else if (verbIs(V.TAKE)) {
    tell(PART_OF_VIZICOMM);
    return true;
  }
  return false;
}

export function coinSlotF(): any {
  if (verbIs(V.TAKE)) {
    tell(PART_OF_VIZICOMM);
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    tell(ONLY_BLACKNESS);
    return true;
  } else if (verbIs(V.PUT) && prsoIs(TEN_MARSMID_COIN, ONE_MARSMID_COIN)) {
    move(G.prso, COIN_RETURN_KNOB);
    tell("\"Clink.\"\n");
    return true;
  }
  return false;
}

defineObject(HANDSET, 162, {
  in: VIZICOMM_BOOTH,
  desc: "handset",
  synonym: ["HANDSET"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: handsetF,
  },
});

export function handsetF(): any {
  if (verbIs(V.PICK_UP, V.LISTEN, V.RAISE, V.PICK_UP)) {
    tell("There's no dial tone.\n");
    return true;
  } else if (verbIs(V.TAKE)) {
    tell(PART_OF_VIZICOMM);
    return true;
  }
  return false;
}

defineObject(COIN_RETURN_KNOB, 163, {
  in: VIZICOMM_BOOTH,
  desc: "coin return knob",
  synonym: ["KNOB"],
  adjective: ["COIN", "RETURN"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: coinReturnKnobF,
  },
});

export function coinReturnKnobF(): any {
  let coin: any = false;
  if (verbIs(V.PUSH, V.MOVE, V.SET)) {
    if (coin = first(COIN_RETURN_KNOB)) {
      move(coin, COIN_RETURN_BOX);
      tell("\"Clank.\"\n");
      return true;
    } else {
      tell(NOTHING_HAPPENS);
      return true;
    }
  } else if (verbIs(V.TAKE)) {
    tell(PART_OF_VIZICOMM);
    return true;
  }
  return false;
}

defineObject(COIN_RETURN_BOX, 164, {
  in: VIZICOMM_BOOTH,
  desc: "coin return box",
  synonym: ["BOX"],
  adjective: ["COIN", "RETURN"],
  flags: [NDESCBIT, CONTBIT],
  props: {
    [P.CAPACITY]: 1,
    [P.ACTION]: coinReturnBoxF,
  },
});

export function coinReturnBoxF(): any {
  let coin: any = false;
  if (verbIs(V.LOOK_INSIDE, V.REACH_IN, V.SEARCH, V.OPEN)) {
    if (coin = first(COIN_RETURN_BOX)) {
      move(coin, G.here);
      thisIsIt(coin);
      tell("A coin falls to the ground!\n");
      return true;
    } else {
      tell("The box is empty. Upon letting go, it swings shut.\n");
      return true;
    }
  }
  return false;
}

defineObject(TEN_MARSMID_COIN, 165, {
  in: COIN_RETURN_KNOB,
  desc: "coin",
  synonym: ["COIN", "MARSMID", "MONEY"],
  adjective: ["TEN", "MARSMID"],
  flags: [TAKEBIT, READBIT],
  props: {
    [P.GENERIC]: genericCoinF,
    [P.TEXT]: "The coin reads \"Ten Marsmids.\"",
  },
});

defineObject(ONE_MARSMID_COIN, 166, {
  desc: "coin",
  synonym: ["COIN", "MARSMID", "MONEY"],
  adjective: ["ONE", "MARSMID"],
  flags: [TAKEBIT, READBIT],
  props: {
    [P.GENERIC]: genericCoinF,
    [P.TEXT]: "The coin reads \"One Marsmid.\"",
  },
});

export function genericCoinF(): any {
  return ONE_MARSMID_COIN;
}
