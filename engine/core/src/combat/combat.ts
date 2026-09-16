import type {
  CombatEvent,
  CombatPreview,
  CombatState,
  DieId,
  DieState,
  EnemyDefinition,
} from "../types.js";
import { createPlayerDice, findDie, rollDice } from "../dice/dice.js";
import type { RngStream } from "../rng/rng.js";
import { lockByInstinct } from "./instincts.js";
import { createEffectState, resolveCombatEffects, type EffectDefinition, type EffectLogEntry, type EffectState } from "../effects/effects.js";

export interface RoundStartResult {
  readonly state: CombatState;
  readonly events: readonly CombatEvent[];
}

export interface CommitResult {
  readonly state: CombatState;
  readonly events: readonly CombatEvent[];
  readonly preview: CombatPreview;
}

export interface EffectfulCombatPreview {
  readonly base: CombatPreview;
  readonly finalFight: number;
  readonly enemyFight: number;
  readonly margin: number;
  readonly damageToEnemy: number;
  readonly damageToPlayer: number;
  readonly finalSpoilsScore: number;
  readonly effectLog: readonly EffectLogEntry[];
}

export interface EffectCommitResult {
  readonly state: CombatState;
  readonly events: readonly CombatEvent[];
  readonly preview: EffectfulCombatPreview;
  readonly effectState: EffectState;
}

function replacePlayerDice(state: CombatState, dice: readonly DieState[]): CombatState {
  return { ...state, playerRoll: dice };
}

export function createCombat(playerMaxHp: number, enemy: EnemyDefinition): CombatState {
  if (playerMaxHp <= 0 || enemy.maxHp <= 0) throw new Error("Combatants require positive Max HP");
  return {
    round: 0,
    player: { hp: playerMaxHp, maxHp: playerMaxHp },
    enemy: { hp: enemy.maxHp, maxHp: enemy.maxHp },
    enemyDefinitionId: enemy.id,
    enemyRoll: [],
    enemyLocked: [],
    playerRoll: [],
    committedDieIds: [],
    phase: "ENCOUNTER_START",
  };
}

export function startRound(
  state: CombatState,
  enemy: EnemyDefinition,
  enemyRng: RngStream,
  playerRng: RngStream,
): RoundStartResult {
  if (state.player.hp <= 0 || state.enemy.hp <= 0) throw new Error("Cannot start a round after combat has ended");
  const round = state.round + 1;
  const enemyRoll = rollDice(enemyRng, enemy.dicePool);
  const enemyLocked = lockByInstinct(enemyRoll, enemy.instinct);
  const playerRoll = createPlayerDice(playerRng, round, 4);
  const next: CombatState = {
    ...state,
    round,
    enemyRoll,
    enemyLocked,
    playerRoll,
    committedDieIds: [],
    phase: "PLAYER_MANIPULATE",
  };
  return {
    state: next,
    events: [
      { type: "enemy_cast", values: enemyRoll },
      { type: "enemy_lock", values: enemyLocked, instinct: enemy.instinct },
      { type: "player_cast", dice: playerRoll },
    ],
  };
}

export function updatePlayerDie(state: CombatState, die: DieState): CombatState {
  if (state.phase !== "PLAYER_MANIPULATE" && state.phase !== "PLAYER_COMMIT_PREVIEW") {
    throw new Error(`Cannot manipulate dice during ${state.phase}`);
  }
  const exists = state.playerRoll.some((candidate) => candidate.id === die.id);
  if (!exists) throw new Error(`Cannot update unknown die ${die.id}`);
  return replacePlayerDice(state, state.playerRoll.map((candidate) => (candidate.id === die.id ? die : candidate)));
}

export function previewCommit(state: CombatState, fightDieIds: readonly [DieId, DieId]): CombatPreview {
  if (fightDieIds[0] === fightDieIds[1]) throw new Error("Fight Dice must be distinct");
  if (state.playerRoll.length !== 4 || state.enemyLocked.length !== 2) throw new Error("Round is not ready for commit preview");
  const first = findDie(state.playerRoll, fightDieIds[0]);
  const second = findDie(state.playerRoll, fightDieIds[1]);
  const fightIdSet = new Set(fightDieIds);
  const spoils = state.playerRoll.filter((die) => !fightIdSet.has(die.id));
  if (spoils.length !== 2) throw new Error("Exactly two Spoils dice must remain");

  const rawFight = first.value + second.value;
  const enemyFight = state.enemyLocked[0]! + state.enemyLocked[1]!;
  const predictedMargin = rawFight - enemyFight;
  const predictedPlayerDamage = Math.max(0, -predictedMargin);
  const predictedEnemyDamage = Math.max(0, predictedMargin);
  const baseSpoilsScore = spoils[0]!.value + spoils[1]!.value;

  return {
    fightDieIds,
    fightValues: [first.value, second.value],
    spoilsValues: [spoils[0]!.value, spoils[1]!.value],
    rawFight,
    finalFight: rawFight,
    enemyFight,
    predictedMargin,
    predictedPlayerDamage,
    predictedEnemyDamage,
    baseSpoilsScore,
    spoilsQualifies: predictedMargin > 0,
  };
}

export function commit(state: CombatState, fightDieIds: readonly [DieId, DieId]): CommitResult {
  const preview = previewCommit(state, fightDieIds);
  const events: CombatEvent[] = [{ type: "player_commit", preview }];
  let playerHp = state.player.hp;
  let enemyHp = state.enemy.hp;

  if (preview.predictedMargin > 0) {
    const damage = preview.predictedEnemyDamage;
    enemyHp = Math.max(0, enemyHp - damage);
    events.push({ type: "damage", target: "enemy", amount: damage });
    events.push({ type: "spoils_qualified", values: preview.spoilsValues, score: preview.baseSpoilsScore });
  } else if (preview.predictedMargin < 0) {
    const damage = preview.predictedPlayerDamage;
    playerHp = Math.max(0, playerHp - damage);
    events.push({ type: "damage", target: "player", amount: damage });
  } else {
    events.push({ type: "tie" });
  }

  let phase: CombatState["phase"] = "ROUND_END";
  if (enemyHp === 0) {
    phase = "ENCOUNTER_VICTORY";
    events.push({ type: "victory" });
  } else if (playerHp === 0) {
    phase = "ENCOUNTER_DEFEAT";
    events.push({ type: "defeat" });
  } else {
    events.push({ type: "round_end", round: state.round });
  }

  return {
    preview,
    events,
    state: {
      ...state,
      player: { ...state.player, hp: playerHp },
      enemy: { ...state.enemy, hp: enemyHp },
      committedDieIds: fightDieIds,
      phase,
    },
  };
}

function effectContextFromPreview(preview: CombatPreview) {
  const margin = preview.finalFight - preview.enemyFight;
  return {
    fightValues: preview.fightValues,
    spoilsValues: preview.spoilsValues,
    rawFight: preview.rawFight,
    finalFight: preview.finalFight,
    enemyFight: preview.enemyFight,
    margin,
    outcome: margin > 0 ? "win" as const : margin < 0 ? "loss" as const : "tie" as const,
    damageToEnemy: Math.max(0, margin),
    damageToPlayer: Math.max(0, -margin),
    baseSpoilsScore: preview.baseSpoilsScore,
    finalSpoilsScore: preview.baseSpoilsScore,
  };
}

export function previewCommitWithEffects(
  state: CombatState,
  fightDieIds: readonly [DieId, DieId],
  effects: readonly EffectDefinition[],
  effectState: EffectState = createEffectState(),
): EffectfulCombatPreview {
  const base = previewCommit(state, fightDieIds);
  const resolved = resolveCombatEffects(effectContextFromPreview(base), effects, effectState, false);
  return {
    base,
    finalFight: resolved.context.finalFight,
    enemyFight: resolved.context.enemyFight,
    margin: resolved.context.margin,
    damageToEnemy: resolved.context.damageToEnemy,
    damageToPlayer: resolved.context.damageToPlayer,
    finalSpoilsScore: resolved.context.finalSpoilsScore,
    effectLog: resolved.log,
  };
}

export function commitWithEffects(
  state: CombatState,
  fightDieIds: readonly [DieId, DieId],
  effects: readonly EffectDefinition[],
  effectState: EffectState = createEffectState(),
): EffectCommitResult {
  const base = previewCommit(state, fightDieIds);
  const resolved = resolveCombatEffects(effectContextFromPreview(base), effects, effectState, true);
  const preview: EffectfulCombatPreview = {
    base,
    finalFight: resolved.context.finalFight,
    enemyFight: resolved.context.enemyFight,
    margin: resolved.context.margin,
    damageToEnemy: resolved.context.damageToEnemy,
    damageToPlayer: resolved.context.damageToPlayer,
    finalSpoilsScore: resolved.context.finalSpoilsScore,
    effectLog: resolved.log,
  };
  const events: CombatEvent[] = [{ type: "player_commit", preview: { ...base, finalFight: preview.finalFight, enemyFight: preview.enemyFight, predictedMargin: preview.margin, predictedEnemyDamage: preview.damageToEnemy, predictedPlayerDamage: preview.damageToPlayer, spoilsQualifies: preview.margin > 0 } }];
  let playerHp = state.player.hp;
  let enemyHp = state.enemy.hp;

  if (preview.margin > 0) {
    enemyHp = Math.max(0, enemyHp - preview.damageToEnemy);
    events.push({ type: "damage", target: "enemy", amount: preview.damageToEnemy });
    events.push({ type: "spoils_qualified", values: base.spoilsValues, score: preview.finalSpoilsScore });
  } else if (preview.margin < 0) {
    playerHp = Math.max(0, playerHp - preview.damageToPlayer);
    events.push({ type: "damage", target: "player", amount: preview.damageToPlayer });
  } else {
    events.push({ type: "tie" });
  }

  let phase: CombatState["phase"] = "ROUND_END";
  if (enemyHp === 0) { phase = "ENCOUNTER_VICTORY"; events.push({ type: "victory" }); }
  else if (playerHp === 0) { phase = "ENCOUNTER_DEFEAT"; events.push({ type: "defeat" }); }
  else events.push({ type: "round_end", round: state.round });

  return {
    preview,
    effectState: resolved.effectState,
    events,
    state: {
      ...state,
      player: { ...state.player, hp: playerHp },
      enemy: { ...state.enemy, hp: enemyHp },
      committedDieIds: fightDieIds,
      phase,
    },
  };
}
