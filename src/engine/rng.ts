// Seedable random number generator (xoshiro128**). Its whole state is part of
// every snapshot, so replaying a turn reproduces the same random outcomes.

export class Rng {
  s = new Uint32Array(4);

  constructor(seed = Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) {
    this.seed(seed);
  }

  seed(seed: number): void {
    // splitmix32 to spread the seed over the state
    let x = seed >>> 0;
    for (let i = 0; i < 4; i++) {
      x = (x + 0x9e3779b9) >>> 0;
      let z = x;
      z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
      z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
      this.s[i] = (z ^ (z >>> 16)) >>> 0;
    }
    if (!this.s.some((v) => v !== 0)) this.s[0] = 1;
  }

  nextU32(): number {
    const s = this.s;
    const result = Math.imul(rotl(Math.imul(s[1], 5), 7), 9) >>> 0;
    const t = (s[1] << 9) >>> 0;
    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];
    s[2] ^= t;
    s[3] = rotl(s[3], 11);
    return result;
  }

  /** Uniform integer in 1..n. */
  range(n: number): number {
    return 1 + Math.floor((this.nextU32() / 0x100000000) * n);
  }

  getState(): number[] {
    return [...this.s];
  }

  setState(state: number[]): void {
    this.s.set(state);
  }
}

function rotl(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}
