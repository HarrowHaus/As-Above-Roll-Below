# AARB — Developer Test Harness

## Purpose
A content-heavy roguelite cannot require a full seeded descent every time one enemy/item interaction needs testing. The harness is production infrastructure, inspired by the force-enemy/equipment testing workflows documented during Dicey Dungeons development.

## URL contract
Development/preview builds may accept query parameters. Release builds may disable the visible shortcuts while preserving internal debug APIs.

Examples:
- `?debug=1&enemy=passage-clerk`
- `?debug=1&enemy=seal-bearer&items=mirror-shard,opposite-number`
- `?debug=1&boss=first-door&phase=open`
- `?debug=1&event=talking-board-1891`
- `?debug=1&seed=12345`
- `?debug=1&coins=20&shop=1`

## Required controls
- fixed master seed
- force normal enemy
- force Elite
- force boss + phase
- force Event
- force Shop
- inject Gear/Artifacts/Contraband while respecting slot rules unless `unsafe=1`
- set HP / Coins / Level
- choose starting Technique
- quick reset with same seed
- next seed
- display current RNG seed/stream names in debug overlay
- copy current run-state JSON

## Content audit modes
### Enemy audit
Run one enemy repeatedly with:
1. naked Delver
2. one relevant manipulation Artifact
3. one deliberately adverse build
4. representative late-Floor build

### Item audit
Force the item into:
1. ordinary Combat
2. enemy that reacts to manipulation
3. Elite
4. First Door relevant phase
5. Loot replacement state
6. Shop purchase state

### Information audit
Every forced object must expose the same player-facing rule text used in ordinary play. Debug mode is not allowed to compensate for unclear production UI.

## Acceptance criteria
- No debug route reimplements combat/reward rules.
- Harness only prepares authoritative core state and routes into normal scenes.
- Same seed + same setup reproduces the same encounter.
- Query parsing is validated; unknown IDs produce a visible debug error rather than silent fallback.
