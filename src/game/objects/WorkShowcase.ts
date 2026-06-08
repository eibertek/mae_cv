import * as Phaser from "phaser";
import { Work } from "../config/works.config";

export class WorkShowcase extends Phaser.GameObjects.Container {
  public work: Work;
  private interactZone!: Phaser.GameObjects.Zone;
  private hintText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, work: Work) {
    super(scene, x, y);
    this.work = work;
    scene.add.existing(this);
    this.setDepth(5);

    const color = Phaser.Display.Color.HexStringToColor(work.color).color;

    // Storefront frame
    const frame = scene.add.graphics();
    frame.lineStyle(3, color, 1);
    frame.fillStyle(color, 0.15);
    frame.strokeRect(-40, -50, 80, 60);
    frame.fillRect(-40, -50, 80, 60);
    this.add(frame);

    // Company name
    const title = scene.add.text(0, -40, work.company, {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5, 0);
    this.add(title);

    const role = scene.add.text(0, -26, work.role, {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#cccccc",
    }).setOrigin(0.5, 0);
    this.add(role);

    const period = scene.add.text(0, -14, work.period, {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#aaffaa",
    }).setOrigin(0.5, 0);
    this.add(period);

    // Tech badges row
    const badgeStr = work.technologies.slice(0, 3).join(" • ");
    const badges = scene.add.text(0, 0, badgeStr, {
      fontSize: "6px",
      fontFamily: "monospace",
      color: "#ffdd44",
    }).setOrigin(0.5, 0);
    this.add(badges);

    this.hintText = scene.add.text(0, 18, "[ESPACIO]", {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#ffff00",
      backgroundColor: "#000000cc",
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5, 0).setVisible(false);
    this.add(this.hintText);

    // Physics zone for overlap detection
    this.interactZone = scene.add.zone(x, y, 90, 70);
    scene.physics.world.enable(this.interactZone, Phaser.Physics.Arcade.STATIC_BODY);
  }

  getInteractZone() {
    return this.interactZone;
  }

  showHint(show: boolean) {
    this.hintText.setVisible(show);
  }

  buildDialogMessages(): string[] {
    return [
      `🏢 ${this.work.company}`,
      `💼 ${this.work.role}`,
      `📅 ${this.work.period}`,
      this.work.description,
      `⚡ Tecnologías: ${this.work.technologies.join(", ")}`,
      ...this.work.achievements.map((a) => `✅ ${a}`),
    ];
  }
}
