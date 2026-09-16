# Enemy — Latchling

**Status:** C-stage visual/model specification  
**Taxonomy:** Below-native  
**Role:** early Floor I normal enemy / Thresholds family  
**Native runtime cell:** 64×64  
**Default pivot:** bottom-center `(32,58)`

## Design purpose

The Latchling is the player's first clear introduction to Below-native ecology. It should feel creepy, slightly ridiculous, and immediately readable without becoming a literal household door with arms.

Its anatomy is organized around **holding a passage shut**.

## Silhouette

- squat vertical body, narrower at lower third;
- asymmetrical shoulder/hinge mass;
- two thin forelimbs ending in gripping hook/finger shapes;
- short, planted rear limbs;
- one obvious central seam/cavity read from combat distance;
- top silhouette slightly slanted or offset rather than perfectly rectangular.

## Anatomy / material

- body resembles layered threshold material without resolving into one known object;
- painted-wood / keratin / mineral laminate texture;
- thin brass/iron hinge-like inclusions grown into the body, not bolted-on furniture;
- central latch-cavity acts as the focal sensory/behavior structure;
- no conventional face required;
- seams can open slightly during attack/idle but must not become a giant mouth cliché.

## Color hierarchy

- weathered brown/grey primary body;
- dark seam/cavity;
- restrained oxide/rust marks;
- tiny magenta or warm-red inner focal accent;
- muted brass/iron hardware highlights.

## Motion personality

- cautious side-to-side testing motion;
- repeatedly checks or pulls at invisible boundaries;
- idle hands make small gripping motions;
- attack is a sudden clamp/lunge, not a bite;
- hurt reaction briefly forces central seam open or misaligns its plates;
- defeat should collapse/fold inward as if the threshold it was maintaining has failed.

## Gameplay visual tie

The Latchling's visual behavior should support a simple deterministic Instinct, likely `TIGHT` or another pairing behavior that suggests closing gaps. Exact combat rule is D-stage content, not art canon yet.

## Required model views

- front/3-quarter combat view;
- side silhouette;
- back/structure study;
- cavity/seam closeup;
- idle key pose;
- attack/clamp key pose;
- hurt key pose;
- defeat key pose;
- scale next to Delver.

## Vertical-slice runtime animation target

- idle: 3–4 frames;
- attack: 3–5 frames;
- hurt: 2 frames;
- defeat: 4–6 frames.

## Hard rejection

- literal wooden door with arms;
- giant eyeball centered in a door;
- mimic-style teeth mouth;
- generic black smoke monster;
- antlers/deer skull;
- excessive occult sigils painted on the body;
- Giger-style biomechanical tubing;
- overly tragic/horrific gore.

## First asset gate

Before animation, approve:

1. model sheet;
2. one transparent 64×64 idle sprite;
3. one transparent attack key pose;
4. native-size readability beside the Delver and V1 dice.
