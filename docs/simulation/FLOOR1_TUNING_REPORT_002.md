# As Above, Roll Below — Floor I Tuning Gate 002

**Date:** 2026-09-16  
**Status:** PASS — promote targeted content changes; core curve unchanged.

## Purpose

Gate 001 fixed the structural reward problem by replacing Best Successful Spoils with Final-Blow Spoils and corrected two underpowered enemy dice engines.

Gate 002 asks a narrower question:

> Can weak/redundant Floor I item content be improved without distorting the validated combat/reward curve?

## Candidate changes

### Work Apron
Previous effect duplicated the starter Old Field Coat too closely.

**New candidate:**
> Whenever you lose a clash by 1 or 2, reduce that incoming damage by 1.

This gives Armor three distinct jobs:
- Old Field Coat: first incoming hit each encounter −1.
- Work Apron: repeatable protection from small losing margins.
- Proof Vest: first incoming hit each encounter −2.

### Redacted Slip
Clarify the tactical value instead of making a one-shot reroll feel like a pure gamble.

**New candidate:**
> REROLL one selected player die, then keep either its original or new value. Consume.

### Counterfeit Seal
`Set to 4` was too timid for a scarce two-slot single-use item.

**New candidate:**
> Set one selected player die to 5. Consume.

### Wire Cutter
`Lower enemy highest locked die by 1` competed poorly with persistent interference effects.

**New candidate:**
> Lower the enemy's highest locked die by 2, minimum 1. Consume.

### Temporary Injunction
Mechanical effect unchanged. Classified/tagged as tactical interference so automated valuation does not treat it as flavor-only content.

## Gate 002 regression

3,000 seeded Floor runs per policy; 9,000 total.

| Metric | Safe | Balanced | Greedy |
|---|---:|---:|---:|
| Floor clear | 98.23% | 90.37% | 58.43% |
| Mean final HP | 20.33 | 14.29 | 7.79 |
| Mean rounds | 16.49 | 28.31 | 35.92 |
| Mean HP loss | 5.28 | 11.63 | 16.50 |
| Mean Coins | 15.49 | 17.47 | 16.45 |
| Mean XP | 6.86 | 8.16 | 7.25 |

Compare Gate 001:

| Metric | Safe | Balanced | Greedy |
|---|---:|---:|---:|
| Floor clear | 98.38% | 89.96% | 59.14% |
| Mean HP loss | 5.36 | 11.62 | 16.51 |
| Mean rounds | 16.58 | 28.07 | 35.88 |

The differences are noise-level for system purposes. Gate 002 did **not** destabilize combat pacing or survivability.

## Reward distribution check

Raw Final-Blow Spoils bands remain healthy:

| Band | Safe | Balanced | Greedy |
|---|---:|---:|---:|
| I | 38.53% | 24.26% | 21.23% |
| II | 45.83% | 34.71% | 36.52% |
| III | 14.89% | 26.67% | 27.55% |
| IV | 0.76% | 14.36% | 14.69% |

Premium reward frequency therefore remains inside the intended mixed-play ceiling instead of returning to the Best-Successful flood.

## Item-telemetry interpretation

Automated item choice is heuristic, so this pass is primarily looking for catastrophic deadness / runaway value rather than pretending bots equal humans.

The targeted consumables now enter Safe/Balanced inventories materially more often. Greedy policy continues to prefer persistent Spoils engines, which is expected and desirable rather than proof that every consumable needs another buff.

Work Apron becomes a recognizable Safe-policy armor choice rather than a duplicate starter item. It remains unattractive to Greedy agents, which is acceptable: content does not need universal pick rate.

## Decision

Promote the following to Floor I v0.2 structured content:
- Work Apron small-margin mitigation.
- Redacted Slip keep-old-or-new reroll semantics.
- Counterfeit Seal sets to 5.
- Wire Cutter lowers enemy high die by 2.
- Temporary Injunction tactical-interference classification.

Do not modify:
- Final-Blow Spoils.
- level curve.
- inventory limits.
- loot bands.
- Elite uplift.
- First Door Gate 001 tuning.

## Remaining item questions

Do not chase automated pick-rate equality.

Human playtest should specifically inspect:
- whether Counterfeit Seal to 5 is intuitive and worth a slot;
- whether Wire Cutter −2 feels satisfying without trivializing Elite totals;
- whether Redacted Slip's keep-old/new choice creates too much certainty for Tier I;
- whether Work Apron creates interesting willingness to accept repeated margin-1/2 losses;
- whether Blank Face / Hidden Hand / Carbon Paper remain exciting rather than automatic.

## Next gate

1. synchronize canonical prose content with structured data;
2. add richer effect-trigger telemetry and fixed regression seeds;
3. run focused item counterfactual simulations rather than broad global nerfs;
4. freeze Floor I rules/content v1;
5. move into the proper vertical-slice implementation package.
