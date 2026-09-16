from pathlib import Path
import random, statistics, collections, json

ROOT=Path('simulation/floor1/out')
ROOT.mkdir(parents=True,exist_ok=True)
OPP={1:6,2:5,3:4,4:3,5:2,6:1}
LEVEL_THRESH=[0,3,7,12,18,25]

ENEMIES={
'latchling':dict(hp=5,dice=2,instinct='both',xp=1,coins=2),
'turnback':dict(hp=5,dice=3,instinct='tight',xp=1,coins=2,rule='tie_heal'),
'unadmitted':dict(hp=6,dice=2,instinct='both',xp=1,coins=2,rule='fix_low'),
'doorwake':dict(hp=6,dice=3,instinct='wide',xp=1,coins=2),
'toll_eater':dict(hp=6,dice=2,instinct='both',xp=1,coins=2,rule='greed_tax'),
'passage_clerk':dict(hp=5,dice=3,instinct='tight',xp=1,coins=2,rule='double_tax'),
'seal_whelp':dict(hp=7,dice=2,instinct='both',xp=1,coins=2,rule='react'),
'misaddressed_visitor':dict(hp=6,dice=3,instinct='odd',xp=1,coins=2),
}
ELITES={
'threshold_warden':dict(hp=8,dice=3,instinct='strongest',xp=2,coins=4,elite=True,rule='fix_high'),
'seal_bearer':dict(hp=8,dice=3,instinct='strongest',xp=2,coins=4,elite=True,rule='counterseal'),
}
BOSS_STATES=[(13,18,3,'tight','sealed'),(4,12,3,'strongest','draft'),(1,3,4,'strongest','both_ways')]

ITEMS={
'bent_knife':('gear',1,5,8,8,6),'twin_nails':('gear',1,6,6,7,8),'breaching_bar':('gear',2,9,6,8,8),
'work_apron':('gear',1,5,8,7,5),'proof_vest':('gear',2,9,10,8,5),'inside_out_lining':('gear',2,8,9,7,6),
'brass_buckle':('gear',1,5,5,6,6),'small_change_purse':('gear',1,5,3,5,7),
'mirror_shard':('artifact',1,6,8,9,8),'loaded_question':('artifact',1,6,5,8,10),'false_bottom':('artifact',2,9,5,7,9),
'hidden_hand':('artifact',2,10,8,8,7),'ash_ledger':('artifact',1,6,5,6,7),'opposite_number':('artifact',2,8,5,8,10),
'brass_caliper':('artifact',1,7,5,8,9),'red_thread':('artifact',1,6,7,8,7),'carbon_paper':('artifact',2,9,6,9,8),
'stuck_key':('artifact',2,9,5,7,8),'receipt_from_nowhere':('artifact',1,6,3,5,7),'blank_face':('artifact',3,13,8,9,10),
'emergency_key':('contraband',2,5,9,7,4),'wire_cutter':('contraband',1,4,8,7,6),'counterfeit_seal':('contraband',1,3,5,6,6),
'redacted_slip':('contraband',1,3,6,6,7),'carbon_copy':('contraband',1,4,5,7,8),'temporary_injunction':('contraband',2,5,7,7,6),
}
GEAR_SLOT={'bent_knife':'weapon','twin_nails':'weapon','breaching_bar':'weapon','work_apron':'armor','proof_vest':'armor','inside_out_lining':'armor','brass_buckle':'utility','small_change_purse':'utility'}


def lock(vals,inst):
    if len(vals)<=2:return vals[:]
    if inst=='strongest':return sorted(vals,reverse=True)[:2]
    if inst=='wide':
        s=sorted(vals);return [s[0],s[-1]]
    if inst=='tight':
        pairs=[(abs(vals[i]-vals[j]),-(vals[i]+vals[j]),[vals[i],vals[j]]) for i in range(len(vals)) for j in range(i+1,len(vals))]
        return min(pairs,key=lambda x:(x[0],x[1]))[2]
    if inst=='odd':
        odds=sorted([x for x in vals if x%2],reverse=True)
        return odds[:2] if len(odds)>=2 else sorted(vals,reverse=True)[:2]
    return vals[:2]


def band(s):return 1 if s<=4 else 2 if s<=7 else 3 if s<=10 else 4
PAIRS=[((i,j),tuple(k for k in range(4) if k not in (i,j))) for i in range(4) for j in range(i+1,4)]


class Run:
    def __init__(self,seed,policy,capture='final'):
        self.rng=random.Random(seed);self.policy=policy;self.capture=capture
        self.hp=20;self.max_hp=20;self.xp=0;self.level=1;self.coins=0
        self.gear={'weapon':None,'armor':'work_apron','utility':None};self.artifacts=[];self.contra=[]
        self.tech=None;self.damage=0;self.rounds=0;self.sp=[];self.bands=[];self.elites=0;self.shops=0;self.events=0;self.items=[]
    def has(self,i):return i in self.artifacts or i in self.gear.values()
    def util(self,i):return ITEMS[i][{'safe':3,'balanced':4,'greedy':5}[self.policy]]
    def levelup(self):
        while self.level<6 and self.xp>=LEVEL_THRESH[self.level]:
            self.level+=1;self.max_hp+=2;self.hp=min(self.max_hp,self.hp+2)
            if self.level==3 and not self.tech:self.tech='steady' if self.policy!='greedy' else 'long_odds'
    def add_item(self,i):
        cat,t,p,*_=ITEMS[i]
        if cat=='gear':
            slot=GEAR_SLOT[i];old=self.gear[slot]
            if old and old!='work_apron':self.coins+=ITEMS[old][2]//2
            self.gear[slot]=i
        elif cat=='artifact':
            if i in self.artifacts:return
            if len(self.artifacts)>=4:
                old=min(self.artifacts,key=self.util);self.artifacts.remove(old);self.coins+=ITEMS[old][2]//2
            self.artifacts.append(i)
        else:
            if len(self.contra)>=2:self.contra.pop(0)
            self.contra.append(i)
        self.items.append(i)


def base_eval(run,enemy,vals,elock,pair,extra_enemy=0):
    (i,j),spare=pair;raw=vals[i]+vals[j];fight=raw;score=vals[spare[0]]+vals[spare[1]]
    if run.gear['weapon']=='bent_knife' and vals[i]!=vals[j]:fight+=1
    if run.gear['weapon']=='twin_nails' and vals[i]==vals[j]:fight+=2
    et=sum(elock)+extra_enemy;rule=enemy.get('rule')
    if rule=='greed_tax' and score>=9:fight-=1
    if rule=='double_tax' and vals[i]==vals[j]:et+=2
    if enemy.get('boss_rule')=='draft' and score>raw:et+=1
    margin=fight-et
    if margin>0:
        a,bv=vals[spare[0]],vals[spare[1]]
        if run.has('loaded_question') and a==bv:score+=2
        if run.has('false_bottom') and score<=5:score+=2
        if run.has('opposite_number') and OPP[a]==bv:score+=3
        if run.has('brass_caliper') and max(a,bv)<6:score+=1
        if run.tech=='long_odds' and margin==1:score+=2
        score=min(score,12)
    dmg=max(margin,0)
    if margin>0 and run.gear['weapon']=='breaching_bar' and raw>=10:dmg+=2
    return dict(pair=pair,raw=raw,margin=margin,score=score,dmg=dmg)


def objective(run,e,hp):
    m=e['margin'];s=e['score'] if m>0 else 0
    if run.policy=='safe':return (m>0,e['dmg'],m,s)
    if run.policy=='greedy':return (3,s,-m,e['dmg']) if m>0 else (2,0,0,0) if m==0 else (1,m,0,0)
    if m>0:
        reward=band(s)*3+s*.12+e['dmg']*.55+(3 if e['dmg']>=hp else 0)-max(0,2-m)*(1.2 if run.hp/run.max_hp<.5 else .5)
        return (3,reward,m,s)
    return (2,0,0) if m==0 else (1,m,0)


def best_pair(run,enemy,vals,elock,extra=0):
    return max((base_eval(run,enemy,vals,elock,p,extra) for p in PAIRS),key=lambda e:objective(run,e,enemy['hp']))


def choose(run,enemy,vals,elock,fixed):
    best=best_pair(run,enemy,vals,elock);best_state=(vals,elock,best,None);cands=[]
    for i,v in enumerate(vals):
        if i in fixed:continue
        if enemy['_uses'].get('bump',0)<(2 if run.tech=='steady' else 1):
            for d in (-1,1):
                if 1<=v+d<=6:
                    vv=vals[:];vv[i]=v+d;cands.append(('bump',vv,elock[:]))
        if run.has('mirror_shard') and not enemy['_uses'].get('flip'):
            vv=vals[:];vv[i]=OPP[v];cands.append(('flip',vv,elock[:]))
        if run.has('blank_face') and not enemy['_uses'].get('blank'):
            for t in (1,6):
                vv=vals[:];vv[i]=t;cands.append(('blank',vv,elock[:]))
    if run.has('carbon_paper') and not enemy['_uses'].get('copy'):
        for i in range(4):
            if i in fixed:continue
            for j in range(4):
                if i!=j:
                    vv=vals[:];vv[i]=vals[j];cands.append(('copy',vv,elock[:]))
    if run.has('hidden_hand') and not enemy['_uses'].get('interfere') and enemy.get('boss_rule')!='sealed':
        ee=elock[:];k=ee.index(max(ee))
        if ee[k]>1:ee[k]-=1;cands.append(('interfere',vals[:],ee))
    for act,vv,ee in cands:
        extra=1 if enemy.get('rule')=='react' and not enemy['_uses'].get('reacted') else 0
        if enemy.get('rule')=='counterseal' and not enemy['_uses'].get('reacted'):
            k=ee.index(min(ee));ee=ee[:];ee[k]=min(6,ee[k]+1)
        ev=best_pair(run,enemy,vv,ee,extra)
        if objective(run,ev,enemy['hp'])>objective(run,best_state[2],enemy['hp']):best_state=(vv,ee,ev,act)
    if best_state[3]:enemy['_uses'][best_state[3]]=enemy['_uses'].get(best_state[3],0)+1;enemy['_uses']['reacted']=1
    return best_state


def fight(run,edef,boss=False):
    e=dict(edef);e['max_hp']=e['hp'];e['_uses']={};scores=[];final=None;guard=False;lining=False;red=False;stored=None
    for _ in range(1,40):
        run.rounds+=1
        if boss:
            for lo,hi,d,ins,rule in BOSS_STATES:
                if lo<=e['hp']<=hi:e.update(dice=d,instinct=ins,boss_rule=rule);break
        er=[run.rng.randint(1,6) for _ in range(e['dice'])];el=lock(er,e['instinct'])
        vals=[run.rng.randint(1,6) for _ in range(4)]
        if stored is not None:vals[0]=stored;stored=None
        fixed=set()
        if e.get('rule')=='fix_low':fixed.add(vals.index(min(vals)))
        if e.get('rule')=='fix_high':fixed.add(vals.index(max(vals)))
        vals,el,ev,_=choose(run,e,vals,el,fixed);m=ev['margin']
        if m>0:
            e['hp']=max(0,e['hp']-ev['dmg']);scores.append(ev['score']);final=ev['score']
            if run.has('red_thread') and m==1 and not red:run.hp=min(run.max_hp,run.hp+1);red=True
            if run.has('stuck_key') and stored is None:stored=max(vals[k] for k in ev['pair'][1])
        elif m<0:
            dmg=-m
            if run.gear['armor']=='inside_out_lining' and dmg==1 and not lining:dmg=0;lining=True
            elif not guard:
                if run.gear['armor']=='proof_vest':dmg=max(0,dmg-2);guard=True
                elif run.gear['armor'] in ('work_apron','old_field_coat'):dmg=max(0,dmg-1);guard=True
            run.hp=max(0,run.hp-dmg);run.damage+=dmg
            if dmg and run.has('ash_ledger') and not e['_uses'].get('ledger'):run.coins+=1;e['_uses']['ledger']=1
        else:
            if boss and e.get('boss_rule')=='both_ways':e['hp']=max(0,e['hp']-2);run.hp=max(0,run.hp-2);run.damage+=2
            elif run.gear['utility']=='brass_buckle':e['hp']=max(0,e['hp']-1)
            elif e.get('rule')=='tie_heal':e['hp']=min(e['max_hp'],e['hp']+1)
        if run.hp<=0:return False,None
        if e['hp']<=0:
            score=(max(scores) if run.capture=='best' else max(scores[:2]) if run.capture=='best2' else scores[0] if run.capture=='first' else final) if scores else 2
            run.sp.append(score);run.bands.append(band(score));return True,score
    return False,None


def offer(run,b):
    maxt=1 if b==1 else 2 if b<4 else 3
    cats=['gear']*30+['artifact']*35+['contraband']*25+['coin']*(0 if b==4 else 10);cat=run.rng.choice(cats)
    if cat=='coin':return ('coin',{1:4,2:5,3:6,4:6}[b])
    pool=[i for i,(c,t,p,*_) in ITEMS.items() if c==cat and t<=maxt and i not in run.artifacts and i not in run.gear.values()]
    if b>=3:
        hi=[i for i in pool if ITEMS[i][1]>=2]
        if hi and run.rng.random()<.65:pool=hi
    return (cat,run.rng.choice(pool)) if pool else ('coin',4)


def loot(run,score,elite=False):
    b=min(4,band(score)+(1 if elite else 0));offs=[]
    while len(offs)<3:
        o=offer(run,b)
        if o not in offs:offs.append(o)
    def val(o):return o[1]*1.1 if o[0]=='coin' else run.util(o[1])
    chosen=max(offs,key=val)
    if val(chosen)<4:run.coins+=2;return
    if chosen[0]=='coin':run.coins+=chosen[1]
    else:run.add_item(chosen[1])


def rewards(run,e,score,elite=False,boss=False):
    run.coins+=e['coins'];run.xp+=e['xp'];run.levelup()
    if boss:
        run.hp=min(run.max_hp,run.hp+2)
        pool=[i for i in ('breaching_bar','proof_vest','false_bottom','hidden_hand','opposite_number','carbon_paper','stuck_key','blank_face') if i not in run.artifacts and i not in run.gear.values()]
        if pool:run.add_item(max(run.rng.sample(pool,min(3,len(pool))),key=run.util))
    else:loot(run,score,elite)


def shop(run):
    run.shops+=1;threshold={'safe':.8,'balanced':.6,'greedy':.35}[run.policy]
    if run.hp/run.max_hp<threshold and run.coins>=4:run.coins-=4;run.hp=min(run.max_hp,run.hp+4)
    pool=[i for i in ITEMS if ITEMS[i][1]<=2 and i not in run.artifacts and i not in run.gear.values()];run.rng.shuffle(pool)
    aff=[i for i in pool[:4] if ITEMS[i][2]<=run.coins]
    if aff:
        i=max(aff,key=run.util)
        if run.util(i)>=6:run.coins-=ITEMS[i][2];run.add_item(i)


def event(run):
    run.events+=1;ev=run.rng.choice(['door','board','office'])
    if ev=='door' and run.policy=='greedy' and run.hp>6:
        run.hp-=3;run.damage+=3
        pool=[i for i in ITEMS if ITEMS[i][0]=='artifact' and ITEMS[i][1]==2 and i not in run.artifacts]
        if pool:run.add_item(max(pool,key=run.util))
    elif ev=='board':
        if run.policy=='safe':run.coins+=2
        else:
            pool=[i for i in ITEMS if ITEMS[i][0]=='contraband'];run.add_item(max(pool,key=run.util));run.hp-=1;run.damage+=1
    elif ev=='office' and run.policy!='safe' and run.coins>=4:
        run.coins-=4;pool=[i for i in ITEMS if ITEMS[i][0]=='artifact' and ITEMS[i][1]==1 and i not in run.artifacts]
        if pool:run.add_item(max(pool,key=run.util))


def choose_node(run,row):
    nodes={t:(t,x) for t,x in row};h=run.hp/run.max_hp
    if run.policy=='greedy':
        for t in ('elite','combat','event','shop'):
            if t in nodes:return nodes[t]
    if run.policy=='safe':
        if 'shop' in nodes and (h<.85 or run.coins>=6):return nodes['shop']
        if 'event' in nodes and h<.9:return nodes['event']
        return nodes.get('combat',row[0])
    if 'elite' in nodes and h>=.72:return nodes['elite']
    if 'shop' in nodes and (h<.62 or (run.coins>=7 and len(run.artifacts)<2)):return nodes['shop']
    return nodes.get('combat',nodes.get('event',row[0]))


def simulate(seed,policy,capture='final'):
    run=Run(seed,policy,capture);normals=list(ENEMIES);elites=list(ELITES)
    floor=[[('combat',run.rng.choice(normals))],[('combat',run.rng.choice(normals)),('event',None)],[('combat',run.rng.choice(normals)),('elite',run.rng.choice(elites)),('shop',None)],[('combat',run.rng.choice(normals)),('event',None),('shop',None)]]
    for row in floor:
        if run.hp<=0:break
        t,x=choose_node(run,row)
        if t=='combat':
            e=dict(ENEMIES[x]);ok,score=fight(run,e)
            if ok:rewards(run,e,score)
        elif t=='elite':
            e=dict(ELITES[x]);run.elites+=1;ok,score=fight(run,e)
            if ok:rewards(run,e,score,True)
        elif t=='shop':shop(run)
        else:event(run)
    clear=False
    if run.hp>0:
        e=dict(hp=18,dice=3,instinct='tight',xp=3,coins=6);ok,score=fight(run,e,True)
        if ok:rewards(run,e,score,boss=True);clear=True
    return dict(seed=seed,policy=policy,capture=capture,clear=clear,hp=run.hp,max_hp=run.max_hp,level=run.level,xp=run.xp,coins=run.coins,damage=run.damage,rounds=run.rounds,elites=run.elites,shops=run.shops,events=run.events,spoils=run.sp,bands=run.bands,items=run.items)


def summarize(rows):
    bands=collections.Counter(b for r in rows for b in r['bands']);total=sum(bands.values()) or 1;scores=[s for r in rows for s in r['spoils']]
    return dict(runs=len(rows),clear_rate=sum(r['clear'] for r in rows)/len(rows),avg_hp=statistics.fmean(r['hp'] for r in rows),avg_damage=statistics.fmean(r['damage'] for r in rows),avg_rounds=statistics.fmean(r['rounds'] for r in rows),avg_level=statistics.fmean(r['level'] for r in rows),avg_coins=statistics.fmean(r['coins'] for r in rows),avg_elites=statistics.fmean(r['elites'] for r in rows),avg_shops=statistics.fmean(r['shops'] for r in rows),avg_spoils=statistics.fmean(scores) if scores else 0,band_frequency={str(i):bands[i]/total for i in range(1,5)})


def main():
    assert simulate(12345,'balanced','final')==simulate(12345,'balanced','final')
    captures={c:summarize([simulate(100000+i,'balanced',c) for i in range(350)]) for c in ('best','best2','first','final')}
    regression={p:summarize([simulate(1000000+offset+i,p,'final') for i in range(1200)]) for p,offset in [('safe',0),('balanced',100000),('greedy',200000)]}
    report={'determinism':'PASS','capture_comparison':captures,'regression':regression,'candidate_rules':{'spoils_capture':'final_blow','seal_bearer':'8 HP / 3d6 STRONGEST','first_door_open':'HP 1-3 / 4d6 STRONGEST'}}
    (ROOT/'simulation_report.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))


if __name__=='__main__':main()
