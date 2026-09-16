import { RngService } from "../rng/rng.js";
import { generateDescent, type DescentDefinition, type DescentSequence } from "../procgen/descent.js";
import type { FloorGraph } from "../types.js";
import { createProgression } from "../progression/progression.js";
import { createEconomy } from "../economy/economy.js";
import { createInventory } from "../items/items.js";
import type { CreateRunOptions, RunState } from "./run-state.js";

export function descentSequenceToFloorGraph(sequence:DescentSequence):FloorGraph {
  const nodes=sequence.steps.map((step)=>({id:step.id,row:step.depth-1,type:step.type}));
  const edges=nodes.slice(0,-1).map((node,index)=>({from:node.id,to:nodes[index+1]!.id}));
  return {
    definitionId:sequence.definitionId,
    nodes,
    edges,
    bossNodeId:sequence.bossStepId,
  };
}

export function createDescentRunState(
  seed:number,
  definitions:readonly DescentDefinition[],
  options:CreateRunOptions={},
):RunState {
  if(definitions.length===0)throw new Error("Run requires at least one Descent definition");
  const rng=new RngService(seed);
  const floors=definitions.map((definition,index)=>
    descentSequenceToFloorGraph(generateDescent(definition,rng.stream(`descent:${index}:${definition.id}`))),
  );
  return {
    seed,
    floors,
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
