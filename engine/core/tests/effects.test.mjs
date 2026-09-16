import test from "node:test";
import assert from "node:assert/strict";
import {
  bentKnifeEffect, brassBuckleEffect, breachingBarEffect, createEffectState, falseBottomEffect,
  firstDoorBothWaysEffect, insideOutLiningEffect, loadedQuestionEffect, oppositeNumberEffect,
  proofVestEffect, redThreadEffect, resolveCombatEffects, turnbackRefusalEffect, twinNailsEffect
} from "../dist/index.js";

function ctx({fight=[6,5],spoils=[3,2],enemy=10}={}){
  const raw=fight[0]+fight[1], margin=raw-enemy;
  return {fightValues:fight,spoilsValues:spoils,rawFight:raw,finalFight:raw,enemyFight:enemy,margin,outcome:margin>0?'win':margin<0?'loss':'tie',damageToEnemy:Math.max(0,margin),damageToPlayer:Math.max(0,-margin),healingToEnemy:0,healingToPlayer:0,baseSpoilsScore:spoils[0]+spoils[1],finalSpoilsScore:spoils[0]+spoils[1]};
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

test("once-per-encounter mitigation consumes only on authoritative resolution",()=>{
  const base=ctx({fight:[2,3],spoils:[6,6],enemy:7});
  const preview=resolveCombatEffects(base,[proofVestEffect],createEffectState(),false);
  assert.equal(preview.context.damageToPlayer,0); assert.deepEqual(preview.effectState.uses,{});
  const committed=resolveCombatEffects(base,[proofVestEffect],createEffectState(),true);
  assert.equal(committed.context.damageToPlayer,0); assert.equal(committed.effectState.uses[proofVestEffect.id],1);
  const second=resolveCombatEffects(base,[proofVestEffect],committed.effectState,true);
  assert.equal(second.context.damageToPlayer,2);
});

test("Inside-Out Lining specifically cancels one margin-minus-one hit",()=>{
  const r=resolveCombatEffects(ctx({fight:[5,4],spoils:[3,2],enemy:10}),[insideOutLiningEffect],createEffectState(),true);
  assert.equal(r.context.margin,-1); assert.equal(r.context.damageToPlayer,0);
});

test("tie rules compose through a shared timing window",()=>{
  const base=ctx({fight:[5,5],spoils:[3,2],enemy:10});
  const buckle=resolveCombatEffects(base,[brassBuckleEffect]);
  assert.equal(buckle.context.damageToEnemy,1);
  const turnback=resolveCombatEffects(base,[turnbackRefusalEffect]);
  assert.equal(turnback.context.healingToEnemy,1);
  const door=resolveCombatEffects(base,[firstDoorBothWaysEffect]);
  assert.equal(door.context.damageToEnemy,2); assert.equal(door.context.damageToPlayer,2);
});

test("Red Thread can heal on a margin-one win without changing margin",()=>{
  const r=resolveCombatEffects(ctx({fight:[6,5],spoils:[2,2],enemy:10}),[redThreadEffect],createEffectState(),true);
  assert.equal(r.context.margin,1); assert.equal(r.context.healingToPlayer,1);
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
