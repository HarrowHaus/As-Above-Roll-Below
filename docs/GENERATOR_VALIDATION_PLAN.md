# AARB — Procedural Generator Validation Plan

Purpose: prevent the project from becoming disconnected chunks of individually decent procedural ideas.

## Principle
A new generator feature is not accepted because it produces funny samples. It must integrate with the hierarchy, deterministic RNG, information system, simulator, content taxonomy, and player decision loop.

## Reference lessons
- Caves of Qud: link systems at multiple levels of granularity with multipurpose tools; use multi-pass generation instead of one omniscient generator.
- Qud history: do not simulate complexity the player cannot meaningfully perceive; generate meaningful events/structure and rationalize/present coherently.
- Dicey Dungeons: repeatedly audit the entire enemy pool; recognizable enemy variants can remix existing foundations instead of requiring wholly new enemies.
- AARB implication: authored identity + constrained generation + repeated audits.

## Validation ladder
Every new procedural domain moves through these gates.

### G0 — authored examples
At least 3 hand-designed examples establish what 'good' means before proceduralization.

### G1 — schema
Encode only the dimensions actually shared by those examples. No speculative mega-schema.

### G2 — compatibility
Declare legal/incompatible combinations explicitly. Default is not 'everything combines with everything.'

### G3 — deterministic generation
Same seed + ruleset version + content registry produces the same output. Cosmetic streams cannot perturb gameplay streams.

### G4 — explainability
Generated output produces complete player-facing text using the same information vocabulary as authored content. If the generator cannot explain it, reject it.

### G5 — static validation
Reject impossible, redundant, contradictory, over-budget, under-budget, duplicate, or unsupported combinations before simulation.

### G6 — batch simulation
Run large seed batches through Safe/Opportunist/diagnostic policies. Track survival, rounds, damage, reward distribution, trigger frequency, dead effects, and outliers.

### G7 — diversity metrics
Measure more than unique IDs. Track:
- tactical-question distribution;
- family repetition distance;
- affix repetition distance;
- provenance/category distribution;
- Instinct distribution;
- rule-package distribution;
- reward/build archetype distribution;
- Region-affinity violations;
- generated-text duplicates.

### G8 — manual sample audit
Humans inspect random seeds, worst outliers, most common outputs, rare outputs, and intentionally adversarial seeds. Procedural content can be mathematically legal and still boring/stupid.

### G9 — playable harness
Every family/affix/generated Gear recipe/status can be forced directly through debug query/state serialization.

### G10 — production lock
Only after the above does the feature enter normal run generation.

## First grammar experiments
Order matters.

1. Enemy Affix v0
   - begin with 3–4 tactical affixes, not 30;
   - affixes modify an authored family without erasing its identity;
   - affix must create a different decision, not only HP inflation.

2. Generated Gear v0
   - use authored bases + trigger/target/action/cadence recipe;
   - strict power budget;
   - generated sentence required;
   - no percentage-stat soup.

3. Status Engine v0
   - typed duration and timing semantics;
   - visible source/effect/duration;
   - same engine for player and enemy where possible.

4. Environment Rule v0
   - one room/Depth modifier independent of enemy identity;
   - Region grammar owns eligibility.

5. Multi-enemy prototype
   - only after statuses and targeting semantics are stable;
   - reject if it destroys the clean two-dice decision readability.

## Affix v0 candidate design space
Do not implement names yet; first prove mechanics.
- reactive: first manipulation causes a bounded response;
- persistent pressure: one enemy die begins LOCKED/modified under clear rules;
- reward pressure: alters Spoils evaluation in a visible way;
- tempo: changes on round N or after a tie.

Forbidden v0 affixes:
- plain +X HP as the entire identity;
- hidden probabilities;
- rules requiring paragraph-length explanation;
- combinations that duplicate the base family's existing rule;
- two affixes simultaneously.

## Generated Gear v0 grammar
Recipe = base form + trigger + target + action + cadence/cost + optional drawback.

Start with a deliberately tiny legal matrix. Example dimensions:
Triggers: tie; Margin exactly 1; Fight doubles; Spoils opposites; first damage; raw Fight threshold.
Targets: self Fight; Spoils; one player die; one enemy locked die; HP; Coins; next cast.
Actions: +Fight; +Spoils; BUMP; FLIP; LOCK/carry; heal; coin; enemy die -1.
Cadence: once/encounter; first trigger/encounter; consume; explicit HP/Coin cost.

Every recipe receives a budget score. Certain trigger/action pairs are illegal regardless of budget.

## Anti-convolution rules
- Never add a subsystem only to support one content object; first ask whether an existing primitive expresses it.
- Never add a generic abstraction until at least three concrete authored examples justify it.
- Prefer one shared timing/effect primitive over enemy/item-specific callbacks.
- Prefer tags/compatibility data over item-name conditionals.
- Prefer a narrow generator with strong outputs over a broad generator that needs exceptions.
- Remove generator dimensions that simulations/manual audits show do not create distinct decisions.
- A procedural feature must make the run more surprising without making the rules harder to understand.

## Endless and Daily
These are consumers of the same generator, not separate generators.

Daily = deterministic master seed derived from date + ruleset version + Daily modifier package.
Endless = Region Director continues selecting legal Region/pressure/content packages while novelty memory and scaling constraints operate.

Both must use the same content registry and validation pipeline as Standard runs.
