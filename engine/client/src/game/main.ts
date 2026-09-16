import { AUTO, CANVAS, Game, Scale } from "phaser";
import { MapScene } from "./scenes/MapScene.js";
import { CombatScene } from "./scenes/CombatScene.js";
import { LootScene } from "./scenes/LootScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { EventScene } from "./scenes/EventScene.js";
import { TechniqueScene } from "./scenes/TechniqueScene.js";

const localDocument = ["file:", "content:"].includes(window.location.protocol);

const config: Phaser.Types.Core.GameConfig = {
  // Android local-file/content:// WebGL can render sprite textures as black quads.
  // Hosted HTTPS builds keep AUTO/WebGL; local fallback uses Canvas for reliable testing.
  type: localDocument ? CANVAS : AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#0b0e12",
  pixelArt: true,
  roundPixels: true,
  scene: [MapScene, CombatScene, LootScene, TechniqueScene, ShopScene, EventScene],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};

const StartGame = (parent: string) => new Game({ ...config, parent });

export default StartGame;
