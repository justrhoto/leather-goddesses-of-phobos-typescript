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
];
