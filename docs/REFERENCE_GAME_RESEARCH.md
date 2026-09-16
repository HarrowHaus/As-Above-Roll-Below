# As Above, Roll Below — Comparative Game Systems Research

**Status:** preproduction research reference

This document records structural lessons from relevant games. It is not a cloning brief. AARB keeps its own core: monster casts first, player rolls 4d6, commits exactly two Fight Dice, leaves two as potential Spoils, and margin determines damage.

## Dice-first references

### Munchkin
Useful: instantly readable monster confrontation; victory directly grants Level + Treasure; failure has specific consequences; escalating equipment produces the emotional greed loop.

AARB take: preserve `meet absurd thing → get greedy → survive → acquire build-changing junk → immediately want another encounter`.

Reject: multiplayer kingmaking, pure additive combat-strength inflation, social negotiation, large exception-card ruleset.

### Dicey Dungeons
Useful: dice are first-class turn objects; manipulation is central; levels provide predictable growth while equipment defines play; enemies and characters use readable dice rules.

AARB take: small reusable manipulation vocabulary; Level provides stability while loot defines identity; dice readability outranks decoration.

Reject: dice-slotting into equipment as the main interaction; large backpack; automatically adding many dice through leveling.

### Slice & Dice
Useful: each turn is a mini-puzzle; frequent post-fight improvement; items and hero levels are distinct; absurd combinations are intentional; information is explicit.

AARB take: every roll should remain a small evaluable puzzle; frequent meaningful improvement; powerful combinations built from individually readable rules.

Reject: five-character party and baseline reroll economy.

### One Deck Dungeon
Useful: one encounter reward can become Item, Skill, Potion, or XP; levels restrict item/skill capacity; replacing loot can feed XP.

AARB take: unwanted loot should still convert into useful run value; hard inventory limits create meaningful replacement; refusing/replacing rewards should not feel like throwing value away.

Reject: challenge-box dice placement, multiple colored attribute dice, time-deck attrition.

### Die in the Dungeon
Useful: persistent relics plus tactical consumables; character identity changes how dice are interpreted; dice systems can support deep buildcraft.

AARB take: Artifact = persistent rule change; Contraband = tactical intervention; characters alter the same core roll rather than get separate minigames.

Reject: custom die-face deck construction and spatial dice-board placement.

### Into the Breach
Useful: enemy intent is explicit before player action; tactical depth comes from consequences, not hidden percentages.

AARB take: monster dice, Instinct, locked total, predicted margin and deterministic triggers must be visible before COMMIT.

## Build / loot references

### Slay the Spire
Useful: most fights feed a choose-one reward; rewards can be skipped; optional elites correspond to premium relic value; visible routing; shops provide build correction.

AARB take: post-fight three-offer Loot Draft; skip option; premium Elite reward expectation; visible room category; hard limits make taking everything impossible.

### Balatro
Useful: limited persistent slots create replacement pressure; a few rule-changing Jokers create run identity; economy can be a build axis; bosses alter familiar rules.

AARB take: keep four Artifact slots; prefer rule reinterpretation over passive stat piles; allow economy-oriented Artifacts; bosses are authored rule problems, never dynamic anti-build counters.

### Hades
Useful: route exits often expose reward category; run-power rewards and persistent resources have different jobs; difficulty modifiers change rules; repeated power choices create run identity.

AARB take: later route map can show broad reward/room identity; run power and meta progression remain separate; higher difficulties modify encounter/economy rules instead of merely adding HP.

### Risk of Rain 2
Useful: item interaction density creates memorable builds; repeated items have explicit scaling rules; horizontal unlocks expand the pool.

AARB take: interaction matters more than rarity. Duplicates are non-stacking by default in the vertical slice; any future stackable effect needs an explicit scaling law so certainty/invulnerability cannot accidentally erase dice decisions.

### Monster Train
Useful: a small number of identity anchors guide a huge content pool; upgrades can deepen already-owned build pieces.

AARB take: Character + Techniques + Gear + Artifacts is enough run identity. Consider item upgrading only after baseline loot is proven.

### Backpack Hero
Useful: inventory limitation itself is gameplay; new loot can be bad because capacity/structure matters.

AARB take: retain hard visible slot limits. Do not add spatial inventory; Fight/Spoils already supplies the game's main spatial decision.

### Noita
Useful: small rules combine into surprising emergent results; knowledge is meaningful progression; build depth comes from composable effects rather than rarity.

AARB take: shared triggers/verbs must drive Artifacts. Do not hard-code pairwise combo text.

### Peglin
Useful: a familiar roguelite shell can support one unusual core combat interaction.

AARB take: do not keep inventing new combat minigames. Build route, loot, shop, event and boss systems around the one great dice interaction.

### Wildfrost
Useful: visible enemy timing; route/build clarity; horizontal unlocks and challenge runs.

AARB take: visible enemy state; future Daily Seed / Challenge modes; no hidden arithmetic.

### Brotato
Useful: short combat-to-shop cadence; tier-gated item availability; escalating reroll costs; shop is a major build-correction layer.

AARB take: no baseline shop reroll yet. If later required, use escalating cost instead of free fishing.

### FTL
Useful: randomized routes; encounters have multiple solutions; build tags unlock contextual event options; one general currency supports many upgrades.

AARB take: Events should occasionally expose choices based on current Gear/Artifacts/Contraband; keep one Coin economy.

### Darkest Dungeon
Useful: attrition makes route length matter and retreat has weight.

AARB rejection: no universal Stress/Sanity bar. HP + greed + economy + inventory + route risk already supply enough pressure.

### Shogun Showdown
Useful: a compact action inventory stays deep through timing and interactions.

AARB take: quality/interactions of build pieces matter more than quantity.

---

# Cross-game consensus

1. Every combat should advance build, economy, Level, route opportunity, or unlock knowledge.
2. Optional premium danger must correspond to premium expected value.
3. Small inventories work when items meaningfully change rules.
4. Tactical consequences should be previewed before irreversible commitment.
5. Level and loot need different jobs.
6. Rule-changing items are more valuable to this design than a giant RPG stat sheet.
7. One run currency is sufficient.
8. Horizontal metaprogression fits the project better than permanent damage/HP inflation.
9. A run needs describable identity anchors.
10. The long-term content engine must be data-driven and composable rather than hundreds of bespoke hard-coded item interactions.

# Production consequences

- Core combat stays singular.
- Best Successful Spoils remains the testable loot-quality engine.
- Standard combat reward is a three-offer Loot Draft.
- Gear / Artifact / Contraband remain distinct functional categories.
- Six run Levels provide HP and sparse Techniques, not automatic universal Fight inflation.
- One Coin economy.
- Visible room categories and premium Elite rewards.
- Horizontal meta unlocks.
- No mana, stress, crafting currency, durability, encumbrance, or giant attribute sheet in the baseline game.
