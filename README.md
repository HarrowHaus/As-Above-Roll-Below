# As Above, Roll Below

**As Above, Roll Below** is a solo browser dice roguelite in formal preproduction.

## Core interaction

1. Monster rolls first and locks according to visible Instinct.
2. Player rolls **4d6**.
3. Player may use build-granted manipulation.
4. Player commits exactly **2 Fight Dice**.
5. Remaining **2 dice are potential Spoils**.
6. Compare totals.
7. **Damage equals the winning margin.**

The same good die that keeps you alive is also the die you want to leave behind for better loot.

---

## Current production status

The project has moved past mechanics-toy iteration into formal preproduction and engine-definition work.

### Combat
Validated enough to treat contested rolls + margin damage as working canon.

### Run systems
Leveling, XP, Loot Drafts, Gear/Artifacts/Contraband, Coins, Shop, Elite/Boss rewards, route generation, item duplication rules, meta progression, timing windows, effect architecture, balance metrics, and UI information rules have implementation-facing specifications.

### Engine / procedural generation
`docs/ENGINE_VISION_AND_PROCGEN.md` defines the AARB engine direction:

- one deterministic TypeScript core shared by browser play and headless simulation;
- N-Floor support rather than a hard-coded four-Floor engine;
- constrained procedural Floor graphs;
- independent RNG streams;
- encounter, reward, event, Shop and environment generation;
- data-driven content/effects;
- seeded saves/replays/regression runs;
- Phaser as the current preferred browser presentation shell, not the owner of gameplay rules.

The current Python/HTML simulators remain reference implementations until the production core reproduces their approved behavior.

### Floor I content
`docs/VERTICAL_SLICE_CONTENT.md` contains the first full authored content pass for **Floor I — THRESHOLDS**:

- The Delver + Techniques
- 8 normal enemies
- 2 Elites
- The First Door boss
- 8 Gear
- 12 Artifacts
- 6 Contraband
- 3 Events
- Shop rules
- Boss Draft
- map/content constraints
- simulation questions

This content is ready for production-core encoding and continued validation, not yet declared balanced/final.

### World / research
The Below premise, provenance rules, humor/tone, original ecology, terminology, research candidate pool, and verified-reference workflow are established.

### Art
Pixel-first, dark-fun-creepy direction is active. Front-facing gameplay dice are canonical and the asset-production pipeline requires actual game-ready outputs rather than presentation art.

---

# Canonical design stack

Read approximately in this order.

## Foundation
- `docs/DECISION_LEDGER.md` — what is LOCKED / PROVISIONAL / DEFERRED / REJECTED.
- `docs/GAME_DESIGN_BIBLE.md` — overall design pillars and game promise.
- `docs/MASTER_SYSTEMS_SPEC.md` — authoritative baseline rules contract.
- `docs/COMBAT_MODEL.md` — contested-roll math and combat validation.

## Engine / systems
- `docs/ENGINE_VISION_AND_PROCGEN.md` — what the AARB engine owns, N-Floor procedural architecture, shared simulation/game core, renderer boundary.
- `docs/REFERENCE_GAME_RESEARCH.md` — comparative research across relevant roguelikes/dice/loot games.
- `docs/SYSTEMS_ARCHITECTURE.md` — leveling, Spoils, inventory, Shop and reward architecture.
- `docs/LOOT_AND_ECONOMY_SPEC.md` — exact Loot Draft generation, tier weights, shop prices, salvage and Elite/Boss reward rules.
- `docs/RUN_STRUCTURE_AND_GENERATION_SPEC.md` — Floor graph, route constraints, seeded generation, Events/Shops/Elites.
- `docs/BALANCE_AND_TELEMETRY_SPEC.md` — numerical targets, simulation policies and metrics.
- `docs/UI_UX_FLOW_SPEC.md` — screen/state flow and information contract.
- `docs/IMPLEMENTATION_ARCHITECTURE.md` — deterministic simulation modules, effect engine, schemas and tests.
- `docs/CONTENT_SCOPE_AND_AUTHORING_SPEC.md` — vertical-slice/full-game content targets and authoring order.

## Floor I authoring
- `docs/VERTICAL_SLICE_CONTENT.md` — authored Floor I rules/content pass ready for shared-core encoding and simulation.

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

> **The simulator and the shipping game must use the same deterministic rules core.**

---

# Next production sequence

1. Create the production TypeScript core package skeleton: deterministic RNG, content schemas/validation, IDs/tags/enums and tests.
2. Port Dice + Combat + Effect resolution into that core.
3. Encode Floor I content as validated data rather than special-case branches.
4. Implement run systems: inventory, Loot Drafts, XP/Levels, Coins, Shops and Events.
5. Implement the generic N-Floor procedural Run/Floor generator and validation constraints.
6. Recreate Safe / Balanced / Opportunist simulation policies against the production core.
7. Run thousands of seeded Floors and freeze regression seeds.
8. Tune Floor I numbers without changing the core architecture casually.
9. Produce only the runtime art/audio required by approved content.
10. Build the Phaser client shell as a presentation layer over the shared core.
11. Human playtest → balance → polish.

The next implementation is **not another exploratory toy**. It is the first production form of the AARB engine.