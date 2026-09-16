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
 * Debug/simulation graph projection of the production descent.
 * Exactly one node exists at each pre-boss Depth, so graph consumers measure the
 * same sequential cadence without exposing player-facing map navigation.
 */
export const thresholdsFloor: FloorDefinition = {
  id: "thresholds",
  rows: [
    { allowedTypes: ["COMBAT"], minNodes: 1, maxNodes: 1 },
    { allowedTypes: ["COMBAT", "EVENT"], minNodes: 1, maxNodes: 1 },
    { allowedTypes: ["COMBAT", "EVENT"], minNodes: 1, maxNodes: 1 },
    { allowedTypes: ["COMBAT", "SHOP"], minNodes: 1, maxNodes: 1 },
    { allowedTypes: ["COMBAT", "ELITE"], minNodes: 1, maxNodes: 1 },
    { allowedTypes: ["COMBAT", "SHOP"], minNodes: 1, maxNodes: 1 },
  ],
  guarantees: {
    minCombatOpportunities: 3,
    eventOpportunity: true,
    shopOpportunity: true,
    eliteOptional: false,
  },
  bossId: "thresholds:first-door",
};

/**
 * Production-facing Floor I descent contract.
 * Six pre-boss Depths gives enough room for combat, loot, Event, Shop and an
 * optional Elite without requiring map navigation. Exact count remains provisional.
 */
export const thresholdsDescent: DescentDefinition = {
  id: "thresholds",
  slots: [
    { allowedTypes: ["COMBAT"] },
    { allowedTypes: ["COMBAT", "EVENT"] },
    { allowedTypes: ["COMBAT", "EVENT"] },
    { allowedTypes: ["COMBAT", "SHOP"] },
    { allowedTypes: ["COMBAT", "ELITE"] },
    { allowedTypes: ["COMBAT", "SHOP"] },
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
