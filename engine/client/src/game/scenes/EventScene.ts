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
    choices:{"ask-ahead":"ASK WHAT WAITS AHEAD — reveal reachable combats","move-pointer":"MOVE THE POINTER YOURSELF — gain Contraband; lose 1 HP","put-back":"PUT IT BACK — gain 2 Coins"},
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
    const event=clientRun.currentEvent;if(!event){this.scene.start("MapScene");return;}
    const copy=COPY[event.id]??{title:event.id.toUpperCase(),body:"",choices:{}};
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(48,40,copy.title,{fontFamily:"Georgia, serif",fontSize:"38px",color:"#eee6d5"});
    this.add.text(50,105,copy.body,{fontFamily:"monospace",fontSize:"14px",color:"#aeb8bd",wordWrap:{width:1080},lineSpacing:6});
    this.status=this.add.text(640,620,"",{fontFamily:"monospace",fontSize:"13px",color:"#d1b463",align:"center",wordWrap:{width:900}}).setOrigin(0.5);
    event.choices.forEach((choice,index)=>{
      const label=copy.choices[choice.id]??choice.id.toUpperCase();
      const disabled=choice.id==="claim"&&clientRun.state.economy.coins<4;
      const bg=this.button(640,235+index*105,760,72,label,()=>this.choose(choice.id),disabled?0x1b1e20:0x242c33,disabled?0x363d42:0x66737c);
      if(disabled)bg.disableInteractive().setAlpha(0.45);
    });
    this.add.text(50,680,`HP ${clientRun.state.progression.hp}/${clientRun.state.progression.maxHp}   •   ${clientRun.state.economy.coins} COINS`,{fontFamily:"monospace",fontSize:"13px",color:"#7f8b92"});
  }

  private choose(choiceId:string):void {
    if(choiceId==="file-item"){this.chooseFileItem();return;}
    this.resolve(choiceId);
  }

  private chooseFileItem():void {
    const inventory=clientRun.state.inventory;
    const ids=[...Object.values(inventory.gear).filter((id):id is string=>id!==null),...inventory.artifacts];
    if(!ids.length){this.status.setText("You have no persistent item to file.");return;}
    this.add.rectangle(640,360,1280,720,0x050709,0.9).setInteractive();
    this.add.rectangle(640,360,700,420,0x151b20).setStrokeStyle(2,0x8b7045);
    this.add.text(640,205,"FILE WHICH ITEM?",{fontFamily:"Georgia, serif",fontSize:"26px",color:"#eee6d5"}).setOrigin(0.5);
    ids.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(640,270+index*48,460,38,item.displayName.toUpperCase(),()=>this.resolve("file-item",id));});
    this.button(640,535,180,40,"CANCEL",()=>this.scene.restart(),0x20262b,0x657178);
  }

  private resolve(choiceId:string,selectedItemId?:string):void {
    const offers=clientRun.resolveEvent(choiceId,selectedItemId);
    if(clientRun.state.phase==="RUN_DEATH"){this.scene.start("MapScene");return;}
    if(offers.length){this.showOffers(offers);return;}
    clientRun.finishEvent();this.scene.start("MapScene");
  }

  private showOffers(offers:readonly {itemId:string;forced:boolean}[]):void {
    this.add.rectangle(640,360,1280,720,0x050709,0.91).setInteractive();
    this.add.rectangle(640,360,720,430,0x151b20).setStrokeStyle(2,0x9a7740);
    this.add.text(640,205,"THE EVENT RETURNS SOMETHING",{fontFamily:"Georgia, serif",fontSize:"25px",color:"#eee6d5"}).setOrigin(0.5);
    offers.forEach((offer,index)=>{
      const item=floor1ItemRegistry[offer.itemId]!;
      this.add.text(640,275+index*110,`${item.displayName.toUpperCase()}\n${item.category} • TIER ${item.tier}`,{fontFamily:"monospace",fontSize:"14px",color:"#d7d0c3",align:"center"}).setOrigin(0.5);
      this.button(500,330+index*110,180,38,"TAKE",()=>this.takeOffer(offer.itemId,offer.forced));
      if(!offer.forced)this.button(780,330+index*110,180,38,"LEAVE",()=>{clientRun.finishEvent();this.scene.start("MapScene");},0x20262b,0x657178);
    });
  }

  private takeOffer(itemId:string,forced:boolean):void {
    const plan=clientRun.planLootItem(itemId);
    if(!plan.requiresReplacement){clientRun.takeEventOffer(itemId);clientRun.finishEvent();this.scene.start("MapScene");return;}
    this.add.rectangle(640,360,1280,720,0x050709,0.94).setInteractive();
    this.add.text(640,220,"REPLACEMENT REQUIRED",{fontFamily:"Georgia, serif",fontSize:"25px",color:"#eee6d5"}).setOrigin(0.5);
    plan.replacementCandidates.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(640,300+index*52,460,40,`REPLACE ${item.displayName.toUpperCase()}`,()=>{clientRun.takeEventOffer(itemId,id);clientRun.finishEvent();this.scene.start("MapScene");});});
    if(!forced)this.button(640,540,180,40,"DECLINE",()=>{clientRun.finishEvent();this.scene.start("MapScene");},0x20262b,0x657178);
  }

  private button(x:number,y:number,w:number,h:number,label:string,fn:()=>void,fill=0x263039,stroke=0x61707a):Phaser.GameObjects.Rectangle {const bg=this.add.rectangle(x,y,w,h,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});this.add.text(x,y,label,{fontFamily:"monospace",fontSize:"12px",color:"#eee6d5",align:"center",wordWrap:{width:w-28}}).setOrigin(0.5);bg.on("pointerdown",fn);return bg;}
}
