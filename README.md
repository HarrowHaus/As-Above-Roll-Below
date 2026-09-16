# As Above, Roll Below

**As Above, Roll Below** is a solo browser dice roguelite in preproduction.

## Core interaction

Every combat round:

1. The monster rolls first and visibly locks dice according to its Instinct.
2. The player rolls **4d6**.
3. The player may use build-granted manipulation.
4. The player commits exactly **2 Fight Dice**.
5. The remaining **2 dice are potential Spoils**.
6. Compare locked totals.
7. **Damage equals the winning margin.**

If the player wins the clash, the monster loses HP equal to the difference and that round's leftover pair qualifies as Spoils. If the monster wins, the player loses HP equal to the difference and earns no Spoils from that round. A tie deals no damage.

The design goal is simple to learn and increasingly difficult to evaluate: the same high die that keeps you alive is also the die you want to leave behind for loot.

## Current status

Preproduction. The original single-file prototype proved the basic `roll four / commit two / leftovers become loot` interaction. It is archived under `prototypes/mechanics-v0/` and is **not** the current combat model.

The current design replaces fixed monster Threat checks with **contested visible dice rolls and margin-based HP damage**.

## Repository map

- `docs/GAME_DESIGN_BIBLE.md` — canonical system design and locked pillars.
- `docs/COMBAT_MODEL.md` — contested-dice rules, simulations, balance envelope, open test questions.
- `docs/CONTENT_RESEARCH_BIBLE.md` — scaffold for world, provenance, sourcing, humor, and reference verification.
- `docs/ART_BIBLE.md` — scaffold for the production visual system.
- `docs/VERTICAL_SLICE_CONTENT.md` — scaffold for the complete Floor I content specification.
- `prototypes/mechanics-v0/` — superseded mechanics prototype and its original notes.

## Production order

A. Game Design Bible  
A1. Combat validation  
B. Content / Research Bible  
C. Art Bible  
D. Vertical Slice Content Sheet  
Then: assets → implementation → automated testing → playtesting → balance → polish.

## Design rule

Strip away the art, names, and jokes. Put four dice on the screen and ask the player to choose two. If that decision is not interesting, nothing else can save the game.
