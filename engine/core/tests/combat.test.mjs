import test from "node:test";
import assert from "node:assert/strict";
import { commit, lockByInstinct, previewCommit } from "../dist/index.js";
const die=(id,value)=>({id,value,fixed:false,locked:false,tags:[]});
function state(player, enemyLocked, enemyHp=5){return {round:1,player:{hp:20,maxHp:20},enemy:{hp:enemyHp,maxHp:enemyHp},enemyDefinitionId:"test",enemyRoll:enemyLocked,enemyLocked,playerRoll:player.map((v,i)=>die(`d${i}`,v)),committedDieIds:[],phase:"PLAYER_MANIPULATE"};}

test("Instinct locking is deterministic",()=>{assert.deepEqual(lockByInstinct([1,6,5],"STRONGEST"),[6,5]);assert.deepEqual(lockByInstinct([1,6,5],"WIDE"),[1,6]);assert.deepEqual(lockByInstinct([2,3,6],"TIGHT"),[2,3]);assert.deepEqual(lockByInstinct([2,5,3],"ODD"),[5,3]);});
test("preview exposes fight margin and Spoils",()=>{const p=previewCommit(state([6,5,3,2],[5,5]),["d0","d1"]);assert.equal(p.finalFight,11);assert.equal(p.enemyFight,10);assert.equal(p.predictedMargin,1);assert.deepEqual(p.spoilsValues,[3,2]);assert.equal(p.baseSpoilsScore,5);});
test("positive margin damages enemy and qualifies Spoils",()=>{const r=commit(state([6,5,3,2],[5,5]),["d0","d1"]);assert.equal(r.state.enemy.hp,4);assert.ok(r.events.some(e=>e.type==="spoils_qualified"&&e.score===5));});
test("negative margin damages player",()=>{const r=commit(state([2,3,6,5],[5,5]),["d0","d1"]);assert.equal(r.state.player.hp,15);assert.ok(!r.events.some(e=>e.type==="spoils_qualified"));});
test("ties deal no damage",()=>{const r=commit(state([5,5,6,1],[5,5]),["d0","d1"]);assert.equal(r.state.player.hp,20);assert.equal(r.state.enemy.hp,5);assert.ok(r.events.some(e=>e.type==="tie"));});

test("effectful COMMIT uses the same resolver for preview and authoritative damage", async()=>{
  const { commitWithEffects, bentKnifeEffect, loadedQuestionEffect } = await import("../dist/index.js");
  const s=state([6,4,3,3],[5,5],8);
  const r=commitWithEffects(s,["d0","d1"],[bentKnifeEffect,loadedQuestionEffect]);
  assert.equal(r.preview.finalFight,11);
  assert.equal(r.preview.margin,1);
  assert.equal(r.state.enemy.hp,7);
  assert.equal(r.preview.finalSpoilsScore,8);
  assert.ok(r.events.some(e=>e.type==="spoils_qualified"&&e.score===8));
});
