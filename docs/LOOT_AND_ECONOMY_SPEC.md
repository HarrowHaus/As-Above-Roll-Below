# As Above, Roll Below — Loot & Economy Spec

**Version:** 0.1  
**Status:** canonical preproduction economy contract

Loot is not a reward bolted onto combat. It is the reason the player is tempted to make a worse combat choice.

---

# 1. Loot thesis

The same roll contains:

- the values the player can spend to survive;
- the values the player wants to preserve for reward quality.

Therefore the loot system must remain tightly coupled to Spoils without becoming difficult to explain.

Baseline rule:

> **Spoils sum determines reward quality. The player's build determines how that sum may be modified.**

The generator does not secretly read dice patterns to decide item category unless a visible item/event explicitly says it does.

---

# 2. Successful Spoils

A damaging player victory creates a candidate Spoils Pair.

`Base Score = die A + die B`

Deterministic player effects resolve to create:

`Adjusted Score`.

The encounter stores the highest Adjusted Score from any successful round.

Supported baseline range: 2–12.

No reward quality is generated from failed/tied rounds.

---

# 3. Quality bands

## Band I — 2–4
Purpose: useful floor, never dead reward.

Eligible power:
- Tier I only
- Contraband common
- Coin Cache enabled

Draft constraints:
- at least one non-Coin option
- no Tier III

## Band II — 5–7
Purpose: normal useful reward.

Eligible power:
- Tier I
- Tier II at low weighting
- Contraband
- Coin Cache

Draft constraints:
- at least one persistent item (Gear or Artifact)

## Band III — 8–10
Purpose: clearly desirable greedy reward.

Eligible power:
- Tier I at reduced weighting
- Tier II common
- Tier III normally disabled in Floor I unless specifically approved
- Contraband at reduced weighting
- Coin Cache rare

Draft constraints:
- at least one Tier II Gear/Artifact
- at least two offers must be build pieces or premium Contraband

## Band IV — 11–12
Purpose: premium/improbable reward.

Eligible power:
- Tier II high weighting
- Tier III enabled
- special authored pool enabled
- low-value Coin Cache disabled

Draft constraints:
- at least one Tier II+ persistent item
- at least two persistent items unless content pool exhaustion prevents it

---

# 4. Loot Draft

Every standard victory produces exactly **3 visible offers**.

Player actions:

- inspect all 3
- select 1
- if item requires replacement, inspect replacement result before confirming
- cancel replacement and select a different offer
- skip all offers for +2 Coins

There is no timer.

---

# 5. Category generator

Categories:

- Gear
- Artifact
- Contraband
- Coin Cache
- Special (rare authored reward type; not required in vertical slice)

Recommended baseline category weights before band constraints:

- Gear: 30
- Artifact: 35
- Contraband: 25
- Coin Cache: 10

Band constraints override weights.

The generator must redraw invalid offers rather than present obviously unusable duplicates.

---

# 6. Tier weighting

Internal tiers are mechanical power/complexity bands, not necessarily player-visible rarity colors.

## Band I tier weights
- Tier I: 100%

## Band II persistent-item tier weights
- Tier I: 80%
- Tier II: 20%

## Band III persistent-item tier weights
- Tier I: 35%
- Tier II: 65%

## Band IV persistent-item tier weights
- Tier I: 0%
- Tier II: 75%
- Tier III: 25%

These are starting targets for simulation and may change without redesigning the rule system.

---

# 7. Gear pool rules

Gear slots:

- Weapon
- Armor
- Utility

Draft generator should consider currently equipped slots.

It may offer an item for an occupied slot because replacement pressure is intentional.

It should avoid all three offers competing for the exact same occupied Gear slot unless the current band is explicitly Gear-biased.

Gear duplicates are invalid offers if already equipped.

---

# 8. Artifact pool rules

Artifacts are unique within a run by default.

Owned Artifact IDs are removed from ordinary offer eligibility.

Artifact slot cap: 4.

Taking a fifth requires replacement.

The generator should not protect the player from difficult replacement choices. It should only prevent literal duplicate offers and mechanically impossible content.

---

# 9. Contraband pool rules

Contraband slot cap: 2.

Duplicates may be legal per-item.

Every Contraband definition contains:

- `max_copies_in_inventory`
- valid timing windows
- target restrictions

The generator must not offer a Contraband item whose effect can never be used by the current ruleset.

---

# 10. Coin Cache

Coin Cache is an immediate no-slot reward.

Baseline:

- Band I: +4 Coins
- Band II: +5 Coins
- Band III: +6 Coins when generated
- Band IV: not in ordinary pool

Coin Cache values are intentionally modest; choosing Coins over build power is a strategic economy choice, not jackpot currency.

---

# 11. Salvage

When replacing Gear or Artifact:

`salvage = floor(base_shop_price × 0.5)`

Contraband discarded due to capacity does not automatically salvage unless an effect says otherwise.

Reason:

Persistent build replacement deserves compensation; consumable inventory is expected to cycle rapidly.

---

# 12. Shop economy

Baseline inventory:

- 1 Gear
- 2 Artifacts
- 1 Contraband
- Heal 4 HP service

Target base prices:

## Contraband
- Tier I: 3
- Tier II: 5

## Gear
- Tier I: 5–6
- Tier II: 8–9
- Tier III: 12+

## Artifact
- Tier I: 6–7
- Tier II: 8–10
- Tier III: 12+

## Healing
Heal 4 HP: 4 Coins.

Cannot purchase healing above Max HP.

---

# 13. Shop generation rules

A shop is generated from the run seed when its node becomes fixed/visible, not each time the screen is reopened.

Rules:

- no duplicate non-stackable offers
- don't sell currently owned Artifact as a new copy
- at least one offer affordable to a player who arrives with the expected floor economy, unless the player deliberately spent unusually heavily earlier
- no free refresh in baseline

If shop reroll is added after testing:

`reroll_cost = 2 + rerolls_used_this_shop`

Reroll refreshes unlocked offers only if a future lock mechanic is also introduced. Neither reroll nor locking is baseline vertical-slice scope.

---

# 14. Encounter currency awards

Baseline:

- Normal: +2 Coins
- Elite: +4 Coins
- Boss: +6 Coins

Coin award does not depend on Spoils Score.

Reason:

Spoils already controls item-quality upside. Multiplying both item quality and basic currency with one greedy decision causes runaway reward variance.

---

# 15. Elite reward modifier

Elites use the encounter's final Spoils Band, then raise it by one band, maximum Band IV.

Example:

Spoils 6 → Band II → Elite reward becomes Band III.

The original Spoils Score remains displayed so the player understands what happened.

---

# 16. Boss Draft

Bosses produce a separate three-offer premium draft.

Boss Draft rules:

- at least two persistent build pieces
- minimum Tier II power band in the full game once the pool supports it
- exact reward quality not allowed to fall below useful value because the player needed good dice to survive
- Boss Spoils may improve weighting or unlock a special fourth consideration later, but cannot make the baseline boss reward worthless

Floor boss also provides the currently targeted fixed heal of 2 HP after victory.

---

# 17. Loot pool composition targets

For a healthy release pool, not vertical slice:

- Gear: roughly 25–30%
- Artifacts: roughly 35–40%
- Contraband: roughly 20–25%
- economy/special content: remainder

Artifacts receive the largest design share because they are the primary rule-changing build system.

Vertical slice target remains:

- 8 Gear
- 12 Artifacts
- 6 Contraband

---

# 18. Loot design quality rules

Every persistent item must answer at least one:

- Does this change which two dice I want to commit?
- Does this change how I evaluate the two leftovers?
- Does this change how much risk I can accept?
- Does this change how enemy dice matter?
- Does this create a future synergy through a shared trigger/verb?

Reject persistent items whose only contribution is an invisible generic percentage unless the percentage serves a specific economy/rare-content role.

---

# 19. Artifact trigger taxonomy

Preferred reusable triggers:

- On Player Cast
- On Enemy Lock
- Before Commit
- On Doubles
- On Exact Total
- On Odd/Even Pattern
- On Successful Margin 1
- On Margin ≥ N
- On Taking Damage
- On Tie
- On Spoils Qualify
- On Spoils Band
- First Time Per Encounter
- Once Per Floor

Avoid custom one-off timing language when an existing trigger covers the behavior.

---

# 20. Economy build support

Some Artifacts/Gear may legitimately affect Coins/shops.

Examples of acceptable economy axes:

- increased salvage value
- first skipped draft each Floor gives extra Coins
- shop healing discount
- reward-category bias under a clear condition

Economy effects must compete with combat power through the same limited slots.

There is no separate Economy equipment page.

---

# 21. Bad-luck protection

The game should not secretly guarantee ideal synergies, but should avoid structurally dead runs.

Generator protections:

- each Loot Draft obeys category/tier minimums
- shops obey affordability target
- boss draft guarantees persistent value
- no duplicate non-stackable items
- early Floor pool emphasizes Tier I items that function alone

Do not use invisible `the game knows your build and gives you the answer` weighting in baseline design.

---

# 22. Analytics / balance metrics

Track in simulations/playtests:

- average Spoils Score by encounter tier
- draft band frequency
- item category pick rate
- skip rate
- replacement rate
- salvage Coins/run
- Coins entering shop
- purchases/shop
- healing purchase rate
- Artifact slot occupancy by Floor
- item pick-rate concentration
- win rate conditional on specific items
- average synergy trigger count per encounter

Items with extremely high pick rate and extremely high win correlation are balance review candidates, not automatically nerfed.
