export interface ProgressionState {
  readonly level: number;
  readonly xp: number;
  readonly hp: number;
  readonly maxHp: number;
  readonly pendingTechniqueLevels: readonly number[];
}

export interface XpGrantResult {
  readonly state: ProgressionState;
  readonly levelsGained: readonly number[];
}

export const DEFAULT_XP_THRESHOLDS = [0,3,7,12,18,25] as const;

export function createProgression(maxHp = 20): ProgressionState {
  if (maxHp <= 0) throw new Error("maxHp must be positive");
  return { level:1, xp:0, hp:maxHp, maxHp, pendingTechniqueLevels:[] };
}

export function grantXp(
  state: ProgressionState,
  amount: number,
  thresholds: readonly number[] = DEFAULT_XP_THRESHOLDS,
): XpGrantResult {
  if (!Number.isInteger(amount) || amount < 0) throw new Error("XP grant must be a non-negative integer");
  const xp=state.xp+amount;
  let level=state.level;
  let hp=state.hp;
  let maxHp=state.maxHp;
  const gained:number[]=[];
  const pending=[...state.pendingTechniqueLevels];
  while (level < thresholds.length && xp >= thresholds[level]!) {
    level+=1; gained.push(level); maxHp+=2; hp=Math.min(maxHp,hp+2);
    if (level===3 || level===5) pending.push(level);
  }
  return { state:{level,xp,hp,maxHp,pendingTechniqueLevels:pending}, levelsGained:gained };
}

export function applyDamage(state: ProgressionState, amount: number): ProgressionState {
  if (amount<0) throw new Error("damage cannot be negative");
  return {...state,hp:Math.max(0,state.hp-amount)};
}

export function heal(state: ProgressionState, amount: number): ProgressionState {
  if (amount<0) throw new Error("healing cannot be negative");
  return {...state,hp:Math.min(state.maxHp,state.hp+amount)};
}

export function resolveTechniqueChoice(state: ProgressionState, level: number): ProgressionState {
  if (!state.pendingTechniqueLevels.includes(level)) throw new Error(`No pending Technique choice for Level ${level}`);
  return {...state,pendingTechniqueLevels:state.pendingTechniqueLevels.filter((value)=>value!==level)};
}
