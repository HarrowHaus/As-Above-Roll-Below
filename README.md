# As Above, Roll Below

**As Above, Roll Below** is a solo browser dice roguelite built around a deterministic shared-core engine and procedural Floor content packages.

## Core interaction

1. Monster rolls first and locks according to visible Instinct.
2. Player rolls **4d6**.
3. Player may use build-granted manipulation.
4. Player commits exactly **2 Fight Dice**.
5. Remaining **2 dice are potential Spoils**.
6. Compare totals.
7. **Damage equals the winning margin.**
8. **Final-Blow Spoils** determines encounter reward quality.

The same good die that keeps you alive is also the die you want to leave behind for better loot.

---

# Current production status

The project has moved through systems preproduction, deterministic engine construction, shared-core simulation, and into a **playable Phaser Floor I run shell**.

## Shared production core

`engine/core/` is the authoritative TypeScript rules engine used by both browser play and headless simulation.

It currently owns:

- seeded named RNG streams;
- dice and physical d6 transformations;
- contested combat and persistent HP;
- effect timing/resolution;
- enemy Instincts;
- player-cast constraints;
- manipulation reactions;
- active item actions;
- Gear / Artifact / Contraband inventory;
- XP / Levels / Technique gates;
- Coins and healing economy;
- Loot Draft generation;
- Boss Draft generation;
- Shop stock;
- Events;
- Encounter Director selection;
- constrained procedural Floor graphs;
- generic N-Floor RunState and route legality.

There is no separate browser-game combat implementation. The client consumes this core.

## Headless simulation

`engine/sim/` imports the compiled production core rather than reimplementing the rules.

CI runs a **3,000-Floor regression** on every relevant engine change: 1,000 seeds each for Safe, Opportunist, and diagnostic Greedy policies.

The full-item E6 gate preserved the intended reward/risk shape. Opportunist raw Final-Blow Band IV landed at approximately **11.9%**, inside the provisional 5–15% target, while Greedy achieved more premium loot at materially higher damage and much lower clear rate.

Architecture and Final-Blow Spoils are stable enough to build against. Exact human-facing balance remains provisional until playtesting.

## Phaser browser client

`engine/client/` is a Phaser 4 / Vite / TypeScript presentation layer over the same core.

The current playable Floor I shell contains:

- procedural Map;
- Combat / Elite / Boss rooms;
- Events;
- seeded Shop;
- Loot Draft;
- inventory replacement + salvage;
- XP / Levels;
- Level 3 Technique choice;
- Boss Draft;
- run victory/death;
- active Artifact controls;
- combat Contraband;
- Emergency Key outside combat;
- Ash Ledger;
- Small Change Purse;
- Receipt From Nowhere;
- Brass Caliper;
- Stuck Key carry-forward choice;
- Talking Board encounter reveal;
- production front-facing Dice V1 atlas.

See `docs/E7_CLIENT_STATUS.md` for the exact implementation boundary.

## Floor I content

`docs/VERTICAL_SLICE_CONTENT.md` contains the authored first content package, **Floor I — THRESHOLDS**:

- The Delver + Techniques;
- 8 normal enemies;
- 2 Elites;
- The First Door boss;
- 8 Gear;
- 12 Artifacts;
- 6 Contraband;
- 3 Events;
- Shop;
- Boss Draft;
- procedural map/content constraints.

The content is encoded far enough to run through the shared engine. Numbers remain playtest-tunable.

## Art

Pixel-first, dark-fun-creepy direction is active. Front-facing gameplay dice are canonical and already integrated.

Character sprites, enemy sprites, modular Floor I environments, final UI frames, animation, VFX, SFX and music are still intentionally behind placeholder presentation. The existing vector combatants are not a new art direction; they are systems-playtest stand-ins.

---

# Canonical design stack

Read approximately in this order.

## Foundation
- `docs/DECISION_LEDGER.md` — LOCKED / PROVISIONAL / DEFERRED / REJECTED decisions.
- `docs/GAME_DESIGN_BIBLE.md` — overall design pillars and promise.
- `docs/MASTER_SYSTEMS_SPEC.md` — authoritative baseline rules contract.
- `docs/COMBAT_MODEL.md` — contested-roll math and combat validation.

## Engine / systems
- `docs/ENGINE_VISION_AND_PROCGEN.md` — AARB engine ownership, N-Floor procedural architecture and renderer boundary.
- `docs/REFERENCE_GAME_RESEARCH.md` — comparative systems research.
- `docs/SYSTEMS_ARCHITECTURE.md` — Leveling, Spoils, inventory, Shop and reward architecture.
- `docs/LOOT_AND_ECONOMY_SPEC.md` — Loot Draft, tier weights, Shop, salvage, Elite/Boss rewards.
- `docs/RUN_STRUCTURE_AND_GENERATION_SPEC.md` — Floor graph and route constraints.
- `docs/BALANCE_AND_TELEMETRY_SPEC.md` — simulation targets and policy metrics.
- `docs/UI_UX_FLOW_SPEC.md` — screen/state flow and information contract.
- `docs/IMPLEMENTATION_ARCHITECTURE.md` — deterministic modules, effect engine and schemas.
- `docs/CONTENT_SCOPE_AND_AUTHORING_SPEC.md` — vertical-slice/full-game content scope.
- `docs/E7_CLIENT_STATUS.md` — current playable implementation boundary and next gate.

## Floor I authoring
- `docs/VERTICAL_SLICE_CONTENT.md`

## World / content research
- `docs/CONTENT_RESEARCH_BIBLE.md`
- `docs/DICE_LORE.md`
- `docs/BELOW_ECOLOGY.md`
- `docs/TERMINOLOGY.md`
- `docs/research/CORPUS_INVENTORY.md`
- `docs/research/REFERENCE_CANDIDATES_001.md`
- `docs/research/verified/`

## Art / production
- `docs/ART_BIBLE.md`
- `docs/DICE_DESIGN_BIBLE.md`
- `docs/ASSET_PRODUCTION_SPEC.md`
- `docs/VERTICAL_SLICE_ASSET_MANIFEST.md`

---

# Design rules worth remembering

> **ROLL FOUR. COMMIT TWO. WHAT REMAINS MAY BECOME YOURS.**

> **Levels keep you alive. Loot makes you weird.**

> **The Below preserves versions. It does not certify them.**

> **If an art asset cannot be isolated, cleaned, exported and used in the browser game, it is concept art—not production art.**

> **The simulator and the shipping game use the same deterministic rules core.**

---

# Production sequence

Completed foundation:

- [x] production TypeScript core;
- [x] deterministic RNG / dice / combat;
- [x] data-driven effect resolver;
- [x] inventory / Loot / XP / economy / Shops / Events;
- [x] generic N-Floor procedural Run/Floor generation;
- [x] Floor I content encoding;
- [x] shared-core headless simulator;
- [x] thousands of seeded regression Floors;
- [x] Phaser 4 browser client shell;
- [x] playable Floor I systems loop;
- [x] active Floor I item interactions and Boss Draft flow.

Next gate:

1. human-playtest the real Floor I shell;
2. log UX friction, degenerate choices and actual difficulty failures;
3. change rules only where evidence requires it;
4. produce the minimal production Floor I character/enemy/environment/UI asset pack;
5. replace placeholder presentation;
6. add animation, VFX, audio and game-feel feedback;
7. repeat human playtest + telemetry;
8. then author additional Floor packages on top of the same engine.

The project is no longer an exploratory mechanics toy. The current code is the production form of the AARB engine and its first playable content package.
