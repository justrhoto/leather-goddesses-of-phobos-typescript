// A complete winning playthrough (as a male character, in LEWD mode).
// Steps with `until` repeat a command until the story responds as expected,
// which keeps the script independent of the random number seed.
import type { Step } from "./walkthrough-runner.ts";

/**
 * Turns spent in the catacombs. Entering starts three timers: beetles strike
 * after 6 turns, sand crabs after 10 and an alligator after 12. Clapping, hopping
 * and crying KWEEPA restart them, so each is issued just before it falls due
 * (every turn counts, including the guards themselves). The torch only lasts
 * about 90 turns, so no turn is wasted.
 */
function catacombs(commands: string[]): Step[] {
  const steps: Step[] = [];
  const guards = [
    { cmd: "clap", period: 5, left: 5 },
    { cmd: "hop", period: 9, left: 9 },
    { cmd: "kweepa", period: 11, left: 11 },
  ];
  const turn = (step: Step) => {
    steps.push(step);
    for (const g of guards) g.left--;
  };
  for (const c of commands) {
    for (let due = guards.find((g) => g.left <= 2); due; due = guards.find((g) => g.left <= 2)) {
      turn(due.cmd);
      due.left = due.period;
    }
    turn({ cmd: c, expect: SAFE });
  }
  return steps;
}

/** Output with no creature attack or death in it. */
const SAFE = /^(?![\s\S]*(beetles|sand crabs|alligator|You have died))/;

export const WALKTHROUGH: Step[] = [
  // Earth: Joe's Bar
  "", // "Hit RETURN to begin"
  { cmd: "northwest", expect: /Gents' Room/ },
  { cmd: "take stool", expect: /Taken/ },
  { cmd: "pee", expect: /Ahhh/ },
  "southeast",
  { cmd: "lewd", expect: /age/ },
  { cmd: "19", expect: /LEWD level/ },
  { cmd: "wait", until: /7\.3 hours later/ },

  // Phobos: the cells
  { expect: /Cell/ },
  "take all",
  "open door",
  "south",
  "open narrow door",
  { cmd: "south", expect: /my name's Trent/ },
  "take all",
  "north",
  "up",
  "north",
  { cmd: "turn on flashlight", expect: /black circle/ },
  { cmd: "stand on trent", expect: /get everything from the shelf/ },

  // Venus: the jungle
  { cmd: "enter circle", expect: /Jungle/ },
  { cmd: "hiss", expect: /dies of fright/ },
  "west",
  { cmd: "take jar", expect: /Taken/ },
  "put all in basket",

  // The Leather Goddesses' flagship
  { cmd: "enter circle", expect: /hurls himself onto the grenade/ },
  { cmd: "take sword", expect: /Taken/ },
  "south",
  { cmd: "mount stallion", expect: /on the stallion/ },
  { cmd: "west", expect: /At Main Hatch/ },
  "dismount",
  "take suit",
  "wear suit",
  "open hatch",
  { cmd: "north", expect: /Thorbast/ },
  { cmd: "hit thorbast with sword", until: /drifts toward you/ },
  { cmd: "take his sword", expect: /Taken/ },
  { cmd: "give his sword to thorbast", expect: /drifts away into the blackness/ },
  { cmd: "hit monster with sword", expect: /squawks and flees/ },
  { cmd: "untie young woman", expect: /beckoning you to follow/ },
  "follow young woman",
  "open door",
  "east",
  "south",
  "south",
  "mount stallion",
  "east",
  "dismount",
  "west",
  "west",
  "west",
  "enter circle",
  "wait",
  "west",
  "west",
  "northwest",
  "show painting to mouse",
  "take mouse",
  "south",
  "enter circle",
  "up",
  "up",
  "north",
  "enter circle",
  "east",
  "east",
  "take stain",
  "northwest",
  "give flashlight to salesman",
  "take machine",
  "knock on door",
  "down",
  "give chocolate to male gorilla",
  "wait",
  "wait",
  "fuck female gorilla",
  "take hose",
  "eat chocolate",
  "open cage",
  "out",
  "untie me",
  "untie trent",
  "drop hose",
  "pull switch",
  "get up",
  "take hose",
  "enter circle",
  "pull knob",
  "open box",
  "take coin",
  "southeast",
  "enter circle",
  "enter barge",
  "press purple button",
  "press orange button",
  "wait",
  "wait",
  "wait",
  "wait",
  "press orange button",
  "out",
  "north",
  "put all in basket",
  "drop sword",
  "take message",
  "take balm",
  "south",
  { cmd: "enter barge", expect: /royal barge/ },
  "press orange button",
  "wait",
  "press orange button",
  { cmd: "wait", expect: /My Kind of Dock/ },
  "out",
  "east",
  { cmd: "northeast", expect: /Are you ready/ },
  "yes",
  { cmd: 'say "riddle"', expect: /that's right/ },
  { cmd: "west", expect: /pick a wife/ },
  "read coded message",
  // The message is written backwards; so is the wife's number in it.
  { from: (text) => /(\d+)/.exec(text)![1].split("").reverse().join("") },
  { cmd: "west", expect: /Harem/ },
  { cmd: "wait", expect: /beckons you deeper/ },
  { cmd: "ask wife to kiss my kneecaps", expect: /secret map/ },
  "take all",
  "drop stool",
  "drop message",
  { cmd: "down", expect: /Catacombs/ },

  // Mars: the catacombs (a fixed maze; see CATACOMBS-TABLE)
  ...catacombs([
    "northwest", "north", "northeast", "east", "northeast", "northeast", "southeast", "down", "northwest",
    "northeast", "north", "south", "northeast", "up", "northwest", // Forgotten Storehouse
    "take phone book",
    "out", "south", "southeast", "south", "north", "southeast", // Well Bottom
    "southeast", "down", "northeast", "west", "east", "west", "south", "southwest", // Burial Chamber
    "take raft",
    "north", "northeast", "east", "northwest", "north", // Ladder Room
  ]),
  { expect: /Ladder Room/ },
  { cmd: "up", expect: /tumble into the darkness/ },
  { cmd: "take pin", expect: /Taken/ },
  "north",
  "east",
  "southeast",
  { cmd: "up", expect: /Minaret/ },
  { cmd: "enter circle", expect: /Cramped Space/ },
  { cmd: "down", until: /floor collapses/ },
  "drop torch",
  "drop map",
  { cmd: "enter circle", expect: /My Kind of Dock|You're sucked/ },
  "west",
  { cmd: "enter barge", expect: /royal barge/ },
  "press orange button",
  "press orange button",
  { cmd: "wait", until: /Wattz-Upp Dock/ },
  "out",
  // Send the empty barge on down the canal; it will end up at the Icy Dock.
  { cmd: "press orange button", expect: /shoots away/ },
  { cmd: "west", expect: /Oasis/ },
  { cmd: "put stain on circle", expect: /once again black/ },
  "drop stain",
  { cmd: "enter circle", expect: /Cleveland/ },

  // Cleveland
  "south",
  "take sack",
  "open sack",
  "empty leaves",
  "put all in sack",
  "north",
  "northeast",
  { cmd: "up", expect: /Bedroom/ },
  "take sheet",
  { cmd: "tear sheet", expect: /strips/ },
  { cmd: "tie strips together", expect: /rope/ },
  "tie rope to bed",
  { cmd: "throw rope out window", expect: /I'll go down/ },
  { cmd: "wait", until: /I got the headlight/ },
  { cmd: "take headlight", expect: /Taken/ },
  "climb down stairs",
  { cmd: "east", expect: /Garden/ },
  { cmd: "move sod", expect: /black circle/ },
  { cmd: "enter circle", expect: /End of Hallway/ },
  "north",
  { cmd: "enter circle", expect: /Main Hall of Palace/ },
  "east",
  { cmd: "down", expect: /Icy Dock/ },
  { cmd: "out", expect: /watery grave/ },

  // Mars: the south polar cap
  "south",
  { cmd: "southeast", expect: /Penguin Park/ },
  { cmd: "donate coin to penguin", expect: /part ranks/ },
  { cmd: "southeast", expect: /Gypsy Camp/ },
  "empty basket into sack",
  { cmd: "north", expect: /baby robot/ },
  "take baby",
  "put baby in basket",
  { cmd: "put blanket in basket", expect: /calm sleep/ },
  "south",
  { cmd: "south", expect: /South Pole/ },
  { cmd: "put basket on stoop", expect: /snowdrift/ },
  { cmd: "wait", until: /carries it inside/ },
  { cmd: "open door", expect: /swings open/ },
  { cmd: "enter igloo", expect: /cotton balls/ },
  { cmd: "take cotton balls", expect: /Taken/ },
  "out",
  "north",
  "northwest",
  { cmd: "west", expect: /Allusion Room/ },
  { cmd: "enter circle", expect: /Wattz-Upp Dock/ },
  "west",
  "west",
  { cmd: "northwest", expect: /large green frog/ },

  // The frog: every sense must be protected
  { cmd: "put balm on lips", expect: /balm/ },
  { cmd: "put pin on nose", expect: /pin your proboscis/ },
  "drop all",
  "cover ears with hands",
  "close eyes",
  { cmd: "kiss frog", expect: /blender/ },
  { cmd: "take blender", expect: /Taken/ },
  "take pin off nose",
  "drop pin",
  "take off balm",
  "drop balm",
  "show painting to mouse",
  "take mouse",
  "take all but balm and pin",
  "west",
  "north",
  { cmd: "north", expect: /Throne Room/ },

  // Restoring Princess Theta
  "open compartment",
  "put jar in compartment",
  "close compartment",
  { cmd: "turn on machine", expect: /FEEP/ },
  { cmd: "open compartment", expect: /unangling cream/ },
  "take jar",
  { cmd: "rub cream on daughter", expect: /beautiful princess/ },
  { cmd: "take angle", expect: /Taken/ },

  // Down the canal by raft to the Exit Shop
  { cmd: "north", expect: /Royal Docks/ },
  { cmd: "put raft in water", expect: /bobbing in the canal/ },
  { cmd: "get in raft", expect: /current sweeps it away/ },
  { cmd: "wait", until: /close enough to grab on the southern shore/ },
  { cmd: "grab dock", expect: /Donald Dock/ },
  "south",
  { cmd: "east", expect: /Canalview Mall/ },
  { cmd: "south", expect: /Exit Shop/ },
  { cmd: "give coin to proprietor", expect: /cardboard tube/ },
  { cmd: "search dust", until: /You grasp a tube/ },
  "north",
  { cmd: "open tube", expect: /flexible black circle/ },
  "put circle on ground",
  { cmd: "enter circle", expect: /Boudoir/ },
  { cmd: "wait", until: /Hand me a common household blender/ },

  // Phobos: the Super-Duper Anti-Leather Goddesses of Phobos Attack Machine
  "give blender to trent",
  "give hose to trent",
  "give cotton balls to trent",
  "give angle to trent",
  "give headlight to trent",
  "give mouse to trent",
  "give photo to trent",
  { cmd: "give phone book to trent", expect: /Scratch .n. sniff spot number 7/ },
  "", // the RETURN the scratch 'n' sniff prompt asks for
];
