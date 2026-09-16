import type { ManipulationReactionDefinition } from "../combat/manipulation-reactions.js";

export const sealWhelpManipulationReaction:ManipulationReactionDefinition={
  id:"rule:seal-whelp:reaction-on-manipulation",
  sourceId:"enemy:seal-whelp",
  maxTriggersPerRound:1,
  actions:[{type:"ADD_ENEMY_FIGHT",value:1}],
};

export const sealBearerCountersealReaction:ManipulationReactionDefinition={
  id:"rule:seal-bearer:counterseal",
  sourceId:"enemy:seal-bearer",
  maxTriggersPerRound:1,
  actions:[{type:"BUMP_LOWEST_ENEMY_LOCKED",delta:1}],
};

export const floor1ManipulationReactionRegistry:Readonly<Record<string,ManipulationReactionDefinition>>=Object.fromEntries([
  sealWhelpManipulationReaction,
  sealBearerCountersealReaction,
].map((definition)=>[definition.id,definition]));
