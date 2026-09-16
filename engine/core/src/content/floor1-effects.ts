import type { EffectDefinition } from "../effects/effects.js";

export const bentKnifeEffect: EffectDefinition = {id:"gear:bent-knife:different-plus1",sourceId:"gear:bent-knife",timing:"FIGHT_MODIFICATION",priority:300,condition:{type:"fight_dice_different"},actions:[{type:"add_fight",value:1}]};
export const twinNailsEffect: EffectDefinition = {id:"gear:twin-nails:doubles-plus2",sourceId:"gear:twin-nails",timing:"FIGHT_MODIFICATION",priority:300,condition:{type:"fight_dice_doubles"},actions:[{type:"add_fight",value:2}]};
export const breachingBarEffect: EffectDefinition = {id:"gear:breaching-bar:raw10-bonus",sourceId:"gear:breaching-bar",timing:"DAMAGE_MODIFICATION",priority:300,condition:{type:"raw_fight_at_least",value:10},actions:[{type:"add_damage_to_enemy",value:2}]};
export const proofVestEffect: EffectDefinition = {id:"gear:proof-vest:first-reduction",sourceId:"gear:proof-vest",timing:"DAMAGE_MODIFICATION",priority:300,condition:{type:"outcome",value:"loss"},actions:[{type:"reduce_player_damage",value:2}],maxUsesPerEncounter:1};
export const loadedQuestionEffect: EffectDefinition = {id:"artifact:loaded-question:doubles",sourceId:"artifact:loaded-question",timing:"SPOILS_MODIFICATION",priority:400,condition:{type:"spoils_doubles"},actions:[{type:"add_spoils_score",value:2,cap:12}]};
export const falseBottomEffect: EffectDefinition = {id:"artifact:false-bottom:low-spoils",sourceId:"artifact:false-bottom",timing:"SPOILS_MODIFICATION",priority:410,condition:{type:"spoils_score_at_most",value:5},actions:[{type:"add_spoils_score",value:2,cap:12}]};
export const oppositeNumberEffect: EffectDefinition = {id:"artifact:opposite-number:opposites",sourceId:"artifact:opposite-number",timing:"SPOILS_MODIFICATION",priority:420,condition:{type:"spoils_opposites"},actions:[{type:"add_spoils_score",value:3,cap:12}]};

export const tollEaterGreedTaxEffect: EffectDefinition = {id:"enemy:toll-eater:take-your-cut",sourceId:"enemy:toll-eater",timing:"FIGHT_MODIFICATION",priority:100,condition:{type:"spoils_score_at_least",value:9},actions:[{type:"add_fight",value:-1}]};
export const passageClerkDuplicateFilingEffect: EffectDefinition = {id:"enemy:passage-clerk:duplicate-filing",sourceId:"enemy:passage-clerk",timing:"FIGHT_MODIFICATION",priority:100,condition:{type:"fight_dice_doubles"},actions:[{type:"add_enemy_fight",value:2}]};
export const sealWhelpReactionEffect: EffectDefinition = {id:"enemy:seal-whelp:reaction-seal",sourceId:"enemy:seal-whelp",timing:"FIGHT_MODIFICATION",priority:100,condition:{type:"always"},actions:[{type:"add_enemy_fight",value:1}],maxUsesPerEncounter:1};
export const firstDoorAjarDraftEffect: EffectDefinition = {id:"boss:first-door:ajar-draft",sourceId:"boss:first-door",timing:"FIGHT_MODIFICATION",priority:100,condition:{type:"spoils_greater_than_raw_fight"},actions:[{type:"add_enemy_fight",value:1}]};

export const floor1EffectRegistry: Readonly<Record<string,EffectDefinition>> = Object.fromEntries([
  bentKnifeEffect,twinNailsEffect,breachingBarEffect,proofVestEffect,loadedQuestionEffect,falseBottomEffect,oppositeNumberEffect,
  tollEaterGreedTaxEffect,passageClerkDuplicateFilingEffect,sealWhelpReactionEffect,firstDoorAjarDraftEffect,
].map((effect)=>[effect.id,effect]));
