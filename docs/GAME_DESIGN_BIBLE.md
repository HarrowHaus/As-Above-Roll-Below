# As Above, Roll Below — Game Design Bible

**Version:** 0.2 — preproduction canon  
**Genre:** solo dice roguelite / turn-based dungeon crawler  
**Primary platform:** browser, desktop + mobile  
**Target full run:** ~25–35 minutes  
**Vertical slice:** one finished 8–12 minute floor

---

## 1. The game in one sentence

Roll four dice, commit two to the fight, and leave two behind as potential loot.

Everything else exists to make that decision increasingly interesting.

---

## 2. Player promise

As Above, Roll Below has traditional roguelike bones: HP, monsters, gear, consumables, shops, branching routes, elites, bosses, run-ending death, procedural variation, and build synergies.

The unusual system is the combat roll. The player always rolls four ordinary d6. Exactly two are committed to combat. The remaining two become potential Spoils. The monster also rolls visible dice and locks its own combat pair before the player commits.

High dice are simultaneously valuable for survival and for rewards. The game repeatedly asks:

> How greedy can you afford to be?

---

## 3. Design pillars

### 3.1 Four dice. Two choices.
A new player must understand the core interaction almost immediately.

**ROLL FOUR. COMMIT TWO. WHAT REMAINS MAY BECOME YOURS.**

The complete game may become strategically deep. The basic interaction may not become difficult to understand.

### 3.2 Greed is gameplay
Loot is not merely awarded after combat. The player helps determine its quality during combat by deciding which dice not to spend on fighting.

### 3.3 Builds bend the dice, not replace them
Artifacts, gear, and character abilities may alter, preserve, reinterpret, or reward dice. They should rarely make the four-dice decision irrelevant.

### 3.4 Traditional roguelike bones
Novelty comes from the dice economy and world, not from deliberately making every RPG convention strange.

### 3.5 Broken builds are a reward
Powerful synergies are allowed. Bosses are not generated to invalidate the player’s strongest strategy.

### 3.6 Knowledge adds depth, never required comprehension
Deeply researched occult, Fortean, folkloric, conspiracy, and historical references may make content funnier or stranger, but are never required to understand mechanics.

### 3.7 The presentation takes everything seriously
The game does not stop to announce jokes. Ridiculous things receive the same artistic and mechanical dignity as frightening things.

---

## 4. Non-goals

The game is not:

- a deckbuilder;
- a tabletop simulator;
- a Munchkin clone;
- Dicey Dungeons with different art;
- a conspiracy trivia game;
- an idle game;
- a five-currency economy;
- a crafting or durability game;
- a procedural affix spreadsheet;
- a visual novel interrupted by combat.

No baseline system for mana, stamina, crafting materials, durability, encumbrance, or permanent stat-grind metaprogression.

---

## 5. Run structure

A complete run is planned around **four Floors**.

Each Floor contains approximately **4 route nodes + 1 Boss**. Not every room is combat.

Expected full-run composition:

- 8–11 normal combats;
- 1–3 elites;
- 2–4 events;
- 2–4 shops;
- 4 bosses.

The map shows room categories, not exact contents.

Core room types:

- **Combat**
- **Elite**
- **Event**
- **Shop**
- **Boss**

New room types must create a genuinely different decision rather than merely reskin an existing room.

---

## 6. Player state

### HP
The player has one persistent numerical HP bar. No parallel heart/life system.

Initial balance target: **~20 Max HP**, subject to simulation and playtesting.

At 0 HP, the run ends immediately.

### Coins
One run currency. No secondary crafting currency.

### Inventory
Planned baseline:

- 3 Gear slots: Weapon / Armor / Utility
- 4 Artifact slots
- 2 Contraband slots

Items beyond capacity require immediate replacement. No backpack hoarding.

---

## 7. Canonical combat loop

### Step 1 — Monster rolls
The monster rolls its visible dice pool.

### Step 2 — Monster locks
The monster locks dice according to a visible deterministic **Instinct**. The player sees the resulting Monster Total before making a decision.

### Step 3 — Player rolls
The player rolls exactly **4d6**.

### Step 4 — Manipulate
The player may use build-granted manipulation. There is no universal reroll button.

### Step 5 — Commit
The player chooses exactly **2 Fight Dice**. The remaining two become the current **Spoils Pair**.

### Step 6 — Compare
Let:

`Player Total = Fight Die A + Fight Die B + applicable effects`

`Monster Total = monster's locked total + applicable effects`

### Step 7 — Margin damage

- If Player Total > Monster Total, the monster loses HP equal to the difference.
- If Monster Total > Player Total, the player loses HP equal to the difference.
- A tie deals 0 damage to both sides.

There is no separate baseline Damage stat. The dice determine how badly the loser was hit.

### Step 8 — Spoils qualification
A Spoils Pair only qualifies on a round where the player actually damages the monster.

A loss or tie generates no Spoils result.

### Step 9 — Continue
If both remain alive, begin another round.

---

## 8. Why margin damage is canonical

Margin damage collapses several redundant systems into one:

- no fixed Threat target;
- no fixed baseline monster Damage stat;
- no Resolve/heart counter separate from HP;
- no generic life system.

The same contested dice determine attack, defense, damage, greed, and reward opportunity.

Example:

Monster locks `6 + 4 = 10`.

Player rolls `6, 5, 3, 2`.

Safe commitment: `6 + 5 = 11` → deal 1 damage, Spoils = `3 + 2 = 5`.

Greedy commitment: `5 + 3 = 8` → lose 2 HP, Spoils do not qualify.

The player always knows the consequence before committing unless a clearly disclosed monster rule changes resolution.

---

## 9. Monster dice and Instinct

Monster difficulty is expressed partly through dice pool and lock behavior rather than hidden scaling.

Provisional tiers:

### Baseline normal
`2d6`, lock both.

### Dangerous normal / specialist
Usually `3d6` with a nontrivial Instinct.

### Elite pressure
Often `3d6, keep highest 2` or a comparably strong authored rule.

### Boss / exceptional enemy
Custom dice engine. `4d6 keep highest 2` is already extremely strong and should not be treated as ordinary baseline pressure.

Visible Instinct examples:

- **STRONGEST** — lock highest two.
- **LOWEST** — lock lowest two.
- **WIDE** — prefer highest + lowest.
- **DOUBLES** — prefer a matching pair when possible, otherwise highest two.
- **ODD** — prefer odd values.
- **EVEN** — prefer even values.
- **TIGHT** — prefer the closest-valued pair.

Monster behavior must be deterministic from visible information. No opaque AI cheating.

---

## 10. Monster HP

Monsters use numerical HP bars, not hearts.

Initial balance envelope, not final content values:

- normal: roughly 3–6 HP;
- tough normal: roughly 5–8 HP;
- elite: roughly 6–10 HP;
- bosses: authored and materially higher.

The exact values are controlled by the Combat Model document and later Floor I balancing.

Normal fights should generally resolve quickly. Longer battles must justify their additional rounds through identity, mechanics, or reward.

---

## 11. Spoils

The two uncommitted player dice form the current **Spoils Pair**.

Only successful damaging rounds qualify.

Current candidate rule for multi-round combat:

> The game automatically remembers the best successful Spoils Pair achieved during the encounter and uses that pair for the encounter reward.

This rule is simple and creates a strong safety-vs-greed tradeoff, but remains explicitly under validation because deliberately extending fights can increase the number of chances to improve Spoils. The Combat Model document contains the anti-stall analysis.

Base Spoils score is the sum of the two dice, range 2–12.

Provisional reward bands:

- 2–4: scraps / small Coin reward
- 5–7: common find / Contraband access
- 8–10: strong find / Gear or Artifact choice
- 11–12: premium find / broader high-tier choice

Final names and exact reward tables belong in the Vertical Slice Content Sheet.

---

## 12. Gear

Gear is the relatively traditional portion of the build.

Gear primarily affects:

- combat totals;
- margin damage;
- incoming damage;
- conditional bonuses;
- item capacity;
- encounter-specific protections.

Examples of mechanical forms:

- `+1 Fight Total after locking.`
- `If Fight Dice match, +2 Fight.`
- `Reduce the first incoming damage each encounter by 1.`
- `If you win by 4+, deal +2 additional damage.`

Gear should feel like equipment interacting with combat rather than passive spreadsheet inflation.

---

## 13. Artifacts

Artifacts are the primary build-defining system.

Artifacts may:

- alter die values;
- reinterpret faces;
- preserve dice;
- reward patterns;
- modify Spoils;
- interact with HP;
- create conditional triggers;
- rarely interfere with enemy dice.

Maximum planned equipped Artifacts: **4**.

A player should be able to inspect four icons and understand the engine they built.

---

## 14. Contraband

Contraband is single-use tactical intervention.

Maximum carried: **2**.

Potential roles:

- reroll one die;
- change one die to a specified face;
- prevent incoming damage;
- temporarily ignore a monster rule;
- interfere with one enemy die;
- preserve a valuable roll.

The old prototype's universal CHEAT button is removed. Cheating may return as specific content, not a baseline action.

---

## 15. Dice-manipulation vocabulary

The game should teach a small reusable language.

### BUMP
Increase or decrease a die by 1, staying within 1–6.

### FLIP
Turn to the opposite physical face:
`1↔6`, `2↔5`, `3↔4`.

### LOCK
Preserve a die's value for a later round rather than rerolling it.

### COPY
Change one die so it matches another visible die.

### TRANSMUTE
Replace a specified face with another specified face.

### MARK
Give a die a temporary property recognized by another effect. Advanced keyword; not required in the first tutorial.

Enemy-dice interference uses the same language but should be rarer and more expensive than self-manipulation.

---

## 16. Characters

Characters change how the same core system is approached.

Each receives:

- one simple defining ability;
- one starting Gear item;
- one mechanical bias.

Initial archetype space:

- **Manipulator** — teaches BUMP/FLIP style control.
- **Pattern seeker** — rewards doubles, sequences, exact totals, odd/even structure.
- **Anomaly build** — gains value from rare outcomes.
- **Mundane build** — stronger conventional equipment capacity, fewer supernatural tricks.

Final identities and writing belong in the Content Bible.

---

## 17. Build archetypes

These are overlapping strategy families, not hard classes:

- Greed
- Certainty
- Pattern
- Low-face
- High-face
- Lock / preservation
- Damage control
- Contraband
- Enemy interference

Strong runs should frequently combine two archetypes.

Synergy must emerge from individually understandable effects. Avoid explicit `if Artifact #37 is equipped` combo text.

---

## 18. Boss philosophy

Bosses are traditional identity-driven RPG bosses expressed through the dice system.

A boss should have:

- a clear identity;
- an authored dice engine;
- multiple stages or meaningful behavior changes;
- recognizable attacks;
- escalating pressure;
- mechanics unique to that boss.

Bosses do not inspect the player's build and automatically disable its strongest mechanic.

The player should be excited to unleash a broken build on the boss.

---

## 19. Economy and shops

One run currency: Coins.

A shop should display a compact selection such as:

- 1 Gear
- 2 Artifacts
- 1 Contraband
- healing service

Initial price bands remain provisional until the Vertical Slice is numerically populated.

The desired economy tension:

- safe combat preserves HP but produces weaker rewards;
- greedy combat improves reward quality but tends to increase exposure, fight duration, and attrition.

---

## 20. Events

Events are short and decision-driven.

Typical structures:

- lose HP → gain Artifact;
- pay Coins → remove a negative condition;
- accept a die roll → live with the result;
- sacrifice Gear → receive an unknown replacement.

Events are not long dialogue trees.

---

## 21. Procedural generation

A run seed determines:

- Floor layouts;
- room categories;
- enemies;
- elites;
- bosses;
- item offers;
- shop inventory;
- events;
- combat dice.

The same seed plus the same sequence of player actions should reproduce the same run.

Use separate deterministic RNG streams for map generation, encounters, rewards, shops, events, and combat dice so unrelated implementation changes do not perturb every future roll.

---

## 22. UI information rule

Before the player commits dice, the interface must clearly show:

- player HP;
- monster HP;
- monster rolled dice;
- monster locked dice and total;
- monster Instinct;
- player rolled dice;
- selected Fight total;
- predicted damage outcome;
- current Spoils Pair;
- relevant active effects.

The interface performs arithmetic. The player makes decisions.

---

## 23. Input and accessibility

Required:

- mouse playable;
- touch playable;
- keyboard playable;
- no fast-reaction mechanics;
- reduced-motion option;
- numeric labels on dice in addition to pips;
- color never used as the only state indicator;
- scalable text;
- high-contrast selection states;
- separate music/SFX controls;
- faster animation option.

Dice should feel tactile but standard roll animation should remain under roughly one second.

---

## 24. Metaprogression

Permanent progression is horizontal.

Runs may unlock:

- characters;
- Artifacts;
- Gear;
- Contraband;
- enemies;
- bosses;
- Events;
- difficulty rules;
- visual environments.

No permanent `+10% damage`, `+5 HP`, or equivalent stat grind.

Run 100 should contain more possibilities, not merely superior starting math.

---

## 25. Anti-complexity rules

Before adding any system, ask:

> Does this improve the four-dice decision?

Hard constraints for the vertical slice:

- exactly 4 player Core Dice;
- exactly 2 committed Fight Dice;
- 4 Artifact slots max;
- 3 Gear slots max;
- 2 Contraband slots max;
- one run currency;
- one player HP pool;
- no mana;
- no crafting;
- no durability;
- no encumbrance stat;
- no universal reroll;
- normal enemies should generally have one primary rule.

---

## 26. Desired emotional rhythm

A strong encounter repeatedly produces:

1. **Anticipation** — monster rolls.
2. **Assessment** — player sees what must be beaten.
3. **Roll** — four dice land.
4. **Temptation** — the safest dice are also valuable Spoils.
5. **Search** — what can the build do with this state?
6. **Commitment** — choose two.
7. **Consequence** — margin damage.
8. **Reward pressure** — successful leftovers may improve Spoils.
9. **Next round / next room.**

---

## 27. Vertical slice scope

The first production-quality slice contains:

### Playable content
- 1 complete Floor
- 1 playable character
- 8 normal enemies
- 2 elites
- 1 boss
- branching route map
- 3 Events
- 1 Shop system

### Build content
- 12 Artifacts
- 8 Gear items
- 6 Contraband

### Systems
- contested monster/player rolls
- margin damage
- HP
- Spoils
- Coins
- deterministic seed
- reward drafting
- inventory replacement
- run death
- Floor victory
- local save/resume

### Presentation
- finished UI
- finished dice
- finished player character
- finished enemy and boss art
- finished Floor environment
- combat animation and VFX
- sound design
- music
- victory/death presentation

No placeholder visuals in the final vertical-slice review build.

---

## 28. Vertical slice success criteria

The slice succeeds if:

1. a new player understands the core interaction within the first encounter;
2. choosing Fight Dice repeatedly creates real greed decisions;
3. Artifacts materially change how rolls are evaluated;
4. the player can describe their build after one run;
5. the boss feels like a boss rather than a larger normal enemy;
6. a Floor takes roughly 8–12 minutes;
7. restarting after death is immediate;
8. the player voluntarily starts another run.

Criterion 8 matters most.

---

## 29. Current locked core

Treat these as canonical unless testing demonstrates a fundamental problem:

- **Title:** As Above, Roll Below
- **Genre:** solo dice roguelite
- **Player roll:** 4d6
- **Player commitment:** exactly 2 Fight Dice
- **Leftovers:** exactly 2 potential Spoils Dice
- **Monster action:** monster rolls and visibly locks before player commitment
- **Combat:** contested totals
- **Damage:** winning margin
- **Health:** numerical HP bars; no parallel heart system
- **Death:** run-ending permadeath
- **Build categories:** Gear + Artifacts + Contraband
- **Primary build system:** rule/dice manipulation
- **Boss philosophy:** authored traditional bosses, not automated build counters
- **Metaprogression:** horizontal unlocks
- **Complexity rule:** every major system must strengthen the four-dice decision

---

## 30. Production order

A. Game Design Bible  
A1. Combat validation  
B. Content / Research Bible  
C. Art Bible  
D. Vertical Slice Content Sheet  
Then: asset production → implementation → automated testing → playtesting → balance → polish.

---

## Core design test

Strip away the names, artwork, references, and jokes.

Put four dice on the screen.

Ask the player to choose two.

If that decision is not interesting, the rest of the game cannot save it.
