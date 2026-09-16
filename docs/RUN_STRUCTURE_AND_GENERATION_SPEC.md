# As Above, Roll Below — Run Structure & Generation Spec

**Version:** 0.2  
**Status:** canonical preproduction descent/generation contract

Procedural generation exists to create different decisions and pressure curves, not arbitrary noise.

The baseline player experience is a **continuous descent through Depths**, not repeated map navigation.

---

# 1. Full-run target

Successful run target: **25–35 minutes**.

Macro structure:

- 4 Floors at initial full-release target;
- each Floor is a biome/chapter/content package;
- each Floor contains a generated sequence of Depths;
- each Floor ends in a Boss encounter.

The engine must support an arbitrary ordered list of Floor definitions. Four Floors is content scope, not an engine constant.

---

# 2. Depth sequence

A Floor resolves into an ordered **Descent Sequence**.

A Depth is one encountered state:

- Combat
- Elite
- Event
- Shop
- Boss

The player experiences one Depth at a time.

Baseline transition:

`Depth N → resolution/reward → DESCEND → Depth N+1`

There is no mandatory player-facing graph/map between these states.

---

# 3. Internal graph tooling

The existing generic FloorGraph generator remains valid engine infrastructure for:

- generation QA;
- alternate modes;
- future rare forks;
- route-space analysis;
- debug visualization.

It is **not** the baseline production UI.

The production run layer may either:

1. generate a Descent Sequence directly from a Floor definition; or
2. generate a hidden graph and deterministically resolve a valid path from it.

Whichever implementation survives testing, the player-facing contract remains sequential descent.

---

# 4. Descent-definition requirements

A Floor definition should be able to constrain:

- total pre-boss Depth envelope;
- allowed room types by Depth window;
- minimum Combat count;
- maximum consecutive Combat count;
- Event count/window;
- Shop count/window;
- Elite count/window;
- pressure-band progression;
- duplicate suppression;
- Boss endpoint;
- special authored sequence rules.

Random generation must satisfy these constraints before a run begins or before the relevant Floor is entered, according to save/stream architecture.

---

# 5. Floor I — THRESHOLDS target

Floor I teaches the complete baseline run grammar without a map.

Current provisional vertical-slice envelope:

- 5–7 pre-boss Depths;
- opening Depth is always Normal Combat;
- at least 3 total Combat encounters;
- exactly or at least 1 Event during the slice target;
- exactly or at least 1 Shop during the slice target;
- 0–1 Elite;
- Boss endpoint: The First Door.

Example valid seed shape:

`Combat → Combat → Event → Combat → Shop → Elite → Boss`

Another:

`Combat → Event → Combat → Shop → Combat → Combat → Boss`

The exact count/order remains PROVISIONAL until the shared-core simulator is rerun under the descent model and human run-time is measured.

---

# 6. Later Floor progression

## Floor II
- stronger P2/P3 normal weighting;
- at least one Shop;
- at least one Event;
- 0–1 Elite baseline;
- no excessive early combat streaks.

## Floor III
- stronger Tough-normal weighting;
- build-conditioned Event choices increase;
- earlier item replacement pressure;
- Elite chance/pressure increases.

## Floor IV
- late-game enemy weighting;
- guaranteed economy access before final Boss within a reasonable Depth window;
- no low-impact tutorial Events;
- final Boss pool fixed/seeded.

These are content targets, not hard-coded Floor-number branches in the engine.

---

# 7. Encounter selection

Encounter Director inputs:

- Floor definition/content pack;
- Depth index;
- Depth type;
- run seed / named RNG stream;
- encounter history;
- current difficulty modifier set.

The Director does **not** inspect the player's exact build to select a counter.

It may inspect only generic validity constraints such as:

- tutorial eligibility;
- duplicate suppression;
- mechanic disabled in current mode;
- encounter already overrepresented in the same Floor.

Rules:

- no same normal enemy twice consecutively unless authored;
- avoid repetitive Instinct profiles;
- a Floor should expose multiple distinct tactical problems;
- Boss selection is deterministic from seed/content rules.

---

# 8. Encounter pressure

Content records retain `pressure_band` independent of art/lore.

Suggested meaning:

- P1 tutorial/easy
- P2 normal
- P3 tough normal
- P4 Elite
- P5 Boss/custom

The Descent Director should generally increase pressure as Depth rises without simply inflating HP on the same monster forever.

Use distinct enemy rules/profiles/content.

---

# 9. Event generation

Events selected from the Floor-eligible pool.

Avoid:

- same Event twice in one run unless authored;
- Event whose only meaningful choice is invalid;
- conditional-item Event with no baseline fallback choice.

Events may inspect build tags to reveal additional options.

Resolving an Event continues the descent immediately unless the Event creates an item/replacement decision.

---

# 10. Shop generation

Shop stock is deterministic and fixed once generated/revealed.

Reopening/redrawing the same Shop never gives free rerolls.

Shop generator uses Floor-tier eligibility and owned-item invalidation rules from `LOOT_AND_ECONOMY_SPEC.md`.

The Descent Director guarantees or strongly schedules economy opportunities where the Floor contract requires them; the player does not need to navigate a map to reach the Shop in baseline mode.

---

# 11. Elite scheduling

Elite is a premium-risk Depth, not a map icon by default.

Floor definitions control:

- whether an Elite can appear;
- earliest/latest Depth window;
- max Elite count;
- pressure prerequisites;
- reward uplift.

A future direct fork may offer `Normal door` versus `Elite door` in place, but this is not required for the vertical slice.

---

# 12. Healing distribution

Baseline sources:

- Level: heal 2 on level-up;
- Shop service: heal 4 for Coins;
- Boss clear: heal 2;
- selected Events/Contraband/Gear.

No automatic full heal between Floors.

The generator must not guarantee healing before every Boss.

Balance model determines expected survivability.

---

# 13. Reward cadence

Ordinary Combat/Elite victory:

`Final-Blow Spoils → Loot Draft → descend`

Boss victory:

`Boss clear reward/heal → premium Boss Draft → Floor transition`

Event/Shop Depths may not create a standard Loot Draft unless their authored content says so.

---

# 14. RNG streams

Independent deterministic streams derived from master seed:

- descent sequence;
- encounter selection;
- enemy combat dice;
- player combat dice where generated by engine;
- loot offers;
- shop inventory;
- events;
- event outcomes;
- boss behavior randomization where used;
- cosmetic/non-gameplay randomness.

A cosmetic animation change must never perturb future gameplay outcomes.

---

# 15. Seed contract

Run seed + character + difficulty/mode fully determine initial gameplay RNG streams.

Same seed and same player decisions reproduce gameplay-relevant random outcomes.

Required for:
- debugging;
- simulation;
- Daily Runs;
- challenge seeds;
- bug reports.

Run summary exposes seed.

---

# 16. Save/resume contract

Autosave at minimum:

- entering a Depth;
- after irreversible COMMIT;
- after Loot selection;
- after Shop transaction;
- after Event choice;
- after Technique selection;
- after Floor transition.

Reload restores exact RNG stream states.

Quit/reload cannot reroll an outcome.

---

# 17. Difficulty architecture

Later difficulty may adjust:

- pressure-band weighting;
- Elite frequency;
- healing/economy;
- Boss rules/phases;
- enemy rule strength;
- descent composition constraints.

Difficulty should not primarily be `enemy HP × 1.5`.

No higher-difficulty implementation is required for the vertical slice.

---

# 18. Future forks

Rare route agency is allowed if it earns its complexity.

Preferred presentation:

- two doors;
- two next-room summaries;
- `safer descent` vs `Elite descent`;
- Event-authored branch.

The choice appears in the existing Run Shell.

Do not reopen the mandatory map-screen architecture merely to support occasional forks.

---

# 19. Generation QA

Automated batches should flag:

- invalid/empty sequence;
- Boss missing or not last;
- opening Depth violates Floor rule;
- missing minimum Combat count;
- excessive consecutive combats;
- missing required Event/Shop;
- Elite outside legal window/count;
- duplicate consecutive enemy;
- repetitive Instinct distribution;
- invalid Shop/item pool exhaustion;
- invalid Event choice state;
- pressure curve regressions.

Generate thousands of seeds during balance rather than relying on hand inspection.

---

# 20. Migration from E7 map shell

The E7 branching-map client is now **debug/reference code**, not the production UX target.

Migration order:

1. add/validate deterministic Descent Sequence data in `@aarb/core`;
2. adapt headless simulator to consume the same sequence;
3. rerun shared-core balance;
4. build one responsive Run Shell scene/client state machine;
5. auto-advance Depth after resolved reward/Event/Shop;
6. keep old graph/map only for debug visualization until no longer useful.

Do not discard validated combat/reward/effect code. This is a run-presentation/generation refactor, not a combat rewrite.