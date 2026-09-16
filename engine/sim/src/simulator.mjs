import {
  RngService, generateRun, thresholdsFloor, selectEncounter,
  floor1NormalEnemies, floor1Elites, firstDoor, bossPhaseAsEnemy,
  createCombatFromPlayerState, startRound, updatePlayerDie, withFixed, withValue,
  bump, flip, previewCommitWithEffects, commitWithEffects, createEffectState,
  floor1EffectRegistry, floor1ItemRegistry, createInventory, ownedItemIds,
  planTakeItem, applyTakeItem, createProgression, grantXp,
  createEconomy, addCoins, spendCoins, buyHealing,
  generateLootDraft, generateShopStock,
} from "../../core/dist/index.js";

const PAIRS=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const SUPPORTED_ITEMS=new Set([
  "bent-knife","twin-nails","breaching-bar","work-apron","proof-vest",
  "mirror-shard","loaded-question","false-bottom","hidden-hand","opposite-number",
  "carbon-paper","blank-face",
]);

const UTILITY={
  safe:{"proof-vest":10,"work-apron":8,"mirror-shard":9,"hidden-hand":9,"bent-knife":8,"twin-nails":7,"breaching-bar":7,"carbon-paper":7,"blank-face":8,"loaded-question":5,"false-bottom":5,"opposite-number":5},
  opportunist:{"mirror-shard":10,"hidden-hand":9,"carbon-paper":9,"proof-vest":9,"bent-knife":8,"breaching-bar":8,"loaded-question":8,"opposite-number":8,"false-bottom":7,"twin-nails":7,"blank-face":10,"work-apron":7},
  greedy:{"loaded-question":10,"opposite-number":10,"false-bottom":9,"carbon-paper":9,"blank-face":10,"mirror-shard":9,"twin-nails":8,"breaching-bar":8,"hidden-hand":7,"bent-knife":7,"proof-vest":5,"work-apron":4},
};

function utility(policy,id){ return SUPPORTED_ITEMS.has(id) ? (UTILITY[policy]?.[id] ?? 5) : 1; }
function hpRatio(run){ return run.progression.hp/run.progression.maxHp; }
function owned(run,id){ return ownedItemIds(run.inventory).includes(id); }

function activePassiveEffects(run, enemy){
  const ownedIds=ownedItemIds(run.inventory);
  const sourceIds=new Set(ownedIds.flatMap((id)=>floor1ItemRegistry[id]?.effectSourceIds ?? []));
  const effects=Object.values(floor1EffectRegistry).filter((effect)=>sourceIds.has(effect.sourceId));
  for(const ruleId of enemy.ruleIds ?? []){
    const effect=floor1EffectRegistry[ruleId];
    if(effect) effects.push(effect);
  }
  return effects;
}

function objective(policy, preview, run, enemyHp){
  const m=preview.margin, s=preview.finalSpoilsScore, damage=preview.damageToEnemy;
  if(policy==="safe"){
    if(m>0) return 100000+damage*1000+m*100+s;
    if(m===0) return 50000;
    return m*2000;
  }
  if(policy==="greedy"){
    if(m>0) return 100000+s*250-m*8+damage*2;
    if(m===0) return 50000;
    return m*1000;
  }
  // Opportunist: greed when healthy, tighten up when HP is pressured.
  if(hpRatio(run)<0.48){
    if(m>0) return 100000+damage*1000+m*100+s;
    if(m===0) return 50000;
    return m*2200;
  }
  if(m>0){
    const killing=damage>=enemyHp;
    const greedWeight=killing?120:25;
    const thinMarginPenalty=(m===1 && hpRatio(run)<0.7)?180:0;
    return 100000+damage*100+s*greedWeight+m*12-thinMarginPenalty;
  }
  if(m===0) return 50000;
  return m*1400;
}

function bestPair(state,effects,effectState,run){
  let best=null;
  for(const [a,b] of PAIRS){
    const ids=[state.playerRoll[a].id,state.playerRoll[b].id];
    const preview=previewCommitWithEffects(state,ids,effects,effectState);
    const score=objective(run.policy,preview,run,state.enemy.hp);
    if(!best || score>best.score) best={ids,preview,score};
  }
  return best;
}

function fixedDiceForEnemy(state,enemy){
  const rules=new Set(enemy.ruleIds ?? []);
  let targetIndex=null;
  if(rules.has("rule:unadmitted:fix-lowest")){
    const min=Math.min(...state.playerRoll.map(d=>d.value));
    targetIndex=state.playerRoll.findIndex(d=>d.value===min);
  }
  if(rules.has("rule:threshold-warden:fix-highest")){
    const max=Math.max(...state.playerRoll.map(d=>d.value));
    targetIndex=state.playerRoll.findIndex(d=>d.value===max);
  }
  return targetIndex===null?state:updatePlayerDie(state,withFixed(state.playerRoll[targetIndex],true));
}

function manipulationOptions(state,run,uses,enemy){
  const out=[];
  const bumpLimit=run.technique==="steady-hand"?2:1;
  if((uses.bump??0)<bumpLimit){
    state.playerRoll.forEach((die,i)=>{
      if(die.fixed) return;
      for(const delta of [-1,1]){
        const value=bump(die.value,delta);
        if(value!==die.value) out.push({kind:"bump",state:updatePlayerDie(state,withValue(die,value)),uses:{...uses,bump:(uses.bump??0)+1}});
      }
    });
  }
  if(owned(run,"mirror-shard")&&!uses.flip){
    state.playerRoll.forEach((die)=>{ if(!die.fixed) out.push({kind:"flip",state:updatePlayerDie(state,withValue(die,flip(die.value))),uses:{...uses,flip:1}}); });
  }
  if(owned(run,"carbon-paper")&&!uses.copy){
    for(let target=0;target<4;target+=1){
      if(state.playerRoll[target].fixed) continue;
      for(let source=0;source<4;source+=1){
        if(source===target) continue;
        out.push({kind:"copy",state:updatePlayerDie(state,withValue(state.playerRoll[target],state.playerRoll[source].value)),uses:{...uses,copy:1}});
      }
    }
  }
  if(owned(run,"blank-face")&&!uses.transmute){
    state.playerRoll.forEach((die)=>{ if(!die.fixed) for(const value of [1,6]) if(value!==die.value) out.push({kind:"transmute",state:updatePlayerDie(state,withValue(die,value)),uses:{...uses,transmute:1}}); });
  }
  const sealed=(enemy.ruleIds??[]).includes("rule:first-door:sealed");
  if(owned(run,"hidden-hand")&&!uses.interfere&&!sealed){
    const locked=[...state.enemyLocked]; const high=Math.max(...locked); const i=locked.indexOf(high);
    if(high>1){ locked[i]=bump(high,-1); out.push({kind:"interfere",state:{...state,enemyLocked:locked},uses:{...uses,interfere:1}}); }
  }
  return out;
}

function optimizeManipulations(state,run,uses,enemy,effects,effectState){
  let current=state, currentUses=uses, currentBest=bestPair(state,effects,effectState,run), manipulations=0;
  for(let step=0;step<4;step+=1){
    let winner=null;
    for(const option of manipulationOptions(current,run,currentUses,enemy)){
      let candidateState=option.state;
      let candidateEffects=effects;
      // Rule adapters use core arithmetic; simulator only supplies whether a manipulation occurred.
      if((enemy.ruleIds??[]).includes("rule:seal-whelp:reaction-on-manipulation")){
        const base=floor1EffectRegistry["enemy:seal-whelp:reaction-seal"];
        candidateEffects=[...effects,{...base,maxUsesPerEncounter:undefined}];
      }
      if((enemy.ruleIds??[]).includes("rule:seal-bearer:counterseal")){
        const locked=[...candidateState.enemyLocked]; const low=Math.min(...locked); const i=locked.indexOf(low); locked[i]=bump(low,1);
        candidateState={...candidateState,enemyLocked:locked};
      }
      const candidateBest=bestPair(candidateState,candidateEffects,effectState,run);
      if(candidateBest.score>currentBest.score && (!winner||candidateBest.score>winner.best.score)) winner={...option,state:candidateState,effects:candidateEffects,best:candidateBest};
    }
    if(!winner) break;
    current=winner.state; currentUses=winner.uses; currentBest=winner.best; effects=winner.effects; manipulations+=1;
  }
  return {state:current,uses:currentUses,best:currentBest,effects,manipulations};
}

function combat(run,baseEnemy,{boss=false}={}){
  let enemy=baseEnemy;
  let state=createCombatFromPlayerState({hp:run.progression.hp,maxHp:run.progression.maxHp},enemy);
  let effectState=createEffectState();
  let uses={};
  let finalSpoils=null;
  let rounds=0;
  while(state.player.hp>0&&state.enemy.hp>0&&rounds<40){
    rounds+=1;
    if(boss) enemy=bossPhaseAsEnemy(firstDoor,state.enemy.hp);
    let round=startRound(state,enemy,run.rng.stream("combat:enemy"),run.rng.stream("combat:player"));
    state=fixedDiceForEnemy(round.state,enemy);
    let effects=activePassiveEffects(run,enemy);
    const optimized=optimizeManipulations(state,run,uses,enemy,effects,effectState);
    state=optimized.state; uses=optimized.uses; effects=optimized.effects;
    const committed=commitWithEffects(state,optimized.best.ids,effects,effectState);
    state=committed.state; effectState=committed.effectState;
    const qualified=committed.events.find(e=>e.type==="spoils_qualified");
    if(state.enemy.hp===0&&qualified) finalSpoils=qualified.score; // Final-Blow Spoils.

    if((enemy.ruleIds??[]).includes("rule:turnback:refusal")&&committed.preview.margin===0&&state.enemy.hp>0){
      state={...state,enemy:{...state.enemy,hp:Math.min(state.enemy.maxHp,state.enemy.hp+1)}};
    }
    if(boss&&(enemy.ruleIds??[]).includes("rule:first-door:both-ways")&&committed.preview.margin===0){
      state={...state,player:{...state.player,hp:Math.max(0,state.player.hp-2)},enemy:{...state.enemy,hp:Math.max(0,state.enemy.hp-2)}};
    }
    if(state.player.hp<=0||state.enemy.hp<=0) break;
  }
  run.progression={...run.progression,hp:state.player.hp};
  run.stats.rounds+=rounds;
  run.stats.damageTaken+=Math.max(0,run.stats.hpBeforeCombat-state.player.hp);
  return {win:state.enemy.hp<=0&&state.player.hp>0,spoils:finalSpoils,rounds};
}

function chooseReplacement(run,candidates){ return candidates.toSorted((a,b)=>utility(run.policy,a)-utility(run.policy,b))[0]; }
function acquire(run,itemId){
  const item=floor1ItemRegistry[itemId]; if(!item) return false;
  const plan=planTakeItem(run.inventory,item);
  const replacement=plan.requiresReplacement?chooseReplacement(run,plan.replacementCandidates):undefined;
  const result=applyTakeItem(run.inventory,item,floor1ItemRegistry,replacement);
  run.inventory=result.inventory;
  if(result.salvageCoins) run.economy=addCoins(run.economy,result.salvageCoins);
  run.stats.itemsTaken[itemId]=(run.stats.itemsTaken[itemId]??0)+1;
  return true;
}

function takeDraft(run,draft){
  const scored=draft.offers.map((offer)=>({offer,score:offer.type==="COINS"?offer.amount*1.1:utility(run.policy,offer.itemId)})).sort((a,b)=>b.score-a.score);
  const best=scored[0];
  if(!best||best.score<3){ run.economy=addCoins(run.economy,2); run.stats.draftSkips+=1; return; }
  if(best.offer.type==="COINS") run.economy=addCoins(run.economy,best.offer.amount); else acquire(run,best.offer.itemId);
}

function rewardCombat(run,enemy,spoils){
  run.economy=addCoins(run.economy,enemy.coins);
  const xp=grantXp(run.progression,enemy.xp); run.progression=xp.state;
  if(xp.levelsGained.includes(3)&&!run.technique) run.technique=run.policy==="greedy"?"long-odds":"steady-hand";
  if(spoils!==null){
    const draft=generateLootDraft(spoils,floor1ItemRegistry,run.inventory,run.rng.stream("loot"),enemy.rewardBandUplift??0);
    run.stats.bands[draft.band]=(run.stats.bands[draft.band]??0)+1; run.stats.spoils.push(spoils); takeDraft(run,draft);
  }
}

function visitShop(run){
  run.stats.shops+=1;
  const threshold=run.policy==="safe"?.82:run.policy==="opportunist"?.55:.30;
  if(hpRatio(run)<threshold&&run.economy.coins>=4&&run.progression.hp<run.progression.maxHp){
    const result=buyHealing(run.economy,run.progression); run.economy=result.economy; run.progression=result.progression; run.stats.shopHeals+=1;
  }
  const stock=generateShopStock(floor1ItemRegistry,run.inventory,run.rng.stream("shop"));
  const offers=[stock.gear,...stock.artifacts,stock.contraband]
    .filter(o=>o.price<=run.economy.coins&&SUPPORTED_ITEMS.has(o.itemId))
    .sort((a,b)=>(utility(run.policy,b.itemId)-b.price*.12)-(utility(run.policy,a.itemId)-a.price*.12));
  if(offers[0]&&utility(run.policy,offers[0].itemId)>=6){
    run.economy=spendCoins(run.economy,offers[0].price); acquire(run,offers[0].itemId); run.stats.shopItems+=1;
  }
}

function roomPriority(run,type){
  if(run.policy==="greedy") return ({ELITE:100,COMBAT:80,EVENT:30,SHOP:hpRatio(run)<.3?90:10})[type]??0;
  if(run.policy==="safe") return ({SHOP:hpRatio(run)<.82?100:55,EVENT:70,COMBAT:60,ELITE:5})[type]??0;
  return ({ELITE:hpRatio(run)>=.74?100:20,SHOP:hpRatio(run)<.56?95:45,COMBAT:75,EVENT:55})[type]??0;
}

function chooseReachable(run,graph,current,row){
  const candidates=graph.nodes.filter(n=>n.row===row&&(row===0||graph.edges.some(e=>e.from===current.id&&e.to===n.id)));
  return candidates.toSorted((a,b)=>roomPriority(run,b.type)-roomPriority(run,a.type)||a.id.localeCompare(b.id))[0];
}

function makeRun(seed,policy){
  return {
    seed,policy,rng:new RngService(seed),progression:createProgression(20),economy:createEconomy(0),
    inventory:createInventory({ARMOR:"work-apron"}),technique:null,
    history:[],stats:{rounds:0,damageTaken:0,hpBeforeCombat:20,bands:{},spoils:[],itemsTaken:{},shops:0,shopHeals:0,shopItems:0,draftSkips:0,events:0,elites:0,unsupportedEvents:0},
  };
}

export function simulateFloor(seed,policy="opportunist"){
  const run=makeRun(seed,policy);
  const graph=generateRun(seed,[thresholdsFloor]).floors[0];
  let current=null;
  for(let row=0;row<thresholdsFloor.rows.length&&run.progression.hp>0;row+=1){
    const node=chooseReachable(run,graph,current,row); if(!node) throw new Error(`No reachable row ${row}`); current=node;
    if(node.type==="COMBAT"||node.type==="ELITE"){
      const pool=node.type==="ELITE"?floor1Elites:floor1NormalEnemies;
      const enemy=selectEncounter(pool,run.history,run.rng.stream("encounter"));
      run.history.push({enemyId:enemy.id,instinct:enemy.instinct}); if(enemy.elite) run.stats.elites+=1;
      run.stats.hpBeforeCombat=run.progression.hp;
      const result=combat(run,enemy); if(!result.win) break; rewardCombat(run,enemy,result.spoils);
    } else if(node.type==="SHOP") visitShop(run);
    else if(node.type==="EVENT"){ run.stats.events+=1; run.stats.unsupportedEvents+=1; }
  }
  let clear=false;
  if(run.progression.hp>0){
    run.stats.hpBeforeCombat=run.progression.hp;
    const result=combat(run,bossPhaseAsEnemy(firstDoor,firstDoor.maxHp),{boss:true});
    clear=result.win;
    if(clear){ run.economy=addCoins(run.economy,firstDoor.coins); run.progression=grantXp(run.progression,firstDoor.xp).state; run.progression={...run.progression,hp:Math.min(run.progression.maxHp,run.progression.hp+firstDoor.clearHeal)}; }
  }
  return {
    seed,policy,clear,hp:run.progression.hp,maxHp:run.progression.maxHp,level:run.progression.level,xp:run.progression.xp,coins:run.economy.coins,
    rounds:run.stats.rounds,damageTaken:run.stats.damageTaken,bands:run.stats.bands,spoils:run.stats.spoils,
    shops:run.stats.shops,elites:run.stats.elites,itemsTaken:run.stats.itemsTaken,unsupportedEvents:run.stats.unsupportedEvents,
  };
}

export function summarize(rows){
  const bands={1:0,2:0,3:0,4:0}; let spoils=[];
  for(const row of rows){ for(const [k,v] of Object.entries(row.bands)) bands[k]+=v; spoils.push(...row.spoils); }
  const bandTotal=Object.values(bands).reduce((a,b)=>a+b,0)||1;
  const avg=(f)=>rows.reduce((s,r)=>s+f(r),0)/rows.length;
  return {
    runs:rows.length,clearRate:avg(r=>r.clear?1:0),avgFinalHp:avg(r=>r.hp),avgDamageTaken:avg(r=>r.damageTaken),avgRounds:avg(r=>r.rounds),
    avgLevel:avg(r=>r.level),avgCoins:avg(r=>r.coins),avgElites:avg(r=>r.elites),avgShops:avg(r=>r.shops),avgSpoils:spoils.length?spoils.reduce((a,b)=>a+b,0)/spoils.length:0,
    bandFrequency:Object.fromEntries(Object.entries(bands).map(([k,v])=>[k,v/bandTotal])),unsupportedEventVisits:rows.reduce((s,r)=>s+r.unsupportedEvents,0),
  };
}

export function batch({runs=1000,seedBase=100000}={}){
  const output={};
  for(const policy of ["safe","opportunist","greedy"]){
    const rows=Array.from({length:runs},(_,i)=>simulateFloor(seedBase+i+(policy==="safe"?0:policy==="opportunist"?1_000_000:2_000_000),policy));
    output[policy]=summarize(rows);
  }
  return output;
}
