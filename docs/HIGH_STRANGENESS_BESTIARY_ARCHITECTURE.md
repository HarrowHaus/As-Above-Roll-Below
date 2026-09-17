# AARB — High-Strangeness Bestiary Architecture

Status: canonical direction for bestiary/world identity.

## Correction
THRESHOLDS drifted into making its environmental metaphor its entire bestiary. That is rejected. Regions provide atmosphere and encounter weighting; they do not monopolize inhabitants.

The AARB universe treats cryptids, Forteana, occult entities, folklore, conventional fantasy monsters, institutional/conspiracy weirdness, documented modern mythologies, original Below-native creatures, and unclassified anomalies as parts of one playable taxonomy.

The humor comes from commitment, accuracy, and juxtaposition—not from every object being a conspiracy punchline.

## Research-derived architecture

### Caves of Qud lesson
Qud's generative systems are multi-tiered: broad concepts feed progressively finer systems, with multipurpose abstractions linking history, culture, architecture, NPCs, quests, and space. AARB follows the same architectural lesson: provenance/taxonomy -> family -> tactical role -> legal rules/affixes -> Region weighting -> manifestation. We do not independently roll random lore, mechanics, visuals, and names and hope they cohere.

Qud also mixes authored and generated content. AARB should do the same.

### Dicey Dungeons lesson
Dicey Dungeons' enemy roster freely mixes humanoids, animals, anthropomorphic things, inanimate objects, and fantasy monsters while maintaining one combat language. Terry Cavanagh repeatedly audited the whole enemy pool and later experimented with Super Enemies: recognizable enemies remixed at higher pressure. AARB should preserve categorical breadth while using audits and controlled variants rather than endless bespoke exceptions.

### Folklore lesson
Named real-world high-strangeness references must be researched from credible folklore/historical sources before implementation. The game distinguishes:
- documented claim/report;
- later folklore/pop-culture accretion;
- AARB invention.

We do not silently present later embellishment as original testimony.

## Global taxonomy
Every enemy family has one primary provenance and optional secondary tags.

1. FORTEAN / CRYPTID — reported anomalous creatures and encounter traditions.
2. FOLKLORE — regional/traditional supernatural beings and legends.
3. OCCULT / ESOTERIC — ceremonial, alchemical, magical, lodge, spirit, egregore, grimoire-derived, or invented occult entities.
4. INSTITUTIONAL / CONSPIRACY — agents, departments, technicians, contractors, experiments, bureaucratic anomalies, surveillance mythology.
5. FANTASY — goblins, witches, wizards, trolls, demons, mimics, necromancers, knights, etc. These are allowed to be played completely straight.
6. MODERN MYTHOLOGY — documented monuments/places/objects with established folklore or conspiracy culture around them.
7. BELOW-NATIVE — wholly original AARB inhabitants.
8. UNCLASSIFIED — deliberately unresolved things that resist the taxonomy.

## EnemyFamily schema direction
An EnemyFamily should eventually declare:
- stable family ID and display identity;
- provenance + source record when based on real lore;
- tactical role;
- base HP/dice/Instinct envelope;
- legal Instinct variants;
- authored rule packages;
- compatible affix tags;
- incompatible affix tags;
- pressure range;
- Region affinities and exclusions;
- rarity;
- visual mutation sockets;
- naming grammar if variants may be named;
- reward/economy biases if any;
- information copy and art brief.

The generator chooses a legal manifestation of an authored family. It does not invent an arbitrary creature mechanic from scratch.

## Region relationship
Regions contain affinity weights, not exclusive bestiaries.

THRESHOLDS should favor LIMINAL, INSTITUTIONAL, OCCULT, UNCLASSIFIED, and BELOW-NATIVE content, while still permitting Fortean/Fantasy/Modern-Mythology encounters. Rare low-affinity violations are allowed when novelty constraints and pressure permit; categorical surprise is part of the game's humor.

A Region-specific enemy is allowed. A Region consisting almost entirely of enemies that are literalizations of its architecture is not.

## Research records
Any real-world named reference receives a SourceRecord before shipping:
- canonical display name;
- place/date where relevant;
- earliest/strongest accessible source;
- reported physical/behavioral traits;
- later folklore additions kept separate;
- what AARB is changing/inventing;
- citation URLs in design documentation;
- sensitivity/legal notes if relevant.

Example: Mothman should begin from Point Pleasant reports in November 1966; Smithsonian Folklife describes the original encounter tradition as a man-sized/bipedal figure with large red-reflective eyes and strong gliding/flight behavior. Later prophecy/bridge associations belong to later folklore and must be labeled as such in research, even if AARB eventually uses them.

## THRESHOLDS retrofit
Keep/research further:
- Latchling — useful as one Below-native baseline.
- Passage Clerk — one institutional absurdity among a diverse roster is strong.
- First Door — keep as singular Region boss; the singularity is why the literal threshold concept works.

Mechanics worth retaining but identities to reconsider:
- Turnback;
- Unadmitted;
- Doorwake;
- Toll-Eater;
- Seal Whelp;
- Threshold Warden;
- Seal-Bearer.

Do not throw away proven mechanics. Rehouse them in a broader universe where appropriate.

## Representative bestiary research set
Before Enemy Affix v0 is frozen, author/research at least one family from each major provenance. Candidate laboratory set:
- Hopkinsville-style reported entity — Fortean; requires primary/credible historical research before naming/traits are locked.
- Mothman-rooted encounter family — Fortean/folklore; original reports separated from later Keel-era mythology.
- straight Goblin — Fantasy; proves the universe can play an RPG creature completely straight.
- Wizard — Fantasy/Occult; proves spell/rule vocabulary.
- institutional field agent — Institutional/Conspiracy; original rather than defamatory imitation of a real person.
- ceremonial construct/egregore — Occult; research-informed but original manifestation.
- Latchling — Below-native.
- an Unclassified family whose taxonomy is intentionally unresolved.

Modern-mythology references such as Denver's Blue Mustang require their own researched SourceRecord before use.

## Procedural enemy rule
Variety is multiplicative but constrained:

family × legal instinct × legal rule package × compatible affix × pressure scaling × Region context × visual mutation

Every generated manifestation must pass:
1. legality validation;
2. power-budget validation;
3. information-text generation;
4. deterministic replay test;
5. novelty/repetition filter;
6. simulation sanity checks;
7. manual sample audit.

If the system cannot explain the enemy in a short rules card, the manifestation is invalid.

## Humor rule
Accuracy makes the joke stronger. Real references are researched obsessively. Invented departments are clearly invented in design records. A goblin does not need a conspiracy explanation. A tax assessor does not need to wink at the camera. The universe treats all categories as equally eligible combatants.
