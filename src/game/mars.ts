// mars.ts — from MARS.ZIL
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  blocked, defineObject, per, to, toIf, toIfOpen,
} from "../engine/define.ts";
import {
  A, D, EMPTY, N, PD, T, TR, clearFlag, crlf, div, eq, first, get, getp, hasFlag, isIn, loc, move,
  next, printd, printn, prob, put, putp, random, remove, setFlag, tell,
} from "../engine/runtime.ts";
import {
  ltable, table,
} from "../engine/table.ts";
import {
  iSidekickOutWindow,
} from "./cleveland.ts";
import {
  adjUsed, andSidekick, cantReach, cantSee, doFirst, fallThroughHole, heShe, herHim, herHis, himHer,
  hisHer, inCatacombs, inYourPackage, incrementScore, isPrsiMobyVerb, isPrsoMobyVerb, isTouching,
  noScratchNSniff, nonDimensionalJourney, notOnGround, nounUsed, openClosed, openEyesAndRemoveHands,
  sheHe, unimportantThingF, windowF,
} from "./globals.ts";
import {
  dequeue, isQueued, isRunning, perform, performPrsa, pickOne, queue,
} from "./misc.ts";
import {
  P_ADJW, P_LEXV, isNumber, thisIsIt, zmemq,
} from "./parser.ts";
import {
  genericMachineF, memoriam, takeBabyFromStoop,
} from "./phobos.ts";
import {
  ccount, describeRoom, doWalk, finish, goto, iFollow, iReply, isGlobalIn, isNowDark, isUltimatelyIn,
  isUntouchable, isVisible, jigsUp, normalSidekickFollow, notGoingAnywhere, senseAgain,
  sidekickFollowsYou, stop, vDiagnose, vFuck, vLook, vNo, vTell, vYes, wastes, wrongSexWord,
} from "./verbs.ts";
import {
  ABANDONED_DOCK, ABOUT_TO_KISS, ACTORBIT, ADJ, ALLUSION_ROOM, ALREADY_IS, AMONG_THE_DUNES,
  AUDIENCE_CHAMBER, BABY, BABY_DOCK, BARGE, BASEMENT, BASE_OF_TOWER, BASKET, BLANKET, BLENDER, BOUDOIR,
  BOUGHT_AND_SOLD, BURIAL_CHAMBER, BURNBIT, CANAL, CANALVIEW_MALL, CANAL_OBJECT, CANT_FROM_HERE,
  CANT_GO, CATACOMBS, CATACOMBS_WATER_DESC, CLEVELAND, CLOTHES_PIN, COCK, CODED_MESSAGE, COMIC_BOOK,
  CONTBIT, COTTON_BALLS, CRAMPED_SPACE, DEXTERITY, DOCK_OBJECT, DONALD_DOCK, DOORBIT, DUNES, DUNETOP,
  DUST, EARS, EIGHTY_TWO_DEGREE_ANGLE, ELLIPSIS, EXIT_OBJECT, EXIT_SHOP, EYES, FEMALE_GORILLA,
  FLEXIBLE_HOLE, FORGOTTEN_STOREHOUSE, FROG, FRONT_STOOP, G, GARMENT, GIMME_TROUBLE, GLOBAL_OBJECTS,
  GROUND, GYPSY_CAMP, HANDS, HAND_DWINDLES, HAREM, HAREM_GUARD, HICKORY_AND_DICKORY_DOCK, HOLDING_IT,
  HOLE, HUH, ICY_DOCK, IGLOO, INBIT, INDOORSBIT, INNER_HAREM, INTDIR, INTNUM, ITS_ENGRAVED,
  IT_SEEMS_THAT, KEEP_IT_FROM_FLOATING_AWAY, KNEECAPS, LADDER_ROOM, LAUNDRY_ROOM, LGOP, LIGHTBIT,
  LIP_BALM, LOCAL_GLOBALS, LOCKEDBIT, LOOK_AROUND, LOVE, MAIN_HALL_OF_PALACE, MALE_GORILLA, MAP,
  MARTIAN_DESERT, MARTIAN_DESSERT, MATRON_DESC, ME, MESSENGER, MINARET, MISSIONARY_ONLY, MITRE,
  MORE_ROYAL_BLOOD, MOUSE, MOUTH, MUFFLED, MUNGBIT, MY_KIND_OF_DOCK, M_END, M_ENTER, M_LOOK, M_OBJDESC,
  M_OBJDESC_Q, M_SMELL, N45_DEGREE_ANGLE, NARTICLEBIT, NDESCBIT, NOSE, NOTHING_NEW, NO_STEERING, OASIS,
  ODD_MACHINE, ODOR, ONBIT, ONE_MARSMID_COIN, OPENBIT, ORANGE_BUTTON, ORIENTAL_GARDEN, ORPHANAGE_DOOR,
  ORPHANAGE_FOYER, P, PAINTING, PENGUINS, PENGUIN_PARK, PERIOD_CR, PFFT, PHONE_BOOK, PILE_OF_ANGLES,
  PINNED, PLURALBIT, POWER_TRANSMITTER, PROPRIETOR, PROPRIETOR_STIRS, PROTAGONIST, PSEUDO_OBJECT,
  PURPLE_BUTTON, RABBIT, RAFT, READBIT, RIDDLE, RLANDBIT, ROOMS, ROYAL_DOCKS, RUINED_CASTLE_1,
  RUINED_CASTLE_2, RUINED_CASTLE_3, SEARCHBIT, SENILITY_STRIKES, SHEET, SIDEKICK, SIDEKICKS_BODY, SIGN,
  SMELLEDBIT, SOUTH_POLE, STAIRS, STARING_INTO_VOID, SULTAN, SULTANS_WIFE, SURFACEBIT, TAKEBIT, TENT,
  TEN_MARSMID_COIN, THETA, THRONE_ROOM, TORCH, TOUCHBIT, TOWER, TREE, TREE_HOLE, TRELLIS, TRYTAKEBIT,
  TUBE, TUNDRA, TWICE_AS_LOUD, UNTEEDBIT, V, VEHBIT, VOWELBIT, W, WATER, WATTZ_UPP_DOCK, WELL_BOTTOM,
  WINDOW, WORNBIT, WRITING_CHANGES, YECHH, YOUR_BODY, YOU_CANT, YOU_CANT_SEE_ANY, prsiIs, prsoIs,
  verbIs,
} from "./world.ts";

defineObject(MARTIAN_DESERT, 52, {
  in: ROOMS,
  desc: "Martian Desert",
  flags: [RLANDBIT, ONBIT],
  global: [DUNES],
  exits: {
    NORTH: to(RUINED_CASTLE_1),
    EAST: to(RUINED_CASTLE_2),
    WEST: to(RUINED_CASTLE_3),
  },
  props: {
    [P.LDESC]: "As you wander amidst these towering dunes of red Martian sand, you notice three distinct pathways: north, east, and west.",
  },
});

G.castlesSeen = 0;

export function nameCastle(): any {
  if (hasFlag(G.here, TOUCHBIT)) {
    return false;
  }
  if (eq(G.castlesSeen, 0)) {
    putp(G.here, P.SDESC, "Ruin");
  } else if (eq(G.castlesSeen, 1)) {
    putp(G.here, P.SDESC, "Another Ruin");
  } else if (eq(G.castlesSeen, 2)) {
    putp(G.here, P.SDESC, "Yet Another Ruin");
  }
  return G.castlesSeen = G.castlesSeen + 1;
}

export function castleNote(): any {
  if (eq(G.castlesSeen, 2)) {
    tell("(There do seem to be quite a few of them around here, eh?) ");
    return true;
  } else if (eq(G.castlesSeen, 3)) {
    tell("(It's no wonder this section of Mars is considered the Ruined Castle Capital of the Solar System.) ");
    return true;
  }
  return false;
}

defineObject(RUINED_CASTLE_1, 53, {
  in: ROOMS,
  desc: "Ruined Castle",
  flags: [RLANDBIT, ONBIT],
  exits: {
    SOUTH: to(MARTIAN_DESERT),
    OUT: to(MARTIAN_DESERT),
    NORTH: to(THRONE_ROOM),
    IN: to(THRONE_ROOM),
  },
  props: {
    [P.SDESC]: EMPTY,
    [P.ACTION]: ruinedCastle1F,
  },
});

export function ruinedCastle1F(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    return nameCastle();
  } else if (eq(rarg, M_LOOK)) {
    tell("You stand amongst the ruins of a mighty castle. ");
    castleNote();
    tell("The only part of the castle that is more than a pile of rubble is to the north. A path leads out of the ruin to the south.");
    return true;
  }
  return false;
}

defineObject(THRONE_ROOM, 54, {
  in: ROOMS,
  desc: "Throne Room",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  things: [
    { adjective: "ROYAL", noun: "CROWN", action: mitreCrownF },
    { adjective: "MITRE", noun: "CROWN", action: mitreCrownF },
    { adjective: "KING'S", noun: "CROWN", action: mitreCrownF },
    { adjective: "GOLDEN", noun: "HAIR", action: gownF },
    { adjective: "WHITE", noun: "GOWN", action: gownF },
    { adjective: "FLOWING", noun: "GOWN", action: gownF },
  ],
  exits: {
    SOUTH: to(RUINED_CASTLE_1),
    OUT: to(RUINED_CASTLE_1),
    NORTH: to(ROYAL_DOCKS),
  },
  props: {
    [P.ACTION]: throneRoomF,
  },
});

export function throneRoomF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    remove(MITRE);
    move(MITRE, G.here);
    tell("This is the ", PD(G.here), " of the once-potent ", PD(MITRE), ", of legendary fame. Of course, the version you've probably heard is significantly warped from What Really Happened.\n   In the diseased version of the legend commonly transmitted on Earth, Mitre is called Midas. The King was granted his wish that everything he touched would turn to gold. His greed caught up with him when he transformed even his own daughter into gold.\n   ", PD(MITRE), "'s wish was, in fact, that everything he touched would turn to", N45_DEGREE_ANGLE, "s. ");
    if (eq(G.naughtyLevel, 0)) {
      tell("T");
    } else {
      tell("No one has ever explained this strange wish; the most likely hypothesis is a sexual fetish. In any case, t");
    }
    tell("he tale has a similar climax, with Mitre turning his own daughter into a", N45_DEGREE_ANGLE, ".");
    return true;
  }
  return false;
}

export function mitreCrownF(): any {
  if (verbIs(V.TAKE)) {
    tell(MORE_ROYAL_BLOOD);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("It's not very round for a crown.\n");
    return true;
  }
  return false;
}

export function gownF(): any {
  if (verbIs(V.TAKE)) {
    performPrsa(THETA);
    return true;
  }
  return false;
}

defineObject(MITRE, 55, {
  in: THRONE_ROOM,
  desc: "King Mitre",
  synonym: ["KING", "MITRE"],
  adjective: ["KING"],
  flags: [ACTORBIT, NARTICLEBIT],
  props: {
    [P.DESCFCN]: mitreF,
    [P.ACTION]: mitreF,
  },
});

export function mitreF(oarg: any = false): any {
  if (oarg) {
    if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    tell("   King Mitre sits upon the throne, looking ");
    if (hasFlag(THETA, MUNGBIT)) {
      tell("dejected and lonely. Next to him is a pile of", N45_DEGREE_ANGLE, "s. One stands out from the others, thanks to its golden hair and flowing white gown");
    } else {
      tell("delirious with joy");
    }
    tell(". The main entrance of the throne room is to the south, but a tight opening leads north.");
    return true;
  } else if (eq(MITRE, G.winner)) {
    if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"Leather fetishists, every one of them. Me, I'm not into fetishes.\"\n");
      return true;
    } else if (verbIs(V.CHEER) && prsoIs(ROOMS)) {
      G.winner = PROTAGONIST;
      performPrsa(MITRE);
      G.winner = MITRE;
      return true;
    } else if (verbIs(V.TOUCH) && hasFlag(G.prso, TAKEBIT) && !prsoIs(GARMENT, COMIC_BOOK)) {
      G.winner = PROTAGONIST;
      perform(V.GIVE, G.prso, MITRE);
      G.winner = MITRE;
      return true;
    } else {
      tell("\"I don't feel like talking. I'm too ");
      if (hasFlag(THETA, MUNGBIT)) {
        tell("un");
      }
      tell("happy.\"\n");
      return stop();
    }
  } else if (verbIs(V.EXAMINE)) {
    tell("The old king looks very ");
    if (hasFlag(THETA, MUNGBIT)) {
      tell("down");
    } else {
      tell("up");
    }
    tell(". His appearance is rather odd, since his clothes, his jewelry, his crown, even his very throne, all have a rather angular appearance.\n");
    return true;
  } else if (verbIs(V.ASK_ABOUT) && prsiIs(THETA) || verbIs(V.SHOW) && prsoIs(THETA)) {
    if (hasFlag(THETA, MUNGBIT)) {
      tell("The king weeps pitifully.\n");
      return true;
    } else {
      tell("The king beams.\n");
      return true;
    }
  } else if (verbIs(V.GIVE) && prsiIs(MITRE)) {
    remove(G.prso);
    tell("As Mitre touches", T(G.prso), ",", T(PILE_OF_ANGLES), " becomes a bit larger.\n");
    return true;
  } else if (verbIs(V.TOUCH)) {
    tell("It only works the other way.\n");
    return true;
  } else if (verbIs(V.SHAKE_WITH) && prsoIs(HANDS)) {
    tell("As you join the other angles in the pile, life becomes very boring. Two centuries later, following Mitre's death, the ", PD(PILE_OF_ANGLES), " is sold to a geometry teacher on Baffin Island, who uses you to demonstrate bisections, trigonometric proofs, and basic picture framing techniques.\n");
    return finish();
  }
  return false;
}

defineObject(THETA, 56, {
  in: THRONE_ROOM,
  synonym: ["ANGLE", "PRINCE", "DAUGHTER", "THETA"],
  adjective: ["HIS", "DIFFER", "FORTY", "DEGREE", "NUMBER", "KING'S", "DAUGHTER", "PRINCE"],
  flags: [NDESCBIT, MUNGBIT],
  props: {
    [P.SDESC]: "different-looking angle",
    [P.LDESC]: "Princess Theta stands demurely by her father's throne, buried up to her thighs in forty-five degree angles.",
    [P.GENERIC]: genericAngleF,
    [P.ACTION]: thetaF,
  },
});

export function thetaF(): any {
  if (adjUsed(ADJ.NUMBER) && !eq(G.pNumber, 45)) {
    return noXDegreeAngle();
  } else if (eq(THETA, G.winner)) {
    if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"The travelling acrobatic troupe! I saw them while I was mooning on Phobos. Their costumes are made of pure Chomperhide leather.\"\n");
      return true;
    } else {
      tell("The princess, whose recent experience has made her more obtuse, just looks at you dumbly.\n");
      return true;
    }
  } else if (verbIs(V.MEASURE) && hasFlag(THETA, MUNGBIT)) {
    performPrsa(PILE_OF_ANGLES);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    if (hasFlag(THETA, MUNGBIT)) {
      tell("The angle has the sort of golden hair and satiny robes that one normally associates with princesses.\n");
      return true;
    } else {
      tell("The princess, once acute, is now cute.\n");
      return true;
    }
  } else if (verbIs(V.TAKE, V.KISS, V.FUCK, V.TOUCH, V.BEND)) {
    tell("Mitre growls, \"Keep ", PD(HANDS), "s off my daughter.\"\n");
    return true;
  } else if (verbIs(V.MARRY)) {
    if (hasFlag(THETA, MUNGBIT)) {
      return wantChildren("angular");
    } else {
      tell("\"Only one of royal blood shall bisect ... er, wed ... my Theta!\" bellows Mitre.\n");
      return true;
    }
  }
  return false;
}

export function wantChildren(string: any): any {
  G.awaitingReply = 2;
  queue(iReply, 2);
  tell("Would you really want ", string, " children?\n");
  return true;
}

defineObject(EIGHTY_TWO_DEGREE_ANGLE, 57, {
  desc: "eighty-two degree angle",
  synonym: ["ANGLE"],
  adjective: ["EIGHTY", "EIGHY", "DEGREE", "NUMBER"],
  flags: [TAKEBIT, VOWELBIT],
  props: {
    [P.NO_T_DESC]: "eighy-wo degree angle",
    [P.GENERIC]: genericAngleF,
    [P.ACTION]: eightyTwoDegreeAngleF,
  },
});

export function eightyTwoDegreeAngleF(): any {
  if (adjUsed(ADJ.NUMBER) && !eq(G.pNumber, 82)) {
    return noXDegreeAngle();
  } else if (verbIs(V.MEASURE) && !hasFlag(EIGHTY_TWO_DEGREE_ANGLE, UNTEEDBIT)) {
    tell("82 degrees.\n");
    return true;
  }
  return false;
}

export function noXDegreeAngle(): any {
  tell(YOU_CANT_SEE_ANY, N(G.pNumber), " degree angle here!\n");
  return true;
}

export function genericAngleF(): any {
  if (hasFlag(THETA, MUNGBIT)) {
    return false;
  } else {
    return EIGHTY_TWO_DEGREE_ANGLE;
  }
}

defineObject(PILE_OF_ANGLES, 58, {
  in: THRONE_ROOM,
  desc: "pile of angles",
  synonym: ["PILE", "ANGLES"],
  adjective: ["FORTY", "DEGREE", "NUMBER"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: pileOfAnglesF,
  },
});

export function pileOfAnglesF(): any {
  if (adjUsed(ADJ.NUMBER) && !eq(G.pNumber, 45)) {
    return noXDegreeAngle();
  } else if (verbIs(V.COUNT)) {
    tell("Lots.\n");
    return true;
  } else if (verbIs(V.TAKE)) {
    tell("The ", PD(PILE_OF_ANGLES), " is too big to carry.");
    if (hasFlag(THETA, MUNGBIT)) {
      tell(" Besides, other than", T(THETA), ", none of them are interesting.");
    }
    crlf();
    return true;
  } else if (verbIs(V.MEASURE)) {
    tell("45 degrees.\n");
    return true;
  }
  return false;
}

defineObject(RUINED_CASTLE_2, 59, {
  in: ROOMS,
  desc: "Ruined Castle",
  flags: [RLANDBIT, ONBIT],
  things: [
    { adjective: null, noun: "DUST", action: unimportantThingF },
    { adjective: "SMALL", noun: "CROWN", action: frogCrownF },
    { adjective: "GOLD", noun: "CROWN", action: frogCrownF },
    { adjective: "FROG'S", noun: "CROWN", action: frogCrownF },
  ],
  exits: {
    WEST: to(MARTIAN_DESERT),
    EAST: to(MARTIAN_DESSERT),
  },
  props: {
    [P.SDESC]: EMPTY,
    [P.ACTION]: ruinedCastle2F,
  },
});

export function frogCrownF(): any {
  if (verbIs(V.TAKE)) {
    tell(MORE_ROYAL_BLOOD);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("It's tiny.\n");
    return true;
  }
  return false;
}

export function ruinedCastle2F(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    clearFlag(RUINED_CASTLE_2, MUNGBIT);
    return nameCastle();
  } else if (eq(rarg, M_LOOK)) {
    tell("This ancient castle now lies in ruins. ");
    castleNote();
    tell("All that remains of its once-proud ramparts are dust and rubble, and an occasional stone block. A path leads away from the ruin to the west");
    return unchartableDesert("east");
  }
  return false;
}

export function unchartableDesert(string: any): any {
  tell(". To the ", string, ": unchartable desert.");
  return true;
}

defineObject(FROG, 60, {
  in: RUINED_CASTLE_2,
  desc: "frog",
  synonym: ["FROG", "PRINCE"],
  adjective: ["ENCHANTED", "LARGE", "GREEN"],
  props: {
    [P.LDESC]: "Sitting on one of the stone blocks is a large green frog. Something about it catches your eye.",
    [P.ACTION]: frogF,
  },
});

export function frogF(): any {
  if (verbIs(V.TELL, V.LISTEN) || verbIs(V.GIVE) && prsiIs(FROG)) {
    tell("\"Ribit.\"\n");
    if (verbIs(V.TELL)) {
      stop();
    }
    return true;
  } else if (verbIs(V.EAT, V.TASTE, V.SUCK, V.SMELL)) {
    tell(YECHH);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("You realize what aroused your attention: the tiny gold crown on the frog's head. The frog is otherwise totally ordinary. Ordinary for a frog, that is. By any other measure it is a repulsive creature, with swollen eyes, oozing warts, slimy skin, and a grating croak.\n");
    return true;
  } else if (verbIs(V.TOUCH)) {
    tell("Huge, ugly warts cover every inch of ", PD(YOUR_BODY));
    if (eq(G.naughtyLevel, 0)) {
      tell(", but");
    } else {
      tell(". Fortunately for your sex life,");
    }
    tell(" they quickly fade away.\n");
    return true;
  } else if (verbIs(V.MARRY)) {
    return wantChildren("green");
  } else if (verbIs(V.KISS)) {
    tell("You lean forward");
    if (hasFlag(EYES, MUNGBIT)) {
      tell(" with ", PD(EYES), " ");
      if (eq(EYES, G.handCover)) {
        tell("covered");
      } else {
        tell("closed");
      }
      if (hasFlag(NOSE, MUNGBIT)) {
        if (hasFlag(EARS, MUNGBIT)) {
          tell(",");
        } else {
          tell(" and");
        }
        tell(" ", PD(NOSE), " shut");
        if (hasFlag(EARS, MUNGBIT)) {
          if (hasFlag(MOUTH, MUNGBIT)) {
            tell(",");
          } else {
            tell(" and");
          }
          tell(" ", PD(EARS), " ");
          if (eq(EARS, G.handCover)) {
            tell("covered");
          } else {
            tell("stuffed up");
          }
          if (hasFlag(MOUTH, MUNGBIT)) {
            frogSexScene();
            return true;
          } else {
            tell(ABOUT_TO_KISS, "the thought of slimy frog lips pressing against your own makes you shudder away.\n");
            return true;
          }
        } else {
          tell(ABOUT_TO_KISS, "the creature lets loose a loud, croaking \"ribit.\" You admit that you are incapable of kissing under such circumstances.\n");
          return true;
        }
      } else {
        tell(ABOUT_TO_KISS, "the stench of old pond scum overwhelms you, and you lurch back, retching.\n");
        return true;
      }
    } else {
      tell(ABOUT_TO_KISS, "the sight of its green warts and slimy skin make it impossible to continue.\n");
      return true;
    }
  }
  return false;
}

export function frogSexScene(): any {
  move(FROG, LOCAL_GLOBALS);
  move(BLENDER, G.here);
  incrementScore(17, 17, true);
  openEyesAndRemoveHands();
  tell(" and your lips smeared with balm. Planting ", PD(MOUTH), " solidly against the frog's, you kiss deeply. ");
  if (eq(G.naughtyLevel, 0)) {
    tell("The kiss is surprisingly pleasant, until you notice that you're embracing a ");
    if (G.male) {
      tell("beautiful princess. Sh");
    } else {
      tell("handsome prince. H");
    }
    tell("e leaps back, blushing deeply. \"We're ... we're not married,\" ");
    sheHe();
    tell(" stammers. Then, still reddening, ");
    sheHe();
    tell(" vanishes into thin air! Y");
  } else {
    setFlag(RUINED_CASTLE_2, MUNGBIT);
    tell("When you feel a tongue sliding into ", PD(MOUTH), ", revulsion gives way to pleasure, as the no-longer-enchanted but quite enchanting prince");
    if (G.male) {
      tell("ss");
    }
    tell(" presses against you. ");
    if (eq(G.naughtyLevel, 1)) {
      tell("Some time later, after the prince");
      if (G.male) {
        tell("ss");
      }
      tell(" has departed...");
    } else {
      if (G.male) {
        tell("Rubbing her hot, naked body against yours, s");
      } else {
        tell("As your arms grip his naked, muscular back, ");
      }
      tell("he effortlessly slips off your ", D(GARMENT), ". A warm and wild feeling springs from your loins, spreading like a fiery potion through your veins. Within moments you are joined in passionate love, and just as a quick and lustful orgasm seems inevitable, a force crackles in the air, and you are alone, naked, sweating, and unsatisfied.");
    }
    tell("\n   As you gather up your garment and put it on, y");
  }
  tell("ou notice", A(BLENDER), " on the ground. ", ITS_ENGRAVED);
  if (isIn(SIDEKICK, G.here)) {
    tell(" ", D(SIDEKICK), " is at the other end of the ruin, sifting through some rubble, oblivious to your \"experience.\"");
  }
  crlf();
  return true;
}

defineObject(BLENDER, 61, {
  desc: "common household blender",
  synonym: ["BLENDER", "MIXER", "ENGRAV"],
  adjective: ["COMMON", "HOUSEHOLD"],
  flags: [TAKEBIT, LIGHTBIT, READBIT],
  props: {
    [P.SIZE]: 8,
    [P.ACTION]: blenderF,
  },
});

export function blenderF(): any {
  if (verbIs(V.READ)) {
    if (!eq(G.naughtyLevel, 0)) {
      tell("\"Dearest,\n");
      if (eq(G.naughtyLevel, 2)) {
        tell("   Sorry to leave so abruptly; p");
      } else {
        tell("   P");
      }
      tell("erhaps some day we will meet again");
      if (eq(G.naughtyLevel, 2)) {
        tell(", and finish what we began");
      }
      tell(". ");
    } else {
      tell("\"");
    }
    tell("Please accept this token of my gratitude for delivering me from enchantment.\"\n");
    return true;
  } else if (verbIs(V.EXAMINE)) {
    if (nounUsed(W.ENGRAV, BLENDER)) {
      perform(V.READ, BLENDER);
      return true;
    } else {
      tell(ITS_ENGRAVED, "\n");
      return true;
    }
  } else if (verbIs(V.ON)) {
    tell("\"Whirr.\"\n");
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    tell("It's empty.\n");
    return true;
  } else if (verbIs(V.PUT) && prsiIs(BLENDER)) {
    tell("But", T(G.prso), " doesn't need blending.\n");
    return true;
  }
  return false;
}

defineObject(RUINED_CASTLE_3, 62, {
  in: ROOMS,
  desc: "Ruined Castle",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE],
  exits: {
    EAST: to(MARTIAN_DESERT),
    NW: to(HICKORY_AND_DICKORY_DOCK),
  },
  props: {
    [P.SDESC]: EMPTY,
    [P.HOLE_DESTINATION]: BASEMENT,
    [P.ACTION]: ruinedCastle3F,
  },
});

export function ruinedCastle3F(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    return nameCastle();
  } else if (eq(rarg, M_LOOK)) {
    tell("Wind whistles among the fallen archways, crumbled balustrades, and black circle of this ruined castle. ");
    castleNote();
    tell("Paths lead east and northwest through the rubble.");
    return true;
  }
  return false;
}

defineObject(HICKORY_AND_DICKORY_DOCK, 63, {
  in: ROOMS,
  desc: "Hickory & Dickory Dock",
  flags: [RLANDBIT, ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER],
  exits: {
    SOUTH: to(RUINED_CASTLE_3),
    NORTH: blocked("If you want to jump in the canal, say so."),
    NE: blocked("If you want to jump in the canal, say so."),
    NW: blocked("If you want to jump in the canal, say so."),
  },
  props: {
    [P.LDESC]: "This dock, which extends north into a broad canal, is crafted of fine woods from across the solar system: hickory wood from the forests of Earth, and dickory wood from the jungles of Venus. A path leads south.",
  },
});

defineObject(MOUSE, 64, {
  in: HICKORY_AND_DICKORY_DOCK,
  desc: "mouse",
  synonym: ["MOUSE", "MARSMOUSE"],
  adjective: ["SMALL", "WHITE"],
  flags: [TAKEBIT, TRYTAKEBIT],
  props: {
    [P.FDESC]: "You spot a little white marsmouse running along the dock.",
    [P.SIZE]: 3,
    [P.ACTION]: mouseF,
  },
});

export function mouseF(): any {
  if (verbIs(V.CLICK)) {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("You expect maybe a window to open?\n");
    return true;
  } else if (verbIs(V.SHOW) && prsoIs(PAINTING) && !hasFlag(PAINTING, UNTEEDBIT)) {
    clearFlag(MOUSE, TRYTAKEBIT);
    setFlag(MOUSE, TOUCHBIT);
    queue(iMouse, 2);
    tell("The mouse freezes with fear.\n");
    return true;
  } else if (verbIs(V.GIVE) && prsiIs(MOUSE)) {
    tell("Marsmice, like earthmice, prefer cheese.\n");
    return true;
  } else if (verbIs(V.CATCH)) {
    perform(V.TAKE, MOUSE);
    return true;
  } else if (isTouching(MOUSE) && isIn(MOUSE, G.here) && hasFlag(MOUSE, TRYTAKEBIT)) {
    tell("The little fellow scurries easily away from you.\n");
    return true;
  } else if (verbIs(V.FOLLOW) && eq(G.pPrsaWord, W.CHASE) && isIn(MOUSE, G.here) && hasFlag(MOUSE, TRYTAKEBIT)) {
    perform(V.TAKE, MOUSE);
    return true;
  } else if (verbIs(V.TAKE) && !hasFlag(MOUSE, MUNGBIT) && ccount(PROTAGONIST) < 11) {
    setFlag(MOUSE, MUNGBIT);
    incrementScore(14, 9, true);
    return false;
  } else if (verbIs(V.MEASURE)) {
    tell("Tiny.\n");
    return true;
  } else if (verbIs(V.TOUCH)) {
    tell("The mouse squeaks happily.\n");
    return true;
  }
  return false;
}

export function iMouse(): any {
  setFlag(MOUSE, TRYTAKEBIT);
  if (isIn(MOUSE, RUINED_CASTLE_1)) {
    clearFlag(MOUSE, TOUCHBIT);
  }
  if (isIn(MOUSE, G.here)) {
    tell("   The mouse relaxes and begins scampering about.\n");
    return true;
  } else {
    return false;
  }
}

defineObject(ROYAL_DOCKS, 65, {
  in: ROOMS,
  desc: "Royal Docks",
  flags: [RLANDBIT, ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER],
  exits: {
    SOUTH: to(THRONE_ROOM),
    NORTH: blocked("If you want to jump in the canal, say so."),
    NE: blocked("If you want to jump in the canal, say so."),
    NW: blocked("If you want to jump in the canal, say so."),
    IN: to(THRONE_ROOM),
  },
  props: {
    [P.ACTION]: royalDocksF,
  },
});

export function royalDocksF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    if (eq(G.naughtyLevel, 0)) {
      tell("This dock juts");
    } else {
      tell("During the peak of King Mitre's reign, a cruel joke went around the kingdom that Mitre's two greatest loves were his Royal Docks and his Royal Ducks. The joke was never very good and has long since been forgotten, and the ducks perished years ago from a sexually-transmitted disease, but the docks remain, jutting");
    }
    tell(" into a wide Martian Canal which flows from west to east. Behind you, to the south, is a ruined castle.");
    return true;
  }
  return false;
}

defineObject(BARGE, 66, {
  in: ROYAL_DOCKS,
  desc: "royal barge",
  synonym: ["BARGE", "BOAT", "GONDOLA", "CONTROL"],
  adjective: ["ROYAL", "WOODEN", "CEDAR", "CEDARWOOD", "SIMPLE"],
  flags: [INBIT, VEHBIT, CONTBIT, SEARCHBIT, OPENBIT],
  props: {
    [P.DESCFCN]: bargeF,
    [P.CAPACITY]: 200,
    [P.ACTION]: bargeF,
  },
});

export function bargeF(oarg: any = false): any {
  if (oarg) {
    if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    tell("   A barge, hand-crafted from fine Martian cedarwood, is ");
    if (eq(G.here, CANAL)) {
      tell("floating nearby.");
      return true;
    } else {
      tell("moored at the end of the dock.");
      return true;
    }
  } else if (eq(G.here, CANAL) && isIn(PROTAGONIST, RAFT) && !eq(G.raftLocNum, G.bargeLocNum)) {
    return cantSee(BARGE);
  } else if (verbIs(V.SINK)) {
    tell("The barge is unsinkable. (Then again, so was the Titanic.)\n");
    return true;
  } else if (verbIs(V.UNTIE, V.LAUNCH)) {
    tell("The barge isn't moored");
    if (!isIn(BARGE, CANAL)) {
      tell(" with ropes");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    if (nounUsed(W.CONTROL, BARGE)) {
      tell("The controls consist of a ", PD(ORANGE_BUTTON), ", and a ", PD(PURPLE_BUTTON), ". Both buttons have writing on them.\n");
      return true;
    } else {
      tell("This large barge could host a host of royal guests.");
      if (!eq(G.here, CANAL)) {
        tell(" The barge rests immobile at the dockside, despite a strong current and no visible mooring lines.");
      }
      tell(" There are some simple controls on the side of the barge");
      if (!eq(G.here, CANAL)) {
        tell(" nearest the dock");
      }
      tell(PERIOD_CR);
      return true;
    }
  } else if (verbIs(V.READ)) {
    performPrsa(ORANGE_BUTTON);
    performPrsa(PURPLE_BUTTON);
    return true;
  } else if (verbIs(V.PUSH) && nounUsed(W.CONTROL, BARGE)) {
    performPrsa(ORANGE_BUTTON);
    tell("   ");
    performPrsa(PURPLE_BUTTON);
    return true;
  } else if (verbIs(V.SET)) {
    tell(NO_STEERING);
    return true;
  } else if (verbIs(V.BOARD, V.TAKE) && eq(G.here, CANAL) && isIn(PROTAGONIST, RAFT)) {
    move(PROTAGONIST, BARGE);
    tell("Grabbing onto the barge, you");
    andSidekick(BARGE);
    move(RAFT, PROTAGONIST);
    G.raftHeld = false;
    tell(" climb in", KEEP_IT_FROM_FLOATING_AWAY);
    return true;
  } else if (verbIs(V.PUT_ON) && prsiIs(BARGE)) {
    perform(V.PUT, G.prso, BARGE);
    return true;
  } else if (verbIs(V.SMELL)) {
    return noScratchNSniff("aged cedarwood");
  } else if (verbIs(V.SHAKE) && isIn(PROTAGONIST, BARGE)) {
    return shakeBoat();
  } else if (verbIs(V.LAND)) {
    G.awaitingReply = 2;
    queue(iReply, 2);
    tell("Read any ", PD(ORANGE_BUTTON), "s lately?\n");
    return true;
  }
  return false;
}

export function shakeBoat(): any {
  tell("You knock yourself overboard.\n\n");
  perform(V.BOARD, CANAL_OBJECT);
  return true;
}

defineObject(ORANGE_BUTTON, 67, {
  in: BARGE,
  desc: "huge orange button",
  synonym: ["BUTTON"],
  adjective: ["LARGE", "ORANGE"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: orangeButtonF,
  },
});

export function orangeButtonF(): any {
  if (verbIs(V.READ, V.EXAMINE)) {
    tell("The ", PD(ORANGE_BUTTON), " reads: MagnetoMoor O");
    if (G.mooringOn) {
      tell("n");
    } else {
      tell("ff");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.PUSH)) {
    if (G.mooringOn) {
      G.mooringOn = false;
    } else {
      G.mooringOn = true;
    }
    tell(WRITING_CHANGES, ".");
    if (!isIn(BARGE, CANAL) && !G.mooringOn && !eq(G.here, ICY_DOCK)) {
      move(BARGE, CANAL);
      if (G.raftHeld && isIn(PROTAGONIST, BARGE)) {
        move(RAFT, CANAL);
        G.raftLocNum = G.bargeLocNum;
      }
      clearFlag(BARGE, NDESCBIT);
      queue(iCanal, -1);
      tell(" The barge s");
      if (G.bargeUnderPower) {
        tell("hoot");
      } else {
        tell("lide");
      }
      tell("s away from the dock, into the deeper waters of the canal.\n");
      if (isIn(PROTAGONIST, BARGE)) {
        crlf();
        goto(BARGE);
      }
      return true;
    } else if (!bargeDocks()) {
      crlf();
    }
    return true;
  }
  return false;
}

defineObject(PURPLE_BUTTON, 68, {
  in: BARGE,
  desc: "huge purple button",
  synonym: ["BUTTON"],
  adjective: ["LARGE", "PURPLE"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: purpleButtonF,
  },
});

export function purpleButtonF(): any {
  if (verbIs(V.READ, V.EXAMINE)) {
    tell("The ", PD(PURPLE_BUTTON), " reads: ");
    if (G.bargeUnderPower) {
      tell("Full Speed Ahead");
    } else {
      tell("Go With The Flow");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.PUSH)) {
    tell(WRITING_CHANGES);
    if (G.bargeUnderPower) {
      G.bargeUnderPower = false;
    } else {
      G.bargeUnderPower = true;
      if (isIn(PROTAGONIST, RAFT) && eq(G.here, CANAL)) {
        bargeForgesAhead();
      }
    }
    tell(PERIOD_CR);
    return true;
  }
  return false;
}

export function bargeForgesAhead(): any {
  if (G.bargeLocNum < 16 && G.mooringOn) {
    G.bargeLocNum = 15;
    move(BARGE, WATTZ_UPP_DOCK);
  } else {
    G.bargeLocNum = 36;
    move(BARGE, ICY_DOCK);
  }
  tell(". The barge, under power, forges ahead and disappears from sight");
  return true;
}

G.mooringOn = true;

G.bargeUnderPower = false;

G.bargeLocNum = 1;

G.raftLocNum = 10;

G.bargeWait = false;

G.raftWait = false;

G.nearerDock = false;

export function canalLoc(): any {
  if (!eq(G.here, CANAL)) {
    return false;
  } else if (isIn(PROTAGONIST, BARGE)) {
    return G.bargeLocNum;
  } else {
    return G.raftLocNum;
  }
}

export function setRaftLoc(): any {
  if (eq(G.here, CANAL)) {
    return G.raftLocNum = G.bargeLocNum;
  } else if (eq(G.here, HICKORY_AND_DICKORY_DOCK)) {
    return G.raftLocNum = -1;
  } else if (eq(G.here, ROYAL_DOCKS)) {
    return G.raftLocNum = 1;
  } else if (eq(G.here, BABY_DOCK)) {
    return G.raftLocNum = 6;
  } else if (eq(G.here, DONALD_DOCK)) {
    return G.raftLocNum = 7;
  } else if (eq(G.here, WATTZ_UPP_DOCK)) {
    return G.raftLocNum = 15;
  } else {
    return G.raftLocNum = 10;
  }
}

defineObject(CANAL_OBJECT, 69, {
  in: LOCAL_GLOBALS,
  desc: "canal",
  synonym: ["CANAL"],
  adjective: ["MARTIAN", "SMALL", "WIDE"],
  props: {
    [P.ACTION]: canalObjectF,
  },
});

export function canalObjectF(): any {
  if (adjUsed(ADJ.SMALL)) {
    return unimportantThingF();
  } else if (eq(G.here, DUNETOP, MINARET) && isTouching(CANAL_OBJECT)) {
    return cantReach(CANAL_OBJECT);
  } else if (verbIs(V.BOARD, V.ENTER, V.SWIM, V.CRAWL_UNDER)) {
    if (isUntouchable(CANAL_OBJECT)) {
      cantReach(CANAL_OBJECT);
    } else if (eq(G.here, ICY_DOCK)) {
      tell("The current sucks you under");
      if (eq(G.naughtyLevel, 2)) {
        tell(", which really sucks");
      }
      jigsUp(".");
    } else {
      tell("In The Canal\n   As you swim in the cool waters of the canal, a slimy tentacle touches you, convincing you that it's safer back ");
    }
    if (eq(loc(PROTAGONIST), RAFT, BARGE)) {
      tell("in", TR(loc(PROTAGONIST)));
    } else {
      tell("on the dock.\n");
    }
    crlf();
    return describeRoom();
  } else if (verbIs(V.CROSS)) {
    perform(V.ENTER, CANAL_OBJECT);
    return true;
  } else if (verbIs(V.PUT) && eq(G.pPrsaWord, W.THROW) && prsoIs(RAFT) && !hasFlag(RAFT, UNTEEDBIT) && !isIn(PROTAGONIST, RAFT)) {
    move(RAFT, G.here);
    G.raftHeld = true;
    perform(V.DROP, RAFT);
    return true;
  } else if (verbIs(V.PUT, V.THROW) && prsiIs(CANAL_OBJECT)) {
    if (prsoIs(RAFT)) {
      if (hasFlag(RAFT, UNTEEDBIT) || hasFlag(RAFT, MUNGBIT)) {
        remove(RAFT);
        tell("It sinks like a stone.");
        if (hasFlag(RAFT, UNTEEDBIT)) {
          tell(" I guess a raf doesn't float nearly as well as a raft.");
        }
        crlf();
        return true;
      } else if (G.raftHeld || isIn(RAFT, CANAL)) {
        tell(ALREADY_IS);
        return true;
      } else {
        tell("The raft is now ");
        if (eq(G.here, ICY_DOCK)) {
          move(RAFT, G.here);
          tell("in the water", PINNED);
          return true;
        } else {
          G.raftHeld = true;
          move(RAFT, G.here);
          if (eq(G.here, CANAL)) {
            G.raftLocNum = G.bargeLocNum;
          }
          tell("bobbing in the canal.");
          if (!eq(G.here, CANAL) || G.bargeUnderPower) {
            tell(" If you weren't holding it, it would surely be ");
            if (eq(G.here, CANAL)) {
              tell("left behind.");
            } else {
              tell("carried away.");
            }
          }
          crlf();
          return true;
        }
      }
    } else {
      remove(G.prso);
      if (prsoIs(TORCH) && hasFlag(TORCH, ONBIT)) {
        tell("\"Phfffft!");
      } else {
        tell("\"Glub.");
      }
      tell("\" ");
      if (hasFlag(G.prso, PLURALBIT)) {
        tell("They're");
      } else {
        tell("It's");
      }
      tell(" gone");
      if (prsoIs(BABY) || isUltimatelyIn(BABY, G.prso)) {
        tell(", you heartless baby murderer, you");
      }
      tell(PERIOD_CR);
      return true;
    }
  } else if (verbIs(V.LOOK_INSIDE)) {
    performPrsa(WATER);
    return true;
  }
  return false;
}

defineObject(DOCK_OBJECT, 70, {
  in: LOCAL_GLOBALS,
  desc: "dock",
  synonym: ["DOCK", "PIER"],
  adjective: ["SAND-COVERED", "SMALL", "BABY", "ABANDONED", "ROYAL"],
  props: {
    [P.ACTION]: dockObjectF,
  },
});

export function dockObjectF(): any {
  let num: any = 0;
  let dockRoom: any = 0;
  num = canalLoc();
  if (eq(G.here, CANAL) && !eq(num, -1, 1, 6) && !eq(num, 7, 10, 15)) {
    cantSee(DOCK_OBJECT);
    return true;
  }
  if (eq(G.here, DUNETOP, MINARET) && isTouching(DOCK_OBJECT)) {
    tell(CANT_FROM_HERE);
    return true;
  } else if (verbIs(V.TAKE, V.BOARD) && eq(G.here, CANAL) && isIn(PROTAGONIST, RAFT)) {
    tell("You lunge for the dock and secure a handhold. An agile clamber places you");
    andSidekick();
    tell(" on the dock", KEEP_IT_FROM_FLOATING_AWAY, "\n");
    G.raftWait = false;
    G.dontPrintVehicle = true;
    dockRoom = setDockRoom(G.raftLocNum);
    goto(dockRoom);
    G.dontPrintVehicle = false;
    if (isIn(SIDEKICK, RAFT)) {
      move(SIDEKICK, G.here);
    }
    move(RAFT, G.here);
    return true;
  } else if (verbIs(V.BOARD)) {
    if (eq(G.here, CANAL)) {
      return doFirst("land");
    } else if (isIn(PROTAGONIST, G.here)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      perform(V.DISEMBARK, loc(PROTAGONIST));
      return true;
    }
  } else if (verbIs(V.TAKE_OFF) && eq(G.pPrsaWord, W.GET)) {
    perform(V.BOARD, CANAL_OBJECT);
    return true;
  } else if (verbIs(V.PUT, V.PUT_ON) && prsiIs(DOCK_OBJECT) && !eq(G.here, CANAL)) {
    perform(V.PUT_ON, G.prso, GROUND);
    return true;
  } else if (verbIs(V.LEAP_OFF)) {
    if (eq(G.here, DUNETOP, CANAL)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      perform(V.ENTER, CANAL_OBJECT);
      return true;
    }
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.EXAMINE) && !eq(G.here, CANAL, MINARET, DUNETOP)) {
    return vLook();
  }
  return false;
}

G.dontPrintVehicle = false;

defineObject(DUNES, 71, {
  in: LOCAL_GLOBALS,
  desc: "sand dunes",
  synonym: ["DUNE", "DUNES", "SAND"],
  adjective: ["SAND", "RED", "REDDISH", "TOWERING", "SCULPTED", "MARTIAN", "IMPASSABLE"],
  flags: [NARTICLEBIT, PLURALBIT],
  props: {
    [P.ACTION]: dunesF,
  },
});

export function dunesF(): any {
  if (eq(G.here, MINARET) && isTouching(DUNES)) {
    return cantReach(DUNES);
  } else if (verbIs(V.CLIMB, V.CLIMB_UP)) {
    if (eq(G.here, DUNETOP)) {
      tell(LOOK_AROUND);
      return true;
    } else if (eq(G.here, CANALVIEW_MALL, DONALD_DOCK)) {
      return doWalk(P.UP);
    } else {
      tell("This dune is too steep.\n");
      return true;
    }
  } else if (verbIs(V.CLIMB_DOWN) && eq(G.here, DUNETOP)) {
    return doWalk(P.DOWN);
  }
  return false;
}

defineObject(CANAL, 72, {
  in: ROOMS,
  desc: "Martian Canal",
  flags: [ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER, DUNES, SIGN],
  things: [
    { adjective: "RED", noun: "BUOY", action: buoyF },
    { adjective: "WARNING", noun: "BUOY", action: buoyF },
    { adjective: "SWAYING", noun: "BUOY", action: buoyF },
    { adjective: "ROYAL", noun: "BARGE", action: bargeFromCanalF },
    { adjective: "WOODEN", noun: "BARGE", action: bargeFromCanalF },
    { adjective: "ORANGE", noun: "BUTTON", action: bargeFromCanalF },
    { adjective: "PURPLE", noun: "BUTTON", action: bargeFromCanalF },
  ],
  exits: {
    NORTH: blocked("If you want to jump in the canal, say so."),
    NE: blocked("If you want to jump in the canal, say so."),
    EAST: blocked("If you want to jump in the canal, say so."),
    SE: blocked("If you want to jump in the canal, say so."),
    SOUTH: blocked("If you want to jump in the canal, say so."),
    SW: blocked("If you want to jump in the canal, say so."),
    WEST: blocked("If you want to jump in the canal, say so."),
    NW: blocked("If you want to jump in the canal, say so."),
  },
  props: {
    [P.ACTION]: canalF,
  },
});

export function canalF(rarg: any): any {
  let num: any = 0;
  let dockDir: any = 0;
  if (eq(rarg, M_LOOK)) {
    num = canalLoc();
    dockDir = setDockDir(num);
    tell("The ", D(loc(PROTAGONIST)), " rocks gently in the current of a wide canal.");
    if (eq(num, 1, 7, 15) || eq(num, -1, 6) || eq(num, 10) && isIn(PROTAGONIST, RAFT)) {
      tell(" A dock is ");
      if (isIn(PROTAGONIST, RAFT)) {
        tell("close enough to grab");
      } else {
        tell("visible");
      }
      tell(" on the ", dockDir, "ern shore.");
    } else if (eq(num, 10)) {
      tell(" There are docks on both banks.");
    } else {
      tell(" The banks of the canal are steep and sandy.");
    }
    if (bargeVisibleAtDock()) {
      tell(" A ", PD(BARGE), " is moored to the dock");
      if (eq(num, 10)) {
        tell(" on the ");
        if (isIn(BARGE, ABANDONED_DOCK)) {
          tell("we");
        } else {
          tell("ea");
        }
        tell("stern shore");
      }
      tell(".");
    }
    if (eq(num, 5, 12, 29)) {
      tell(" A smaller canal flows diagonally into this one, and the channel widens slightly to accommodate the heavier flow.");
    } else if (eq(num, 9, 10)) {
      tell(" Just ");
      if (eq(num, 9)) {
        tell("ahead");
      } else {
        tell("behind");
      }
      tell(", the canal curves sharply to the ");
      if (eq(num, 9)) {
        tell("south.");
      } else {
        tell("west.");
      }
    }
    if (eq(num, 4, 5, 8)) {
      tell(" Sculpted reddish ", PD(DUNES), " rise into view beyond the banks of the canal.");
    }
    if (prob(15)) {
      tell(" The dark clouds of a sandstorm are visible on the horizon.");
    }
    if (eq(num, 15)) {
      tell(" A red warning buoy is anchored nearby. A sign atop the swaying buoy shows a skull and crossbones.");
    }
    if (num > 12 && num < 32) {
      if (eq(num, 31)) {
        tell("\n   ");
        describePowerTransmitter(31);
        if (!hasFlag(POWER_TRANSMITTER, TOUCHBIT)) {
          setFlag(POWER_TRANSMITTER, TOUCHBIT);
          tell("\n   As the ", D(loc(PROTAGONIST)), " passes through the beam, you feel a tingling from every cell in ", PD(YOUR_BODY), ".");
        }
      } else {
        tell(" ");
        describePowerTransmitter(num);
      }
    }
    return true;
  }
  return false;
}

export function bargeVisibleAtDock(): any {
  let num: any = 0;
  num = canalLoc();
  if (eq(num, 1) && isIn(BARGE, ROYAL_DOCKS) || eq(num, 6) && isIn(BARGE, BABY_DOCK) || eq(num, 7) && isIn(BARGE, DONALD_DOCK) || eq(num, 10) && eq(loc(BARGE), MY_KIND_OF_DOCK, ABANDONED_DOCK) || eq(num, 15) && isIn(BARGE, WATTZ_UPP_DOCK)) {
    return true;
  } else {
    return false;
  }
}

export function bargeFromCanalF(): any {
  if (!bargeVisibleAtDock()) {
    return cantSee(PSEUDO_OBJECT);
  } else if (isTouching(PSEUDO_OBJECT)) {
    return cantReach(PSEUDO_OBJECT);
  }
  return false;
}

export function buoyF(): any {
  let num: any = 0;
  num = canalLoc();
  if (!eq(num, 15) && !eq(G.here, WATTZ_UPP_DOCK)) {
    return cantSee(PSEUDO_OBJECT);
  } else if (verbIs(V.READ, V.EXAMINE)) {
    perform(V.READ, SIGN);
    return true;
  } else if (verbIs(V.TAKE, V.OPEN)) {
    tell(YOU_CANT);
    if (verbIs(V.TAKE)) {
      tell("take");
    } else {
      tell("open");
    }
    tell(" a buoy! Where'd you get such a silly idea?\n");
    return true;
  } else if (isTouching(PSEUDO_OBJECT)) {
    return cantReach(PSEUDO_OBJECT);
  }
  return false;
}

export function iCanal(): any {
  let num: any = 0;
  let moved: any = false;
  if (!isIn(BARGE, CANAL) && !isIn(RAFT, CANAL)) {
    dequeue(iCanal);
    return false;
  }
  if (isIn(BARGE, CANAL)) {
    if (G.bargeUnderPower || G.bargeWait) {
      if (isIn(PROTAGONIST, BARGE)) {
        moved = true;
      }
      G.bargeWait = false;
      if (G.raftHeld && isIn(RAFT, CANAL) && isIn(PROTAGONIST, BARGE)) {
        G.raftLocNum = G.raftLocNum + 1;
      }
      G.bargeLocNum = G.bargeLocNum + 1;
    } else {
      G.bargeWait = true;
    }
  }
  if (isIn(RAFT, CANAL) && !G.raftHeld) {
    if (G.raftWait) {
      if (isIn(PROTAGONIST, RAFT)) {
        moved = true;
      }
      G.raftWait = false;
      G.raftLocNum = G.raftLocNum + 1;
    } else {
      G.raftWait = true;
    }
  }
  num = canalLoc();
  if (eq(num, 31) && !isQueued(iIonDeath)) {
    if (isIn(SIDEKICK, loc(PROTAGONIST))) {
      G.sidekickIonized = true;
    }
    queue(iIonDeath, 6);
  }
  if (num < 17) {
    putp(POWER_TRANSMITTER, P.SDESC, "metallic glint");
  } else if (num > 30) {
    putp(POWER_TRANSMITTER, P.SDESC, "giant rusted structure");
  } else {
    putp(POWER_TRANSMITTER, P.SDESC, "metal structure");
  }
  if (!eq(G.here, CANAL)) {
    if (G.bargeLocNum > 36) {
      move(BARGE, ICY_DOCK);
      if (G.raftHeld) {
        move(RAFT, ICY_DOCK);
      }
    }
    if (G.raftLocNum > 36) {
      move(RAFT, ICY_DOCK);
    }
    bargeDocks();
    return false;
  } else if (!moved) {
    return false;
  }
  tell("   The ", D(loc(PROTAGONIST)), " ");
  if (eq(num, 10)) {
    if (G.bargeUnderPower && isIn(PROTAGONIST, BARGE)) {
      G.nearerDock = MY_KIND_OF_DOCK;
      tell("chugs quickly");
    } else {
      G.nearerDock = ABANDONED_DOCK;
      tell("drifts slowly");
    }
    tell(" around the bend, ending up near the ");
    if (G.bargeUnderPower && isIn(PROTAGONIST, BARGE)) {
      tell("ea");
    } else {
      tell("we");
    }
    tell("stern bank of");
  } else {
    if (G.bargeUnderPower && isIn(PROTAGONIST, BARGE)) {
      tell("barges");
    } else {
      tell("drifts");
    }
    tell(" further down");
  }
  tell(" the canal.");
  if (eq(num, 36)) {
    tell(" A wide dock spans the canal to the south. The ", D(loc(PROTAGONIST)), " butts up against it", PINNED, "\n");
    if (isIn(PROTAGONIST, RAFT) && isIn(BARGE, CANAL) && eq(G.bargeLocNum, 36)) {
      move(BARGE, ICY_DOCK);
    } else if (isIn(PROTAGONIST, BARGE) && isIn(RAFT, CANAL) && eq(G.raftLocNum, 36)) {
      move(BARGE, ICY_DOCK);
    }
    move(loc(PROTAGONIST), ICY_DOCK);
    goto(loc(PROTAGONIST));
    return true;
  }
  if (eq(G.handCover, EYES) || hasFlag(EYES, MUNGBIT)) {
    tell(" ", YOU_CANT, "see a thing, of course.\n");
  } else {
    crlf();
    crlf();
    describeRoom();
  }
  if (eq(G.bargeLocNum, G.raftLocNum) && isIn(RAFT, CANAL) && isIn(BARGE, CANAL)) {
    if (isIn(PROTAGONIST, RAFT)) {
      bargeF(M_OBJDESC);
      crlf();
    } else {
      raftF(M_OBJDESC);
      crlf();
    }
  }
  bargeDocks(true);
  return true;
}

defineObject(POWER_TRANSMITTER, 73, {
  in: CANAL,
  synonym: ["GLINT", "STRUCTURE", "MACHINE", "TOWER"],
  adjective: ["LARGE", "METAL", "METALLIC", "POWER", "LOOMING", "RUSTED", "MARTIAN"],
  flags: [NDESCBIT],
  props: {
    [P.SDESC]: EMPTY,
    [P.GENERIC]: genericMachineF,
    [P.ACTION]: powerTransmitterF,
  },
});

export function powerTransmitterF(): any {
  let num: any = 0;
  num = canalLoc();
  if (num > 31 || num < 13) {
    return cantSee(POWER_TRANSMITTER);
  } else if (verbIs(V.EXAMINE)) {
    describePowerTransmitter(num);
    crlf();
    return true;
  } else if (isTouching(POWER_TRANSMITTER)) {
    return cantReach(POWER_TRANSMITTER);
  }
  return false;
}

export function describePowerTransmitter(num: any): any {
  if (eq(num, 31)) {
    tell("The ", D(loc(PROTAGONIST)), " is now passing the metal structure that has been looming closer for the last hour. Its size and power are overwhelming; a relic of Martian technology at its height. Vacuum tubes the size of telephone booths produce power that was once beamed all over Mars. But now, in the twilight of the planet's civilization, the machine's base has rusted away. The massive tower now shoots its ion power beam uselessly across the canal, into the sand of the opposite bank.");
    return true;
  } else if (num < 17) {
    tell("You spy a metallic glint, far ahead.");
    return true;
  } else if (num > 27) {
    tell("A massive machine, unlike anything you've ever seen, rises from the shore, looming closer with each passing minute.");
    return true;
  } else {
    tell("A metal structure, glinting in the weak Martian sunlight, is visible at the edge of the canal");
    if (num < 21) {
      tell(", but far, far ahead.");
      return true;
    } else if (num < 24) {
      tell(" far ahead of you.");
      return true;
    } else {
      tell(", a bit too far to make out any details.");
      return true;
    }
  }
}

export const ION_TABLE = table("ION-TABLE", [
    EMPTY,
    "slight",
    "worsening",
    "splitting",
    "fantastically unbelievable ultra-awesome migraine",
  ]);

G.ionDeathCounter = 0;

G.sidekickIonized = false;

export function iIonDeath(): any {
  G.ionDeathCounter = G.ionDeathCounter + 1;
  tell("   ");
  if (G.ionDeathCounter > 4) {
    return jigsUp("Your anatomy, in absorbing a dose of super-ionized energy in trans-lethal levels, has ultimately equalized this submolecular environmental imbalance by fulminating a cataclysmic exothermic reaction. Or to put it in lay terms, you've just blown up.");
  } else {
    if (hasFlag(POWER_TRANSMITTER, MUNGBIT)) {
      queue(iIonDeath, 2);
    } else {
      queue(iIonDeath, 6);
    }
    vDiagnose();
    if (G.sidekickIonized && isVisible(SIDEKICK) && eq(G.ionDeathCounter, 3)) {
      tell("   ", D(SIDEKICK), " says, \"My head is pounding! I wish we had some aspirin.\"\n");
    }
    return true;
  }
}

export function bargeDocks(calledByInt: any = false): any {
  let dockRoom: any = 0;
  let dockDir: any = 0;
  if (G.mooringOn && isIn(BARGE, CANAL) && (eq(G.bargeLocNum, 7, 10, 15) || eq(G.bargeLocNum, 1, 6))) {
    if (calledByInt) {
      tell("  ");
    }
    dockRoom = setDockRoom(G.bargeLocNum);
    dockDir = setDockDir(G.bargeLocNum);
    if (isIn(BARGE, G.here)) {
      tell(" The barge drifts toward the dock on the ", dockDir, "ern shore, butting against it with a loud \"clank.\"");
      if (isIn(PROTAGONIST, BARGE)) {
        crlf();
      }
      crlf();
    }
    move(BARGE, dockRoom);
    if (isIn(PROTAGONIST, BARGE)) {
      if (G.raftHeld) {
        move(RAFT, dockRoom);
      }
      goto(BARGE);
    }
    G.bargeWait = false;
    return true;
  } else {
    return false;
  }
}

export function setDockRoom(num: any): any {
  if (eq(num, -1)) {
    return HICKORY_AND_DICKORY_DOCK;
  } else if (eq(num, 1)) {
    return ROYAL_DOCKS;
  } else if (eq(num, 6)) {
    return BABY_DOCK;
  } else if (eq(num, 7)) {
    return DONALD_DOCK;
  } else if (eq(num, 15)) {
    return WATTZ_UPP_DOCK;
  } else if (eq(G.nearerDock, MY_KIND_OF_DOCK)) {
    return MY_KIND_OF_DOCK;
  } else {
    return ABANDONED_DOCK;
  }
}

export function setDockDir(num: any): any {
  if (eq(num, -1, 1, 7)) {
    return "south";
  } else if (eq(num, 6)) {
    return "north";
  } else if (eq(num, 15)) {
    return "west";
  } else if (eq(G.nearerDock, MY_KIND_OF_DOCK)) {
    return "east";
  } else {
    return "west";
  }
}

defineObject(BABY_DOCK, 74, {
  in: ROOMS,
  desc: "Baby Dock",
  flags: [ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER, DUNES],
  exits: {
    SOUTH: blocked("If you want to jump in the canal, say so."),
    SE: blocked("If you want to jump in the canal, say so."),
    SW: blocked("If you want to jump in the canal, say so."),
    NORTH: to(AMONG_THE_DUNES),
  },
  props: {
    [P.LDESC]: "This tiny dock, partly buried by drifting sand, extends south into the canal. A break in the sand forms a trail to the north.",
  },
});

defineObject(AMONG_THE_DUNES, 75, {
  in: ROOMS,
  desc: "Among the Dunes",
  flags: [RLANDBIT, ONBIT, NARTICLEBIT],
  global: [DUNES],
  exits: {
    SOUTH: to(BABY_DOCK),
  },
  props: {
    [P.LDESC]: "You are in a tiny basin, protected by dunes from the fierce Martian winds. The dunes are impassable, except to the south.",
    [P.ACTION]: amongTheDunesF,
  },
});

G.wifeNumber = 0;

export function amongTheDunesF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !hasFlag(AMONG_THE_DUNES, TOUCHBIT)) {
    for (;;) {
      G.wifeNumber = 100 + random(8270);
      if (!eq(G.wifeNumber % 10, 0) && !isPalindromeNumber(G.wifeNumber)) {
        return true;
      }
    }
  }
  return false;
}

export function isPalindromeNumber(num: any): any {
  if (num > 999) {
    if (eq(div(num, 1000), num % 10)) {
      return true;
    } else {
      return false;
    }
  } else if (eq(div(num, 100), num % 10)) {
    return true;
  } else {
    return false;
  }
}

defineObject(LIP_BALM, 76, {
  in: AMONG_THE_DUNES,
  desc: "stick of lip balm",
  synonym: ["STICK", "BALM", "CHAPST", "GLOSS"],
  adjective: ["LIP", "SICK"],
  flags: [TAKEBIT],
  props: {
    [P.NO_T_DESC]: "sick of lip balm",
    [P.FDESC]: "The alien may have died of acute chapped lips (a perennial problem in the arid Martian climate). If so, it was a sudden death, for the lip balm near the body is completely unused.",
    [P.SIZE]: 2,
    [P.ACTION]: lipBalmF,
  },
});

export function lipBalmF(): any {
  if (hasFlag(LIP_BALM, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.PUT_ON) && prsiIs(MOUTH) || verbIs(V.WEAR)) {
    if (hasFlag(LIP_BALM, WORNBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else {
      move(LIP_BALM, PROTAGONIST);
      setFlag(LIP_BALM, WORNBIT);
      setFlag(MOUTH, MUNGBIT);
      tell("You coat your lips with the glistening balm, using up the whole stick.\n");
      return true;
    }
  } else if (verbIs(V.EXAMINE) && hasFlag(LIP_BALM, WORNBIT)) {
    performPrsa(MOUTH);
    return true;
  } else if (verbIs(V.REMOVE, V.CLEAN) && hasFlag(LIP_BALM, WORNBIT)) {
    move(LIP_BALM, LOCAL_GLOBALS);
    clearFlag(MOUTH, MUNGBIT);
    tell("You wipe away the lip balm.\n");
    return true;
  }
  return false;
}

defineObject(CODED_MESSAGE, 77, {
  in: AMONG_THE_DUNES,
  desc: "coded message",
  synonym: ["MESSAGE", "CODE"],
  adjective: ["STRANGE", "CODED"],
  flags: [TAKEBIT, READBIT, BURNBIT],
  props: {
    [P.FDESC]: "Lying next to the body, partially buried in the sand, is a strange coded message.",
    [P.SIZE]: 2,
    [P.ACTION]: codedMessageF,
  },
});

export function codedMessageF(): any {
  if (verbIs(V.READ, V.EXAMINE)) {
    tell("VSDFHHQN UXRB VVLN RW ");
    if (G.male) {
      tell("UH");
    } else {
      tell("PL");
    }
    tell("K JQLNVD BE ");
    if (G.male) {
      tell("UH");
    } else {
      tell("PL");
    }
    tell("K RW IOHVUXRB BILWQHGL -- SDP WHUFHV HKW WHJ GQD ");
    if (!G.male) {
      tell("VVH");
    }
    tell("QDWOXV HKW IR ");
    reverseNumber(G.wifeNumber);
    tell(" UHEPXQ ");
    if (G.male) {
      tell("HILZ");
    } else {
      tell("GQDEVXK");
    }
    tell(" WFDWQRF RW VL QRLVVLP UXRB\n");
    return true;
  }
  return false;
}

export function reverseNumber(num: any): any {
  for (;;) {
    printn(num % 10);
    num = div(num, 10);
    if (eq(num, 0)) {
      return true;
    }
  }
}

defineObject(MESSENGER, 78, {
  in: AMONG_THE_DUNES,
  desc: "dead alien",
  synonym: ["ALIEN", "SPY", "BODY"],
  adjective: ["STRANGE", "ALIEN", "DEAD"],
  props: {
    [P.FDESC]: "A strange alien, probably a member of one of the ancient warrior races of Mars, lies dead at the base of a dune.",
    [P.ACTION]: messengerF,
  },
});

export function messengerF(): any {
  if (verbIs(V.EXAMINE)) {
    tell("It's dead. Very dead.\n");
    return true;
  } else if (verbIs(V.FUCK, V.KISS)) {
    tell("Is there even a word for this sort of perverse behavior? Necro-xeno-philia? Xeno-necro-philia? Grosso-sicko-philia?\n");
    return true;
  } else if (verbIs(V.PUT_ON) && prsoIs(LIP_BALM)) {
    tell("Too late.\n");
    return true;
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  } else if (verbIs(V.ALARM)) {
    tell("This guy's not resting, he's deceased!\n");
    return true;
  }
  return false;
}

defineObject(DONALD_DOCK, 79, {
  in: ROOMS,
  desc: "Donald Dock",
  flags: [RLANDBIT, ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER, DUNES],
  exits: {
    NORTH: blocked("If you want to jump in the canal, say so."),
    NE: blocked("If you want to jump in the canal, say so."),
    NW: blocked("If you want to jump in the canal, say so."),
    SOUTH: to(DUNETOP),
    UP: to(DUNETOP),
  },
  props: {
    [P.LDESC]: "This dock, on the south shore of the canal, is named after Don Donald, the first resident of Mars. There are no paths leading inland, but a tall dune to the south is less steep than the others.",
  },
});

defineObject(DUNETOP, 80, {
  in: ROOMS,
  desc: "Dunetop",
  flags: [RLANDBIT, ONBIT],
  global: [DUNES, CANAL_OBJECT, DOCK_OBJECT],
  exits: {
    NORTH: to(DONALD_DOCK),
    EAST: to(CANALVIEW_MALL),
    DOWN: blocked("East or north?"),
  },
  props: {
    [P.LDESC]: "From this vantage, you can see the canal curving south, a bit downstream from here. Just after this bend, two docks flank the canal: an opulent dock on the east bank, and a dilapidated one on the closer shore.\n   You could slide down the dune to the north or the east.",
    [P.ACTION]: dunetopF,
  },
});

export function dunetopF(rarg: any): any {
  if (eq(rarg, M_ENTER) && eq(G.titsCounter, 0)) {
    return queue(iTits, -1);
  }
  return false;
}

G.titsCounter = 0;

export function iTits(): any {
  G.titsCounter = G.titsCounter + 1;
  if (!eq(G.naughtyLevel, 2)) {
    dequeue(iTits);
    return false;
  } else if (eq(G.titsCounter, 4)) {
    tell("   [A warning for any Jerry Falwell groupies who are miraculously still playing: we'll be using the word \"tits\" in five turns or so. Please consult the manual for the proper way to stop playing.]\n");
    return true;
  } else if (eq(G.titsCounter, 7)) {
    tell("   [Only a few turns until the \"tits\" reference! Use QUIT now if you might be offended!]\n");
    return true;
  } else if (eq(G.titsCounter, 9)) {
    tell("   [Last warning! The word \"tits\" will appear in the very next turn! This is your absolutely last chance to avoid seeing \"tits\" used!!!]\n");
    return true;
  } else if (eq(G.titsCounter, 10)) {
    dequeue(iTits);
    tell("   A hyperdimensional traveller suddenly appears out of thin air. \"My sister has tremendous breasts,\" says the traveller and, without further explanation, vanishes");
    if (!hasFlag(NOSE, MUNGBIT)) {
      tell(", leaving only a vague trace of interdimensional ozone");
    }
    tell(".\n   [Oh, regarding the use of \"tits,\" we changed our mind at the last minute. Everyone agreed it was too risque.]\n");
    return true;
  } else {
    return false;
  }
}

defineObject(ABANDONED_DOCK, 81, {
  in: ROOMS,
  desc: "Abandoned Dock",
  flags: [RLANDBIT, ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER, DUNES],
  exits: {
    WEST: to(CANALVIEW_MALL),
    EAST: blocked("If you want to jump in the canal, say so."),
    NE: blocked("If you want to jump in the canal, say so."),
    SE: blocked("If you want to jump in the canal, say so."),
  },
  props: {
    [P.LDESC]: "This dock is in remarkably good shape, considering that it hasn't been painted in fifteen thousand years. A wide canal, flowing south, lies to the east, and an opening between the dunes leads west.",
  },
});

defineObject(CANALVIEW_MALL, 82, {
  in: ROOMS,
  desc: "Canalview Mall",
  global: [DUNES],
  flags: [RLANDBIT, ONBIT],
  things: [
    { adjective: null, noun: "STORE", action: outsideShopF },
    { adjective: null, noun: "SHOP", action: outsideShopF },
  ],
  exits: {
    EAST: to(ABANDONED_DOCK),
    WEST: to(DUNETOP),
    UP: to(DUNETOP),
    SOUTH: to(EXIT_SHOP),
  },
  props: {
    [P.LDESC]: "As with all Martian civilization, this once-fashionable shopping center has fallen upon hard times; the only store to have endured the fifteen-millenia recession lies to the south. The canal is still as visible as it was when scheming marketeers misnamed the mall generations ago -- in other words, not at all. A path leads east, and a dune to the west seems mountable.",
  },
});

export function outsideShopF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    return doWalk(P.SOUTH);
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    tell(LOOK_AROUND);
    return true;
  }
  return false;
}

export function insideShopF(): any {
  if (verbIs(V.DISEMBARK, V.LEAVE, V.EXIT)) {
    return doWalk(P.NORTH);
  } else if (verbIs(V.BOARD, V.WALK_TO, V.ENTER)) {
    tell(LOOK_AROUND);
    return true;
  } else if (verbIs(V.SEARCH)) {
    performPrsa(DUST);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    return vLook();
  }
  return false;
}

defineObject(EXIT_SHOP, 83, {
  in: ROOMS,
  desc: "Exit Shop",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [SIGN],
  things: [
    { adjective: null, noun: "STORE", action: insideShopF },
    { adjective: null, noun: "SHOP", action: insideShopF },
  ],
  exits: {
    NORTH: to(CANALVIEW_MALL),
    OUT: to(CANALVIEW_MALL),
  },
  props: {
    [P.LDESC]: "This store is in good shape only relative to the other shops in the mall; for example, the last time it was vacuumed, humans were just inventing writing. The dust nearly covers the proprietor, who sits forlornly in the corner beneath a faded sign. An exit is barely visible through the dust to the north.",
    [P.ACTION]: exitShopF,
  },
});

export function exitShopF(rarg: any): any {
  if (eq(rarg, M_END) && !hasFlag(PROPRIETOR, TOUCHBIT)) {
    setFlag(PROPRIETOR, TOUCHBIT);
    tell("   ", PROPRIETOR_STIRS, "Don't get many customers these days, since they abandoned the dock. In fact, you're only the third in the last hundred and fifty centuries.\" He slips back into a drowse.\n");
    return true;
  }
  return false;
}

defineObject(PROPRIETOR, 84, {
  in: EXIT_SHOP,
  desc: "proprietor",
  synonym: ["PROPRIETOR", "OWNER"],
  adjective: ["FORLORN", "DROWSY"],
  flags: [ACTORBIT, NDESCBIT],
  props: {
    [P.ACTION]: proprietorF,
  },
});

export function proprietorF(): any {
  if (eq(PROPRIETOR, G.winner)) {
    if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"A bunch of deadbeats! Never pay their bills -- I've had to repossess God knows how many exits!\"\n");
      return true;
    } else {
      G.winner = PROTAGONIST;
      perform(V.ALARM, PROPRIETOR);
      return stop();
    }
  } else if (verbIs(V.ALARM)) {
    tell(PROPRIETOR_STIRS, "E", BOUGHT_AND_SOLD, ",\" he mumbles, \"e", BOUGHT_AND_SOLD, ".\" A moment later, he nods off.\n");
    return true;
  } else if (verbIs(V.BARTER_WITH) || verbIs(V.ASK_FOR) && prsiIs(EXIT_OBJECT)) {
    perform(V.BUY, EXIT_OBJECT);
    return true;
  } else if (verbIs(V.GIVE, V.SHOW) && prsoIs(TEN_MARSMID_COIN)) {
    tell("\"Humph? Eh, oh, sorry, no change for a ten. And the Mall Merchants Association would have my license if I accepted an overpayment. Try again in a year ... or two ... grunt snore.\"\n");
    return true;
  } else if (verbIs(V.GIVE, V.SHOW) && prsoIs(ONE_MARSMID_COIN)) {
    remove(ONE_MARSMID_COIN);
    move(TUBE, DUST);
    incrementScore(5, 12);
    tell("The proprietor slowly focuses one eye on the coin. \"Not much in stock these days,\" he explains. \"My supplier went bankrupt ninety thousand years ago.\" He takes the coin and starts to hand you a cardboard tube, but his eye drifts out of focus again, and he drops it wearily into the dust.\n");
    return true;
  } else if (verbIs(V.GIVE, V.SHOW) && prsoIs(FLEXIBLE_HOLE)) {
    tell(PROPRIETOR_STIRS, "Don't think I could sell such an out-of-date model. No one wants exits anymore, anyway. Don't know why I bother ... to stay in business ... zzzz.\"\n");
    return true;
  }
  return false;
}

defineObject(EXIT_OBJECT, 85, {
  in: GLOBAL_OBJECTS,
  desc: "exit",
  synonym: ["EXIT", "EGRESS"],
  flags: [VOWELBIT],
  props: {
    [P.ACTION]: exitObjectF,
  },
});

export function exitObjectF(): any {
  if (verbIs(V.BUY)) {
    if (eq(G.here, EXIT_SHOP)) {
      tell("\"One marsmid, please, grunt snore zzz.\"\n");
      return true;
    } else if (hasFlag(EXIT_SHOP, TOUCHBIT)) {
      tell("This isn't an ");
      printd(EXIT_SHOP);
      tell("!\n");
      return true;
    } else {
      tell("Buy an exit?!?!\n");
      return true;
    }
  } else if (verbIs(V.BUY_WITH) && prsiIs(ONE_MARSMID_COIN, TEN_MARSMID_COIN)) {
    perform(V.GIVE, G.prsi, PROPRIETOR);
    return true;
  } else if (verbIs(V.TAKE) && isIn(TUBE, DUST) && eq(G.here, EXIT_SHOP)) {
    tell("It's lost in the dust.\n");
    return true;
  }
  return false;
}

defineObject(DUST, 86, {
  in: EXIT_SHOP,
  desc: "dust",
  synonym: ["DUST"],
  flags: [NDESCBIT, NARTICLEBIT],
  props: {
    [P.ACTION]: dustF,
  },
});

export function dustF(): any {
  let x: any = false;
  if (verbIs(V.SEARCH, V.REACH_IN, V.DIG, V.LOOK_INSIDE, V.RAKE)) {
    if (x = first(DUST)) {
      move(x, PROTAGONIST);
      thisIsIt(x);
      tell("You grasp", A(x), "!\n");
      return true;
    } else {
      tell("You sift through the dust but find nothing.\n");
      return true;
    }
  } else if (verbIs(V.ENTER, V.BOARD)) {
    tell("You're already up to your neck in dust.\n");
    return true;
  } else if (verbIs(V.PUT) && prsiIs(DUST)) {
    perform(V.DROP, G.prso);
    return true;
  } else if (verbIs(V.CLEAN, V.MOVE, V.BLOW)) {
    tell("You'd need a plow to move this dust.\n");
    return true;
  }
  return false;
}

defineObject(TUBE, 87, {
  desc: "tube",
  synonym: ["TUBE", "UBE"],
  adjective: ["CARDBOARD", "MAILING", "NARROW"],
  flags: [CONTBIT, SEARCHBIT, TAKEBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "ube",
    [P.CAPACITY]: 2,
  },
});

defineObject(FLEXIBLE_HOLE, 88, {
  in: TUBE,
  desc: "flexible black circle",
  synonym: ["CIRCLE", "HOLE", "EXIT"],
  adjective: ["FLEXIBLE", "BLACK", "PORTABLE"],
  flags: [TAKEBIT],
  props: {
    [P.SIZE]: 1,
    [P.ACTION]: flexibleHoleF,
  },
});

export function flexibleHoleF(): any {
  let sidekickVisible: any = false;
  if (verbIs(V.EXAMINE)) {
    tell("The ", PD(FLEXIBLE_HOLE), " looks just like a portable version of the \"holes\" you've been encountering all over the solar system.\n");
    return true;
  } else if (verbIs(V.MEASURE)) {
    tell("The ", D(HOLE), " is two feet across.\n");
    return true;
  } else if (verbIs(V.REACH_IN, V.TOUCH, V.LOOK_INSIDE) && isIn(FLEXIBLE_HOLE, TUBE)) {
    if (meantOtherHole()) {
      return true;
    }
    return notOnGround(FLEXIBLE_HOLE);
  } else if (verbIs(V.REACH_IN, V.TOUCH)) {
    tell(HAND_DWINDLES);
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    tell(STARING_INTO_VOID);
    return true;
  } else if (verbIs(V.PUT, V.PUT_ON) && prsiIs(FLEXIBLE_HOLE)) {
    if (eq(loc(FLEXIBLE_HOLE), G.here, RAFT, BARGE)) {
      move(G.prso, BOUDOIR);
      return nonDimensionalJourney();
    } else if (meantOtherHole()) {
      return true;
    } else {
      return notOnGround(FLEXIBLE_HOLE);
    }
  } else if (verbIs(V.STAND_ON, V.ENTER, V.BOARD)) {
    if (isUltimatelyIn(FLEXIBLE_HOLE)) {
      if (meantOtherHole()) {
        return true;
      }
      tell(HOLDING_IT);
      return true;
    } else if (!isIn(PROTAGONIST, G.here) && !isIn(FLEXIBLE_HOLE, loc(PROTAGONIST))) {
      return notGoingAnywhere();
    } else if (!(eq(loc(FLEXIBLE_HOLE), G.here, TREE_HOLE) || eq(loc(FLEXIBLE_HOLE), RAFT, BARGE))) {
      if (meantOtherHole()) {
        return true;
      }
      return notOnGround(FLEXIBLE_HOLE);
    } else if (G.sidekickTripFlag && isQueued(iSidekickOutWindow)) {
      return doWalk(P.DOWN);
    } else {
      if (isVisible(SIDEKICK)) {
        sidekickVisible = true;
      }
      fallThroughHole();
      goto(BOUDOIR);
      if (isQueued(iIonDeath)) {
        setFlag(POWER_TRANSMITTER, MUNGBIT);
        queue(iIonDeath, 1);
      }
      if (sidekickVisible) {
        G.holeMove = true;
        sidekickFollowsYou();
      }
      return true;
    }
  }
  return false;
}

export function meantOtherHole(): any {
  if (prsoIs(FLEXIBLE_HOLE) && eq(get(P_ADJW, 0), ADJ.FLEXIBLE, ADJ.PORTABLE) || prsiIs(FLEXIBLE_HOLE) && eq(get(P_ADJW, 1), ADJ.FLEXIBLE, ADJ.PORTABLE)) {
    return false;
  } else if (!isGlobalIn(HOLE, G.here)) {
    return false;
  } else if (prsoIs(FLEXIBLE_HOLE)) {
    performPrsa(HOLE, G.prsi);
    return true;
  } else {
    performPrsa(G.prso, HOLE);
    return true;
  }
}

defineObject(MY_KIND_OF_DOCK, 89, {
  in: ROOMS,
  desc: "My Kinda Dock!",
  flags: [ONBIT, NARTICLEBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER, STAIRS],
  things: [
    { adjective: null, noun: "LIGHT", action: unimportantThingF },
  ],
  exits: {
    WEST: blocked("If you want to jump in the canal, say so."),
    SW: blocked("If you want to jump in the canal, say so."),
    NW: blocked("If you want to jump in the canal, say so."),
    EAST: to(MAIN_HALL_OF_PALACE),
    UP: to(MAIN_HALL_OF_PALACE),
  },
  props: {
    [P.SDESC]: "Now THIS Is My Kind of Dock",
    [P.LDESC]: "If I owned a pier on a major Martian canal, I'd want it to look just like this one -- handsome, well-proportioned, and amply endowed with jade and ivory. I could probably live without the alabaster stair which leads up at the end of the dock, to the east.",
  },
});

defineObject(MAIN_HALL_OF_PALACE, 90, {
  in: ROOMS,
  desc: "Main Hall of Palace",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [WATER, STAIRS, WINDOW],
  things: [
    { adjective: null, noun: "LIGHT", action: unimportantThingF },
  ],
  exits: {
    NORTH: blocked("As you approach, you realize that the archway in this direction is merely a design on a solid wall."),
    NE: to(AUDIENCE_CHAMBER),
    EAST: to(ORIENTAL_GARDEN),
    SE: blocked("As you approach, you realize that the archway in this direction is merely a design on a solid wall."),
    SOUTH: to(LAUNDRY_ROOM),
    SW: blocked("As you approach, you realize that the archway in this direction is merely a design on a solid wall."),
    WEST: to(MY_KIND_OF_DOCK),
    NW: blocked("As you approach, you realize that the archway in this direction is merely a design on a solid wall."),
    DOWN: to(MY_KIND_OF_DOCK),
  },
  props: {
    [P.LDESC]: "A shaft of sunlight penetrates the stained glass windows and glistens off a large reflecting pool, filling this huge entry hall with a seductive pattern of tantalizing colors. Gleaming marble pillars rise majestically from the pool to support a towering, arched roof. You are on a branching pathway suspended above the pool, leading toward shadowy archways in every direction.",
  },
});

defineObject(LAUNDRY_ROOM, 91, {
  in: ROOMS,
  desc: "Laundry Room",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  things: [
    { adjective: "DIRTY", noun: "LAUNDRY", action: unimportantThingF },
    { adjective: null, noun: "BRA", action: unimportantThingF },
    { adjective: null, noun: "BRAS", action: unimportantThingF },
    { adjective: null, noun: "BRASSIERE", action: unimportantThingF },
    { adjective: null, noun: "JOCKSTRAP", action: unimportantThingF },
  ],
  exits: {
    NORTH: to(MAIN_HALL_OF_PALACE),
    OUT: to(MAIN_HALL_OF_PALACE),
  },
  props: {
    [P.ACTION]: laundryRoomF,
  },
});

export function laundryRoomF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("One of the less pleasant aspects of running a palace is the sheer volume of dirty laundry its occupants produce. Why, the 8379 ");
    if (G.male) {
      tell("wive");
    } else {
      tell("husband");
    }
    tell("s alone could keep a crew of cleaners sleepless. Add in the servants, cooks, gardeners, stablehands, jesters, visiting nobles, brothers-in-law in virtual permanent residence... Suffice it to say that there's ");
    if (eq(G.naughtyLevel, 0)) {
      tell("quite");
    } else {
      tell("one hell of");
    }
    tell(" a lot of dirty laundry here. You can barely see the exit to the north through it all.");
    return true;
  }
  return false;
}

defineObject(CLOTHES_PIN, 92, {
  in: LAUNDRY_ROOM,
  desc: "clothes pin",
  synonym: ["PIN"],
  adjective: ["CLOTHES", "CLOHES"],
  flags: [TAKEBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "clohes pin",
    [P.FDESC]: "Today must be drying day at the laundry, since there's only one clothes pin left.",
    [P.SIZE]: 2,
    [P.ACTION]: clothesPinF,
  },
});

export function clothesPinF(): any {
  if (hasFlag(CLOTHES_PIN, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.PUT_ON, V.PIN) && prsoIs(CLOTHES_PIN)) {
    if (!prsiIs(NOSE)) {
      return wastes();
    } else if (G.goneApe) {
      tell(DEXTERITY);
      return true;
    } else if (hasFlag(CLOTHES_PIN, WORNBIT)) {
      tell(SENILITY_STRIKES);
      return true;
    } else {
      move(CLOTHES_PIN, PROTAGONIST);
      setFlag(CLOTHES_PIN, WORNBIT);
      setFlag(NOSE, MUNGBIT);
      tell("You pin your proboscis.\n");
      return true;
    }
  } else if (verbIs(V.PUT) && prsoIs(NOSE)) {
    perform(V.PUT_ON, CLOTHES_PIN, NOSE);
    return true;
  } else if (verbIs(V.TIE) && eq(G.pPrsaWord, W.ATTACH) && prsoIs(CLOTHES_PIN) && G.prsi) {
    perform(V.PUT_ON, CLOTHES_PIN, G.prsi);
    return true;
  } else if (verbIs(V.TAKE_WITH) && eq(G.pPrsaWord, W.HOLD) && prsoIs(NOSE)) {
    perform(V.PUT_ON, CLOTHES_PIN, NOSE);
    return true;
  } else if (verbIs(V.REMOVE, V.TAKE_OFF) && hasFlag(CLOTHES_PIN, WORNBIT)) {
    if (G.goneApe) {
      perform(V.TAKE, CLOTHES_PIN);
      return true;
    }
    openEyesAndRemoveHands();
    clearFlag(CLOTHES_PIN, WORNBIT);
    return senseAgain(NOSE);
  }
  return false;
}

defineObject(ORIENTAL_GARDEN, 93, {
  in: ROOMS,
  desc: "Oriental Garden",
  flags: [RLANDBIT, ONBIT],
  global: [TREE],
  things: [
    { adjective: "LARGE", noun: "WELL", action: wellF },
    { adjective: "STONE", noun: "WELL", action: wellF },
  ],
  exits: {
    WEST: to(MAIN_HALL_OF_PALACE),
    NORTH: to(AUDIENCE_CHAMBER),
    SE: to(BASE_OF_TOWER),
    DOWN: per(wellEnterF),
  },
  props: {
    [P.LDESC]: "These twisted trees and elegant footbridges are even more beautiful than the gardens of the most lavish Fu Manchu films. Paths from the north, southeast, and west meet at a large well of hand-carved stone in the center of the garden.",
  },
});

export function wellEnterF(): any {
  tell("You climb down the well for a long distance. Near the bottom the handholds end, so you");
  andSidekick(WELL_BOTTOM);
  tell(" leap the rest of the way, landing on", A(HOLE), ". ");
  G.here = WELL_BOTTOM;
  move(PROTAGONIST, WELL_BOTTOM);
  perform(V.STAND_ON, HOLE);
  return false;
}

export function wellF(): any {
  if (verbIs(V.LOOK_INSIDE, V.REACH_IN)) {
    tell("Handholds lead downward!\n");
    return true;
  } else if (verbIs(V.CLIMB_DOWN, V.CLIMB, V.CLIMB_UP, V.BOARD, V.ENTER)) {
    if (eq(G.here, WELL_BOTTOM)) {
      doWalk(P.UP);
    } else {
      wellEnterF();
    }
    return true;
  } else if (verbIs(V.PUT) && prsiIs(PSEUDO_OBJECT) && eq(G.here, ORIENTAL_GARDEN)) {
    move(G.prso, BARGE);
    if (prsoIs(TORCH)) {
      torchOff();
    }
    tell("It drops out of sight.\n");
    return true;
  }
  return false;
}

defineObject(TOWER, 94, {
  in: LOCAL_GLOBALS,
  desc: "tower",
  synonym: ["TOWER", "MINARET"],
  adjective: ["SLENDER", "TALL"],
  props: {
    [P.ACTION]: towerF,
  },
});

export function towerF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD, V.CLIMB, V.CLIMB_UP)) {
    if (eq(G.here, BASE_OF_TOWER)) {
      return doWalk(P.UP);
    } else if (eq(G.here, MINARET)) {
      tell(LOOK_AROUND);
      return true;
    }
    return false;
  } else if (verbIs(V.DISEMBARK, V.LEAVE, V.EXIT)) {
    if (eq(G.here, BASE_OF_TOWER)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      return doWalk(P.DOWN);
    }
  }
  return false;
}

defineObject(BASE_OF_TOWER, 95, {
  in: ROOMS,
  desc: "Base of Tower",
  flags: [RLANDBIT, ONBIT],
  global: [STAIRS, TOWER],
  exits: {
    UP: to(MINARET),
    NW: to(ORIENTAL_GARDEN),
  },
  props: {
    [P.LDESC]: "A slender tower protrudes magnificently above the palace grounds. A stair winds up into the tower and an oriental garden spreads out to the northwest.",
  },
});

defineObject(MINARET, 96, {
  in: ROOMS,
  desc: "Minaret",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE, STAIRS, TOWER, CANAL_OBJECT, WATER, DUNES, DOCK_OBJECT],
  exits: {
    DOWN: to(BASE_OF_TOWER),
  },
  props: {
    [P.LDESC]: "By standing erect at the parapet of this mighty tower, you command an exciting view. Below, gardens and courtyards intermingle with the palace buildings, forming a fertile oasis in the Martian desert. Off to the west, docks straddle a deep canal. On the far shore, sand dunes lap at crumbling buildings. On the top step of a winding stair is a black circle.",
    [P.HOLE_DESTINATION]: CRAMPED_SPACE,
  },
});

defineObject(AUDIENCE_CHAMBER, 97, {
  in: ROOMS,
  desc: "Audience Chamber",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  things: [
    { adjective: null, noun: "HAREM", action: haremObjectF },
    { adjective: null, noun: "WIFE", action: mateF },
    { adjective: null, noun: "HUSBAND", action: mateF },
  ],
  exits: {
    WEST: per(audienceChamberExitF),
    IN: per(audienceChamberExitF),
    SOUTH: per(audienceChamberExitF),
    SW: per(audienceChamberExitF),
  },
  props: {
    [P.ACTION]: audienceChamberF,
  },
});

export function audienceChamberF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("The good news is that this hall is intoxicatingly beautiful, laid with the snow-white fur of the rare Martian Velvetworm and endowed with platinum arches and balustrades. Silky curtains embrace openings to the south, southwest, and west.\n   The bad news is that no ");
    if (!G.male) {
      tell("wo");
    }
    tell("man has ever entered the ", D(G.here), " of", T(SULTAN), " and departed alive.");
    return true;
  } else if (eq(rarg, M_END) && !hasFlag(SULTAN, TOUCHBIT)) {
    setFlag(SULTAN, TOUCHBIT);
    return queue(iSultan, -1);
  }
  return false;
}

export function audienceChamberExitF(): any {
  if (!G.riddleAnswered) {
    tell("\"Rule violation! Rule violation!\" ");
    return riddleDeath();
  } else if (prsoIs(P.SOUTH)) {
    return ORIENTAL_GARDEN;
  } else if (prsoIs(P.SW)) {
    return MAIN_HALL_OF_PALACE;
  } else if (G.choiceNumber > 0 || eq(G.haremGuardCounter, 5)) {
    return HAREM;
  } else if (isRunning(iHaremGuard)) {
    queue(iHaremGuard, 2);
    tell("\"Hey!\" The ", PD(HAREM_GUARD), " pushes you back. \"Pick a number first!\n");
    return false;
  } else {
    queue(iHaremGuard, 2);
    move(HAREM_GUARD, AUDIENCE_CHAMBER);
    G.awaitingFakeOrphan = true;
    tell("A well-armed ");
    if (G.male) {
      tell("fe");
    }
    tell("male guard blocks you. \"Congratulations on your performance,\" ");
    sheHe();
    tell(" says in a bored voice. You wonder how the guard can be so unmoved by your historic feat. As though sensing your thoughts, the guard says, \"The ", D(SULTAN), " likes to pretend that no one's ever gotten the riddle, but someone got it last year, the word spread around, and now everyone knows the answer. You're the twelfth winner this week already. ");
    heShe(true);
    tell(" sent away to Maude's House of Riddles on Ganymede for a new one, but the mail is so slow...\" The guard shakes ");
    herHis();
    tell(" head. \"Well, pick a ");
    if (G.male) {
      tell("wife");
    } else {
      tell("husband");
    }
    tell("; any number from 1 to 8379. Don't waste time thinking; they're all clones anyway.\" ");
    sheHe(true);
    tell(" looks at you expectantly.\n");
    return false;
  }
}

defineObject(RIDDLE, 98, {
  in: AUDIENCE_CHAMBER,
  desc: "riddle",
  synonym: ["RIDDLE"],
  flags: [NDESCBIT],
});

export function mateF(): any {
  if (verbIs(V.PICK) && isIn(HAREM_GUARD, G.here)) {
    return iHaremGuard(true);
  } else if (!isPrsoMobyVerb() && !isPrsiMobyVerb()) {
    return cantSee(PSEUDO_OBJECT);
  }
  return false;
}

defineObject(HAREM_GUARD, 99, {
  desc: "harem guard",
  synonym: ["GUARD"],
  adjective: ["HAREM"],
  flags: [ACTORBIT],
  props: {
    [P.LDESC]: "A guard stands by the entrance to the harem, apparently waiting for a response from you.",
    [P.ACTION]: haremGuardF,
  },
});

export function haremGuardF(): any {
  if (eq(HAREM_GUARD, G.winner)) {
    if (verbIs(V.ANSWER_KLUDGE) && prsoIs(INTNUM)) {
      return pickWife(INTNUM);
    } else {
      return iHaremGuard(true);
    }
  } else if (verbIs(V.FOLLOW) && eq(G.followFlag, 13, 14)) {
    return doWalk(P.WEST);
  }
  return false;
}

G.haremGuardCounter = 0;

export function iHaremGuard(calledByHaremGuardF: any = false): any {
  G.haremGuardCounter = G.haremGuardCounter + 1;
  if (calledByHaremGuardF) {
    queue(iHaremGuard, 2);
  } else {
    queue(iHaremGuard, -1);
  }
  if (!eq(G.here, AUDIENCE_CHAMBER) || G.choiceNumber > 0) {
    G.awaitingFakeOrphan = false;
    dequeue(iHaremGuard);
    remove(HAREM_GUARD);
    return false;
  }
  if (!calledByHaremGuardF) {
    tell("   ");
  }
  tell("\"");
  if (eq(G.haremGuardCounter, 5)) {
    remove(HAREM_GUARD);
    G.followFlag = 14;
    queue(iFollow, 2);
    dequeue(iHaremGuard);
    G.awaitingFakeOrphan = false;
    tell("I'm not waiting around anymore! You blew it, sucker.\" The guard storms angrily away.\n");
    return true;
  } else {
    tell("Ahem? A number...?\" says", T(HAREM_GUARD));
    if (eq(G.haremGuardCounter, 4)) {
      tell(" with growing impatience");
    }
    tell(PERIOD_CR);
    return true;
  }
}

export function pickWife(obj: any = false): any {
  if (eq(obj, INTNUM) || eq(isNumber(G.pCont), W.NUMBER)) {
    if (G.pNumber < 1) {
      tell(GIMME_TROUBLE);
    } else if (G.pNumber > 8379) {
      tell("\"There're only 8379 of 'em.\"\n");
    } else if (zmemq(G.pNumber, WRONG_ANSWERS, 7)) {
      tell("\"You already asked for that one, dodo-brain!\"\n");
    } else if (eq(G.pNumber, G.wifeNumber) || prob(G.haremProb)) {
      G.choiceNumber = G.pNumber;
      G.awaitingFakeOrphan = false;
      G.followFlag = 13;
      queue(iFollow, 2);
      remove(HAREM_GUARD);
      queue(iHarem, 5);
      tell("The guard, walking off, says, \"I'll summon that one. You may enter.\"\n");
    } else {
      put(WRONG_ANSWERS, div(G.haremProb, 15), G.pNumber);
      G.haremProb = G.haremProb + 15;
      tell("The guard consults a list. \"");
      if (prob(25)) {
        tell("Traded to the Du");
        if (G.male) {
          tell("ke");
        } else {
          tell("chess");
        }
        tell(" of Deimos for two eunuchs and a jester to be named later");
      } else {
        tell(() => pickOne(EXCUSES));
      }
      tell(". Pick another number.\"\n");
    }
  } else {
    tell("[Please give your selection in numerical form.]\n");
  }
  queue(iHaremGuard, 2);
  return stop();
}

G.haremProb = 0;

G.choiceNumber = 0;

export const WRONG_ANSWERS = table("WRONG-ANSWERS", [0, 0, 0, 0, 0, 0, 0, 0]);

export const EXCUSES = ltable("EXCUSES", [0, "Oops, deceased", "Vacationing on Ceres", "Bad case of harem fever"]);

defineObject(SULTAN, 100, {
  in: AUDIENCE_CHAMBER,
  synonym: ["SULTAN"],
  flags: [ACTORBIT],
  props: {
    [P.SDESC]: EMPTY,
    [P.DESCFCN]: sultanF,
    [P.ACTION]: sultanF,
  },
});

export function sultanF(oarg: any = false): any {
  if (oarg) {
    if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    tell("   The ", D(SULTAN), " is here,");
    if (G.riddleAnswered) {
      return arguingWithLegalAdvisor();
    } else {
      tell(" enthroned.");
      return true;
    }
  } else if (eq(SULTAN, G.winner)) {
    if (verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"They were exiled from Leather Island in the Caribbean, after cheating in the Miss Leather Island beauty pageant; the silicone injectionist spilled the beans. Now they rule all of Phobos. Hmmph! They call that hunk of rock a Sultanate? Those bimbos never told a decent riddle in their lives!\"\n");
      return true;
    } else if (verbIs(V.WHAT, V.WHERE)) {
      tell("\"I ask the riddles around here!\"\n");
      return true;
    } else if (verbIs(V.YES) && eq(G.awaitingReply, 1)) {
      return vYes();
    } else if (verbIs(V.NO) && eq(G.awaitingReply, 1)) {
      return vNo();
    } else if (verbIs(V.ANSWER_KLUDGE, V.USE_QUOTES) && G.awaitingFakeOrphan && !G.riddleAnswered) {
      if (!prsoIs(RIDDLE)) {
        riddleAnswer();
        return true;
      }
      G.riddleAnswered = true;
      dequeue(iSneeze);
      incrementScore(8, 11);
      tell("The ", D(SULTAN), " looks crestfallen. \"Yes, that's right.\" The ", D(SULTAN), " is struck by a thought. \"Can we kill ");
      himHer();
      tell(" anyway?\" ");
      heShe(true);
      tell(" begins");
      arguingWithLegalAdvisor();
      tell(" This might be a good time to make a beeline for the harem to the west.\n");
      return true;
    } else {
      tell("The ", D(SULTAN), " ignores you.\n");
      return stop();
    }
  } else if (!G.riddleAnswered && (isTouching(SULTAN) || verbIs(V.THROW) && prsiIs(SULTAN))) {
    return doWalk(P.WEST);
  } else if (verbIs(V.GIVE, V.SHOW) && prsoIs(CODED_MESSAGE)) {
    tell("\"A spy! A spy!\" ");
    return riddleDeath();
  } else if (verbIs(V.LISTEN) && G.riddleAnswered) {
    tell("The ", D(SULTAN), " is");
    arguingWithLegalAdvisor();
    crlf();
    return true;
  }
  return false;
}

export function arguingWithLegalAdvisor(): any {
  tell(" arguing loudly with one of ");
  hisHer();
  tell(" legal advisors.");
  return true;
}

G.sultanCounter = 0;

export function iSultan(): any {
  G.sultanCounter = G.sultanCounter + 1;
  tell("   ");
  if (G.sultanCounter > 1) {
    if (eq(G.sultanCounter, 4)) {
      tell("\"Have this bore devoured.\" ");
      riddleDeath();
    } else {
      tell("\"I grow impatient. ");
    }
  } else {
    G.awaitingReply = 1;
    tell("\"Ah,\" says", T(SULTAN), ", \"a visitor. This is pleasing; it was turning out to be a very dull morning.\" ");
    heShe(true);
    tell(" clears ");
    hisHer();
    tell(" throat. \"The rules: I will pose a riddle. If you answer it correctly, you may spend one hour with any of my ");
    if (G.male) {
      tell("wive");
    } else {
      tell("husband");
    }
    tell("s.");
    youWillDie("you answer incorrectly");
    youWillDie("you do not answer");
    youWillDie("you enter the harem before answering");
    youWillDie("you attempt to leave");
    youWillDie("you touch me in any way");
    youWillDie("I happen to sneeze");
    youWillDie("any situation not covered by the rules occurs");
    tell("\" ");
    heShe(true);
    G.awaitingReply = 1;
    tell(" motions to one of the palace eunuchs. \"Go tell the animal tenders not to feed the tigers yet.\" Pause. \"");
  }
  tell("Are you ready?\"\n");
  return true;
}

export function youWillDie(string: any): any {
  tell(" If ", string, ", you will die.");
  return true;
}

export function riddleDeath(): any {
  return jigsUp("You never actually notice where the tiger comes from, only that it seems very very very very ferocious.");
}

export function iSneeze(): any {
  queue(iSneeze, -1);
  G.sultanCounter = G.sultanCounter + 1;
  tell("   The ", D(SULTAN));
  if (eq(G.sultanCounter, 4)) {
    tell(" convulses. \"Achoooooo!!!!\" ");
    return riddleDeath();
  } else if (eq(G.sultanCounter, 3)) {
    tell(" is squinting and drawing in quick gasps of air!\n");
    return true;
  } else if (eq(G.sultanCounter, 2)) {
    tell(" is rubbing ");
    hisHer();
    tell(" nose with the back of ");
    hisHer();
    tell(" hand.\n");
    return true;
  } else {
    tell(" is twitching ");
    hisHer();
    tell(" nose.\n");
    return true;
  }
}

G.riddleAnswered = false;

export function riddleAnswer(): any {
  if (!G.pCont && !G.prso) {
    G.prso = SULTAN;
    return vTell();
  } else if (G.pCont && (eq(get(P_LEXV, G.pCont), W.RIDDLE) || eq(get(P_LEXV, G.pCont + 2), W.RIDDLE))) {
    G.winner = SULTAN;
    perform(V.ANSWER_KLUDGE, RIDDLE);
    G.winner = PROTAGONIST;
    return stop();
  } else if (G.pCont && eq(get(P_LEXV, G.pCont), W.SEX, W.LOVE) || prsoIs(LOVE)) {
    tell("\"Good guess! It's wrong, though.\" ");
    return riddleDeath();
  } else {
    tell("\"Wrongo!\" ");
    return riddleDeath();
  }
}

defineObject(HAREM, 101, {
  in: ROOMS,
  desc: "Harem",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [ODOR],
  things: [
    { adjective: null, noun: "HAREM", action: haremObjectF },
  ],
  exits: {
    EAST: to(AUDIENCE_CHAMBER),
    OUT: to(AUDIENCE_CHAMBER),
  },
  props: {
    [P.ODOR]: EMPTY,
    [P.ODOR_NUMBER]: 4,
    [P.ACTION]: haremF,
  },
});

export function haremF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This is a sensuous location of silks and satins and furs. A draped exit leads east.");
    if (!hasFlag(NOSE, MUNGBIT)) {
      tell(" A pleasant odor");
      if (hasFlag(G.here, SMELLEDBIT)) {
        tell(" of ", getp(G.here, P.ODOR));
      }
      tell(" tickles mischievously at ", PD(NOSE), ".");
    }
    return true;
  } else if (eq(rarg, M_END) && isIn(SIDEKICK, G.here) && isQueued(iHarem)) {
    tell("   A ", PD(HAREM_GUARD), " grabs ", D(SIDEKICK), ". \"You didn't answer the riddle!\" ");
    return tigerEatsSidekick();
  } else if (eq(rarg, M_SMELL)) {
    tell(IT_SEEMS_THAT, T(SULTAN), " likes h");
    if (G.male) {
      tell("is wives");
    } else {
      tell("er husbands");
    }
    tell(" to wear fine ", getp(G.here, P.ODOR), ".");
    return true;
  }
  return false;
}

export function tigerEatsSidekick(): any {
  remove(SIDEKICK);
  G.followFlag = 2;
  queue(iFollow, 2);
  G.sidekickEaten = true;
  tell(D(SIDEKICK), " is led away. As you hear, from nearby, a fierce roar followed by a blood-curdling scream");
  return memoriam();
}

export function iHarem(): any {
  if (eq(G.here, HAREM)) {
    tell("   A figure, completely cloaked in veils of silk, enters and beckons you deeper into the harem", ELLIPSIS);
    goto(INNER_HAREM);
    thisIsIt(SULTANS_WIFE);
    clearFlag(SULTANS_WIFE, NDESCBIT);
    queue(iHour, 60);
    tell("   ", D(SULTANS_WIFE));
    if (eq(G.naughtyLevel, 0)) {
      tell(" sits down at the far end of the room.\n");
      return true;
    } else {
      tell(" touches a button at the shoulder of ");
      herHis();
      tell(" tunic and it slowly floats to the floor. ");
      sheHe(true);
      tell(" pulls you down onto the furs, whispering in a husky voice, \"For an hour, I am yours.\"\n");
      return true;
    }
  } else {
    return false;
  }
}

export function iHour(): any {
  if (eq(G.here, INNER_HAREM)) {
    tell("   \"The hour is over,\" sighs ", D(SULTANS_WIFE), ", reluctantly leading you out of the ", PD(G.here), ELLIPSIS);
    return goto(HAREM);
  } else {
    return false;
  }
}

export function haremObjectF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, AUDIENCE_CHAMBER)) {
      return doWalk(P.WEST);
    } else if (eq(G.here, HAREM, INNER_HAREM)) {
      tell(LOOK_AROUND);
      return true;
    }
    return false;
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    if (eq(G.here, AUDIENCE_CHAMBER)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      return doWalk(P.OUT);
    }
  } else if (verbIs(V.EXAMINE) && !eq(G.here, AUDIENCE_CHAMBER)) {
    return vLook();
  } else if (verbIs(V.SMELL) && !eq(G.here, AUDIENCE_CHAMBER)) {
    performPrsa(ODOR);
    return true;
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

defineObject(INNER_HAREM, 102, {
  in: ROOMS,
  desc: "Inner Harem",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [ODOR],
  things: [
    { adjective: null, noun: "HAREM", action: haremObjectF },
  ],
  exits: {
    DOWN: per(catacombsEnterF),
    SE: per(innerHaremExitF),
    OUT: per(innerHaremExitF),
  },
  props: {
    [P.ACTION]: innerHaremF,
  },
});

export function innerHaremF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This luxurious bedroom, presumably one of many throughout the harem, is appointed with a multitude of exotic furs, warm to the touch as though still alive. ");
    if (!hasFlag(NOSE, MUNGBIT)) {
      tell("The heady aroma of ", getp(HAREM, P.ODOR), " and incense mingle in the air. ");
    }
    tell("There's an exit to the southeast");
    if (G.catacombsOpen) {
      tell(" and a secret passage leads downward");
    }
    tell(".");
    return true;
  }
  return false;
}

export function innerHaremExitF(): any {
  if (isUltimatelyIn(MAP) && isVisible(MAP)) {
    tell("As", T(SULTANS_WIFE));
    return jigsUp(" forewarned, the guards reduce you to three dots.");
  } else {
    return HAREM;
  }
}

defineObject(SULTANS_WIFE, 103, {
  in: INNER_HAREM,
  synonym: ["HUSBAND", "WIFE"],
  adjective: ["SULTAN"],
  flags: [ACTORBIT, NARTICLEBIT, NDESCBIT],
  props: {
    [P.DESCFCN]: sultansWifeF,
    [P.ACTION]: sultansWifeF,
  },
});

export function sultansWifeF(oarg: any = false): any {
  if (oarg) {
    if (eq(oarg, M_OBJDESC_Q)) {
      return true;
    }
    tell("   ", D(SULTANS_WIFE), " is here");
    if (!eq(G.naughtyLevel, 0)) {
      tell(", lying seductively naked on a bed of furs");
    }
    tell(".");
    return true;
  } else if (eq(G.winner, SULTANS_WIFE)) {
    if (verbIs(V.KISS) && prsoIs(KNEECAPS) && !G.catacombsOpen || verbIs(V.KISS_ON) && prsoIs(ME) && prsiIs(KNEECAPS) && !G.catacombsOpen) {
      if (eq(G.choiceNumber, G.wifeNumber)) {
        move(MAP, G.here);
        move(TORCH, G.here);
        queue(iTorch, 23);
        dequeue(iHour);
        G.catacombsOpen = true;
        openEyesAndRemoveHands();
        tell("\"Oh,\" whispers ", D(SULTANS_WIFE), ", \"you're from the rebels! Here's", T(MAP), ",\" ");
        sheHe();
        tell(" says, laying", A(MAP), " at your feet, \"and here's", A(TORCH), ",\" ");
        sheHe();
        tell(" says, lighting", A(TORCH), " and placing it next to the map. ");
        sheHe(true);
        tell(" moves some furs to reveal a secret entrance leading downwards. \"The only way out is through the catacombs -- if you come back this way with", T(MAP), ",", T(HAREM_GUARD), "s will...\"\n");
        return true;
      } else {
        tell("\"I'm not into that kinky stuff.\"\n");
        return true;
      }
    } else if (verbIs(V.KISS, V.SUCK, V.FUCK, V.EAT, V.LICK, V.BLOW, V.TAKE, V.TOUCH) && eq(G.naughtyLevel, 0) && prsoIs(ME, COCK)) {
      G.winner = PROTAGONIST;
      perform(V.FUCK, SULTANS_WIFE);
      G.winner = SULTANS_WIFE;
      return true;
    } else if (verbIs(V.KISS) && prsoIs(ME)) {
      G.winner = PROTAGONIST;
      performPrsa(SULTANS_WIFE);
      G.winner = SULTANS_WIFE;
      return true;
    } else if (verbIs(V.FUCK, V.TAKE) && prsoIs(ME)) {
      G.winner = PROTAGONIST;
      perform(V.FUCK, SULTANS_WIFE);
      G.winner = SULTANS_WIFE;
      return true;
    } else if (verbIs(V.EAT, V.LICK, V.BLOW, V.SUCK) && prsoIs(ME, COCK)) {
      if (eq(G.naughtyLevel, 1)) {
        tell(MISSIONARY_ONLY);
        return true;
      } else {
        tell(D(SULTANS_WIFE), " nods eagerly and slides downward. Skillful tongue-work soon has you squirming on the edge of orgasm... Eventually, spent and satisfied, you take ", D(SULTANS_WIFE), " lovingly into your arms.\n");
        return true;
      }
    } else if (verbIs(V.WHAT) && prsoIs(LGOP) || verbIs(V.TELL_ABOUT) && prsoIs(ME) && prsiIs(LGOP)) {
      tell("\"That's the code name of the cadre who lead the rebel underground. It is said they have pledged their lives and souls to the revolution!\"\n");
      return true;
    } else {
      tell("\"Shhh... ");
      if (eq(G.naughtyLevel, 0)) {
        tell("It's past bedtime for the children of", T(SULTAN), "! You'll wake them!\"\n");
        return stop();
      } else {
        tell("Let ", PD(YOUR_BODY), " do the talking,\" says ", D(SULTANS_WIFE), ", reaching out toward you.\n");
        return stop();
      }
    }
  } else if (wrongSexWord(SULTANS_WIFE, W.WIFE, W.HUSBAND)) {
    return stop();
  } else if (verbIs(V.THANK) && G.catacombsOpen) {
    tell(D(SULTANS_WIFE), " gives you a grand salute. \"For the revolution!\"\n");
    return true;
  } else if (verbIs(V.KISS, V.TOUCH, V.FUCK, V.TAKE) && eq(G.naughtyLevel, 0)) {
    tell("Instead, you decide to get to know ", D(SULTANS_WIFE), " better, so you engage ");
    herHim();
    tell(" in a stimulating discussion about ", () => pickOne(DISCUSSION_TOPICS), "\n");
    return true;
  } else if (verbIs(V.EAT)) {
    if (eq(G.naughtyLevel, 0)) {
      return vFuck();
    } else if (eq(G.naughtyLevel, 1)) {
      tell(MISSIONARY_ONLY);
      return true;
    } else {
      tell(D(G.prso), " arches ");
      herHis();
      tell(" body to meet you, passionately stroking your neck and shoulders.\n");
      return true;
    }
  } else if (verbIs(V.UNDRESS) && !eq(G.naughtyLevel, 0)) {
    sheHe(true);
    tell(" is!\n");
    return true;
  } else if (verbIs(V.DRESS)) {
    tell("You must be from Massachusetts.\n");
    return true;
  } else if (verbIs(V.KISS, V.TOUCH, V.TAKE)) {
    tell(D(SULTANS_WIFE), " moans softly and draws closer to you.\n");
    return true;
  } else if (verbIs(V.FUCK)) {
    if (G.wifeFucked) {
      tell("You shouldn't wear yourself out. [Besides, do you think there's infinite room on this disk for long, lurid descriptions of sex acts?]\n");
      return true;
    }
    G.wifeFucked = true;
    tell(D(SULTANS_WIFE), " draws you into ");
    herHis();
    tell(" arms. ");
    if (eq(G.naughtyLevel, 2)) {
      tell("As ", PD(HANDS), "s explore h");
      if (G.male) {
        tell("er soft, rounded");
      } else {
        tell("is firm, strong");
      }
      tell(" body, a faint sweaty, musky odor triggers a passionate fire within you, and you find yourself ");
      if (G.male) {
        tell("ris");
      } else {
        tell("warm");
      }
      tell("ing to the occasion. Your lovemaking is slow and gentle, and as you reach a crescendo of pleasure, you cry out softly, passionately, and repeatedly. \"Oh,\" moans ", D(SULTANS_WIFE), ", \"say my number again ... say it in French...\"\n");
    }
    tell("Much later, you and ", D(SULTANS_WIFE), " fall back upon the furs, basking in the aura of postcoital bliss.\n");
    return true;
  } else if (verbIs(V.MARRY)) {
    tell("But ", D(G.prso), " is already married!\n");
    return true;
  } else if (verbIs(V.MEASURE)) {
    if (G.male) {
      tell("36-24-36");
    } else if (eq(G.naughtyLevel, 0)) {
      tell("Tall");
    } else if (eq(G.naughtyLevel, 1)) {
      tell("Long");
    } else {
      tell("Ten delicious inches");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.EXAMINE) && !eq(G.naughtyLevel, 0)) {
    tell("A mere glance at the succulent, sexy body of ", D(SULTANS_WIFE), " is enough to ");
    if (eq(G.naughtyLevel, 1)) {
      tell("really turn you on");
    } else if (G.male) {
      tell("give you an instant hard-on");
    } else {
      tell("get you all moist and randy");
    }
    tell(PERIOD_CR);
    return true;
  } else if (verbIs(V.SMELL)) {
    sheHe(true);
    tell(" smells of ", getp(HAREM, P.ODOR), PERIOD_CR);
    return true;
  }
  return false;
}

G.wifeFucked = false;

export const DISCUSSION_TOPICS = ltable("DISCUSSION-TOPICS", [
    0,
    "the latest sounds in jazz.",
    "a new radio serial.",
    "possible uses of electricity.",
    "the writings of Jules Verne.",
    "the intelligence level of beavers.",
  ]);

defineObject(TORCH, 104, {
  synonym: ["TORCH", "ORCH"],
  adjective: ["RELIABLE", "UNRELIABLE"],
  flags: [TAKEBIT, ONBIT, LIGHTBIT],
  props: {
    [P.SDESC]: "reliable torch",
    [P.NO_T_DESC]: "orch",
    [P.ACTION]: torchF,
  },
});

export function torchF(): any {
  if (verbIs(V.OFF) && hasFlag(TORCH, ONBIT)) {
    torchOff();
    tell(PFFT);
    return true;
  } else if (verbIs(V.ON) && !hasFlag(TORCH, ONBIT)) {
    perform(V.BURN, TORCH);
    return true;
  } else if (verbIs(V.BURN) && prsoIs(TORCH) && hasFlag(TORCH, ONBIT)) {
    perform(V.ON, TORCH);
    return true;
  } else if (verbIs(V.PUT, V.PUT_ON) && hasFlag(TORCH, ONBIT) && prsiIs(BARGE, TRELLIS) && !hasFlag(G.prsi, UNTEEDBIT)) {
    tell("The ", PD(G.prsi), " would burn!\n");
    return true;
  } else if (verbIs(V.PUT) && prsiIs(CANAL, WATER) && hasFlag(TORCH, ONBIT)) {
    torchOff();
    tell(PFFT);
    return true;
  }
  return false;
}

G.torchLife = 5;

export function torchOff(): any {
  dequeue(iTorch);
  clearFlag(TORCH, ONBIT);
  clearFlag(TORCH, LIGHTBIT);
  putp(TORCH, P.SDESC, "unreliable torch");
  setFlag(TORCH, VOWELBIT);
  return true;
}

export function iTorch(): any {
  G.torchLife = G.torchLife - 1;
  if (eq(G.torchLife, 0)) {
    torchOff();
  } else {
    queue(iTorch, G.torchLife * 6);
  }
  if (isVisible(TORCH) && !hasFlag(EYES, MUNGBIT) && !eq(G.handCover, EYES)) {
    tell("   ");
    if (eq(G.torchLife, 0)) {
      tell(PFFT);
      isNowDark();
    } else {
      tell("The torch is noticeably dimmer.\n");
    }
  }
  return false;
}

defineObject(MAP, 105, {
  desc: "secret map",
  synonym: ["MAP"],
  adjective: ["SECRET", "SECRE"],
  flags: [TAKEBIT, BURNBIT, READBIT],
  props: {
    [P.NO_T_DESC]: "secre map",
    [P.SIZE]: 2,
    [P.ACTION]: mapF,
  },
});

export function mapF(): any {
  if (verbIs(V.READ, V.EXAMINE) && !hasFlag(G.prso, UNTEEDBIT)) {
    inYourPackage("secret catacombs map");
    crlf();
    return true;
  }
  return false;
}

G.catacombsOpen = false;

export function catacombsEnterF(): any {
  if (G.catacombsOpen) {
    queue(iBeetles, 6);
    queue(iCrabs, 10);
    queue(iGator, 12);
    tell("As you leave, ");
    if (eq(G.naughtyLevel, 0)) {
      perform(V.THANK, SULTANS_WIFE);
      crlf();
    } else {
      tell(D(SULTANS_WIFE));
      if (G.male) {
        tell(" throws herself into your arms. Her ample bosom presses against your chest as she whispers into your ear, \"Please, oh, please be careful down there!\" Sh");
      } else {
        tell(" gathers you into his powerful arms. Nibbling tenderly on your neck, he whispers, \"Be wary -- the catacombs are dangerous.\" H");
      }
      tell("e kisses you longingly, but eventually you descend, reluctantly, into the gloom of the catacombs", ELLIPSIS);
    }
    return CATACOMBS;
  } else {
    tell(CANT_GO);
    return false;
  }
}

defineObject(CATACOMBS, 106, {
  in: ROOMS,
  desc: "Catacombs",
  global: [WATER],
  flags: [INDOORSBIT],
  exits: {
    NORTH: per(catacombsMovementF),
    NE: per(catacombsMovementF),
    EAST: per(catacombsMovementF),
    SE: per(catacombsMovementF),
    SOUTH: per(catacombsMovementF),
    SW: per(catacombsMovementF),
    WEST: per(catacombsMovementF),
    NW: per(catacombsMovementF),
    UP: per(catacombsMovementF),
    DOWN: per(catacombsMovementF),
  },
  props: {
    [P.ACTION]: catacombsF,
  },
});

export function catacombsF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("You're at a junction within an ancient, crumbling catacomb. Your ");
    if (isUltimatelyIn(TORCH) && hasFlag(TORCH, ONBIT)) {
      tell("torch");
    }
    tell("light pierces the gloom for only a few feet in each direction. ", CATACOMBS_WATER_DESC);
    return true;
  } else if (eq(rarg, M_END) && G.sidekickEaten) {
    move(SIDEKICK, G.here);
    G.sidekickEaten = false;
    tell("   \"Yo!\" says ", D(SIDEKICK), ", tapping your shoulder. \"Looked like my number was up that time! Would've been, if those dimension-hopping midgets hadn't come through at the right moment. Good thing the tiger cage leads to the catacombs, eh?\" ");
    heShe(true);
    tell(" brushes a stray patch of fur off ");
    hisHer();
    tell(" shoulder.\n");
    return true;
  }
  return false;
}

export function catacombsMovementF(): any {
  let dirOffset: any = 0;
  let tableValue: any = 0;
  let _t1: any;
  if (!G.lit) {
    jigsUp("You stumble into the dark, hit a wall, knock yourself unconscious, fall into a foot of water, drown, and are devoured by Martian beetles.");
  }
  if (prsoIs(P.NORTH)) {
    _t1 = 0;
  } else if (prsoIs(P.NE)) {
    _t1 = 1;
  } else if (prsoIs(P.EAST)) {
    _t1 = 2;
  } else if (prsoIs(P.SE)) {
    _t1 = 3;
  } else if (prsoIs(P.SOUTH)) {
    _t1 = 4;
  } else if (prsoIs(P.SW)) {
    _t1 = 5;
  } else if (prsoIs(P.WEST)) {
    _t1 = 6;
  } else if (prsoIs(P.NW)) {
    _t1 = 7;
  } else if (prsoIs(P.UP)) {
    _t1 = 8;
  } else {
    _t1 = 9;
  }
  dirOffset = _t1;
  tableValue = get(CATACOMBS_TABLE, (G.catacombsLoc - 1) * 10 + dirOffset);
  tell("You wade into the gloom ... and find ");
  if (eq(tableValue, 0)) {
    if (prsoIs(P.UP, P.DOWN)) {
      tell("a severe paucity of passages leading ");
      if (prsoIs(P.UP)) {
        tell("up");
      } else {
        tell("down");
      }
    } else {
      tell("yourself face to face with a blank wall");
    }
    tell(PERIOD_CR);
    return false;
  } else {
    tell("a ");
    if (prsoIs(P.UP, P.DOWN)) {
      tell("hidden passage leading ");
      if (prsoIs(P.UP)) {
        tell("up");
      } else {
        tell("down");
      }
      tell("wards.");
    } else {
      tell("dark and winding tunnel.");
    }
    if (eq(tableValue, 99)) {
      tell(" Unfortunately, you soon come to a point where the tunnel has collapsed, hopelessly blocking your way.\n");
      return false;
    } else if (eq(tableValue, 80)) {
      tell(" Unfortunately, it's too steep and slippery.\n");
      return false;
    } else {
      crlf();
      crlf();
      if (eq(tableValue, 40)) {
        return FORGOTTEN_STOREHOUSE;
      } else if (eq(tableValue, 50)) {
        return WELL_BOTTOM;
      } else if (eq(tableValue, 60)) {
        return LADDER_ROOM;
      } else if (eq(tableValue, 70)) {
        return BURIAL_CHAMBER;
      } else {
        G.catacombsLoc = tableValue;
        describeRoom();
        if (isIn(SIDEKICK, G.here)) {
          sidekickFollowsYou();
        }
        return ROOMS;
      }
    }
  }
}

G.catacombsLoc = 1;

export const CATACOMBS_TABLE = table("CATACOMBS-TABLE", [
    0,
    0,
    99,
    0,
    0,
    99,
    0,
    2,
    80,
    0,
    3,
    0,
    0,
    3,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    4,
    0,
    0,
    2,
    0,
    2,
    0,
    0,
    0,
    3,
    0,
    5,
    0,
    0,
    0,
    99,
    0,
    0,
    0,
    0,
    6,
    4,
    99,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    7,
    0,
    5,
    99,
    0,
    0,
    0,
    0,
    0,
    99,
    6,
    0,
    8,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    7,
    0,
    0,
    99,
    0,
    9,
    0,
    0,
    0,
    0,
    0,
    10,
    0,
    11,
    8,
    0,
    0,
    9,
    0,
    10,
    0,
    0,
    10,
    0,
    0,
    0,
    0,
    12,
    0,
    0,
    0,
    9,
    99,
    0,
    0,
    0,
    13,
    0,
    0,
    0,
    0,
    11,
    99,
    0,
    0,
    0,
    0,
    12,
    0,
    0,
    14,
    0,
    99,
    0,
    0,
    0,
    0,
    15,
    99,
    0,
    0,
    0,
    13,
    0,
    0,
    0,
    0,
    16,
    0,
    14,
    0,
    0,
    0,
    0,
    17,
    0,
    15,
    0,
    16,
    0,
    0,
    16,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    18,
    0,
    0,
    40,
    0,
    15,
    0,
    99,
    0,
    19,
    0,
    0,
    0,
    17,
    0,
    0,
    0,
    0,
    18,
    22,
    20,
    0,
    0,
    0,
    0,
    0,
    21,
    21,
    0,
    0,
    19,
    0,
    0,
    0,
    0,
    0,
    0,
    20,
    0,
    50,
    0,
    0,
    0,
    20,
    0,
    0,
    0,
    0,
    19,
    0,
    0,
    0,
    0,
    50,
    0,
    23,
    0,
    25,
    24,
    0,
    0,
    0,
    0,
    0,
    22,
    0,
    25,
    0,
    0,
    0,
    0,
    0,
    23,
    99,
    0,
    0,
    0,
    0,
    0,
    23,
    24,
    0,
    26,
    0,
    0,
    0,
    60,
    25,
    27,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    99,
    28,
    26,
    0,
    0,
    0,
    0,
    27,
    0,
    29,
    29,
    0,
    0,
    0,
    0,
    0,
    28,
    0,
    0,
    28,
    70,
    0,
    0,
    0,
    0,
  ]);

defineObject(FORGOTTEN_STOREHOUSE, 107, {
  in: ROOMS,
  desc: "Forgotten Storehouse",
  flags: [INDOORSBIT],
  global: [WATER],
  exits: {
    NW: to(CATACOMBS),
    OUT: to(CATACOMBS),
  },
  props: {
    [P.LDESC]: "No living creature can even guess how long this storehouse has sat amidst the catacombs, undisturbed by man or by time, untouched by wars and weather, a silent witness to the passing eons, the rise and fall of empires, the births and deaths of countless billions, its only visitor the dark waters of a Martian canal.",
  },
});

defineObject(PHONE_BOOK, 108, {
  in: FORGOTTEN_STOREHOUSE,
  desc: "Cleveland phone book",
  synonym: ["BOOK", "DIRECT", "PHONEB"],
  adjective: ["CLEVELAND", "PHONE", "TELEPHONE"],
  flags: [TAKEBIT, BURNBIT],
  props: {
    [P.FDESC]: "Sitting in one corner is a Cleveland telephone directory.",
    [P.ACTION]: phoneBookF,
  },
});

export function phoneBookF(): any {
  if (verbIs(V.READ, V.LOOK_INSIDE, V.OPEN)) {
    tell("How useful. Now you know how many Smiths live in Cleveland.\n");
    return true;
  } else if (verbIs(V.CLOSE)) {
    tell("It is.\n");
    return true;
  } else if (verbIs(V.TAKE) && !hasFlag(PHONE_BOOK, TOUCHBIT)) {
    setFlag(PHONE_BOOK, TOUCHBIT);
    incrementScore(13, 26, true);
    return false;
  }
  return false;
}

defineObject(WELL_BOTTOM, 109, {
  in: ROOMS,
  desc: "Well Bottom",
  global: [HOLE, WATER],
  flags: [ONBIT, INDOORSBIT],
  things: [
    { adjective: "LARGE", noun: "WELL", action: wellF },
    { adjective: null, noun: "LIGHT", action: unimportantThingF },
  ],
  exits: {
    EAST: per(wellBottomExitF),
    SE: per(wellBottomExitF),
    SW: per(wellBottomLoopF),
    NW: per(wellBottomLoopF),
    UP: blocked("The well has no handholds."),
  },
  props: {
    [P.LDESC]: "Damp walls of brick rise to a point of light far above. A black circle is visible just below the surface of the water.",
    [P.HOLE_DESTINATION]: BARGE,
  },
});

export function wellBottomExitF(): any {
  if (prsoIs(P.EAST)) {
    G.catacombsLoc = 21;
  } else {
    G.catacombsLoc = 22;
  }
  return CATACOMBS;
}

export function wellBottomLoopF(): any {
  describeRoom();
  if (isIn(SIDEKICK, G.here)) {
    normalSidekickFollow();
  }
  return false;
}

defineObject(LADDER_ROOM, 110, {
  in: ROOMS,
  desc: "Ladder Room",
  flags: [INDOORSBIT],
  global: [WATER],
  things: [
    { adjective: null, noun: "LADDER", action: ladderF },
  ],
  exits: {
    NW: to(CATACOMBS),
    OUT: to(CATACOMBS),
    UP: per(ladderRoomExitF),
  },
  props: {
    [P.LDESC]: "This spot is much like the rest of the catacombs, except that a ladder leads up into the darkness.",
  },
});

export function ladderRoomExitF(): any {
  tell("You climb for a seemingly endless time, with the ladder becoming increasingly rickety. Suddenly a rung snaps, and you tumble into the darkness! You bounce painfully into a slanted ventilation shaft, slide through a wooden grating, and land amidst thousands of silk ");
  if (G.male) {
    tell("brassieres");
  } else {
    tell("jockstraps");
  }
  tell(PERIOD_CR, "\n");
  return LAUNDRY_ROOM;
}

export function ladderF(): any {
  if (verbIs(V.CLIMB, V.CLIMB_UP)) {
    return doWalk(P.UP);
  }
  return false;
}

defineObject(BURIAL_CHAMBER, 111, {
  in: ROOMS,
  desc: "Burial Chamber",
  flags: [INDOORSBIT],
  global: [WATER],
  things: [
    { adjective: null, noun: "RUBY", action: unimportantThingF },
    { adjective: null, noun: "RUBIES", action: unimportantThingF },
    { adjective: null, noun: "DIRIGIBLE", action: unimportantThingF },
  ],
  exits: {
    NORTH: to(CATACOMBS),
    OUT: to(CATACOMBS),
  },
  props: {
    [P.LDESC]: "Generations of Sultans and Sultanesses are entombed here, along with their vast wealth, their favorite servants, and some form of transportation to the next world. For example, one Sultan lies amidst mountains of rubies, surrounded by a fleet of dirigibles.",
  },
});

defineObject(RAFT, 112, {
  in: BURIAL_CHAMBER,
  synonym: ["RAFT", "RAF", "LIFERAFT"],
  adjective: ["DEFLATE", "SIMPLE", "RUBBER", "LIFE"],
  flags: [TAKEBIT, VEHBIT, INBIT, CONTBIT, SEARCHBIT, OPENBIT],
  props: {
    [P.SDESC]: "raft",
    [P.NO_T_DESC]: "raf",
    [P.DESCFCN]: raftF,
    [P.CAPACITY]: 100,
    [P.SIZE]: 60,
    [P.ACTION]: raftF,
  },
});

G.raftHeld = false;

export function raftF(oarg: any = false): any {
  if (oarg) {
    if (!hasFlag(RAFT, TOUCHBIT)) {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      tell("   On the other hand, another Sultan had a considerably more modest vision of the afterlife, bringing only a simple rubber life raft.");
      return true;
    } else if (G.raftHeld) {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      tell("   There is a raft here, which you're keeping a hand on.");
      return true;
    } else if (eq(G.here, CANAL)) {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      tell("   A raft is floating nearby.");
      return true;
    } else {
      return false;
    }
  } else if (eq(G.here, CANAL) && isIn(PROTAGONIST, BARGE) && isIn(RAFT, CANAL) && !eq(G.raftLocNum, G.bargeLocNum)) {
    return cantSee(RAFT);
  } else if (hasFlag(RAFT, UNTEEDBIT)) {
    return false;
  } else if (verbIs(V.SINK)) {
    if (G.raftHeld || eq(G.here, CANAL) && isIn(PROTAGONIST, RAFT)) {
      perform(V.DEFLATE, RAFT);
      return true;
    } else {
      tell("It's not even in water!\n");
      return true;
    }
  } else if (verbIs(V.PUT) && inCatacombs() && prsiIs(WATER)) {
    perform(V.DROP, RAFT);
    return true;
  } else if (verbIs(V.DROP, V.THROW) && prsoIs(RAFT) && inCatacombs()) {
    remove(RAFT);
    tell("The raft floats into the darkness. Oh, well, easy come, easy go.\n");
    return true;
  } else if (verbIs(V.DROP) && G.raftHeld) {
    G.raftHeld = false;
    move(RAFT, CANAL);
    setRaftLoc();
    queue(iCanal, -1);
    tell("The raft ");
    if (eq(G.here, CANAL)) {
      if (G.bargeUnderPower) {
        tell("is left behind in the wake of");
      } else {
        G.raftWait = G.bargeWait;
        tell("floats along beside");
      }
      tell(" the barge.\n");
      return true;
    } else {
      tell("is swept away.\n");
      return true;
    }
  } else if (verbIs(V.TAKE) && prsoIs(RAFT) && !hasFlag(RAFT, TOUCHBIT)) {
    setFlag(RAFT, TOUCHBIT);
    incrementScore(8, 3);
    return false;
  } else if (verbIs(V.TAKE) && (isIn(YOUR_BODY, RAFT) || isIn(SIDEKICKS_BODY, RAFT))) {
    tell("It's too heavy.\n");
    return true;
  } else if (verbIs(V.BOARD)) {
    if (isIn(RAFT, BARGE)) {
      tell("Hrumph! There's no reason to board the raft inside the barge! ");
      perform(V.SINK, BARGE);
      return true;
    } else if (isIn(RAFT, ODD_MACHINE)) {
      return doFirst("remove it from", ODD_MACHINE);
    } else if (isUltimatelyIn(RAFT, MALE_GORILLA) || isUltimatelyIn(RAFT, FEMALE_GORILLA)) {
      return notOnGround(RAFT);
    } else if ((G.raftHeld || isIn(RAFT, CANAL)) && !isIn(PROTAGONIST, RAFT)) {
      queue(iCanal, -1);
      setRaftLoc();
      if (eq(G.here, MY_KIND_OF_DOCK)) {
        G.nearerDock = MY_KIND_OF_DOCK;
      } else {
        G.nearerDock = ABANDONED_DOCK;
      }
      if (G.bargeLocNum > G.raftLocNum && isIn(BARGE, CANAL)) {
        G.bargeLocNum = 36;
        move(BARGE, ICY_DOCK);
      }
      tell("As you");
      andSidekick(RAFT);
      tell(" board the raft, ");
      if (eq(G.here, CANAL)) {
        tell("it begins drifting away from the barge");
        if (G.bargeUnderPower) {
          bargeForgesAhead();
        }
      } else {
        tell("the current sweeps it away from the dock");
      }
      tell(PERIOD_CR);
      if (G.bargeWait && eq(G.raftLocNum, G.bargeLocNum)) {
        G.raftWait = true;
      } else {
        G.raftWait = false;
      }
      G.raftHeld = false;
      move(RAFT, CANAL);
      if (eq(G.here, CANAL)) {
        move(PROTAGONIST, RAFT);
        return true;
      } else {
        crlf();
        return goto(RAFT);
      }
    }
    return false;
  } else if (verbIs(V.STAND_ON)) {
    perform(V.BOARD, RAFT);
    return true;
  } else if (verbIs(V.DEFLATE, V.MUNG, V.KILL)) {
    if (hasFlag(RAFT, MUNGBIT)) {
      tell(ALREADY_IS);
      return true;
    } else {
      tell("\"Phssss.\"");
      if (G.raftHeld || isIn(RAFT, CANAL)) {
        tell(" The raft sinks");
        if (isIn(PROTAGONIST, RAFT)) {
          return jigsUp(", and you with it.");
        } else {
          G.raftHeld = false;
          remove(RAFT);
          tell(PERIOD_CR);
          return true;
        }
      } else {
        setFlag(RAFT, MUNGBIT);
        putp(RAFT, P.SDESC, "deflated raft");
        crlf();
        return true;
      }
    }
  } else if (verbIs(V.INFLATE)) {
    if (hasFlag(RAFT, MUNGBIT)) {
      tell("Without a pump? Forget it.\n");
      return true;
    } else {
      tell(ALREADY_IS);
      return true;
    }
  } else if (verbIs(V.SHAKE) && eq(G.here, CANAL) && isIn(PROTAGONIST, RAFT)) {
    return shakeBoat();
  } else if (verbIs(V.PUSH_DIR) && prsiIs(INTDIR)) {
    if (isIn(PROTAGONIST, RAFT) && !eq(G.pPrsaWord, W.MOVE)) {
      tell("You're in it!\n");
      return true;
    } else if (isIn(RAFT, CANAL)) {
      tell(NO_STEERING);
      return true;
    } else {
      doWalk(G.pDirection);
      move(RAFT, G.here);
      return true;
    }
  } else if (verbIs(V.SET) && isIn(RAFT, CANAL)) {
    tell(NO_STEERING);
    return true;
  } else if (verbIs(V.LAND)) {
    tell("Try grabbing a dock.\n");
    return true;
  }
  return false;
}

export function iBeetles(): any {
  if (!inCatacombs()) {
    return false;
  }
  queue(iBeetles, 6);
  if (isIn(PROTAGONIST, G.here)) {
    G.catacombsLoc = random(G.catacombsLoc);
    if (isIn(SIDEKICK, G.here)) {
      move(SIDEKICK, CATACOMBS);
    }
    move(PROTAGONIST, CATACOMBS);
    G.here = CATACOMBS;
    setFlag(CATACOMBS, MUNGBIT);
    openEyesAndRemoveHands();
    tell("   Suddenly the water explodes with life! A swarm of the nastiest beetles this side of Pluto starts munching your flesh. You escape by running blindly through the catacombs, completely losing track of your location.\n");
    return true;
  } else {
    return harmlessSnap("beetle");
  }
}

export function iCrabs(): any {
  let obj: any = 0;
  if (!inCatacombs()) {
    return false;
  }
  queue(iCrabs, 10);
  if (isIn(PROTAGONIST, G.here)) {
    openEyesAndRemoveHands();
    setFlag(CATACOMBS, MUNGBIT);
    tell("   You feel an intense pain, like a tuft of hair being yanked out -- except that it's coming from your feet, and in about a hundred places. As you flail at the pack of Martian sand crabs, the splashing startles them away");
    if ((obj = first(PROTAGONIST)) && !eq(obj, GARMENT, COMIC_BOOK)) {
      if (eq(obj, TORCH) && next(TORCH)) {
        obj = next(TORCH);
      }
      tell(", but during the struggle you seem to have lost your ", D(obj), PERIOD_CR);
      remove(obj);
      return isNowDark();
    } else {
      tell(PERIOD_CR);
      return true;
    }
  } else {
    return harmlessSnap("crab");
  }
}

export function iGator(): any {
  if (!inCatacombs()) {
    return false;
  }
  if (isIn(PROTAGONIST, G.here)) {
    return jigsUp("   A Martian alligator, large enough to blend in inconspicuously with Great Britain's mercantile fleet, swims by and gulps a huge bunch of canal water -- the bunch that happens to include you, by the way.");
  } else {
    queue(iGator, 12);
    return harmlessSnap("gator");
  }
}

export function harmlessSnap(string: any): any {
  tell("   The calm water is suddenly shattered by the jaws of a huge Martian ", string, " snapping harmlessly toward you. Good thing you were in the raft.\n");
  return true;
}

defineObject(MARTIAN_DESSERT, 113, {
  in: ROOMS,
  desc: "Martian Dessert",
  flags: [RLANDBIT, ONBIT],
  global: [DUNES],
  things: [
    { adjective: null, noun: "MIRAGE", action: unimportantThingF },
    { adjective: "CREAM", noun: "PIE", action: unimportantThingF },
  ],
  exits: {
    NW: per(martianDessertExitF),
    SE: per(martianDessertExitF),
  },
  props: {
    [P.LDESC]: "No, not a typo. \"Dessert\" refers to the fifty foot Martian Cream Pie here. A mirage, of course. People hopelessly lost in the desert often see strange mirages, such as cream pies, lakes, or trails to the northwest and southeast.",
  },
});

export function martianDessertExitF(): any {
  if (!hasFlag(MARTIAN_DESSERT, MUNGBIT)) {
    setFlag(MARTIAN_DESSERT, MUNGBIT);
    tell("I guess the paths aren't a mirage...\n\n");
  }
  if (prsoIs(P.NW)) {
    return RUINED_CASTLE_2;
  } else {
    return OASIS;
  }
}

defineObject(WATTZ_UPP_DOCK, 114, {
  in: ROOMS,
  desc: "Wattz-Upp Dock",
  flags: [RLANDBIT, ONBIT],
  global: [CANAL_OBJECT, DOCK_OBJECT, WATER, SIGN],
  things: [
    { adjective: "RED", noun: "BUOY", action: buoyF },
    { adjective: "WARNING", noun: "BUOY", action: buoyF },
  ],
  exits: {
    NE: blocked("If you want to jump in the canal, say so."),
    EAST: blocked("If you want to jump in the canal, say so."),
    SE: blocked("If you want to jump in the canal, say so."),
    WEST: to(OASIS),
  },
  props: {
    [P.LDESC]: "This tiny dock is the maritime entrance to the once-famous Wattz-Upp section of Mars. East of the dock is a wide, north-south canal; you can hear a gurgling sound to the west. There's a chill in the air; you might be approaching the south polar cap.",
  },
});

defineObject(OASIS, 115, {
  in: ROOMS,
  desc: "Oasis",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE, WATER, DUNES],
  exits: {
    EAST: per(wattzUppDockEnterF),
    WEST: per(martianDessertEnterF),
  },
  props: {
    [P.HOLE_DESTINATION]: CLEVELAND,
    [P.ACTION]: oasisF,
  },
});

export function wattzUppDockEnterF(): any {
  putp(HOLE, P.SDESC, "black circle");
  return WATTZ_UPP_DOCK;
}

export function martianDessertEnterF(): any {
  putp(HOLE, P.SDESC, "black circle");
  return MARTIAN_DESSERT;
}

G.circleBlack = true;

G.circleFaded = false;

export function circleIsntBlack(): any {
  if (!G.circleBlack && eq(G.here, OASIS)) {
    return true;
  } else {
    return false;
  }
}

export function oasisF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !G.circleBlack) {
    putp(HOLE, P.SDESC, "white circle");
    return true;
  } else if (eq(rarg, M_LOOK)) {
    tell("This is a remarkable sight on arid Mars -- subsurface water bubbling up in a fountain, flowing around", A(HOLE), ", and soaking into the thirsty sand. A path curves east around the ", PD(DUNES));
    return unchartableDesert("west");
  } else if (eq(rarg, M_END)) {
    if (G.sidekickDrowned) {
      move(SIDEKICK, G.here);
      G.sidekickDrowned = false;
      tell("   Like a wet watermelon seed being squirted from between two fingers, ", D(SIDEKICK), " is ejected from the fountain and lands in a dripping heap at your feet. \"Good thing I'm so good at holding my breath,\" ");
      heShe();
      tell(" says.\n");
    }
    if (!G.circleFaded) {
      G.circleFaded = true;
      G.circleBlack = false;
      putp(HOLE, P.SDESC, "white circle");
      tell("   Inexplicably, the circle fades before your very eyes, slowly going from black to white.\n");
      return true;
    }
    return false;
  }
  return false;
}

defineObject(RABBIT, 116, {
  in: OASIS,
  desc: "rabbit",
  synonym: ["RABBIT", "BUNNY"],
  adjective: ["BUNNY", "SMALL"],
  flags: [TAKEBIT],
  props: {
    [P.FDESC]: "A little bunny rabbit is sipping at the waters of the oasis.",
  },
});

defineObject(ICY_DOCK, 117, {
  in: ROOMS,
  desc: "Icy Dock",
  flags: [RLANDBIT, ONBIT],
  global: [WATER, DOCK_OBJECT, CANAL_OBJECT],
  exits: {
    NORTH: blocked("If you want to jump in the canal, say so."),
    NE: blocked("If you want to jump in the canal, say so."),
    NW: blocked("If you want to jump in the canal, say so."),
    SOUTH: to(TUNDRA),
  },
  props: {
    [P.LDESC]: "This is the southern terminus of the canal. Far below this dock, teleportation machinery transports massive quantities of water back to the head of the canal in the equatorial region of Mars. It's quite chilly, and the dock is covered with a sheet of ice. To the south, as far as you can see, is the bleak whiteness of the southern ice cap.",
    [P.ACTION]: icyDockF,
  },
});

export function icyDockF(rarg: any): any {
  if (eq(rarg, M_ENTER) && !hasFlag(ICY_DOCK, TOUCHBIT) && !isRunning(iIonDeath)) {
    return incrementScore(4, 14);
  } else if (eq(rarg, M_END) && isIn(SIDEKICK, G.here)) {
    G.followFlag = 3;
    queue(iFollow, 2);
    remove(SIDEKICK);
    G.sidekickDrowned = true;
    tell("   With a whoop of surprise, ", D(SIDEKICK), " loses ");
    hisHer();
    tell(" footing on the ice, skids right into the canal, and is immediately dragged under by the strong current produced by the underwater teleporters. You search frantically for any sign of ");
    himHer();
    tell(", but after several agonizingly long minutes you abandon all hope. As you gaze across ", D(SIDEKICK), "'s watery grave");
    return memoriam();
  }
  return false;
}

defineObject(TUNDRA, 118, {
  in: ROOMS,
  desc: "Edge of Polar Ice Cap",
  flags: [RLANDBIT, ONBIT],
  exits: {
    NORTH: to(ICY_DOCK),
    SOUTH: to(ALLUSION_ROOM),
    SE: to(PENGUIN_PARK),
  },
  props: {
    [P.ACTION]: tundraF,
  },
});

export function tundraF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("This snowy plain is barren of all signs of life. Drifts block travel in all directions but north, south and southeast. It's pretty cold, but nothing a tough g");
    if (G.male) {
      tell("uy");
    } else {
      tell("al");
    }
    tell(" like yourself can't stand.");
    return true;
  }
  return false;
}

defineObject(ALLUSION_ROOM, 119, {
  in: ROOMS,
  desc: "Allusion Room",
  flags: [RLANDBIT, ONBIT],
  global: [HOLE],
  exits: {
    NORTH: to(TUNDRA),
    NE: blocked("You'd only get lost in the snow and die."),
    EAST: to(PENGUIN_PARK),
    SE: blocked("You'd only get lost in the snow and die."),
    SOUTH: blocked("You'd only get lost in the snow and die."),
    SW: blocked("You'd only get lost in the snow and die."),
    WEST: blocked("You'd only get lost in the snow and die."),
    NW: blocked("You'd only get lost in the snow and die."),
  },
  props: {
    [P.LDESC]: "A solitary black circle is the only break in an vaste expanse of whiteness extending to the horizon. Like a dark speck in a sea of white, or a huge piece of typing paper with but a single period typed upon it, this black circle seems to have been placed here entirely as an opportunity for some silly literary allusions. To avoid the danger of accidentally typing an \"L\" and having to read them again, follow the faint trails to the north or east.",
    [P.HOLE_DESTINATION]: WATTZ_UPP_DOCK,
  },
});

defineObject(PENGUIN_PARK, 120, {
  in: ROOMS,
  desc: "Penguin Park",
  flags: [RLANDBIT, ONBIT],
  global: [SIGN],
  exits: {
    WEST: to(ALLUSION_ROOM),
    NW: to(TUNDRA),
    SE: toIf(GYPSY_CAMP, "penguinsParted", "There's a wall of penguins in the way."),
  },
  props: {
    [P.ACTION]: penguinParkF,
  },
});

export function penguinParkF(rarg: any): any {
  if (eq(rarg, M_LOOK)) {
    tell("Even on Mars, one could hardly expect a polar visit without seeing penguins. Well, here they are! A whole waddling mass of them, ");
    if (G.penguinsParted) {
      tell("standing politely on either side of");
    } else {
      tell("a pack so dense they completely block");
    }
    tell(" the path to the southeast. Other paths lead west and northwest.");
    if (!G.penguinsParted) {
      tell("\n   One penguin teasingly waves a sign in your direction, much like a matador waving his cape toward a bull.");
    }
    return true;
  }
  return false;
}

G.penguinsParted = false;

defineObject(PENGUINS, 121, {
  in: PENGUIN_PARK,
  desc: "mass of penguins",
  synonym: ["PENGUIN", "MASS", "BIRD", "BIRDS"],
  adjective: ["WADDLING"],
  flags: [NDESCBIT],
  props: {
    [P.ACTION]: penguinsF,
  },
});

export function penguinsF(): any {
  if (verbIs(V.GIVE)) {
    if (prsoIs(TEN_MARSMID_COIN)) {
      G.penguinsParted = true;
      remove(TEN_MARSMID_COIN);
      move(ONE_MARSMID_COIN, PROTAGONIST);
      tell("The penguins, satisfied by your donation to the PRF, part ranks for you to pass. The going rate for donations to the fund must be nine marsmids, since one of the penguins hands you a one marsmid coin.\n");
      return true;
    } else if (prsoIs(ONE_MARSMID_COIN)) {
      tell("Nine marsmids is the minimum contribution to the PRF.\n");
      return true;
    }
    return false;
  } else if (verbIs(V.SHOW) && prsoIs(TEN_MARSMID_COIN)) {
    tell("The penguins wiggle eagerly.\n");
    return true;
  }
  return false;
}

defineObject(GYPSY_CAMP, 122, {
  in: ROOMS,
  desc: "Gypsy Camp",
  flags: [RLANDBIT, ONBIT],
  things: [
    { adjective: "RAGGED", noun: "TENT", action: outsideTentF },
    { adjective: "TATTERED", noun: "TENT", action: outsideTentF },
  ],
  exits: {
    SOUTH: to(SOUTH_POLE),
    NORTH: to(TENT),
    IN: to(TENT),
    NW: to(PENGUIN_PARK),
  },
  props: {
    [P.LDESC]: "This is the campsite of a family of nomadic robotic gypsies. A ragged tent is pitched on the north side of the camp, and trails lead northwest and south.",
    [P.ACTION]: gypsyCampF,
  },
});

G.parentsKilled = false;

export function gypsyCampF(rarg: any): any {
  if (eq(rarg, M_END)) {
    if (!G.parentsKilled) {
      G.parentsKilled = true;
      if (eq(G.verbosity, 0)) {
        return true;
      }
      tell("   A male and a female robot emerge from the tent, waving in a gesture of gypsyish greeting. \"Hello, weary traveller");
      if (isIn(SIDEKICK, G.here)) {
        tell("s");
      }
      tell("! We are but poor gypsies, but we invite you to spend the night in our humble tent and share our simple but delicious oil and silicon stew.\" Suddenly, in an event so shocking that even a hardened space opera hero");
      if (!G.male) {
        tell("ine");
      }
      tell(" like yourself is stunned beyond belief, a meteorite shrieks through the atmosphere and completely obliterates the two robots.\n");
    }
    if (isIn(BABY, TENT) && !isIn(BLANKET, BABY)) {
      tell("   You hear the sound of high-pitched crying, slightly muffled, coming from inside the tent.\n");
      return true;
    }
    return false;
  }
  return false;
}

export function outsideTentF(): any {
  if (verbIs(V.ENTER, V.BOARD, V.WALK_TO)) {
    return doWalk(P.NORTH);
  } else if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    tell(LOOK_AROUND);
    return true;
  } else if (verbIs(V.LOOK_INSIDE)) {
    tell(CANT_FROM_HERE);
    return true;
  }
  return false;
}

export function insideTentF(): any {
  if (verbIs(V.EXIT, V.LEAVE, V.DISEMBARK)) {
    return doWalk(P.SOUTH);
  } else if (verbIs(V.ENTER, V.BOARD, V.WALK_TO)) {
    tell(LOOK_AROUND);
    return true;
  } else if (verbIs(V.EXAMINE, V.LOOK_INSIDE)) {
    return vLook();
  } else if (verbIs(V.SEARCH)) {
    tell(NOTHING_NEW);
    return true;
  }
  return false;
}

defineObject(TENT, 123, {
  in: ROOMS,
  desc: "Inside the Tent",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  things: [
    { adjective: "RAGGED", noun: "TENT", action: insideTentF },
    { adjective: "TATTERED", noun: "TENT", action: insideTentF },
  ],
  exits: {
    SOUTH: to(GYPSY_CAMP),
    OUT: to(GYPSY_CAMP),
  },
  props: {
    [P.LDESC]: "This tattered tent, home to the deceased robots, provides meager protection against the cold polar winds. You can exit to the south.",
    [P.ACTION]: tentF,
  },
});

export function tentF(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    return queue(iCry, -1);
  }
  return false;
}

export function iCry(): any {
  if (isIn(BLANKET, BABY)) {
    dequeue(iCry);
    return false;
  } else if (!isVisible(BABY)) {
    return false;
  } else {
    tell("   The baby continues to wail at the top of its lungs.");
    if (prob(12)) {
      tell(" It's amazing that such small lungs have such a high top.");
    }
    crlf();
    return true;
  }
}

defineObject(BABY, 124, {
  in: TENT,
  synonym: ["BABY", "INFANT", "ROBOT"],
  adjective: ["INFANT", "ROBOT", "ROBOTIC", "SMALL", "BABY"],
  flags: [TAKEBIT, OPENBIT, CONTBIT, SEARCHBIT],
  props: {
    [P.SDESC]: "robot infant",
    [P.DESCFCN]: babyF,
    [P.SIZE]: 35,
    [P.ACTION]: babyF,
  },
});

export function babyF(oarg: any = false): any {
  if (oarg) {
    if (hasFlag(BABY, TOUCHBIT)) {
      return false;
    } else {
      if (eq(oarg, M_OBJDESC_Q)) {
        return true;
      }
      tell("   A little baby robot is shivering in the corner. It stops crying long enough to open a tiny metal eyelid and look at you. \"");
      if (G.male) {
        tell("Momm");
      } else {
        tell("Dadd");
      }
      tell("y?\" it says, in a quavering, high-pitched, metallic voice.");
      return true;
    }
  } else if (verbIs(V.TELL)) {
    if (isIn(BLANKET, BABY)) {
      G.winner = PROTAGONIST;
      perform(V.KISS, BABY);
    } else {
      tell("\"Goo goo ga ga buzz whirr click.\"\n");
    }
    return stop();
  } else if (verbIs(V.PUT) && prsiIs(BLANKET) || verbIs(V.PUT_ON, V.WRAP) && prsoIs(BLANKET) || verbIs(V.PUT) && prsiIs(BASKET) && isIn(BLANKET, BASKET)) {
    if (hasFlag(BLANKET, UNTEEDBIT)) {
      return false;
    } else if (isIn(BLANKET, BABY)) {
      tell(SENILITY_STRIKES);
      return true;
    }
    setFlag(BABY, TOUCHBIT);
    setFlag(BLANKET, NDESCBIT);
    move(BLANKET, BABY);
    if (prsiIs(BASKET)) {
      move(BABY, BASKET);
    }
    putp(BABY, P.SDESC, "baby robot wrapped in a blanket");
    dequeue(iCry);
    tell("The baby stops crying and, in the comfy warmth of the blanket, slips into a calm sleep. A peaceful smile creeps over its face.\n");
    return true;
  } else if (verbIs(V.PUT) && prsiIs(SHEET) || verbIs(V.PUT_ON, V.WRAP) && prsoIs(SHEET)) {
    if (isIn(BLANKET, BABY) || hasFlag(SHEET, MUNGBIT) || hasFlag(SHEET, PLURALBIT)) {
      return wastes();
    } else {
      tell("The sheet provides little warmth.\n");
      return true;
    }
  } else if (verbIs(V.PUT) && prsiIs(BASKET) && isIn(BASKET, FRONT_STOOP) && !first(BASKET)) {
    if (isIn(BLANKET, BABY)) {
      move(BABY, BASKET);
      return abandonBaby("in the basket");
    } else {
      return cryingAlertsMatron();
    }
  } else if (verbIs(V.REMOVE) && isIn(BLANKET, BABY)) {
    move(BLANKET, PROTAGONIST);
    clearFlag(BLANKET, NDESCBIT);
    putp(BABY, P.SDESC, "robot infant");
    queue(iCry, -1);
    tell("The baby robo", TWICE_AS_LOUD);
    if (isUltimatelyIn(BABY, FRONT_STOOP)) {
      tell("   ");
      cryingAlertsMatron();
    }
    return true;
  } else if (verbIs(V.KISS)) {
    if (isIn(BLANKET, BABY)) {
      perform(V.ALARM, BABY);
      return true;
    } else {
      tell("The ", D(BABY), " reacts as a human baby would react if kissed by a giant walking metal machine. In other words, i", TWICE_AS_LOUD);
      return true;
    }
  } else if (verbIs(V.LISTEN) && !isIn(BLANKET, BABY)) {
    tell("\"Waaaa!\"\n");
    return true;
  } else if (verbIs(V.SHAKE)) {
    if (isIn(BLANKET, BABY)) {
      tell("The baby's asleep!\n");
      return true;
    } else {
      tell("This upsets the ", D(BABY), "'s equilibrium mechanism. I", TWICE_AS_LOUD);
      return true;
    }
  } else if (verbIs(V.ALARM) && isIn(BLANKET, BABY)) {
    tell("The baby whimpers briefly, but the warm coziness of the blanket soon lulls it back to sleep.\n");
    return true;
  } else if (takeBabyFromStoop(BABY)) {
    return true;
  } else if (verbIs(V.SUCKLE)) {
    if (G.male) {
      tell("You're a male, remember? You obviously have a poor mammary.\n");
      return true;
    } else {
      tell("How touching that the baby robot has stirred your maternal instinct. Unfortunately, your mammaries won't produce #3 machine oil.\n");
      return true;
    }
  } else if (verbIs(V.PUT, V.PUT_NEAR) && prsiIs(ORPHANAGE_DOOR)) {
    perform(V.PUT_ON, BABY, FRONT_STOOP);
    return true;
  } else if (verbIs(V.EXAMINE)) {
    tell("The ", D(BABY), " is ");
    if (isIn(BLANKET, BABY)) {
      tell("sleep");
    } else {
      tell("cry");
    }
    tell("ing.\n");
    return true;
  } else if (verbIs(V.OPEN, V.CLOSE)) {
    tell(HUH);
    return true;
  }
  return false;
}

export function cryingAlertsMatron(): any {
  tell("The baby's crying alerts someone within the igloo. ");
  return shoo("abandon");
}

export function shoo(string: any): any {
  dequeue(iOrphanage);
  tell(MATRON_DESC, "appears. \"Caught you, you baby-", string, "ing gypsy!\" she cries, in a voice that, in a more mountainous region, could probably initiate an avalanche. \"Begone!\" She ");
  if (isUltimatelyIn(BABY, FRONT_STOOP)) {
    tell("thrusts the babe into your arms and ");
  }
  if (isIn(BASKET, FRONT_STOOP)) {
    move(BASKET, PROTAGONIST);
  }
  if (isUltimatelyIn(BABY, FRONT_STOOP)) {
    move(BABY, PROTAGONIST);
  }
  tell("drives you away with blows that would fell an elephant.\n\n");
  if (eq(G.here, ORPHANAGE_FOYER)) {
    return goto(SOUTH_POLE);
  } else {
    return goto(GYPSY_CAMP);
  }
}

defineObject(SOUTH_POLE, 125, {
  in: ROOMS,
  desc: "South Pole",
  flags: [RLANDBIT, ONBIT],
  global: [SIGN, IGLOO, ORPHANAGE_DOOR, WINDOW],
  things: [
    { adjective: null, noun: "BAR", action: windowF },
    { adjective: null, noun: "BARS", action: windowF },
  ],
  exits: {
    NORTH: to(GYPSY_CAMP),
    SOUTH: blocked("This is as far south as you can go!"),
    EAST: blocked("You walk in a tight circle, returning to your starting point."),
    WEST: blocked("You walk in a tight circle, returning to your starting point."),
    IN: toIfOpen(ORPHANAGE_FOYER, ORPHANAGE_DOOR),
  },
  props: {
    [P.LDESC]: "You are standing near the front stoop of a very large igloo. Its door is flanked by a faded sign and a barred window. Paths lead north, north and north.",
    [P.ACTION]: southPoleF,
  },
});

export function southPoleF(rarg: any): any {
  if (eq(rarg, M_ENTER) && G.cottonBallsSeen && hasFlag(COTTON_BALLS, TRYTAKEBIT)) {
    move(COTTON_BALLS, G.here);
    setFlag(COTTON_BALLS, NDESCBIT);
    return true;
  }
  return false;
}

G.cottonBallsSeen = false;

defineObject(ORPHANAGE_DOOR, 126, {
  in: LOCAL_GLOBALS,
  desc: "igloo door",
  synonym: ["DOOR"],
  adjective: ["IGLOO", "ORPHANAGE"],
  flags: [DOORBIT, LOCKEDBIT, VOWELBIT],
  props: {
    [P.ACTION]: orphanageDoorF,
  },
});

export function orphanageDoorF(): any {
  if (verbIs(V.KNOCK) && eq(G.here, SOUTH_POLE)) {
    if (isVisible(BABY)) {
      return shoo("abandon");
    } else {
      return shoo("steal");
    }
  }
  return false;
}

defineObject(FRONT_STOOP, 127, {
  in: SOUTH_POLE,
  desc: "front stoop",
  synonym: ["STOOP", "DOORSTEP"],
  adjective: ["FRONT"],
  flags: [NDESCBIT, CONTBIT, SEARCHBIT, SURFACEBIT, OPENBIT],
  props: {
    [P.CAPACITY]: 150,
    [P.ACTION]: frontStoopF,
  },
});

export function frontStoopF(): any {
  if (verbIs(V.PUT, V.PUT_ON, V.PUT_NEAR)) {
    if (prsoIs(BABY) && !isIn(BABY, BASKET)) {
      if (isIn(BLANKET, BABY)) {
        coldCausesCrying();
      }
      move(G.prso, FRONT_STOOP);
      return cryingAlertsMatron();
    } else if (prsoIs(BASKET, BABY) && isIn(BABY, BASKET)) {
      if (!isIn(BLANKET, BABY)) {
        return cryingAlertsMatron();
      } else {
        move(BASKET, FRONT_STOOP);
        return abandonBaby("on the stoop");
      }
    }
    return false;
  } else if (verbIs(V.BOARD, V.ENTER, V.STAND_ON)) {
    return wastes();
  } else if (verbIs(V.PUT) && prsoIs(BABY)) {
    coldCausesCrying();
    return cryingAlertsMatron();
  }
  return false;
}

export function coldCausesCrying(): any {
  tell("As you place the baby on the cold doorstep, i", TWICE_AS_LOUD, "   ");
  return true;
}

export function abandonBaby(string: any): any {
  queue(iOrphanage, 5);
  move(PROTAGONIST, G.here);
  tell("You place the baby gently ", string, " and sneak behind a nearby snowdrift.\n");
  return true;
}

export function iOrphanage(): any {
  remove(BABY);
  remove(BASKET);
  clearFlag(ORPHANAGE_DOOR, LOCKEDBIT);
  if (eq(G.here, SOUTH_POLE)) {
    G.followFlag = 15;
    queue(iFollow, 2);
    tell("   ", MATRON_DESC, "opens the ", PD(ORPHANAGE_DOOR), ". She coos over the baby for a moment then carries it inside, closing the door behind her.\n");
    return true;
  } else {
    return false;
  }
}

defineObject(ORPHANAGE_FOYER, 128, {
  in: ROOMS,
  desc: "Orphanage Foyer",
  flags: [RLANDBIT, ONBIT, INDOORSBIT],
  global: [ORPHANAGE_DOOR, IGLOO, WINDOW],
  things: [
    { adjective: null, noun: "BAR", action: windowF },
    { adjective: null, noun: "BARS", action: windowF },
  ],
  exits: {
    NE: per(iglooEnterF),
    NW: per(iglooEnterF),
    SOUTH: toIfOpen(SOUTH_POLE, ORPHANAGE_DOOR),
    OUT: toIfOpen(SOUTH_POLE, ORPHANAGE_DOOR),
  },
  props: {
    [P.ACTION]: orphanageFoyerF,
  },
});

export function orphanageFoyerF(rarg: any): any {
  if (eq(rarg, M_ENTER)) {
    if (hasFlag(COTTON_BALLS, TRYTAKEBIT)) {
      move(COTTON_BALLS, G.here);
      clearFlag(COTTON_BALLS, NDESCBIT);
    }
    if (!isQueued(iOrphanageBoot)) {
      return queue(iOrphanageBoot, 5);
    }
    return false;
  } else if (eq(rarg, M_LOOK)) {
    tell("The igloo's front hall has rooms to the northeast and northwest. A barred window is next to the ");
    openClosed(ORPHANAGE_DOOR);
    tell(" door to the south.");
    return true;
  }
  return false;
}

export function iglooEnterF(): any {
  tell("Nursery\n");
  iOrphanageBoot();
  dequeue(iOrphanageBoot);
  return false;
}

export function iOrphanageBoot(): any {
  if (eq(G.here, ORPHANAGE_FOYER)) {
    tell("   ");
    shoo("steal");
    clearFlag(ORPHANAGE_DOOR, OPENBIT);
    setFlag(ORPHANAGE_DOOR, LOCKEDBIT);
    return true;
  } else if (eq(G.here, SOUTH_POLE) && hasFlag(ORPHANAGE_DOOR, OPENBIT)) {
    tell("   The ", PD(ORPHANAGE_DOOR), " slams shut.\n");
    clearFlag(ORPHANAGE_DOOR, OPENBIT);
    setFlag(ORPHANAGE_DOOR, LOCKEDBIT);
    return true;
  } else {
    clearFlag(ORPHANAGE_DOOR, OPENBIT);
    setFlag(ORPHANAGE_DOOR, LOCKEDBIT);
    return false;
  }
}

defineObject(COTTON_BALLS, 129, {
  desc: "pair of cotton balls",
  synonym: ["PAIR", "BALL", "BALLS"],
  adjective: ["COTTON", "COON"],
  flags: [TAKEBIT, TRYTAKEBIT, NDESCBIT, PLURALBIT, BURNBIT],
  props: {
    [P.NO_T_DESC]: "pair of coon balls",
    [P.SIZE]: 2,
    [P.ACTION]: cottonBallsF,
  },
});

export function cottonBallsF(): any {
  if (eq(G.here, SOUTH_POLE) && hasFlag(COTTON_BALLS, TRYTAKEBIT) && isTouching(COTTON_BALLS)) {
    return cantReach(COTTON_BALLS);
  } else if (verbIs(V.TAKE) && hasFlag(COTTON_BALLS, TRYTAKEBIT)) {
    incrementScore(16, 29, true);
    clearFlag(COTTON_BALLS, TRYTAKEBIT);
    return false;
  } else if (hasFlag(COTTON_BALLS, UNTEEDBIT)) {
    if (verbIs(V.EXAMINE)) {
      tell("Let's just say that some poor male raccoon is speaking in a particularly high-pitched voice.\n");
      return true;
    } else {
      return false;
    }
  } else if (verbIs(V.PUT, V.PUT_ON) && prsiIs(EARS)) {
    if (G.goneApe) {
      tell(DEXTERITY);
      return true;
    } else {
      setFlag(COTTON_BALLS, WORNBIT);
      setFlag(EARS, MUNGBIT);
      move(COTTON_BALLS, PROTAGONIST);
      tell(MUFFLED, " have ", D(COTTON_BALLS), " stuffed in ", PD(EARS), PERIOD_CR);
      return true;
    }
  } else if (verbIs(V.REMOVE, V.DISEMBARK) && hasFlag(COTTON_BALLS, WORNBIT)) {
    if (G.goneApe) {
      perform(V.TAKE, COTTON_BALLS);
      return true;
    }
    openEyesAndRemoveHands();
    clearFlag(COTTON_BALLS, WORNBIT);
    return senseAgain(EARS);
  } else if (verbIs(V.PUT) && prsiIs(NOSE)) {
    tell("The ", PD(COTTON_BALLS), " is too itchy.\n");
    return true;
  }
  return false;
}

defineObject(IGLOO, 130, {
  in: LOCAL_GLOBALS,
  desc: "igloo",
  synonym: ["IGLOO", "ORPHANAGE"],
  adjective: ["LARGE"],
  flags: [VOWELBIT],
  props: {
    [P.ACTION]: iglooF,
  },
});

export function iglooF(): any {
  if (verbIs(V.ENTER, V.WALK_TO, V.BOARD)) {
    if (eq(G.here, ORPHANAGE_FOYER)) {
      tell(LOOK_AROUND);
      return true;
    } else if (eq(G.here, SOUTH_POLE)) {
      return doWalk(P.IN);
    }
    return false;
  } else if (verbIs(V.LEAVE, V.EXIT, V.DISEMBARK)) {
    if (eq(G.here, SOUTH_POLE)) {
      tell(LOOK_AROUND);
      return true;
    } else {
      return doWalk(P.OUT);
    }
  } else if (verbIs(V.LOOK_INSIDE)) {
    if (eq(G.here, SOUTH_POLE)) {
      performPrsa(WINDOW);
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
