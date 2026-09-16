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
  floor1BossDraftItemIds,
  floor1EffectRegistry,
  floor1Elites,
  floor1Events,
  floor1ItemRegistry,
  floor1NormalEnemies,
  generateBossDraft,
  generateLootDraft,
  generateShopStock,
  grantXp,
  heal,
  planTakeItem,
  resolveEventChoice,
  resolveTechniqueChoice,
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

export interface PendingEventOffer { readonly itemId:string; readonly forced:boolean; }
export type TechniqueId="steady-hand"|"long-odds"|"clean-exit"|"overrule";
export type LootKind="NORMAL"|"BOSS";

class ClientRunSession {
  private seed=831_991;
  private rng=new RngService(this.seed);
  private run=createRunState(this.seed,[thresholdsFloor],{startingGear:{ARMOR:"work-apron"}});
  private shopSold=new Set<string>();
  private preparedEncounters=new Map<string,EnemyDefinition>();
  private revealNextRequested=false;

  currentEnemy:EnemyDefinition|null=null;
  currentEvent:EventDefinition|null=null;
  currentShop:ShopStock|null=null;
  pendingLoot:LootDraft|null=null;
  pendingLootKind:LootKind|null=null;
  pendingEventOffers:PendingEventOffer[]=[];
  techniques:TechniqueId[]=[];

  get state():RunState{return this.run;}
  get currentSeed():number{return this.seed;}
  get availableNodes():readonly FloorNode[]{return availableRunNodes(this.run);}
  get pendingTechniqueLevel():number|null{return this.run.progression.pendingTechniqueLevels[0]??null;}
  get lootCanSkip():boolean{return this.pendingLootKind!=="BOSS";}
  get technique():TechniqueId|null{return this.techniques[0]??null;}

  stream(name:string):RngStream{return this.rng.stream(name);}
  hasTechnique(id:TechniqueId):boolean{return this.techniques.includes(id);}
  shopItemSold(itemId:string):boolean{return this.shopSold.has(itemId);}
  revealedEncounter(nodeId:string):EnemyDefinition|null{return this.preparedEncounters.get(nodeId)??null;}

  reset(newSeed=this.seed+1):void {
    this.seed=newSeed;this.rng=new RngService(this.seed);this.run=createRunState(this.seed,[thresholdsFloor],{startingGear:{ARMOR:"work-apron"}});
    this.currentEnemy=null;this.currentEvent=null;this.currentShop=null;this.pendingLoot=null;this.pendingLootKind=null;this.pendingEventOffers=[];this.techniques=[];this.shopSold.clear();this.preparedEncounters.clear();this.revealNextRequested=false;
  }

  enterNode(nodeId:string):FloorNode {
    this.run=enterRunNode(this.run,nodeId);
    const node=this.run.floors[this.run.floorIndex]!.nodes.find((candidate)=>candidate.id===nodeId);if(!node)throw new Error(`Entered unknown node ${nodeId}`);
    this.currentEnemy=null;this.currentEvent=null;this.currentShop=null;this.pendingLoot=null;this.pendingLootKind=null;this.pendingEventOffers=[];
    if(node.type==="COMBAT"||node.type==="ELITE"){
      const prepared=this.preparedEncounters.get(node.id),pool=node.type==="ELITE"?floor1Elites:floor1NormalEnemies;
      const enemy=prepared??selectEncounter(pool,this.run.encounterHistory,this.rng.stream("encounter:floor:0"));this.currentEnemy=enemy;this.run=withEncounterHistory(this.run,enemy.id,enemy.instinct);this.preparedEncounters.delete(node.id);
    }else if(node.type==="BOSS")this.currentEnemy=bossPhaseAsEnemy(firstDoor,firstDoor.maxHp);
    else if(node.type==="EVENT"){const event=selectEvent(floor1Events,this.run.eventHistory,this.rng.stream("event:select"));this.currentEvent=event;this.run=withEventHistory(this.run,event.id);}
    else if(node.type==="SHOP"){this.currentShop=generateShopStock(floor1ItemRegistry,this.run.inventory,this.rng.stream("shop:floor:0"));this.shopSold.clear();}
    return node;
  }

  enemyForHp(hp:number):EnemyDefinition {if(!this.currentEnemy)throw new Error("No current enemy");return this.run.phase==="BOSS"?bossPhaseAsEnemy(firstDoor,hp):this.currentEnemy;}
  combatEffects(enemy:EnemyDefinition):readonly EffectDefinition[] {
    const sourceIds=new Set([...Object.values(this.run.inventory.gear).filter((id):id is string=>id!==null),...this.run.inventory.artifacts].flatMap((id)=>floor1ItemRegistry[id]?.effectSourceIds??[]));
    if(this.hasTechnique("long-odds"))sourceIds.add("technique:long-odds");const effects=Object.values(floor1EffectRegistry).filter((effect)=>sourceIds.has(effect.sourceId));for(const ruleId of enemy.ruleIds??[]){const effect=floor1EffectRegistry[ruleId];if(effect)effects.push(effect);}return effects;
  }

  finishCombatVictory(playerHp:number,finalSpoils:number|null):"LOOT"|"MAP"|"VICTORY" {
    if(!this.currentEnemy)throw new Error("Cannot finish combat without an enemy");let progression={...this.run.progression,hp:playerHp};const economy=addCoins(this.run.economy,this.currentEnemy.coins);progression=grantXp(progression,this.currentEnemy.xp).state;this.run=withRunResources(this.run,{progression,economy});
    if(this.run.phase==="BOSS"){this.run=withRunResources(this.run,{progression:heal(this.run.progression,firstDoor.clearHeal)});this.pendingLoot=generateBossDraft(floor1BossDraftItemIds,floor1ItemRegistry,this.run.inventory,this.rng.stream("boss:reward"));this.pendingLootKind="BOSS";return "LOOT";}
    const score=finalSpoils??2;this.pendingLoot=generateLootDraft(score,floor1ItemRegistry,this.run.inventory,this.rng.stream("loot:floor:0"),this.currentEnemy.rewardBandUplift??0);this.pendingLootKind="NORMAL";return "LOOT";
  }
  finishCombatDefeat(playerHp:number):void {this.run=withRunResources(this.run,{progression:{...this.run.progression,hp:playerHp}});this.run=defeatRun(this.run);}
  planLootItem(itemId:string):InventoryTakePlan {const item=floor1ItemRegistry[itemId];if(!item)throw new Error(`Unknown item ${itemId}`);return planTakeItem(this.run.inventory,item);}
  takeLootOffer(offer:LootOffer,replacementItemId?:string):void {if(offer.type==="COINS")this.run=withRunResources(this.run,{economy:addCoins(this.run.economy,offer.amount)});else this.takeItem(offer.itemId,replacementItemId);this.pendingLoot=null;this.pendingLootKind=null;this.run=completeRunNode(this.run);}
  skipLoot():void {if(!this.lootCanSkip)throw new Error("Boss Draft cannot be skipped");this.run=withRunResources(this.run,{economy:addCoins(this.run.economy,2)});this.pendingLoot=null;this.pendingLootKind=null;this.run=completeRunNode(this.run);}
  chooseTechnique(id:TechniqueId):void {const level=this.pendingTechniqueLevel;if(level===null)throw new Error("No pending Technique choice");const allowed=level===3?["steady-hand","long-odds"]:level===5?["clean-exit","overrule"]:[];if(!allowed.includes(id))throw new Error(`${id} is not available at Level ${level}`);this.techniques.push(id);this.run=withRunResources(this.run,{progression:resolveTechniqueChoice(this.run.progression,level)});}

  private takeItem(itemId:string,replacementItemId?:string):void {const item=floor1ItemRegistry[itemId];if(!item)throw new Error(`Unknown item ${itemId}`);const result=applyTakeItem(this.run.inventory,item,floor1ItemRegistry,replacementItemId);const economy=result.salvageCoins>0?addCoins(this.run.economy,result.salvageCoins):this.run.economy;this.run=withRunResources(this.run,{inventory:result.inventory,economy});}
  buyShopItem(offer:ShopItemOffer,replacementItemId?:string):void {if(this.shopSold.has(offer.itemId))throw new Error(`${offer.itemId} is already sold`);if(this.run.economy.coins<offer.price)throw new Error("Insufficient Coins");this.run=withRunResources(this.run,{economy:spendCoins(this.run.economy,offer.price)});this.takeItem(offer.itemId,replacementItemId);this.shopSold.add(offer.itemId);}
  buyShopHealing():void {const result=buyHealing(this.run.economy,this.run.progression);this.run=withRunResources(this.run,result);}
  leaveShop():void {this.currentShop=null;this.shopSold.clear();this.run=completeRunNode(this.run);}

  resolveEvent(choiceId:string,selectedItemId?:string):readonly PendingEventOffer[] {if(!this.currentEvent)throw new Error("No current Event");const resolved=resolveEventChoice(this.currentEvent,choiceId,{progression:this.run.progression,economy:this.run.economy,inventory:this.run.inventory},floor1ItemRegistry,this.rng.stream("event:outcome"),selectedItemId?{itemId:selectedItemId}:{});this.run=withRunResources(this.run,resolved.state);this.pendingEventOffers=[...resolved.itemOffers];this.revealNextRequested=this.revealNextRequested||resolved.revealNextEncounter;if(this.run.progression.hp<=0){this.run=defeatRun(this.run);return [];}return this.pendingEventOffers;}
  takeEventOffer(itemId:string,replacementItemId?:string):void {this.takeItem(itemId,replacementItemId);this.pendingEventOffers=this.pendingEventOffers.filter((offer)=>offer.itemId!==itemId);}
  finishEvent():void {this.currentEvent=null;this.pendingEventOffers=[];this.run=completeRunNode(this.run);if(this.revealNextRequested){this.prepareReachableEncounters();this.revealNextRequested=false;}}
  private prepareReachableEncounters():void {this.preparedEncounters.clear();for(const node of availableRunNodes(this.run)){if(node.type!=="COMBAT"&&node.type!=="ELITE")continue;const pool=node.type==="ELITE"?floor1Elites:floor1NormalEnemies;const enemy=selectEncounter(pool,this.run.encounterHistory,this.rng.stream(`encounter:revealed:${node.id}`));this.preparedEncounters.set(node.id,enemy);}}
}

export const clientRun=new ClientRunSession();
