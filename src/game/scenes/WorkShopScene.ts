import * as Phaser from "phaser";
import { WORKS } from "../config/works.config";
import { ASSET_KEYS, GAME_W, GAME_H } from "../config/assets.config";
import { WorkShowcase } from "../objects/WorkShowcase";
import { Player } from "../objects/Player";
import { t } from "../config/locale";

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
    this.add.text(width / 2, 18, t("work.title"), {
      fontSize: "12px",
      fontFamily: "monospace",
      color: "#ffdd44",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(20);

    this.add.text(width / 2, 34, t("work.subtitle"), {
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

  private spawnShowcases(width: number, _height: number) {
    // 2 rows × 4 cols grid to fit all 8 jobs
    const cols = 4;
    const rowY = [115, 225];
    const colX = [55, 170, 290, 415];

    // Row labels
    const labelStyle = { fontSize: "7px", fontFamily: "monospace", color: "#888888" };
    this.add.text(4, rowY[0] - 52, t("work.recent"),  labelStyle).setDepth(10);
    this.add.text(4, rowY[1] - 52, t("work.history"), labelStyle).setDepth(10);

    WORKS.forEach((work, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = colX[col] ?? width / 2;
      const y = rowY[row] ?? 225;

      const showcase = new WorkShowcase(this, x, y, work);
      this.showcases.push(showcase);

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
