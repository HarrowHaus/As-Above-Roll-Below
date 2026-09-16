import fs from "node:fs";
import path from "node:path";
import { batch } from "./simulator-v2.mjs";

const args=Object.fromEntries(process.argv.slice(2).map((arg)=>{const [key,value="true"]=arg.replace(/^--/,"").split("=");return[key,value];}));
const runs=Math.max(1,Number.parseInt(args.runs??"1000",10));
const seedBase=Number.parseInt(args.seedBase??"100000",10);
const result={
  version:"shared-core-e6-v3-full-item-coverage",runsPerPolicy:runs,seedBase,
  coverage:{
    events:"Floor I choices/outcomes modeled through core EventResolver",
    enemyRules:"tie rules, fixed-die rules, and manipulation reactions core-owned",
    persistentItems:"all 8 Gear + all 12 Artifacts represented in combat/economy policy",
    contraband:"all 6 Contraband represented through core item actions and consumption",
    techniques:"Steady Hand and Long Odds represented",
    rewards:"Final-Blow Spoils; raw band separated from Elite reward uplift",
    procgen:"generated Floor graph + core Encounter/Event Directors",
  },
  policies:batch({runs,seedBase})
};
console.log(JSON.stringify(result,null,2));

const pct=(x)=>(x*100).toFixed(1)+"%";
if(args.output){
  const dir=path.resolve(args.output);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"summary.json"),JSON.stringify(result,null,2));
  const lines=[
    "# Shared-Core Simulation E6 V3 — Full Floor I Item Coverage","",`Runs per policy: **${runs}**`,"",
    "| Policy | Clear | Avg HP | Damage | Rounds | Spoils | Raw B4 | Reward B4 | Elite visits |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|"
  ];
  for(const[policy,s]of Object.entries(result.policies))lines.push(`| ${policy} | ${pct(s.clearRate)} | ${s.avgFinalHp.toFixed(2)} | ${s.avgDamageTaken.toFixed(2)} | ${s.avgRounds.toFixed(2)} | ${s.avgSpoils.toFixed(2)} | ${pct(s.rawBandFrequency[4])} | ${pct(s.rewardBandFrequency[4])} | ${s.avgElites.toFixed(2)} |`);
  lines.push("","## Raw Final-Blow Spoils bands","","| Policy | B1 | B2 | B3 | B4 |","|---|---:|---:|---:|---:|");
  for(const[policy,s]of Object.entries(result.policies))lines.push(`| ${policy} | ${pct(s.rawBandFrequency[1])} | ${pct(s.rawBandFrequency[2])} | ${pct(s.rawBandFrequency[3])} | ${pct(s.rawBandFrequency[4])} |`);
  lines.push("","## Post-Elite reward bands","","| Policy | B1 | B2 | B3 | B4 |","|---|---:|---:|---:|---:|");
  for(const[policy,s]of Object.entries(result.policies))lines.push(`| ${policy} | ${pct(s.rewardBandFrequency[1])} | ${pct(s.rewardBandFrequency[2])} | ${pct(s.rewardBandFrequency[3])} | ${pct(s.rewardBandFrequency[4])} |`);
  lines.push("","## Boss pressure","","| Policy | Boss clear | Entry HP | Boss rounds | Boss damage |","|---|---:|---:|---:|---:|");
  for(const[policy,s]of Object.entries(result.policies))lines.push(`| ${policy} | ${pct(s.boss.clearRate)} | ${s.boss.avgEntryHp.toFixed(2)} | ${s.boss.avgRounds.toFixed(2)} | ${s.boss.avgPlayerDamage.toFixed(2)} |`);
  lines.push("","## Item acquisition/use — Opportunist","","| Item | Taken | Used/triggered |","|---|---:|---:|");
  const ids=[...new Set([...Object.keys(result.policies.opportunist.itemsTaken),...Object.keys(result.policies.opportunist.itemUses)])].sort();
  for(const id of ids)lines.push(`| ${id} | ${result.policies.opportunist.itemsTaken[id]??0} | ${result.policies.opportunist.itemUses[id]??0} |`);
  lines.push("","## Per-enemy pressure — Opportunist","","| Enemy | Attempts | Win | Rounds | Damage | Spoils |","|---|---:|---:|---:|---:|---:|");
  for(const[id,e]of Object.entries(result.policies.opportunist.encounters).sort((a,b)=>a[0].localeCompare(b[0])))lines.push(`| ${id} | ${e.attempts} | ${pct(e.winRate)} | ${e.avgRounds.toFixed(2)} | ${e.avgPlayerDamage.toFixed(2)} | ${e.avgSpoils.toFixed(2)} |`);
  lines.push("","## Coverage note","","This is the first E6 batch where the complete Floor I Gear, Artifact and Contraband pool participates in shared-core simulation. Strategy policy remains an automated approximation of human choice, so this is a systems freeze gate—not a substitute for human playtesting.");
  fs.writeFileSync(path.join(dir,"REPORT.md"),lines.join("\n"));
}
