# As Above, Roll Below — Master Systems Spec

**Version:** 0.1  
**Status:** canonical preproduction systems contract

This document defines the complete baseline rules underneath content, art, and implementation. If another design document conflicts with this one, this one wins unless explicitly superseded by a later decision log entry.

---

# 1. Core loop

## Combat loop

1. Encounter begins.
2. Enemy rolls visible dice.
3. Enemy locks according to deterministic Instinct.
4. Player rolls exactly 4d6.
5. Player may use legal manipulation.
6. Player commits exactly 2 Fight Dice.
7. Remaining 2 dice become the current Spoils Pair.
8. UI previews deterministic modifiers and margin.
9. Player confirms.
10. Higher Fight total deals damage equal to the winning margin.
11. Tie deals 0 baseline damage.
12. A damaging player win records the current Spoils Score.
13. If both remain alive, next round.
14. On victory: XP + Coins + Loot Draft.
15. On death: run ends.

## Run loop

choose character → Floor route → encounter/event/shop → reward/build change → level thresholds → elite/boss → next Floor → final boss → run summary → horizontal unlock checks → new run.

---

# 2. Player run state

The baseline player has only these universal numerical run stats:

- **Current HP**
- **Max HP**
- **Level**
- **XP**
- **Coins**

No universal baseline stats for Strength, Dexterity, Armor, Crit, Luck, Mana, Sanity, Stamina, Encumbrance, Accuracy, Evasion, or elemental resistance.

Those concepts may exist as item/enemy rules only when they create a concrete dice decision.

## Starting values — production target

- Level: 1
- XP: 0
- Max HP: 20
- Current HP: 20
- Coins: 0
- Core Dice: 4d6
- Gear slots: Weapon / Armor / Utility
- Artifact slots: 4
- Contraband slots: 2
- Technique slots: 2 earned through run Level

---

# 3. Enemy stat contract

Every enemy record contains:

- id
- display_name
- tier: normal / tough / elite / boss
- max_hp
- dice_count
- Instinct
- primary_rule
- optional phase/state rules
- XP reward
- Coin reward
- Loot modifiers
- tags
- content/provenance reference

There is no baseline Attack stat and no baseline Damage stat. Enemy damage emerges from the contested margin.

## Dice-pressure bands

- ordinary baseline: 2d6 lock both
- specialist/tough: 3d6 with authored non-maximizing Instinct or compensating weakness
- elite baseline pressure: 3d6 strongest-two or equivalent
- boss: custom authored dice engine; never `more dice = boss` as the only mechanic

---

# 4. Fight calculation

`Raw Fight = committed die A + committed die B`

`Player Fight = Raw Fight + deterministic Gear/Artifact/Technique modifiers`

`Enemy Fight = sum(enemy locked dice) + deterministic encounter modifiers`

`Margin = Player Fight - Enemy Fight`

Resolution:

- Margin > 0: enemy loses Margin HP, then additional triggered damage resolves.
- Margin < 0: player loses abs(Margin) HP after mitigation.
- Margin = 0: no baseline damage; tie-trigger effects may resolve.

## Ordering rule

All deterministic bonuses relevant to the commitment must be previewable before CONFIRM.

Triggered effects that are intentionally conditional on resolution may resolve afterward, but their trigger condition and effect text must be visible.

---

# 5. Spoils system

Every round where the player deals baseline/triggered combat damage after winning the comparison creates one successful Spoils Pair.

`Base Spoils Score = uncommitted die A + uncommitted die B`

Then deterministic Spoils modifiers resolve.

Score is clamped to the supported reward range unless an Artifact explicitly creates an overcap mechanic.

## Current encounter capture rule

The encounter remembers the **highest successful adjusted Spoils Score** achieved before the enemy dies.

Losses and ties do not qualify Spoils by default.

## Reward bands

- 2–4: Band I
- 5–7: Band II
- 8–10: Band III
- 11–12: Band IV

Final fiction-facing band names are content work, not systems work.

## Open validation

Best Successful Spoils remains canonical for production planning but is still subject to replacement if actual play reveals low-risk intentional stalling.

---

# 6. Player Level

Run Level resets each run.

Target range: Level 1–6.

XP source:

- Normal: 1
- Elite: 2
- Boss: 3

Target cumulative thresholds:

- L2: 3
- L3: 7
- L4: 12
- L5: 18
- L6: 25

On every level:

- Max HP +2
- heal 2 HP

At L3 and L5:

- choose 1 of 2 character-specific Techniques

Level does not automatically increase universal Fight.

---

# 7. Build categories

## Gear

Slots: 3 fixed functional slots.

- Weapon: changes how the player wins / damage output.
- Armor: changes consequences of losing / mitigation.
- Utility: economy, tie rules, conditional support, non-damage fight rules.

Gear should be the most immediately understandable build category.

## Artifacts

Slots: 4.

Artifacts are the main systemic identity layer.

They may alter:

- dice values
- pattern meaning
- manipulation limits
- Spoils evaluation
- Fight/Spoils relationship
- economy
- enemy interference
- LOCK/persistence
- trigger interactions

Artifacts should usually use shared verbs/triggers rather than hard-coded pairwise combos.

## Contraband

Slots: 2.

Single-use tactical items.

Contraband should solve visible states rather than provide vague long-term bonuses.

Examples of role:

- force/set/reroll one player die
- lower one enemy die
- negate a rule for one round
- heal
- preserve/restore a resource

## Techniques

Character-specific, gained only at Level milestones.

Maximum ordinary run count: 2.

Techniques modify character identity, not inventory capacity.

---

# 8. Duplicate and stacking policy

Vertical slice / baseline release rule:

- Gear: unique; duplicate copies do not stack.
- Artifacts: unique; duplicate copies do not stack.
- Contraband: duplicates may occupy separate slots only if the exact item is allowed to repeat.
- Techniques: unique.

If later content permits stacking, every stackable effect must declare an explicit stacking rule:

- linear
- diminishing/hyperbolic
- additional charges
- increased trigger count
- capped

There is no implicit stacking behavior.

---

# 9. Manipulation vocabulary

Canonical verbs:

## BUMP
Increase or decrease one player die by 1 within 1–6.

## FLIP
Change to the physical opposite:
1↔6, 2↔5, 3↔4.

## LOCK
Preserve a die/state into a later timing window.

## COPY
Change target die to match a source die.

## TRANSMUTE
Change a specified face/value into another according to an effect.

## MARK
Attach a temporary property recognized by other effects.

## REROLL
Roll the target die again and replace its value. REROLL is not a baseline player action; it appears only through content.

Every effect must declare target restrictions and timing.

---

# 10. Timing windows

Every combat effect belongs to a defined timing window.

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
12. Spoils Qualification
13. Spoils Modification
14. Round End
15. Encounter Victory/Defeat
16. Reward

Effects may not use ambiguous timing phrases such as `after rolling` in implementation data. They must identify one canonical window.

---

# 11. Status policy

AARB does not need a traditional RPG status encyclopedia at baseline.

Statuses exist only when they alter a clear future dice/commitment rule.

Target maximum persistent combat statuses visible simultaneously: 3 per combatant.

Status records require:

- duration
- stack behavior
- timing window
- exact rule
- cleanse/expiry behavior

Potential families:

- Sealed: action/manipulation unavailable
- Marked: targeted by another effect
- Fixed: value cannot be manipulated
- Burdened: specific value/pattern penalty

Do not import poison/burn/freeze merely because other RPGs have them.

---

# 12. Reward cadence

## Normal victory

XP + Coins → Loot Draft → continue.

## Elite victory

Elite XP + Coins → elevated Loot Draft → continue.

## Boss victory

Boss XP + Coins + small fixed heal → Boss Draft → Floor transition.

## Level threshold

Level-up resolves after current Loot Draft to prevent Level presentation from interrupting the reward choice that combat generated.

Exception: if tests show the order feels wrong, this is a UX-order decision, not a systems dependency.

---

# 13. Loot Draft contract

Every standard Loot Draft presents exactly 3 offers.

Player may:

- take one offer;
- back out of an item requiring replacement and choose another offer;
- skip the entire draft for fixed Coin value.

The Spoils band changes quality composition, not number of offered choices.

## Category roles

The generator can offer:

- Gear
- Artifact
- Contraband
- Coin Cache
- rare authored special reward later

Reward generator must prevent impossible/meaningless offers where practical.

Examples:

- don't offer a duplicate non-stackable Artifact already owned;
- don't offer a Contraband whose effect is invalid for the current game rules if it cannot ever be used;
- boss drafts guarantee persistent build value.

---

# 14. Economy

Only ordinary run currency: Coins.

Target encounter awards:

- Normal: 2
- Elite: 4
- Boss: 6

Skip Loot Draft: +2 Coins.

Replaced Gear/Artifact: salvage roughly 50% of its base shop price, rounded down.

## Shop baseline

Offers:

- 1 Gear
- 2 Artifacts
- 1 Contraband
- healing service

Price targets:

- Contraband: 3–4
- Tier I Gear: 5–6
- Tier I Artifact: 6–7
- Tier II persistent item: 8–10
- Heal 4: 4

No baseline shop reroll.

If reroll is introduced after testing:

`cost = 2 + rerolls previously used in this shop`.

---

# 15. Item power tiers

Internal content tiers are not automatically visible rarity colors.

## Tier I — foundation

One clear effect. Useful without synergy.

## Tier II — build-shaping

Meaningfully changes roll evaluation or creates an engine.

## Tier III — run-defining

Rare, strong, still leaves player decisions alive.

A Tier III effect that makes the four dice irrelevant is a failed item.

---

# 16. Encounter classes

## Normal

Tests baseline build and one primary rule.

## Tough Normal

One stronger dice profile or one more demanding rule.

## Elite

Optional/premium encounter with authored pressure and better reward expectation.

## Boss

Multi-state authored encounter with custom dice behavior and guaranteed premium reward.

Enemy design budget:

- normal: 1 primary rule
- elite: 1 strong rule or 2 tightly related simple rules
- boss: 1 major rule per state/phase

---

# 17. Run structure target

Full game target:

- 4 Floors
- 25–35 minute successful run
- roughly 8–11 normal combats
- 1–3 elites
- 2–4 events
- 2–4 shops
- 4 bosses

Vertical slice target:

- 1 Floor
- 8–12 minutes
- 4–6 ordinary/special rooms before boss
- enough rewards to create a recognizable build by boss

---

# 18. Route-map information

Route node must show room category before selection.

Baseline categories:

- Combat
- Elite
- Event
- Shop
- Boss

Later nodes may expose broad reward bias but should not reveal exact item identity.

Route generation rules live in RUN_STRUCTURE_AND_GENERATION_SPEC.md.

---

# 19. Event design contract

Events are short system decisions, not visual-novel branches.

Each event has:

- premise
- 2–3 choices
- exact consequence ranges
- optional build-conditioned choices
- content/provenance data

Build tags may unlock alternate solutions, inspired structurally by FTL, but no player should require external lore knowledge to identify the mechanical consequence.

---

# 20. Boss philosophy

Bosses do not dynamically inspect and disable the player's strongest build.

Bosses may naturally challenge a strategy through their authored identity.

Boss goals:

- custom dice behavior
- state changes
- recognizable escalation
- strong visual/timing identity
- reward certainty

The player should be excited to deploy a broken build against the boss.

---

# 21. Death and restart

At HP 0:

- encounter ends
- run summary appears
- horizontal unlock checks process
- seed/build summary is available
- primary action is GO AGAIN

Restart friction target: one primary click/tap.

---

# 22. Metaprogression

Horizontal only as baseline.

Unlock pool examples:

- characters
- Gear
- Artifacts
- Contraband
- enemies
- bosses
- events
- difficulty modifiers
- challenge/daily modes
- cosmetic dice families

No permanent universal Fight increase.

No permanent Max HP tree as the primary progression model.

---

# 23. Accessibility / information contract

The player never needs mental arithmetic for deterministic combat resolution.

Before COMMIT show:

- enemy locked dice and total
- Instinct
- player dice
- selected Fight pair
- current Spoils pair
- deterministic Fight bonuses
- predicted margin
- deterministic damage mitigation/additions
- deterministic Spoils modifiers where known

Inputs:

- mouse
- touch
- keyboard

Options:

- reduced motion
- faster animations
- scalable text
- separate SFX/music
- color-independent state marks
- numeric dice labels available in addition to pips

---

# 24. Canonical non-systems

Do not add without a formal design amendment:

- mana
- stamina
- stress/sanity
- crafting
- durability
- encumbrance
- elemental resistance sheet
- crit chance
- dodge chance
- loot weight
- hunger
- procedural affix soup
- randomized accuracy after COMMIT

Every new universal resource must prove it creates decisions the existing systems cannot.
