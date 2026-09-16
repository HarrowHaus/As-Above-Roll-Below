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

Preproduction.

The original single-file **ROLL / LOOT / REGRET** prototype proved the basic `roll four / commit two / leftovers become loot` interaction. Its design history is archived under `prototypes/mechanics-v0/` and is **not** the current combat model.

The current design replaces fixed monster Threat checks with **contested visible dice rolls and margin-based HP damage**.

### Current playable test

`prototypes/combat-v1/index.html` is the current combat prototype. It tests:

- enemy-first visible rolls and locking;
- contested totals;
- margin-based HP damage;
- 2d6 normal versus 3d6/highest-two elite pressure;
- BUMP and FLIP manipulation;
- FINAL BLOW versus BEST SUCCESS Spoils capture.

It is a mechanics laboratory, not production code or final art direction.

A-stage system design and the first mathematical combat pass are complete enough to support B-stage research. The first verified real-world reference record is now in the repository and establishes the provenance standard for future content.

## Repository map

- `docs/GAME_DESIGN_BIBLE.md` — canonical system design and locked pillars.
- `docs/COMBAT_MODEL.md` — contested-dice rules, simulations, balance envelope, open test questions.
- `docs/CONTENT_RESEARCH_BIBLE.md` — world, provenance, sourcing, humor, and reference-verification rules.
- `docs/ART_BIBLE.md` — production visual-system scaffold.
- `docs/VERTICAL_SLICE_CONTENT.md` — complete Floor I specification scaffold.
- `docs/research/CORPUS_INVENTORY.md` — discovery-source map for the podcast/research corpus.
- `docs/research/verified/` — independently verified real-world reference records.
- `prototypes/combat-v1/` — current contested-dice combat prototype.
- `prototypes/mechanics-v0/` — superseded prototype notes and legacy direction.

## Production order

A. Game Design Bible  
A1. Combat validation  
B. Content / Research Bible  
C. Art Bible  
D. Vertical Slice Content Sheet  
Then: assets → implementation → automated testing → playtesting → balance → polish.

## Design rule

Strip away the art, names, and jokes. Put four dice on the screen and ask the player to choose two. If that decision is not interesting, nothing else can save the game.
