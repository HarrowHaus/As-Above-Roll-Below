import { AUTO, Game, Scale } from "phaser";
import { DescentScene } from "./scenes/DescentScene.js";
import { CombatScene } from "./scenes/CombatScene.js";
import { LootScene } from "./scenes/LootScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { EventScene } from "./scenes/EventScene.js";
import { TechniqueScene } from "./scenes/TechniqueScene.js";

const config: Phaser.Types.Core.GameConfig = {
  // Prefer Phaser's GPU renderer. Combat dice are generated from Graphics now,
  // so the old atlas-texture failure no longer requires a Canvas-only client.
  type: AUTO,
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
