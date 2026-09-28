// Translates ZIL routine bodies into TypeScript.
import type { Node } from "./reader.ts";
import { zilStringText } from "./reader.ts";
import type { Program, RoutineDef } from "./analyze.ts";
import { camel, member } from "./names.ts";
import { SOURCE_FIXES } from "./overrides.ts";

// ---------------------------------------------------------------------------
// Symbol resolution shared by all modules

export type Where = { module: string; name: string }; // import source & exported identifier

export interface SymbolTable {
  /** ,X / bare X resolution; returns the TS expression and what to import. */
  gval(name: string): { c: string; imp?: Where } | null;
  routine(name: string): { ident: string; imp: Where } | null;
  isAssignedGlobal(name: string): boolean;
  globalKey(name: string): string;
  /** Inline tables found in routine bodies: returns the constant to reference. */
  inlineTable(node: Node, file: string): { c: string; imp?: Where };
  special(name: string): { c: string; imp: Where } | null;
}

export const RUNTIME = "../engine/runtime.ts";

type E = { c: string; p: number }; // code + precedence
const P_ATOM = 20, P_CALL = 19, P_UNARY = 15, P_MUL = 13, P_ADD = 12, P_REL = 10, P_BAND = 8,
  P_BOR = 6, P_AND = 5, P_OR = 4, P_ASSIGN = 2;

type Mode = { k: "stmt" } | { k: "tail" } | { k: "assign"; target: string };
interface Block {
  kind: "repeat" | "prog" | "routine";
  label: string;
  mode: Mode;
  isLoop: boolean; // rendered as a JS loop
  usedBreak: boolean;
  usedContinue: boolean;
}

const VALUELESS = new Set([
  "MOVE", "REMOVE", "FSET", "FCLEAR", "PUT", "PUTB", "PUTP", "CRLF", "PRINTI", "PRINTD", "PRINTB", "PRINTN",
  "PRINTC", "PRINT", "TELL", "USL", "BSET", "BCLEAR", "DIROUT", "DIRIN",
]);

export class Imports {
  private map = new Map<string, Set<string>>();
  add(w: Where | undefined): void {
    if (!w) return;
    if (!this.map.has(w.module)) this.map.set(w.module, new Set());
    this.map.get(w.module)!.add(w.name);
  }
  render(self: string): string {
    const lines: string[] = [];
    for (const [mod, names] of [...this.map].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (mod === self) continue;
      const list = [...names].sort();
      lines.push(`import {\n  ${wrap(list)}\n} from "${mod}";`);
    }
    return lines.join("\n");
  }
}

function wrap(list: string[]): string {
  const out: string[] = [];
  let line = "";
  for (const n of list) {
    if (line.length + n.length > 100) {
      out.push(line.trimEnd());
      line = "";
    }
    line += n + ", ";
  }
  if (line) out.push(line.trimEnd());
  return out.join("\n  ");
}

export class RoutineEmitter {
  private out: string[] = [];
  private depth = 1;
  private locals = new Map<string, string>(); // ZIL name -> TS ident
  private writeOnly = new Set<string>(); // AUX locals that are assigned but never read
  private blocks: Block[] = [];
  private tempCount = 0;
  private labelCount = 0;
  private tempDecls: string[] = [];
  readonly warnings: string[] = [];

  constructor(
    private readonly prog: Program,
    private readonly syms: SymbolTable,
    private readonly imports: Imports,
    private readonly r: RoutineDef,
    private readonly reserved: Set<string>,
  ) {}

  emit(exportName: string): string {
    const r = this.r;
    for (const p of [...r.required, ...r.optional, ...r.aux]) {
      let id = camel(p.name);
      while (this.reserved.has(id) || [...this.locals.values()].includes(id)) id += "_";
      this.locals.set(p.name, id);
    }
    const read = readNames(r.body, r.optional, r.aux);
    for (const p of [...r.required, ...r.optional]) {
      if (!read.has(p.name)) this.locals.set(p.name, "_" + this.locals.get(p.name));
    }
    for (const p of r.aux) if (!read.has(p.name)) this.writeOnly.add(p.name);
    const params = [
      ...r.required.map((p) => `${this.locals.get(p.name)}: any`),
      ...r.optional.map((p) => `${this.locals.get(p.name)}: any = ${p.init ? this.pure(p.init, "default") : "false"}`),
    ];
    const needsRestart = this.usesAgainAt(r.body, true);
    const root: Block = {
      kind: "routine", label: "restart", mode: { k: "tail" }, isLoop: needsRestart, usedBreak: false, usedContinue: false,
    };
    this.blocks.push(root);
    const auxLines: string[] = [];
    for (const p of r.aux) {
      if (this.writeOnly.has(p.name)) continue; // never read, so only its assignments' values matter
      auxLines.push(`let ${this.locals.get(p.name)}: any = ${p.init ? this.pure(p.init, "aux") : "0"};`);
    }
    if (needsRestart) this.depth++;
    this.body(r.body, { k: "tail" });
    if (needsRestart) this.depth--;
    const bodyLines = this.out;
    const ind = "  ";
    const lines: string[] = [];
    lines.push(`export function ${exportName}(${params.join(", ")}): any {`);
    for (const l of auxLines) lines.push(ind + l);
    for (const t of this.tempDecls) lines.push(ind + t);
    if (needsRestart) {
      lines.push(`${ind}restart: for (;;) {`);
      lines.push(...bodyLines);
      lines.push(`${ind}}`);
    } else lines.push(...bodyLines);
    lines.push("}");
    return lines.join("\n");
  }

  // -------------------------------------------------------------------------
  // helpers

  private line(s: string): void {
    this.out.push("  ".repeat(this.depth) + s);
  }

  private fail(n: Node, msg: string): never {
    throw new Error(`${this.r.file}.zil:${n.line} in ${this.r.name}: ${msg}`);
  }

  private temp(): string {
    const t = `_t${++this.tempCount}`;
    this.tempDecls.push(`let ${t}: any;`);
    return t;
  }

  private capture<T>(fn: () => T): { lines: string[]; value: T } {
    const saved = this.out;
    this.out = [];
    const value = fn();
    const lines = this.out;
    this.out = saved;
    return { lines, value };
  }

  private pure(n: Node, what: string): string {
    const { lines, value } = this.capture(() => this.expr(n));
    if (lines.length) this.fail(n, `${what} initializer needs statements`);
    return value.c;
  }

  private head(n: Node): string | null {
    return n.kind === "form" && n.items[0]?.kind === "atom" ? n.items[0].name : null;
  }

  /** Does the body contain an AGAIN that targets this level? */
  private usesAgainAt(body: Node[], _top: boolean): boolean {
    let found = false;
    const walk = (n: Node, nested: boolean) => {
      if (found) return;
      const h = this.head(n);
      if (h === "AGAIN" && !nested) found = true;
      const inner = h === "REPEAT" || h === "PROG";
      if (n.kind === "form" || n.kind === "list") for (const c of n.items) walk(c, nested || inner);
      if (n.kind === "macro") walk(this.macroSelect(n), nested);
    };
    for (const n of body) walk(n, false);
    return found;
  }

  /** %<COND (<GASSIGNED? ZILCH> 'x) (T 'y)> -> x (we are ZILCH). */
  private macroSelect(n: Node & { kind: "macro" }): Node {
    const f = n.node;
    if (this.head(f) === "COND" && f.kind === "form") {
      for (const clause of f.items.slice(1)) {
        if (clause.kind !== "list") continue;
        const test = clause.items[0];
        const ok =
          (test.kind === "atom" && (test.name === "T" || test.name === "ELSE")) ||
          (this.head(test) === "GASSIGNED?" && test.kind === "form" && test.items[1]?.kind === "atom" &&
            test.items[1].name === "ZILCH");
        if (ok) {
          const v = clause.items[clause.items.length - 1];
          return v.kind === "quote" ? v.node : v;
        }
      }
    }
    if (this.head(f) === "ASCII" && f.kind === "form" && f.items[1]?.kind === "char") {
      return { kind: "number", value: f.items[1].value.charCodeAt(0), line: n.line };
    }
    this.fail(n, "unsupported compile-time form");
  }

  // -------------------------------------------------------------------------
  // statements

  private body(nodes: Node[], mode: Mode): void {
    const list = nodes.filter((n) => !(n.kind === "string")); // stray doc strings
    if (list.length === 0) {
      this.finish(mode, "true");
      return;
    }
    list.forEach((n, i) => this.stmt(n, i === list.length - 1 ? mode : { k: "stmt" }));
  }

  /** Delivers a value according to the mode. */
  private finish(mode: Mode, code: string): void {
    if (mode.k === "tail") this.line(`return ${code};`);
    else if (mode.k === "assign") this.line(`${mode.target} = ${code};`);
    else if (!/^(true|false|\d+|_t\d+|[a-zA-Z_$][\w$]*)$/.test(code)) this.line(`${code};`);
  }

  private stmt(n: Node, mode: Mode): void {
    if (n.kind === "macro") return this.stmt(this.macroSelect(n), mode);
    const h = this.head(n);
    const items = n.kind === "form" ? n.items : [];
    switch (h) {
      case "COND":
        return this.cond(items.slice(1), mode, n);
      case "REPEAT":
      case "PROG":
        return this.loop(n as any, h, mode);
      case "RETURN":
        return this.returnForm(items, n);
      case "AGAIN": {
        const b = this.innermostBlock();
        b.usedContinue = true;
        this.line(b.kind === "routine" ? "continue restart;" : this.jump("continue", b));
        return;
      }
      case "RTRUE":
        return this.line("return true;");
      case "RFALSE":
        return this.line("return false;");
      case "RFATAL": {
        const c = this.syms.gval("M-FATAL")!;
        this.imports.add(c.imp);
        return this.line(`return ${c.c};`);
      }
      case "AND":
      case "OR":
        if (mode.k === "stmt") {
          // <AND a b c> as a statement: if (a && b) c; keep short-circuit semantics.
          const e = this.expr(n);
          this.line(`${e.c};`);
          return;
        }
        break;
    }
    if (h && VALUELESS.has(h)) {
      const e = this.expr(n);
      this.line(`${e.c};`);
      if (mode.k === "tail") this.line("return true;");
      else if (mode.k === "assign") this.line(`${mode.target} = true;`);
      return;
    }
    if (mode.k === "stmt" && (h === "SET" || h === "SETG")) {
      const e = this.expr(n);
      this.line(`${stripParens(e.c)};`);
      return;
    }
    const e = this.expr(n);
    if (mode.k === "stmt") {
      if (n.kind === "form") this.line(`${stripParens(e.c)};`);
      return;
    }
    this.finish(mode, stripParens(e.c));
  }

  private innermostBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /** break/continue to a block, labelled only when an inner loop is in the way. */
  private jump(kind: "break" | "continue", b: Block): string {
    const idx = this.blocks.indexOf(b);
    const innerLoop = this.blocks.slice(idx + 1).some((x) => x.isLoop);
    if (b.isLoop && !innerLoop) return `${kind};`;
    return `${kind} ${b.label};`;
  }

  private returnForm(items: Node[], n: Node): void {
    const b = this.innermostBlock();
    const val = items[1];
    if (b.kind === "routine" || b.mode.k === "tail") {
      const e = val ? this.expr(val) : { c: "true", p: P_ATOM };
      this.line(`return ${stripParens(e.c)};`);
      return;
    }
    if (b.mode.k === "assign") {
      const e = val ? this.expr(val) : { c: "true", p: P_ATOM };
      this.line(`${b.mode.target} = ${stripParens(e.c)};`);
    } else if (val) {
      const e = this.expr(val);
      if (val.kind === "form") this.line(`${stripParens(e.c)};`);
    }
    b.usedBreak = true;
    this.line(this.jump("break", b));
    void n;
  }

  private loop(n: Node & { kind: "form" }, kind: "REPEAT" | "PROG", mode: Mode): void {
    const bindings = n.items[1];
    if (!bindings || bindings.kind !== "list") this.fail(n, `${kind} without binding list`);
    if (bindings.items.length) this.fail(n, `${kind} bindings not supported`);
    const body = n.items.slice(2);
    const label = kind === "REPEAT" ? `loop${++this.labelCount}` : `block${++this.labelCount}`;
    const hasAgain = this.usesAgainAt(body, true);
    const isLoop = kind === "REPEAT" || hasAgain;
    const b: Block = { kind: kind === "REPEAT" ? "repeat" : "prog", label, mode, isLoop, usedBreak: false, usedContinue: false };
    this.blocks.push(b);
    const captured = this.capture(() => {
      this.depth++;
      if (kind === "REPEAT") this.body(body, { k: "stmt" });
      else {
        this.body(body, mode);
        if (hasAgain && mode.k !== "tail") this.line("break;");
      }
      this.depth--;
    });
    this.blocks.pop();
    const needLabel = captured.lines.some((l) => l.includes(` ${label};`));
    const prefix = needLabel ? `${label}: ` : "";
    if (!isLoop && !needLabel) {
      this.out.push(...captured.lines.map((l) => l.slice(2)));
      return;
    }
    if (isLoop) this.line(`${prefix}for (;;) {`);
    else this.line(`${prefix}{`);
    this.out.push(...captured.lines);
    this.line("}");
    if (kind === "REPEAT" && mode.k === "assign") {
      // a REPEAT's value comes only from RETURN
    }
  }

  // -------------------------------------------------------------------------
  // COND

  private cond(clauses: Node[], mode: Mode, n: Node): void {
    const cls = clauses.map((c) => {
      if (c.kind !== "list" || c.items.length === 0) this.fail(n, "bad COND clause");
      return c.items;
    });
    let hasElse = false;
    if (mode.k === "assign" && !cls.some(([p]) => p.kind === "atom" && (p.name === "T" || p.name === "ELSE"))) {
      this.line(`${mode.target} = false;`);
    }
    const emitFrom = (i: number, isElse: boolean) => {
      if (i >= cls.length) return;
      const [pred, ...body] = cls[i];
      const always = pred.kind === "atom" && (pred.name === "T" || pred.name === "ELSE");
      if (always) {
        hasElse = true;
        if (isElse) {
          this.out[this.out.length - 1] += " else {";
        } else this.line("{");
        this.depth++;
        this.body(body, mode);
        this.depth--;
        this.line("}");
        return;
      }
      const predCap = this.capture(() => this.test(pred, body.length === 0 && mode.k !== "stmt" ? mode : null));
      if (isElse) {
        if (predCap.lines.length) {
          this.out[this.out.length - 1] += " else {";
          this.depth++;
          for (const l of predCap.lines) this.out.push("  " + l);
          this.line(`if (${predCap.value}) {`);
        } else {
          this.out[this.out.length - 1] += ` else if (${predCap.value}) {`;
        }
      } else {
        this.out.push(...predCap.lines);
        this.line(`if (${predCap.value}) {`);
      }
      this.depth++;
      if (body.length === 0) {
        if (mode.k === "tail") this.line(`return ${this.lastTestValue ?? "true"};`);
        else if (mode.k === "assign" && !this.lastTestValue) this.line(`${mode.target} = true;`);
      } else this.body(body, mode);
      this.depth--;
      this.line("}");
      emitFrom(i + 1, true);
      if (isElse && predCap.lines.length) {
        this.depth--;
        this.line("}");
      }
    };
    emitFrom(0, false);
    if (!hasElse && mode.k === "tail") this.line("return false;");
  }

  private lastTestValue: string | null = null;

  /**
   * A COND predicate. When the clause has no body its value is the clause's
   * value, so non-boolean predicates are captured into a temporary.
   */
  private test(pred: Node, valueMode: Mode | null): string {
    const e = this.expr(pred);
    this.lastTestValue = null;
    if (!valueMode || isBooleanExpr(pred, this.head(pred))) return stripParens(e.c);
    if (valueMode.k === "assign") {
      this.lastTestValue = valueMode.target;
      return `(${valueMode.target} = ${stripParens(e.c)})`;
    }
    const t = this.temp();
    this.lastTestValue = t;
    return `(${t} = ${stripParens(e.c)})`;
  }

  // -------------------------------------------------------------------------
  // expressions

  /** Evaluates args left to right, hoisting earlier ones if a later one emits statements. */
  private args(nodes: Node[]): E[] {
    const results: E[] = [];
    for (const n of nodes) {
      const cap = this.capture(() => this.expr(n));
      if (cap.lines.length) {
        for (let i = 0; i < results.length; i++) {
          if (/[(=]/.test(results[i].c)) {
            const t = this.temp();
            this.line(`${t} = ${stripParens(results[i].c)};`);
            results[i] = { c: t, p: P_ATOM };
          }
        }
        this.out.push(...cap.lines);
      }
      results.push(cap.value);
    }
    return results;
  }

  private statementValue(n: Node): E {
    const t = this.temp();
    this.stmt(n, { k: "assign", target: t });
    return { c: t, p: P_ATOM };
  }

  expr(n: Node): E {
    switch (n.kind) {
      case "number":
        return { c: String(n.value), p: n.value < 0 ? P_UNARY : P_ATOM };
      case "string": {
        const text = zilStringText(n.value);
        if (text === "") {
          this.imports.add({ module: RUNTIME, name: "EMPTY" });
          return { c: "EMPTY", p: P_ATOM };
        }
        return { c: JSON.stringify(text), p: P_ATOM };
      }
      case "lval": {
        const id = this.locals.get(n.name);
        if (!id) this.fail(n, `.${n.name} is not a local`);
        return { c: id, p: P_ATOM };
      }
      case "gval":
        return this.gval(n.name, n);
      case "atom":
        return this.atomValue(n.name, n);
      case "quote":
        return this.expr(n.node);
      case "macro":
        return this.expr(this.macroSelect(n));
      case "char":
        return { c: String(n.value.charCodeAt(0)), p: P_ATOM };
      case "form":
        return this.form(n);
      default:
        this.fail(n, `unsupported ${n.kind} in expression`);
    }
  }

  private gval(name: string, n: Node): E {
    const fix = SOURCE_FIXES[`${this.r.name} ,${name}`];
    if (fix) name = fix.use;
    const local = this.locals.get(name);
    if (local && !this.syms.gval(name)) return { c: local, p: P_ATOM };
    const s = this.syms.gval(name);
    if (!s) this.fail(n, `unknown global ,${name}`);
    this.imports.add(s.imp);
    return { c: s.c, p: s.c.includes(" ") ? P_ASSIGN : P_ATOM };
  }

  private atomValue(name: string, n: Node): E {
    if (name === "T" || name === "ELSE") return { c: "true", p: P_ATOM };
    const r = this.syms.routine(name);
    if (r) {
      this.imports.add(r.imp);
      return { c: r.ident, p: P_ATOM };
    }
    const s = this.syms.gval(name);
    if (s) {
      this.imports.add(s.imp);
      return { c: s.c, p: P_ATOM };
    }
    this.fail(n, `unknown atom ${name}`);
  }

  private rt(name: string): string {
    this.imports.add({ module: RUNTIME, name });
    return name;
  }

  private call(fn: string, args: E[]): E {
    return { c: `${fn}(${args.map((a) => stripParens(a.c)).join(", ")})`, p: P_CALL };
  }

  private varTarget(n: Node, global: boolean): string {
    const name = n.kind === "atom" ? n.name : n.kind === "lval" || n.kind === "gval" ? n.name : null;
    if (!name) this.fail(n, "bad assignment target");
    if (!global && this.locals.has(name)) return this.locals.get(name)!;
    if (!this.syms.isAssignedGlobal(name)) this.fail(n, `assignment to unknown global ${name}`);
    this.imports.add({ module: "./world.ts", name: "G" });
    return `G.${this.syms.globalKey(name)}`;
  }

  private form(n: Node & { kind: "form" }): E {
    const items = n.items;
    if (items.length === 0) return { c: "false", p: P_ATOM };
    const h = this.head(n);
    if (!h) this.fail(n, "form without an atom head");
    const a = items.slice(1);
    const bin = (op: string, p: number, left = true): E => {
      const [x, y] = this.args(a);
      return { c: `${paren(x, left ? p : p + 1)} ${op} ${paren(y, left ? p + 1 : p)}`, p };
    };
    switch (h) {
      // ---- control forms used as values
      case "COND":
      case "REPEAT":
      case "PROG":
        return this.statementValue(n);
      case "AND":
      case "OR":
        return this.andOr(h, a);
      case "NOT":
        return { c: `!${paren(this.expr(a[0]), P_UNARY)}`, p: P_UNARY };
      case "RTRUE":
      case "RFALSE":
      case "RETURN":
      case "RFATAL":
      case "AGAIN": {
        this.stmt(n, { k: "stmt" });
        return { c: "false", p: P_ATOM };
      }

      // ---- comparison
      case "EQUAL?":
      case "==?": {
        const xs = this.args(a);
        return this.call(this.rt("eq"), xs);
      }
      case "N==?": {
        const xs = this.args(a);
        return { c: `!${this.call(this.rt("eq"), xs).c}`, p: P_UNARY };
      }
      case "ZERO?":
      case "0?":
        return { c: `!${paren(this.expr(a[0]), P_UNARY)}`, p: P_UNARY };
      case "1?":
        return this.call(this.rt("eq"), [this.expr(a[0]), { c: "1", p: P_ATOM }]);
      case "L?":
        return bin("<", P_REL);
      case "G?":
        return bin(">", P_REL);
      case "L=?":
        return bin("<=", P_REL);
      case "G=?":
        return bin(">=", P_REL);

      // ---- arithmetic
      case "+": {
        const xs = this.args(a);
        return { c: xs.map((x, i) => paren(x, i === 0 ? P_ADD : P_ADD + 1)).join(" + "), p: P_ADD };
      }
      case "-": {
        const xs = this.args(a);
        if (xs.length === 1) return { c: `-${paren(xs[0], P_UNARY)}`, p: P_UNARY };
        return { c: xs.map((x, i) => paren(x, i === 0 ? P_ADD : P_ADD + 1)).join(" - "), p: P_ADD };
      }
      case "*": {
        const xs = this.args(a);
        return { c: xs.map((x, i) => paren(x, i === 0 ? P_MUL : P_MUL + 1)).join(" * "), p: P_MUL };
      }
      case "/":
        return this.call(this.rt("div"), this.args(a));
      case "MOD":
        return bin("%", P_MUL);
      case "BAND":
        return bin("&", P_BAND);
      case "BOR":
        return bin("|", P_BOR);
      case "BCOM":
        return { c: `~${paren(this.expr(a[0]), P_UNARY)}`, p: P_UNARY };
      case "BTST":
        return this.call(this.rt("btst"), this.args(a));

      // ---- variables
      case "SET":
      case "SETG": {
        if (h === "SET" && a[0].kind === "atom" && this.writeOnly.has(a[0].name)) return this.expr(a[1]);
        const target = this.varTarget(a[0], h === "SETG");
        const v = this.expr(a[1]);
        return { c: `(${target} = ${stripParens(v.c)})`, p: P_ATOM };
      }
      case "IGRTR?":
      case "DLESS?": {
        const target = this.varTarget(a[0], false);
        const lim = this.expr(a[1]);
        return h === "IGRTR?"
          ? { c: `++${target} > ${paren(lim, P_REL + 1)}`, p: P_REL }
          : { c: `--${target} < ${paren(lim, P_REL + 1)}`, p: P_REL };
      }
      case "VALUE":
        return this.call(this.rt("value"), this.args(a));

      // ---- macros from MISC
      case "VERB?":
      case "PRSO?":
      case "PRSI?":
      case "ROOM?": {
        const fn = { "VERB?": "verbIs", "PRSO?": "prsoIs", "PRSI?": "prsiIs", "ROOM?": "hereIs" }[h];
        this.imports.add({ module: "./world.ts", name: fn });
        const xs =
          h === "VERB?"
            ? a.map((x) => {
                if (x.kind !== "atom") this.fail(n, "VERB? takes atoms");
                const s = this.syms.special(`V?${x.name}`);
                if (!s) this.fail(n, `unknown action ${x.name}`);
                this.imports.add(s.imp);
                return { c: s.c, p: P_ATOM };
              })
            : this.args(a);
        return this.call(fn, xs);
      }
      case "BSET":
      case "BCLEAR": {
        const fn = this.rt(h === "BSET" ? "setFlag" : "clearFlag");
        const [obj, ...bits] = this.args(a);
        return { c: bits.map((b) => `${fn}(${obj.c}, ${b.c})`).join(", "), p: P_ASSIGN };
      }
      case "BSET?": {
        const fn = this.rt("hasFlag");
        const [obj, ...bits] = this.args(a);
        return { c: bits.map((b) => `${fn}(${obj.c}, ${b.c})`).join(" || "), p: P_OR };
      }
      case "PROB":
        return this.call(this.rt("prob"), this.args(a));

      // ---- objects
      case "FSET?":
        return this.call(this.rt("hasFlag"), this.args(a));
      case "FSET":
        return this.call(this.rt("setFlag"), this.args(a));
      case "FCLEAR":
        return this.call(this.rt("clearFlag"), this.args(a));
      case "IN?":
        return this.call(this.rt("isIn"), this.args(a));
      case "LOC":
        return this.call(this.rt("loc"), this.args(a));
      case "FIRST?":
        return this.call(this.rt("first"), this.args(a));
      case "NEXT?":
        return this.call(this.rt("next"), this.args(a));
      case "MOVE":
        return this.call(this.rt("move"), this.args(a));
      case "REMOVE":
        return this.call(this.rt("remove"), this.args(a));
      case "GETP":
        return this.call(this.rt("getp"), this.args(a));
      case "PUTP":
        return this.call(this.rt("putp"), this.args(a));
      case "GETPT":
        return this.call(this.rt("getpt"), this.args(a));
      case "PTSIZE":
        return this.call(this.rt("ptsize"), this.args(a));
      case "NEXTP":
        return this.call(this.rt("nextp"), this.args(a));

      // ---- tables
      case "GET":
      case "PUT":
      case "GETB":
      case "PUTB":
      case "REST":
      case "BACK": {
        const fn = this.rt(h.toLowerCase());
        const xs = this.args(a);
        if (a[0].kind === "number" && a[0].value === 0) xs[0] = { c: this.rt("HEADER"), p: P_ATOM };
        return this.call(fn, xs);
      }
      case "TABLE":
      case "LTABLE":
      case "ITABLE":
      case "PTABLE":
      case "PLTABLE": {
        const t = this.syms.inlineTable(n, this.r.file);
        this.imports.add(t.imp);
        return { c: t.c, p: P_ATOM };
      }

      // ---- output
      case "TELL":
        return this.tell(a, n);
      case "PRINTI":
      case "PRINT":
        return this.call(this.rt("print"), this.args(a));
      case "PRINTD":
        return this.call(this.rt("printd"), this.args(a));
      case "PRINTB":
        return this.call(this.rt("printb"), this.args(a));
      case "PRINTN":
        return this.call(this.rt("printn"), this.args(a));
      case "PRINTC":
        return this.call(this.rt("printc"), this.args(a));
      case "CRLF":
        return this.call(this.rt("crlf"), []);
      case "USL":
        return this.call(this.rt("usl"), []);

      // ---- system
      case "READ":
        return this.call(this.rt("read"), this.args(a));
      case "SAVE":
      case "RESTORE":
      case "RESTART":
      case "QUIT":
      case "VERIFY":
      case "RANDOM":
      case "DIROUT":
      case "DIRIN":
        return this.call(this.rt(h.toLowerCase()), this.args(a));
      case "APPLY":
        return this.call(this.rt("apply"), this.args(a));
      case "ASCII":
        if (a[0]?.kind === "char") return { c: String(a[0].value.charCodeAt(0)), p: P_ATOM };
        this.fail(n, "bad ASCII");
    }
    // ---- routine call
    const r = this.syms.routine(h);
    if (r) {
      this.imports.add(r.imp);
      const def = this.prog.routines.get(h)!;
      const max = def.required.length + def.optional.length;
      if (a.length < def.required.length || a.length > max) {
        this.warnings.push(`${this.r.name}: call to ${h} with ${a.length} args (expects ${def.required.length}..${max})`);
      }
      return this.call(r.ident, this.args(a));
    }
    this.fail(n, `unknown form <${h} ...>`);
  }

  private andOr(h: "AND" | "OR", a: Node[]): E {
    if (a.length === 0) return { c: h === "AND" ? "true" : "false", p: P_ATOM };
    const parts = a.map((x) => this.capture(() => this.expr(x)));
    const op = h === "AND" ? " && " : " || ";
    const p = h === "AND" ? P_AND : P_OR;
    if (parts.slice(1).every((x) => x.lines.length === 0)) {
      this.out.push(...parts[0].lines);
      return { c: parts.map((x) => paren(x.value, p + 1)).join(op), p };
    }
    // Some operand needs statements: evaluate step by step into a temporary.
    const t = this.temp();
    this.out.push(...parts[0].lines);
    this.line(`${t} = ${stripParens(parts[0].value.c)};`);
    let opened = 0;
    for (const x of parts.slice(1)) {
      this.line(h === "AND" ? `if (${t}) {` : `if (!${t}) {`);
      this.depth++;
      opened++;
      this.out.push(...x.lines.map((l) => "  " + l));
      this.line(`${t} = ${stripParens(x.value.c)};`);
    }
    for (let i = 0; i < opened; i++) {
      this.depth--;
      this.line("}");
    }
    return { c: t, p: P_ATOM };
  }

  private tell(a: Node[], n: Node): E {
    const parts: string[] = [];
    let lit = "";
    const flush = () => {
      if (lit) parts.push(JSON.stringify(lit));
      lit = "";
    };
    const tokenNames = new Set(["D", "A", "T", "AR", "TR", "N", "C"]);
    for (let i = 0; i < a.length; i++) {
      const x = a[i];
      if (x.kind === "atom" && (x.name === "CR" || x.name === "CRLF")) {
        lit += "\n";
        continue;
      }
      if (x.kind === "string") {
        const text = zilStringText(x.value);
        lit += text;
        continue;
      }
      if (x.kind === "atom" && tokenNames.has(x.name)) {
        flush();
        const v = this.tellValue(a[++i], n);
        parts.push(`${this.rt(x.name)}(${v})`);
        continue;
      }
      if (x.kind === "quote") {
        flush();
        parts.push(`${this.rt("PD")}(${this.tellValue(x.node, n)})`);
        continue;
      }
      flush();
      if (x.kind === "form" && this.isCall(x)) {
        const cap = this.capture(() => this.expr(x));
        if (cap.lines.length) this.fail(n, "TELL argument needs statements");
        parts.push(`() => ${stripParens(cap.value.c)}`);
      } else parts.push(this.tellValue(x, n));
    }
    flush();
    return { c: `${this.rt("tell")}(${parts.join(", ")})`, p: P_CALL };
  }

  private tellValue(x: Node, n: Node): string {
    const cap = this.capture(() => this.expr(x));
    if (cap.lines.length) this.fail(n, "TELL argument needs statements");
    return stripParens(cap.value.c);
  }

  /** Is this form a call to a game routine (which may print, so must run in order)? */
  private isCall(x: Node & { kind: "form" }): boolean {
    const h = this.head(x);
    return !!h && !!this.syms.routine(h);
  }
}

function isBooleanExpr(n: Node, h: string | null): boolean {
  if (n.kind !== "form" || !h) return false;
  return [
    "EQUAL?", "==?", "N==?", "ZERO?", "0?", "1?", "L?", "G?", "L=?", "G=?", "NOT", "FSET?", "IN?", "VERB?",
    "PRSO?", "PRSI?", "ROOM?", "BTST", "IGRTR?", "DLESS?", "PROB", "BSET?",
  ].includes(h);
}

function paren(e: E, min: number): string {
  return e.p < min ? `(${stripParens(e.c)})` : e.c;
}

/** Removes one level of redundant outer parentheses. */
export function stripParens(c: string): string {
  if (!c.startsWith("(") || !c.endsWith(")")) return c;
  let depth = 0;
  for (let i = 0; i < c.length; i++) {
    const ch = c[i];
    if (ch === '"') {
      for (i++; i < c.length && c[i] !== '"'; i++) if (c[i] === "\\") i++;
      continue;
    }
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0 && i < c.length - 1) return c;
    }
  }
  return c.slice(1, -1);
}

export { member };

/** Local names whose value is read somewhere (.X). */
function readNames(body: Node[], optional: { init?: Node }[], aux: { init?: Node }[]): Set<string> {
  const s = new Set<string>();
  const walk = (n: Node) => {
    if (n.kind === "lval") s.add(n.name);
    if (n.kind === "form" && n.items[0]?.kind === "atom" && ["IGRTR?", "DLESS?"].includes(n.items[0].name)) {
      const t = n.items[1];
      if (t?.kind === "atom") s.add(t.name);
    }
    if (n.kind === "form" || n.kind === "list" || n.kind === "vector") n.items.forEach(walk);
    if (n.kind === "macro") walk(zilchBranch(n.node));
    else if (n.kind === "quote" || n.kind === "segment" || n.kind === "hash") walk(n.node);
  };
  body.forEach(walk);
  [...optional, ...aux].forEach((p) => p.init && walk(p.init));
  return s;
}

/** The branch of a %<COND (<GASSIGNED? ZILCH> ...) ...> form that ZILCH compiled. */
function zilchBranch(f: Node): Node {
  if (f.kind === "form" && f.items[0]?.kind === "atom" && f.items[0].name === "COND") {
    for (const c of f.items.slice(1)) {
      if (c.kind !== "list") continue;
      const t = c.items[0];
      const ok = (t.kind === "atom" && (t.name === "T" || t.name === "ELSE")) ||
        (t.kind === "form" && t.items[0]?.kind === "atom" && t.items[0].name === "GASSIGNED?");
      if (ok) {
        const v = c.items[c.items.length - 1];
        return v.kind === "quote" ? v.node : v;
      }
    }
  }
  return f;
}
