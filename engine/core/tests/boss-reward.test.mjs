import test from "node:test";
import assert from "node:assert/strict";
import { RngService, createInventory, floor1BossDraftItemIds, floor1ItemRegistry, generateBossDraft } from "../dist/index.js";

test("Boss Draft is deterministic and contains three premium persistent items",()=>{
  const a=generateBossDraft(floor1BossDraftItemIds,floor1ItemRegistry,createInventory(),new RngService(77).stream("boss:reward"));
  const b=generateBossDraft(floor1BossDraftItemIds,floor1ItemRegistry,createInventory(),new RngService(77).stream("boss:reward"));
  assert.deepEqual(a,b);
  assert.equal(a.offers.length,3);
  assert.equal(a.band,4);
  for(const offer of a.offers){
    assert.equal(offer.type,"ITEM");
    const item=floor1ItemRegistry[offer.itemId];
    assert.ok(item);
    assert.ok(item.tier>=2);
    assert.ok(item.category==="GEAR"||item.category==="ARTIFACT");
  }
});
