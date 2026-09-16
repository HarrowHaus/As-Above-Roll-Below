import type { EnemyDefinition, FloorDefinition } from "../types.js";
import type { DescentDefinition } from "../procgen/descent.js";

export const latchling: EnemyDefinition = {
  id: "thresholds:latchling",
  maxHp: 5,
  dicePool: 2,
  instinct: "BOTH",
  xp: 1,
  coins: 2,
  tags: ["enemy:native", "floor:thresholds", "pressure:p1"],
};

/**
 * Legacy/debug graph definition retained for generator QA and future optional forks.
 * The production baseline client uses thresholdsDescent instead of exposing this graph.
 */
export const thresholdsFloor: FloorDefinition = {
  id: "thresholds",
  rows: [
    { allowedTypes: ["COMBAT"], minNodes: 2, maxNodes: 3 },
    { allowedTypes: ["COMBAT", "EVENT"], minNodes: 2, maxNodes: 3 },
    { allowedTypes: ["COMBAT", "ELITE", "SHOP"], minNodes: 2, maxNodes: 3 },
    { allowedTypes: ["COMBAT", "ELITE", "EVENT", "SHOP"], minNodes: 2, maxNodes: 3 },
  ],
  guarantees: {
    minCombatOpportunities: 2,
    eventOpportunity: true,
    shopOpportunity: true,
    eliteOptional: true,
  },
  bossId: "thresholds:first-door",
};

/**
 * Production-facing Floor I descent contract.
 * Six pre-boss Depths gives enough room for combat, loot, Event, Shop and optional Elite
 * without requiring map navigation. Exact count/order remains balance-tunable.
 */
export const thresholdsDescent: DescentDefinition = {
  id: "thresholds",
  slots: [
    { allowedTypes: ["COMBAT"] },
    { allowedTypes: ["COMBAT", "EVENT"] },
    { allowedTypes: ["COMBAT", "EVENT"] },
    { allowedTypes: ["COMBAT", "ELITE", "SHOP"] },
    { allowedTypes: ["COMBAT", "EVENT", "ELITE", "SHOP"] },
    { allowedTypes: ["COMBAT", "ELITE", "SHOP"] },
  ],
  guarantees: {
    minCombats: 3,
    minEvents: 1,
    minShops: 1,
    maxElites: 1,
    maxConsecutiveCombats: 3,
  },
  bossId: "thresholds:first-door",
};
