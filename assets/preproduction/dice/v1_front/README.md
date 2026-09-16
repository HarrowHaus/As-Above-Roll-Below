# Dice V1 — Front-Facing Gameplay Set

This is the first implementation-facing dice family for **As Above, Roll Below**.

## Canonical rules
- Settled gameplay dice are front-facing single-face sprites.
- Native cell: 48×48 px.
- Bonecast and Ironcast share the same master geometry and pip grid.
- Opposite pairs are `1↔6`, `2↔5`, `3↔4`.
- State changes are overlays rather than redrawn dice.
- Previous isometric V0 dice are deprecated as runtime geometry.

## Runtime files
- `dice_v1_atlas.png` — packed 288×192 atlas.
- `dice_v1_metadata.json` — frame rectangles, pivots, family/value metadata, and opposite-face mapping.

The complete source/export pack is produced from a deterministic pixel template; individual sprites can be regenerated from the same spec if needed.
