import { EraId, WorldConditionMode, EvidenceRarity } from './types.ts';

export interface ProbabilityWeights {
  eras: Record<EraId, number>;
  worldModes: Record<WorldConditionMode, number>;
  itemRarity: Record<EvidenceRarity, number>;
}

export const DEFAULT_PROBABILITY_WEIGHTS: ProbabilityWeights = {
  eras: {
    victorian: 30,
    modern: 40,
    future: 30,
  },
  worldModes: {
    normal: 65,
    crisis: 35,
  },
  itemRarity: {
    common: 55,
    uncommon: 28,
    rare: 13,
    special: 4,
  },
};

/**
 * Normalizes an arbitrary dictionary of weights so they sum to 100%
 */
export function normalizeWeights<K extends string>(weights: Record<K, number>): Record<K, number> {
  const keys = Object.keys(weights) as K[];
  const nonNegative = keys.reduce((acc, k) => {
    acc[k] = Math.max(0, weights[k] || 0);
    return acc;
  }, {} as Record<K, number>);

  const sum = keys.reduce((acc, k) => acc + nonNegative[k], 0);

  if (sum <= 0) {
    // Equal distribution fallback
    const equalVal = Math.round(100 / keys.length);
    const result = {} as Record<K, number>;
    keys.forEach((k, idx) => {
      result[k] = idx === keys.length - 1 ? 100 - equalVal * (keys.length - 1) : equalVal;
    });
    return result;
  }

  const normalized = {} as Record<K, number>;
  let runningTotal = 0;

  keys.forEach((k, idx) => {
    if (idx === keys.length - 1) {
      normalized[k] = Math.max(0, 100 - runningTotal);
    } else {
      const val = Math.round((nonNegative[k] / sum) * 100);
      normalized[k] = val;
      runningTotal += val;
    }
  });

  return normalized;
}

export function validateWeights<K extends string>(weights: Record<K, number>): boolean {
  const values = Object.values(weights) as number[];
  const hasNegative = values.some((v) => v < 0 || isNaN(v));
  const sum = values.reduce((a, b) => a + b, 0);
  return !hasNegative && sum > 0;
}
