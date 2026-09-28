// world.ts — objects, vocabulary, numbering and globals
//
// Translated from the original ZIL source of Leather Goddesses of Phobos
// (c) 1986 Infocom, Inc. by tools/zil2ts. Structure, names and logic follow
// the original routine for routine.

import {
  createObject,
} from "../engine/object.ts";
import {
  eq,
} from "../engine/runtime.ts";
import {
  defineWord, word,
} from "../engine/vocab.ts";

// ---------------------------------------------------------------------------
// Attribute flags (numbered as in the original)

export const FEMALEBIT = 1;
export const INBIT = 2;
export const PLURALBIT = 3;
export const PARTBIT = 4;
export const NARTICLEBIT = 5;
export const UNTEEDBIT = 6;
export const SMELLEDBIT = 7;
export const NDESCBIT = 8;
export const LOCKEDBIT = 9;
export const VOWELBIT = 10;
export const INDOORSBIT = 11;
export const MUNGBIT = 12;
export const TRANSBIT = 13;
export const SEARCHBIT = 14;
export const OPENBIT = 15;
export const TRYTAKEBIT = 16;
export const SURFACEBIT = 17;
export const TOUCHBIT = 18;
export const INVISIBLE = 19;
export const WEARBIT = 20;
export const WORNBIT = 21;
export const READBIT = 22;
export const TAKEBIT = 23;
export const CONTBIT = 24;
export const LIGHTBIT = 25;
export const DOORBIT = 26;
export const BURNBIT = 27;
export const RLANDBIT = 28;
export const VEHBIT = 29;
export const ONBIT = 30;
export const ACTORBIT = 31;

// Property numbers

export const P = {
  SYNONYM: 31,
  NORTH: 30,
  NE: 29,
  EAST: 28,
  SE: 27,
  SOUTH: 26,
  SW: 25,
  WEST: 24,
  NW: 23,
  UP: 22,
  DOWN: 21,
  IN: 20,
  OUT: 19,
  ADJECTIVE: 18,
  ACTION: 17,
  SDESC: 16,
  GLOBAL: 15,
  THINGS: 14,
  ODOR: 13,
  ODOR_NUMBER: 12,
  GENERIC: 11,
  CAPACITY: 10,
  NO_T_DESC: 9,
  SIZE: 8,
  LDESC: 7,
  DESCFCN: 6,
  HOLE_DESTINATION: 5,
  FDESC: 4,
  TEXT: 3,
} as const;

/** The lowest-numbered direction property. */
export const LOW_DIRECTION = 19;

// Parts of speech (dictionary byte 4)

export const PS = { OBJECT: 128, VERB: 64, ADJECTIVE: 32, DIRECTION: 16, PREPOSITION: 8, BUZZ_WORD: 4 } as const;
export const P1 = { NONE: 0, OBJECT: 0, VERB: 1, ADJECTIVE: 2, DIRECTION: 3 } as const;

/** Action numbers (PRSA values). */
export const V = {
  VERBOSE: 1,
  BRIEF: 2,
  SUPER_BRIEF: 3,
  TAME: 4,
  SUGGESTIVE: 5,
  LEWD: 6,
  DIAGNOSE: 7,
  INVENTORY: 8,
  QUIT: 9,
  RESTART: 10,
  RESTORE: 11,
  SAVE: 12,
  STATUS: 13,
  SCRIPT: 14,
  UNSCRIPT: 15,
  VERSION: 16,
  $RANDOM: 17,
  $COMMAND: 18,
  $RECORD: 19,
  $UNRECORD: 20,
  $VERIFY: 21,
  ANSWER: 22,
  USE_QUOTES: 23,
  APPLAUD: 24,
  APPLY: 25,
  PUT_ON: 26,
  WALK_TO: 27,
  ASK_ABOUT: 28,
  ASK_FOR: 29,
  ASK_NO_ONE_FOR: 30,
  KILL: 31,
  BARTER_WITH: 32,
  BARTER_FOR: 33,
  BEND: 34,
  BITE: 35,
  BLOW: 36,
  INFLATE: 37,
  OFF: 38,
  BOARD: 39,
  BOARD_DIR: 40,
  INHALE: 41,
  BURN: 42,
  BUY: 43,
  BUY_WITH: 44,
  CALL: 45,
  CAST_OFF: 46,
  CATCH: 47,
  CHEER: 48,
  WALK_AROUND: 49,
  CLICK: 50,
  CLIMB: 51,
  CLIMB_ON: 52,
  CLIMB_UP: 53,
  CLIMB_DOWN: 54,
  DISEMBARK: 55,
  CLIMB_OVER: 56,
  ENTER: 57,
  CRAWL_UNDER: 58,
  CLOSE: 59,
  SHUT_UP: 60,
  COME: 61,
  FOLLOW: 62,
  COPULATE: 63,
  SPUT_ON: 64,
  COUNT: 65,
  CROSS: 66,
  DECODE: 67,
  DEFLATE: 68,
  MUNG: 69,
  DIG: 70,
  DRESS: 71,
  DRINK: 72,
  DRINK_FROM: 73,
  DROP: 74,
  PUT: 75,
  PUT_THROUGH: 76,
  PUT_NEAR: 77,
  EAT: 78,
  EMPTY: 79,
  EMPTY_FROM: 80,
  IN: 81,
  EXAMINE: 82,
  EXIT: 83,
  FEED: 84,
  GIVE: 85,
  SGIVE: 86,
  FILL: 87,
  FIND: 88,
  FLUSH: 89,
  FUCK: 90,
  GIDDYAP: 91,
  WALK: 92,
  HIDE: 93,
  LEAVE: 94,
  GIVE_UP: 95,
  RETURN: 96,
  LISTEN: 97,
  HELLO: 98,
  HELP: 99,
  SAVE_SOMETHING: 100,
  HISS: 101,
  MASTURBATE: 102,
  WHIP: 103,
  LEAP: 104,
  LEAP_OFF: 105,
  STAND_ON: 106,
  KICK: 107,
  KISS: 108,
  KISS_ON: 109,
  KNEEL: 110,
  KNOCK: 111,
  KWEEPA: 112,
  LAND: 113,
  LAUGH: 114,
  LAUNCH: 115,
  PUT_AGAINST: 116,
  LICK: 117,
  LIE_DOWN: 118,
  ON: 119,
  LIMBER: 120,
  LOCK: 121,
  LOOK: 122,
  LOOK_DOWN: 123,
  LOOK_UP: 124,
  LOOK_INSIDE: 125,
  LOOK_UNDER: 126,
  LOOK_BEHIND: 127,
  LOOK_OVER: 128,
  CHASTISE: 129,
  LOVE: 130,
  LOWER: 131,
  MAKE: 132,
  MAKE_OUT: 133,
  MAKE_WITH: 134,
  MAKE_LOVE: 135,
  MARRY: 136,
  MEASURE: 137,
  MOAN: 138,
  MOVE: 139,
  PUSH_DIR: 140,
  RAISE: 141,
  NO: 142,
  OPEN: 143,
  PASS: 144,
  PAY: 145,
  PEE: 146,
  PEE_IN: 147,
  PHONE: 148,
  PICK: 149,
  PICK_UP: 150,
  PIN: 151,
  TOUCH: 152,
  POINT: 153,
  POUR: 154,
  PUSH: 155,
  PUSH_OFF: 156,
  PUT_UNDER: 157,
  RAKE: 158,
  RAPE: 159,
  REACH_IN: 160,
  READ: 161,
  RELIEVE: 162,
  REMOVE: 163,
  TAKE: 164,
  RIP: 165,
  ROLL: 166,
  RUB: 167,
  SRUB: 168,
  SAY: 169,
  SCAT: 170,
  SCORE: 171,
  SEARCH: 172,
  SHAKE: 173,
  SHAKE_WITH: 174,
  SHIT: 175,
  SHOW: 176,
  SSHOW: 177,
  SIGH: 178,
  SINK: 179,
  SIT: 180,
  SKIP: 181,
  SLEEP: 182,
  CUT: 183,
  SMELL: 184,
  STAIN: 185,
  STAND: 186,
  WEAR: 187,
  PUT_BEHIND: 188,
  PUT_TO: 189,
  SUCK: 190,
  SUCKLE: 191,
  SWIM: 192,
  SWING: 193,
  GET_DRESSED: 194,
  GET_UNDRESSED: 195,
  TAKE_WITH: 196,
  TAKE_OFF: 197,
  TAKE_A_LEAK: 198,
  TAKE_A_SHIT: 199,
  GET_DRUNK: 200,
  TELL: 201,
  TASTE: 202,
  TELL_ABOUT: 203,
  STELL: 204,
  THANK: 205,
  THROW: 206,
  THROW_TO: 207,
  STHROW: 208,
  THROW_UP: 209,
  TIE: 210,
  TIE_TOGETHER: 211,
  SET: 212,
  UNCOVER: 213,
  UNDRESS: 214,
  UNLOCK: 215,
  UNROLL: 216,
  UNTIE: 217,
  USE: 218,
  VOMIT: 219,
  WAIT: 220,
  WAIT_FOR: 221,
  ALARM: 222,
  CLEAN: 223,
  WHAT: 224,
  WHERE: 225,
  WRAP: 226,
  SWRAP: 227,
  YELL: 228,
  YES: 229,
  ANSWER_KLUDGE: 230,
} as const;

/** Verb numbers (the parser's verb-word values). */
export const ACT = {
  VERBOSE: 255,
  BRIEF: 254,
  SUPER: 253,
  TAME: 252,
  SUGGESTIVE: 251,
  LEWD: 250,
  DIAGNOSE: 249,
  INVENT: 248,
  QUIT: 247,
  RESTAR: 246,
  RESTOR: 245,
  SAVE: 244,
  STATUS: 243,
  SCRIPT: 242,
  UNSCRIPT: 241,
  VERSION: 240,
  "#RANDOM": 239,
  "#COMMAND": 238,
  "#RECORD": 237,
  "#UNRECORD": 236,
  $VERIFY: 235,
  ANSWER: 234,
  APPLAUD: 233,
  APPLY: 232,
  APPROA: 231,
  ASK: 230,
  ATTACK: 229,
  BARTER: 228,
  BEND: 227,
  BITE: 226,
  BLOW: 225,
  BOARD: 224,
  BREATHE: 223,
  BURN: 222,
  BUY: 221,
  CALL: 220,
  CAST: 219,
  CATCH: 218,
  CHEER: 217,
  CIRCLE: 216,
  CLICK: 215,
  CLIMB: 214,
  CLOSE: 213,
  COME: 212,
  COPULATE: 211,
  COVER: 210,
  COUNT: 209,
  CROSS: 208,
  DECODE: 207,
  DEFLATE: 206,
  DEMOLI: 205,
  DESCEN: 204,
  DIG: 203,
  DISEMBARK: 202,
  DRESS: 201,
  DRINK: 200,
  DROP: 199,
  EAT: 198,
  EMPTY: 197,
  ENTER: 196,
  EXAMINE: 195,
  EXIT: 194,
  EXTINGUISH: 193,
  FEED: 192,
  FILL: 191,
  FIND: 190,
  FLUSH: 189,
  FOLLOW: 188,
  FUCK: 187,
  GIDDYAP: 186,
  GO: 185,
  HAND: 184,
  HEAR: 183,
  HELLO: 182,
  HELP: 181,
  HIDE: 180,
  HISS: 179,
  INFLATE: 178,
  JERK: 177,
  JUMP: 176,
  KICK: 175,
  KISS: 174,
  KNEEL: 173,
  KNOCK: 172,
  KWEEPA: 171,
  LAND: 170,
  LAUGH: 169,
  LAUNCH: 168,
  LEAN: 167,
  LEAVE: 166,
  LET: 165,
  LICK: 164,
  LIE: 163,
  LIGHT: 162,
  LIMBER: 161,
  LISTEN: 160,
  LOCK: 159,
  LOOK: 158,
  LOVE: 157,
  LOWER: 156,
  MAKE: 155,
  MARRY: 154,
  MASTURBATE: 153,
  MEASURE: 152,
  MOAN: 151,
  MOVE: 150,
  NO: 149,
  OPEN: 148,
  PASS: 147,
  PAY: 146,
  PEE: 145,
  PHONE: 144,
  PICK: 143,
  PIN: 142,
  PLAY: 141,
  POINT: 140,
  POUR: 139,
  PUSH: 138,
  RAISE: 137,
  RAKE: 136,
  RAPE: 135,
  REACH: 134,
  READ: 133,
  RELIEVE: 132,
  REMOVE: 131,
  RETURN: 130,
  RIP: 129,
  ROLL: 128,
  RUB: 127,
  SAY: 126,
  SCAT: 125,
  SCORE: 124,
  SEARCH: 123,
  SHAKE: 122,
  SHIT: 121,
  SHOW: 120,
  SIGH: 119,
  SINK: 118,
  SIT: 117,
  SKIP: 116,
  SLEEP: 115,
  SLICE: 114,
  SLIDE: 113,
  SMEAR: 112,
  SMELL: 111,
  STAIN: 110,
  STAND: 109,
  START: 108,
  STICK: 107,
  STIMULATE: 106,
  SUCK: 105,
  SUCKLE: 104,
  SWIM: 103,
  SWING: 102,
  TAKE: 101,
  TALK: 100,
  TAP: 99,
  TASTE: 98,
  TELL: 97,
  THANKS: 96,
  THROW: 95,
  TIE: 94,
  TOUCH: 93,
  TURN: 92,
  UNCOVER: 91,
  UNDRES: 90,
  UNLOCK: 89,
  UNROLL: 88,
  UNTIE: 87,
  USE: 86,
  VOMIT: 85,
  WAIT: 84,
  WAKE: 83,
  WALK: 82,
  WASH: 81,
  WEAR: 80,
  WHAT: 79,
  WHERE: 78,
  WHIP: 77,
  WRAP: 76,
  YELL: 75,
  YES: 74,
  ZZMGCK: 73,
} as const;

/** Preposition numbers. */
export const PR = {
  TO: 255,
  ABOUT: 254,
  ON: 253,
  FOR: 252,
  WITH: 251,
  UP: 250,
  OUT: 249,
  HARD: 248,
  FROM: 247,
  OFF: 246,
  IN: 245,
  DOWN: 244,
  OVER: 243,
  THROUGH: 242,
  UNDER: 241,
  BEFORE: 240,
  AT: 239,
  AROUND: 238,
  BEHIND: 237,
  AWAY: 236,
  BACK: 235,
  ACROSS: 234,
  AGAINST: 233,
  GO: 232,
  HAPPY: 231,
  APART: 230,
  DRESSE: 229,
  UNDRES: 228,
  PISS: 227,
  LEAK: 226,
  SHIT: 225,
  DRUNK: 224,
  TOGETHER: 223,
} as const;

/** Adjective numbers referred to by the code (A?FOO). */
export const ADJ = {
  WIFE: 32,
  HUSBAND: 33,
  EACH: 35,
  MY: 4,
  WHITE: 63,
  BLACK: 62,
  NUMBER: 93,
  SMALL: 3,
  FLEXIBLE: 133,
  PORTABLE: 134,
  OTHER: 178,
} as const;

// ---------------------------------------------------------------------------
// Objects, numbered as in the original

export const PURPLE_BUTTON = createObject("PURPLE-BUTTON", 1);
export const EXIT_OBJECT = createObject("EXIT-OBJECT", 2);
export const MITRE = createObject("MITRE", 3);
export const WARNING = createObject("WARNING", 4);
export const HANDS = createObject("HANDS", 5);
export const BACK_DOOR = createObject("BACK-DOOR", 6);
export const LOOKS_CAN_BE_DECEIVING = createObject("LOOKS-CAN-BE-DECEIVING", 7);
export const CAGE = createObject("CAGE", 8);
export const ANTI_LGOP_MACHINE = createObject("ANTI-LGOP-MACHINE", 9);
export const TORCH = createObject("TORCH", 10);
export const THORBAST_SWORD = createObject("THORBAST-SWORD", 11);
export const WINDOW = createObject("WINDOW", 12);
export const HAREM_GUARD = createObject("HAREM-GUARD", 13);
export const ALLUSION_ROOM = createObject("ALLUSION-ROOM", 14);
export const SIDEKICKS_BODY = createObject("SIDEKICKS-BODY", 15);
export const ME = createObject("ME", 16);
export const CATACOMBS = createObject("CATACOMBS", 17);
export const POCKET = createObject("POCKET", 18);
export const MAP = createObject("MAP", 19);
export const FORD = createObject("FORD", 20);
export const LADIES_ROOM_OBJECT = createObject("LADIES-ROOM-OBJECT", 21);
export const CLOTHES_PIN = createObject("CLOTHES-PIN", 22);
export const ODOR = createObject("ODOR", 23);
export const TREE_HOLE = createObject("TREE-HOLE", 24);
export const WATTZ_UPP_DOCK = createObject("WATTZ-UPP-DOCK", 25);
export const VIZICOMM_BOOTH = createObject("VIZICOMM-BOOTH", 26);
export const ONE_MARSMID_COIN = createObject("ONE-MARSMID-COIN", 27);
export const CLEVELAND_OBJECT = createObject("CLEVELAND-OBJECT", 28);
export const LAWN = createObject("LAWN", 29);
export const MENS_ROOM_OBJECT = createObject("MENS-ROOM-OBJECT", 30);
export const FORGOTTEN_STOREHOUSE = createObject("FORGOTTEN-STOREHOUSE", 31);
export const CLEVELAND = createObject("CLEVELAND", 32);
export const INTDIR = createObject("INTDIR", 33);
export const ROOMS = createObject("ROOMS", 34);
export const LGOP = createObject("LGOP", 35);
export const BEM = createObject("BEM", 36);
export const LAUNDRY_ROOM = createObject("LAUNDRY-ROOM", 37);
export const RIDDLE = createObject("RIDDLE", 38);
export const COIN_RETURN_KNOB = createObject("COIN-RETURN-KNOB", 39);
export const LOCAL_GLOBALS = createObject("LOCAL-GLOBALS", 40);
export const HEAD = createObject("HEAD", 41);
export const TENT = createObject("TENT", 42);
export const VENUS = createObject("VENUS", 43);
export const HER = createObject("HER", 44);
export const FIRST_SLAB = createObject("FIRST-SLAB", 45);
export const FROG = createObject("FROG", 46);
export const GLOBAL_SLEEP = createObject("GLOBAL-SLEEP", 47);
export const SIDEKICK = createObject("SIDEKICK", 48);
export const ODD_MACHINE = createObject("ODD-MACHINE", 49);
export const CELL = createObject("CELL", 50);
export const EIGHTY_TWO_DEGREE_ANGLE = createObject("EIGHTY-TWO-DEGREE-ANGLE", 51);
export const MOTHBALLS = createObject("MOTHBALLS", 52);
export const PHOTO = createObject("PHOTO", 53);
export const GLOBAL_OBJECTS = createObject("GLOBAL-OBJECTS", 54);
export const SHELF = createObject("SHELF", 55);
export const MATCHBOOK = createObject("MATCHBOOK", 56);
export const IT = createObject("IT", 57);
export const PHONE_BOOK = createObject("PHONE-BOOK", 58);
export const ORPHANAGE_DOOR = createObject("ORPHANAGE-DOOR", 59);
export const SPLATTERED_SIDEKICK = createObject("SPLATTERED-SIDEKICK", 60);
export const JOES_BAR = createObject("JOES-BAR", 61);
export const IN_SPACE = createObject("IN-SPACE", 62);
export const MESSENGER = createObject("MESSENGER", 63);
export const CUNT = createObject("CUNT", 64);
export const SPAWNING_GROUND = createObject("SPAWNING-GROUND", 65);
export const SCRAP_OF_PAPER = createObject("SCRAP-OF-PAPER", 66);
export const CANAL_OBJECT = createObject("CANAL-OBJECT", 67);
export const LADIES_ROOM = createObject("LADIES-ROOM", 68);
export const FRONT_DOOR_OBJECT = createObject("FRONT-DOOR-OBJECT", 69);
export const TEENSY_WEENSY_HOUSE = createObject("TEENSY-WEENSY-HOUSE", 70);
export const PRIVATE_CABIN_DOOR = createObject("PRIVATE-CABIN-DOOR", 71);
export const HOUSE = createObject("HOUSE", 72);
export const LOVE = createObject("LOVE", 73);
export const SOUTH_POLE = createObject("SOUTH-POLE", 74);
export const YOUR_BODY = createObject("YOUR-BODY", 75);
export const RAKE = createObject("RAKE", 76);
export const CANALVIEW_MALL = createObject("CANALVIEW-MALL", 77);
export const PAINTING = createObject("PAINTING", 78);
export const MAN_WOMAN = createObject("MAN-WOMAN", 79);
export const MARTIAN_DESERT = createObject("MARTIAN-DESERT", 80);
export const BOUDOIR = createObject("BOUDOIR", 81);
export const JUNGLE = createObject("JUNGLE", 82);
export const HOLE = createObject("HOLE", 83);
export const DONALD_DOCK = createObject("DONALD-DOCK", 84);
export const MALE_GORILLA = createObject("MALE-GORILLA", 85);
export const RUBBER_HOSE = createObject("RUBBER-HOSE", 86);
export const STALLION = createObject("STALLION", 87);
export const LIP_BALM = createObject("LIP-BALM", 88);
export const ORIENTAL_GARDEN = createObject("ORIENTAL-GARDEN", 89);
export const THORBAST = createObject("THORBAST", 90);
export const SULTAN = createObject("SULTAN", 91);
export const ROOF = createObject("ROOF", 92);
export const BASE_OF_TOWER = createObject("BASE-OF-TOWER", 93);
export const POWER_SWITCH = createObject("POWER-SWITCH", 94);
export const TREE = createObject("TREE", 95);
export const POWER_TRANSMITTER = createObject("POWER-TRANSMITTER", 96);
export const RAFT = createObject("RAFT", 97);
export const TEN_MARSMID_COIN = createObject("TEN-MARSMID-COIN", 98);
export const ICY_DOCK = createObject("ICY-DOCK", 99);
export const HOLD = createObject("HOLD", 100);
export const BABY_DOCK = createObject("BABY-DOCK", 101);
export const ROCKY_CLIFFTOP = createObject("ROCKY-CLIFFTOP", 102);
export const FLEXIBLE_HOLE = createObject("FLEXIBLE-HOLE", 103);
export const FRONT_DOOR = createObject("FRONT-DOOR", 104);
export const WELL_BOTTOM = createObject("WELL-BOTTOM", 105);
export const TOWER = createObject("TOWER", 106);
export const KNEECAPS = createObject("KNEECAPS", 107);
export const BOOTH_OBJECT = createObject("BOOTH-OBJECT", 108);
export const PASSENGER_SHIP = createObject("PASSENGER-SHIP", 109);
export const FLASHLIGHT = createObject("FLASHLIGHT", 110);
export const CLEARING = createObject("CLEARING", 111);
export const AT_MAIN_HATCH = createObject("AT-MAIN-HATCH", 112);
export const BED = createObject("BED", 113);
export const STOOL = createObject("STOOL", 114);
export const PIZZA = createObject("PIZZA", 115);
export const BARGE = createObject("BARGE", 116);
export const JOE = createObject("JOE", 117);
export const GLOBAL_ROOM = createObject("GLOBAL-ROOM", 118);
export const LONG_CORRIDOR = createObject("LONG-CORRIDOR", 119);
export const OBSERVATION_ROOM = createObject("OBSERVATION-ROOM", 120);
export const THETA = createObject("THETA", 121);
export const FEMALE_GORILLA = createObject("FEMALE-GORILLA", 122);
export const PROPRIETOR = createObject("PROPRIETOR", 123);
export const OASIS = createObject("OASIS", 124);
export const TRELLIS = createObject("TRELLIS", 125);
export const EXIT_SHOP = createObject("EXIT-SHOP", 126);
export const HIM = createObject("HIM", 127);
export const EYES = createObject("EYES", 128);
export const MAIN_HALL_OF_PALACE = createObject("MAIN-HALL-OF-PALACE", 129);
export const LABORATORY = createObject("LABORATORY", 130);
export const COMIC_BOOK = createObject("COMIC-BOOK", 131);
export const PLAZA = createObject("PLAZA", 132);
export const BATTLESHIP = createObject("BATTLESHIP", 133);
export const GARMENT = createObject("GARMENT", 134);
export const CODED_MESSAGE = createObject("CODED-MESSAGE", 135);
export const PILE_OF_ANGLES = createObject("PILE-OF-ANGLES", 136);
export const INNER_HAREM = createObject("INNER-HAREM", 137);
export const RABBIT = createObject("RABBIT", 138);
export const HATCH = createObject("HATCH", 139);
export const LEAVES = createObject("LEAVES", 140);
export const EXAM_ROOM_DOOR = createObject("EXAM-ROOM-DOOR", 141);
export const STAIN = createObject("STAIN", 142);
export const HEADLIGHT = createObject("HEADLIGHT", 143);
export const COTTON_BALLS = createObject("COTTON-BALLS", 144);
export const FORK_OF_SORTS = createObject("FORK-OF-SORTS", 145);
export const MOUTH = createObject("MOUTH", 146);
export const BEDROOM = createObject("BEDROOM", 147);
export const SIGN = createObject("SIGN", 148);
export const HICKORY_AND_DICKORY_DOCK = createObject("HICKORY-AND-DICKORY-DOCK", 149);
export const FRONT_STOOP = createObject("FRONT-STOOP", 150);
export const BEER = createObject("BEER", 151);
export const DUNES = createObject("DUNES", 152);
export const IGLOO = createObject("IGLOO", 153);
export const SECOND_SLAB = createObject("SECOND-SLAB", 154);
export const BACK_DOOR_OBJECT = createObject("BACK-DOOR-OBJECT", 155);
export const SHEET = createObject("SHEET", 156);
export const STAIRS = createObject("STAIRS", 157);
export const BLANKET = createObject("BLANKET", 158);
export const CLOSET = createObject("CLOSET", 159);
export const MENS_ROOM = createObject("MENS-ROOM", 160);
export const END_OF_HALLWAY = createObject("END-OF-HALLWAY", 161);
export const EACH_OTHER = createObject("EACH-OTHER", 162);
export const DUNETOP = createObject("DUNETOP", 163);
export const ABANDONED_DOCK = createObject("ABANDONED-DOCK", 164);
export const OTHER_CELL = createObject("OTHER-CELL", 165);
export const WATER = createObject("WATER", 166);
export const BASKET = createObject("BASKET", 167);
export const GROUND = createObject("GROUND", 168);
export const MINARET = createObject("MINARET", 169);
export const WHITE_SUIT = createObject("WHITE-SUIT", 170);
export const NOT_HERE_OBJECT = createObject("NOT-HERE-OBJECT", 171);
export const MARTIAN_DESSERT = createObject("MARTIAN-DESSERT", 172);
export const CELL_OBJECT = createObject("CELL-OBJECT", 173);
export const TITS = createObject("TITS", 174);
export const COIN_RETURN_BOX = createObject("COIN-RETURN-BOX", 175);
export const NARROW_CELL_DOOR = createObject("NARROW-CELL-DOOR", 176);
export const TUBE = createObject("TUBE", 177);
export const INTNUM = createObject("INTNUM", 178);
export const MOUSE = createObject("MOUSE", 179);
export const DIVAN = createObject("DIVAN", 180);
export const CHOCOLATE = createObject("CHOCOLATE", 181);
export const LADDER_ROOM = createObject("LADDER-ROOM", 182);
export const SOD = createObject("SOD", 183);
export const CEILING = createObject("CEILING", 184);
export const COCK = createObject("COCK", 185);
export const BLENDER = createObject("BLENDER", 186);
export const EARS = createObject("EARS", 187);
export const RUINED_CASTLE_1 = createObject("RUINED-CASTLE-1", 188);
export const PENGUIN_PARK = createObject("PENGUIN-PARK", 189);
export const HANDSET = createObject("HANDSET", 190);
export const MY_KIND_OF_DOCK = createObject("MY-KIND-OF-DOCK", 191);
export const SACK = createObject("SACK", 192);
export const BABY = createObject("BABY", 193);
export const RUINED_CASTLE_3 = createObject("RUINED-CASTLE-3", 194);
export const SULTANS_WIFE = createObject("SULTANS-WIFE", 195);
export const MAD_SCIENTIST = createObject("MAD-SCIENTIST", 196);
export const GYPSY_CAMP = createObject("GYPSY-CAMP", 197);
export const RUINED_CASTLE_2 = createObject("RUINED-CASTLE-2", 198);
export const CRAMPED_SPACE = createObject("CRAMPED-SPACE", 199);
export const PROTAGONIST = createObject("PROTAGONIST", 200);
export const ROYAL_DOCKS = createObject("ROYAL-DOCKS", 201);
export const WIDE_CELL_DOOR = createObject("WIDE-CELL-DOOR", 202);
export const DUST = createObject("DUST", 203);
export const CANAL = createObject("CANAL", 204);
export const TRAY = createObject("TRAY", 205);
export const VIZICOMM = createObject("VIZICOMM", 206);
export const NOSE = createObject("NOSE", 207);
export const DOCK_OBJECT = createObject("DOCK-OBJECT", 208);
export const SWORD = createObject("SWORD", 209);
export const ORPHANAGE_FOYER = createObject("ORPHANAGE-FOYER", 210);
export const STABLE = createObject("STABLE", 211);
export const TOILET = createObject("TOILET", 212);
export const BURIAL_CHAMBER = createObject("BURIAL-CHAMBER", 213);
export const YOUNG_WOMAN = createObject("YOUNG-WOMAN", 214);
export const AMONG_THE_DUNES = createObject("AMONG-THE-DUNES", 215);
export const TUNDRA = createObject("TUNDRA", 216);
export const THRONE_ROOM = createObject("THRONE-ROOM", 217);
export const SPACE_YACHT = createObject("SPACE-YACHT", 218);
export const PENGUINS = createObject("PENGUINS", 219);
export const FLYTRAP = createObject("FLYTRAP", 220);
export const BASEMENT = createObject("BASEMENT", 221);
export const ORANGE_BUTTON = createObject("ORANGE-BUTTON", 222);
export const HAREM = createObject("HAREM", 223);
export const SALESMAN = createObject("SALESMAN", 224);
export const CREAM = createObject("CREAM", 225);
export const AUDIENCE_CHAMBER = createObject("AUDIENCE-CHAMBER", 226);
export const GARDEN = createObject("GARDEN", 227);
export const PSEUDO_OBJECT = createObject("PSEUDO-OBJECT", 228);

// ---------------------------------------------------------------------------
// Constants

export const M_BEG = 1;
export const M_ENTER = 2;
export const M_LOOK = 3;
export const M_FLASH = 4;
export const M_OBJDESC = 5;
export const M_END = 6;
export const M_SMELL = 7;
export const M_FATAL = 8;
export const M_OBJDESC_Q = 9;
export const C_TABLELEN = 60;
export const C_INTLEN = 4;
export const C_RTN = 0;
export const C_TICK = 1;
export const CC_SBPTR = 0;
export const CC_SEPTR = 1;
export const CC_OCLAUSE = 2;
export const P_INBUF_LENGTH = 120;
export const O_PTR = 0;
export const O_START = 1;
export const O_LENGTH = 2;
export const O_END = 3;
export const P_LEXWORDS = 1;
export const P_LEXSTART = 1;
export const P_LEXELEN = 2;
export const P_WORDLEN = 4;
export const P_PSOFF = 4;
export const P_P1OFF = 5;
export const P_P1BITS = 3;
export const P_ITBLLEN = 9;
export const P_VERB = 0;
export const P_VERBN = 1;
export const P_PREP1 = 2;
export const P_PREP1N = 3;
export const P_PREP2 = 4;
export const P_NC1 = 6;
export const P_NC1L = 7;
export const P_NC2 = 8;
export const P_NC2L = 9;
export const P_SYNLEN = 8;
export const P_SBITS = 0;
export const P_SPREP1 = 1;
export const P_SPREP2 = 2;
export const P_SFWIM1 = 3;
export const P_SFWIM2 = 4;
export const P_SLOC1 = 5;
export const P_SLOC2 = 6;
export const P_SACTION = 7;
export const P_SONUMS = 3;
export const P_ALL = 1;
export const P_ONE = 2;
export const P_INHIBIT = 4;
export const SH = 128;
export const SC = 64;
export const SIR = 32;
export const SOG = 16;
export const STAKE = 8;
export const SMANY = 4;
export const SHAVE = 2;
export const LAST_OBJECT = 228;
export const P_SRCBOT = 2;
export const P_SRCTOP = 0;
export const P_SRCALL = 1;
export const D_RECORD_ON = 4;
export const D_RECORD_OFF = -4;
export const SERIAL = 0;
export const D_ALL_Q = 1;
export const D_PARA_Q = 2;
export const REXIT = 0;
export const UEXIT = 1;
export const NEXIT = 2;
export const FEXIT = 3;
export const CEXIT = 4;
export const DEXIT = 5;
export const NEXITSTR = 0;
export const FEXITFCN = 0;
export const CEXITFLAG = 1;
export const CEXITSTR = 1;
export const DEXITOBJ = 1;
export const DEXITSTR = 1;
export const HUMAN_ATE_CHOCOLATE = 1;
export const GORILLA_ATE_CHOCOLATE = 2;

// Global values that never change

export const P_MATCHLEN = 0;
export const P_MOBY_FLAG = false;
export const TOO_DARK = "It's too dark to see a thing.";
export const YNH = "You're not holding";
export const THERES_NOTHING = "There's nothing ";
export const YOU_SEE = "You can see";
export const IT_SEEMS_THAT = "It seems that";
export const YOU_CANT_SEE_ANY = "You can't see any ";
export const YOU_CANT = "You can't ";
export const YOULL_HAVE_TO = "You'll have to ";
export const CATACOMBS_WATER_DESC = "As the result of an ancient leak, the catacombs are knee deep in warm, brackish canal water.";
export const ITS_ENGRAVED = "There's an engraving on its side.";
export const LGOP_CAPS = "LEATHER GODDESSES OF PHOBOS";
export const STICK_IT_IN_POCKET = " stick it back in your back pocket";
export const SPREAD_APART = " spread apart to form an opening";
export const PLEASURE_PALACE_DESC = " the arching towers and curving domes of the notorious Pleasure Palace of ";
export const ATTACK_FLEET = " Main Attack Fleet";
export const MUFFLED = "Many sounds seem muffled now that you";
export const ABOUT_TO_KISS = ", but just as you are about to kiss the frog ";
export const PRIVATE_BOUDOIR = " extremely secret and private boudoir";
export const N45_DEGREE_ANGLE = " forty-five degree angle";
export const HIT_RETURN = ". Hit the RETURN/ENTER key to ";
export const BOUGHT_AND_SOLD = "xits bought and sold";
export const BATTLESHIP_DESC = "Hanging from the base of the long, potent-looking battleship are two pendulous, brimming fuel tanks.";
export const EVOLVED = " evolved eating flies weighing a quarter of a";
export const OOZY_WITH_SLIME = "The ground is oozy with proto-slime.";
export const VIZICOMM_DESC = " an ordinary pay vizicomm, with a handset, coin slot, dial, coin return knob, and coin return box.";
export const SIGN_AND_STAIRS = ". A sign is posted next to the stairs which lead both upwards and downwards.";
export const PROPRIETOR_STIRS = "The proprietor stirs somewhat from his lethargy. \"";
export const WRITING_CHANGES = "The writing on the button changes as you press it";
export const PINNED = ", pinned to the dock by the current.\n";
export const KEEP_IT_FROM_FLOATING_AWAY = ". To keep it from floating away, you pull the raft out of the water.\n";
export const ALREADY_IN_MODE = "You are already in that mode.\n";
export const LOOK_AROUND = "Look around you.\n";
export const CANT_FROM_HERE = "You can't do that from here.\n";
export const CANT_GO = "You can't go that way.\n";
export const HOLDING_IT = "You're holding it!\n";
export const CANT_SMELL = "You can't smell any odor here.\n";
export const MISSIONARY_ONLY = "Sorry -- nothing beyond the missionary position in SUGGESTIVE level.\n";
export const NOUN_MISSING = "[There seems to be a noun missing in that sentence.]\n";
export const ONLY_BLACKNESS = "You see only blackness.\n";
export const SENILITY_STRIKES = "You already did that. Senility strikes again!\n";
export const PART_OF_VIZICOMM = "You can't take that -- it's part of the vizicomm!\n";
export const PERIOD_CR = ".\n";
export const ELLIPSIS = "...\n\n";
export const HANDS_OVER_EYES = "That would accomplish nothing, since you're covering your eyes with your hands.\n";
export const MORE_ROYAL_BLOOD = "It would take considerably more royal blood than you've got to wear this royal crown.\n";
export const GIMME_TROUBLE = "\"Don't gimme trouble -- just gimme a number between 1 and 8379.\"\n";
export const TWICE_AS_LOUD = "t begins crying twice as loudly as before.\n";
export const ONLY_ONE_THING_IN_COMPARTMENT = "You can only fit one thing in the odd machine at a time.\n";
export const NOTHING_HAPPENS = "Nothing happens.\n";
export const HORSE_CANT_FIT = "The horse can't fit through there!\n";
export const FAILED = "Failed.\n";
export const OK = "Okay.\n";
export const HUH = "Huh?\n";
export const YECHH = "Yechh.\n";
export const ALREADY_IS = "It already is!\n";
export const NOTHING_NEW = "This reveals nothing new.\n";
export const ONLY_WITH_A_RAKE = "You can only rake with a rake.\n";
export const LOOKS_UNAPPETIZING = " looks unappetizing, but smells deliciously familiar.\n";
export const NO_VERB = "[There was no verb in that sentence!]\n";
export const DONT_WANT_TO = "You don't want to. Believe me.\n";
export const DEXTERITY = "You don't have enough dexterity.\n";
export const NO_STEERING = "There's no obvious steering mechanism.\n";
export const PFFT = "\"Phfffft!\" The torch goes out.\n";
export const TRELLIS_TOO_WIDE = "The trellis is too wide to fit in the hole.\n";
export const LEAVE_ME_ALONE = "\"Leave me alone! I'm manipulating the budget for the invasion. I can't believe how much neuro-tinglers cost these days...\"\n";
export const HAND_DWINDLES = "Your hand dwindles disorientingly to a point, like railroad tracks vanishing toward the horizon.\n";
export const STARING_INTO_VOID = "It's like staring into an eternal void of blackest infinity sucking up all life and thought and hope and being -- or, like what you see after getting your face smashed in a bar fight. You can pick the metaphor you're most familiar with.\n";
export const DOORS_MARKED = "Doors marked \"Ladies\" and \"Gents\" lead, respectively, northeast and northwest.";
export const MATRON_DESC = "A matronly woman of massive proportions and rather cubical aspect ";

// ---------------------------------------------------------------------------
// Global variables (initial values are set where each is declared)

export interface Globals {
  /** P-WON */
  pWon: any;
  /** P-MULT */
  pMult: any;
  /** P-NOT-HERE */
  pNotHere: any;
  /** CLOCK-WAIT */
  clockWait: any;
  /** C-INTS */
  cInts: any;
  /** C-MAXINTS */
  cMaxints: any;
  /** CLOCK-HAND */
  clockHand: any;
  /** P-AND */
  pAnd: any;
  /** PRSA */
  prsa: any;
  /** PRSI */
  prsi: any;
  /** PRSO */
  prso: any;
  /** P-TABLE */
  pTable: any;
  /** P-ONEOBJ */
  pOneobj: any;
  /** P-SYNTAX */
  pSyntax: any;
  /** P-LEN */
  pLen: any;
  /** WINNER */
  winner: any;
  /** RESERVE-PTR */
  reservePtr: any;
  /** P-CONT */
  pCont: any;
  /** P-IT-OBJECT */
  pItObject: any;
  /** P-HIM-OBJECT */
  pHimObject: any;
  /** P-HER-OBJECT */
  pHerObject: any;
  /** LAST-PSEUDO-LOC */
  lastPseudoLoc: any;
  /** P-OFLAG */
  pOflag: any;
  /** P-MERGED */
  pMerged: any;
  /** P-ACLAUSE */
  pAclause: any;
  /** P-ANAM */
  pAnam: any;
  /** P-AADJ */
  pAadj: any;
  /** P-NCN */
  pNcn: any;
  /** QUOTE-FLAG */
  quoteFlag: any;
  /** P-END-ON-PREP */
  pEndOnPrep: any;
  /** P-PRSA-WORD */
  pPrsaWord: any;
  /** P-WALK-DIR */
  pWalkDir: any;
  /** AGAIN-DIR */
  againDir: any;
  /** P-DIRECTION */
  pDirection: any;
  /** P-NUMBER */
  pNumber: any;
  /** P-SLOCBITS */
  pSlocbits: any;
  /** P-GWIMBIT */
  pGwimbit: any;
  /** P-NAM */
  pNam: any;
  /** P-ADJ */
  pAdj: any;
  /** P-PHR */
  pPhr: any;
  /** P-ADVERB */
  pAdverb: any;
  /** P-ADJN */
  pAdjn: any;
  /** P-PRSO */
  pPrso: any;
  /** P-PRSI */
  pPrsi: any;
  /** P-MERGE */
  pMerge: any;
  /** P-GETFLAGS */
  pGetflags: any;
  /** P-MOBY-FOUND */
  pMobyFound: any;
  /** P-XNAM */
  pXnam: any;
  /** P-XADJ */
  pXadj: any;
  /** P-XADJN */
  pXadjn: any;
  /** VERBOSITY */
  verbosity: any;
  /** NAUGHTY-LEVEL */
  naughtyLevel: any;
  /** AGE */
  age: any;
  /** AWAITING-FAKE-ORPHAN */
  awaitingFakeOrphan: any;
  /** FOLLOW-FLAG */
  followFlag: any;
  /** AWAITING-REPLY */
  awaitingReply: any;
  /** LIT */
  lit: any;
  /** RANK */
  rank: any;
  /** MOVES */
  moves: any;
  /** SCORE */
  score: any;
  /** HERE */
  here: any;
  /** INT-MAX */
  intMax: any;
  /** EXT-MAX */
  extMax: any;
  /** HAND-COVER */
  handCover: any;
  /** HOLE-MOVE */
  holeMove: any;
  /** MALE */
  male: any;
  /** SEX-CHOSEN */
  sexChosen: any;
  /** URGE-COUNTER */
  urgeCounter: any;
  /** CASTLES-SEEN */
  castlesSeen: any;
  /** MOORING-ON */
  mooringOn: any;
  /** BARGE-UNDER-POWER */
  bargeUnderPower: any;
  /** BARGE-LOC-NUM */
  bargeLocNum: any;
  /** RAFT-LOC-NUM */
  raftLocNum: any;
  /** BARGE-WAIT */
  bargeWait: any;
  /** RAFT-WAIT */
  raftWait: any;
  /** NEARER-DOCK */
  nearerDock: any;
  /** DONT-PRINT-VEHICLE */
  dontPrintVehicle: any;
  /** ION-DEATH-COUNTER */
  ionDeathCounter: any;
  /** SIDEKICK-IONIZED */
  sidekickIonized: any;
  /** WIFE-NUMBER */
  wifeNumber: any;
  /** TITS-COUNTER */
  titsCounter: any;
  /** HAREM-GUARD-COUNTER */
  haremGuardCounter: any;
  /** HAREM-PROB */
  haremProb: any;
  /** CHOICE-NUMBER */
  choiceNumber: any;
  /** SULTAN-COUNTER */
  sultanCounter: any;
  /** RIDDLE-ANSWERED */
  riddleAnswered: any;
  /** WIFE-FUCKED */
  wifeFucked: any;
  /** TORCH-LIFE */
  torchLife: any;
  /** CATACOMBS-OPEN */
  catacombsOpen: any;
  /** CATACOMBS-LOC */
  catacombsLoc: any;
  /** RAFT-HELD */
  raftHeld: any;
  /** CIRCLE-BLACK */
  circleBlack: any;
  /** CIRCLE-FADED */
  circleFaded: any;
  /** PENGUINS-PARTED */
  penguinsParted: any;
  /** PARENTS-KILLED */
  parentsKilled: any;
  /** COTTON-BALLS-SEEN */
  cottonBallsSeen: any;
  /** FLYTRAP-COUNTER */
  flytrapCounter: any;
  /** TOO-LATE */
  tooLate: any;
  /** LEAVES-PLACED */
  leavesPlaced: any;
  /** MAD-SCIENTIST-COUNTER */
  madScientistCounter: any;
  /** IMPATIENCE-COUNTER */
  impatienceCounter: any;
  /** BODY-TIED-TO-SLAB */
  bodyTiedToSlab: any;
  /** SIDEKICKS-BODY-TIED-TO-SLAB */
  sidekicksBodyTiedToSlab: any;
  /** GONE-APE */
  goneApe: any;
  /** GORILLA-EXAMINED */
  gorillaExamined: any;
  /** SHEET-HANGING */
  sheetHanging: any;
  /** SHEET-TIED */
  sheetTied: any;
  /** SPACESHIP-SCENE-STATUS */
  spaceshipSceneStatus: any;
  /** LONG-CORRIDOR-LOC */
  longCorridorLoc: any;
  /** CHILL-COUNTER */
  chillCounter: any;
  /** THORBAST-ATTACKED */
  thorbastAttacked: any;
  /** FIGHT-COUNTER */
  fightCounter: any;
  /** FREE-MOVE-COUNTER */
  freeMoveCounter: any;
  /** DISARM-PROB */
  disarmProb: any;
  /** BEM-COUNTER */
  bemCounter: any;
  /** CELL-GRIPE */
  cellGripe: any;
  /** TRAY-DELIVERED */
  trayDelivered: any;
  /** CHOCOLATE-IDENTIFIED */
  chocolateIdentified: any;
  /** SUGAR-RUSH */
  sugarRush: any;
  /** SIDEKICK-EXPLODED */
  sidekickExploded: any;
  /** SIDEKICK-TRIP-FLAG */
  sidekickTripFlag: any;
  /** SIDEKICK-DROWNED */
  sidekickDrowned: any;
  /** SIDEKICK-EATEN */
  sidekickEaten: any;
  /** HOLE-OPEN */
  holeOpen: any;
  /** SEEN-EXAMINATION-ROOM */
  seenExaminationRoom: any;
  /** DISCOVERED */
  discovered: any;
  /** PLAZA-COUNTER */
  plazaCounter: any;
  /** RIGHT-PART */
  rightPart: any;
  /** MISSING-PART */
  missingPart: any;
}

export const G = {} as Globals;

// ---------------------------------------------------------------------------
// Vocabulary: word, parts-of-speech byte, value 1, value 2

defineWord("egress", 0b10000000, 0, 0);
defineWord("eighty", 0b00100010, 94, 0);
defineWord("eighy", 0b00100010, 95, 0);
defineWord("ejaculate", 0b01000001, 212, 0);
defineWord("elysium", 0b10100010, 20, 0);
defineWord("elysia", 0b10100010, 19, 0);
defineWord("empty", 0b01100001, 197, 238);
defineWord("engrav", 0b10000000, 0, 0);
defineWord("entertain", 0b01000001, 217, 0);
defineWord("enter", 0b01000001, 196, 0);
defineWord("enchanted", 0b00100010, 98, 0);
defineWord("end", 0b10000000, 0, 0);
defineWord("everyt", 0b00000100, 0, 0);
defineWord("exit", 0b11000001, 194, 0);
defineWord("extinguish", 0b01000001, 193, 0);
defineWord("examine", 0b01000001, 195, 0);
defineWord("except", 0b00000100, 0, 0);
defineWord("exchange", 0b01000001, 228, 0);
defineWord("excite", 0b01000001, 106, 0);
defineWord("eyes", 0b10000000, 0, 0);
defineWord("eye", 0b10000000, 0, 0);
defineWord("eyed", 0b00100010, 218, 0);
defineWord("e", 0b00110011, 28, 26);
defineWord("ears", 0b10000000, 0, 0);
defineWord("ear", 0b10000000, 0, 0);
defineWord("east", 0b00110011, 28, 26);
defineWord("eat", 0b01000001, 198, 0);
defineWord("each", 0b00100010, 35, 0);
defineWord("feel", 0b01000001, 93, 0);
defineWord("feed", 0b01000001, 192, 0);
defineWord("female", 0b00100010, 179, 0);
defineWord("fence", 0b10000000, 0, 0);
defineWord("fight", 0b01000001, 229, 0);
defineWord("figure", 0b10000000, 0, 0);
defineWord("fill", 0b01000001, 191, 0);
defineWord("filthy", 0b00100010, 76, 0);
defineWord("finger", 0b10000000, 0, 0);
defineWord("find", 0b01000001, 190, 0);
defineWord("first", 0b00100010, 180, 0);
defineWord("flexible", 0b00100010, 133, 0);
defineWord("flip", 0b01000001, 92, 0);
defineWord("flick", 0b01000001, 92, 0);
defineWord("floor", 0b10000000, 0, 0);
defineWord("flower", 0b10000000, 0, 0);
defineWord("flowing", 0b00100010, 87, 0);
defineWord("flush", 0b01000001, 189, 0);
defineWord("flytrap", 0b10000000, 0, 0);
defineWord("flagship", 0b10000000, 0, 0);
defineWord("flag", 0b00100010, 209, 0);
defineWord("flashlight", 0b10000000, 0, 0);
defineWord("flash", 0b00100010, 71, 0);
defineWord("follow", 0b01000001, 188, 0);
defineWord("fondle", 0b01000001, 93, 0);
defineWord("food", 0b10000000, 0, 0);
defineWord("forlorn", 0b00100010, 128, 0);
defineWord("fornicate", 0b01000001, 187, 0);
defineWord("forty", 0b00100010, 91, 0);
defineWord("for", 0b00001000, 252, 0);
defineWord("ford", 0b11100001, 208, 198);
defineWord("foul", 0b00100010, 39, 0);
defineWord("fountain", 0b10000000, 0, 0);
defineWord("free", 0b01000001, 87, 0);
defineWord("fresh", 0b00100010, 42, 0);
defineWord("frog's", 0b00100010, 97, 0);
defineWord("frog", 0b10000000, 0, 0);
defineWord("from", 0b00001000, 247, 0);
defineWord("front", 0b00100010, 64, 0);
defineWord("fucked", 0b00000100, 0, 0);
defineWord("fucking", 0b00000100, 0, 0);
defineWord("fuck", 0b01000001, 187, 0);
defineWord("fairbanks", 0b10000000, 0, 0);
defineWord("familiar", 0b00100010, 38, 0);
defineWord("fasten", 0b01000001, 94, 0);
defineWord("faded", 0b00100010, 55, 0);
defineWord("gents", 0b00100010, 75, 0);
defineWord("gent's", 0b00100010, 73, 0);
defineWord("get", 0b01000001, 101, 0);
defineWord("gigantic", 0b00100010, 1, 0);
defineWord("give", 0b01000001, 184, 0);
defineWord("giant", 0b00100010, 1, 0);
defineWord("giddyap", 0b01000001, 186, 0);
defineWord("giddap", 0b01000001, 186, 0);
defineWord("gleaming", 0b00100010, 235, 0);
defineWord("glint", 0b10000000, 0, 0);
defineWord("glistening", 0b00100010, 201, 0);
defineWord("gloss", 0b10000000, 0, 0);
defineWord("glass", 0b10100010, 59, 0);
defineWord("golden", 0b00100010, 86, 0);
defineWord("gold", 0b00100010, 96, 0);
defineWord("gondola", 0b10000000, 0, 0);
defineWord("gorilla", 0b10100010, 9, 0);
defineWord("gown", 0b10000000, 0, 0);
defineWord("go", 0b01001001, 185, 232);
defineWord("gobble", 0b01000001, 198, 0);
defineWord("goddesses", 0b10100010, 5, 0);
defineWord("green", 0b00100010, 99, 0);
defineWord("grimy", 0b00100010, 61, 0);
defineWord("ground", 0b10000000, 0, 0);
defineWord("grab", 0b01000001, 101, 0);
defineWord("guess", 0b01000001, 234, 0);
defineWord("guard", 0b10100010, 13, 0);
defineWord("g", 0b00000100, 0, 0);
defineWord("hello", 0b01000001, 182, 0);
defineWord("help", 0b01000001, 181, 0);
defineWord("here", 0b00000100, 0, 0);
defineWord("herself", 0b10000000, 0, 0);
defineWord("her", 0b10100010, 214, 0);
defineWord("hear", 0b01000001, 183, 0);
defineWord("headlight", 0b10000000, 0, 0);
defineWord("heady", 0b00100010, 40, 0);
defineWord("head", 0b10100010, 199, 0);
defineWord("himself", 0b10000000, 0, 0);
defineWord("him", 0b10000000, 0, 0);
defineWord("hints", 0b01000001, 181, 0);
defineWord("hint", 0b01000001, 181, 0);
defineWord("hiss", 0b01000001, 179, 0);
defineWord("his", 0b00100010, 89, 0);
defineWord("hit", 0b01000001, 229, 0);
defineWord("hi", 0b01000001, 182, 0);
defineWord("hide", 0b01000001, 180, 0);
defineWord("hole", 0b10000000, 0, 0);
defineWord("hold", 0b01000001, 101, 0);
defineWord("home", 0b10000000, 0, 0);
defineWord("hop", 0b01000001, 116, 0);
defineWord("horse", 0b10000000, 0, 0);
defineWord("hose", 0b10000000, 0, 0);
defineWord("household", 0b00100010, 101, 0);
defineWord("house", 0b10000000, 0, 0);
defineWord("huger", 0b00100010, 1, 0);
defineWord("huge", 0b00100010, 1, 0);
defineWord("hump", 0b01000001, 187, 0);
defineWord("humanoid", 0b00100010, 220, 0);
defineWord("hunk", 0b10000000, 0, 0);
defineWord("hurl", 0b01000001, 95, 0);
defineWord("husband", 0b10100010, 33, 0);
defineWord("hair", 0b10000000, 0, 0);
defineWord("handset", 0b10000000, 0, 0);
defineWord("hands", 0b10000000, 0, 0);
defineWord("hand", 0b11000001, 184, 0);
defineWord("happy", 0b00001000, 231, 0);
defineWord("harem", 0b10100010, 141, 0);
defineWord("harlow", 0b10000000, 0, 0);
defineWord("hard", 0b00001000, 248, 0);
defineWord("hatchway", 0b10000000, 0, 0);
defineWord("hatch", 0b10000000, 0, 0);
defineWord("igloo", 0b10100010, 161, 0);
defineWord("impassable", 0b00100010, 114, 0);
defineWord("inflate", 0b01000001, 178, 0);
defineWord("infant", 0b10100010, 158, 0);
defineWord("ingest", 0b01000001, 198, 0);
defineWord("insert", 0b01000001, 107, 0);
defineWord("inside", 0b00001000, 245, 0);
defineWord("inspect", 0b01000001, 195, 0);
defineWord("into", 0b00001000, 245, 0);
defineWord("invent", 0b01000001, 248, 0);
defineWord("in", 0b00011011, 20, 245);
defineWord("is", 0b00000100, 0, 0);
defineWord("itself", 0b10000000, 0, 0);
defineWord("it", 0b10000000, 0, 0);
defineWord("i", 0b11000001, 248, 0);
defineWord("jerk", 0b01000001, 177, 0);
defineWord("jean", 0b00100010, 222, 0);
defineWord("joe", 0b10000000, 0, 0);
defineWord("jockstrap", 0b10000000, 0, 0);
defineWord("jump", 0b01000001, 176, 0);
defineWord("jar", 0b10000000, 0, 0);
defineWord("jack", 0b01000001, 177, 0);
defineWord("kill", 0b01000001, 229, 0);
defineWord("king's", 0b00100010, 85, 0);
defineWord("king", 0b10100010, 88, 0);
defineWord("kiss", 0b01000001, 174, 0);
defineWord("kick", 0b01000001, 175, 0);
defineWord("kneel", 0b01000001, 173, 0);
defineWord("knees", 0b10000000, 0, 0);
defineWord("knee", 0b10000000, 0, 0);
defineWord("kneecap", 0b10000000, 0, 0);
defineWord("knob", 0b10000000, 0, 0);
defineWord("knock", 0b01000001, 172, 0);
defineWord("kweepa", 0b01000001, 171, 0);
defineWord("lettuce", 0b10000000, 0, 0);
defineWord("let", 0b01000001, 165, 0);
defineWord("lewd", 0b01000001, 250, 0);
defineWord("leaf", 0b10000000, 0, 0);
defineWord("leak", 0b01001000, 226, 145);
defineWord("lean", 0b01000001, 167, 0);
defineWord("leap", 0b01000001, 176, 0);
defineWord("leather", 0b00100010, 247, 0);
defineWord("leaves", 0b10000000, 0, 0);
defineWord("leave", 0b01000001, 166, 0);
defineWord("lead", 0b01000001, 150, 0);
defineWord("ledge", 0b10000000, 0, 0);
defineWord("lie", 0b01000001, 163, 0);
defineWord("liferaft", 0b10000000, 0, 0);
defineWord("life", 0b00100010, 152, 0);
defineWord("lift", 0b01000001, 137, 0);
defineWord("light", 0b11000001, 162, 0);
defineWord("ligh", 0b10000000, 0, 0);
defineWord("limber", 0b01000001, 161, 0);
defineWord("lips", 0b10000000, 0, 0);
defineWord("lip", 0b10100010, 122, 0);
defineWord("listen", 0b01000001, 160, 0);
defineWord("little", 0b00100010, 3, 0);
defineWord("lick", 0b01000001, 164, 0);
defineWord("loincloth", 0b10000000, 0, 0);
defineWord("long", 0b00100010, 207, 0);
defineWord("look", 0b01000001, 158, 0);
defineWord("looming", 0b00100010, 120, 0);
defineWord("lotion", 0b10000000, 0, 0);
defineWord("love", 0b11000001, 157, 0);
defineWord("lower", 0b01000001, 156, 0);
defineWord("lock", 0b01000001, 159, 0);
defineWord("locati", 0b10000000, 0, 0);
defineWord("luscious", 0b00100010, 230, 0);
defineWord("l", 0b01000001, 158, 0);
defineWord("land", 0b01000001, 170, 0);
defineWord("larger", 0b00100010, 1, 0);
defineWord("large", 0b00100010, 1, 0);
defineWord("laugh", 0b01000001, 169, 0);
defineWord("launch", 0b01000001, 168, 0);
defineWord("laundry", 0b10000000, 0, 0);
defineWord("lawn", 0b10000000, 0, 0);
defineWord("lay", 0b01000001, 187, 0);
defineWord("ladies", 0b00100010, 77, 0);
defineWord("ladder", 0b10000000, 0, 0);
defineWord("mens", 0b00100010, 74, 0);
defineWord("men's", 0b00100010, 72, 0);
defineWord("message", 0b10000000, 0, 0);
defineWord("metallic", 0b00100010, 118, 0);
defineWord("metal", 0b00100010, 117, 0);
defineWord("me", 0b10000000, 0, 0);
defineWord("measure", 0b01000001, 152, 0);
defineWord("mightier", 0b00100010, 1, 0);
defineWord("mighty", 0b00100010, 1, 0);
defineWord("milk", 0b00100010, 231, 0);
defineWord("mine", 0b00100010, 4, 0);
defineWord("minaret", 0b10000000, 0, 0);
defineWord("mirage", 0b10000000, 0, 0);
defineWord("mitre", 0b10100010, 84, 0);
defineWord("mixer", 0b10000000, 0, 0);
defineWord("money", 0b10000000, 0, 0);
defineWord("monkey", 0b10100010, 10, 0);
defineWord("monster", 0b10000000, 0, 0);
defineWord("moor", 0b01000001, 170, 0);
defineWord("more", 0b00000100, 0, 0);
defineWord("moth", 0b00100010, 237, 0);
defineWord("mothball", 0b10000000, 0, 0);
defineWord("mount", 0b11000001, 224, 0);
defineWord("mouse", 0b10000000, 0, 0);
defineWord("mouth", 0b10000000, 0, 0);
defineWord("move", 0b01000001, 150, 0);
defineWord("moan", 0b01000001, 151, 0);
defineWord("mug", 0b10000000, 0, 0);
defineWord("murder", 0b01000001, 229, 0);
defineWord("myself", 0b10000000, 0, 0);
defineWord("my", 0b00100010, 4, 0);
defineWord("magnificent", 0b00100010, 202, 0);
defineWord("mailing", 0b00100010, 131, 0);
defineWord("make", 0b01000001, 155, 0);
defineWord("male", 0b00100010, 177, 0);
defineWord("man's", 0b00100010, 21, 0);
defineWord("man", 0b10000000, 0, 0);
defineWord("map", 0b10000000, 0, 0);
defineWord("marry", 0b01000001, 154, 0);
defineWord("marsmid", 0b10100010, 191, 0);
defineWord("marsmouse", 0b10000000, 0, 0);
defineWord("martian", 0b00100010, 107, 0);
defineWord("massive", 0b00100010, 1, 0);
defineWord("mass", 0b10000000, 0, 0);
defineWord("masturbate", 0b01000001, 153, 0);
defineWord("matches", 0b00100010, 242, 0);
defineWord("match", 0b00100010, 239, 0);
defineWord("matchbook", 0b10100010, 241, 0);
defineWord("machine", 0b10000000, 0, 0);
defineWord("mach", 0b00100010, 240, 0);
defineWord("machbook", 0b10000000, 0, 0);
defineWord("mad", 0b00100010, 52, 0);
defineWord("ne", 0b00110011, 29, 29);
defineWord("near", 0b00001000, 240, 0);
defineWord("nibble", 0b01000001, 98, 0);
defineWord("nope", 0b01000001, 149, 0);
defineWord("northe", 0b00110011, 29, 29);
defineWord("northwest", 0b00110011, 23, 28);
defineWord("north", 0b00110011, 30, 24);
defineWord("nose", 0b10000000, 0, 0);
defineWord("nostril", 0b10000000, 0, 0);
defineWord("notes", 0b00100010, 244, 0);
defineWord("notati", 0b00100010, 245, 0);
defineWord("no", 0b01000001, 149, 0);
defineWord("number", 0b10100010, 93, 0);
defineWord("nurse", 0b01000001, 104, 0);
defineWord("nw", 0b00110011, 23, 28);
defineWord("n", 0b00110011, 30, 24);
defineWord("nah", 0b01000001, 149, 0);
defineWord("nap", 0b11000001, 115, 0);
defineWord("narrow", 0b00100010, 132, 0);
defineWord("offer", 0b01000001, 184, 0);
defineWord("off", 0b00001000, 246, 0);
defineWord("of", 0b00000100, 0, 0);
defineWord("ointment", 0b10000000, 0, 0);
defineWord("ok", 0b01000001, 74, 0);
defineWord("okay", 0b01000001, 74, 0);
defineWord("one", 0b00100010, 192, 0);
defineWord("onto", 0b00001000, 253, 0);
defineWord("on", 0b00001000, 253, 0);
defineWord("oops", 0b00000100, 0, 0);
defineWord("open", 0b01000001, 148, 0);
defineWord("orphanage", 0b10100010, 162, 0);
defineWord("orange", 0b00100010, 105, 0);
defineWord("orch", 0b10000000, 0, 0);
defineWord("order", 0b01000001, 221, 0);
defineWord("other", 0b10100010, 178, 0);
defineWord("outside", 0b00001000, 249, 0);
defineWord("out", 0b00011011, 19, 249);
defineWord("over", 0b00001000, 243, 0);
defineWord("overall", 0b10000000, 0, 0);
defineWord("owner", 0b10100010, 12, 0);
defineWord("oasis", 0b10000000, 0, 0);
defineWord("observe", 0b01000001, 195, 0);
defineWord("odor", 0b10000000, 0, 0);
defineWord("odd", 0b00100010, 170, 0);
defineWord("pee-pee", 0b01000001, 145, 0);
defineWord("pee", 0b01000001, 145, 0);
defineWord("penguin", 0b10000000, 0, 0);
defineWord("penis", 0b10000000, 0, 0);
defineWord("petite", 0b00100010, 3, 0);
defineWord("pet", 0b01000001, 93, 0);
defineWord("phone", 0b01100001, 144, 148);
defineWord("phoneb", 0b10000000, 0, 0);
defineWord("phoo", 0b00100010, 224, 0);
defineWord("photo", 0b10000000, 0, 0);
defineWord("phobos", 0b10000000, 0, 0);
defineWord("pier", 0b10000000, 0, 0);
defineWord("pie", 0b10000000, 0, 0);
defineWord("piece", 0b10000000, 0, 0);
defineWord("pile", 0b10000000, 0, 0);
defineWord("pin", 0b11000001, 142, 0);
defineWord("piss", 0b01001000, 227, 145);
defineWord("pizza", 0b10000000, 0, 0);
defineWord("pick", 0b01000001, 143, 0);
defineWord("picture", 0b10000000, 0, 0);
defineWord("piddle", 0b01000001, 145, 0);
defineWord("please", 0b00000100, 0, 0);
defineWord("pleasant", 0b00100010, 41, 0);
defineWord("plug", 0b01000001, 210, 0);
defineWord("plush", 0b00100010, 246, 0);
defineWord("plastic", 0b00100010, 53, 0);
defineWord("play", 0b01000001, 141, 0);
defineWord("place", 0b11000001, 107, 0);
defineWord("pointed", 0b00100010, 215, 0);
defineWord("point", 0b01000001, 140, 0);
defineWord("poke", 0b01000001, 93, 0);
defineWord("pool", 0b10000000, 0, 0);
defineWord("poo-poo", 0b01000001, 121, 0);
defineWord("pop", 0b01000001, 206, 0);
defineWord("portable", 0b00100010, 134, 0);
defineWord("pounds", 0b00000100, 0, 0);
defineWord("pour", 0b01000001, 139, 0);
defineWord("power", 0b00100010, 119, 0);
defineWord("pocket", 0b10000000, 0, 0);
defineWord("press", 0b01000001, 138, 0);
defineWord("prince", 0b10100010, 14, 0);
defineWord("prison", 0b00100010, 226, 0);
defineWord("proprietor", 0b10100010, 11, 0);
defineWord("protag", 0b10000000, 0, 0);
defineWord("procee", 0b01000001, 82, 0);
defineWord("pry", 0b00000100, 0, 0);
defineWord("puke", 0b01000001, 85, 0);
defineWord("pull", 0b01000001, 150, 0);
defineWord("purple", 0b00100010, 106, 0);
defineWord("pursue", 0b01000001, 188, 0);
defineWord("purchase", 0b01000001, 221, 0);
defineWord("push", 0b01000001, 138, 0);
defineWord("pussy", 0b10100010, 227, 0);
defineWord("put", 0b01000001, 107, 0);
defineWord("paining", 0b10000000, 0, 0);
defineWord("painting", 0b10000000, 0, 0);
defineWord("paint", 0b11000001, 110, 0);
defineWord("pair", 0b10000000, 0, 0);
defineWord("palm", 0b10000000, 0, 0);
defineWord("paper", 0b10000000, 0, 0);
defineWord("passenger", 0b00100010, 210, 0);
defineWord("pass", 0b01000001, 147, 0);
defineWord("pat", 0b01000001, 93, 0);
defineWord("pay", 0b01100001, 146, 188);
defineWord("quit", 0b01000001, 247, 0);
defineWord("q", 0b01000001, 247, 0);
defineWord("reflecting", 0b00100010, 48, 0);
defineWord("regurgitate", 0b01000001, 85, 0);
defineWord("relieve", 0b01000001, 132, 0);
defineWord("reliable", 0b00100010, 143, 0);
defineWord("rellis", 0b10000000, 0, 0);
defineWord("remove", 0b11000001, 131, 0);
defineWord("reply", 0b01000001, 234, 0);
defineWord("restor", 0b01000001, 245, 0);
defineWord("restroom", 0b10000000, 0, 0);
defineWord("restar", 0b01000001, 246, 0);
defineWord("rescue", 0b01000001, 244, 0);
defineWord("return", 0b01100001, 130, 189);
defineWord("rear", 0b00100010, 176, 0);
defineWord("reach", 0b01000001, 134, 0);
defineWord("read", 0b01000001, 133, 0);
defineWord("rectan", 0b00100010, 57, 0);
defineWord("red", 0b00100010, 54, 0);
defineWord("reddish", 0b00100010, 112, 0);
defineWord("rip", 0b01000001, 129, 0);
defineWord("rise", 0b01000001, 109, 0);
defineWord("rickety", 0b00100010, 51, 0);
defineWord("ride", 0b01000001, 224, 0);
defineWord("riddle", 0b10000000, 0, 0);
defineWord("roll", 0b01000001, 128, 0);
defineWord("roof", 0b10000000, 0, 0);
defineWord("room", 0b10000000, 0, 0);
defineWord("rope", 0b10000000, 0, 0);
defineWord("rotate", 0b01000001, 92, 0);
defineWord("rouse", 0b01000001, 83, 0);
defineWord("royal", 0b00100010, 83, 0);
defineWord("robotic", 0b00100010, 160, 0);
defineWord("robot", 0b10100010, 159, 0);
defineWord("rocky", 0b00100010, 185, 0);
defineWord("rock-a-bye", 0b01000001, 122, 0);
defineWord("rock", 0b01000001, 122, 0);
defineWord("rules", 0b10000000, 0, 0);
defineWord("rule", 0b00100010, 68, 0);
defineWord("rummag", 0b01000001, 123, 0);
defineWord("run", 0b01000001, 82, 0);
defineWord("rusted", 0b00100010, 121, 0);
defineWord("rubies", 0b10000000, 0, 0);
defineWord("ruby", 0b10000000, 0, 0);
defineWord("rub", 0b01000001, 127, 0);
defineWord("rubber", 0b00100010, 151, 0);
defineWord("raft", 0b10000000, 0, 0);
defineWord("raf", 0b10000000, 0, 0);
defineWord("ragged", 0b00100010, 156, 0);
defineWord("raise", 0b01000001, 137, 0);
defineWord("rake", 0b11000001, 136, 0);
defineWord("rape", 0b01000001, 135, 0);
defineWord("rap", 0b01000001, 172, 0);
defineWord("ray", 0b10000000, 0, 0);
defineWord("rabbit", 0b10000000, 0, 0);
defineWord("seek", 0b01000001, 190, 0);
defineWord("self", 0b10000000, 0, 0);
defineWord("sell", 0b01000001, 184, 0);
defineWord("set", 0b01000001, 92, 0);
defineWord("sex", 0b00000100, 0, 0);
defineWord("se", 0b00110011, 27, 31);
defineWord("search", 0b01000001, 123, 0);
defineWord("second", 0b00100010, 181, 0);
defineWord("secret", 0b00100010, 145, 0);
defineWord("secre", 0b00100010, 146, 0);
defineWord("secure", 0b01000001, 94, 0);
defineWord("seduce", 0b01000001, 187, 0);
defineWord("sheet", 0b10000000, 0, 0);
defineWord("shee", 0b00100010, 196, 0);
defineWord("shelf", 0b10000000, 0, 0);
defineWord("shine", 0b01000001, 140, 0);
defineWord("ship", 0b10000000, 0, 0);
defineWord("shithead", 0b00000100, 0, 0);
defineWord("shitty", 0b00000100, 0, 0);
defineWord("shit", 0b01001001, 121, 225);
defineWord("shoo", 0b01000001, 125, 0);
defineWord("shop", 0b10000000, 0, 0);
defineWord("shout", 0b01000001, 75, 0);
defineWord("show", 0b01000001, 120, 0);
defineWord("shred", 0b01000001, 129, 0);
defineWord("shut", 0b01000001, 213, 0);
defineWord("shake", 0b01000001, 122, 0);
defineWord("shapes", 0b10000000, 0, 0);
defineWord("shape", 0b10100010, 6, 0);
defineWord("shadowy", 0b00100010, 212, 0);
defineWord("sigh", 0b01000001, 119, 0);
defineWord("sign", 0b10000000, 0, 0);
defineWord("simple", 0b00100010, 104, 0);
defineWord("sink", 0b11000001, 118, 0);
defineWord("sip", 0b01000001, 200, 0);
defineWord("sit", 0b01000001, 117, 0);
defineWord("sick", 0b00100010, 123, 0);
defineWord("sidle", 0b01000001, 82, 0);
defineWord("skim", 0b01000001, 133, 0);
defineWord("skip", 0b01000001, 116, 0);
defineWord("sleep", 0b11000001, 115, 0);
defineWord("slender", 0b00100010, 139, 0);
defineWord("slice", 0b11000001, 114, 0);
defineWord("slide", 0b01000001, 113, 0);
defineWord("slot", 0b10000000, 0, 0);
defineWord("slap", 0b01000001, 229, 0);
defineWord("slay", 0b01000001, 229, 0);
defineWord("slab", 0b10000000, 0, 0);
defineWord("smell", 0b11000001, 111, 0);
defineWord("smear", 0b01000001, 112, 0);
defineWord("smaller", 0b00100010, 3, 0);
defineWord("small", 0b00100010, 3, 0);
defineWord("smash", 0b01000001, 205, 0);
defineWord("sniff", 0b01000001, 111, 0);
defineWord("snooze", 0b11000001, 115, 0);
defineWord("snap", 0b01000001, 77, 0);
defineWord("some", 0b00000100, 0, 0);
defineWord("sool", 0b10000000, 0, 0);
defineWord("southe", 0b00110011, 27, 31);
defineWord("southwest", 0b00110011, 25, 30);
defineWord("south", 0b00110011, 26, 25);
defineWord("sod", 0b10000000, 0, 0);
defineWord("speak", 0b01000001, 100, 0);
defineWord("spill", 0b01000001, 139, 0);
defineWord("spin", 0b01000001, 92, 0);
defineWord("splattered", 0b00100010, 200, 0);
defineWord("spread", 0b01000001, 227, 0);
defineWord("spy", 0b10000000, 0, 0);
defineWord("spaceship", 0b10000000, 0, 0);
defineWord("space", 0b00100010, 208, 0);
defineWord("squid", 0b10000000, 0, 0);
defineWord("square", 0b00100010, 195, 0);
defineWord("steer", 0b01000001, 92, 0);
defineWord("step", 0b11000001, 82, 0);
defineWord("stimulate", 0b01000001, 106, 0);
defineWord("stick", 0b11000001, 107, 0);
defineWord("stone", 0b00100010, 138, 0);
defineWord("stool", 0b10000000, 0, 0);
defineWord("stoop", 0b10000000, 0, 0);
defineWord("store", 0b10000000, 0, 0);
defineWord("stretch", 0b01000001, 161, 0);
defineWord("strike", 0b01000001, 229, 0);
defineWord("strips", 0b10000000, 0, 0);
defineWord("strip", 0b01000001, 90, 0);
defineWord("stroke", 0b01000001, 93, 0);
defineWord("strong", 0b00100010, 37, 0);
defineWord("structure", 0b10000000, 0, 0);
defineWord("strange", 0b00100010, 124, 0);
defineWord("straps", 0b10000000, 0, 0);
defineWord("strap", 0b11000001, 94, 0);
defineWord("stuff", 0b01000001, 107, 0);
defineWord("study", 0b01000001, 195, 0);
defineWord("stud", 0b10000000, 0, 0);
defineWord("stagnant", 0b00100010, 46, 0);
defineWord("stained", 0b00100010, 58, 0);
defineWord("stain", 0b11000001, 110, 0);
defineWord("stairs", 0b10000000, 0, 0);
defineWord("stairw", 0b10000000, 0, 0);
defineWord("stair", 0b10000000, 0, 0);
defineWord("stallion", 0b10000000, 0, 0);
defineWord("stand", 0b01000001, 109, 0);
defineWord("start", 0b01000001, 108, 0);
defineWord("status", 0b01000001, 243, 0);
defineWord("stab", 0b01000001, 229, 0);
defineWord("suggestive", 0b01000001, 251, 0);
defineWord("suit", 0b10000000, 0, 0);
defineWord("sui", 0b10000000, 0, 0);
defineWord("sultan", 0b10100010, 142, 0);
defineWord("super", 0b01100001, 253, 249);
defineWord("superbrief", 0b01000001, 253, 0);
defineWord("sure", 0b01000001, 74, 0);
defineWord("suckle", 0b01000001, 104, 0);
defineWord("suck", 0b01000001, 105, 0);
defineWord("swim", 0b01000001, 103, 0);
defineWord("swing", 0b01000001, 102, 0);
defineWord("switch", 0b11000001, 92, 0);
defineWord("swords", 0b10000000, 0, 0);
defineWord("sword", 0b10000000, 0, 0);
defineWord("sw", 0b00110011, 25, 30);
defineWord("swallow", 0b01000001, 200, 0);
defineWord("swap", 0b01000001, 228, 0);
defineWord("swaying", 0b00100010, 116, 0);
defineWord("s", 0b00110011, 26, 25);
defineWord("sain", 0b10000000, 0, 0);
defineWord("salesman", 0b10100010, 7, 0);
defineWord("sales", 0b00100010, 169, 0);
defineWord("sand-covered", 0b00100010, 108, 0);
defineWord("sand", 0b10100010, 111, 0);
defineWord("save", 0b01000001, 244, 0);
defineWord("say", 0b01000001, 126, 0);
defineWord("sack", 0b10000000, 0, 0);
defineWord("scent", 0b10000000, 0, 0);
defineWord("scientist", 0b10100010, 8, 0);
defineWord("score", 0b01000001, 124, 0);
defineWord("screw", 0b01000001, 187, 0);
defineWord("scream", 0b01000001, 75, 0);
defineWord("script", 0b01000001, 242, 0);
defineWord("scram", 0b01000001, 125, 0);
defineWord("scrap", 0b10000000, 0, 0);
defineWord("scratch", 0b01000001, 93, 0);
defineWord("sculpted", 0b00100010, 113, 0);
defineWord("scale", 0b01000001, 214, 0);
defineWord("scat", 0b01000001, 125, 0);
defineWord("teensy", 0b00100010, 3, 0);
defineWord("tee-remover", 0b00100010, 174, 0);
defineWord("tee", 0b00100010, 172, 0);
defineWord("telephone", 0b00100010, 149, 0);
defineWord("tell", 0b01000001, 97, 0);
defineWord("tent", 0b10000000, 0, 0);
defineWord("tentac", 0b00100010, 221, 0);
defineWord("ten", 0b00100010, 190, 0);
defineWord("tear", 0b01000001, 129, 0);
defineWord("tea-remover", 0b00100010, 175, 0);
defineWord("tea", 0b00100010, 173, 0);
defineWord("them", 0b10000000, 0, 0);
defineWord("then", 0b00000100, 0, 0);
defineWord("therma", 0b10100010, 203, 0);
defineWord("theta", 0b10100010, 16, 0);
defineWord("the", 0b00000100, 0, 0);
defineWord("this", 0b00000100, 0, 0);
defineWord("thorbast", 0b10100010, 205, 0);
defineWord("through", 0b00001000, 242, 0);
defineWord("throw", 0b01000001, 95, 0);
defineWord("thru", 0b00001000, 242, 0);
defineWord("thanks", 0b01000001, 96, 0);
defineWord("thank", 0b01000001, 96, 0);
defineWord("that", 0b00000100, 0, 0);
defineWord("tie", 0b01000001, 94, 0);
defineWord("tiff's", 0b00100010, 184, 0);
defineWord("tiff", 0b10000000, 0, 0);
defineWord("tiffan", 0b10100010, 183, 0);
defineWord("tight", 0b00100010, 66, 0);
defineWord("tinier", 0b00100010, 3, 0);
defineWord("tinkle", 0b01000001, 145, 0);
defineWord("tiny", 0b00100010, 3, 0);
defineWord("tits", 0b10000000, 0, 0);
defineWord("tit", 0b10000000, 0, 0);
defineWord("together", 0b00001000, 223, 0);
defineWord("toilet", 0b10000000, 0, 0);
defineWord("torch", 0b10000000, 0, 0);
defineWord("toss", 0b01000001, 95, 0);
defineWord("touch", 0b01000001, 93, 0);
defineWord("towering", 0b00100010, 36, 0);
defineWord("tower", 0b10000000, 0, 0);
defineWord("toward", 0b00001000, 255, 0);
defineWord("to", 0b00001000, 255, 0);
defineWord("trees", 0b10000000, 0, 0);
defineWord("tree-", 0b10000000, 0, 0);
defineWord("tree", 0b10100010, 168, 0);
defineWord("trellis", 0b10000000, 0, 0);
defineWord("tremendous", 0b00100010, 1, 0);
defineWord("trent", 0b10100010, 182, 0);
defineWord("trample", 0b01000001, 205, 0);
defineWord("trap", 0b01000001, 218, 0);
defineWord("tray", 0b10000000, 0, 0);
defineWord("trade", 0b01000001, 228, 0);
defineWord("turn", 0b01000001, 92, 0);
defineWord("tube", 0b10000000, 0, 0);
defineWord("t-remover", 0b10000000, 0, 0);
defineWord("t", 0b00100010, 171, 0);
defineWord("take", 0b01000001, 101, 0);
defineWord("talk", 0b01000001, 100, 0);
defineWord("tall", 0b00100010, 140, 0);
defineWord("tame", 0b01000001, 252, 0);
defineWord("tap", 0b01000001, 99, 0);
defineWord("taste", 0b01000001, 98, 0);
defineWord("tattered", 0b00100010, 157, 0);
defineWord("uh-uh", 0b01000001, 149, 0);
defineWord("unfast", 0b01000001, 87, 0);
defineWord("unknot", 0b01000001, 87, 0);
defineWord("unlock", 0b01000001, 89, 0);
defineWord("unpin", 0b01000001, 91, 0);
defineWord("unplug", 0b01000001, 91, 0);
defineWord("unreliable", 0b00100010, 144, 0);
defineWord("unroll", 0b01000001, 88, 0);
defineWord("unstrap", 0b01000001, 87, 0);
defineWord("unscript", 0b01000001, 241, 0);
defineWord("untie", 0b01000001, 87, 0);
defineWord("untang", 0b00100010, 166, 0);
defineWord("unwrap", 0b01000001, 131, 0);
defineWord("unangl", 0b00100010, 167, 0);
defineWord("unatta", 0b01000001, 87, 0);
defineWord("unblock", 0b01000001, 91, 0);
defineWord("uncover", 0b01000001, 91, 0);
defineWord("underneath", 0b00001000, 241, 0);
defineWord("under", 0b00001000, 241, 0);
defineWord("undres", 0b01001000, 228, 90);
defineWord("upstairs", 0b00011011, 22, 250);
defineWord("up", 0b00011011, 22, 250);
defineWord("urinate", 0b01000001, 145, 0);
defineWord("use", 0b01000001, 86, 0);
defineWord("using", 0b00001000, 251, 0);
defineWord("u", 0b00011011, 22, 250);
defineWord("ube", 0b10000000, 0, 0);
defineWord("venus", 0b10100010, 165, 0);
defineWord("version", 0b01000001, 240, 0);
defineWord("verbose", 0b01000001, 255, 0);
defineWord("viewport", 0b10000000, 0, 0);
defineWord("vizicomm", 0b10100010, 186, 0);
defineWord("vomit", 0b01000001, 85, 0);
defineWord("vagina", 0b10000000, 0, 0);
defineWord("vault", 0b01000001, 176, 0);
defineWord("weensy", 0b00100010, 3, 0);
defineWord("wee-wee", 0b01000001, 145, 0);
defineWord("wee", 0b01000001, 145, 0);
defineWord("well", 0b10000000, 0, 0);
defineWord("west", 0b00110011, 24, 27);
defineWord("wear", 0b01000001, 80, 0);
defineWord("wed", 0b01000001, 154, 0);
defineWord("wheres", 0b01000001, 78, 0);
defineWord("where", 0b01000001, 78, 0);
defineWord("whie", 0b00100010, 204, 0);
defineWord("whiff", 0b01000001, 111, 0);
defineWord("whip", 0b01000001, 77, 0);
defineWord("white", 0b00100010, 63, 0);
defineWord("whole", 0b00100010, 194, 0);
defineWord("whos", 0b01000001, 79, 0);
defineWord("who", 0b01000001, 79, 0);
defineWord("whats", 0b01000001, 79, 0);
defineWord("what'", 0b01000001, 79, 0);
defineWord("what", 0b01000001, 79, 0);
defineWord("wife's", 0b00100010, 18, 0);
defineWord("wife", 0b10100010, 32, 0);
defineWord("winding", 0b00100010, 56, 0);
defineWord("window", 0b10000000, 0, 0);
defineWord("wipe", 0b01000001, 81, 0);
defineWord("with", 0b00001000, 251, 0);
defineWord("withdr", 0b01000001, 194, 0);
defineWord("wicker", 0b00100010, 236, 0);
defineWord("wide", 0b00100010, 2, 0);
defineWord("women", 0b00100010, 78, 0);
defineWord("woman", 0b10100010, 22, 0);
defineWord("wooden", 0b00100010, 79, 0);
defineWord("wreck", 0b01000001, 205, 0);
defineWord("wrap", 0b01000001, 76, 0);
defineWord("w", 0b00110011, 24, 27);
defineWord("wait", 0b01000001, 84, 0);
defineWord("wake", 0b01000001, 83, 0);
defineWord("walk", 0b01000001, 82, 0);
defineWord("warm", 0b00100010, 47, 0);
defineWord("warning", 0b00100010, 115, 0);
defineWord("wash", 0b01000001, 81, 0);
defineWord("water", 0b10000000, 0, 0);
defineWord("watch", 0b01000001, 195, 0);
defineWord("waddling", 0b00100010, 155, 0);
defineWord("yell", 0b01000001, 75, 0);
defineWord("yes", 0b01000001, 74, 0);
defineWord("young", 0b00100010, 216, 0);
defineWord("your", 0b00100010, 50, 0);
defineWord("yup", 0b01000001, 74, 0);
defineWord("y", 0b01000001, 74, 0);
defineWord("yacht", 0b10000000, 0, 0);
defineWord("zzmgck", 0b11000001, 73, 0);
defineWord("z", 0b01000001, 84, 0);
defineWord("3-d", 0b00100010, 70, 0);
defineWord(".", 0b00000100, 0, 0);
defineWord(",", 0b00000100, 0, 0);
defineWord("#record", 0b01000001, 237, 0);
defineWord("#random", 0b01000001, 239, 0);
defineWord("#unrecord", 0b01000001, 236, 0);
defineWord("#", 0b00100010, 34, 0);
defineWord("#command", 0b01000001, 238, 0);
defineWord("\"", 0b00000100, 0, 0);
defineWord("$verify", 0b01000001, 235, 0);
defineWord("aging", 0b00100010, 81, 0);
defineWord("against", 0b00001000, 233, 0);
defineWord("again", 0b00000100, 0, 0);
defineWord("aim", 0b01000001, 140, 0);
defineWord("alien", 0b10100010, 126, 0);
defineWord("all", 0b00000100, 0, 0);
defineWord("along", 0b00001000, 238, 0);
defineWord("am", 0b00000100, 0, 0);
defineWord("angles", 0b10000000, 0, 0);
defineWord("angle", 0b10000000, 0, 0);
defineWord("answer", 0b01000001, 234, 0);
defineWord("an", 0b00000100, 0, 0);
defineWord("and", 0b00000100, 0, 0);
defineWord("ape", 0b10000000, 0, 0);
defineWord("apply", 0b01000001, 232, 0);
defineWord("applaud", 0b01000001, 233, 0);
defineWord("approa", 0b01000001, 231, 0);
defineWord("apart", 0b00001000, 230, 0);
defineWord("are", 0b00000100, 0, 0);
defineWord("area", 0b10000000, 0, 0);
defineWord("aroma", 0b10000000, 0, 0);
defineWord("around", 0b00001000, 238, 0);
defineWord("art", 0b00100010, 228, 0);
defineWord("ask", 0b01000001, 230, 0);
defineWord("asshole", 0b00000100, 0, 0);
defineWord("ass", 0b10000000, 0, 0);
defineWord("assassin", 0b10100010, 213, 0);
defineWord("attach", 0b01000001, 94, 0);
defineWord("attack", 0b01100001, 229, 251);
defineWord("at", 0b00001000, 239, 0);
defineWord("auto", 0b10000000, 0, 0);
defineWord("awake", 0b01000001, 83, 0);
defineWord("away", 0b00001000, 236, 0);
defineWord("a", 0b00000100, 0, 0);
defineWord("about", 0b00001000, 254, 0);
defineWord("abandoned", 0b00100010, 110, 0);
defineWord("across", 0b00001000, 234, 0);
defineWord("activa", 0b01000001, 108, 0);
defineWord("address", 0b00100010, 225, 0);
defineWord("beer", 0b10000000, 0, 0);
defineWord("before", 0b00001000, 240, 0);
defineWord("behind", 0b00001000, 237, 0);
defineWord("below", 0b00001000, 241, 0);
defineWord("beneath", 0b00001000, 241, 0);
defineWord("bend", 0b01000001, 227, 0);
defineWord("beat", 0b01000001, 177, 0);
defineWord("bed", 0b10000000, 0, 0);
defineWord("bigger", 0b00100010, 1, 0);
defineWord("big", 0b00100010, 1, 0);
defineWord("bikini", 0b10000000, 0, 0);
defineWord("birds", 0b10000000, 0, 0);
defineWord("bird", 0b10000000, 0, 0);
defineWord("bite", 0b01000001, 226, 0);
defineWord("bits", 0b10000000, 0, 0);
defineWord("bitch", 0b00000100, 0, 0);
defineWord("blender", 0b10000000, 0, 0);
defineWord("blow", 0b01000001, 225, 0);
defineWord("bluepr", 0b00100010, 243, 0);
defineWord("blanket", 0b10000000, 0, 0);
defineWord("black", 0b00100010, 62, 0);
defineWord("blade", 0b10000000, 0, 0);
defineWord("book", 0b10000000, 0, 0);
defineWord("boost", 0b01000001, 137, 0);
defineWord("booth", 0b10000000, 0, 0);
defineWord("boo", 0b01000001, 125, 0);
defineWord("bosom", 0b10000000, 0, 0);
defineWord("both", 0b00000100, 0, 0);
defineWord("bounce", 0b01000001, 122, 0);
defineWord("bow", 0b01000001, 173, 0);
defineWord("box", 0b10000000, 0, 0);
defineWord("board", 0b01000001, 224, 0);
defineWord("boat", 0b10000000, 0, 0);
defineWord("body", 0b10000000, 0, 0);
defineWord("break", 0b01000001, 205, 0);
defineWord("breast", 0b10000000, 0, 0);
defineWord("breathe", 0b01000001, 223, 0);
defineWord("brief", 0b01000001, 254, 0);
defineWord("brown", 0b00100010, 229, 0);
defineWord("browse", 0b01000001, 133, 0);
defineWord("broad", 0b00100010, 2, 0);
defineWord("brassiere", 0b10000000, 0, 0);
defineWord("brass", 0b00100010, 65, 0);
defineWord("bras", 0b10000000, 0, 0);
defineWord("bra", 0b10000000, 0, 0);
defineWord("brackish", 0b00100010, 45, 0);
defineWord("bug-eyed", 0b00100010, 219, 0);
defineWord("bug", 0b00100010, 217, 0);
defineWord("bunny", 0b10100010, 154, 0);
defineWord("bunch", 0b10000000, 0, 0);
defineWord("buoy", 0b10000000, 0, 0);
defineWord("burn", 0b01000001, 222, 0);
defineWord("button", 0b10000000, 0, 0);
defineWord("but", 0b00000100, 0, 0);
defineWord("buy", 0b01000001, 221, 0);
defineWord("by", 0b00001000, 240, 0);
defineWord("bag", 0b10000000, 0, 0);
defineWord("balls", 0b10000000, 0, 0);
defineWord("ball", 0b10000000, 0, 0);
defineWord("balm", 0b10000000, 0, 0);
defineWord("bang", 0b01000001, 187, 0);
defineWord("bare", 0b00100010, 49, 0);
defineWord("barf", 0b01000001, 85, 0);
defineWord("barge", 0b10000000, 0, 0);
defineWord("bargain", 0b01000001, 228, 0);
defineWord("barred", 0b00100010, 60, 0);
defineWord("bars", 0b10000000, 0, 0);
defineWord("bartender", 0b10100010, 17, 0);
defineWord("barter", 0b01000001, 228, 0);
defineWord("bar", 0b10000000, 0, 0);
defineWord("basket", 0b10000000, 0, 0);
defineWord("baske", 0b10000000, 0, 0);
defineWord("bastard", 0b00000100, 0, 0);
defineWord("bathroom", 0b10000000, 0, 0);
defineWord("battle", 0b10100010, 206, 0);
defineWord("baby's", 0b00100010, 23, 0);
defineWord("baby", 0b10100010, 109, 0);
defineWord("back", 0b00101000, 235, 67);
defineWord("ceilin", 0b10000000, 0, 0);
defineWord("cell", 0b10100010, 233, 0);
defineWord("cedarwood", 0b00100010, 103, 0);
defineWord("cedar", 0b00100010, 102, 0);
defineWord("cheer", 0b01000001, 217, 0);
defineWord("chief", 0b00100010, 211, 0);
defineWord("chocolate", 0b10000000, 0, 0);
defineWord("chapst", 0b10000000, 0, 0);
defineWord("chase", 0b01000001, 188, 0);
defineWord("circle", 0b11000001, 216, 0);
defineWord("cleveland", 0b10100010, 147, 0);
defineWord("clean", 0b01000001, 81, 0);
defineWord("cliff", 0b10000000, 0, 0);
defineWord("climax", 0b01000001, 212, 0);
defineWord("climb", 0b01000001, 214, 0);
defineWord("click", 0b01000001, 215, 0);
defineWord("clohes", 0b00100010, 137, 0);
defineWord("closet", 0b10000000, 0, 0);
defineWord("close", 0b01000001, 213, 0);
defineWord("clothes", 0b10100010, 136, 0);
defineWord("cloth", 0b00100010, 197, 0);
defineWord("clap", 0b01000001, 233, 0);
defineWord("coin", 0b10100010, 187, 0);
defineWord("come", 0b01000001, 212, 0);
defineWord("comfort", 0b01000001, 217, 0);
defineWord("comic", 0b00100010, 69, 0);
defineWord("common", 0b00100010, 100, 0);
defineWord("compar", 0b10000000, 0, 0);
defineWord("control", 0b10000000, 0, 0);
defineWord("coon", 0b00100010, 164, 0);
defineWord("copulate", 0b01000001, 211, 0);
defineWord("cotton", 0b00100010, 163, 0);
defineWord("count", 0b01000001, 209, 0);
defineWord("couchmate", 0b00100010, 248, 0);
defineWord("couch", 0b10000000, 0, 0);
defineWord("cover", 0b11000001, 210, 0);
defineWord("cocksu", 0b00000100, 0, 0);
defineWord("cock", 0b10000000, 0, 0);
defineWord("code", 0b10000000, 0, 0);
defineWord("coded", 0b00100010, 125, 0);
defineWord("creamy", 0b00100010, 232, 0);
defineWord("cream", 0b10100010, 153, 0);
defineWord("cross", 0b01000001, 208, 0);
defineWord("crown", 0b10000000, 0, 0);
defineWord("crumpled", 0b00100010, 82, 0);
defineWord("crush", 0b01000001, 205, 0);
defineWord("crap", 0b01000001, 121, 0);
defineWord("crack", 0b01000001, 77, 0);
defineWord("cum", 0b01000001, 212, 0);
defineWord("cunt", 0b10000000, 0, 0);
defineWord("cut", 0b01000001, 114, 0);
defineWord("cage", 0b10000000, 0, 0);
defineWord("call", 0b01000001, 220, 0);
defineWord("canvas", 0b00100010, 193, 0);
defineWord("can", 0b10000000, 0, 0);
defineWord("canal", 0b10100010, 43, 0);
defineWord("candy", 0b10000000, 0, 0);
defineWord("carry", 0b01000001, 101, 0);
defineWord("car", 0b10000000, 0, 0);
defineWord("cardboard", 0b00100010, 130, 0);
defineWord("cast", 0b01000001, 219, 0);
defineWord("cat", 0b10000000, 0, 0);
defineWord("catch", 0b01000001, 218, 0);
defineWord("cackle", 0b01000001, 169, 0);
defineWord("defecate", 0b01000001, 121, 0);
defineWord("deflate", 0b01100001, 206, 150);
defineWord("degree", 0b00100010, 92, 0);
defineWord("demoli", 0b01000001, 205, 0);
defineWord("depart", 0b01000001, 194, 0);
defineWord("destro", 0b01000001, 205, 0);
defineWord("descen", 0b01000001, 204, 0);
defineWord("describe", 0b01000001, 195, 0);
defineWord("device", 0b10000000, 0, 0);
defineWord("devour", 0b01000001, 198, 0);
defineWord("deactivate", 0b01000001, 193, 0);
defineWord("dead", 0b00100010, 127, 0);
defineWord("debark", 0b01000001, 202, 0);
defineWord("decipher", 0b01000001, 207, 0);
defineWord("decode", 0b01000001, 207, 0);
defineWord("differ", 0b00100010, 90, 0);
defineWord("dig", 0b01000001, 203, 0);
defineWord("direct", 0b10000000, 0, 0);
defineWord("dirigible", 0b10000000, 0, 0);
defineWord("dirty", 0b00100010, 135, 0);
defineWord("disembark", 0b01000001, 202, 0);
defineWord("dismount", 0b01000001, 202, 0);
defineWord("discarded", 0b00100010, 234, 0);
defineWord("dive", 0b01000001, 176, 0);
defineWord("divan", 0b10000000, 0, 0);
defineWord("diagnose", 0b01000001, 249, 0);
defineWord("dial", 0b11000001, 92, 0);
defineWord("don", 0b01000001, 80, 0);
defineWord("donate", 0b01000001, 184, 0);
defineWord("doorstep", 0b10000000, 0, 0);
defineWord("door", 0b10000000, 0, 0);
defineWord("douglas", 0b00100010, 223, 0);
defineWord("downstairs", 0b00011011, 21, 244);
defineWord("down", 0b00011011, 21, 244);
defineWord("doze", 0b01000001, 115, 0);
defineWord("dock", 0b11000001, 170, 0);
defineWord("dresse", 0b00001000, 229, 0);
defineWord("dress", 0b01000001, 201, 0);
defineWord("drink", 0b11000001, 200, 0);
defineWord("drop", 0b01000001, 199, 0);
defineWord("drowsy", 0b00100010, 129, 0);
defineWord("drunk", 0b00001000, 224, 0);
defineWord("dump", 0b01000001, 199, 0);
defineWord("dunes", 0b10000000, 0, 0);
defineWord("dune", 0b10000000, 0, 0);
defineWord("duper", 0b00100010, 250, 0);
defineWord("dust", 0b10000000, 0, 0);
defineWord("dubious", 0b00100010, 80, 0);
defineWord("d", 0b00011011, 21, 244);
defineWord("damned", 0b00000100, 0, 0);
defineWord("damn", 0b00000100, 0, 0);
defineWord("damage", 0b01000001, 205, 0);
defineWord("dark", 0b00100010, 44, 0);
defineWord("daughter", 0b10100010, 15, 0);

/** Dictionary words referred to by the code (,W?FOO). */
export const W = {
  A: word("a"),
  AGAIN: word("again"),
  ALL: word("all"),
  AN: word("an"),
  AND: word("and"),
  ANSWER: word("answer"),
  ASS: word("ass"),
  ASSASSIN: word("assassin"),
  ASSHOLE: word("asshole"),
  ATTACH: word("attach"),
  "BABY'S": word("baby's"),
  BACK: word("back"),
  BALLS: word("balls"),
  BARTENDER: word("bartender"),
  BASTARD: word("bastard"),
  BIKINI: word("bikini"),
  BITCH: word("bitch"),
  BODY: word("body"),
  BOO: word("boo"),
  BOSOM: word("bosom"),
  BOTH: word("both"),
  BOW: word("bow"),
  BREAST: word("breast"),
  BUT: word("but"),
  CAGE: word("cage"),
  CHASE: word("chase"),
  CLEVELAND: word("cleveland"),
  COCK: word("cock"),
  COCKSU: word("cocksu"),
  COIN: word("coin"),
  COMMA: word(","),
  CONTROL: word("control"),
  COUCHMATE: word("couchmate"),
  CREAM: word("cream"),
  CUNT: word("cunt"),
  DAMN: word("damn"),
  DAMNED: word("damned"),
  DAUGHTER: word("daughter"),
  DESCRIBE: word("describe"),
  EACH: word("each"),
  EAR: word("ear"),
  EARS: word("ears"),
  ELYSIA: word("elysia"),
  ELYSIUM: word("elysium"),
  ENGRAV: word("engrav"),
  EVERYT: word("everyt"),
  EXCEPT: word("except"),
  EYE: word("eye"),
  EYES: word("eyes"),
  FINGER: word("finger"),
  FORD: word("ford"),
  FUCK: word("fuck"),
  FUCKED: word("fucked"),
  FUCKING: word("fucking"),
  G: word("g"),
  GET: word("get"),
  GIDDAP: word("giddap"),
  GIDDYAP: word("giddyap"),
  GO: word("go"),
  GODDESSES: word("goddesses"),
  GORILLA: word("gorilla"),
  GUARD: word("guard"),
  HAND: word("hand"),
  HANDS: word("hands"),
  HEAD: word("head"),
  HER: word("her"),
  HERSELF: word("herself"),
  HIM: word("him"),
  HIMSELF: word("himself"),
  HIS: word("his"),
  HOLD: word("hold"),
  HOLE: word("hole"),
  HURL: word("hurl"),
  HUSBAND: word("husband"),
  I: word("i"),
  IT: word("it"),
  ITSELF: word("itself"),
  JAR: word("jar"),
  "KING'S": word("king's"),
  KNEE: word("knee"),
  KNEECAP: word("kneecap"),
  KNEES: word("knees"),
  KWEEPA: word("kweepa"),
  LIP: word("lip"),
  LIPS: word("lips"),
  LOINCLOTH: word("loincloth"),
  LOVE: word("love"),
  MAN: word("man"),
  "MAN'S": word("man's"),
  ME: word("me"),
  MITRE: word("mitre"),
  MONKEY: word("monkey"),
  MOUTH: word("mouth"),
  MOVE: word("move"),
  MY: word("my"),
  MYSELF: word("myself"),
  N: word("n"),
  NAH: word("nah"),
  NARROW: word("narrow"),
  NO: word("no"),
  NOPE: word("nope"),
  NOSE: word("nose"),
  NOSTRIL: word("nostril"),
  NUMBER: word("number"),
  ODOR: word("odor"),
  OF: word("of"),
  OK: word("ok"),
  OKAY: word("okay"),
  ONE: word("one"),
  OOPS: word("oops"),
  ORANGE: word("orange"),
  OTHER: word("other"),
  OUT: word("out"),
  OWNER: word("owner"),
  PALM: word("palm"),
  PENIS: word("penis"),
  PERIOD: word("."),
  PRINCE: word("prince"),
  PROPRIETOR: word("proprietor"),
  PULL: word("pull"),
  PURPLE: word("purple"),
  PUSSY: word("pussy"),
  Q: word("q"),
  QUIT: word("quit"),
  QUOTE: word("\""),
  RESTAR: word("restar"),
  RESTOR: word("restor"),
  RETURN: word("return"),
  RIDDLE: word("riddle"),
  RIDE: word("ride"),
  ROBOT: word("robot"),
  ROPE: word("rope"),
  SALESMAN: word("salesman"),
  SCAT: word("scat"),
  SCENT: word("scent"),
  SCIENTIST: word("scientist"),
  SCRAM: word("scram"),
  SEX: word("sex"),
  SHAPE: word("shape"),
  SHIT: word("shit"),
  SHITHEAD: word("shithead"),
  SHOO: word("shoo"),
  SMELL: word("smell"),
  SPREAD: word("spread"),
  STAIN: word("stain"),
  STRAP: word("strap"),
  STRAPS: word("straps"),
  STRIKE: word("strike"),
  SULTAN: word("sultan"),
  SURE: word("sure"),
  SWORD: word("sword"),
  TAKE: word("take"),
  THE: word("the"),
  THEM: word("them"),
  THEN: word("then"),
  THETA: word("theta"),
  THORBAST: word("thorbast"),
  THROW: word("throw"),
  TIE: word("tie"),
  TIFF: word("tiff"),
  "TIFF'S": word("tiff's"),
  TIFFAN: word("tiffan"),
  TIT: word("tit"),
  TITS: word("tits"),
  TO: word("to"),
  TOSS: word("toss"),
  TRENT: word("trent"),
  UH_UH: word("uh-uh"),
  VAGINA: word("vagina"),
  VENUS: word("venus"),
  WIDE: word("wide"),
  WIFE: word("wife"),
  "WIFE'S": word("wife's"),
  WOMAN: word("woman"),
  Y: word("y"),
  YES: word("yes"),
  YUP: word("yup"),
  ZZMGCK: word("zzmgck"),
} as const;

// ---------------------------------------------------------------------------
// MISC macros

/** VERB? */
export const verbIs = (...actions: number[]): boolean => eq(G.prsa, ...actions);
/** PRSO? */
export const prsoIs = (...xs: any[]): boolean => eq(G.prso, ...xs);
/** PRSI? */
export const prsiIs = (...xs: any[]): boolean => eq(G.prsi, ...xs);
/** ROOM? */
export const hereIs = (...xs: any[]): boolean => eq(G.here, ...xs);
