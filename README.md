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

The contested-dice / margin-damage loop has passed its first mathematical and interactive prototype gate and is the working combat canon.

`prototypes/combat-v1/index.html` tests enemy-first visible rolls, deterministic Instinct, player 4d6/commit-two, margin damage, BUMP/FLIP, and competing Spoils-capture rules.

### Content / Research — first B-stage gate passed

The world premise, provenance system, humor rules, rights/sensitivity controls, first 50 reference candidates, original Below ecology, terminology, dice lore, and an initial verified-reference set are in the repo.

Central world rule:

> **The Below preserves versions. It does not certify them.**

A thing appearing Below is not proof that the corresponding Above-world claim was literally true.

### Art / Asset Production — active C stage

The lead visual direction is now **pixel-first, dark-fun-creepy, and dice-forward** rather than painterly illustration.

Every approved art decision is constrained by one production rule:

> **If it cannot be isolated, cleaned, downsampled, animated, exported, and used in the actual browser game, it is concept art—not production art.**

The first production target is the dice family: Bonecast player dice, Ironcast enemy dice, modular state overlays, and manipulation tests.

## Repository map

### Core design
- `docs/GAME_DESIGN_BIBLE.md` — canonical systems and design pillars.
- `docs/COMBAT_MODEL.md` — contested-dice simulations, balance envelope, remaining tuning questions.
- `docs/CONTENT_RESEARCH_BIBLE.md` — world, sourcing, humor, provenance, rights, and sensitivity canon.
- `docs/DICE_LORE.md` — diegetic explanation of casting, locking, Fight Dice, and Spoils.
- `docs/BELOW_ECOLOGY.md` — Residues, Convergences, Natives, and original Below content rules.
- `docs/TERMINOLOGY.md` — canonical vocabulary.

### Art / production
- `docs/ART_BIBLE.md` — pixel-first production visual system.
- `docs/DICE_DESIGN_BIBLE.md` — dice materials, faces, states, animation, sound, and export design.
- `docs/ASSET_PRODUCTION_SPEC.md` — source→runtime pipeline and game-ready definition.
- `docs/VERTICAL_SLICE_ASSET_MANIFEST.md` — required visual/audio asset inventory for Floor I.
- `docs/VERTICAL_SLICE_CONTENT.md` — Floor I gameplay/content specification scaffold.

### Research
- `docs/research/CORPUS_INVENTORY.md` — discovery-source map.
- `docs/research/REFERENCE_CANDIDATES_001.md` — first 50 candidate subjects plus holds/exclusions.
- `docs/research/verified/` — independently sourced reference records.

### Prototypes
- `prototypes/combat-v1/` — current contested-dice combat laboratory.
- `prototypes/mechanics-v0/` — superseded first mechanics prototype.

## Production order

A. Game Design Bible — complete enough to proceed  
A1. Combat validation — first gate passed  
B. Content / Research Bible — first gate passed; continues alongside content authoring  
C. Art Bible + production pipeline — **active**  
D. Vertical Slice Content Sheet  
Then: game-ready assets → implementation → automated testing → playtesting → balance → polish.

## Design rule

Strip away the art, names, and jokes. Put four dice on the screen and ask the player to choose two. If that decision is not interesting, nothing else can save the game.