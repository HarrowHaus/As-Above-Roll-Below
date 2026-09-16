import { Scene } from "phaser";
import { clientRun, type TechniqueId } from "../session.js";

const LEVEL3=[
  {id:"steady-hand" as TechniqueId,name:"STEADY HAND",text:"Field Adjustment gains one additional use each encounter."},
  {id:"long-odds" as TechniqueId,name:"LONG ODDS",text:"The first time each encounter you win by exactly 1, +2 to that successful Spoils Score."},
];

export class TechniqueScene extends Scene {
  constructor(){super("TechniqueScene");}

  create():void {
    const level=clientRun.pendingTechniqueLevel;
    if(level===null){this.scene.start("DescentScene");return;}
    if(level!==3){throw new Error(`Client Technique UI has not yet authored Level ${level} choices`);}
    const w=this.scale.width,h=this.scale.height,portrait=h>w;
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(w*0.06,h*0.05,`LEVEL ${level}`,{fontFamily:"Georgia, serif",fontSize:`${Math.max(30,Math.min(44,w*0.085))}px`,color:"#eee6d5"});
    this.add.text(w*0.06,h*0.12,"Choose a Delver Technique. No inventory slot.",{fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(15,w*0.028))}px`,color:"#929da4",wordWrap:{width:w*0.86}});

    if(portrait){
      LEVEL3.forEach((choice,index)=>this.card(choice,w/2,h*(0.36+index*0.29),w*0.86,Math.min(h*0.23,220)));
    }else{
      LEVEL3.forEach((choice,index)=>this.card(choice,w*(0.32+index*0.36),h*0.52,Math.min(w*0.32,390),Math.min(h*0.48,330)));
    }
  }

  private card(choice:(typeof LEVEL3)[number],x:number,y:number,width:number,height:number):void {
    const bg=this.add.rectangle(x,y,width,height,0x151b20).setStrokeStyle(2,0x4b5962).setInteractive({useHandCursor:true});
    this.add.text(x,y-height*0.24,choice.name,{fontFamily:"Georgia, serif",fontSize:`${Math.max(22,Math.min(29,width*0.07))}px`,color:"#eee6d5"}).setOrigin(0.5);
    this.add.text(x,y+2,choice.text,{fontFamily:"monospace",fontSize:`${Math.max(11,Math.min(14,width*0.033))}px`,color:"#bdc6ca",align:"center",wordWrap:{width:width*0.78},lineSpacing:6}).setOrigin(0.5);
    this.add.text(x,y+height*0.32,"CHOOSE",{fontFamily:"monospace",fontSize:"12px",color:"#d2b35e"}).setOrigin(0.5);
    bg.on("pointerover",()=>bg.setStrokeStyle(3,0x50c7c0));bg.on("pointerout",()=>bg.setStrokeStyle(2,0x4b5962));bg.on("pointerdown",()=>this.choose(choice.id));
  }

  private choose(id:TechniqueId):void {clientRun.chooseTechnique(id);this.scene.start("DescentScene");}
}
