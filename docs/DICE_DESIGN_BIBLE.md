# As Above, Roll Below — Dice Design Bible

**Version:** 0.1  
**Status:** C-stage active canon  
**Purpose:** define the dice as the game's primary visual, mechanical, audio, and lore objects.

---

# 1. DESIGN MANDATE

The dice must be memorable enough that a screenshot is identifiable as **As Above, Roll Below** before the viewer recognizes a specific monster.

They are not generic UI cubes. They are:

- the player's main decision surface;
- recurring physical props;
- lore-bearing casting tools;
- combat-state indicators;
- reward-state indicators;
- manipulation targets;
- a major source of tactile game feel.

If the dice feel cheap, the whole game feels cheap.

---

# 2. DIEGETIC ROLE

In the Below, delvers use **casting lots** to read and force local settlement between unresolved possibilities. The game's history inspiration comes from the broad historical use of lots/dice/astragali in games and divinatory practices, but the actual Below mechanism is original fiction.

Mechanical interpretation:

- the monster casts/locks its outcome;
- the player casts four possibilities;
- committing two spends those outcomes on the clash;
- the unspent pair can become Spoils if the clash succeeds.

The dice therefore represent **available outcomes**, not mana crystals or casino gambling.

---

# 3. STANDARD FORM

## Native cell
**48 × 48 pixels** per standard combat die.

The visible die normally occupies ~38–44px of the cell, leaving room for state marks and animation overshoot.

## Perspective
Use one stable three-quarter/pseudo-isometric presentation:

- primary/current face dominates the read;
- secondary side/top planes communicate physical volume;
- the rolled value is visually emphasized on the primary face;
- side-face pips must never make the current value ambiguous.

If necessary for accessibility, the runtime UI also presents a small numeric value adjacent to/below the die.

## Corner profile
Player dice: slightly softened handled corners.  
Enemy dice: harder, chipped, or heavier corners.

Do not make either family look like glossy casino dice.

---

# 4. PHYSICAL FACE LOGIC

Opposite faces are canonical:

- `1 ↔ 6`
- `2 ↔ 5`
- `3 ↔ 4`

The FLIP mechanic must visually respect this relationship.

A standard player die's six source faces should be authored as one coherent object family, not six separately improvised cubes.

---

# 5. PLAYER BASELINE FAMILY — BONECAST

Working name: **Bonecast**.

Visual construction:

- old-bone / warm ivory body;
- dark charcoal recessed pips;
- tiny tarnished-brass registration marks or corner inlay;
- subtle staining/wear concentrated around edges and pip recesses;
- matte to satin surface, never plastic gloss;
- enough irregularity to feel handled, but still clearly cubic and engineered.

Color role:

- body: Old Bone / Pale Bone;
- pips: Void Charcoal;
- tiny hardware: Tarnished Brass;
- manipulation/state effects provided by overlays rather than repainting the whole die.

The baseline die should feel valuable but replaceable: a field instrument, not a jeweled royal relic.

---

# 6. ENEMY BASELINE FAMILY — IRONCAST

Working name: **Ironcast**.

Visual construction:

- blackened iron / stone-like body;
- pale bone/ash pips;
- hard chipped edge clusters;
- occasional oxide/brown wear;
- slightly heavier-looking perspective/shadow;
- geometric registration cuts distinct from player brass details.

Enemy dice must remain recognizable in grayscale.

Never distinguish enemy dice solely by red color.

---

# 7. ELITE / BOSS DICE

Boss dice may break baseline materials but must still use the same state grammar.

Possible directions:

- sealed brass;
- black glass;
- painted institutional ceramic;
- lettered/numbered grid dice;
- stone with embedded archival tags;
- Below-native material.

Boss dice can be **64 × 64 native cells** when the encounter presentation gives them additional emphasis.

A boss should not receive a weird die merely because it is a boss. The material/face system should relate to the boss's authored dice engine.

---

# 8. MODULAR STATE ARCHITECTURE

Do **not** produce six separate full dice sprites for every gameplay state if an overlay can communicate the state consistently.

Production structure:

## Base layer
- material family + rolled face.

## State overlay layer
- selection bracket;
- Spoils bracket/halo;
- lock frame;
- disabled/sealed treatment;
- manipulation marker;
- persistent effect marker.

## VFX layer
- BUMP tick;
- FLIP motion trail;
- COPY relation line;
- TRANSMUTE rewrite pixels;
- reward confirmation.

This keeps the asset count controlled and permits material variants without multiplying every state by six faces.

---

# 9. REQUIRED STATES

## Neutral
No special frame. Clear physical object.

## Hover / Focus
Small lift or light edge emphasis plus cursor/focus treatment. Keyboard focus must be just as visible as pointer hover.

## Fight Selected
Primary combat state.

Visual grammar:
- angular magenta/crimson corner brackets;
- crossed-line / blade-like tiny motif or inward-facing marks;
- slight 1–2px lift;
- no need for large glow.

Must remain readable without color.

## Spoils Potential
Brass/gold lower-corner cradle, subtle sparkle/notch geometry, or distinct base platform.

Spoils should look desirable without overpowering Fight selection.

## Enemy Unlocked
Enemy material only; no lock frame.

## Enemy Locked
Cyan/teal registration clamp or four-corner lock frame settles around die.

The geometry—not cyan alone—communicates lock state.

## Persistent LOCK
Distinct from ordinary enemy lock. Use a stronger retained bracket/seal mark that remains visible between rounds.

## BUMPED
A small `+1` / `−1` step marker appears and the face resolves. The final die then returns to its ordinary state plus a short-lived manipulation tag if needed.

## FLIPPED
Physical half-turn animation. End state is the actual opposite value.

## Disabled / Sealed
Desaturate/darken body plus a diagonal registration bar / wax-like seal / broken input frame. Do not use only reduced opacity.

## Cursed / Modified
Reserved overlay slot for item/monster-specific persistent states. Avoid creating a universal purple-glow curse shorthand.

---

# 10. VALUE READABILITY

The current rolled value must be readable in **under 250 ms** during ordinary play.

Rules:

- pips are large enough to parse at 48px;
- perspective cannot hide the primary face;
- background contrast around dice is controlled;
- state effects cannot cover pips;
- current value may be repeated as a small runtime numeral for accessibility;
- dice remain readable in grayscale and under common color-vision deficiencies.

At native size, the player should never ask which number a die is showing.

---

# 11. ANIMATION GRAMMAR

Animations are short and tactile.

## Roll
Target: **6–8 authored/derived visual beats across ~350–650 ms**.

Implementation may combine:
- 2D translation/rotation;
- a compact set of tumbling sprites;
- tiny squash/impact on landing;
- 1–2px bounce.

Do not require a unique frame-by-frame roll animation for every possible result. The animation can resolve into the final face at settle.

## Select
~80–150 ms.
- lift 1–2px;
- bracket snaps in;
- short dry click.

## Lock
~150–250 ms.
- frame/clamp closes around die;
- small physical `tch`/latch sound.

## BUMP
~150–250 ms.
- face value visibly steps;
- upward/downward tick;
- tiny pip/number shift.

## FLIP
~250–450 ms.
- clear half-turn;
- midpoint can silhouette the cube;
- opposite face lands cleanly.

## COPY
Source and target receive a brief directional line/echo; target face changes after the relation is established.

## TRANSMUTE
Pips/inscription rewrite structurally; avoid particle dissolve as the only explanation.

## Spoils Qualify
Brief brass confirmation pulse after a damaging player win. It should feel rewarding but never delay the next decision.

---

# 12. SOUND IDENTITY

Dice require their own material sound families.

## Bonecast
- hard ivory/bone clack;
- light wooden/stone table resonance;
- crisp, dry settle.

## Ironcast
- denser stone/metal knock;
- shorter higher-frequency edge tick;
- heavier settle.

## UI-state sounds
- Fight select: precise dry click;
- Spoils qualify: small warm metallic tick/chime;
- Lock: latch/clasp;
- BUMP: small calibrated tick;
- FLIP: twist + landing click;
- invalid action: muted blocked knock, not alarm beep.

Sound references describe material behavior, not literal recordings that must be copied.

---

# 13. SHADOW / CONTACT

Dice should feel placed in the same world as the combat UI.

- compact contact shadow;
- no blurry photo-real ambient occlusion;
- shadow rendered as pixel clusters / simple transparent sprite or runtime effect;
- selected dice may lift slightly, shortening/softening the contact shadow;
- enemy dice can use a harder shadow footprint.

---

# 14. PLAYER / ENEMY DIFFERENTIATION

Differentiation uses at least three channels:

1. material/value family;
2. edge/corner language;
3. state-frame geometry.

Color is a fourth channel, not the only one.

At a glance:

- Bonecast = warm, pale, handled, field-crafted;
- Ironcast = dark, hard, heavy, hostile.

---

# 15. ARTIFACT-MODIFIED DICE

Artifacts should usually modify the **state layer or a small physical property**, not replace the entire die set.

Good:
- brass ring around a specific face;
- one cracked edge;
- tiny seal on marked dice;
- pip shape changed for a mechanic;
- controlled ghost duplicate during COPY.

Bad:
- every Artifact completely reskins all six dice;
- unreadable rainbow rarity skins;
- state effects hidden inside cosmetic material noise.

Cosmetic die families may exist later, but mechanics remain readable through the canonical overlays.

---

# 16. PRODUCTION FILES — FIRST DICE FAMILY

Minimum source deliverables:

## Base faces
`player_bonecast_face_1.png` … `player_bonecast_face_6.png`

`enemy_ironcast_face_1.png` … `enemy_ironcast_face_6.png`

48×48, transparent PNG masters.

## Shared overlays
- `die_state_fight.png`
- `die_state_spoils.png`
- `die_state_enemy_locked.png`
- `die_state_persistent_lock.png`
- `die_state_disabled.png`
- `die_state_focus.png`

48×48, transparent.

## Manipulation FX
- BUMP up/down effect frames;
- FLIP intermediary frames or transform-safe silhouette frames;
- COPY relation effect;
- TRANSMUTE rewrite effect;
- Spoils-confirm effect.

## Optional shadow
`die_shadow_48.png`

---

# 17. QUALITY GATES

Every die family must pass:

### Native-size test
Can a player identify value/state instantly at 1×?

### Grayscale test
Can player/enemy and selected/locked states still be distinguished?

### Contact-sheet test
Do all six faces look like one physical object family?

### Flip test
Do opposites resolve correctly?

### Overlay test
Do Fight/Spoils/Lock overlays fit every face/material without collisions?

### Mobile test
At the smallest supported combat presentation, do pips and state marks remain legible?

### Alpha test
No colored matte/fringe; no accidental semi-transparent halo.

---

# 18. FIRST PRODUCTION TARGET

The first true asset family should be:

1. Bonecast faces 1–6;
2. Ironcast faces 1–6;
3. Fight overlay;
4. Spoils overlay;
5. enemy-lock overlay;
6. focus overlay;
7. BUMP test;
8. FLIP test.

Only after these survive an in-browser contact sheet should the project expand into rare/boss dice.