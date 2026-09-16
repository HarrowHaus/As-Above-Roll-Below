import test from "node:test";
import assert from "node:assert/strict";
import {
  createManipulationReactionState, reactToPlayerManipulation,
  sealBearerCountersealReaction, sealWhelpManipulationReaction
} from "../dist/index.js";

function combatState(){return {round:2,player:{hp:20,maxHp:20},enemy:{hp:8,maxHp:8},enemyDefinitionId:"test",enemyRoll:[2,5,6],enemyLocked:[2,5],playerRoll:[],committedDieIds:[],phase:"PLAYER_MANIPULATE"};}

test("Seal-Whelp adds a one-round enemy Fight effect only on first manipulation",()=>{
  const initial=createManipulationReactionState(2);
  const first=reactToPlayerManipulation(combatState(),[sealWhelpManipulationReaction],initial,true);
  assert.equal(first.addedEffects.length,1);
  assert.equal(first.addedEffects[0].actions[0].type,"add_enemy_fight");
  const second=reactToPlayerManipulation(first.combatState,[sealWhelpManipulationReaction],first.reactionState,true);
  assert.equal(second.addedEffects.length,0);
});

test("Seal-Bearer bumps the lower locked enemy die once per round",()=>{
  const initial=createManipulationReactionState(2);
  const first=reactToPlayerManipulation(combatState(),[sealBearerCountersealReaction],initial,true);
  assert.deepEqual(first.combatState.enemyLocked,[3,5]);
  const second=reactToPlayerManipulation(first.combatState,[sealBearerCountersealReaction],first.reactionState,true);
  assert.deepEqual(second.combatState.enemyLocked,[3,5]);
});

test("reaction state resets automatically on a new round",()=>{
  const first=reactToPlayerManipulation(combatState(),[sealBearerCountersealReaction],createManipulationReactionState(2),true);
  const nextRound={...first.combatState,round:3,enemyLocked:[2,5]};
  const reset=reactToPlayerManipulation(nextRound,[sealBearerCountersealReaction],first.reactionState,true);
  assert.deepEqual(reset.combatState.enemyLocked,[3,5]);
});
