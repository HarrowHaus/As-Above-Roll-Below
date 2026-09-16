# As Above, Roll Below — Systems Architecture

**Version:** 0.2  
**Status:** canonical progression / economy architecture after Simulation Gate V1

---

# 1. Systems thesis

The core combat is already unusual enough. The systems around it use familiar roguelite grammar:

**fight → kill-roll Spoils → choose loot → level when earned → manage limited slots → spend Coins → choose next risk.**

> **Levels keep you alive. Loot makes you weird.**

Level gives predictable endurance and sparse character Techniques. Loot creates the build.

---

# 2. Research lessons adopted

Structural lessons, not copied surface mechanics:

- **Slay the Spire:** ordinary fights should repeatedly end in meaningful choices; optional Elite risk deserves premium reward.
- **Slice & Dice:** simple dice combat can support broad build depth if visible rules remain legible.
- **Dicey Dungeons:** compact Level progression can support survivability while equipment/manipulation defines play.
- **Balatro:** limited persistent slots create replacement pressure and interaction density.
- **Hades / FTL:** route information and visible room identity make risk/value navigation meaningful.
- **One Deck Dungeon:** one encounter can feed multiple progression vectors without requiring a huge stat sheet.
- **Into the Breach:** enemy-first, deterministic information makes difficult decisions feel fair.
- **Risk of Rain / Noita / Backpack Hero:** interaction rules and constraints matter more than raw rarity or passive percentage inflation.

---

# 3. Player Level

Run-only range: **1–6**.

XP:

- Normal: 1
- Elite: 2
- Boss: 3

Cumulative thresholds:

| Level | XP |
|---|---:|
| 1 | 0 |
| 2 | 3 |
| 3 | 7 |
| 4 | 12 |
| 5 | 18 |
| 6 | 25 |

Every Level:

- Max HP +2
- heal 2 HP

Levels 3 and 5 additionally grant a choice between two character-specific Techniques.

Ordinary Level gain never grants universal Fight.

---

# 4. Final-Blow Spoils

**Canonical capture rule:** reward quality comes from the uncommitted pair on the damaging player win that kills the enemy.

Earlier successful Spoils do not persist.

This replaced Best Successful Spoils after Simulation Gate V1:

- Balanced Band IV with Best Successful: **34.7%**
- Balanced Band IV with Final Blow: **11.0%**

Final Blow removes the incentive to intentionally prolong a solved fight while preserving the essential greed question on the decisive roll.

Spoils bands remain:

- 2–4 → Band I
- 5–7 → Band II
- 8–10 → Band III
- 11–12 → Band IV

Build effects may visibly modify the kill-roll score before band resolution.

---

# 5. Loot is the build engine

Every standard combat victory provides:

1. XP
2. Coins
3. a three-offer Loot Draft generated from Final-Blow Spoils

Player chooses one or skips the whole Draft for +2 Coins.

Every fight should have the potential to materially alter the run.

---

# 6. Loot roles

## Gear — 3 fixed slots

- Weapon
- Armor
- Utility

Gear answers: **How do I fight / survive?**

## Artifacts — 4 slots

Primary rule-changing layer.

Artifacts answer: **What do my dice mean now?**

## Contraband — 2 slots

Single-use intervention.

Contraband answers: **How do I solve this immediate bad state?**

## Coins

One ordinary run currency. Coin Cache may appear as a no-slot Loot offer.

---

# 7. Internal item tiers

## Tier I — foundation
Simple, independently useful.

## Tier II — build-shaping
Changes priorities, patterns or manipulation economy.

## Tier III — run-defining
Rare and powerful but still leaves the four-dice decision alive.

Tiers are mechanical authoring bands, not automatically player-visible rarity colors.

---

# 8. Slot pressure and replacement

Limits:

- 3 Gear slots
- 4 Artifact slots
- 2 Contraband slots

Taking persistent Loot into a full category requires replacement or choosing another offer.

Replaced Gear/Artifact salvages for roughly half base Shop price, rounded down.

No backpack hoarding.

---

# 9. Coin economy

Baseline combat awards:

- Normal: 2
- Elite: 4
- Boss: 6

Spoils does not multiply these base Coin awards; reward quality and basic economy remain separate axes.

---

# 10. Shop

Baseline stock:

- 1 Gear
- 2 Artifacts
- 1 Contraband
- Heal 4 HP service

Price targets:

- Contraband 3–4
- Tier I Gear 5–6
- Tier I Artifact 6–7
- Tier II persistent 8–10
- Heal 4 HP for 4 Coins

No baseline Shop reroll until fixed-stock Shops have been human-tested.

---

# 11. Elite rewards

Elite victory:

- 2 XP
- 4 Coins
- Final-Blow Spoils Draft raised **one band**, capped at IV

Optional premium risk must correspond to visible premium expected value.

Simulation Gate V1 also promoted **Seal-Bearer** from WIDE to STRONGEST pressure because the former did not justify Elite reward uplift.

---

# 12. Boss rewards

Boss victory always grants:

- 3 XP
- 6 Coins
- small fixed heal (current target 2 HP)
- premium three-offer Boss Draft

Boss reward cannot become worthless because the player used good dice to survive the killing round.

Boss Spoils may influence future special weighting, but useful persistent reward value is guaranteed independently.

---

# 13. Character Techniques

Sparse and identity-specific.

Current Delver Level 3 pair:

### Steady Hand
Field Adjustment/BUMP gains one additional use per encounter.

### Long Odds
When the **final killing win** has margin exactly 1, +2 Final-Blow Spoils Score, maximum 12.

Level 5 Technique wording remains provisional until the Level 3 pair is human-tested.

---

# 14. Reward cadence

### Normal
combat → Final-Blow Spoils → Loot Draft → level-up if earned → route

### Elite
combat → elevated Loot Draft → level-up if earned → route

### Shop
buy / replace / heal → route

### Boss
combat → Boss Draft → Floor transition

Do not stack redundant reward screens after ordinary fights.

---

# 15. Route information

Map reveals room category before commitment:

- Combat
- Elite
- Event
- Shop
- Boss

Exact normal enemy identity remains hidden until entry unless an Event/effect reveals it.

Reward-bias icons are deferred.

---

# 16. Meta progression

Horizontal by default:

- characters
- content-pool additions
- encounters
- bosses
- modifiers
- cosmetics

No permanent raw Fight ladder or mandatory Max-HP tree.

---

# 17. Simulation-backed behavior target

Simulation Gate V1 produced clear policy separation under Final Blow:

| Policy | Clear | Avg damage | Avg rounds | Avg Spoils | Band IV |
|---|---:|---:|---:|---:|---:|
| Safe | 97.2% | 6.87 | 15.43 | 5.42 | 1.3% |
| Balanced | 92.1% | 10.87 | 23.40 | 6.65 | 11.0% |
| Greedy | 57.2% | 17.24 | 35.46 | 7.67 | 19.9% |

These are automated-policy diagnostics, not target human win rates.

Desired qualitative relationship is correct:

- Safe preserves HP and gets weaker Loot.
- Greedy improves Loot but accepts much more exposure.
- Balanced trades between them.

---

# 18. Current validation priorities

Before production balance freeze:

- add survival-aware Greedy heuristic rather than pure greed-to-death;
- expand per-enemy and per-item trigger telemetry;
- freeze representative regression seeds;
- verify economy items are worth their limited slots;
- verify Band I Drafts still feel worthwhile;
- human-test whether Safe is too forgiving for onboarding;
- verify optional Elite risk remains attractive but non-mandatory.

The next implementation should be built from the written/simulated Vertical Slice content, not from another exploratory systems toy.
