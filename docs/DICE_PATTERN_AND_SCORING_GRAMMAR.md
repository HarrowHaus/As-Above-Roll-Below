# AARB — Dice Pattern & Scoring Grammar

Status: design candidate for simulation; not yet canonical combat math.

## Why this exists
AARB rolls four player dice. Those four faces are not merely four numbers from which two are selected. They are a compact pattern space. The engine should be able to recognize patterns across the full cast, the selected Fight pair, and the unselected Spoils pair, then let Gear/Artifacts/Statuses react to them.

This is how four ordinary d6 can support deep builds without adding a large RPG stat sheet.

## Three pattern scopes
Every pattern condition declares a scope.

### CAST
All four rolled player dice before selection.
Examples: all four identical; four unique; two pairs; 1-2-3-4; total >= 20.

### FIGHT
The two selected Fight Dice.
Examples: doubles; opposites; consecutive; both even; sum 10+.

### SPOILS
The two unselected dice after Fight selection.
Examples: doubles; opposites; consecutive; sum <= 5.

A condition must never ambiguously say `on doubles`; it says which scope it inspects.

## Cast pattern vocabulary v0
Patterns should be computed once into a CastPatternProfile and queried by effects.

- FOUR_OF_A_KIND: a,a,a,a. Rare natural jackpot: 6 / 6^4 = 1/216.
- THREE_OF_A_KIND: exactly a,a,a,b.
- TWO_PAIR: exactly a,a,b,b.
- ONE_PAIR: exactly a,a,b,c.
- ALL_UNIQUE: a,b,c,d all distinct.
- FOUR_RUN: four consecutive unique values: 1-2-3-4, 2-3-4-5, or 3-4-5-6.
- ALL_ODD: all four are odd.
- ALL_EVEN: all four are even.
- CAST_TOTAL_AT_LEAST_N.
- CAST_TOTAL_AT_MOST_N.
- CONTAINS_FACE_N / FACE_COUNT_N.

The engine may later support derived patterns, but v0 should remain small enough that players can actually learn the language.

## Fight/Spoils pair vocabulary v0
- DOUBLES
- OPPOSITES (1+6, 2+5, 3+4)
- CONSECUTIVE
- BOTH_ODD / BOTH_EVEN
- SUM_AT_LEAST_N / SUM_AT_MOST_N
- CONTAINS_FACE_N

## Natural vs manufactured patterns
Every pattern event records whether it was present on the original cast and whether manipulation created/broke it.

This gives us two useful effect families:
- `When you CAST four identical faces...` means natural pre-manipulation cast only.
- `If your current four dice are identical when you COMMIT...` allows build-engineered jackpots.

The distinction must be explicit in rules text. We should use natural-only triggers sparingly because manipulation is one of the game's central pleasures.

## Pattern precedence
Unlike poker, AARB does not need to classify a cast into exactly one hand. A cast can satisfy multiple predicates. `2,2,2,2` is FOUR_OF_A_KIND, ALL_EVEN, contains four 2s, and has total 8.

Effects query predicates independently. This supports synergies.

However, reward/scoring systems that need one named headline pattern may use precedence:
FOUR_OF_A_KIND > FOUR_RUN > THREE_OF_A_KIND > TWO_PAIR > ONE_PAIR > ALL_UNIQUE.

This headline classification is presentation only; it does not suppress other effect triggers.

## Jackpot design
FOUR_OF_A_KIND is rare enough naturally (~0.46%) to support spectacular effects, but manipulation can make it a build target.

Good examples:
- Artifact: `When you COMMIT four identical current faces, x3 Impact.`
- Gear: `Natural FOUR_OF_A_KIND: this hit RETRIGGERS twice.`
- Contraband: `If you have three matching faces, set the fourth to that value. Consume.`
- Enemy: `If your cast contains three or more identical faces, it panics: -2 Enemy Fight.`
- Curse/status: `Four identical faces wake it.`

The effect should be memorable because the pattern is memorable. Do not waste FOUR_OF_A_KIND on `+2 damage`.

## Pattern economy
Patterns create a second build axis alongside Margin.

A player can build around:
- high Margin,
- doubles,
- opposites,
- runs,
- repeated faces,
- all-unique casts,
- parity,
- specific faces,
- Spoils patterns,
- manipulation/retrigger interactions.

No build should require a scorecard menu. The current dice should visually announce recognized patterns.

## UI requirement
When a relevant pattern appears, communicate it on the dice surface:
`FOUR OF A KIND` / `TWO PAIR` / `OPPOSITE SPOILS` etc.

Only show pattern labels that matter to owned effects or a major universal jackpot rule. Do not flood the player with every mathematically true predicate.

## Engine requirement
Add a pure deterministic `analyzeCast(dice)` function returning counts, unique values, total, parity, runs and named predicates. Effect conditions consume that profile; they do not each reimplement pattern math.

## Simulation gate
Before universal pattern bonuses are locked, simulate:
1. natural pattern frequencies;
2. frequencies after current manipulation tools;
3. build-specific frequencies with Mirror Shard/Carbon Paper/Blank Face/Caliper;
4. damage contribution from each pattern trigger;
5. whether a pattern build can force jackpots too reliably;
6. whether jackpot effects dominate ordinary Margin decisions.

Goal: rare patterns should feel explosive, but engineered pattern builds should require meaningful opportunity cost rather than trivially forcing the same combo every cast.
