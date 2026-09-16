import test from "node:test";
import assert from "node:assert/strict";
import { generateFloor, RngStream, thresholdsFloor, validateFloor } from "../dist/index.js";

test("THRESHOLDS generates valid constrained graphs across 1000 seeds",()=>{for(let seed=0;seed<1000;seed+=1){const g=generateFloor(thresholdsFloor,RngStream.fromMaster(seed,"map"));assert.deepEqual(validateFloor(g,thresholdsFloor),[],`seed ${seed}`);const row0=g.nodes.filter(n=>n.row===0);assert.ok(row0.every(n=>n.type==="COMBAT"));}});
test("same engine generates a different Floor definition",()=>{const other={id:"archive",rows:[{allowedTypes:["COMBAT","EVENT"],minNodes:2,maxNodes:2},{allowedTypes:["COMBAT","SHOP","ELITE"],minNodes:3,maxNodes:3}],guarantees:{minCombatOpportunities:1,eventOpportunity:true,shopOpportunity:true,eliteOptional:true},bossId:"archive:boss"};const g=generateFloor(other,RngStream.fromMaster("same-engine","map"));assert.equal(g.definitionId,"archive");assert.deepEqual(validateFloor(g,other),[]);});

test("run generation accepts an arbitrary number and order of Floors", async () => {
  const { generateRun } = await import("../dist/index.js");
  const archive={id:"archive",rows:[{allowedTypes:["COMBAT","EVENT"],minNodes:2,maxNodes:2},{allowedTypes:["COMBAT","SHOP","ELITE"],minNodes:3,maxNodes:3}],guarantees:{minCombatOpportunities:1,eventOpportunity:true,shopOpportunity:true,eliteOptional:true},bossId:"archive:boss"};
  const run=generateRun("expansion-seed",[thresholdsFloor,archive,thresholdsFloor,archive,thresholdsFloor]);
  assert.equal(run.floors.length,5);
  assert.deepEqual(run.floors.map(f=>f.definitionId),["thresholds","archive","thresholds","archive","thresholds"]);
});
