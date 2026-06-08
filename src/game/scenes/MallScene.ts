import * as Phaser from "phaser";
import { Player } from "../objects/Player";
import { NPC } from "../objects/NPC";
import { NPCS } from "../config/npc.config";
import { CV_DATA } from "../config/cv.config";
import { ASSET_KEYS, GAME_W, GAME_H, MALL_FOREGROUND_ZONES } from "../config/assets.config";
import { t, toggleLang, getLang } from "../config/locale";

const STORAGE_KEY = "mariano_cv_captured_skills";

function getCapturedCount(): number {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]).length;
  } catch {
    return 0;
  }
}

interface ZoneTrigger {
  zone: Phaser.GameObjects.Zone;
  sceneKey: string;
  label: string;
}

// Positions derived from shopping_entrance.png (1376×768) scaled to 480×320.
// Scale factors: x=480/1376≈0.349, y=320/768≈0.417
//
// Collision zones (in 480×320 world coords):
//   Top ceiling:       y  0– 27  (blue glass windows at top of lobby image)
//   Left columns:      x 28– 61, y 28–222  (pair of ornate columns)
//   Right columns:     x419–452, y 28–222
//   Fountain block:    x192–288, y120–178  (central fountain)
//
// Shop trigger zones (escalators at lower-left / lower-right of image):
//   Left escalator  ≈ x  52, y 258  → KnowledgeShopScene
//   Right escalator ≈ x 428, y 258  → WorkShopScene

const COLLISION = {
  ceiling:      { x: 240,  y:  14,  w: 480, h:  28 },
  colLeft:      { x:  28,  y: 125,  w:  33, h: 194 },
  colRight:     { x: 452,  y: 125,  w:  33, h: 194 },
  fountain:     { x: 240,  y: 149,  w:  96, h:  58 },
} as const;

const ZONE_LEFT  = { x:  52, y: 258 };
const ZONE_RIGHT = { x: 428, y: 258 };

export class MallScene extends Phaser.Scene {
  private player!: Player;
  private npcs: NPC[] = [];
  private zoneTriggers: ZoneTrigger[] = [];
  private nearNPC: NPC | null = null;
  private dialogActive = false;
  private fgLayers: Array<{ sprite: Phaser.GameObjects.Image; centerY: number }> = [];
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private hudText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "MallScene" });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.drawBackground();
    this.setupCollision();
    this.addZoneLabels();
    this.spawnNPCs();
    this.setupZones(width, height);

    this.player = new Player(this, width / 2, height - 25);

    this.physics.world.setBounds(0, 0, width, height);
    this.player.setCollideWorldBounds(true);

    this.setupInput();
    this.buildHUD(width, height);

    const visited = localStorage.getItem("mall_visited");
    if (!visited) {
      localStorage.setItem("mall_visited", "1");
      this.time.delayedCall(400, () => {
        this.showQuickToast(t("mall.welcome", { name: CV_DATA.name }));
      });
    }
  }

  // ── Background ──────────────────────────────────────────────────────────────
  private drawBackground() {
    // Base layer — always behind everything else.
    this.add.image(GAME_W / 2, GAME_H / 2, ASSET_KEYS.MALL_ENTRANCE)
      .setDisplaySize(GAME_W, GAME_H)
      .setDepth(-1);

    // Per-zone foreground copies: same image, masked to only the zone rectangle,
    // depth switches between 2 (behind player) and 5 (in front) each frame
    // based on player Y vs zone center — gives a Y-sort illusion for baked-in
    // elements like columns and palms.
    this.fgLayers = MALL_FOREGROUND_ZONES.map((zone) => {
      const maskGfx = this.add.graphics();
      maskGfx.fillStyle(0xffffff);
      maskGfx.fillRect(zone.x, zone.y, zone.w, zone.h);
      maskGfx.setVisible(false); // geometry mask uses shape only, not pixels
      const mask = new Phaser.Display.Masks.GeometryMask(this, maskGfx);

      const sprite = this.add.image(GAME_W / 2, GAME_H / 2, ASSET_KEYS.MALL_ENTRANCE_FG)
        .setDisplaySize(GAME_W, GAME_H)
        .setMask(mask)
        .setDepth(2);

      return { sprite, centerY: zone.centerY ?? (zone.y + zone.h / 2) };
    });
  }

  // ── Physics obstacles ───────────────────────────────────────────────────────
  private setupCollision() {
    const walls = this.physics.add.staticGroup();

    const addBlock = (x: number, y: number, w: number, h: number) => {
      const zone = this.add.zone(x, y, w, h);
      this.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);
      walls.add(zone);
    };

    addBlock(COLLISION.ceiling.x,  COLLISION.ceiling.y,  COLLISION.ceiling.w,  COLLISION.ceiling.h);
    addBlock(COLLISION.colLeft.x,  COLLISION.colLeft.y,  COLLISION.colLeft.w,  COLLISION.colLeft.h);
    addBlock(COLLISION.colRight.x, COLLISION.colRight.y, COLLISION.colRight.w, COLLISION.colRight.h);
    addBlock(COLLISION.fountain.x, COLLISION.fountain.y, COLLISION.fountain.w, COLLISION.fountain.h);

    // Attach collider after player is created in create(), via a deferred call
    // so we can capture the walls group in the lambda.
    this.events.once(Phaser.Scenes.Events.CREATE, () => {}, this);
    this._walls = walls;
  }

  private _walls!: Phaser.Physics.Arcade.StaticGroup;

  // ── Zone entrance labels ────────────────────────────────────────────────────
  private addZoneLabels() {
    const addLabel = (x: number, y: number, text: string) => {
      const label = this.add.text(x, y - 18, text, {
        fontSize: "7px",
        fontFamily: "monospace",
        color: "#ffff44",
        backgroundColor: "#000000bb",
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(10);

      this.tweens.add({
        targets: label,
        alpha: 0.3,
        duration: 600,
        yoyo: true,
        repeat: -1,
      });
    };

    addLabel(ZONE_LEFT.x,  ZONE_LEFT.y,  t("zone.knowledge"));
    addLabel(ZONE_RIGHT.x, ZONE_RIGHT.y, t("zone.work"));
  }

  // ── NPCs ────────────────────────────────────────────────────────────────────
  private spawnNPCs() {
    NPCS.forEach((npcData) => {
      const npc = new NPC(this, npcData);
      this.npcs.push(npc);
    });
  }

  // ── Zone triggers ────────────────────────────────────────────────────────────
  private setupZones(width: number, _height: number) {
    const addZone = (x: number, y: number, sceneKey: string, label: string) => {
      const zone = this.add.zone(x, y, 80, 40);
      this.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);
      this.zoneTriggers.push({ zone, sceneKey, label });
    };

    addZone(ZONE_LEFT.x,  ZONE_LEFT.y,  "KnowledgeShopScene", getLang() === "en" ? "SKILLS" : "HABILIDADES");
    addZone(ZONE_RIGHT.x, ZONE_RIGHT.y, "WorkShopScene",      getLang() === "en" ? "EXPERIENCE" : "EXPERIENCIA");
    void width; // used by callers, kept in signature for symmetry with other scenes
  }

  // ── Input ────────────────────────────────────────────────────────────────────
  private setupInput() {
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on("down", () => this.interactWithNearNPC());

    this.input.keyboard!
      .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      .on("down", () => this.interactWithNearNPC());

    // L — toggle language and restart scene to apply
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L).on("down", () => {
      if (this.dialogActive) return;
      toggleLang();
      this.scene.restart();
    });
  }

  private interactWithNearNPC() {
    if (!this.nearNPC || this.dialogActive) return;
    this.dialogActive = true;
    this.player.isLocked = true;

    const messages = this.nearNPC.getDialogs("default");
    const npc = this.nearNPC!;
    const speakerName = typeof npc.npcData.name === "string"
      ? npc.npcData.name
      : npc.npcData.name[getLang()] ?? npc.npcData.name.en;
    const linkLabel = npc.getLinkLabel();
    const link = npc.npcData.link && linkLabel
      ? { url: npc.npcData.link.url, label: linkLabel }
      : undefined;

    this.scene.launch("DialogScene");
    const dialogScene = this.scene.get("DialogScene") as import("./DialogScene").DialogScene;

    this.time.delayedCall(50, () => {
      dialogScene.openDialog({
        speakerName,
        messages,
        link,
        onComplete: () => {
          this.dialogActive = false;
          this.player.isLocked = false;
        },
      });
    });
  }

  // ── HUD ─────────────────────────────────────────────────────────────────────
  private buildHUD(width: number, _height: number) {
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x111122, 0.85);
    hudBg.lineStyle(1, 0x4488ff, 0.6);
    hudBg.fillRect(0, 0, width, 14);
    hudBg.strokeRect(0, 0, width, 14);
    hudBg.setDepth(30);

    this.hudText = this.add.text(width / 2, 7, this.buildHudString(), {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#ddddff",
    }).setOrigin(0.5).setDepth(31);

    this.add.text(6, 7, `${CV_DATA.name}  •  ${CV_DATA.title}`, {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#aaffaa",
    }).setOrigin(0, 0.5).setDepth(31);

    this.add.text(width - 4, 7, t("mall.lang_toggle"), {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#ffcc44",
    }).setOrigin(1, 0.5).setDepth(31);
  }

  private buildHudString() {
    const captured = getCapturedCount();
    return t("mall.hud", { captured, total: 8 });
  }

  private showQuickToast(text: string) {
    const { width, height } = this.cameras.main;
    const toast = this.add.text(width / 2, height / 2, text, {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffffff",
      backgroundColor: "#000000cc",
      padding: { x: 10, y: 6 },
      wordWrap: { width: width - 40 },
      align: "center",
    }).setOrigin(0.5).setDepth(100);

    this.time.delayedCall(3500, () => {
      this.tweens.add({
        targets: toast,
        alpha: 0,
        duration: 500,
        onComplete: () => toast.destroy(),
      });
    });
  }

  // ── Update ───────────────────────────────────────────────────────────────────
  update() {
    if (this.dialogActive) return;
    this.player.update();

    // Wall collisions (registered here so player exists)
    if (this._walls) {
      this.physics.collide(this.player, this._walls);
    }

    // Y-sort NPCs and foreground layers vs player
    this.npcs.forEach(npc => npc.updateDepth(this.player.y));
    this.fgLayers.forEach(({ sprite, centerY }) => {
      sprite.setDepth(this.player.y < centerY ? 5 : 2);
    });

    // NPC proximity
    let closest: NPC | null = null;
    let closestDist = Infinity;
    this.npcs.forEach((npc) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, npc.x, npc.y
      );
      if (dist < 50 && dist < closestDist) { closestDist = dist; closest = npc; }
    });

    if (closest !== this.nearNPC) {
      this.nearNPC?.showHint(false);
      (closest as NPC | null)?.showHint(true);
      this.nearNPC = closest as NPC | null;
    }

    // Zone triggers
    this.zoneTriggers.forEach(({ zone, sceneKey, label }) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, zone.x, zone.y
      );
      if (dist < 40) {
        this.player.isLocked = true;
        this.showQuickToast(t("mall.entering", { label }));
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(450, () => {
          this.scene.pause();
          this.scene.launch(sceneKey);
          this.cameras.main.fadeIn(300);
          this.player.isLocked = false;
          this.scene.get(sceneKey).events.once("shutdown", () => {
            this.scene.resume("MallScene");
          });
        });

        // Move zone away temporarily to prevent re-trigger
        zone.setPosition(-1000, -1000);
        const origX = zone.x === -1000 ? (sceneKey === "KnowledgeShopScene" ? ZONE_LEFT.x : ZONE_RIGHT.x) : zone.x;
        const origY = sceneKey === "KnowledgeShopScene" ? ZONE_LEFT.y : ZONE_RIGHT.y;
        this.time.delayedCall(2000, () => zone.setPosition(origX, origY));
      }
    });

    this.hudText.setText(this.buildHudString());
  }
}
