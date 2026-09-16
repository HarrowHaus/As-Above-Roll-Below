import test from "node:test";
import assert from "node:assert/strict";
import {RngService,generateDescent,thresholdsDescent,validateDescentTypes} from "../dist/index.js";

test("Floor I descent is deterministic for the same seed",()=>{
  const a=generateDescent(thresholdsDescent,new RngService(424242).stream("descent:thresholds"));
  const b=generateDescent(thresholdsDescent,new RngService(424242).stream("descent:thresholds"));
  assert.deepEqual(a,b);
});

test("Floor I descent keeps Boss last and satisfies constraints across 1000 seeds",()=>{
  for(let seed=0;seed<1000;seed+=1){
    const sequence=generateDescent(thresholdsDescent,new RngService(seed).stream("descent:thresholds"));
    assert.equal(sequence.steps.length,thresholdsDescent.slots.length+1);
    assert.equal(sequence.steps[0].type,"COMBAT");
    assert.equal(sequence.steps.at(-1).type,"BOSS");
    assert.equal(sequence.steps.at(-1).id,sequence.bossStepId);
    const preBoss=sequence.steps.slice(0,-1).map((step)=>step.type);
    const validation=validateDescentTypes(thresholdsDescent,preBoss);
    assert.equal(validation.valid,true,`seed ${seed}: ${validation.errors.join(", ")}`);
  }
});

test("Floor I descent exposes combat, Event, Shop and no more than one Elite",()=>{
  const sequence=generateDescent(thresholdsDescent,new RngService(831991).stream("descent:thresholds"));
  const types=sequence.steps.slice(0,-1).map((step)=>step.type);
  assert.ok(types.filter((type)=>type==="COMBAT").length>=3);
  assert.ok(types.includes("EVENT"));
  assert.ok(types.includes("SHOP"));
  assert.ok(types.filter((type)=>type==="ELITE").length<=1);
});
