# Combat Model

**Status:** A1 first validation gate passed — contested-roll foundation is working canon; Spoils capture and final Floor tuning remain under validation.  
**Purpose:** preserve the mathematical basis, prototype findings, and remaining balance questions for the core combat system.

---

## Canonical combat foundation

1. Monster rolls first.
2. Monster visibly locks dice according to deterministic Instinct.
3. Player rolls 4d6.
4. Player may use build-granted manipulation.
5. Player commits exactly 2 dice to Fight.
6. The remaining 2 dice become the current Spoils Pair.
7. Compare totals.
8. Damage equals the winning margin.
9. Only a damaging player win qualifies the current Spoils Pair.
10. If both combatants remain alive, repeat.

No fixed Threat number. No separate baseline monster Damage stat. No parallel heart/Resolve system.

This foundation has now survived the first mathematical pass and an interactive browser prototype and should be treated as the working combat canon. Future balance work may change HP values, enemy pools, Instincts, reward thresholds, manipulation costs, or Spoils capture. It should not casually replace the contested-roll / margin-damage loop without evidence from playtesting.

---

## One-round baseline math

The player always has 4d6 available and may choose the best pair for pure survival.

### Monster rolls 2d6, locks both

- Player win: ~72.43%
- Tie: ~9.32%
- Monster win: ~18.25%
- Average player winning margin: ~3.81
- Average player losing margin: ~2.28

### Monster rolls 3d6, locks highest two

- Player win: ~55.02%
- Tie: ~13.12%
- Monster win: ~31.86%
- Average player winning margin: ~3.02
- Average player losing margin: ~2.44

### Monster rolls 4d6, locks highest two

- Player win: ~42.45%
- Tie: ~15.09%
- Monster win: ~42.45%
- Average winning margin: ~2.54
- Average losing margin: ~2.54

### Interpretation

`2d6` is the correct baseline pressure for ordinary monsters.

`3d6 keep-highest-two` already produces elite-grade pressure.

`4d6 keep-highest-two` is boss/exception territory, not a normal enemy default.

Enemy difficulty can therefore be made visible through dice behavior rather than hidden numeric inflation.

---

## Strategy models

Two useful extreme strategies were simulated.

### SAFE
Always choose the pair with the highest Fight Total.

Purpose: kill quickly, minimize exposure, accept weaker Spoils.

### GREEDY-WIN
Whenever any winning pair exists, choose the winning pair that leaves the highest Spoils total. If no winning pair exists, choose the strongest defensive pair.

Purpose: maximize reward quality while still requiring a successful clash to qualify Spoils.

These are not intended player presets. They are balance probes.

---

## Fight-level simulation findings

The following are Monte Carlo balance probes using the candidate rule that the encounter remembers the best successful Spoils result.

### Baseline monster — 2d6

#### 4 monster HP
SAFE:
- average player damage taken: ~0.90 HP
- average rounds: ~2.17
- average best Spoils: ~5.62

GREEDY-WIN:
- average player damage taken: ~1.64 HP
- average rounds: ~3.88
- average best Spoils: ~9.38

#### 6 monster HP
SAFE:
- average player damage taken: ~1.20 HP
- average rounds: ~2.89
- average best Spoils: ~6.09

GREEDY-WIN:
- average player damage taken: ~2.30 HP
- average rounds: ~5.54
- average best Spoils: ~10.06

#### 8 monster HP
SAFE:
- average player damage taken: ~1.51 HP
- average rounds: ~3.63
- average best Spoils: ~6.47

GREEDY-WIN:
- average player damage taken: ~3.04 HP
- average rounds: ~7.21
- average best Spoils: ~10.49

### Elite-style monster — 3d6, keep highest two

#### 4 monster HP
SAFE:
- average player damage taken: ~2.63 HP
- average rounds: ~3.36

GREEDY-WIN:
- average player damage taken: ~4.23 HP
- average rounds: ~5.42

#### 6 monster HP
SAFE:
- average player damage taken: ~3.49 HP
- average rounds: ~4.52

GREEDY-WIN:
- average player damage taken: ~6.09 HP
- average rounds: ~7.83

### 4d6 keep-highest-two pressure

Even at only 4 monster HP:

SAFE:
- average player damage taken: ~5.20 HP
- average rounds: ~4.84

GREEDY-WIN:
- average player damage taken: ~7.87 HP
- average rounds: ~7.28

Therefore this profile should be rare, authored, or boss-level.

---

## Current balance envelope

Provisional starting point for the vertical slice:

### Player
- around 20 Max HP

### Normal enemy
- usually 2d6 baseline or 3d6 with a weaker/special Instinct
- roughly 3–6 HP

### Tough normal
- roughly 5–8 HP
- stronger Instinct or one meaningful rule

### Elite
- often 3d6 highest-two or equivalent authored pressure
- roughly 5–8 HP before special mechanics

### Boss
- custom dice engine
- materially higher HP
- multiple behavior states/phases
- should not simply be a huge 4d6 stat block

These are not yet Floor I content values. They define the region worth authoring inside.

---

## Why the greed curve is working

The model naturally creates a tradeoff without another resource:

- SAFE play kills faster and takes less damage but produces mediocre Spoils.
- GREEDY-WIN play leaves strong dice for Spoils, deals smaller winning margins, extends fights, and exposes the player to more future monster rolls.

The extra exposure is the critical property. Greed is not punished by a synthetic meter; it creates its own danger through combat duration and smaller margins.

This relationship is the reason the core mechanic has been approved for continued development.

---

## Spoils rule still under validation

### Candidate A — BEST SUCCESS

Each damaging player win produces a qualifying Spoils Pair. The game remembers the **best successful Spoils Pair** seen during the encounter.

Benefits:
- earlier greedy decisions matter in multi-round fights;
- no manual banking UI;
- strong reward contrast between safe and greedy strategies.

Risk:
- players may deliberately choose low-margin wins to extend weak fights and gain additional chances at premium Spoils.

### Candidate B — FINAL BLOW

Only the Spoils Pair on the killing blow determines reward.

Benefits:
- eliminates most intentional farming/stalling;
- extremely easy to explain.

Risk:
- earlier successful greedy decisions can become economically irrelevant;
- boss fights may feel oddly dependent on the final roll.

### Decision rule

Do not invent a third economy unless both simple options fail.

The current combat prototype exposes both modes so future testing can compare behavior directly.

---

## Tie rule

Baseline:

**Tie = 0 damage, no Spoils qualification, next round.**

Items and monsters may create explicit exceptions, but ties are inert by default.

---

## Enemy Instinct design

Instinct must be visible and deterministic.

Reusable Instinct seeds:

- STRONGEST — highest two
- LOWEST — lowest two
- WIDE — highest + lowest
- DOUBLES — matching pair if possible, otherwise strongest
- ODD — prefers odd dice
- EVEN — prefers even dice
- TIGHT — pair with smallest difference

Instinct is balance and personality simultaneously. A monster should feel different because it uses the shared dice language differently, not because it owns hidden AI logic.

---

## Manipulation balance

Self-manipulation is common. Enemy interference is rarer.

Core verbs:

- BUMP
- FLIP
- LOCK
- COPY
- TRANSMUTE
- MARK

Because margin damage amplifies small total changes, even `+1` is meaningful. Enemy-die interference can be especially strong and should be costed accordingly.

---

## Remaining A1/A2 tuning tasks

Before Floor I numbers are frozen, test:

- full-floor survival distributions at 18 / 20 / 22 player HP;
- 3–4 normal combats + optional elite + boss;
- healing frequency;
- Gear that reduces margin damage by 1;
- one BUMP per encounter;
- FLIP cadence by build/item source;
- exact Spoils reward frequencies;
- BEST SUCCESS versus FINAL BLOW behavioral effects;
- authored boss dice patterns rather than generic best-two scaling.

These are tuning questions, not reasons to reopen the entire combat architecture.

The goal is not mathematical symmetry. The goal is repeated decisions where safety and reward visibly compete.
