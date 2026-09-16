# Vertical Slice Content Sheet

**Status:** D-stage scaffold. Populate only after A/B/C agree.

## Goal

Produce one complete 8–12 minute Floor at finished-game quality.

This is not a mechanics demo and not a miniature promise of every release feature. It is the smallest complete piece of **As Above, Roll Below** that can answer:

> If the entire game were finished to this standard, would somebody want to buy and immediately replay it?

---

## Required playable content

### Player
- Character 01
- starting Gear
- defining ability
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
- reward weighting
- source/provenance record where relevant
- art requirement
- animation requirement
- SFX requirement

### Elites
- Elite 01
- Elite 02

Each requires authored pressure beyond simply more HP.

### Boss
- Boss 01

Requires:
- custom dice engine
- HP
- phases/behavior states
- authored mechanics
- reward
- source/provenance if applicable
- full visual-development sheet
- phase-transition presentation

---

## Build content

### Artifacts — 12
Each entry must contain:
- name
- rarity/tier
- exact mechanical text
- trigger timing
- dice verbs used
- synergy tags
- stacking behavior
- source/provenance if relevant
- art brief

### Gear — 8
Target distribution across Weapon / Armor / Utility.

### Contraband — 6
Single-use tactical effects. Must be useful in a visible combat state rather than generic filler.

---

## World/route content

### Events — 3
Each event needs:
- premise
- 2–3 choices
- exact outcomes
- source/provenance if relevant
- art/environment requirement

### Shop
Specify:
- inventory slot composition
- price bands
- healing service
- reroll/refresh rules if any
- presentation

### Map generation
Specify:
- number of node rows
- route branching
- guaranteed room types
- elite probability
- shop placement constraints
- event placement constraints
- boss endpoint

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
- [ ] monster pre-roll
- [ ] visible Instinct locking
- [ ] player 4d6 roll
- [ ] dice selection
- [ ] manipulation verbs
- [ ] predicted margin display
- [ ] margin damage
- [ ] HP
- [ ] Spoils capture
- [ ] reward draft
- [ ] Gear inventory
- [ ] Artifact inventory
- [ ] Contraband inventory
- [ ] Coins
- [ ] Shop
- [ ] Events
- [ ] Elite encounter
- [ ] Boss encounter
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
- [ ] finished dice
- [ ] finished combat UI
- [ ] finished map UI
- [ ] finished shop/event UI
- [ ] one finished Floor environment
- [ ] combat VFX
- [ ] manipulation VFX
- [ ] audio/SFX language
- [ ] music
- [ ] death/victory presentation

No placeholder visuals in the final review build.

---

## Acceptance criteria

The Vertical Slice is successful if:

1. a new player understands the core interaction during the first encounter;
2. safe and greedy dice commitments both feel rational in different circumstances;
3. at least several Artifact combinations materially change how the same roll is evaluated;
4. monster Instinct is readable enough that enemies feel like opponents rather than random-number generators;
5. the boss feels authored and memorable;
6. the full Floor takes roughly 8–12 minutes;
7. restarting is immediate;
8. a player voluntarily starts another run.

The eighth criterion is the real one.
