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
    if(level===null){this.scene.start("MapScene");return;}
    if(level!==3){throw new Error(`Client Technique UI has not yet authored Level ${level} choices`);}
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(48,42,`LEVEL ${level}`,{fontFamily:"Georgia, serif",fontSize:"42px",color:"#eee6d5"});
    this.add.text(50,100,"Choose a Delver Technique. Techniques occupy no inventory slot.",{fontFamily:"monospace",fontSize:"14px",color:"#929da4"});
    LEVEL3.forEach((choice,index)=>{
      const x=400+index*480;
      const bg=this.add.rectangle(x,350,390,330,0x151b20).setStrokeStyle(2,0x4b5962).setInteractive({useHandCursor:true});
      this.add.text(x,275,choice.name,{fontFamily:"Georgia, serif",fontSize:"27px",color:"#eee6d5"}).setOrigin(0.5);
      this.add.text(x,360,choice.text,{fontFamily:"monospace",fontSize:"14px",color:"#bdc6ca",align:"center",wordWrap:{width:310},lineSpacing:7}).setOrigin(0.5);
      this.add.text(x,470,"CHOOSE",{fontFamily:"monospace",fontSize:"13px",color:"#d2b35e"}).setOrigin(0.5);
      bg.on("pointerover",()=>bg.setStrokeStyle(3,0x50c7c0));bg.on("pointerout",()=>bg.setStrokeStyle(2,0x4b5962));bg.on("pointerdown",()=>this.choose(choice.id));
    });
  }

  private choose(id:TechniqueId):void {clientRun.chooseTechnique(id);this.scene.start("MapScene");}
}
