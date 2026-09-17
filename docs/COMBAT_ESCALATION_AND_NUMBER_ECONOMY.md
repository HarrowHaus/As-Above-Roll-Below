# AARB — Combat Escalation and Number Economy

Status: design target for simulation, not yet canonical balance.

## Problem
The current prototype proves the Fight-vs-Spoils decision but lives on a tiny numerical scale: margins of 1–4, damage of 1–4, HP around 20. That is readable for teaching, but if the full descent stays there the build never feels as if it becomes powerful. Repeated tiny HP subtraction also makes long runs feel slow.

AARB needs two simultaneous qualities:
1. Dice values remain immediately readable (d6 faces still matter).
2. The *consequence* of a good cast can scale dramatically over a run.

Do not solve this by inflating every stat or adding Strength/Dexterity/Crit/etc. Keep the input small and let build systems amplify the output.

## Reference lessons
- Balatro separates a readable base input from additive and multiplicative scoring layers. Its large-number pleasure comes from compounding systems and ordered triggers, not from making card ranks enormous.
- Risk of Rain 2 lets items stack and proc into other effects, but uses coefficients/diminishing formulas where unrestricted stacking would break the game.
- Dicey Dungeons keeps dice readable while equipment upgrades alter damage, usability, or frequency; later enemies and upgraded equipment raise pressure without changing what a die face means.
- Slay the Spire similarly lets Strength/Vulnerable/multi-hit/relic interactions amplify small card numbers into much larger turns while enemy HP and damage rise by act.

## Proposed AARB model
### 1. Keep the cast small
Player still rolls four d6 and chooses two Fight Dice. Raw Fight normally remains 2–12. Enemy locked dice remain similarly readable.

### 2. Split victory into Margin and Impact
**Margin** answers: did you win the contest and by how much?

**Impact** answers: how hard did the successful cast hit?

Baseline candidate:
`Impact = Margin × Power`

Power begins small and is primarily supplied by Gear/build interactions rather than a permanent RPG stat sheet.

This means a +3 Margin can deal 3 early, 9 in a developed build with Power 3, or much more after conditional multipliers/triggers.

### 3. Three amplification layers
Use a strict order, inspired by proven scoring engines:

1. **Base:** Margin and authored base effects.
2. **Additive:** +Impact / bonus hits / flat build bonuses.
3. **Multiplicative:** ×Impact effects with stricter rarity/conditions.
4. **Triggered aftermath:** status, chain, reward, heal, coin, carry, etc.

Exact order must be deterministic and shown in resolution feedback.

### 4. Avoid a generic permanent Damage stat if possible
Gear should produce Power contextually:
- heavy weapon: ×2 Impact when raw Fight >= 10
- ritual blade: +1 Power on opposite Fight faces
- government sidearm: bonus hit when enemy manipulated your cast
- goblin hammer: +Impact equal to lowest Fight die

The player should become powerful because the *build works*, not because Level 17 quietly grants +83 Attack.

### 5. Enemy durability scales in bands
Current Floor-I values are teaching values. Future pressure bands can move roughly through orders such as:
- opening: ~5–20 effective HP
- developed run: tens
- late run: hundreds where builds also output tens/hundreds
- endless: scalable formulas / notation once needed

These are not locked numbers. Simulator determines curves.

Important: normal encounters should still resolve quickly. Higher HP is only acceptable when player output scales at least as strongly.

### 6. Hits and trigger chains create spectacle
A successful cast may resolve:
`Margin 4 → 4 base → Heavy Gear ×2 = 8 → Opposite trigger +5 = 13 → Artifact retriggers lowest die for +3 = 16`

UI should animate the resolution in fast beats rather than display one unexplained final number.

### 7. Multipliers are scarce
Additive growth can be common. Multipliers must be conditional, slot-expensive, rare, or otherwise budgeted. Generated Gear cannot freely roll arbitrary multiplicative effects.

### 8. Multi-hit needs proc control
If a future effect hits/retriggers multiple times, secondary triggers need an explicit eligibility/coefficient rule. Do not allow accidental infinite proc chains.

Potential engine fields:
- `hitCount`
- `triggerClass`
- `procCoefficient`
- `canTriggerSecondary`
- `chainDepth`

Hard maximum chain depth as safety even if authored rules should never reach it.

### 9. Defensive numbers can grow too, but less dramatically
HP progression should make later damage legible without creating sponge fights. Armor/ward/status mitigation should be authored mechanics rather than another five permanent stats.

### 10. Big-number presentation
Damage should feel larger through presentation as well as arithmetic:
- resolution count-up
- larger typography at thresholds
- hit-stop / screen shake proportional to Impact
- distinct sound layers for additive trigger vs multiplier vs kill
- overkill shown, not discarded
- abbreviated notation only when numbers truly require it

No slot-machine pacing or deliberately obscured odds. The player can inspect exactly why the number became large.

## Scaling archetypes to test
1. **Margin build:** makes winning by a lot increasingly valuable.
2. **Pattern build:** doubles/opposites/sequences create bonus hits or Power.
3. **Retrigger build:** repeats eligible die/effect resolutions under strict proc rules.
4. **Status build:** modest direct hit, large accumulated burn/curse/bleed-equivalent payoff.
5. **Greed build:** converts premium Spoils patterns into temporary combat amplification.
6. **Glass cannon:** multipliers at HP/defensive cost.
7. **Economy conversion:** Coins/items become temporary Impact without permanent runaway snowball.

## Required simulation experiment
Before changing the production combat formula:
- implement candidate Impact layer in a branch/model;
- generate representative early/mid/late builds;
- measure rounds-to-kill by pressure band;
- measure damage distribution and multiplier outliers;
- reject builds that produce infinite/near-infinite chains;
- ensure baseline d6 decisions still matter at high scaling;
- compare linear, additive+multiplier, and bounded-exponential enemy curves.

## Target feel
Early run: `3 DAMAGE` matters.
Mid run: a good build routinely produces `18`, `31`, `54` while bad casts remain weak.
Late run: a carefully assembled interaction can explode into `200+` without changing the fact that the player is still choosing two ordinary six-sided dice.

The pleasure should be: **I understand exactly why my four little dice just did that.**
