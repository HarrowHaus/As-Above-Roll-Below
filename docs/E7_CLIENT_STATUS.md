# E7 — Playable Shared-Core Client Status

**Status:** implementation gate reached; human playtest + asset-production gate next.

This document records what the current Phaser client actually does. It exists to prevent the project from drifting back into prototype assumptions after the shared-core architecture was proven.

---

## Architecture proven

The browser client, headless simulator, and CI regression all consume the same production TypeScript rules core under `engine/core/`.

The Phaser client is presentation/input. It does not own dice rolls, combat math, Floor generation, route legality, effect resolution, inventory rules, Loot Draft generation, Events, Shop stock, progression, or economy.

CI currently gates:

1. strict TypeScript build + core tests;
2. headless simulator tests;
3. 1,000 generated Floor I runs per policy / 3,000 total;
4. Phaser/Vite TypeScript build;
5. browser artifact generation.

---

# Current playable Floor I shell

The implemented loop is:

**Map → Combat / Elite / Event / Shop → Loot → Technique when earned → Map → Boss → Boss Draft → Run result**

The map is generated from the production Floor definition and only exposes nodes the core RunState marks reachable.

## Combat

Implemented through the production core:

- enemy-first cast;
- deterministic Instinct locking;
- player 4d6 cast;
- exactly two Fight Dice;
- remaining two Spoils Dice;
- deterministic preview;
- margin damage;
- Final-Blow Spoils;
- persistent player HP;
- Floor I enemy Rules;
- boss phase swaps;
- player-cast FIXED constraints;
- manipulation-reactive enemies;
- tie-resolution Rules;
- simultaneous-death defeat precedence;
- Field Adjustment;
- Level 3 Steady Hand / Long Odds behavior;
- Gear/Artifact passive effects;
- active Artifact controls;
- combat Contraband controls;
- Temporary Injunction rule suppression;
- Ash Ledger first-hit Coin trigger;
- Brass Caliper as an explicit once-per-encounter Spoils-die choice;
- Stuck Key as an explicit successful-round carry-forward choice;
- carried Stuck Key dice are LOCKED and cannot be rewritten by other item actions.

The production front-facing Dice V1 atlas is used by the client.

## Procedural run / encounter layer

Implemented:

- deterministic master seed;
- independent named RNG streams;
- constrained Floor graph generation;
- generic RunState over an ordered list of Floor definitions;
- route legality enforced by core;
- Encounter Director selection;
- history-aware encounter selection;
- normal / Elite / Boss room handling;
- arbitrary Floor-count architecture; release Floor count is content scope, not an engine constant.

## Loot / inventory

Implemented:

- Final-Blow Spoils bands;
- Elite reward-band uplift;
- deterministic three-offer Loot Draft;
- Boss premium Draft;
- Boss Draft cannot be skipped;
- Gear / Artifact / Contraband slot rules;
- replacement pressure;
- salvage;
- duplicate eligibility;
- standard draft skip;
- Small Change Purse first-skip bonus;
- active combat items consume/use correctly.

## Levels / Techniques

Implemented:

- persistent XP / Level progression;
- Max HP +2 / heal 2 Level gain;
- pending Technique gates;
- Level 3 Technique choice scene;
- Steady Hand;
- Long Odds.

Level 5 Technique wording/behavior remains deferred by the design ledger and should not be treated as final content yet.

## Shop

Implemented:

- deterministic seeded stock;
- one Gear / two Artifacts / one Contraband;
- sold-state persistence within the room;
- item purchases;
- replacement + salvage on purchase;
- paid healing;
- Receipt From Nowhere first-item-purchase discount;
- Coins persist in RunState.

## Events

All three Floor I Events resolve through the production EventResolver:

- Unnumbered Door;
- Talking Board (1891);
- Lost Property Office.

Talking Board's reveal result is functional: reachable Combat/Elite identities are seeded, cached, shown on the map, and entering the node uses the revealed exact encounter rather than rerolling it.

## Outside-combat Contraband

Emergency Key is usable from the Map and heals through the core outside-combat item action before consuming exactly one copy.

---

# E6 balance gate retained

The headless simulator imports the same compiled core as the Phaser client.

The full-item shared-core regression produced the intended reward-risk shape. The key current reference point is approximately:

- Opportunist raw Final-Blow Band IV: ~11.9%, inside the provisional 5–15% target;
- diagnostic Greedy raw Band IV: ~19.6%, paid for with materially higher damage and much lower clear rate.

This freezes the architecture and major reward rule, **not final human-facing balance**. Exact HP / pressure / item valuations remain provisional until people play the real client.

---

# Presentation status

## Production-facing

- Phaser 4 / Vite / TypeScript client shell;
- front-facing Dice V1 atlas;
- deterministic game state and scene flow;
- Map / Combat / Loot / Shop / Event / Technique interfaces sufficient for systems playtesting.

## Intentional placeholders

- Delver combat art;
- normal/Elite/Boss creature sprites;
- Floor I modular environment art;
- prop dressing;
- final UI frames/icons/typography treatment;
- animation;
- VFX;
- SFX/music.

The current vector silhouettes and flat environment geometry are **not** art-direction revisions. They exist only so the production systems can be played before the asset pack is built.

---

# Next gate

The project should no longer expand core systems casually.

Next work should proceed in this order:

1. human playtest the current Floor I shell and log friction/bugs/degenerate decisions;
2. fix rules only where evidence requires it;
3. build the minimal production Floor I asset pack against the now-real scene requirements;
4. replace vector placeholders with actual sprites/environment modules;
5. add animation/audio/feedback;
6. repeat human playtest + telemetry;
7. only then expand into additional Floors/content families.

The engine is now a reusable procedural roguelite machine. Floor I is its first content package, not a hard-coded game mode.
