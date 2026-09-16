import type { EnemyDefinition, FloorDefinition } from "../types.js";

export const latchling: EnemyDefinition = {
  id: "thresholds:latchling",
  maxHp: 5,
  dicePool: 2,
  instinct: "BOTH",
  xp: 1,
  coins: 2,
  tags: ["enemy:native", "floor:thresholds", "pressure:p1"],
};

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
