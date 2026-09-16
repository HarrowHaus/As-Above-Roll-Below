# As Above, Roll Below — Single-Screen Descent Spec

**Version:** 0.1  
**Status:** canonical presentation/run-flow amendment

AARB is not a map-navigation game with combat attached. It is a **continuous descent through discrete encounters**.

The player should spend nearly all run time on one persistent game surface. Combat, reward, Event, Shop, Technique, and Boss states replace or overlay parts of that surface rather than sending the player through a chain of navigation screens.

---

# 1. Core cadence

Baseline run cadence:

`Encounter → Resolution → Reward/Choice → DESCEND → Encounter → ... → Boss → Boss Draft → Floor transition`

There is **no mandatory visible run map** in the baseline game.

There is no separate "choose a level" interaction before each encounter.

The procedural engine determines the descent sequence from the run seed and Floor content rules. The player experiences the resulting sequence one Depth at a time.

If future content presents a route choice, it must appear **in place** as a direct choice such as two doors / two next encounter summaries. It does not require opening a separate map screen.

---

# 2. Vocabulary

## Run
One complete roguelite attempt.

## Floor
A macro biome/chapter/content package such as **Floor I — THRESHOLDS**.

A Floor owns:
- environment grammar;
- enemy pools;
- Elite pool;
- Event pool;
- Shop/content constraints;
- Boss pool;
- pressure curve;
- descent-generation rules.

## Depth
One discrete step within a Floor.

Examples:
- Depth 01 — Combat
- Depth 02 — Combat
- Depth 03 — Event
- Depth 04 — Elite
- Depth 05 — Shop
- Depth 06 — Combat
- Final Depth — Boss

"Depth" replaces visible map-node navigation as the primary run-progress language.

---

# 3. Single-screen rule

The main game should feel like **one machine changing state**, not a website changing pages.

One persistent shell owns:
- run header;
- player HP / Level / XP / Coins;
- Floor + Depth;
- encounter stage;
- dice decision area;
- build/tool access;
- bottom action zone.

The center/bottom portions transform according to state:

- COMBAT
- LOOT
- TECHNIQUE
- EVENT
- SHOP
- BOSS REWARD
- FLOOR TRANSITION
- RUN RESULT

Inventory/build inspection may use a drawer/overlay. It is not a required destination between encounters.

Pause/settings may be overlays.

---

# 4. Portrait-first layout

Portrait is a **first-class target**, not a fallback and not a rotate-device warning.

Reference design target: approximately 9:16 phone viewport.

## Top strip — persistent run state
Compact, thumb-independent information:
- Floor name / Depth;
- player HP;
- Level/XP;
- Coins;
- optional compact build button.

## Encounter stage — upper/middle
The largest visual field:
- environment module;
- enemy / boss art;
- enemy name + HP;
- enemy Rule/Instinct;
- enemy locked dice.

## Decision field — middle/lower
- four large player dice in one row when width permits;
- otherwise controlled 2×2 layout, never microscopic scaling;
- Fight/Spoils state visible by shape and treatment;
- Fight / Enemy / Margin / Spoils summary;
- manipulation tools contextually adjacent.

## Bottom action zone
Thumb-reachable:
- contextual manipulation controls;
- large COMMIT action;
- compact Contraband/active Artifact controls;
- no tiny desktop-style buttons.

Landscape is supported through responsive reflow, but portrait is not a squeezed landscape canvas.

---

# 5. Combat-to-loot transition

Victory should not throw the player to another "page."

Sequence:

1. final damaging win resolves;
2. Final-Blow Spoils pair remains visually connected to the result;
3. enemy/stage recedes or dims;
4. three Loot offers rise into the same screen;
5. player takes one / replaces one / skips where legal;
6. reward folds away;
7. descent transition;
8. next encounter enters.

The causal story should be visually obvious:

`these leftover dice → this reward quality → this build change`.

---

# 6. Descent transition

The transition between Depths should become part of the game's identity.

Possible production treatment:
- threshold/door closes;
- scene slides upward/downward;
- depth counter ticks down;
- short impossible-architecture transition;
- next room resolves from darkness.

Target duration: approximately 300–700ms after familiarity.

No walking avatar on a map is required.

---

# 7. Shops and Events

Shop/Event content occupies the same main shell.

## Event
The encounter stage becomes the event visual/premise. The lower decision field becomes 2–3 large choices.

## Shop
The encounter stage becomes merchant/counter/environment presentation. The lower field becomes seeded offers + healing.

Leaving either state triggers DESCEND immediately.

They should feel like rooms encountered during the descent, not menu destinations.

---

# 8. Techniques / Level gain

Ordinary level gain should be brief and mostly noninterruptive.

On a Technique Level:
- two Technique choices replace the lower decision field;
- player selects one;
- choice resolves;
- descent continues.

Do not create a generic level-selection screen before the run begins.

Character selection/title/new-run UX remains a separate later design problem and must not contaminate the in-run cadence.

---

# 9. Procedural generation presentation contract

Procedural generation remains expansive under the hood.

The engine may own generic graph/path tooling for validation, alternate modes, or future forks. The **baseline player-facing run does not expose that graph**.

Preferred production model:

`Master Seed → Floor Definition → Descent Sequence → Encounter Director → Encounter/Reward/Event/Shop contents`

Independent deterministic RNG streams remain required.

A generated descent must satisfy authored Floor constraints such as:
- opening combat;
- minimum combat count;
- maximum combat streak;
- Event presence/window;
- Shop presence/window;
- Elite count/window;
- pressure progression;
- Boss endpoint;
- duplicate suppression.

Random does not mean arbitrary.

---

# 10. Vertical-slice descent target

Exact count remains balance-tunable, but the vertical slice should test a **meaningful descent**, not four map clicks.

Current target envelope:
- 5–7 pre-boss Depths;
- at least 3 combat encounters;
- 1 Event;
- 1 Shop;
- 0–1 Elite;
- Boss endpoint.

The ordering is seed-driven inside Floor I constraints.

This count must be revalidated by shared-core simulation and human run time before LOCKED status.

---

# 11. Reference lessons

Useful structural references, not templates to copy:

- **Dungeons of Dreadrock:** strong floor-by-floor descent identity, little navigation downtime.
- **Slice & Dice:** fight-forward cadence where each victory flows into an item/level decision and then the next fight.
- **Meteorfall:** portrait-first mobile readability and one-handed interaction discipline.
- **Ring of Pain:** encounters come to the player; information and immediate decisions matter more than walking a character through connective space.

AARB remains mechanically its own game: enemy-first contested dice, Fight/Spoils tension, Final-Blow rewards, and loot-driven rule mutation.

---

# 12. Rejected baseline presentation

The following are no longer the primary run UX:

- persistent branching map screen between every room;
- "choose a node" as the default transition after a fight;
- fixed 1280×720 desktop canvas squeezed onto portrait phones;
- landscape-only mobile play;
- separate full-screen navigation for every Shop/Event/Loot/Technique state;
- avatar walking between encounter nodes merely to communicate progression.

These may survive only as debug tooling or future alternate-mode experiments.

---

# 13. Implementation consequence

The production client should converge toward one responsive **Run Scene / Run Shell**.

Phaser remains presentation only. The TypeScript core remains authoritative for:
- descent sequence;
- combat;
- rewards;
- inventory;
- Events;
- Shops;
- progression;
- deterministic RNG.

The refactor must preserve the shared-core rule rather than rebuilding gameplay inside a new portrait UI.