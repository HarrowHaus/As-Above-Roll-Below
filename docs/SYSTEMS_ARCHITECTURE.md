# As Above, Roll Below — Systems Architecture

**Version:** 0.1  
**Status:** preproduction canon for the next systems demo  
**Purpose:** define the progression/economy/reward systems beneath the art layer before full vertical-slice production.

---

# 1. SYSTEMS THESIS

The core combat is already unusual enough. The systems around it should use familiar roguelite grammar and create a clear rhythm:

**fight → earn Spoils → choose loot → level when earned → manage limited slots → spend Coins → take the next risk.**

The central rule is:

> **Levels keep you alive. Loot makes you weird.**

Player Level provides predictable survivability and a very small number of character-technique decisions. Loot creates the actual build.

This prevents static level scaling from replacing the four-dice decision.

---

# 2. RESEARCH LESSONS ADOPTED

The project borrows structural lessons, not surface mechanics.

## Slay the Spire
Useful lesson:
- ordinary combat repeatedly ends in a choice rather than a blind drop;
- card rewards may be skipped;
- elite risk is visibly associated with premium reward value.

AARB application:
- every standard victory opens a loot draft;
- the player may refuse a reward;
- elites guarantee stronger loot pressure.

## Slice & Dice
Useful lesson:
- simple combat can support enormous build diversity;
- progression cadence alternates meaningful post-fight improvement;
- level-ups and items are separate reward concepts;
- visible mechanics preserve puzzle readability.

AARB application:
- leveling remains distinct from loot;
- rewards happen frequently;
- the player should leave most fights mechanically different from how they entered.

## Dicey Dungeons
Useful lesson:
- compact numerical levels can grant predictable survivability while selected milestones offer equipment choices;
- equipment/dice manipulation defines play more than raw level number.

AARB application:
- Level grants small HP growth;
- only selected levels grant character-technique choices;
- no large passive Fight bonus is granted by ordinary leveling.

## Balatro
Useful lesson:
- limited persistent slots create replacement pressure;
- the run becomes memorable through interactions between a few persistent rule-changing pieces;
- shops mix persistent build pieces, consumables, and economy decisions.

AARB application:
- Artifact/Gear slots are deliberately limited;
- loot replacement is a real decision;
- Shop contains persistent items, Contraband, and healing.

## Hades
Useful lesson:
- route choice becomes meaningful when reward categories can be read before entering a chamber;
- run-progress rewards and longer-term unlock resources can remain conceptually separate.

AARB application:
- later route-map implementation should expose room/reward category where useful without revealing exact contents.

---

# 3. PLAYER LEVEL

## Run-only level
Player Level resets each run.

Planned full-run range:

**Level 1 → Level 6**

Level does **not** directly add a universal +1 Fight each time.

## XP awards
- Normal encounter: **1 XP**
- Elite encounter: **2 XP**
- Floor Boss: **3 XP**
- Noncombat rooms: normally **0 XP**

## XP thresholds
Cumulative XP required:

| Level | Total XP |
|---|---:|
| 1 | 0 |
| 2 | 3 |
| 3 | 7 |
| 4 | 12 |
| 5 | 18 |
| 6 | 25 |

The exact thresholds remain balance-tunable, but the six-level structure is the current production target.

## Every level
On reaching a new Level:

- **Max HP +2**
- **heal 2 HP**

Healing cannot exceed the new Max HP.

This makes Level progression valuable without making the dice numerically irrelevant.

## Technique levels
At **Level 3** and **Level 5**, the player additionally chooses **1 of 2 character-specific Techniques**.

Techniques are not random generic loot. They deepen the selected character's identity.

They should modify:
- manipulation economy;
- Fight/Spoils interpretation;
- defensive risk;
- character-specific triggers.

They should not become another 20-slot passive inventory.

Maximum character Techniques gained in an ordinary run: **2**.

---

# 4. WHY LEVEL DOES NOT DRIVE DAMAGE

Margin damage already creates natural scaling through:

- enemy dice pools;
- enemy Instinct;
- player Gear;
- player manipulation;
- Artifacts;
- encounter-specific rules.

Large automatic Fight bonuses from Level would:

- make high-value Fight dice less necessary;
- reduce the cost of leaving good values as Spoils;
- flatten enemy dice differences;
- turn late combat into predetermined arithmetic.

Therefore ordinary Level progression is primarily **endurance + sparse technique evolution**.

---

# 5. SPOILS CAPTURE — CURRENT CANON FOR TESTING

Each damaging player win produces a **successful Spoils Pair** from the two uncommitted dice.

The encounter remembers the **highest successful Spoils Score** achieved before the enemy dies.

`Spoils Score = Spoils Die A + Spoils Die B`

Possible range: **2–12**.

Losses and ties do not qualify Spoils.

## Why keep Best Successful Spoils

It preserves the core decision across multi-round fights. Earlier greedy wins still matter.

It also creates a self-balancing greed cost:

- low-margin wins preserve better Spoils;
- low-margin wins remove less monster HP;
- longer fights expose the player to more enemy rolls;
- extra exposure increases expected HP loss.

The current balance model already shows this cost strongly.

## Stall policy

Do **not** add an anti-stall meter yet.

If interactive play demonstrates that players can safely farm weak monsters for premium Spoils with trivial risk, test solutions in this order:

1. lower normal enemy HP;
2. first-two-success cap;
3. Final Blow Spoils;
4. authored enemy escalation after excessive rounds.

Never add a second greed currency simply to police behavior the combat system can solve itself.

---

# 6. LOOT IS THE PRIMARY BUILD ENGINE

Every standard combat victory produces:

1. XP;
2. Coins;
3. one **Loot Draft** generated from the encounter's Spoils Score.

The player chooses **one** offered result or skips the draft.

This means every fight can materially alter the run.

---

# 7. LOOT DRAFT

## Consistent interface
Every normal Loot Draft shows **3 offers**.

The Spoils Score changes the **quality composition**, not the number of buttons the player must learn.

## Spoils bands

### Score 2–4 — Tier I Draft
Three offers from low/basic pools.

Typical composition:
- Contraband;
- Tier I Gear;
- Tier I Artifact;
- Coin cache.

No fight should end with literally nothing useful.

### Score 5–7 — Tier II Draft
Three offers from the standard pool.

Rules:
- at least one Gear or Artifact;
- Tier II item chance enabled;
- Contraband remains possible.

### Score 8–10 — Tier III Draft
Three stronger offers.

Rules:
- at least one Tier II Gear/Artifact;
- no pure low-value filler;
- increased Artifact weighting.

### Score 11–12 — Tier IV / Improbable Draft
Three premium offers.

Rules:
- guaranteed high-tier Gear or Artifact offer;
- Tier III pool becomes eligible;
- premium/strange content weighting increases.

Final world-facing names for the four bands belong in the content pass.

---

# 8. LOOT TYPES

## Gear
Traditional combat equipment.

Slots:
- Weapon
- Armor
- Utility

Purpose:
- modify Fight totals/margins;
- mitigate damage;
- create understandable conditional combat bonuses.

Gear should usually answer:

> **How do I fight?**

## Artifacts
Primary rule-changing build system.

Slots: **4**.

Purpose:
- reinterpret dice;
- modify manipulation;
- reward patterns;
- alter Spoils;
- create interactions between otherwise ordinary rolls.

Artifacts should answer:

> **What do my dice mean now?**

## Contraband
Single-use tactical intervention.

Slots: **2**.

Purpose:
- solve one dangerous state;
- force/manipulate a roll;
- interfere with an enemy;
- temporarily violate a normal rule.

Contraband should answer:

> **How do I get out of this specific mess?**

## Coin Cache
Immediate economy reward.

Provides Coins and consumes no slot.

Useful as a reward choice when offered items do not fit the current build.

---

# 9. ITEM TIERS

Vertical-slice content uses only **Tier I / II / III** internally.

These are power/complexity bands, not collectible rarity colors.

## Tier I
Simple, useful, easy to evaluate.

Examples:
- conditional +1 Fight;
- first incoming damage reduction;
- one additional manipulation opportunity under a clear condition.

## Tier II
Build-shaping.

Examples:
- pattern engine;
- Spoils reinterpretation;
- persistent LOCK synergy;
- stronger conditional combat effects.

## Tier III
Rare run-defining effects.

Must still preserve the core four-dice decision.

Tier III should feel illegal, not automatic.

---

# 10. SLOT PRESSURE AND REPLACEMENT

Inventory remains intentionally small:

- 3 Gear slots;
- 4 Artifact slots;
- 2 Contraband slots.

When taking an item into a full category:

1. select an existing item to replace; or
2. cancel and choose another Loot offer.

The replaced item is **salvaged for Coins** equal to roughly half its shop value, rounded down.

This prevents backpack hoarding while making replacement less psychologically wasteful.

The player may always skip the entire Loot Draft for a small fixed Coin reward.

Provisional skip reward: **+2 Coins**.

---

# 11. COINS

Coins are the only ordinary run currency.

## Encounter awards
Provisional:
- Normal: **2 Coins**
- Elite: **4 Coins**
- Boss: **6 Coins**

These are separate from the Loot Draft so even a low Spoils result still advances shop economy.

## Why Spoils does not also multiply Coin income
Spoils already controls item quality. Making high Spoils simultaneously produce much stronger items and dramatically more money would over-reward the same decision twice.

---

# 12. SHOP

Baseline Shop inventory:

- 1 Gear;
- 2 Artifacts;
- 1 Contraband;
- Healing service.

Provisional prices:

- Contraband: **3–4 Coins**
- Tier I Gear: **5–6 Coins**
- Tier I Artifact: **6–7 Coins**
- Tier II Gear/Artifact: **8–10 Coins**
- Heal 4 HP: **4 Coins**

A typical Floor should allow an average player to afford roughly **one meaningful purchase**, with more available to players who skip/salvage loot or route toward economy.

No Shop reroll in the first systems demo. Add only if static inventory feels too arbitrary.

---

# 13. ELITE REWARDS

Elites must justify optional risk.

After an Elite victory:

- normal XP/Coins apply at elite rates;
- Spoils still generates a 3-offer draft;
- draft quality is raised by **one band**, capped at Tier IV.

Therefore a mediocre elite Spoils result can still outperform an ordinary encounter reward.

This mirrors the broader roguelite principle that visible optional danger should correspond to visible premium value.

---

# 14. BOSS REWARDS

Bosses always grant:

- 3 XP;
- 6 Coins;
- small fixed healing after resolution (current target: 2 HP);
- a **Boss Draft** of 3 premium build pieces.

Boss reward quality does not completely depend on the killing blow or Spoils result.

Boss Spoils may improve the Boss Draft, but the player never defeats a Floor boss and receives garbage because survival required high Fight dice.

---

# 15. CHARACTER TECHNIQUES

Character Techniques are intentionally sparse.

For the Delver vertical-slice character, provisional Level 3 choices:

### Steady Hand
BUMP gains **1 additional use per encounter**.

### Long Odds
The first time each encounter you win by exactly 1, **+2 to that successful Spoils Score**, maximum 12.

Provisional Level 5 choices will be authored only after Level 3 choices survive playtesting.

Technique text must remain one sentence where possible.

---

# 16. REWARD CADENCE

Target rhythm:

### Normal combat
fight → Loot Draft → continue

### Level threshold reached
fight → Loot Draft → Level panel → continue

### Elite
fight → elevated Loot Draft → continue

### Shop
spend/replace/heal → continue

### Boss
fight → Boss Draft → Floor transition

Avoid stacking three unrelated reward screens after every ordinary fight.

---

# 17. ROUTE INFORMATION — FUTURE MAP RULE

When the route map is implemented, the player should know the **room type** and, where appropriate, broad reward identity before committing.

Examples:
- Combat
- Elite
- Shop
- Event
- Boss

Potential later reward hints:
- Gear-heavy encounter/event;
- Artifact opportunity;
- healing/economy node.

Exact item identity remains hidden.

---

# 18. META-PROGRESSION

Meta progression remains horizontal.

Winning/achievements may unlock:
- new characters;
- new item pool entries;
- new encounters;
- new bosses;
- new difficulty modifiers;
- cosmetic dice/material families.

Do not grant permanent raw Fight or HP inflation as the primary progression model.

---

# 19. NEXT SYSTEMS DEMO

Before environment/menu production expands, build a **systems-complete fight loop demo** with minimal art.

Required flow:

1. start at Level 1 with Delver;
2. combat using current contested dice;
3. Best Successful Spoils tracking;
4. XP and Coin award;
5. 3-choice Loot Draft generated from Spoils band;
6. inventory slots and replacement;
7. second combat;
8. Level-up event;
9. Shop;
10. Elite combat with elevated reward quality;
11. at least one later fight where acquired items visibly change the dice decision.

The demo may reuse a small enemy-art pool. Its purpose is to validate **run systems**, not final content variety.

---

# 20. ACCEPTANCE TEST

The systems layer succeeds if a player can answer after a short run:

- What Level am I and why do I care?
- What did my last Spoils roll earn me?
- What is my build doing to my dice?
- What am I saving Coins for?
- Why would I risk an Elite?
- What item am I hoping to find next?

Most importantly:

> **Does the player look at a strong die and hesitate because using it to survive means giving up a better Loot Draft?**

If yes, the systems are reinforcing the game rather than sitting beside it.