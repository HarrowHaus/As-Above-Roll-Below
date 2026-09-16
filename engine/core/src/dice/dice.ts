import type { DieId, DieState, DieValue } from "../types.js";
import type { RngStream } from "../rng/rng.js";

const OPPOSITE: Record<DieValue, DieValue> = { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };

export function assertDieValue(value: number): asserts value is DieValue {
  if (!Number.isInteger(value) || value < 1 || value > 6) throw new Error(`Invalid d6 value: ${value}`);
}

export function rollD6(rng: RngStream): DieValue {
  return rng.int(1, 6) as DieValue;
}

export function rollDice(rng: RngStream, count: number): DieValue[] {
  if (!Number.isInteger(count) || count < 0) throw new Error(`Invalid dice count: ${count}`);
  return Array.from({ length: count }, () => rollD6(rng));
}

export function createPlayerDice(rng: RngStream, round: number, count = 4): DieState[] {
  return rollDice(rng, count).map((value, index) => ({
    id: `r${round}:p${index}`,
    value,
    fixed: false,
    locked: false,
    tags: [],
  }));
}

export function bump(value: DieValue, delta: -1 | 1): DieValue {
  const next = Math.max(1, Math.min(6, value + delta));
  return next as DieValue;
}

export function flip(value: DieValue): DieValue {
  return OPPOSITE[value];
}

export function copyValue(source: DieValue): DieValue {
  return source;
}

export function transmute(value: number): DieValue {
  assertDieValue(value);
  return value;
}

export function withValue(die: DieState, value: DieValue): DieState {
  if (die.fixed) throw new Error(`Die ${die.id} is FIXED`);
  return { ...die, value };
}

export function withFixed(die: DieState, fixed = true): DieState {
  return { ...die, fixed };
}

export function withLocked(die: DieState, locked = true): DieState {
  return { ...die, locked };
}

export function findDie(dice: readonly DieState[], id: DieId): DieState {
  const die = dice.find((candidate) => candidate.id === id);
  if (!die) throw new Error(`Unknown die id ${id}`);
  return die;
}
