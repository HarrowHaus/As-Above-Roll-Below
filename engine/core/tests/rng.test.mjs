import test from "node:test";
import assert from "node:assert/strict";
import { RngService, RngStream } from "../dist/index.js";

test("same master seed and stream name reproduce exactly", () => {
  const a = RngStream.fromMaster("abc", "combat:enemy");
  const b = RngStream.fromMaster("abc", "combat:enemy");
  assert.deepEqual(Array.from({length:20},()=>a.nextUint32()), Array.from({length:20},()=>b.nextUint32()));
});

test("independent streams prevent cosmetic RNG from perturbing combat", () => {
  const baseline = new RngService("seed-42");
  const altered = new RngService("seed-42");
  const expected = Array.from({length:8},()=>baseline.stream("combat:enemy").int(1,6));
  for (let i=0;i<100;i+=1) altered.stream("cosmetic").nextUint32();
  const actual = Array.from({length:8},()=>altered.stream("combat:enemy").int(1,6));
  assert.deepEqual(actual, expected);
});

test("RNG snapshot restores exact sequence", () => {
  const rng = RngStream.fromMaster(123,"loot"); rng.nextUint32();
  const snap=rng.snapshot(); const expected=Array.from({length:10},()=>rng.nextUint32());
  const restored=RngStream.restore(snap);
  assert.deepEqual(Array.from({length:10},()=>restored.nextUint32()), expected);
});
