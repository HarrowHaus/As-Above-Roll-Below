import type { RngStream } from "../rng/rng.js";
import type { InventoryState, ItemCategory, ItemDefinition, ItemRegistry, ItemTier } from "../items/items.js";
import { isOrdinaryOfferEligible } from "../items/items.js";

export type RewardBand = 1|2|3|4;
export type LootOffer =
  | { readonly type:"ITEM"; readonly itemId:string }
  | { readonly type:"COINS"; readonly amount:number };

export interface LootDraft { readonly score:number; readonly band:RewardBand; readonly offers:readonly LootOffer[]; }

export function rewardBand(score:number, eliteUplift=0):RewardBand {
  if (!Number.isInteger(score) || score<2 || score>12) throw new Error(`Invalid Spoils score ${score}`);
  const base:RewardBand=score<=4?1:score<=7?2:score<=10?3:4;
  return Math.min(4,base+eliteUplift) as RewardBand;
}

function tierForBand(rng:RngStream,band:RewardBand):ItemTier {
  const roll=rng.nextFloat();
  if (band===1) return 1;
  if (band===2) return roll<0.8?1:2;
  if (band===3) return roll<0.35?1:2;
  return roll<0.75?2:3;
}

function categoryForBand(rng:RngStream,band:RewardBand):ItemCategory|"COINS" {
  const roll=rng.int(1,100);
  if (roll<=30) return "GEAR";
  if (roll<=65) return "ARTIFACT";
  if (roll<=90) return "CONTRABAND";
  return band===4?"ARTIFACT":"COINS";
}

function coinAmount(band:RewardBand):number { return band===1?4:band===2?5:6; }

function eligibleItems(registry:ItemRegistry,inventory:InventoryState,category:ItemCategory,tier:ItemTier):ItemDefinition[] {
  return Object.values(registry).filter((item)=>item.category===category && item.tier===tier && isOrdinaryOfferEligible(inventory,item));
}

function persistent(item:ItemDefinition):boolean { return item.category==="GEAR" || item.category==="ARTIFACT"; }

function drawItemOffer(
  rng:RngStream, registry:ItemRegistry, inventory:InventoryState, band:RewardBand,
  excluded:Set<string>, forcedCategory?:ItemCategory, minTier:ItemTier=1,
):LootOffer|null {
  for(let attempt=0;attempt<40;attempt+=1){
    const category=forcedCategory ?? categoryForBand(rng,band);
    if(category==="COINS") return {type:"COINS",amount:coinAmount(band)};
    let tier=tierForBand(rng,band);
    if(tier<minTier) tier=minTier;
    const pool=eligibleItems(registry,inventory,category,tier).filter((item)=>!excluded.has(item.id));
    if(pool.length){ const item=rng.pick(pool); return {type:"ITEM",itemId:item.id}; }
  }
  return null;
}

export function generateLootDraft(
  score:number,
  registry:ItemRegistry,
  inventory:InventoryState,
  rng:RngStream,
  eliteUplift=0,
):LootDraft {
  const band=rewardBand(score,eliteUplift);
  const offers:LootOffer[]=[];
  const excluded=new Set<string>();
  for(let i=0;i<3;i+=1){
    const offer=drawItemOffer(rng,registry,inventory,band,excluded) ?? {type:"COINS" as const,amount:coinAmount(band)};
    offers.push(offer); if(offer.type==="ITEM") excluded.add(offer.itemId);
  }

  const itemFor=(offer:LootOffer)=>offer.type==="ITEM"?registry[offer.itemId]:undefined;
  const hasPersistent=()=>offers.some((offer)=>{const item=itemFor(offer);return item?persistent(item):false;});
  const tier2Persistent=()=>offers.some((offer)=>{const item=itemFor(offer);return item?persistent(item)&&item.tier>=2:false;});
  const persistentCount=()=>offers.filter((offer)=>{const item=itemFor(offer);return item?persistent(item):false;}).length;

  const forcePersistent=(index:number,minTier:ItemTier)=>{
    const categories:ItemCategory[]=["ARTIFACT","GEAR"];
    for(const category of rng.shuffle(categories)){
      const offer=drawItemOffer(rng,registry,inventory,band,excluded,category,minTier);
      if(offer?.type==="ITEM"){
        const previous=offers[index]; if(previous?.type==="ITEM") excluded.delete(previous.itemId);
        offers[index]=offer; excluded.add(offer.itemId); return true;
      }
    }
    return false;
  };

  if(band>=2 && !hasPersistent()) forcePersistent(0,1);
  if(band>=3 && !tier2Persistent()) forcePersistent(0,2);
  if(band===4){
    if(persistentCount()<2) forcePersistent(1,2);
    if(persistentCount()<2) forcePersistent(2,2);
  }
  if(band===1 && offers.every((offer)=>offer.type==="COINS")) forcePersistent(0,1);

  return {score,band,offers};
}
