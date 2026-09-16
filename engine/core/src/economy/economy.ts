import type { ProgressionState } from "../progression/progression.js";
import { heal } from "../progression/progression.js";

export interface EconomyState { readonly coins: number; }

export function createEconomy(coins=0): EconomyState {
  if (!Number.isInteger(coins) || coins<0) throw new Error("coins must be a non-negative integer");
  return {coins};
}

export function addCoins(state: EconomyState, amount: number): EconomyState {
  if (!Number.isInteger(amount) || amount<0) throw new Error("coin grant must be non-negative integer");
  return {coins:state.coins+amount};
}

export function spendCoins(state: EconomyState, amount: number): EconomyState {
  if (!Number.isInteger(amount) || amount<0) throw new Error("coin spend must be non-negative integer");
  if (amount>state.coins) throw new Error("insufficient coins");
  return {coins:state.coins-amount};
}

export function encounterCoinAward(kind:"NORMAL"|"ELITE"|"BOSS"):number {
  return kind==="NORMAL"?2:kind==="ELITE"?4:6;
}

export function buyHealing(
  economy: EconomyState,
  progression: ProgressionState,
  healAmount=4,
  price=4,
): { economy: EconomyState; progression: ProgressionState } {
  if (progression.hp>=progression.maxHp) throw new Error("cannot buy healing at full HP");
  return { economy:spendCoins(economy,price), progression:heal(progression,healAmount) };
}
