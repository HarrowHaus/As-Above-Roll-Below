# As Above, Roll Below — Run Structure & Generation Spec

**Version:** 0.1  
**Status:** canonical preproduction route/generation contract

Procedural generation exists to create different decisions, not arbitrary noise.

---

# 1. Full-run target

Successful run target: **25–35 minutes**.

Baseline structure:

- 4 Floors
- 4 visited pre-boss rooms per Floor
- 1 Boss per Floor
- approximately 20 visited rooms in a winning run

Not every pre-boss room is combat.

Target run composition across all Floors:

- 8–11 Normal/Tough combats
- 1–3 Elites
- 2–4 Events
- 2–4 Shops
- 4 Bosses

The exact mix varies by route and seed.

---

# 2. Floor graph

Each Floor contains:

- Start
- 4 decision rows
- Boss endpoint

Each row normally contains 2–3 nodes.

Nodes connect forward only.

A node normally connects to 1–2 nodes in the next row.

The generator must ensure:

- every visible node lies on at least one path to the Boss;
- no path dead-ends;
- route choices meaningfully diverge for at least part of the Floor;
- the graph does not collapse into one forced path except during a deliberately authored special Floor/boss sequence.

---

# 3. Room categories

Baseline node types:

## Combat
Normal/tough enemy.

## Elite
Optional premium-danger encounter.

## Event
2–3 choice system event.

## Shop
Spend Coins / heal / adjust build.

## Boss
Floor endpoint.

Future room types require a design amendment. Do not add `Rest`, `Treasure`, `Shrine`, `Forge`, etc. merely because another roguelike has them; their function must not already be covered by Event, Shop, or combat rewards.

---

# 4. What the map reveals

Before choosing a route, player sees:

- room category icon;
- Elite marker when applicable;
- Shop marker;
- Event marker;
- Boss identity silhouette/name only when the content design wants that information revealed.

Exact normal enemy identity remains hidden until entry.

Possible later feature:

- broad reward-bias icon on special combat/event nodes.

This is not required in the vertical slice.

---

# 5. Floor I generation rules

Floor I teaches the complete basic run grammar.

Constraints:

- Row 1: Combat only. No Shop, Elite, or Event.
- At least 2 visited Combat rooms are possible on every route.
- At least 1 Event opportunity appears somewhere in Rows 2–4.
- At least 1 Shop opportunity appears somewhere in Rows 3–4.
- Elite may appear as an optional path in Row 3 or 4, but no Floor I route requires it.
- Boss fixed to Floor I boss pool.

Purpose:

The first reward/build decision happens before the player is asked to interpret more exotic room types.

---

# 6. Floor II generation rules

Constraints:

- at least 1 Combat in Rows 1–2;
- at least 1 Shop opportunity on the graph;
- at least 1 Event opportunity;
- at least 1 optional Elite opportunity;
- no route may contain more than 3 consecutive combats unless a difficulty modifier explicitly permits it.

Floor II begins testing the build assembled on Floor I.

---

# 7. Floor III generation rules

Constraints:

- at least 1 optional Elite opportunity;
- at least 1 Shop or high-value Event opportunity;
- stronger Tough-normal weighting;
- Event pool may use more build-conditioned options;
- no route forced through two Elites.

Floor III is the build-pressure Floor: the player should start replacing earlier foundational items rather than only filling empty slots.

---

# 8. Floor IV generation rules

Constraints:

- guaranteed Shop opportunity somewhere in Rows 2–4, but not necessarily on every path;
- guaranteed optional Elite opportunity;
- Tough/late-game enemy weighting increased;
- no ordinary low-impact tutorial events;
- final Boss fixed to final-boss pool.

The player should enter the final boss with a completed build, not still waiting for the run to become interesting.

---

# 9. Vertical-slice Floor target

One Floor, 4 pre-boss visited rooms + Boss.

Graph contains:

- mandatory first Combat;
- at least one second Combat;
- one Event opportunity;
- one Shop opportunity;
- one optional Elite path;
- Boss.

The player will not visit all opportunities in one run.

This matters: route choice must already exist in the vertical slice rather than being deferred to full production.

---

# 10. Encounter selection

Encounter generator inputs:

- Floor number
- node type
- run seed
- encounter history
- current difficulty modifier set

The generator does **not** inspect the player's exact build to select a counter.

It may inspect only generic safety constraints such as:

- content not yet tutorial-eligible;
- duplicate encounter suppression;
- encounter requires a mechanic the current mode has disabled.

Rules:

- no same normal enemy twice consecutively unless an authored encounter says so;
- avoid three encounters in a Floor with the same Instinct profile;
- every Floor should expose at least 3 distinct tactical problems across available paths;
- boss selection occurs at run start / Floor generation for deterministic seed behavior.

---

# 11. Encounter pools by pressure

Content records have a `pressure_band` independent of art/lore.

Suggested baseline:

- P1: tutorial/easy
- P2: normal
- P3: tough normal
- P4: elite
- P5: boss/custom

Floor weighting moves upward gradually.

Do not scale the same monster's HP forever to fill every Floor. Use distinct rules/profiles/content.

---

# 12. Event generation

Events selected from Floor-eligible pool.

Generator avoids:

- same Event twice in one run;
- event whose only meaningful choice is invalid under current run state;
- event requiring an owned item/tag if no fallback choices remain.

Events may detect build tags to expose additional options.

Example shape:

- base choice A
- base choice B
- conditional choice C: `[Artifact: Archive]`

Conditional choices are bonuses, not mandatory solutions.

---

# 13. Shop generation

Shop contents are seeded and fixed when the Shop node is generated/revealed according to implementation policy.

Reopening the same Shop never changes inventory for free.

Shop generator uses Floor-tier eligibility and owned-item invalidation rules from LOOT_AND_ECONOMY_SPEC.md.

Route generator aims to create an **opportunity** to use Coins; it does not guarantee the player chooses that route.

---

# 14. Route risk/value

A route choice should usually contrast at least two of:

- expected HP risk
- premium loot opportunity
- Shop access
- Event flexibility
- Elite reward
- shorter/safer route profile

Avoid fake choices where both branches contain functionally identical room sequences.

A map-generation QA script should compare route signatures and reject near-identical branches above a similarity threshold.

---

# 15. Healing distribution

Healing sources baseline:

- player Level: heal 2 on level-up
- Shop service: heal 4 for Coins
- Boss clear: heal 2
- selected Events/Contraband/Gear may heal

There is no automatic full heal between Floors.

Route generation must not guarantee healing before every boss.

The balance model, not the generator, determines whether expected healing is sufficient.

---

# 16. RNG streams

Use independent deterministic RNG streams derived from master seed:

- map
- encounter selection
- enemy combat dice
- loot offers
- shop inventory
- events
- event outcomes
- boss behavior randomization where used
- cosmetic/non-gameplay randomness

A cosmetic animation change must never perturb future combat rolls.

---

# 17. Seed contract

Run seed + player character + difficulty/mode fully determine all initial RNG streams.

Same seed and same player decisions should reproduce gameplay-relevant random outcomes.

Required for:

- debugging
- simulation reproduction
- Daily Runs
- shared Challenge Seeds
- bug reports

Run summary should expose/copy seed.

---

# 18. Save/resume contract

Autosave at minimum:

- entering a room;
- after irreversible combat COMMIT resolves;
- after choosing Loot;
- after Shop transaction;
- after Event choice;
- after Level Technique selection;
- after Floor transition.

Reload must restore the exact RNG stream states so quitting cannot reroll an outcome.

---

# 19. Difficulty architecture

Baseline first release should eventually support difficulty tiers/modifiers after normal mode is balanced.

Difficulty may adjust:

- pressure-band weights
- Elite frequency/options
- healing/economy
- boss phase/rules
- enemy special-rule strength
- route constraints

Difficulty should **not** primarily be `enemy HP × 1.5`.

No higher difficulty implementation belongs in the vertical slice beyond debug toggles.

---

# 20. Daily / Challenge mode future contract

Daily Seed uses:

- fixed seed
- fixed character or allowed character set
- fixed modifier package
- comparable score metrics

Potential score metrics:

- victory
- remaining HP
- Coins retained/spent efficiency
- Elite clears
- average Spoils
- damage taken
- run time as secondary metric

Do not build leaderboard scoring before normal run scoring events are instrumented.

---

# 21. Generation QA

Automated generated-run batch should flag:

- unreachable nodes
- dead ends
- forced Elite on forbidden Floor/difficulty
- missing Shop opportunity where required
- missing Event opportunity where required
- more than allowed consecutive combats
- duplicate consecutive enemy
- route branches with near-identical type sequences
- invalid shop/item pool exhaustion
- boss missing

Generate thousands of seeds during balance rather than relying on hand inspection.
