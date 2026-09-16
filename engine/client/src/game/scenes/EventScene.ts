import { Scene } from "phaser";
import { floor1ItemRegistry } from "../../../../core/dist/index.js";
import { clientRun } from "../session.js";

const COPY:Record<string,{title:string;body:string;choices:Record<string,string>}>= {
  "thresholds:unnumbered-door":{
    title:"UNNUMBERED DOOR",body:"A freestanding door has no number on either side. Warm air moves through the keyhole.",
    choices:{force:"FORCE IT — lose 3 HP; Tier II Artifact offer",knock:"KNOCK — roll the consequence",leave:"LEAVE — no effect"},
  },
  "thresholds:talking-board-1891":{
    title:"TALKING BOARD, 1891",body:"The pointer rests where nobody left it. The lettering is older than the room.",
    choices:{"ask-ahead":"ASK WHAT WAITS AHEAD — reveal the next combat","move-pointer":"MOVE THE POINTER YOURSELF — gain Contraband; lose 1 HP","put-back":"PUT IT BACK — gain 2 Coins"},
  },
  "thresholds:lost-property-office":{
    title:"LOST PROPERTY OFFICE",body:"The clerk has a form for property you own, property you lost, and property you have never seen.",
    choices:{"file-item":"FILE A PERSISTENT ITEM — remove it for 75% value",claim:"CLAIM SOMETHING THAT ISN'T YOURS — pay 4 Coins for a Tier I offer",nothing:"NOTHING TO DECLARE — leave"},
  },
};

export class EventScene extends Scene {
  private status!:Phaser.GameObjects.Text;
  constructor(){super("EventScene");}

  create():void {
    const event=clientRun.currentEvent;if(!event){this.scene.start("DescentScene");return;}
    const copy=COPY[event.id]??{title:event.id.toUpperCase(),body:"",choices:{}};
    const w=this.scale.width,h=this.scale.height,portrait=h>w;
    this.cameras.main.setBackgroundColor(0x0b0e12);

    this.add.text(w*0.06,h*0.05,copy.title,{fontFamily:"Georgia, serif",fontSize:`${Math.max(27,Math.min(42,w*0.078))}px`,color:"#eee6d5",wordWrap:{width:w*0.88}});
    this.add.text(w*0.06,h*0.13,copy.body,{fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(15,w*0.027))}px`,color:"#aeb8bd",wordWrap:{width:w*0.88},lineSpacing:6});

    const choiceWidth=portrait?w*0.88:Math.min(w*0.62,760);
    const startY=portrait?h*0.39:h*0.37;
    const gap=portrait?Math.max(78,h*0.105):105;
    event.choices.forEach((choice,index)=>{
      const label=copy.choices[choice.id]??choice.id.toUpperCase();
      const disabled=choice.id==="claim"&&clientRun.state.economy.coins<4;
      const bg=this.button(w/2,startY+index*gap,choiceWidth,portrait?Math.max(64,h*0.078):72,label,()=>this.choose(choice.id),disabled?0x1b1e20:0x242c33,disabled?0x363d42:0x66737c);
      if(disabled)bg.disableInteractive().setAlpha(0.45);
    });

    this.status=this.add.text(w/2,h*0.79,"",{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(13,w*0.026))}px`,color:"#d1b463",align:"center",wordWrap:{width:w*0.84}}).setOrigin(0.5);
    this.add.text(w*0.06,h*0.92,`DEPTH ${clientRun.currentDepth}   •   HP ${clientRun.state.progression.hp}/${clientRun.state.progression.maxHp}   •   ${clientRun.state.economy.coins} COINS`,{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(13,w*0.025))}px`,color:"#7f8b92"});
  }

  private choose(choiceId:string):void {if(choiceId==="file-item"){this.chooseFileItem();return;}this.resolve(choiceId);}

  private chooseFileItem():void {
    const inventory=clientRun.state.inventory;
    const ids=[...Object.values(inventory.gear).filter((id):id is string=>id!==null),...inventory.artifacts];
    if(!ids.length){this.status.setText("You have no persistent item to file.");return;}
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2,h/2,w,h,0x050709,0.9).setInteractive();
    this.add.rectangle(w/2,h/2,w*0.88,Math.min(h*0.64,540),0x151b20).setStrokeStyle(2,0x8b7045);
    this.add.text(w/2,h*0.25,"FILE WHICH ITEM?",{fontFamily:"Georgia, serif",fontSize:`${Math.max(23,Math.min(29,w*0.06))}px`,color:"#eee6d5"}).setOrigin(0.5);
    ids.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(w/2,h*0.34+index*Math.max(48,h*0.052),w*0.7,40,item.displayName.toUpperCase(),()=>this.resolve("file-item",id));});
    this.button(w/2,h*0.78,w*0.36,40,"CANCEL",()=>this.scene.restart(),0x20262b,0x657178);
  }

  private resolve(choiceId:string,selectedItemId?:string):void {
    const offers=clientRun.resolveEvent(choiceId,selectedItemId);
    if(clientRun.state.phase==="RUN_DEATH"){this.scene.start("DescentScene");return;}
    if(offers.length){this.showOffers(offers);return;}
    clientRun.finishEvent();this.scene.start("DescentScene");
  }

  private showOffers(offers:readonly {itemId:string;forced:boolean}[]):void {
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2,h/2,w,h,0x050709,0.92).setInteractive();
    this.add.rectangle(w/2,h/2,w*0.9,Math.min(h*0.7,560),0x151b20).setStrokeStyle(2,0x9a7740);
    this.add.text(w/2,h*0.22,"THE EVENT RETURNS SOMETHING",{fontFamily:"Georgia, serif",fontSize:`${Math.max(21,Math.min(28,w*0.06))}px`,color:"#eee6d5",align:"center",wordWrap:{width:w*0.8}}).setOrigin(0.5);
    offers.forEach((offer,index)=>{
      const item=floor1ItemRegistry[offer.itemId]!;const y=h*(0.37+index*0.22);
      this.add.text(w/2,y-28,`${item.displayName.toUpperCase()}\n${item.category} • TIER ${item.tier}`,{fontFamily:"monospace",fontSize:`${Math.max(12,Math.min(15,w*0.03))}px`,color:"#d7d0c3",align:"center"}).setOrigin(0.5);
      this.button(w*0.37,y+35,w*0.27,40,"TAKE",()=>this.takeOffer(offer.itemId,offer.forced));
      if(!offer.forced)this.button(w*0.68,y+35,w*0.27,40,"LEAVE",()=>{clientRun.finishEvent();this.scene.start("DescentScene");},0x20262b,0x657178);
    });
  }

  private takeOffer(itemId:string,forced:boolean):void {
    const plan=clientRun.planLootItem(itemId);
    if(!plan.requiresReplacement){clientRun.takeEventOffer(itemId);clientRun.finishEvent();this.scene.start("DescentScene");return;}
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2,h/2,w,h,0x050709,0.95).setInteractive();
    this.add.text(w/2,h*0.25,"REPLACEMENT REQUIRED",{fontFamily:"Georgia, serif",fontSize:`${Math.max(22,Math.min(28,w*0.06))}px`,color:"#eee6d5"}).setOrigin(0.5);
    plan.replacementCandidates.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(w/2,h*0.37+index*Math.max(52,h*0.06),w*0.72,42,`REPLACE ${item.displayName.toUpperCase()}`,()=>{clientRun.takeEventOffer(itemId,id);clientRun.finishEvent();this.scene.start("DescentScene");});});
    if(!forced)this.button(w/2,h*0.78,w*0.36,40,"DECLINE",()=>{clientRun.finishEvent();this.scene.start("DescentScene");},0x20262b,0x657178);
  }

  private button(x:number,y:number,w:number,h:number,label:string,fn:()=>void,fill=0x263039,stroke=0x61707a):Phaser.GameObjects.Rectangle {const bg=this.add.rectangle(x,y,w,h,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});this.add.text(x,y,label,{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(12,w*0.027))}px`,color:"#eee6d5",align:"center",wordWrap:{width:w-26}}).setOrigin(0.5);bg.on("pointerdown",fn);return bg;}
}
