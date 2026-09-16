# AARB — Developer Test Harness

Status: implemented baseline, expand alongside content.

The browser client accepts query parameters so authored content can be tested without descending through an entire seeded run.

## Baseline parameters

- `?seed=12345` — deterministic run seed.
- `?enemy=latchling` — boot directly into a named Floor I normal/Elite encounter. Full IDs such as `thresholds:latchling` are also accepted.
- `?boss=closed`, `?boss=ajar`, `?boss=open` — boot directly into The First Door at the requested phase.
- `?event=talking-board-1891` — boot directly into a named Floor I Event.
- `?items=mirror-shard,opposite-number` — inject one or more item IDs before the quickstart. Inventory replacement rules still apply.

Parameters can be combined, for example:

`?enemy=seal-bearer&items=mirror-shard,brass-caliper&seed=12345`

This is production test infrastructure, not a player feature.

## Required expansion

The harness should eventually support:

- exact player HP / level / Coins;
- exact player and enemy cast values;
- exact Technique loadout;
- direct Loot Draft and Shop boot;
- forced Spoils score / reward band;
- inventory-full states for replacement testing;
- boss HP rather than phase aliases only;
- a visible debug overlay showing seed, RNG stream positions, object count and frame timing;
- replaying a captured failing state from serialized RunState.

## Content QA protocol

Every new enemy, item, Event, Technique or boss phase must be testable directly. A content entry is not implementation-complete until the developer can force it into the smallest relevant state without relying on procedural discovery.

For each item test at minimum:
1. normal use;
2. invalid target/use;
3. slot-full/replacement behavior where relevant;
4. interaction with at least one synergistic item;
5. interaction with at least one hostile enemy rule;
6. portrait phone layout;
7. desktop layout.

For each enemy test at minimum:
1. rule explanation visible before it matters;
2. rule actually changes a decision;
3. manipulation reaction if applicable;
4. tie behavior if applicable;
5. defeat/victory transition;
6. reward transition.
