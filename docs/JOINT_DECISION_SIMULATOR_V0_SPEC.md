# AARB — Joint Decision Simulator V0

This is the next experimental simulator. It must not alter shipping combat yet.

## Why
A roll cannot be evaluated by damage alone. The same four faces are simultaneously resources for Fight, Spoils, pattern construction, manipulation triggers, carried dice, enemy reactions, and future build value.

The simulator therefore chooses a complete action package, not simply the highest pair.

## State input
- natural 4d6 cast;
- current cast after any carried/locked/fixed state;
- enemy locked dice and rule package;
- player HP / enemy HP;
- inventory and remaining active uses;
- current build counters/statuses;
- current reward/economy pressure;
- whether this is normal / Elite / Boss;
- current run depth/pressure band.

## Legal action search
For each cast enumerate:
1. every legal Fight pair;
2. resulting Spoils pair;
3. zero manipulation;
4. every legal single manipulation;
5. legal two-step manipulation sequences only when the build actually owns two compatible actions;
6. optional consumable use;
7. COMMIT.

Never search arbitrary unlimited manipulation chains. The player-facing game must remain fast.

## Candidate scoring terms
The optimizer does not use one universal score. Each policy/build has weights for:
- probability of winning this cast;
- expected incoming damage;
- immediate Impact;
- kill probability / overkill waste;
- Spoils score and reward band;
- Fight pattern value;
- Spoils pattern value;
- CAST pattern value;
- preserving once-per-encounter tools;
- preserving Contraband;
- preserving carried die;
- triggering enemy reactions;
- HP/economy value;
- build-specific counters/mastery.

## Policies
SAFE: survival first, then efficient kill, then reward.
OPPORTUNIST: survival-aware; pursues patterns/reward while healthy and converts to safety when pressure rises.
GREEDY: reward/pattern-biased diagnostic policy; allowed to expose itself but not intentionally choose a losing action when a win exists unless the build explicitly rewards that state.
BUILD_SPECIALIST: pursues its authored synergy while respecting a minimum survival floor.

## Representative build definitions
### Baseline
No pattern payoff. Used to verify patterns do not become mandatory universal scoring.

### Doubles
Twin Nails plus a test Repetition Study counter. Values Fight doubles and repeated CAST faces.

### Opposites
Mirror Shard + Opposite Number. Values manufactured opposite Spoils while retaining Fight viability.

### Jackpot
Carbon Paper + Blank Face + test Fourth Witness. Explicitly tests manufactured triple/four-kind frequency and multiplier danger.

### Run/Unique
One BUMP-centric Four-Run payoff and one ALL_UNIQUE payoff. Tests whether non-matching patterns produce a different manipulation style.

### Greed Engine
Loaded Question + False Bottom + reward-to-combat test bridge. Tests whether Spoils investment can become future combat power without making current Fight irrelevant.

### Retrigger
One bounded bonus-hit effect. Secondary hits have explicit chainDepth and cannot recursively create unlimited triggers.

### Misaligned
Two individually useful but non-synergistic pieces. Must remain viable.

## Impact candidate C0
For successful casts only:
baseImpact = Margin × contextualPower
impact = baseImpact + additiveImpact
impact = floor(impact × product(multipliers))
aftermath = bounded bonus hits / statuses

Initial contextualPower bands for experiments only: early 1, developed 2, strong 3. Power comes from build state/effects, not player Level.

## Jackpot split
Test FOUR_KIND as two separate predicates:
- NATURAL_FOUR_KIND
- COMMIT_FOUR_KIND

Do not assume identical rewards. Candidate benchmark:
- manufactured COMMIT four-kind: +large additive Impact or ×2;
- natural four-kind: rare jackpot allowed to be substantially stronger.

The simulator decides whether that distinction is necessary from frequency/output data.

## Durability sweep
For each build/output band test normal, Elite and Boss HP across geometric/target-cast ranges rather than one guessed HP table.

Report which HP bands preserve:
- normal: 1–3 successful damaging casts;
- Elite: 3–6 meaningful casts;
- Boss: enough casts to express phases without routine 10+ cast slog.

## Required outputs
Per build × policy × impact model:
- win rate;
- successful casts per kill;
- total rounds;
- damage percentiles/max;
- Impact component shares;
- Spoils distribution;
- natural and manufactured pattern activation rates;
- manipulation actions per cast;
- consumables spent;
- enemy reaction triggers;
- overkill;
- pattern diversity entropy / concentration;
- fraction of turns choosing the same Fight pattern;
- fraction of turns where best combat action conflicts with best Spoils action.

## Critical diagnostic: tension
Measure how often the roll contains a genuine conflict between attack and reward/pattern goals.

AARB is healthier when a meaningful fraction of casts ask questions like:
- use 6+6 for Fight or preserve doubles for Spoils?
- break a natural triple to win safely?
- spend FLIP now to manufacture opposites or save it?
- accept Margin 1 because a build rewards it?

If the optimizer almost always finds one action that is simultaneously best at everything, the build grammar is too generous.

## Promotion gate
Do not ship Impact/pattern scoring until:
1. at least four build suites choose measurably different actions from identical casts;
2. attack-vs-Spoils tension remains common;
3. ordinary dice values still materially affect outcomes;
4. late spikes exist without routine runaway chains;
5. weak builds remain viable;
6. normal enemies remain fast;
7. the output can be explained through a short ordered combat breakdown.