# As Above, Roll Below — Implementation Architecture

**Version:** 0.1  
**Status:** implementation-facing preproduction contract

This document defines software responsibilities. It is intentionally engine/framework-agnostic enough to survive a later renderer decision.

---

# 1. Architectural rule

Game rules must run in a deterministic simulation layer independent from rendering/animation.

UI requests actions from simulation.

Simulation returns authoritative state/events.

Rendering never decides gameplay results.

This allows:

- deterministic seeds;
- fast Monte Carlo balance simulations;
- unit testing without a browser canvas;
- save/resume;
- replay/debug traces;
- multiple presentation layers later.

---

# 2. Major modules

## ContentRegistry
Loads/validates all authored content definitions.

Owns:

- characters
- Techniques
- Gear
- Artifacts
- Contraband
- statuses
- enemies
- bosses
- Events
- shops/services
- Floor pools
- localization keys

No gameplay module hard-codes an item by display name.

## RNGService
Owns independent deterministic streams.

Methods/concepts:

- `deriveStream(masterSeed, streamName)`
- `nextInt(stream, min, max)`
- `choice(stream, weightedPool)`
- `shuffle(stream, list)`
- serialize/restore stream state

Streams defined in RUN_STRUCTURE_AND_GENERATION_SPEC.md.

## RunController
Top-level run state machine.

Responsibilities:

- start run
- select character
- initialize seed/streams
- generate Floors
- move between nodes
- start/end encounters
- apply rewards
- trigger Level changes
- transition Floors
- death/victory
- run summary

RunController orchestrates modules but does not implement combat math or item effects directly.

## MapGenerator
Creates constrained Floor graph.

Inputs:

- Floor index
- mode/difficulty
- map RNG
- Floor rules

Outputs:

- nodes
- edges
- node categories
- content seeds/IDs where generation timing requires them

Must expose validation diagnostics.

## EncounterDirector
Selects enemy encounter from eligible content pool.

Inputs:

- Floor
- node type
- history
- difficulty
- encounter RNG

Does not counterpick player's exact build.

## CombatEngine
Authoritative combat state machine.

Responsibilities:

- enemy cast/lock
- player cast
- legal manipulation queries
- commitment validation
- Fight calculation
- margin resolution
- damage
- Spoils qualification
- status durations
- round transitions
- victory/death

CombatEngine emits structured events instead of playing animations.

## DiceEngine
Utility/system layer for dice operations.

Operations:

- roll d6
- BUMP
- FLIP
- LOCK
- COPY
- TRANSMUTE
- MARK
- REROLL
- value validation
- opposite lookup
- persistent die state

Every die instance has stable runtime ID during its lifetime.

## EffectResolver
Central rule-composition engine.

Responsibilities:

- register active effects from character/Techniques/Gear/Artifacts/statuses/enemy
- gather effects for timing window
- evaluate conditions
- validate target
- apply actions in deterministic priority order
- produce effect log

Item definitions should primarily be data passed through EffectResolver rather than bespoke code.

## InventoryManager
Owns:

- Gear slots
- Artifact slots
- Contraband slots
- replacement
- duplicate rules
- salvage
- use/consume Contraband

Does not generate Loot.

## RewardGenerator
Owns Loot Draft creation.

Inputs:

- Spoils Score
- encounter tier/modifiers
- Floor
- owned IDs
- unlock pool
- reward RNG

Outputs 3 valid offers plus metadata explaining band/tier/category generation for debug.

## EconomyManager
Owns:

- Coins
- prices
- purchases
- healing service
- salvage
- skip-draft reward
- future reroll cost if enabled

## ProgressionManager
Owns run-only Level/XP and character Techniques.

Responsibilities:

- grant XP
- threshold detection
- Max HP change
- level heal
- Technique-choice eligibility

Meta unlocks belong to MetaProgressionManager, not ProgressionManager.

## ShopGenerator / ShopManager
Generator produces fixed seeded stock.

Manager handles:

- purchases
- affordability
- service use
- future reroll/lock mechanics if enabled

## EventResolver
Loads Event definition, determines visible choices based on run state/tags, resolves chosen outcome through EffectResolver/Economy/Inventory/HP APIs.

## MetaProgressionManager
Owns between-run unlock state.

No combat simulation reads hidden meta bonuses because baseline metaprogression is horizontal.

## SaveManager
Serializes authoritative run state and RNG streams.

No save contains renderer-only animation state unless needed for presentation restore.

## Analytics / DebugTrace
Records gameplay events for balance and debugging.

Must be removable/disableable for production privacy requirements while preserving local debug tooling.

---

# 3. Run state machine

Top-level states:

- `TITLE`
- `CHARACTER_SELECT`
- `RUN_MAP`
- `ENTER_ROOM`
- `COMBAT`
- `LOOT_DRAFT`
- `LEVEL_UP`
- `SHOP`
- `EVENT`
- `BOSS_REWARD`
- `FLOOR_TRANSITION`
- `RUN_DEATH`
- `RUN_VICTORY`
- `PAUSED`

Only legal transitions should be represented.

Examples:

`RUN_MAP -> ENTER_ROOM -> COMBAT -> LOOT_DRAFT -> LEVEL_UP? -> RUN_MAP`

`RUN_MAP -> ENTER_ROOM -> SHOP -> RUN_MAP`

`COMBAT -> RUN_DEATH`

---

# 4. Combat state machine

States/timing:

- `ENCOUNTER_START`
- `ENEMY_CAST`
- `ENEMY_LOCK`
- `PLAYER_CAST`
- `PLAYER_MANIPULATE`
- `PLAYER_COMMIT_PREVIEW`
- `PLAYER_COMMIT_CONFIRMED`
- `COMPARE`
- `DAMAGE_RESOLUTION`
- `SPOILS_RESOLUTION`
- `ROUND_END`
- `ENCOUNTER_VICTORY`
- `ENCOUNTER_DEFEAT`

UI can animate between simulation events, but cannot skip or reorder simulation timing windows.

---

# 5. Effect data model

Every effect record contains:

- `id`
- `timing`
- `priority`
- `scope`
- `condition`
- `target`
- `actions[]`
- `uses`
- `duration`
- `stacking`
- `ui_preview_policy`
- optional tags

Example conceptual Artifact effect:

```json
{
  "timing": "SPOILS_MODIFICATION",
  "priority": 100,
  "condition": {"type":"spoils_doubles"},
  "target": {"type":"spoils_score"},
  "actions": [{"type":"add", "value":2}],
  "uses": {"per":"unlimited"},
  "stacking":"unique"
}
```

No content text should be parsed to determine mechanics.

---

# 6. Conditions vocabulary

Initial reusable condition operators:

- always
- first_time_per_encounter
- once_per_floor_available
- player_die_value
- player_pair_doubles
- player_pair_consecutive
- player_pair_same_parity
- raw_fight_exact
- raw_fight_at_least
- final_margin_exact
- final_margin_at_least
- outcome_win / loss / tie
- spoils_score_at_most / at_least
- spoils_doubles
- hp_below_percent
- took_damage_this_encounter
- owns_tag
- enemy_has_tag
- floor_index
- encounter_tier

New condition operators require engine-level tests.

---

# 7. Action vocabulary

Initial reusable actions:

- add_fight
- add_enemy_fight
- add_damage
- reduce_incoming_damage
- heal
- change_max_hp
- bump_die
- flip_die
- copy_die
- transmute_die
- reroll_die
- lock_die
- mark_die
- lower_enemy_die
- set_spoils_score
- add_spoils_score
- add_coins
- spend_coins
- add_xp
- add_status
- remove_status
- gain_contraband
- consume_item
- modify_shop_price
- modify_salvage
- add_loot_band

If content needs arbitrary code, first ask whether the desired behavior can be expressed by composing existing actions.

---

# 8. Effect priority

Within a timing window:

1. encounter/boss rule
2. status constraints
3. character Technique
4. Gear
5. Artifacts
6. Contraband/current explicit action
7. cosmetic/log-only hooks

Specific content may override with authored numeric priority.

Priority exists to make interactions deterministic, not to create hidden rules. UI should explain meaningful ordering when two effects visibly interact.

---

# 9. Preview system

Before COMMIT, simulation provides `CombatPreview`:

- raw Fight
- modifiers with source IDs
- final Fight
- enemy raw/final total
- predicted margin
- predicted base damage
- deterministic additional damage
- deterministic mitigation
- current Spoils pair
- base Spoils Score
- deterministic Spoils modifiers that would apply on a win
- effects waiting on unknown post-resolution conditions

UI displays enough of this to prevent surprise arithmetic.

---

# 10. Content schemas

## Character

- id
- display key
- starting HP
- starting Gear IDs
- starting ability/effects
- Technique option groups by Level
- art/audio IDs
- unlock rule

## Gear

- id
- slot
- tier
- base shop price
- effects
- tags
- duplicate rule
- art ID
- content/provenance ID

## Artifact

- id
- tier
- base shop price
- effects
- tags
- unique flag
- art ID
- content/provenance ID

## Contraband

- id
- tier
- base shop price
- effects
- legal timing
- target rules
- max inventory copies
- art ID

## Enemy

- id
- tier
- Floor eligibility
- max HP
- dice pool
- Instinct definition
- effects/rules
- XP
- Coins
- pressure band
- tags
- art/audio IDs
- provenance ID

## Boss

Enemy schema plus:

- states/phases
- transition rules
- state-specific dice engine
- Boss Draft rules

## Event

- id
- Floor eligibility
- choices
- conditions for choice visibility
- outcome actions
- art ID
- provenance ID

---

# 11. Tags

Tags support eligibility and interactions, not lore claims.

Examples:

- `dice:pattern`
- `build:greed`
- `build:defense`
- `build:interference`
- `item:archive`
- `enemy:threshold`
- `enemy:native`
- `event:institutional`

Tags are controlled vocabulary. Do not invent near-duplicate tag strings in content files.

---

# 12. Simulation mode

The simulation layer must support headless batch execution.

Required capabilities:

- fixed seed
- strategy policy plug-ins (safe / greedy / heuristic / random)
- thousands of runs without renderer
- CSV/JSON summary output
- trace one chosen seed turn-by-turn

Balance tooling is a first-class implementation requirement, not a post-launch convenience.

---

# 13. Test requirements

Unit tests must cover:

- all d6 operations
- opposite mapping
- margin math
- mitigation order
- tie rules
- Spoils qualification
- reward band mapping
- inventory replacement/salvage
- XP thresholds
- every effect condition/action operator
- deterministic RNG reproduction
- save/load reproduction
- map constraints
- invalid Loot offer filtering

Every newly added action/condition gets tests before content depends on it.

---

# 14. Renderer boundary

Renderer receives:

- authoritative state snapshot
- ordered simulation events
- asset IDs

Renderer may:

- animate
- delay presentation
- interpolate
- shake
- play audio
- show tooltips

Renderer may not:

- roll gameplay RNG
- alter HP
- choose rewards
- infer effects from item name/text
- decide when an effect mechanically occurs

---

# 15. Content validation

At build/dev time validate:

- unique IDs
- valid referenced IDs
- allowed tags
- valid timing enum
- valid effect action/condition types
- slot/category compatibility
- item price present
- enemy reward values present
- art IDs exist or explicitly marked placeholder during development
- provenance record required for real-world-derived content

Invalid content should fail loudly in development.
