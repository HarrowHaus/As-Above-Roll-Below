import { Scene } from "phaser";
import { floor1ItemRegistry, type ShopItemOffer } from "../../../../core/dist/index.js";
import { clientRun } from "../session.js";

export class ShopScene extends Scene {
  private coinsText!:Phaser.GameObjects.Text;
  private hpText!:Phaser.GameObjects.Text;
  private statusText!:Phaser.GameObjects.Text;

  constructor(){super("ShopScene");}

  create():void {
    const shop=clientRun.currentShop;if(!shop){this.scene.start("DescentScene");return;}
    const w=this.scale.width,h=this.scale.height,portrait=h>w;
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(w*0.06,h*0.045,"THE COUNTER",{fontFamily:"Georgia, serif",fontSize:`${Math.max(28,Math.min(44,w*0.08))}px`,color:"#eee6d5"});
    this.add.text(w*0.06,h*0.105,"Seeded stock. Nothing rerolls when the room redraws.",{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(14,w*0.027))}px`,color:"#87939b",wordWrap:{width:w*0.82}});
    this.coinsText=this.add.text(w*0.94,h*0.05,"",{fontFamily:"monospace",fontSize:`${Math.max(13,Math.min(17,w*0.03))}px`,color:"#dfb759"}).setOrigin(1,0);
    this.hpText=this.add.text(w*0.94,h*0.085,"",{fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(14,w*0.026))}px`,color:"#bfc7ca"}).setOrigin(1,0);
    this.statusText=this.add.text(w/2,h*0.84,"",{fontFamily:"monospace",fontSize:`${Math.max(10,Math.min(13,w*0.025))}px`,color:"#aeb8bd",align:"center",wordWrap:{width:w*0.82}}).setOrigin(0.5);

    const offers=[shop.gear,...shop.artifacts,shop.contraband];
    if(portrait){
      const cardW=w*0.88,cardH=Math.min(h*0.12,112),startY=h*0.23,gap=cardH+10;
      offers.forEach((offer,index)=>this.renderOffer(offer,w/2,startY+index*gap,cardW,cardH,true));
      this.button(w/2,h*0.76,w*0.88,52,`FIELD DRESSING • HEAL ${shop.healAmount} HP • ${shop.healPrice} COINS`,()=>this.buyHeal(),0x26302c,0x557b5d);
      this.button(w/2,h*0.93,w*0.46,48,"LEAVE / DESCEND",()=>{clientRun.leaveShop();this.scene.start("DescentScene");},0x232b31,0x66727a);
    }else{
      const start=w*0.12,gap=w*0.18;
      offers.forEach((offer,index)=>this.renderOffer(offer,start+index*gap,h*0.46,Math.min(205,w*0.15),Math.min(285,h*0.42),false));
      this.button(w*0.84,h*0.45,Math.min(210,w*0.16),130,`FIELD DRESSING\nHEAL ${shop.healAmount} HP\n${shop.healPrice} COINS`,()=>this.buyHeal(),0x26302c,0x557b5d);
      this.button(w*0.84,h*0.73,Math.min(210,w*0.16),48,"LEAVE / DESCEND",()=>{clientRun.leaveShop();this.scene.start("DescentScene");},0x232b31,0x66727a);
    }
    this.refreshHeader();
  }

  private renderOffer(offer:ShopItemOffer,x:number,y:number,w:number,h:number,compact:boolean):void {
    const item=floor1ItemRegistry[offer.itemId];if(!item)throw new Error(`Unknown shop item ${offer.itemId}`);
    const effectivePrice=clientRun.shopPrice(offer),discount=offer.price-effectivePrice,sold=clientRun.shopItemSold(offer.itemId);
    const bg=this.add.rectangle(x,y,w,h,0x151b20).setStrokeStyle(2,0x46535d).setInteractive({useHandCursor:true});
    if(compact){
      this.add.text(x-w*0.42,y-h*0.28,item.displayName.toUpperCase(),{fontFamily:"Georgia, serif",fontSize:`${Math.max(16,Math.min(20,w*0.055))}px`,color:"#eee6d5",wordWrap:{width:w*0.55}});
      this.add.text(x-w*0.42,y+4,`${item.category} • T${item.tier}`,{fontFamily:"monospace",fontSize:"10px",color:"#a9b5bb"});
      this.add.text(x+w*0.26,y-10,discount>0?`${effectivePrice} COINS\nRECEIPT −${discount}`:`${effectivePrice} COINS`,{fontFamily:"monospace",fontSize:"11px",color:"#dcb258",align:"center"}).setOrigin(0.5);
      this.add.text(x+w*0.27,y+h*0.27,sold?"SOLD":"BUY",{fontFamily:"monospace",fontSize:"11px",color:"#e4ded2"}).setOrigin(0.5);
    }else{
      this.add.text(x,y-h*0.33,item.displayName.toUpperCase(),{fontFamily:"Georgia, serif",fontSize:"18px",color:"#eee6d5",align:"center",wordWrap:{width:w*0.86}}).setOrigin(0.5);
      this.add.text(x,y-h*0.14,`${item.category} • T${item.tier}`,{fontFamily:"monospace",fontSize:"11px",color:"#a9b5bb"}).setOrigin(0.5);
      this.add.text(x,y+h*0.15,discount>0?`${effectivePrice} COINS\nRECEIPT −${discount}`:`${effectivePrice} COINS`,{fontFamily:"monospace",fontSize:"14px",color:"#dcb258",align:"center"}).setOrigin(0.5);
      this.add.text(x,y+h*0.38,sold?"SOLD":"BUY",{fontFamily:"monospace",fontSize:"11px",color:"#e4ded2"}).setOrigin(0.5);
    }
    if(sold)bg.setAlpha(0.32);else bg.on("pointerdown",()=>this.buy(offer));
  }

  private buy(offer:ShopItemOffer):void {
    if(clientRun.shopItemSold(offer.itemId))return;
    if(clientRun.state.economy.coins<clientRun.shopPrice(offer)){this.statusText.setText("Not enough Coins.");return;}
    const plan=clientRun.planLootItem(offer.itemId);if(plan.requiresReplacement){this.showReplacement(offer,plan.replacementCandidates);return;}
    clientRun.buyShopItem(offer);this.scene.restart();
  }

  private showReplacement(offer:ShopItemOffer,candidates:readonly string[]):void {
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2,h/2,w,h,0x050709,0.9).setInteractive();
    this.add.text(w/2,h*0.27,"REPLACE INVENTORY",{fontFamily:"Georgia, serif",fontSize:`${Math.max(22,Math.min(29,w*0.06))}px`,color:"#eee6d5"}).setOrigin(0.5);
    candidates.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(w/2,h*0.38+index*56,w*0.72,42,`REPLACE ${item.displayName.toUpperCase()}`,()=>{clientRun.buyShopItem(offer,id);this.scene.restart();});});
    this.button(w/2,h*0.78,w*0.36,40,"CANCEL",()=>this.scene.restart(),0x20262b,0x6c777e);
  }

  private buyHeal():void {const shop=clientRun.currentShop!;if(clientRun.state.progression.hp>=clientRun.state.progression.maxHp){this.statusText.setText("Already at full HP.");return;}if(clientRun.state.economy.coins<shop.healPrice){this.statusText.setText("Not enough Coins.");return;}clientRun.buyShopHealing();this.statusText.setText(`Healed ${shop.healAmount}.`);this.refreshHeader();}
  private refreshHeader():void {const s=clientRun.state;this.coinsText.setText(`${s.economy.coins} COINS`);this.hpText.setText(`${s.progression.hp}/${s.progression.maxHp} HP`);}
  private button(x:number,y:number,w:number,h:number,label:string,fn:()=>void,fill=0x263039,stroke=0x61707a):Phaser.GameObjects.Rectangle {const bg=this.add.rectangle(x,y,w,h,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});this.add.text(x,y,label,{fontFamily:"monospace",fontSize:"11px",color:"#eee6d5",align:"center",wordWrap:{width:w*0.9}}).setOrigin(0.5);bg.on("pointerdown",fn);return bg;}
}
