import test from "node:test";
import assert from "node:assert/strict";
import {
  RngService, applyCombatItemAction, applyOutsideCombatItemAction, injectCarriedDie,
  brassCaliperOptions, ashLedgerCoinAward, skippedDraftCoinAward, firstShopPurchasePrice,
  createInventory, consumeContraband, createProgression
} from "../dist/index.js";

const die=(id,value)=>({id,value,fixed:false,locked:false,tags:[]});
const state=()=>({round:1,player:{hp:12,maxHp:20},enemy:{hp:5,maxHp:5},enemyDefinitionId:"x",enemyRoll:[6,5],enemyLocked:[6,5],playerRoll:[die("a",1),die("b",2),die("c",3),die("d",4)],committedDieIds:[],phase:"PLAYER_MANIPULATE"});

test("generic combat item actions mutate authoritative combat state",()=>{
  const rng=new RngService(42).stream("item");
  const set=applyCombatItemAction(state(),{type:"SET_PLAYER_DIE",value:4},{targetDieId:"a"});
  assert.equal(set.state.playerRoll[0].value,4);
  const flipped=applyCombatItemAction(state(),{type:"FLIP_PLAYER_DIE"},{targetDieId:"a"});
  assert.equal(flipped.state.playerRoll[0].value,6);
  const copied=applyCombatItemAction(state(),{type:"COPY_PLAYER_DIE"},{targetDieId:"a",sourceDieId:"d"});
  assert.equal(copied.state.playerRoll[0].value,4);
  const cut=applyCombatItemAction(state(),{type:"LOWER_HIGHEST_ENEMY_DIE",amount:1});
  assert.deepEqual(cut.state.enemyLocked,[5,5]);
  const rerolled=applyCombatItemAction(state(),{type:"REROLL_PLAYER_DIE"},{targetDieId:"a"},rng);
  assert.ok(rerolled.state.playerRoll[0].value>=1&&rerolled.state.playerRoll[0].value<=6);
});

test("rule suppression is represented without item-specific branching",()=>{
  const result=applyCombatItemAction(state(),{type:"SUPPRESS_ENEMY_RULES_ROUND"});
  assert.equal(result.suppressEnemyRules,true);
});

test("outside-combat healing and carried dice are core primitives",()=>{
  const healed=applyOutsideCombatItemAction({...createProgression(20),hp:11},{type:"HEAL_PLAYER",amount:4});
  assert.equal(healed.hp,15);
  const carried=injectCarriedDie(state(),6);
  assert.equal(carried.playerRoll[0].value,6);
  assert.equal(carried.playerRoll[0].locked,true);
  assert.throws(()=>applyCombatItemAction(carried,{type:"SET_PLAYER_DIE",value:4},{targetDieId:"a"}),/LOCKED/);
});

test("Brass Caliper exposes legal one-step Spoils options",()=>{
  const options=brassCaliperOptions([2,5]);
  assert.ok(options.some(([a,b])=>a===3&&b===5));
  assert.ok(options.some(([a,b])=>a===2&&b===6));
});

test("run modifiers are deterministic pure helpers",()=>{
  assert.deepEqual(ashLedgerCoinAward(true,false,2),{coins:1,triggered:true});
  assert.deepEqual(skippedDraftCoinAward(true,false),{coins:4,bonusUsed:true});
  assert.deepEqual(firstShopPurchasePrice(6,true,false),{price:4,discountUsed:true});
});

test("contraband consumption removes exactly one copy",()=>{
  const inv={...createInventory(),contraband:["wire-cutter","wire-cutter"]};
  assert.deepEqual(consumeContraband(inv,"wire-cutter").contraband,["wire-cutter"]);
});