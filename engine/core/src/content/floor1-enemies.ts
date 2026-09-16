import type { BossDefinition, BossPhaseDefinition, EnemyDefinition } from "../types.js";

export const floor1NormalEnemies: readonly EnemyDefinition[] = [
  {id:"thresholds:latchling",maxHp:5,dicePool:2,instinct:"BOTH",xp:1,coins:2,tags:["enemy:native","pressure:p1"]},
  {id:"thresholds:turnback",maxHp:5,dicePool:3,instinct:"TIGHT",xp:1,coins:2,tags:["enemy:native","pressure:p2"],ruleIds:["rule:turnback:refusal"]},
  {id:"thresholds:unadmitted",maxHp:6,dicePool:2,instinct:"BOTH",xp:1,coins:2,tags:["enemy:native","pressure:p2"],ruleIds:["rule:unadmitted:fix-lowest"]},
  {id:"thresholds:doorwake",maxHp:6,dicePool:3,instinct:"WIDE",xp:1,coins:2,tags:["enemy:native","pressure:p2"]},
  {id:"thresholds:toll-eater",maxHp:6,dicePool:2,instinct:"BOTH",xp:1,coins:2,tags:["enemy:native","pressure:p2"],ruleIds:["enemy:toll-eater:take-your-cut"]},
  {id:"thresholds:passage-clerk",maxHp:5,dicePool:3,instinct:"TIGHT",xp:1,coins:2,tags:["enemy:institutional","pressure:p2"],ruleIds:["enemy:passage-clerk:duplicate-filing"]},
  {id:"thresholds:seal-whelp",maxHp:7,dicePool:2,instinct:"BOTH",xp:1,coins:2,tags:["enemy:native","pressure:p3"],ruleIds:["rule:seal-whelp:reaction-on-manipulation"]},
  {id:"thresholds:misaddressed-visitor",maxHp:6,dicePool:3,instinct:"ODD",xp:1,coins:2,tags:["enemy:convergence","pressure:p2"]},
];

export const floor1Elites: readonly EnemyDefinition[] = [
  {id:"thresholds:threshold-warden",maxHp:8,dicePool:3,instinct:"STRONGEST",xp:2,coins:4,elite:true,rewardBandUplift:1,tags:["enemy:native","enemy:elite","pressure:p4"],ruleIds:["rule:threshold-warden:fix-highest"]},
  {id:"thresholds:seal-bearer",maxHp:8,dicePool:3,instinct:"STRONGEST",xp:2,coins:4,elite:true,rewardBandUplift:1,tags:["enemy:native","enemy:elite","pressure:p4"],ruleIds:["rule:seal-bearer:counterseal"]},
];

export const firstDoor: BossDefinition = {
  id:"thresholds:first-door",maxHp:18,xp:3,coins:6,clearHeal:2,tags:["boss","enemy:native","floor:thresholds"],
  phases:[
    {id:"closed",minHp:13,maxHp:18,dicePool:3,instinct:"TIGHT",ruleIds:["rule:first-door:sealed"]},
    {id:"ajar",minHp:4,maxHp:12,dicePool:3,instinct:"STRONGEST",ruleIds:["boss:first-door:ajar-draft"]},
    {id:"open",minHp:1,maxHp:3,dicePool:4,instinct:"STRONGEST",ruleIds:["rule:first-door:both-ways"]},
  ],
};

export const floor1EnemyRegistry: Readonly<Record<string,EnemyDefinition>> = Object.fromEntries([...floor1NormalEnemies,...floor1Elites].map((enemy)=>[enemy.id,enemy]));

export function bossPhaseAtHp(boss: BossDefinition, hp: number): BossPhaseDefinition {
  if (hp <= 0 || hp > boss.maxHp) throw new Error(`Invalid boss HP ${hp} for ${boss.id}`);
  const phase = boss.phases.find((candidate)=>hp>=candidate.minHp && hp<=candidate.maxHp);
  if (!phase) throw new Error(`Boss ${boss.id} has no phase covering HP ${hp}`);
  return phase;
}

export function bossPhaseAsEnemy(boss: BossDefinition, hp: number): EnemyDefinition {
  const phase=bossPhaseAtHp(boss,hp);
  return {
    id:boss.id,maxHp:boss.maxHp,dicePool:phase.dicePool,instinct:phase.instinct,xp:boss.xp,coins:boss.coins,
    ...(boss.tags ? {tags:boss.tags} : {}),
    ...(phase.ruleIds ? {ruleIds:phase.ruleIds} : {}),
  };
}
