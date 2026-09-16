import {
  RngService, generateRun, thresholdsFloor, selectEncounter, selectEvent,
  floor1NormalEnemies, floor1Elites, firstDoor, bossPhaseAsEnemy, bossPhaseAtHp, floor1Events,
  createCombatFromPlayerState, startRound, updatePlayerDie, withFixed, withValue,
  bump, previewCommitWithEffects, commitWithEffects, createEffectState, resolveCombatEffects,
  createManipulationReactionState, reactToPlayerManipulation, floor1ManipulationReactionRegistry,
  floor1EffectRegistry, floor1ItemRegistry, floor1ItemActionRegistry,
  createInventory, ownedItemIds, planTakeItem, applyTakeItem, consumeContraband,
  createProgression, grantXp, resolveTechniqueChoice,
  createEconomy, addCoins, spendCoins, buyHealing,
  generateLootDraft, rewardBand, generateShopStock, resolveEventChoice,
  applyCombatItemAction, applyOutsideCombatItemAction, injectCarriedDie, brassCaliperOptions,
  ashLedgerCoinAward, skippedDraftCoinAward, firstShopPurchasePrice,
} from "../../core/dist/index.js";

const PAIRS=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const ALL_ITEMS=Object.keys(floor1ItemRegistry);
const UTILITY={
  safe:{
    "proof-vest":10,"inside-out-lining":9,"work-apron":8,"mirror-shard":9,"hidden-hand":9,
    "bent-knife":8,"twin-nails":7,"breaching-bar":7,"brass-buckle":6,"red-thread":8,
    "carbon-paper":7,"blank-face":8,"loaded-question":5,"false-bottom":5,"opposite-number":5,
    "brass-caliper":6,"stuck-key":7,"ash-ledger":5,"receipt-from-nowhere":5,"small-change-purse":5,
    "redacted-slip":7,"counterfeit-seal":7,"wire-cutter":8,"carbon-copy":7,"emergency-key":9,"temporary-injunction":8,
  },
  opportunist:{
    "mirror-shard":10,"hidden-hand":9,"carbon-paper":9,"proof-vest":9,"inside-out-lining":8,
    "bent-knife":8,"breaching-bar":8,"loaded-question":8,"opposite-number":8,"false-bottom":7,
    "twin-nails":7,"blank-face":10,"red-thread":8,"brass-buckle":6,"work-apron":7,
    "brass-caliper":8,"stuck-key":8,"ash-ledger":6,"receipt-from-nowhere":6,"small-change-purse":6,
    "redacted-slip":7,"counterfeit-seal":7,"wire-cutter":8,"carbon-copy":8,"emergency-key":8,"temporary-injunction":8,
  },
  greedy:{
    "loaded-question":10,"opposite-number":10,"false-bottom":9,"carbon-paper":9,"blank-face":10,
    "mirror-shard":9,"twin-nails":8,"breaching-bar":8,"hidden-hand":7,"bent-knife":7,
    "red-thread":8,"brass-buckle":7,"inside-out-lining":5,"proof-vest":5,"work-apron":4,
    "brass-caliper":10,"stuck-key":9,"ash-ledger":7,"receipt-from-nowhere":8,"small-change-purse":8,
    "redacted-slip":7,"counterfeit-seal":7,"wire-cutter":7,"carbon-copy":9,"emergency-key":5,"temporary-injunction":7,
  },
};

function utility(policy,id){return UTILITY[policy]?.[id]??4;}
function hpRatio(run){return run.progression.hp/run.progression.maxHp;}
function owned(run,id){return ownedItemIds(run.inventory).includes(id);}
function increment(map,key,amount=1){map[key]=(map[key]??0)+amount;}
function countDamage(events,target){return events.filter(e=>e.type==="damage"&&e.target===target).reduce((s,e)=>s+e.amount,0);}
function itemAction(id){return floor1ItemActionRegistry[id];}

function activeEffects(run,enemy,suppressRules=false){
  const sources=new Set(ownedItemIds(run.inventory).flatMap(id=>floor1ItemRegistry[id]?.effectSourceIds??[]));
  if(run.technique==="long-odds")sources.add("technique:long-odds");
  const out=Object.values(floor1EffectRegistry).filter(effect=>sources.has(effect.sourceId));
  if(!suppressRules)for(const ruleId of enemy.ruleIds??[]){const effect=floor1EffectRegistry[ruleId];if(effect)out.push(effect);}
  return out;
}
function reactionDefs(enemy,suppressRules=false){return suppressRules?[]:(enemy.ruleIds??[]).map(id=>floor1ManipulationReactionRegistry[id]).filter(Boolean);}
function applyFixedRules(state,enemy,suppressRules=false){
  if(suppressRules)return state;
  const rules=new Set(enemy.ruleIds??[]);let target=null;
  if(rules.has("rule:unadmitted:fix-lowest")){const min=Math.min(...state.playerRoll.map(d=>d.value));target=state.playerRoll.findIndex(d=>d.value===min);}
  if(rules.has("rule:threshold-warden:fix-highest")){const max=Math.max(...state.playerRoll.map(d=>d.value));target=state.playerRoll.findIndex(d=>d.value===max);}
  return target===null?state:updatePlayerDie(state,withFixed(state.playerRoll[target],true));
}

function objective(policy,preview,run,enemyHp){
  const m=preview.margin,s=preview.finalSpoilsScore,damage=preview.damageToEnemy;
  if(policy==="safe")return m>0?100000+damage*1000+m*100+s:m===0?50000:m*2200;
  if(policy==="greedy")return m>0?100000+s*260-m*8+damage*2:m===0?50000:m*1000;
  if(hpRatio(run)<0.48)return m>0?100000+damage*1000+m*100+s:m===0?50000:m*2200;
  if(m>0){const killing=damage>=enemyHp;const greedWeight=killing?125:25;const thin=(m===1&&hpRatio(run)<0.7)?180:0;return 100000+damage*100+s*greedWeight+m*12-thin;}
  return m===0?50000:m*1400;
}
function bestPair(state,effects,effectState,run){
  let best=null;
  for(const[a,b]of PAIRS){const ids=[state.playerRoll[a].id,state.playerRoll[b].id];const preview=previewCommitWithEffects(state,ids,effects,effectState);const score=objective(run.policy,preview,run,state.enemy.hp);if(!best||score>best.score)best={ids,preview,score};}
  return best;
}
function react(state,enemy,reactionState,consume,suppressRules){return reactToPlayerManipulation(state,reactionDefs(enemy,suppressRules),reactionState,consume);}

function persistentActionOptions(state,run,uses,enemy){
  const out=[];
  const bumpLimit=run.technique==="steady-hand"?2:1;
  if((uses.bump??0)<bumpLimit){
    for(const die of state.playerRoll){if(die.fixed||die.locked)continue;for(const delta of[-1,1]){const value=bump(die.value,delta);if(value!==die.value)out.push({kind:"field-adjustment",state:updatePlayerDie(state,withValue(die,value)),uses:{...uses,bump:(uses.bump??0)+1}});}}
  }
  for(const id of ownedItemIds(run.inventory)){
    const def=itemAction(id);if(!def?.combat||def.consumeOnUse)continue;
    const used=uses[id]??0;if(def.maxUsesPerEncounter!==undefined&&used>=def.maxUsesPerEncounter)continue;
    const action=def.combat;
    if(action.type==="FLIP_PLAYER_DIE"||action.type==="TRANSMUTE_PLAYER_DIE"){
      for(const die of state.playerRoll){if(die.fixed||die.locked)continue;if(action.type==="FLIP_PLAYER_DIE"){const r=applyCombatItemAction(state,action,{targetDieId:die.id});out.push({kind:id,state:r.state,uses:{...uses,[id]:used+1}});}else for(const value of action.allowed){if(value===die.value)continue;const r=applyCombatItemAction(state,action,{targetDieId:die.id,chosenValue:value});out.push({kind:id,state:r.state,uses:{...uses,[id]:used+1}});}}
    }else if(action.type==="COPY_PLAYER_DIE"){
      for(const target of state.playerRoll){if(target.fixed||target.locked)continue;for(const source of state.playerRoll){if(source.id===target.id)continue;const r=applyCombatItemAction(state,action,{targetDieId:target.id,sourceDieId:source.id});out.push({kind:id,state:r.state,uses:{...uses,[id]:used+1}});}}
    }else if(action.type==="LOWER_HIGHEST_ENEMY_DIE"){
      const sealed=(enemy.ruleIds??[]).includes("rule:first-door:sealed");if(!sealed){const r=applyCombatItemAction(state,action);out.push({kind:id,state:r.state,uses:{...uses,[id]:used+1}});}
    }
  }
  return out;
}

function optimizePersistent(state,run,uses,enemy,effects,effectState,suppressRules){
  let current=state,currentUses=uses,currentEffects=effects,currentBest=bestPair(state,effects,effectState,run);
  let reactionState=createManipulationReactionState(state.round);const actions=[];
  for(let step=0;step<4;step+=1){
    let winner=null;
    for(const option of persistentActionOptions(current,run,currentUses,enemy)){
      const reaction=react(option.state,enemy,reactionState,false,suppressRules);
      const candidateEffects=[...currentEffects,...reaction.addedEffects];
      const candidateBest=bestPair(reaction.combatState,candidateEffects,effectState,run);
      if(candidateBest.score>currentBest.score&&(!winner||candidateBest.score>winner.best.score))winner={option,best:candidateBest};
    }
    if(!winner)break;
    const consumed=react(winner.option.state,enemy,reactionState,true,suppressRules);
    current=consumed.combatState;reactionState=consumed.reactionState;currentEffects=[...currentEffects,...consumed.addedEffects];currentUses=winner.option.uses;currentBest=bestPair(current,currentEffects,effectState,run);actions.push(winner.option.kind);
    for(const entry of consumed.log)increment(run.stats.reactionTriggers,entry.sourceId);
  }
  return{state:current,uses:currentUses,best:currentBest,effects:currentEffects,reactionState,actions};
}

function deterministicContrabandCandidates(state,run,enemy,suppressRules){
  const out=[];
  for(const id of [...new Set(run.inventory.contraband)]){
    const def=itemAction(id);if(!def?.combat||!def.consumeOnUse||id==="redacted-slip"||id==="temporary-injunction")continue;
    const action=def.combat;
    if(action.type==="SET_PLAYER_DIE"){
      for(const die of state.playerRoll){if(die.fixed||die.locked)continue;const r=applyCombatItemAction(state,action,{targetDieId:die.id});out.push({id,state:r.state});}
    }else if(action.type==="COPY_PLAYER_DIE"){
      for(const target of state.playerRoll){if(target.fixed||target.locked)continue;for(const source of state.playerRoll){if(source.id===target.id)continue;const r=applyCombatItemAction(state,action,{targetDieId:target.id,sourceDieId:source.id});out.push({id,state:r.state});}}
    }else if(action.type==="LOWER_HIGHEST_ENEMY_DIE"){
      if(!(enemy.ruleIds??[]).includes("rule:first-door:sealed")){const r=applyCombatItemAction(state,action);out.push({id,state:r.state});}
    }
  }
  return out;
}
function maybeUseContraband(state,run,enemy,effects,effectState,reactionState,suppressRules){
  let currentBest=bestPair(state,effects,effectState,run),best=null;
  for(const option of deterministicContrabandCandidates(state,run,enemy,suppressRules)){
    const reaction=react(option.state,enemy,reactionState,false,suppressRules);const candidateEffects=[...effects,...reaction.addedEffects];const bp=bestPair(reaction.combatState,candidateEffects,effectState,run);
    if(bp.score>currentBest.score&&(!best||bp.score>best.best.score))best={...option,best:bp};
  }
  if(best){
    const reaction=react(best.state,enemy,reactionState,true,suppressRules);run.inventory=consumeContraband(run.inventory,best.id);increment(run.stats.itemUses,best.id);for(const entry of reaction.log)increment(run.stats.reactionTriggers,entry.sourceId);
    return{state:reaction.combatState,effects:[...effects,...reaction.addedEffects],reactionState:reaction.reactionState,best:bestPair(reaction.combatState,[...effects,...reaction.addedEffects],effectState,run)};
  }
  if(currentBest.preview.margin<=0&&owned(run,"redacted-slip")){
    const candidates=state.playerRoll.filter(d=>!d.fixed&&!d.locked).toSorted((a,b)=>a.value-b.value);const target=candidates[0];
    if(target){const def=itemAction("redacted-slip");const result=applyCombatItemAction(state,def.combat,{targetDieId:target.id},run.rng.stream("item:reroll"));const reaction=react(result.state,enemy,reactionState,true,suppressRules);run.inventory=consumeContraband(run.inventory,"redacted-slip");increment(run.stats.itemUses,"redacted-slip");for(const entry of reaction.log)increment(run.stats.reactionTriggers,entry.sourceId);return{state:reaction.combatState,effects:[...effects,...reaction.addedEffects],reactionState:reaction.reactionState,best:bestPair(reaction.combatState,[...effects,...reaction.addedEffects],effectState,run)};}
  }
  return{state,effects,reactionState,best:currentBest};
}

function maybeSuppressRound(rawState,run,enemy,effectState,uses){
  const def=itemAction("temporary-injunction");if(!owned(run,"temporary-injunction")||!def?.combat||!enemy.ruleIds?.length||enemy.id===firstDoor.id)return null;
  const normalState=applyFixedRules(rawState,enemy,false),normalEffects=activeEffects(run,enemy,false);const normal=optimizePersistent(normalState,run,uses,enemy,normalEffects,effectState,false);
  const suppressedState=applyFixedRules(rawState,enemy,true),suppressedEffects=activeEffects(run,enemy,true);const suppressed=optimizePersistent(suppressedState,run,uses,enemy,suppressedEffects,effectState,true);
  const n=normal.best.preview,s=suppressed.best.preview;const worthwhile=(n.margin<=0&&s.margin>n.margin)||(run.policy==="safe"&&s.margin>=n.margin+2)||(run.policy==="opportunist"&&hpRatio(run)<0.55&&s.margin>n.margin);
  if(!worthwhile)return null;
  applyCombatItemAction(rawState,def.combat);run.inventory=consumeContraband(run.inventory,"temporary-injunction");increment(run.stats.itemUses,"temporary-injunction");return suppressed;
}

function caliperAdjustedScore(run,preview,effects){
  if(!owned(run,"brass-caliper")||run.encounterFlags.caliperUsed||preview.margin<=0)return{score:preview.finalSpoilsScore,pair:preview.base.spoilsValues,used:false};
  let best={score:preview.finalSpoilsScore,pair:preview.base.spoilsValues};
  for(const pair of brassCaliperOptions(preview.base.spoilsValues)){
    const rawFight=preview.base.rawFight,enemyFight=preview.base.enemyFight,margin=rawFight-enemyFight;
    const ctx={fightValues:preview.base.fightValues,spoilsValues:pair,rawFight,finalFight:rawFight,enemyFight,margin,outcome:margin>0?"win":margin<0?"loss":"tie",damageToEnemy:Math.max(0,margin),damageToPlayer:Math.max(0,-margin),baseSpoilsScore:pair[0]+pair[1],finalSpoilsScore:pair[0]+pair[1],playerHealing:0,enemyHealing:0};
    const resolved=resolveCombatEffects(ctx,effects,createEffectState(),false);if(resolved.context.finalSpoilsScore>best.score)best={score:resolved.context.finalSpoilsScore,pair};
  }
  const use=best.score>preview.finalSpoilsScore;if(use){run.encounterFlags.caliperUsed=true;increment(run.stats.itemUses,"brass-caliper");}
  return{...best,used:use};
}

function recordEffectTriggers(run,log){for(const entry of log)increment(run.stats.effectTriggers,entry.sourceId);}
function recordEncounter(run,id,result){const rec=run.stats.encounters[id]??{attempts:0,wins:0,rounds:0,playerDamage:0,spoilsTotal:0,spoilsCount:0};rec.attempts+=1;if(result.win)rec.wins+=1;rec.rounds+=result.rounds;rec.playerDamage+=result.playerDamage;if(result.spoils!==null){rec.spoilsTotal+=result.spoils;rec.spoilsCount+=1;}run.stats.encounters[id]=rec;if(result.boss){run.stats.boss.attempts+=1;if(result.win)run.stats.boss.wins+=1;run.stats.boss.entryHp+=result.entryHp;run.stats.boss.rounds+=result.rounds;run.stats.boss.playerDamage+=result.playerDamage;for(const phase of result.phasesReached)increment(run.stats.boss.phaseReached,phase);}}

function maybeUseEmergencyKey(run){if(!owned(run,"emergency-key")||run.progression.hp>=run.progression.maxHp)return;const threshold=run.policy==="safe"?.65:run.policy==="opportunist"?.42:.25;if(hpRatio(run)>threshold)return;const def=itemAction("emergency-key");run.progression=applyOutsideCombatItemAction(run.progression,def.outsideCombat);run.inventory=consumeContraband(run.inventory,"emergency-key");increment(run.stats.itemUses,"emergency-key");}

function combat(run,baseEnemy,{boss=false}={}){
  let enemy=baseEnemy,state=createCombatFromPlayerState({hp:run.progression.hp,maxHp:run.progression.maxHp},enemy),effectState=createEffectState(),uses={},finalSpoils=null,rounds=0,playerDamage=0,enemyDamage=0,carried=null;
  run.encounterFlags={ashLedgerTriggered:false,caliperUsed:false,stuckKeyUsed:false};const entryHp=state.player.hp,phasesReached=new Set();
  while(state.player.hp>0&&state.enemy.hp>0&&rounds<40){
    rounds+=1;if(boss){const phase=bossPhaseAtHp(firstDoor,state.enemy.hp);phasesReached.add(phase.id);enemy=bossPhaseAsEnemy(firstDoor,state.enemy.hp);}
    let raw=startRound(state,enemy,run.rng.stream("combat:enemy"),run.rng.stream("combat:player")).state;if(carried!==null){raw=injectCarriedDie(raw,carried);carried=null;}
    let suppress=false,opt=maybeSuppressRound(raw,run,enemy,effectState,uses),effects;
    if(opt){suppress=true;state=opt.state;uses=opt.uses;effects=opt.effects;}else{state=applyFixedRules(raw,enemy,false);effects=activeEffects(run,enemy,false);opt=optimizePersistent(state,run,uses,enemy,effects,effectState,false);state=opt.state;uses=opt.uses;effects=opt.effects;}
    for(const action of opt.actions??[])increment(run.stats.activeUses,action);
    let contraband=maybeUseContraband(state,run,enemy,effects,effectState,opt.reactionState??createManipulationReactionState(state.round),suppress);state=contraband.state;effects=contraband.effects;
    const chosen=contraband.best??bestPair(state,effects,effectState,run);const committed=commitWithEffects(state,chosen.ids,effects,effectState);state=committed.state;effectState=committed.effectState;recordEffectTriggers(run,committed.preview.effectLog);
    const pd=countDamage(committed.events,"player"),ed=countDamage(committed.events,"enemy");playerDamage+=pd;enemyDamage+=ed;
    const ledger=ashLedgerCoinAward(owned(run,"ash-ledger"),run.encounterFlags.ashLedgerTriggered,pd);run.encounterFlags.ashLedgerTriggered=ledger.triggered;if(ledger.coins){run.economy=addCoins(run.economy,ledger.coins);increment(run.stats.itemUses,"ash-ledger");}
    const qualified=committed.events.find(e=>e.type==="spoils_qualified");
    if(qualified){let score=qualified.score,pair=committed.preview.base.spoilsValues;if(state.enemy.hp===0){const adjusted=caliperAdjustedScore(run,committed.preview,effects);score=adjusted.score;pair=adjusted.pair;finalSpoils=score;}else if(owned(run,"stuck-key")&&!run.encounterFlags.stuckKeyUsed){carried=Math.max(...pair);run.encounterFlags.stuckKeyUsed=true;increment(run.stats.itemUses,"stuck-key");}}
    if(state.player.hp<=0||state.enemy.hp<=0)break;
  }
  run.progression={...run.progression,hp:state.player.hp};run.stats.rounds+=rounds;run.stats.damageTaken+=playerDamage;const result={win:state.enemy.hp<=0&&state.player.hp>0,spoils:finalSpoils,rounds,playerDamage,enemyDamage,entryHp,exitHp:state.player.hp,boss,phasesReached:[...phasesReached]};recordEncounter(run,baseEnemy.id,result);return result;
}

function chooseReplacement(run,candidates){return candidates.toSorted((a,b)=>utility(run.policy,a)-utility(run.policy,b))[0];}
function acquire(run,itemId){const item=floor1ItemRegistry[itemId];if(!item)return false;const plan=planTakeItem(run.inventory,item);const replacement=plan.requiresReplacement?chooseReplacement(run,plan.replacementCandidates):undefined;const result=applyTakeItem(run.inventory,item,floor1ItemRegistry,replacement);run.inventory=result.inventory;if(result.salvageCoins)run.economy=addCoins(run.economy,result.salvageCoins);increment(run.stats.itemsTaken,itemId);return true;}
function takeDraft(run,draft){const scored=draft.offers.map(offer=>({offer,score:offer.type==="COINS"?offer.amount*1.1:utility(run.policy,offer.itemId)})).sort((a,b)=>b.score-a.score);const best=scored[0];if(!best||best.score<3){const award=skippedDraftCoinAward(owned(run,"small-change-purse"),run.floorFlags.purseUsed);run.floorFlags.purseUsed=award.bonusUsed;run.economy=addCoins(run.economy,award.coins);run.stats.draftSkips+=1;if(award.coins>2)increment(run.stats.itemUses,"small-change-purse");return;}if(best.offer.type==="COINS")run.economy=addCoins(run.economy,best.offer.amount);else acquire(run,best.offer.itemId);}
function rewardCombat(run,enemy,spoils){run.economy=addCoins(run.economy,enemy.coins);const xp=grantXp(run.progression,enemy.xp);run.progression=xp.state;if(xp.levelsGained.includes(3)&&!run.technique){run.technique=run.policy==="greedy"?"long-odds":"steady-hand";run.progression=resolveTechniqueChoice(run.progression,3);}const score=spoils??2;if(spoils===null)run.stats.fallbackSpoils+=1;const raw=rewardBand(score);increment(run.stats.rawBands,raw);const draft=generateLootDraft(score,floor1ItemRegistry,run.inventory,run.rng.stream("loot"),enemy.rewardBandUplift??0);increment(run.stats.rewardBands,draft.band);increment(enemy.elite?run.stats.eliteRewardBands:run.stats.normalRewardBands,draft.band);run.stats.spoils.push(score);takeDraft(run,draft);}
function visitShop(run){
  run.stats.shops+=1;maybeUseEmergencyKey(run);const threshold=run.policy==="safe"?.82:run.policy==="opportunist"?.55:.30;if(hpRatio(run)<threshold&&run.economy.coins>=4&&run.progression.hp<run.progression.maxHp){const result=buyHealing(run.economy,run.progression);run.economy=result.economy;run.progression=result.progression;run.stats.shopHeals+=1;}
  const stock=generateShopStock(floor1ItemRegistry,run.inventory,run.rng.stream("shop"));const offers=[stock.gear,...stock.artifacts,stock.contraband].filter(o=>o.price<=run.economy.coins).map(o=>{const priced=firstShopPurchasePrice(o.price,owned(run,"receipt-from-nowhere"),run.floorFlags.receiptUsed);return{...o,actualPrice:priced.price,willUseDiscount:priced.discountUsed&&!run.floorFlags.receiptUsed};}).filter(o=>o.actualPrice<=run.economy.coins).sort((a,b)=>(utility(run.policy,b.itemId)-b.actualPrice*.12)-(utility(run.policy,a.itemId)-a.actualPrice*.12));
  if(offers[0]&&utility(run.policy,offers[0].itemId)>=6){run.economy=spendCoins(run.economy,offers[0].actualPrice);if(offers[0].willUseDiscount){run.floorFlags.receiptUsed=true;increment(run.stats.itemUses,"receipt-from-nowhere");}acquire(run,offers[0].itemId);run.stats.shopItems+=1;}
}
function eventChoice(run,event){if(event.id.endsWith("unnumbered-door")){if(run.policy==="safe")return hpRatio(run)>.9?"knock":"leave";if(run.policy==="opportunist")return hpRatio(run)>=.8?"force":"knock";return run.progression.hp>3?"force":"knock";}if(event.id.endsWith("talking-board-1891"))return run.policy==="safe"||hpRatio(run)<.55?"put-back":"move-pointer";if(event.id.endsWith("lost-property-office"))return run.economy.coins>=4&&run.policy!=="safe"?"claim":"nothing";return event.choices[0].id;}
function visitEvent(run){run.stats.events+=1;const event=selectEvent(floor1Events,run.eventHistory,run.rng.stream("event:select"));run.eventHistory.push(event.id);const choice=eventChoice(run,event);increment(run.stats.eventChoices,`${event.id}:${choice}`);const beforeHp=run.progression.hp;const resolved=resolveEventChoice(event,choice,{progression:run.progression,economy:run.economy,inventory:run.inventory},floor1ItemRegistry,run.rng.stream("event:outcome"));run.progression=resolved.state.progression;run.economy=resolved.state.economy;run.inventory=resolved.state.inventory;run.stats.damageTaken+=Math.max(0,beforeHp-run.progression.hp);for(const offer of resolved.itemOffers){if(offer.forced||utility(run.policy,offer.itemId)>=4)acquire(run,offer.itemId);}}

function roomPriority(run,type){if(run.policy==="greedy")return({ELITE:100,COMBAT:80,EVENT:30,SHOP:hpRatio(run)<.3?90:10})[type]??0;if(run.policy==="safe")return({SHOP:hpRatio(run)<.82?100:55,EVENT:70,COMBAT:60,ELITE:5})[type]??0;return({ELITE:hpRatio(run)>=.74?100:20,SHOP:hpRatio(run)<.56?95:45,COMBAT:75,EVENT:55})[type]??0;}
function chooseReachable(run,graph,current,row){const candidates=graph.nodes.filter(n=>n.row===row&&(row===0||graph.edges.some(e=>e.from===current.id&&e.to===n.id)));return candidates.toSorted((a,b)=>roomPriority(run,b.type)-roomPriority(run,a.type)||a.id.localeCompare(b.id))[0];}
function makeRun(seed,policy){return{seed,policy,rng:new RngService(seed),progression:createProgression(20),economy:createEconomy(0),inventory:createInventory({ARMOR:"work-apron"}),technique:null,history:[],eventHistory:[],floorFlags:{purseUsed:false,receiptUsed:false},encounterFlags:{},stats:{rounds:0,damageTaken:0,rawBands:{},rewardBands:{},normalRewardBands:{},eliteRewardBands:{},spoils:[],itemsTaken:{},itemUses:{},shops:0,shopHeals:0,shopItems:0,draftSkips:0,events:0,elites:0,fallbackSpoils:0,encounters:{},effectTriggers:{},reactionTriggers:{},activeUses:{},eventChoices:{},boss:{attempts:0,wins:0,entryHp:0,rounds:0,playerDamage:0,phaseReached:{}}}};}

export function simulateFloor(seed,policy="opportunist"){
  const run=makeRun(seed,policy),graph=generateRun(seed,[thresholdsFloor]).floors[0];let current=null;
  for(let row=0;row<thresholdsFloor.rows.length&&run.progression.hp>0;row+=1){maybeUseEmergencyKey(run);const node=chooseReachable(run,graph,current,row);if(!node)throw new Error(`No reachable row ${row}`);current=node;if(node.type==="COMBAT"||node.type==="ELITE"){const pool=node.type==="ELITE"?floor1Elites:floor1NormalEnemies;const enemy=selectEncounter(pool,run.history,run.rng.stream("encounter"));run.history.push({enemyId:enemy.id,instinct:enemy.instinct});if(enemy.elite)run.stats.elites+=1;const result=combat(run,enemy);if(!result.win)break;rewardCombat(run,enemy,result.spoils);}else if(node.type==="SHOP")visitShop(run);else if(node.type==="EVENT")visitEvent(run);}
  let clear=false;if(run.progression.hp>0){maybeUseEmergencyKey(run);const result=combat(run,bossPhaseAsEnemy(firstDoor,firstDoor.maxHp),{boss:true});clear=result.win;if(clear){run.economy=addCoins(run.economy,firstDoor.coins);run.progression=grantXp(run.progression,firstDoor.xp).state;run.progression={...run.progression,hp:Math.min(run.progression.maxHp,run.progression.hp+firstDoor.clearHeal)};}}
  return{seed,policy,clear,hp:run.progression.hp,maxHp:run.progression.maxHp,level:run.progression.level,xp:run.progression.xp,coins:run.economy.coins,rounds:run.stats.rounds,damageTaken:run.stats.damageTaken,rawBands:run.stats.rawBands,rewardBands:run.stats.rewardBands,normalRewardBands:run.stats.normalRewardBands,eliteRewardBands:run.stats.eliteRewardBands,spoils:run.stats.spoils,shops:run.stats.shops,events:run.stats.events,elites:run.stats.elites,fallbackSpoils:run.stats.fallbackSpoils,itemsTaken:run.stats.itemsTaken,itemUses:run.stats.itemUses,encounters:run.stats.encounters,effectTriggers:run.stats.effectTriggers,reactionTriggers:run.stats.reactionTriggers,activeUses:run.stats.activeUses,boss:run.stats.boss};
}

function mergeCounts(target,source){for(const[k,v]of Object.entries(source))increment(target,k,v);}
function bandFrequency(counts){const total=Object.values(counts).reduce((a,b)=>a+b,0)||1;return Object.fromEntries([1,2,3,4].map(k=>[k,(counts[k]??0)/total]));}
function aggregateEncounters(rows){const out={};for(const row of rows)for(const[id,rec]of Object.entries(row.encounters)){const dst=out[id]??{attempts:0,wins:0,rounds:0,playerDamage:0,spoilsTotal:0,spoilsCount:0};for(const key of Object.keys(dst))dst[key]+=rec[key]??0;out[id]=dst;}return Object.fromEntries(Object.entries(out).map(([id,r])=>[id,{...r,winRate:r.attempts?r.wins/r.attempts:0,avgRounds:r.attempts?r.rounds/r.attempts:0,avgPlayerDamage:r.attempts?r.playerDamage/r.attempts:0,avgSpoils:r.spoilsCount?r.spoilsTotal/r.spoilsCount:0}]));}
export function summarize(rows){
  const raw={},reward={},normalReward={},eliteReward={},effectTriggers={},reactionTriggers={},activeUses={},itemUses={},itemsTaken={};const spoils=[];const boss={attempts:0,wins:0,entryHp:0,rounds:0,playerDamage:0,phaseReached:{}};
  for(const row of rows){mergeCounts(raw,row.rawBands);mergeCounts(reward,row.rewardBands);mergeCounts(normalReward,row.normalRewardBands);mergeCounts(eliteReward,row.eliteRewardBands);mergeCounts(effectTriggers,row.effectTriggers);mergeCounts(reactionTriggers,row.reactionTriggers);mergeCounts(activeUses,row.activeUses);mergeCounts(itemUses,row.itemUses);mergeCounts(itemsTaken,row.itemsTaken);spoils.push(...row.spoils);boss.attempts+=row.boss.attempts;boss.wins+=row.boss.wins;boss.entryHp+=row.boss.entryHp;boss.rounds+=row.boss.rounds;boss.playerDamage+=row.boss.playerDamage;mergeCounts(boss.phaseReached,row.boss.phaseReached);}
  const avg=f=>rows.reduce((s,r)=>s+f(r),0)/rows.length;return{runs:rows.length,clearRate:avg(r=>r.clear?1:0),avgFinalHp:avg(r=>r.hp),avgDamageTaken:avg(r=>r.damageTaken),avgRounds:avg(r=>r.rounds),avgLevel:avg(r=>r.level),avgCoins:avg(r=>r.coins),avgElites:avg(r=>r.elites),avgShops:avg(r=>r.shops),avgEvents:avg(r=>r.events),avgSpoils:spoils.length?spoils.reduce((a,b)=>a+b,0)/spoils.length:0,rawBandFrequency:bandFrequency(raw),rewardBandFrequency:bandFrequency(reward),normalRewardBandFrequency:bandFrequency(normalReward),eliteRewardBandFrequency:bandFrequency(eliteReward),avgFallbackSpoils:avg(r=>r.fallbackSpoils),encounters:aggregateEncounters(rows),effectTriggers,reactionTriggers,activeUses,itemUses,itemsTaken,boss:{...boss,clearRate:boss.attempts?boss.wins/boss.attempts:0,avgEntryHp:boss.attempts?boss.entryHp/boss.attempts:0,avgRounds:boss.attempts?boss.rounds/boss.attempts:0,avgPlayerDamage:boss.attempts?boss.playerDamage/boss.attempts:0}};
}
export function batch({runs=1000,seedBase=100000}={}){const output={};for(const policy of["safe","opportunist","greedy"]){const offset=policy==="safe"?0:policy==="opportunist"?1_000_000:2_000_000;output[policy]=summarize(Array.from({length:runs},(_,i)=>simulateFloor(seedBase+offset+i,policy)));}return output;}
