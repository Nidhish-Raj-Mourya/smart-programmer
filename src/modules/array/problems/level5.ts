import type { ProblemConfig } from '../../../engine';
import {
  buildPairSum,
  buildTripletSum,
  buildPairDiffCount,
  buildFixedWindowSum,
  buildFirstNegativeInWindow,
  buildMaxInEveryWindow,
  buildCountSubarraysSumK,
  buildVariableWindowSum,
} from '../helpers/arrayBuilders';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 5 };
const SORTED_ARR = [1, 2, 3, 4, 5, 6, 7, 8];

export const pairWithSum: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-pair-sum',
  title: 'Pair with given sum (two pointer)',
  programNumber: 61,
  movementType: 'B',
  codeLines: ['left, right = 0, n-1', 'while left < right:', '    if sum == target: found'],
  defaultInput: { arr: SORTED_ARR, target: 9 },
  buildSteps: ({ arr, target }) => buildPairSum(arr, target, 'find'),
};

export const countPairsWithSum: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-count-pairs-sum',
  title: 'Count pairs with given sum',
  programNumber: 62,
  movementType: 'B',
  codeLines: ['two pointer scan', 'count += 1 on each match'],
  defaultInput: { arr: [1, 1, 2, 2, 3, 3], target: 4 },
  buildSteps: ({ arr, target }) => buildPairSum(arr, target, 'count'),
};

export const allPairsWithSum: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-all-pairs-sum',
  title: 'Print all pairs with given sum',
  programNumber: 63,
  movementType: 'B',
  codeLines: ['two pointer scan', 'append each matching pair'],
  defaultInput: { arr: [1, 2, 3, 4, 5], target: 6 },
  buildSteps: ({ arr, target }) => buildPairSum(arr, target, 'all'),
};

export const tripletWithSum: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-triplet-sum',
  title: 'Triplet with given sum',
  programNumber: 64,
  movementType: 'B',
  codeLines: ['for k in range(n):', '    two-pointer on rest'],
  defaultInput: { arr: [-1, 0, 1, 2, -1, -4], target: 0 },
  buildSteps: ({ arr, target }) => buildTripletSum(arr, target),
};

export const countPairsDiffK: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-count-pairs-diff',
  title: 'Count pairs with difference K',
  programNumber: 65,
  movementType: 'B',
  codeLines: ['two pointers on sorted arr', 'count |a-b| == K'],
  defaultInput: { arr: [1, 2, 3, 4, 5], k: 2 },
  buildSteps: ({ arr, k }) => buildPairDiffCount(arr, k),
};

export const maxSumKConsecutive: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-max-sum-k-window',
  title: 'Max sum of K consecutive',
  programNumber: 66,
  movementType: 'C',
  codeLines: ['window sum of size K', 'slide and track max'],
  defaultInput: { arr: [2, 1, 5, 1, 3, 2], k: 3 },
  buildSteps: ({ arr, k }) => buildFixedWindowSum(arr, k, true),
};

export const minSumKConsecutive: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-min-sum-k-window',
  title: 'Min sum of K consecutive',
  programNumber: 67,
  movementType: 'C',
  codeLines: ['window sum of size K', 'slide and track min'],
  defaultInput: { arr: [2, 1, 5, 1, 3, 2], k: 3 },
  buildSteps: ({ arr, k }) => buildFixedWindowSum(arr, k, false),
};

export const firstNegativeEveryWindow: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-first-negative-window',
  title: 'First negative in every window K',
  programNumber: 68,
  movementType: 'C',
  codeLines: ['for each window of K:', '    scan for first negative'],
  defaultInput: { arr: [12, -1, -7, 8, -15, 30, 16, 28], k: 3 },
  buildSteps: ({ arr, k }) => buildFirstNegativeInWindow(arr, k),
};

export const maxInEveryWindow: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-max-every-window',
  title: 'Max in every window of size K',
  programNumber: 69,
  movementType: 'C',
  codeLines: ['for each window:', '    find max inside window'],
  defaultInput: { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
  buildSteps: ({ arr, k }) => buildMaxInEveryWindow(arr, k),
};

export const countSubarraysSumK: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-count-subarrays-sum-k',
  title: 'Count subarrays with sum K',
  programNumber: 70,
  movementType: 'C',
  codeLines: ['prefix sum + hashmap', 'count prefix == sum - K'],
  defaultInput: { arr: [1, 2, 3, 4, 5], k: 9 },
  buildSteps: ({ arr, k }) => buildCountSubarraysSumK(arr, k),
};

export const subarrayGivenSum: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-subarray-given-sum',
  title: 'Subarray with given sum (positive only)',
  programNumber: 71,
  movementType: 'C',
  codeLines: ['variable window', 'expand/shrink until sum == K'],
  defaultInput: { arr: [1, 2, 3, 4, 5], k: 9 },
  buildSteps: ({ arr, k }) => buildVariableWindowSum(arr, k, false),
};

export const longestSubarraySumK: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-longest-subarray-sum-k',
  title: 'Longest subarray with sum K',
  programNumber: 72,
  movementType: 'C',
  codeLines: ['variable window', 'track max length when sum == K'],
  defaultInput: { arr: [1, -1, 5, -2, 3], k: 3 },
  buildSteps: ({ arr, k }) => buildVariableWindowSum(arr, k, true),
};

export const level5Problems = [
  pairWithSum,
  countPairsWithSum,
  allPairsWithSum,
  tripletWithSum,
  countPairsDiffK,
  maxSumKConsecutive,
  minSumKConsecutive,
  firstNegativeEveryWindow,
  maxInEveryWindow,
  countSubarraysSumK,
  subarrayGivenSum,
  longestSubarraySumK,
];
