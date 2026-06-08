import * as Phaser from "phaser";
import { Skill } from "../config/skills.config";

export class SkillPokemon extends Phaser.Physics.Arcade.Sprite {
  public skill: Skill;
  private label!: Phaser.GameObjects.Text;
  private lvlBadge!: Phaser.GameObjects.Text;
  private isCaptured = false;

  constructor(scene: Phaser.Scene, x: number, y: number, skill: Skill) {
    super(scene, x, y, skill.sprite);
    this.skill = skill;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setScale(2);
    this.setDepth(2);

    this.label = scene.add.text(x, y + 20, skill.name, {
      fontSize: "8px",
      fontFamily: "monospace",
      color: "#ffffff",
      backgroundColor: "#000000aa",
      padding: { x: 3, y: 1 },
    }).setOrigin(0.5).setDepth(6);

    this.lvlBadge = scene.add.text(x + 14, y - 14, `Lv${skill.level}`, {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#ffff44",
      backgroundColor: "#222222cc",
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5).setDepth(6);

    // Wander animation
    scene.tweens.add({
      targets: this,
      x: x + Phaser.Math.Between(-20, 20),
      y: y + Phaser.Math.Between(-10, 10),
      duration: Phaser.Math.Between(1500, 2500),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        this.label.setPosition(this.x, this.y + 20);
        this.lvlBadge.setPosition(this.x + 14, this.y - 14);
      },
    });
  }

  markCaptured() {
    this.isCaptured = true;
    this.setTint(0x888888);
    this.setAlpha(0.5);
    this.label.setText(`✓ ${this.skill.name}`);
    this.label.setColor("#88ff88");
  }

  resetCaptured() {
    this.isCaptured = false;
    this.clearTint();
    this.setAlpha(1);
    this.label.setText(this.skill.name);
    this.label.setColor("#ffffff");
  }

  get captured() {
    return this.isCaptured;
  }

  destroy(fromScene?: boolean) {
    this.label?.destroy();
    this.lvlBadge?.destroy();
    super.destroy(fromScene);
  }
}
