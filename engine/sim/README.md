# @aarb/sim

Headless policy/simulation client for **As Above, Roll Below**.

The simulator does **not** own game arithmetic. It imports the compiled production rules from `../core/dist/index.js` and supplies only strategy decisions, batch orchestration and telemetry.

## Current E5 V1 coverage

Uses production core for:
- seeded Floor graph generation;
- seeded Encounter Director;
- enemy/player dice rolls and Instinct locking;
- physical d6 operations;
- combat preview / COMMIT / margin damage;
- passive combat effects;
- persistent HP;
- XP / Level / Max-HP growth;
- final-blow Spoils capture;
- Loot Draft generation;
- inventory replacement and salvage;
- Coins;
- seeded Shop stock and healing.

Policy-driven active actions currently modeled:
- Field Adjustment / BUMP;
- Mirror Shard / FLIP;
- Hidden Hand enemy interference;
- Carbon Paper / COPY;
- Blank Face / TRANSMUTE.

Explicitly incomplete in E5 V1:
- Event outcomes (visits are recorded but outcomes are no-op);
- several post-resolution/economy Artifacts;
- Contraband use policy;
- full boss-special timing adapters still need promotion into core.

Therefore E5 V1 validates **shared-core architecture and broad pressure trends**, not final Floor I balance.

## Policies

- `safe` — prioritizes survival/margin.
- `opportunist` — chases premium Spoils while healthy and tightens play under HP pressure.
- `greedy` — diagnostic policy that maximizes Spoils on any available win, even when strategically reckless.

## Commands

After `engine/core` has been built:

```bash
npm test
npm run smoke
npm run batch
```

Batch output can be written with:

```bash
node src/run.mjs --runs=1000 --output=results
```
