from dataclasses import dataclass, field
from typing import *
from pathlib import Path
import random, math, itertools, collections, json

_DATA = json.loads((Path(__file__).resolve().parents[1] / "content" / "floor1_thresholds.json").read_text())
ENEMIES = _DATA["enemies"]
ELITES = _DATA["elites"]
ITEMS = _DATA["items"]
OPPOSITES = {1:6,2:5,3:4,4:3,5:2,6:1}
XP_THRESH = [0,0,3,7,12,18,25]
BOSS_DRAFT_POOL = _DATA["boss_draft_pool"]

@dataclass
class Player:
    hp:int=20
    max_hp:int=20
    level:int=1
    xp:int=0
    coins:int=0
    gear:dict=field(default_factory=lambda:{"weapon":None,"armor":"work_apron","utility":None})
    artifacts:list=field(default_factory=list)
    contraband:list=field(default_factory=list)
    technique:Optional[str]=None
    healing_bought:int=0
    items_picked:collections.Counter=field(default_factory=collections.Counter)
    items_offered:collections.Counter=field(default_factory=collections.Counter)
    replacements:int=0
    salvage:int=0
    skipped_drafts:int=0
    def owns(self,item_id):
        return item_id in self.artifacts or item_id in self.gear.values()
    def gain_xp(self,n):
        old=self.level
        self.xp += n
        while self.level<6 and self.xp>=XP_THRESH[self.level+1]:
            self.level += 1
            self.max_hp += 2
            self.hp=min(self.max_hp,self.hp+2)
        return old,self.level

def lock_enemy(vals, instinct):
    vals=list(vals)
    if len(vals)<=2 or instinct=="BOTH":return vals[:2]
    if instinct=="STRONGEST":return sorted(vals, reverse=True)[:2]
    if instinct=="WIDE":
        s=sorted(vals);return [s[-1],s[0]]
    if instinct=="TIGHT":
        pairs=list(itertools.combinations(range(len(vals)),2))
        best=min(pairs,key=lambda ij:(abs(vals[ij[0]]-vals[ij[1]]),-(vals[ij[0]]+vals[ij[1]])))
        return [vals[best[0]],vals[best[1]]]
    if instinct=="ODD":
        odds=sorted([x for x in vals if x%2],reverse=True)
        if len(odds)>=2:return odds[:2]
        return sorted(vals,reverse=True)[:2]
    raise ValueError(instinct)

def spoils_band(score):
    if score<=4:return 1
    if score<=7:return 2
    if score<=10:return 3
    return 4

def current_boss_state(hp):
    if hp>=13:return ("CLOSED",3,"TIGHT","SEALED")
    if hp>=4:return ("AJAR",3,"STRONGEST","DRAFT")
    return ("OPEN",4,"STRONGEST","BOTH_WAYS")

def player_fight_bonus(player,dice,pair):
    vals=[dice[i] for i in pair];b=0
    if player.gear["weapon"]=="bent_knife" and vals[0]!=vals[1]:b+=1
    if player.gear["weapon"]=="twin_nails" and vals[0]==vals[1]:b+=2
    return b

def adjusted_spoils(player,vals,brass_available=True):
    score=sum(vals)
    if "loaded_question" in player.artifacts and vals[0]==vals[1]:score+=2
    if "false_bottom" in player.artifacts and score<=5:score+=2
    if "opposite_number" in player.artifacts and OPPOSITES[vals[0]]==vals[1]:score+=3
    caliper_used=False
    if "brass_caliper" in player.artifacts and brass_available and score<12 and any(v<6 for v in vals):
        score+=1;caliper_used=True
    return min(12,score),caliper_used

def item_resource_cost(action):
    if action is None:return 0
    typ=action[0]
    return {"bump":1,"flip":1.5,"copy":1.5,"transmute":2.5,"set5":2.0,"carbon_copy":2.2}.get(typ,1.0)

def self_variants(dice,fixed_idx,resources,player):
    out=[(list(dice),None)];allowed=[i for i in range(4) if i!=fixed_idx]
    if resources["bump"]>0:
        for i in allowed:
            for delta in (-1,1):
                nv=list(dice);nv[i]=max(1,min(6,nv[i]+delta))
                if nv[i]!=dice[i]:out.append((nv,("bump",i,delta)))
    if resources["flip"]>0 and "mirror_shard" in player.artifacts:
        for i in allowed:
            nv=list(dice);nv[i]=OPPOSITES[nv[i]];out.append((nv,("flip",i)))
    if resources["copy"]>0 and "carbon_paper" in player.artifacts:
        for src in range(4):
            for dst in allowed:
                if src!=dst and dice[src]!=dice[dst]:
                    nv=list(dice);nv[dst]=nv[src];out.append((nv,("copy",src,dst)))
    if resources["transmute"]>0 and "blank_face" in player.artifacts:
        for i in allowed:
            for v in (1,6):
                if dice[i]!=v:
                    nv=list(dice);nv[i]=v;out.append((nv,("transmute",i,v)))
    if "counterfeit_seal" in player.contraband:
        for i in allowed:
            if dice[i]!=5:
                nv=list(dice);nv[i]=5;out.append((nv,("set5",i)))
    if "carbon_copy" in player.contraband:
        for src in range(4):
            for dst in allowed:
                if src!=dst and dice[src]!=dice[dst]:
                    nv=list(dice);nv[dst]=nv[src];out.append((nv,("carbon_copy",src,dst)))
    return out

def enemy_variants(enemy_locked,resources,player,boss_rule=None):
    out=[(list(enemy_locked),None)]
    if boss_rule=="SEALED":return out
    if resources["hidden_hand"]>0 and "hidden_hand" in player.artifacts:
        nv=list(enemy_locked);i=max(range(len(nv)),key=lambda j:nv[j]);nv[i]=max(1,nv[i]-1);out.append((nv,("hidden_hand",i)))
    if "wire_cutter" in player.contraband:
        nv=list(enemy_locked);i=max(range(len(nv)),key=lambda j:nv[j]);nv[i]=max(1,nv[i]-2);out.append((nv,("wire_cutter",i)))
    return out

def evaluate_candidate(player,enemy,dice,pair,enemy_locked,self_action,enemy_action,armor_available,best_spoils,caliper_available,boss_rule=None):
    raw=sum(dice[i] for i in pair);fight=raw+player_fight_bonus(player,dice,pair)
    spoils_vals=[dice[i] for i in range(4) if i not in pair];base_spoils=sum(spoils_vals);enemy_total=sum(enemy_locked)
    rule=enemy.get("rule");manipulation=self_action is not None or enemy_action is not None;self_manip=self_action is not None
    if rule=="TAKE_YOUR_CUT" and base_spoils>=9:fight-=1
    if rule=="DUPLICATE_FILING":
        vals=[dice[i] for i in pair]
        if vals[0]==vals[1]:enemy_total+=2
    if rule=="REACTION_SEAL" and self_manip:enemy_total+=1
    if rule=="COUNTERSEAL" and manipulation:
        lo=min(range(len(enemy_locked)),key=lambda j:enemy_locked[j]);newv=min(6,enemy_locked[lo]+1);enemy_total+=newv-enemy_locked[lo]
    if boss_rule=="DRAFT" and base_spoils>raw:enemy_total+=1
    margin=fight-enemy_total;damage=incoming=0;spoils_score=None;caliper_trigger=False
    if margin>0:
        damage=margin
        if player.gear["weapon"]=="breaching_bar" and raw>=10:damage+=2
        spoils_score,caliper_trigger=adjusted_spoils(player,spoils_vals,caliper_available)
    elif margin<0:
        incoming=-margin;armor=player.gear["armor"]
        if armor=="work_apron" and incoming<=2:incoming=max(0,incoming-1)
        elif armor_available:
            if armor=="old_field_coat":incoming=max(0,incoming-1)
            elif armor=="proof_vest":incoming=max(0,incoming-2)
            elif armor=="inside_out_lining" and incoming==1:incoming=0
    else:
        if player.gear["utility"]=="brass_buckle":damage=1
        if boss_rule=="BOTH_WAYS":damage+=2;incoming+=2
    return {"dice":dice,"pair":pair,"enemy_locked":enemy_locked,"self_action":self_action,"enemy_action":enemy_action,"raw":raw,"fight":fight,"enemy_total":enemy_total,"margin":margin,"damage":damage,"incoming":incoming,"base_spoils":base_spoils,"spoils_score":spoils_score,"spoils_vals":spoils_vals,"caliper_trigger":caliper_trigger,"resource_cost":item_resource_cost(self_action)+(1.2 if enemy_action else 0)}

def choose_candidate(cands,policy,player,best_spoils):
    if policy=="greedy" and best_spoils is not None and best_spoils>=11:policy="safe"
    hp_ratio=player.hp/player.max_hp
    def score(c):
        margin=c["margin"]
        if policy=="safe":
            outcome=1000 if margin>0 else 300 if margin==0 else -300
            return outcome+c["damage"]*40-c["incoming"]*80+(c["spoils_score"] or 0)-c["resource_cost"]*8
        if policy=="greedy":
            if margin>0:return 1000+(c["spoils_score"] or 0)*80-c["damage"]*8-c["resource_cost"]*5
            return margin*70-c["incoming"]*60-c["resource_cost"]*8
        if margin>0:
            oldband=spoils_band(best_spoils or 2);newband=spoils_band(c["spoils_score"] or 2);gain=max(0,newband-oldband);greed_weight=25 if hp_ratio>0.65 else 12 if hp_ratio>0.4 else 4
            return 1000+c["damage"]*25+(c["spoils_score"] or 0)*greed_weight+gain*60-c["resource_cost"]*6
        if margin==0:return 200-c["resource_cost"]*6
        return -c["incoming"]*(100 if hp_ratio<0.45 else 65)-c["resource_cost"]*8
    return max(cands,key=score)

def consume_action(player,action,resources):
    if not action:return
    typ=action[0]
    if typ in resources:resources[typ]-=1
    elif typ=="set5":player.contraband.remove("counterfeit_seal")
    elif typ=="carbon_copy":player.contraband.remove("carbon_copy")
    elif typ=="wire_cutter":player.contraband.remove("wire_cutter")

def try_redacted_reroll(player,dice,fixed_idx,rng):
    if "redacted_slip" not in player.contraband:return dice,False
    inds=[i for i in range(4) if i!=fixed_idx];i=min(inds,key=lambda j:dice[j]);nd=list(dice);nd[i]=rng.randint(1,6);player.contraband.remove("redacted_slip");return nd,True

def update_spoils(scores,score,mode):
    scores.append(score)
    if mode=="best":return max(scores)
    if mode=="final":return scores[-1]
    if mode=="first":return scores[0]
    if mode=="first2":return max(scores[:2])
    raise ValueError(mode)

def combat_mode(player,enemy_key,policy,rng,boss=False,trace=False,spoils_mode="best"):
    if boss:enemy={"name":"The First Door","hp":18,"max_hp":18,"xp":3,"coins":6,"boss":True}
    else:
        src=ELITES.get(enemy_key) or ENEMIES.get(enemy_key);enemy=dict(src);enemy["max_hp"]=enemy["hp"];enemy["key"]=enemy_key
    rounds=0;hp_start=player.hp;best_spoils=None;spoils_scores=[]
    resources={"bump":2 if player.technique=="steady_hand" else 1,"flip":1,"copy":1,"transmute":1,"hidden_hand":1}
    armor_available=True;caliper_available=True;red_thread_used=False;ash_used=False;carry_locked=None;trace_rows=[]
    while enemy["hp"]>0 and player.hp>0 and rounds<40:
        rounds+=1
        if boss:state,edice,instinct,boss_rule=current_boss_state(enemy["hp"]);rule=None
        else:edice=enemy["dice"];instinct=enemy["instinct"];boss_rule=None;rule=enemy.get("rule");state=None
        enemy_locked=lock_enemy([rng.randint(1,6) for _ in range(edice)],instinct)
        dice=([carry_locked]+[rng.randint(1,6) for _ in range(3)]) if carry_locked is not None else [rng.randint(1,6) for _ in range(4)];carry_locked=None
        fixed_idx=None
        if rule=="NO_ADJUSTMENTS":fixed_idx=min(range(4),key=lambda i:(dice[i],i))
        elif rule=="INSPECTION":
            maxv=max(dice);fixed_idx=next(i for i,v in enumerate(dice) if v==maxv)
        cands=[evaluate_candidate(player,enemy,sd,pair,ed,sa,ea,armor_available,best_spoils,caliper_available,boss_rule) for ed,ea in enemy_variants(enemy_locked,resources,player,boss_rule) for sd,sa in self_variants(dice,fixed_idx,resources,player) for pair in itertools.combinations(range(4),2)]
        choice=choose_candidate(cands,policy,player,best_spoils)
        if choice["margin"]<0 and "redacted_slip" in player.contraband and policy!="greedy":
            original=choice;nd,used=try_redacted_reroll(player,dice,fixed_idx,rng)
            if used:
                c2=[evaluate_candidate(player,enemy,sd,pair,ed,sa,ea,armor_available,best_spoils,caliper_available,boss_rule) for ed,ea in enemy_variants(enemy_locked,resources,player,boss_rule) for sd,sa in self_variants(nd,fixed_idx,resources,player) for pair in itertools.combinations(range(4),2)]
                alt=choose_candidate(c2,policy,player,best_spoils)
                choice=alt if alt["margin"]>=original["margin"] else original
        if choice["margin"]<0 and "temporary_injunction" in player.contraband and not boss and enemy.get("rule"):
            enemy2=dict(enemy);enemy2["rule"]=None
            c2=[evaluate_candidate(player,enemy2,sd,pair,ed,sa,ea,armor_available,best_spoils,caliper_available,None) for ed,ea in enemy_variants(enemy_locked,resources,player,None) for sd,sa in self_variants(dice,None,resources,player) for pair in itertools.combinations(range(4),2)]
            alt=choose_candidate(c2,policy,player,best_spoils)
            if alt["margin"]>choice["margin"]:player.contraband.remove("temporary_injunction");choice=alt
        consume_action(player,choice["self_action"],resources);consume_action(player,choice["enemy_action"],resources)
        if choice["damage"]>0:enemy["hp"]=max(0,enemy["hp"]-choice["damage"])
        if choice["incoming"]>0:
            player.hp=max(0,player.hp-choice["incoming"])
            if armor_available and player.gear["armor"] in ("old_field_coat","proof_vest","inside_out_lining"):armor_available=False
            if "ash_ledger" in player.artifacts and not ash_used:player.coins+=1;ash_used=True
        if choice["margin"]>0 and choice["spoils_score"] is not None:
            score=choice["spoils_score"]
            if player.technique=="long_odds" and choice["margin"]==1:score=min(12,score+2)
            best_spoils=update_spoils(spoils_scores,score,spoils_mode)
            if choice["caliper_trigger"]:caliper_available=False
            if "red_thread" in player.artifacts and choice["margin"]==1 and not red_thread_used:player.hp=min(player.max_hp,player.hp+1);red_thread_used=True
            if "stuck_key" in player.artifacts and enemy["hp"]>0 and choice["spoils_vals"]:carry_locked=max(choice["spoils_vals"])
        if not boss and rule=="REFUSAL" and choice["margin"]==0:enemy["hp"]=min(enemy["max_hp"],enemy["hp"]+1)
    return {"won":enemy["hp"]<=0 and player.hp>0,"rounds":rounds,"hp_loss":hp_start-player.hp,"best_spoils":best_spoils or 2,"enemy":enemy["name"],"trace":trace_rows,"player_hp":player.hp}
