import type { RoomType } from "../types.js";
import type { RngStream } from "../rng/rng.js";

export type DescentRoomType = Exclude<RoomType,"BOSS">;

export interface DescentSlotRule {
  readonly allowedTypes: readonly DescentRoomType[];
}

export interface DescentGuarantees {
  readonly minCombats: number;
  readonly minEvents: number;
  readonly minShops: number;
  readonly maxElites: number;
  readonly maxConsecutiveCombats: number;
}

export interface DescentDefinition {
  readonly id: string;
  readonly slots: readonly DescentSlotRule[];
  readonly guarantees: DescentGuarantees;
  readonly bossId: string;
}

export interface DescentStep {
  readonly id: string;
  readonly depth: number;
  readonly type: RoomType;
}

export interface DescentSequence {
  readonly definitionId: string;
  readonly steps: readonly DescentStep[];
  readonly bossStepId: string;
}

export interface DescentValidation {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

function longestCombatStreak(types:readonly DescentRoomType[]):number {
  let best=0,current=0;
  for(const type of types){
    if(type==="COMBAT"){current+=1;best=Math.max(best,current);}else current=0;
  }
  return best;
}

export function validateDescentTypes(definition:DescentDefinition,types:readonly DescentRoomType[]):DescentValidation {
  const errors:string[]=[];
  if(types.length!==definition.slots.length)errors.push(`Expected ${definition.slots.length} pre-boss Depths, got ${types.length}`);

  for(let i=0;i<Math.min(types.length,definition.slots.length);i+=1){
    const type=types[i]!,slot=definition.slots[i]!;
    if(!slot.allowedTypes.includes(type))errors.push(`Depth ${i+1} does not allow ${type}`);
  }

  const count=(type:DescentRoomType)=>types.filter((candidate)=>candidate===type).length;
  if(count("COMBAT")<definition.guarantees.minCombats)errors.push(`Requires at least ${definition.guarantees.minCombats} Combats`);
  if(count("EVENT")<definition.guarantees.minEvents)errors.push(`Requires at least ${definition.guarantees.minEvents} Events`);
  if(count("SHOP")<definition.guarantees.minShops)errors.push(`Requires at least ${definition.guarantees.minShops} Shops`);
  if(count("ELITE")>definition.guarantees.maxElites)errors.push(`Allows at most ${definition.guarantees.maxElites} Elites`);
  if(longestCombatStreak(types)>definition.guarantees.maxConsecutiveCombats)errors.push(`Combat streak exceeds ${definition.guarantees.maxConsecutiveCombats}`);

  return {valid:errors.length===0,errors};
}

export function generateDescent(definition:DescentDefinition,rng:RngStream):DescentSequence {
  if(definition.slots.length===0)throw new Error("Descent requires at least one pre-boss Depth");
  for(const [index,slot] of definition.slots.entries()){
    if(slot.allowedTypes.length===0)throw new Error(`Depth ${index+1} has no allowed room types`);
  }

  let chosen:DescentRoomType[]|null=null;
  for(let attempt=0;attempt<512;attempt+=1){
    const candidate=definition.slots.map((slot)=>rng.pick(slot.allowedTypes));
    if(validateDescentTypes(definition,candidate).valid){chosen=candidate;break;}
  }
  if(!chosen)throw new Error(`Unable to generate valid descent for ${definition.id}`);

  const steps:DescentStep[] = chosen.map((type,index)=>({
    id:`${definition.id}:depth:${index+1}`,
    depth:index+1,
    type,
  }));
  const bossStep:DescentStep={
    id:`${definition.id}:boss`,
    depth:steps.length+1,
    type:"BOSS",
  };
  steps.push(bossStep);
  return {definitionId:definition.id,steps,bossStepId:bossStep.id};
}
