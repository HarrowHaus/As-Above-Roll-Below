import type { CombatState, DieId, DieValue } from "../types.js";
import type { RngStream } from "../rng/rng.js";
import { bump, findDie, flip, rollD6, transmute, withLocked, withValue } from "../dice/dice.js";
import type { ProgressionState } from "../progression/progression.js";
import { heal } from "../progression/progression.js";

export type CombatItemAction =
  | { readonly type:"REROLL_PLAYER_DIE" }
  | { readonly type:"SET_PLAYER_DIE"; readonly value:DieValue }
  | { readonly type:"FLIP_PLAYER_DIE" }
  | { readonly type:"COPY_PLAYER_DIE" }
  | { readonly type:"TRANSMUTE_PLAYER_DIE"; readonly allowed:readonly DieValue[] }
  | { readonly type:"LOWER_HIGHEST_ENEMY_DIE"; readonly amount:number }
  | { readonly type:"SUPPRESS_ENEMY_RULES_ROUND" };

export type OutsideCombatItemAction = { readonly type:"HEAL_PLAYER"; readonly amount:number };

export interface CombatActionInput {
  readonly targetDieId?: DieId;
  readonly sourceDieId?: DieId;
  readonly chosenValue?: DieValue;
}

export interface CombatActionResult {
  readonly state: CombatState;
  readonly suppressEnemyRules: boolean;
}

function replaceDie(state: CombatState, id: DieId, value: DieValue): CombatState {
  const die=findDie(state.playerRoll,id);
  const next=withValue(die,value);
  return {...state,playerRoll:state.playerRoll.map((candidate)=>candidate.id===id?next:candidate)};
}

export function applyCombatItemAction(
  state: CombatState,
  action: CombatItemAction,
  input: CombatActionInput = {},
  rng?: RngStream,
): CombatActionResult {
  switch(action.type){
    case "REROLL_PLAYER_DIE": {
      if(!input.targetDieId||!rng) throw new Error("REROLL_PLAYER_DIE requires targetDieId and RNG");
      return {state:replaceDie(state,input.targetDieId,rollD6(rng)),suppressEnemyRules:false};
    }
    case "SET_PLAYER_DIE": {
      if(!input.targetDieId) throw new Error("SET_PLAYER_DIE requires targetDieId");
      return {state:replaceDie(state,input.targetDieId,action.value),suppressEnemyRules:false};
    }
    case "FLIP_PLAYER_DIE": {
      if(!input.targetDieId) throw new Error("FLIP_PLAYER_DIE requires targetDieId");
      const die=findDie(state.playerRoll,input.targetDieId);
      return {state:replaceDie(state,input.targetDieId,flip(die.value)),suppressEnemyRules:false};
    }
    case "COPY_PLAYER_DIE": {
      if(!input.targetDieId||!input.sourceDieId) throw new Error("COPY_PLAYER_DIE requires targetDieId and sourceDieId");
      const source=findDie(state.playerRoll,input.sourceDieId);
      return {state:replaceDie(state,input.targetDieId,source.value),suppressEnemyRules:false};
    }
    case "TRANSMUTE_PLAYER_DIE": {
      if(!input.targetDieId||input.chosenValue===undefined) throw new Error("TRANSMUTE_PLAYER_DIE requires targetDieId and chosenValue");
      if(!action.allowed.includes(input.chosenValue)) throw new Error(`Value ${input.chosenValue} is not allowed for transmutation`);
      return {state:replaceDie(state,input.targetDieId,transmute(input.chosenValue)),suppressEnemyRules:false};
    }
    case "LOWER_HIGHEST_ENEMY_DIE": {
      if(state.enemyLocked.length!==2) throw new Error("Enemy must have exactly two locked dice");
      const locked=[...state.enemyLocked];
      const high=Math.max(...locked) as DieValue;
      const index=locked.indexOf(high);
      let value=high;
      for(let i=0;i<action.amount;i+=1) value=bump(value,-1);
      locked[index]=value;
      return {state:{...state,enemyLocked:locked},suppressEnemyRules:false};
    }
    case "SUPPRESS_ENEMY_RULES_ROUND":
      return {state,suppressEnemyRules:true};
  }
}

export function applyOutsideCombatItemAction(state: ProgressionState, action: OutsideCombatItemAction): ProgressionState {
  return heal(state,action.amount);
}

export function injectCarriedDie(state: CombatState, value: DieValue): CombatState {
  if(state.playerRoll.length!==4) throw new Error("Carry-forward requires a four-die player cast");
  const target=state.playerRoll[0]!;
  const carried=withLocked(withValue(target,value),true);
  return {...state,playerRoll:[carried,...state.playerRoll.slice(1)]};
}

export function brassCaliperOptions(spoils: readonly [DieValue,DieValue]): readonly [DieValue,DieValue][] {
  const options:[[DieValue,DieValue],[DieValue,DieValue],[DieValue,DieValue],[DieValue,DieValue]]=[
    [bump(spoils[0],-1),spoils[1]],
    [bump(spoils[0],1),spoils[1]],
    [spoils[0],bump(spoils[1],-1)],
    [spoils[0],bump(spoils[1],1)],
  ];
  return options.filter((pair,index,self)=>self.findIndex((other)=>other[0]===pair[0]&&other[1]===pair[1])===index);
}

export function ashLedgerCoinAward(owns:boolean,alreadyTriggered:boolean,damageTaken:number):{coins:number;triggered:boolean}{
  const trigger=owns&&!alreadyTriggered&&damageTaken>0;
  return {coins:trigger?1:0,triggered:alreadyTriggered||trigger};
}

export function skippedDraftCoinAward(ownsPurse:boolean,bonusAlreadyUsed:boolean):{coins:number;bonusUsed:boolean}{
  const bonus=ownsPurse&&!bonusAlreadyUsed;
  return {coins:2+(bonus?2:0),bonusUsed:bonusAlreadyUsed||bonus};
}

export function firstShopPurchasePrice(basePrice:number,ownsReceipt:boolean,discountAlreadyUsed:boolean):{price:number;discountUsed:boolean}{
  if(!Number.isInteger(basePrice)||basePrice<0) throw new Error("basePrice must be a non-negative integer");
  const applies=ownsReceipt&&!discountAlreadyUsed;
  return {price:applies?Math.max(1,basePrice-2):basePrice,discountUsed:discountAlreadyUsed||applies};
}
