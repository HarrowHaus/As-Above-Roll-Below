# Vertical Slice Content Sheet

**Status:** D-stage scaffold. Populate only after core combat, systems architecture, content rules, and art production agree.

## Goal

Produce one complete 8–12 minute Floor at finished-game quality.

This is not a mechanics demo and not a miniature promise of every release feature. It is the smallest complete piece of **As Above, Roll Below** that can answer:

> If the entire game were finished to this standard, would somebody want to buy and immediately replay it?

---

## Systems doctrine

The Vertical Slice must preserve the separation established in `SYSTEMS_ARCHITECTURE.md`:

> **Levels keep you alive. Loot makes you weird.**

The slice must therefore demonstrate both:

- predictable Player Level progression / endurance growth;
- build identity emerging primarily from Gear, Artifacts, Contraband, and Spoils quality.

---

## Required playable content

### Player
- Character 01
- starting Gear
- defining ability
- Level 3 Technique pair
- production model sheet reference
- complete gameplay text

### Normal enemies
- Enemy 01
- Enemy 02
- Enemy 03
- Enemy 04
- Enemy 05
- Enemy 06
- Enemy 07
- Enemy 08

Each requires:
- HP
- dice pool
- Instinct
- primary rule
- XP value
- Coin value
- reward weighting
- expected Spoils band distribution
- source/provenance record where relevant
- art requirement
- animation requirement
- SFX requirement

### Elites
- Elite 01
- Elite 02

Each requires authored pressure beyond simply more HP and must justify its optional danger through an elevated Loot Draft.

### Boss
- Boss 01

Requires:
- custom dice engine
- HP
- phases/behavior states
- authored mechanics
- XP / Coin reward
- Boss Draft definition
- source/provenance if applicable
- full visual-development sheet
- phase-transition presentation

---

## Player Level

Vertical Slice implementation must include the canonical Level system even if Floor I only exposes the early portion of it.

Current full-run structure:

- Level 1 start
- Level 2 at 3 cumulative XP
- Level 3 at 7 cumulative XP
- Level 4 at 12 cumulative XP
- Level 5 at 18 cumulative XP
- Level 6 at 25 cumulative XP

Encounter XP:
- normal = 1
- elite = 2
- boss = 3

Every level:
- Max HP +2
- heal 2

Level 3 and Level 5:
- additionally choose one character-specific Technique from two offers.

The Vertical Slice must contain enough XP to show at least one ordinary level-up. It should expose a Technique choice if run length/content count permits without artificial acceleration.

---

## Loot / Spoils

Loot is a core system, not presentation afterthought.

### Spoils capture
Each damaging player win creates a successful Spoils Pair. The encounter tracks the highest successful Spoils Score achieved before victory.

### Post-combat draft
Every standard victory produces a three-offer Loot Draft.

Spoils bands:
- 2–4: Tier I Draft
- 5–7: Tier II Draft
- 8–10: Tier III Draft
- 11–12: Tier IV / Improbable Draft

The score changes offer quality, not the number of choices.

### Elite modifier
Elite victory raises the generated draft one quality band, capped at Tier IV.

### Skip
The player may skip a Loot Draft for the canonical small Coin reward.

The reward screen must make the relationship between the in-combat Spoils Pair and the resulting draft unmistakable.

---

## Build content

### Artifacts — 12
Each entry must contain:
- name
- internal tier I / II / III
- exact mechanical text
- trigger timing
- dice verbs used
- synergy tags
- stacking behavior
- source/provenance if relevant
- art brief

Artifacts primarily answer:

> What do my dice mean now?

### Gear — 8
Target distribution across Weapon / Armor / Utility.

Each Gear entry must define its slot and replacement/salvage value.

Gear primarily answers:

> How do I fight?

### Contraband — 6
Single-use tactical effects. Must be useful in a visible combat state rather than generic filler.

Contraband primarily answers:

> How do I get out of this specific mess?

### Character Techniques
At minimum author the two Level 3 Technique choices for Character 01.

They occupy no item slot and should deepen character identity rather than duplicate ordinary loot.

---

## Inventory pressure

Vertical Slice must implement:

- Weapon slot: 1
- Armor slot: 1
- Utility slot: 1
- Artifact slots: 4
- Contraband slots: 2

Taking an item into a full category requires replacement/cancellation.

Replaced items salvage into Coins according to the system rules.

No backpack hoarding.

---

## Economy / Shop

One run currency: Coins.

Current encounter awards:
- normal: 2 Coins
- elite: 4 Coins
- boss: 6 Coins

### Shop
Specify and implement:
- 1 Gear offer
- 2 Artifact offers
- 1 Contraband offer
- healing service
- price bands
- replacement/salvage interaction
- presentation

Initial price targets:
- Contraband: 3–4
- Tier I Gear: 5–6
- Tier I Artifact: 6–7
- Tier II Gear/Artifact: 8–10
- Heal 4 HP: 4

Do not add shop rerolls before the fixed inventory has been playtested.

---

## World/route content

### Events — 3
Each event needs:
- premise
- 2–3 choices
- exact outcomes
- source/provenance if relevant
- art/environment requirement

### Map generation
Specify:
- number of node rows
- route branching
- guaranteed room types
- elite probability
- shop placement constraints
- event placement constraints
- boss endpoint
- which room/reward categories are visible before route commitment

---

## Balance fields

Before implementation every combat entry must have actual numbers for:

- monster HP
- dice count
- locking Instinct
- any die modification
- expected safe fight length
- expected greedy fight length
- expected player HP loss
- expected Spoils distribution
- expected XP / Coin yield
- expected Loot Draft band

No `balance later` placeholders in the implementation handoff.

---

## Research fields

Every real-world-derived entry needs a corresponding Content / Research Bible record before final writing or art.

At minimum:
- canonical proper noun
- source category
- documented facts
- claimed/lore layer
- game-fiction transformation
- common errors to avoid
- visual facts

---

## Writing fields

Each content entry eventually needs:

- display name
- one-line rules text
- optional flavor line
- encounter intro if needed
- defeat/result text if needed

Writing must obey the Content Bible's deadpan/high-specificity humor rules.

---

## Vertical Slice systems checklist

- [ ] seeded run
- [ ] route map
- [ ] Player Level / XP
- [ ] automatic HP growth on level
- [ ] Level 3 Technique choice
- [ ] monster pre-roll
- [ ] visible Instinct locking
- [ ] player 4d6 roll
- [ ] dice selection
- [ ] manipulation verbs
- [ ] predicted margin display
- [ ] margin damage
- [ ] HP
- [ ] Best Successful Spoils capture
- [ ] four-band Loot Draft generation
- [ ] three-offer reward draft
- [ ] Gear inventory / replacement
- [ ] Artifact inventory / replacement
- [ ] Contraband inventory / use
- [ ] salvage on replacement
- [ ] Coins
- [ ] Shop
- [ ] Events
- [ ] Elite reward-band elevation
- [ ] Boss Draft
- [ ] death summary
- [ ] Floor victory
- [ ] local save/resume
- [ ] keyboard/touch/mouse controls
- [ ] reduced motion
- [ ] audio controls

---

## Presentation checklist

- [ ] finished player art
- [ ] finished eight-enemy set
- [ ] finished elites
- [ ] finished boss
- [ ] finished front-facing gameplay dice
- [ ] finished combat UI
- [ ] finished Loot Draft UI
- [ ] finished Level-up / Technique UI
- [ ] finished inventory/loadout UI
- [ ] finished Shop UI
- [ ] finished map UI
- [ ] finished event UI
- [ ] one finished Floor environment
- [ ] combat VFX
- [ ] manipulation VFX
- [ ] reward VFX
- [ ] audio/SFX language
- [ ] music
- [ ] death/victory presentation

No placeholder visuals in the final review build.

---

## Acceptance criteria

The Vertical Slice is successful if:

1. a new player understands the core interaction during the first encounter;
2. safe and greedy dice commitments both feel rational in different circumstances;
3. the player can explain how their Spoils result affected the Loot Draft;
4. at least several Artifact combinations materially change how the same roll is evaluated;
5. Level progression is understandable without stealing attention from loot;
6. inventory limits create meaningful replacement decisions;
7. an Elite feels worth risking HP for because its reward is visibly better;
8. the player understands what Coins are for before the run ends;
9. monster Instinct is readable enough that enemies feel like opponents rather than random-number generators;
10. the boss feels authored and memorable;
11. the full Floor takes roughly 8–12 minutes;
12. restarting is immediate;
13. a player voluntarily starts another run.

The thirteenth criterion is the real one.