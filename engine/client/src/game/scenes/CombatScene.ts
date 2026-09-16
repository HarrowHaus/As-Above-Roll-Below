import { Scene } from "phaser";
import {
  applyCombatItemAction,
  applyPlayerCastConstraints,
  ashLedgerCoinAward,
  brassCaliperOptions,
  bump,
  commitWithEffects,
  createCombatFromPlayerState,
  createEffectState,
  createManipulationReactionState,
  floor1CastConstraintRegistry,
  floor1ItemActionRegistry,
  floor1ItemRegistry,
  floor1ManipulationReactionRegistry,
  injectCarriedDie,
  ownedItemIds,
  previewCommitWithEffects,
  reactToPlayerManipulation,
  startRound,
  updatePlayerDie,
  withFixed,
  withValue,
  type CombatState,
  type DieId,
  type DieValue,
  type EffectDefinition,
  type EffectState,
  type EnemyDefinition,
  type ManipulationReactionState,
} from "../../../../core/dist/index.js";
import { clientRun } from "../session.js";

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

const pretty = (id: string) => id
  .split(":")
  .at(-1)!
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

export class CombatScene extends Scene {
  private enemy!: EnemyDefinition;
  private state!: CombatState;
  private effectState!: EffectState;
  private reactionState!: ManipulationReactionState;
  private roundEffects: EffectDefinition[] = [];
  private selected: DieId[] = [];
  private bumpUsesLeft = 1;
  private finalSpoils: number | null = null;

  private playerDiceViews: DieView[] = [];
  private enemyDiceViews: DieView[] = [];
  private toolObjects: Phaser.GameObjects.GameObject[] = [];
  private carryPromptObjects: Phaser.GameObjects.GameObject[] = [];
  private activeUses = new Set<string>();

  private suppressEnemyRules = false;
  private manipulationCount = 0;
  private ashLedgerTriggered = false;
  private caliperUsed = false;
  private carriedDie: DieValue | null = null;
  private awaitingCarryChoice = false;

  private playerHpFill!: Phaser.GameObjects.Rectangle;
  private enemyHpFill!: Phaser.GameObjects.Rectangle;
  private playerHpText!: Phaser.GameObjects.Text;
  private enemyHpText!: Phaser.GameObjects.Text;
  private enemyNameText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private fightText!: Phaser.GameObjects.Text;
  private enemyFightText!: Phaser.GameObjects.Text;
  private marginText!: Phaser.GameObjects.Text;
  private spoilsText!: Phaser.GameObjects.Text;
  private bumpText!: Phaser.GameObjects.Text;
  private commitButton!: Phaser.GameObjects.Container;

  constructor() { super("CombatScene"); }

  preload(): void {
    if (!this.textures.exists("dice-v1")) {
      this.load.spritesheet("dice-v1", diceAtlasUrl, { frameWidth: 48, frameHeight: 48 });
    }
  }

  create(): void {
    if (!clientRun.currentEnemy) { this.scene.start("MapScene"); return; }
    this.enemy = clientRun.currentEnemy;
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
    this.add.rectangle(640, 265, 360, 24, 0x30363a);
    this.add.rectangle(470, 340, 24, 175, 0x30363a);
    this.add.rectangle(810, 340, 24, 175, 0x30363a);
    this.add.rectangle(640, 350, 300, 230, 0x101416).setStrokeStyle(3, 0x566168);
    this.add.rectangle(640, 350, 180, 180, 0x351820, 0.3);

    // Temporary silhouettes until the production sprite pack is committed.
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

    this.add.text(48, 30, "AS ABOVE, ROLL BELOW", { fontFamily: "Georgia, serif", fontSize: "38px", color: "#eee6d5" });
    this.add.text(51, 76, "E7 CLIENT • AUTHORITATIVE CORE COMBAT", { fontFamily: "monospace", fontSize: "13px", color: "#8f9ba3", letterSpacing: 2 });
    this.add.text(195, 505, "THE DELVER", { fontFamily: "Georgia, serif", fontSize: "20px", color: "#eee6d5" });
    this.enemyNameText = this.add.text(956, 505, "", { fontFamily: "Georgia, serif", fontSize: "20px", color: "#eee6d5" });
  }

  private createHud(): void {
    this.add.rectangle(220, 545, 300, 16, 0x090b0e).setStrokeStyle(2, 0x574448);
    this.playerHpFill = this.add.rectangle(72, 545, 296, 12, 0xd94360).setOrigin(0, 0.5);
    this.playerHpText = this.add.text(220, 566, "", { fontFamily: "monospace", fontSize: "13px", color: "#bfc7ca" }).setOrigin(0.5);
    this.add.rectangle(1060, 545, 300, 16, 0x090b0e).setStrokeStyle(2, 0x574448);
    this.enemyHpFill = this.add.rectangle(912, 545, 296, 12, 0xd94360).setOrigin(0, 0.5);
    this.enemyHpText = this.add.text(1060, 566, "", { fontFamily: "monospace", fontSize: "13px", color: "#bfc7ca" }).setOrigin(0.5);
    this.roundText = this.add.text(640, 105, "", { fontFamily: "monospace", fontSize: "15px", color: "#9ba7ad" }).setOrigin(0.5);
    this.statusText = this.add.text(640, 485, "", { fontFamily: "monospace", fontSize: "15px", color: "#d3d8da", align: "center", wordWrap: { width: 610 } }).setOrigin(0.5);

    const y = 620;
    for (const [x, label] of [[180, "FIGHT"], [350, "ENEMY"], [520, "MARGIN"], [690, "SPOILS"]] as const) {
      this.add.rectangle(x, y, 150, 62, 0x11171d).setStrokeStyle(1, 0x34404a);
      this.add.text(x, y - 18, label, { fontFamily: "monospace", fontSize: "11px", color: "#8f9ba3" }).setOrigin(0.5);
    }
    this.fightText = this.metricText(180, y + 9);
    this.enemyFightText = this.metricText(350, y + 9);
    this.marginText = this.metricText(520, y + 9);
    this.spoilsText = this.metricText(690, y + 9, "#e2bc65");
  }

  private metricText(x: number, y: number, color = "#eee6d5"): Phaser.GameObjects.Text {
    return this.add.text(x, y, "—", { fontFamily: "monospace", fontSize: "24px", color }).setOrigin(0.5);
  }

  private createControls(): void {
    this.makeButton(865, 620, 105, 46, "BUMP −", () => this.applyBump(-1));
    this.makeButton(985, 620, 105, 46, "BUMP +", () => this.applyBump(1));
    this.bumpText = this.add.text(925, 660, "", { fontFamily: "monospace", fontSize: "11px", color: "#8f9ba3" }).setOrigin(0.5);
    this.commitButton = this.makeButton(1140, 620, 190, 54, "COMMIT TWO", () => this.commitSelection(), 0x48212b, 0xd94360);
  }

  private makeButton(x: number, y: number, width: number, height: number, label: string, handler: () => void, fill = 0x232b31, stroke = 0x58656e): Phaser.GameObjects.Container {
    const bg = this.add.rectangle(0, 0, width, height, fill).setStrokeStyle(1, stroke).setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, { fontFamily: "monospace", fontSize: "11px", color: "#eee6d5", align: "center" }).setOrigin(0.5);
    const container = this.add.container(x, y, [bg, text]);
    bg.on("pointerdown", handler);
    bg.on("pointerover", () => container.setScale(1.03));
    bg.on("pointerout", () => container.setScale(1));
    return container;
  }

  private startEncounter(): void {
    this.enemy = clientRun.enemyForHp(clientRun.currentEnemy!.maxHp);
    this.state = createCombatFromPlayerState({ hp: clientRun.state.progression.hp, maxHp: clientRun.state.progression.maxHp }, this.enemy);
    this.effectState = createEffectState();
    this.bumpUsesLeft = clientRun.hasTechnique("steady-hand") ? 2 : 1;
    this.finalSpoils = null;
    this.selected = [];
    this.activeUses.clear();
    this.ashLedgerTriggered = false;
    this.caliperUsed = false;
    this.carriedDie = null;
    this.awaitingCarryChoice = false;
    this.clearCarryPrompt();
    this.statusText.setText(`SEED ${clientRun.currentSeed} • Enemy casts first.`);
    this.beginRound();
  }

  private beginRound(): void {
    this.enemy = clientRun.enemyForHp(this.state.enemy.hp);
    let started = startRound(this.state, this.enemy, clientRun.stream("combat:enemy"), clientRun.stream("combat:player")).state;
    let carriedMessage = "";
    if (this.carriedDie !== null) {
      const value = this.carriedDie;
      started = injectCarriedDie(started, value);
      this.carriedDie = null;
      carriedMessage = ` Stuck Key carries ${value} into this cast.`;
    }

    this.suppressEnemyRules = false;
    this.manipulationCount = 0;
    const constraints = (this.enemy.ruleIds ?? []).map((id) => floor1CastConstraintRegistry[id]).filter((value) => value !== undefined);
    if (constraints.length) started = applyPlayerCastConstraints(started, constraints).state;
    this.state = started;
    this.reactionState = createManipulationReactionState(this.state.round);
    this.roundEffects = [...clientRun.combatEffects(this.enemy, true)];
    this.selected = [];
    this.statusText.setText(`${pretty(this.enemy.id)} locks ${this.state.enemyLocked.join(" + ")}. Choose exactly two Fight Dice.${carriedMessage}`);
    this.renderAll();
  }

  private renderAll(): void {
    this.enemyNameText.setText(pretty(this.enemy.id).toUpperCase());
    this.renderHp();
    this.renderDice();
    this.renderTools();
    this.updatePreview();
    this.roundText.setText(`ROUND ${this.state.round} • ${this.enemy.instinct} • FIELD ADJUSTMENT ${this.bumpUsesLeft > 0 ? "READY" : "SPENT"}`);
    this.bumpText.setText(`Field Adjustment: ${this.bumpUsesLeft}`);
    this.commitButton.setAlpha(this.selected.length === 2 && !this.awaitingCarryChoice ? 1 : 0.45);
  }

  private renderHp(): void {
    this.playerHpFill.displayWidth = 296 * (this.state.player.hp / this.state.player.maxHp);
    this.enemyHpFill.displayWidth = 296 * (this.state.enemy.hp / this.state.enemy.maxHp);
    this.playerHpText.setText(`${this.state.player.hp} / ${this.state.player.maxHp} HP`);
    this.enemyHpText.setText(`${this.state.enemy.hp} / ${this.state.enemy.maxHp} HP`);
  }

  private renderDice(): void {
    for (const view of [...this.playerDiceViews, ...this.enemyDiceViews]) { view.base.destroy(); view.overlay?.destroy(); }
    this.playerDiceViews = [];
    this.enemyDiceViews = [];

    this.state.playerRoll.forEach((die, index) => {
      const x = 420 + index * 125;
      const base = this.add.sprite(x, 410, "dice-v1", PLAYER_DIE_FRAMES[die.value - 1]).setScale(DIE_SCALE).setInteractive({ useHandCursor: true });
      if (die.fixed) base.setTint(0x9b8585);
      if (die.locked) base.setTint(0x88b6b3);
      const selected = this.selected.includes(die.id);
      const frame = selected ? OVERLAY_FIGHT : this.selected.length === 2 ? OVERLAY_SPOILS : null;
      const overlay = frame === null ? null : this.add.sprite(x, 410, "dice-v1", frame).setScale(DIE_SCALE);
      base.on("pointerdown", () => this.toggleDie(die.id));
      this.playerDiceViews.push({ base, overlay });
    });

    this.state.enemyLocked.forEach((value, index) => {
      const x = 945 + index * 115;
      const base = this.add.sprite(x, 250, "dice-v1", ENEMY_DIE_FRAMES[value - 1]).setScale(DIE_SCALE);
      const overlay = this.add.sprite(x, 250, "dice-v1", OVERLAY_LOCKED).setScale(DIE_SCALE);
      this.enemyDiceViews.push({ base, overlay });
    });
  }

  private renderTools(): void {
    for (const obj of this.toolObjects) obj.destroy();
    this.toolObjects = [];
    const title = this.add.text(42, 125, "TOOLS", { fontFamily: "monospace", fontSize: "11px", color: "#7e8a91", letterSpacing: 2 });
    this.toolObjects.push(title);

    const inventoryIds = ownedItemIds(clientRun.state.inventory);
    const ids = [...new Set(inventoryIds.filter((id) => floor1ItemActionRegistry[id]?.combat))];
    let row = 0;
    for (const id of ids) {
      const def = floor1ItemActionRegistry[id]!;
      const item = floor1ItemRegistry[id]!;
      if (def.outsideCombat && !def.combat) continue;
      const spent = !def.consumeOnUse && this.activeUses.has(id);
      if (id === "blank-face") {
        this.toolObjects.push(
          this.toolButton(42, 150 + row * 31, 92, 26, "BLANK→1", () => this.useTool(id, 1), spent),
          this.toolButton(140, 150 + row * 31, 92, 26, "BLANK→6", () => this.useTool(id, 6), spent),
        );
        row += 1;
        continue;
      }
      const count = clientRun.state.inventory.contraband.filter((value) => value === id).length;
      const suffix = def.consumeOnUse && count > 1 ? ` ×${count}` : spent ? " (SPENT)" : "";
      this.toolObjects.push(this.toolButton(42, 150 + row++ * 31, 190, 26, `${item.displayName}${suffix}`, () => this.useTool(id), spent));
    }

    const ownsCaliper = inventoryIds.includes("brass-caliper");
    if (ownsCaliper) {
      if (this.caliperUsed) {
        this.toolObjects.push(this.toolButton(42, 150 + row++ * 31, 190, 26, "Brass Caliper (SPENT)", () => {}, true));
      } else if (this.selected.length === 2) {
        const spoils = this.currentSpoilsDice();
        if (spoils) {
          const labels = [
            [`${spoils[0].value}−`, () => this.applyCaliper(0, -1)],
            [`${spoils[0].value}+`, () => this.applyCaliper(0, 1)],
            [`${spoils[1].value}−`, () => this.applyCaliper(1, -1)],
            [`${spoils[1].value}+`, () => this.applyCaliper(1, 1)],
          ] as const;
          labels.forEach(([label, fn], index) => this.toolObjects.push(this.toolButton(42 + index * 48, 150 + row * 31, 44, 26, label, fn)));
          row += 1;
        }
      } else {
        this.toolObjects.push(this.toolButton(42, 150 + row++ * 31, 190, 26, "Caliper • choose Fight 2", () => {}, true));
      }
    }

    if (ids.length === 0 && !ownsCaliper) {
      const none = this.add.text(42, 150, "No active tools.", { fontFamily: "monospace", fontSize: "10px", color: "#566169" });
      this.toolObjects.push(none);
    }
    if (this.selected.length === 2) {
      const hint = this.add.text(42, 455, "COPY uses first selected → second selected. Caliper targets uncommitted Spoils.", { fontFamily: "monospace", fontSize: "9px", color: "#68747b", wordWrap: { width: 200 } });
      this.toolObjects.push(hint);
    }
  }

  private toolButton(x: number, y: number, width: number, height: number, label: string, fn: () => void, disabled = false): Phaser.GameObjects.Container {
    const bg = this.add.rectangle(0, 0, width, height, 0x172027).setStrokeStyle(1, disabled ? 0x333b40 : 0x516069);
    const text = this.add.text(0, 0, label, { fontFamily: "monospace", fontSize: "9px", color: disabled ? "#606970" : "#d8d2c7" }).setOrigin(0.5);
    const container = this.add.container(x + width / 2, y, [bg, text]);
    if (!disabled) { bg.setInteractive({ useHandCursor: true }); bg.on("pointerdown", fn); }
    return container;
  }

  private toggleDie(id: DieId): void {
    if (this.awaitingCarryChoice) return;
    const existing = this.selected.indexOf(id);
    if (existing >= 0) this.selected.splice(existing, 1);
    else if (this.selected.length < 2) this.selected.push(id);
    this.renderAll();
  }

  private selectedTuple(): readonly [DieId, DieId] | null {
    return this.selected.length === 2 ? [this.selected[0]!, this.selected[1]!] : null;
  }

  private currentSpoilsDice(): readonly [CombatState["playerRoll"][number], CombatState["playerRoll"][number]] | null {
    const fight = new Set(this.selected);
    const spoils = this.state.playerRoll.filter((die) => !fight.has(die.id));
    return spoils.length === 2 ? [spoils[0]!, spoils[1]!] : null;
  }

  private updatePreview(): void {
    const ids = this.selectedTuple();
    this.enemyFightText.setText(String(this.state.enemyLocked.reduce((sum, value) => sum + value, 0)));
    if (!ids) {
      this.fightText.setText("—");
      this.marginText.setText("—").setColor("#eee6d5");
      this.spoilsText.setText("—");
      return;
    }
    const preview = previewCommitWithEffects(this.state, ids, this.roundEffects, this.effectState);
    this.fightText.setText(String(preview.finalFight));
    this.marginText.setText(preview.margin > 0 ? `+${preview.margin}` : String(preview.margin));
    this.marginText.setColor(preview.margin > 0 ? "#78d9c8" : preview.margin < 0 ? "#f47c92" : "#eee6d5");
    this.spoilsText.setText(String(preview.finalSpoilsScore));
  }

  private reactionDefinitions() {
    return this.suppressEnemyRules ? [] : (this.enemy.ruleIds ?? []).map((ruleId) => floor1ManipulationReactionRegistry[ruleId]).filter((entry) => entry !== undefined);
  }

  private resolveManipulation(next: CombatState): CombatState {
    const reaction = reactToPlayerManipulation(next, this.reactionDefinitions(), this.reactionState, true);
    this.reactionState = reaction.reactionState;
    this.roundEffects.push(...reaction.addedEffects);
    this.manipulationCount += 1;
    return reaction.combatState;
  }

  private applyBump(delta: -1 | 1): void {
    if (this.awaitingCarryChoice || this.bumpUsesLeft <= 0 || this.selected.length === 0) return;
    const id = this.selected[this.selected.length - 1]!;
    const die = this.state.playerRoll.find((candidate) => candidate.id === id);
    if (!die || die.fixed || die.locked) return;
    const value = bump(die.value, delta);
    if (value === die.value) return;
    this.state = this.resolveManipulation(updatePlayerDie(this.state, withValue(die, value)));
    this.bumpUsesLeft -= 1;
    this.statusText.setText(`Field Adjustment: ${die.value} → ${value}.`);
    this.renderAll();
  }

  private applyCaliper(index: 0 | 1, delta: -1 | 1): void {
    if (this.awaitingCarryChoice || this.caliperUsed || !ownedItemIds(clientRun.state.inventory).includes("brass-caliper")) return;
    const spoils = this.currentSpoilsDice();
    if (!spoils) { this.statusText.setText("Choose exactly two Fight Dice before using Brass Caliper."); return; }
    const target = spoils[index];
    if (target.fixed || target.locked) { this.statusText.setText("That Spoils die cannot be adjusted."); return; }
    const value = bump(target.value, delta);
    if (value === target.value) { this.statusText.setText("Brass Caliper cannot move a face beyond the d6 boundary."); return; }

    const pair: readonly [DieValue, DieValue] = [spoils[0].value, spoils[1].value];
    const desired: readonly [DieValue, DieValue] = index === 0 ? [value, pair[1]] : [pair[0], value];
    const legal = brassCaliperOptions(pair).some((option) => option[0] === desired[0] && option[1] === desired[1]);
    if (!legal) throw new Error("Brass Caliper generated an illegal Spoils adjustment");

    this.state = this.resolveManipulation(updatePlayerDie(this.state, withValue(target, value)));
    this.caliperUsed = true;
    this.statusText.setText(`Brass Caliper: ${target.value} → ${value}.`);
    this.renderAll();
  }

  private useTool(id: string, chosenValue?: 1 | 6): void {
    if (this.awaitingCarryChoice) return;
    const def = floor1ItemActionRegistry[id];
    const item = floor1ItemRegistry[id];
    if (!def?.combat || !item) return;
    if (!def.consumeOnUse && this.activeUses.has(id)) return;
    const action = def.combat;

    if (action.type === "SUPPRESS_ENEMY_RULES_ROUND") {
      if (this.enemy.id.includes("first-door")) { this.statusText.setText("Boss phase rules cannot be enjoined."); return; }
      if (this.manipulationCount > 0) { this.statusText.setText("Temporary Injunction must be used before manipulating this cast."); return; }
      const result = applyCombatItemAction(this.state, action);
      this.suppressEnemyRules = result.suppressEnemyRules;
      this.state = { ...result.state, playerRoll: result.state.playerRoll.map((die) => withFixed(die, false)) };
      this.roundEffects = [...clientRun.combatEffects(this.enemy, false)];
      if (def.consumeOnUse) clientRun.consumeContrabandItem(id);
      this.statusText.setText(`${item.displayName}: enemy Rule text suppressed this round.`);
      this.renderAll();
      return;
    }

    let result;
    const targetId = this.selected.at(-1);
    const sourceId = this.selected[0];
    try {
      if (action.type === "REROLL_PLAYER_DIE") {
        if (!targetId) throw new Error("Select a target die first");
        result = applyCombatItemAction(this.state, action, { targetDieId: targetId }, clientRun.stream(`item:${id}:r${this.state.round}`));
      } else if (action.type === "SET_PLAYER_DIE" || action.type === "FLIP_PLAYER_DIE") {
        if (!targetId) throw new Error("Select a target die first");
        result = applyCombatItemAction(this.state, action, { targetDieId: targetId });
      } else if (action.type === "TRANSMUTE_PLAYER_DIE") {
        if (!targetId || chosenValue === undefined) throw new Error("Select a target die first");
        result = applyCombatItemAction(this.state, action, { targetDieId: targetId, chosenValue });
      } else if (action.type === "COPY_PLAYER_DIE") {
        if (this.selected.length !== 2) throw new Error("Select SOURCE then TARGET dice");
        result = applyCombatItemAction(this.state, action, { sourceDieId: sourceId, targetDieId: targetId });
      } else if (action.type === "LOWER_HIGHEST_ENEMY_DIE") {
        if ((this.enemy.ruleIds ?? []).includes("rule:first-door:sealed")) throw new Error("SEALED prevents enemy-die interference");
        result = applyCombatItemAction(this.state, action);
      } else return;
    } catch (error) {
      this.statusText.setText(error instanceof Error ? error.message : String(error));
      return;
    }

    this.state = this.resolveManipulation(result.state);
    if (def.consumeOnUse) clientRun.consumeContrabandItem(id); else this.activeUses.add(id);
    this.statusText.setText(`${item.displayName} used.`);
    this.renderAll();
  }

  private commitSelection(): void {
    if (this.awaitingCarryChoice) return;
    const ids = this.selectedTuple();
    if (!ids) return;
    const result = commitWithEffects(this.state, ids, this.roundEffects, this.effectState);
    this.state = result.state;
    this.effectState = result.effectState;
    this.selected = [];

    let playerDamage = 0;
    for (const event of result.events) {
      if (event.type === "damage" && event.target === "player") playerDamage += event.amount;
    }
    const ledger = ashLedgerCoinAward(ownedItemIds(clientRun.state.inventory).includes("ash-ledger"), this.ashLedgerTriggered, playerDamage);
    this.ashLedgerTriggered = ledger.triggered;
    if (ledger.coins) clientRun.grantCoins(ledger.coins);

    const qualified = result.events.find((event) => event.type === "spoils_qualified");
    if (this.state.enemy.hp === 0 && qualified) this.finalSpoils = qualified.score;

    if (result.preview.margin > 0) this.statusText.setText(`WIN +${result.preview.margin} • ${result.preview.damageToEnemy} damage • Spoils ${result.preview.finalSpoilsScore}.`);
    else if (result.preview.margin < 0) this.statusText.setText(`LOSS ${result.preview.margin} • ${result.preview.damageToPlayer} damage taken.`);
    else this.statusText.setText("TIE • authored tie effects resolved by core.");
    this.renderAll();

    if (this.state.phase === "ENCOUNTER_VICTORY") {
      const next = clientRun.finishCombatVictory(this.state.player.hp, this.finalSpoils);
      this.statusText.setText(`ENCOUNTER CLEARED • Final-Blow Spoils ${this.finalSpoils ?? 2}.`);
      this.time.delayedCall(650, () => this.scene.start(next === "LOOT" ? "LootScene" : "MapScene"));
      return;
    }
    if (this.state.phase === "ENCOUNTER_DEFEAT") {
      clientRun.finishCombatDefeat(this.state.player.hp);
      this.statusText.setText("THE BELOW KEEPS THE RECORD.");
      this.time.delayedCall(650, () => this.scene.start("MapScene"));
      return;
    }

    if (qualified && result.preview.margin > 0 && ownedItemIds(clientRun.state.inventory).includes("stuck-key")) {
      this.showStuckKeyChoice(qualified.values);
      return;
    }
    this.time.delayedCall(650, () => this.beginRound());
  }

  private showStuckKeyChoice(values: readonly [DieValue, DieValue]): void {
    this.awaitingCarryChoice = true;
    this.statusText.setText("Stuck Key: carry one successful Spoils die into the next cast, or decline.");
    const shade = this.add.rectangle(640, 360, 1280, 720, 0x050709, 0.72).setDepth(100).setInteractive();
    const panel = this.add.rectangle(640, 340, 560, 250, 0x151b20).setStrokeStyle(2, 0x967449).setDepth(101);
    const title = this.add.text(640, 270, "STUCK KEY", { fontFamily: "Georgia, serif", fontSize: "28px", color: "#eee6d5" }).setOrigin(0.5).setDepth(102);
    const copy = this.add.text(640, 310, "Choose the face that will replace and LOCK the first die of your next cast.", { fontFamily: "monospace", fontSize: "12px", color: "#aeb8bd", align: "center", wordWrap: { width: 470 } }).setOrigin(0.5).setDepth(102);
    this.carryPromptObjects.push(shade, panel, title, copy);

    const unique = [...new Set(values)] as DieValue[];
    unique.forEach((value, index) => {
      const x = 540 + index * 200;
      const button = this.makeButton(x, 385, 160, 48, `CARRY ${value}`, () => this.resolveStuckKeyChoice(value), 0x26312f, 0x659382).setDepth(102);
      this.carryPromptObjects.push(button);
    });
    const decline = this.makeButton(640, 445, 180, 42, "DON'T CARRY", () => this.resolveStuckKeyChoice(null), 0x242a2f, 0x5d6970).setDepth(102);
    this.carryPromptObjects.push(decline);
  }

  private resolveStuckKeyChoice(value: DieValue | null): void {
    this.carriedDie = value;
    this.awaitingCarryChoice = false;
    this.clearCarryPrompt();
    this.statusText.setText(value === null ? "Stuck Key left unused this round." : `Stuck Key holds ${value} for the next cast.`);
    this.time.delayedCall(180, () => this.beginRound());
  }

  private clearCarryPrompt(): void {
    for (const object of this.carryPromptObjects) object.destroy();
    this.carryPromptObjects = [];
  }
}