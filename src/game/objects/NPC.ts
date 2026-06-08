import * as Phaser from "phaser";
import { NPCConfig } from "../config/npc.config";

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public npcData: NPCConfig;
  private nameTag!: Phaser.GameObjects.Text;
  private interactHint!: Phaser.GameObjects.Text;
  private playerInRange = false;

  constructor(scene: Phaser.Scene, data: NPCConfig) {
    super(scene, data.position.x, data.position.y, data.sprite);
    this.npcData = data;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.setScale(0.07);

    this.nameTag = scene.add.text(data.position.x, data.position.y - 22, data.name, {
      fontSize: "8px",
      fontFamily: "monospace",
      color: "#ffffff",
      backgroundColor: "#000000cc",
      padding: { x: 3, y: 2 },
    }).setOrigin(0.5, 1).setDepth(10);

    this.interactHint = scene.add.text(data.position.x, data.position.y - 36, "[ESPACIO]", {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#ffff00",
      backgroundColor: "#000000cc",
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5, 1).setDepth(10).setVisible(false);

    this.setDepth(2);

    // Idle bob animation
    scene.tweens.add({
      targets: [this],
      y: data.position.y - 2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  updateDepth(playerY: number) {
    this.setDepth(playerY < this.y ? 5 : 2);
  }

  showHint(show: boolean) {
    this.playerInRange = show;
    this.interactHint.setVisible(show);
  }

  getDialogs(trigger = "default") {
    return this.npcData.dialogs.find((d) => d.trigger === trigger)?.messages ?? [];
  }

  destroy(fromScene?: boolean) {
    this.nameTag?.destroy();
    this.interactHint?.destroy();
    super.destroy(fromScene);
  }
}
