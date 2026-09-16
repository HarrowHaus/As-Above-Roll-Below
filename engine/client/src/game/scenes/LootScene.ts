import { Scene } from "phaser";
import { floor1ItemRegistry, type LootOffer } from "../../../../core/dist/index.js";
import { clientRun } from "../session.js";
import { itemText } from "../contentText.js";

export class LootScene extends Scene {
  constructor(){super("LootScene");}

  create():void {
    const draft=clientRun.pendingLoot;if(!draft){this.scene.start("DescentScene");return;}
    const boss=clientRun.pendingLootKind==="BOSS";
    const w=this.scale.width,h=this.scale.height,portrait=h>w;
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(w*0.06,h*0.045,boss?"BOSS DRAFT":"SPOILS",{fontFamily:"Georgia, serif",fontSize:`${Math.max(28,Math.min(44,w*0.08))}px`,color:"#eee6d5"});
    this.add.text(w*0.06,h*0.115,boss?"THE FIRST DOOR YIELDS ONE PREMIUM BUILD PIECE.":`FINAL-BLOW ${draft.score} • BAND ${draft.band}`,{fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(15,w*0.028))}px`,color:"#d9b35a",wordWrap:{width:w*0.88}});
    this.add.text(w*0.06,h*0.155,"Choose one. Rules are shown now; nothing important is hidden in a menu.",{fontFamily:"monospace",fontSize:`${Math.max(9,Math.min(13,w*0.024))}px`,color:"#87939b",wordWrap:{width:w*0.88}});
    if(portrait){const cardW=w*0.9,cardH=Math.min(h*0.19,184),x=w/2,startY=h*0.29,gap=cardH+Math.min(14,h*0.016);draft.offers.forEach((offer,index)=>this.renderOffer(offer,x,startY+index*gap,cardW,cardH,true));}
    else{const cardW=Math.min(350,w*0.29),cardH=Math.min(350,h*0.5),gap=w*0.31,start=w*0.19;draft.offers.forEach((offer,index)=>this.renderOffer(offer,start+index*gap,h*0.49,cardW,cardH,false));}
    if(clientRun.lootCanSkip)this.button(w/2,h*0.94,Math.min(w*0.62,300),Math.max(44,h*0.055),"SKIP ALL → COINS",()=>{clientRun.skipLoot();this.goAfterLoot();},0x1a2328,0x8a6b38);
  }

  private renderOffer(offer:LootOffer,x:number,y:number,cardW:number,cardH:number,compact:boolean):void {
    const card=this.add.rectangle(x,y,cardW,cardH,0x141a1f).setStrokeStyle(2,0x46535d).setInteractive({useHandCursor:true});
    let title:string,kind:string,rule:string,flavor="";
    if(offer.type==="COINS"){title=`${offer.amount} COINS`;kind="NO SLOT";rule="Gain this currency immediately. Coins buy items and healing in Shops.";flavor="Spend it before the accounting catches up.";}
    else{const item=floor1ItemRegistry[offer.itemId];if(!item)throw new Error(`Unknown loot item ${offer.itemId}`);const copy=itemText[offer.itemId];title=item.displayName.toUpperCase();kind=`${item.category}${item.gearSlot?` • ${item.gearSlot}`:""} • TIER ${item.tier}`;rule=copy?.rule??"Rule text missing — report this item.";flavor=copy?.flavor??"";}
    const left=x-cardW/2+16;
    if(compact){this.add.text(left,y-cardH*0.35,title,{fontFamily:"Georgia, serif",fontSize:`${Math.max(16,Math.min(22,cardW*0.058))}px`,color:"#eee6d5",wordWrap:{width:cardW*0.72}});this.add.text(left,y-cardH*0.12,kind,{fontFamily:"monospace",fontSize:"10px",color:"#d2aa57"});this.add.text(left,y+cardH*0.02,rule,{fontFamily:"monospace",fontSize:"10px",color:"#d4dcde",wordWrap:{width:cardW*0.73},lineSpacing:2});this.add.text(left,y+cardH*0.29,flavor,{fontFamily:"Georgia, serif",fontStyle:"italic",fontSize:"10px",color:"#8f999d",wordWrap:{width:cardW*0.72}});this.add.text(x+cardW*0.38,y,"TAKE",{fontFamily:"monospace",fontSize:"11px",color:"#d8e0e1"}).setOrigin(0.5);}
    else{this.add.text(x,y-cardH*0.36,title,{fontFamily:"Georgia, serif",fontSize:"23px",color:"#eee6d5",align:"center",wordWrap:{width:cardW*0.86}}).setOrigin(0.5);this.add.text(x,y-cardH*0.22,kind,{fontFamily:"monospace",fontSize:"11px",color:"#d2aa57"}).setOrigin(0.5);this.add.text(x,y-cardH*0.02,rule,{fontFamily:"monospace",fontSize:"12px",color:"#d4dcde",align:"center",wordWrap:{width:cardW*0.82},lineSpacing:3}).setOrigin(0.5);this.add.text(x,y+cardH*0.2,flavor,{fontFamily:"Georgia, serif",fontStyle:"italic",fontSize:"11px",color:"#8f999d",align:"center",wordWrap:{width:cardW*0.78}}).setOrigin(0.5);this.add.text(x,y+cardH*0.38,"TAKE",{fontFamily:"monospace",fontSize:"12px",color:"#d8e0e1"}).setOrigin(0.5);}
    card.on("pointerover",()=>card.setStrokeStyle(3,0xd2aa57));card.on("pointerout",()=>card.setStrokeStyle(2,0x46535d));card.on("pointerdown",()=>this.choose(offer));
  }

  private choose(offer:LootOffer):void {if(offer.type==="COINS"){clientRun.takeLootOffer(offer);this.goAfterLoot();return;}const plan=clientRun.planLootItem(offer.itemId);if(!plan.requiresReplacement){clientRun.takeLootOffer(offer);this.goAfterLoot();return;}this.showReplacement(offer,plan.replacementCandidates);}
  private showReplacement(offer:Extract<LootOffer,{type:"ITEM"}>,candidates:readonly string[]):void {const w=this.scale.width,h=this.scale.height;this.add.rectangle(w/2,h/2,w,h,0x050709,0.9).setInteractive();this.add.rectangle(w/2,h/2,w*0.9,Math.min(h*0.66,560),0x151b20).setStrokeStyle(2,0x9a7740);const incoming=floor1ItemRegistry[offer.itemId]!,incomingText=itemText[offer.itemId];this.add.text(w/2,h*0.24,`MAKE ROOM FOR\n${incoming.displayName.toUpperCase()}`,{fontFamily:"Georgia, serif",fontSize:`${Math.max(20,Math.min(28,w*0.06))}px`,color:"#eee6d5",align:"center"}).setOrigin(0.5);this.add.text(w/2,h*0.34,incomingText?.rule??"",{fontFamily:"monospace",fontSize:"10px",color:"#cbd3d5",align:"center",wordWrap:{width:w*0.76}}).setOrigin(0.5);candidates.forEach((id,index)=>{const item=floor1ItemRegistry[id]!,copy=itemText[id];this.button(w/2,h*0.45+index*Math.max(58,h*0.066),w*0.78,50,`REPLACE ${item.displayName.toUpperCase()}\n${copy?.rule??""}`,()=>{clientRun.takeLootOffer(offer,id);this.goAfterLoot();});});this.button(w/2,h*0.82,w*0.38,42,"CANCEL",()=>this.scene.restart(),0x20262b,0x6c777e);}
  private goAfterLoot():void {if(clientRun.pendingTechniqueLevel!==null&&clientRun.state.phase!=="RUN_VICTORY"&&clientRun.state.phase!=="RUN_DEATH"){this.scene.start("TechniqueScene");return;}this.scene.start("DescentScene");}
  private button(x:number,y:number,w:number,h:number,label:string,fn:()=>void,fill=0x263039,stroke=0x61707a):Phaser.GameObjects.Rectangle {const bg=this.add.rectangle(x,y,w,h,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});this.add.text(x,y,label,{fontFamily:"monospace",fontSize:"10px",color:"#eee6d5",align:"center",wordWrap:{width:w*0.94}}).setOrigin(0.5);bg.on("pointerdown",fn);return bg;}
}
