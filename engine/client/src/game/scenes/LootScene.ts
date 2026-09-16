import { Scene } from "phaser";
import { floor1ItemRegistry, type LootOffer } from "../../../../core/dist/index.js";
import { clientRun } from "../session.js";

export class LootScene extends Scene {
  constructor(){super("LootScene");}

  create():void {
    const draft=clientRun.pendingLoot;if(!draft){this.scene.start("MapScene");return;}
    const boss=clientRun.pendingLootKind==="BOSS";
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(48,38,boss?"BOSS DRAFT":"SPOILS",{fontFamily:"Georgia, serif",fontSize:"42px",color:"#eee6d5"});
    this.add.text(50,92,boss?"THE FIRST DOOR YIELDS ONE PREMIUM BUILD PIECE.":`FINAL-BLOW SCORE ${draft.score}  •  REWARD BAND ${draft.band}`,{fontFamily:"monospace",fontSize:"14px",color:"#d9b35a",letterSpacing:1});
    this.add.text(50,125,"Choose one. The other two are gone.",{fontFamily:"monospace",fontSize:"13px",color:"#87939b"});
    draft.offers.forEach((offer,index)=>this.renderOffer(offer,250+index*390,325));
    if(clientRun.lootCanSkip)this.button(640,620,220,48,"SKIP ALL → COINS",()=>{clientRun.skipLoot();this.goAfterLoot();},0x1a2328,0x8a6b38);
  }

  private renderOffer(offer:LootOffer,x:number,y:number):void {
    const card=this.add.rectangle(x,y,330,330,0x141a1f).setStrokeStyle(2,0x46535d).setInteractive({useHandCursor:true});
    let title:string,kind:string,detail:string;
    if(offer.type==="COINS"){title=`${offer.amount} COINS`;kind="NO SLOT";detail="Immediate run currency.";}
    else{const item=floor1ItemRegistry[offer.itemId];if(!item)throw new Error(`Unknown loot item ${offer.itemId}`);title=item.displayName.toUpperCase();kind=`${item.category} • TIER ${item.tier}`;detail=item.category==="GEAR"?`Slot: ${item.gearSlot}`:item.category==="ARTIFACT"?"Rule-changing build piece.":"Single-use tactical intervention.";}
    this.add.text(x,y-108,title,{fontFamily:"Georgia, serif",fontSize:"23px",color:"#eee6d5",align:"center",wordWrap:{width:280}}).setOrigin(0.5);
    this.add.text(x,y-58,kind,{fontFamily:"monospace",fontSize:"12px",color:"#d2aa57"}).setOrigin(0.5);
    this.add.text(x,y+10,detail,{fontFamily:"monospace",fontSize:"13px",color:"#b7c0c4",align:"center",wordWrap:{width:255}}).setOrigin(0.5);
    this.add.text(x,y+118,"TAKE",{fontFamily:"monospace",fontSize:"13px",color:"#d8e0e1"}).setOrigin(0.5);
    card.on("pointerover",()=>card.setStrokeStyle(3,0xd2aa57));card.on("pointerout",()=>card.setStrokeStyle(2,0x46535d));card.on("pointerdown",()=>this.choose(offer));
  }

  private choose(offer:LootOffer):void {
    if(offer.type==="COINS"){clientRun.takeLootOffer(offer);this.goAfterLoot();return;}
    const plan=clientRun.planLootItem(offer.itemId);if(!plan.requiresReplacement){clientRun.takeLootOffer(offer);this.goAfterLoot();return;}this.showReplacement(offer,plan.replacementCandidates);
  }

  private showReplacement(offer:Extract<LootOffer,{type:"ITEM"}>,candidates:readonly string[]):void {
    this.add.rectangle(640,360,1280,720,0x050709,0.86).setInteractive();this.add.rectangle(640,360,650,360,0x151b20).setStrokeStyle(2,0x9a7740);
    const incoming=floor1ItemRegistry[offer.itemId]!;this.add.text(640,235,`MAKE ROOM FOR ${incoming.displayName.toUpperCase()}`,{fontFamily:"Georgia, serif",fontSize:"24px",color:"#eee6d5"}).setOrigin(0.5);this.add.text(640,275,"Choose an item to replace. Salvage is applied by the core.",{fontFamily:"monospace",fontSize:"12px",color:"#97a2a8"}).setOrigin(0.5);
    candidates.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(640,325+index*58,440,44,`REPLACE ${item.displayName.toUpperCase()}`,()=>{clientRun.takeLootOffer(offer,id);this.goAfterLoot();});});
    this.button(640,500,180,40,"CANCEL",()=>this.scene.restart(),0x20262b,0x6c777e);
  }

  private goAfterLoot():void {
    if(clientRun.state.phase==="RUN_VICTORY"||clientRun.state.phase==="RUN_DEATH"){this.scene.start("MapScene");return;}
    if(clientRun.pendingTechniqueLevel!==null){this.scene.start("TechniqueScene");return;}
    this.scene.start("MapScene");
  }

  private button(x:number,y:number,w:number,h:number,label:string,fn:()=>void,fill=0x263039,stroke=0x61707a):Phaser.GameObjects.Rectangle {const bg=this.add.rectangle(x,y,w,h,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});this.add.text(x,y,label,{fontFamily:"monospace",fontSize:"12px",color:"#eee6d5"}).setOrigin(0.5);bg.on("pointerdown",fn);return bg;}
}