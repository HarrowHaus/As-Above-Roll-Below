import test from "node:test";
import assert from "node:assert/strict";
import { bump, flip, transmute } from "../dist/index.js";

test("FLIP uses physical d6 opposites",()=>{ assert.deepEqual([1,2,3,4,5,6].map(flip),[6,5,4,3,2,1]); });
test("BUMP clamps to d6 range",()=>{ assert.equal(bump(1,-1),1); assert.equal(bump(6,1),6); assert.equal(bump(3,1),4); });
test("TRANSMUTE rejects invalid faces",()=>{ assert.equal(transmute(6),6); assert.throws(()=>transmute(0)); assert.throws(()=>transmute(7)); });
