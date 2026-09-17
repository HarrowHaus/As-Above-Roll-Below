# AARB — Procedural Grammar V0 Audit

## Purpose
THRESHOLDS is the engine laboratory. This document audits the first implemented grammar primitives before we expand content quantity.

## What exists in production core
### Enemy Affix v0
`applyEnemyAffixes()` composes authored enemy definitions with budgeted transformations. V0 includes STUBBORN (+2 HP) and LOADED (+1 pre-lock enemy die). The system already validates pressure budget, tag compatibility, rule conflicts, HP bounds, and dice-pool bounds.

### Generated Gear v0
`generateGearRecipe()` combines an authored trigger vocabulary with an authored action vocabulary, rejects illegal pairs, assigns cadence, and always emits exact player-facing rules text. A 10,000-seed regression proves deterministic generation and validates every generated recipe.

### Status Engine v0
Status definitions have owner, stack cap, expiry, player-facing rules text, and optional round duration. State application/ticking is generic. Current MARKED/FRAYED definitions are intentionally test statuses, not shipping content.

## Audit result
The architecture is correct but deliberately too small to judge variety. We should NOT solve that by adding dozens of random triggers/actions immediately.

The next gate is to prove that generated content can participate in the same authoritative effect pipeline as authored content. A generated Gear recipe that can describe itself but cannot compile to an `EffectDefinition` is not yet real Gear.

## P0 — compile grammar into gameplay
1. Add `compileGeneratedGearEffect(recipe)`.
2. Map every legal trigger to existing generic Effect conditions.
3. Map every legal action to generic Effect actions.
4. Reject any recipe that cannot be represented without a special-case branch.
5. Add parity tests: generated rules text, compiled timing/condition/action, and simulation behavior must agree.

## P1 — improve affix grammar
Affixes should change tactical questions, not merely HP/dice volume. Add only representative affixes first:
- one manipulation-reactive affix;
- one tie-reactive affix;
- one Spoils-pressure affix;
- one cast-constraint affix.

Each needs compatibility tags and a pressure cost. Avoid stacking multiple affixes until single-affix telemetry is clean.

## P2 — make statuses meaningful
Implement exactly two shipping-quality test statuses:
- one player status that changes a decision for 1–2 rounds;
- one enemy status that creates an opportunity for 1–2 rounds.

Statuses must hook into the effect/timing engine, display their remaining duration, and be serializable in combat state. Do not build a parallel status-resolution engine.

## P3 — grammar QA harness
Add a headless grammar audit capable of at least 100,000 generated samples. Report:
- unique recipe count;
- trigger/action/cadence distribution;
- rejection rate;
- duplicate frequency;
- rules-text collisions;
- pressure distribution;
- impossible or dominated recipes;
- item/enemy combinations that throw during simulated resolution.

A huge theoretical combination count is not a success metric. Decision-space diversity is.

## P4 — novelty memory
Before endless mode, the Director needs run-local memory for recently seen enemy families, affixes, generated Gear recipes, Events, and Regions. Repetition suppression is a weighting input, not a hard ban.

## Explicit non-goals for V0
- procedural Boss generation;
- arbitrary AI-written mechanics;
- multiple affixes per normal enemy;
- percentage-stat affix soup;
- generated Artifact identities;
- generated flavor text without a controlled grammar;
- multi-enemy combat before statuses/affixes survive simulation.

## Acceptance gate
Procedural Grammar V0 graduates when:
- every generated object is deterministic;
- every generated mechanical sentence is exact;
- every generated mechanic compiles into existing generic core primitives;
- 100k-sample validation produces zero illegal objects;
- generated content survives headless combat/reward simulation;
- representative samples create recognizably different decisions in human playtests.
