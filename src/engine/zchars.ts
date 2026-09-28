// Version-3 dictionary word encoding. The original game only distinguished the
// first six "Z-characters" of a word (letters cost one, digits and common
// punctuation two, anything else four), so "flashlight" and "flashl" are the
// same word. The port keys its dictionary the same way.

const A2 = "\n0123456789.,!?_#'\"/\\-:()"; // alphabet 2, starting at Z-char 7

function zcharsFor(ch: string): number[] {
  const c = ch.toLowerCase();
  if (c >= "a" && c <= "z") return [c.charCodeAt(0) - 97 + 6];
  const i = A2.indexOf(c);
  if (i >= 0) return [5, i + 7];
  const code = c.charCodeAt(0) & 0x3ff;
  return [5, 6, code >> 5, code & 31];
}

/** Returns the six Z-characters a word is stored as (padded with 5s). */
export function encodeDictWord(text: string): number[] {
  const z: number[] = [];
  for (const ch of text) {
    z.push(...zcharsFor(ch));
    if (z.length >= 6) break;
  }
  while (z.length < 6) z.push(5);
  return z.slice(0, 6);
}

/** Canonical dictionary key for a word. */
export function dictKey(text: string): string {
  return encodeDictWord(text).join(".");
}

/** The text the original game would print for a dictionary word (PRINTB). */
export function dictText(text: string): string {
  const z = encodeDictWord(text);
  let out = "";
  for (let i = 0; i < z.length; i++) {
    const c = z[i];
    if (c >= 6) out += String.fromCharCode(97 + c - 6);
    else if (c === 5) {
      if (i + 1 >= z.length) break;
      const n = z[++i];
      if (n === 6) {
        if (i + 2 >= z.length) break;
        out += String.fromCharCode((z[i + 1] << 5) | z[i + 2]);
        i += 2;
      } else if (n >= 7) out += A2[n - 7];
      else if (n === 5) break; // padding
    }
  }
  return out;
}
