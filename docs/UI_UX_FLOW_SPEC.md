# As Above, Roll Below — UI / UX Flow Spec

**Version:** 0.2  
**Status:** canonical interaction contract

The UI must make a strange game feel obvious.

This spec is subordinate to `SINGLE_SCREEN_DESCENT_SPEC.md` for in-run presentation.

---

# 1. Primary UX rules

The player should never need to wonder:

- what the enemy rolled;
- what the enemy locked;
- which two dice are currently Fight;
- which two are currently Spoils;
- what the predicted margin is;
- why a deterministic modifier is applying;
- what will happen when COMMIT is pressed;
- what Depth they are on;
- what irreversible choice they are about to make.

Mystery belongs in content discovery, not arithmetic or navigation.

The player should spend most of a run on **one persistent game surface** rather than repeatedly entering maps and menus.

---

# 2. In-run flow

Baseline:

`Encounter → Resolution → Loot/Technique when applicable → DESCEND → Encounter → ... → Boss → Boss Draft → Floor Transition`

Possible encounter states:

- Combat
- Elite
- Event
- Shop
- Boss

Possible overlay/transformation states:

- Loot Draft
- replacement decision
- Technique choice
- Boss Draft
- build drawer
- pause/settings

There is no mandatory run-map screen between encounters.

A future direct route choice may appear in place as two doors / two next-encounter summaries.

---

# 3. Title / run start

Exact title/new-run/continue/character-select flow remains **DEFERRED**.

Do not invent a mandatory "choose a level" screen merely because the in-run client needs an entry state.

The intended onboarding principle is fast entry into the first meaningful encounter.

---

# 4. Persistent Run Shell

Always available or immediately legible:

- macro Floor name;
- current Depth;
- player HP / Max HP;
- Level / XP progress;
- Coins;
- compact build access;
- current encounter identity/state.

The shell remains while its interior transforms between Combat / Event / Shop / Reward / Technique states.

The game should feel like one machine changing state, not a website changing pages.

---

# 5. Portrait-first mobile layout

Portrait is a first-class production target.

Do not rotate-gate portrait users.

Approximate hierarchy for a 9:16 phone:

## Header — ~8–12%
- Floor / Depth
- HP
- Level / XP
- Coins
- compact build button

## Encounter stage — ~32–40%
- environment
- enemy / boss
- enemy HP / name
- Instinct / primary Rule
- enemy locked dice

## Dice decision field — ~28–34%
- four large player dice
- Fight/Spoils state
- contextual manipulation controls
- Fight / Enemy / Margin / Spoils calculation

## Bottom action zone — ~16–24%
- large COMMIT
- active Artifact / Contraband access
- contextual confirm/cancel

Four dice should remain large enough to read and tap. Use one row when practical; use a controlled 2×2 layout on narrow screens rather than shrinking them into desktop-scale miniatures.

Landscape uses responsive reflow. It is not the canonical geometry that portrait must imitate.

---

# 6. Combat hierarchy

Tier 1:
- player HP
- enemy HP
- enemy locked dice + total
- four player dice
- selected Fight pair
- Spoils pair
- predicted margin
- COMMIT

Tier 2:
- enemy Instinct
- enemy Rule
- available manipulation
- deterministic triggered-item preview

Tier 3:
- flavor/provenance/lore
- decorative archive information

Tier 3 can never obscure Tier 1.

---

# 7. Combat interaction

## Enemy Cast
Enemy dice roll/settle first.

## Enemy Lock
Instinct visibly determines locked enemy dice and total.

## Player Cast
Four player dice roll and settle front-facing.

## Selection
Tap one player die to toggle Fight selection until exactly two are selected.

The other two visibly become Spoils immediately.

## Manipulation
Available BUMP / FLIP / COPY / item actions stay adjacent to the dice decision field.

Targeting state must be obvious.

## Preview
Before COMMIT show:
- raw Fight;
- final Fight;
- enemy total;
- predicted margin;
- predicted damage;
- deterministic modifier sources;
- current Spoils Score if the attack succeeds.

## Commit
COMMIT is disabled until exactly two Fight Dice are selected.

Irreversible resolution begins only after COMMIT.

---

# 8. Dice visual contract

Settled dice:
- front-facing only;
- large readable pips;
- no readable side faces;
- physical material treatment;
- state shapes/frames independent of color;
- optional numeric accessibility value.

The runtime implementation must render correctly in contemporary mobile browsers. If an atlas/spritesheet path proves fragile, runtime-generated geometry/canvas textures are acceptable so long as the production visual standard is preserved.

Black/missing texture quads are a blocking bug, not an acceptable fallback.

---

# 9. Effect explanation

When an item changes a deterministic value, show a compact source trail.

Example:

`FIGHT 8 +1 [Bent Knife] = 9`

Do not animate unexplained mystery numbers onto totals.

---

# 10. Damage feedback

Margin is primary feedback.

Example:

`YOU 10 — 8 ENEMY`

`MARGIN +2`

Then HP changes.

Damage animation should visually connect the margin to HP loss.

---

# 11. Final-Blow Spoils feedback

On a damaging win:
- current Spoils pair confirms briefly;
- adjusted score is visible;
- combat continues if enemy survives.

On the **final damaging win**:
- that round's two uncommitted dice become Final-Blow Spoils;
- the pair remains visually connected to reward quality;
- the screen transforms directly into the Loot Draft.

Do not show Best-Successful Spoils. That rule is rejected.

---

# 12. Loot Draft in the Run Shell

Victory should not navigate to a disconnected page.

Preferred transition:
1. enemy/stage recedes or dims;
2. Final-Blow Spoils remains visible briefly;
3. three offers rise into the lower/middle field;
4. player chooses one / replacement / skip where legal;
5. reward collapses;
6. DESCEND transition begins.

Each offer shows:
- item name;
- category;
- concise exact rule;
- tier if player-facing;
- replacement warning.

---

# 13. Replacement UX

When full:
1. incoming item remains visible;
2. compatible owned items appear as replacement targets;
3. salvage value is shown;
4. choose one;
5. confirm.

Cancel returns to the same generated draft.

---

# 14. Level / Technique UX

Ordinary Level gain should be brief:
- Level number;
- Max HP +2;
- heal 2.

Technique Level:
- two large choices occupy the decision field;
- exact text visible;
- choose one;
- descent continues.

No generic random stat-upgrade menu.

---

# 15. Shop in the Run Shell

Shop is an encountered room, not a destination on a map.

Show:
- Coins;
- HP;
- seeded offers;
- exact effect;
- price;
- replacement warning;
- healing service.

Leaving immediately continues the descent.

Re-enter/redraw never rerolls stock for free.

---

# 16. Event in the Run Shell

Event stage contains:
- one visual/premise area;
- 2–3 large choices;
- known costs/damage where deterministic;
- conditional choice source when unlocked by a build piece.

Resolving the Event immediately continues the descent unless it generates an item replacement/offer decision first.

---

# 17. Build inspection

At safe decision states, player can inspect:
- Weapon
- Armor
- Utility
- 4 Artifacts
- 2 Contraband
- Techniques
- HP / Level / XP / Coins

This should be a drawer/overlay on mobile rather than a mandatory separate navigation destination.

---

# 18. Boss UX

Boss presentation may be more dramatic but must preserve information clarity.

Always communicate:
- current phase/state;
- active dice behavior;
- phase Rule;
- transition effect.

A new phase Rule is shown before the first affected COMMIT.

After victory, Boss Draft occupies the same Run Shell before Floor transition.

---

# 19. DESCEND transition

Between Depths:
- brief threshold/door/vertical transition;
- Depth counter updates;
- next environment resolves;
- control returns quickly.

Target repeat duration after familiarity: ~300–700ms.

No connective walking/avatar navigation is necessary.

---

# 20. Tutorial philosophy

Teach by encounter, not text wall.

First encounter:
1. enemy casts/locks;
2. player rolls four;
3. prompt choose two Fight Dice;
4. leftovers visibly become Spoils;
5. margin preview appears;
6. COMMIT;
7. victory demonstrates Final-Blow Loot Draft;
8. DESCEND demonstrates run cadence.

Do not front-load Artifacts, Shops, Elites, Techniques, Events, meta progression, or full run structure.

---

# 21. Input / touch contract

All primary actions support mouse/touch; keyboard remains supported on desktop.

No essential action requires drag-and-drop.

Mobile:
- large tap targets;
- COMMIT thumb-reachable;
- no tiny text-only active items;
- no hover-only explanation;
- safe-area aware;
- portrait and landscape both usable.

---

# 22. Accessibility

Baseline:
- reduced motion;
- faster animation option;
- scalable text;
- separate music/SFX;
- numeric die values optionally alongside pips;
- shapes/icons independent of color;
- high-contrast review;
- no timed combat decisions.

---

# 23. Animation pacing

Targets:
- dice cast/settle ~350–650ms;
- select ~80–150ms;
- lock ~150–250ms;
- simple hit resolution under ~500ms;
- Loot reveal under ~700ms;
- repeated DESCEND transition ~300–700ms.

Polish cannot become decision friction.

---

# 24. Run summary

Death/victory summary eventually shows:
- result;
- Floor / Depth reached;
- character;
- final Level;
- final build;
- notable triggers;
- Final-Blow reward history / highest reward tier where useful;
- Elites defeated;
- Coins earned/spent;
- seed.

Primary action: `GO AGAIN`.

Exact title/continue/new-run UX remains deferred.

---

# 25. Debug UX

Development builds may expose:
- seed;
- RNG stream state;
- encounter ID;
- effect log;
- raw/final Fight;
- Spoils adjustment;
- force reward band;
- grant item;
- set HP/Coins/Level;
- jump Depth/Floor.

Debug controls must not dictate production navigation.