import test from "node:test";
import assert from "node:assert/strict";
import {availableRunNodes,completeRunNode,createDescentRunState,enterRunNode,thresholdsDescent} from "../dist/index.js";

test("descent RunState exposes exactly one next Depth",()=>{
  let state=createDescentRunState(831991,[thresholdsDescent],{startingGear:{ARMOR:"work-apron"}});
  for(let depth=0;depth<thresholdsDescent.slots.length;depth+=1){
    const available=availableRunNodes(state);
    assert.equal(available.length,1);
    state=enterRunNode(state,available[0].id);
    assert.notEqual(state.phase,"RUN_MAP");
    state=completeRunNode(state);
    assert.equal(state.phase,"RUN_MAP");
  }
  const boss=availableRunNodes(state);
  assert.equal(boss.length,1);
  assert.equal(boss[0].type,"BOSS");
});

test("completing descent Boss produces run victory",()=>{
  let state=createDescentRunState(17,[thresholdsDescent]);
  while(state.phase!=="RUN_VICTORY"){
    const next=availableRunNodes(state);
    assert.equal(next.length,1);
    state=enterRunNode(state,next[0].id);
    state=completeRunNode(state);
  }
  assert.equal(state.phase,"RUN_VICTORY");
});
