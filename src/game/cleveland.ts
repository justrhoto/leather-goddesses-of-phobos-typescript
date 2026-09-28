// cleveland.ts — from CLEVELAND.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  defineObject, per, to,
} from "../engine/define.ts";
import {
  A, AR, D, PD, T, TR, clearFlag, crlf, eq, first, get, hasFlag, isIn, loc, move, next, printd, putp,
  remove, setFlag, tell,
} from "../engine/runtime.ts";
import {
  adjUsed, andSidekick, cantReach, cantSee, doFirst, heShe, himHer, incrementScore, isTouching,
  nounUsed, nowTied, wee,
} from "./globals.ts";
import {
  dequeue, isQueued, perform, performPrsa, queue,
} from "./misc.ts";
import {
  P_ITBL, thisIsIt,
} from "./parser.ts";
import {
  memoriam,
} from "./phobos.ts";
import {
  doWalk, hoHum, iFollow, isUltimatelyIn, isUntouchable, jigsUp, preTouch, rob, vClean, vExamine,
  vLook, vWalkAround, wastes,
} from "./verbs.ts";
import {
  ACTORBIT, ADJ, BED, BEDROOM, BLANKET, BURNBIT, CLEVELAND, CLEVELAND_OBJECT, CONTBIT, END_OF_HALLWAY,
  FORD, G, GARDEN, GLOBAL_ROOM, GROUND, HEADLIGHT, HOLDING_IT, HOLE, HOUSE, INDOORSBIT, LAWN, LEAVES,
  LOCAL_GLOBALS, LOOK_AROUND, MUNGBIT, M_END, M_LOOK, M_OBJDESC, M_OBJDESC_Q, NARTICLEBIT, NDESCBIT,
  NOTHING_NEW, ODOR, ONBIT, OPENBIT, P, PERIOD_CR, PLURALBIT, PR, PROTAGONIST, PSEUDO_OBJECT, P_PREP1,
  RAFT, RAKE, RLANDBIT, ROOMS, SACK, SEARCHBIT, SENILITY_STRIKES, SHEET, SIDEKICK, SOD, STAIRS, STOOL,
  SURFACEBIT, TAKEBIT, TEENSY_WEENSY_HOUSE, TREE_HOLE, TRELLIS, TRELLIS_TOO_WIDE, TRYTAKEBIT,
  UNTEEDBIT, V, VEHBIT, W, WINDOW, YNH, YOU_CANT, prsiIs, prsoIs, verbIs,
} from "./world.ts";

defineObject(CLEVELAND_OBJECT, 167, {
  in: LOCAL_GLOBALS,
  desc: "Cleveland",
  synonym: ["CLEVELAND"],
  props: {
    [P.ACTION]: clevelandObjectF,
  },
});

export function clevelandObjectF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, CLEVELAND)) {
      tell(LOOK_AROUND);
      return true;
    } else if (eq(G.here, LAWN)) {
      return doWalk(P.NORTH);
    }
    return false;
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    if (eq(G.here, CLEVELAND)) {
      return vWalkAround();
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.EXAMINE)) {
    return vLook();
  }
  return false;
}

defineObject(CLEVELAND, 168, {
  in: ROOMS,
  desc: "Cleveland",
  flags: [RLANDBIT, ONBIT, NARTICLEBIT],
  global: [CLEVELAND_OBJECT, HOUSE],
  exits: {
    NE: to(TEENSY_WEENSY_HOUSE),
    SOUTH: to(LAWN),
  },
  props: {
    [P.LDESC]: "You suddenly find yourself longing for the slime pits of Venus or the sandstorms of Mars. This particular section of Cleveland has exits to the northeast and south.",
  },
});

defineObject(LAWN, 169, {
  in: ROOMS,
  desc: "Lawn",
  flags: [RLANDBIT, ONBIT],
  global: [CLEVELAND_OBJECT],
  things: [
    { adjective: "TALL", noun: "FENCE", action: fenceF },
    { adjective: null, noun: "LAWN", action: lawnObjectF },
  ],
  exits: {
    NORTH: to(CLEVELAND),
  },
  props: {
    [P.ACTION]: lawnF,
  },
});

export function lawnF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("Yes, \"Lawn\" is the kindest word for this muddy patch of limp crabgrass. ");
    if (hasFlag(RAKE, TRYTAKEBIT) && hasFlag(SACK, TRYTAKEBIT)) {
      tell("Miraculously, someone actually seems to ");
      if (eq(G.naughtyLevel, 0)) {
        tell("care");
      } else {
        tell("give a ");
        if (eq(G.naughtyLevel, 1)) {
          tell("damn");
        } else {
          tell("shit");
        }
      }
      tell(" about this lawn, because there are signs of recent activity:", A(RAKE), " and a large ", PD(SACK), ". ");
    }
    tell("A fence rings the lawn; through an opening to the north you can see Cleveland.");
    return true;
  } else if (eq(rarg, M_END)) {
    clearFlag(RAKE, TRYTAKEBIT);
    clearFlag(SACK, TRYTAKEBIT);
    clearFlag(RAKE, NDESCBIT);
    clearFlag(SACK, NDESCBIT);
    return true;
  }
  return false;
}

export function fenceF(): any {
  if (verbIs(V.LOOK_OVER, V.CLIMB, V.CLIMB_UP, V.CLIMB_OVER)) {
    tell("It's too tall.\n");
    return true;
  } else if (verbIs(V.PUT_AGAINST) && prsoIs(TRELLIS)) {
    performPrsa(TRELLIS, HOUSE);
    return true;
  }
  return false;
}

export function lawnObjectF(): any {
  if (verbIs(V.RAKE)) {
    tell("It's already raked.\n");
    return true;
  } else if (verbIs(V.CLIMB_UP, V.CLIMB_ON, V.CLIMB, V.BOARD, V.LOOK_UNDER)) {
    performPrsa(GROUND, G.prsi);
    return true;
  } else if (verbIs(V.PUT_ON) && prsiIs(PSEUDO_OBJECT)) {
    perform(V.DROP, G.prso);
    return true;
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    return vLook();
  }
  return false;
}

defineObject(RAKE, 170, {
  in: LAWN,
  desc: "wooden rake",
  synonym: ["RAKE"],
  adjective: ["WOODEN"],
  flags: [NDESCBIT, TAKEBIT, BURNBIT, TRYTAKEBIT],
});

defineObject(SACK, 171, {
  in: LAWN,
  desc: "canvas sack",
  synonym: ["SACK", "BAG"],
  adjective: ["CANVAS", "LARGE"],
  flags: [NDESCBIT, TRYTAKEBIT, TAKEBIT, CONTBIT, SEARCHBIT, BURNBIT],
  props: {
    [P.SIZE]: 3,
    [P.CAPACITY]: 50,
  },
});

defineObject(LEAVES, 172, {
  in: SACK,
  desc: "whole bunch of leaves",
  synonym: ["BUNCH", "LEAVES", "LEAF", "PILE"],
  adjective: ["WHOLE"],
  flags: [TAKEBIT, BURNBIT, TRYTAKEBIT, PLURALBIT],
  props: {
    [P.SIZE]: 2,
    [P.ACTION]: leavesF,
  },
});

export function leavesF(): any {
  if (verbIs(V.ENTER)) {
    if (isUltimatelyIn(LEAVES)) {
      tell(HOLDING_IT);
      return true;
    } else {
      return wee();
    }
  } else if (verbIs(V.TAKE)) {
    if (preTouch()) {
      return true;
    }
    tell(YOU_CANT, "hold so many leaves in your arms!\n");
    return true;
  } else if (verbIs(V.RAKE)) {
    tell("They're already in a ");
    if (isIn(LEAVES, SACK)) {
      printd(SACK);
    } else {
      tell("pile");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.COUNT)) {
    tell("69,105.\n");
    return true;
  } else if (verbIs(V.SEARCH, V.LOOK_INSIDE)) {
    tell("You find ... more leaves!\n");
    return true;
  } else if (verbIs(V.POUR) && prsoIs(LEAVES)) {
    if (isUltimatelyIn(LEAVES)) {
      if (prsiIs(WINDOW)) {
        perform(V.PUT_THROUGH, LEAVES, WINDOW);
        return true;
      } else {
        perform(V.PUT, LEAVES, G.prsi);
        return true;
      }
    } else {
      tell(YNH, TR(LEAVES));
      return true;
    }
  } else if (verbIs(V.PUSH, V.PUT) && prsiIs(SACK) || verbIs(V.FILL) && prsoIs(SACK)) {
    if (isUntouchable(LEAVES)) {
      cantReach(LEAVES);
      return true;
    } else if (isIn(LEAVES, SACK)) {
      return false;
    }
    clearFlag(LEAVES, TRYTAKEBIT);
    G.leavesPlaced = false;
    setFlag(TREE_HOLE, OPENBIT);
    clearFlag(LEAVES, NDESCBIT);
    move(LEAVES, SACK);
    tell("Done.\n");
    return true;
  } else if (verbIs(V.MOVE) && G.leavesPlaced) {
    clearFlag(LEAVES, TRYTAKEBIT);
    G.leavesPlaced = false;
    setFlag(TREE_HOLE, OPENBIT);
    clearFlag(LEAVES, NDESCBIT);
    move(LEAVES, G.here);
    tell("You uncover the trellis.\n");
    return true;
  } else if (verbIs(V.LOOK_UNDER) && G.leavesPlaced) {
    trellisVisible();
    crlf();
    return true;
  } else if (verbIs(V.EMPTY) && prsoIs(LEAVES) && isIn(LEAVES, SACK)) {
    perform(V.DROP, LEAVES);
    return true;
  } else if (verbIs(V.STAND_ON, V.CLIMB_ON, V.BOARD) && G.leavesPlaced) {
    perform(V.STAND_ON, TRELLIS);
    return true;
  }
  return false;
}

defineObject(TEENSY_WEENSY_HOUSE, 173, {
  in: ROOMS,
  desc: "Teensy-Weensy House",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [STAIRS, HOUSE],
  things: [
    { adjective: "FIRST", noun: "FLOOR", action: firstFloorF },
    { adjective: "SECOND", noun: "FLOOR", action: secondFloorF },
  ],
  exits: {
    SW: to(CLEVELAND),
    EAST: to(GARDEN),
    UP: to(BEDROOM),
  },
  props: {
    [P.LDESC]: "This rickety home is so petite that the entire first floor is only one location in this story. When you tire of this floor, you can go east, southwest, or up.",
  },
});

defineObject(GARDEN, 174, {
  in: ROOMS,
  desc: "Garden",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE, HOUSE],
  things: [
    { adjective: null, noun: "FLOWER", action: flowersF },
  ],
  exits: {
    WEST: to(TEENSY_WEENSY_HOUSE),
    IN: to(TEENSY_WEENSY_HOUSE),
  },
  props: {
    [P.HOLE_DESTINATION]: END_OF_HALLWAY,
    [P.ACTION]: gardenF,
  },
});

export function gardenF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("The house opens onto a fragrant garden! A piece of sod has been ");
    if (hasFlag(SOD, MUNGBIT)) {
      tell("rolled aside, revealing", A(HOLE));
    } else {
      tell("recently planted");
    }
    tell(", and a clump of yellow, bulbous flowers grows nearby.");
    if (hasFlag(TRELLIS, TRYTAKEBIT)) {
      tell(" The flowers barely reach the trellis which rises behind them.");
    }
    tell(" You can re-enter the house to the west.");
    return true;
  }
  return false;
}

export function flowersF(): any {
  if (verbIs(V.SMELL)) {
    performPrsa(ODOR);
    return true;
  } else if (verbIs(V.PICK, V.TAKE, V.MUNG)) {
    tell("That would be the act of a philistine.\n");
    return true;
  }
  return false;
}

defineObject(SOD, 175, {
  in: GARDEN,
  desc: "sod",
  synonym: ["PIECE", "SOD"],
  flags: [NARTICLEBIT, NDESCBIT, TRYTAKEBIT],
  props: {
    [P.ACTION]: sodF,
  },
});

export function sodF(): any {
  if (verbIs(V.TAKE)) {
    return examineSod(true);
  } else if (verbIs(V.MOVE, V.ROLL, V.PUSH)) {
    if (hasFlag(SOD, MUNGBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else {
      setFlag(SOD, MUNGBIT);
      thisIsIt(HOLE);
      tell("Moving the sod reveals", AR(HOLE));
      return true;
    }
  } else if (verbIs(V.PUT_ON) && prsiIs(HOLE) || verbIs(V.UNROLL)) {
    if (hasFlag(SOD, MUNGBIT)) {
      clearFlag(SOD, MUNGBIT);
      tell("You re-cover", TR(HOLE));
      return true;
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.RAISE, V.LOOK_UNDER) && !hasFlag(SOD, MUNGBIT)) {
    tell("You lift a corner. Before the sod drops back to the ground, you notice something dark.\n");
    return true;
  } else if (verbIs(V.EXAMINE)) {
    return examineSod();
  }
  return false;
}

export function examineSod(taking: any = false): any {
  tell("Although the sod hasn't taken root yet, it");
  if (taking) {
    tell("'");
  } else {
    tell(" look");
  }
  tell("s too heavy to carry.\n");
  return true;
}

defineObject(TRELLIS, 176, {
  in: GARDEN,
  desc: "trellis",
  synonym: ["TRELLIS", "RELLIS"],
  adjective: ["WOODEN", "WHITE", "TALL", "WIDE", "SQUARE"],
  flags: [NDESCBIT, TAKEBIT, BURNBIT, TRYTAKEBIT, SEARCHBIT],
  props: {
    [P.NO_T_DESC]: "rellis",
    [P.DESCFCN]: trellisF,
    [P.SIZE]: 55,
    [P.CAPACITY]: 50,
    [P.ACTION]: trellisF,
  },
});

export function trellisF(oarg: any = false): any {
  if (oarg) {
    if (hasFlag(TRELLIS, MUNGBIT)) {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      tell("   ");
      return describeTrellisOnHole();
    } else {
      return false;
    }
  } else if (hasFlag(TRELLIS, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.PUT_ON, V.PUT) && prsoIs(LEAVES) && hasFlag(TRELLIS, MUNGBIT)) {
    if (isIn(LEAVES, TREE_HOLE)) {
      return cantReach(LEAVES);
    } else {
      G.leavesPlaced = true;
      clearFlag(TREE_HOLE, OPENBIT);
      setFlag(LEAVES, NDESCBIT);
      setFlag(LEAVES, TRYTAKEBIT);
      move(LEAVES, TRELLIS);
      tell("The leaves cover the trellis.\n");
      return true;
    }
  } else if (verbIs(V.PUT_ON) && prsiIs(TREE_HOLE)) {
    if (hasFlag(TRELLIS, MUNGBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else {
      if (isIn(LEAVES, TRELLIS)) {
        G.leavesPlaced = true;
        clearFlag(TREE_HOLE, OPENBIT);
        setFlag(LEAVES, NDESCBIT);
        setFlag(LEAVES, TRYTAKEBIT);
      }
      move(TRELLIS, G.here);
      setFlag(TRELLIS, TRYTAKEBIT);
      setFlag(TRELLIS, MUNGBIT);
      tell("The trellis barely spans the hole.\n");
      return true;
    }
  } else if (verbIs(V.TAKE) && hasFlag(TRELLIS, TRYTAKEBIT) && !isUntouchable(TRELLIS)) {
    undoTrap();
    return false;
  } else if (verbIs(V.CLIMB, V.CLIMB_ON) && eq(G.here, GARDEN) && hasFlag(TRELLIS, TRYTAKEBIT)) {
    undoTrap();
    tell("It falls over.\n");
    return true;
  } else if (verbIs(V.MOVE, V.REMOVE) && hasFlag(TRELLIS, MUNGBIT)) {
    undoTrap();
    tell("You uncover the hole.\n");
    return true;
  } else if (verbIs(V.PUT_AGAINST) && prsiIs(HOUSE)) {
    tell("The trellis is too flimsy to climb.\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE) && eq(get(P_ITBL, P_PREP1), PR.THROUGH)) {
    return vLook();
  } else if (verbIs(V.MEASURE)) {
    tell("It's six or seven feet wide.\n");
    return true;
  } else if (verbIs(V.EXAMINE) && G.leavesPlaced) {
    clearFlag(LEAVES, NDESCBIT);
    vExamine();
    setFlag(LEAVES, NDESCBIT);
    return true;
  } else if (verbIs(V.EXAMINE) && !first(TRELLIS)) {
    tell("The trellis is a tight lattice of white wood. Though slightly wider at the top, it is approximately square in shape.\n");
    return true;
  } else if (verbIs(V.PUT) && prsiIs(TREE_HOLE)) {
    tell(TRELLIS_TOO_WIDE);
    return true;
  } else if (verbIs(V.STAND_ON, V.BOARD) && hasFlag(TRELLIS, MUNGBIT)) {
    rob(TRELLIS, TREE_HOLE);
    remove(TRELLIS);
    move(PROTAGONIST, TREE_HOLE);
    tell("Crash! You");
    andSidekick(TREE_HOLE);
    undoTrap();
    tell(" are now in the hole, along with some splinters.\n");
    return true;
  }
  return false;
}

export function trellisVisible(): any {
  tell("The edge of a trellis is just visible under", A(LEAVES), ".");
  return true;
}

export function describeTrellisOnHole(): any {
  if (G.leavesPlaced) {
    return trellisVisible();
  } else {
    tell("A trellis covers the hole.");
    return true;
  }
}

export function undoTrap(): any {
  if (G.leavesPlaced) {
    G.leavesPlaced = false;
    clearFlag(LEAVES, TRYTAKEBIT);
    clearFlag(LEAVES, NDESCBIT);
  }
  setFlag(TREE_HOLE, OPENBIT);
  clearFlag(TRELLIS, TRYTAKEBIT);
  clearFlag(TRELLIS, MUNGBIT);
  clearFlag(TRELLIS, NDESCBIT);
  setFlag(TRELLIS, OPENBIT);
  setFlag(TRELLIS, CONTBIT);
  setFlag(TRELLIS, SURFACEBIT);
  return true;
}

export function firstFloorF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, BEDROOM)) {
      return doWalk(P.DOWN);
    } else if (eq(G.here, TEENSY_WEENSY_HOUSE)) {
      tell(LOOK_AROUND);
      return true;
    }
    return false;
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (eq(G.here, BEDROOM)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      return doWalk(P.UP);
    }
  } else if (eq(G.here, TEENSY_WEENSY_HOUSE)) {
    if (prsoIs(PSEUDO_OBJECT)) {
      performPrsa(GLOBAL_ROOM, G.prsi);
      return true;
    } else {
      return performPrsa(G.prso, GLOBAL_ROOM);
    }
  }
  return false;
}

export function secondFloorF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, TEENSY_WEENSY_HOUSE)) {
      return doWalk(P.UP);
    } else if (eq(G.here, BEDROOM)) {
      tell(LOOK_AROUND);
      return true;
    }
    return false;
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (eq(G.here, BEDROOM)) {
      return doWalk(P.DOWN);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (eq(G.here, BEDROOM)) {
    if (prsoIs(PSEUDO_OBJECT)) {
      performPrsa(GLOBAL_ROOM, G.prsi);
      return true;
    } else {
      return performPrsa(G.prso, GLOBAL_ROOM);
    }
  }
  return false;
}

defineObject(BEDROOM, 177, {
  in: ROOMS,
  desc: "Bedroom",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [STAIRS, WINDOW, HOUSE],
  things: [
    { adjective: "FIRST", noun: "FLOOR", action: firstFloorF },
    { adjective: "SECOND", noun: "FLOOR", action: secondFloorF },
  ],
  exits: {
    DOWN: per(bedroomExitF),
  },
  props: {
    [P.LDESC]: "The second floor of the house has an open window overlooking the street and a stair leading down.",
  },
});

export function bedroomExitF(calledByStairsF: any = false): any {
  if (G.sidekickTripFlag && isQueued(iSidekickOutWindow)) {
    tell("Just as you are about to...\n");
    return false;
  } else if (G.sheetHanging && !calledByStairsF) {
    tell("Choice: You could climb down the stairs or the rope.\n");
    return false;
  } else {
    return TEENSY_WEENSY_HOUSE;
  }
}

defineObject(BED, 178, {
  in: BEDROOM,
  desc: "bed",
  synonym: ["BED"],
  flags: [VEHBIT, NDESCBIT, CONTBIT, SEARCHBIT, SURFACEBIT, OPENBIT],
  props: {
    [P.CAPACITY]: 100,
    [P.ACTION]: bedF,
  },
});

export function bedF(): any {
  if (verbIs(V.MAKE)) {
    return vClean();
  } else if (verbIs(V.EXAMINE) && (G.sheetTied || hasFlag(SHEET, TRYTAKEBIT))) {
    sheetF(M_OBJDESC);
    if (first(BED)) {
      if (eq(first(BED), SHEET) && !next(SHEET)) {
        crlf();
        return true;
      } else {
        tell(" ");
        return false;
      }
    } else {
      crlf();
      return true;
    }
  } else if (verbIs(V.PUT, V.PUT_ON) && prsoIs(RAFT, STOOL)) {
    return wastes();
  } else if (verbIs(V.MOVE, V.PUSH)) {
    tell("The bed is too heavy to move.\n");
    return true;
  }
  return false;
}

G.sheetHanging = false;

G.sheetTied = false;

defineObject(SHEET, 179, {
  in: BEDROOM,
  synonym: ["SHEET", "STRIPS", "END", "ROPE"],
  adjective: ["OTHER", "SHEE", "CLOTH"],
  flags: [TAKEBIT, BURNBIT, TRYTAKEBIT],
  props: {
    [P.SDESC]: "sheet",
    [P.NO_T_DESC]: "shee",
    [P.DESCFCN]: sheetF,
    [P.ACTION]: sheetF,
  },
});

export function sheetF(oarg: any = false): any {
  if (oarg) {
    if (G.sheetTied || hasFlag(SHEET, TRYTAKEBIT)) {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      if (!verbIs(V.EXAMINE)) {
        tell("   ");
      }
      if (G.sheetTied) {
        tell("A ", D(SHEET), " is tied to the bed");
        if (G.sheetHanging) {
          tell(", its other end out the window");
        }
        tell(".");
        return true;
      } else {
        tell("The bed is unmade, with the sheet lying half on the floor.");
        return true;
      }
    } else {
      return false;
    }
  } else if (verbIs(V.MAKE) && nounUsed(W.ROPE, SHEET)) {
    if (hasFlag(SHEET, MUNGBIT)) {
      perform(V.TIE_TOGETHER, SHEET);
      return true;
    } else {
      tell("Be less general.\n");
      return true;
    }
  } else if (verbIs(V.TIE, V.MAKE_WITH) && prsoIs(G.prsi)) {
    perform(V.TIE_TOGETHER, SHEET);
    return true;
  } else if (verbIs(V.TIE_TOGETHER)) {
    if (hasFlag(SHEET, MUNGBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else if (hasFlag(SHEET, NARTICLEBIT)) {
      clearFlag(SHEET, NARTICLEBIT);
      clearFlag(SHEET, PLURALBIT);
      setFlag(SHEET, MUNGBIT);
      putp(SHEET, P.SDESC, "rope of cloth");
      putp(SHEET, P.NO_T_DESC, "rope of cloh");
      tell("With the expertise of one who has watched countless prison escape movies, you tie the strips into a rope.\n");
      return true;
    } else {
      tell("Tying the ends of the sheet together");
      return hoHum();
    }
  } else if (nounUsed(W.ROPE, SHEET) && !hasFlag(SHEET, MUNGBIT)) {
    return cantSee(SHEET);
  } else if (verbIs(V.PUT, V.TAKE) && prsoIs(SHEET) && hasFlag(SHEET, TRYTAKEBIT) && !prsiIs(WINDOW)) {
    if (G.sheetTied) {
      return doFirst("untie it");
    } else {
      clearFlag(SHEET, TRYTAKEBIT);
      clearFlag(BED, NDESCBIT);
      return false;
    }
  } else if (hasFlag(SHEET, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.RIP) || verbIs(V.CUT) && prsoIs(SHEET)) {
    if (hasFlag(SHEET, NARTICLEBIT) || hasFlag(SHEET, MUNGBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else {
      G.sheetTied = false;
      setFlag(SHEET, NARTICLEBIT);
      clearFlag(SHEET, TRYTAKEBIT);
      clearFlag(BED, NDESCBIT);
      setFlag(SHEET, PLURALBIT);
      putp(SHEET, P.SDESC, "strips of cloth");
      putp(SHEET, P.NO_T_DESC, "srips of cloh");
      tell("You rip the sheet into", TR(SHEET));
      return true;
    }
  } else if (verbIs(V.TIE) && prsoIs(SHEET)) {
    if (G.sheetTied) {
      tell("But", T(SHEET), " is already tied to the bed.\n");
      return true;
    } else if (hasFlag(SHEET, NARTICLEBIT)) {
      tell("Unless you want to make a nice decorative fringe for", T(G.prsi), ", that");
      return hoHum();
    } else if (prsiIs(BED)) {
      G.sheetTied = true;
      setFlag(BED, NDESCBIT);
      setFlag(SHEET, TRYTAKEBIT);
      move(SHEET, G.here);
      return nowTied(BED);
    } else if (hasFlag(G.prsi, ACTORBIT) && !eq(G.naughtyLevel, 0)) {
      return false;
    } else if (!prsoIs(BLANKET)) {
      return wastes();
    }
    return false;
  } else if (verbIs(V.UNTIE) && G.sheetTied) {
    clearFlag(SHEET, TRYTAKEBIT);
    G.sheetTied = false;
    move(SHEET, loc(PROTAGONIST));
    if (G.sheetHanging) {
      clearFlag(BED, NDESCBIT);
      G.sheetHanging = false;
      tell("You pull in", T(G.prso), " and untie it.\n");
      return true;
    } else {
      tell("Untied.\n");
      return true;
    }
  } else if (verbIs(V.PUT_THROUGH, V.PUT) && prsiIs(WINDOW)) {
    if (G.sheetHanging) {
      tell(SENILITY_STRIKES);
      return true;
    } else if (G.sheetTied) {
      if (!hasFlag(SHEET, MUNGBIT)) {
        tell("The sheet would barely reach the window, let alone the ground below!\n");
        return true;
      }
      move(SHEET, G.here);
      G.sheetHanging = true;
      tell("The ", D(SHEET), " hangs almost to the ground.");
      if (!isIn(SIDEKICK, G.here) || G.sidekickTripFlag) {
        crlf();
        return true;
      }
      queue(iSidekickOutWindow, 2);
      tell(" ", D(SIDEKICK), " looks awed. \"Super idea! Doesn't look too strong, though. I'm lighter, so I'll go down.\"\n");
      return true;
    }
    return false;
  } else if (verbIs(V.MOVE)) {
    if (G.sheetHanging) {
      G.sheetHanging = false;
      tell("You pull", T(SHEET), " back into the room.\n");
      return true;
    } else if (G.sheetTied) {
      performPrsa(BED);
      return true;
    }
    return false;
  } else if (verbIs(V.CLIMB_DOWN) && G.sheetHanging) {
    tell("The rope rips under your weight. ");
    return plummetToPavement();
  } else if (verbIs(V.MEASURE) && hasFlag(SHEET, MUNGBIT)) {
    tell("Long enough.\n");
    return true;
  } else if (verbIs(V.EXAMINE) && (G.sheetTied || hasFlag(SHEET, TRYTAKEBIT))) {
    sheetF(M_OBJDESC);
    crlf();
    return true;
  }
  return false;
}

export function plummetToPavement(): any {
  return jigsUp("After plummeting to the pavement, ambulances rush up to take you the finest hospitals in Cleveland. If only the ambulances had all picked the same hospital, there might've been a chance to put you back together.");
}

export function iSidekickOutWindow(): any {
  tell("   ");
  if (G.sidekickTripFlag) {
    setFlag(BEDROOM, MUNGBIT);
    move(SIDEKICK, G.here);
    move(HEADLIGHT, G.here);
    incrementScore(14, 33, true);
    tell("The ceiling collapses into a cloud of old plaster and startled termites, and out of the middle of it steps ", D(SIDEKICK), ", looking dishevelled but, for the most part, alive!\n   \"That truck explosion knocked me into the basement of some nutty professor, who strapped me into a faster-than-light missile he was about to test! Halfway to Pluto, I was intercepted by slavers looking for asteroid mining laborers. I beat off about thirty of 'em, but they just kept coming and coming. Just then I noticed", A(HOLE), " which led to a spot about four feet above the floor of the attic ... or what used to be the floor of the attic. Anyway, I got the ", PD(HEADLIGHT), "!\" ");
    heShe(true);
    tell(" points to the battered but usable ", PD(HEADLIGHT), " on the floor.\n");
    return true;
  } else if (!eq(G.here, BEDROOM) || !G.sheetHanging) {
    dequeue(iSidekickOutWindow);
    tell("\"Okay, forget the ", PD(HEADLIGHT), ",\" shrugs ", D(SIDEKICK), PERIOD_CR);
    return true;
  } else {
    move(FORD, G.here);
    remove(SIDEKICK);
    remove(HEADLIGHT);
    G.followFlag = 1;
    queue(iFollow, 2);
    clearFlag(HEADLIGHT, NDESCBIT);
    clearFlag(HEADLIGHT, TRYTAKEBIT);
    G.sidekickTripFlag = true;
    queue(iSidekickOutWindow, 1);
    tell(D(SIDEKICK), " climbs down the rope and unscrews the ", PD(HEADLIGHT), ". Suddenly, a truck barrels down the street and hits ", D(SIDEKICK), ", carrying ");
    himHer();
    tell(" out of sight. Moments later, you hear an explosion. As the smoke drifts past the window");
    return memoriam();
  }
}

defineObject(HEADLIGHT, 180, {
  desc: "headlight",
  synonym: ["HEADLIGHT", "LIGHT", "LIGH"],
  adjective: ["FORD", "HEAD"],
  flags: [TAKEBIT, TRYTAKEBIT, NDESCBIT],
  props: {
    [P.NO_T_DESC]: "headligh",
    [P.ACTION]: headlightF,
  },
});

export function headlightF(): any {
  if (verbIs(V.EXAMINE) && hasFlag(HEADLIGHT, TRYTAKEBIT)) {
    tell("It looks loose.\n");
    return true;
  } else if (isTouching(HEADLIGHT) && hasFlag(HEADLIGHT, TRYTAKEBIT)) {
    return cantReach(HEADLIGHT);
  }
  return false;
}

defineObject(FORD, 181, {
  desc: "Ford",
  synonym: ["FORD", "CAR", "AUTO"],
  adjective: ["NUMBER"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: fordF,
  },
});

export function fordF(): any {
  if (adjUsed(ADJ.NUMBER) && !eq(G.pNumber, 1933)) {
    return cantSee(FORD);
  } else if (isTouching(FORD)) {
    return cantReach(FORD);
  }
  return false;
}
