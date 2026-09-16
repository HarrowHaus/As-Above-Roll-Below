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

The same high die that keeps you alive is also the die you want to leave behind for reward.

## Current status

### Combat foundation — validated for continued production

The contested-dice / margin-damage loop has passed its first mathematical and interactive prototype gate and is now the working combat canon.

`prototypes/combat-v1/index.html` tests:

- enemy-first visible rolls and deterministic Instinct;
- player 4d6 / commit exactly two;
- margin-based HP damage;
- 2d6 normal versus 3d6/highest-two elite pressure;
- BUMP and FLIP manipulation;
- competing Spoils-capture rules for later tuning.

The remaining Spoils-capture detail may change during balance, but the contested-roll foundation is no longer treated as an unresolved concept.

The original **ROLL / LOOT / REGRET** prototype is preserved under `prototypes/mechanics-v0/` as design history only.

### Content / Research — active B stage

The world premise, provenance system, humor rules, rights/sensitivity controls, first 50 reference candidates, original Below ecology, canonical terminology, and first verified records are now in the repo.

A central world rule is locked:

> **The Below preserves versions. It does not certify them.**

A thing appearing Below is not proof that the corresponding Above-world claim was literally true.

## Repository map

### Core design
- `docs/GAME_DESIGN_BIBLE.md` — canonical system design and locked pillars.
- `docs/COMBAT_MODEL.md` — contested-dice rules, simulations, balance envelope, remaining tuning questions.
- `docs/CONTENT_RESEARCH_BIBLE.md` — world, sourcing, humor, provenance, rights, and sensitivity canon.
- `docs/DICE_LORE.md` — diegetic explanation of casting, locking, Fight Dice, and Spoils.
- `docs/BELOW_ECOLOGY.md` — Residues, Convergences, Natives, and original Below content rules.
- `docs/TERMINOLOGY.md` — canonical vocabulary.

### Next production layers
- `docs/ART_BIBLE.md` — production visual-system scaffold.
- `docs/VERTICAL_SLICE_CONTENT.md` — Floor I specification scaffold.

### Research
- `docs/research/CORPUS_INVENTORY.md` — discovery-source map.
- `docs/research/REFERENCE_CANDIDATES_001.md` — first 50 candidate subjects plus holds/exclusions.
- `docs/research/verified/` — independently sourced reference records.

### Prototypes
- `prototypes/combat-v1/` — current combat laboratory.
- `prototypes/mechanics-v0/` — superseded first mechanics prototype.

## Production order

A. Game Design Bible — complete enough to proceed  
A1. Combat validation — first gate passed  
B. Content / Research Bible — **active**  
C. Art Bible  
D. Vertical Slice Content Sheet  
Then: assets → implementation → automated testing → playtesting → balance → polish.

## Design rule

Strip away the art, names, and jokes. Put four dice on the screen and ask the player to choose two. If that decision is not interesting, nothing else can save the game.
