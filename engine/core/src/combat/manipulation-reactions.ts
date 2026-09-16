import type { CombatState, DieValue } from "../types.js";
import type { EffectDefinition } from "../effects/effects.js";
import { bump } from "../dice/dice.js";

export type ManipulationReactionAction =
  | { readonly type:"ADD_ENEMY_FIGHT"; readonly value:number }
  | { readonly type:"BUMP_LOWEST_ENEMY_LOCKED"; readonly delta:1|-1 };

export interface ManipulationReactionDefinition {
  readonly id:string;
  readonly sourceId:string;
  readonly maxTriggersPerRound:number;
  readonly actions:readonly ManipulationReactionAction[];
}

export interface ManipulationReactionState {
  readonly round:number;
  readonly triggerCounts:Readonly<Record<string,number>>;
  readonly persistentEffects:readonly EffectDefinition[];
}

export interface ManipulationReactionLogEntry {
  readonly reactionId:string;
  readonly sourceId:string;
  readonly actions:readonly ManipulationReactionAction[];
}

export interface ManipulationReactionResult {
  readonly combatState:CombatState;
  readonly reactionState:ManipulationReactionState;
  readonly addedEffects:readonly EffectDefinition[];
  readonly log:readonly ManipulationReactionLogEntry[];
}

export function createManipulationReactionState(round:number):ManipulationReactionState {
  return {round,triggerCounts:{},persistentEffects:[]};
}

function ensureRound(state:ManipulationReactionState,round:number):ManipulationReactionState {
  return state.round===round?state:createManipulationReactionState(round);
}

export function reactToPlayerManipulation(
  combatState:CombatState,
  definitions:readonly ManipulationReactionDefinition[],
  inputState:ManipulationReactionState,
  consume=true,
):ManipulationReactionResult {
  const baseState=ensureRound(inputState,combatState.round);
  const triggerCounts:Record<string,number>={...baseState.triggerCounts};
  const persistentEffects=[...baseState.persistentEffects];
  const addedEffects:EffectDefinition[]=[];
  const log:ManipulationReactionLogEntry[]=[];
  let nextCombat=combatState;

  for(const definition of definitions){
    const used=triggerCounts[definition.id]??0;
    if(used>=definition.maxTriggersPerRound)continue;
    for(const action of definition.actions){
      if(action.type==="ADD_ENEMY_FIGHT"){
        const effect:EffectDefinition={
          id:`reaction:${definition.id}:enemy-fight:${used}`,
          sourceId:definition.sourceId,
          timing:"FIGHT_MODIFICATION",
          priority:110,
          condition:{type:"always"},
          actions:[{type:"add_enemy_fight",value:action.value}],
        };
        addedEffects.push(effect);
        persistentEffects.push(effect);
      }else if(action.type==="BUMP_LOWEST_ENEMY_LOCKED"){
        if(nextCombat.enemyLocked.length!==2)throw new Error("Manipulation reaction requires two locked enemy dice");
        const locked=[...nextCombat.enemyLocked] as [DieValue,DieValue];
        const index=locked[0]<=locked[1]?0:1;
        locked[index]=bump(locked[index],action.delta);
        nextCombat={...nextCombat,enemyLocked:locked};
      }
    }
    if(consume)triggerCounts[definition.id]=used+1;
    log.push({reactionId:definition.id,sourceId:definition.sourceId,actions:definition.actions});
  }

  return {
    combatState:nextCombat,
    reactionState:consume?{round:combatState.round,triggerCounts,persistentEffects}:baseState,
    addedEffects,
    log,
  };
}
