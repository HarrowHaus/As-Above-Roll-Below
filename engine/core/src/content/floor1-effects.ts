import type { EffectDefinition } from "../effects/effects.js";

export const bentKnifeEffect: EffectDefinition = {
  id:"gear:bent-knife:different-plus1", sourceId:"gear:bent-knife", timing:"FIGHT_MODIFICATION", priority:300,
  condition:{type:"fight_dice_different"}, actions:[{type:"add_fight",value:1}],
};

export const twinNailsEffect: EffectDefinition = {
  id:"gear:twin-nails:doubles-plus2", sourceId:"gear:twin-nails", timing:"FIGHT_MODIFICATION", priority:300,
  condition:{type:"fight_dice_doubles"}, actions:[{type:"add_fight",value:2}],
};

export const breachingBarEffect: EffectDefinition = {
  id:"gear:breaching-bar:raw10-bonus", sourceId:"gear:breaching-bar", timing:"DAMAGE_MODIFICATION", priority:300,
  condition:{type:"raw_fight_at_least",value:10}, actions:[{type:"add_damage_to_enemy",value:2}],
};

export const proofVestEffect: EffectDefinition = {
  id:"gear:proof-vest:first-reduction", sourceId:"gear:proof-vest", timing:"DAMAGE_MODIFICATION", priority:300,
  condition:{type:"outcome",value:"loss"}, actions:[{type:"reduce_player_damage",value:2}], maxUsesPerEncounter:1,
};

export const loadedQuestionEffect: EffectDefinition = {
  id:"artifact:loaded-question:doubles", sourceId:"artifact:loaded-question", timing:"SPOILS_MODIFICATION", priority:400,
  condition:{type:"spoils_doubles"}, actions:[{type:"add_spoils_score",value:2,cap:12}],
};

export const falseBottomEffect: EffectDefinition = {
  id:"artifact:false-bottom:low-spoils", sourceId:"artifact:false-bottom", timing:"SPOILS_MODIFICATION", priority:410,
  condition:{type:"spoils_score_at_most",value:5}, actions:[{type:"add_spoils_score",value:2,cap:12}],
};

export const oppositeNumberEffect: EffectDefinition = {
  id:"artifact:opposite-number:opposites", sourceId:"artifact:opposite-number", timing:"SPOILS_MODIFICATION", priority:420,
  condition:{type:"spoils_opposites"}, actions:[{type:"add_spoils_score",value:3,cap:12}],
};
