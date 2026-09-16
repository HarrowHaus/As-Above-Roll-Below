import { Scene } from "phaser";
import { floor1ItemRegistry, type ShopItemOffer } from "../../../../core/dist/index.js";
import { clientRun } from "../session.js";

export class ShopScene extends Scene {
  private coinsText!:Phaser.GameObjects.Text;
  private hpText!:Phaser.GameObjects.Text;
  private statusText!:Phaser.GameObjects.Text;
  private cardObjects=new Map<string,Phaser.GameObjects.Container>();

  constructor(){super("ShopScene");}

  create():void {
    const shop=clientRun.currentShop;if(!shop){this.scene.start("MapScene");return;}
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(48,38,"THE COUNTER",{fontFamily:"Georgia, serif",fontSize:"42px",color:"#eee6d5"});
    this.add.text(50,92,"Seeded stock. Reopening this room does not reroll inventory.",{fontFamily:"monospace",fontSize:"13px",color:"#87939b"});
    this.coinsText=this.add.text(1210,42,"",{fontFamily:"monospace",fontSize:"16px",color:"#dfb759"}).setOrigin(1,0);
    this.hpText=this.add.text(1210,70,"",{fontFamily:"monospace",fontSize:"13px",color:"#bfc7ca"}).setOrigin(1,0);
    this.statusText=this.add.text(640,580,"",{fontFamily:"monospace",fontSize:"13px",color:"#aeb8bd"}).setOrigin(0.5);
    const offers=[shop.gear,...shop.artifacts,shop.contraband];offers.forEach((offer,index)=>this.renderOffer(offer,180+index*235,315));
    this.button(1080,315,200,130,`FIELD DRESSING\nHEAL ${shop.healAmount} HP\n${shop.healPrice} COINS`,()=>this.buyHeal(),0x26302c,0x557b5d);
    this.button(1080,510,200,48,"LEAVE",()=>{clientRun.leaveShop();this.scene.start("MapScene");},0x232b31,0x66727a);this.refreshHeader();
  }

  private renderOffer(offer:ShopItemOffer,x:number,y:number):void {
    const item=floor1ItemRegistry[offer.itemId];if(!item)throw new Error(`Unknown shop item ${offer.itemId}`);
    const effectivePrice=clientRun.shopPrice(offer),discount=offer.price-effectivePrice;
    const bg=this.add.rectangle(0,0,205,285,0x151b20).setStrokeStyle(2,0x46535d).setInteractive({useHandCursor:true});
    const title=this.add.text(0,-95,item.displayName.toUpperCase(),{fontFamily:"Georgia, serif",fontSize:"18px",color:"#eee6d5",align:"center",wordWrap:{width:180}}).setOrigin(0.5);
    const kind=this.add.text(0,-42,`${item.category} • T${item.tier}`,{fontFamily:"monospace",fontSize:"11px",color:"#a9b5bb"}).setOrigin(0.5);
    const price=this.add.text(0,48,discount>0?`${effectivePrice} COINS\nRECEIPT −${discount}`:`${effectivePrice} COINS`,{fontFamily:"monospace",fontSize:"15px",color:"#dcb258",align:"center"}).setOrigin(0.5);
    const action=this.add.text(0,108,clientRun.shopItemSold(offer.itemId)?"SOLD":"BUY",{fontFamily:"monospace",fontSize:"12px",color:"#e4ded2"}).setOrigin(0.5);
    const container=this.add.container(x,y,[bg,title,kind,price,action]);if(clientRun.shopItemSold(offer.itemId))container.setAlpha(0.32);
    bg.on("pointerdown",()=>this.buy(offer));bg.on("pointerover",()=>{if(!clientRun.shopItemSold(offer.itemId))bg.setStrokeStyle(3,0xd1aa59);});bg.on("pointerout",()=>bg.setStrokeStyle(2,0x46535d));this.cardObjects.set(offer.itemId,container);
  }

  private buy(offer:ShopItemOffer):void {
    if(clientRun.shopItemSold(offer.itemId))return;
    if(clientRun.state.economy.coins<clientRun.shopPrice(offer)){this.statusText.setText("Not enough Coins.");return;}
    const plan=clientRun.planLootItem(offer.itemId);if(plan.requiresReplacement){this.showReplacement(offer,plan.replacementCandidates);return;}
    clientRun.buyShopItem(offer);this.markSold(offer.itemId);this.statusText.setText("Purchased.");this.refreshHeader();this.scene.restart();
  }

  private showReplacement(offer:ShopItemOffer,candidates:readonly string[]):void {
    this.add.rectangle(640,360,1280,720,0x050709,0.88).setInteractive();this.add.rectangle(640,360,650,350,0x151b20).setStrokeStyle(2,0x9a7740);
    this.add.text(640,235,"REPLACE INVENTORY",{fontFamily:"Georgia, serif",fontSize:"25px",color:"#eee6d5"}).setOrigin(0.5);
    candidates.forEach((id,index)=>{const item=floor1ItemRegistry[id]!;this.button(640,310+index*56,440,42,`REPLACE ${item.displayName.toUpperCase()}`,()=>{clientRun.buyShopItem(offer,id);this.scene.restart();});});
    this.button(640,500,180,40,"CANCEL",()=>this.scene.restart(),0x20262b,0x6c777e);
  }

  private buyHeal():void {const shop=clientRun.currentShop!;if(clientRun.state.progression.hp>=clientRun.state.progression.maxHp){this.statusText.setText("Already at full HP.");return;}if(clientRun.state.economy.coins<shop.healPrice){this.statusText.setText("Not enough Coins.");return;}clientRun.buyShopHealing();this.statusText.setText(`Healed ${shop.healAmount}.`);this.refreshHeader();}
  private markSold(id:string):void {const card=this.cardObjects.get(id);if(card)card.setAlpha(0.32);}
  private refreshHeader():void {const s=clientRun.state;this.coinsText.setText(`${s.economy.coins} COINS`);this.hpText.setText(`${s.progression.hp}/${s.progression.maxHp} HP`);}
  private button(x:number,y:number,w:number,h:number,label:string,fn:()=>void,fill=0x263039,stroke=0x61707a):Phaser.GameObjects.Rectangle {const bg=this.add.rectangle(x,y,w,h,fill).setStrokeStyle(1,stroke).setInteractive({useHandCursor:true});this.add.text(x,y,label,{fontFamily:"monospace",fontSize:"12px",color:"#eee6d5",align:"center"}).setOrigin(0.5);bg.on("pointerdown",fn);return bg;}
}