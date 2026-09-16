# As Above, Roll Below — Simulation Gate V1

Determinism smoke test: **PASS**

## Candidate rules tested

- **Final-Blow Spoils** instead of Best Successful Spoils.
- **Seal-Bearer:** 8 HP, 3d6 STRONGEST; COUNTERSEAL retained.
- **First Door OPEN:** HP 1–3, 4d6 STRONGEST; BOTH WAYS retained.

## 3,600-run candidate regression

| Policy | Clear | End HP | Damage | Rounds | Avg Spoils | Band I | Band II | Band III | Band IV |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Safe | 97.2% | 17.31 | 6.87 | 15.43 | 5.42 | 36.6% | 47.2% | 14.9% | 1.3% |
| Balanced | 92.1% | 15.56 | 10.87 | 23.40 | 6.65 | 19.2% | 38.5% | 31.3% | 11.0% |
| Greedy | 57.2% | 7.49 | 17.24 | 35.46 | 7.67 | 17.6% | 30.7% | 31.8% | 19.9% |

## Capture-rule comparison — Balanced policy, 350 Floors each

| Rule | Clear | Avg Spoils | Band I | Band II | Band III | Band IV |
|---|---:|---:|---:|---:|---:|---:|
| best | 90.9% | 8.87 | 2.7% | 17.6% | 45.1% | 34.7% |
| best2 | 92.9% | 8.40 | 4.9% | 23.6% | 42.2% | 29.3% |
| first | 92.0% | 7.39 | 13.4% | 31.3% | 35.1% | 20.3% |
| final | 92.6% | 6.76 | 18.1% | 37.2% | 33.8% | 11.0% |

## Findings

1. **Best Successful Spoils is rejected for Floor I.** It pushes Balanced Band IV to 34.7% in this implementation, far above the 5–15% target and creates extra incentive to prolong fights.
2. **Final-Blow Spoils lands inside the intended premium frequency for Balanced play:** Band IV 11.0%, with Greedy still materially higher at 19.9% and Safe only 1.3%.
3. **Policy separation is strong:** Safe clears 97.3% with short fights; Balanced clears 92.1% with moderate premium loot; Greedy reaches much better Spoils but clears only 57.2% and takes far more damage.
4. **Greedy is probably too suicidal as currently modeled.** This is a policy-model issue first, not a request to nerf greed. Human players will switch out of greed when near death; the next heuristic pass should include survival thresholds.
5. **Safe may be too forgiving for a one-Floor vertical slice.** This is acceptable for onboarding but should be watched in human play; difficulty should come from Floor content, not hidden stat inflation.
6. **Seal-Bearer needed the STRONGEST revision.** WIDE did not justify Elite reward uplift.
7. **First Door needs a sharp finish, not a long 4d6 grind.** Restricting OPEN to the final 3 HP preserves drama without bloating the fight.

## Limitations

- This is a balance simulator, not the shipping engine.
- It models all authored enemy profiles, route choices, levels, loot bands, inventory, shops, events and the major Floor I item effects; some niche timing interactions are simplified.
- Automated policies approximate player behavior. Human playtesting remains authoritative for feel and comprehension.

## Decision gate

**Adopt Final-Blow Spoils as the new canonical capture rule for the next implementation/simulation pass.**

Then freeze regression seeds, expand per-enemy/item telemetry, and implement the proper vertical slice only after the second simulation pass.