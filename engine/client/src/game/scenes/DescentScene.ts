import { Scene } from "phaser";
import { clientRun } from "../session.js";

const pretty=(id:string)=>id.split(":").at(-1)!.split("-").map((part)=>part.charAt(0).toUpperCase()+part.slice(1)).join(" ");

export class DescentScene extends Scene {
  constructor(){super("DescentScene");}

  create():void {
    const width=this.scale.width,height=this.scale.height;
    this.cameras.main.setBackgroundColor(0x0e12);
    const state=clientRun.state;

    if(state.phase==="RUN_DEATH"||state.phase==="RUN_VICTORY"){
      this.renderEnd(state.phase==="RUN_VICTORY",width,height);
      return;
    }

    if(state.phase!=="RUN_MAP"){
      this.routeCurrentPhase();
      return;
    }

    const next=clientRun.availableNodes[0];
    if(!next)throw new Error("Descent has no next Depth");
    const depth=state.visitedNodeIds.length+1;
    const total=clientRun.totalDepths;
    const revealed=clientRun.revealedEncounter(next.id);

    this.add.text(width/2,height*0.22,"AS ABOVE, ROLL BELOW",{
      fontFamily:"Georgia, serif",fontSize:`${Math.max(24,Math.min(44,width*0.075))}px`,color:"#eee6d5",align:"center"
    }).setOrigin(0.5);
    this.add.text(width/2,height*0.34,"FLOOR I — THRESHOLDS",{
      fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(16,width*0.028))}px`,color:"#8f9ba3",letterSpacing:2
    }).setOrigin(0.5);
    this.add.text(width/2,height*0.43,`DEPTH ${String(depth).padStart(2,"0")} / ${String(total).padStart(2,"0")}`,{
      fontFamily:"monospace",fontSize:`${Math.max(14,Math.min(22,width*0.04))}px`,color:"#d8b65f"
    }).setOrigin(0.5);

    const arrow=this.add.text(width/2,height*0.56,"↓",{
      fontFamily:"monospace",fontSize:`${Math.max(54,Math.min(92,width*0.16))}px`,color:"#d94360"
    }).setOrigin(0.5);
    this.tweens.add({targets:arrow,y:arrow.y+12,duration:360,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});

    const nextLabel=revealed?`${pretty(revealed.id)} • ${revealed.instinct}`:next.type;
    this.add.text(width/2,height*0.69,nextLabel.toUpperCase(),{
      fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(17,width*0.03))}px`,color:revealed?"#67c8c2":"#aeb8bd",align:"center",wordWrap:{width:width*0.82}
    }).setOrigin(0.5);

    const hp=state.progression;
    this.add.text(width/2,height*0.81,`HP ${hp.hp}/${hp.maxHp}   •   LV ${hp.level}   •   ¢ ${state.economy.coins}`,{
      fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(15,width*0.026))}px`,color:"#7f8b92"
    }).setOrigin(0.5);

    const canUseKey=clientRun.hasEmergencyKey&&hp.hp<hp.maxHp;
    if(canUseKey){
      const keyButton=this.add.rectangle(width/2,height*0.88,Math.min(width*0.72,330),46,0x18302d).setStrokeStyle(1,0x66a494).setInteractive({useHandCursor:true});
      this.add.text(width/2,height*0.88,"USE EMERGENCY KEY • HEAL 4",{fontFamily:"monospace",fontSize:"11px",color:"#d7eee8"}).setOrigin(0.5);
      keyButton.on("pointerdown",()=>{clientRun.useEmergencyKey();this.scene.restart();});

      const descendButton=this.add.rectangle(width/2,height*0.95,Math.min(width*0.5,240),42,0x242b31).setStrokeStyle(1,0x68747c).setInteractive({useHandCursor:true});
      this.add.text(width/2,height*0.95,"DESCEND",{fontFamily:"monospace",fontSize:"11px",color:"#eee6d5"}).setOrigin(0.5);
      descendButton.on("pointerdown",()=>this.enterNext());
      return;
    }

    this.time.delayedCall(520,()=>{
      if(!this.scene.isActive())return;
      this.enterNext();
    });
  }

  private enterNext():void {
    const node=clientRun.enterNextDepth();
    this.routeNode(node.type);
  }

  private routeCurrentPhase():void {
    const phase=clientRun.state.phase;
    if(phase==="COMBAT"||phase==="ELITE"||phase==="BOSS")this.scene.start("CombatScene");
    else if(phase==="SHOP")this.scene.start("ShopScene");
    else if(phase==="EVENT")this.scene.start("EventScene");
  }

  private routeNode(type:string):void {
    if(type==="COMBAT"||type==="ELITE"||type==="BOSS")this.scene.start("CombatScene");
    else if(type==="SHOP")this.scene.start("ShopScene");
    else if(type==="EVENT")this.scene.start("EventScene");
  }

  private renderEnd(victory:boolean,width:number,height:number):void {
    this.add.text(width/2,height*0.32,victory?"THRESHOLD CLEARED":"THE BELOW KEEPS THE RECORD",{
      fontFamily:"Georgia, serif",fontSize:`${Math.max(28,Math.min(46,width*0.08))}px`,color:"#eee6d5",align:"center",wordWrap:{width:width*0.86}
    }).setOrigin(0.5);
    const state=clientRun.state;
    this.add.text(width/2,height*0.48,`LV ${state.progression.level} • ${state.progression.hp}/${state.progression.maxHp} HP • ¢ ${state.economy.coins}\nSEED ${clientRun.currentSeed}`,{
      fontFamily:"monospace",fontSize:`${Math.max(12,Math.min(17,width*0.03))}px`,color:"#9ba7ad",align:"center",lineSpacing:8
    }).setOrigin(0.5);
    const button=this.add.rectangle(width/2,height*0.68,Math.min(width*0.56,270),54,0x273139).setStrokeStyle(1,victory?0xd4ad55:0xa64255).setInteractive({useHandCursor:true});
    this.add.text(width/2,height*0.68,"GO AGAIN",{fontFamily:"monospace",fontSize:"14px",color:"#eee6d5"}).setOrigin(0.5);
    button.on("pointerdown",()=>{clientRun.reset();this.scene.restart();});
  }
}
