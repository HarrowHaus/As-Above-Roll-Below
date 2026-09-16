# Legacy tool / repository audit

This is the tool shortlist from the original mechanics prototype. It is preserved for reference and will be superseded by the production architecture decision once implementation begins.

## Runtime / rendering

### Vanilla DOM — chosen for the prototype
The core test was selection/state/UI, not continuous world simulation. Zero dependencies made it the fastest way to validate the central mechanic.

### Phaser — production candidate
- HTML5 2D game framework.
- MIT licensed.
- Worth reconsidering if final presentation is animation-heavy and benefits from scene management, particles, gamepad support, or a game-specific render loop.

### PixiJS — production renderer alternative
- WebGL/WebGPU-focused 2D renderer.
- MIT licensed.
- Useful if rules/UI architecture remain separate from custom rendering.

## Dice

### dice-box / 3D dice tooling
Potentially useful for tactile physical presentation, but not automatically desirable. Real-time 3D physics must not make the four-die decision slower or harder to read.

## Audio

### ZzFX
- tiny procedural JavaScript sound generator;
- MIT licensed;
- useful for lightweight UI/dice effects.

### Howler.js
- MIT licensed browser audio abstraction;
- useful later for layered music, ambience, multiple codecs, fades, and mobile audio edge cases.

## Build / testing

### Vite
Production web build candidate.

### Vitest
MIT-licensed unit testing candidate for combat rules, item triggers, reward tables, deterministic seeds, and simulation helpers.

### Playwright
Apache-2.0 browser testing candidate for touch targets, dice selection, focus, saving, full win/loss runs, and browser compatibility.

## Art / UI tooling

### Kenney
CC0/public-domain asset packs; useful for temporary development primitives, not final identity.

### Game-Icons.net
Large icon library, generally CC BY 3.0; attribution requirements must be honored if retained.

### Krita
Primary candidate for illustration/paint/ink source work.

### Inkscape
Vector/logo/UI cleanup candidate.

### LibreSprite
Only relevant if the final visual language intentionally adopts pixel/CRT elements.

## Accessibility requirements retained from the prototype

- every critical action works as click/tap;
- dragging is optional rather than required;
- keyboard path;
- visible focus;
- reduced motion;
- haptics optional only;
- color never the sole state indicator.

## Architecture note

Do not choose an engine because it is impressive. Choose it after the Art Bible and Vertical Slice Content Sheet establish what rendering, animation, asset, and testing requirements the game actually has.
