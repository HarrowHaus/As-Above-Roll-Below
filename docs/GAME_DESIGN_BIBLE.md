# As Above, Roll Below — Game Design Bible

**Version:** 0.3 — preproduction canon  
**Genre:** solo dice roguelite / turn-based dungeon crawler  
**Primary platform:** browser, desktop + mobile  
**Target successful run:** ~25–35 minutes  
**Vertical Slice:** one replayable 8–12 minute Floor

This document defines the game's identity and design pillars. Exact systems numbers live in `MASTER_SYSTEMS_SPEC.md` and the specialist specs. This separation is intentional: the Bible should not drift every time a shop price changes.

---

# 1. The game in one sentence

**Roll four dice, commit two to the fight, and leave two behind as potential loot.**

Everything else exists to make that decision increasingly interesting.

---

# 2. Player promise

**As Above, Roll Below** has recognizable roguelite/dungeon-crawler bones:

- persistent HP across a run;
- monsters with distinct behavior;
- Gear;
- rule-changing Artifacts;
- single-use Contraband;
- Shops;
- Events;
- branching routes;
- optional Elites;
- authored Bosses;
- run-ending death;
- seeded procedural variation;
- horizontal unlocks;
- builds that can become gloriously unreasonable.

The unusual center is the contested dice roll.

Enemy casts first and visibly locks dice. Player rolls four d6. Exactly two are committed to Fight. The other two are potential Spoils.

The best die for staying alive is therefore often the die the player most wants to keep.

The recurring question is:

> **How greedy can you afford to be?**

---

# 3. Core design pillars

## 3.1 Four dice. Two choices.
A new player should understand the fundamental interaction almost immediately.

**ROLL FOUR. COMMIT TWO. WHAT REMAINS MAY BECOME YOURS.**

The game may become strategically deep. The basic action may not become difficult to understand.

## 3.2 Greed is gameplay
Loot quality is not detached from combat. The player helps create the reward by deciding which dice not to spend on survival.

The reward is determined by **Final-Blow Spoils**: the uncommitted pair on the damaging player win that kills the enemy.

Earlier successful rounds do not bank better rewards. This simulation-backed rule keeps the decisive roll meaningful and prevents premium-loot farming through intentional fight extension.

## 3.3 Builds bend the roll; they do not replace it
Artifacts, Gear and Techniques may alter values, change pattern meaning, create manipulation opportunities, reinterpret Spoils, modify margin consequences, interfere with enemy dice, create economy engines, and connect multiple triggers.

A strong build should make the player think:

> "Look what I can do with this roll."

Not:

> "My build no longer needs the roll."

## 3.4 Traditional roguelite bones underneath
The game should still satisfy familiar expectations:

- combat matters because HP persists;
- optional danger offers premium value;
- Shops create spending pressure;
- inventory limits create replacement decisions;
- Bosses are climactic authored encounters;
- death restarts the run quickly;
- unlocks broaden future possibilities.

Novelty belongs at the center, not in making every surrounding convention deliberately alien.

## 3.5 Broken builds are a reward
Powerful synergies are desirable. The game should occasionally make the player feel as if they discovered something slightly illegal.

Bosses do not dynamically inspect and disable the player's strongest engine. A developed build is something the player should be excited to unleash.

## 3.6 Knowledge adds depth; it is never required comprehension
The world can contain carefully researched material from folklore, Forteana, occult/esoteric history, public records, cryptid culture, intelligence/conspiracy lore, strange objects and architecture, and wholly original Below material.

Recognizing a deep reference may make something funnier or stranger. It may never be required to understand the mechanic.

## 3.7 The joke gets production value
The game does not constantly announce that it is joking.

An absurd subject can receive serious creature design, polished animation, exact rules, excellent sound, and careful historical specificity.

Comedy often comes from disproportionate seriousness and specificity.

---

# 4. What the game is not

AARB is not:

- a Munchkin clone;
- a deckbuilder with dice pasted on;
- a tabletop simulator;
- Dicey Dungeons with different art;
- a conspiracy trivia game;
- an idle game;
- a crafting game;
- an inventory-hoarding RPG;
- a traditional stat-sheet RPG;
- a visual novel interrupted by fights.

Baseline design explicitly rejects unnecessary universal systems such as Mana, Stamina, Stress/Sanity, Hunger, Durability, Encumbrance, Crit Chance, Accuracy/Evasion, elemental-resistance sheets and procedural affix soup.

See `DECISION_LEDGER.md`.

---

# 5. Combat identity

Canonical combat:

1. enemy rolls;
2. enemy locks by visible deterministic Instinct;
3. player rolls 4d6;
4. legal manipulation;
5. player commits exactly 2 Fight Dice;
6. remaining 2 are the current Spoils Pair;
7. deterministic preview;
8. confirm;
9. damage equals winning margin;
10. repeat if both survive;
11. killing player win resolves Final-Blow Spoils and reward.

There is no fixed monster Threat target, baseline monster Damage stat, hidden accuracy roll, or parallel heart/Resolve system.

The dice determine attack, defense, damage pressure and reward opportunity.

Detailed timing/math: `MASTER_SYSTEMS_SPEC.md` and `COMBAT_MODEL.md`.

---

# 6. Enemy identity

Enemies use the same dice language as the player while following visible deterministic **Instincts** such as BOTH, STRONGEST, WIDE, TIGHT and ODD.

Difficulty should emerge from dice pool, Instinct, HP, one readable primary rule, and Boss state changes—not from hidden scaling.

Normal enemies should usually have one primary rule. Elites get stronger authored pressure. Bosses receive stateful custom dice engines.

---

# 7. Progression philosophy

> **Levels keep you alive. Loot makes you weird.**

Level provides predictable endurance growth plus only a small number of character Techniques.

Loot provides the actual build through:

- Gear — how you fight/survive;
- Artifacts — what your dice mean;
- Contraband — how you solve one specific dangerous state.

This separation prevents ordinary leveling from flattening the Fight-vs-Spoils tradeoff.

Exact progression/economy: `SYSTEMS_ARCHITECTURE.md` and `LOOT_AND_ECONOMY_SPEC.md`.

---

# 8. Run rhythm

Intended emotional/systemic rhythm:

1. **Anticipation** — enemy cast.
2. **Assessment** — visible locked threat.
3. **Roll** — four possibilities land.
4. **Temptation** — good Fight dice are also good potential Spoils.
5. **Search** — what does the current build allow?
6. **Commitment** — choose two.
7. **Consequence** — margin damage.
8. **Escalation** — another round or kill.
9. **Final greed decision** — killing commitment determines Spoils.
10. **Reward choice** — Loot Draft.
11. **Build changes**.
12. **Route choice**.

Then repeat quickly.

---

# 9. Run structure

Full-run target:

- 4 Floors;
- 4 visited pre-boss rooms + Boss each;
- ~25–35 minute successful run;
- roughly 8–11 normal combats;
- 1–3 Elites;
- 2–4 Events;
- 2–4 Shops;
- 4 Bosses.

The route map reveals room category, not exact normal-enemy identity.

Procedural generation exists to create different decisions, not arbitrary noise.

Exact generator constraints: `RUN_STRUCTURE_AND_GENERATION_SPEC.md`.

---

# 10. World premise

The Below is not proof that every conspiracy, legend or fiction was literally true.

> **The Below preserves versions. It does not certify them.**

The Below accumulates residues of things narrated, classified, ritualized, fictionalized, denied, remembered, misremembered or otherwise forced into incompatible versions.

This permits a researched historical object, folklore, a fantasy monster, bureaucratic nightmare and original native creature to coexist without flattening their real-world provenance.

Detailed taxonomy and sourcing: `CONTENT_RESEARCH_BIBLE.md`, `BELOW_ECOLOGY.md`, `TERMINOLOGY.md`.

---

# 11. Visual identity

Lead direction:

**pixel-first, dark-fun-creepy, highly readable, dice-forward.**

Not grimdark sludge. Not cute chibi. Not Giger imitation. Not generic occult-black-and-gold.

The dice are a signature object and use front-facing single-face gameplay presentation for logical correctness and instant readability.

Production rule:

> **If an asset cannot be isolated, cleaned, exported, animated and used in the browser game, it is concept art—not production art.**

Detailed production rules: `ART_BIBLE.md`, `DICE_DESIGN_BIBLE.md`, `ASSET_PRODUCTION_SPEC.md`.

---

# 12. Accessibility / fairness

The game is turn-based. No rule requires reaction speed.

Before irreversible COMMIT, deterministic consequences should be understandable from the interface.

Required support includes mouse, touch, keyboard, reduced motion, scalable text, numeric dice labels in addition to pips, color-independent state language, separate music/SFX controls, and faster animation settings.

The interface performs routine arithmetic. The player makes decisions.

---

# 13. Metaprogression

Baseline metaprogression is horizontal.

Unlocks may add characters, items, enemies, Bosses, Events, modifiers/difficulty, challenge modes and cosmetic dice/material families.

Run 100 should contain more possibilities than run 1, not simply better starting numbers.

---

# 14. Simulation and validation

AARB is designed to be headlessly simulatable because the rules are deterministic and renderer-independent.

Simulation Gate V1 supported three production conclusions:

1. Final-Blow Spoils replaced Best Successful Spoils.
2. Seal-Bearer required stronger Elite pressure.
3. First Door OPEN needed a shorter, sharper final state.

Simulation informs tuning; it does not replace human playtesting.

Current results: `simulation/floor1/SIMULATION_GATE_REPORT.md`.

---

# 15. Vertical Slice definition

The first production-quality Floor contains:

- The Delver;
- 8 normal enemies;
- 2 Elites;
- The First Door;
- 8 Gear;
- 12 Artifacts;
- 6 Contraband;
- 3 Events;
- Shop;
- route map;
- Level / XP;
- Final-Blow Spoils / Loot Draft;
- inventory replacement;
- deterministic seed;
- death / victory / restart;
- finished Floor I art/audio/UI at review gate.

The authored current content lives in `VERTICAL_SLICE_CONTENT.md`.

---

# 16. The core test

Strip away the research, art, names and jokes.

Put four dice on the screen.

Ask the player to choose two.

If the choice is not interesting, nothing else can save the game.

If the player reaches the killing roll, sees two beautiful high dice sitting in potential Spoils, and thinks:

> **"Fuck. Can I afford not to use those?"**

then the game is doing what it is supposed to do.
