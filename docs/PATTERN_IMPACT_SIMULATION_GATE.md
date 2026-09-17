# AARB — Pattern + Impact Simulation Gate

Status: pre-implementation experiment. Do not replace shipping Margin damage until this gate passes.

## Question
Can AARB produce fast, escalating, satisfying damage through dice patterns and build interactions while keeping four ordinary d6 readable and important?

## Pattern detector must evaluate two snapshots
- NATURAL_CAST: four faces before player manipulation.
- COMMIT_CAST: current four faces when COMMIT is pressed.

It must also evaluate FIGHT_PAIR and SPOILS_PAIR independently.

## Required CAST patterns
FOUR_KIND, THREE_KIND, TWO_PAIR, ONE_PAIR, ALL_UNIQUE, FOUR_RUN, ALL_ODD, ALL_EVEN, CONTAINS_FACE_N, COUNT_FACE_N, TOTAL_AT_LEAST_N.

## Required pair patterns
DOUBLES, OPPOSITES, CONSECUTIVE, BOTH_ODD, BOTH_EVEN, TOTAL_AT_LEAST_N, TOTAL_AT_MOST_N.

## Probability baseline for natural 4d6 casts
Enumerate all 1296 casts exactly; do not Monte Carlo these baselines.

Known check: FOUR_KIND = 6/1296 = 1/216 ≈ 0.463%.

The report must include exact probabilities for every baseline pattern, including overlap. Patterns are predicates, not mutually exclusive poker hands.

## Candidate Impact pipelines
A — CONTROL: damage = positive Margin.

B — POWER: Impact = Margin × contextual Power.

C — STAGED: Impact = (Margin × Power + additive bonuses), then multiplicative effects, then bounded aftermath/retriggers.

D — PATTERN-FIRST comparator: base Impact receives a pattern bonus before build effects. This is included only to test whether making patterns universally powerful crowds out item identity.

## Representative build suites
Each suite must be explicitly authored; no random build soup.

1. Baseline: no scaling pieces.
2. Margin: raises Margin/Power from strong Fight choices.
3. Doubles: rewards Fight doubles and repeated faces.
4. Opposites: FLIP/manipulation plus opposite-face triggers.
5. Jackpot: tries to manufacture triples/four-kind; includes Carbon Paper / Blank Face style tools.
6. Greed: Spoils patterns improve rewards and feed later combat power.
7. Retrigger: bonus-hit chain candidate with strict chain-depth/proc rules.
8. Weak/misaligned: intentionally mediocre build used to ensure the game remains playable without perfect synergy.

## Manipulation scenarios
Measure pattern reachability with:
- no manipulation;
- one BUMP;
- one FLIP;
- one COPY;
- one set-to-1-or-6 transmute;
- representative two-tool builds;
- high-control late build.

For every pattern report:
- natural frequency;
- achievable frequency after optimal legal manipulation;
- average resource/actions spent to manufacture it;
- whether the same manipulation sacrifices Fight or Spoils quality.

## Enemy durability models
Do not choose HP by Depth alone. Test target casts-to-kill.

Normal target: usually 1–3 successful damaging casts.
Elite target: usually 3–6 meaningful casts.
Boss target: enough casts for its authored phase/rule structure to appear, without becoming a sponge.

Generate durability from pressure budget and expected output band, then verify actual rounds-to-kill under all build suites.

## Required telemetry
- damage p10/p25/median/p75/p90/p99/max;
- successful Margin distribution;
- Impact distribution;
- rounds/casts to kill by enemy class;
- percentage of total damage coming from Margin vs additive vs multiplier vs retrigger;
- pattern activation rate per build;
- natural vs manufactured jackpot rate;
- manipulation actions per round;
- overkill;
- dead/irrelevant item trigger rate;
- chain depth and secondary-trigger count;
- weak-build clear viability;
- high-synergy runaway rate.

## Guardrails
Reject/tune a candidate if:
1. ordinary Margin becomes irrelevant to most damage;
2. a single multiplier dominates most builds;
3. four-kind or other jackpots become routine under modest control;
4. optimal play requires excessive manipulation clicks every round;
5. enemy HP must inflate faster than player output just to preserve fight length;
6. weak/misaligned builds become mathematically doomed too early;
7. generated Gear produces effects that cannot be explained in one concise rule sentence;
8. retriggers can recursively retrigger without an explicit budget;
9. the best strategy is always to force the same pattern regardless of enemy/build;
10. Spoils becomes irrelevant because every good face must always be spent on Fight patterns.

## First experimental content
Use a deliberately small test pool.

### Pattern artifacts
- FOURTH WITNESS: COMMIT four-kind -> ×3 Impact. Jackpot benchmark, not presumed balanced.
- REPETITION STUDY: Fight doubles add a run-long counter; test escalating additive payoff rather than instant multiplier.
- OPPOSITE NUMBER: existing Spoils-opposites effect; retain as reward-side pattern benchmark.
- LOADED QUESTION: existing Spoils-doubles benchmark.

### Pattern Gear
- Breaching Bar: existing raw Fight >=10 benchmark; compare current +2 damage to an Impact-scaled version.
- Twin Nails: existing Fight doubles benchmark.
- One new all-unique Gear effect for contrast.

### Enemy reactions
One enemy that punishes repeated faces; one that changes behavior on ALL_UNIQUE; one neutral baseline. Do not implement a large bestiary until these demonstrate that enemy pattern reactions create decisions rather than taxes.

## Decision after simulation
Choose the smallest pipeline that produces:
- readable early damage;
- visible mid-run acceleration;
- occasional dramatic late spikes;
- short ordinary fights;
- meaningful enemy mechanics;
- multiple viable pattern/build routes.

Only then promote Impact and pattern predicates into the production effect engine.