import type { DieValue, EnemyInstinct } from "../types.js";

interface CandidatePair {
  readonly a: DieValue;
  readonly b: DieValue;
  readonly i: number;
  readonly j: number;
}

function pairs(values: readonly DieValue[]): CandidatePair[] {
  const out: CandidatePair[] = [];
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      out.push({ a: values[i]!, b: values[j]!, i, j });
    }
  }
  return out;
}

function pairTotal(pair: CandidatePair): number {
  return pair.a + pair.b;
}

function stableValues(pair: CandidatePair): readonly [DieValue, DieValue] {
  return [pair.a, pair.b];
}

export function lockByInstinct(values: readonly DieValue[], instinct: EnemyInstinct): readonly [DieValue, DieValue] {
  if (values.length < 2) throw new Error("Enemy needs at least two dice to lock a pair");
  if (values.length === 2 || instinct === "BOTH") return [values[0]!, values[1]!];

  const candidates = pairs(values);
  let filtered = candidates;

  switch (instinct) {
    case "STRONGEST":
      filtered = [...candidates].sort((x, y) => pairTotal(y) - pairTotal(x) || x.i - y.i || x.j - y.j);
      break;
    case "LOWEST":
      filtered = [...candidates].sort((x, y) => pairTotal(x) - pairTotal(y) || x.i - y.i || x.j - y.j);
      break;
    case "WIDE":
      filtered = [...candidates].sort((x, y) => Math.abs(y.a - y.b) - Math.abs(x.a - x.b) || pairTotal(y) - pairTotal(x));
      break;
    case "TIGHT":
      filtered = [...candidates].sort((x, y) => Math.abs(x.a - x.b) - Math.abs(y.a - y.b) || pairTotal(y) - pairTotal(x));
      break;
    case "ODD": {
      const preferred = candidates.filter((p) => p.a % 2 === 1 && p.b % 2 === 1);
      filtered = [...(preferred.length ? preferred : candidates)].sort((x, y) => pairTotal(y) - pairTotal(x));
      break;
    }
    case "EVEN": {
      const preferred = candidates.filter((p) => p.a % 2 === 0 && p.b % 2 === 0);
      filtered = [...(preferred.length ? preferred : candidates)].sort((x, y) => pairTotal(y) - pairTotal(x));
      break;
    }
    case "DOUBLES": {
      const preferred = candidates.filter((p) => p.a === p.b);
      filtered = [...(preferred.length ? preferred : candidates)].sort((x, y) => pairTotal(y) - pairTotal(x));
      break;
    }
    default: {
      const exhaustive: never = instinct;
      throw new Error(`Unhandled instinct ${String(exhaustive)}`);
    }
  }

  return stableValues(filtered[0]!);
}
