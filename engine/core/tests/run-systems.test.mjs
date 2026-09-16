import test from "node:test";
import assert from "node:assert/strict";
import {
  applyTakeItem, buyHealing, createEconomy, createInventory, createProgression, floor1ItemRegistry,
  generateLootDraft, generateShopStock, grantXp, planTakeItem, rewardBand, RngStream
} from "../dist/index.js";

test("inventory enforces 3 Gear / 4 Artifact / 2 Contraband pressure",()=>{
  let inv=createInventory({ARMOR:"work-apron"});
  const weapon=floor1ItemRegistry["bent-knife"];
  inv=applyTakeItem(inv,weapon,floor1ItemRegistry).inventory;
  assert.equal(inv.gear.WEAPON,"bent-knife");
  const replacement=planTakeItem(inv,floor1ItemRegistry["twin-nails"]);
  assert.equal(replacement.requiresReplacement,true); assert.deepEqual(replacement.replacementCandidates,["bent-knife"]);
  const result=applyTakeItem(inv,floor1ItemRegistry["twin-nails"],floor1ItemRegistry,"bent-knife");
  assert.equal(result.inventory.gear.WEAPON,"twin-nails"); assert.equal(result.salvageCoins,2);
});

test("Level thresholds add Max HP/heal and create sparse Technique gates",()=>{
  let p=createProgression(20);
  let r=grantXp(p,3); p=r.state;
  assert.equal(p.level,2); assert.equal(p.maxHp,22); assert.equal(p.hp,22);
  r=grantXp(p,4); p=r.state;
  assert.equal(p.level,3); assert.deepEqual(p.pendingTechniqueLevels,[3]); assert.equal(p.maxHp,24);
});

test("Spoils bands and Elite uplift are exact",()=>{
  assert.equal(rewardBand(2),1); assert.equal(rewardBand(7),2); assert.equal(rewardBand(10),3); assert.equal(rewardBand(12),4);
  assert.equal(rewardBand(6,1),3); assert.equal(rewardBand(12,1),4);
});

test("Loot Drafts are deterministic, three offers, unique, and obey premium constraints",()=>{
  const inv=createInventory();
  const a=generateLootDraft(11,floor1ItemRegistry,inv,RngStream.fromMaster("loot-seed","loot"));
  const b=generateLootDraft(11,floor1ItemRegistry,inv,RngStream.fromMaster("loot-seed","loot"));
  assert.deepEqual(a,b); assert.equal(a.offers.length,3); assert.equal(a.band,4);
  const items=a.offers.filter(o=>o.type==="ITEM").map(o=>floor1ItemRegistry[o.itemId]);
  assert.ok(items.filter(i=>i.category==="GEAR"||i.category==="ARTIFACT").length>=2);
  assert.equal(new Set(a.offers.map(o=>o.type==="ITEM"?o.itemId:`coins:${o.amount}`)).size,3);
});

test("Shop stock is seeded and category-correct",()=>{
  const inv=createInventory();
  const stock=generateShopStock(floor1ItemRegistry,inv,RngStream.fromMaster(99,"shop"));
  assert.equal(floor1ItemRegistry[stock.gear.itemId].category,"GEAR");
  assert.ok(stock.artifacts.every(o=>floor1ItemRegistry[o.itemId].category==="ARTIFACT"));
  assert.equal(floor1ItemRegistry[stock.contraband.itemId].category,"CONTRABAND");
  assert.equal(stock.healPrice,4);
});

test("Shop healing spends coins and cannot exceed Max HP",()=>{
  const economy=createEconomy(7);
  const hurt={...createProgression(20),hp:14};
  const result=buyHealing(economy,hurt);
  assert.equal(result.economy.coins,3); assert.equal(result.progression.hp,18);
});
