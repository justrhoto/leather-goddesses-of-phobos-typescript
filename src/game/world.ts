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

defineWord("egress", 0b10000000, 0, 0, 0x4883);
defineWord("eighty", 0b00100010, 94, 0, 0x488a);
defineWord("eighy", 0b00100010, 95, 0, 0x4891);
defineWord("ejaculate", 0b01000001, 212, 0, 0x4898);
defineWord("elysium", 0b10100010, 20, 0, 0x48a6);
defineWord("elysia", 0b10100010, 19, 0, 0x489f);
defineWord("empty", 0b01100001, 197, 238, 0x48ad);
defineWord("engrav", 0b10000000, 0, 0, 0x48c2);
defineWord("entertain", 0b01000001, 217, 0, 0x48d0);
defineWord("enter", 0b01000001, 196, 0, 0x48c9);
defineWord("enchanted", 0b00100010, 98, 0, 0x48b4);
defineWord("end", 0b10000000, 0, 0, 0x48bb);
defineWord("everyt", 0b00000100, 0, 0, 0x48d7);
defineWord("exit", 0b11000001, 194, 0, 0x48fa);
defineWord("extinguish", 0b01000001, 193, 0, 0x4901);
defineWord("examine", 0b01000001, 195, 0, 0x48de);
defineWord("except", 0b00000100, 0, 0, 0x48e5);
defineWord("exchange", 0b01000001, 228, 0, 0x48ec);
defineWord("excite", 0b01000001, 106, 0, 0x48f3);
defineWord("eyes", 0b10000000, 0, 0, 0x4916);
defineWord("eye", 0b10000000, 0, 0, 0x4908);
defineWord("eyed", 0b00100010, 218, 0, 0x490f);
defineWord("e", 0b00110011, 28, 26, 0x4859);
defineWord("ears", 0b10000000, 0, 0, 0x486e);
defineWord("ear", 0b10000000, 0, 0, 0x4867);
defineWord("east", 0b00110011, 28, 26, 0x4875);
defineWord("eat", 0b01000001, 198, 0, 0x487c);
defineWord("each", 0b00100010, 35, 0, 0x4860);
defineWord("feel", 0b01000001, 93, 0, 0x4940);
defineWord("feed", 0b01000001, 192, 0, 0x4939);
defineWord("female", 0b00100010, 179, 0, 0x4947);
defineWord("fence", 0b10000000, 0, 0, 0x494e);
defineWord("fight", 0b01000001, 229, 0, 0x4955);
defineWord("figure", 0b10000000, 0, 0, 0x495c);
defineWord("fill", 0b01000001, 191, 0, 0x4963);
defineWord("filthy", 0b00100010, 76, 0, 0x496a);
defineWord("finger", 0b10000000, 0, 0, 0x4978);
defineWord("find", 0b01000001, 190, 0, 0x4971);
defineWord("first", 0b00100010, 180, 0, 0x497f);
defineWord("flexible", 0b00100010, 133, 0, 0x49a2);
defineWord("flip", 0b01000001, 92, 0, 0x49b0);
defineWord("flick", 0b01000001, 92, 0, 0x49a9);
defineWord("floor", 0b10000000, 0, 0, 0x49b7);
defineWord("flower", 0b10000000, 0, 0, 0x49be);
defineWord("flowing", 0b00100010, 87, 0, 0x49c5);
defineWord("flush", 0b01000001, 189, 0, 0x49cc);
defineWord("flytrap", 0b10000000, 0, 0, 0x49d3);
defineWord("flagship", 0b10000000, 0, 0, 0x498d);
defineWord("flag", 0b00100010, 209, 0, 0x4986);
defineWord("flashlight", 0b10000000, 0, 0, 0x499b);
defineWord("flash", 0b00100010, 71, 0, 0x4994);
defineWord("follow", 0b01000001, 188, 0, 0x49da);
defineWord("fondle", 0b01000001, 93, 0, 0x49e1);
defineWord("food", 0b10000000, 0, 0, 0x49e8);
defineWord("forlorn", 0b00100010, 128, 0, 0x49fd);
defineWord("fornicate", 0b01000001, 187, 0, 0x4a04);
defineWord("forty", 0b00100010, 91, 0, 0x4a0b);
defineWord("for", 0b00001000, 252, 0, 0x49ef);
defineWord("ford", 0b11100001, 208, 198, 0x49f6);
defineWord("foul", 0b00100010, 39, 0, 0x4a12);
defineWord("fountain", 0b10000000, 0, 0, 0x4a19);
defineWord("free", 0b01000001, 87, 0, 0x4a20);
defineWord("fresh", 0b00100010, 42, 0, 0x4a27);
defineWord("frog's", 0b00100010, 97, 0, 0x4a35);
defineWord("frog", 0b10000000, 0, 0, 0x4a2e);
defineWord("from", 0b00001000, 247, 0, 0x4a3c);
defineWord("front", 0b00100010, 64, 0, 0x4a43);
defineWord("fucked", 0b00000100, 0, 0, 0x4a51);
defineWord("fucking", 0b00000100, 0, 0, 0x4a58);
defineWord("fuck", 0b01000001, 187, 0, 0x4a4a);
defineWord("fairbanks", 0b10000000, 0, 0, 0x4924);
defineWord("familiar", 0b00100010, 38, 0, 0x492b);
defineWord("fasten", 0b01000001, 94, 0, 0x4932);
defineWord("faded", 0b00100010, 55, 0, 0x491d);
defineWord("gents", 0b00100010, 75, 0, 0x4a6d);
defineWord("gent's", 0b00100010, 73, 0, 0x4a66);
defineWord("get", 0b01000001, 101, 0, 0x4a74);
defineWord("gigantic", 0b00100010, 1, 0, 0x4a90);
defineWord("give", 0b01000001, 184, 0, 0x4a97);
defineWord("giant", 0b00100010, 1, 0, 0x4a7b);
defineWord("giddyap", 0b01000001, 186, 0, 0x4a89);
defineWord("giddap", 0b01000001, 186, 0, 0x4a82);
defineWord("gleaming", 0b00100010, 235, 0, 0x4aa5);
defineWord("glint", 0b10000000, 0, 0, 0x4aac);
defineWord("glistening", 0b00100010, 201, 0, 0x4ab3);
defineWord("gloss", 0b10000000, 0, 0, 0x4aba);
defineWord("glass", 0b10100010, 59, 0, 0x4a9e);
defineWord("golden", 0b00100010, 86, 0, 0x4add);
defineWord("gold", 0b00100010, 96, 0, 0x4ad6);
defineWord("gondola", 0b10000000, 0, 0, 0x4ae4);
defineWord("gorilla", 0b10100010, 9, 0, 0x4aeb);
defineWord("gown", 0b10000000, 0, 0, 0x4af2);
defineWord("go", 0b01001001, 185, 232, 0x4ac1);
defineWord("gobble", 0b01000001, 198, 0, 0x4ac8);
defineWord("goddesses", 0b10100010, 5, 0, 0x4acf);
defineWord("green", 0b00100010, 99, 0, 0x4b00);
defineWord("grimy", 0b00100010, 61, 0, 0x4b07);
defineWord("ground", 0b10000000, 0, 0, 0x4b0e);
defineWord("grab", 0b01000001, 101, 0, 0x4af9);
defineWord("guess", 0b01000001, 234, 0, 0x4b1c);
defineWord("guard", 0b10100010, 13, 0, 0x4b15);
defineWord("g", 0b00000100, 0, 0, 0x4a5f);
defineWord("hello", 0b01000001, 182, 0, 0x4b85);
defineWord("help", 0b01000001, 181, 0, 0x4b8c);
defineWord("here", 0b00000100, 0, 0, 0x4b9a);
defineWord("herself", 0b10000000, 0, 0, 0x4ba1);
defineWord("her", 0b10100010, 214, 0, 0x4b93);
defineWord("hear", 0b01000001, 183, 0, 0x4b7e);
defineWord("headlight", 0b10000000, 0, 0, 0x4b70);
defineWord("heady", 0b00100010, 40, 0, 0x4b77);
defineWord("head", 0b10100010, 199, 0, 0x4b69);
defineWord("himself", 0b10000000, 0, 0, 0x4bbd);
defineWord("him", 0b10000000, 0, 0, 0x4bb6);
defineWord("hints", 0b01000001, 181, 0, 0x4bcb);
defineWord("hint", 0b01000001, 181, 0, 0x4bc4);
defineWord("hiss", 0b01000001, 179, 0, 0x4bd9);
defineWord("his", 0b00100010, 89, 0, 0x4bd2);
defineWord("hit", 0b01000001, 229, 0, 0x4be0);
defineWord("hi", 0b01000001, 182, 0, 0x4ba8);
defineWord("hide", 0b01000001, 180, 0, 0x4baf);
defineWord("hole", 0b10000000, 0, 0, 0x4bee);
defineWord("hold", 0b01000001, 101, 0, 0x4be7);
defineWord("home", 0b10000000, 0, 0, 0x4bf5);
defineWord("hop", 0b01000001, 116, 0, 0x4bfc);
defineWord("horse", 0b10000000, 0, 0, 0x4c03);
defineWord("hose", 0b10000000, 0, 0, 0x4c0a);
defineWord("household", 0b00100010, 101, 0, 0x4c18);
defineWord("house", 0b10000000, 0, 0, 0x4c11);
defineWord("huger", 0b00100010, 1, 0, 0x4c26);
defineWord("huge", 0b00100010, 1, 0, 0x4c1f);
defineWord("hump", 0b01000001, 187, 0, 0x4c34);
defineWord("humanoid", 0b00100010, 220, 0, 0x4c2d);
defineWord("hunk", 0b10000000, 0, 0, 0x4c3b);
defineWord("hurl", 0b01000001, 95, 0, 0x4c42);
defineWord("husband", 0b10100010, 33, 0, 0x4c49);
defineWord("hair", 0b10000000, 0, 0, 0x4b23);
defineWord("handset", 0b10000000, 0, 0, 0x4b38);
defineWord("hands", 0b10000000, 0, 0, 0x4b31);
defineWord("hand", 0b11000001, 184, 0, 0x4b2a);
defineWord("happy", 0b00001000, 231, 0, 0x4b3f);
defineWord("harem", 0b10100010, 141, 0, 0x4b4d);
defineWord("harlow", 0b10000000, 0, 0, 0x4b54);
defineWord("hard", 0b00001000, 248, 0, 0x4b46);
defineWord("hatchway", 0b10000000, 0, 0, 0x4b62);
defineWord("hatch", 0b10000000, 0, 0, 0x4b5b);
defineWord("igloo", 0b10100010, 161, 0, 0x4c57);
defineWord("impassable", 0b00100010, 114, 0, 0x4c5e);
defineWord("inflate", 0b01000001, 178, 0, 0x4c73);
defineWord("infant", 0b10100010, 158, 0, 0x4c6c);
defineWord("ingest", 0b01000001, 198, 0, 0x4c7a);
defineWord("insert", 0b01000001, 107, 0, 0x4c81);
defineWord("inside", 0b00001000, 245, 0, 0x4c88);
defineWord("inspect", 0b01000001, 195, 0, 0x4c8f);
defineWord("into", 0b00001000, 245, 0, 0x4c96);
defineWord("invent", 0b01000001, 248, 0, 0x4c9d);
defineWord("in", 0b00011011, 20, 245, 0x4c65);
defineWord("is", 0b00000100, 0, 0, 0x4ca4);
defineWord("itself", 0b10000000, 0, 0, 0x4cb2);
defineWord("it", 0b10000000, 0, 0, 0x4cab);
defineWord("i", 0b11000001, 248, 0, 0x4c50);
defineWord("jerk", 0b01000001, 177, 0, 0x4cce);
defineWord("jean", 0b00100010, 222, 0, 0x4cc7);
defineWord("joe", 0b10000000, 0, 0, 0x4cdc);
defineWord("jockstrap", 0b10000000, 0, 0, 0x4cd5);
defineWord("jump", 0b01000001, 176, 0, 0x4ce3);
defineWord("jar", 0b10000000, 0, 0, 0x4cc0);
defineWord("jack", 0b01000001, 177, 0, 0x4cb9);
defineWord("kill", 0b01000001, 229, 0, 0x4cf1);
defineWord("king's", 0b00100010, 85, 0, 0x4cff);
defineWord("king", 0b10100010, 88, 0, 0x4cf8);
defineWord("kiss", 0b01000001, 174, 0, 0x4d06);
defineWord("kick", 0b01000001, 175, 0, 0x4cea);
defineWord("kneel", 0b01000001, 173, 0, 0x4d1b);
defineWord("knees", 0b10000000, 0, 0, 0x4d22);
defineWord("knee", 0b10000000, 0, 0, 0x4d0d);
defineWord("kneecap", 0b10000000, 0, 0, 0x4d14);
defineWord("knob", 0b10000000, 0, 0, 0x4d29);
defineWord("knock", 0b01000001, 172, 0, 0x4d30);
defineWord("kweepa", 0b01000001, 171, 0, 0x4d37);
defineWord("lettuce", 0b10000000, 0, 0, 0x4dd1);
defineWord("let", 0b01000001, 165, 0, 0x4dca);
defineWord("lewd", 0b01000001, 250, 0, 0x4dd8);
defineWord("leaf", 0b10000000, 0, 0, 0x4d92);
defineWord("leak", 0b01001000, 226, 145, 0x4d99);
defineWord("lean", 0b01000001, 167, 0, 0x4da0);
defineWord("leap", 0b01000001, 176, 0, 0x4da7);
defineWord("leather", 0b00100010, 247, 0, 0x4dae);
defineWord("leaves", 0b10000000, 0, 0, 0x4dbc);
defineWord("leave", 0b01000001, 166, 0, 0x4db5);
defineWord("lead", 0b01000001, 150, 0, 0x4d8b);
defineWord("ledge", 0b10000000, 0, 0, 0x4dc3);
defineWord("lie", 0b01000001, 163, 0, 0x4de6);
defineWord("liferaft", 0b10000000, 0, 0, 0x4df4);
defineWord("life", 0b00100010, 152, 0, 0x4ded);
defineWord("lift", 0b01000001, 137, 0, 0x4dfb);
defineWord("light", 0b11000001, 162, 0, 0x4e09);
defineWord("ligh", 0b10000000, 0, 0, 0x4e02);
defineWord("limber", 0b01000001, 161, 0, 0x4e10);
defineWord("lips", 0b10000000, 0, 0, 0x4e1e);
defineWord("lip", 0b10100010, 122, 0, 0x4e17);
defineWord("listen", 0b01000001, 160, 0, 0x4e25);
defineWord("little", 0b00100010, 3, 0, 0x4e2c);
defineWord("lick", 0b01000001, 164, 0, 0x4ddf);
defineWord("loincloth", 0b10000000, 0, 0, 0x4e41);
defineWord("long", 0b00100010, 207, 0, 0x4e48);
defineWord("look", 0b01000001, 158, 0, 0x4e4f);
defineWord("looming", 0b00100010, 120, 0, 0x4e56);
defineWord("lotion", 0b10000000, 0, 0, 0x4e5d);
defineWord("love", 0b11000001, 157, 0, 0x4e64);
defineWord("lower", 0b01000001, 156, 0, 0x4e6b);
defineWord("lock", 0b01000001, 159, 0, 0x4e3a);
defineWord("locati", 0b10000000, 0, 0, 0x4e33);
defineWord("luscious", 0b00100010, 230, 0, 0x4e72);
defineWord("l", 0b01000001, 158, 0, 0x4d3e);
defineWord("land", 0b01000001, 170, 0, 0x4d53);
defineWord("larger", 0b00100010, 1, 0, 0x4d61);
defineWord("large", 0b00100010, 1, 0, 0x4d5a);
defineWord("laugh", 0b01000001, 169, 0, 0x4d68);
defineWord("launch", 0b01000001, 168, 0, 0x4d6f);
defineWord("laundry", 0b10000000, 0, 0, 0x4d76);
defineWord("lawn", 0b10000000, 0, 0, 0x4d7d);
defineWord("lay", 0b01000001, 187, 0, 0x4d84);
defineWord("ladies", 0b00100010, 77, 0, 0x4d4c);
defineWord("ladder", 0b10000000, 0, 0, 0x4d45);
defineWord("mens", 0b00100010, 74, 0, 0x4f21);
defineWord("men's", 0b00100010, 72, 0, 0x4f1a);
defineWord("message", 0b10000000, 0, 0, 0x4f28);
defineWord("metallic", 0b00100010, 118, 0, 0x4f36);
defineWord("metal", 0b00100010, 117, 0, 0x4f2f);
defineWord("me", 0b10000000, 0, 0, 0x4f0c);
defineWord("measure", 0b01000001, 152, 0, 0x4f13);
defineWord("mightier", 0b00100010, 1, 0, 0x4f3d);
defineWord("mighty", 0b00100010, 1, 0, 0x4f44);
defineWord("milk", 0b00100010, 231, 0, 0x4f4b);
defineWord("mine", 0b00100010, 4, 0, 0x4f59);
defineWord("minaret", 0b10000000, 0, 0, 0x4f52);
defineWord("mirage", 0b10000000, 0, 0, 0x4f60);
defineWord("mitre", 0b10100010, 84, 0, 0x4f67);
defineWord("mixer", 0b10000000, 0, 0, 0x4f6e);
defineWord("money", 0b10000000, 0, 0, 0x4f7c);
defineWord("monkey", 0b10100010, 10, 0, 0x4f83);
defineWord("monster", 0b10000000, 0, 0, 0x4f8a);
defineWord("moor", 0b01000001, 170, 0, 0x4f91);
defineWord("more", 0b00000100, 0, 0, 0x4f98);
defineWord("moth", 0b00100010, 237, 0, 0x4f9f);
defineWord("mothball", 0b10000000, 0, 0, 0x4fa6);
defineWord("mount", 0b11000001, 224, 0, 0x4fad);
defineWord("mouse", 0b10000000, 0, 0, 0x4fb4);
defineWord("mouth", 0b10000000, 0, 0, 0x4fbb);
defineWord("move", 0b01000001, 150, 0, 0x4fc2);
defineWord("moan", 0b01000001, 151, 0, 0x4f75);
defineWord("mug", 0b10000000, 0, 0, 0x4fc9);
defineWord("murder", 0b01000001, 229, 0, 0x4fd0);
defineWord("myself", 0b10000000, 0, 0, 0x4fde);
defineWord("my", 0b00100010, 4, 0, 0x4fd7);
defineWord("magnificent", 0b00100010, 202, 0, 0x4e95);
defineWord("mailing", 0b00100010, 131, 0, 0x4e9c);
defineWord("make", 0b01000001, 155, 0, 0x4ea3);
defineWord("male", 0b00100010, 177, 0, 0x4eaa);
defineWord("man's", 0b00100010, 21, 0, 0x4eb8);
defineWord("man", 0b10000000, 0, 0, 0x4eb1);
defineWord("map", 0b10000000, 0, 0, 0x4ebf);
defineWord("marry", 0b01000001, 154, 0, 0x4ec6);
defineWord("marsmid", 0b10100010, 191, 0, 0x4ecd);
defineWord("marsmouse", 0b10000000, 0, 0, 0x4ed4);
defineWord("martian", 0b00100010, 107, 0, 0x4edb);
defineWord("massive", 0b00100010, 1, 0, 0x4ee9);
defineWord("mass", 0b10000000, 0, 0, 0x4ee2);
defineWord("masturbate", 0b01000001, 153, 0, 0x4ef0);
defineWord("matches", 0b00100010, 242, 0, 0x4f05);
defineWord("match", 0b00100010, 239, 0, 0x4ef7);
defineWord("matchbook", 0b10100010, 241, 0, 0x4efe);
defineWord("machine", 0b10000000, 0, 0, 0x4e87);
defineWord("mach", 0b00100010, 240, 0, 0x4e79);
defineWord("machbook", 0b10000000, 0, 0, 0x4e80);
defineWord("mad", 0b00100010, 52, 0, 0x4e8e);
defineWord("ne", 0b00110011, 29, 29, 0x5001);
defineWord("near", 0b00001000, 240, 0, 0x5008);
defineWord("nibble", 0b01000001, 98, 0, 0x500f);
defineWord("nope", 0b01000001, 149, 0, 0x501d);
defineWord("northe", 0b00110011, 29, 29, 0x502b);
defineWord("northwest", 0b00110011, 23, 28, 0x5032);
defineWord("north", 0b00110011, 30, 24, 0x5024);
defineWord("nose", 0b10000000, 0, 0, 0x5039);
defineWord("nostril", 0b10000000, 0, 0, 0x5040);
defineWord("notes", 0b00100010, 244, 0, 0x504e);
defineWord("notati", 0b00100010, 245, 0, 0x5047);
defineWord("no", 0b01000001, 149, 0, 0x5016);
defineWord("number", 0b10100010, 93, 0, 0x5055);
defineWord("nurse", 0b01000001, 104, 0, 0x505c);
defineWord("nw", 0b00110011, 23, 28, 0x5063);
defineWord("n", 0b00110011, 30, 24, 0x4fe5);
defineWord("nah", 0b01000001, 149, 0, 0x4fec);
defineWord("nap", 0b11000001, 115, 0, 0x4ff3);
defineWord("narrow", 0b00100010, 132, 0, 0x4ffa);
defineWord("offer", 0b01000001, 184, 0, 0x5094);
defineWord("off", 0b00001000, 246, 0, 0x508d);
defineWord("of", 0b00000100, 0, 0, 0x5086);
defineWord("ointment", 0b10000000, 0, 0, 0x509b);
defineWord("ok", 0b01000001, 74, 0, 0x50a2);
defineWord("okay", 0b01000001, 74, 0, 0x50a9);
defineWord("one", 0b00100010, 192, 0, 0x50b7);
defineWord("onto", 0b00001000, 253, 0, 0x50be);
defineWord("on", 0b00001000, 253, 0, 0x50b0);
defineWord("oops", 0b00000100, 0, 0, 0x50c5);
defineWord("open", 0b01000001, 148, 0, 0x50cc);
defineWord("orphanage", 0b10100010, 162, 0, 0x50e8);
defineWord("orange", 0b00100010, 105, 0, 0x50d3);
defineWord("orch", 0b10000000, 0, 0, 0x50da);
defineWord("order", 0b01000001, 221, 0, 0x50e1);
defineWord("other", 0b10100010, 178, 0, 0x50ef);
defineWord("outside", 0b00001000, 249, 0, 0x50fd);
defineWord("out", 0b00011011, 19, 249, 0x50f6);
defineWord("over", 0b00001000, 243, 0, 0x5104);
defineWord("overall", 0b10000000, 0, 0, 0x510b);
defineWord("owner", 0b10100010, 12, 0, 0x5112);
defineWord("oasis", 0b10000000, 0, 0, 0x506a);
defineWord("observe", 0b01000001, 195, 0, 0x5071);
defineWord("odor", 0b10000000, 0, 0, 0x507f);
defineWord("odd", 0b00100010, 170, 0, 0x5078);
defineWord("pee-pee", 0b01000001, 145, 0, 0x5166);
defineWord("pee", 0b01000001, 145, 0, 0x515f);
defineWord("penguin", 0b10000000, 0, 0, 0x516d);
defineWord("penis", 0b10000000, 0, 0, 0x5174);
defineWord("petite", 0b00100010, 3, 0, 0x5182);
defineWord("pet", 0b01000001, 93, 0, 0x517b);
defineWord("phone", 0b01100001, 144, 148, 0x5190);
defineWord("phoneb", 0b10000000, 0, 0, 0x5197);
defineWord("phoo", 0b00100010, 224, 0, 0x519e);
defineWord("photo", 0b10000000, 0, 0, 0x51a5);
defineWord("phobos", 0b10000000, 0, 0, 0x5189);
defineWord("pier", 0b10000000, 0, 0, 0x51cf);
defineWord("pie", 0b10000000, 0, 0, 0x51c1);
defineWord("piece", 0b10000000, 0, 0, 0x51c8);
defineWord("pile", 0b10000000, 0, 0, 0x51d6);
defineWord("pin", 0b11000001, 142, 0, 0x51dd);
defineWord("piss", 0b01001000, 227, 145, 0x51e4);
defineWord("pizza", 0b10000000, 0, 0, 0x51eb);
defineWord("pick", 0b01000001, 143, 0, 0x51ac);
defineWord("picture", 0b10000000, 0, 0, 0x51b3);
defineWord("piddle", 0b01000001, 145, 0, 0x51ba);
defineWord("please", 0b00000100, 0, 0, 0x520e);
defineWord("pleasant", 0b00100010, 41, 0, 0x5207);
defineWord("plug", 0b01000001, 210, 0, 0x5215);
defineWord("plush", 0b00100010, 246, 0, 0x521c);
defineWord("plastic", 0b00100010, 53, 0, 0x51f9);
defineWord("play", 0b01000001, 141, 0, 0x5200);
defineWord("place", 0b11000001, 107, 0, 0x51f2);
defineWord("pointed", 0b00100010, 215, 0, 0x5231);
defineWord("point", 0b01000001, 140, 0, 0x522a);
defineWord("poke", 0b01000001, 93, 0, 0x5238);
defineWord("pool", 0b10000000, 0, 0, 0x5246);
defineWord("poo-poo", 0b01000001, 121, 0, 0x523f);
defineWord("pop", 0b01000001, 206, 0, 0x524d);
defineWord("portable", 0b00100010, 134, 0, 0x5254);
defineWord("pounds", 0b00000100, 0, 0, 0x525b);
defineWord("pour", 0b01000001, 139, 0, 0x5262);
defineWord("power", 0b00100010, 119, 0, 0x5269);
defineWord("pocket", 0b10000000, 0, 0, 0x5223);
defineWord("press", 0b01000001, 138, 0, 0x5270);
defineWord("prince", 0b10100010, 14, 0, 0x5277);
defineWord("prison", 0b00100010, 226, 0, 0x527e);
defineWord("proprietor", 0b10100010, 11, 0, 0x528c);
defineWord("protag", 0b10000000, 0, 0, 0x5293);
defineWord("procee", 0b01000001, 82, 0, 0x5285);
defineWord("pry", 0b00000100, 0, 0, 0x529a);
defineWord("puke", 0b01000001, 85, 0, 0x52a1);
defineWord("pull", 0b01000001, 150, 0, 0x52a8);
defineWord("purple", 0b00100010, 106, 0, 0x52b6);
defineWord("pursue", 0b01000001, 188, 0, 0x52bd);
defineWord("purchase", 0b01000001, 221, 0, 0x52af);
defineWord("push", 0b01000001, 138, 0, 0x52c4);
defineWord("pussy", 0b10100010, 227, 0, 0x52cb);
defineWord("put", 0b01000001, 107, 0, 0x52d2);
defineWord("paining", 0b10000000, 0, 0, 0x5119);
defineWord("painting", 0b10000000, 0, 0, 0x5127);
defineWord("paint", 0b11000001, 110, 0, 0x5120);
defineWord("pair", 0b10000000, 0, 0, 0x512e);
defineWord("palm", 0b10000000, 0, 0, 0x5135);
defineWord("paper", 0b10000000, 0, 0, 0x513c);
defineWord("passenger", 0b00100010, 210, 0, 0x514a);
defineWord("pass", 0b01000001, 147, 0, 0x5143);
defineWord("pat", 0b01000001, 93, 0, 0x5151);
defineWord("pay", 0b01100001, 146, 188, 0x5158);
defineWord("quit", 0b01000001, 247, 0, 0x52e0);
defineWord("q", 0b01000001, 247, 0, 0x52d9);
defineWord("reflecting", 0b00100010, 48, 0, 0x5350);
defineWord("regurgitate", 0b01000001, 85, 0, 0x5357);
defineWord("relieve", 0b01000001, 132, 0, 0x5365);
defineWord("reliable", 0b00100010, 143, 0, 0x535e);
defineWord("rellis", 0b10000000, 0, 0, 0x536c);
defineWord("remove", 0b11000001, 131, 0, 0x5373);
defineWord("reply", 0b01000001, 234, 0, 0x537a);
defineWord("restor", 0b01000001, 245, 0, 0x538f);
defineWord("restroom", 0b10000000, 0, 0, 0x5396);
defineWord("restar", 0b01000001, 246, 0, 0x5388);
defineWord("rescue", 0b01000001, 244, 0, 0x5381);
defineWord("return", 0b01100001, 130, 189, 0x539d);
defineWord("rear", 0b00100010, 176, 0, 0x5334);
defineWord("reach", 0b01000001, 134, 0, 0x5326);
defineWord("read", 0b01000001, 133, 0, 0x532d);
defineWord("rectan", 0b00100010, 57, 0, 0x533b);
defineWord("red", 0b00100010, 54, 0, 0x5342);
defineWord("reddish", 0b00100010, 112, 0, 0x5349);
defineWord("rip", 0b01000001, 129, 0, 0x53b9);
defineWord("rise", 0b01000001, 109, 0, 0x53c0);
defineWord("rickety", 0b00100010, 51, 0, 0x53a4);
defineWord("ride", 0b01000001, 224, 0, 0x53b2);
defineWord("riddle", 0b10000000, 0, 0, 0x53ab);
defineWord("roll", 0b01000001, 128, 0, 0x53ea);
defineWord("roof", 0b10000000, 0, 0, 0x53f1);
defineWord("room", 0b10000000, 0, 0, 0x53f8);
defineWord("rope", 0b10000000, 0, 0, 0x53ff);
defineWord("rotate", 0b01000001, 92, 0, 0x5406);
defineWord("rouse", 0b01000001, 83, 0, 0x540d);
defineWord("royal", 0b00100010, 83, 0, 0x5414);
defineWord("robotic", 0b00100010, 160, 0, 0x53ce);
defineWord("robot", 0b10100010, 159, 0, 0x53c7);
defineWord("rocky", 0b00100010, 185, 0, 0x53e3);
defineWord("rock-a-bye", 0b01000001, 122, 0, 0x53dc);
defineWord("rock", 0b01000001, 122, 0, 0x53d5);
defineWord("rules", 0b10000000, 0, 0, 0x543e);
defineWord("rule", 0b00100010, 68, 0, 0x5437);
defineWord("rummag", 0b01000001, 123, 0, 0x5445);
defineWord("run", 0b01000001, 82, 0, 0x544c);
defineWord("rusted", 0b00100010, 121, 0, 0x5453);
defineWord("rubies", 0b10000000, 0, 0, 0x5429);
defineWord("ruby", 0b10000000, 0, 0, 0x5430);
defineWord("rub", 0b01000001, 127, 0, 0x541b);
defineWord("rubber", 0b00100010, 151, 0, 0x5422);
defineWord("raft", 0b10000000, 0, 0, 0x52f5);
defineWord("raf", 0b10000000, 0, 0, 0x52ee);
defineWord("ragged", 0b00100010, 156, 0, 0x52fc);
defineWord("raise", 0b01000001, 137, 0, 0x5303);
defineWord("rake", 0b11000001, 136, 0, 0x530a);
defineWord("rape", 0b01000001, 135, 0, 0x5318);
defineWord("rap", 0b01000001, 172, 0, 0x5311);
defineWord("ray", 0b10000000, 0, 0, 0x531f);
defineWord("rabbit", 0b10000000, 0, 0, 0x52e7);
defineWord("seek", 0b01000001, 190, 0, 0x551e);
defineWord("self", 0b10000000, 0, 0, 0x5525);
defineWord("sell", 0b01000001, 184, 0, 0x552c);
defineWord("set", 0b01000001, 92, 0, 0x5533);
defineWord("sex", 0b00000100, 0, 0, 0x553a);
defineWord("se", 0b00110011, 27, 31, 0x54ed);
defineWord("search", 0b01000001, 123, 0, 0x54f4);
defineWord("second", 0b00100010, 181, 0, 0x54fb);
defineWord("secret", 0b00100010, 145, 0, 0x5509);
defineWord("secre", 0b00100010, 146, 0, 0x5502);
defineWord("secure", 0b01000001, 94, 0, 0x5510);
defineWord("seduce", 0b01000001, 187, 0, 0x5517);
defineWord("sheet", 0b10000000, 0, 0, 0x5564);
defineWord("shee", 0b00100010, 196, 0, 0x555d);
defineWord("shelf", 0b10000000, 0, 0, 0x556b);
defineWord("shine", 0b01000001, 140, 0, 0x5572);
defineWord("ship", 0b10000000, 0, 0, 0x5579);
defineWord("shithead", 0b00000100, 0, 0, 0x5587);
defineWord("shitty", 0b00000100, 0, 0, 0x558e);
defineWord("shit", 0b01001001, 121, 225, 0x5580);
defineWord("shoo", 0b01000001, 125, 0, 0x5595);
defineWord("shop", 0b10000000, 0, 0, 0x559c);
defineWord("shout", 0b01000001, 75, 0, 0x55a3);
defineWord("show", 0b01000001, 120, 0, 0x55aa);
defineWord("shred", 0b01000001, 129, 0, 0x55b1);
defineWord("shut", 0b01000001, 213, 0, 0x55b8);
defineWord("shake", 0b01000001, 122, 0, 0x5548);
defineWord("shapes", 0b10000000, 0, 0, 0x5556);
defineWord("shape", 0b10100010, 6, 0, 0x554f);
defineWord("shadowy", 0b00100010, 212, 0, 0x5541);
defineWord("sigh", 0b01000001, 119, 0, 0x55cd);
defineWord("sign", 0b10000000, 0, 0, 0x55d4);
defineWord("simple", 0b00100010, 104, 0, 0x55db);
defineWord("sink", 0b11000001, 118, 0, 0x55e2);
defineWord("sip", 0b01000001, 200, 0, 0x55e9);
defineWord("sit", 0b01000001, 117, 0, 0x55f0);
defineWord("sick", 0b00100010, 123, 0, 0x55bf);
defineWord("sidle", 0b01000001, 82, 0, 0x55c6);
defineWord("skim", 0b01000001, 133, 0, 0x55f7);
defineWord("skip", 0b01000001, 116, 0, 0x55fe);
defineWord("sleep", 0b11000001, 115, 0, 0x561a);
defineWord("slender", 0b00100010, 139, 0, 0x5621);
defineWord("slice", 0b11000001, 114, 0, 0x5628);
defineWord("slide", 0b01000001, 113, 0, 0x562f);
defineWord("slot", 0b10000000, 0, 0, 0x5636);
defineWord("slap", 0b01000001, 229, 0, 0x560c);
defineWord("slay", 0b01000001, 229, 0, 0x5613);
defineWord("slab", 0b10000000, 0, 0, 0x5605);
defineWord("smell", 0b11000001, 111, 0, 0x5659);
defineWord("smear", 0b01000001, 112, 0, 0x5652);
defineWord("smaller", 0b00100010, 3, 0, 0x5644);
defineWord("small", 0b00100010, 3, 0, 0x563d);
defineWord("smash", 0b01000001, 205, 0, 0x564b);
defineWord("sniff", 0b01000001, 111, 0, 0x5667);
defineWord("snooze", 0b11000001, 115, 0, 0x566e);
defineWord("snap", 0b01000001, 77, 0, 0x5660);
defineWord("some", 0b00000100, 0, 0, 0x567c);
defineWord("sool", 0b10000000, 0, 0, 0x5683);
defineWord("southe", 0b00110011, 27, 31, 0x5691);
defineWord("southwest", 0b00110011, 25, 30, 0x5698);
defineWord("south", 0b00110011, 26, 25, 0x568a);
defineWord("sod", 0b10000000, 0, 0, 0x5675);
defineWord("speak", 0b01000001, 100, 0, 0x56ad);
defineWord("spill", 0b01000001, 139, 0, 0x56b4);
defineWord("spin", 0b01000001, 92, 0, 0x56bb);
defineWord("splattered", 0b00100010, 200, 0, 0x56c2);
defineWord("spread", 0b01000001, 227, 0, 0x56c9);
defineWord("spy", 0b10000000, 0, 0, 0x56d0);
defineWord("spaceship", 0b10000000, 0, 0, 0x56a6);
defineWord("space", 0b00100010, 208, 0, 0x569f);
defineWord("squid", 0b10000000, 0, 0, 0x56de);
defineWord("square", 0b00100010, 195, 0, 0x56d7);
defineWord("steer", 0b01000001, 92, 0, 0x5732);
defineWord("step", 0b11000001, 82, 0, 0x5739);
defineWord("stimulate", 0b01000001, 106, 0, 0x5747);
defineWord("stick", 0b11000001, 107, 0, 0x5740);
defineWord("stone", 0b00100010, 138, 0, 0x574e);
defineWord("stool", 0b10000000, 0, 0, 0x5755);
defineWord("stoop", 0b10000000, 0, 0, 0x575c);
defineWord("store", 0b10000000, 0, 0, 0x5763);
defineWord("stretch", 0b01000001, 161, 0, 0x577f);
defineWord("strike", 0b01000001, 229, 0, 0x5786);
defineWord("strips", 0b10000000, 0, 0, 0x5794);
defineWord("strip", 0b01000001, 90, 0, 0x578d);
defineWord("stroke", 0b01000001, 93, 0, 0x579b);
defineWord("strong", 0b00100010, 37, 0, 0x57a2);
defineWord("structure", 0b10000000, 0, 0, 0x57a9);
defineWord("strange", 0b00100010, 124, 0, 0x576a);
defineWord("straps", 0b10000000, 0, 0, 0x5778);
defineWord("strap", 0b11000001, 94, 0, 0x5771);
defineWord("stuff", 0b01000001, 107, 0, 0x57be);
defineWord("study", 0b01000001, 195, 0, 0x57b7);
defineWord("stud", 0b10000000, 0, 0, 0x57b0);
defineWord("stagnant", 0b00100010, 46, 0, 0x56ec);
defineWord("stained", 0b00100010, 58, 0, 0x56fa);
defineWord("stain", 0b11000001, 110, 0, 0x56f3);
defineWord("stairs", 0b10000000, 0, 0, 0x5708);
defineWord("stairw", 0b10000000, 0, 0, 0x570f);
defineWord("stair", 0b10000000, 0, 0, 0x5701);
defineWord("stallion", 0b10000000, 0, 0, 0x5716);
defineWord("stand", 0b01000001, 109, 0, 0x571d);
defineWord("start", 0b01000001, 108, 0, 0x5724);
defineWord("status", 0b01000001, 243, 0, 0x572b);
defineWord("stab", 0b01000001, 229, 0, 0x56e5);
defineWord("suggestive", 0b01000001, 251, 0, 0x57d3);
defineWord("suit", 0b10000000, 0, 0, 0x57e1);
defineWord("sui", 0b10000000, 0, 0, 0x57da);
defineWord("sultan", 0b10100010, 142, 0, 0x57e8);
defineWord("super", 0b01100001, 253, 249, 0x57ef);
defineWord("superbrief", 0b01000001, 253, 0, 0x57f6);
defineWord("sure", 0b01000001, 74, 0, 0x57fd);
defineWord("suckle", 0b01000001, 104, 0, 0x57cc);
defineWord("suck", 0b01000001, 105, 0, 0x57c5);
defineWord("swim", 0b01000001, 103, 0, 0x5820);
defineWord("swing", 0b01000001, 102, 0, 0x5827);
defineWord("switch", 0b11000001, 92, 0, 0x582e);
defineWord("swords", 0b10000000, 0, 0, 0x583c);
defineWord("sword", 0b10000000, 0, 0, 0x5835);
defineWord("sw", 0b00110011, 25, 30, 0x5804);
defineWord("swallow", 0b01000001, 200, 0, 0x580b);
defineWord("swap", 0b01000001, 228, 0, 0x5812);
defineWord("swaying", 0b00100010, 116, 0, 0x5819);
defineWord("s", 0b00110011, 26, 25, 0x545a);
defineWord("sain", 0b10000000, 0, 0, 0x5468);
defineWord("salesman", 0b10100010, 7, 0, 0x5476);
defineWord("sales", 0b00100010, 169, 0, 0x546f);
defineWord("sand-covered", 0b00100010, 108, 0, 0x5484);
defineWord("sand", 0b10100010, 111, 0, 0x547d);
defineWord("save", 0b01000001, 244, 0, 0x548b);
defineWord("say", 0b01000001, 126, 0, 0x5492);
defineWord("sack", 0b10000000, 0, 0, 0x5461);
defineWord("scent", 0b10000000, 0, 0, 0x54a7);
defineWord("scientist", 0b10100010, 8, 0, 0x54ae);
defineWord("score", 0b01000001, 124, 0, 0x54b5);
defineWord("screw", 0b01000001, 187, 0, 0x54d8);
defineWord("scream", 0b01000001, 75, 0, 0x54d1);
defineWord("script", 0b01000001, 242, 0, 0x54df);
defineWord("scram", 0b01000001, 125, 0, 0x54bc);
defineWord("scrap", 0b10000000, 0, 0, 0x54c3);
defineWord("scratch", 0b01000001, 93, 0, 0x54ca);
defineWord("sculpted", 0b00100010, 113, 0, 0x54e6);
defineWord("scale", 0b01000001, 214, 0, 0x5499);
defineWord("scat", 0b01000001, 125, 0, 0x54a0);
defineWord("teensy", 0b00100010, 3, 0, 0x58a5);
defineWord("tee-remover", 0b00100010, 174, 0, 0x589e);
defineWord("tee", 0b00100010, 172, 0, 0x5897);
defineWord("telephone", 0b00100010, 149, 0, 0x58ac);
defineWord("tell", 0b01000001, 97, 0, 0x58b3);
defineWord("tent", 0b10000000, 0, 0, 0x58c1);
defineWord("tentac", 0b00100010, 221, 0, 0x58c8);
defineWord("ten", 0b00100010, 190, 0, 0x58ba);
defineWord("tear", 0b01000001, 129, 0, 0x5890);
defineWord("tea-remover", 0b00100010, 175, 0, 0x5889);
defineWord("tea", 0b00100010, 173, 0, 0x5882);
defineWord("them", 0b10000000, 0, 0, 0x58eb);
defineWord("then", 0b00000100, 0, 0, 0x58f2);
defineWord("therma", 0b10100010, 203, 0, 0x58f9);
defineWord("theta", 0b10100010, 16, 0, 0x5900);
defineWord("the", 0b00000100, 0, 0, 0x58e4);
defineWord("this", 0b00000100, 0, 0, 0x5907);
defineWord("thorbast", 0b10100010, 205, 0, 0x590e);
defineWord("through", 0b00001000, 242, 0, 0x5915);
defineWord("throw", 0b01000001, 95, 0, 0x591c);
defineWord("thru", 0b00001000, 242, 0, 0x5923);
defineWord("thanks", 0b01000001, 96, 0, 0x58d6);
defineWord("thank", 0b01000001, 96, 0, 0x58cf);
defineWord("that", 0b00000100, 0, 0, 0x58dd);
defineWord("tie", 0b01000001, 94, 0, 0x592a);
defineWord("tiff's", 0b00100010, 184, 0, 0x5938);
defineWord("tiff", 0b10000000, 0, 0, 0x5931);
defineWord("tiffan", 0b10100010, 183, 0, 0x593f);
defineWord("tight", 0b00100010, 66, 0, 0x5946);
defineWord("tinier", 0b00100010, 3, 0, 0x594d);
defineWord("tinkle", 0b01000001, 145, 0, 0x5954);
defineWord("tiny", 0b00100010, 3, 0, 0x595b);
defineWord("tits", 0b10000000, 0, 0, 0x5969);
defineWord("tit", 0b10000000, 0, 0, 0x5962);
defineWord("together", 0b00001000, 223, 0, 0x5977);
defineWord("toilet", 0b10000000, 0, 0, 0x597e);
defineWord("torch", 0b10000000, 0, 0, 0x5985);
defineWord("toss", 0b01000001, 95, 0, 0x598c);
defineWord("touch", 0b01000001, 93, 0, 0x5993);
defineWord("towering", 0b00100010, 36, 0, 0x59a8);
defineWord("tower", 0b10000000, 0, 0, 0x59a1);
defineWord("toward", 0b00001000, 255, 0, 0x599a);
defineWord("to", 0b00001000, 255, 0, 0x5970);
defineWord("trees", 0b10000000, 0, 0, 0x59d9);
defineWord("tree-", 0b10000000, 0, 0, 0x59d2);
defineWord("tree", 0b10100010, 168, 0, 0x59cb);
defineWord("trellis", 0b10000000, 0, 0, 0x59e0);
defineWord("tremendous", 0b00100010, 1, 0, 0x59e7);
defineWord("trent", 0b10100010, 182, 0, 0x59ee);
defineWord("trample", 0b01000001, 205, 0, 0x59b6);
defineWord("trap", 0b01000001, 218, 0, 0x59bd);
defineWord("tray", 0b10000000, 0, 0, 0x59c4);
defineWord("trade", 0b01000001, 228, 0, 0x59af);
defineWord("turn", 0b01000001, 92, 0, 0x59fc);
defineWord("tube", 0b10000000, 0, 0, 0x59f5);
defineWord("t-remover", 0b10000000, 0, 0, 0x584a);
defineWord("t", 0b00100010, 171, 0, 0x5843);
defineWord("take", 0b01000001, 101, 0, 0x5851);
defineWord("talk", 0b01000001, 100, 0, 0x5858);
defineWord("tall", 0b00100010, 140, 0, 0x585f);
defineWord("tame", 0b01000001, 252, 0, 0x5866);
defineWord("tap", 0b01000001, 99, 0, 0x586d);
defineWord("taste", 0b01000001, 98, 0, 0x5874);
defineWord("tattered", 0b00100010, 157, 0, 0x587b);
defineWord("uh-uh", 0b01000001, 149, 0, 0x5a11);
defineWord("unfast", 0b01000001, 87, 0, 0x5a49);
defineWord("unknot", 0b01000001, 87, 0, 0x5a50);
defineWord("unlock", 0b01000001, 89, 0, 0x5a57);
defineWord("unpin", 0b01000001, 91, 0, 0x5a5e);
defineWord("unplug", 0b01000001, 91, 0, 0x5a65);
defineWord("unreliable", 0b00100010, 144, 0, 0x5a6c);
defineWord("unroll", 0b01000001, 88, 0, 0x5a73);
defineWord("unstrap", 0b01000001, 87, 0, 0x5a81);
defineWord("unscript", 0b01000001, 241, 0, 0x5a7a);
defineWord("untie", 0b01000001, 87, 0, 0x5a8f);
defineWord("untang", 0b00100010, 166, 0, 0x5a88);
defineWord("unwrap", 0b01000001, 131, 0, 0x5a96);
defineWord("unangl", 0b00100010, 167, 0, 0x5a18);
defineWord("unatta", 0b01000001, 87, 0, 0x5a1f);
defineWord("unblock", 0b01000001, 91, 0, 0x5a26);
defineWord("uncover", 0b01000001, 91, 0, 0x5a2d);
defineWord("underneath", 0b00001000, 241, 0, 0x5a3b);
defineWord("under", 0b00001000, 241, 0, 0x5a34);
defineWord("undres", 0b01001000, 228, 90, 0x5a42);
defineWord("upstairs", 0b00011011, 22, 250, 0x5aa4);
defineWord("up", 0b00011011, 22, 250, 0x5a9d);
defineWord("urinate", 0b01000001, 145, 0, 0x5aab);
defineWord("use", 0b01000001, 86, 0, 0x5ab2);
defineWord("using", 0b00001000, 251, 0, 0x5ab9);
defineWord("u", 0b00011011, 22, 250, 0x5a03);
defineWord("ube", 0b10000000, 0, 0, 0x5a0a);
defineWord("venus", 0b10100010, 165, 0, 0x5ace);
defineWord("version", 0b01000001, 240, 0, 0x5adc);
defineWord("verbose", 0b01000001, 255, 0, 0x5ad5);
defineWord("viewport", 0b10000000, 0, 0, 0x5ae3);
defineWord("vizicomm", 0b10100010, 186, 0, 0x5aea);
defineWord("vomit", 0b01000001, 85, 0, 0x5af1);
defineWord("vagina", 0b10000000, 0, 0, 0x5ac0);
defineWord("vault", 0b01000001, 176, 0, 0x5ac7);
defineWord("weensy", 0b00100010, 3, 0, 0x5b5a);
defineWord("wee-wee", 0b01000001, 145, 0, 0x5b53);
defineWord("wee", 0b01000001, 145, 0, 0x5b4c);
defineWord("well", 0b10000000, 0, 0, 0x5b61);
defineWord("west", 0b00110011, 24, 27, 0x5b68);
defineWord("wear", 0b01000001, 80, 0, 0x5b3e);
defineWord("wed", 0b01000001, 154, 0, 0x5b45);
defineWord("wheres", 0b01000001, 78, 0, 0x5b8b);
defineWord("where", 0b01000001, 78, 0, 0x5b84);
defineWord("whie", 0b00100010, 204, 0, 0x5b92);
defineWord("whiff", 0b01000001, 111, 0, 0x5b99);
defineWord("whip", 0b01000001, 77, 0, 0x5ba0);
defineWord("white", 0b00100010, 63, 0, 0x5ba7);
defineWord("whole", 0b00100010, 194, 0, 0x5bb5);
defineWord("whos", 0b01000001, 79, 0, 0x5bbc);
defineWord("who", 0b01000001, 79, 0, 0x5bae);
defineWord("whats", 0b01000001, 79, 0, 0x5b7d);
defineWord("what'", 0b01000001, 79, 0, 0x5b76);
defineWord("what", 0b01000001, 79, 0, 0x5b6f);
defineWord("wife's", 0b00100010, 18, 0, 0x5bd8);
defineWord("wife", 0b10100010, 32, 0, 0x5bd1);
defineWord("winding", 0b00100010, 56, 0, 0x5bdf);
defineWord("window", 0b10000000, 0, 0, 0x5be6);
defineWord("wipe", 0b01000001, 81, 0, 0x5bed);
defineWord("with", 0b00001000, 251, 0, 0x5bf4);
defineWord("withdr", 0b01000001, 194, 0, 0x5bfb);
defineWord("wicker", 0b00100010, 236, 0, 0x5bc3);
defineWord("wide", 0b00100010, 2, 0, 0x5bca);
defineWord("women", 0b00100010, 78, 0, 0x5c09);
defineWord("woman", 0b10100010, 22, 0, 0x5c02);
defineWord("wooden", 0b00100010, 79, 0, 0x5c10);
defineWord("wreck", 0b01000001, 205, 0, 0x5c1e);
defineWord("wrap", 0b01000001, 76, 0, 0x5c17);
defineWord("w", 0b00110011, 24, 27, 0x5af8);
defineWord("wait", 0b01000001, 84, 0, 0x5b06);
defineWord("wake", 0b01000001, 83, 0, 0x5b0d);
defineWord("walk", 0b01000001, 82, 0, 0x5b14);
defineWord("warm", 0b00100010, 47, 0, 0x5b1b);
defineWord("warning", 0b00100010, 115, 0, 0x5b22);
defineWord("wash", 0b01000001, 81, 0, 0x5b29);
defineWord("water", 0b10000000, 0, 0, 0x5b37);
defineWord("watch", 0b01000001, 195, 0, 0x5b30);
defineWord("waddling", 0b00100010, 155, 0, 0x5aff);
defineWord("yell", 0b01000001, 75, 0, 0x5c33);
defineWord("yes", 0b01000001, 74, 0, 0x5c3a);
defineWord("young", 0b00100010, 216, 0, 0x5c41);
defineWord("your", 0b00100010, 50, 0, 0x5c48);
defineWord("yup", 0b01000001, 74, 0, 0x5c4f);
defineWord("y", 0b01000001, 74, 0, 0x5c25);
defineWord("yacht", 0b10000000, 0, 0, 0x5c2c);
defineWord("zzmgck", 0b11000001, 73, 0, 0x5c5d);
defineWord("z", 0b01000001, 84, 0, 0x5c56);
defineWord("3-d", 0b00100010, 70, 0, 0x41ad);
defineWord(".", 0b00000100, 0, 0, 0x41b4);
defineWord(",", 0b00000100, 0, 0, 0x41bb);
defineWord("#record", 0b01000001, 237, 0, 0x41d7);
defineWord("#random", 0b01000001, 239, 0, 0x41d0);
defineWord("#unrecord", 0b01000001, 236, 0, 0x41de);
defineWord("#", 0b00100010, 34, 0, 0x41c2);
defineWord("#command", 0b01000001, 238, 0, 0x41c9);
defineWord("\"", 0b00000100, 0, 0, 0x41e5);
defineWord("$verify", 0b01000001, 235, 0, 0x41a6);
defineWord("aging", 0b00100010, 81, 0, 0x4224);
defineWord("against", 0b00001000, 233, 0, 0x421d);
defineWord("again", 0b00000100, 0, 0, 0x4216);
defineWord("aim", 0b01000001, 140, 0, 0x422b);
defineWord("alien", 0b10100010, 126, 0, 0x4232);
defineWord("all", 0b00000100, 0, 0, 0x4239);
defineWord("along", 0b00001000, 238, 0, 0x4240);
defineWord("am", 0b00000100, 0, 0, 0x4247);
defineWord("angles", 0b10000000, 0, 0, 0x4263);
defineWord("angle", 0b10000000, 0, 0, 0x425c);
defineWord("answer", 0b01000001, 234, 0, 0x426a);
defineWord("an", 0b00000100, 0, 0, 0x424e);
defineWord("and", 0b00000100, 0, 0, 0x4255);
defineWord("ape", 0b10000000, 0, 0, 0x4278);
defineWord("apply", 0b01000001, 232, 0, 0x4286);
defineWord("applaud", 0b01000001, 233, 0, 0x427f);
defineWord("approa", 0b01000001, 231, 0, 0x428d);
defineWord("apart", 0b00001000, 230, 0, 0x4271);
defineWord("are", 0b00000100, 0, 0, 0x4294);
defineWord("area", 0b10000000, 0, 0, 0x429b);
defineWord("aroma", 0b10000000, 0, 0, 0x42a2);
defineWord("around", 0b00001000, 238, 0, 0x42a9);
defineWord("art", 0b00100010, 228, 0, 0x42b0);
defineWord("ask", 0b01000001, 230, 0, 0x42b7);
defineWord("asshole", 0b00000100, 0, 0, 0x42cc);
defineWord("ass", 0b10000000, 0, 0, 0x42be);
defineWord("assassin", 0b10100010, 213, 0, 0x42c5);
defineWord("attach", 0b01000001, 94, 0, 0x42da);
defineWord("attack", 0b01100001, 229, 251, 0x42e1);
defineWord("at", 0b00001000, 239, 0, 0x42d3);
defineWord("auto", 0b10000000, 0, 0, 0x42e8);
defineWord("awake", 0b01000001, 83, 0, 0x42ef);
defineWord("away", 0b00001000, 236, 0, 0x42f6);
defineWord("a", 0b00000100, 0, 0, 0x41ec);
defineWord("about", 0b00001000, 254, 0, 0x41fa);
defineWord("abandoned", 0b00100010, 110, 0, 0x41f3);
defineWord("across", 0b00001000, 234, 0, 0x4201);
defineWord("activa", 0b01000001, 108, 0, 0x4208);
defineWord("address", 0b00100010, 225, 0, 0x420f);
defineWord("beer", 0b10000000, 0, 0, 0x43a5);
defineWord("before", 0b00001000, 240, 0, 0x43ac);
defineWord("behind", 0b00001000, 237, 0, 0x43b3);
defineWord("below", 0b00001000, 241, 0, 0x43ba);
defineWord("beneath", 0b00001000, 241, 0, 0x43c8);
defineWord("bend", 0b01000001, 227, 0, 0x43c1);
defineWord("beat", 0b01000001, 177, 0, 0x4397);
defineWord("bed", 0b10000000, 0, 0, 0x439e);
defineWord("bigger", 0b00100010, 1, 0, 0x43d6);
defineWord("big", 0b00100010, 1, 0, 0x43cf);
defineWord("bikini", 0b10000000, 0, 0, 0x43dd);
defineWord("birds", 0b10000000, 0, 0, 0x43eb);
defineWord("bird", 0b10000000, 0, 0, 0x43e4);
defineWord("bite", 0b01000001, 226, 0, 0x43f9);
defineWord("bits", 0b10000000, 0, 0, 0x4400);
defineWord("bitch", 0b00000100, 0, 0, 0x43f2);
defineWord("blender", 0b10000000, 0, 0, 0x441c);
defineWord("blow", 0b01000001, 225, 0, 0x4423);
defineWord("bluepr", 0b00100010, 243, 0, 0x442a);
defineWord("blanket", 0b10000000, 0, 0, 0x4415);
defineWord("black", 0b00100010, 62, 0, 0x4407);
defineWord("blade", 0b10000000, 0, 0, 0x440e);
defineWord("book", 0b10000000, 0, 0, 0x444d);
defineWord("boost", 0b01000001, 137, 0, 0x4454);
defineWord("booth", 0b10000000, 0, 0, 0x445b);
defineWord("boo", 0b01000001, 125, 0, 0x4446);
defineWord("bosom", 0b10000000, 0, 0, 0x4462);
defineWord("both", 0b00000100, 0, 0, 0x4469);
defineWord("bounce", 0b01000001, 122, 0, 0x4470);
defineWord("bow", 0b01000001, 173, 0, 0x4477);
defineWord("box", 0b10000000, 0, 0, 0x447e);
defineWord("board", 0b01000001, 224, 0, 0x4431);
defineWord("boat", 0b10000000, 0, 0, 0x4438);
defineWord("body", 0b10000000, 0, 0, 0x443f);
defineWord("break", 0b01000001, 205, 0, 0x44a8);
defineWord("breast", 0b10000000, 0, 0, 0x44af);
defineWord("breathe", 0b01000001, 223, 0, 0x44b6);
defineWord("brief", 0b01000001, 254, 0, 0x44bd);
defineWord("brown", 0b00100010, 229, 0, 0x44cb);
defineWord("browse", 0b01000001, 133, 0, 0x44d2);
defineWord("broad", 0b00100010, 2, 0, 0x44c4);
defineWord("brassiere", 0b10000000, 0, 0, 0x44a1);
defineWord("brass", 0b00100010, 65, 0, 0x449a);
defineWord("bras", 0b10000000, 0, 0, 0x4493);
defineWord("bra", 0b10000000, 0, 0, 0x4485);
defineWord("brackish", 0b00100010, 45, 0, 0x448c);
defineWord("bug-eyed", 0b00100010, 219, 0, 0x44e0);
defineWord("bug", 0b00100010, 217, 0, 0x44d9);
defineWord("bunny", 0b10100010, 154, 0, 0x44ee);
defineWord("bunch", 0b10000000, 0, 0, 0x44e7);
defineWord("buoy", 0b10000000, 0, 0, 0x44f5);
defineWord("burn", 0b01000001, 222, 0, 0x44fc);
defineWord("button", 0b10000000, 0, 0, 0x450a);
defineWord("but", 0b00000100, 0, 0, 0x4503);
defineWord("buy", 0b01000001, 221, 0, 0x4511);
defineWord("by", 0b00001000, 240, 0, 0x4518);
defineWord("bag", 0b10000000, 0, 0, 0x4312);
defineWord("balls", 0b10000000, 0, 0, 0x4320);
defineWord("ball", 0b10000000, 0, 0, 0x4319);
defineWord("balm", 0b10000000, 0, 0, 0x4327);
defineWord("bang", 0b01000001, 187, 0, 0x432e);
defineWord("bare", 0b00100010, 49, 0, 0x433c);
defineWord("barf", 0b01000001, 85, 0, 0x4343);
defineWord("barge", 0b10000000, 0, 0, 0x4351);
defineWord("bargain", 0b01000001, 228, 0, 0x434a);
defineWord("barred", 0b00100010, 60, 0, 0x4358);
defineWord("bars", 0b10000000, 0, 0, 0x435f);
defineWord("bartender", 0b10100010, 17, 0, 0x4366);
defineWord("barter", 0b01000001, 228, 0, 0x436d);
defineWord("bar", 0b10000000, 0, 0, 0x4335);
defineWord("basket", 0b10000000, 0, 0, 0x437b);
defineWord("baske", 0b10000000, 0, 0, 0x4374);
defineWord("bastard", 0b00000100, 0, 0, 0x4382);
defineWord("bathroom", 0b10000000, 0, 0, 0x4389);
defineWord("battle", 0b10100010, 206, 0, 0x4390);
defineWord("baby's", 0b00100010, 23, 0, 0x4304);
defineWord("baby", 0b10100010, 109, 0, 0x42fd);
defineWord("back", 0b00101000, 235, 67, 0x430b);
defineWord("ceilin", 0b10000000, 0, 0, 0x4588);
defineWord("cell", 0b10100010, 233, 0, 0x458f);
defineWord("cedarwood", 0b00100010, 103, 0, 0x4581);
defineWord("cedar", 0b00100010, 102, 0, 0x457a);
defineWord("cheer", 0b01000001, 217, 0, 0x45a4);
defineWord("chief", 0b00100010, 211, 0, 0x45ab);
defineWord("chocolate", 0b10000000, 0, 0, 0x45b2);
defineWord("chapst", 0b10000000, 0, 0, 0x4596);
defineWord("chase", 0b01000001, 188, 0, 0x459d);
defineWord("circle", 0b11000001, 216, 0, 0x45b9);
defineWord("cleveland", 0b10100010, 147, 0, 0x45ce);
defineWord("clean", 0b01000001, 81, 0, 0x45c7);
defineWord("cliff", 0b10000000, 0, 0, 0x45dc);
defineWord("climax", 0b01000001, 212, 0, 0x45e3);
defineWord("climb", 0b01000001, 214, 0, 0x45ea);
defineWord("click", 0b01000001, 215, 0, 0x45d5);
defineWord("clohes", 0b00100010, 137, 0, 0x45f1);
defineWord("closet", 0b10000000, 0, 0, 0x45ff);
defineWord("close", 0b01000001, 213, 0, 0x45f8);
defineWord("clothes", 0b10100010, 136, 0, 0x460d);
defineWord("cloth", 0b00100010, 197, 0, 0x4606);
defineWord("clap", 0b01000001, 233, 0, 0x45c0);
defineWord("coin", 0b10100010, 187, 0, 0x4630);
defineWord("come", 0b01000001, 212, 0, 0x4637);
defineWord("comfort", 0b01000001, 217, 0, 0x463e);
defineWord("comic", 0b00100010, 69, 0, 0x4645);
defineWord("common", 0b00100010, 100, 0, 0x464c);
defineWord("compar", 0b10000000, 0, 0, 0x4653);
defineWord("control", 0b10000000, 0, 0, 0x465a);
defineWord("coon", 0b00100010, 164, 0, 0x4661);
defineWord("copulate", 0b01000001, 211, 0, 0x4668);
defineWord("cotton", 0b00100010, 163, 0, 0x466f);
defineWord("count", 0b01000001, 209, 0, 0x4684);
defineWord("couchmate", 0b00100010, 248, 0, 0x467d);
defineWord("couch", 0b10000000, 0, 0, 0x4676);
defineWord("cover", 0b11000001, 210, 0, 0x468b);
defineWord("cocksu", 0b00000100, 0, 0, 0x461b);
defineWord("cock", 0b10000000, 0, 0, 0x4614);
defineWord("code", 0b10000000, 0, 0, 0x4622);
defineWord("coded", 0b00100010, 125, 0, 0x4629);
defineWord("creamy", 0b00100010, 232, 0, 0x46a7);
defineWord("cream", 0b10100010, 153, 0, 0x46a0);
defineWord("cross", 0b01000001, 208, 0, 0x46ae);
defineWord("crown", 0b10000000, 0, 0, 0x46b5);
defineWord("crumpled", 0b00100010, 82, 0, 0x46bc);
defineWord("crush", 0b01000001, 205, 0, 0x46c3);
defineWord("crap", 0b01000001, 121, 0, 0x4699);
defineWord("crack", 0b01000001, 77, 0, 0x4692);
defineWord("cum", 0b01000001, 212, 0, 0x46ca);
defineWord("cunt", 0b10000000, 0, 0, 0x46d1);
defineWord("cut", 0b01000001, 114, 0, 0x46d8);
defineWord("cage", 0b10000000, 0, 0, 0x4526);
defineWord("call", 0b01000001, 220, 0, 0x452d);
defineWord("canvas", 0b00100010, 193, 0, 0x4549);
defineWord("can", 0b10000000, 0, 0, 0x4534);
defineWord("canal", 0b10100010, 43, 0, 0x453b);
defineWord("candy", 0b10000000, 0, 0, 0x4542);
defineWord("carry", 0b01000001, 101, 0, 0x455e);
defineWord("car", 0b10000000, 0, 0, 0x4550);
defineWord("cardboard", 0b00100010, 130, 0, 0x4557);
defineWord("cast", 0b01000001, 219, 0, 0x4565);
defineWord("cat", 0b10000000, 0, 0, 0x456c);
defineWord("catch", 0b01000001, 218, 0, 0x4573);
defineWord("cackle", 0b01000001, 169, 0, 0x451f);
defineWord("defecate", 0b01000001, 121, 0, 0x472c);
defineWord("deflate", 0b01100001, 206, 150, 0x4733);
defineWord("degree", 0b00100010, 92, 0, 0x473a);
defineWord("demoli", 0b01000001, 205, 0, 0x4741);
defineWord("depart", 0b01000001, 194, 0, 0x4748);
defineWord("destro", 0b01000001, 205, 0, 0x475d);
defineWord("descen", 0b01000001, 204, 0, 0x474f);
defineWord("describe", 0b01000001, 195, 0, 0x4756);
defineWord("device", 0b10000000, 0, 0, 0x4764);
defineWord("devour", 0b01000001, 198, 0, 0x476b);
defineWord("deactivate", 0b01000001, 193, 0, 0x4709);
defineWord("dead", 0b00100010, 127, 0, 0x4710);
defineWord("debark", 0b01000001, 202, 0, 0x4717);
defineWord("decipher", 0b01000001, 207, 0, 0x471e);
defineWord("decode", 0b01000001, 207, 0, 0x4725);
defineWord("differ", 0b00100010, 90, 0, 0x4780);
defineWord("dig", 0b01000001, 203, 0, 0x4787);
defineWord("direct", 0b10000000, 0, 0, 0x478e);
defineWord("dirigible", 0b10000000, 0, 0, 0x4795);
defineWord("dirty", 0b00100010, 135, 0, 0x479c);
defineWord("disembark", 0b01000001, 202, 0, 0x47aa);
defineWord("dismount", 0b01000001, 202, 0, 0x47b1);
defineWord("discarded", 0b00100010, 234, 0, 0x47a3);
defineWord("dive", 0b01000001, 176, 0, 0x47bf);
defineWord("divan", 0b10000000, 0, 0, 0x47b8);
defineWord("diagnose", 0b01000001, 249, 0, 0x4772);
defineWord("dial", 0b11000001, 92, 0, 0x4779);
defineWord("don", 0b01000001, 80, 0, 0x47cd);
defineWord("donate", 0b01000001, 184, 0, 0x47d4);
defineWord("doorstep", 0b10000000, 0, 0, 0x47e2);
defineWord("door", 0b10000000, 0, 0, 0x47db);
defineWord("douglas", 0b00100010, 223, 0, 0x47e9);
defineWord("downstairs", 0b00011011, 21, 244, 0x47f7);
defineWord("down", 0b00011011, 21, 244, 0x47f0);
defineWord("doze", 0b01000001, 115, 0, 0x47fe);
defineWord("dock", 0b11000001, 170, 0, 0x47c6);
defineWord("dresse", 0b00001000, 229, 0, 0x480c);
defineWord("dress", 0b01000001, 201, 0, 0x4805);
defineWord("drink", 0b11000001, 200, 0, 0x4813);
defineWord("drop", 0b01000001, 199, 0, 0x481a);
defineWord("drowsy", 0b00100010, 129, 0, 0x4821);
defineWord("drunk", 0b00001000, 224, 0, 0x4828);
defineWord("dump", 0b01000001, 199, 0, 0x4836);
defineWord("dunes", 0b10000000, 0, 0, 0x4844);
defineWord("dune", 0b10000000, 0, 0, 0x483d);
defineWord("duper", 0b00100010, 250, 0, 0x484b);
defineWord("dust", 0b10000000, 0, 0, 0x4852);
defineWord("dubious", 0b00100010, 80, 0, 0x482f);
defineWord("d", 0b00011011, 21, 244, 0x46df);
defineWord("damned", 0b00000100, 0, 0, 0x46f4);
defineWord("damn", 0b00000100, 0, 0, 0x46ed);
defineWord("damage", 0b01000001, 205, 0, 0x46e6);
defineWord("dark", 0b00100010, 44, 0, 0x46fb);
defineWord("daughter", 0b10100010, 15, 0, 0x4702);

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
