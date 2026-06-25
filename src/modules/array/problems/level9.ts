import type { ProblemConfig } from '../../../engine';
import {
  buildLongestConsecutive,
  buildProductExceptSelf,
  buildFisherYates,
  buildNextPermutation,
  buildMaxXorSubarray,
  buildCountInversions,
  buildTripletsZero,
  buildLIS,
  buildMaxCircularSubarray,
} from '../helpers/arrayBuilders';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 9 };

export const longestConsecutive: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-longest-consecutive',
  title: 'Longest consecutive sequence',
  programNumber: 116,
  movementType: 'F',
  codeLines: ['hashset of values', 'extend chains from sequence starts'],
  defaultInput: { arr: [100, 4, 200, 1, 3, 2] },
  buildSteps: ({ arr }) => buildLongestConsecutive(arr),
};

export const productExceptSelf: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-product-except-self',
  title: 'Product of array except self',
  programNumber: 117,
  movementType: 'U',
  codeLines: ['pass 1: prefix products', 'pass 2: suffix products', 'combine'],
  defaultInput: { arr: [1, 2, 3, 4] },
  buildSteps: ({ arr }) => buildProductExceptSelf(arr),
};

export const shuffleFisherYates: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-shuffle-fisher-yates',
  title: 'Shuffle array (Fisher-Yates)',
  programNumber: 118,
  movementType: 'B',
  codeLines: ['for i from n-1 down to 1:', '    swap arr[i] with random j <= i'],
  defaultInput: { arr: [1, 2, 3, 4, 5] },
  buildSteps: ({ arr }) => buildFisherYates(arr),
};

export const nextPermutation: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-next-permutation',
  title: 'Next permutation',
  programNumber: 119,
  movementType: 'X',
  codeLines: ['find pivot', 'find successor, swap', 'reverse suffix'],
  defaultInput: { arr: [1, 2, 3] },
  buildSteps: ({ arr }) => buildNextPermutation(arr, false),
};

export const previousPermutation: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-previous-permutation',
  title: 'Previous permutation',
  programNumber: 120,
  movementType: 'X',
  codeLines: ['find pivot (desc)', 'find predecessor, swap', 'reverse suffix'],
  defaultInput: { arr: [3, 2, 1] },
  buildSteps: ({ arr }) => buildNextPermutation(arr, true),
};

export const maxXorSubarray: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-max-xor-subarray',
  title: 'Max XOR subarray',
  programNumber: 121,
  movementType: 'A',
  codeLines: ['brute force all subarrays', 'track max xor'],
  defaultInput: { arr: [1, 2, 3, 4] },
  buildSteps: ({ arr }) => buildMaxXorSubarray(arr),
};

export const countInversions: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-count-inversions',
  title: 'Count inversions',
  programNumber: 122,
  movementType: 'W',
  codeLines: ['merge sort divide', 'count cross inversions on merge'],
  defaultInput: { arr: [2, 4, 1, 3, 5] },
  buildSteps: ({ arr }) => buildCountInversions(arr),
};

export const tripletsZero: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-triplets-zero',
  title: 'All triplets summing to zero',
  programNumber: 123,
  movementType: 'B',
  codeLines: ['fix one element', 'two-pointer for sum zero', 'skip duplicates'],
  defaultInput: { arr: [-1, 0, 1, 2, -1, -4] },
  buildSteps: ({ arr }) => buildTripletsZero(arr),
};

export const longestIncreasingSubsequence: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-lis',
  title: 'Longest increasing subsequence',
  programNumber: 124,
  movementType: 'A',
  codeLines: ['dp[i] = 1 + max(dp[j]) for j < i', 'O(n^2) DP array'],
  defaultInput: { arr: [10, 9, 2, 5, 3, 7, 101, 18] },
  buildSteps: ({ arr }) => buildLIS(arr),
};

export const maxCircularSubarray: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-max-circular-subarray',
  title: 'Max circular subarray sum',
  programNumber: 125,
  movementType: 'G',
  codeLines: ['normal Kadane', 'inverted Kadane on negatives', 'combine wrap case'],
  defaultInput: { arr: [5, -3, 5] },
  buildSteps: ({ arr }) => buildMaxCircularSubarray(arr),
};

export const level9Problems = [
  longestConsecutive,
  productExceptSelf,
  shuffleFisherYates,
  nextPermutation,
  previousPermutation,
  maxXorSubarray,
  countInversions,
  tripletsZero,
  longestIncreasingSubsequence,
  maxCircularSubarray,
];
