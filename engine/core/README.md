# @aarb/core — E0/E1

Production-intended deterministic rules core for **As Above, Roll Below**.

This package deliberately contains no DOM, Phaser, PixiJS, audio, sprites, or CSS. It is the authoritative gameplay/procgen layer that both the browser client and headless simulator will consume.

## Implemented in this gate

- deterministic named RNG streams with save/restore state;
- physical d6 operations (roll, BUMP, FLIP, COPY, TRANSMUTE scaffolding);
- deterministic enemy Instinct locking;
- baseline contested-roll combat preview and COMMIT resolution;
- margin damage;
- Spoils qualification event emission;
- runtime-stable die IDs;
- generic constrained Floor generator;
- generic Run generator over an arbitrary ordered list of Floor definitions (Floor count is content, not an engine constant);
- THRESHOLDS Floor definition as data, not an engine special case;
- automated tests including 1,000 generated THRESHOLDS seeds.

## Boundary

`@aarb/core` owns truth. A future Phaser client may render and animate emitted events, but it does not roll gameplay RNG or alter authoritative state.

## Commands

```bash
npm test
npm run build
```

No runtime dependencies are required in E0/E1.

## Next

E2 adds the data-driven timing/effect resolver, then E3 moves loot/inventory/progression/economy into this same core. The headless simulator will then be rebuilt on these exact modules rather than maintained as a parallel Python ruleset.
