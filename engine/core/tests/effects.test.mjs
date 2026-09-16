import test from "node:test";
import assert from "node:assert/strict";
import {
  bentKnifeEffect, breachingBarEffect, createEffectState, falseBottomEffect,
  loadedQuestionEffect, oppositeNumberEffect, proofVestEffect, resolveCombatEffects, twinNailsEffect
} from "../dist/index.js";

function ctx({fight=[6,5],spoils=[3,2],enemy=10}={}){
  const raw=fight[0]+fight[1], margin=raw-enemy;
  return {fightValues:fight,spoilsValues:spoils,rawFight:raw,finalFight:raw,enemyFight:enemy,margin,outcome:margin>0?'win':margin<0?'loss':'tie',damageToEnemy:Math.max(0,margin),damageToPlayer:Math.max(0,-margin),baseSpoilsScore:spoils[0]+spoils[1],finalSpoilsScore:spoils[0]+spoils[1]};
}

test("Gear effects change deterministic Fight evaluation",()=>{
  const r=resolveCombatEffects(ctx(),[bentKnifeEffect],createEffectState());
  assert.equal(r.context.finalFight,12); assert.equal(r.context.margin,2);
  const d=resolveCombatEffects(ctx({fight:[5,5],spoils:[3,2],enemy:10}),[twinNailsEffect]);
  assert.equal(d.context.finalFight,12); assert.equal(d.context.margin,2);
});

test("damage modifiers run after final margin",()=>{
  const r=resolveCombatEffects(ctx({fight:[6,5],spoils:[2,2],enemy:10}),[breachingBarEffect]);
  assert.equal(r.context.damageToEnemy,3);
});

test("once-per-encounter effects consume only when authoritative resolution asks",()=>{
  const base=ctx({fight:[2,3],spoils:[6,6],enemy:7});
  const preview=resolveCombatEffects(base,[proofVestEffect],createEffectState(),false);
  assert.equal(preview.context.damageToPlayer,0); assert.deepEqual(preview.effectState.uses,{});
  const committed=resolveCombatEffects(base,[proofVestEffect],createEffectState(),true);
  assert.equal(committed.context.damageToPlayer,0); assert.equal(committed.effectState.uses[proofVestEffect.id],1);
  const second=resolveCombatEffects(base,[proofVestEffect],committed.effectState,true);
  assert.equal(second.context.damageToPlayer,2);
});

test("Spoils modifiers compose in explicit priority order and cap at 12",()=>{
  const r=resolveCombatEffects(ctx({fight:[6,5],spoils:[2,2],enemy:8}),[loadedQuestionEffect,falseBottomEffect]);
  assert.equal(r.context.finalSpoilsScore,6);
});

test("physical opposite Spoils condition is reusable data",()=>{
  const r=resolveCombatEffects(ctx({fight:[6,5],spoils:[1,6],enemy:8}),[oppositeNumberEffect]);
  assert.equal(r.context.finalSpoilsScore,10);
});

test("effect ordering is deterministic even when input array order changes",()=>{
  const a=resolveCombatEffects(ctx({fight:[6,5],spoils:[2,2],enemy:8}),[falseBottomEffect,loadedQuestionEffect]);
  const b=resolveCombatEffects(ctx({fight:[6,5],spoils:[2,2],enemy:8}),[loadedQuestionEffect,falseBottomEffect]);
  assert.deepEqual(a,b);
});
