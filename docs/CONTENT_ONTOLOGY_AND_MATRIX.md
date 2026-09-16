# AARB — Content Ontology & Engine Test Matrix

Status: planning target, not a promise to manufacture every listed quantity before the vertical slice.

## Principle
We need enough authored content to prove the grammar before scaling the pool. THRESHOLDS content is selected to test engine vocabulary. After the grammar survives representative cases, content production can scale without redesigning the engine for every new object.

## Full-game directional pool targets
These are research/planning ranges to be validated for repetition and production cost.
- Enemy families: 20–30 strong authored families initially; variants/affixes expand encounter count.
- Elite identities/templates: 8–12 authored foundations plus explicitly compatible transformations.
- Bosses: 8–12 highly authored Bosses for initial major pool; more can be added as Regions expand.
- Gear bases: 20–30 authored bases/slots plus controlled generated effect recipes.
- Artifacts: 50–80 mostly authored build-defining objects eventually.
- Contraband: 15–25 authored consumables plus limited variants.
- Events: 30–50 authored templates eventually, with contextual deterministic variants.
- Regions: 6–10 long-term environment/content grammars, not 6–10 hard-coded levels.
- Characters: multiple authored Delver archetypes with their own Techniques/start states; exact count deferred.

## Enemy ontology
Each family eventually declares:
- `familyId`
- display/name grammar
- Region tags
- visual family + mutation sockets
- base HP/dice ranges
- legal Instincts
- authored signature rules
- legal affix tags / forbidden affix tags
- pressure range
- Elite eligibility
- reward bias if any
- tutorial/readability tier
- audio/VFX tells

## Affix ontology
Each affix declares:
- rule/action definitions from shared effect grammar
- pressure cost
- compatible enemy tags
- excluded rules/affixes
- maximum stack count
- player-facing rule sentence
- required visual tell
- required debug test

Candidate affix jobs to prototype, not final names:
1. manipulation-reactive;
2. tie-reactive;
3. Spoils-taxing;
4. lock-pattern altering;
5. round-escalating;
6. damage-conversion;
7. status-inflicting;
8. reward-risk modifier.

## Gear ontology
Generated Gear must remain readable and discrete.

### Base
Weapon / Armor / Utility plus authored physical identity and compatible effect families.

### Trigger vocabulary
- always while condition true
- first time per encounter
- once per encounter
- on win / loss / tie
- Margin exact/range
- doubles / opposites / total threshold
- after manipulation
- after taking damage
- after successful Spoils
- Shop/reward/run transition

### Target vocabulary
- selected Fight die/dice
- Spoils die/dice
- highest/lowest player die
- enemy locked die/dice
- player HP
- enemy HP
- Fight / Enemy Fight / Margin / Spoils
- Coins / reward band
- next cast / next encounter

### Action vocabulary
- BUMP
- FLIP
- COPY
- REROLL
- SET
- LOCK / FIX
- add/reduce Fight
- add/reduce Enemy Fight
- add/reduce damage
- add Spoils
- heal
- Coins
- carry die
- suppress/alter rule for bounded duration

### Cadence/cost
- passive
- once/round
- once/encounter
- N uses
- consume
- HP cost
- Coin cost
- downside paired with benefit

## Artifact ontology
Artifacts should generally have a memorable authored thesis. Every Artifact must answer: what does this make me evaluate differently? Avoid artifacts whose only identity is a generic numerical increase.

Artifact jobs:
- manipulation agency
- pattern incentives
- greed/Spoils incentives
- economy conversion
- round-to-round memory
- enemy-rule interference
- inventory/reward rule changes
- Region/run-rule changes (later tiers)

## Contraband ontology
Consumables provide emergency tactical exceptions. Their limited inventory is part of their power budget. Generated variants may alter charge/target/cost only if rules remain immediately legible.

## Boss ontology
Bosses declare authored phases/state machine, transition conditions, signature rule package, phase tells, reward contract, Region compatibility, and optional tightly controlled mode modifiers. HP is not required to be the only transition trigger once the engine supports alternatives.

## Region ontology
Each RegionDefinition eventually includes:
- ID/name/lore thesis
- depth-range preferences
- environment grammar
- enemy-family weights
- Elite/Boss pools
- Event pools
- Shop/economy flavor
- loot biases
- pacing constraints
- pressure curve
- rare-room pool
- Region modifiers
- naming/flavor lexicon
- music/audio grammar

## Representative engine tests before broad content production
THRESHOLDS or an adjacent test fixture should prove each of these at least once:

### Already substantially proven
- baseline enemy
- multiple Instincts
- tie effects
- FIXED dice
- manipulation reactions
- enemy die interference
- multi-phase HP Boss
- active die manipulation
- cross-round carried die
- reward pattern effects
- persistent inventory slots
- consumables
- deterministic Shops/Events
- seeded descent

### Next vocabulary tests
1. **Status system** — temporary player/enemy statuses with duration and visible explanation.
2. **Multi-enemy encounter** — shared/individual enemy dice and targeting contract.
3. **Conditional Boss phase** — transition not based only on HP.
4. **Encounter/environment rule** — rule belongs to the room/Depth, not enemy.
5. **Generated Gear v0** — small grammar produces readable legal Gear and exact rules text.
6. **Enemy affix v0** — one base family accepts multiple legal affixes without bespoke client code.
7. **Rare room** — deterministic rare Depth with special reward/risk contract.
8. **Region modifier** — Region-wide authored overlay that affects multiple encounters.
9. **Artifact-to-Artifact interaction** — effect references tags/rules rather than item IDs where possible.
10. **Alternative cost** — HP/Coins/consumption as explicit action cost.
11. **Summon/add** — only if multi-enemy proves worthwhile.
12. **Persistent curse/burden** — optional negative build object if it creates interesting decisions.

## Generation QA matrix
For each generated system we need tests for:
- deterministic reproduction;
- legality/compatibility;
- rule-text correctness;
- power budget distribution;
- duplicate/repetition rate;
- impossible interaction detection;
- UI fit at longest legal generated name/rule;
- debug-harness forceability;
- simulation performance;
- human sample audit.

## Content production order
1. Prove missing engine vocabulary with minimal representative content.
2. Freeze schemas/compatibility tags.
3. Build generator validators and telemetry.
4. Produce a medium pool and measure repetition.
5. Tune weighting/novelty memory.
6. Scale authored pool.
7. Add Regions as content packs over the same engine.

Do not jump directly from THRESHOLDS to authoring a second bespoke Region before the representative grammar tests above are complete.
