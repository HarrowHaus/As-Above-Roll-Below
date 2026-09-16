import type { FloorDefinition, FloorGraph, FloorNode, RoomType } from "../types.js";
import type { RngStream } from "../rng/rng.js";

function chooseRoomType(rng: RngStream, allowed: readonly RoomType[]): RoomType {
  return rng.pick(allowed);
}

function countTypes(nodes: readonly FloorNode[]): Map<RoomType, number> {
  const counts = new Map<RoomType, number>();
  for (const node of nodes) counts.set(node.type, (counts.get(node.type) ?? 0) + 1);
  return counts;
}

function patchGuarantees(definition: FloorDefinition, nodes: FloorNode[], rng: RngStream): void {
  const requiredMinimum = (type: RoomType): number => {
    if (type === "COMBAT") return definition.guarantees.minCombatOpportunities;
    if (type === "EVENT") return definition.guarantees.eventOpportunity ? 1 : 0;
    if (type === "SHOP") return definition.guarantees.shopOpportunity ? 1 : 0;
    if (type === "ELITE") return definition.guarantees.eliteOptional ? 1 : 0;
    return 0;
  };

  const requiredTypes: readonly RoomType[] = ["EVENT", "SHOP", "ELITE", "COMBAT"];

  for (let pass = 0; pass < 32; pass += 1) {
    const counts = countTypes(nodes);
    const missing = requiredTypes.find((type) => (counts.get(type) ?? 0) < requiredMinimum(type));
    if (!missing) return;

    const candidates = nodes.filter((node) => {
      if (node.type === "BOSS") return false;
      if (!definition.rows[node.row]!.allowedTypes.includes(missing)) return false;
      if (node.type === missing) return true;
      const currentMinimum = requiredMinimum(node.type);
      const currentCount = counts.get(node.type) ?? 0;
      return currentCount > currentMinimum;
    });

    if (candidates.length === 0) {
      throw new Error(`Floor ${definition.id} cannot satisfy ${missing} without breaking another guarantee`);
    }

    const chosen = rng.pick(candidates);
    const index = nodes.findIndex((node) => node.id === chosen.id);
    nodes[index] = { ...chosen, type: missing };
  }

  throw new Error(`Floor ${definition.id} guarantee solver exceeded repair limit`);
}

function connectRows(rows: readonly FloorNode[][], boss: FloorNode): { from: string; to: string }[] {
  const edges: { from: string; to: string }[] = [];
  for (let row = 0; row < rows.length - 1; row += 1) {
    const from = rows[row]!;
    const to = rows[row + 1]!;
    for (let i = 0; i < from.length; i += 1) {
      const primary = to[Math.min(i, to.length - 1)]!;
      edges.push({ from: from[i]!.id, to: primary.id });
      if (to.length > 1) {
        const alternate = to[(i + 1) % to.length]!;
        if (alternate.id !== primary.id) edges.push({ from: from[i]!.id, to: alternate.id });
      }
    }
  }
  for (const node of rows.at(-1) ?? []) edges.push({ from: node.id, to: boss.id });
  return edges;
}

export function generateFloor(definition: FloorDefinition, rng: RngStream): FloorGraph {
  if (definition.rows.length === 0) throw new Error("Floor requires at least one pre-boss row");
  const rows: FloorNode[][] = definition.rows.map((rule, row) => {
    if (rule.allowedTypes.length === 0) throw new Error(`Row ${row} has no allowed room types`);
    const count = rng.int(rule.minNodes, rule.maxNodes);
    return Array.from({ length: count }, (_, index) => ({
      id: `${definition.id}:r${row}:n${index}`,
      row,
      type: chooseRoomType(rng, rule.allowedTypes),
    }));
  });

  const flat = rows.flat();
  patchGuarantees(definition, flat, rng);

  const patchedRows = definition.rows.map((_, row) => flat.filter((node) => node.row === row));
  const boss: FloorNode = {
    id: `${definition.id}:boss`,
    row: definition.rows.length,
    type: "BOSS",
  };
  const edges = connectRows(patchedRows, boss);
  return {
    definitionId: definition.id,
    nodes: [...flat, boss],
    edges,
    bossNodeId: boss.id,
  };
}

export function validateFloor(graph: FloorGraph, definition: FloorDefinition): string[] {
  const errors: string[] = [];
  const ids = new Set(graph.nodes.map((node) => node.id));
  if (ids.size !== graph.nodes.length) errors.push("duplicate node id");
  const boss = graph.nodes.find((node) => node.id === graph.bossNodeId);
  if (!boss || boss.type !== "BOSS") errors.push("missing boss node");

  for (const edge of graph.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) errors.push(`invalid edge ${edge.from} -> ${edge.to}`);
  }

  const counts = countTypes(graph.nodes);
  if ((counts.get("COMBAT") ?? 0) < definition.guarantees.minCombatOpportunities) errors.push("missing combat guarantee");
  if (definition.guarantees.eventOpportunity && (counts.get("EVENT") ?? 0) === 0) errors.push("missing event opportunity");
  if (definition.guarantees.shopOpportunity && (counts.get("SHOP") ?? 0) === 0) errors.push("missing shop opportunity");
  if (definition.guarantees.eliteOptional && (counts.get("ELITE") ?? 0) === 0) errors.push("missing elite opportunity");

  const outgoing = new Map<string, number>();
  const incoming = new Map<string, number>();
  for (const edge of graph.edges) {
    outgoing.set(edge.from, (outgoing.get(edge.from) ?? 0) + 1);
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  }
  for (const node of graph.nodes) {
    if (node.type !== "BOSS" && (outgoing.get(node.id) ?? 0) === 0) errors.push(`dead end ${node.id}`);
    if (node.row > 0 && (incoming.get(node.id) ?? 0) === 0) errors.push(`unreachable ${node.id}`);
  }
  return errors;
}
