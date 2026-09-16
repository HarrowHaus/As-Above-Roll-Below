export type ItemTier = 1 | 2 | 3;
export type ItemCategory = "GEAR" | "ARTIFACT" | "CONTRABAND";
export type GearSlot = "WEAPON" | "ARMOR" | "UTILITY";

export interface ItemDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly category: ItemCategory;
  readonly tier: ItemTier;
  readonly basePrice: number;
  readonly gearSlot?: GearSlot;
  readonly unique?: boolean;
  readonly maxCopiesInInventory?: number;
  readonly effectSourceIds?: readonly string[];
  readonly tags?: readonly string[];
}

export type ItemRegistry = Readonly<Record<string, ItemDefinition>>;
export interface InventoryState { readonly gear: Readonly<Record<GearSlot,string|null>>; readonly artifacts: readonly string[]; readonly contraband: readonly string[]; }
export interface InventoryTakePlan { readonly itemId:string; readonly replacementCandidates:readonly string[]; readonly requiresReplacement:boolean; }
export interface InventoryTakeResult { readonly inventory:InventoryState; readonly removedItemId:string|null; readonly salvageCoins:number; }

export function createInventory(startingGear:Partial<Record<GearSlot,string>>={}):InventoryState { return {gear:{WEAPON:startingGear.WEAPON??null,ARMOR:startingGear.ARMOR??null,UTILITY:startingGear.UTILITY??null},artifacts:[],contraband:[]}; }
export function ownedItemIds(inventory:InventoryState):string[] { return [...Object.values(inventory.gear).filter((id):id is string=>id!==null),...inventory.artifacts,...inventory.contraband]; }
export function itemCount(inventory:InventoryState,itemId:string):number { return ownedItemIds(inventory).filter((id)=>id===itemId).length; }
export function planTakeItem(inventory:InventoryState,item:ItemDefinition):InventoryTakePlan {
  if(item.category==="GEAR"){ if(!item.gearSlot) throw new Error(`Gear ${item.id} missing gearSlot`); const current=inventory.gear[item.gearSlot]; return {itemId:item.id,replacementCandidates:current?[current]:[],requiresReplacement:current!==null}; }
  if(item.category==="ARTIFACT") return {itemId:item.id,replacementCandidates:[...inventory.artifacts],requiresReplacement:inventory.artifacts.length>=4};
  return {itemId:item.id,replacementCandidates:[...inventory.contraband],requiresReplacement:inventory.contraband.length>=2};
}
export function isOrdinaryOfferEligible(inventory:InventoryState,item:ItemDefinition):boolean { const count=itemCount(inventory,item.id); if((item.category==="ARTIFACT"||item.category==="GEAR"||item.unique)&&count>0) return false; const maxCopies=item.maxCopiesInInventory??(item.category==="CONTRABAND"?2:1); return count<maxCopies; }
export function salvageValue(item:ItemDefinition):number { return item.category==="CONTRABAND"?0:Math.floor(item.basePrice*0.5); }
export function removeItem(inventory:InventoryState,itemId:string):InventoryState {
  const gearEntry=(Object.entries(inventory.gear) as [GearSlot,string|null][]).find(([,id])=>id===itemId);
  if(gearEntry) return {...inventory,gear:{...inventory.gear,[gearEntry[0]]:null}};
  if(inventory.artifacts.includes(itemId)){ const index=inventory.artifacts.indexOf(itemId); const artifacts=[...inventory.artifacts]; artifacts.splice(index,1); return {...inventory,artifacts}; }
  if(inventory.contraband.includes(itemId)){ const index=inventory.contraband.indexOf(itemId); const contraband=[...inventory.contraband]; contraband.splice(index,1); return {...inventory,contraband}; }
  throw new Error(`Cannot remove unowned item ${itemId}`);
}
export function consumeContraband(inventory:InventoryState,itemId:string):InventoryState {
  if(!inventory.contraband.includes(itemId)) throw new Error(`Contraband ${itemId} is not in inventory`);
  return removeItem(inventory,itemId);
}
export function applyTakeItem(inventory:InventoryState,item:ItemDefinition,registry:ItemRegistry,replacementItemId?:string):InventoryTakeResult {
  const plan=planTakeItem(inventory,item);
  if(plan.requiresReplacement&&!replacementItemId) throw new Error(`Taking ${item.id} requires replacement`);
  if(replacementItemId&&!plan.replacementCandidates.includes(replacementItemId)) throw new Error(`${replacementItemId} is not a valid replacement for ${item.id}`);
  let removedItemId:string|null=null; let next:InventoryState=inventory;
  if(item.category==="GEAR"){ const slot=item.gearSlot!; removedItemId=inventory.gear[slot]; next={...inventory,gear:{...inventory.gear,[slot]:item.id}}; }
  else if(item.category==="ARTIFACT"){ let artifacts=[...inventory.artifacts]; if(replacementItemId){removedItemId=replacementItemId;artifacts=artifacts.filter((id)=>id!==replacementItemId);} artifacts.push(item.id); next={...inventory,artifacts}; }
  else { const contraband=[...inventory.contraband]; if(replacementItemId){removedItemId=replacementItemId;const index=contraband.indexOf(replacementItemId);if(index>=0)contraband.splice(index,1);} contraband.push(item.id); next={...inventory,contraband}; }
  const removed=removedItemId?registry[removedItemId]:undefined;
  return {inventory:next,removedItemId,salvageCoins:removed?salvageValue(removed):0};
}
