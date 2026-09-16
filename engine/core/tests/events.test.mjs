import test from "node:test";
import assert from "node:assert/strict";
import {
  createEconomy, createInventory, createProgression, floor1ItemRegistry,
  lostPropertyOffice, resolveEventChoice, RngStream, talkingBoard1891, unnumberedDoor
} from "../dist/index.js";

function state(){return {progression:createProgression(20),economy:createEconomy(5),inventory:createInventory({ARMOR:"work-apron"})};}

test("Talking Board choices resolve through generic Event actions",()=>{
  const result=resolveEventChoice(talkingBoard1891,"put-back",state(),floor1ItemRegistry,RngStream.fromMaster(1,"event"));
  assert.equal(result.state.economy.coins,7);
  const reveal=resolveEventChoice(talkingBoard1891,"ask-ahead",state(),floor1ItemRegistry,RngStream.fromMaster(1,"event"));
  assert.equal(reveal.revealNextEncounter,true);
});

test("Unnumbered Door force damages and returns a Tier II Artifact offer",()=>{
  const result=resolveEventChoice(unnumberedDoor,"force",state(),floor1ItemRegistry,RngStream.fromMaster(2,"event"));
  assert.equal(result.state.progression.hp,17);
  assert.equal(result.itemOffers.length,1);
  const item=floor1ItemRegistry[result.itemOffers[0].itemId];
  assert.equal(item.category,"ARTIFACT"); assert.equal(item.tier,2);
});

test("Lost Property can remove persistent inventory for 75 percent value",()=>{
  const result=resolveEventChoice(lostPropertyOffice,"file-item",state(),floor1ItemRegistry,RngStream.fromMaster(3,"event"),{itemId:"work-apron"});
  assert.equal(result.state.inventory.gear.ARMOR,null);
  assert.equal(result.state.economy.coins,8);
});
