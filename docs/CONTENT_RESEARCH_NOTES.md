# AARB — Content/UX Research Notes

These notes capture the external design lessons informing the Floor I content and information pass. They are principles, not instructions to clone another game's presentation.

## Dicey Dungeons
Terry Cavanagh repeatedly audited essentially the entire enemy/equipment pool rather than treating authored content as one-and-done. Version 0.16 changed dungeon generation, equipment distribution, level rewards and enemy design through hundreds of small changes. Earlier exploration was radically reduced in size and clicks to concentrate it into decisions, and an editor mode allowed arming a player with arbitrary equipment and fighting arbitrary enemies.

**AARB takeaway:** every enemy/item gets an audit row: purpose, decision created, readability, interactions, pressure, and whether it deserves to remain. Build direct debug starts for enemy/item combinations rather than manually descending every time. Between-fight structure should contain decisions, not navigation labor.

## Slice & Dice
Large updates expanded items, monsters and keywords while also expanding the Almanac, improving item iconography and keyword descriptions, giving keywords unique icons, adding portrait layout, UI scaling, shareable level state, and better targeting behavior. Early player feedback specifically reported confusion when item restrictions/effects were not fully explained and when the obvious visual object was not the actual interaction target.

**AARB takeaway:** our information system and input system are part of the mechanics. Keywords need stable names/icons/definitions; the visible die must be the clickable die; portrait is not a secondary layout; reproducible/shareable state is valuable debugging infrastructure. A huge content pool only works if the player can parse it.

## Balatro
LocalThunk has described early public testing exposing missing tooltips because he already knew what every object did. He also describes strong art restrictions—palette, resolution, UI standardization, card-set rules—to keep a large content pool coherent. Jokers evolved through trial, balance changes and effect replacement rather than rarity alone.

**AARB takeaway:** never confuse designer familiarity with player comprehension. Every reward must explain itself at the decision point. Art production needs strict reusable constraints. Artifacts should change evaluation rules/patterns rather than merely inflate a stat.

## Slay the Spire
Mega Crit's published GDC material emphasizes metrics-driven balance throughout Early Access alongside community feedback.

**AARB takeaway:** keep the shared-core simulator and human playtest telemetry. Do not let authored flavor or rarity protect an item/enemy from balance changes.

## General AARB synthesis
- Frequent reward choices need concise complete rules, not names plus hidden documentation.
- Persistent slots create useful replacement pressure only if the player can compare old/new effects in place.
- Enemy variety comes from different tactical questions, not just HP/dice escalation.
- Introductory content should teach one concept at a time; later Floor I content combines those concepts.
- Testing utilities are production infrastructure for a content-heavy roguelite: force enemy, force item/build, force event, force boss phase, fixed seed, and quickstart.
- Writing and mechanics should be developed together. A funny enemy whose rule has no tactical identity is filler; a good rule with placeholder naming is unfinished content.
- Player-facing text, iconography, hit targets and tooltips are one system: the object that looks actionable must be actionable and must explain the consequence before commitment.
