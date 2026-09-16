import type { CastConstraintDefinition } from "../combat/cast-constraints.js";

const constraints:CastConstraintDefinition[]=[
  {id:"rule:unadmitted:fix-lowest",sourceId:"enemy:unadmitted",actions:[{type:"FIX_LOWEST_PLAYER_DIE"}]},
  {id:"rule:threshold-warden:fix-highest",sourceId:"enemy:threshold-warden",actions:[{type:"FIX_HIGHEST_PLAYER_DIE"}]},
];

export const floor1CastConstraintRegistry:Readonly<Record<string,CastConstraintDefinition>>=Object.fromEntries(
  constraints.map((constraint)=>[constraint.id,constraint]),
);
