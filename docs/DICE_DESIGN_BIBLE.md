# As Above, Roll Below — Dice Design Bible

**Version:** 0.2  
**Status:** C-stage active canon  
**Purpose:** define the dice as the game's primary visual, mechanical, audio, lore, and information objects.

---

# 1. DESIGN MANDATE

The dice must be memorable enough that a screenshot is identifiable as **As Above, Roll Below** before the viewer recognizes a particular monster.

They are not generic UI cubes. They are:

- the player's main decision surface;
- recurring physical props;
- lore-bearing casting tools;
- combat-state indicators;
- reward-state indicators;
- manipulation targets;
- a major source of tactile game feel.

If the dice feel cheap, confusing, or physically dishonest, the whole game feels cheap.

---

# 2. DIEGETIC ROLE

In the Below, delvers use **casting lots** to read and force local settlement between unresolved possibilities. Historical lots/dice/astragali are inspiration for the concept; the Below mechanism itself is original fiction.

Mechanical interpretation:

- the monster casts and locks an outcome;
- the player casts four possibilities;
- committing two spends those outcomes on the clash;
- the unspent pair can become Spoils if the clash succeeds.

The dice represent **available outcomes**, not casino gambling or mana.

---

# 3. CANONICAL GAMEPLAY VIEW — FRONT-FACING

## Decision-state rule

All standard gameplay dice settle into a **front-facing single-face presentation**.

Only the current rolled face is readable.

No numbered side planes are visible during any state in which the player is expected to evaluate or choose dice.

This is canonical because it gives the game:

- immediate value readability;
- no impossible side-face combinations;
- no competition between current value and decorative side values;
- a physically trustworthy FLIP mechanic;
- much cleaner mobile presentation;
- one stable geometry for overlays and animation;
- simpler, more reliable asset production.

## Physicality without side faces

The die must still feel like a physical object through:

- a chunky perimeter/bevel;
- edge highlights;
- material wear;
- recessed or inset pips;
- a compact contact shadow;
- subtle face thickness at the rim if useful;
- tiny lighting changes on selection/hover.

The target is **a heavy die viewed squarely at one face**, not a flat card with pips.

## Isometric / three-quarter use

Three-quarter dice are allowed only for:

- marketing art;
- codex/object closeups;
- inventory showcase art;
- transient roll/tumble frames where side values are unreadable or abstracted.

They are **not** the normal combat decision state.

The previous isometric V0 family is retained only as material/style reference and is not game-ready geometry.

---

# 4. NATIVE CELL AND MASTER TEMPLATE

## Standard combat die

Native cell: **48 × 48 pixels**.

The physical face should occupy roughly **38–42 px** square within the cell, leaving room for overlays and 1–2 px animation lift.

Pivot: center `(24,24)`.

## Master geometry

Every standard die family derives from one locked face template:

- same outer silhouette;
- same bevel depth;
- same pip grid;
- same light direction;
- same contact baseline;
- same overlay-safe margins.

Material families may alter wear, trim, pip treatment, and microtexture, but **not the underlying geometry** unless a boss-specific die is intentionally a different object class.

---

# 5. FACE / PIP LOGIC

Canonical opposite relationships remain:

- `1 ↔ 6`
- `2 ↔ 5`
- `3 ↔ 4`

Because standard decision-state dice show only one face, impossible adjacent-face configurations cannot occur.

## Pip placement

Use standard d6 pip arrangements:

- 1: center;
- 2: opposing diagonal;
- 3: diagonal + center;
- 4: four corners;
- 5: four corners + center;
- 6: two vertical columns of three.

Pip geometry must be authored from a shared grid, not re-improvised per face.

## Readability target

A rolled value must be identifiable in under **250 ms** at native size.

State overlays may never cover or visually merge with pips.

---

# 6. PLAYER BASELINE FAMILY — BONECAST

Working family name: **Bonecast**.

Visual construction:

- old-bone / warm ivory face;
- dark charcoal recessed pips;
- tiny tarnished-brass corner or registration details;
- staining/wear concentrated around outer rim and pip recesses;
- matte/satin material;
- minor irregularity without losing engineered geometry.

The face should feel like a repeatedly handled field instrument: valuable, strange, practical.

It should not look like plastic, polished casino acrylic, or a jeweled royal relic.

---

# 7. ENEMY BASELINE FAMILY — IRONCAST

Working family name: **Ironcast**.

Visual construction:

- blackened iron / dark mineral face;
- pale bone/ash inset pips;
- harder chipped rim language;
- oxide wear;
- geometric cuts or registration marks distinct from player brass details;
- visibly heavier contact/shadow language.

Enemy dice must remain distinguishable from player dice in grayscale.

Color is supporting information, not the sole discriminator.

---

# 8. BOSS / SPECIAL DICE

Boss dice may use 64×64 native cells when presentation warrants it.

Possible material families include:

- sealed brass;
- black glass;
- painted institutional ceramic;
- letter-grid faces;
- stone with embedded tags;
- Below-native matter.

Special dice must still preserve value readability and the canonical state grammar unless their authored boss mechanic deliberately changes the information model.

---

# 9. MODULAR STATE ARCHITECTURE

Do not repaint all six faces for every state.

Runtime composition:

## Base
`material family + value face`

## State overlay
- focus/hover;
- Fight selected;
- Spoils potential;
- enemy locked;
- persistent LOCK;
- disabled/sealed;
- mechanic-specific mark.

## VFX
- BUMP;
- FLIP;
- COPY;
- TRANSMUTE;
- Spoils qualify.

This architecture is mandatory because it preserves geometry and prevents asset multiplication.

---

# 10. REQUIRED STATES

## Neutral
Base face only with compact contact shadow.

## Focus / Hover
1 px lift and a clear geometric outline/bracket. Keyboard focus receives the same clarity as pointer hover.

## Fight Selected
Primary selection state.

- strong angular corner brackets;
- slight lift;
- magenta/crimson may support the state;
- geometry alone must remain understandable in grayscale.

## Spoils Potential
Distinct lower cradle/bracket or corner treatment. Brass/gold may support it. It should feel desirable but subordinate to Fight selection.

## Enemy Locked
Four-corner clamp / registration frame closes around the enemy die.

## Persistent LOCK
Stronger retained seal/frame that visibly survives between rounds.

## Disabled / Sealed
Darkened/desaturated base plus obvious crossing/bar/seal geometry. Never opacity-only.

---

# 11. MANIPULATION ANIMATION GRAMMAR

## Roll
During a short roll animation, the die may tumble through abstract edge-on / partial-cube frames. Readable numbered side planes are unnecessary.

At settle, it snaps/resolves into the canonical front-facing value face.

Target duration: **350–650 ms**.

## Select
~80–150 ms.

- 1–2 px lift;
- bracket snaps in;
- contact shadow responds.

## Lock
~150–250 ms.

- frame/clamp closes around die;
- dry latch sound.

## BUMP
~150–250 ms.

- value changes by exactly one;
- face swap is clearly directional;
- tiny up/down tick supports interpretation;
- no generic magical explosion.

## FLIP
~250–450 ms.

The die briefly rotates edge-on or compresses to a narrow transitional silhouette, then resolves to its **true opposite value**:

- 1 → 6 / 6 → 1;
- 2 → 5 / 5 → 2;
- 3 → 4 / 4 → 3.

The transition may imply a physical half-turn even though the settled state is front-facing.

## COPY
Show source-target relation first, then replace target face.

## TRANSMUTE
Pip structure visibly rewrites into the target face. Avoid particle dissolve as the sole explanation.

## Spoils Qualify
Short warm confirmation around the Spoils overlay after damaging player success.

---

# 12. SOUND IDENTITY

## Bonecast
- hard ivory/bone clack;
- light table resonance;
- crisp dry settle.

## Ironcast
- denser stone/metal knock;
- harder edge tick;
- heavier settle.

## State cues
- Fight: dry precision click;
- Spoils qualify: restrained warm metallic tick;
- LOCK: clasp/latch;
- BUMP: calibrated mechanical tick;
- FLIP: twist + landing click;
- invalid action: muted blocked knock.

---

# 13. ARTIFACT MODIFICATIONS

Artifacts should usually change an overlay or a small physical feature rather than replacing the entire die family.

Good:

- brass ring around one face/state;
- one cracked rim;
- tiny seal;
- marked pip;
- ghost duplicate for COPY;
- specific registration notch.

Bad:

- complete reskin per Artifact;
- rainbow rarity noise;
- mechanics hidden by cosmetic treatment.

---

# 14. FIRST PRODUCTION FILES — V1 FRONT-FACING

## Base faces

`die_player_bonecast_face_1.png` … `die_player_bonecast_face_6.png`

`die_enemy_ironcast_face_1.png` … `die_enemy_ironcast_face_6.png`

Each:

- 48×48;
- transparent PNG;
- front-facing;
- identical master geometry within family;
- one readable face only.

## Shared overlays

- `die_state_focus.png`
- `die_state_fight.png`
- `die_state_spoils.png`
- `die_state_enemy_locked.png`
- `die_state_persistent_lock.png`
- `die_state_disabled.png`

## FX

- BUMP up/down;
- FLIP transitional silhouette/frame(s);
- COPY relation line;
- TRANSMUTE rewrite effect;
- Spoils qualify.

---

# 15. QUALITY GATES

Every family must pass:

### Geometry gate
All six faces have identical outer silhouette, rim/bevel geometry, scale, pivot, and light direction.

### Native-size gate
Value and state read instantly at 1×.

### Grayscale gate
Player/enemy and major states remain distinguishable.

### Flip gate
Every opposite pair resolves correctly.

### Overlay gate
Every state overlay fits every value/material without colliding with pips.

### Pixel gate
No unintended antialias fringe, broken clusters, or source-resolution noise.

### Mobile gate
The smallest supported runtime presentation retains value/state readability.

### Alpha gate
No matte halo or accidental background pixels.

---

# 16. DEPRECATED V0 ISOMETRIC SET

The first isometric Bonecast/Ironcast experiment is **not canonical runtime art**.

It is retained only for:

- material inspiration;
- color/value reference;
- trim ideas;
- evidence of the production learning path.

Reasons for rejection:

- inconsistent perspective;
- impossible/illogical visible side-face numbering;
- side values compete with the result face;
- poor fit for FLIP logic;
- unnecessary mobile information noise.

Do not build future runtime dice by correcting individual V0 cubes. Rebuild from the front-facing master template.

---

# 17. PRODUCTION ORDER

1. lock one front-facing 48×48 silhouette/template;
2. author Bonecast face 1;
3. derive faces 2–6 using the same pip grid and geometry;
4. author Ironcast material using the same geometry;
5. derive Ironcast 2–6;
6. build overlays separately;
7. test at native size in a real combat UI;
8. only then author manipulation FX and special dice.

The dice are a focal point. **Logical correctness and instantaneous readability outrank decorative complexity.**