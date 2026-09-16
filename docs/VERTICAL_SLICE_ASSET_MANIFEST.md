# As Above, Roll Below — Vertical Slice Asset Manifest

**Version:** 0.1  
**Status:** planning manifest  
**Purpose:** enumerate every visual/audio-facing asset class needed to build the first finished Floor I slice without generating random art that cannot be implemented.

---

# 1. SCOPE

Vertical slice target:

- 1 playable character;
- 8 normal enemies;
- 2 elites;
- 1 boss;
- 12 Artifacts;
- 8 Gear;
- 6 Contraband;
- 3 Events;
- 1 Shop;
- Floor I — THRESHOLDS environment;
- full dice/UI/VFX support for contested combat.

This manifest covers **visual production assets**. Exact content identities/values remain controlled by `VERTICAL_SLICE_CONTENT.md`.

---

# 2. PRIORITY LEGEND

- **P0** — required to prove the asset pipeline / combat screen.
- **P1** — required for the playable vertical slice.
- **P2** — polish/secondary variation after the core slice works.

---

# 3. DICE — P0

## Player Bonecast
- 6 face sprites, 48×48.

## Enemy Ironcast
- 6 face sprites, 48×48.

## Shared state overlays
- focus/hover;
- Fight selected;
- Spoils potential;
- enemy locked;
- persistent LOCK;
- disabled/sealed.

## Manipulation/VFX
- BUMP +1;
- BUMP −1;
- FLIP intermediary/motion treatment;
- COPY relation effect;
- TRANSMUTE rewrite effect;
- Spoils-qualified effect;
- contact shadow.

## Optional P2
- one boss/elite die family, 64×64;
- one artifact-modified player-die overlay set.

---

# 4. PLAYER 01 — DELVER — P0/P1

Native cell: 64×64.

## P0
- idle key sprite / first approved frame;
- portrait/icon crop.

## P1 animation
- idle ×4;
- walk ×6;
- Fight commit / attack ×4–6;
- hurt ×2–3;
- defeat ×5–7;
- manipulation gesture ×3–5 if separate.

## Equipment overlays / variants
Prefer held/equipped items as limited reusable overlay pieces when practical rather than redrawing the whole character for every Gear item.

Initial required:
- starting weapon/tool silhouette;
- casting pouch/kit or equivalent signature prop.

---

# 5. NORMAL ENEMIES — P1

Final identities will come from D-stage content selection. Production budget assumes **8** normal enemies.

For each normal enemy:

- idle ×3–4;
- attack ×3–5;
- hurt ×2;
- defeat ×4–6;
- portrait/icon crop;
- optional rule-bearing VFX/prop.

Native target:
- 64×64 for standard;
- 96×96 allowed for large normal if silhouette requires it.

At least **4 of 8** should be Below-native/original rather than external-reference manifestations.

---

# 6. ELITES — P1

Two elites, 96×96 native.

For each:

- idle ×4;
- attack ×4–6;
- hurt ×2–3;
- defeat ×5–7;
- signature action ×3–6 if separate;
- portrait;
- elite marker/border treatment.

Working art-direction candidate from style exploration:
- Warden-class Threshold entity.

Name/role is not content-canon until D-stage locks it.

---

# 7. FLOOR I BOSS — P1

Working original boss seed: **First Door / Composite Threshold**.

Final naming/content controlled by D-stage.

Boss asset budget:

- closed/initial state;
- open/phase-change state;
- idle loop per active phase;
- signature attack/action state(s);
- hurt state;
- defeat/resolution sequence;
- portrait/title-card crop;
- phase marker icon(s);
- unique boss dice material if mechanics justify it;
- boss-specific VFX layer(s).

Native boss module:
- 160×160 or 192×192.

Prefer modular moving layers/pose swaps over dozens of full-frame images.

---

# 8. FLOOR I ENVIRONMENT — THRESHOLDS — P0/P1

## P0 first screen test
- one far background plate;
- one midground threshold architecture plate;
- one ground/foreground strip;
- one representative door/threshold prop.

## P1 environment set
Background families:
- entrance / shallow Threshold;
- deeper passage;
- institutional/administrative threshold room;
- elite staging room;
- boss staging room.

Modular props:
- doorframe variants ×4;
- sealed opening ×2;
- hanging chain/latch set ×3;
- brass/painted-metal hardware set;
- stone stair module ×2;
- wayfinding/signage fragments ×4;
- lantern/local-light object ×2;
- debris/repair patches ×4;
- water/reflection foreground variant;
- Below-seam anomaly module ×3.

Not every room requires a unique full background; module recombination should create controlled variety.

---

# 9. COMBAT UI — P0/P1

## P0
- combat frame/layout using runtime boxes + pixel decorative caps;
- player HP frame;
- enemy HP frame;
- enemy Instinct label treatment;
- dice tray/decision plane;
- Fight pair indicator;
- Spoils pair indicator;
- predicted margin treatment;
- BUMP icon/button;
- FLIP icon/button;
- Commit/Roll control treatment.

## P1
- item trigger strip;
- Artifact/Gear status icons;
- enemy rule banner;
- elite frame variation;
- boss frame/phase treatment;
- reward result panel;
- damage number treatment;
- keyboard focus state;
- touch/pressed state;
- disabled state.

Most panel bodies/text remain runtime-rendered; pixel assets handle icons/ornaments.

---

# 10. ITEM ART — P1

## Artifacts ×12
Each requires:
- 32×32 master icon;
- 16/24px derived UI representation if needed;
- one optional larger codex/reward illustration only if production budget permits.

## Gear ×8
Each requires:
- 32×32 icon;
- clear silhouette at 24×24;
- held/equipped overlay only when the item visibly appears on the Delver in combat.

## Contraband ×6
Each requires:
- 32×32 icon;
- consumed/used state if UI needs it.

Item icons should look like specific physical objects, not generic rarity symbols.

---

# 11. EVENT ART — P1/P2

Three events.

Baseline economical approach:
- one 160×90 or similar native scene vignette each;
- optional reusable character/object sprites layered into panel;
- choice icons where relevant.

Events should not require fully animated cinematic scenes in the vertical slice.

---

# 12. SHOP — P1

- shopkeeper/entity idle sprite or environmental focal object;
- shop panel ornaments;
- item-slot state treatment;
- coin icon;
- buy/disabled/insufficient-funds states;
- healing-service icon/effect.

Shopkeeper may be Below-native or original institutional entity; avoid content lock until D-stage.

---

# 13. MAP / ROOM UI — P1

- Floor I map background/frame;
- room node icons: Combat, Elite, Event, Shop, Boss;
- current-location marker;
- route line states: available / chosen / closed;
- Floor title treatment;
- seed/run metadata micro-treatment.

Use runtime lines/geometry where possible rather than baking every map as an image.

---

# 14. REWARD / RUN SCREENS — P1

- Spoils-quality frame treatments;
- item choice card/frame;
- Coin icon and gain effect;
- boss reward treatment;
- victory title treatment;
- death/run-summary treatment;
- `GO AGAIN` control state;
- seed copy/share icon.

---

# 15. COMMON FX — P1

- hit slash/impact ×2–3 variants;
- margin-damage number pop support;
- heal effect;
- Coin gain effect;
- item trigger pulse;
- enemy defeat dissolve/collapse support;
- boss phase shift effect;
- threshold anomaly shimmer;
- UI focus pulse.

FX remain concise and must preserve dice/number readability.

---

# 16. AUDIO-FACING ASSET LIST

Not produced as visual sprites, but must be tracked alongside the slice:

- Bonecast roll/clack/settle;
- Ironcast roll/clack/settle;
- select;
- lock;
- BUMP;
- FLIP;
- Fight win impact;
- player damage impact;
- Spoils qualify;
- reward reveal;
- Coin gain;
- room enter;
- elite cue;
- boss phase cue;
- player defeat;
- run victory;
- UI confirm/back/invalid.

Music requirements are controlled separately; one Floor I loop + boss variation is enough for the slice.

---

# 17. P0 PIPELINE PROOF PACKAGE

Before mass production, complete this exact package:

1. six Bonecast player faces;
2. six Ironcast enemy faces;
3. Fight / Spoils / enemy-lock / focus overlays;
4. BUMP and FLIP tests;
5. one Delver idle sprite;
6. one Latchling/native idle sprite;
7. one Threshold environment plate stack;
8. one combat screen assembled from the exported assets.

**Do not begin the other seven normal enemies until this package looks coherent in-browser.**

---

# 18. COMPLETION TRACKING

Each asset entry should eventually carry:

- ID;
- content owner/reference record if applicable;
- class;
- native dimensions;
- pivot;
- required states/frames;
- source status;
- native PNG status;
- browser-QA status;
- rights/provenance status;
- final approval.

A machine-readable manifest can replace this Markdown tracking once implementation begins.