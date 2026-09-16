# Shared-Core Simulation E5 V2

Runs per policy: **1000**

| Policy | Clear | Avg HP | Damage | Rounds | Spoils | B1 | B2 | B3 | B4 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| safe | 96.9% | 17.44 | 6.76 | 14.01 | 5.43 | 35.1% | 44.5% | 17.4% | 3.0% |
| opportunist | 95.4% | 16.97 | 8.42 | 17.97 | 6.94 | 13.6% | 33.6% | 33.3% | 19.4% |
| greedy | 56.4% | 7.03 | 16.97 | 33.38 | 7.57 | 11.9% | 27.1% | 32.9% | 28.1% |

## Coverage note

This report was generated in GitHub Actions from commit `50d021002af9fd64bf68905e8fe2362e1b544e93` by a simulator importing `engine/core/dist`.

Floor I Events resolve through the production Event engine. Remaining E6 coverage work includes Contraband policy, several post-resolution/economy items, and promotion of a small number of special timing adapters into core.

## Interpretation

- Final-Blow Spoils preserves a strong risk/reward separation and avoids the premium-reward flooding observed under Best-Successful Spoils.
- Greedy remains diagnostic rather than strategically competent: much longer fights and much greater HP loss buy higher Spoils.
- Opportunist greed is survivable and materially improves Spoils, which is the intended shape.
- Do not tune the 19.4% Opportunist Band IV figure yet: this metric currently mixes raw Spoils band with Elite +1 reward-band uplift.
- Clear-rate interpretation is also provisional because the policies are perfect arithmetic agents and several content effects are still outside the modeled subset.
