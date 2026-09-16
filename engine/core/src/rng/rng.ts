function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export interface RngSnapshot {
  readonly seed: number;
  readonly state: number;
}

/**
 * Small deterministic PRNG with explicit serializable state.
 * The algorithm is part of the replay contract: change only with a save-version migration.
 */
export class RngStream {
  readonly seed: number;
  private state: number;

  constructor(seed: number, state = seed) {
    this.seed = seed >>> 0;
    this.state = state >>> 0;
  }

  static fromMaster(masterSeed: string | number, streamName: string): RngStream {
    const seed = fnv1a32(`${String(masterSeed)}::${streamName}`);
    return new RngStream(seed || 0x6d2b79f5);
  }

  nextUint32(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  }

  nextFloat(): number {
    return this.nextUint32() / 0x1_0000_0000;
  }

  int(minInclusive: number, maxInclusive: number): number {
    if (!Number.isInteger(minInclusive) || !Number.isInteger(maxInclusive) || maxInclusive < minInclusive) {
      throw new Error(`Invalid integer range ${minInclusive}..${maxInclusive}`);
    }
    const span = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(this.nextFloat() * span);
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error("Cannot pick from an empty collection");
    return items[this.int(0, items.length - 1)]!;
  }

  shuffle<T>(items: readonly T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    return out;
  }

  snapshot(): RngSnapshot {
    return { seed: this.seed, state: this.state };
  }

  static restore(snapshot: RngSnapshot): RngStream {
    return new RngStream(snapshot.seed, snapshot.state);
  }
}

export class RngService {
  private readonly masterSeed: string | number;
  private readonly streams = new Map<string, RngStream>();

  constructor(masterSeed: string | number) {
    this.masterSeed = masterSeed;
  }

  stream(name: string): RngStream {
    let stream = this.streams.get(name);
    if (!stream) {
      stream = RngStream.fromMaster(this.masterSeed, name);
      this.streams.set(name, stream);
    }
    return stream;
  }
}
