import { AUTO, Game, Scale } from "phaser";
import { CombatScene } from "./scenes/CombatScene.js";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#0b0e12",
  pixelArt: true,
  roundPixels: true,
  scene: [CombatScene],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};

const StartGame = (parent: string) => new Game({ ...config, parent });

export default StartGame;
