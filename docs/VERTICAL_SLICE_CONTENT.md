# As Above, Roll Below — Vertical Slice Content Sheet

**Version:** 0.1 content pass  
**Floor:** I — THRESHOLDS  
**Status:** authored for simulation; names/rules may tune, architecture may not casually drift

Goal: one replayable 8–12 minute Floor that proves combat, loot, leveling, route choice, inventory pressure, Shop, Event, Elite and Boss systems.

---

# 1. Player — The Delver

## Starting state
- Max HP: 20
- Level: 1
- Coins: 0
- Core Dice: 4d6
- Starting Gear: **Old Field Coat**

## Defining ability — Field Adjustment
**Once per encounter, BUMP one of your dice ±1.**

## Starting Gear — Old Field Coat
Armor — starter only.

**Reduce the first incoming damage each encounter by 1.**

## Level 3 Techniques

### Steady Hand
**Field Adjustment gains one additional use each encounter.**

### Long Odds
**The first time each encounter you win by exactly 1, +2 to that successful Spoils Score, maximum 12.**

## Level 5 Techniques — full-game target, not required for first slice balance

### Clean Exit
**Once per encounter, when damage would take you below half Max HP, reduce that damage by 2.**

### Overrule
**Once per encounter, Field Adjustment may target one enemy locked die instead of your die.**

---

# 2. Floor I map contract

Four pre-boss rows + Boss.

Required graph opportunities:
- Row 1: Combat only
- at least 2 Combat opportunities on every route
- one Event opportunity
- one Shop opportunity in Row 3 or 4
- one optional Elite opportunity in Row 3 or 4
- Boss: The First Door

A single run does not visit every node.

---

# 3. Normal enemy pool

## EN-01 — Latchling
Taxonomy: Below Native  
Pressure: P1  
HP: 5  
Dice: 2d6  
Instinct: BOTH  
XP: 1  
Coins: 2

Rule: none beyond baseline.

Purpose: tutorial enemy.

## EN-02 — Turnback
Taxonomy: Below Native  
Pressure: P2  
HP: 5  
Dice: 3d6  
Instinct: TIGHT — lock the pair with the smallest difference; tie-break toward higher total.  
XP: 1  
Coins: 2

**REFUSAL:** On a tie, Turnback heals 1 HP, maximum Max HP.

## EN-03 — Unadmitted
Taxonomy: Below Native  
Pressure: P2  
HP: 6  
Dice: 2d6  
Instinct: BOTH  
XP: 1  
Coins: 2

**NO ADJUSTMENTS:** After Player Cast, your lowest-valued die becomes FIXED for this round and cannot be manipulated. If tied for lowest, the leftmost tied die is FIXED.

## EN-04 — Doorwake
Taxonomy: Below Native  
Pressure: P2  
HP: 6  
Dice: 3d6  
Instinct: WIDE — lock highest + lowest.  
XP: 1  
Coins: 2

Rule: WIDE is the complete primary rule.

## EN-05 — Toll Eater
Taxonomy: Below Native  
Pressure: P2  
HP: 6  
Dice: 2d6  
Instinct: BOTH  
XP: 1  
Coins: 2

**TAKE YOUR CUT:** If your current base Spoils Score is 9+, you have −1 Fight this round.

Previewed before COMMIT.

## EN-06 — Passage Clerk
Taxonomy: Original institutional manifestation  
Pressure: P2  
HP: 5  
Dice: 3d6  
Instinct: TIGHT  
XP: 1  
Coins: 2

**DUPLICATE FILING:** If your committed Fight Dice match, Enemy Fight +2.

## EN-07 — Seal-Whelp
Taxonomy: Below Native  
Pressure: P3  
HP: 7  
Dice: 2d6  
Instinct: BOTH  
XP: 1  
Coins: 2

**REACTION SEAL:** The first time each round you manipulate one of your dice, Enemy Fight +1 for that round.

## EN-08 — Misaddressed Visitor
Taxonomy: Convergence / Original  
Pressure: P2  
HP: 6  
Dice: 3d6  
Instinct: ODD — prefer two odd dice; if fewer than two exist, lock the strongest available pair.  
XP: 1  
Coins: 2

Rule: ODD is the complete primary rule.

---

# 4. Elites

## EL-01 — Threshold Warden
Taxonomy: Below Native / institutional convergence  
HP: 8  
Dice: 3d6  
Instinct: STRONGEST  
XP: 2  
Coins: 4  
Reward: Spoils Band +1

**INSPECTION:** After Player Cast, your highest-valued die becomes FIXED for this round. If tied, leftmost tied die is FIXED.

## EL-02 — Seal-Bearer
Taxonomy: Below Native  
HP: 9  
Dice: 3d6  
Instinct: WIDE  
XP: 2  
Coins: 4  
Reward: Spoils Band +1

**COUNTERSEAL:** Once per round, when you manipulate a die, BUMP Seal-Bearer's lower locked die +1, maximum 6. Only the first manipulation each round triggers COUNTERSEAL.

---

# 5. Boss — The First Door

Taxonomy: Below Native / foundational threshold entity  
HP: 18  
XP: 3  
Coins: 6  
Reward: Boss Draft  
Boss clear heal: 2

State changes occur immediately after damage crosses a threshold and apply starting next round.

## State I — CLOSED
HP 13–18.

Dice: 3d6  
Instinct: TIGHT.

**SEALED:** Enemy locked dice cannot be targeted by player interference effects.

## State II — AJAR
HP 7–12.

Dice: 3d6  
Instinct: STRONGEST.

**DRAFT:** If your base Spoils Score is greater than your Raw Fight total, Enemy Fight +1.

Previewed before COMMIT.

## State III — OPEN
HP 1–6.

Dice: 4d6  
Instinct: WIDE.

**BOTH WAYS:** A tie deals 2 damage to both combatants.

Boss presentation must display a new state rule before the first affected Player Cast.

---

# 6. Gear pool — 8

## G-01 Bent Knife
Weapon — Tier I — base price 5.  
**If your Fight Dice are different values, +1 Fight.**

## G-02 Twin Nails
Weapon — Tier I — base price 6.  
**If your Fight Dice match, +2 Fight.**

## G-03 Breaching Bar
Weapon — Tier II — base price 9.  
**If Raw Fight is 10+ and you win, deal +2 additional damage.**

## G-04 Work Apron
Armor — Tier I — base price 5.  
**Reduce the first incoming damage each encounter by 1.**

## G-05 Proof Vest
Armor — Tier II — base price 9.  
**Reduce the first incoming damage each encounter by 2.**

## G-06 Inside-Out Lining
Armor — Tier II — base price 8.  
**Once per encounter, if you lose by exactly 1, reduce that damage to 0.**

## G-07 Brass Buckle
Utility — Tier I — base price 5.  
**On a tie, deal 1 damage to the enemy.**

## G-08 Small Change Purse
Utility — Tier I — base price 5.  
**The first Loot Draft you skip each Floor grants +2 additional Coins.**

---

# 7. Artifact pool — 12

## A-01 Mirror Shard
Tier I — price 6.  
**Once per encounter, FLIP one of your dice.**

## A-02 Loaded Question
Tier I — price 6.  
**Successful Spoils doubles gain +2 Spoils Score, maximum 12.**

## A-03 False Bottom
Tier II — price 9.  
**Successful Spoils Score 5 or less gains +2, maximum 12.**

## A-04 The Hidden Hand
Tier II — price 10.  
**Once per encounter before COMMIT, lower the enemy's highest locked die by 1, minimum 1.**

## A-05 Ash Ledger
Tier I — price 6.  
**The first time you take damage each encounter, gain 1 Coin.**

## A-06 Opposite Number
Tier II — price 8.  
**If your successful Spoils Dice are physical opposites, +3 Spoils Score, maximum 12.**

Opposites: 1+6, 2+5, 3+4.

## A-07 Brass Caliper
Tier I — price 7.  
**Once per encounter after a successful win, BUMP one Spoils die ±1 before scoring it.**

## A-08 Red Thread
Tier I — price 6.  
**The first time you win by exactly 1 each encounter, heal 1 HP.**

## A-09 Carbon Paper
Tier II — price 9.  
**Once per encounter after Player Cast, COPY one of your dice onto another of your dice.**

## A-10 Stuck Key
Tier II — price 9.  
**Once per encounter after a damaging win, LOCK one uncommitted die into your next Player Cast.** The next cast rolls only the remaining three dice and includes the locked value as the fourth.

## A-11 Receipt From Nowhere
Tier I — price 6.  
**Your first Shop purchase each Floor costs 2 fewer Coins, minimum 1.**

## A-12 Blank Face
Tier III — price 13.  
**Once per encounter after Player Cast, TRANSMUTE one of your dice to 1 or 6.**

---

# 8. Contraband pool — 6

## C-01 Redacted Slip
Tier I — price 3.  
**REROLL one selected player die. Consume.**

## C-02 Counterfeit Seal
Tier I — price 3.  
**Set one selected player die to 4. Consume.**

## C-03 Wire Cutter
Tier I — price 4.  
**Lower the enemy's highest locked die by 1, minimum 1. Consume.**

## C-04 Carbon Copy
Tier I — price 4.  
**COPY one player die onto another player die. Consume.**

## C-05 Emergency Key
Tier II — price 5.  
**Outside combat, heal 4 HP. Consume.**

## C-06 Temporary Injunction
Tier II — price 5.  
**For this round, ignore a normal/elite enemy's primary Rule text. Instinct and Boss phase rules cannot be ignored. Consume.**

---

# 9. Events — 3

## EV-01 Unnumbered Door
Original Below Event.

Premise: a freestanding door has no number on either side and a warm draft through its keyhole.

### Force it
Lose 3 HP. Gain a random Tier II Artifact offer and may take it without Coin cost; replacement rules apply.

### Knock
Roll 1d6 after confirmation:
- 1–2: lose 2 HP
- 3–4: gain 4 Coins
- 5–6: gain a random Tier I Artifact offer

### Leave
No effect.

---

## EV-02 Talking Board, 1891
Reference substrate: `REF-0003_TALKING_BOARD_OUIJA.md`.

Game transformation is fictional; historical patent/object facts and paranormal claims remain separated in the research record.

### Ask what waits ahead
Reveal the exact enemy identity, Instinct and Rule of the next Combat/Elite node on the chosen path.

### Move the pointer yourself
Gain one random Contraband. Lose 1 HP.

### Put it back
Gain 2 Coins.

---

## EV-03 Lost Property Office
Original institutional Event.

### File a persistent item
Choose one equipped Gear or Artifact. Remove it and gain 75% of base shop price, rounded down, instead of normal salvage.

### Claim something that isn't yours
Pay 4 Coins. Receive a random Tier I Gear/Artifact offer and choose whether to take it.

### Nothing to declare
Leave.

---

# 10. Shop

Baseline stock:
- 1 Gear
- 2 Artifacts
- 1 Contraband
- Heal 4 HP for 4 Coins

Floor I eligible tiers:
- Tier I ordinary
- Tier II at reduced weighting
- Tier III excluded from Shop

No reroll.

---

# 11. Slice-specific loot guardrails

Use `LOOT_AND_ECONOMY_SPEC.md`.

Additional Floor I constraints:
- Band I/II overrepresent Tier I items that function alone.
- Blank Face is eligible only from Band IV, Elite uplift to Band IV, or Boss Draft.
- Boss Draft guarantees at least two persistent options.

---

# 12. Boss Draft pool

Draw 3 valid offers from:
- Breaching Bar
- Proof Vest
- False Bottom
- Hidden Hand
- Opposite Number
- Carbon Paper
- Stuck Key
- Blank Face

No duplicate currently owned non-stackable item.

---

# 13. Supported build archetypes

## Safe / certainty
Bent Knife, Work Apron, Proof Vest, Mirror Shard.

## Doubles / pattern
Twin Nails, Loaded Question, Carbon Paper.

## Low-face greed
False Bottom, Brass Caliper.

## Margin-1 greed
Long Odds, Red Thread, Inside-Out Lining.

## Enemy interference
Hidden Hand, Wire Cutter, Overrule later.

## LOCK / carry-forward
Stuck Key.

## Economy
Ash Ledger, Small Change Purse, Receipt From Nowhere.

The slice must support several two-axis builds rather than one obvious best package.

---

# 14. Simulation questions before implementation lock

- Is Toll Eater's greed penalty understandable/fair?
- Is Unadmitted/Threshold Warden FIXED targeting too restrictive?
- Does Seal-Bearer punish manipulation without becoming anti-fun?
- Does First Door OPEN cause excessive sudden damage?
- Are Mirror Shard / Carbon Paper / Blank Face certainty effects too powerful?
- Are economy Artifacts ever worth slots versus direct combat power?
- Does Best Successful Spoils create safe farming on low-HP enemies?
- Do Band I rewards still feel worth taking?
- Is optional Elite risk worth +1 reward band?

Numbers tune after simulation and playtest; system categories and timing stay governed by the master specs.