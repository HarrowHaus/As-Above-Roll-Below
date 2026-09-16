# As Above, Roll Below — Decision Ledger

**Purpose:** prevent old prototypes, experiments, or stale documents from silently becoming canon again.

Statuses:

- **LOCKED** — treat as production rule unless playtesting provides concrete reason to reopen.
- **PROVISIONAL** — current production target; expected to tune without redesign.
- **DEFERRED** — intentionally not decided/implemented yet.
- **REJECTED** — explored and explicitly not part of baseline design.

---

# LOCKED

## Identity
- Title: **As Above, Roll Below**.
- Genre: solo browser dice roguelite / turn-based dungeon crawler.
- Central promise: safety and loot compete for the same dice.

## Combat
- Enemy casts first.
- Enemy locks visibly according to deterministic Instinct.
- Player always rolls 4d6 in baseline rules.
- Player commits exactly 2 Fight Dice.
- Remaining exactly 2 dice are potential Spoils.
- Damage equals winning margin.
- Tie deals no baseline damage.
- Player/enemy use numerical HP bars; no parallel heart/Resolve system.
- No fixed baseline Threat target.
- No fixed baseline enemy Damage stat.
- Tactical deterministic arithmetic is previewed before COMMIT.
- **Final-Blow Spoils:** the two uncommitted dice on the final damaging player win determine encounter reward quality.

## Dice presentation
- Settled gameplay dice are front-facing single-face sprites.
- No readable side-face values during decision state.
- Opposites: 1↔6, 2↔5, 3↔4.
- Isometric dice are marketing/reference only.

## Build structure
- Gear / Artifacts / Contraband are distinct categories.
- Gear slots: Weapon, Armor, Utility.
- Artifact slots: 4.
- Contraband slots: 2.
- Character Techniques are separate from inventory.
- Artifacts are primary rule-changing build pieces.
- Universal CHEAT button removed; rule-breaking effects live in content.

## Run philosophy
- Levels keep you alive; Loot makes you weird.
- Level does not automatically provide universal Fight inflation.
- One ordinary run currency: Coins.
- Meta progression is horizontal by default.

## World / writing
- The Below preserves versions; it does not certify them.
- Real references require provenance separation between documented fact, claim/lore, and game fiction.
- Game takes jokes seriously; no constant self-aware indie-game quipping.

## Art
- Pixel-first, dark-fun-creepy, readable roguelite presentation.
- Dice are a focal visual object.
- Runtime art must be game-ready, not merely attractive concept art.

---

# PROVISIONAL

These are current targets and should be tuned with simulation/playtesting.

## Player
- starting Max HP: 20
- Level range: 1–6
- XP thresholds: 3 / 7 / 12 / 18 / 25
- each Level: Max HP +2, heal 2
- Techniques at Levels 3 and 5

## Spoils / Loot
- Spoils bands: 2–4 / 5–7 / 8–10 / 11–12.
- Standard Loot Draft: 3 offers.
- Skip whole draft: +2 Coins.
- Individual Spoils-modifying items remain balance-tunable.

## Economy
- Normal / Elite / Boss Coins: 2 / 4 / 6.
- Healing service: Heal 4 for 4 Coins.
- persistent-item salvage: ~50% base shop price.
- no Shop reroll in baseline; if needed use escalating cost.

## Rewards
- Elite raises final reward band by 1.
- Boss gives premium three-offer Boss Draft and small fixed heal.

## Run structure
- 4 Floors.
- 4 visited pre-boss rooms + Boss per Floor.
- successful full run target: 25–35 min.
- vertical slice target: 8–12 min.

## Content scope
- launch target: ~4 characters, 32–40 normals, ~8 elites, up to ~8 bosses, 48–60 Artifacts, 24–30 Gear, 18–24 Contraband, 28–40 Events.

## Dice-pressure bands
- 2d6 baseline normals.
- 3d6 strongest-two roughly elite pressure.
- boss dice engines authored individually.

---

# DEFERRED

Not required before the vertical slice proves baseline systems.

- Shop rerolls / Shop item locking.
- item upgrading/forging.
- stackable persistent Artifacts/Gear.
- Daily Runs / leaderboards.
- challenge modifiers / high-difficulty system.
- alternate cosmetic dice families beyond baseline.
- sophisticated codex/collection UX.
- special Floor room categories beyond Combat / Elite / Event / Shop / Boss.
- retreat/flee system.
- complex persistent statuses.
- reward bias icons on map.
- exact full-launch counts.
- Level 5 Delver Technique wording until Level 3 choices are tested.
- Spoils pattern directly biasing loot category.

---

# REJECTED

Do not reintroduce without formal design amendment.

## Combat/system rejects
- fixed monster Threat as primary combat target.
- Hearts/Resolve counter alongside HP.
- three-lives run system.
- universal reroll action.
- universal CHEAT token/button.
- boss dynamically countering the player's strongest build.
- hidden hit/miss roll after COMMIT.
- giant traditional RPG stat sheet.
- **Best Successful Spoils** as the encounter reward-capture rule; simulation caused premium-band flooding in multi-round fights.

## Universal resource rejects
- Mana.
- Stamina.
- Stress/Sanity.
- Hunger.
- Encumbrance.
- Durability.
- crafting shards/material currency.
- multiple ordinary vendor currencies.

## Loot rejects
- unlimited backpack hoarding.
- automatic stacking duplicates for all items.
- random procedural affix soup.
- rewards that are primarily invisible +X% filler.

## Art rejects
- painterly sourcebook illustration as primary runtime rendering language.
- H.R. Giger-heavy biomechanical identity.
- Munchkin doodle imitation.
- isometric gameplay dice with readable side numbers.
- AI-generated full animation frames accepted without cleanup/consistency pipeline.

---

# Reopening a decision

To reopen a LOCKED item, record:

1. observed problem;
2. evidence (playtest, simulation, implementation limitation);
3. proposed replacement;
4. systems affected;
5. migration plan for docs/data/code/assets.

`I had another cool idea` is not sufficient evidence by itself once production depends on the rule.
