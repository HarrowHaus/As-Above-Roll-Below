# As Above, Roll Below — Engine Vision & Procedural Generation Architecture

**Version:** 0.1  
**Status:** implementation-direction canon  
**Purpose:** define what “our own engine” means, how procedural Floors scale, and how simulation, shipping gameplay, content authoring and rendering share one source of truth.

---

# 1. THE DECISION

**As Above, Roll Below should have its own game engine layer.**

It should **not** build its own browser renderer, audio mixer, input stack, texture manager or animation runtime from scratch.

The project owns the parts that make AARB unique:

- deterministic rules simulation;
- dice operations;
- effect timing/resolution;
- procedural Floor/run generation;
- encounter selection;
- Loot Draft generation;
- item/economy/progression systems;
- authored content schemas;
- seeded replay/save behavior;
- simulation/balance tooling;
- procedural environment assembly rules.

A mature browser framework should handle commodity platform work:

- WebGL/WebGPU rendering;
- sprite/atlas display;
- animation playback;
- input normalization;
- cameras;
- audio playback;
- asset loading/cache;
- browser lifecycle.

Current preferred shell: **Phaser** because AARB is a 2D browser game and Phaser already supplies the broad platform services above. PixiJS remains viable if later we deliberately choose a thinner renderer and accept owning more application scaffolding.

The renderer is replaceable. The AARB engine is not.

---

# 2. WHAT EXISTS NOW VS WHAT DOES NOT

## Already preproduced

The repo now defines:

- combat state/timing;
- dice verbs;
- effect conditions/actions;
- Loot/economy rules;
- Player Level/XP;
- inventory limits;
- seeded run requirements;
- Floor graph constraints;
- enemy/Elite/Boss schemas;
- Events/Shops;
- deterministic RNG requirements;
- balance/telemetry requirements;
- content-authoring requirements.

The Python/HTML prototypes and simulation passes are **reference implementations and design probes**.

They prove rules and expose balance failures.

They are not the shipping engine.

## Not yet built

The production TypeScript core does not yet exist as a canonical package.

That is the next engineering gate.

---

# 3. CORE ARCHITECTURE

Recommended repository-level architecture:

```text
src/
  core/
    rng/
    dice/
    effects/
    combat/
    inventory/
    rewards/
    economy/
    progression/
    events/
    save/
    trace/

  procgen/
    run/
    floors/
    graph/
    encounters/
    shops/
    events/
    environment/
    validation/

  content/
    schemas/
    characters/
    gear/
    artifacts/
    contraband/
    enemies/
    bosses/
    events/
    floors/
    environments/

  simulation/
    policies/
    batch/
    regression/
    reports/

  client/
    phaser/
    scenes/
    presentation/
    input/
    audio/
    accessibility/

  tools/
    validate-content/
    validate-assets/
    seed-inspector/
    content-browser/
```

Names may change. Separation may not casually collapse.

---

# 4. THE SINGLE-SOURCE-OF-TRUTH RULE

The shipping browser game and headless simulations must call the **same deterministic game core**.

Bad architecture:

- Python simulator approximates rules;
- JavaScript browser game reimplements them;
- balance results slowly diverge from actual play.

Required architecture:

```text
                  ┌───────────────────┐
                  │   Authored Data   │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │     AARB Core     │
                  │ deterministic TS  │
                  └──────┬─────┬──────┘
                         │     │
               ┌─────────▼─┐ ┌─▼──────────┐
               │ Simulator │ │ Game Client │
               │ headless  │ │ Phaser/UI   │
               └───────────┘ └─────────────┘
```

Simulation policies are artificial players operating the exact same legal-action API a human UI uses.

---

# 5. THE ENGINE MUST SUPPORT N FLOORS

Release scope may target four curated Floors.

**The engine must not contain `if floor === 4` assumptions.**

A Run is an ordered list of `FloorDefinition` records.

A game mode may define:

- 1-Floor vertical slice;
- standard 4-Floor run;
- endless/descent mode later;
- Daily run with selected Floor sequence;
- challenge run;
- future expansion Floor packs.

Floor count belongs to content/mode configuration, not core combat code.

---

# 6. FLOOR DEFINITION

Every Floor is a procedural grammar, not a handmade sequence.

Conceptual schema:

```ts
interface FloorDefinition {
  id: string;
  themeTags: string[];
  rowCount: number;
  widthRange: [number, number];
  roomTypeWeights: WeightedTable<RoomType>;
  requiredOpportunities: Constraint[];
  forbiddenPatterns: Constraint[];
  encounterPools: EncounterPool[];
  elitePools: EncounterPool[];
  eventPool: string[];
  shopRules: ShopRules;
  bossPool: string[];
  pressureCurve: number[];
  environmentGrammar: string;
  rewardModifiers?: EffectDefinition[];
}
```

A Floor definition says **what kinds of valid Floors may exist**, not exactly which nodes appear.

---

# 7. HIERARCHICAL PROCEDURAL GENERATION

A run should generate from large structure to small detail.

## Stage 1 — Run plan

Inputs:

- master seed;
- character;
- mode;
- difficulty/modifier package;
- unlocked content pool.

Outputs:

- Floor sequence;
- boss candidates/fixed bosses where required;
- independent RNG streams.

## Stage 2 — Floor graph

Generator produces:

- rows;
- nodes;
- edges;
- room categories;
- route alternatives.

Then a validator rejects graphs that violate Floor rules.

## Stage 3 — Room manifests

Each node receives a stable manifest:

- node ID;
- room type;
- content seed;
- encounter/event/shop ID or deferred-generation contract;
- reward metadata;
- environment grammar seed.

## Stage 4 — Encounter assembly

Combat nodes receive:

- enemy identity;
- pressure tier;
- encounter modifiers where allowed;
- environment variant tags;
- reward modifiers.

The generator may prevent repetition and invalid combinations.

It may **not counterpick the player's exact build**.

## Stage 5 — Environment assembly

Presentation layer uses the room's environment manifest to assemble:

- backdrop layers;
- architecture modules;
- props;
- lighting profile;
- threshold/door variant;
- decals/details;
- ambience/audio bed.

Visual randomness cannot change combat RNG.

---

# 8. PROCEDURAL DOES NOT MEAN UNCONSTRAINED RANDOM

The generator operates inside authored rules.

The Spelunky-style lesson relevant to AARB is that procedural content becomes compelling when simple authored pieces are combined by strong constraints and then validated, rather than when everything is independently randomized.

AARB procedural generation therefore uses:

- **pools** — what content is eligible;
- **weights** — what is common/rare;
- **constraints** — what must/must not happen;
- **history** — what has already appeared;
- **pressure curves** — how difficulty evolves;
- **tags** — what content can combine;
- **validators** — reject broken/boring generated layouts;
- **seed determinism** — reproduce everything.

---

# 9. MAP GENERATION IS ONLY ONE PROCEDURAL LAYER

AARB's procedural engine should eventually generate variance at several levels.

## Run layer
- Floor order where mode permits;
- global modifiers;
- unlock pool.

## Floor layer
- route graph;
- room categories;
- Elite/Shop/Event opportunities.

## Encounter layer
- enemy selection;
- enemy variants/modifiers when content supports them;
- encounter environment.

## Reward layer
- Loot category;
- item tier;
- offer identities;
- Shop inventory;
- Event outcomes.

## Presentation layer
- environment modules;
- prop layouts;
- background variations;
- ambient effects;
- non-gameplay microvariation.

All these derive from independent named RNG streams.

---

# 10. RNG STREAM ARCHITECTURE

One master seed derives independent streams.

Baseline streams:

- `run`
- `map`
- `encounter`
- `combat_enemy`
- `combat_player`
- `loot`
- `shop`
- `event`
- `boss`
- `environment`
- `cosmetic`

Changing a torch flicker must never change the player's next d6 roll.

Changing UI animation timing must never change the next Loot Draft.

Streams must serialize with save state.

---

# 11. CONTENT IS DATA, NOT CODE BRANCHES

Expansion depends on this rule.

Adding:

- Enemy 43;
- Artifact 61;
- Floor V;
- Event 35;
- a new boss;

should primarily mean adding validated definitions that compose existing engine verbs.

The engine exposes reusable primitives:

- conditions;
- timings;
- effects;
- dice operations;
- statuses;
- reward modifiers;
- encounter modifiers;
- generation constraints.

Bespoke code is reserved for mechanics that truly introduce a new primitive.

---

# 12. FLOOR PACKS

The content architecture should make each Floor resemble an installable package.

Example:

```text
content/floors/thresholds/
  floor.json
  encounter-pool.json
  elite-pool.json
  events.json
  boss-pool.json
  environment-grammar.json
  localization.json
```

Future Floors can then add new content without rewriting the generator.

The same structure naturally supports expansions and challenge packs.

---

# 13. PROCEDURAL ENVIRONMENT GRAMMAR

We should not paint one background per encounter.

Each Floor defines modular visual vocabularies.

For THRESHOLDS, examples include:

- frame type;
- wall/arch module;
- floor module;
- passage depth;
- door/closure module;
- seal/registration layer;
- institutional prop set;
- debris set;
- lighting family;
- Below-native seam layer;
- rare motif slots.

A room manifest may say conceptually:

```json
{
  "layout": "narrow_threshold",
  "structure": ["stone_arch_02", "metal_frame_01"],
  "closure": "none",
  "props": ["signage_03", "chain_01"],
  "light": "cold_back_warm_threshold",
  "anomaly": "seam_growth_02"
}
```

The renderer assembles those modules. Combat does not care.

---

# 14. ENCOUNTER DIRECTOR

The Encounter Director selects from authored content using:

- Floor eligibility;
- pressure band;
- prior encounter history;
- Instinct diversity;
- tutorial eligibility;
- mode/difficulty;
- special run modifiers.

It does **not** inspect the exact player build and manufacture counters.

Its job is variation and pacing, not cheating.

---

# 15. PRESSURE CURVES

Difficulty across a Floor should be generated through authored pressure targets rather than arbitrary stat scaling.

Example conceptual Floor curve:

```text
Row 1: P1–P2
Row 2: P2
Row 3: P2–P4 optional
Row 4: P2–P4 optional
Boss: P5 authored
```

Later Floors change:

- eligible enemy rules;
- dice profiles;
- Elite availability;
- encounter combinations;
- event consequences;
- economy pressure.

Do not solve progression mainly by multiplying HP.

---

# 16. GENERATION VALIDATION

Every generated Floor is tested before being accepted.

Validation examples:

- Boss reachable;
- no dead ends;
- minimum route divergence;
- required Shop opportunity exists;
- required Event opportunity exists;
- Elite never mandatory where forbidden;
- combat-count bounds;
- no forbidden room streak;
- no immediate duplicate enemy;
- tactical problem diversity threshold;
- no unavailable content IDs;
- Shop/Loot pools nonempty.

If invalid, regenerate deterministically using an attempt/subseed counter.

---

# 17. SIMULATION IS PART OF THE ENGINE

Batch simulation is not a disposable design script.

The production core should support:

```ts
simulateRun({
  seed,
  character,
  mode,
  policy
})
```

Policies interact through the same action queries exposed to the UI:

- list legal manipulations;
- preview commit;
- commit pair;
- choose route;
- choose loot;
- replace item;
- buy;
- choose Event option.

Required outputs:

- run summary;
- per-encounter metrics;
- reward distribution;
- item triggers;
- HP/economy trajectory;
- map/route trace;
- seed.

The simulator is therefore a **client of the engine**, exactly like the graphical game client.

---

# 18. SAVE / REPLAY / DEBUG BENEFIT

The same deterministic architecture enables:

- exact save/resume;
- reproducible bug reports;
- shareable seeds;
- Daily Runs;
- automated regression seeds;
- turn-by-turn debug traces;
- replay/spectator systems later if desired.

A bug report can eventually include:

```text
Seed: 6B9E-14A2
Floor: thresholds
Node: F1-R3-N2
Round: 4
Action: commit dice #2 + #4
```

and reproduce the state exactly.

---

# 19. RENDERER / CLIENT RECOMMENDATION

Current recommendation:

## Core
**TypeScript with no Phaser/Pixi dependency.**

It must run in:

- browser;
- Node/headless test process;
- simulation CLI.

## Client shell
**Phaser** is the current preferred candidate.

Why:

- browser-first 2D framework;
- renderer already solved;
- scenes;
- input;
- animation;
- audio;
- asset cache/loading;
- cameras;
- mature ecosystem.

AARB should use Phaser as platform infrastructure, not as a place to bury game rules inside Scene callbacks.

## Rendering alternative
PixiJS remains attractive if we later decide Phaser's application model is unnecessary overhead. Pixi primarily solves rendering, so choosing it intentionally means owning more scene/input/audio/application structure ourselves.

Do not decide the game architecture based on which renderer makes the first demo easiest.

---

# 20. ROT.JS / GENERIC ROGUELIKE LIBRARIES

rot.js is useful research/reference and may be useful for specific algorithms such as RNG/path/graph work.

AARB should **not** delegate its Floor grammar wholesale to a generic dungeon generator because:

- our primary map is a constrained node graph, not a tile maze;
- reward/economy opportunities are part of topology;
- Elite risk placement matters;
- route diversity is gameplay;
- encounter history and content tags matter.

Use generic algorithms where they help. Own the procedural design grammar.

---

# 21. CURRENT SIMULATION WORK — KEEP OR ABANDON?

**Keep it, but change its role.**

What the current simulations have already accomplished:

- validated the core combat pressure envelope;
- exposed Best Successful Spoils reward inflation;
- exposed a weak Elite configuration;
- exposed a soft boss phase;
- tested policy differences;
- forced telemetry definitions.

What changes now:

1. stop expanding the notebook/Python simulator into a parallel game engine;
2. use its findings to finalize the first engine contracts;
3. implement the production deterministic TypeScript core;
4. port the Floor I content into validated engine data;
5. recreate Safe/Balanced/Opportunist policies against the real core;
6. rerun regressions;
7. accept future balance results only from the shared production rules core.

The current simulator becomes a reference oracle/regression comparison during the port, then is retired from authority.

---

# 22. NEXT ENGINEERING MILESTONES

## E0 — Core package skeleton

- TypeScript project;
- deterministic RNG;
- content loader/validator;
- IDs/tags/enums;
- test runner.

## E1 — Dice + Combat core

- d6 instance model;
- Instinct locking;
- BUMP/FLIP/COPY/TRANSMUTE/REROLL/LOCK;
- commit preview;
- margin damage;
- Spoils;
- events/log.

## E2 — Effect engine

- timing windows;
- conditions;
- actions;
- usage limits;
- deterministic priorities;
- Floor I Gear/Artifacts/Contraband.

## E3 — Run systems

- HP/XP/Levels;
- inventory;
- Loot Draft;
- Coins;
- Shop;
- Events.

## E4 — Procedural run generator

- generic N-Floor run definitions;
- Floor graph generator;
- constraints/validation;
- Encounter Director;
- independent RNG streams.

## E5 — Headless simulator

- Safe policy;
- Opportunist/Balanced policy;
- Greedy diagnostic policy;
- thousands of seeds;
- reports;
- fixed regression seed corpus.

## E6 — Client shell

- Phaser boot;
- scene/presentation adapter;
- combat UI consumes core events;
- map UI consumes generated graph;
- no duplicated mechanics.

## E7 — Environment procedural assembly

- Floor I grammar;
- module manifests;
- room visual seeds;
- parallax/prop/light assembly.

Only after E0–E5 should full vertical-slice implementation accelerate.

---

# 23. ACCEPTANCE TEST FOR “OUR ENGINE”

We can accurately say AARB has its own engine when:

1. a headless Node process can generate and complete a seeded run without Phaser;
2. the browser client can play the same seed using the same core package;
3. identical decisions produce identical gameplay results;
4. a new Floor can be added through definitions/pools/grammar without editing combat code;
5. a new ordinary item can usually be authored without bespoke code;
6. thousands of runs can be simulated without rendering;
7. saves serialize the entire authoritative state and RNG streams;
8. visual generation can vary without perturbing combat/reward RNG.

That is the engine we should build.
