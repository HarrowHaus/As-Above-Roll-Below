# As Above, Roll Below — UI / UX Flow Spec

**Version:** 0.1  
**Status:** canonical preproduction interaction contract

The UI must make a strange game feel obvious.

---

# 1. Primary UX rule

The player should never need to wonder:

- what the enemy rolled;
- what the enemy locked;
- which two dice are currently Fight;
- which two are currently Spoils;
- what the predicted margin is;
- why a deterministic item modifier is applying;
- what will happen when COMMIT is pressed.

Mystery belongs in content discovery, not combat arithmetic.

---

# 2. Screen flow

Baseline flow:

`Title → Character Select → Run Map → Room → Reward/Resolution → Run Map → ... → Boss → Floor Transition → ... → Run Summary`

Room-specific screens:

- Combat
- Loot Draft
- Level Up
- Shop
- Event
- Boss Reward

Support screens:

- Inventory / Build
- Codex / discovered content later
- Pause / Settings
- Run Summary

---

# 3. Title screen

Required:

- New Run / Continue Run
- Settings
- Codex/Collection if unlocked
- Challenges/Daily when implemented
- version/build identifier in nonintrusive location

Continue appears only when valid active run exists.

---

# 4. Character select

Each character card shows:

- character name
- short playstyle sentence
- defining starting ability
- starting Gear
- starting HP if different
- difficulty/complexity tag only if useful

Do not reveal an entire future Technique tree on first selection screen.

---

# 5. Run map

Always show:

- current Floor
- current node
- connected selectable nodes
- room-category icons
- player HP / Max HP
- Level / XP progress
- Coins
- compact build summary access

Selectable nodes clearly distinguish:

- Combat
- Elite
- Event
- Shop
- Boss

Elite must never look like ordinary Combat.

Map interaction should work with tap/click and keyboard focus.

---

# 6. Combat layout information hierarchy

Tier 1 information:

- player HP
- enemy HP
- enemy locked dice + total
- player four dice
- selected Fight pair
- Spoils pair
- predicted margin
- COMMIT

Tier 2:

- enemy Instinct
- enemy primary rule
- available manipulations
- deterministic triggered-item preview

Tier 3:

- flavor/provenance/lore
- decorative archive information

Tier 3 can never obscure Tier 1.

---

# 7. Combat interaction flow

## Enemy Cast
Enemy dice visibly roll/settle.

## Enemy Lock
Instinct highlights selected enemy dice and total.

## Player Cast
Four dice roll and settle front-facing.

## Selection
Tapping/clicking one player die toggles it into Fight until exactly two are selected.

The other two are visually designated Spoils as soon as two Fight dice are selected.

## Manipulation
Available BUMP/FLIP/etc. actions remain adjacent to dice decision zone.

Target selection state must be obvious.

## Preview
Before COMMIT display:

- raw Fight
- final Fight
- enemy total
- predicted margin
- predicted baseline damage
- deterministic bonus/mitigation icons
- current Spoils Score
- deterministic Spoils bonus if victory occurs

## Commit
COMMIT is disabled until exactly two Fight Dice are selected.

After COMMIT, irreversible resolution begins.

---

# 8. Effect explanation

When an item modifies a number, UI should provide a compact source trail.

Example:

`FIGHT 8 +1 [Bent Knife] = 9`

Tooltips/inspection can expand full text.

Do not animate three mystery numbers onto the total and force the player to remember item text.

---

# 9. Damage feedback

Margin is primary feedback.

Example:

`YOU 10 — 8 ENEMY`

`MARGIN +2`

Then HP change.

Damage animation should visually connect the margin to HP loss rather than feeling like a separate hidden attack roll.

---

# 10. Spoils feedback

On damaging win:

- Spoils pair briefly confirms
- adjusted score shown
- if new encounter best, Best Spoils value visibly updates

Do not interrupt combat with a reward popup every successful round.

At victory:

- winning encounter Best Spoils transitions directly into Loot Draft presentation

This reinforces causal connection: `these leftover dice produced these offers`.

---

# 11. Loot Draft UX

Show:

- Best Spoils Score
- quality band
- Elite uplift if applicable
- three offers
- category icon
- item name
- concise rules text
- slot/category
- comparison/replacement information on focus

Player can:

- take one
- inspect current inventory
- choose replacement
- cancel replacement
- skip for Coins

Never require selecting an item before learning which existing item must be replaced.

---

# 12. Replacement UX

When inventory category is full:

1. chosen new item remains visible;
2. compatible current slots/items highlight;
3. each replacement preview shows salvage Coins;
4. player selects one existing item;
5. final confirm.

Cancel returns to original Loot Draft without regenerating offers.

---

# 13. Level Up UX

Level panel is brief.

Ordinary Level:

- Level number
- Max HP +2
- Heal 2

Technique Level:

- above changes
- two Technique choices
- concise rule text

No random third generic stat-upgrade list.

---

# 14. Shop UX

Show persistent current resources:

- Coins
- HP
- inventory access

Each Shop offer shows:

- category
- name
- price
- exact effect
- replacement warning if relevant

Healing shows amount and current/max HP.

Purchased offers visibly leave/sold state.

Reopening Shop does not regenerate inventory.

---

# 15. Event UX

Event screen:

- one visual/premise area
- 2–3 choices
- mechanically relevant consequence preview where appropriate
- conditional choices visibly explain their unlock source in concise form

Example:

`[Hidden Hand] Interfere with the mechanism.`

Do not hide guaranteed damage/cost behind flavor text unless uncertainty is explicitly the event's mechanic.

---

# 16. Build screen

At any safe state, player can inspect:

- Weapon
- Armor
- Utility
- 4 Artifacts
- 2 Contraband
- Techniques
- HP/Level/XP/Coins

Each item displays:

- exact rule text
- trigger/timing when useful
- category/tier if player-facing
- source/flavor separately

Build screen should make the run describable in seconds.

---

# 17. Boss UX

Boss presentation may be more dramatic but cannot violate information rules.

Always communicate:

- current boss state/phase if known
- active dice behavior
- visible phase rule
- state transition effect

If a phase introduces a new rule, present it before the first commitment affected by that rule.

---

# 18. Run summary

Death/victory summary should show:

- result
- Floor/node reached
- character
- final Level
- final build
- notable item/Technique triggers
- highest Spoils
- Elites defeated
- Coins earned/spent
- seed
- unlocks gained

Primary action:

`GO AGAIN`

Secondary:

- copy seed
- return title
- inspect detailed run log later if implemented

---

# 19. Tutorial philosophy

Teach by encounter, not text wall.

First combat onboarding sequence:

1. enemy rolls/locks
2. player rolls four
3. prompt choose two Fight Dice
4. show leftovers become Spoils
5. show predicted margin
6. confirm
7. first victory demonstrates Loot Draft

Do not explain Artifacts, Shop, Elite uplift, Techniques, Events, and meta progression before the first roll.

Contextual tooltips appear when each system first occurs.

---

# 20. Input contract

All primary game actions support:

- mouse
- touch
- keyboard

No essential action requires drag-and-drop.

Drag may be supported as optional flourish.

Keyboard:

- predictable tab/focus order
- arrow/number shortcuts for dice where useful
- Enter/Space confirm
- Escape back/cancel only before irreversible action

---

# 21. Mobile contract

Portrait/mobile layout must preserve:

- enemy art/HP top
- enemy dice/Instinct immediately below/near it
- player dice central
- manipulation controls thumb-reachable
- COMMIT large and distinct
- no tiny inventory text during combat

Minimum tap target should follow contemporary mobile accessibility norms rather than native pixel asset size.

---

# 22. Accessibility

Required baseline:

- reduced motion
- faster animations
- scalable text
- separate music/SFX
- numeric die values optionally shown alongside pips
- state icons/shapes independent of color
- high-contrast mode review
- screen-reader semantics for DOM UI where technically feasible
- no timed combat decisions

---

# 23. Animation pacing

Ordinary actions must remain fast.

Targets:

- dice cast/settle: roughly 350–650ms
- select: 80–150ms
- lock: 150–250ms
- simple hit resolution: under ~500ms
- Loot Draft reveal: under ~700ms

Player can speed/skip repeated presentation after familiarity where appropriate.

Do not let polish create friction between decisions.

---

# 24. Autosave feedback

Saving should be unobtrusive.

If save fails:

- surface clear warning
- do not imply run is safely resumable
- retry where appropriate

Quit/continue copy must distinguish temporary pause/exit from deliberate run abandonment.

---

# 25. Debug UI

Development builds need toggles for:

- seed
- RNG stream state
- encounter ID
- effect log
- raw/final Fight calculations
- Spoils adjustments
- force reward band
- grant item
- set HP/Coins/Level
- jump node/Floor

Debug UI never ships enabled to ordinary players.
