import test from "node:test";
import assert from "node:assert/strict";
import { batch, simulateFloor } from "../src/simulator-v2.mjs";

test("same seed and policy reproduce exactly",()=>{
  assert.deepEqual(simulateFloor(424242,"opportunist"),simulateFloor(424242,"opportunist"));
});

test("all three policies can execute generated Floor I end-to-end",()=>{
  for(const policy of ["safe","opportunist","greedy"]){
    const result=simulateFloor(9000,policy);
    assert.equal(result.policy,policy);
    assert.ok(result.hp>=0);
    assert.ok(result.rounds>0);
    assert.ok(result.level>=1);
    assert.ok(result.encounters["thresholds:first-door"]?.attempts===1);
  }
});

test("small batch separates raw Spoils bands and includes item-use telemetry",()=>{
  const result=batch({runs:20,seedBase:800000});
  for(const policy of ["safe","opportunist","greedy"]){
    const s=result[policy];
    assert.equal(s.runs,20);
    assert.ok(Number.isFinite(s.clearRate));
    assert.ok(Number.isFinite(s.avgRounds));
    for(const band of [1,2,3,4]){
      assert.ok(Number.isFinite(s.rawBandFrequency[band]));
      assert.ok(Number.isFinite(s.rewardBandFrequency[band]));
    }
    assert.ok(Number.isFinite(s.boss.clearRate));
    assert.ok(Number.isFinite(s.boss.avgRounds));
    assert.equal(typeof s.itemUses,"object");
    assert.equal(typeof s.itemsTaken,"object");
  }
});
