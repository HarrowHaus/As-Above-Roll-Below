import {
  RngService,
  addCoins,
  applyTakeItem,
  availableRunNodes,
  bossPhaseAsEnemy,
  buyHealing,
  completeRunNode,
  createRunState,
  defeatRun,
  enterRunNode,
  firstDoor,
  floor1EffectRegistry,
  floor1Elites,
  floor1Events,
  floor1ItemRegistry,
  floor1NormalEnemies,
  generateLootDraft,
  generateShopStock,
  grantXp,
  heal,
  planTakeItem,
  resolveEventChoice,
  selectEncounter,
  selectEvent,
  spendCoins,
  thresholdsFloor,
  withEncounterHistory,
  withEventHistory,
  withRunResources,
  type EffectDefinition,
  type EnemyDefinition,
  type EventDefinition,
  type FloorNode,
  type InventoryTakePlan,
  type LootDraft,
  type LootOffer,
  type RngStream,
  type RunState,
  type ShopItemOffer,
  type ShopStock,
} from "../../../core/dist/index.js";

export interface PendingEventOffer {
  readonly itemId: string;
  readonly forced: boolean;
}

class ClientRunSession {
  private seed = 831_991;
  private rng = new RngService(this.seed);
  private run = createRunState(this.seed, [thresholdsFloor], { startingGear: { ARMOR: "work-apron" } });

  currentEnemy: EnemyDefinition | null = null;
  currentEvent: EventDefinition | null = null;
  currentShop: ShopStock | null = null;
  pendingLoot: LootDraft | null = null;
  pendingEventOffers: PendingEventOffer[] = [];
  technique: "steady-hand" | "long-odds" | null = null;

  get state(): RunState { return this.run; }
  get currentSeed(): number { return this.seed; }
  get availableNodes(): readonly FloorNode[] { return availableRunNodes(this.run); }

  stream(name: string): RngStream { return this.rng.stream(name); }

  reset(newSeed = this.seed + 1): void {
    this.seed = newSeed;
    this.rng = new RngService(this.seed);
    this.run = createRunState(this.seed, [thresholdsFloor], { startingGear: { ARMOR: "work-apron" } });
    this.currentEnemy = null;
    this.currentEvent = null;
    this.currentShop = null;
    this.pendingLoot = null;
    this.pendingEventOffers = [];
    this.technique = null;
  }

  enterNode(nodeId: string): FloorNode {
    this.run = enterRunNode(this.run, nodeId);
    const node = this.run.floors[this.run.floorIndex]!.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) throw new Error(`Entered unknown node ${nodeId}`);

    this.currentEnemy = null;
    this.currentEvent = null;
    this.currentShop = null;
    this.pendingLoot = null;
    this.pendingEventOffers = [];

    if (node.type === "COMBAT" || node.type === "ELITE") {
      const pool = node.type === "ELITE" ? floor1Elites : floor1NormalEnemies;
      const enemy = selectEncounter(pool, this.run.encounterHistory, this.rng.stream("encounter:floor:0"));
      this.currentEnemy = enemy;
      this.run = withEncounterHistory(this.run, enemy.id, enemy.instinct);
    } else if (node.type === "BOSS") {
      this.currentEnemy = bossPhaseAsEnemy(firstDoor, firstDoor.maxHp);
    } else if (node.type === "EVENT") {
      const event = selectEvent(floor1Events, this.run.eventHistory, this.rng.stream("event:select"));
      this.currentEvent = event;
      this.run = withEventHistory(this.run, event.id);
    } else if (node.type === "SHOP") {
      this.currentShop = generateShopStock(floor1ItemRegistry, this.run.inventory, this.rng.stream("shop:floor:0"));
    }
    return node;
  }

  enemyForHp(hp: number): EnemyDefinition {
    if (!this.currentEnemy) throw new Error("No current enemy");
    return this.run.phase === "BOSS" ? bossPhaseAsEnemy(firstDoor, hp) : this.currentEnemy;
  }

  combatEffects(enemy: EnemyDefinition): readonly EffectDefinition[] {
    const sourceIds = new Set(
      [
        ...Object.values(this.run.inventory.gear).filter((id): id is string => id !== null),
        ...this.run.inventory.artifacts,
      ].flatMap((id) => floor1ItemRegistry[id]?.effectSourceIds ?? []),
    );
    if (this.technique === "long-odds") sourceIds.add("technique:long-odds");
    const effects = Object.values(floor1EffectRegistry).filter((effect) => sourceIds.has(effect.sourceId));
    for (const ruleId of enemy.ruleIds ?? []) {
      const effect = floor1EffectRegistry[ruleId];
      if (effect) effects.push(effect);
    }
    return effects;
  }

  finishCombatVictory(playerHp: number, finalSpoils: number | null): "LOOT" | "MAP" | "VICTORY" {
    if (!this.currentEnemy) throw new Error("Cannot finish combat without an enemy");
    let progression = { ...this.run.progression, hp: playerHp };
    let economy = addCoins(this.run.economy, this.currentEnemy.coins);
    const xp = grantXp(progression, this.currentEnemy.xp);
    progression = xp.state;
    this.run = withRunResources(this.run, { progression, economy });

    if (this.run.phase === "BOSS") {
      this.run = withRunResources(this.run, { progression: heal(this.run.progression, firstDoor.clearHeal) });
      this.run = completeRunNode(this.run);
      return this.run.phase === "RUN_VICTORY" ? "VICTORY" : "MAP";
    }

    const score = finalSpoils ?? 2;
    this.pendingLoot = generateLootDraft(
      score,
      floor1ItemRegistry,
      this.run.inventory,
      this.rng.stream("loot:floor:0"),
      this.currentEnemy.rewardBandUplift ?? 0,
    );
    return "LOOT";
  }

  finishCombatDefeat(playerHp: number): void {
    this.run = withRunResources(this.run, { progression: { ...this.run.progression, hp: playerHp } });
    this.run = defeatRun(this.run);
  }

  planLootItem(itemId: string): InventoryTakePlan {
    const item = floor1ItemRegistry[itemId];
    if (!item) throw new Error(`Unknown item ${itemId}`);
    return planTakeItem(this.run.inventory, item);
  }

  takeLootOffer(offer: LootOffer, replacementItemId?: string): void {
    if (offer.type === "COINS") {
      this.run = withRunResources(this.run, { economy: addCoins(this.run.economy, offer.amount) });
    } else {
      this.takeItem(offer.itemId, replacementItemId);
    }
    this.pendingLoot = null;
    this.run = completeRunNode(this.run);
  }

  skipLoot(): void {
    this.run = withRunResources(this.run, { economy: addCoins(this.run.economy, 2) });
    this.pendingLoot = null;
    this.run = completeRunNode(this.run);
  }

  private takeItem(itemId: string, replacementItemId?: string): void {
    const item = floor1ItemRegistry[itemId];
    if (!item) throw new Error(`Unknown item ${itemId}`);
    const result = applyTakeItem(this.run.inventory, item, floor1ItemRegistry, replacementItemId);
    const economy = result.salvageCoins > 0 ? addCoins(this.run.economy, result.salvageCoins) : this.run.economy;
    this.run = withRunResources(this.run, { inventory: result.inventory, economy });
  }

  buyShopItem(offer: ShopItemOffer, replacementItemId?: string): void {
    if (this.run.economy.coins < offer.price) throw new Error("Insufficient Coins");
    this.run = withRunResources(this.run, { economy: spendCoins(this.run.economy, offer.price) });
    this.takeItem(offer.itemId, replacementItemId);
  }

  buyShopHealing(): void {
    const result = buyHealing(this.run.economy, this.run.progression);
    this.run = withRunResources(this.run, result);
  }

  leaveShop(): void {
    this.currentShop = null;
    this.run = completeRunNode(this.run);
  }

  resolveEvent(choiceId: string, selectedItemId?: string): readonly PendingEventOffer[] {
    if (!this.currentEvent) throw new Error("No current Event");
    const resolved = resolveEventChoice(
      this.currentEvent,
      choiceId,
      { progression: this.run.progression, economy: this.run.economy, inventory: this.run.inventory },
      floor1ItemRegistry,
      this.rng.stream("event:outcome"),
      selectedItemId ? { itemId: selectedItemId } : {},
    );
    this.run = withRunResources(this.run, resolved.state);
    this.pendingEventOffers = [...resolved.itemOffers];
    if (this.run.progression.hp <= 0) {
      this.run = defeatRun(this.run);
      return [];
    }
    return this.pendingEventOffers;
  }

  takeEventOffer(itemId: string, replacementItemId?: string): void {
    this.takeItem(itemId, replacementItemId);
    this.pendingEventOffers = this.pendingEventOffers.filter((offer) => offer.itemId !== itemId);
  }

  finishEvent(): void {
    this.currentEvent = null;
    this.pendingEventOffers = [];
    this.run = completeRunNode(this.run);
  }
}

export const clientRun = new ClientRunSession();
