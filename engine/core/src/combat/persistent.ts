import type { CombatantState, CombatState, EnemyDefinition } from "../types.js";
import { createCombat } from "./combat.js";

/** Start a combat from persistent run HP without refilling the player. */
export function createCombatFromPlayerState(player: CombatantState, enemy: EnemyDefinition): CombatState {
  if (player.maxHp <= 0 || player.hp <= 0 || player.hp > player.maxHp) throw new Error("Invalid persistent player HP state");
  const base=createCombat(player.maxHp,enemy);
  return {...base,player:{hp:player.hp,maxHp:player.maxHp}};
}
