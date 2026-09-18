import test from "node:test";
import assert from "node:assert/strict";
import {
  createEffectState,
  resolveCombatEffects,
  twinNailsImpactEffect,
  loadedQuestionFourKindImpactEffect,
} from "../dist/index.js";

const context=(fightValues,spoilsValues,damageToEnemy)=>({
  fightValues,spoilsValues,rawFight:fightValues[0]+fightValues[1],finalFight:fightValues[0]+fightValues[1],
  enemyFight:8,margin:Math.max(1,damageToEnemy),outcome:"win",damageToEnemy,damageToPlayer:0,
  healingToEnemy:0,healingToPlayer:0,baseSpoilsScore:spoilsValues[0]+spoilsValues[1],
  finalSpoilsScore:spoilsValues[0]+spoilsValues[1],
});

test("Twin Nails doubles converts a winning margin into bounded Impact",()=>{
  const r=resolveCombatEffects(context([5,5],[2,3],7),[twinNailsImpactEffect],createEffectState(),false);
  assert.equal(r.context.damageToEnemy,14);
});

test("Loaded Question recognizes four-kind across Fight and Spoils",()=>{
  const r=resolveCombatEffects(context([4,4],[4,4],9),[loadedQuestionFourKindImpactEffect],createEffectState(),false);
  assert.equal(r.context.damageToEnemy,18);
});

test("stacked doubles and four-kind Impact is powerful but capped",()=>{
  const r=resolveCombatEffects(context([6,6],[6,6],20),[twinNailsImpactEffect,loadedQuestionFourKindImpactEffect],createEffectState(),false);
  assert.equal(r.context.damageToEnemy,48);
});

test("four-kind Impact does not trigger on merely doubled Fight dice",()=>{
  const r=resolveCombatEffects(context([4,4],[2,5],9),[loadedQuestionFourKindImpactEffect],createEffectState(),false);
  assert.equal(r.context.damageToEnemy,9);
});
