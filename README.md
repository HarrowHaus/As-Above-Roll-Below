# As Above, Roll Below

**As Above, Roll Below** is a solo browser dice roguelite in preproduction.

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
Leveling, XP, Loot Drafts, Gear/Artifacts/Contraband, Coins, Shop, Elite/Boss rewards, route generation, item duplication rules, and meta progression now have implementation-facing specifications.

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

## Next authoring gate
- `docs/VERTICAL_SLICE_CONTENT.md` — now needs to be populated with the actual Floor I rules/content using the locked systems above.

---

# Design rules worth remembering

> **ROLL FOUR. COMMIT TWO. WHAT REMAINS MAY BECOME YOURS.**

> **Levels keep you alive. Loot makes you weird.**

> **The Below preserves versions. It does not certify them.**

> **If an art asset cannot be isolated, cleaned, exported and used in the browser game, it is concept art—not production art.**

---

# Next production sequence

1. Populate `VERTICAL_SLICE_CONTENT.md` with actual Floor I content and numbers.
2. Author the first complete item/effect data set against `IMPLEMENTATION_ARCHITECTURE.md`.
3. Run headless simulations across thousands of seeds and strategy policies.
4. Adjust Floor I numbers/economy without changing the core architecture.
5. Produce the minimal runtime art/audio pack required by the approved Floor I content.
6. Implement the proper vertical slice.
7. Automated tests → playtest → balance → polish.

The next implementation is not another exploratory toy. It should be built from the written content/spec package.