import * as Phaser from "phaser";
import { PLAYER_CONFIG, PLAYER_ANIMS } from "../config/player.config";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  public facing: "up" | "down" | "left" | "right" = "down";
  private moving = false;
  public isLocked = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PLAYER_CONFIG.spriteKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(PLAYER_CONFIG.scale); // 0.5 → 48×86 px frame on screen
    this.setDepth(4);
    this.setCollideWorldBounds(true);

    // Physics body in LOCAL (pre-scale) pixels.
    // Frame is 96×115; character content spans roughly y=14–98 within frame.
    // At scale=0.5: setSize(60,30) → 30×15 world px box at feet.
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(60, 30);
    body.setOffset(18, 72);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.registerAnimations(scene);
    this.play("idle_down");
  }

  private registerAnimations(scene: Phaser.Scene) {
    if (scene.anims.exists("idle_down")) return;
    PLAYER_ANIMS.forEach(({ key, frames, frameRate, repeat }) => {
      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(PLAYER_CONFIG.spriteKey, { frames }),
        frameRate,
        repeat,
      });
    });
  }

  update() {
    if (this.isLocked) {
      this.setVelocity(0, 0);
      this.play(`idle_${this.facing}`, true);
      return;
    }

    const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.down.isDown;
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;

    const speed = PLAYER_CONFIG.speed;
    let vx = 0, vy = 0;

    if (left)       { vx = -speed; this.facing = "left"; }
    else if (right) { vx =  speed; this.facing = "right"; }
    if (up)         { vy = -speed; this.facing = "up"; }
    else if (down)  { vy =  speed; this.facing = "down"; }

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    this.setVelocity(vx, vy);
    this.moving = vx !== 0 || vy !== 0;

    if (this.moving) {
      this.play(`walk_${this.facing}`, true);
    } else {
      this.play(`idle_${this.facing}`, true);
    }
  }
}
