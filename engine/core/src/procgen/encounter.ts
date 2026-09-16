import type { EnemyDefinition } from "../types.js";
import type { RngStream } from "../rng/rng.js";

export interface EncounterHistoryEntry {
  readonly enemyId: string;
  readonly instinct: EnemyDefinition["instinct"];
}

/**
 * Seeded content selection. It never inspects the player's build.
 * It suppresses immediate repeats and prefers an Instinct not seen in the last two combats when possible.
 */
export function selectEncounter(
  pool: readonly EnemyDefinition[],
  history: readonly EncounterHistoryEntry[],
  rng: RngStream,
): EnemyDefinition {
  if (!pool.length) throw new Error("Encounter pool is empty");
  const last=history.at(-1);
  let candidates=last ? pool.filter((enemy)=>enemy.id!==last.enemyId) : [...pool];
  if (!candidates.length) candidates=[...pool];

  const recentInstincts=new Set(history.slice(-2).map((entry)=>entry.instinct));
  const diverse=candidates.filter((enemy)=>!recentInstincts.has(enemy.instinct));
  if (diverse.length) candidates=diverse;
  return rng.pick(candidates);
}
