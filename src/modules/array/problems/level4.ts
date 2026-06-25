import type { ProblemConfig } from '../../../engine';
import { DEFAULT_ARR } from '../helpers/arrayHelpers';
import {
  buildCheckSorted,
  buildCheckPalindrome,
  buildSumAtStride,
  buildSecondExtreme,
  buildKthExtreme,
  buildCountVsAverage,
  buildLongestIncreasingRun,
} from '../helpers/arrayBuilders';
import { findMaxAndMin } from './level2';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 4 };

export const checkSortedAsc: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-check-sorted-asc',
  title: 'Check sorted (ascending)',
  programNumber: 46,
  movementType: 'A',
  codeLines: ['for i in range(1, n):', '    if arr[i] <= arr[i-1]: return False'],
  defaultInput: { arr: [1, 2, 3, 4, 5] },
  buildSteps: ({ arr }) => buildCheckSorted(arr, 'asc'),
};

export const checkSortedDesc: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-check-sorted-desc',
  title: 'Check sorted (descending)',
  programNumber: 47,
  movementType: 'A',
  codeLines: ['for i in range(1, n):', '    if arr[i] >= arr[i-1]: return False'],
  defaultInput: { arr: [5, 4, 3, 2, 1] },
  buildSteps: ({ arr }) => buildCheckSorted(arr, 'desc'),
};

export const checkSortedNonDec: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-check-sorted-nondec',
  title: 'Check sorted (non-decreasing)',
  programNumber: 48,
  movementType: 'A',
  codeLines: ['for i in range(1, n):', '    if arr[i] < arr[i-1]: return False'],
  defaultInput: { arr: [1, 2, 2, 3, 3] },
  buildSteps: ({ arr }) => buildCheckSorted(arr, 'nondec'),
};

export const checkPalindrome: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-check-palindrome',
  title: 'Check palindrome',
  programNumber: 49,
  movementType: 'B',
  codeLines: ['left, right = 0, n-1', 'while left < right:', '    compare arr[left], arr[right]'],
  defaultInput: { arr: [1, 2, 3, 2, 1] },
  buildSteps: ({ arr }) => buildCheckPalindrome(arr),
};

export const sumEvenIndices: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sum-even-indices',
  title: 'Sum at even indices',
  programNumber: 50,
  movementType: 'A',
  codeLines: ['for i in range(0, n, 2):', '    total += arr[i]'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildSumAtStride(arr, 0),
};

export const sumOddIndices: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sum-odd-indices',
  title: 'Sum at odd indices',
  programNumber: 51,
  movementType: 'A',
  codeLines: ['for i in range(1, n, 2):', '    total += arr[i]'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildSumAtStride(arr, 1),
};

export const diffEvenOddSum: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-diff-even-odd-sum',
  title: 'Difference (even-sum − odd-sum)',
  programNumber: 52,
  movementType: 'A',
  codeLines: ['even_sum = sum even indices', 'odd_sum = sum odd indices', 'return even - odd'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    const evenSteps = buildSumAtStride(arr, 0);
    const oddSteps = buildSumAtStride(arr, 1);
    const evenSum = arr.filter((_, i) => i % 2 === 0).reduce((s, v) => s + v, 0);
    const oddSum = arr.filter((_, i) => i % 2 === 1).reduce((s, v) => s + v, 0);
    return [
      ...evenSteps,
      ...oddSteps,
      ...evenSteps.slice(-1).map((s) => ({
        ...s,
        message: `even - odd = ${evenSum - oddSum}`,
        variables: { evenSum, oddSum, diff: evenSum - oddSum },
      })),
    ];
  },
};

export const rangeMaxMin: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-range',
  title: 'Range (max − min)',
  programNumber: 53,
  movementType: 'A',
  codeLines: ['find max and min', 'return max - min'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    const steps = findMaxAndMin.buildSteps({ arr });
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    return [...steps, ...steps.slice(-1).map((s) => ({ ...s, variables: { max, min, range: max - min }, message: `range = ${max - min}` }))];
  },
};

export const secondLargest: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-second-largest',
  title: 'Second largest (no sort)',
  programNumber: 54,
  movementType: 'A',
  codeLines: ['track largest, secondLargest', 'single pass update'],
  defaultInput: { arr: [3, 1, 4, 1, 5, 9] },
  buildSteps: ({ arr }) => buildSecondExtreme(arr, true),
};

export const secondSmallest: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-second-smallest',
  title: 'Second smallest (no sort)',
  programNumber: 55,
  movementType: 'A',
  codeLines: ['track smallest, secondSmallest', 'single pass update'],
  defaultInput: { arr: [3, 1, 4, 1, 5, 9] },
  buildSteps: ({ arr }) => buildSecondExtreme(arr, false),
};

export const kthLargest: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-kth-largest',
  title: 'Kth largest',
  programNumber: 56,
  movementType: 'A',
  codeLines: ['repeat k times: find max in remaining', 'mark used elements'],
  defaultInput: { arr: [3, 1, 4, 1, 5, 9], k: 2 },
  buildSteps: ({ arr, k }) => buildKthExtreme(arr, k, true),
};

export const kthSmallest: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-kth-smallest',
  title: 'Kth smallest',
  programNumber: 57,
  movementType: 'A',
  codeLines: ['repeat k times: find min in remaining', 'mark used elements'],
  defaultInput: { arr: [3, 1, 4, 1, 5, 9], k: 2 },
  buildSteps: ({ arr, k }) => buildKthExtreme(arr, k, false),
};

export const countGtAverage: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-count-gt-avg',
  title: 'Count elements > average',
  programNumber: 58,
  movementType: 'A',
  codeLines: ['avg = sum / n', 'second pass: count > avg'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildCountVsAverage(arr, true),
};

export const countLtAverage: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-count-lt-avg',
  title: 'Count elements < average',
  programNumber: 59,
  movementType: 'A',
  codeLines: ['avg = sum / n', 'second pass: count < avg'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildCountVsAverage(arr, false),
};

export const longestIncreasingRun: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-longest-increasing-run',
  title: 'Longest increasing consecutive run',
  programNumber: 60,
  movementType: 'A',
  codeLines: ['cur = 1 if arr[i] > arr[i-1] else reset', 'track max run'],
  defaultInput: { arr: [1, 2, 3, 2, 3, 4, 5] },
  buildSteps: ({ arr }) => buildLongestIncreasingRun(arr),
};

export const level4Problems = [
  checkSortedAsc,
  checkSortedDesc,
  checkSortedNonDec,
  checkPalindrome,
  sumEvenIndices,
  sumOddIndices,
  diffEvenOddSum,
  rangeMaxMin,
  secondLargest,
  secondSmallest,
  kthLargest,
  kthSmallest,
  countGtAverage,
  countLtAverage,
  longestIncreasingRun,
];
