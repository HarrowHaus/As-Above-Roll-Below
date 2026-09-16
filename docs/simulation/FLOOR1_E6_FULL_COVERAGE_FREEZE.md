# Floor I — E6 Full-Coverage Systems Freeze Gate

**Status:** systems architecture frozen for client implementation; numerical balance remains playtest-tunable  
**Source commit:** `e11a738b2b1e5f6c3173a7fe873a39b4ff429173`  
**Batch:** 1,000 seeded Floors each for Safe / Opportunist / Greedy

This is the first Floor I regression where all 8 Gear, 12 Artifacts and 6 Contraband participate in the shared-core simulation rather than being silent reward placeholders.

## Headline results

| Policy | Clear | Avg HP | Damage | Rounds | Avg Spoils | Raw B4 | Reward B4 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Safe | 96.9% | 17.18 | 7.17 | 14.37 | 5.38 | 1.2% | 2.7% |
| Opportunist | 94.7% | 16.57 | 9.01 | 18.52 | 6.99 | 11.9% | 20.6% |
| Greedy | 51.7% | 6.42 | 18.14 | 33.65 | 7.56 | 19.6% | 28.4% |

`Raw B4` is the Final-Blow Spoils band before Elite reward uplift. `Reward B4` includes Elite +1-band promotion.

## What survives the gate

### Final-Blow Spoils
Keep it.

The clean raw distribution is the important measurement:

- Safe B4: **1.2%**
- Opportunist B4: **11.9%**
- Greedy B4: **19.6%**

The mixed-play Opportunist result sits inside the target 5–15% premium range while deliberate Greed materially increases premium loot and materially increases exposure/death risk.

### Greed differential
Keep it.

Safe and Greedy do not dominate the same axes:

- Safe completes fights much faster and loses much less HP.
- Greedy earns stronger Spoils but roughly doubles combat exposure and has a dramatically lower clear rate.
- Opportunist sits between them while maintaining strong survival.

This is the shape the core game needs.

### Elite pressure
Keep the simulation-driven Seal-Bearer revision and current Threshold Warden baseline for the vertical-slice client.

Under Opportunist policy:

- Threshold Warden: ~4.68 rounds / ~2.19 player damage.
- Seal-Bearer: ~4.98 rounds / ~2.37 player damage.

They now read as meaningful optional pressure above ordinary enemies without becoming boss-length encounters.

### First Door
Keep the current CLOSED / AJAR / short-dangerous OPEN structure for human testing.

Under Opportunist policy:

- boss entry HP ~17.93
- boss duration ~7.96 rounds
- boss damage ~4.72
- boss clear ~95.4% under automated near-perfect arithmetic

This is intentionally not tuned harder against a perfect bot before human playtesting.

## Item coverage notes

Every Floor I item is now eligible for acquisition and represented by the simulator/core path.

Notable Opportunist acquisition/use counts across 1,000 Floors:

- Brass Caliper: 159 taken / 303 triggers
- Stuck Key: 150 taken / 276 triggers
- Carbon Copy: 214 / 214
- Wire Cutter: 214 / 213
- Redacted Slip: 88 / 82
- Counterfeit Seal: 87 / 87
- Temporary Injunction: 105 / 18
- Emergency Key: 107 / 5
- Ash Ledger: 19 / 14
- Receipt From Nowhere: 18 / 1

Low trigger counts for economy/contingency items are not automatic nerf evidence in a single four-room Floor. Their value must also be judged in multi-Floor runs and human playtests.

## Freeze decision

Freeze for E7 client implementation:

- deterministic RNG-stream architecture
- generic N-Floor generator
- Encounter/Event Directors
- enemy-first contested dice combat
- margin damage
- Final-Blow Spoils
- effect timing/resolution architecture
- manipulation-reaction architecture
- Gear / Artifact / Contraband roles and slot counts
- XP/Level/Technique architecture
- Loot Draft and Elite uplift architecture
- Coins / Shop / salvage architecture
- current Floor I authored content set

Do **not** freeze yet:

- exact human-facing difficulty
- individual enemy HP after human playtests
- individual item prices/power coefficients
- Shop/route frequency beyond the current vertical-slice grammar
- final boss lethality

## Next gate — E7

Build the actual browser client on the same `@aarb/core` rules implementation.

The renderer/UI may animate and present authoritative events. It may not reproduce or override gameplay math.
