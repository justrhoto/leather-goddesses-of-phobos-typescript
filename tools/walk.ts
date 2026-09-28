// Runs the walkthrough and prints the transcript.
//   npx tsx tools/walk.ts [seed] [--from N] [--then "cmd; cmd; ..."]
// --from N prints only from the Nth-last command on; --then appends commands.
import { runWalkthrough, type Step } from "../tests/walkthrough-runner.ts";
import { WALKTHROUGH } from "../tests/walkthrough.ts";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const seed = Number(args[0] && !args[0].startsWith("--") ? args[0] : 1);
const extra: Step[] = (opt("--then") ?? "").split(";").map((s) => s.trim()).filter(Boolean);
const from = Number(opt("--from") ?? 0);
const r = runWalkthrough([...WALKTHROUGH, ...extra], seed);
let text = r.transcript;
if (from) {
  const parts = text.split(/\n(?=>)/);
  text = parts.slice(-from).join("\n");
}
console.log(text);
console.log(`\n=== score ${r.score}, moves ${r.moves}, ended ${r.ended}${r.failure ? `, FAILED ${r.failure}` : ""}`);
