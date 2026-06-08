import * as Phaser from "phaser";
import { Skill } from "../config/skills.config";
import { t } from "../config/locale";

interface BattleData {
  skill: Skill;
}

type BattleAction = "fight" | "capture" | "run";
type MenuState = "main" | "result";

export class BattleScene extends Phaser.Scene {
  private skill!: Skill;

  private enemyCurrentHp = 0;
  private playerHp = 100;
  private maxPlayerHp = 100;

  private enemySprite!: Phaser.GameObjects.Image;
  private enemyHpBar!: Phaser.GameObjects.Graphics;
  private playerHpBar!: Phaser.GameObjects.Graphics;
  private battleLog!: Phaser.GameObjects.Text;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private selectedAction: BattleAction = "fight";
  private menuActions: BattleAction[] = ["fight", "capture", "run"];
  private menuLabels: string[] = [];
  private menuState: MenuState = "main";

  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private confirmKey!: Phaser.Input.Keyboard.Key;
  private canInput = true;

  constructor() {
    super({ key: "BattleScene" });
  }

  init(data: BattleData) {
    this.skill = data.skill;
    this.enemyCurrentHp = data.skill.hp;
    // Reset per-battle state so re-launches start clean
    this.playerHp = 100;
    this.selectedAction = "fight";
    this.menuState = "main";
    this.canInput = true;
    this.menuItems = [];
  }

  create() {
    this.scene.bringToTop(); // ensure we render above any active game scene
    this.menuLabels = [t("battle.fight"), t("battle.capture"), t("battle.run")];
    const { width, height } = this.cameras.main;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bg.fillRect(0, 0, width, height);

    // Battle arena ground
    bg.fillStyle(0x2a2a4e, 1);
    bg.fillEllipse(width / 2, height * 0.55, width * 0.9, 40);

    // Enemy zone (top-left)
    this.drawBattleCard(24, 20, this.skill.name, `Lv.${this.skill.level}`, true);

    // Player zone (bottom-right)
    this.drawBattleCard(width - 24 - 120, height - 100, "MARIANO", "Lv.99", false);

    // Sprites
    this.enemySprite = this.add.image(width * 0.65, height * 0.3, this.skill.sprite)
      .setScale(5).setDepth(5);

    // NPC sprites are ~370×900px; scale to ~90px tall (90/873 ≈ 0.10)
    this.add.image(width * 0.22, height * 0.72, "npc_guide")
      .setScale(0.10).setDepth(5).setFlipX(true);

    // HP bars
    this.enemyHpBar = this.add.graphics();
    this.playerHpBar = this.add.graphics();
    this.drawHpBar(this.enemyHpBar, 80, 48, this.enemyCurrentHp, this.skill.hp, false);
    this.drawHpBar(this.playerHpBar, width - 24 - 120 + 10, height - 72, this.playerHp, this.maxPlayerHp, true);

    // Battle log
    const logBg = this.add.graphics();
    logBg.fillStyle(0x111122, 0.9);
    logBg.lineStyle(2, 0x4488ff);
    logBg.fillRoundedRect(8, height - 80, width - 16, 72, 4);
    logBg.strokeRoundedRect(8, height - 80, width - 16, 72, 4);

    this.battleLog = this.add.text(16, height - 72, t("battle.appeared", { name: this.skill.name }), {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffffff",
      wordWrap: { width: width - 150 },
      lineSpacing: 3,
    }).setDepth(10);

    // Menu
    this.buildMenu(width - 120, height - 78);

    // Keys
    this.upKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.confirmKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const enter = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.upKey.on("down", () => this.navigateMenu(-1));
    this.downKey.on("down", () => this.navigateMenu(1));
    this.confirmKey.on("down", () => this.selectAction());
    enter.on("down", () => this.selectAction());

    // ESC = run (exit battle)
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on("down", () => {
      if (!this.canInput || this.menuState !== "main") return;
      this.selectedAction = "run";
      this.selectAction();
    });

    // Entrance animation
    this.cameras.main.flash(300, 255, 255, 255);
  }

  private drawBattleCard(x: number, y: number, name: string, level: string, _isEnemy: boolean) {
    const cardW = 120;
    const cardH = 50;
    const g = this.add.graphics();
    g.fillStyle(0x223355, 0.9);
    g.lineStyle(2, 0x4488cc);
    g.fillRoundedRect(x, y, cardW, cardH, 4);
    g.strokeRoundedRect(x, y, cardW, cardH, 4);

    this.add.text(x + 6, y + 6, name, {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffffff",
      fontStyle: "bold",
    });
    this.add.text(x + cardW - 6, y + 6, level, {
      fontSize: "8px",
      fontFamily: "monospace",
      color: "#aaaaff",
    }).setOrigin(1, 0);

    this.add.text(x + 6, y + 24, "HP:", {
      fontSize: "8px",
      fontFamily: "monospace",
      color: "#88ff88",
    });

    return { x, y, cardW, cardH };
  }

  private drawHpBar(g: Phaser.GameObjects.Graphics, x: number, y: number, current: number, max: number, _isPlayer: boolean) {
    const barW = 100;
    const barH = 8;
    const ratio = Math.max(0, current / max);

    g.clear();
    g.fillStyle(0x333333, 1);
    g.fillRect(x, y, barW, barH);

    const color = ratio > 0.5 ? 0x44dd44 : ratio > 0.25 ? 0xdddd00 : 0xdd2222;
    g.fillStyle(color, 1);
    g.fillRect(x, y, barW * ratio, barH);

    g.lineStyle(1, 0x888888);
    g.strokeRect(x, y, barW, barH);
  }

  private buildMenu(x: number, y: number) {
    this.menuItems = [];

    const menuBg = this.add.graphics();
    menuBg.fillStyle(0x111133, 0.95);
    menuBg.lineStyle(2, 0x4488ff);
    menuBg.fillRoundedRect(x - 4, y - 4, 115, 76, 4);
    menuBg.strokeRoundedRect(x - 4, y - 4, 115, 76, 4);

    this.menuLabels.forEach((label, i) => {
      const item = this.add.text(x + 8, y + i * 22 + 6, label, {
        fontSize: "9px",
        fontFamily: "monospace",
        color: i === 0 ? "#ffff44" : "#aaaaaa",
      }).setDepth(15);
      this.menuItems.push(item);
    });
  }

  private navigateMenu(dir: number) {
    if (!this.canInput || this.menuState !== "main") return;
    const idx = this.menuActions.indexOf(this.selectedAction);
    const newIdx = Phaser.Math.Clamp(idx + dir, 0, this.menuActions.length - 1);
    this.selectedAction = this.menuActions[newIdx];
    this.menuItems.forEach((item, i) => {
      item.setColor(i === newIdx ? "#ffff44" : "#aaaaaa");
      item.setText((i === newIdx ? "► " : "  ") + this.menuLabels[i]);
    });
  }

  private selectAction() {
    if (!this.canInput || this.menuState !== "main") return;
    this.canInput = false;

    switch (this.selectedAction) {
      case "fight": this.doFight(); break;
      case "capture": this.doCapture(); break;
      case "run": this.doRun(); break;
    }
  }

  private doFight() {
    const dmg = Phaser.Math.Between(15, 35);
    this.enemyCurrentHp = Math.max(0, this.enemyCurrentHp - dmg);

    // Enemy shake
    this.tweens.add({
      targets: this.enemySprite,
      x: this.enemySprite.x + 10,
      duration: 80,
      yoyo: true,
      repeat: 3,
    });

    this.battleLog.setText(t("battle.commit", { dmg }));
    this.drawHpBar(this.enemyHpBar, 80, 48, this.enemyCurrentHp, this.skill.hp, false);

    this.time.delayedCall(900, () => {
      if (this.enemyCurrentHp <= 0) {
        this.battleLog.setText(t("battle.defeated", { name: this.skill.name }));
        this.enemySprite.setAlpha(0.3);
        this.time.delayedCall(1500, () => this.exitBattle(false));
        return;
      }

      // Enemy counterattack
      const eDmg = Phaser.Math.Between(5, 15);
      this.playerHp = Math.max(0, this.playerHp - eDmg);
      this.drawHpBar(this.playerHpBar, this.cameras.main.width - 24 - 120 + 10, this.cameras.main.height - 72, this.playerHp, this.maxPlayerHp, true);

      this.battleLog.setText(t("battle.counterattack", { name: this.skill.name, eDmg, current: this.enemyCurrentHp, max: this.skill.hp }));
      this.canInput = true;
    });
  }

  private doCapture() {
    const hpRatio = this.enemyCurrentHp / this.skill.hp;

    if (hpRatio > 0.3) {
      this.battleLog.setText(t("battle.too_strong", { name: this.skill.name }));
      this.time.delayedCall(1600, () => { this.canInput = true; });
      return;
    }

    const roll = Math.random();
    const success = roll < this.skill.catchRate;

    // Pokeball throw animation
    const { width, height } = this.cameras.main;
    const ball = this.add.graphics();
    ball.fillStyle(0xff4444, 1);
    ball.fillCircle(0, 0, 6);
    ball.fillStyle(0xffffff, 1);
    ball.fillCircle(0, 0, 3);
    ball.setPosition(width * 0.25, height * 0.52);

    this.tweens.add({
      targets: ball,
      x: this.enemySprite.x,
      y: this.enemySprite.y,
      duration: 400,
      ease: "Power2",
      onComplete: () => {
        ball.destroy();
        if (success) {
          this.battleLog.setText(t("battle.captured", { name: this.skill.name }));
          this.enemySprite.setTint(0x4444ff);
          this.cameras.main.flash(200, 255, 255, 0);
          this.time.delayedCall(1500, () => {
            this.exitBattle(true);
          });
        } else {
          this.enemySprite.setTint(0xff4444);
          this.time.delayedCall(300, () => this.enemySprite.clearTint());
          this.battleLog.setText(t("battle.escaped_ball", { name: this.skill.name }));
          this.time.delayedCall(1200, () => { this.canInput = true; });
        }
      },
    });
  }

  private doRun() {
    this.battleLog.setText(t("battle.ran"));
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(500, () => this.exitBattle(false));
  }

  private exitBattle(captured: boolean) {
    this.game.events.emit("battle-complete", { captured, skillId: this.skill.id });
    this.scene.stop();
  }
}
