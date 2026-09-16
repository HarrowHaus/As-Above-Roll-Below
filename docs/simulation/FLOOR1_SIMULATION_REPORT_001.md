# As Above, Roll Below — Floor I Simulation Report 001

**Date:** 2026-09-16  
**Simulation:** 5,000 seeded Floors per policy (15,000 total) plus Spoils-mode and boss probes.  
**Candidate content:** Floor I — THRESHOLDS v0.1 with simulation-driven revisions described below.

## Purpose

Validate the authored systems package before producing the full runtime asset set or proper vertical slice.

This pass tests relative behavior, not final human difficulty. Automated policies have perfect arithmetic, deterministic rule knowledge, and simplified item/route heuristics.

## Policies

- **SAFE:** prioritizes winning margin, fast kills, HP preservation, and certainty.
- **BALANCED:** trades HP for reward-band improvement while respecting current health.
- **GREEDY:** prioritizes the strongest Spoils result among winning commitments and accepts longer fights.

## Major finding 1 — Best Successful Spoils fails the reward-frequency target

With `BEST SUCCESSFUL`, Balanced and Greedy policies accumulated too many chances to improve reward quality during multi-round fights.

Band IV frequency in the 1,000-run-per-policy comparison:

| Capture rule | Safe | Balanced | Greedy |
|---|---:|---:|---:|
| Best Successful | 1.1% | 44.2% | 56.7% |
| Best of first two successes | 1.1% | 32.9% | 36.2% |
| First successful | 0.7% | 23.2% | 23.6% |
| **Final Blow** | **0.8%** | **14.0%** | **14.3%** |

Target mixed-play Band IV frequency from `BALANCE_AND_TELEMETRY_SPEC.md`: roughly 5–15%.

**Decision:** replace Best Successful Spoils with **Final-Blow Spoils** for the next production gate.

The final damaging player win determines the encounter's Spoils Pair and reward quality.

This preserves the core tradeoff at the most important moment: killing safely with the best dice versus engineering a greedy kill that leaves premium Spoils.

## Major finding 2 — Seal-Bearer was not Elite pressure

Original:
- 9 HP
- 3d6
- WIDE
- COUNTERSEAL

WIDE (highest + lowest) dramatically reduced its expected locked total. The result was less pressure than several normal enemies.

**Revision candidate:**
- 8 HP
- 3d6
- **STRONGEST**
- COUNTERSEAL unchanged

This preserves its identity as the Elite that punishes manipulation while making the underlying dice engine worthy of an Elite reward.

## Major finding 3 — The First Door OPEN state was too soft

Original OPEN:
- HP 1–6
- 4d6 WIDE
- BOTH WAYS

WIDE again reduced pressure at the exact moment the boss should peak.

**Revision candidate:**
- CLOSED: HP 13–18, 3d6 TIGHT, SEALED
- AJAR: HP 4–12, 3d6 STRONGEST, DRAFT
- OPEN: HP 1–3, **4d6 STRONGEST**, BOTH WAYS

The dangerous 4d6 state is now short and legible rather than a long HP sponge.

Boss-only 4,000-run probes from full starting HP:

| Policy | Clear | Mean rounds | Mean HP loss |
|---|---:|---:|---:|
| Safe | 95.0% | 9.43 | 6.59 |
| Balanced | 90.3% | 13.84 | 9.63 |
| Greedy | 80.5% | 16.30 | 11.46 |

This is much closer to the intended authored-boss pressure.

## Tuned Floor regression — 15,000 runs

Using:
- Final-Blow Spoils
- Seal-Bearer 8 HP / STRONGEST
- revised First Door OPEN state
- current item/reward/economy pools

| Metric | Safe | Balanced | Greedy |
|---|---:|---:|---:|
| Floor clear | 98.4% | 90.0% | 59.1% |
| Mean final HP | 20.29 | 14.27 | 7.82 |
| Mean rounds | 16.58 | 28.07 | 35.88 |
| Mean HP loss | 5.36 | 11.62 | 16.51 |
| Mean Coins | 15.92 | 17.57 | 16.39 |
| Mean XP | 6.86 | 8.13 | 7.25 |

### Final-Blow raw Spoils-band frequency

| Band | Safe | Balanced | Greedy |
|---|---:|---:|---:|
| I | 38.6% | 24.3% | 21.6% |
| II | 46.4% | 34.4% | 36.1% |
| III | 14.1% | 26.6% | 27.2% |
| IV | 0.9% | 14.8% | 15.1% |

The policies now express the intended core tradeoff:

- Safe is extremely reliable but generates poor reward quality.
- Balanced pays meaningful HP/round cost for stronger reward access.
- Greedy receives only a modest additional premium-reward advantage over Balanced but suffers a severe survival cost.

The system is no longer paying the Greedy policy twice through both high premium frequency and easy survival.

## Item telemetry — first interpretation

The telemetry pass should be treated cautiously because automated item valuation is heuristic.

Strong selection signals:
- Blank Face
- Hidden Hand
- Carbon Paper
- False Bottom / pattern-oriented Spoils pieces under Greedy policy

This is expected for rare certainty/build-shaping items, but they remain review targets.

Weak selection signals:
- Redacted Slip
- Counterfeit Seal
- Wire Cutter
- Temporary Injunction
- Work Apron
- economy-only items under combat-heavy policies

Interpretation:
1. some weakness is caused by heuristic agents preferring permanent power over consumables;
2. Work Apron is genuinely redundant with the starting Old Field Coat and needs redesign/removal;
3. basic Contraband should be made strong enough that spending a scarce 2-slot consumable feels like an attractive tactical option.

Do not rebalance all items solely from these automated pick rates. Human playtest is required.

## Current system decisions after Gate 001

### Promote
- contested visible rolls
- margin damage
- Final-Blow Spoils
- four Loot quality bands
- Elite +1 Draft Band
- current Level/XP architecture
- small inventory / replacement pressure

### Revise
- Seal-Bearer -> 8 HP / STRONGEST
- First Door OPEN -> final 3 HP / 4d6 STRONGEST
- Work Apron -> redesign because starter-equivalent
- basic Contraband -> review strength/readability

### Keep provisional
- exact Shop prices
- exact XP thresholds after Floor I
- individual item power
- route policy and Elite uptake
- boss clear target for human players

## Simulator limitations

This simulator is deliberately headless and approximate.

It currently assumes:
- perfect arithmetic and rule knowledge;
- heuristic item valuation;
- heuristic route choice;
- simplified Event decision policies;
- deterministic one-action manipulation search rather than every imaginable action chain;
- no timing/animation friction;
- no player misunderstanding, misclicks, or learning curve.

Therefore **clear rates are comparative balance signals, not predictions of human win rate**.

Its strongest use is regression:
- did a change alter HP loss?
- did premium Loot frequency explode?
- did an Elite become fake difficulty?
- did a boss phase stop mattering?
- did one strategy begin dominating both safety and reward?

## Next gate

1. update canonical docs to Final-Blow Spoils;
2. commit structured Floor I data + simulator + unit tests;
3. redesign Work Apron and strengthen/review low-value Contraband;
4. add item-trigger/source telemetry;
5. freeze a regression seed suite;
6. rerun after content tuning;
7. only then freeze Floor I systems/content v1 for proper vertical-slice implementation.
