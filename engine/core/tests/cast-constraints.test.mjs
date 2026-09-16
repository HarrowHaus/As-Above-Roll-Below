import test from "node:test";
import assert from "node:assert/strict";
import { applyPlayerCastConstraints, floor1CastConstraintRegistry } from "../dist/index.js";

const die=(id,value)=>({id,value,fixed:false,locked:false,tags:[]});
const state=(values)=>({round:1,player:{hp:20,maxHp:20},enemy:{hp:6,maxHp:6},enemyDefinitionId:"test",enemyRoll:[3,4],enemyLocked:[3,4],playerRoll:values.map((v,i)=>die(`d${i}`,v)),committedDieIds:[],phase:"PLAYER_MANIPULATE"});

test("Unadmitted fixes the leftmost lowest die",()=>{
  const def=floor1CastConstraintRegistry["rule:unadmitted:fix-lowest"];
  const result=applyPlayerCastConstraints(state([2,5,2,6]),[def]);
  assert.equal(result.state.playerRoll[0].fixed,true);
  assert.equal(result.state.playerRoll[2].fixed,false);
});

test("Threshold Warden fixes the leftmost highest die",()=>{
  const def=floor1CastConstraintRegistry["rule:threshold-warden:fix-highest"];
  const result=applyPlayerCastConstraints(state([6,3,6,2]),[def]);
  assert.equal(result.state.playerRoll[0].fixed,true);
  assert.equal(result.state.playerRoll[2].fixed,false);
});
