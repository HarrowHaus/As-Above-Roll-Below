import type { FloorDefinition, FloorGraph, FloorNode, RoomType } from "../types.js";
import { generateRun } from "../procgen/run.js";
import { createProgression, type ProgressionState } from "../progression/progression.js";
import { createEconomy, type EconomyState } from "../economy/economy.js";
import { createInventory, type GearSlot, type InventoryState } from "../items/items.js";

export type RunPhase =
  | "RUN_MAP"
  | "COMBAT"
  | "ELITE"
  | "EVENT"
  | "SHOP"
  | "BOSS"
  | "RUN_DEATH"
  | "RUN_VICTORY";

export interface RunState {
  readonly seed: number;
  readonly floors: readonly FloorGraph[];
  readonly floorIndex: number;
  readonly currentNodeId: string | null;
  readonly lastCompletedNodeId: string | null;
  readonly visitedNodeIds: readonly string[];
  readonly phase: RunPhase;
  readonly progression: ProgressionState;
  readonly economy: EconomyState;
  readonly inventory: InventoryState;
  readonly encounterHistory: readonly { readonly enemyId:string; readonly instinct:string }[];
  readonly eventHistory: readonly string[];
}

export interface CreateRunOptions {
  readonly startingMaxHp?: number;
  readonly startingCoins?: number;
  readonly startingGear?: Partial<Record<GearSlot,string>>;
}

function roomPhase(type: RoomType): RunPhase {
  switch(type){
    case "COMBAT": return "COMBAT";
    case "ELITE": return "ELITE";
    case "EVENT": return "EVENT";
    case "SHOP": return "SHOP";
    case "BOSS": return "BOSS";
  }
}

export function createRunState(seed:number,definitions:readonly FloorDefinition[],options:CreateRunOptions={}):RunState {
  if(definitions.length===0) throw new Error("Run requires at least one Floor definition");
  const generated=generateRun(seed,definitions);
  return {
    seed,
    floors:generated.floors,
    floorIndex:0,
    currentNodeId:null,
    lastCompletedNodeId:null,
    visitedNodeIds:[],
    phase:"RUN_MAP",
    progression:createProgression(options.startingMaxHp??20),
    economy:createEconomy(options.startingCoins??0),
    inventory:createInventory(options.startingGear??{}),
    encounterHistory:[],
    eventHistory:[],
  };
}

export function currentFloor(state:RunState):FloorGraph {
  const floor=state.floors[state.floorIndex];
  if(!floor) throw new Error(`Run has no Floor at index ${state.floorIndex}`);
  return floor;
}

export function currentNode(state:RunState):FloorNode|null {
  if(state.currentNodeId===null) return null;
  return currentFloor(state).nodes.find((node)=>node.id===state.currentNodeId)??null;
}

export function availableRunNodes(state:RunState):readonly FloorNode[] {
  if(state.phase!=="RUN_MAP") return [];
  const floor=currentFloor(state);
  if(state.lastCompletedNodeId===null){
    const firstRow=Math.min(...floor.nodes.filter((node)=>node.type!=="BOSS").map((node)=>node.row));
    return floor.nodes.filter((node)=>node.row===firstRow);
  }
  const targets=new Set(floor.edges.filter((edge)=>edge.from===state.lastCompletedNodeId).map((edge)=>edge.to));
  return floor.nodes.filter((node)=>targets.has(node.id));
}

export function enterRunNode(state:RunState,nodeId:string):RunState {
  if(state.phase!=="RUN_MAP") throw new Error(`Cannot enter a node during ${state.phase}`);
  const available=availableRunNodes(state);
  const node=available.find((candidate)=>candidate.id===nodeId);
  if(!node) throw new Error(`Node ${nodeId} is not reachable from the current run position`);
  return {...state,currentNodeId:node.id,phase:roomPhase(node.type)};
}

export function completeRunNode(state:RunState):RunState {
  const node=currentNode(state);
  if(!node) throw new Error("No active room to complete");
  if(state.phase==="RUN_DEATH"||state.phase==="RUN_VICTORY"||state.phase==="RUN_MAP") throw new Error(`Cannot complete room during ${state.phase}`);
  const visited=[...state.visitedNodeIds,node.id];

  if(node.type==="BOSS"){
    const nextFloorIndex=state.floorIndex+1;
    if(nextFloorIndex>=state.floors.length){
      return {...state,currentNodeId:null,lastCompletedNodeId:node.id,visitedNodeIds:visited,phase:"RUN_VICTORY"};
    }
    return {...state,floorIndex:nextFloorIndex,currentNodeId:null,lastCompletedNodeId:null,visitedNodeIds:visited,phase:"RUN_MAP"};
  }

  return {...state,currentNodeId:null,lastCompletedNodeId:node.id,visitedNodeIds:visited,phase:"RUN_MAP"};
}

export function defeatRun(state:RunState):RunState {
  return {...state,currentNodeId:null,phase:"RUN_DEATH"};
}

export function withRunResources(
  state:RunState,
  patch:{readonly progression?:ProgressionState;readonly economy?:EconomyState;readonly inventory?:InventoryState},
):RunState {
  return {
    ...state,
    progression:patch.progression??state.progression,
    economy:patch.economy??state.economy,
    inventory:patch.inventory??state.inventory,
  };
}

export function withEncounterHistory(state:RunState,enemyId:string,instinct:string):RunState {
  return {...state,encounterHistory:[...state.encounterHistory,{enemyId,instinct}]};
}

export function withEventHistory(state:RunState,eventId:string):RunState {
  return {...state,eventHistory:[...state.eventHistory,eventId]};
}
