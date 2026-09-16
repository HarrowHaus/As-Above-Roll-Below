import { Scene } from "phaser";
import { clientRun } from "../session.js";

const TYPE_COLOR: Record<string, number> = {COMBAT:0x48535b,ELITE:0x8b3f50,EVENT:0x5e5075,SHOP:0x8b6a32,BOSS:0x9b293e};
const pretty=(id:string)=>id.split(":").at(-1)!.split("-").map((part)=>part.charAt(0).toUpperCase()+part.slice(1)).join(" ");

export class MapScene extends Scene {
  constructor(){super("MapScene");}

  create():void {
    this.cameras.main.setBackgroundColor(0x0b0e12);
    this.add.text(48,34,"AS ABOVE, ROLL BELOW",{fontFamily:"Georgia, serif",fontSize:"36px",color:"#eee6d5"});
    this.add.text(50,80,"FLOOR I — THRESHOLDS",{fontFamily:"monospace",fontSize:"14px",color:"#9ba7ad",letterSpacing:2});
    const state=clientRun.state;
    this.add.text(980,42,`HP ${state.progression.hp}/${state.progression.maxHp}   LV ${state.progression.level}   XP ${state.progression.xp}   ¢ ${state.economy.coins}`,{fontFamily:"monospace",fontSize:"14px",color:"#d6d0c3"}).setOrigin(1,0);
    this.add.text(1230,42,`SEED ${clientRun.currentSeed}`,{fontFamily:"monospace",fontSize:"12px",color:"#6f7a82"}).setOrigin(1,0);
    if(state.phase==="RUN_VICTORY"||state.phase==="RUN_DEATH"){this.renderEnd(state.phase==="RUN_VICTORY");return;}

    const graph=state.floors[state.floorIndex]!,available=new Set(clientRun.availableNodes.map((node)=>node.id));
    const maxRow=Math.max(...graph.nodes.map((node)=>node.row)),positions=new Map<string,{x:number;y:number}>();
    for(let row=0;row<=maxRow;row+=1){const nodes=graph.nodes.filter((node)=>node.row===row),width=nodes.length<=1?0:360;nodes.forEach((node,index)=>{const t=nodes.length<=1?0:index/(nodes.length-1)-0.5;positions.set(node.id,{x:640+t*width,y:150+row*108});});}

    const edges=this.add.graphics();edges.lineStyle(3,0x343d43,0.85);for(const edge of graph.edges){const a=positions.get(edge.from),b=positions.get(edge.to);if(a&&b)edges.lineBetween(a.x,a.y,b.x,b.y);}
    let anyReveal=false;
    for(const node of graph.nodes){
      const p=positions.get(node.id)!,isAvailable=available.has(node.id),visited=state.visitedNodeIds.includes(node.id),color=TYPE_COLOR[node.type]??0x48535b,radius=node.type==="BOSS"?34:27;
      const circle=this.add.circle(p.x,p.y,radius,visited?0x20262a:color,isAvailable?1:0.55).setStrokeStyle(isAvailable?3:1,isAvailable?0xe0c16e:0x58626a);
      this.add.text(p.x,p.y-2,node.type==="COMBAT"?"X":node.type==="ELITE"?"E":node.type==="EVENT"?"?":node.type==="SHOP"?"$":"B",{fontFamily:"monospace",fontSize:node.type==="BOSS"?"22px":"17px",color:"#f1eadb"}).setOrigin(0.5);
      this.add.text(p.x,p.y+42,node.type,{fontFamily:"monospace",fontSize:"10px",color:isAvailable?"#d7d0c2":"#69747b"}).setOrigin(0.5);
      const revealed=clientRun.revealedEncounter(node.id);
      if(revealed){anyReveal=true;this.add.text(p.x,p.y+59,`${pretty(revealed.id)} • ${revealed.instinct}`,{fontFamily:"monospace",fontSize:"9px",color:"#67c8c2",align:"center",wordWrap:{width:185}}).setOrigin(0.5,0);}
      if(isAvailable){circle.setInteractive({useHandCursor:true});circle.on("pointerover",()=>circle.setScale(1.12));circle.on("pointerout",()=>circle.setScale(1));circle.on("pointerdown",()=>this.enter(node.id));}
    }
    this.add.text(48,650,anyReveal?"Talking Board result: reachable combat identities are fixed and revealed.":"Choose a reachable room. Exact encounter identity stays hidden until entry.",{fontFamily:"monospace",fontSize:"13px",color:anyReveal?"#67c8c2":"#7f8b92"});
  }

  private enter(nodeId:string):void {const node=clientRun.enterNode(nodeId);if(node.type==="COMBAT"||node.type==="ELITE"||node.type==="BOSS")this.scene.start("CombatScene");else if(node.type==="SHOP")this.scene.start("ShopScene");else this.scene.start("EventScene");}
  private renderEnd(victory:boolean):void {this.add.rectangle(640,360,650,300,0x11171d).setStrokeStyle(2,victory?0xd5ad50:0xa64255);this.add.text(640,285,victory?"THRESHOLD CLEARED":"THE BELOW KEEPS THE RECORD",{fontFamily:"Georgia, serif",fontSize:"32px",color:"#eee6d5"}).setOrigin(0.5);const button=this.add.rectangle(640,410,220,54,0x28323a).setStrokeStyle(1,0x88949b).setInteractive({useHandCursor:true});this.add.text(640,410,"NEW SEED",{fontFamily:"monospace",fontSize:"15px",color:"#eee6d5"}).setOrigin(0.5);button.on("pointerdown",()=>{clientRun.reset();this.scene.restart();});}
}
