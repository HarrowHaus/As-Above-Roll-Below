import test from "node:test";
import assert from "node:assert/strict";
import {
  availableRunNodes,
  completeRunNode,
  createRunState,
  currentNode,
  enterRunNode,
  thresholdsFloor,
  withRunResources,
} from "../dist/index.js";

const secondFloor={...thresholdsFloor,id:"test:second-floor",bossId:"test:second-boss"};

function completeFirstAvailable(state){
  const next=availableRunNodes(state)[0];
  assert.ok(next,"expected reachable node");
  const entered=enterRunNode(state,next.id);
  assert.equal(currentNode(entered)?.id,next.id);
  return completeRunNode(entered);
}

test("same seed produces same run graph and first choices",()=>{
  const a=createRunState(12345,[thresholdsFloor,secondFloor]);
  const b=createRunState(12345,[thresholdsFloor,secondFloor]);
  assert.deepEqual(a.floors,b.floors);
  assert.deepEqual(availableRunNodes(a),availableRunNodes(b));
});

test("run navigation only allows graph-reachable nodes",()=>{
  const state=createRunState(44,[thresholdsFloor]);
  const first=availableRunNodes(state);
  assert.ok(first.length>0);
  const unreachable=state.floors[0].nodes.find((node)=>node.row>0);
  assert.ok(unreachable);
  assert.throws(()=>enterRunNode(state,unreachable.id),/not reachable/);
  const entered=enterRunNode(state,first[0].id);
  assert.notEqual(entered.phase,"RUN_MAP");
});

test("boss completion advances arbitrary Floor list then reaches victory",()=>{
  let state=createRunState(99,[thresholdsFloor,secondFloor]);
  while(state.floorIndex===0){state=completeFirstAvailable(state);}
  assert.equal(state.floorIndex,1);
  assert.equal(state.phase,"RUN_MAP");
  assert.equal(state.lastCompletedNodeId,null);
  while(state.phase!=="RUN_VICTORY"){state=completeFirstAvailable(state);}
  assert.equal(state.floorIndex,1);
  assert.equal(state.phase,"RUN_VICTORY");
});

test("resources survive room and Floor navigation",()=>{
  let state=createRunState(7,[thresholdsFloor,secondFloor]);
  state=withRunResources(state,{economy:{coins:11}});
  while(state.floorIndex===0){state=completeFirstAvailable(state);}
  assert.equal(state.economy.coins,11);
});
