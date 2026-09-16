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

const pretty=(id:string)=>id.split(":").at(-1)!.split("-").map((part)=>part.charAt(0).toUpperCase()+part.slice(1)).join(" ");

const PIPS:Record<DieValue,readonly [number,number][]>={
  1:[[0,0]],
  2:[[-1,-1],[1,1]],
  3:[[-1,-1],[0,0],[1,1]],
  4:[[-1,-1],[1,-1],[-1,1],[1,1]],
  5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],
  6:[[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1]],
};

type DieStateVisual="neutral"|"fight"|"spoils"|"enemy"|"fixed"|"locked";

export class CombatScene extends Scene {
  private enemy!:EnemyDefinition;
  private state!:CombatState;
  private effectState!:EffectState;
  private reactionState!:ManipulationReactionState;
  private roundEffects:EffectDefinition[]=[];
  private selected:DieId[]=[];
  private bumpUsesLeft=1;
  private finalSpoils:number|null=null;
  private activeUses=new Set<string>();
  private suppressEnemyRules=false;
  private manipulationCount=0;
  private ashLedgerTriggered=false;
  private caliperUsed=false;
  private carriedDie:DieValue|null=null;
  private awaitingCarryChoice=false;

  private playerDiceViews:Phaser.GameObjects.Container[]=[];
  private enemyDiceViews:Phaser.GameObjects.Container[]=[];
  private toolObjects:Phaser.GameObjects.GameObject[]=[];
  private carryPromptObjects:Phaser.GameObjects.GameObject[]=[];

  private playerHpFill!:Phaser.GameObjects.Rectangle;
  private enemyHpFill!:Phaser.GameObjects.Rectangle;
  private playerHpText!:Phaser.GameObjects.Text;
  private enemyHpText!:Phaser.GameObjects.Text;
  private enemyNameText!:Phaser.GameObjects.Text;
  private roundText!:Phaser.GameObjects.Text;
  private statusText!:Phaser.GameObjects.Text;
  private fightText!:Phaser.GameObjects.Text;
  private enemyFightText!:Phaser.GameObjects.Text;
  private marginText!:Phaser.GameObjects.Text;
  private spoilsText!:Phaser.GameObjects.Text;
  private bumpText!:Phaser.GameObjects.Text;
  private commitButton!:Phaser.GameObjects.Container;

  private w=0;
  private h=0;
  private portrait=false;

  constructor(){super("CombatScene");}

  create():void {
    if(!clientRun.currentEnemy){this.scene.start("DescentScene");return;}
    this.w=this.scale.width;this.h=this.scale.height;this.portrait=this.h>=this.w;
    this.enemy=clientRun.currentEnemy;
    this.createEnvironment();
    this.createHud();
    this.createControls();
    this.startEncounter();
  }

  private createEnvironment():void {
    const w=this.w,h=this.h;
    this.add.rectangle(w/2,h/2,w,h,0x0b0e12);
    this.add.rectangle(w/2,h*0.26,w,h*0.44,0x162129);
    this.add.rectangle(w/2,h*0.46,w,h*0.03,0x101519);

    const doorW=Math.min(w*0.56,300),doorH=Math.min(h*0.25,250),doorY=h*0.23;
    this.add.rectangle(w/2,doorY,doorW+28,doorH+24,0x2b3034);
    this.add.rectangle(w/2,doorY,doorW,doorH,0x0f1418).setStrokeStyle(Math.max(2,w*0.005),0x505b62);
    this.add.rectangle(w/2,doorY,doorW*0.58,doorH*0.78,0x3a1821,0.28);

    // Temporary enemy silhouette: less literal than the old block-man placeholder.
    const creatureW=Math.min(w*0.18,94),creatureH=Math.min(h*0.16,150),cy=h*0.255;
    this.add.rectangle(w/2,cy,creatureW,creatureH,0x353838).setStrokeStyle(4,0x8d6244);
    this.add.rectangle(w/2,cy-creatureH*0.22,creatureW*0.58,creatureH*0.28,0x111619).setStrokeStyle(2,0x8d6244);
    this.add.circle(w/2-creatureW*0.18,cy-creatureH*0.22,Math.max(3,creatureW*0.055),0xe4c368);
    this.add.circle(w/2+creatureW*0.18,cy-creatureH*0.22,Math.max(3,creatureW*0.055),0xe4c368);

    this.add.text(w*0.05,h*0.025,"AS ABOVE, ROLL BELOW",{fontFamily:"Georgia, serif",fontSize:`${Math.max(22,Math.min(36,w*0.065))}px`,color:"#eee6d5"});
    this.add.text(w*0.95,h*0.03,`DEPTH ${String(clientRun.currentDepth).padStart(2,"0")}`,{fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(15,w*0.027))}px`,color:"#d5b45e"}).setOrigin(1,0);
    this.enemyNameText=this.add.text(w/2,h*0.115,"",{fontFamily:"Georgia, serif",fontSize:`${Math.max(19,Math.min(27,w*0.052))}px`,color:"#eee6d5"}).setOrigin(0.5);
  }

  private createHud():void {
    const w=this.w,h=this.h;
    const barW=w*0.42,barH=Math.max(10,h*0.013);

    this.add.text(w*0.05,h*0.073,"DELVER",{fontFamily:"monospace",fontSize:"10px",color:"#7f8b92"});
    this.add.rectangle(w*0.05+barW/2,h*0.098,barW,barH,0x090b0e).setStrokeStyle(1,0x574448);
    this.playerHpFill=this.add.rectangle(w*0.05,h*0.098,barW-2,barH-2,0xd94360).setOrigin(0,0.5);
    this.playerHpText=this.add.text(w*0.05+barW/2,h*0.119,"",{fontFamily:"monospace",fontSize:"10px",color:"#bfc7ca"}).setOrigin(0.5);

    this.add.rectangle(w/2,h*0.352,barW,barH,0x090b0e).setStrokeStyle(1,0x574448);
    this.enemyHpFill=this.add.rectangle(w/2-barW/2+1,h*0.352,barW-2,barH-2,0xd94360).setOrigin(0,0.5);
    this.enemyHpText=this.add.text(w/2,h*0.373,"",{fontFamily:"monospace",fontSize:"10px",color:"#bfc7ca"}).setOrigin(0.5);

    this.roundText=this.add.text(w/2,h*0.405,"",{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(13,w*0.025))}px`,color:"#8e9aa2",align:"center",wordWrap:{width:w*0.9}}).setOrigin(0.5);
    this.statusText=this.add.text(w/2,h*0.455,"",{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(13,w*0.025))}px`,color:"#cbd2d4",align:"center",wordWrap:{width:w*0.88},lineSpacing:3}).setOrigin(0.5);

    const metricY=h*0.705,metricW=w*0.21;
    [["FIGHT",0.145],["ENEMY",0.38],["MARGIN",0.615],["SPOILS",0.85]].forEach(([label,xFrac])=>{
      const x=w*Number(xFrac);this.add.rectangle(x,metricY,metricW,h*0.073,0x11171d).setStrokeStyle(1,0x34404a);
      this.add.text(x,metricY-h*0.024,String(label),{fontFamily:"monospace",fontSize:"9px",color:"#8f9ba3"}).setOrigin(0.5);
    });
    this.fightText=this.metricText(w*0.145,metricY+h*0.012);
    this.enemyFightText=this.metricText(w*0.38,metricY+h*0.012);
    this.marginText=this.metricText(w*0.615,metricY+h*0.012);
    this.spoilsText=this.metricText(w*0.85,metricY+h*0.012,"#e2bc65");
  }

  private metricText(x:number,y:number,color="#eee6d5"):Phaser.GameObjects.Text{return this.add.text(x,y,"—",{fontFamily:"monospace",fontSize:`${Math.max(18,Math.min(24,this.w*0.05))}px`,color}).setOrigin(0.5);}

  private createControls():void {
    const w=this.w,h=this.h;
    const gap=Math.max(8,w*0.018),small=(w*0.22-gap),commit=w*0.42;
    this.makeButton(w*0.14,h*0.935,small,Math.max(44,h*0.055),"BUMP −",()=>this.applyBump(-1));
    this.makeButton(w*0.38,h*0.935,small,Math.max(44,h*0.055),"BUMP +",()=>this.applyBump(1));
    this.commitButton=this.makeButton(w*0.76,h*0.935,commit,Math.max(50,h*0.062),"COMMIT TWO",()=>this.commitSelection(),0x48212b,0xd94360);
    this.bumpText=this.add.text(w*0.26,h*0.892,"",{fontFamily:"monospace",fontSize:"9px",color:"#7f8b92"}).setOrigin(0.5);
  }

  private makeButton(x:number,y:number,width:number,height:number,label:string,handler:()=>void,fill=0x232b31,stroke=0x58656e):Phaser.GameObjects.Container {
    const bg=this.add.rectangle(0,0,width,height,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});
    const text=this.add.text(0,0,label,{fontFamily:"monospace",fontSize:`${Math.max(9,Math.min(12,width*0.06))}px`,color:"#eee6d5",align:"center",wordWrap:{width:width*0.9}}).setOrigin(0.5);
    const c=this.add.container(x,y,[bg,text]);bg.on("pointerdown",handler);return c;
  }

  private startEncounter():void {
    this.enemy=clientRun.enemyForHp(clientRun.currentEnemy!.maxHp);
    this.state=createCombatFromPlayerState({hp:clientRun.state.progression.hp,maxHp:clientRun.state.progression.maxHp},this.enemy);
    this.effectState=createEffectState();this.bumpUsesLeft=clientRun.hasTechnique("steady-hand")?2:1;this.finalSpoils=null;this.selected=[];this.activeUses.clear();this.ashLedgerTriggered=false;this.caliperUsed=false;this.carriedDie=null;this.awaitingCarryChoice=false;this.clearCarryPrompt();
    this.statusText.setText(`SEED ${clientRun.currentSeed} • Enemy casts first.`);this.beginRound();
  }

  private beginRound():void {
    this.enemy=clientRun.enemyForHp(this.state.enemy.hp);
    let started=startRound(this.state,this.enemy,clientRun.stream("combat:enemy"),clientRun.stream("combat:player")).state;
    let carried="";
    if(this.carriedDie!==null){const value=this.carriedDie;started=injectCarriedDie(started,value);this.carriedDie=null;carried=` • Stuck Key carries ${value}`;}
    this.suppressEnemyRules=false;this.manipulationCount=0;
    const constraints=(this.enemy.ruleIds??[]).map((id)=>floor1CastConstraintRegistry[id]).filter((v)=>v!==undefined);
    if(constraints.length)started=applyPlayerCastConstraints(started,constraints).state;
    this.state=started;this.reactionState=createManipulationReactionState(this.state.round);this.roundEffects=[...clientRun.combatEffects(this.enemy,true)];this.selected=[];
    this.statusText.setText(`${pretty(this.enemy.id)} locks ${this.state.enemyLocked.join(" + ")}${carried}. Choose two Fight Dice.`);this.renderAll();
  }

  private renderAll():void {
    this.enemyNameText.setText(pretty(this.enemy.id).toUpperCase());this.renderHp();this.renderDice();this.renderTools();this.updatePreview();
    this.roundText.setText(`ROUND ${this.state.round} • ${this.enemy.instinct} • FIELD ADJUSTMENT ${this.bumpUsesLeft>0?"READY":"SPENT"}`);
    this.bumpText.setText(`FIELD ADJUSTMENT ${this.bumpUsesLeft}`);this.commitButton.setAlpha(this.selected.length===2&&!this.awaitingCarryChoice?1:0.42);
  }

  private renderHp():void {
    const barW=this.w*0.42;
    this.playerHpFill.displayWidth=(barW-2)*(this.state.player.hp/this.state.player.maxHp);
    this.enemyHpFill.displayWidth=(barW-2)*(this.state.enemy.hp/this.state.enemy.maxHp);
    this.playerHpText.setText(`${this.state.player.hp}/${this.state.player.maxHp} HP • LV ${clientRun.state.progression.level} • ¢ ${clientRun.state.economy.coins}`);
    this.enemyHpText.setText(`${this.state.enemy.hp}/${this.state.enemy.maxHp} HP`);
  }

  private destroyDice():void {for(const view of[...this.playerDiceViews,...this.enemyDiceViews])view.destroy();this.playerDiceViews=[];this.enemyDiceViews=[];}

  private renderDice():void {
    this.destroyDice();const w=this.w,h=this.h;
    const enemySize=Math.max(42,Math.min(58,w*0.13)),enemyGap=enemySize*1.28,enemyStart=w/2-(this.state.enemyLocked.length-1)*enemyGap/2;
    this.state.enemyLocked.forEach((value,index)=>this.enemyDiceViews.push(this.drawDie(enemyStart+index*enemyGap,h*0.405,enemySize,value,"enemy",false)));

    const dieSize=Math.max(58,Math.min(82,w*0.19)),gap=Math.max(6,Math.min(14,w*0.025));
    const total=dieSize*4+gap*3,start=w/2-total/2+dieSize/2;
    this.state.playerRoll.forEach((die,index)=>{
      const selected=this.selected.includes(die.id);let visual:DieStateVisual=selected?"fight":this.selected.length===2?"spoils":"neutral";
      if(die.fixed)visual="fixed";else if(die.locked)visual="locked";
      const view=this.drawDie(start+index*(dieSize+gap),h*0.585,dieSize,die.value,visual,true);
      view.on("pointerdown",()=>this.toggleDie(die.id));this.playerDiceViews.push(view);
    });
  }

  private drawDie(x:number,y:number,size:number,value:DieValue,state:DieStateVisual,interactive:boolean):Phaser.GameObjects.Container {
    const g=this.add.graphics();const half=size/2,corner=Math.max(5,size*0.1),player=state!=="enemy";
    const outline=player?0x342a25:0x141719,face=player?0xd7c39a:0x363535,hi=player?0xeee0bd:0x565451,lo=player?0xa88c68:0x202325,pip=player?0x24201d:0xe9d9af;
    g.fillStyle(0x000000,0.28);g.fillRoundedRect(-half+3,-half+6,size-6,size-4,corner);
    g.fillStyle(outline,1);g.fillRoundedRect(-half,-half,size,size,corner);
    g.fillStyle(face,1);g.fillRoundedRect(-half+4,-half+4,size-8,size-8,Math.max(3,corner-2));
    g.fillStyle(hi,0.8);g.fillRect(-half+7,-half+7,size-14,Math.max(2,size*0.035));g.fillRect(-half+7,-half+7,Math.max(2,size*0.035),size-14);
    g.fillStyle(lo,0.9);g.fillRect(-half+7,half-10,size-14,Math.max(2,size*0.035));g.fillRect(half-10,-half+7,Math.max(2,size*0.035),size-14);
    const grid=size*0.22,r=Math.max(3,size*0.055);g.fillStyle(pip,1);for(const [px,py] of PIPS[value])g.fillCircle(px*grid,py*grid,r);
    if(player){g.fillStyle(0xb37b45,1);const p=Math.max(3,size*0.055);for(const [cx,cy] of [[-1,-1],[1,-1],[-1,1],[1,1]] as const)g.fillRect(cx*(half-p*1.6)-p/2,cy*(half-p*1.6)-p/2,p,p);}
    const frame=state==="fight"?0xd94360:state==="spoils"?0xd8a43d:state==="enemy"||state==="locked"?0x3cc4bd:state==="fixed"?0xaa5965:null;
    if(frame!==null){g.lineStyle(Math.max(2,size*0.045),frame,1);g.strokeRoundedRect(-half-2,-half-2,size+4,size+4,corner+2);}
    if(state==="locked"){g.fillStyle(0x3cc4bd,1);g.fillRect(-half+3,-5,4,10);g.fillRect(half-7,-5,4,10);}
    if(state==="fixed"){g.lineStyle(Math.max(2,size*0.035),0xaa5965,0.9);g.lineBetween(-half+9,half-9,half-9,-half+9);}
    const c=this.add.container(x,y,[g]).setSize(size,size);
    if(interactive)c.setInteractive(new Phaser.Geom.Rectangle(-half,-half,size,size),Phaser.Geom.Rectangle.Contains,{useHandCursor:true});
    return c;
  }

  private renderTools():void {
    for(const obj of this.toolObjects)obj.destroy();this.toolObjects=[];
    const ids=[...new Set(ownedItemIds(clientRun.state.inventory).filter((id)=>floor1ItemActionRegistry[id]?.combat))];
    const entries:{label:string;fn:()=>void;disabled?:boolean}[]=[];
    for(const id of ids){const def=floor1ItemActionRegistry[id]!,item=floor1ItemRegistry[id]!;const spent=!def.consumeOnUse&&this.activeUses.has(id);if(id==="blank-face"){entries.push({label:"BLANK→1",fn:()=>this.useTool(id,1),disabled:spent},{label:"BLANK→6",fn:()=>this.useTool(id,6),disabled:spent});continue;}const count=clientRun.state.inventory.contraband.filter((v)=>v===id).length;entries.push({label:`${item.displayName}${def.consumeOnUse&&count>1?` ×${count}`:spent?" • SPENT":""}`,fn:()=>this.useTool(id),disabled:spent});}
    if(ownedItemIds(clientRun.state.inventory).includes("brass-caliper")){
      if(this.caliperUsed)entries.push({label:"Caliper • SPENT",fn:()=>{},disabled:true});
      else if(this.selected.length===2){const s=this.currentSpoilsDice();if(s)entries.push({label:`CAL ${s[0].value}−`,fn:()=>this.applyCaliper(0,-1)},{label:`CAL ${s[0].value}+`,fn:()=>this.applyCaliper(0,1)},{label:`CAL ${s[1].value}−`,fn:()=>this.applyCaliper(1,-1)},{label:`CAL ${s[1].value}+`,fn:()=>this.applyCaliper(1,1)});}
      else entries.push({label:"CALIPER • PICK FIGHT",fn:()=>{},disabled:true});
    }
    if(!entries.length)return;
    const cols=this.portrait?2:Math.min(4,entries.length),gap=6,pad=this.w*0.05,buttonW=(this.w-pad*2-gap*(cols-1))/cols,buttonH=Math.max(28,this.h*0.033),startY=this.h*0.765;
    entries.slice(0,this.portrait?6:8).forEach((entry,index)=>{const col=index%cols,row=Math.floor(index/cols),x=pad+buttonW/2+col*(buttonW+gap),y=startY+row*(buttonH+5);this.toolObjects.push(this.toolButton(x,y,buttonW,buttonH,entry.label,entry.fn,entry.disabled));});
  }

  private toolButton(x:number,y:number,w:number,h:number,label:string,fn:()=>void,disabled=false):Phaser.GameObjects.Container {const bg=this.add.rectangle(0,0,w,h,0x172027).setStrokeStyle(1,disabled?0x333b40:0x516069);const text=this.add.text(0,0,label,{fontFamily:"monospace",fontSize:`${Math.max(8,Math.min(10,w*0.06))}px`,color:disabled?"#606970":"#d8d2c7",align:"center",wordWrap:{width:w*0.92}}).setOrigin(0.5);const c=this.add.container(x,y,[bg,text]);if(!disabled){bg.setInteractive({useHandCursor:true});bg.on("pointerdown",fn);}return c;}

  private toggleDie(id:DieId):void {if(this.awaitingCarryChoice)return;const i=this.selected.indexOf(id);if(i>=0)this.selected.splice(i,1);else if(this.selected.length<2)this.selected.push(id);this.renderAll();}
  private selectedTuple():readonly[DieId,DieId]|null{return this.selected.length===2?[this.selected[0]!,this.selected[1]!]:null;}
  private currentSpoilsDice():readonly[CombatState["playerRoll"][number],CombatState["playerRoll"][number]]|null {const fight=new Set(this.selected),spoils=this.state.playerRoll.filter((die)=>!fight.has(die.id));return spoils.length===2?[spoils[0]!,spoils[1]!]:null;}

  private updatePreview():void {
    const ids=this.selectedTuple();this.enemyFightText.setText(String(this.state.enemyLocked.reduce((sum,value)=>sum+value,0)));
    if(!ids){this.fightText.setText("—");this.marginText.setText("—").setColor("#eee6d5");this.spoilsText.setText("—");return;}
    const p=previewCommitWithEffects(this.state,ids,this.roundEffects,this.effectState);this.fightText.setText(String(p.finalFight));this.marginText.setText(p.margin>0?`+${p.margin}`:String(p.margin));this.marginText.setColor(p.margin>0?"#78d9c8":p.margin<0?"#f47c92":"#eee6d5");this.spoilsText.setText(String(p.finalSpoilsScore));
  }

  private reactionDefinitions(){return this.suppressEnemyRules?[]:(this.enemy.ruleIds??[]).map((id)=>floor1ManipulationReactionRegistry[id]).filter((v)=>v!==undefined);}
  private resolveManipulation(next:CombatState):CombatState {const r=reactToPlayerManipulation(next,this.reactionDefinitions(),this.reactionState,true);this.reactionState=r.reactionState;this.roundEffects.push(...r.addedEffects);this.manipulationCount+=1;return r.combatState;}

  private applyBump(delta:-1|1):void {if(this.awaitingCarryChoice||this.bumpUsesLeft<=0||!this.selected.length)return;const id=this.selected.at(-1)!,die=this.state.playerRoll.find((d)=>d.id===id);if(!die||die.fixed||die.locked)return;const value=bump(die.value,delta);if(value===die.value)return;this.state=this.resolveManipulation(updatePlayerDie(this.state,withValue(die,value)));this.bumpUsesLeft-=1;this.statusText.setText(`Field Adjustment: ${die.value} → ${value}.`);this.renderAll();}

  private applyCaliper(index:0|1,delta:-1|1):void {if(this.awaitingCarryChoice||this.caliperUsed)return;const spoils=this.currentSpoilsDice();if(!spoils){this.statusText.setText("Choose two Fight Dice first.");return;}const target=spoils[index];if(target.fixed||target.locked)return;const value=bump(target.value,delta);if(value===target.value)return;const pair:[DieValue,DieValue]=[spoils[0].value,spoils[1].value],desired:[DieValue,DieValue]=index===0?[value,pair[1]]:[pair[0],value];if(!brassCaliperOptions(pair).some((o)=>o[0]===desired[0]&&o[1]===desired[1]))return;this.state=this.resolveManipulation(updatePlayerDie(this.state,withValue(target,value)));this.caliperUsed=true;this.statusText.setText(`Brass Caliper: ${target.value} → ${value}.`);this.renderAll();}

  private useTool(id:string,chosenValue?:1|6):void {
    if(this.awaitingCarryChoice)return;const def=floor1ItemActionRegistry[id],item=floor1ItemRegistry[id];if(!def?.combat||!item||(!def.consumeOnUse&&this.activeUses.has(id)))return;const action=def.combat;
    if(action.type==="SUPPRESS_ENEMY_RULES_ROUND"){if(this.enemy.id.includes("first-door")){this.statusText.setText("Boss phase rules cannot be enjoined.");return;}if(this.manipulationCount>0){this.statusText.setText("Use Temporary Injunction before manipulating this cast.");return;}const r=applyCombatItemAction(this.state,action);this.suppressEnemyRules=r.suppressEnemyRules;this.state={...r.state,playerRoll:r.state.playerRoll.map((die)=>withFixed(die,false))};this.roundEffects=[...clientRun.combatEffects(this.enemy,false)];if(def.consumeOnUse)clientRun.consumeContrabandItem(id);this.renderAll();return;}
    let result;const targetId=this.selected.at(-1),sourceId=this.selected[0];
    try{if(action.type==="REROLL_PLAYER_DIE"){if(!targetId)throw new Error("Select a target die first");result=applyCombatItemAction(this.state,action,{targetDieId:targetId},clientRun.stream(`item:${id}:r${this.state.round}`));}else if(action.type==="SET_PLAYER_DIE"||action.type==="FLIP_PLAYER_DIE"){if(!targetId)throw new Error("Select a target die first");result=applyCombatItemAction(this.state,action,{targetDieId:targetId});}else if(action.type==="TRANSMUTE_PLAYER_DIE"){if(!targetId||chosenValue===undefined)throw new Error("Select a target die first");result=applyCombatItemAction(this.state,action,{targetDieId:targetId,chosenValue});}else if(action.type==="COPY_PLAYER_DIE"){if(this.selected.length!==2)throw new Error("Select SOURCE then TARGET dice");result=applyCombatItemAction(this.state,action,{sourceDieId:sourceId,targetDieId:targetId});}else if(action.type==="LOWER_HIGHEST_ENEMY_DIE"){if((this.enemy.ruleIds??[]).includes("rule:first-door:sealed"))throw new Error("SEALED prevents enemy-die interference");result=applyCombatItemAction(this.state,action);}else return;}catch(error){this.statusText.setText(error instanceof Error?error.message:String(error));return;}
    this.state=this.resolveManipulation(result.state);if(def.consumeOnUse)clientRun.consumeContrabandItem(id);else this.activeUses.add(id);this.statusText.setText(`${item.displayName} used.`);this.renderAll();
  }

  private commitSelection():void {
    if(this.awaitingCarryChoice)return;const ids=this.selectedTuple();if(!ids)return;const result=commitWithEffects(this.state,ids,this.roundEffects,this.effectState);this.state=result.state;this.effectState=result.effectState;this.selected=[];
    let playerDamage=0;for(const event of result.events)if(event.type==="damage"&&event.target==="player")playerDamage+=event.amount;const ledger=ashLedgerCoinAward(ownedItemIds(clientRun.state.inventory).includes("ash-ledger"),this.ashLedgerTriggered,playerDamage);this.ashLedgerTriggered=ledger.triggered;if(ledger.coins)clientRun.grantCoins(ledger.coins);
    const qualified=result.events.find((event)=>event.type==="spoils_qualified");if(this.state.enemy.hp===0&&qualified)this.finalSpoils=qualified.score;
    if(result.preview.margin>0)this.statusText.setText(`WIN +${result.preview.margin} • ${result.preview.damageToEnemy} damage • Spoils ${result.preview.finalSpoilsScore}`);else if(result.preview.margin<0)this.statusText.setText(`LOSS ${result.preview.margin} • ${result.preview.damageToPlayer} damage`);else this.statusText.setText("TIE • authored effects resolved.");this.renderAll();
    if(this.state.phase==="ENCOUNTER_VICTORY"){clientRun.finishCombatVictory(this.state.player.hp,this.finalSpoils);this.time.delayedCall(420,()=>this.scene.start("LootScene"));return;}
    if(this.state.phase==="ENCOUNTER_DEFEAT"){clientRun.finishCombatDefeat(this.state.player.hp);this.time.delayedCall(420,()=>this.scene.start("DescentScene"));return;}
    if(qualified&&result.preview.margin>0&&ownedItemIds(clientRun.state.inventory).includes("stuck-key")){this.showStuckKeyChoice(qualified.values);return;}
    this.time.delayedCall(420,()=>this.beginRound());
  }

  private showStuckKeyChoice(values:readonly[DieValue,DieValue]):void {
    this.awaitingCarryChoice=true;const w=this.w,h=this.h;this.statusText.setText("Stuck Key: carry one successful Spoils face into the next cast?");
    const shade=this.add.rectangle(w/2,h/2,w,h,0x050709,0.78).setDepth(100).setInteractive();const panel=this.add.rectangle(w/2,h*0.52,w*0.86,Math.min(h*0.33,310),0x151b20).setStrokeStyle(2,0x967449).setDepth(101);const title=this.add.text(w/2,h*0.43,"STUCK KEY",{fontFamily:"Georgia, serif",fontSize:`${Math.max(24,Math.min(30,w*0.06))}px`,color:"#eee6d5"}).setOrigin(0.5).setDepth(102);this.carryPromptObjects.push(shade,panel,title);
    const unique=[...new Set(values)] as DieValue[];unique.forEach((value,index)=>{const x=w*(unique.length===1?0.5:0.35+index*0.3);const b=this.makeButton(x,h*0.54,w*0.24,48,`CARRY ${value}`,()=>this.resolveStuckKeyChoice(value),0x26312f,0x659382).setDepth(102);this.carryPromptObjects.push(b);});const decline=this.makeButton(w/2,h*0.64,w*0.42,44,"DON'T CARRY",()=>this.resolveStuckKeyChoice(null),0x242a2f,0x5d6970).setDepth(102);this.carryPromptObjects.push(decline);
  }

  private resolveStuckKeyChoice(value:DieValue|null):void {this.carriedDie=value;this.awaitingCarryChoice=false;this.clearCarryPrompt();this.time.delayedCall(160,()=>this.beginRound());}
  private clearCarryPrompt():void {for(const object of this.carryPromptObjects)object.destroy();this.carryPromptObjects=[];}
}
