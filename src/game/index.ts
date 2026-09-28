// Entry point for the ported game: builds the world once and creates sessions.
import { G, P } from "./world.ts";
import * as misc from "./misc.ts";
import * as parser from "./parser.ts";
import * as verbs from "./verbs.ts";
import * as globals from "./globals.ts";
import * as earth from "./earth.ts";
import * as mars from "./mars.ts";
import * as venus from "./venus.ts";
import * as cleveland from "./cleveland.ts";
import * as spaceship from "./spaceship.ts";
import * as phobos from "./phobos.ts";
import "./syntax.ts";
import { buildObjects, type Direction } from "../engine/define.ts";
import { linkAdjacentTables } from "../engine/table.ts";
import { asObj, propDefaults } from "../engine/object.ts";
import { isFixedPitch, setGlobalsForValue, setTellHooks } from "../engine/runtime.ts";
import { registerGlobals, registerRoutines, restoreSnapshot, takeSnapshot, type Snapshot } from "../engine/state.ts";
import { Rng } from "../engine/rng.ts";
import { Machine, type GameHooks, type SaveStorage } from "../engine/machine.ts";

let pristine: Snapshot | null = null;

function initWorld(): void {
  if (pristine) {
    restoreSnapshot(pristine, new Rng(0));
    return;
  }
  propDefaults.set(P.SIZE, 5);
  propDefaults.set(P.CAPACITY, 5);
  const directions = Object.fromEntries(
    (["NORTH", "NE", "EAST", "SE", "SOUTH", "SW", "WEST", "NW", "UP", "DOWN", "IN", "OUT"] as Direction[]).map(
      (d) => [d, P[d]],
    ),
  ) as Record<Direction, number>;
  buildObjects({ SYNONYM: P.SYNONYM, ADJECTIVE: P.ADJECTIVE, GLOBAL: P.GLOBAL, THINGS: P.THINGS, directions });
  const modules = [misc, parser, verbs, globals, earth, mars, venus, cleveland, spaceship, phobos];
  const routines: Record<string, Function> = {};
  for (const m of modules) {
    for (const [name, v] of Object.entries(m)) if (typeof v === "function") routines[name] = v;
  }
  registerRoutines(routines);
  registerGlobals(G as unknown as Record<string, any>);
  setGlobalsForValue(G as unknown as Record<string, any>);
  setTellHooks({ D: misc.dprint, A: misc.aprint, T: misc.tprint, AR: misc.arprint, TR: misc.trprint });
  // In the original these input buffers were adjacent in memory, and NUMBER? can
  // read past the end of P-INBUF (when handed a stray pointer) into the others.
  linkAdjacentTables(parser.P_INBUF, parser.RESERVE_INBUF, parser.OOPS_INBUF);
  pristine = takeSnapshot(new Rng(0));
}

const hooks: GameHooks = {
  go: () => misc.go(),
  mainLoop: () => misc.mainLoop(),
  status: () => {
    const here = asObj(G.here, "status");
    return { location: here?.desc ?? "", score: Number(G.score) || 0, moves: Number(G.moves) || 0 };
  },
  fixedPitch: isFixedPitch,
};

/** Creates a new game session. Call start() on it to begin play. */
export function createGame(storage: SaveStorage, seed?: number): Machine {
  initWorld();
  const m = new Machine(hooks, storage, seed);
  m.init();
  return m;
}
