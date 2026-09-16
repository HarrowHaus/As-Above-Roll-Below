# As Above, Roll Below — Information & Tooltip Bible

**Status:** canonical player-information contract for Floor I and future content.

This document defines how AARB explains itself without turning a single-screen game into a stack of menus.

## 1. Design rule

**The player should never need to remember an unexplained proper noun in order to make the current decision.**

Information is layered:

1. **At-a-glance:** name, category, tier, one mechanical sentence.
2. **Inspect:** keyword definitions, exact timing, limits, interactions.
3. **Flavor:** one short line that establishes the Below without obscuring the rule.
4. **Codex/history:** optional later layer; never required to understand a run.

The short card is gameplay-first. Flavor never replaces rules text.

## 2. Interaction contract

### Desktop
- Hover: compact tooltip after a short delay.
- Click/tap: pin expanded inspect card.
- Clicking elsewhere closes it.

### Touch
- Tap an object/card/keyword: expanded inspect card.
- Tap the primary action area only when the player clearly intends to use/take it.
- Never require hover.

### Combat
Enemy name, Instinct, current rule icons, HP, locked dice, player dice and current Fight/Spoils outcome remain visible on one screen. Tapping an Instinct/rule opens its definition without leaving combat.

### Rewards
A reward offer always shows:
- item name;
- category + tier;
- complete short rule;
- slot/capacity consequence if relevant;
- price only in Shops.

Expanded inspect adds keyword definitions, timing, interaction notes and flavor.

## 3. Rules-writing style

Use imperative/plain mechanical English.

Good: `Once per encounter, FLIP one player die.`
Bad: `A mysterious reflection may alter fate.`

Numbers are explicit. Timing is explicit. `Once per encounter` is never hidden in a tooltip when it changes value.

Preferred verbs are canonical keywords: **ROLL, LOCK, FIX, BUMP, FLIP, COPY, FIGHT, SPOILS, COMMIT, HEAL, DAMAGE, REVEAL, SALVAGE.**

## 4. Keyword dictionary

**ROLL** — Generate a die value from 1–6.

**LOCKED** — This die cannot be changed by player die-manipulation effects. Enemy locked dice form the enemy Fight total.

**FIXED** — This player die cannot be changed this cast. It may still be chosen for Fight unless a rule says otherwise.

**BUMP** — Change a die by exactly 1, staying between 1 and 6.

**FLIP** — Change a d6 to its opposite face: `1↔6, 2↔5, 3↔4`.

**COPY** — Change one die to the current value of another eligible die.

**FIGHT DICE** — The two player dice committed against the enemy.

**SPOILS DICE** — The two player dice not committed to Fight.

**FIGHT** — Your Fight Dice total after effects.

**ENEMY FIGHT** — The enemy's two locked dice total after effects.

**MARGIN** — `Fight − Enemy Fight`. Positive Margin damages the enemy by that amount unless modified. Negative Margin damages the player by its absolute value unless modified.

**COMMIT** — Lock in the selected Fight Dice and resolve the round.

**SPOILS** — Reward score made from the two uncommitted dice on a successful round, after Spoils effects. The encounter's reward uses the successful final blow's Spoils.

**INSTINCT** — The deterministic rule an enemy uses to choose which rolled dice it locks.

**BOTH** — Roll 2 dice; lock both.

**STRONGEST** — Lock the two highest rolled dice.

**WIDE** — Lock the lowest and highest rolled dice.

**TIGHT** — Lock the closest-valued pair; deterministic tie-breaking favors the stronger pair.

**ODD** — Prefer the two strongest odd dice when possible; otherwise use the fallback defined by the engine.

**GEAR** — Persistent equipment. One slot each: Weapon, Armor, Utility. Taking Gear into an occupied slot replaces the old Gear and salvages it for Coins.

**ARTIFACT** — Persistent rule-changing object. Maximum 4 carried. Taking a fifth requires replacement/salvage.

**CONTRABAND** — Consumable run tool. Maximum 2 carried.

**TIER** — Reward/economy quality band for content. Tier is not a promise that an item is universally stronger; build fit matters.

**SALVAGE** — Replace/remove an owned persistent item and receive its defined Coin value.

## 5. Item card template

### Compact
`NAME`
`CATEGORY • TIER [• SLOT]`
`Complete short mechanical rule.`

### Expanded
- short rule;
- keyword definitions used by the rule;
- exact limits/timing;
- replacement/capacity warning;
- interaction notes when necessary;
- one flavor line.

## 6. Enemy inspect template

`NAME`
`HP • Nd6 • INSTINCT`
`Rule: one mechanical sentence.`

Expanded inspect explains the Instinct and every special rule. The player should be able to predict the enemy's lock from the rolled dice.

## 7. Reward communication

On a kill, preserve the Final-Blow Spoils dice long enough to visually explain the reward source.

Sequence:
1. enemy defeat;
2. successful Spoils dice remain/highlight;
3. `SPOILS N → BAND/TIER` feedback;
4. three reward offers enter the same stage;
5. taking/replacing an item visibly updates the carried build;
6. descend.

Do not route through a separate inventory menu merely to understand a reward.

## 8. Status of information debt

Current E8 systems build intentionally violates this contract in places. Loot/Shop/Event screens are systems-test UI. The next content/UI pass must source display text from canonical content data rather than hard-coded scene labels.
