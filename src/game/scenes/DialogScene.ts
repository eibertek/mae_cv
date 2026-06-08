import * as Phaser from "phaser";

interface DialogConfig {
  speakerName: string;
  messages: string[];
  onComplete?: () => void;
  link?: { url: string; label: string };
}

export class DialogScene extends Phaser.Scene {
  private box!: Phaser.GameObjects.Graphics;
  private nameTag!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private advanceHint!: Phaser.GameObjects.Text;
  private arrowIndicator!: Phaser.GameObjects.Text;

  private messages: string[] = [];
  private currentIndex = 0;
  private currentText = "";
  private targetText = "";
  private charIndex = 0;
  private typeTimer?: Phaser.Time.TimerEvent;
  private isTyping = false;
  private onComplete?: () => void;
  private link?: { url: string; label: string };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private canAdvance = false;

  constructor() {
    super({ key: "DialogScene" });
  }

  create() {
    this.scene.bringToTop();
    const { width, height } = this.cameras.main;
    const boxH = 90;
    const boxY = height - boxH - 8;
    const pad = 10;

    this.box = this.add.graphics();
    this.box.fillStyle(0x111122, 0.92);
    this.box.lineStyle(2, 0x4488ff, 1);
    this.box.fillRoundedRect(8, boxY, width - 16, boxH, 6);
    this.box.strokeRoundedRect(8, boxY, width - 16, boxH, 6);

    this.nameTag = this.add.text(18, boxY - 14, "", {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffffff",
      backgroundColor: "#4488ff",
      padding: { x: 6, y: 3 },
    }).setDepth(20);

    this.bodyText = this.add.text(18, boxY + pad, "", {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffffff",
      wordWrap: { width: width - 36 },
      lineSpacing: 4,
    }).setDepth(20);

    this.advanceHint = this.add.text(width - 18, boxY + boxH - 14, "▼ ESPACIO", {
      fontSize: "7px",
      fontFamily: "monospace",
      color: "#aaaaff",
    }).setOrigin(1, 0).setDepth(20).setVisible(false);

    this.arrowIndicator = this.add.text(width - 18, boxY + boxH - 14, "▼", {
      fontSize: "9px",
      fontFamily: "monospace",
      color: "#ffff44",
    }).setOrigin(1, 0).setDepth(20).setVisible(false);

    this.tweens.add({
      targets: this.arrowIndicator,
      alpha: 0.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.spaceKey.on("down", () => this.advance());
    this.enterKey.on("down", () => this.advance());
  }

  private advance() {
    if (this.isTyping) {
      this.typeTimer?.remove();
      this.bodyText.setText(this.targetText);
      this.isTyping = false;
      this.advanceHint.setVisible(true);
      this.arrowIndicator.setVisible(true);
      this.canAdvance = true;
      return;
    }

    if (!this.canAdvance) return;

    this.currentIndex++;
    if (this.currentIndex < this.messages.length) {
      this.typeMessage(this.messages[this.currentIndex]);
    } else {
      this.endDialog();
    }
  }

  private typeMessage(text: string) {
    this.targetText = text;
    this.currentText = "";
    this.charIndex = 0;
    this.isTyping = true;
    this.canAdvance = false;
    this.advanceHint.setVisible(false);
    this.arrowIndicator.setVisible(false);
    this.bodyText.setText("");

    this.typeTimer = this.time.addEvent({
      delay: 28,
      repeat: text.length - 1,
      callback: () => {
        this.currentText += text[this.charIndex];
        this.bodyText.setText(this.currentText);
        this.charIndex++;
        if (this.charIndex >= text.length) {
          this.isTyping = false;
          this.canAdvance = true;
          this.advanceHint.setVisible(true);
          this.arrowIndicator.setVisible(this.currentIndex < this.messages.length - 1);
        }
      },
    });
  }

  private endDialog() {
    if (this.link) {
      this.showLinkPrompt();
    } else {
      this.closeScene();
    }
  }

  private showLinkPrompt() {
    this.spaceKey.off("down");
    this.enterKey.off("down");

    this.bodyText.setColor("#44ffcc");
    this.bodyText.setText(`🔗  ${this.link!.label}`);
    this.advanceHint.setText("[ESPACIO] Abrir  ·  [ESC] Cerrar");
    this.advanceHint.setColor("#44ffcc");
    this.advanceHint.setVisible(true);
    this.arrowIndicator.setVisible(false);

    this.spaceKey.on("down", () => {
      window.open(this.link!.url, "_blank", "noopener,noreferrer");
      this.closeScene();
    });
    this.enterKey.on("down", () => {
      window.open(this.link!.url, "_blank", "noopener,noreferrer");
      this.closeScene();
    });

    this.input.keyboard!
      .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on("down", () => this.closeScene());
  }

  private closeScene() {
    this.spaceKey.off("down");
    this.enterKey.off("down");
    const cb = this.onComplete;
    this.scene.stop();
    cb?.();
  }

  openDialog(config: DialogConfig) {
    this.messages = config.messages;
    this.onComplete = config.onComplete;
    this.link = config.link;
    this.currentIndex = 0;
    this.nameTag.setText(config.speakerName);
    this.typeMessage(this.messages[0]);
  }
}
