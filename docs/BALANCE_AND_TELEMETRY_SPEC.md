# As Above, Roll Below — Balance & Telemetry Spec

**Version:** 0.1  
**Status:** tuning framework; numbers are targets, not sacred constants

Balance exists to preserve repeated meaningful Fight-vs-Spoils decisions. It is not an attempt to make every item or strategy equally strong.

---

# 1. Balance priorities

In order:

1. player understands why an outcome occurred;
2. safe and greedy decisions are both situationally rational;
3. build pieces materially change roll evaluation;
4. ordinary encounters stay fast;
5. attrition matters across a Floor;
6. premium risk pays premium expected value;
7. broken-feeling synergies are allowed without making choices automatic;
8. no single item becomes mandatory across unrelated builds.

---

# 2. Baseline combat math already established

Player can choose best pair from 4d6.

Approximate one-round baseline when playing pure safety:

## Enemy 2d6, lock both
- player win ~72%
- tie ~9%
- enemy win ~18%
- player winning margin ~3.8 average
- losing margin ~2.3 average

## Enemy 3d6, strongest two
- player win ~55%
- tie ~13%
- enemy win ~32%
- winning margin ~3.0
- losing margin ~2.4

## Enemy 4d6, strongest two
- near symmetric ~42% player win / 42% enemy win / 15% tie

Conclusion remains:

- 2d6 baseline is normal-enemy material;
- 3d6 strongest-two is elite-grade pressure;
- 4d6 strongest-two is authored boss/exception pressure, not normal scaling.

---

# 3. Encounter duration targets

## Normal
Median: 2–4 rounds.

Target hard ceiling for typical normal: 6 rounds before content-specific escalation review.

## Tough normal
Median: 3–5 rounds.

## Elite
Median: 4–7 rounds.

## Boss
Total authored encounter: approximately 6–12 meaningful commitment rounds depending on phases.

Boss duration should come from changing states, not a giant HP sponge.

---

# 4. HP-loss targets

These are average ranges for a reasonably competent non-perfect player with a developing build.

## Early normal
0.5–1.8 HP expected loss.

## Mid/late normal
1.0–2.5 HP.

## Elite
2.5–5 HP.

## Boss
4–8 HP depending on phase count and build.

A single normal encounter that routinely removes 25%+ of Max HP is probably elite pressure wearing a normal label.

---

# 5. Player HP curve

Starting Max HP: 20.

Each Level: +2 Max HP, heal 2.

No automatic Floor full heal.

Boss clear target heal: 2.

Desired state:

- HP matters enough to make Shop healing / defensive Gear relevant;
- good play can preserve enough HP to route aggressively;
- greed visibly increases future risk;
- defensive builds buy permission to greed rather than merely slow the game.

---

# 6. Level cadence target

Current XP thresholds:

- L2: 3
- L3: 7
- L4: 12
- L5: 18
- L6: 25

Design intent:

- L2 during/near end of Floor I
- L3 during Floor II
- L4 Floor II/III
- L5 Floor III/IV
- L6 optional late-run reward for combat/Elite-heavy routing rather than guaranteed before final boss

If simulation shows most runs reach Techniques too late, change thresholds rather than inflating XP awards ad hoc.

---

# 7. Spoils distribution target

The game should not force a universal distribution because player greed controls it.

However, across competent mixed play, target normal-combat final Spoils-band frequency roughly:

- Band I: 15–25%
- Band II: 35–45%
- Band III: 25–35%
- Band IV: 5–15%

If Band IV is common under low-risk play, greed has lost meaning.

If Band III/IV are nearly absent even when deliberately greedy, loot fantasy is too stingy.

---

# 8. Greed differential

Compare strategy policies in headless simulation:

## SAFE
Choose max Fight pair.

## GREEDY-WIN
Choose the weakest pair that still wins while maximizing Spoils.

## BALANCED
Use a risk budget based on current HP, enemy HP, reward band improvement, and route stage.

Desired result:

- SAFE has materially lower HP loss and shorter fights;
- GREEDY-WIN has materially better Spoils and longer fights;
- BALANCED produces best overall run success for many seeds but not all builds.

If one policy dominates both survival and loot, core risk/reward is broken.

---

# 9. Economy targets

Desired Coins entering a typical Shop:

- Floor I opportunity: ~5–9
- mid-run: ~7–12 depending on skips/salvage

Typical Shop should create:

- one clearly affordable meaningful purchase;
- a decision between healing and build power when wounded;
- occasional ability to buy two small things through economy-focused play.

A player should not routinely buy the whole Shop.

---

# 10. Loot-choice metrics

Track per item:

- offered count
- selected count
- selection rate when offered
- skip rate when offered
- replacement rate
- average Floor acquired
- win rate when acquired
- average trigger count
- average value generated (damage prevented, Fight added, Spoils added, Coins created, etc.)

Interpretation needs context.

High win correlation may mean:

- item is overpowered;
- item is primarily offered at high Spoils / strong runs;
- good players value it correctly;
- synergy pool supports it unusually well.

Never balance solely from raw win-rate correlation.

---

# 11. Slot occupancy targets

By Floor II boss:

- most players should have all 3 Gear slots filled or made an intentional choice not to;
- Artifact occupancy should average 2–3.

By Floor IV:

- Artifact slots usually full;
- replacement decisions common;
- Gear replacement common;
- Contraband continues cycling.

If the run ends before replacement pressure occurs, inventory limits are mostly cosmetic.

---

# 12. Elite value targets

Elite route should be an actual question.

Expected premium:

- +1 reward band
- +2 Coins compared with normal
- +1 XP compared with normal

Cost target:

- meaningful extra expected HP loss / death risk.

Track:

- Elite route pick rate when optional
- survival after Elite
- average reward band
- win rate of players who choose Elite, corrected for player strength if possible

Optional Elite choice rate that approaches 100% suggests insufficient downside or excessive reward.

---

# 13. Boss targets

Boss should test developed systems, not hidden knowledge.

Track:

- attempt HP
- rounds to victory/death
- damage taken
- item triggers
- phase reached
- failure cause
- percentage of losses that were mathematically visible before COMMIT

Boss should not regularly produce `I had no idea that would happen` deaths after rules were supposedly explained.

---

# 14. Item power budget principles

## Tier I
Expected to create small advantage repeatedly or strong advantage conditionally.

## Tier II
Expected to shift priorities/build identity.

## Tier III
Expected to be run-defining under the right engine.

Power cannot be judged only as damage.

Value dimensions:

- damage
- prevention
- Fight manipulation
- Spoils increase
- economy
- additional choices
- reliability
- conditionality
- slot opportunity cost

---

# 15. Certainty budget

Effects that eliminate randomness/choice are expensive.

Review carefully:

- set any die to 6 every round
- guaranteed enemy-die suppression
- permanent large flat Fight bonus
- unlimited rerolls
- automatic Spoils 11+

A powerful effect is healthy if it creates new decisions. It is unhealthy if it removes the need to inspect the roll.

---

# 16. Healing budget

Record healing by source:

- Level
- Boss clear
- Shop
- Gear/Artifact
- Contraband
- Event

If mandatory healing consumes most Coins every run, baseline attrition is too high or healing is underpriced.

If healing is almost never purchased, either HP pressure is too low or build items dominate value excessively.

---

# 17. Vertical-slice success targets

For players who understand the rules after one tutorial encounter:

- majority should reach the boss often enough to evaluate the whole slice;
- boss should not be an automatic clear;
- at least one real replacement decision should occur in many runs;
- player should acquire enough persistent loot to describe a build;
- run should take about 8–12 minutes after onboarding.

Do not optimize the slice around brutality. It is a product/design proof.

---

# 18. Simulation outputs

Headless batch summary per strategy/seed should include:

- win/loss
- Floor/room reached
- final Level/XP
- HP trajectory
- encounters/rounds
- Spoils scores/bands
- offered/picked items
- item triggers
- Coins trajectory
- Shop actions
- Elite choices
- route sequence
- boss phase performance

Store per-run trace only for sampled/failed seeds to keep datasets manageable.

---

# 19. Regression suite

Freeze a set of representative seeds and strategy policies.

Every mechanics/content update reruns them and reports deltas:

- clear rate
- HP loss
- reward bands
- item pick distribution
- economy
- encounter duration

A balance change should show what it moved before it is accepted.
