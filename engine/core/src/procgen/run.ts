import type { FloorDefinition, FloorGraph } from "../types.js";
import { RngService } from "../rng/rng.js";
import { generateFloor, validateFloor } from "./floor.js";

export interface GeneratedRun {
  readonly seed: string | number;
  readonly floors: readonly FloorGraph[];
}

/**
 * Generate any ordered sequence of Floor definitions using isolated named streams.
 * Floor count is content/configuration, never a hard-coded engine constant.
 */
export function generateRun(
  seed: string | number,
  floorDefinitions: readonly FloorDefinition[],
): GeneratedRun {
  if (floorDefinitions.length === 0) throw new Error("A run requires at least one Floor definition");
  const rng = new RngService(seed);
  const floors = floorDefinitions.map((definition, index) => {
    const graph = generateFloor(definition, rng.stream(`map:floor:${index}:${definition.id}`));
    const errors = validateFloor(graph, definition);
    if (errors.length) {
      throw new Error(`Generated invalid Floor ${definition.id}: ${errors.join(", ")}`);
    }
    return graph;
  });
  return { seed, floors };
}
