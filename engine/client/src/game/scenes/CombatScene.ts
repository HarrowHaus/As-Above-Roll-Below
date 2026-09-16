import { Scene } from "phaser";
import {
  applyPlayerCastConstraints,
  bump,
  commitWithEffects,
  createCombatFromPlayerState,
  createEffectState,
  createManipulationReactionState,
  floor1CastConstraintRegistry,
  floor1ManipulationReactionRegistry,
  previewCommitWithEffects,
  reactToPlayerManipulation,
  startRound,
  updatePlayerDie,
  withValue,
  type CombatState,
  type DieId,
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
const PLAYER_DIE_FRAMES = [0,1,2,3,4,5] as const;
const ENEMY_DIE_FRAMES = [6,7,8,9,10,11] as const;
const OVERLAY_FIGHT = 13;
const OVERLAY_SPOILS = 14;
const OVERLAY_LOCKED = 15;

interface DieView { base:Phaser.GameObjects.Sprite; overlay:Phaser.GameObjects.Sprite|null; }

function displayName(id:string):string {
  return id.split(":").at(-1)!.split("-").map((part)=>part.charAt(0).toUpperCase()+part.slice(1)).join(" ");
}

export class CombatScene extends Scene {
  private enemy!:EnemyDefinition;
  private state!:CombatState;
  private effectState!:EffectState;
  private reactionState!:ManipulationReactionState;
  private roundEffects:EffectDefinition[]=[];
  private selected:DieId[]=[];
  private bumpUsesLeft=1;
  private finalSpoils:number|null=null;
  private playerDiceViews:DieView[]=[];
  private enemyDiceViews:DieView[]=[];
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

  constructor(){super("CombatScene");}

  preload():void {
    if(!this.textures.exists("dice-v1"))this.load.spritesheet("dice-v1",diceAtlasUrl,{frameWidth:48,frameHeight:48});
  }

  create():void {
    if(!clientRun.currentEnemy){this.scene.start("MapScene");return;}
    this.enemy=clientRun.currentEnemy;
    this.createEnvironment();this.createHud();this.createControls();this.startEncounter();
  }

  private createEnvironment():void {
    this.add.rectangle(640,360,1280,720,0x0b0e12);this.add.rectangle(640,305,1280,470,0x172027);this.add.rectangle(640,520,1280,210,0x101519);this.add.rectangle(640,525,1280,4,0x3c4447);
    this.add.rectangle(640,265,360,24,0x30363a);this.add.rectangle(470,340,24,175,0x30363a);this.add.rectangle(810,340,24,175,0x30363a);this.add.rectangle(640,350,300,230,0x101416).setStrokeStyle(3,0x566168);this.add.rectangle(640,350,180,180,0x351820,0.3);
    // Explicit temporary silhouettes until production sprites are committed.
    this.add.circle(260,340,27,0xd9c8a2);this.add.rectangle(260,420,72,130,0x493b37).setStrokeStyle(4,0xc34a5c);this.add.rectangle(230,438,18,100,0x282d31);this.add.rectangle(290,438,18,100,0x282d31);
    this.add.rectangle(1015,395,94,150,0x3e4141).setStrokeStyle(5,0x916141);this.add.rectangle(1015,350,54,38,0x121619).setStrokeStyle(3,0x916141);this.add.circle(995,350,6,0xe3c267);this.add.circle(1035,350,6,0xe3c267);this.add.rectangle(980,485,16,60,0x262b2d);this.add.rectangle(1050,485,16,60,0x262b2d);
    this.add.text(48,30,"AS ABOVE, ROLL BELOW",{fontFamily:"Georgia, serif",fontSize:"38px",color:"#eee6d5"});this.add.text(51,76,"E7 CLIENT • AUTHORITATIVE CORE COMBAT",{fontFamily:"monospace",fontSize:"13px",color:"#8f9ba3",letterSpacing:2});
    this.add.text(195,505,"THE DELVER",{fontFamily:"Georgia, serif",fontSize:"20px",color:"#eee6d5"});this.enemyNameText=this.add.text(956,505,"",{fontFamily:"Georgia, serif",fontSize:"20px",color:"#eee6d5"});
  }

  private createHud():void {
    this.add.rectangle(220,545,300,16,0x090b0e).setStrokeStyle(2,0x574448);this.playerHpFill=this.add.rectangle(72,545,296,12,0xd94360).setOrigin(0,0.5);this.playerHpText=this.add.text(220,566,"",{fontFamily:"monospace",fontSize:"13px",color:"#bfc7ca"}).setOrigin(0.5);
    this.add.rectangle(1060,545,300,16,0x090b0e).setStrokeStyle(2,0x574448);this.enemyHpFill=this.add.rectangle(912,545,296,12,0xd94360).setOrigin(0,0.5);this.enemyHpText=this.add.text(1060,566,"",{fontFamily:"monospace",fontSize:"13px",color:"#bfc7ca"}).setOrigin(0.5);
    this.roundText=this.add.text(640,105,"",{fontFamily:"monospace",fontSize:"15px",color:"#9ba7ad"}).setOrigin(0.5);this.statusText=this.add.text(640,485,"",{fontFamily:"monospace",fontSize:"15px",color:"#d3d8da",align:"center",wordWrap:{width:600}}).setOrigin(0.5);
    const y=620;for(const[x,label]of[[180,"FIGHT"],[350,"ENEMY"],[520,"MARGIN"],[690,"SPOILS"]]as const){this.add.rectangle(x,y,150,62,0x11171d).setStrokeStyle(1,0x34404a);this.add.text(x,y-18,label,{fontFamily:"monospace",fontSize:"11px",color:"#8f9ba3"}).setOrigin(0.5);}this.fightText=this.metricText(180,y+9);this.enemyFightText=this.metricText(350,y+9);this.marginText=this.metricText(520,y+9);this.spoilsText=this.metricText(690,y+9,"#e2bc65");
  }

  private metricText(x:number,y:number,color="#eee6d5"):Phaser.GameObjects.Text{return this.add.text(x,y,"—",{fontFamily:"monospace",fontSize:"24px",color}).setOrigin(0.5);}
  private createControls():void {this.makeButton(865,620,105,46,"BUMP −",()=>this.applyBump(-1));this.makeButton(985,620,105,46,"BUMP +",()=>this.applyBump(1));this.bumpText=this.add.text(925,660,"",{fontFamily:"monospace",fontSize:"11px",color:"#8f9ba3"}).setOrigin(0.5);this.commitButton=this.makeButton(1140,620,190,54,"COMMIT TWO",()=>this.commitSelection(),0x48212b,0xd94360);}
  private makeButton(x:number,y:number,width:number,height:number,label:string,handler:()=>void,fill=0x232b31,stroke=0x58656e):Phaser.GameObjects.Container {const bg=this.add.rectangle(0,0,width,height,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});const text=this.add.text(0,0,label,{fontFamily:"monospace",fontSize:"13px",color:"#eee6d5"}).setOrigin(0.5);const container=this.add.container(x,y,[bg,text]);bg.on("pointerdown",handler);bg.on("pointerover",()=>container.setScale(1.03));bg.on("pointerout",()=>container.setScale(1));return container;}

  private startEncounter():void {
    this.enemy=clientRun.enemyForHp(clientRun.currentEnemy!.maxHp);
    this.state=createCombatFromPlayerState({hp:clientRun.state.progression.hp,maxHp:clientRun.state.progression.maxHp},this.enemy);
    this.effectState=createEffectState();this.bumpUsesLeft=clientRun.technique==="steady-hand"?2:1;this.finalSpoils=null;this.selected=[];this.statusText.setText(`SEED ${clientRun.currentSeed} • Enemy casts first.`);this.beginRound();
  }

  private beginRound():void {
    this.enemy=clientRun.enemyForHp(this.state.enemy.hp);
    let started=startRound(this.state,this.enemy,clientRun.stream("combat:enemy"),clientRun.stream("combat:player")).state;
    const constraints=(this.enemy.ruleIds??[]).map((id)=>floor1CastConstraintRegistry[id]).filter((value)=>value!==undefined);if(constraints.length)started=applyPlayerCastConstraints(started,constraints).state;
    this.state=started;this.reactionState=createManipulationReactionState(this.state.round);this.roundEffects=[...clientRun.combatEffects(this.enemy)];this.selected=[];this.statusText.setText(`${displayName(this.enemy.id)} locks ${this.state.enemyLocked.join(" + ")}. Choose exactly two Fight Dice.`);this.renderAll();
  }

  private renderAll():void {this.enemyNameText.setText(displayName(this.enemy.id).toUpperCase());this.renderHp();this.renderDice();this.updatePreview();this.roundText.setText(`ROUND ${this.state.round} • ${this.enemy.instinct} • FIELD ADJUSTMENT ${this.bumpUsesLeft>0?"READY":"SPENT"}`);this.bumpText.setText(`Field Adjustment: ${this.bumpUsesLeft}`);this.commitButton.setAlpha(this.selected.length===2?1:0.45);}
  private renderHp():void {this.playerHpFill.displayWidth=296*(this.state.player.hp/this.state.player.maxHp);this.enemyHpFill.displayWidth=296*(this.state.enemy.hp/this.state.enemy.maxHp);this.playerHpText.setText(`${this.state.player.hp} / ${this.state.player.maxHp} HP`);this.enemyHpText.setText(`${this.state.enemy.hp} / ${this.state.enemy.maxHp} HP`);}
  private renderDice():void {for(const view of[...this.playerDiceViews,...this.enemyDiceViews]){view.base.destroy();view.overlay?.destroy();}this.playerDiceViews=[];this.enemyDiceViews=[];const start=420;this.state.playerRoll.forEach((die,index)=>{const x=start+index*125;const base=this.add.sprite(x,410,"dice-v1",PLAYER_DIE_FRAMES[die.value-1]).setScale(DIE_SCALE).setInteractive({useHandCursor:true});if(die.fixed)base.setTint(0x9b8585);if(die.locked)base.setTint(0x88b6b3);const selected=this.selected.includes(die.id),frame=selected?OVERLAY_FIGHT:this.selected.length===2?OVERLAY_SPOILS:null;const overlay=frame===null?null:this.add.sprite(x,410,"dice-v1",frame).setScale(DIE_SCALE);base.on("pointerdown",()=>this.toggleDie(die.id));this.playerDiceViews.push({base,overlay});});this.state.enemyLocked.forEach((value,index)=>{const x=945+index*115;const base=this.add.sprite(x,250,"dice-v1",ENEMY_DIE_FRAMES[value-1]).setScale(DIE_SCALE);const overlay=this.add.sprite(x,250,"dice-v1",OVERLAY_LOCKED).setScale(DIE_SCALE);this.enemyDiceViews.push({base,overlay});});}
  private toggleDie(id:DieId):void {const existing=this.selected.indexOf(id);if(existing>=0)this.selected.splice(existing,1);else if(this.selected.length<2)this.selected.push(id);this.renderAll();}
  private selectedTuple():readonly[DieId,DieId]|null{return this.selected.length===2?[this.selected[0]!,this.selected[1]!]:null;}
  private updatePreview():void {const ids=this.selectedTuple();this.enemyFightText.setText(String(this.state.enemyLocked.reduce((sum,value)=>sum+value,0)));if(!ids){this.fightText.setText("—");this.marginText.setText("—").setColor("#eee6d5");this.spoilsText.setText("—");return;}const p=previewCommitWithEffects(this.state,ids,this.roundEffects,this.effectState);this.fightText.setText(String(p.finalFight));this.marginText.setText(p.margin>0?`+${p.margin}`:String(p.margin));this.marginText.setColor(p.margin>0?"#78d9c8":p.margin<0?"#f47c92":"#eee6d5");this.spoilsText.setText(String(p.finalSpoilsScore));}

  private applyBump(delta:-1|1):void {
    if(this.bumpUsesLeft<=0||this.selected.length===0)return;const id=this.selected[this.selected.length-1]!,die=this.state.playerRoll.find((candidate)=>candidate.id===id);if(!die||die.fixed||die.locked)return;const value=bump(die.value,delta);if(value===die.value)return;
    let next=updatePlayerDie(this.state,withValue(die,value));const reactions=(this.enemy.ruleIds??[]).map((ruleId)=>floor1ManipulationReactionRegistry[ruleId]).filter((entry)=>entry!==undefined);const reaction=reactToPlayerManipulation(next,reactions,this.reactionState,true);next=reaction.combatState;this.reactionState=reaction.reactionState;this.roundEffects.push(...reaction.addedEffects);this.state=next;this.bumpUsesLeft-=1;this.statusText.setText(`Field Adjustment: ${die.value} → ${value}${reaction.log.length?" • enemy reacts":""}.`);this.renderAll();
  }

  private commitSelection():void {
    const ids=this.selectedTuple();if(!ids)return;const result=commitWithEffects(this.state,ids,this.roundEffects,this.effectState);this.state=result.state;this.effectState=result.effectState;this.selected=[];const qualified=result.events.find((event)=>event.type==="spoils_qualified");if(this.state.enemy.hp===0&&qualified)this.finalSpoils=qualified.score;
    if(result.preview.margin>0)this.statusText.setText(`WIN +${result.preview.margin} • ${result.preview.damageToEnemy} damage • Spoils ${result.preview.finalSpoilsScore}.`);else if(result.preview.margin<0)this.statusText.setText(`LOSS ${result.preview.margin} • ${result.preview.damageToPlayer} damage taken.`);else this.statusText.setText("TIE • authored tie effects resolved by core.");this.renderAll();
    if(this.state.phase==="ENCOUNTER_VICTORY"){const next=clientRun.finishCombatVictory(this.state.player.hp,this.finalSpoils);this.statusText.setText(`ENCOUNTER CLEARED • Final-Blow Spoils ${this.finalSpoils??2}.`);this.time.delayedCall(650,()=>this.scene.start(next==="LOOT"?"LootScene":"MapScene"));return;}
    if(this.state.phase==="ENCOUNTER_DEFEAT"){clientRun.finishCombatDefeat(this.state.player.hp);this.statusText.setText("THE BELOW KEEPS THE RECORD.");this.time.delayedCall(650,()=>this.scene.start("MapScene"));return;}
    this.time.delayedCall(650,()=>this.beginRound());
  }
}
