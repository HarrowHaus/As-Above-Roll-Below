import type { EnemyDefinition } from "../types.js";
import type { GearSlot, ItemTier } from "../items/items.js";
import type { RngStream } from "../rng/rng.js";

export type PressureCost=1|2|3|4;
export interface EnemyAffixDefinition {readonly id:string;readonly displayName:string;readonly pressureCost:PressureCost;readonly compatibleTags?:readonly string[];readonly incompatibleRuleIds?:readonly string[];readonly addRuleIds?:readonly string[];readonly hpDelta?:number;readonly dicePoolDelta?:number;readonly description:string;}
export interface AffixedEnemy {readonly enemy:EnemyDefinition;readonly affixIds:readonly string[];readonly displayPrefix:string;readonly pressureAdded:number;}

export const enemyAffixRegistry:Readonly<Record<string,EnemyAffixDefinition>>={
  "affix:stubborn":{id:"affix:stubborn",displayName:"Stubborn",pressureCost:1,hpDelta:2,description:"+2 Max HP."},
  "affix:loaded":{id:"affix:loaded",displayName:"Loaded",pressureCost:2,dicePoolDelta:1,description:"Rolls one additional enemy die before its Instinct locks two."},
};

export function applyEnemyAffixes(base:EnemyDefinition,affixes:readonly EnemyAffixDefinition[],pressureBudget:number):AffixedEnemy {
  let spent=0,hp=base.maxHp,dice=base.dicePool;const rules=[...(base.ruleIds??[])],ids:string[]=[],names:string[]=[];
  for(const affix of affixes){
    if(spent+affix.pressureCost>pressureBudget)throw new Error(`Affix ${affix.id} exceeds pressure budget`);
    if(affix.compatibleTags?.length&&!affix.compatibleTags.some((tag)=>base.tags?.includes(tag)))throw new Error(`Affix ${affix.id} incompatible with ${base.id}`);
    if(affix.incompatibleRuleIds?.some((id)=>rules.includes(id)))throw new Error(`Affix ${affix.id} conflicts with ${base.id}`);
    spent+=affix.pressureCost;hp+=affix.hpDelta??0;dice+=affix.dicePoolDelta??0;for(const id of affix.addRuleIds??[])if(!rules.includes(id))rules.push(id);ids.push(affix.id);names.push(affix.displayName);
  }
  if(hp<1||dice<2||dice>6)throw new Error("Affix result outside legal enemy bounds");
  return {enemy:{...base,maxHp:hp,dicePool:dice,...(rules.length?{ruleIds:rules}:{})},affixIds:ids,displayPrefix:names.join(" "),pressureAdded:spent};
}

export type GeneratedGearTrigger="FIGHT_DIFFERENT"|"FIGHT_DOUBLES"|"RAW_FIGHT_10"|"TIE"|"MARGIN_ONE"|"SPOILS_DOUBLES"|"SPOILS_OPPOSITES";
export type GeneratedGearAction="FIGHT_PLUS_1"|"DAMAGE_PLUS_1"|"SPOILS_PLUS_1"|"HEAL_1";
export interface GeneratedGearRecipe {readonly id:string;readonly slot:GearSlot;readonly tier:ItemTier;readonly trigger:GeneratedGearTrigger;readonly action:GeneratedGearAction;readonly cadence:"ALWAYS"|"ONCE_PER_ENCOUNTER";readonly power:number;readonly rulesText:string;}

const triggers:readonly GeneratedGearTrigger[]=["FIGHT_DIFFERENT","FIGHT_DOUBLES","RAW_FIGHT_10","TIE","MARGIN_ONE","SPOILS_DOUBLES","SPOILS_OPPOSITES"];
const actions:readonly GeneratedGearAction[]=["FIGHT_PLUS_1","DAMAGE_PLUS_1","SPOILS_PLUS_1","HEAL_1"];
const triggerText:Record<GeneratedGearTrigger,string>={FIGHT_DIFFERENT:"If your Fight Dice are different",FIGHT_DOUBLES:"If your Fight Dice are doubles",RAW_FIGHT_10:"If raw Fight is 10+",TIE:"On a tie",MARGIN_ONE:"When you win by exactly 1 Margin",SPOILS_DOUBLES:"If successful Spoils Dice are doubles",SPOILS_OPPOSITES:"If successful Spoils Dice are opposite faces"};
const actionText:Record<GeneratedGearAction,string>={FIGHT_PLUS_1:"gain +1 Fight",DAMAGE_PLUS_1:"deal +1 damage",SPOILS_PLUS_1:"gain +1 Spoils (max 12)",HEAL_1:"heal 1 HP"};
function legal(trigger:GeneratedGearTrigger,action:GeneratedGearAction):boolean {if(action==="FIGHT_PLUS_1"&&trigger.startsWith("SPOILS"))return false;if(action==="SPOILS_PLUS_1"&&trigger==="TIE")return false;if(action==="HEAL_1"&&trigger==="RAW_FIGHT_10")return false;return true;}
export function generateGearRecipe(rng:RngStream,slot:GearSlot,tier:ItemTier):GeneratedGearRecipe {
  for(let attempt=0;attempt<32;attempt+=1){const trigger=rng.pick(triggers),action=rng.pick(actions);if(!legal(trigger,action))continue;const cadence:("ALWAYS"|"ONCE_PER_ENCOUNTER")=(action==="HEAL_1"||action==="DAMAGE_PLUS_1")?"ONCE_PER_ENCOUNTER":"ALWAYS";const power=(tier===1?1:tier===2?2:3);const suffix=cadence==="ONCE_PER_ENCOUNTER"?", once per encounter":"";return {id:`generated:${slot.toLowerCase()}:${trigger.toLowerCase()}:${action.toLowerCase()}`,slot,tier,trigger,action,cadence,power,rulesText:`${triggerText[trigger]}, ${actionText[action]}${suffix}.`};}throw new Error("No legal generated Gear recipe after 32 attempts");
}

export interface GrammarValidation {readonly valid:boolean;readonly errors:readonly string[];}
export function validateGeneratedGear(recipe:GeneratedGearRecipe):GrammarValidation {const errors:string[]=[];if(!legal(recipe.trigger,recipe.action))errors.push("illegal trigger/action pair");if(!recipe.rulesText.trim())errors.push("missing player-facing rules text");if(recipe.power<1||recipe.power>3)errors.push("power outside v0 budget");return {valid:errors.length===0,errors};}
