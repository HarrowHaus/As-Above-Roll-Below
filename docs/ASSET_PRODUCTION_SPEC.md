# As Above, Roll Below — Asset Production Spec

**Version:** 0.1  
**Status:** C-stage production canon  
**Purpose:** ensure that every visual asset can be manufactured, cleaned, exported, validated, and shipped in the browser game.

---

# 1. NON-NEGOTIABLE RULE

**Concept art is not a runtime asset.**

Image generation may create excellent source material, but nothing enters the game until it has been isolated, dimensioned, downsampled, cleaned, named, and validated against this document.

Every approved art direction must be achievable through the production tools available to the project.

---

# 2. MASTER PIPELINE

## Source stage
1. Work from an approved style/model/reference sheet.
2. Generate/draw at high resolution with simple separation and minimal background contamination.
3. Prefer one asset family per source sheet rather than unrelated objects mixed together.
4. Preserve original source file.

## Isolation stage
5. Remove background to full alpha where required.
6. Repair cut edges, missing pixels/anatomy, and unwanted merged props.
7. Establish canonical crop, canvas, and pivot.

## Pixel conversion stage
8. Reduce value/color noise toward the asset's approved ramps.
9. Downsample with nearest-neighbor to native pixel size.
10. Perform pixel cleanup: clusters, contours, holes, stray pixels, eye/face readability, weapon edges.
11. Verify no antialiased fringe remains unless translucency is deliberate.

## Runtime stage
12. Save transparent PNG master.
13. Derive WebP only where useful and visually lossless enough.
14. Generate contact sheet and metadata.
15. Validate by script.
16. Pack atlas only after the family is stable.
17. Test in browser at native and scaled display sizes.

---

# 3. SOURCE OF TRUTH

For every production asset family keep:

- source reference/model sheet;
- high-resolution generated/drawn source;
- cleaned high-resolution master when applicable;
- native-size transparent PNG master;
- runtime derivative(s);
- metadata entry.

The native-size PNG is the visual runtime source of truth for pixel assets.

Never overwrite the high-resolution source with a reduced export.

---

# 4. DIRECTORY STANDARD — PLANNED IMPLEMENTATION

When implementation begins:

```text
assets/
  source/
    characters/
    enemies/
    dice/
    ui/
    environments/
    fx/
  native/
    characters/
    enemies/
    dice/
    ui/
    environments/
    fx/
  runtime/
    atlases/
    standalone/
  manifests/
```

Preproduction visual boards can live under `docs/art/` and must not be imported directly into game code.

---

# 5. NAMING STANDARD

Lowercase snake_case.

Pattern:

`{class}_{entity}_{action_or_state}_{variant}_{frame}.png`

Examples:

- `player_delver_idle_a_00.png`
- `player_delver_attack_a_03.png`
- `enemy_latchling_idle_00.png`
- `enemy_warden_hurt_01.png`
- `die_player_bonecast_face_6.png`
- `die_state_fight.png`
- `ui_icon_bump.png`
- `env_threshold_doorframe_03.png`

Do not encode arbitrary generation IDs into shipping filenames. Generation provenance belongs in manifests/metadata.

---

# 6. CANVAS / PIVOT CLASSES

## Player
Native cell: **64×64**.  
Default pivot: bottom-center at `(32, 58)` unless the character sheet specifies otherwise.

Keep feet/ground contact within a stable 2px band across ordinary poses.

## Normal enemy
Native cell: **64×64**.  
Default pivot: bottom-center `(32, 58)`.

## Elite
Native cell: **96×96**.  
Default pivot: bottom-center `(48, 88)`.

## Boss
Native module: **160×160** or **192×192**.  
Bosses may use multiple layers/modules; pivot must be documented per boss.

## Standard die
**48×48**.  
Pivot: center `(24,24)`.

## Large/boss die
**64×64**.  
Pivot: center `(32,32)`.

## Item icon
**24×24** or **32×32**.

## Status icon
**16×16** or **24×24**.

All dimensions are native pixels, not CSS display pixels.

---

# 7. SPRITE ANIMATION BUDGETS

These are vertical-slice targets, not hard full-game maxima.

## Player
- idle: 4 frames;
- walk: 6 frames;
- attack/Fight commit: 4–6 frames;
- hurt: 2–3 frames;
- defeat: 5–7 frames;
- manipulation/cast: 3–5 frames if needed.

## Normal enemy
- idle: 3–4 frames;
- attack: 3–5 frames;
- hurt: 2 frames;
- defeat: 4–6 frames.

## Elite
- idle: 4 frames;
- attack: 4–6 frames;
- hurt: 2–3 frames;
- defeat: 5–7 frames;
- signature action: 3–6 frames if not covered by attack.

## Boss
Authored by phase. Keep total frame count reasonable; use layer motion, state swaps, and FX rather than brute-force full-frame animation.

Animation readability at game speed matters more than raw frame count.

---

# 8. GENERATED-ASSET CONSISTENCY RULE

Once an approved model sheet exists, later generations must reference the approved subject wherever the tool/workflow permits.

Required checks:

- skull/head shape;
- body proportions;
- costume panels/seams;
- held object placement;
- palette/materials;
- silhouette height/width;
- handedness;
- focal anomaly placement.

If a generated pose is off-model, correct or reject it. Do not silently accept drift because the image is attractive.

---

# 9. PIXEL CLEANUP RULES

At native size:

- eliminate isolated noise pixels unless intentionally textural;
- repair broken contour runs;
- avoid pillow shading;
- consolidate near-identical colors that add no form;
- use deliberate highlight clusters;
- keep facial/focal features readable;
- remove antialiased grey/colored edge fringe;
- do not use subpixel positions in runtime rendering for pixel sprites where avoidable.

A scripted palette report should flag unexpectedly high unique-color counts for manual review.

---

# 10. TRANSPARENCY / ALPHA

Characters, enemies, dice, icons, most FX:

- full transparent background;
- no white/black matte baked around edges;
- no shadow fused to sprite unless the shadow is intentionally part of the asset family;
- soft translucent pixels allowed only for authored FX, glass, smoke, glow, or shadows.

Validate that all outer-edge pixels with partial alpha are intentional.

---

# 11. ENVIRONMENT ASSET MODEL

Floor I should not be one giant painted image that prevents reuse.

Preferred structure:

- far background plate;
- midground architecture plate;
- foreground/ground strip;
- modular props;
- doors/threshold modules;
- optional lighting/fog overlay;
- parallax-safe negative spaces for combat UI.

Individual modules may be larger than character sprites and do not need strict tile-grid construction, but repeated architecture should reuse modules when visually plausible.

---

# 12. UI ASSET MODEL

Use vector/CSS/runtime geometry where it improves scalability; use pixel assets for decorative/iconic pieces.

Do not rasterize all UI text.

Potential assetized components:

- corner ornaments;
- panel caps/dividers;
- action icons;
- die state overlays;
- item/Artifact icons;
- HP frame accents;
- boss phase markers.

Layout boxes, progress bars, numbers, and most typography should remain runtime-rendered for responsiveness/accessibility.

---

# 13. DICE-SPECIFIC PRODUCTION

Detailed rules: `DICE_DESIGN_BIBLE.md`.

Efficiency rule:

- author six base faces per material family;
- author shared state overlays once;
- combine at runtime;
- use animation transforms or compact intermediary frames for roll/flip/manipulation;
- do not export `6 faces × 8 states × 4 material families` unless a state genuinely changes the underlying object.

---

# 14. PALETTE / COLOR VALIDATION

Pixel art is not required to use one global indexed palette, but each family should use a controlled ramp.

Suggested review metrics:

- unique visible RGB count;
- darkest/lightest values;
- hue-family distribution;
- contrast against representative environment swatches;
- grayscale readability.

Unexpectedly broad color noise is a sign the source image was downsampled without cleanup.

---

# 15. EXPORT FORMATS

## Canonical master
PNG with alpha.

## Runtime derivative
PNG or WebP depending on measured size/quality.

Do not use lossy compression that destroys hard pixel edges.

## Animation
Preferred options:

1. sprite atlas + frame metadata;
2. small standalone PNG sequence during early prototype;
3. transform-based motion for UI/dice overlays where possible.

GIF is not a runtime source format.

---

# 16. ATLAS POLICY

Do not atlas-pack unstable work.

After an asset family is approved:

- pack related sprites together;
- retain 2–4px transparent extrusion/padding where renderer requires it;
- prevent texture bleeding;
- emit machine-readable frame metadata;
- keep boss/large environment assets standalone if atlas waste becomes excessive.

Atlas generation should be deterministic and scriptable.

---

# 17. VALIDATION SCRIPT — REQUIRED CHECKS

A production validation script should eventually check:

- expected dimensions;
- file naming;
- alpha channel presence where required;
- bounding box inside canvas;
- nonempty sprite;
- pivot metadata present;
- animation frame sequence completeness;
- duplicate file hashes;
- accidental RGB matte on alpha edges;
- suspiciously high color count;
- atlas metadata references valid files.

CI should run these checks once implementation begins.

---

# 18. GAME-READY DEFINITION

An asset is **game ready** only when:

- it has the correct native canvas;
- the alpha edge is clean;
- the subject is on-model;
- the silhouette works at 1×;
- the filename follows spec;
- its pivot is known;
- its state/action is unambiguous;
- it can be imported without further conceptual decisions;
- it has been viewed in a representative game screen.

A pretty transparent PNG that still needs design decisions is **not** game ready.

---

# 19. PRODUCTION ORDER

For each family:

**style anchor → source sheet → isolate → native pixel conversion → QA contact sheet → browser test → adjacent states → atlas**.

Do not mass-generate before the first member of a family survives runtime testing.

---

# 20. FIRST IMPLEMENTATION-FACING MILESTONE

Before full vertical-slice implementation, produce and validate:

1. player Bonecast dice 1–6;
2. enemy Ironcast dice 1–6;
3. four core die state overlays;
4. one BUMP and one FLIP effect;
5. one Delver idle sprite;
6. one Latchling idle sprite;
7. one Threshold background plate;
8. one combat UI frame using real exported assets.

This small package proves the entire source→runtime pipeline before animation/content volume explodes.