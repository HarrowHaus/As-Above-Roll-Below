import type { CombatItemAction, OutsideCombatItemAction } from "../items/item-actions.js";

export interface ItemActionDefinition {
  readonly itemId:string;
  readonly combat?:CombatItemAction;
  readonly outsideCombat?:OutsideCombatItemAction;
  readonly maxUsesPerEncounter?:number;
  readonly consumeOnUse?:boolean;
}

const actions:ItemActionDefinition[]=[
  {itemId:"mirror-shard",combat:{type:"FLIP_PLAYER_DIE"},maxUsesPerEncounter:1},
  {itemId:"hidden-hand",combat:{type:"LOWER_HIGHEST_ENEMY_DIE",amount:1},maxUsesPerEncounter:1},
  {itemId:"carbon-paper",combat:{type:"COPY_PLAYER_DIE"},maxUsesPerEncounter:1},
  {itemId:"blank-face",combat:{type:"TRANSMUTE_PLAYER_DIE",allowed:[1,6]},maxUsesPerEncounter:1},

  {itemId:"redacted-slip",combat:{type:"REROLL_PLAYER_DIE"},consumeOnUse:true},
  {itemId:"counterfeit-seal",combat:{type:"SET_PLAYER_DIE",value:4},consumeOnUse:true},
  {itemId:"wire-cutter",combat:{type:"LOWER_HIGHEST_ENEMY_DIE",amount:1},consumeOnUse:true},
  {itemId:"carbon-copy",combat:{type:"COPY_PLAYER_DIE"},consumeOnUse:true},
  {itemId:"temporary-injunction",combat:{type:"SUPPRESS_ENEMY_RULES_ROUND"},consumeOnUse:true},
  {itemId:"emergency-key",outsideCombat:{type:"HEAL_PLAYER",amount:4},consumeOnUse:true},
];

export const floor1ItemActionRegistry:Readonly<Record<string,ItemActionDefinition>>=Object.fromEntries(actions.map((entry)=>[entry.itemId,entry]));
