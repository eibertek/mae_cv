import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MallScene } from "./scenes/MallScene";
import { DialogScene } from "./scenes/DialogScene";
import { BattleScene } from "./scenes/BattleScene";
import { KnowledgeShopScene } from "./scenes/KnowledgeShopScene";
import { WorkShopScene } from "./scenes/WorkShopScene";

export function createGame(parent: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: 480,
    height: 320,
    pixelArt: true,
    antialias: false,
    backgroundColor: "#1a1a2e",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [
      BootScene,
      MallScene,
      DialogScene,
      BattleScene,
      KnowledgeShopScene,
      WorkShopScene,
    ],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  return new Phaser.Game(config);
}
