# AARB — Procedural Content Architecture

Status: canonical planning contract. THRESHOLDS is the laboratory used to prove this architecture; it is not a bespoke template for hand-authoring every future Depth.

## Goal
AARB should be capable of generating arbitrarily long, deterministic, reproducible descents from a curated content grammar. The generator does not invent arbitrary mechanics. Designers author strong primitives and compatibility rules; generation composes legal packages under pressure, novelty, pacing, and region constraints.

## Lessons from comparable generative games
### Spelunky
Use conservative structural guarantees plus authored reusable pieces. The generator guarantees playability and pacing; interactions between universal rules create surprise. AARB implication: generate encounter packages from known-valid pieces; do not use randomness as a substitute for encounter design.

### Caves of Qud
Use multiple tiers of generation and reusable abstractions. High-level concepts inform lower-level population and presentation. Mix authored landmarks/content with procedural systems rather than demanding that one generator create everything. AARB implication: Region identity and run context constrain enemy families, naming, events, rewards, environment grammar, and modifiers before fine-grained rolls occur.

### Noita
Emergence comes from a small number of consistently simulated rules interacting deeply. AARB implication: reusable triggers/conditions/actions and dice operations are more valuable than hundreds of bespoke one-off effects.

### Dicey Dungeons / Slice & Dice
Large pools require continual content audits, direct testing utilities, readable descriptions, and strong UI explanation. AARB implication: procedural quantity cannot outrun information architecture or testing.

## Vocabulary
### Run
A deterministic ordered descent produced from a master seed and ruleset version.

### Region
A content/environment grammar such as THRESHOLDS. A Region controls compatible enemy families, encounters, Events, Shops, Boss pools, environmental modules, naming grammars, loot biases, pressure curves, and rare content.

### Depth
One resolved encounter-state in the descent: Combat, Elite, Event, Shop, rare room, Boss, etc. Depth is not a hand-authored level number.

### Encounter Package
The complete generated specification for a Depth: encounter type, base entity/content, compatible modifiers, pressure budget, reward contract, presentation/environment recipe, and deterministic RNG references.

## Generation order
1. Master seed + ruleset version.
2. Mode definition: Standard, Daily, Endless, Challenge, Custom Seed.
3. Region sequence / Region Director.
4. Region pressure and pacing curve.
5. Depth-type sequence under hard constraints.
6. Encounter family / authored base selection.
7. Compatible modifier package within budget.
8. Reward/economy package.
9. Environment/presentation recipe.
10. Cosmetic/name microvariation on an isolated RNG stream.

Changing cosmetic generation must never perturb combat, encounter, or reward RNG.

## Hard rule: authored grammar, not procedural sludge
Generation may only combine mechanics explicitly declared compatible. Every generated result must be explainable in ordinary player-facing language and reproducible from a seed.

Do not generate arbitrary percentages or stat soup. Prefer discrete AARB operations: BUMP, FLIP, COPY, LOCK, FIX, reroll, Fight modification, Spoils modification, healing, Coins, carry, enemy lock changes, timing changes, and authored statuses.

## Content layers
### Enemy family
Authored tactical identity and visual/narrative family. Defines legal Instincts, rule slots, modifier tags, pressure range, Region compatibility, naming grammar, and art mutation sockets.

### Enemy modifier / affix
Reusable authored transformation with explicit compatibility tags, pressure cost, rule text, visual tell, and stacking exclusions. An affix must change a decision, not merely add invisible HP.

### Elite
Usually an authored high-pressure transformation or authored entity. Elite generation may combine only explicitly Elite-safe modifiers. Premium reward uplift remains authored by the encounter contract.

### Boss
Predominantly authored. Generation selects among Bosses and may apply tightly controlled mode/Region modifiers. Boss identity, phases, signature rules, and readable tells are not random soup.

### Gear
Best candidate for controlled procedural construction. Gear may combine an authored base/slot with a small number of compatible effect modules under a power budget. Generated Gear must receive deterministic readable naming and a complete one-sentence rule.

### Artifact
Predominantly authored and memorable. Artifacts are build-defining rule changers; procedural generation primarily controls availability and contextual variants, not arbitrary assembly.

### Contraband
Authored consumable actions with room for limited generated packaging/charges/conditional variants.

### Event
Authored situation templates with deterministic contextual substitutions and outcome tables. Generated prose cannot create mechanics that are not in the action grammar.

### Environment
Region-authored modular vocabulary assembled from compatible background, architecture, prop, lighting, foreground, and rare-feature modules. Presentation RNG is isolated from gameplay RNG.

## Pressure budget
Every generated combat receives a target pressure budget based on Region, Depth, player progression, mode, and pacing. Base enemy + Instinct + rules + affixes consume that budget. Budget is not displayed as a stat; it is an authoring/generation tool.

Pressure costs are validated through shared-core simulation and human playtesting. HP/dice increases are allowed but should not be the primary source of variety.

## Novelty memory
The Encounter Director tracks recent families, Instincts, rule tags, affixes, Events, and reward categories. Selection weights penalize repetition and reward tactical contrast. Hard duplicate bans should be used only where repetition is clearly bad; weighted novelty is safer for long/endless runs.

## Generated Gear grammar
A generated Gear recipe is:
- slot/base identity;
- trigger/condition;
- target;
- action;
- cadence/cost;
- optional downside;
- power budget;
- compatibility tags;
- deterministic name grammar;
- complete generated rules sentence.

Example legal recipe: `UTILITY + first tie each encounter + enemy + 1 damage + once/encounter`.
Example rejected recipe: `+3.7% Fight, +2.1% Spoils, +1.4% Crit` because AARB has no need for opaque percentage soup.

## Daily Run
Daily seed derives from date + ruleset version + Daily modifier ID. Gameplay RNG is deterministic. The same player decisions from the same state produce the same results. Daily modifiers are authored overlays, not changes to core rules.

## Endless
The Region Director continues selecting Regions and increasing pressure while novelty memory and compatibility constraints remain active. Endless does not require new engine code per Depth.

## Standard campaign
Standard mode may use authored Region sequencing, milestone Bosses, unlock gates, narrative beats, and curated first exposures while still generating individual Depth packages. Hand-authored structure and procedural detail are complementary.

## Validation gates
A generated content system cannot ship until:
1. schema validation rejects illegal combinations;
2. seeded generation reproduces exactly;
3. 10k+ generated encounter packages produce zero illegal states;
4. novelty telemetry measures repetition;
5. generated rule text round-trips to the actual mechanics;
6. generated content can be forced through the dev harness;
7. simulation catches power outliers;
8. human audit samples generated outputs for coherence and humor;
9. no Region or mode requires bespoke combat branches in the client.

## THRESHOLDS' role
THRESHOLDS is the engine laboratory. New representative content should be chosen partly because it proves missing vocabulary: statuses, multi-enemy encounters, environmental rules, conditional phases, generated Gear, affixes, rare rooms, Region modifiers, etc. Experiments do not automatically become permanent content.

## Anti-goals
- 1,000 hand-authored `FloorNNN` files.
- one giant random table with no constraints.
- arbitrary stat affixes.
- procedural Bosses with no identity.
- generated flavor disconnected from mechanics.
- randomness that changes because an animation or prop was added.
- procedural quantity used to hide weak authored primitives.
