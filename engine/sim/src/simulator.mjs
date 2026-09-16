import {
  RngService, generateRun, thresholdsFloor, selectEncounter, selectEvent,
  floor1NormalEnemies, floor1Elites, firstDoor, bossPhaseAsEnemy, bossPhaseAtHp, floor1Events,
  createCombatFromPlayerState, startRound, updatePlayerDie, withFixed, withValue,
  bump, flip, previewCommitWithEffects, commitWithEffects, createEffectState,
  createManipulationReactionState, reactToPlayerManipulation, floor1ManipulationReactionRegistry,
  floor1EffectRegistry, floor1ItemRegistry, createInventory, ownedItemIds,
  planTakeItem, applyTakeItem, createProgression, grantXp, resolveTechniqueChoice,
  createEconomy, addCoins, spendCoins, buyHealing,
  generateLootDraft, rewardBand, generateShopStock, resolveEventChoice,
} from "../../core/dist/index.js";

const PAIRS=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const SUPPORTED_ITEMS=new Set([
  "bent-knife","twin-nails","breaching-bar","work-apron","proof-vest","inside-out-lining","brass-buckle",
  "mirror-shard","loaded-question","false-bottom","hidden-hand","opposite-number","red-thread",
  "carbon-paper","blank-face",
]);
const UTILITY={
  safe:{"proof-vest":10,"inside-out-lining":9,"work-apron":8,"mirror-shard":9,"hidden-hand":9,"bent-knife":8,"twin-nails":7,"breaching-bar":7,"brass-buckle":6,"red-thread":8,"carbon-paper":7,"blank-face":8,"loaded-question":5,"false-bottom":5,"opposite-number":5},
  opportunist:{"mirror-shard":10,"hidden-hand":9,"carbon-paper":9,"proof-vest":9,"inside-out-lining":8,"bent-knife":8,"breaching-bar":8,"loaded-question":8,"opposite-number":8,"false-bottom":7,"twin-nails":7,"blank-face":10,"red-thread":8,"brass-buckle":6,"work-apron":7},
  greedy:{"loaded-question":10,"opposite-number":10,"false-bottom":9,"carbon-paper":9,"blank-face":10,"mirror-shard":9,"twin-nails":8,"breaching-bar":8,"hidden-hand":7,"bent-knife":7,"red-thread":8,"brass-buckle":7,"inside-out-lining":5,"proof-vest":5,"work-apron":4},
};

function utility(policy,id){return SUPPORTED_ITEMS.has(id)?(UTILITY[policy]?.[id]??5):1;}
function hpRatio(run){return run.progression.hp/run.progression.maxHp;}
function owned(run,id){return ownedItemIds(run.inventory).includes(id);}
function increment(map,key,amount=1){map[key]=(map[key]??0)+amount;}

function activePassiveEffects(run,enemy){
  const sourceIds=new Set(ownedItemIds(run.inventory).flatMap((id)=>floor1ItemRegistry[id]?.effectSourceIds??[]));
  if(run.technique==="long-odds")sourceIds.add("technique:long-odds");
  const effects=Object.values(floor1EffectRegistry).filter((effect)=>sourceIds.has(effect.sourceId));
  for(const ruleId of enemy.ruleIds??[]){const effect=floor1EffectRegistry[ruleId];if(effect)effects.push(effect);}
  return effects;
}
function manipulationReactions(enemy){return (enemy.ruleIds??[]).map((id)=>floor1ManipulationReactionRegistry[id]).filter(Boolean);}

function objective(policy,preview,run,enemyHp){
  const m=preview.margin,s=preview.finalSpoilsScore,damage=preview.damageToEnemy;
  if(policy==="safe")return m>0?100000+damage*1000+m*100+s:m===0?50000:m*2000;
  if(policy==="greedy")return m>0?100000+s*250-m*8+damage*2:m===0?50000:m*1000;
  if(hpRatio(run)<0.48)return m>0?100000+damage*1000+m*100+s:m===0?50000:m*2200;
  if(m>0){const killing=damage>=enemyHp;const greedWeight=killing?120:25;const thin=(m===1&&hpRatio(run)<0.7)?180:0;return 100000+damage*100+s*greedWeight+m*12-thin;}
  return m===0?50000:m*1400;
}

function bestPair(state,effects,effectState,run){
  let best=null;
  for(const[a,b]of PAIRS){const ids=[state.playerRoll[a].id,state.playerRoll[b].id];const preview=previewCommitWithEffects(state,ids,effects,effectState);const score=objective(run.policy,preview,run,state.enemy.hp);if(!best||score>best.score)best={ids,preview,score};}
  return best;
}

function fixedDiceForEnemy(state,enemy){
  const rules=new Set(enemy.ruleIds??[]);let target=null;
  if(rules.has("rule:unadmitted:fix-lowest")){const min=Math.min(...state.playerRoll.map(d=>d.value));target=state.playerRoll.findIndex(d=>d.value===min);}
  if(rules.has("rule:threshold-warden:fix-highest")){const max=Math.max(...state.playerRoll.map(d=>d.value));target=state.playerRoll.findIndex(d=>d.value===max);}
  return target===null?state:updatePlayerDie(state,withFixed(state.playerRoll[target],true));
}

function manipulationOptions(state,run,uses,enemy){
  const out=[];const bumpLimit=run.technique==="steady-hand"?2:1;
  if((uses.bump??0)<bumpLimit)state.playerRoll.forEach((die)=>{if(!die.fixed)for(const delta of[-1,1]){const value=bump(die.value,delta);if(value!==die.value)out.push({kind:"bump",state:updatePlayerDie(state,withValue(die,value)),uses:{...uses,bump:(uses.bump??0)+1}});}});
  if(owned(run,"mirror-shard")&&!uses.flip)state.playerRoll.forEach((die)=>{if(!die.fixed)out.push({kind:"flip",state:updatePlayerDie(state,withValue(die,flip(die.value))),uses:{...uses,flip:1}});});
  if(owned(run,"carbon-paper")&&!uses.copy)for(let target=0;target<4;target+=1){if(state.playerRoll[target].fixed)continue;for(let source=0;source<4;source+=1){if(source!==target)out.push({kind:"copy",state:updatePlayerDie(state,withValue(state.playerRoll[target],state.playerRoll[source].value)),uses:{...uses,copy:1}});}}
  if(owned(run,"blank-face")&&!uses.transmute)state.playerRoll.forEach((die)=>{if(!die.fixed)for(const value of[1,6])if(value!==die.value)out.push({kind:"transmute",state:updatePlayerDie(state,withValue(die,value)),uses:{...uses,transmute:1}});});
  const sealed=(enemy.ruleIds??[]).includes("rule:first-door:sealed");
  if(owned(run,"hidden-hand")&&!uses.interfere&&!sealed){const locked=[...state.enemyLocked];const high=Math.max(...locked);const i=locked.indexOf(high);if(high>1){locked[i]=bump(high,-1);out.push({kind:"interfere",state:{...state,enemyLocked:locked},uses:{...uses,interfere:1}});}}
  return out;
}

function optimizeManipulations(state,run,uses,enemy,effects,effectState){
  let current=state,currentUses=uses,currentEffects=effects,currentBest=bestPair(state,effects,effectState,run);
  let reactionState=createManipulationReactionState(state.round);
  const reactionDefs=manipulationReactions(enemy);const actions=[];
  for(let step=0;step<4;step+=1){
    let winner=null;
    for(const option of manipulationOptions(current,run,currentUses,enemy)){
      const reaction=reactToPlayerManipulation(option.state,reactionDefs,reactionState,false);
      const candidateEffects=[...currentEffects,...reaction.addedEffects];
      const candidateBest=bestPair(reaction.combatState,candidateEffects,effectState,run);
      if(candidateBest.score>currentBest.score&&(!winner||candidateBest.score>winner.best.score))winner={option,reaction,best:candidateBest};
    }
    if(!winner)break;
    const consumed=reactToPlayerManipulation(winner.option.state,reactionDefs,reactionState,true);
    current=consumed.combatState;reactionState=consumed.reactionState;currentEffects=[...currentEffects,...consumed.addedEffects];currentUses=winner.option.uses;currentBest=bestPair(current,currentEffects,effectState,run);actions.push(winner.option.kind);
    for(const entry of consumed.log)increment(run.stats.reactionTriggers,entry.sourceId);
  }
  return{state:current,uses:currentUses,best:currentBest,effects:currentEffects,actions};
}

function recordEffectTriggers(run,log){for(const entry of log)increment(run.stats.effectTriggers,entry.sourceId);}
function recordEncounter(run,id,result){
  const rec=run.stats.encounters[id]??{attempts:0,wins:0,rounds:0,playerDamage:0,spoilsTotal:0,spoilsCount:0};
  rec.attempts+=1;if(result.win)rec.wins+=1;rec.rounds+=result.rounds;rec.playerDamage+=result.playerDamage;
  if(result.spoils!==null){rec.spoilsTotal+=result.spoils;rec.spoilsCount+=1;}
  run.stats.encounters[id]=rec;
  if(result.boss){run.stats.boss.attempts+=1;if(result.win)run.stats.boss.wins+=1;run.stats.boss.entryHp+=result.entryHp;run.stats.boss.rounds+=result.rounds;run.stats.boss.playerDamage+=result.playerDamage;for(const phase of result.phasesReached)increment(run.stats.boss.phaseReached,phase);}
}

function combat(run,baseEnemy,{boss=false}={}){
  let enemy=baseEnemy;let state=createCombatFromPlayerState({hp:run.progression.hp,maxHp:run.progression.maxHp},enemy);let effectState=createEffectState(),uses={},finalSpoils=null,rounds=0,playerDamage=0,enemyDamage=0;
  const entryHp=state.player.hp;const phasesReached=new Set();
  while(state.player.hp>0&&state.enemy.hp>0&&rounds<40){
    rounds+=1;if(boss){const phase=bossPhaseAtHp(firstDoor,state.enemy.hp);phasesReached.add(phase.id);enemy=bossPhaseAsEnemy(firstDoor,state.enemy.hp);}
    const round=startRound(state,enemy,run.rng.stream("combat:enemy"),run.rng.stream("combat:player"));state=fixedDiceForEnemy(round.state,enemy);
    let effects=activePassiveEffects(run,enemy);const optimized=optimizeManipulations(state,run,uses,enemy,effects,effectState);state=optimized.state;uses=optimized.uses;effects=optimized.effects;
    for(const action of optimized.actions)increment(run.stats.activeUses,action);
    const committed=commitWithEffects(state,optimized.best.ids,effects,effectState);state=committed.state;effectState=committed.effectState;recordEffectTriggers(run,committed.preview.effectLog);
    for(const event of committed.events){if(event.type==="damage"&&event.target==="player")playerDamage+=event.amount;if(event.type==="damage"&&event.target==="enemy")enemyDamage+=event.amount;}
    const qualified=committed.events.find(e=>e.type==="spoils_qualified");if(state.enemy.hp===0&&qualified)finalSpoils=qualified.score;
    if(state.player.hp<=0||state.enemy.hp<=0)break;
  }
  run.progression={...run.progression,hp:state.player.hp};run.stats.rounds+=rounds;run.stats.damageTaken+=playerDamage;
  const result={win:state.enemy.hp<=0&&state.player.hp>0,spoils:finalSpoils,rounds,playerDamage,enemyDamage,entryHp,exitHp:state.player.hp,boss,phasesReached:[...phasesReached]};recordEncounter(run,baseEnemy.id,result);return result;
}

function chooseReplacement(run,candidates){return candidates.toSorted((a,b)=>utility(run.policy,a)-utility(run.policy,b))[0];}
function acquire(run,itemId){const item=floor1ItemRegistry[itemId];if(!item)return false;const plan=planTakeItem(run.inventory,item);const replacement=plan.requiresReplacement?chooseReplacement(run,plan.replacementCandidates):undefined;const result=applyTakeItem(run.inventory,item,floor1ItemRegistry,replacement);run.inventory=result.inventory;if(result.salvageCoins)run.economy=addCoins(run.economy,result.salvageCoins);increment(run.stats.itemsTaken,itemId);return true;}
function takeDraft(run,draft){const scored=draft.offers.map((offer)=>({offer,score:offer.type==="COINS"?offer.amount*1.1:utility(run.policy,offer.itemId)})).sort((a,b)=>b.score-a.score);const best=scored[0];if(!best||best.score<3){run.economy=addCoins(run.economy,2);run.stats.draftSkips+=1;return;}if(best.offer.type==="COINS")run.economy=addCoins(run.economy,best.offer.amount);else acquire(run,best.offer.itemId);}
function rewardCombat(run,enemy,spoils){
  run.economy=addCoins(run.economy,enemy.coins);const xp=grantXp(run.progression,enemy.xp);run.progression=xp.state;if(xp.levelsGained.includes(3)&&!run.technique){run.technique=run.policy==="greedy"?"long-odds":"steady-hand";run.progression=resolveTechniqueChoice(run.progression,3);}
  const score=spoils??2;if(spoils===null)run.stats.fallbackSpoils+=1;const raw=rewardBand(score);increment(run.stats.rawBands,raw);const draft=generateLootDraft(score,floor1ItemRegistry,run.inventory,run.rng.stream("loot"),enemy.rewardBandUplift??0);increment(run.stats.rewardBands,draft.band);increment(enemy.elite?run.stats.eliteRewardBands:run.stats.normalRewardBands,draft.band);run.stats.spoils.push(score);takeDraft(run,draft);
}
function visitShop(run){
  run.stats.shops+=1;const threshold=run.policy==="safe"?.82:run.policy==="opportunist"?.55:.30;if(hpRatio(run)<threshold&&run.economy.coins>=4&&run.progression.hp<run.progression.maxHp){const result=buyHealing(run.economy,run.progression);run.economy=result.economy;run.progression=result.progression;run.stats.shopHeals+=1;}
  const stock=generateShopStock(floor1ItemRegistry,run.inventory,run.rng.stream("shop"));const offers=[stock.gear,...stock.artifacts,stock.contraband].filter(o=>o.price<=run.economy.coins&&SUPPORTED_ITEMS.has(o.itemId)).sort((a,b)=>(utility(run.policy,b.itemId)-b.price*.12)-(utility(run.policy,a.itemId)-a.price*.12));if(offers[0]&&utility(run.policy,offers[0].itemId)>=6){run.economy=spendCoins(run.economy,offers[0].price);acquire(run,offers[0].itemId);run.stats.shopItems+=1;}
}
function eventChoice(run,event){if(event.id.endsWith("unnumbered-door")){if(run.policy==="safe")return hpRatio(run)>.9?"knock":"leave";if(run.policy==="opportunist")return hpRatio(run)>=.8?"force":"knock";return run.progression.hp>3?"force":"knock";}if(event.id.endsWith("talking-board-1891"))return run.policy==="safe"||hpRatio(run)<.55?"put-back":"move-pointer";if(event.id.endsWith("lost-property-office"))return run.economy.coins>=4&&run.policy!=="safe"?"claim":"nothing";return event.choices[0].id;}
function visitEvent(run){run.stats.events+=1;const event=selectEvent(floor1Events,run.eventHistory,run.rng.stream("event:select"));run.eventHistory.push(event.id);const choice=eventChoice(run,event);increment(run.stats.eventChoices,`${event.id}:${choice}`);const beforeHp=run.progression.hp;const resolved=resolveEventChoice(event,choice,{progression:run.progression,economy:run.economy,inventory:run.inventory},floor1ItemRegistry,run.rng.stream("event:outcome"));run.progression=resolved.state.progression;run.economy=resolved.state.economy;run.inventory=resolved.state.inventory;run.stats.damageTaken+=Math.max(0,beforeHp-run.progression.hp);for(const offer of resolved.itemOffers){if(offer.forced||utility(run.policy,offer.itemId)>=4)acquire(run,offer.itemId);}}

function roomPriority(run,type){if(run.policy==="greedy")return({ELITE:100,COMBAT:80,EVENT:30,SHOP:hpRatio(run)<.3?90:10})[type]??0;if(run.policy==="safe")return({SHOP:hpRatio(run)<.82?100:55,EVENT:70,COMBAT:60,ELITE:5})[type]??0;return({ELITE:hpRatio(run)>=.74?100:20,SHOP:hpRatio(run)<.56?95:45,COMBAT:75,EVENT:55})[type]??0;}
function chooseReachable(run,graph,current,row){const candidates=graph.nodes.filter(n=>n.row===row&&(row===0||graph.edges.some(e=>e.from===current.id&&e.to===n.id)));return candidates.toSorted((a,b)=>roomPriority(run,b.type)-roomPriority(run,a.type)||a.id.localeCompare(b.id))[0];}
function makeRun(seed,policy){return{seed,policy,rng:new RngService(seed),progression:createProgression(20),economy:createEconomy(0),inventory:createInventory({ARMOR:"work-apron"}),technique:null,history:[],eventHistory:[],stats:{rounds:0,damageTaken:0,rawBands:{},rewardBands:{},normalRewardBands:{},eliteRewardBands:{},spoils:[],itemsTaken:{},shops:0,shopHeals:0,shopItems:0,draftSkips:0,events:0,elites:0,fallbackSpoils:0,encounters:{},effectTriggers:{},reactionTriggers:{},activeUses:{},eventChoices:{},boss:{attempts:0,wins:0,entryHp:0,rounds:0,playerDamage:0,phaseReached:{}}}};}

export function simulateFloor(seed,policy="opportunist"){
  const run=makeRun(seed,policy);const graph=generateRun(seed,[thresholdsFloor]).floors[0];let current=null;
  for(let row=0;row<thresholdsFloor.rows.length&&run.progression.hp>0;row+=1){const node=chooseReachable(run,graph,current,row);if(!node)throw new Error(`No reachable row ${row}`);current=node;if(node.type==="COMBAT"||node.type==="ELITE"){const pool=node.type==="ELITE"?floor1Elites:floor1NormalEnemies;const enemy=selectEncounter(pool,run.history,run.rng.stream("encounter"));run.history.push({enemyId:enemy.id,instinct:enemy.instinct});if(enemy.elite)run.stats.elites+=1;const result=combat(run,enemy);if(!result.win)break;rewardCombat(run,enemy,result.spoils);}else if(node.type==="SHOP")visitShop(run);else if(node.type==="EVENT")visitEvent(run);}
  let clear=false;if(run.progression.hp>0){const result=combat(run,bossPhaseAsEnemy(firstDoor,firstDoor.maxHp),{boss:true});clear=result.win;if(clear){run.economy=addCoins(run.economy,firstDoor.coins);run.progression=grantXp(run.progression,firstDoor.xp).state;run.progression={...run.progression,hp:Math.min(run.progression.maxHp,run.progression.hp+firstDoor.clearHeal)};}}
  return{seed,policy,clear,hp:run.progression.hp,maxHp:run.progression.maxHp,level:run.progression.level,xp:run.progression.xp,coins:run.economy.coins,rounds:run.stats.rounds,damageTaken:run.stats.damageTaken,rawBands:run.stats.rawBands,rewardBands:run.stats.rewardBands,normalRewardBands:run.stats.normalRewardBands,eliteRewardBands:run.stats.eliteRewardBands,spoils:run.stats.spoils,shops:run.stats.shops,events:run.stats.events,elites:run.stats.elites,fallbackSpoils:run.stats.fallbackSpoils,itemsTaken:run.stats.itemsTaken,encounters:run.stats.encounters,effectTriggers:run.stats.effectTriggers,reactionTriggers:run.stats.reactionTriggers,activeUses:run.stats.activeUses,boss:run.stats.boss};
}

function mergeCounts(target,source){for(const[k,v]of Object.entries(source))increment(target,k,v);}
function bandFrequency(counts){const total=Object.values(counts).reduce((a,b)=>a+b,0)||1;return Object.fromEntries([1,2,3,4].map(k=>[k,(counts[k]??0)/total]));}
function aggregateEncounters(rows){const out={};for(const row of rows)for(const[id,rec]of Object.entries(row.encounters)){const dst=out[id]??{attempts:0,wins:0,rounds:0,playerDamage:0,spoilsTotal:0,spoilsCount:0};for(const key of Object.keys(dst))dst[key]+=rec[key]??0;out[id]=dst;}return Object.fromEntries(Object.entries(out).map(([id,r])=>[id,{...r,winRate:r.attempts?r.wins/r.attempts:0,avgRounds:r.attempts?r.rounds/r.attempts:0,avgPlayerDamage:r.attempts?r.playerDamage/r.attempts:0,avgSpoils:r.spoilsCount?r.spoilsTotal/r.spoilsCount:0}]));}
export function summarize(rows){
  const raw={},reward={},normalReward={},eliteReward={},effectTriggers={},reactionTriggers={},activeUses={};const spoils=[];const boss={attempts:0,wins:0,entryHp:0,rounds:0,playerDamage:0,phaseReached:{}};
  for(const row of rows){mergeCounts(raw,row.rawBands);mergeCounts(reward,row.rewardBands);mergeCounts(normalReward,row.normalRewardBands);mergeCounts(eliteReward,row.eliteRewardBands);mergeCounts(effectTriggers,row.effectTriggers);mergeCounts(reactionTriggers,row.reactionTriggers);mergeCounts(activeUses,row.activeUses);spoils.push(...row.spoils);boss.attempts+=row.boss.attempts;boss.wins+=row.boss.wins;boss.entryHp+=row.boss.entryHp;boss.rounds+=row.boss.rounds;boss.playerDamage+=row.boss.playerDamage;mergeCounts(boss.phaseReached,row.boss.phaseReached);}
  const avg=(f)=>rows.reduce((s,r)=>s+f(r),0)/rows.length;return{runs:rows.length,clearRate:avg(r=>r.clear?1:0),avgFinalHp:avg(r=>r.hp),avgDamageTaken:avg(r=>r.damageTaken),avgRounds:avg(r=>r.rounds),avgLevel:avg(r=>r.level),avgCoins:avg(r=>r.coins),avgElites:avg(r=>r.elites),avgShops:avg(r=>r.shops),avgEvents:avg(r=>r.events),avgSpoils:spoils.length?spoils.reduce((a,b)=>a+b,0)/spoils.length:0,rawBandFrequency:bandFrequency(raw),rewardBandFrequency:bandFrequency(reward),normalRewardBandFrequency:bandFrequency(normalReward),eliteRewardBandFrequency:bandFrequency(eliteReward),avgFallbackSpoils:avg(r=>r.fallbackSpoils),encounters:aggregateEncounters(rows),effectTriggers,reactionTriggers,activeUses,boss:{...boss,clearRate:boss.attempts?boss.wins/boss.attempts:0,avgEntryHp:boss.attempts?boss.entryHp/boss.attempts:0,avgRounds:boss.attempts?boss.rounds/boss.attempts:0,avgPlayerDamage:boss.attempts?boss.playerDamage/boss.attempts:0}};
}
export function batch({runs=1000,seedBase=100000}={}){const output={};for(const policy of["safe","opportunist","greedy"]){const offset=policy==="safe"?0:policy==="opportunist"?1_000_000:2_000_000;const rows=Array.from({length:runs},(_,i)=>simulateFloor(seedBase+offset+i,policy));output[policy]=summarize(rows);}return output;}
