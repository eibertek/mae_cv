import * as Phaser from "phaser";
import { WORKS } from "../config/works.config";
import { ASSET_KEYS, GAME_W, GAME_H } from "../config/assets.config";
import { WorkShowcase } from "../objects/WorkShowcase";
import { Player } from "../objects/Player";

export class WorkShopScene extends Phaser.Scene {
  private player!: Player;
  private showcases: WorkShowcase[] = [];
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private nearShowcase: WorkShowcase | null = null;
  private dialogActive = false;

  constructor() {
    super({ key: "WorkShopScene" });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.drawShopBackground(width, height);

    // Player spawn
    this.player = new Player(this, width / 2, height - 60);

    // Spawn work showcases
    this.spawnShowcases(width, height);

    this.physics.world.setBounds(0, 0, width, height);
    this.player.setCollideWorldBounds(true);

    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on("down", () => this.interactWithNearShowcase());

    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on("down", () => {
      if (!this.dialogActive) {
        this.scene.stop();
      }
    });

    // Title
    this.add.text(width / 2, 18, "💼 TIENDA DE EXPERIENCIA", {
      fontSize: "12px",
      fontFamily: "monospace",
      color: "#ffdd44",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(20);

    this.add.text(width / 2, 34, "Acercate a las vitrinas y presioná ESPACIO  |  ESC = Salir", {
      fontSize: "8px",
      fontFamily: "monospace",
      color: "#aaaaaa",
    }).setOrigin(0.5).setDepth(20);

    this.cameras.main.setBackgroundColor("#1a0f1a");
  }

  private drawShopBackground(width: number, height: number) {
    // Real generic-store background scaled to canvas
    this.add.image(GAME_W / 2, GAME_H / 2, ASSET_KEYS.GENERIC_STORE)
      .setDisplaySize(GAME_W, GAME_H)
      .setDepth(-1);

    // Semi-transparent overlay to keep showcase labels readable
    const overlay = this.add.graphics();
    overlay.fillStyle(0x0a0518, 0.4);
    overlay.fillRect(0, 0, width, height);
    overlay.setDepth(0);
  }

  private spawnShowcases(_width: number, _height: number) {
    const positions = [
      { x: 100, y: 140 },
      { x: 240, y: 140 },
      { x: 380, y: 140 },
    ];

    WORKS.forEach((work, i) => {
      const pos = positions[i % positions.length];
      const showcase = new WorkShowcase(this, pos.x, pos.y, work);
      this.showcases.push(showcase);

      // Add physics to interact zone
      const zone = showcase.getInteractZone();
      this.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);
    });
  }

  private interactWithNearShowcase() {
    if (!this.nearShowcase || this.dialogActive) return;
    this.dialogActive = true;
    this.player.isLocked = true;

    const messages = this.nearShowcase.buildDialogMessages();
    const work = this.nearShowcase.work;

    this.scene.launch("DialogScene");

    this.time.delayedCall(50, () => {
      const dialogScene = this.scene.get("DialogScene") as import("./DialogScene").DialogScene;
      dialogScene.openDialog({
        speakerName: work.company,
        messages,
        onComplete: () => {
          this.dialogActive = false;
          this.player.isLocked = false;
        },
      });
    });
  }

  update() {
    if (this.dialogActive) return;
    this.player.update();

    let closestShowcase: WorkShowcase | null = null;
    let closestDist = Infinity;

    this.showcases.forEach((showcase) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        showcase.x, showcase.y
      );
      if (dist < 70 && dist < closestDist) {
        closestDist = dist;
        closestShowcase = showcase;
      }
    });

    if (closestShowcase !== this.nearShowcase) {
      this.nearShowcase?.showHint(false);
      (closestShowcase as WorkShowcase | null)?.showHint(true);
      this.nearShowcase = closestShowcase as WorkShowcase | null;
    }
  }
}
