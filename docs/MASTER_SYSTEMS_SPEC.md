# As Above, Roll Below — Master Systems Spec

**Version:** 0.2  
**Status:** canonical preproduction systems contract  
**Supersedes:** v0.1 and any older prototype rule where they conflict

This document defines the baseline rules underneath content, art, simulation, and implementation. `DECISION_LEDGER.md` records the evidence/status behind these decisions.

---

# 1. Core combat contract

1. Encounter begins.
2. Enemy rolls visible dice.
3. Enemy locks dice according to visible deterministic **Instinct**.
4. Player rolls exactly **4d6**.
5. Player may use legal build-granted manipulation.
6. Player commits exactly **2 Fight Dice**.
7. The remaining exactly **2 dice are the current Spoils Pair**.
8. UI previews deterministic modifiers and the resulting margin.
9. Player confirms.
10. Higher Fight total deals HP damage equal to the winning margin, plus any explicitly triggered additional damage.
11. A tie deals 0 baseline damage unless an effect says otherwise.
12. If both combatants survive, begin another round.
13. On enemy death, resolve the encounter's **Final-Blow Spoils**.

There is no hidden hit/miss roll after COMMIT.

---

# 2. Final-Blow Spoils — LOCKED

The encounter reward is determined by the two uncommitted dice on the **final damaging player win that defeats the enemy**.

`Base Spoils Score = final uncommitted die A + final uncommitted die B`

Then deterministic Spoils modifiers resolve.

Losses and ties never qualify Spoils.

Earlier successful rounds do **not** store or improve reward quality.

## Why this replaced Best Successful Spoils

Simulation Gate V1 showed Best Successful Spoils materially overproduced premium rewards and rewarded prolonging fights:

- Balanced Band IV with Best Successful: **34.7%**
- Balanced Band IV with Final Blow: **11.0%**

Final Blow preserves the central decision on the most consequential combat roll while keeping Band IV genuinely premium.

See `simulation/floor1/SIMULATION_GATE_REPORT.md`.

## Reward bands

- **2–4:** Band I
- **5–7:** Band II
- **8–10:** Band III
- **11–12:** Band IV

The player's build may visibly modify the final Spoils Score, normally clamped to 12.

---

# 3. Fight calculation

`Raw Fight = committed die A + committed die B`

`Player Fight = Raw Fight + deterministic player modifiers`

`Enemy Fight = sum(enemy locked dice) + deterministic encounter modifiers`

`Margin = Player Fight - Enemy Fight`

Resolution:

- Margin > 0 → enemy loses Margin HP, then additional triggered damage.
- Margin < 0 → player loses abs(Margin) HP after mitigation.
- Margin = 0 → no baseline damage; tie effects may resolve.

All deterministic arithmetic relevant to the current commitment must be previewable before confirmation.

---

# 4. Universal player run state

The baseline player has only:

- Current HP
- Max HP
- Level
- XP
- Coins

Starting target:

- Level 1
- XP 0
- Max HP 20
- Current HP 20
- Coins 0
- Core Dice 4d6

Do not introduce universal Strength, Dexterity, Crit, Luck, Mana, Stamina, Sanity, Armor Rating, Accuracy, Evasion, elemental-resistance, Encumbrance, Hunger, or Durability systems without a formal amendment.

---

# 5. Run Level

Run Level resets every run.

Target range: **Level 1–6**.

XP:

- Normal: 1
- Elite: 2
- Boss: 3

Cumulative thresholds:

- L2: 3
- L3: 7
- L4: 12
- L5: 18
- L6: 25

Every Level:

- Max HP +2
- heal 2 HP

Levels 3 and 5 additionally grant one of two character-specific Techniques.

**Level never automatically adds universal Fight.**

> Levels keep you alive. Loot makes you weird.

---

# 6. Build categories and slots

## Gear — 3 fixed slots

- Weapon
- Armor
- Utility

Gear primarily answers: **How do I fight or survive the margin?**

## Artifacts — 4 slots

Primary rule-changing build layer.

Artifacts may reinterpret/manipulate dice, patterns, Spoils, economy, LOCK, enemy interference, and trigger relationships.

Artifacts primarily answer: **What do my dice mean now?**

## Contraband — 2 slots

Single-use tactical intervention.

Contraband primarily answers: **How do I escape this specific bad state?**

## Techniques — 2 earned milestones

Character-specific and outside inventory.

---

# 7. Duplicate / replacement contract

Baseline:

- Gear unique; no implicit stacking.
- Artifacts unique; no implicit stacking.
- Techniques unique.
- Contraband repetition allowed only when the item definition permits it.

Taking a persistent item into a full category requires replacement or cancellation.

Persistent replacement salvage:

`floor(base shop price × 0.5)`

No backpack hoarding.

---

# 8. Canonical dice verbs

- **BUMP:** ±1 within 1–6.
- **FLIP:** physical opposite `1↔6, 2↔5, 3↔4`.
- **LOCK:** preserve a die/state into a later timing window.
- **COPY:** target becomes source value.
- **TRANSMUTE:** explicitly set/change according to effect.
- **MARK:** attach a temporary property.
- **REROLL:** roll again; never a universal baseline action.

Every effect defines timing and target legality.

---

# 9. Enemy contract

Every enemy definition requires:

- ID / display name
- encounter class
- Max HP
- dice pool
- Instinct
- primary rule
- XP
- Coins
- pressure band
- tags
- content/provenance reference when applicable

No baseline Attack or Damage stat. Damage emerges from margin.

Pressure guidance:

- 2d6 lock both → ordinary baseline
- 3d6 authored/non-maximizing Instinct → specialist/tough
- 3d6 strongest-two → approximately Elite pressure
- bosses → authored stateful dice engines

A normal gets one primary rule. An Elite gets one strong rule or two tightly coupled simple rules. A Boss gets one major rule per state/phase.

---

# 10. Reward cadence

## Normal victory
XP + Coins → three-offer Loot Draft → level check → route.

## Elite victory
Elite XP + Coins → Loot Draft with **+1 reward band**, capped at IV → level check → route.

## Boss victory
Boss XP + Coins + small fixed heal → premium three-offer Boss Draft → Floor transition.

---

# 11. Loot Draft contract

Every standard combat victory presents exactly **3 offers** generated from Final-Blow Spoils quality.

Player may:

- take one offer;
- inspect replacement before confirming;
- cancel replacement and choose another offer;
- skip the entire draft for **+2 Coins**.

Categories:

- Gear
- Artifact
- Contraband
- Coin Cache
- future authored special rewards

Exact generation weights/prices live in `LOOT_AND_ECONOMY_SPEC.md`.

The generator prevents literal duplicate non-stackable offers and structurally unusable content; it does **not** secretly counterpick or complete the player's build.

---

# 12. Economy

One ordinary run currency: **Coins**.

Baseline encounter awards:

- Normal: 2
- Elite: 4
- Boss: 6

Shop baseline:

- 1 Gear
- 2 Artifacts
- 1 Contraband
- Heal 4 HP service

Price targets:

- Tier I Contraband: 3–4
- Tier I Gear: 5–6
- Tier I Artifact: 6–7
- Tier II persistent item: 8–10
- Heal 4 HP: 4

No baseline Shop reroll.

---

# 13. Timing windows

Combat effects use explicit timing:

1. Encounter Start
2. Enemy Cast
3. Enemy Lock
4. Player Cast
5. Pre-Commit Manipulation
6. Commit Preview
7. Commit Confirmed
8. Compare Totals
9. Win/Loss/Tie
10. Damage Modification
11. Damage Applied
12. Final-Blow Spoils Qualification (only when this damaging win kills the enemy)
13. Spoils Modification
14. Round End / Encounter Victory
15. Reward

No implementation data may depend on vague prose such as `after rolling`.

---

# 14. Route / Floor baseline

Full-run production target:

- 4 Floors
- 4 visited pre-boss rooms + Boss per Floor
- successful run target 25–35 minutes
- roughly 8–11 normal combats, 1–3 Elites, 2–4 Events, 2–4 Shops, 4 Bosses

Vertical slice:

- one constrained Floor
- four pre-boss rows + Boss
- mandatory first Combat
- Event opportunity
- Shop opportunity
- optional Elite opportunity
- 8–12 minute target after onboarding

Exact graph/generator contract lives in `RUN_STRUCTURE_AND_GENERATION_SPEC.md`.

---

# 15. Boss philosophy

Bosses do not dynamically inspect and disable the player's strongest build.

Bosses use authored dice engines, states, clear previewed rules, escalation, and premium reward certainty.

The player should be excited to unleash a broken build on a boss.

---

# 16. Information contract

Before COMMIT, the UI must expose enough authoritative information that deterministic outcomes are understandable:

- enemy locked dice + total
- Instinct
- player dice
- selected Fight pair
- current leftover Spoils pair
- Fight modifiers
- Enemy Fight modifiers
- predicted margin
- deterministic damage/mitigation
- deterministic Spoils modifiers relevant if this commitment would kill the enemy

Renderer never decides gameplay math.

---

# 17. Deterministic implementation

Gameplay rules run independently of rendering.

Separate seeded RNG streams cover map, encounters, combat dice, rewards, Shop, Events, and cosmetic randomness.

Same seed + same decisions must reproduce gameplay outcomes.

Headless simulation is a first-class requirement.

---

# 18. Baseline statuses

No traditional status encyclopedia.

Statuses exist only when they change a clear future dice/commitment rule.

Initial vocabulary may include FIXED, MARKED, SEALED and similar explicit states.

Target maximum persistent visible combat statuses: 3 per combatant.

---

# 19. Metaprogression

Horizontal by default:

- characters
- items
- enemies
- bosses
- Events
- modifiers/modes
- cosmetics

No permanent universal Fight ladder or mandatory Max-HP tree.

---

# 20. Explicit baseline rejects

Do not casually reintroduce:

- fixed monster Threat as primary combat
- parallel Hearts/Resolve
- universal reroll
- universal CHEAT button
- mana / stamina / stress / sanity
- crafting / durability / encumbrance
- crit/dodge/accuracy sheets
- procedural affix soup
- hidden randomness after COMMIT
- unlimited inventory
- **Best Successful Spoils**

See `DECISION_LEDGER.md` for the full status record.
