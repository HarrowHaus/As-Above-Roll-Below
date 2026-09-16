# E8 — Portrait-First Single-Screen Descent Status

**Status:** implemented systems-playtest gate; production art/feedback next.

E8 replaces the E7 player-facing map shell with the run presentation defined in `SINGLE_SCREEN_DESCENT_SPEC.md`.

The underlying deterministic TypeScript core remains the same architecture. This is a run-topology / client-presentation migration, not a combat rewrite.

---

# Player-facing cadence

Current baseline:

`DESCEND → Encounter → Reward / choice → DESCEND → Encounter → ... → Boss → Boss Draft → result`

There is no mandatory map or choose-node screen in the default client.

A Floor is a macro chapter/content package. A Depth is one encountered step inside that Floor.

Floor I currently generates six pre-boss Depths plus The First Door.

---

# Mobile presentation

Portrait is now a first-class target.

- no rotate-phone gate;
- viewport-sized Phaser canvas;
- responsive portrait/landscape reflow;
- Loot offers stack vertically in portrait;
- Technique choices stack vertically in portrait;
- Event choices are portrait-sized;
- Shop stock becomes vertically readable cards;
- combat uses a portrait hierarchy rather than shrinking a desktop 1280×720 scene.

The client currently forces Phaser Canvas rendering for this systems-playtest stage because AARB does not need a high-complexity renderer and mobile reliability is more important than WebGL for these primitives.

---

# Combat composition

The new combat hierarchy follows the original successful prototype more closely:

1. run/Depth information;
2. enemy stage and HP;
3. enemy locked dice;
4. four large player dice;
5. Fight / Enemy / Margin / Spoils readout;
6. contextual tools;
7. thumb-reachable BUMP / COMMIT zone.

The combat systems are still resolved through `@aarb/core`.

---

# Dice rendering fix

The E7 client loaded the Dice V1 PNG atlas as Phaser sprites. On the user's Android browser the sprites appeared as black texture quads even on hosted HTTPS.

E8 removes that runtime failure path from combat entirely.

Combat dice are currently drawn deterministically from value/state with Phaser Graphics:

- canonical pip arrangements;
- Bonecast-like player material treatment;
- Ironcast-like enemy treatment;
- Fight / Spoils / Enemy / LOCKED / FIXED state frames;
- no external dice texture upload required.

The production Dice V1 art remains the art-direction/material reference. Runtime vector/pixel construction is a reliability implementation, not a reversal of the dice design bible.

---

# Procedural descent

New core modules:

- `procgen/descent.ts`
- `run/descent-run-state.ts`

Floor I owns a `thresholdsDescent` definition with six pre-boss slots and authored guarantees.

The existing graph/RunState infrastructure is retained internally. A generated Descent Sequence is projected into a hidden one-node-per-Depth graph so mature RunState / reward / Event / Shop behavior did not need to be rewritten.

The player does not see this graph.

The generic graph guarantee solver was also upgraded from greedy repair to deterministic constrained rerolling after the narrow descent projection exposed a repair-order failure.

---

# Current Floor I descent constraints

Six pre-boss Depths + Boss.

Requirements:

- Depth 1: Combat;
- minimum 3 Combats;
- minimum 1 Event;
- minimum 1 Shop;
- maximum 1 Elite;
- maximum 3 consecutive Combats;
- Boss last.

Exact slot grammar remains provisional and may loosen after human testing.

---

# Shared-core descent regression

The headless simulator now consumes the one-node-per-Depth Floor I projection, removing meaningful route selection from the old map-policy model.

Latest 1,000-run-per-policy regression after the six-Depth migration:

| Policy | Clear | Avg final HP | Damage | Combat rounds | Avg Spoils | Raw B4 |
|---|---:|---:|---:|---:|---:|---:|
| Safe | 97.6% | 18.68 | 7.37 | 17.66 | 5.54 | 1.9% |
| Opportunist | 95.8% | 16.90 | 8.51 | 17.29 | 7.28 | 13.4% |
| Greedy | 63.8% | 7.83 | 17.12 | 33.38 | 7.81 | 21.3% |

Interpretation:

- six pre-boss Depths does not obviously break survival pressure under perfect policy play;
- Opportunist raw premium rewards remain inside the provisional 5–15% target;
- Greedy obtains substantially more premium rewards while paying with much lower clear rate and roughly double damage/round exposure;
- individual normal encounters remain short; the longer Floor comes from more distinct encountered Depths rather than HP-sponge fights.

These are bot-policy measurements, not final difficulty certification.

---

# Current implementation truth

Implemented:

- no player-facing map loop;
- automatic Depth progression;
- portrait + landscape support;
- responsive Combat / Loot / Event / Shop / Technique states;
- generated Floor I descent;
- production combat/reward/item systems retained;
- runtime-drawn reliable dice;
- GitHub Pages automatic preview deployment.

Still presentation placeholders:

- Delver sprite;
- all creature sprites;
- modular THRESHOLDS room art;
- final HP/UI frames;
- final type system;
- icons;
- animation;
- VFX;
- SFX/music;
- polished descent transition.

Internally, several Phaser Scenes still implement the different run states. This is acceptable as an engineering detail: the player-facing contract is one continuous run surface. We can consolidate scene internals later only if doing so improves transitions/state persistence.

---

# Deferred

- title screen;
- New Run / Continue flow;
- character select;
- exact first-run onboarding entry;
- rare two-door route forks;
- Level 5 Technique final text;
- full multi-Floor launch sequence.

Do not invent a choose-level screen as a temporary substitute for these deferred decisions.

---

# Next gate

1. phone-test the deployed E8 build in portrait;
2. fix interaction/layout bugs revealed by real touch use;
3. freeze the minimal Floor I scene measurements;
4. produce the actual minimal production art/UI/environment pack against those measurements;
5. replace placeholder combatant/environment geometry;
6. add motion/audio/feedback;
7. human playtest again before expanding system scope.
