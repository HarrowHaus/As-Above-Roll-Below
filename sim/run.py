import random, math, collections, copy
from .core import *

def item_utility(item_id, policy, player):
    x=ITEMS[item_id];tags=set(x["tags"]);base=x["tier"]*10
    prefs={
        "safe":{"defense":12,"certainty":10,"fight":9,"healing":9,"interference":8,"damage":6,"spoils":2,"economy":3,"pattern":4,"lock":4},
        "greedy":{"spoils":13,"greed":12,"pattern":11,"copy":10,"transmute":10,"low_face":9,"margin1":9,"economy":6,"fight":4,"defense":2,"healing":2},
        "balanced":{"certainty":9,"spoils":8,"fight":8,"defense":7,"pattern":7,"interference":7,"damage":7,"healing":6,"economy":5,"copy":7,"transmute":8,"lock":6}
    }[policy]
    u=base+sum(prefs.get(t,0) for t in tags)
    owned_tags=set()
    for iid in player.artifacts+[i for i in player.gear.values() if i]:
        if iid in ITEMS:owned_tags.update(ITEMS[iid]["tags"])
    u+=sum(2 for t in tags if t in owned_tags)
    if x["cat"]=="contraband":u-=3
    return u

def eligible_items(cat=None,tier=None,player=None,band=1):
    ids=[]
    for iid,x in ITEMS.items():
        if cat and x["cat"]!=cat:continue
        if tier and x["tier"]!=tier:continue
        if iid=="blank_face" and band<4:continue
        if player and x["cat"]=="artifact" and iid in player.artifacts:continue
        if player and x["cat"]=="gear" and iid in player.gear.values():continue
        ids.append(iid)
    return ids

def weighted_choice(rng,pairs):
    total=sum(w for _,w in pairs);r=rng.random()*total
    for value,weight in pairs:
        r-=weight
        if r<=0:return value
    return pairs[-1][0]

def pick_persistent_tier(rng,band):
    weights={1:[(1,1.0)],2:[(1,.8),(2,.2)],3:[(1,.35),(2,.65)],4:[(2,.75),(3,.25)]}[band]
    return weighted_choice(rng,weights)

def draw_item_for_category(rng,cat,band,player):
    if cat=="coin":return f"coin_{band}"
    if cat=="contraband":
        tier=1 if band<3 or rng.random()<.7 else 2
        pool=eligible_items("contraband",tier,player,band) or eligible_items("contraband",None,player,band)
        return rng.choice(pool)
    tier=pick_persistent_tier(rng,band)
    pool=eligible_items(cat,tier,player,band) or eligible_items(cat,None,player,band)
    return rng.choice(pool)

def generate_loot_draft(rng,band,player,elite=False):
    b=min(4,band+(1 if elite else 0));offers=[]
    if b==1:
        cat=weighted_choice(rng,[("gear",30),("artifact",35),("contraband",35)]);offers.append(draw_item_for_category(rng,cat,b,player))
    elif b==2:
        cat=weighted_choice(rng,[("gear",45),("artifact",55)]);offers.append(draw_item_for_category(rng,cat,b,player))
    elif b==3:
        cat=weighted_choice(rng,[("gear",45),("artifact",55)]);pool=eligible_items(cat,2,player,b);offers.append(rng.choice(pool) if pool else draw_item_for_category(rng,cat,b,player))
    else:
        for _ in range(2):
            cat=weighted_choice(rng,[("gear",40),("artifact",60)]);offers.append(draw_item_for_category(rng,cat,b,player))
    weights={1:[("gear",30),("artifact",35),("contraband",25),("coin",10)],2:[("gear",30),("artifact",35),("contraband",25),("coin",10)],3:[("gear",34),("artifact",43),("contraband",18),("coin",5)],4:[("gear",40),("artifact",50),("contraband",10)]}[b]
    tries=0
    while len(offers)<3 and tries<50:
        tries+=1;cat=weighted_choice(rng,weights);iid=draw_item_for_category(rng,cat,b,player)
        if iid not in offers:offers.append(iid)
    return offers[:3],b

def coin_cache_value(token):return {1:4,2:5,3:6}.get(int(token.split("_")[1]),0)

def acquire_item(player,iid,policy):
    if iid.startswith("coin_"):player.coins+=coin_cache_value(iid);return True
    x=ITEMS[iid];cat=x["cat"]
    if cat=="gear":
        slot=x["slot"];old=player.gear.get(slot)
        if old:
            old_u=item_utility(old,policy,player) if old in ITEMS else 8;new_u=item_utility(iid,policy,player)
            if new_u<=old_u:return False
            if old in ITEMS:
                value=ITEMS[old]["price"]//2;player.coins+=value;player.salvage+=value
            player.replacements+=1
        player.gear[slot]=iid
    elif cat=="artifact":
        if len(player.artifacts)>=4:
            _,idx,old=min((item_utility(a,policy,player),i,a) for i,a in enumerate(player.artifacts))
            if item_utility(iid,policy,player)<=item_utility(old,policy,player):return False
            value=ITEMS[old]["price"]//2;player.coins+=value;player.salvage+=value;player.artifacts.pop(idx);player.replacements+=1
        player.artifacts.append(iid)
    else:
        if len(player.contraband)>=2:
            _,idx,old=min((item_utility(a,policy,player),i,a) for i,a in enumerate(player.contraband))
            if item_utility(iid,policy,player)<=item_utility(old,policy,player):return False
            player.contraband.pop(idx);player.replacements+=1
        player.contraband.append(iid)
    player.items_picked[iid]+=1
    return True

def choose_loot(player,offers,policy):
    scored=[]
    for iid in offers:
        if iid.startswith("coin_"):u=coin_cache_value(iid)*4+(8 if player.coins<5 else 0)
        else:
            u=item_utility(iid,policy,player);x=ITEMS[iid]
            if x["cat"]=="gear" and player.gear.get(x["slot"]):
                old=player.gear[x["slot"]];u-=(item_utility(old,policy,player) if old in ITEMS else 8)*.6
            elif x["cat"]=="artifact" and len(player.artifacts)>=4:u-=min(item_utility(a,policy,player) for a in player.artifacts)*.6
        scored.append((u,iid))
        if not iid.startswith("coin_"):player.items_offered[iid]+=1
    best_u,best=max(scored)
    if best_u<9:
        player.coins+=2+(2 if player.gear["utility"]=="small_change_purse" else 0);player.skipped_drafts+=1;return None
    if acquire_item(player,best,policy):return best
    for _,iid in sorted(scored,reverse=True)[1:]:
        if acquire_item(player,iid,policy):return iid
    player.coins+=2;player.skipped_drafts+=1;return None

def shop_stock(rng,player):
    stock=[]
    for cat,n in [("gear",1),("artifact",2),("contraband",1)]:
        for _ in range(n):
            tier=1 if rng.random()<.75 else 2;pool=eligible_items(cat,tier,player,3) or eligible_items(cat,None,player,3);choices=[x for x in pool if x not in stock]
            if choices:stock.append(rng.choice(choices))
    return stock

def shop_visit(player,policy,rng):
    actions=[];discount=2 if "receipt_nowhere" in player.artifacts else 0;threshold={"safe":.75,"balanced":.55,"greedy":.35}[policy]
    if player.hp/player.max_hp<threshold and player.coins>=max(1,4-discount):
        cost=max(1,4-discount);discount=0;player.coins-=cost;player.hp=min(player.max_hp,player.hp+4);player.healing_bought+=1;actions.append(("heal",cost))
    scored=[]
    for iid in shop_stock(rng,player):
        price=max(1,ITEMS[iid]["price"]-discount);u=item_utility(iid,policy,player);scored.append((u/price,u,price,iid))
    buys=0
    for _,u,_,iid in sorted(scored,reverse=True):
        actual=max(1,ITEMS[iid]["price"]-discount)
        if player.coins>=actual and u>=18 and buys<2 and acquire_item(player,iid,policy):
            player.coins-=actual;discount=0;buys+=1;actions.append((iid,actual))
    return actions

def event_visit(player,policy,rng,event_id):
    if event_id=="unnumbered_door":
        if policy=="greedy" and player.hp>5:
            player.hp-=3;pool=eligible_items("artifact",2,player,3)
            if pool:acquire_item(player,rng.choice(pool),policy)
            return "force"
        if policy=="balanced" and player.hp>7:
            roll=rng.randint(1,6)
            if roll<=2:player.hp-=2
            elif roll<=4:player.coins+=4
            else:
                pool=eligible_items("artifact",1,player,2)
                if pool:acquire_item(player,rng.choice(pool),policy)
            return "knock"
        return "leave"
    if event_id=="talking_board":
        if policy=="greedy" and player.hp>3:
            player.hp-=1;pool=eligible_items("contraband",None,player,2)
            if pool:acquire_item(player,rng.choice(pool),policy)
            return "pointer"
        if policy=="safe":player.coins+=2;return "put_back"
        return "ask"
    if event_id=="lost_property":
        if policy=="greedy" and player.coins>=4:
            player.coins-=4;pool=[i for i in eligible_items(None,1,player,2) if ITEMS[i]["cat"] in ("gear","artifact")]
            if pool:acquire_item(player,rng.choice(pool),policy)
            return "claim"
        equipped=[i for i in player.gear.values() if i in ITEMS]+list(player.artifacts)
        if policy=="safe" and equipped:
            weakest=min(equipped,key=lambda iid:item_utility(iid,policy,player))
            if item_utility(weakest,policy,player)<18:
                player.coins+=math.floor(ITEMS[weakest]["price"]*.75)
                if weakest in player.artifacts:player.artifacts.remove(weakest)
                else:
                    for slot,value in player.gear.items():
                        if value==weakest:player.gear[slot]=None
                return "file"
        return "leave"

def choose_route(policy,player,options):
    hp=player.hp/player.max_hp
    if policy=="safe":
        if "shop" in options and hp<.70 and player.coins>=4:return "shop"
        if "event" in options and hp<.55:return "event"
        if "combat" in options:return "combat"
        if "shop" in options:return "shop"
        if "event" in options:return "event"
        return options[0]
    if policy=="greedy":
        if "elite" in options and hp>.42:return "elite"
        if "combat" in options:return "combat"
        if "event" in options:return "event"
        return options[0]
    if "shop" in options and hp<.50 and player.coins>=4:return "shop"
    if "elite" in options and hp>.68:return "elite"
    if "combat" in options:return "combat"
    if "event" in options:return "event"
    if "shop" in options:return "shop"
    return options[0]

def choose_normal_enemy(rng,row,last):
    pool=list(ENEMIES)
    weights=[6 if k=="latchling" else 2 if ENEMIES[k]["pressure"]==2 else .5 for k in pool] if row==1 else [1.5 if ENEMIES[k]["pressure"]==2 else 1 for k in pool]
    if last in pool:weights[pool.index(last)]*=.2
    return weighted_choice(rng,list(zip(pool,weights)))

def maybe_level(player,policy):
    old=player.level
    while player.level<6 and player.xp>=XP_THRESH[player.level+1]:
        player.level+=1;player.max_hp+=2;player.hp=min(player.max_hp,player.hp+2)
        if player.level==3 and player.technique is None:player.technique={"safe":"steady_hand","greedy":"long_odds","balanced":"steady_hand"}[policy]
    return player.level-old

def boss_draft(player,policy,rng):
    pool=[x for x in BOSS_DRAFT_POOL if not player.owns(x)];rng.shuffle(pool);offers=pool[:3]
    if not offers:return None
    choice=max(offers,key=lambda iid:item_utility(iid,policy,player));acquire_item(player,choice,policy);return choice

def use_emergency_key_between(player,policy):
    if "emergency_key" not in player.contraband:return False
    if player.hp/player.max_hp<{"safe":.70,"balanced":.45,"greedy":.25}[policy]:
        player.contraband.remove("emergency_key");player.hp=min(player.max_hp,player.hp+4);return True
    return False

def run_floor_mode(seed,policy,spoils_mode="final"):
    rng=random.Random(seed);player=Player();player.gear["armor"]="old_field_coat";last_enemy=None
    results=[];route=[];loot_bands=[];draft_bands=[];elite_count=0
    rows=[["combat"],["combat","event"],["combat","elite","shop"],["combat","elite","event","shop"]];events=["unnumbered_door","talking_board","lost_property"]
    for row_index,options in enumerate(rows,1):
        if player.hp<=0:break
        node=choose_route(policy,player,options);route.append(node)
        if node=="combat":
            key=choose_normal_enemy(rng,row_index,last_enemy);last_enemy=key;result=combat_mode(player,key,policy,rng,spoils_mode=spoils_mode);results.append(result)
            if not result["won"]:break
            player.xp+=ENEMIES[key]["xp"];player.coins+=ENEMIES[key]["coins"];maybe_level(player,policy);band=spoils_band(result["best_spoils"]);loot_bands.append(band);offers,draft_band=generate_loot_draft(rng,band,player);draft_bands.append(draft_band);choose_loot(player,offers,policy)
        elif node=="elite":
            elite_count+=1;key=rng.choice(list(ELITES));result=combat_mode(player,key,policy,rng,spoils_mode=spoils_mode);results.append(result)
            if not result["won"]:break
            player.xp+=2;player.coins+=4;maybe_level(player,policy);band=spoils_band(result["best_spoils"]);loot_bands.append(band);offers,draft_band=generate_loot_draft(rng,band,player,elite=True);draft_bands.append(draft_band);choose_loot(player,offers,policy)
        elif node=="shop":shop_visit(player,policy,rng)
        else:event_visit(player,policy,rng,rng.choice(events))
        use_emergency_key_between(player,policy)
    boss=None;boss_pick=None
    if player.hp>0:
        route.append("boss");boss=combat_mode(player,None,policy,rng,boss=True,spoils_mode=spoils_mode);results.append(boss)
        if boss["won"]:
            player.xp+=3;player.coins+=6;maybe_level(player,policy);player.hp=min(player.max_hp,player.hp+2);boss_pick=boss_draft(player,policy,rng)
    return {"policy":policy,"won":bool(boss and boss["won"]),"hp":player.hp,"max_hp":player.max_hp,"level":player.level,"xp":player.xp,"coins":player.coins,"rounds":sum(r["rounds"] for r in results),"hp_loss":sum(max(0,r["hp_loss"]) for r in results),"loot_bands":loot_bands,"draft_bands":draft_bands,"best_spoils":[r["best_spoils"] for r in results if r["won"]],"elite_count":elite_count,"replacements":player.replacements,"salvage":player.salvage,"skips":player.skipped_drafts,"healing_bought":player.healing_bought,"items_picked":dict(player.items_picked),"items_offered":dict(player.items_offered),"gear":dict(player.gear),"artifacts":list(player.artifacts),"contraband":list(player.contraband),"route":route,"boss_pick":boss_pick}
