# AARB — Floor I Content Completion Gate

This is the checklist between the current mechanically complete test build and production asset manufacture.

## A. Player-facing writing

Every authored object needs all of the following before art lock:

- canonical display name;
- category / slot / tier where applicable;
- compact rules sentence that is sufficient to make the immediate decision;
- expanded explanation for keywords, targeting and timing;
- flavor line;
- mechanical intent (developer-only);
- interaction notes (developer-only);
- icon/sprite brief;
- direct-test URL/state.

Current Floor I target: Delver + 2 Level-3 Techniques; 8 normals; 2 Elites; First Door with 3 phases; 8 Gear; 12 Artifacts; 6 Contraband; 3 Events; Shop; normal Loot Draft; Boss Draft.

## B. Information architecture

No mechanically important rule may exist only in documentation.

Required surfaces:

1. Combat: enemy name, HP, Instinct, special rule, current locked dice, player HP, player dice states, Fight, Enemy Fight, Margin, Spoils, available actions.
2. Loot: name, category/slot, tier, complete compact rule, slot pressure, comparison when replacement is required, skip value.
3. Shop: same item information as Loot plus effective price and discount reason.
4. Events: consequence language must distinguish known outcomes from explicitly random outcomes.
5. Keywords: tap/inspect explanation for FIGHT, SPOILS, MARGIN, COMMIT, BUMP, FLIP, COPY, REROLL, FIXED, LOCKED, HEAL and each Instinct.

## C. Content audit

Each enemy must answer a different tactical question. Each persistent item must alter evaluation, economy, survivability or manipulation in a way that can matter during a run. Items that are merely weaker versions of another item need a deliberate tier/availability reason.

Audit questions:

- What decision does this content create?
- Can a new player understand it before committing?
- Is the effect observable when it fires?
- What does it synergize with?
- What counters or constrains it?
- Does another entry already perform the same job better?
- Is its humor/worldbuilding attached to the mechanic rather than pasted on?

## D. UX/performance gate

Before production art expands scene complexity:

- Phaser owns canvas sizing and pointer coordinates;
- WebGL/AUTO renderer is the normal path;
- combat must not rebuild the entire display tree for ordinary die selection;
- dice hit areas must match visible dice on portrait and desktop;
- stable 60 FPS target on ordinary desktop and acceptable mobile hardware;
- runtime errors must surface visibly;
- direct-content harness must work.

## E. Art lock gate

Only after A–D pass do we manufacture the complete Floor I asset set. Art briefs should derive from the canonical content bible, not from temporary scene primitives.

The first production asset pack should include: Delver combat sprites; 8 normal enemy identities; 2 Elite identities; First Door phases; Gear/Artifact/Contraband icon language; THRESHOLDS modular environment kit; Loot/Shop frames; keyword/status icons; dice feedback/VFX.
