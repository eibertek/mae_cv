import * as Phaser from "phaser";
import { ASSET_KEYS, ASSET_PATHS, PLAYER_SHEET } from "../config/assets.config";

export class BootScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    const { width, height } = this.cameras.main;
    const cx = width / 2;
    const cy = height / 2;

    // Loading UI
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(cx - 100, cy - 12, 200, 24);

    this.progressBar = this.add.graphics();

    this.loadingText = this.add.text(cx, cy - 24, "Cargando...", {
      fontSize: "12px",
      fontFamily: "monospace",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.percentText = this.add.text(cx, cy + 24, "0%", {
      fontSize: "10px",
      fontFamily: "monospace",
      color: "#aaaaaa",
    }).setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x44aaff, 1);
      this.progressBar.fillRect(cx - 98, cy - 10, 196 * value, 20);
      this.percentText.setText(`${Math.round(value * 100)}%`);
    });

    this.load.on("complete", () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });

    // ── Real asset files ──────────────────────────────────────────────────────
    // Scene backgrounds (1376×768 top-down illustrations)
    this.load.image(ASSET_KEYS.MALL_ENTRANCE,    ASSET_PATHS.MALL_ENTRANCE);
    this.load.image(ASSET_KEYS.MALL_ENTRANCE_FG, ASSET_PATHS.MALL_ENTRANCE_FG);
    this.load.image(ASSET_KEYS.MALL_WAYPOINTS, ASSET_PATHS.MALL_WAYPOINTS);
    this.load.image(ASSET_KEYS.GENERIC_STORE,  ASSET_PATHS.GENERIC_STORE);
    this.load.image(ASSET_KEYS.TECH_STORE,     ASSET_PATHS.TECH_STORE);
    this.load.image(ASSET_KEYS.TECH_STORE_2,   ASSET_PATHS.TECH_STORE_2);
    // GBA-style corridor tileset + individual props (32 px tiles, 43×24 grid)
    this.load.image(ASSET_KEYS.INDOOR_ASSETS,  ASSET_PATHS.INDOOR_ASSETS);

    // ── Player spritesheet (real PNG) ────────────────────────────────────────
    this.load.spritesheet(ASSET_KEYS.PLAYER, ASSET_PATHS.PLAYER, {
      frameWidth:  PLAYER_SHEET.frameWidth,
      frameHeight: PLAYER_SHEET.frameHeight,
    });

    this.generateNPCSprites();
    this.generatePokemonSprites();
  }

  // ── NPC sprites ─────────────────────────────────────────────────────────────
  private generateNPCSprites() {
    this.load.image("npc_guide",        "assets/npcs/mall_guide.png");
    this.load.image("npc_receptionist", "assets/npcs/recepcionist.png");
    this.load.image("npc_hr",           "assets/npcs/rrhh_manager.png");
    this.load.image("npc_professor",    "assets/npcs/lead_engineer.png");
  }

  // ── Skill Pokémon sprites ────────────────────────────────────────────────────
  private generatePokemonSprites() {
    const pokemonColors: Record<string, number> = {
      pokemon_php:    0x7b7fb5,
      pokemon_node:   0x68a063,
      pokemon_js:     0xf7df1e,
      pokemon_ts:     0x3178c6,
      pokemon_react:  0x61dafb,
      pokemon_python: 0xffd43b,
      pokemon_mysql:  0x4479a1,
      pokemon_docker: 0x2496ed,
    };
    const pokemonLabels: Record<string, string> = {
      pokemon_php:    "PHP",
      pokemon_node:   "JS",
      pokemon_ts:     "TS",
      pokemon_react:  "⚛",
      pokemon_js:     "JS",
      pokemon_python: "PY",
      pokemon_mysql:  "DB",
      pokemon_docker: "🐳",
    };

    Object.entries(pokemonColors).forEach(([key, color]) => {
      this.generatePokemonSprite(key, color, pokemonLabels[key] ?? "?");
    });
  }

  private generatePokemonSprite(key: string, color: number, label: string) {
    const w = 24, h = 24;
    const canvas = this.textures.createCanvas(key, w, h)!;
    const ctx = (canvas.getSourceImage() as HTMLCanvasElement).getContext("2d")!;

    const r = (color >> 16) & 0xff;
    const g = (color >>  8) & 0xff;
    const b =  color        & 0xff;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.arc(12, 14, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.fillRect(8, 11, 3, 3);
    ctx.fillRect(13, 11, 3, 3);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(9, 12, 1, 1);
    ctx.fillRect(14, 12, 1, 1);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 5px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label.substring(0, 2), 12, 8);

    canvas.refresh();
  }

  create() {
    this.scene.start("MallScene");
  }
}
