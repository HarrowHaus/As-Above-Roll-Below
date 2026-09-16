import type { DieValue } from "../types.js";

export type EffectTiming = "FIGHT_MODIFICATION" | "DAMAGE_MODIFICATION" | "SPOILS_MODIFICATION";
export type CombatOutcome = "win" | "loss" | "tie";

export type EffectCondition =
  | { readonly type: "always" }
  | { readonly type: "fight_dice_different" }
  | { readonly type: "fight_dice_doubles" }
  | { readonly type: "raw_fight_at_least"; readonly value: number }
  | { readonly type: "spoils_doubles" }
  | { readonly type: "spoils_score_at_most"; readonly value: number }
  | { readonly type: "spoils_score_at_least"; readonly value: number }
  | { readonly type: "spoils_opposites" }
  | { readonly type: "margin_exact"; readonly value: number }
  | { readonly type: "outcome"; readonly value: CombatOutcome };

export type EffectAction =
  | { readonly type: "add_fight"; readonly value: number }
  | { readonly type: "add_enemy_fight"; readonly value: number }
  | { readonly type: "add_damage_to_enemy"; readonly value: number }
  | { readonly type: "reduce_player_damage"; readonly value: number }
  | { readonly type: "add_spoils_score"; readonly value: number; readonly cap?: number };

export interface EffectDefinition {
  readonly id: string;
  readonly sourceId: string;
  readonly timing: EffectTiming;
  readonly priority: number;
  readonly condition: EffectCondition;
  readonly actions: readonly EffectAction[];
  readonly maxUsesPerEncounter?: number;
}

export interface EffectState {
  readonly uses: Readonly<Record<string, number>>;
}

export interface CombatEffectContext {
  readonly fightValues: readonly [DieValue, DieValue];
  readonly spoilsValues: readonly [DieValue, DieValue];
  readonly rawFight: number;
  readonly finalFight: number;
  readonly enemyFight: number;
  readonly margin: number;
  readonly outcome: CombatOutcome;
  readonly damageToEnemy: number;
  readonly damageToPlayer: number;
  readonly baseSpoilsScore: number;
  readonly finalSpoilsScore: number;
}

export interface EffectLogEntry {
  readonly effectId: string;
  readonly sourceId: string;
  readonly timing: EffectTiming;
  readonly actions: readonly EffectAction[];
}

export interface EffectResolution {
  readonly context: CombatEffectContext;
  readonly effectState: EffectState;
  readonly log: readonly EffectLogEntry[];
}

const opposite: Record<DieValue, DieValue> = {1:6,2:5,3:4,4:3,5:2,6:1};

export function createEffectState(): EffectState {
  return { uses: {} };
}

function conditionMatches(condition: EffectCondition, context: CombatEffectContext): boolean {
  switch (condition.type) {
    case "always": return true;
    case "fight_dice_different": return context.fightValues[0] !== context.fightValues[1];
    case "fight_dice_doubles": return context.fightValues[0] === context.fightValues[1];
    case "raw_fight_at_least": return context.rawFight >= condition.value;
    case "spoils_doubles": return context.spoilsValues[0] === context.spoilsValues[1];
    case "spoils_score_at_most": return context.finalSpoilsScore <= condition.value;
    case "spoils_score_at_least": return context.finalSpoilsScore >= condition.value;
    case "spoils_opposites": return opposite[context.spoilsValues[0]] === context.spoilsValues[1];
    case "margin_exact": return context.margin === condition.value;
    case "outcome": return context.outcome === condition.value;
    default: {
      const exhaustive: never = condition;
      throw new Error(`Unhandled effect condition ${String(exhaustive)}`);
    }
  }
}

function applyAction(context: CombatEffectContext, action: EffectAction): CombatEffectContext {
  switch (action.type) {
    case "add_fight": return { ...context, finalFight: context.finalFight + action.value };
    case "add_enemy_fight": return { ...context, enemyFight: context.enemyFight + action.value };
    case "add_damage_to_enemy": return { ...context, damageToEnemy: context.damageToEnemy + action.value };
    case "reduce_player_damage": return { ...context, damageToPlayer: Math.max(0, context.damageToPlayer - action.value) };
    case "add_spoils_score": {
      const value = context.finalSpoilsScore + action.value;
      return { ...context, finalSpoilsScore: action.cap === undefined ? value : Math.min(action.cap, value) };
    }
    default: {
      const exhaustive: never = action;
      throw new Error(`Unhandled effect action ${String(exhaustive)}`);
    }
  }
}

function withDerivedCombat(context: CombatEffectContext): CombatEffectContext {
  const margin = context.finalFight - context.enemyFight;
  const outcome: CombatOutcome = margin > 0 ? "win" : margin < 0 ? "loss" : "tie";
  return {
    ...context,
    margin,
    outcome,
    damageToEnemy: Math.max(0, margin),
    damageToPlayer: Math.max(0, -margin),
  };
}

function resolveTiming(
  input: CombatEffectContext,
  effects: readonly EffectDefinition[],
  timing: EffectTiming,
  state: EffectState,
  consumeUses: boolean,
): EffectResolution {
  let context = input;
  let uses: Record<string, number> = { ...state.uses };
  const log: EffectLogEntry[] = [];
  const ordered = effects
    .filter((effect) => effect.timing === timing)
    .sort((a,b) => a.priority - b.priority || a.id.localeCompare(b.id));

  for (const effect of ordered) {
    const used = uses[effect.id] ?? 0;
    if (effect.maxUsesPerEncounter !== undefined && used >= effect.maxUsesPerEncounter) continue;
    if (!conditionMatches(effect.condition, context)) continue;
    for (const action of effect.actions) context = applyAction(context, action);
    if (consumeUses && effect.maxUsesPerEncounter !== undefined) uses[effect.id] = used + 1;
    log.push({ effectId: effect.id, sourceId: effect.sourceId, timing, actions: effect.actions });
  }

  return { context, effectState: { uses }, log };
}

export function resolveCombatEffects(
  base: CombatEffectContext,
  effects: readonly EffectDefinition[],
  state: EffectState = createEffectState(),
  consumeUses = false,
): EffectResolution {
  let context = base;
  let effectState = state;
  const log: EffectLogEntry[] = [];

  let step = resolveTiming(context,effects,"FIGHT_MODIFICATION",effectState,consumeUses);
  context = withDerivedCombat(step.context); effectState = step.effectState; log.push(...step.log);

  step = resolveTiming(context,effects,"DAMAGE_MODIFICATION",effectState,consumeUses);
  context = step.context; effectState = step.effectState; log.push(...step.log);

  if (context.outcome === "win") {
    step = resolveTiming(context,effects,"SPOILS_MODIFICATION",effectState,consumeUses);
    context = step.context; effectState = step.effectState; log.push(...step.log);
  }

  return { context, effectState, log };
}
