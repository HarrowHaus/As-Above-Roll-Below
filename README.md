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

The project has moved past mechanics-toy iteration into formal preproduction.

### Combat
Validated enough to treat contested rolls + margin damage as working canon.

### Run systems
Leveling, XP, Loot Drafts, Gear/Artifacts/Contraband, Coins, Shop, Elite/Boss rewards, route generation, item duplication rules, meta progression, timing windows, effect architecture, balance metrics, and UI information rules have implementation-facing specifications.

### Floor I content
`docs/VERTICAL_SLICE_CONTENT.md` now contains the first full authored content pass for **Floor I — THRESHOLDS**:

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

This content is ready for headless validation, not yet declared balanced/final.

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

## Systems research / progression
- `docs/REFERENCE_GAME_RESEARCH.md` — comparative research across relevant roguelikes/dice/loot games.
- `docs/SYSTEMS_ARCHITECTURE.md` — leveling, Spoils, inventory, Shop and reward architecture.
- `docs/LOOT_AND_ECONOMY_SPEC.md` — exact Loot Draft generation, tier weights, shop prices, salvage and Elite/Boss reward rules.
- `docs/RUN_STRUCTURE_AND_GENERATION_SPEC.md` — Floor graph, route constraints, seeded generation, Events/Shops/Elites.
- `docs/BALANCE_AND_TELEMETRY_SPEC.md` — numerical targets, simulation policies and metrics.
- `docs/UI_UX_FLOW_SPEC.md` — screen/state flow and information contract.
- `docs/IMPLEMENTATION_ARCHITECTURE.md` — deterministic simulation modules, effect engine, schemas and tests.
- `docs/CONTENT_SCOPE_AND_AUTHORING_SPEC.md` — vertical-slice/full-game content targets and authoring order.

## Floor I authoring
- `docs/VERTICAL_SLICE_CONTENT.md` — authored Floor I rules/content pass ready for simulation.

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

---

# Next production sequence

1. Encode the authored Floor I content into implementation-facing structured data.
2. Build the headless deterministic simulation/effect resolver subset needed by Floor I.
3. Simulate thousands of seeded Floors under Safe / Greedy / Balanced policies.
4. Tune enemy HP/dice, XP cadence, Loot-band frequencies, prices, healing, Elite value, and outlier items without changing the core architecture.
5. Freeze Floor I systems/content v1 after the simulation gate.
6. Produce only the runtime art/audio required by that approved content.
7. Implement the proper vertical slice.
8. Automated tests → human playtest → balance → polish.

The next implementation is **not another exploratory toy**. It is a vertical slice built from the written, simulated content/spec package.