import type { RngStream } from "../rng/rng.js";
import type { EconomyState } from "../economy/economy.js";
import { addCoins, spendCoins } from "../economy/economy.js";
import type { ProgressionState } from "../progression/progression.js";
import { applyDamage } from "../progression/progression.js";
import type { InventoryState, ItemCategory, ItemRegistry, ItemTier } from "../items/items.js";
import { isOrdinaryOfferEligible, removeItem } from "../items/items.js";

export type EventAction =
  | {readonly type:"DAMAGE";readonly amount:number}
  | {readonly type:"ADD_COINS";readonly amount:number}
  | {readonly type:"SPEND_COINS";readonly amount:number}
  | {readonly type:"RANDOM_ITEM_OFFER";readonly categories:readonly ItemCategory[];readonly tier:ItemTier;readonly forced?:boolean}
  | {readonly type:"ROLL_D6_TABLE";readonly entries:readonly {readonly min:number;readonly max:number;readonly actions:readonly EventAction[]}[]}
  | {readonly type:"REVEAL_NEXT_ENCOUNTER"}
  | {readonly type:"REMOVE_SELECTED_FOR_VALUE";readonly multiplier:number};

export interface EventChoiceDefinition { readonly id:string; readonly actions:readonly EventAction[]; }
export interface EventDefinition { readonly id:string; readonly choices:readonly EventChoiceDefinition[]; }
export interface EventRunState { readonly progression:ProgressionState; readonly economy:EconomyState; readonly inventory:InventoryState; }
export interface EventSelection { readonly itemId?:string; }
export interface EventResolution {
  readonly state:EventRunState;
  readonly itemOffers:readonly {readonly itemId:string;readonly forced:boolean}[];
  readonly revealNextEncounter:boolean;
  readonly log:readonly string[];
}

function drawItem(registry:ItemRegistry,inventory:InventoryState,rng:RngStream,categories:readonly ItemCategory[],tier:ItemTier):string|null {
  const pool=Object.values(registry).filter((item)=>categories.includes(item.category)&&item.tier===tier&&isOrdinaryOfferEligible(inventory,item));
  return pool.length?rng.pick(pool).id:null;
}

function applyActions(
  input:EventRunState,actions:readonly EventAction[],registry:ItemRegistry,rng:RngStream,selection:EventSelection,
  offers:{itemId:string;forced:boolean}[],log:string[],flags:{reveal:boolean},
):EventRunState {
  let state=input;
  for(const action of actions){
    switch(action.type){
      case "DAMAGE": state={...state,progression:applyDamage(state.progression,action.amount)}; log.push(`damage:${action.amount}`); break;
      case "ADD_COINS": state={...state,economy:addCoins(state.economy,action.amount)}; log.push(`coins:+${action.amount}`); break;
      case "SPEND_COINS": state={...state,economy:spendCoins(state.economy,action.amount)}; log.push(`coins:-${action.amount}`); break;
      case "RANDOM_ITEM_OFFER": {
        const itemId=drawItem(registry,state.inventory,rng,action.categories,action.tier);
        if(itemId) offers.push({itemId,forced:action.forced??false});
        log.push(itemId?`offer:${itemId}`:"offer:none"); break;
      }
      case "ROLL_D6_TABLE": {
        const roll=rng.int(1,6); const entry=action.entries.find((candidate)=>roll>=candidate.min&&roll<=candidate.max);
        if(!entry) throw new Error(`Event roll table has no entry for ${roll}`);
        log.push(`d6:${roll}`); state=applyActions(state,entry.actions,registry,rng,selection,offers,log,flags); break;
      }
      case "REVEAL_NEXT_ENCOUNTER": flags.reveal=true; log.push("reveal-next"); break;
      case "REMOVE_SELECTED_FOR_VALUE": {
        if(!selection.itemId) throw new Error("Event choice requires an item selection");
        const item=registry[selection.itemId]; if(!item) throw new Error(`Unknown selected item ${selection.itemId}`);
        if(!Object.values(state.inventory.gear).includes(item.id)&&!state.inventory.artifacts.includes(item.id)) throw new Error("Selected item is not removable persistent inventory");
        const value=Math.floor(item.basePrice*action.multiplier);
        state={...state,inventory:removeItem(state.inventory,item.id),economy:addCoins(state.economy,value)};
        log.push(`removed:${item.id}:coins:+${value}`); break;
      }
      default:{const exhaustive:never=action;throw new Error(`Unhandled Event action ${String(exhaustive)}`);}
    }
  }
  return state;
}

export function resolveEventChoice(
  definition:EventDefinition,choiceId:string,state:EventRunState,registry:ItemRegistry,rng:RngStream,selection:EventSelection={},
):EventResolution {
  const choice=definition.choices.find((candidate)=>candidate.id===choiceId);
  if(!choice) throw new Error(`Event ${definition.id} has no choice ${choiceId}`);
  const offers:{itemId:string;forced:boolean}[]=[]; const log:string[]=[]; const flags={reveal:false};
  const next=applyActions(state,choice.actions,registry,rng,selection,offers,log,flags);
  return {state:next,itemOffers:offers,revealNextEncounter:flags.reveal,log};
}
