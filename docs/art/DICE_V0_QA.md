# Dice v0 — Production QA Record

**Status:** first source→native pipeline proof complete in chat workspace.  
**Asset family:** Bonecast player dice / Ironcast enemy dice.  
**Native size:** 48×48 per die/state cell.

## Produced

- 6 Bonecast player faces;
- 6 Ironcast enemy faces;
- focus overlay;
- Fight overlay;
- Spoils overlay;
- enemy-lock overlay;
- persistent-LOCK overlay;
- disabled overlay;
- BUMP up/down FX;
- FLIP FX;
- Spoils-qualified FX;
- 288×192 native atlas with 22 named frames;
- atlas JSON metadata;
- face and state contact-sheet previews;
- high-resolution transparent source sheet preserved outside the native atlas;
- ZIP package containing individual masters, atlas, metadata, and previews.

## Pipeline actually used

1. Generate one transparent high-resolution 2×6 source sheet.
2. Detect alpha-connected components programmatically.
3. Sort six player and six enemy dice left→right.
4. Crop each component.
5. Fit each die into a 48×48 native transparent canvas.
6. Nearest-neighbor reduction.
7. Hard alpha cleanup for crisp sprite edges.
8. Controlled color quantization.
9. Generate state overlays deterministically with pixel geometry rather than regenerating full dice.
10. Assemble contact sheets and native atlas.
11. Inspect at enlarged nearest-neighbor scale while preserving native 48×48 masters.

This proves that the chosen art direction can produce separable runtime assets rather than only concept boards.

## QA observations

### Pass
- all twelve die faces read correctly as one material family per row;
- player/enemy families are distinguishable without relying only on hue;
- values 1–6 remain legible at 48×48;
- transparent backgrounds survived conversion;
- Fight, Spoils, focus, and enemy-lock overlays preserve pip readability;
- state overlays are modular and do not require 6×state sprite multiplication;
- native sprites retain the intended dark-fun pixel look after reduction.

### Revised during QA
The first persistent-LOCK and disabled overlays crossed the primary die face too aggressively. They were redesigned to move state geometry to the edge of the cell so pips remain readable.

This is the expected production process: state readability beats attachment to the first attractive design.

## Remaining before final approval

- test atlas in the real browser combat layout;
- validate smallest mobile display size;
- compare against representative Floor I environment colors;
- grayscale/color-vision pass;
- add scripted PNG dimension/alpha/name validator to implementation repo structure;
- determine whether side-face decorative marks need simplification after live motion testing;
- author the actual FLIP transition using the opposite-face mapping rather than relying only on the icon overlay.

## Current judgment

**APPROVED AS PIPELINE PROOF / PRE-PRODUCTION DICE V0.**

Not yet final shipping dice, but sufficiently game-ready to prove the asset-manufacturing method and serve as the first browser integration set.