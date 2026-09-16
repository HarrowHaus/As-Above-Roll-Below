import type { EventDefinition } from "../events/events.js";
import type { RngStream } from "../rng/rng.js";

export function selectEvent(
  pool:readonly EventDefinition[],
  history:readonly string[],
  rng:RngStream,
):EventDefinition {
  if(!pool.length) throw new Error("Event pool is empty");
  const unseen=pool.filter((event)=>!history.includes(event.id));
  return rng.pick(unseen.length?unseen:pool);
}
