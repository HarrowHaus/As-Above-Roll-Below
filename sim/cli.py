#!/usr/bin/env python3
import argparse, json, statistics, collections
from .run import run_floor_mode

def simulate(n=5000, spoils_mode="final", seed_base=0):
    rows=[]
    for policy_index, policy in enumerate(("safe","balanced","greedy")):
        for i in range(n):
            rows.append(run_floor_mode(seed_base+i*101+policy_index, policy, spoils_mode))
    return rows

def summarize(rows):
    out={}
    for policy in ("safe","balanced","greedy"):
        rs=[r for r in rows if r["policy"]==policy]
        bands=collections.Counter(b for r in rs for b in r["loot_bands"])
        total=sum(bands.values()) or 1
        out[policy]={
            "runs":len(rs),
            "clear_rate":sum(r["won"] for r in rs)/len(rs),
            "mean_final_hp":statistics.mean(r["hp"] for r in rs),
            "mean_rounds":statistics.mean(r["rounds"] for r in rs),
            "mean_hp_loss":statistics.mean(r["hp_loss"] for r in rs),
            "mean_coins":statistics.mean(r["coins"] for r in rs),
            "mean_level":statistics.mean(r["level"] for r in rs),
            "mean_xp":statistics.mean(r["xp"] for r in rs),
            "mean_elites":statistics.mean(r["elite_count"] for r in rs),
            "loot_band_frequency":{str(b):bands[b]/total for b in range(1,5)}
        }
    return out

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--runs",type=int,default=5000,help="runs per policy")
    parser.add_argument("--spoils-mode",choices=["best","first2","first","final"],default="final")
    parser.add_argument("--seed-base",type=int,default=0)
    parser.add_argument("--out",default="floor1_sim_summary.json")
    args=parser.parse_args()
    result={"runs_per_policy":args.runs,"spoils_mode":args.spoils_mode,"summary":summarize(simulate(args.runs,args.spoils_mode,args.seed_base))}
    with open(args.out,"w",encoding="utf-8") as handle:
        json.dump(result,handle,indent=2)
    print(json.dumps(result["summary"],indent=2))

if __name__=="__main__":
    main()
