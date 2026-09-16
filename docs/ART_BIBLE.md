# As Above, Roll Below — Art Bible

**Version:** 0.4 — pixel-first production canon  
**Status:** C-stage active  
**Primary constraint:** every approved visual direction must be convertible into game-ready assets using the production pipeline available to this project.

---

# 1. VISUAL THESIS

**As Above, Roll Below is a dark-fun pixel roguelite: creepy, stylish, strange, highly readable, and willing to treat ridiculous material with absolute artistic seriousness.**

The target is not grimdark horror and not cute retro nostalgia. It should feel like a lost premium pixel game with unusually literate occult/Fortean subject matter and an obsessive fixation on dice.

Core ingredients:

- medium/high-detail pixel sprites;
- strong silhouettes and quick animation reads;
- moody threshold architecture;
- controlled magenta/cyan/bone/brass accents against deep charcoal;
- unsettling creatures that remain charismatic rather than purely disgusting;
- precise combat UI;
- tactile, deeply designed dice as the primary visual signature;
- serious presentation that lets absurdity speak for itself.

The current lead visual target is the September 2026 pixel style packet: compact delver sprites, dark masonry/threshold staging, warm bone dice, black/iron enemy dice, restrained hot-magenta and cyan highlights, and monsters whose strange function is readable in silhouette.

---

# 2. WHAT THIS IS NOT

Do not drift into:

- generic 8-bit nostalgia;
- chibi fantasy;
- monochrome horror sludge;
- Giger imitation / biomechanical fetishism;
- constant gore;
- cartoon parody;
- generic `black + gold + pentagram` occult branding;
- faux-SCP interface design;
- asset packs whose sprites clearly come from unrelated generators/styles;
- painterly illustrations that cannot be separated into runtime assets.

The previous painterly/ink direction remains useful as conceptual history, not production canon.

---

# 3. PRIMARY ART RULE — THE ASSET MUST SURVIVE THE GAME

A concept is not approved merely because the concept sheet looks good.

Every production-facing asset must pass these questions:

1. Can it be isolated cleanly on transparency?
2. Can it be reproduced consistently for adjacent poses/states?
3. Is the silhouette readable at actual runtime size?
4. Can the animation be authored without generating dozens of drifting images?
5. Does it remain legible against the approved environment palette?
6. Can the browser load and render it economically?
7. Can this project create, clean, crop, resize, and export it with tools available in chat/container workflows plus free desktop tools if a human correction is later desired?

If not, it is concept art, not production art.

---

# 4. PIXEL PRODUCTION MODEL

Image generation is a **source-image stage**, never the final asset stage.

Approved pipeline:

1. design the asset from the canonical model/style sheet;
2. generate/draw at high resolution with clean separation and minimal background contamination;
3. isolate the subject or state on transparency;
4. correct silhouette/anatomy/state inconsistencies;
5. reduce values/colors toward the approved palette family;
6. downsample using nearest-neighbor to the target native pixel canvas;
7. perform pixel-level cleanup where needed;
8. inspect at **1× native size**;
9. export lossless PNG master with transparency;
10. generate WebP/runtime derivatives only after the PNG master passes QA;
11. pack into atlases only after the asset family is stable.

Never upscale a tiny generated sprite and pretend the resulting softness is intentional pixel art.

---

# 5. FREE / OPEN PRODUCTION TOOLCHAIN

Preferred tools:

## LibreSprite
Primary manual pixel/sprite editor when available.
- layers + frames;
- onion skinning;
- tiled mode;
- palette work;
- frame animation.

## Pixelorama
Alternative/open pixel editor and useful sprite/animation/tiles workflow.

## Krita
High-resolution source cleanup, painting, masking, palette studies, and sprite-sheet preparation.

## Inkscape
UI geometry, scalable icon masters, sigil/diagram construction, layout guides.

## Blender
Optional 3D reference/blockout for dice, doors, architecture, and perspective consistency. It is a reference generator, not the runtime art style.

## Python / Pillow / image-processing scripts
Deterministic cropping, alpha cleanup, palette analysis, nearest-neighbor resizing, sheet assembly, validation, and batch export.

The project must not depend on paid art software for reproducibility.

---

# 6. NATIVE PIXEL SCALE

Working game reference canvas:

**480 × 270 logical pixels (16:9)** for horizontal/desktop staging.

The browser may scale beyond this using integer or near-integer presentation where practical. Responsive/mobile layouts may recompose UI, but sprites retain the same native pixel assets.

Runtime CSS text does **not** need to be rasterized into this pixel grid; readable/scalable text is more important than purist pixel typography.

## Working asset canvases

These are production buckets, not mandatory visible bounding-box sizes:

- Player character: **64 × 64** native cell.
- Small/normal enemy: **64 × 64**.
- Large normal / elite: **96 × 96**.
- Boss modules / key states: **160 × 160** or **192 × 192**.
- Standard combat die: **48 × 48**.
- Large/boss die: **64 × 64**.
- Common item icon: **24 × 24** or **32 × 32**.
- Status/state icon: **16 × 16** or **24 × 24**.

Transparent empty space is allowed inside a cell where required for animation, but anchors remain stable.

---

# 7. PIXEL LANGUAGE

## Silhouette first
At native size, read order is:

1. overall silhouette;
2. face/focal anomaly;
3. weapon/rule-bearing anatomy;
4. major material block;
5. microdetail.

Microdetail that damages silhouette readability must be removed.

## Cluster discipline
Avoid noisy single-pixel confetti. Prefer deliberate clusters, planes, and highlight groups.

## Outline treatment
Not every sprite needs a solid black cartoon outline. Use:

- selective dark contour on gameplay-critical edges;
- material-colored interior edges;
- stronger contour where subject/background separation requires it;
- no fuzzy antialiased edge in the PNG master.

## Lighting
Default Floor I light logic:

- cool/dark ambient fill;
- controlled cyan/teal environmental separation;
- warm bone/brass local light;
- hot magenta used for anomaly/rule emphasis.

Sprites should not carry incompatible photographic lighting from generated sources.

---

# 8. PALETTE SYSTEM

Lead runtime family:

- **Void Charcoal** `#101319`
- **Deep Navy** `#151C2B`
- **Stone Grey** `#343943`
- **Old Bone** `#D7C8AD`
- **Pale Bone** `#F0E1C8`
- **Oxide** `#783A32`
- **Threshold Magenta** `#D02666`
- **Hot Magenta** `#FF3C7B`
- **Archive Teal** `#156F73`
- **Signal Cyan** `#49D2CF`
- **Tarnished Brass** `#AF7A3C`
- **Warm Brass** `#D39B55`
- **Moss Grey-Green** `#60776B`

This is an anchor palette, not a twelve-color hard limit. Individual sprites may use ramps around these anchors.

### Color role
- Fight selection / imminent danger: magenta/red family.
- Spoils / premium reward: brass/gold family.
- Enemy/system information: cyan/teal family.
- Player casting material: bone/ivory family.

State must never rely on color alone; geometry/icons accompany color.

---

# 9. PLAYER CHARACTER LANGUAGE

The delver should look like a person who entered the Below with practical equipment and gradually acquired impossible tools—not a chosen-one superhero.

Desired properties:

- slightly compact readable proportions;
- strong hood/head/shoulder silhouette;
- hands and held items exaggerated only enough to read at 64px;
- gear that feels scavenged, field-built, ritual-adjacent, and useful;
- one strong focal color/material rather than accessory soup;
- face may be partially concealed, but not every character uses the same mask gimmick.

## Vertical-slice player animation budget

Working target:

- idle: 4 frames;
- walk: 6 frames;
- Fight commit / attack: 4–6 frames;
- hurt: 2–3 frames;
- defeat: 5–7 frames;
- cast/manipulation gesture: 3–5 frames if not covered by attack animation.

These counts may be reduced through held-frame timing; animation quality is not frame-count maximalism.

---

# 10. MONSTER LANGUAGE

Three families share the same pixel rendering grammar:

## Research-derived manifestations
Preserve verified identifying traits before stylization. Do not design from pop-culture memory.

## Below Natives
Original creatures shaped by **function** rather than terrestrial zoology. Floor I can use:

- seams;
- latches;
- frame-like anatomy;
- wrong openings;
- panels / plates / folds;
- architectural surfaces behaving like tissue;
- incomplete transitions between object/function/creature.

This must remain dark-fun-creepy, not body-horror maximalism.

## Procedural / institutional horrors
Systems given anatomy: wardens, registrars, archivists, permit-things, custodial entities. Avoid simply drawing office workers as monsters.

### Hard visual clichés to avoid
- antlers as generic weirdness;
- black smoke + long fingers;
- eyes covering every surface;
- pentagram tattoos on every creature;
- humanoid-in-business-suit = bureaucracy;
- gore used as a substitute for design.

---

# 11. FLOOR I — THRESHOLDS

Floor I is built around **entry, permission, passage, refusal, seals, frames, and crossing**.

Visual components:

- nested doorframes from incompatible periods;
- painted institutional metal mixed with old stone/wood;
- doors that imply rooms which cannot physically exist;
- chains, latches, hinges, seals, numbers, wayfinding, and repaired apertures;
- shallow water / reflective flooring in selected rooms;
- cyan distance light versus magenta threshold anomalies;
- brass hardware and bone-colored casting objects.

The environment should feel inviting enough to explore and wrong enough to remain memorable.

---

# 12. DICE — PRIMARY VISUAL SIGNATURE

Dice are effectively recurring lead characters.

The detailed system is defined in `DICE_DESIGN_BIBLE.md`, but Art Bible constraints are:

- standard combat dice use **48×48 native cells**;
- player dice are bone/ivory casting lots with dark pips and restrained brass registration detail;
- baseline enemy dice are dark iron/stone with pale pips and harder corners;
- current rolled value must read immediately even when the cube is shown in perspective;
- state overlays are modular wherever possible rather than baking a full new sprite for every state/value combination;
- FLIP must respect opposite faces `1↔6`, `2↔5`, `3↔4`;
- Fight, Spoils, enemy lock, manipulated, disabled, and persistent LOCK states require non-color cues.

The player should remember the dice before they remember most individual UI panels.

---

# 13. UI LANGUAGE

The UI is crisp, dark, compact, and designed around the roll.

Primary hierarchy:

1. enemy locked dice / total;
2. player dice;
3. Fight pair;
4. Spoils pair;
5. predicted margin;
6. HP;
7. manipulation actions.

World flavor never competes with this hierarchy.

## Runtime text
Use scalable browser text rather than rasterizing every label into a pixel font. Decorative headings may use a pixel/bitmap-like display face if readability survives.

## Panels
- near-black/navy surfaces;
- one-pixel or two-pixel border logic at native scale;
- occasional brass registration corners;
- magenta/cyan state accents;
- minimal texture behind numbers.

---

# 14. ANIMATION / VFX GRAMMAR

Animations are fast, tactile, and readable.

### Standard durations
- ordinary die roll: ~350–650 ms;
- selection: ~80–150 ms;
- lock: ~150–250 ms;
- BUMP: ~150–250 ms;
- FLIP: ~250–450 ms;
- hit impact: ~120–220 ms;
- ordinary defeat: ~400–800 ms.

Reduced-motion mode substitutes transforms/flash states for larger movement.

## VFX rules
- small controlled pixels / sparks / registration lines;
- hit effects never obscure totals;
- no full-screen bloom for ordinary manipulation;
- no smoothing/blur that destroys pixel edges;
- shake used sparingly and disabled/reduced with accessibility settings.

---

# 15. ASSET CONSISTENCY PIPELINE

Before an asset family enters production:

1. approve one style anchor;
2. approve exact native canvas size;
3. approve anchor/pivot;
4. approve palette ramp(s);
5. approve silhouette;
6. generate/draw the family source sheet;
7. isolate/crop each state;
8. downsample and clean;
9. compare at native size;
10. only then create adjacent states/variants.

A visually attractive sprite that is off-model must be rejected or corrected.

---

# 16. TECHNICAL EXPORT RULES

Canonical source/runtime rules are expanded in `ASSET_PRODUCTION_SPEC.md`.

Minimum requirements:

- transparent PNG master for sprites/UI icons;
- no premultiplied matte/fringe baked against a colored background;
- nearest-neighbor scaling for pixel assets;
- stable bottom-center anchors for characters/enemies unless an asset class documents another pivot;
- lowercase snake_case filenames;
- consistent state suffixes;
- no accidental half-transparent antialiased outline pixels except intentionally authored translucency;
- validate alpha bounds and canvas dimensions by script before atlas packing.

---

# 17. C-STAGE DELIVERABLES

1. pixel-first Art Bible — **this document**;
2. Dice Design Bible;
3. Asset Production Spec;
4. Vertical Slice Asset Manifest;
5. player model/sprite anchor sheet;
6. player dice production set;
7. enemy dice production set;
8. one native Threshold enemy production set;
9. one elite visual set;
10. boss development sheet;
11. combat UI production slice;
12. Threshold environment module set.

---

# 18. APPROVAL TEST

A production asset is not approved because it looks good enlarged.

View it at native size and ask:

- What is it?
- What state is it in?
- What should the player look at?
- Does it belong beside the already approved assets?
- Can we actually ship it?

If any answer is unclear, revise it.