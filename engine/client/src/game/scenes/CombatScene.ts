import { Scene } from "phaser";
import {
  RngService,
  bump,
  commitWithEffects,
  createCombat,
  createEffectState,
  floor1NormalEnemies,
  previewCommitWithEffects,
  startRound,
  updatePlayerDie,
  withValue,
  workApronEffect,
  type CombatState,
  type DieId,
  type EffectState,
  type EnemyDefinition,
} from "../../../../core/dist/index.js";

const diceAtlasUrl = new URL(
  "../../../../../assets/preproduction/dice/v1_front/dice_v1_atlas.png",
  import.meta.url,
).href;

const DIE_SCALE = 2;
const PLAYER_DIE_FRAMES = [0, 1, 2, 3, 4, 5] as const;
const ENEMY_DIE_FRAMES = [6, 7, 8, 9, 10, 11] as const;
const OVERLAY_FIGHT = 13;
const OVERLAY_SPOILS = 14;
const OVERLAY_LOCKED = 15;

interface DieView {
  base: Phaser.GameObjects.Sprite;
  overlay: Phaser.GameObjects.Sprite | null;
}

export class CombatScene extends Scene {
  private seed = 831_991;
  private rng!: RngService;
  private enemy!: EnemyDefinition;
  private state!: CombatState;
  private effectState!: EffectState;
  private selected: DieId[] = [];
  private bumpUsesLeft = 1;

  private playerDiceViews: DieView[] = [];
  private enemyDiceViews: DieView[] = [];

  private playerHpFill!: Phaser.GameObjects.Rectangle;
  private enemyHpFill!: Phaser.GameObjects.Rectangle;
  private playerHpText!: Phaser.GameObjects.Text;
  private enemyHpText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private fightText!: Phaser.GameObjects.Text;
  private enemyFightText!: Phaser.GameObjects.Text;
  private marginText!: Phaser.GameObjects.Text;
  private spoilsText!: Phaser.GameObjects.Text;
  private bumpText!: Phaser.GameObjects.Text;
  private commitButton!: Phaser.GameObjects.Container;
  private restartButton!: Phaser.GameObjects.Container;

  private readonly effects = [workApronEffect];

  constructor() {
    super("CombatScene");
  }

  preload(): void {
    this.load.spritesheet("dice-v1", diceAtlasUrl, {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create(): void {
    const enemy = floor1NormalEnemies.find((candidate) => candidate.id === "thresholds:latchling");
    if (!enemy) throw new Error("Floor I Latchling is missing from the content registry");
    this.enemy = enemy;

    this.createEnvironment();
    this.createHud();
    this.createControls();
    this.startEncounter();
  }

  private createEnvironment(): void {
    this.add.rectangle(640, 360, 1280, 720, 0x0b0e12);
    this.add.rectangle(640, 305, 1280, 470, 0x172027);
    this.add.rectangle(640, 520, 1280, 210, 0x101519);
    this.add.rectangle(640, 525, 1280, 4, 0x3c4447);

    // Threshold architecture placeholder. Production environments will replace these primitives.
    this.add.rectangle(640, 265, 360, 24, 0x30363a);
    this.add.rectangle(470, 340, 24, 175, 0x30363a);
    this.add.rectangle(810, 340, 24, 175, 0x30363a);
    this.add.rectangle(640, 350, 300, 230, 0x101416).setStrokeStyle(3, 0x566168);
    this.add.rectangle(640, 350, 180, 180, 0x351820, 0.3);

    // Temporary combatant silhouettes; not production character art.
    this.add.circle(260, 340, 27, 0xd9c8a2);
    this.add.rectangle(260, 420, 72, 130, 0x493b37).setStrokeStyle(4, 0xc34a5c);
    this.add.rectangle(230, 438, 18, 100, 0x282d31);
    this.add.rectangle(290, 438, 18, 100, 0x282d31);

    this.add.rectangle(1015, 395, 94, 150, 0x3e4141).setStrokeStyle(5, 0x916141);
    this.add.rectangle(1015, 350, 54, 38, 0x121619).setStrokeStyle(3, 0x916141);
    this.add.circle(995, 350, 6, 0xe3c267);
    this.add.circle(1035, 350, 6, 0xe3c267);
    this.add.rectangle(980, 485, 16, 60, 0x262b2d);
    this.add.rectangle(1050, 485, 16, 60, 0x262b2d);

    this.add.text(48, 30, "AS ABOVE, ROLL BELOW", {
      fontFamily: "Georgia, serif",
      fontSize: "38px",
      color: "#eee6d5",
    });
    this.add.text(51, 76, "E7 CLIENT • SHARED-CORE COMBAT", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#8f9ba3",
      letterSpacing: 2,
    });

    this.add.text(195, 505, "THE DELVER", { fontFamily: "Georgia, serif", fontSize: "20px", color: "#eee6d5" });
    this.add.text(956, 505, "LATCHLING", { fontFamily: "Georgia, serif", fontSize: "20px", color: "#eee6d5" });
  }

  private createHud(): void {
    this.add.rectangle(220, 545, 300, 16, 0x090b0e).setStrokeStyle(2, 0x574448);
    this.playerHpFill = this.add.rectangle(72, 545, 296, 12, 0xd94360).setOrigin(0, 0.5);
    this.playerHpText = this.add.text(220, 566, "", { fontFamily: "monospace", fontSize: "13px", color: "#bfc7ca" }).setOrigin(0.5);

    this.add.rectangle(1060, 545, 300, 16, 0x090b0e).setStrokeStyle(2, 0x574448);
    this.enemyHpFill = this.add.rectangle(912, 545, 296, 12, 0xd94360).setOrigin(0, 0.5);
    this.enemyHpText = this.add.text(1060, 566, "", { fontFamily: "monospace", fontSize: "13px", color: "#bfc7ca" }).setOrigin(0.5);

    this.roundText = this.add.text(640, 105, "", { fontFamily: "monospace", fontSize: "15px", color: "#9ba7ad" }).setOrigin(0.5);
    this.statusText = this.add.text(640, 485, "", {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#d3d8da",
      align: "center",
      wordWrap: { width: 560 },
    }).setOrigin(0.5);

    const metricsY = 620;
    for (const [x, label] of [[180, "FIGHT"], [350, "ENEMY"], [520, "MARGIN"], [690, "SPOILS"]] as const) {
      this.add.rectangle(x, metricsY, 150, 62, 0x11171d).setStrokeStyle(1, 0x34404a);
      this.add.text(x, metricsY - 18, label, { fontFamily: "monospace", fontSize: "11px", color: "#8f9ba3" }).setOrigin(0.5);
    }
    this.fightText = this.metricText(180, metricsY + 9);
    this.enemyFightText = this.metricText(350, metricsY + 9);
    this.marginText = this.metricText(520, metricsY + 9);
    this.spoilsText = this.metricText(690, metricsY + 9, "#e2bc65");
  }

  private metricText(x: number, y: number, color = "#eee6d5"): Phaser.GameObjects.Text {
    return this.add.text(x, y, "—", { fontFamily: "monospace", fontSize: "24px", color }).setOrigin(0.5);
  }

  private createControls(): void {
    this.makeButton(865, 620, 105, 46, "BUMP −", () => this.applyBump(-1));
    this.makeButton(985, 620, 105, 46, "BUMP +", () => this.applyBump(1));
    this.bumpText = this.add.text(925, 660, "", { fontFamily: "monospace", fontSize: "11px", color: "#8f9ba3" }).setOrigin(0.5);

    this.commitButton = this.makeButton(1140, 620, 190, 54, "COMMIT TWO", () => this.commitSelection(), 0x48212b, 0xd94360);
    this.restartButton = this.makeButton(1140, 680, 190, 42, "NEW SEED", () => this.startEncounter(true), 0x18242a, 0x3cc4bd);
    this.restartButton.setVisible(false);
  }

  private makeButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    handler: () => void,
    fill = 0x232b31,
    stroke = 0x58656e,
  ): Phaser.GameObjects.Container {
    const bg = this.add.rectangle(0, 0, width, height, fill).setStrokeStyle(1, stroke).setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, { fontFamily: "monospace", fontSize: "13px", color: "#eee6d5" }).setOrigin(0.5);
    const container = this.add.container(x, y, [bg, text]);
    bg.on("pointerdown", handler);
    bg.on("pointerover", () => container.setScale(1.03));
    bg.on("pointerout", () => container.setScale(1));
    return container;
  }

  private startEncounter(newSeed = false): void {
    if (newSeed) this.seed += 1;
    this.rng = new RngService(this.seed);
    this.state = createCombat(20, this.enemy);
    this.effectState = createEffectState();
    this.bumpUsesLeft = 1;
    this.selected = [];
    this.restartButton.setVisible(false);
    this.statusText.setText(`SEED ${this.seed} • Enemy casts first.`);
    this.beginRound();
  }

  private beginRound(): void {
    const started = startRound(
      this.state,
      this.enemy,
      this.rng.stream("combat:enemy"),
      this.rng.stream("combat:player"),
    );
    this.state = started.state;
    this.selected = [];
    this.statusText.setText(`Latchling locks ${this.state.enemyLocked.join(" + ")}. Choose exactly two Fight Dice.`);
    this.renderAll();
  }

  private renderAll(): void {
    this.renderHp();
    this.renderDice();
    this.updatePreview();
    this.roundText.setText(`ROUND ${this.state.round}  •  FIELD ADJUSTMENT ${this.bumpUsesLeft > 0 ? "READY" : "SPENT"}`);
    this.bumpText.setText(`Field Adjustment: ${this.bumpUsesLeft}/1`);
    this.commitButton.setAlpha(this.selected.length === 2 ? 1 : 0.45);
  }

  private renderHp(): void {
    this.playerHpFill.displayWidth = 296 * (this.state.player.hp / this.state.player.maxHp);
    this.enemyHpFill.displayWidth = 296 * (this.state.enemy.hp / this.state.enemy.maxHp);
    this.playerHpText.setText(`${this.state.player.hp} / ${this.state.player.maxHp} HP`);
    this.enemyHpText.setText(`${this.state.enemy.hp} / ${this.state.enemy.maxHp} HP`);
  }

  private renderDice(): void {
    for (const view of [...this.playerDiceViews, ...this.enemyDiceViews]) {
      view.base.destroy();
      view.overlay?.destroy();
    }
    this.playerDiceViews = [];
    this.enemyDiceViews = [];

    const playerStartX = 420;
    this.state.playerRoll.forEach((die, index) => {
      const x = playerStartX + index * 125;
      const base = this.add.sprite(x, 410, "dice-v1", PLAYER_DIE_FRAMES[die.value - 1]).setScale(DIE_SCALE).setInteractive({ useHandCursor: true });
      const isSelected = this.selected.includes(die.id);
      const overlayFrame = isSelected ? OVERLAY_FIGHT : this.selected.length === 2 ? OVERLAY_SPOILS : null;
      const overlay = overlayFrame === null ? null : this.add.sprite(x, 410, "dice-v1", overlayFrame).setScale(DIE_SCALE);
      base.on("pointerdown", () => this.toggleDie(die.id));
      this.playerDiceViews.push({ base, overlay });
    });

    const enemyStartX = 945;
    this.state.enemyLocked.forEach((value, index) => {
      const x = enemyStartX + index * 115;
      const base = this.add.sprite(x, 250, "dice-v1", ENEMY_DIE_FRAMES[value - 1]).setScale(DIE_SCALE);
      const overlay = this.add.sprite(x, 250, "dice-v1", OVERLAY_LOCKED).setScale(DIE_SCALE);
      this.enemyDiceViews.push({ base, overlay });
    });
  }

  private toggleDie(id: DieId): void {
    if (this.state.phase === "ENCOUNTER_VICTORY" || this.state.phase === "ENCOUNTER_DEFEAT") return;
    const existing = this.selected.indexOf(id);
    if (existing >= 0) this.selected.splice(existing, 1);
    else if (this.selected.length < 2) this.selected.push(id);
    this.renderAll();
  }

  private selectedTuple(): readonly [DieId, DieId] | null {
    if (this.selected.length !== 2) return null;
    return [this.selected[0]!, this.selected[1]!];
  }

  private updatePreview(): void {
    const ids = this.selectedTuple();
    const enemyTotal = this.state.enemyLocked.reduce((sum, value) => sum + value, 0);
    this.enemyFightText.setText(String(enemyTotal));
    if (!ids) {
      this.fightText.setText("—");
      this.marginText.setText("—").setColor("#eee6d5");
      this.spoilsText.setText("—");
      return;
    }

    const preview = previewCommitWithEffects(this.state, ids, this.effects, this.effectState);
    this.fightText.setText(String(preview.finalFight));
    this.marginText.setText(preview.margin > 0 ? `+${preview.margin}` : String(preview.margin));
    this.marginText.setColor(preview.margin > 0 ? "#78d9c8" : preview.margin < 0 ? "#f47c92" : "#eee6d5");
    this.spoilsText.setText(String(preview.finalSpoilsScore));
  }

  private applyBump(delta: -1 | 1): void {
    if (this.bumpUsesLeft <= 0 || this.selected.length === 0) return;
    const id = this.selected[this.selected.length - 1]!;
    const die = this.state.playerRoll.find((candidate) => candidate.id === id);
    if (!die || die.fixed || die.locked) return;
    const value = bump(die.value, delta);
    if (value === die.value) return;
    this.state = updatePlayerDie(this.state, withValue(die, value));
    this.bumpUsesLeft -= 1;
    this.statusText.setText(`Field Adjustment: ${die.value} → ${value}.`);
    this.renderAll();
  }

  private commitSelection(): void {
    const ids = this.selectedTuple();
    if (!ids) return;

    const result = commitWithEffects(this.state, ids, this.effects, this.effectState);
    this.state = result.state;
    this.effectState = result.effectState;
    this.selected = [];

    if (result.preview.margin > 0) {
      this.statusText.setText(`WIN +${result.preview.margin} • ${result.preview.damageToEnemy} damage • Spoils ${result.preview.finalSpoilsScore}.`);
    } else if (result.preview.margin < 0) {
      this.statusText.setText(`LOSS ${result.preview.margin} • ${result.preview.damageToPlayer} damage taken.`);
    } else {
      this.statusText.setText("TIE • No baseline damage. No Spoils.");
    }

    this.renderAll();

    if (this.state.phase === "ENCOUNTER_VICTORY") {
      this.statusText.setText(`THRESHOLD CLEARED • Final-Blow Spoils ${result.preview.finalSpoilsScore}.`);
      this.restartButton.setVisible(true);
      return;
    }
    if (this.state.phase === "ENCOUNTER_DEFEAT") {
      this.statusText.setText("THE BELOW KEEPS THE RECORD.");
      this.restartButton.setVisible(true);
      return;
    }

    this.time.delayedCall(700, () => this.beginRound());
  }
}
