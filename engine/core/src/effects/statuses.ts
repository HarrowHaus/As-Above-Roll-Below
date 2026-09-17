export type StatusOwner="PLAYER"|"ENEMY";
export type StatusExpiry="ROUND_END"|"ENCOUNTER_END";
export interface StatusDefinition {readonly id:string;readonly displayName:string;readonly owner:StatusOwner;readonly maxStacks:number;readonly expiry:StatusExpiry;readonly rulesText:string;}
export interface StatusInstance {readonly statusId:string;readonly stacks:number;readonly roundsRemaining?:number;}
export interface StatusState {readonly player:readonly StatusInstance[];readonly enemy:readonly StatusInstance[];}
export function createStatusState():StatusState{return {player:[],enemy:[]};}
export function applyStatus(state:StatusState,definition:StatusDefinition,stacks=1,roundsRemaining?:number):StatusState {if(stacks<1)throw new Error("Status stacks must be positive");const key=definition.owner==="PLAYER"?"player":"enemy";const list=[...state[key]],index=list.findIndex((entry)=>entry.statusId===definition.id);if(index>=0){const current=list[index]!;list[index]={...current,stacks:Math.min(definition.maxStacks,current.stacks+stacks),...(roundsRemaining!==undefined?{roundsRemaining:Math.max(current.roundsRemaining??0,roundsRemaining)}:{})};}else list.push({statusId:definition.id,stacks:Math.min(definition.maxStacks,stacks),...(roundsRemaining!==undefined?{roundsRemaining}:{})});return {...state,[key]:list};}
export function tickRoundStatuses(state:StatusState,registry:Readonly<Record<string,StatusDefinition>>):StatusState {const tick=(list:readonly StatusInstance[])=>list.flatMap((entry)=>{const def=registry[entry.statusId];if(!def)throw new Error(`Unknown status ${entry.statusId}`);if(def.expiry!=="ROUND_END"||entry.roundsRemaining===undefined)return [entry];const next=entry.roundsRemaining-1;return next<=0?[]:[{...entry,roundsRemaining:next}];});return {player:tick(state.player),enemy:tick(state.enemy)};}
export const statusRegistryV0:Readonly<Record<string,StatusDefinition>>={
 "status:player:marked":{id:"status:player:marked",displayName:"Marked",owner:"PLAYER",maxStacks:3,expiry:"ROUND_END",rulesText:"Temporary test status. Persists for its listed number of rounds."},
 "status:enemy:frayed":{id:"status:enemy:frayed",displayName:"Frayed",owner:"ENEMY",maxStacks:3,expiry:"ROUND_END",rulesText:"Temporary test status. Persists for its listed number of rounds."},
};
