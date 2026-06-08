import * as Phaser from "phaser";
import { SKILLS } from "../config/skills.config";
import { ASSET_KEYS, GAME_W, GAME_H } from "../config/assets.config";
import { SkillPokemon } from "../objects/SkillPokemon";
import { Player } from "../objects/Player";
import { t } from "../config/locale";

const STORAGE_KEY = "mariano_cv_captured_skills";

function getCapturedSkills(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveCapture(id: string) {
  const list = getCapturedSkills();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export class KnowledgeShopScene extends Phaser.Scene {
  private player!: Player;
  private pokemons: SkillPokemon[] = [];
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private inBattle = false;
  private hudText!: Phaser.GameObjects.Text;
  private capturedIds: string[] = [];
  private battleCompleteHandler?: (data: { captured: boolean; skillId: string }) => void;
  private recentlyEncountered = new Set<string>();
  private resetConfirmOverlay?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "KnowledgeShopScene" });
  }

  create() {
    const { width, height } = this.cameras.main;
    this.capturedIds = getCapturedSkills();

    this.drawShopBackground(width, height);

    // Player spawn at entrance
    this.player = new Player(this, width / 2, height - 50);

    // Spawn skill pokemons in a grid
    this.spawnPokemons(width, height);

    // HUD
    this.drawHUD(width, height);

    // Physics bounds
    this.physics.world.setBounds(0, 0, width, height);
    this.player.setCollideWorldBounds(true);


    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Camera
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Back key (ESC) — only exit when not in battle; MallScene's shutdown listener handles the resume
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on("down", () => {
      if (this.inBattle) return;
      if (this.resetConfirmOverlay) { this.hideResetConfirm(); return; }
      this.scene.stop();
    });

    // R key — reset captured skills (with confirmation)
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R).on("down", () => {
      if (this.inBattle) return;
      if (this.resetConfirmOverlay) {
        this.confirmReset();
      } else {
        this.showResetConfirm(width, height);
      }
    });

    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on("down", () => {
      if (this.resetConfirmOverlay) this.confirmReset();
    });

    // Clean up any pending battle-complete listener when this scene shuts down
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.battleCompleteHandler) {
        this.game.events.off("battle-complete", this.battleCompleteHandler);
        this.battleCompleteHandler = undefined;
      }
    });

    // Title
    this.add.text(width / 2, 18, t("knowledge.title"), {
      fontSize: "12px",
      fontFamily: "monospace",
      color: "#ffff44",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(20);

    this.add.text(width / 2, 34, t("knowledge.subtitle"), {
      fontSize: "8px",
      fontFamily: "monospace",
      color: "#aaaaaa",
    }).setOrigin(0.5).setDepth(20);
  }

  private drawShopBackground(width: number, height: number) {
    // Real tech-store background scaled to canvas
    this.add.image(GAME_W / 2, GAME_H / 2, ASSET_KEYS.TECH_STORE)
      .setDisplaySize(GAME_W, GAME_H)
      .setDepth(-1);

    // Semi-transparent overlay to keep skill zone labels readable
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000022, 0.35);
    overlay.fillRect(0, 0, width, height);
    overlay.setDepth(0);

    // Type zone labels
    const zones = [
      { label: "Backend",    x:  80, y:  90, color: 0x1a5a1a },
      { label: "Frontend",   x: 300, y:  90, color: 0x1a1a5a },
      { label: "DevOps & DB",x: 190, y: 210, color: 0x5a2a1a },
    ];
    zones.forEach(({ label, x, y, color }) => {
      const zoneBg = this.add.graphics().setDepth(1);
      zoneBg.fillStyle(color, 0.4);
      zoneBg.lineStyle(1, color, 0.9);
      zoneBg.fillRoundedRect(x - 60, y - 60, 120, 100, 8);
      zoneBg.strokeRoundedRect(x - 60, y - 60, 120, 100, 8);
      this.add.text(x, y - 50, label, {
        fontSize: "7px", fontFamily: "monospace", color: "#cccccc",
      }).setOrigin(0.5).setDepth(2);
    });
  }

  private spawnPokemons(_width: number, _height: number) {
    const positions = [
      { x: 80, y: 100 },
      { x: 140, y: 130 },
      { x: 300, y: 100 },
      { x: 360, y: 130 },
      { x: 420, y: 100 },
      { x: 170, y: 210 },
      { x: 230, y: 230 },
      { x: 290, y: 210 },
    ];

    SKILLS.forEach((skill, i) => {
      const pos = positions[i % positions.length];
      const pokemon = new SkillPokemon(this, pos.x, pos.y, skill);

      if (this.capturedIds.includes(skill.id)) {
        pokemon.markCaptured();
      }

      this.pokemons.push(pokemon);
    });
  }

  private drawHUD(width: number, height: number) {
    const captured = this.capturedIds.length;
    const total = SKILLS.length;

    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x111133, 0.9);
    hudBg.lineStyle(1, 0x4488ff);
    hudBg.fillRect(0, height - 28, width, 28);
    hudBg.strokeRect(0, height - 28, width, 28);

    this.hudText = this.add.text(width / 2, height - 14, t("knowledge.captured", { captured, total }), {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffdd44",
    }).setOrigin(0.5).setDepth(20);

    this.add.text(width - 4, height - 14, t("knowledge.reset"), {
      fontSize: "7px", fontFamily: "monospace", color: "#ff6666",
    }).setOrigin(1, 0.5).setDepth(20);

    // Mini icons
    SKILLS.forEach((skill, i) => {
      const ix = 12 + i * 26;
      const iy = height - 14;
      const icon = this.add.image(ix, iy, skill.sprite).setScale(1).setDepth(20);
      if (!this.capturedIds.includes(skill.id)) icon.setAlpha(0.3);
    });
  }

  private refreshHUD() {
    const captured = this.capturedIds.length;
    const total = SKILLS.length;
    this.hudText.setText(t("knowledge.captured", { captured, total }));
  }

  private showResetConfirm(width: number, height: number) {
    const cx = width / 2;
    const cy = height / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.lineStyle(1, 0xff4444, 1);
    bg.fillRoundedRect(cx - 110, cy - 30, 220, 60, 6);
    bg.strokeRoundedRect(cx - 110, cy - 30, 220, 60, 6);

    const title = this.add.text(cx, cy - 12, t("knowledge.reset_confirm"), {
      fontSize: "9px", fontFamily: "monospace", color: "#ff4444", fontStyle: "bold",
    }).setOrigin(0.5);

    const hint = this.add.text(cx, cy + 8, t("knowledge.reset_hint"), {
      fontSize: "7px", fontFamily: "monospace", color: "#aaaaaa",
    }).setOrigin(0.5);

    this.resetConfirmOverlay = this.add.container(0, 0, [bg, title, hint]).setDepth(50);
  }

  private hideResetConfirm() {
    this.resetConfirmOverlay?.destroy();
    this.resetConfirmOverlay = undefined;
  }

  private confirmReset() {
    localStorage.removeItem("mariano_cv_captured_skills");
    this.capturedIds = [];
    this.pokemons.forEach(p => p.resetCaptured());
    this.refreshHUD();
    this.hideResetConfirm();
    this.showToast(t("knowledge.reset_done"));
  }

  private showToast(text: string) {
    const { width, height } = this.cameras.main;
    const toast = this.add.text(width / 2, height / 2 - 50, text, {
      fontSize: "10px", fontFamily: "monospace",
      color: "#ffffff", backgroundColor: "#000000cc",
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(60);
    this.time.delayedCall(1500, () => {
      this.tweens.add({ targets: toast, alpha: 0, duration: 400, onComplete: () => toast.destroy() });
    });
  }

  update() {
    if (this.inBattle) return;
    this.player.update();

    // Check overlap with pokemons
    this.pokemons.forEach((pokemon) => {
      if (pokemon.captured || this.recentlyEncountered.has(pokemon.skill.id)) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        pokemon.x, pokemon.y
      );

      if (dist < 48 && !this.inBattle) {
        this.inBattle = true;
        this.player.isLocked = true;

        this.battleCompleteHandler = (data: { captured: boolean; skillId: string }) => {
          this.battleCompleteHandler = undefined;
          this.player.isLocked = false;
          this.inBattle = false;
          if (data.captured) {
            const caught = this.pokemons.find(p => p.skill.id === data.skillId);
            if (caught) {
              saveCapture(data.skillId);
              this.capturedIds = getCapturedSkills();
              caught.markCaptured();
              this.refreshHUD();
            }
          } else {
            // Cooldown so the same skillsmon doesn't retrigger immediately
            this.recentlyEncountered.add(data.skillId);
            this.time.delayedCall(2000, () => this.recentlyEncountered.delete(data.skillId));
          }
        };
        this.game.events.once("battle-complete", this.battleCompleteHandler);

        this.scene.launch("BattleScene", { skill: pokemon.skill });
      }
    });
  }
}
