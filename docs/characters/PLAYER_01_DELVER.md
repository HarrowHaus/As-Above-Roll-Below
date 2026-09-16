# Player 01 — The Delver

**Status:** C-stage visual/model specification  
**Role:** starter playable character / baseline manipulation archetype  
**Native runtime cell:** 64×64  
**Default pivot:** bottom-center `(32,58)`

## Design purpose

The first playable character must be visually iconic enough to anchor screenshots while remaining simple enough to reproduce consistently as pixel assets in this chat.

The Delver should read as a practical human explorer who has adapted to casting in the Below. They are not a chosen-one knight, plague doctor, wizard, or mascot.

## Silhouette

- compact adult human proportions;
- slightly oversized hood/upper silhouette for readability;
- short field coat ending around upper thigh;
- narrow lower legs / sturdy boots;
- one small satchel mass on rear hip;
- one compact casting-tool silhouette at belt/hand;
- scarf tail provides a controlled secondary animation shape.

## Head / face

- cream/off-white structured casting hood, softened by wear;
- opening contains a dark veil/face field rather than a beaked mask;
- two small warm-magenta eye points are allowed as the main face read;
- no plague-doctor beak;
- no skull mask;
- no antlers/horns;
- hood has one simple seam language that remains consistent across poses.

## Clothing

- charcoal / bruised-indigo field coat;
- rust-red scarf with one short trailing end;
- dark trousers;
- worn practical boots;
- small brass fasteners / casting-kit hardware;
- bone/ivory dice case or satchel detail, but no dice necklace clutter.

## Equipment

### Casting kit
Small brass-and-bone field implement used to handle/mark lots. It should read as a practical tool, not a magic wand.

### Dice satchel
Small rear/side pouch whose silhouette remains fixed across frames.

## Palette hierarchy

1. cream hood — strongest light mass;
2. charcoal/indigo body — dominant dark mass;
3. rust-red scarf — secondary accent;
4. brass — tiny hardware highlights;
5. magenta eye points — smallest/highest chroma focal accent.

## Personality in pose

- alert but not heroic;
- slight forward weight, as if used to entering spaces that may reject them;
- Fight commit pose should feel like choosing/throwing a lot, not sword combat;
- movement is quick, economical, slightly nervous.

## Required model views

- front;
- 3/4 front;
- side;
- back;
- silhouette strip;
- head closeup;
- idle key pose;
- cast/Fight commit key pose;
- hurt key pose;
- defeat key pose.

## Vertical-slice runtime animation target

- idle: 4 frames;
- walk: 6 frames;
- cast/Fight commit: 4–6 frames;
- hurt: 2–3 frames;
- defeat: 5–7 frames.

## Hard rejection

- plague-doctor beak;
- generic skull face;
- huge fantasy weapon;
- wizard staff;
- oversized backpack clutter;
- chibi proportions;
- fully black silhouette with no readable clothing masses;
- randomly changing hood seam/scarf/satchel placement between poses.

## First asset gate

Before animation, approve:

1. model sheet;
2. one transparent 64×64 idle sprite;
3. one transparent cast key pose;
4. native-size readability in a combat screen with the V1 front-facing dice.
