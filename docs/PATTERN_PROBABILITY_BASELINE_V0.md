# AARB — 4d6 Pattern Probability Baseline v0

This is exact enumeration of all 6^4 = 1,296 ordered natural casts. These are design inputs, not balance conclusions.

## Natural CAST frequencies
| Pattern | Outcomes | Probability |
|---|---:|---:|
| FOUR_KIND | 6 | 0.463% |
| THREE_KIND (exactly three) | 120 | 9.259% |
| TWO_PAIR | 90 | 6.944% |
| ONE_PAIR (exactly one pair) | 720 | 55.556% |
| ALL_UNIQUE | 360 | 27.778% |
| FOUR_RUN | 72 | 5.556% |
| ALL_ODD | 81 | 6.250% |
| ALL_EVEN | 81 | 6.250% |

Patterns overlap where logically possible; they are predicates, not one exclusive hand classification.

## Reachability with at most one legal manipulation
For each natural cast, this asks whether an optimal use of the named single manipulation can produce the pattern. It does not yet price the opportunity cost of changing Fight/Spoils allocation.

| Pattern | BUMP ±1 | FLIP | COPY | set one die to 1 or 6 |
|---|---:|---:|---:|---:|
| FOUR_KIND | 3.55% | 2.31% | 9.72% | 3.55% |
| THREE_KIND | 45.37% | 33.33% | 71.76% | 32.41% |
| TWO_PAIR | 28.55% | 19.91% | 71.76% | 43.36% |
| ALL_UNIQUE | 72.22% | 61.11% | 27.78% | 72.22% |
| FOUR_RUN | 29.63% | 16.67% | 5.56% | 14.81% |
| ALL_ODD | 31.25% | 31.25% | 31.25% | 31.25% |
| ALL_EVEN | 31.25% | 31.25% | 31.25% | 31.25% |

## Immediate design consequences
1. Natural FOUR_KIND is a genuine jackpot at 0.463%.
2. COPY changes its practical rarity dramatically: a single optimal COPY makes FOUR_KIND reachable from 9.72% of natural casts. Therefore a large four-kind multiplier cannot be priced only from the natural 1/216 probability if COPY is available.
3. THREE_KIND is common enough to be a regular build trigger once manipulation exists. COPY makes some exact triple reachable from 71.76% of casts, so triple effects should usually be moderate, conditional, consumptive, or care about which face/zone is used.
4. TWO_PAIR is also extremely manufacturable by COPY. It is better suited to engine-building effects than jackpot effects.
5. FOUR_RUN is naturally 5.56% but BUMP makes a run reachable from 29.63% of casts. This makes BUMP a strong sequence-build tool and gives it an identity beyond raising Fight.
6. ALL_UNIQUE is naturally common (27.78%) and BUMP/transmute can make it reachable from 72.22% of casts. Treat it as a frequent-state trigger, not a rare reward.
7. ALL_ODD/ALL_EVEN sit at 6.25% naturally and 31.25% with one broad single-die manipulation. They can support medium-strength effects.

## Next calculation
The next simulator must stop asking only whether a pattern is reachable. It must choose Fight/Spoils allocation and manipulation jointly and calculate the cost of manufacturing the pattern: lost Margin, lost Spoils, consumed active, enemy reaction, and future carried-die value.
