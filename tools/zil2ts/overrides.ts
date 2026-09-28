// Hand-written replacements for the few routines that talk to the hardware
// or rely on Z-machine memory layout in ways that have no direct equivalent.
import type { Where } from "./emit.ts";

export interface Override {
  comment?: string;
  code: string;
  imports: Where[];
}

const RT = "../engine/runtime.ts";
const M = "../engine/machine.ts";

export const OVERRIDES: Record<string, Override> = {
  "MAIN-LOOP": {
    comment: "/** MAIN-LOOP: each pass is one turn; the machine checkpoints at the top of every pass. */",
    code: `
export function mainLoop(): any {
  for (;;) {
    machine().turnBoundary();
    mainLoop1();
  }
}`,
    imports: [{ module: M, name: "machine" }],
  },

  "CLEAR-SCREEN": {
    comment: "/** CLEAR-SCREEN: the original scrolled 24 blank lines; the browser clears the story view. */",
    code: `
export function clearScreen(): any {
  return rtClearScreen();
}`,
    imports: [{ module: RT, name: "clearScreen as rtClearScreen" }],
  },
};

/**
 * References in the original that have no meaningful value. Each is listed in
 * PORTING.md. Maps "ROUTINE ,NAME" to the global used instead.
 */
export const SOURCE_FIXES: Record<string, { use: string; why: string }> = {
  "V-UNCOVER ,OBJECT": {
    use: "PRSO",
    why: "OBJECT is undefined in the source; ZILCH assembled it as the object table's address, so the original performed UNDRESS on a garbage object number. PRSO is the evident intent.",
  },
};
