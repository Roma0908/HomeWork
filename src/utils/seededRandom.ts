/**
 * Deterministic PRNG using Mulberry32 algorithm
 * Guarantees that the same seed produces identical case generation results.
 */
export const GENERATOR_VERSION = '1.2.0';

export class SeededRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed?: number | string) {
    if (typeof seed === 'string') {
      this.state = SeededRNG.hashString(seed);
    } else if (typeof seed === 'number') {
      this.state = seed >>> 0;
    } else {
      this.state = Math.floor(Math.random() * 0xffffffff) >>> 0;
    }
    if (this.state === 0) {
      this.state = 1337;
    }
    this.initialSeed = this.state;
  }

  public static hashString(str: string): number {
    let hash = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
      hash = (hash << 13) | (hash >>> 19);
    }
    return hash >>> 0;
  }

  /**
   * Mulberry32 step
   * Returns a 32-bit unsigned float between [0, 1)
   */
  public nextFloat(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let z = this.state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(min + this.nextFloat() * (max - min + 1));
  }

  public pick<T>(arr: T[]): T {
    if (arr.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    return arr[this.nextInt(0, arr.length - 1)];
  }

  public shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Selects an item using normalized cumulative weighted probabilities
   */
  public weightedPick<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length || items.length === 0) {
      throw new Error('Items and weights must have matching non-zero lengths');
    }

    const safeWeights = weights.map((w) => Math.max(0, w));
    const totalWeight = safeWeights.reduce((acc, w) => acc + w, 0);

    if (totalWeight <= 0) {
      return this.pick(items); // fallback uniform
    }

    const randomVal = this.nextFloat() * totalWeight;
    let accumulated = 0;

    for (let i = 0; i < items.length; i++) {
      accumulated += safeWeights[i];
      if (randomVal <= accumulated) {
        return items[i];
      }
    }

    return items[items.length - 1];
  }

  public getSeed(): number {
    return this.initialSeed;
  }

  public getFormattedSeed(): string {
    return `CV-${this.initialSeed.toString(16).toUpperCase().padStart(8, '0')}`;
  }
}
