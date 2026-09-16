import test from "node:test";
import assert from "node:assert/strict";
import { bossPhaseAtHp, firstDoor, floor1Elites, floor1NormalEnemies } from "../dist/index.js";

test("Floor I content has eight normals and two elites",()=>{
  assert.equal(floor1NormalEnemies.length,8);
  assert.equal(floor1Elites.length,2);
});

test("Seal-Bearer uses simulation-driven elite candidate",()=>{
  const seal=floor1Elites.find(e=>e.id==="thresholds:seal-bearer");
  assert.equal(seal.maxHp,8);
  assert.equal(seal.dicePool,3);
  assert.equal(seal.instinct,"STRONGEST");
});

test("First Door phases cover every living HP exactly once",()=>{
  for(let hp=1;hp<=firstDoor.maxHp;hp+=1){
    const matches=firstDoor.phases.filter(p=>hp>=p.minHp&&hp<=p.maxHp);
    assert.equal(matches.length,1,`HP ${hp}`);
    assert.equal(bossPhaseAtHp(firstDoor,hp),matches[0]);
  }
  const open=bossPhaseAtHp(firstDoor,3);
  assert.equal(open.id,"open"); assert.equal(open.dicePool,4); assert.equal(open.instinct,"STRONGEST");
});
