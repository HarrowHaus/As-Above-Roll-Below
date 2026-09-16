import type { CombatState } from "../types.js";
import { updatePlayerDie } from "./combat.js";
import { withFixed } from "../dice/dice.js";

export type CastConstraintAction =
  | { readonly type:"FIX_LOWEST_PLAYER_DIE" }
  | { readonly type:"FIX_HIGHEST_PLAYER_DIE" };

export interface CastConstraintDefinition {
  readonly id:string;
  readonly sourceId:string;
  readonly actions:readonly CastConstraintAction[];
}

export interface CastConstraintLogEntry {
  readonly constraintId:string;
  readonly sourceId:string;
  readonly dieId:string;
  readonly action:CastConstraintAction["type"];
}

export interface CastConstraintResult {
  readonly state:CombatState;
  readonly log:readonly CastConstraintLogEntry[];
}

export function applyPlayerCastConstraints(
  state:CombatState,
  definitions:readonly CastConstraintDefinition[],
):CastConstraintResult {
  let next=state;
  const log:CastConstraintLogEntry[]=[];
  for(const definition of definitions){
    for(const action of definition.actions){
      if(next.playerRoll.length===0) continue;
      const values=next.playerRoll.map((die)=>die.value);
      const targetValue=action.type==="FIX_LOWEST_PLAYER_DIE"?Math.min(...values):Math.max(...values);
      const target=next.playerRoll.find((die)=>die.value===targetValue);
      if(!target) throw new Error(`Constraint ${definition.id} could not find target die`);
      next=updatePlayerDie(next,withFixed(target,true));
      log.push({constraintId:definition.id,sourceId:definition.sourceId,dieId:target.id,action:action.type});
    }
  }
  return {state:next,log};
}
