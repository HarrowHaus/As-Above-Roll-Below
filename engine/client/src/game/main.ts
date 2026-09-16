import { CANVAS, Game, Scale } from "phaser";
import { DescentScene } from "./scenes/DescentScene.js";
import { CombatScene } from "./scenes/CombatScene.js";
import { LootScene } from "./scenes/LootScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { EventScene } from "./scenes/EventScene.js";
import { TechniqueScene } from "./scenes/TechniqueScene.js";

const config: Phaser.Types.Core.GameConfig = {
  // AARB is a modest 2D pixel/UI game. Canvas is currently the most reliable
  // mobile path and avoids browser-specific black texture quads entirely.
  type: CANVAS,
  width: Math.max(320, window.innerWidth),
  height: Math.max(480, window.innerHeight),
  parent: "game-container",
  backgroundColor: "#0b0e12",
  pixelArt: true,
  roundPixels: true,
  scene: [DescentScene, CombatScene, LootScene, TechniqueScene, ShopScene, EventScene],
  scale: {
    mode: Scale.RESIZE,
    autoCenter: Scale.CENTER_BOTH,
  },
};

const StartGame = (parent: string) => new Game({ ...config, parent });

export default StartGame;
