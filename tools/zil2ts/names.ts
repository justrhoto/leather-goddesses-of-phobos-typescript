// Identifier conventions for the TypeScript port.
//   routines & locals  FOO-BAR   -> fooBar     (FOO?  -> isFoo)
//   globals            FOO-BAR   -> G.fooBar
//   objects/constants  FOO-BAR   -> FOO_BAR

const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else",
  "enum", "export", "extends", "false", "finally", "for", "function", "if", "import", "in", "instanceof",
  "new", "null", "return", "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void",
  "while", "with", "yield", "let", "static", "implements", "interface", "package", "private", "protected",
  "public", "await", "arguments", "eval", "undefined", "NaN", "Infinity",
]);

function words(name: string): string[] {
  return name
    .replace(/\$/g, "-dollar-")
    .replace(/'/g, "")
    .split(/[-!:.]+/)
    .filter((w) => w.length > 0)
    .map((w) => w.toLowerCase());
}

/** fooBar style; a trailing '?' becomes an "is" prefix. */
export function camel(name: string): string {
  let base = name;
  let predicate = false;
  while (base.endsWith("?")) {
    base = base.slice(0, -1);
    predicate = true;
  }
  base = base.replace(/\?/g, "-q-");
  const parts = words(base);
  if (predicate) parts.unshift("is");
  let id = parts.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join("");
  if (/^\d/.test(id)) id = "n" + id;
  if (RESERVED.has(id)) id += "_";
  return id;
}

/** FOO_BAR style. */
export function screaming(name: string): string {
  let id = name
    .replace(/\?/g, "_Q")
    .replace(/\$/g, "DOLLAR_")
    .replace(/'/g, "")
    .replace(/[-!:.]+/g, "_")
    .replace(/_+$/g, (m) => m)
    .toUpperCase();
  if (/^\d/.test(id)) id = "N" + id;
  return id;
}

/** Key for a record like V.PUT_ON / W.EVERYT; returns ".KEY" or '["key"]'. */
export function member(name: string): string {
  const id = name.replace(/-/g, "_").toUpperCase();
  return /^[A-Z_$][A-Z0-9_$]*$/.test(id) ? `.${id}` : `[${JSON.stringify(name.toUpperCase())}]`;
}

export function memberKey(name: string): string {
  return name.replace(/-/g, "_").toUpperCase();
}
