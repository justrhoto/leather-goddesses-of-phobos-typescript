import { describe, expect, it } from "vitest";
import { runWalkthrough } from "./walkthrough-runner.ts";
import { WALKTHROUGH } from "./walkthrough.ts";

describe("complete playthrough", () => {
  for (const seed of [1, 2, 3, 4, 5]) {
    it(`wins the game (seed ${seed})`, () => {
      const r = runWalkthrough(WALKTHROUGH, seed);
      expect(r.failure).toBeUndefined();
      expect(r.transcript).toContain("Earth is safe from the threat of the Leather Goddesses of Phobos");
      // A perfect game earns the top rank, and the score equals the (joke) maximum.
      expect(r.transcript).toMatch(/call it (\d+) out of \1 points\. This gives you the rank of Interplanetary Emperor/);
    });
  }
});
