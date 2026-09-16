import type { RngStream } from "../rng/rng.js";
import type { InventoryState, ItemCategory, ItemDefinition, ItemRegistry, ItemTier } from "../items/items.js";
import { isOrdinaryOfferEligible } from "../items/items.js";

export interface ShopItemOffer { readonly itemId:string; readonly price:number; }
export interface ShopStock { readonly gear:ShopItemOffer; readonly artifacts:readonly [ShopItemOffer,ShopItemOffer]; readonly contraband:ShopItemOffer; readonly healAmount:4; readonly healPrice:4; }

function choose(
  registry:ItemRegistry, inventory:InventoryState, rng:RngStream,
  category:ItemCategory, maxTier:ItemTier, excluded:Set<string>,
):ShopItemOffer {
  const pool=Object.values(registry).filter((item:ItemDefinition)=>item.category===category && item.tier<=maxTier && !excluded.has(item.id) && isOrdinaryOfferEligible(inventory,item));
  if(!pool.length) throw new Error(`No eligible ${category} shop item`);
  const item=rng.pick(pool); excluded.add(item.id); return {itemId:item.id,price:item.basePrice};
}

export function generateShopStock(
  registry:ItemRegistry, inventory:InventoryState, rng:RngStream, maxTier:ItemTier=2,
):ShopStock {
  const excluded=new Set<string>();
  const gear=choose(registry,inventory,rng,"GEAR",maxTier,excluded);
  const artifact1=choose(registry,inventory,rng,"ARTIFACT",maxTier,excluded);
  const artifact2=choose(registry,inventory,rng,"ARTIFACT",maxTier,excluded);
  const contraband=choose(registry,inventory,rng,"CONTRABAND",maxTier,excluded);
  return {gear,artifacts:[artifact1,artifact2],contraband,healAmount:4,healPrice:4};
}
