export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type DieId = string;

export interface DieState {
  readonly id: DieId;
  readonly value: DieValue;
  readonly fixed: boolean;
  readonly locked: boolean;
  readonly tags: readonly string[];
}

export type EnemyInstinct =
  | "BOTH"
  | "STRONGEST"
  | "LOWEST"
  | "WIDE"
  | "TIGHT"
  | "ODD"
  | "EVEN"
  | "DOUBLES";

export interface EnemyDefinition {
  readonly id: string;
  readonly maxHp: number;
  readonly dicePool: number;
  readonly instinct: EnemyInstinct;
  readonly xp: number;
  readonly coins: number;
  readonly tags?: readonly string[];
  readonly ruleIds?: readonly string[];
  readonly elite?: boolean;
  readonly rewardBandUplift?: number;
}

export interface BossPhaseDefinition {
  readonly id: string;
  readonly minHp: number;
  readonly maxHp: number;
  readonly dicePool: number;
  readonly instinct: EnemyInstinct;
  readonly ruleIds?: readonly string[];
}

export interface BossDefinition {
  readonly id: string;
  readonly maxHp: number;
  readonly xp: number;
  readonly coins: number;
  readonly clearHeal: number;
  readonly phases: readonly BossPhaseDefinition[];
  readonly tags?: readonly string[];
}

export interface CombatantState {
  readonly hp: number;
  readonly maxHp: number;
}

export interface CombatState {
  readonly round: number;
  readonly player: CombatantState;
  readonly enemy: CombatantState;
  readonly enemyDefinitionId: string;
  readonly enemyRoll: readonly DieValue[];
  readonly enemyLocked: readonly DieValue[];
  readonly playerRoll: readonly DieState[];
  readonly committedDieIds: readonly DieId[];
  readonly phase: CombatPhase;
}

export type CombatPhase =
  | "ENCOUNTER_START"
  | "ENEMY_CAST"
  | "ENEMY_LOCK"
  | "PLAYER_CAST"
  | "PLAYER_MANIPULATE"
  | "PLAYER_COMMIT_PREVIEW"
  | "DAMAGE_RESOLUTION"
  | "SPOILS_RESOLUTION"
  | "ROUND_END"
  | "ENCOUNTER_VICTORY"
  | "ENCOUNTER_DEFEAT";

export interface CombatPreview {
  readonly fightDieIds: readonly [DieId, DieId];
  readonly fightValues: readonly [DieValue, DieValue];
  readonly spoilsValues: readonly [DieValue, DieValue];
  readonly rawFight: number;
  readonly finalFight: number;
  readonly enemyFight: number;
  readonly predictedMargin: number;
  readonly predictedPlayerDamage: number;
  readonly predictedEnemyDamage: number;
  readonly baseSpoilsScore: number;
  readonly spoilsQualifies: boolean;
}

export type CombatEvent =
  | { readonly type: "enemy_cast"; readonly values: readonly DieValue[] }
  | { readonly type: "enemy_lock"; readonly values: readonly DieValue[]; readonly instinct: EnemyInstinct }
  | { readonly type: "player_cast"; readonly dice: readonly DieState[] }
  | { readonly type: "player_commit"; readonly preview: CombatPreview }
  | { readonly type: "damage"; readonly target: "player" | "enemy"; readonly amount: number }
  | { readonly type: "tie" }
  | { readonly type: "spoils_qualified"; readonly values: readonly [DieValue, DieValue]; readonly score: number }
  | { readonly type: "round_end"; readonly round: number }
  | { readonly type: "victory" }
  | { readonly type: "defeat" };

export type RoomType = "COMBAT" | "ELITE" | "EVENT" | "SHOP" | "BOSS";

export interface FloorRowRule {
  readonly allowedTypes: readonly RoomType[];
  readonly minNodes: number;
  readonly maxNodes: number;
}

export interface FloorDefinition {
  readonly id: string;
  readonly rows: readonly FloorRowRule[];
  readonly guarantees: {
    readonly minCombatOpportunities: number;
    readonly eventOpportunity: boolean;
    readonly shopOpportunity: boolean;
    readonly eliteOptional: boolean;
  };
  readonly bossId: string;
}

export interface FloorNode {
  readonly id: string;
  readonly row: number;
  readonly type: RoomType;
}

export interface FloorGraph {
  readonly definitionId: string;
  readonly nodes: readonly FloorNode[];
  readonly edges: readonly { readonly from: string; readonly to: string }[];
  readonly bossNodeId: string;
}
