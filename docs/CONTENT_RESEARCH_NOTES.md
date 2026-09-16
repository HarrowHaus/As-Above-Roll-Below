# AARB — Content/UX Research Notes

These notes capture the external design lessons informing the Floor I content and information pass. They are principles, not instructions to clone another game's presentation.

## Dicey Dungeons
Terry Cavanagh repeatedly audited essentially the entire enemy/equipment pool rather than treating authored content as one-and-done. Version 0.16 changed dungeon generation, equipment distribution, level rewards and enemy design through hundreds of small changes. His published enemy audit explicitly treats each enemy as a design object to revisit. Later updates added preview/description quality-of-life and testing shortcuts for forcing enemies/equipment.

**AARB takeaway:** every enemy/item gets an audit row: purpose, decision created, readability, interactions, pressure, and whether it deserves to remain. Build debug starts for enemy/item combinations rather than manually descending every time.

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
- Testing utilities are production infrastructure for a content-heavy roguelite: force enemy, force item/build, force event, force boss phase, fixed seed, and quickstart should eventually exist.
- Writing and mechanics should be developed together. A funny enemy whose rule has no tactical identity is filler; a good rule with placeholder naming is unfinished content.
