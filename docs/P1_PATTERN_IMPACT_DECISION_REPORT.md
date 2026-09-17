# P1 Pattern / Impact Decision Report

Status: **decision-ready experimental gate**. Shipping combat is still unchanged.

## Work completed
The P1 laboratory now runs multi-round deterministic fights across:
- 4 damage models (A control Margin, B Power-only, C staged build-driven Impact, D universal pattern-heavy comparator);
- 10 build states including baseline, focused pattern builds, deliberately misaligned build, and a late high-synergy stress build;
- 4 decision policies;
- Normal / Elite / Boss durability/Enemy-Fight bands.

The current CI gate evaluates **96,000 deterministic fights per run** (480 cells × 200 fights), in addition to exact 4d6 pattern enumeration and the existing shared-core Floor regression. It reports win rate, rounds, damage percentiles/max, Spoils, manipulation use, overkill, natural/manufactured four-kind, damage component shares and a provisional attack-vs-reward tension signal.

## Result
**Choose Model C as the production architecture candidate:**

`Margin × contextual Power -> additive Impact -> explicit multipliers -> bounded aftermath/retriggers`

Do **not** promote the current numeric coefficients or HP table as final balance.

### Why A fails
Margin-only damage cannot support the intended progression. With the test durability table it leaves baseline/advanced builds in long Elite/Boss fights and produces no meaningful build acceleration. It remains useful as the tutorial/control model.

### Why B is insufficient
Power-only scaling fixes some fight length but build identities converge numerically. It lacks enough room for pattern payoffs, jackpots, and satisfying late interaction chains. It is useful as a simpler comparator, not the target economy.

### Why D is rejected as the default
D adds universal pattern bonuses before/alongside build identity. It produces attractive numbers, but it also makes patterns powerful even when the player did not build around them. That weakens the central promise that loot/build composition changes what the same dice mean. Pattern power should primarily come from owned effects/enemy rules, not a universal poker-score layer.

### Why C survives
C is the only tested architecture that simultaneously preserves Margin, creates distinct build payoffs, allows readable additive/multiplicative ordering, supports bounded retriggers, and produces large late-run spikes without universal pattern scoring.

The late-synergy stress build under Opportunist Model C produced approximately:
- Normal: 1.16 rounds average; median hit 54; p99 99; max 110.
- Elite: 2.21 rounds; median 43; p99 67; max 92.
- Boss: 5.92 rounds; median 37; p99 70; max 117.

Model D pushed the same stress build higher (Boss max 166) but did so partly by granting universal pattern bonuses; that is exactly the identity dilution we want to avoid.

Representative mid-build Model C outputs are much smaller: Margin build median 16 on Normal, Doubles 12, Opposites 10, Sequence 11, Greed 8, Misaligned 10. This is the desired qualitative shape: ordinary dice remain relevant while developed synergy accelerates output.

## Important balance finding: durability must be pressure/output aware
The test HP table (22 Normal / 58 Elite / 130 Boss) cannot be a universal table across all run stages.

It makes baseline Normal fights too long (~6.7 rounds) while a late synergy build deletes the same Normal in ~1.2 rounds. That is not evidence to flatten build power; it is evidence that the Director needs durability/pressure bands matched to run progression and encounter role.

Target remains:
- Normal: usually 1–3 successful damaging casts at the expected power band.
- Elite: usually 3–6 meaningful casts.
- Boss: enough casts to express authored phases, commonly around 5–10 meaningful casts depending on mechanics.

Late Model C currently makes the test Elite too fragile (~2.2 rounds), while its Boss duration (~5.9) is healthy. Elite durability therefore needs stronger late pressure scaling than the provisional test table.

## Pattern findings
Patterns are **predicates and build hooks**, not universal hand ranks.

Natural and manufactured patterns remain distinct snapshots. This is mandatory because COPY/manipulation changes jackpot accessibility dramatically.

Natural four-kind may support exceptional effects. Manufactured four-kind should normally receive the effect written on the player's build piece, not a universal jackpot reward.

Pattern manipulation is valuable because it competes with Fight/Spoils allocation. We must preserve that conflict.

## Tension metric warning
The current laboratory proves that combat/reward objectives frequently diverge, but its scalar `tensionRate` compares differently scaled utility proxies and is not trustworthy as an absolute percentage. Do not balance toward its current numeric values. P1.1 must replace it with a direct action-conflict metric: compare the argmax combat action and argmax reward action, then measure whether they are different legal action packages and the opportunity cost between them.

## Retrigger safety
Retriggers remain bounded aftermath. Secondary hits must carry chain depth / trigger eligibility metadata and cannot recursively generate unrestricted copies of themselves. No tested P1 cell crossed the provisional p99 >500 runaway threshold, including the late stress build.

## Decision
Promote **the Model C resolution architecture**, not its coefficients:
1. positive Margin creates base Impact through contextual Power;
2. additive effects resolve in explicit priority order;
3. multiplicative effects resolve after additions;
4. aftermath/retriggers resolve last with bounded chain rules;
5. natural/current CAST, FIGHT and SPOILS pattern predicates become reusable effect conditions;
6. player Level does not directly supply Power;
7. pattern bonuses are primarily content/build driven, not universal scoring.

## P1.1 before shipping implementation
Before replacing current Margin damage in the playable client:
- tune Power/additive/multiplier coefficients around early/developed/late output bands;
- implement direct action-conflict tension telemetry;
- sweep pressure-aware Normal/Elite/Boss durability bands;
- verify at least four build suites choose different action packages across a shared corpus of casts;
- add explicit proc/chain metadata to the production effect schema;
- rerun the shared-core Floor simulation with the candidate economy.

Once P1.1 passes, implement the architecture in `@aarb/core` behind a ruleset/version flag, keep legacy Margin mode for regression comparison, then migrate content deliberately rather than silently changing every existing item.