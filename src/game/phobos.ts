// phobos.ts — from PHOBOS.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  blocked, defineObject, per, to, toIf, toIfOpen,
} from "../engine/define.ts";
import {
  A, D, HEADER, PD, T, TR, clearFlag, crlf, eq, first, get, getp, hasFlag, isIn, loc, move, printd,
  prob, put, putp, remove, setFlag, tell,
} from "../engine/runtime.ts";
import {
  table,
} from "../engine/table.ts";
import {
  iSidekickOutWindow, lawnObjectF, undoTrap,
} from "./cleveland.ts";
import {
  adjUsed, andSidekick, cantReach, cantSee, doFirst, eagerlyAccepts, expletive, heShe, himHer, hisHer,
  incrementScore, noLid, openClosed, scratchNSniff, unimportantThingF,
} from "./globals.ts";
import {
  canalLoc, iOrphanage,
} from "./mars.ts";
import {
  dequeue, isQueued, perform, performPrsa, queue,
} from "./misc.ts";
import {
  P_NAMW, isLit, thisIsIt, zmemq,
} from "./parser.ts";
import {
  ccount, doWalk, finish, goto, iReply, isUltimatelyIn, isVisible, jigsUp, rob, stop, vFuck, vLeap,
  vLook, wastes, wrongSexWord,
} from "./verbs.ts";
import {
  ACTORBIT, ADJ, ALREADY_IS, ANTI_LGOP_MACHINE, ATTACK_FLEET, BABY, BASEMENT, BASKET, BEDROOM, BLANKET,
  BLENDER, BOUDOIR, BURNBIT, CANAL, CANAL_OBJECT, CANT_FROM_HERE, CANT_GO, CELL, CELL_OBJECT,
  CHOCOLATE, CLOSET, CONTBIT, COTTON_BALLS, CRAMPED_SPACE, DIVAN, DONT_WANT_TO, DOORBIT,
  EIGHTY_TWO_DEGREE_ANGLE, ELLIPSIS, END_OF_HALLWAY, EXAM_ROOM_DOOR, EYES, FEMALEBIT, FIRST_SLAB,
  FLYTRAP, FROG, FRONT_STOOP, G, GLOBAL_ROOM, GORILLA_ATE_CHOCOLATE, HEAD, HEADLIGHT, HOLE,
  HUMAN_ATE_CHOCOLATE, INDOORSBIT, JUNGLE, LEAVES, LEAVE_ME_ALONE, LGOP, LOCAL_GLOBALS,
  LOOKS_UNAPPETIZING, LOOK_AROUND, MAIN_HALL_OF_PALACE, MARTIAN_DESERT, MATCHBOOK, ME, MISSIONARY_ONLY,
  MOTHBALLS, MOUSE, MOUTH, MUNGBIT, M_END, M_ENTER, M_FATAL, M_LOOK, M_OBJDESC_Q, M_SMELL,
  NARROW_CELL_DOOR, NARTICLEBIT, NDESCBIT, NOSE, NOTHING_NEW, OBSERVATION_ROOM, ODD_MACHINE, ODOR,
  ONBIT, ONLY_BLACKNESS, OPENBIT, ORPHANAGE_DOOR, OTHER_CELL, P, PAINTING, PERIOD_CR, PHONE_BOOK,
  PHOTO, PLAZA, PLEASURE_PALACE_DESC, PLURALBIT, PRIVATE_BOUDOIR, PROTAGONIST, PSEUDO_OBJECT, READBIT,
  RLANDBIT, ROOF, ROOMS, RUBBER_HOSE, SALESMAN, SCRAP_OF_PAPER, SEARCHBIT, SECOND_SLAB, SHEET, SHELF,
  SIDEKICK, SIDEKICKS_BODY, SIGN, SIGN_AND_STAIRS, SMELLEDBIT, STAIRS, STALLION, STOOL, SURFACEBIT,
  TAKEBIT, TOUCHBIT, TRAY, TREE, TREE_HOLE, TRELLIS, TRYTAKEBIT, UNTEEDBIT, V, VEHBIT, W,
  WIDE_CELL_DOOR, WINDOW, YNH, YOU_CANT, YOU_CANT_SEE_ANY, prsiIs, prsoIs, verbIs,
} from "./world.ts";

defineObject(CELL_OBJECT, 201, {
  in: LOCAL_GLOBALS,
  desc: "cell",
  synonym: ["CELL"],
  adjective: ["PRISON", "OTHER"],
  props: {
    [P.ACTION]: cellObjectF,
  },
});

export function cellObjectF(): any {
  if (verbIs(V.ENTER, V.BOARD, V.WALK_TO)) {
    if (adjUsed(ADJ.OTHER) || adjUsed(ADJ.SMALL)) {
      if (eq(G.here, OTHER_CELL)) {
        tell(LOOK_AROUND);
        return true;
      } else if (eq(G.here, END_OF_HALLWAY)) {
        return doWalk(P.SOUTH);
      } else {
        tell(CANT_FROM_HERE);
        return true;
      }
    } else if (eq(G.here, CELL)) {
      tell(LOOK_AROUND);
      return true;
    } else if (eq(G.here, END_OF_HALLWAY)) {
      return doWalk(P.NORTH);
    } else {
      tell(CANT_FROM_HERE);
      return true;
    }
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (adjUsed(ADJ.OTHER) || adjUsed(ADJ.SMALL)) {
      if (eq(G.here, OTHER_CELL)) {
        return doWalk(P.NORTH);
      } else {
        tell(LOOK_AROUND);
        return true;
      }
    } else if (eq(G.here, CELL)) {
      return doWalk(P.SOUTH);
    } else if (eq(G.here, OTHER_CELL)) {
      return doWalk(P.NORTH);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.EXAMINE) && !eq(G.here, END_OF_HALLWAY)) {
    return vLook();
  } else if (verbIs(V.LOOK_INSIDE, V.OPEN, V.CLOSE)) {
    if (eq(G.here, END_OF_HALLWAY)) {
      if (adjUsed(ADJ.OTHER) || adjUsed(ADJ.SMALL)) {
        performPrsa(NARROW_CELL_DOOR);
      } else {
        performPrsa(WIDE_CELL_DOOR);
      }
    } else if (verbIs(V.LOOK_INSIDE)) {
      vLook();
    } else if (eq(G.here, CELL)) {
      performPrsa(WIDE_CELL_DOOR);
    } else {
      performPrsa(NARROW_CELL_DOOR);
    }
    return true;
  } else if (verbIs(V.PUT) && prsiIs(CELL_OBJECT)) {
    if (eq(G.here, END_OF_HALLWAY)) {
      tell(CANT_FROM_HERE);
      return true;
    } else {
      perform(V.DROP, G.prso);
      return true;
    }
  } else if (!eq(G.here, END_OF_HALLWAY) && prsoIs(CELL_OBJECT)) {
    performPrsa(GLOBAL_ROOM, G.prsi);
    return true;
  }
  return false;
}

defineObject(CELL, 202, {
  in: ROOMS,
  desc: "Cell",
  flags: [ONBIT, RLANDBIT, INDOORSBIT],
  global: [WIDE_CELL_DOOR, HOLE, CELL_OBJECT],
  exits: {
    SOUTH: toIfOpen(END_OF_HALLWAY, WIDE_CELL_DOOR),
    OUT: toIfOpen(END_OF_HALLWAY, WIDE_CELL_DOOR),
    UP: per(holeEnterF),
  },
  props: {
    [P.HOLE_DESTINATION]: MAIN_HALL_OF_PALACE,
    [P.ACTION]: cellF,
  },
});

export function cellF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("You are in a large cell with a soft, cushiony floor. A wide door (");
    if (hasFlag(WIDE_CELL_DOOR, OPENBIT)) {
      tell("now open");
    } else if (hasFlag(WIDE_CELL_DOOR, TOUCHBIT)) {
      tell("now closed");
    } else {
      tell("closed, naturally");
    }
    tell(") forms the southern wall of the cell");
    if (G.holeOpen) {
      tell(". A ", D(HOLE), " is lying on the ground amidst some rubble");
    }
    tell(".");
    return true;
  } else if (eq(rarg, M_END) && !G.trayDelivered) {
    G.trayDelivered = true;
    move(TRAY, G.here);
    tell("   Someone thrusts a tray into your cell. A ", D(CHOCOLATE), " on the tray", LOOKS_UNAPPETIZING);
    return true;
  } else if (eq(rarg, M_END) && isIn(SIDEKICK, G.here) && !G.cellGripe) {
    G.cellGripe = true;
    tell("   \"What a great cell!\" says ", D(SIDEKICK), ", looking around. \"Why didn't I get a cell like this? Maybe I shouldn't have kicked that guard ");
    if (eq(G.naughtyLevel, 1)) {
      tell("below the waist ");
    } else if (eq(G.naughtyLevel, 2)) {
      tell("in the nuts ");
    }
    tell("when I first got here...\"\n");
    return true;
  }
  return false;
}

export function holeEnterF(): any {
  if (G.holeOpen) {
    tell(YOU_CANT, "reach the hole in the ceiling.\n");
  } else {
    tell(CANT_GO);
  }
  return false;
}

G.cellGripe = false;

G.trayDelivered = false;

defineObject(BLANKET, 203, {
  in: CELL,
  desc: "blanket",
  synonym: ["BLANKET"],
  flags: [TAKEBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "blanke",
    [P.ACTION]: blanketF,
  },
});

export function blanketF(): any {
  if (hasFlag(BLANKET, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.MEASURE)) {
    tell("Small.\n");
    return true;
  } else if (verbIs(V.WEAR) || verbIs(V.WRAP) && prsiIs(ME)) {
    tell("It's too small; your jailors must have meant it to be used as a pillow.\n");
    return true;
  } else if (verbIs(V.BOARD)) {
    return wastes();
  } else if (verbIs(V.TIE)) {
    tell("The material of the blanket is too thick to knot.\n");
    return true;
  } else if (verbIs(V.REMOVE, V.TAKE) && isIn(BLANKET, BABY)) {
    perform(V.REMOVE, BABY);
    return true;
  } else if (verbIs(V.PUT) && prsiIs(BASKET)) {
    if (isIn(BLANKET, BABY)) {
      performPrsa(BABY, BASKET);
      return true;
    } else if (isIn(BABY, BASKET)) {
      move(BLANKET, BASKET);
      move(BABY, PROTAGONIST);
      performPrsa(BABY, BASKET);
      return true;
    }
    return false;
  } else if (verbIs(V.DROP, V.PUT, V.THROW) && prsoIs(BLANKET) && isIn(BLANKET, BABY)) {
    return doFirst("unwrap the baby");
  } else if (verbIs(V.LOOK_INSIDE) && isIn(BLANKET, BABY)) {
    perform(V.ALARM, BABY);
    return true;
  } else if (verbIs(V.PUT_ON) && prsoIs(BLANKET) && !hasFlag(G.prsi, SURFACEBIT)) {
    return wastes();
  }
  return false;
}

defineObject(PAINTING, 204, {
  in: CELL,
  desc: "painting",
  synonym: ["PAINTING", "PICTURE", "CAT", "PAINING"],
  adjective: ["PUSSY", "ART"],
  flags: [TAKEBIT, BURNBIT],
  props: {
    [P.FDESC]: "Hanging on the wall is a painting of a pussy cat.",
    [P.NO_T_DESC]: "paining",
    [P.ACTION]: paintingF,
  },
});

export function paintingF(): any {
  if (verbIs(V.EXAMINE) && !hasFlag(PAINTING, UNTEEDBIT)) {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("It's a good likeness of a pussy, but is it art?\n");
    return true;
  }
  return false;
}

defineObject(TRAY, 205, {
  desc: "tray",
  synonym: ["TRAY", "RAY"],
  flags: [TAKEBIT, SURFACEBIT, CONTBIT, OPENBIT, SEARCHBIT],
  props: {
    [P.NO_T_DESC]: "ray",
    [P.CAPACITY]: 20,
    [P.ACTION]: trayF,
  },
});

export function trayF(): any {
  if (verbIs(V.EXAMINE) && hasFlag(TRAY, UNTEEDBIT)) {
    tell("It looks a little like Ray whatsisname from second grade.\n");
    return true;
  }
  return false;
}

defineObject(CHOCOLATE, 206, {
  in: TRAY,
  synonym: ["FOOD", "HUNK", "CHOCOLATE", "CANDY"],
  adjective: ["BROWN", "LUSCIOUS", "MILK", "CREAMY"],
  flags: [TAKEBIT],
  props: {
    [P.SDESC]: "hunk of brown food",
    [P.NO_T_DESC]: "hunk of chocolae",
    [P.ACTION]: chocolateF,
  },
});

G.chocolateIdentified = false;

G.sugarRush = false;

export function chocolateF(): any {
  if (hasFlag(CHOCOLATE, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.EAT)) {
    if (!isUltimatelyIn(CHOCOLATE)) {
      tell(YNH, " it!\n");
      return true;
    }
    remove(CHOCOLATE);
    queue(iUnrush, 6);
    if (G.goneApe) {
      G.sugarRush = GORILLA_ATE_CHOCOLATE;
    } else {
      G.sugarRush = HUMAN_ATE_CHOCOLATE;
    }
    tell("Mmmm! ");
    if (G.chocolateIdentified) {
      tell("G");
    } else {
      tell("It's a piece of really g");
    }
    tell("ood chocolate! You feel yourself getting a sugar rush.\n");
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("The ", D(CHOCOLATE), LOOKS_UNAPPETIZING);
    return true;
  } else if (verbIs(V.TASTE)) {
    G.chocolateIdentified = true;
    putp(CHOCOLATE, P.SDESC, "hunk of chocolate");
    return false;
  } else if (verbIs(V.SMELL) && !hasFlag(CHOCOLATE, SMELLEDBIT)) {
    G.chocolateIdentified = true;
    setFlag(CHOCOLATE, SMELLEDBIT);
    putp(CHOCOLATE, P.SDESC, "hunk of chocolate");
    scratchNSniff(2);
    tell("Luscious, creamy milk chocolate!\n");
    return true;
  }
  return false;
}

export function iUnrush(): any {
  if (G.goneApe && eq(G.sugarRush, GORILLA_ATE_CHOCOLATE) || !G.goneApe && eq(G.sugarRush, HUMAN_ATE_CHOCOLATE)) {
    G.sugarRush = false;
    tell("   You feel the sugar rush ebb.\n");
    return true;
  } else {
    G.sugarRush = false;
    return false;
  }
}

defineObject(WIDE_CELL_DOOR, 207, {
  in: LOCAL_GLOBALS,
  desc: "wide cell door",
  synonym: ["DOOR"],
  adjective: ["NORTH", "WIDE", "CELL"],
  flags: [DOORBIT],
});

defineObject(OTHER_CELL, 208, {
  in: ROOMS,
  desc: "Other Cell",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [NARROW_CELL_DOOR, CELL_OBJECT],
  exits: {
    NORTH: toIfOpen(END_OF_HALLWAY, NARROW_CELL_DOOR),
    OUT: toIfOpen(END_OF_HALLWAY, NARROW_CELL_DOOR),
  },
  props: {
    [P.ACTION]: otherCellF,
  },
});

export function otherCellF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !hasFlag(OTHER_CELL, TOUCHBIT)) {
    thisIsIt(SIDEKICK);
    queue(iBlueprint, 19);
    if (eq(G.verbosity, 0)) {
      return false;
    }
    tell("As you enter, a ");
    if (!G.male) {
      tell("wo");
    }
    tell("man sitting limply in the shadows stiffens and rises to ");
    hisHer();
    tell(" feet. \"A human! They got you too? I've been here a week. When you opened the door, I figured it was a guard! Was it unlocked? I never thought of trying it. By the way, my name's ", D(SIDEKICK), ". From Alaska. I'm not too bright, but I'm strong as an ox, and I'm great with my hands. Maybe we can lick these Leather Goddesses together.\"\n\n");
    return true;
  } else if (eq(rarg, M_LOOK)) {
    tell("You are in a very tiny room with a rock-hard floor. A ", PD(NARROW_CELL_DOOR), " to the north is ");
    openClosed(NARROW_CELL_DOOR);
    tell(".");
    return true;
  }
  return false;
}

defineObject(NARROW_CELL_DOOR, 209, {
  in: LOCAL_GLOBALS,
  desc: "narrow cell door",
  synonym: ["DOOR"],
  adjective: ["SOUTH", "NARROW", "CELL"],
  flags: [DOORBIT],
  props: {
    [P.ACTION]: narrowCellDoorF,
  },
});

export function narrowCellDoorF(): any {
  if (verbIs(V.KNOCK) && isIn(SIDEKICK, OTHER_CELL)) {
    tell("A muffled voice responds, \"Beat it, you alien fruitcake freako mutant weirdo scum!\"\n");
    return true;
  }
  return false;
}

defineObject(SIDEKICK, 210, {
  in: OTHER_CELL,
  synonym: ["TIFFAN", "TIFF", "TRENT", "BODY"],
  adjective: ["TRENT", "TIFFAN", "TIFF'S"],
  flags: [NARTICLEBIT, ACTORBIT, CONTBIT, OPENBIT, SEARCHBIT],
  props: {
    // "" in the source, which the original compiled as this unrelated text:
    [P.SDESC]: "A crumpled paper lies discarded in the corner. There seems to be some writing on it.",
    [P.DESCFCN]: sidekickF,
    [P.GENERIC]: genericSidekickF,
    [P.ACTION]: sidekickF,
  },
});

export function sidekickF(oarg: any = false): any {
  if (oarg) {
    if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    tell("   ", D(SIDEKICK), " is here, ");
    sidekickDesc();
    tell(".");
    return true;
  } else if (eq(SIDEKICK, G.winner)) {
    if (verbIs(V.WHAT)) {
      perform(V.TELL_ABOUT, ME, G.prso);
      return true;
    } else if (verbIs(V.READ) && prsoIs(SCRAP_OF_PAPER)) {
      perform(V.TELL_ABOUT, ME, SCRAP_OF_PAPER);
      return true;
    } else if (verbIs(V.TELL_ABOUT) && prsoIs(ME)) {
      if (prsiIs(ODD_MACHINE) && !isIn(ODD_MACHINE, SALESMAN)) {
        tell("\"Hmmm, tee remover. For cleaning up golf courses?\"\n");
        return true;
      } else if (prsiIs(SCRAP_OF_PAPER)) {
        tell("\"I dunno what it means; I doodled it one night in my sleep!\"\n");
        return true;
      } else if (prsiIs(MATCHBOOK) && !isQueued(iBlueprint)) {
        return scrapeUpTheseItems();
      } else if (prsiIs(LGOP)) {
        tell("\"No doubt some gang of interplanetary floozies who get their jollies from enslaving defenseless planets. We'll stop 'em!\"\n");
        return true;
      } else {
        tell(D(SIDEKICK), " shrugs. \"What do I know? I'm from Alaska,\" ");
        heShe();
        tell(" says, in a burst of insecurity that will no doubt ease in a quarter-century or so when Alaska becomes a state.\n");
        return true;
      }
    } else if (verbIs(V.WALK)) {
      tell("\"After you!\"\n");
      return true;
    } else if (verbIs(V.FOLLOW) && prsoIs(ME)) {
      tell("\"Lead on!\"\n");
      return true;
    } else if (verbIs(V.HELLO)) {
      tell("\"Hi!\"\n");
      return true;
    } else if (verbIs(V.DISEMBARK, V.ENTER, V.EXIT) && prsoIs(WINDOW) && eq(G.here, BEDROOM)) {
      if (G.sidekickTripFlag) {
        tell("\"Not again!\"\n");
        return true;
      } else if (isQueued(iSidekickOutWindow)) {
        tell("\"Gimme a second to get ready!\"\n");
        return true;
      } else {
        tell("\"I'm dumb, but not that dumb!\"\n");
        return true;
      }
    } else if (verbIs(V.KISS) && prsoIs(FROG)) {
      tell("\"I'd sooner kiss a pig!\"\n");
      return true;
    } else if (verbIs(V.RAISE) && prsoIs(ME) && eq(loc(PROTAGONIST), TREE_HOLE, CLOSET)) {
      G.winner = PROTAGONIST;
      perform(V.CLIMB_ON, SIDEKICK);
      G.winner = SIDEKICK;
      return true;
    } else if (verbIs(V.TAKE) && prsoIs(HEADLIGHT) && hasFlag(HEADLIGHT, TRYTAKEBIT)) {
      G.winner = PROTAGONIST;
      perform(V.SHOW, HEADLIGHT, SIDEKICK);
      G.winner = SIDEKICK;
      return true;
    } else if (verbIs(V.GIVE) && prsiIs(ME)) {
      G.winner = PROTAGONIST;
      perform(V.ASK_FOR, SIDEKICK, G.prso);
      G.winner = SIDEKICK;
      return true;
    } else if (verbIs(V.SGIVE)) {
      return false;
    } else if (verbIs(V.MAKE) && prsoIs(ANTI_LGOP_MACHINE)) {
      tell("\"Don't crowd me.\"\n");
      return true;
    } else {
      tell(D(SIDEKICK), " is ");
      sidekickDesc();
      tell(" and fails to notice that you've spoken.\n");
      return stop();
    }
  } else if (wrongSexWord(SIDEKICK, W.TRENT, W.TIFFAN)) {
    return stop();
  } else if (wrongSexWord(SIDEKICK, W.TRENT, W.TIFF)) {
    return stop();
  } else if (verbIs(V.EXAMINE)) {
    tell(D(SIDEKICK), " is about your age");
    if (!eq(G.naughtyLevel, 0)) {
      tell(" and has a body worthy of envy: tall and well-built, with wide shoulders, ");
      if (G.male) {
        tell("massive pectorals, and thick");
      } else {
        tell("a generous bosom, slim waist, and long");
      }
      tell(", tawny legs. The only minus seems to be slightly oversized feet, but even oversized feet are a plus if you're into toe-sucking");
    }
    tell(".");
    if (first(SIDEKICK)) {
      tell(" ");
      return false;
    } else {
      crlf();
      return true;
    }
  } else if (verbIs(V.ASK_FOR) && prsoIs(SIDEKICK)) {
    if (isUltimatelyIn(G.prsi, SIDEKICK)) {
      move(G.prsi, PROTAGONIST);
      tell("\"What's mine is yours!\"\n");
      return true;
    } else {
      tell("\"I haven't got", A(G.prsi), "!\"\n");
      return true;
    }
  } else if (verbIs(V.FOLLOW)) {
    if (eq(G.followFlag, 1)) {
      perform(V.CLIMB_DOWN, SHEET);
      return true;
    } else if (eq(G.followFlag, 2)) {
      tell(DONT_WANT_TO);
      return true;
    } else if (eq(G.followFlag, 3)) {
      perform(V.ENTER, CANAL_OBJECT);
      return true;
    }
    return false;
  } else if (verbIs(V.UNTIE)) {
    performPrsa(SIDEKICKS_BODY);
    return true;
  } else if (verbIs(V.TIE) && prsiIs(FIRST_SLAB, SECOND_SLAB)) {
    performPrsa(SIDEKICKS_BODY);
    return true;
  } else if (verbIs(V.CLIMB_ON, V.BOARD, V.STAND_ON)) {
    if (isIn(PROTAGONIST, TREE_HOLE) || eq(G.here, CLOSET) && first(SHELF)) {
      tell("Using ", D(SIDEKICK), "'s shoulders, you ");
      if (isIn(PROTAGONIST, TREE_HOLE)) {
        move(PROTAGONIST, G.here);
        move(SIDEKICK, G.here);
        tell("climb out of the hole and help ", D(SIDEKICK), " out");
      } else {
        rob(SHELF, PROTAGONIST);
        tell("get everything from the shelf");
      }
      tell(PERIOD_CR);
      return true;
    } else {
      return wastes();
    }
  } else if (verbIs(V.PUSH) && prsiIs(TREE_HOLE)) {
    tell(D(SIDEKICK), " grabs wildly at you, pulling both of you into the hole");
    if (hasFlag(TRELLIS, MUNGBIT)) {
      if (G.leavesPlaced) {
        move(LEAVES, TREE_HOLE);
      }
      remove(TRELLIS);
      undoTrap();
      tell(" with a crash of splintering wood");
    }
    tell(". ");
    if (isIn(FLYTRAP, TREE_HOLE)) {
      perform(V.ENTER, TREE_HOLE);
      return true;
    } else {
      move(PROTAGONIST, TREE_HOLE);
      move(SIDEKICK, TREE_HOLE);
      if (isIn(TRELLIS, PROTAGONIST)) {
        move(TRELLIS, G.here);
      }
      tell("\"Brilliant move, bozo,\" says ", D(SIDEKICK), PERIOD_CR);
      return true;
    }
  } else if (verbIs(V.GIVE) && eq(G.here, PLAZA)) {
    if (prsoIs(get(PARTS_LIST, G.plazaCounter - 1)) && !hasFlag(G.prso, UNTEEDBIT)) {
      remove(G.prso);
      G.rightPart = true;
      tell(D(SIDEKICK), " grabs", T(G.prso), " and quickly incorporates it into ");
      hisHer();
      tell(" contraption.\n");
    } else {
      tell(D(SIDEKICK), " gives", T(G.prso), " the barest glance. \"No good! It has to be a");
      printPart();
      tell("!\"\n");
    }
    return M_FATAL;
  } else if (verbIs(V.GIVE) && zmemq(G.prso, PARTS_LIST, 7) && !hasFlag(G.prso, UNTEEDBIT)) {
    eagerlyAccepts();
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.SHOW)) {
    if (prsoIs(HEADLIGHT) && hasFlag(HEADLIGHT, TRYTAKEBIT)) {
      tell("\"Can't reach it from here!\"\n");
      return true;
    } else if (prsoIs(SCRAP_OF_PAPER)) {
      perform(V.ASK_ABOUT, SIDEKICK, SCRAP_OF_PAPER);
      return true;
    } else if (zmemq(G.prso, PARTS_LIST, 7) && !hasFlag(G.prso, UNTEEDBIT)) {
      tell("\"Hey, wow!\" says ", D(SIDEKICK), ", clearly impressed by your discovery of", TR(G.prso));
      return true;
    }
    return false;
  }
  return false;
}

export function sidekickDesc(): any {
  if (G.plazaCounter > 0) {
    tell("busy with", T(ANTI_LGOP_MACHINE));
    return true;
  } else if (eq(G.here, BOUDOIR)) {
    tell("lying on another couch");
    return true;
  } else if (prob(33)) {
    tell("alertly surveying your surroundings");
    return true;
  } else if (prob(50) && !G.sidekicksBodyTiedToSlab) {
    tell("doing some quick limbering exercises");
    return true;
  } else {
    tell("counting on ");
    hisHer();
    tell(" fingers and mumbling to ");
    himHer();
    tell("self");
    return true;
  }
}

export function genericSidekickF(): any {
  if (eq(get(P_NAMW, 0), W.BODY) || eq(get(P_NAMW, 1), W.BODY)) {
    return false;
  } else {
    return SIDEKICK;
  }
}

G.sidekickExploded = 0;

G.sidekickTripFlag = false;

G.sidekickDrowned = false;

G.sidekickEaten = false;

export function memoriam(): any {
  tell(", ", PD(EYES), " fill with tears. You hang ", PD(HEAD), " in sorrow for a moment to honor your brave, loyal companion who gave ");
  hisHer();
  tell(" life that humanity might be safe from the terrible scourge of ", PD(LGOP), PERIOD_CR);
  return true;
}

defineObject(SCRAP_OF_PAPER, 211, {
  in: OTHER_CELL,
  desc: "scrap of paper",
  synonym: ["SCRAP", "PAPER"],
  adjective: ["DISCARDED", "CRUMPLED"],
  flags: [TAKEBIT, BURNBIT, READBIT],
  props: {
    [P.FDESC]: "A crumpled paper lies discarded in the corner. There seems to be some writing on it.",
    [P.SIZE]: 2,
    [P.ACTION]: scrapOfPaperF,
  },
});

/**
 * SCRAP-OF-PAPER-F. Release 59 was built from an earlier version of the paper:
 * it had no action routine, and READ printed its TEXT property (the matrix,
 * then CR). So READ only shows the matrix when the paper is the direct object
 * ("read trent with paper" is refused by V-READ), and the matrix ends with CR.
 * The source's fixed-pitch switch is kept so the browser prints the grid in a
 * monospaced font; it does not change the text.
 */
export function scrapOfPaperF(): any {
  if (verbIs(V.READ) && prsoIs(SCRAP_OF_PAPER)) {
    tell("There's a seemingly meaningless matrix of letters on the paper:\n");
    put(HEADER, 8, get(HEADER, 8) | 2);
    tell("   HESOHREBBUR\n   ILSSSIPNGEF\n   RGIUGHTHDEN\n   SNKOOBENOHP\n   FALYTMERATP\n   SHEADLIGHTO\n   SLLABNOTTOC");
    put(HEADER, 8, get(HEADER, 8) & -3);
    tell("\n");
    return true;
  }
  return false;
}

G.holeOpen = false;

defineObject(CRAMPED_SPACE, 212, {
  in: ROOMS,
  desc: "Cramped Space",
  flags: [INDOORSBIT],
  things: [
    { adjective: null, noun: "HOLE", action: crampedSpaceHoleF },
  ],
  exits: {
    DOWN: toIf(CELL, "holeOpen"),
  },
  props: {
    [P.ACTION]: crampedSpaceF,
  },
});

export function crampedSpaceF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !G.holeOpen) {
    return queue(iCrampedSpace, 2);
  } else if (eq(rarg, M_LOOK)) {
    tell("You are in a dark space, too tiny to move around in. The");
    if (G.holeOpen) {
      tell(" only exit is a hole in the floor.");
      return true;
    } else {
      tell("re are no visible exits.");
      return true;
    }
  }
  return false;
}

export function iCrampedSpace(): any {
  tell("   Suddenly, part of the floor collapses, and you");
  andSidekick();
  tell(" tumble through the resulting hole", ELLIPSIS);
  goto(CELL, true);
  if (isIn(SIDEKICK, CRAMPED_SPACE)) {
    move(SIDEKICK, G.here);
  }
  G.holeOpen = true;
  clearFlag(CRAMPED_SPACE, TOUCHBIT);
  tell("   Among the new rubble, you notice", A(HOLE), ", attached to a piece of (what used to be) the floor of the cramped space.\n");
  cellF(M_END);
  return true;
}

export function crampedSpaceHoleF(): any {
  if (!G.holeOpen) {
    return cantSee(PSEUDO_OBJECT);
  } else if (verbIs(V.CLIMB_DOWN, V.STAND_ON, V.ENTER, V.BOARD)) {
    return doWalk(P.DOWN);
  }
  return false;
}

defineObject(END_OF_HALLWAY, 213, {
  in: ROOMS,
  desc: "End of Hallway",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [SIGN, WIDE_CELL_DOOR, NARROW_CELL_DOOR, EXAM_ROOM_DOOR, CELL_OBJECT, STAIRS],
  exits: {
    WEST: per(examinationRoomF),
    EAST: per(otherEndOfHallwayF),
    NORTH: toIfOpen(CELL, WIDE_CELL_DOOR),
    SOUTH: toIfOpen(OTHER_CELL, NARROW_CELL_DOOR),
    UP: to(OBSERVATION_ROOM),
    DOWN: to(BASEMENT),
  },
  props: {
    [P.ACTION]: endOfHallwayF,
  },
});

export function endOfHallwayF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("A ", PD(WIDE_CELL_DOOR), " lies ");
    openClosed(WIDE_CELL_DOOR);
    tell(" to the north, and", A(NARROW_CELL_DOOR), " lies ");
    openClosed(NARROW_CELL_DOOR);
    tell(" to the south. The hallway ends at a gleaming ", PD(EXAM_ROOM_DOOR), " to the west, and continues east. Something, possibly this very sentence, tells you that it would be dangerous to travel east or west", SIGN_AND_STAIRS);
    return true;
  }
  return false;
}

defineObject(EXAM_ROOM_DOOR, 214, {
  in: LOCAL_GLOBALS,
  desc: "metal door",
  synonym: ["DOOR"],
  adjective: ["WEST", "GLEAMING", "METAL"],
  flags: [NDESCBIT, DOORBIT],
});

G.seenExaminationRoom = false;

export function examinationRoomDesc(viewing: any = false): any {
  tell("A number of hideous experiments fill th");
  if (viewing) {
    tell("e");
  } else {
    tell("is");
  }
  tell(" room. Their obvious purpose: studies of the human anatomy");
  if (!eq(G.naughtyLevel, 1)) {
    tell(", especially those parts rarely referred to in the New York Times");
  }
  tell(". A pathetic-looking human is the current subject; however, even an author as fond of lascivious detail as this one would hesitate to describe it ");
  if (eq(G.naughtyLevel, 2)) {
    tell("even in LEWD mode, except to mention that it involves a lot of lubricants, some plastic tubing, and a yak.\n");
    return true;
  } else {
    tell("to someone who's merely in ");
    if (eq(G.naughtyLevel, 0)) {
      tell("TAME");
    } else {
      tell("SUGGESTIVE");
    }
    tell(" mode.\n");
    return true;
  }
}

export function examinationRoomF(): any {
  if (hasFlag(EXAM_ROOM_DOOR, OPENBIT)) {
    tell("\"Examination\" Room\n   ");
    if (G.seenExaminationRoom) {
      tell("The experiments look even more horrible from here than from the Observation Room window.\n");
    } else {
      examinationRoomDesc();
    }
    tell("   Before you've really gotten as sick as you know you could get, one of the");
    return leckbandi();
  } else {
    thisIsIt(EXAM_ROOM_DOOR);
    doFirst("open", EXAM_ROOM_DOOR);
    return false;
  }
}

export function otherEndOfHallwayF(): any {
  tell("Other End of Hallway\n   Before you can even begin to wonder what happened to the middle of the hallway, a guard patrol erupts from the shadows. A");
  return leckbandi();
}

export function leckbandi(): any {
  return jigsUp(" tall, neatly dressed Leckbandi tucks you under its arm. (The Leckbandi, who evolved in the asteroid belt, all work exclusively as security guards. This is odd, since there's not a single thing in the entire asteroid belt worth stealing.)\n   Consulting a wrist computer, the Leckbandi punches in notable features of your appearance: size, number of heads, lack of feathers, and so forth. Eventually, the tiny screen flashes: \"IDENTIFICATION COMPLETED: Prisoner, human, escaped. DISPOSITION: Death, painful, immediate.\" The Leckbandi, who, like all Leckbandis, prides itself on its ability to follow the orders of wrist computers, immediately and painfully kills you.");
}

defineObject(BASEMENT, 215, {
  in: ROOMS,
  desc: "Basement",
  flags: [ONBIT, RLANDBIT, INDOORSBIT],
  global: [STAIRS],
  things: [
    { adjective: null, noun: "LIGHT", action: unimportantThingF },
  ],
  exits: {
    UP: to(END_OF_HALLWAY),
    OUT: to(END_OF_HALLWAY),
  },
  props: {
    [P.LDESC]: "This is a moist cellar. Soft light trickles down the stairway.",
  },
});

defineObject(OBSERVATION_ROOM, 216, {
  in: ROOMS,
  desc: "Observation Room",
  flags: [ONBIT, RLANDBIT, INDOORSBIT],
  global: [WINDOW, SIGN, STAIRS],
  things: [
    { adjective: "SMALL", noun: "CLOSET", action: closetObjectF },
  ],
  exits: {
    NORTH: to(CLOSET),
    WEST: blocked("You discover that the window makes a pleasant \"boing\" noise when a human nose is pushed into it at approximately walking speed."),
    IN: to(CLOSET),
    DOWN: to(END_OF_HALLWAY),
    UP: to(ROOF),
  },
  props: {
    [P.ACTION]: observationRoomF,
  },
});

export function observationRoomF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("Calvin Coolidge once described windows as \"rectangles of glass.\" If so, he may have been thinking about the window which fills the western wall of this room. A tiny closet lies to the north", SIGN_AND_STAIRS);
    return true;
  }
  return false;
}

defineObject(CLOSET, 217, {
  in: ROOMS,
  desc: "Closet",
  flags: [RLANDBIT, INDOORSBIT],
  global: [HOLE, ODOR],
  things: [
    { adjective: "SMALL", noun: "CLOSET", action: closetObjectF },
  ],
  exits: {
    SOUTH: per(closetExitF),
    OUT: per(closetExitF),
  },
  props: {
    [P.HOLE_DESTINATION]: JUNGLE,
    [P.ODOR]: "mothballs",
    [P.ODOR_NUMBER]: 3,
    [P.ACTION]: closetF,
  },
});

export function closetF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This room is barely large enough to turn around in. Just to prove it, you turn around. As you do, you spot", A(HOLE), ", about two feet across, seemingly painted on the floor in the corner. A shelf protrudes from one wall, very close to the ceiling. The closet is open to the south.");
    if (!hasFlag(NOSE, MUNGBIT)) {
      tell(" A strong odor ");
      if (hasFlag(G.here, SMELLEDBIT)) {
        tell("of ", PD(MOTHBALLS), " ");
      }
      tell("pervades the closet.");
    }
    return true;
  } else if (eq(rarg, M_SMELL)) {
    tell("Apparently this section of Phobos has a significant moth problem.");
    return true;
  }
  return false;
}

export function closetExitF(): any {
  tell("Ah! Coming out of the closet, I see", ELLIPSIS);
  return OBSERVATION_ROOM;
}

export function closetObjectF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, CLOSET)) {
      tell(LOOK_AROUND);
      return true;
    } else if (eq(G.here, OBSERVATION_ROOM)) {
      return doWalk(P.NORTH);
    }
    return false;
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    if (eq(G.here, CLOSET)) {
      return doWalk(P.SOUTH);
    } else {
      tell(LOOK_AROUND);
      return true;
    }
  } else if (verbIs(V.OPEN, V.CLOSE)) {
    tell("No door.\n");
    return true;
  } else if (verbIs(V.SMELL) && eq(G.here, CLOSET)) {
    performPrsa(ODOR);
    return true;
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    if (eq(G.here, CLOSET)) {
      return vLook();
    } else {
      tell(ONLY_BLACKNESS);
      return true;
    }
  }
  return false;
}

defineObject(SHELF, 218, {
  in: CLOSET,
  desc: "shelf",
  synonym: ["SHELF", "LEDGE"],
  flags: [SURFACEBIT, SEARCHBIT, CONTBIT, OPENBIT, NDESCBIT],
  props: {
    [P.CAPACITY]: 40,
    [P.ACTION]: shelfF,
  },
});

export function shelfF(): any {
  if (verbIs(V.PUT_ON, V.PUT) && prsiIs(SHELF) && !isIn(PROTAGONIST, STOOL)) {
    return cantReach(SHELF);
  }
  return false;
}

defineObject(BASKET, 219, {
  in: SHELF,
  desc: "wicker basket",
  synonym: ["BASKET", "BASKE"],
  adjective: ["WICKER"],
  flags: [CONTBIT, SEARCHBIT, OPENBIT, TAKEBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "wicker baske",
    [P.CAPACITY]: 40,
    [P.ACTION]: basketF,
  },
});

export function basketF(): any {
  if (hasFlag(BASKET, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.EXAMINE)) {
    tell("The basket is oval-shaped. A handle spans the narrow part.\n");
    return true;
  } else if (verbIs(V.MEASURE)) {
    tell("The basket is about fifteen by thirty inches.\n");
    return true;
  } else if (verbIs(V.CLOSE)) {
    return noLid();
  } else if (verbIs(V.PUT, V.PUT_NEAR) && prsiIs(ORPHANAGE_DOOR)) {
    perform(V.PUT_ON, BASKET, FRONT_STOOP);
    return true;
  } else if (takeBabyFromStoop(BASKET)) {
    return true;
  }
  return false;
}

export function takeBabyFromStoop(obj: any): any {
  if (verbIs(V.TAKE) && prsoIs(obj) && isQueued(iOrphanage) && ccount(PROTAGONIST) < 11) {
    dequeue(iOrphanage);
    return false;
  }
  return false;
}

defineObject(MOTHBALLS, 220, {
  in: CLOSET,
  desc: "mothballs",
  synonym: ["MOTHBALL", "BALL", "BALLS"],
  adjective: ["MOTH"],
  flags: [NARTICLEBIT, NDESCBIT],
  props: {
    [P.ACTION]: mothballsF,
  },
});

export function mothballsF(): any {
  if (eq(G.here, CLOSET)) {
    tell(YOU_CANT_SEE_ANY, PD(MOTHBALLS), " here. It must be some imitation mothball air mist.\n");
    return true;
  }
  return false;
}

defineObject(ROOF, 221, {
  in: ROOMS,
  desc: "Roof",
  flags: [RLANDBIT, ONBIT],
  global: [STAIRS, HOLE],
  things: [
    { adjective: null, noun: "ROOF", action: roofObjectF },
  ],
  exits: {
    DOWN: to(OBSERVATION_ROOM),
    IN: to(OBSERVATION_ROOM),
  },
  props: {
    [P.HOLE_DESTINATION]: MARTIAN_DESERT,
    [P.ACTION]: roofF,
  },
});

export function roofF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("Your view extends to the horizon, which on tiny Phobos usually means a few hundred feet. Thrusting up into sight beyond the horizon are", PLEASURE_PALACE_DESC, PD(LGOP), ". On a wide plain between here and the palace, powerful warships are poised for the imminent invasion of Earth.\n   Mars dominates the view, a dull red orb spanning a quarter of the sky. Bright blue canals lace the surface, and white caps of ice are visible at both poles.\n   A stairway leads down into the building. Near the edge, seemingly painted onto the roof, is", A(HOLE), ". You might be able to jump to the ground, but frankly we advise against it.");
    return true;
  }
  return false;
}

export function roofObjectF(): any {
  if (verbIs(V.LEAP_OFF, V.DISEMBARK) || verbIs(V.TAKE_OFF) && eq(G.pPrsaWord, W.GET)) {
    G.prso = false;
    return vLeap();
  } else if (verbIs(V.EXAMINE)) {
    return vLook();
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

export function iBlueprint(): any {
  if (isVisible(SIDEKICK) && isLit(G.here) && !eq(loc(SIDEKICK), SECOND_SLAB, STALLION) && !isQueued(iSidekickOutWindow)) {
    move(MATCHBOOK, PROTAGONIST);
    tell("   ", D(SIDEKICK), " trots over to you. \"I've got a plan to bring these Leather Goddess jokers to their knees,\" ");
    heShe();
    tell(" says, flipping you a ", PD(MATCHBOOK), ". ");
    coverFilledWithNotes();
    return scrapeUpTheseItems();
  } else {
    queue(iBlueprint, 3);
    return false;
  }
}

export function scrapeUpTheseItems(): any {
  tell("\"If we can scrape up these items, I can whip up something that'll knock 'em cold! A ", PD(ANTI_LGOP_MACHINE), "!!!\"\n");
  return true;
}

export const PARTS_LIST = table("PARTS-LIST", [
    BLENDER,
    RUBBER_HOSE,
    COTTON_BALLS,
    EIGHTY_TWO_DEGREE_ANGLE,
    HEADLIGHT,
    MOUSE,
    PHOTO,
    PHONE_BOOK,
  ]);

defineObject(MATCHBOOK, 222, {
  desc: "matchbook",
  synonym: ["MATCHBOOK", "MACHBOOK", "BOOK", "COVER"],
  adjective: ["EMPTY", "MATCH", "MACH", "MATCHBOOK", "MATCHES", "BLUEPR", "NOTES", "NOTATI"],
  flags: [READBIT, TAKEBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "machbook",
    [P.SIZE]: 2,
    [P.ACTION]: matchbookF,
  },
});

export function matchbookF(): any {
  if (hasFlag(MATCHBOOK, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.KILL) && eq(G.pPrsaWord, W.STRIKE)) {
    perform(V.ON, MATCHBOOK);
    return true;
  } else if (verbIs(V.OPEN, V.COUNT, V.LOOK_INSIDE, V.ON)) {
    tell("You briefly open the ", PD(MATCHBOOK), " and see that there are no matches left.\n");
    return true;
  } else if (verbIs(V.CLOSE)) {
    tell(ALREADY_IS);
    return true;
  } else if (verbIs(V.READ)) {
    tell("Most of the scrawlings are a \"blueprint\" for a vastly complicated device. Below that is a parts list:\n   1.", A(BLENDER), "\n   2. six feet of ", PD(RUBBER_HOSE), "\n   3. a ", PD(COTTON_BALLS), "\n   4. an ", PD(EIGHTY_TWO_DEGREE_ANGLE), "\n   5. a ", PD(HEADLIGHT), " from any 1933 Ford\n   6. a white mouse\n   7. any size ", D(PHOTO), "\n   8. a copy of", T(PHONE_BOOK), "\n");
    return true;
  } else if (verbIs(V.EXAMINE)) {
    coverFilledWithNotes();
    perform(V.OPEN, MATCHBOOK);
    return true;
  }
  return false;
}

export function coverFilledWithNotes(): any {
  tell("The cover of the ", PD(MATCHBOOK), " is filled with scrawled notations. ");
  return true;
}

defineObject(BOUDOIR, 223, {
  in: ROOMS,
  desc: "Boudoir",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [ODOR],
  props: {
    [P.ODOR]: "leather",
    [P.ODOR_NUMBER]: 6,
    [P.ACTION]: boudoirF,
  },
});

export function boudoirF(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    move(PROTAGONIST, DIVAN);
    return queue(iBoudoir, 6);
  } else if (eq(rarg, M_LOOK)) {
    tell("There is only enough light here to make out vague shapes. ");
    if (isIn(PROTAGONIST, DIVAN)) {
      tell("You seem to be lying on a plush divan. ");
    }
    notAloneOnDivan();
    if (!hasFlag(NOSE, MUNGBIT)) {
      tell(" A pleasing odor ");
      if (hasFlag(G.here, SMELLEDBIT)) {
        tell("of leather ");
      }
      tell("comes from close by.");
    }
    return true;
  } else if (eq(rarg, M_SMELL)) {
    tell("Someone nearby is wearing leather. Lots of leather.");
    return true;
  }
  return false;
}

export function notAloneOnDivan(): any {
  tell("You hear heavy breathing from nearby");
  if (isIn(PROTAGONIST, DIVAN)) {
    tell(", and realize that you are not alone on the couch");
  }
  tell(".");
  return true;
}

defineObject(DIVAN, 224, {
  in: BOUDOIR,
  desc: "divan",
  synonym: ["DIVAN", "COUCH"],
  adjective: ["PLUSH"],
  flags: [VEHBIT, OPENBIT, CONTBIT, SEARCHBIT, NDESCBIT],
  props: {
    [P.CAPACITY]: 100,
  },
});

export function iBoudoir(notCalledByFuck: any = true): any {
  tell("   You hear a click, and ");
  if (!isIn(PROTAGONIST, G.here)) {
    tell("leap to your feet as ");
  }
  tell("the room is flooded with light!\n\n", PD(G.here), "\n   Oh, no! You have violated the sanctity of a boudoir! And not just any old boudoir, but an", PRIVATE_BOUDOIR, "! And not just any old", PRIVATE_BOUDOIR, ", but an", PRIVATE_BOUDOIR, " belonging to ", PD(LGOP), "!\n   \"The escaped prisoner");
  if (isVisible(SIDEKICK)) {
    tell("s");
  }
  tell("!\" cries one of ", PD(LGOP), ". \"Sound the alarm!\"\n   \"Inform the guards!\" yells another.\n   \"Call out the army!\"\n   \"Alert the space fleet!\"\n   \"Summon my masseur,\" says the single unfrantic Goddess, calmly pulling a lever. As the floor opens up, you");
  andSidekick();
  tell(" plunge down a long chute", ELLIPSIS);
  incrementScore(9, 13);
  goto(PLAZA, true);
  if (isUltimatelyIn(SIDEKICK, BOUDOIR)) {
    move(SIDEKICK, PLAZA);
  }
  if (notCalledByFuck && !verbIs(V.WAIT)) {
    plazaF(M_END);
  }
  return true;
}

defineObject(LGOP, 225, {
  in: DIVAN,
  desc: "the Leather Goddesses of Phobos",
  synonym: ["PHOBOS", "GODDESSES", "SHAPE", "SHAPES"],
  adjective: ["LEATHER", "COUCHMATE"],
  flags: [NDESCBIT, NARTICLEBIT, ACTORBIT, FEMALEBIT, PLURALBIT],
  props: {
    [P.ACTION]: lgopF,
  },
});

export function lgopF(): any {
  if (eq(LGOP, G.winner)) {
    if (verbIs(V.KISS) && prsoIs(ME)) {
      G.winner = PROTAGONIST;
      performPrsa(LGOP);
      G.winner = LGOP;
      return true;
    } else if (verbIs(V.FUCK, V.TAKE) && prsoIs(ME)) {
      G.winner = PROTAGONIST;
      perform(V.FUCK, LGOP);
      G.winner = LGOP;
      return true;
    } else if (eq(G.naughtyLevel, 0)) {
      tell(LEAVE_ME_ALONE);
      return true;
    } else {
      tell("\"Shut up and kiss me, honey.\"\n");
      return stop();
    }
  } else if (verbIs(V.EXAMINE)) {
    tell("The lighting is too dim to see more than vague shapes.");
    if (!eq(G.naughtyLevel, 0)) {
      tell(" But very shapely shapes!");
    }
    crlf();
    return true;
  } else if (verbIs(V.TOUCH, V.FUCK, V.KISS) && eq(G.naughtyLevel, 0)) {
    tell("You're pushed away. ", LEAVE_ME_ALONE);
    return true;
  } else if (verbIs(V.EAT)) {
    if (eq(G.naughtyLevel, 0)) {
      return vFuck();
    } else if (eq(G.naughtyLevel, 1)) {
      tell(MISSIONARY_ONLY);
      return true;
    } else {
      tell("As you dive between her thighs, she arches toward you, shivering with hedonistic pleasure.\n");
      return true;
    }
  } else if (verbIs(V.TOUCH)) {
    tell("Your arms discover a soft and eager body. You hear a purr of pleasure");
    if (eq(G.naughtyLevel, 2)) {
      bodiesPressTogether("fondling", "breasts");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.KISS)) {
    tell("Your lips meet those of your couchmate -- full, moist lips; the lips of someone who knows how to kiss");
    if (eq(G.naughtyLevel, 2)) {
      tell(". A tongue slides teasingly into ", PD(MOUTH));
      bodiesPressTogether("kissing", "lips");
    }
    if (isVisible(SIDEKICK)) {
      tell(PERIOD_CR, "   You hear a \"thunk\" as ", D(SIDEKICK), ", humping enthusiastically, falls off ");
      hisHer();
      tell(" couch");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.SMELL)) {
    performPrsa(ODOR);
    return true;
  } else if (verbIs(V.FUCK)) {
    tell("Your couchmate seems only too happy to oblige. You flush with passion");
    if (eq(G.naughtyLevel, 2)) {
      bodiesPressTogether("making love to", "breasts");
    }
    tell(". Suddenly...\n");
    dequeue(iBoudoir);
    return iBoudoir(false);
  }
  return false;
}

export function bodiesPressTogether(verbString: any, nounString: any): any {
  move(PROTAGONIST, DIVAN);
  tell(" as your two bodies draw closer together on the divan");
  if (!G.male && !G.discovered) {
    G.discovered = true;
    tell(". You discover, much to your surprise, that you are ", verbString, " a woman. Even more surprising, your misgivings are swept away by the heady pleasure of the soft, full ", nounString, " pressing against your own");
    return true;
  }
  return false;
}

G.discovered = false;

defineObject(PLAZA, 226, {
  in: ROOMS,
  desc: "Plaza",
  flags: [RLANDBIT, ONBIT],
  global: [TREE],
  things: [
    { adjective: null, noun: "LAWN", action: lawnObjectF },
    { adjective: null, noun: "BIRD", action: unimportantThingF },
    { adjective: null, noun: "BIRDS", action: unimportantThingF },
    { adjective: null, noun: "FLOWER", action: unimportantThingF },
    { adjective: null, noun: "FOUNTAIN", action: unimportantThingF },
  ],
  props: {
    [P.ODOR]: "banana",
    [P.ODOR_NUMBER]: 7,
    [P.ACTION]: plazaF,
  },
});

export function plazaF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This is a wide plaza between", PLEASURE_PALACE_DESC, PD(LGOP), ". It is a lovely, bucolic area of gushing fountains, curving flower beds, and lawns of thick, green grass. Birds fly amongst the trees, singing peacefully, as baby squirrels hop across the lawn, lazily collecting nuts.");
    return true;
  } else if (eq(rarg, M_SMELL)) {
    tell("Through the smoke of battle, you see a banana peel squirt from", T(ANTI_LGOP_MACHINE), ".");
    return true;
  } else if (eq(rarg, M_END)) {
    G.plazaCounter = G.plazaCounter + 1;
    tell("   ");
    if (eq(G.plazaCounter, 1)) {
      tell("A half-megaton grenade explodes nearby as the palace guards attempt to repel ");
      if (isIn(SIDEKICK, G.here)) {
        tell("some");
      } else {
        tell("an");
      }
      tell(" unwanted intruder");
      if (isIn(SIDEKICK, G.here)) {
        tell("s");
      }
      tell(" (namely: you");
      andSidekick();
      tell(").\n");
    } else if (eq(G.plazaCounter, 2)) {
      tell("The guards now have reinforcements: a row of imposing radium-powered tanks are rolling towards you.\n");
    } else if (eq(G.plazaCounter, 3)) {
      tell("Giant berserk robotoid sumo wrestlers, each madly waving about three dozen samurai swords, are now storming across the plaza at you.\n");
    } else if (eq(G.plazaCounter, 4)) {
      tell("With a swooping roar, the", ATTACK_FLEET, " of ", PD(LGOP), " joins the attack. Several nearby trees are suddenly vaporized.\n");
    } else if (eq(G.plazaCounter, 5)) {
      tell("The palace guards are setting up a massive dematerialization ray. Closer by, a sumo-robot discovers a boulder in its path, and a large quantity of gravel is created.\n");
    } else if (eq(G.plazaCounter, 6)) {
      tell("A Phobosian Chomper is faster than a cheetah, meaner than a Tyrannosaurus Rex, bigger than a sperm whale, and as hungry as the state of Texas. We mention this because fifty of them just entered the plaza and spotted you.\n");
    } else if (eq(G.plazaCounter, 7)) {
      tell("Several fifty-foot craters appear as the", ATTACK_FLEET, " begins lobbing ion bombs. As they veer around for a more precise attack, the tanks close in, and you realize that each one is larger than the Upper Sandusky City Hall.\n");
    } else if (eq(G.plazaCounter, 8)) {
      tell("A couple of buildings behind you silently vanish, indicating that the palace guards are better at assembling a death ray than at aiming it. However, in sixty centuries of repelling intruders, they've never missed twice. Meanwhile, one of the Chompers has stopped to swallow a herd of goats that was grazing nearby, thus slowing it down for a full tenth of a second.\n");
    } else if (eq(G.plazaCounter, 9)) {
      tell("The guards have finished aiming the death ray, and have begun the activation sequence. The ground quakes as the berserko robotoids plow through the rubble toward you; the wind from their whirling swords knocks over a few trees. The tanks loom above you, their gun turrets blocking out the sun. Beyond them, the", ATTACK_FLEET, " is sweeping in for a final attack.\n");
    } else if (eq(G.plazaCounter, 10)) {
      jigsUp("All your attackers come together in a climactic battle scene far too incredible to describe in the 23 words allotted to this sentence.");
    }
    if (!isVisible(SIDEKICK)) {
      return true;
    }
    tell("   ", D(SIDEKICK));
    if (eq(G.plazaCounter, 1)) {
      move(ANTI_LGOP_MACHINE, G.here);
      tell(" shouts, \"Okay, this is it!");
      if (first(SIDEKICK)) {
        rob(SIDEKICK, PROTAGONIST);
        tell("\" ");
        heShe(true);
        tell(" hands you everything ");
        heShe();
        tell("'s carrying. \"");
      } else {
        tell(" ");
      }
      tell("Gotta start building that ", PD(ANTI_LGOP_MACHINE), "! ");
    } else {
      tell(", hammering and twiddling madly at the growing machine, yells, \"");
      if (G.rightPart) {
        tell("Okay, things are going ", get(HYPE_WORD, G.plazaCounter - 2), "! ");
      } else {
        G.missingPart = get(PARTS_LIST, G.plazaCounter - 2);
        tell("Well, I'll try and work around the missing ");
        if (eq(G.missingPart, PHOTO)) {
          tell(getp(PHOTO, P.SDESC));
        } else {
          printd(G.missingPart);
        }
        tell(". ");
      }
      if (eq(G.plazaCounter, 9)) {
        tell("There! I think it's all done. Cross your fingers, kiddo!\" ");
        heShe(true);
        tell(" switches on the device. Amidst showers of sparks, a powerful electric arc bridges two electrodes. The machine shudders, and ");
        if (G.missingPart) {
          tell("awe-inspiring rays of raw plasma begin shooting in every direction. You and ", D(SIDEKICK), " dive to the ground. Crashing spaceships collide with careening robotoid monsters; the tanks, inches before pancaking you, become pools of molten metal. A stray plasma ray strikes the only remaining tree in the plaza, and you are fatally wounded as a coconut drops onto ", PD(HEAD), ". The last sound you hear is ", D(SIDEKICK), "'s voice, saying,");
          expletive();
          tell("I was going to use that ");
          if (eq(G.missingPart, PHOTO)) {
            tell(getp(PHOTO, P.SDESC));
          } else {
            printd(G.missingPart);
          }
          tell(" to build a coconut deflector.\"\n");
        } else {
          tell("you ");
          if (hasFlag(NOSE, MUNGBIT)) {
            tell("see");
          } else {
            tell("smell");
          }
          tell(" something yellow shoot from the machine.");
          if (hasFlag(NOSE, MUNGBIT)) {
            tell(" It's a banana peel!\n");
          } else {
            crlf();
            perform(V.SMELL, ODOR);
          }
          tell("   The peel lands a few feet away, as the ", PD(ANTI_LGOP_MACHINE), " gives one final shudder and self-destructs in an orgy of flames and shrapnel!\n   The attacking forces continue to close, and certain death is only seconds away when one of the Chompers, loping toward you at nearly Mach One, steps on the banana peel, and slips a few inches to one side before righting itself. This is enough, however, to nudge a tank into a crater, tripping one of the samurai robots!\n   More and more of the attacking forces plow into the mess in the crater, like some improbably fantastical football tackle. A stray grenade lands right in its midst, and the resulting plume of debris shears the fins off the leading warship. Your heart leaps as the entire", ATTACK_FLEET, " of ", PD(LGOP), " plummets toward the ground. The mass of flaming metal strikes the ground, and a tremendous explosion knocks you senseless!\n\n   Eventually, daylight intrudes upon your senselessness and illuminates a sleepy-looking gas station. You are lying at the edge of a dusty road, once again wearing your comfortable old overalls. Though dirty, dishevelled, and bleeding from a few superficial cuts, you are nevertheless aglow in the knowledge that Earth is safe from the threat of ", PD(LGOP), ".\n   As ", PD(HEAD), " clears, three uniformed ");
          if (G.male) {
            tell("girls come bounc");
          } else {
            tell("guys come pound");
          }
          tell("ing out of the service station toward you. \"Oh, my goodness,\" they ");
          if (G.male) {
            tell("coo");
          } else {
            tell("call out");
          }
          tell(", in perfect unison. \"Are you all right?\"\n\n   Coming soon from Infocom: GAS PUMP GIRLS MEET THE PULSATING INCONVENIENCE FROM PLANET X.\n");
          G.rank = 9;
          G.extMax = G.intMax;
        }
        finish();
      }
    }
    tell("Hand me a");
    printPart();
    tell(".\"\n");
    G.rightPart = false;
    return thisIsIt(SIDEKICK);
  }
  return false;
}

export function printPart(): any {
  let nextPart: any = 0;
  nextPart = get(PARTS_LIST, G.plazaCounter - 1);
  thisIsIt(nextPart);
  if (eq(nextPart, EIGHTY_TWO_DEGREE_ANGLE)) {
    tell("n ");
  } else {
    tell(" ");
  }
  if (eq(nextPart, PHOTO)) {
    tell(getp(PHOTO, P.SDESC));
    return true;
  } else {
    printd(nextPart);
    return true;
  }
}

G.plazaCounter = 0;

G.rightPart = false;

G.missingPart = false;

export const HYPE_WORD = table("HYPE-WORD", [
    "great",
    "swell",
    "fantastically",
    "perfectly",
    "teriff",
    "boffo",
    "hunky dory",
    "neato peachy keen",
  ]);

defineObject(ANTI_LGOP_MACHINE, 227, {
  desc: "Super-Duper Anti-Leather Goddesses of Phobos Attack Machine",
  synonym: ["MACHINE", "DEVICE"],
  adjective: ["SUPER", "DUPER", "ATTACK", "LARGE"],
  flags: [NDESCBIT],
  props: {
    [P.GENERIC]: genericMachineF,
  },
});

export function genericMachineF(): any {
  let num: any = 0;
  num = canalLoc();
  if (eq(G.here, CANAL) && (num > 31 || num < 13)) {
    return ODD_MACHINE;
  } else if (verbIs(V.ASK_ABOUT)) {
    if (isVisible(ODD_MACHINE)) {
      return ODD_MACHINE;
    } else {
      return ANTI_LGOP_MACHINE;
    }
  } else if (eq(SIDEKICK, G.winner) && !isQueued(iBlueprint)) {
    return ANTI_LGOP_MACHINE;
  } else {
    return false;
  }
}
