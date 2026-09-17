import assert from "node:assert/strict";
import test from "node:test";
import {RngStream,applyEnemyAffixes,compileGeneratedGearEffect,enemyAffixRegistry,floor1NormalEnemies,generateGearRecipe,validateGeneratedGear} from "../dist/index.js";

test("enemy affixes obey pressure budgets",()=>{const base=floor1NormalEnemies[0];const result=applyEnemyAffixes(base,[enemyAffixRegistry["affix:stubborn"]],1);assert.equal(result.enemy.maxHp,base.maxHp+2);assert.equal(result.pressureAdded,1);assert.throws(()=>applyEnemyAffixes(base,[enemyAffixRegistry["affix:loaded"]],1));});

test("generated Gear is deterministic, legal, self-describing, and compilable across 10000 seeds",()=>{const slots=["WEAPON","ARMOR","UTILITY"];for(let seed=0;seed<10000;seed+=1){const a=generateGearRecipe(RngStream.fromMaster(seed,"gear"),slots[seed%3],(seed%3)+1);const b=generateGearRecipe(RngStream.fromMaster(seed,"gear"),slots[seed%3],(seed%3)+1);assert.deepEqual(a,b);const validation=validateGeneratedGear(a);assert.equal(validation.valid,true,validation.errors.join(", "));assert.ok(a.rulesText.length>12);const effect=compileGeneratedGearEffect(a);assert.equal(effect.sourceId,a.id);assert.equal(effect.actions.length,1);assert.equal(effect.maxUsesPerEncounter,a.cadence==="ONCE_PER_ENCOUNTER"?1:undefined);}});
