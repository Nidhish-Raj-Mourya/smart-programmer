import type { ProblemConfig } from '../../../engine';
import { arrayStep } from '../helpers/arrayHelpers';
import {
  buildBinarySearch,
  buildRotatedSearch,
  buildMinRotated,
  buildPeakBinarySearch,
  buildFloorCeiling,
  buildCountGreaterSorted,
  buildKthSmallestBinarySearch,
  buildMedianTwoSorted,
} from '../helpers/arrayBuilders';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 8 };
const SORTED = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SORTED_DUP = [1, 2, 2, 2, 3, 4, 5];
const ROTATED = [4, 5, 6, 7, 0, 1, 2];

export const binarySearchIterative: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-binary-search',
  title: 'Binary search (iterative)',
  programNumber: 101,
  movementType: 'D',
  codeLines: ['lo, hi = 0, n-1', 'while lo <= hi:', '    mid = (lo+hi)//2'],
  defaultInput: { arr: SORTED, target: 5 },
  buildSteps: ({ arr, target }) => buildBinarySearch(arr, target, 'find'),
};

export const binarySearchRecursive: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-binary-search-recursive',
  title: 'Binary search (recursive)',
  programNumber: 102,
  movementType: 'D',
  codeLines: ['def bs(lo, hi):', '    mid = (lo+hi)//2', '    recurse left or right'],
  defaultInput: { arr: SORTED, target: 5 },
  buildSteps: ({ arr, target }) => buildBinarySearch(arr, target, 'find'),
};

export const firstOccurrenceSorted: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-bs-first-occurrence',
  title: 'First occurrence (sorted, duplicates)',
  programNumber: 103,
  movementType: 'D',
  codeLines: ['on match: hi = mid - 1', 'keep narrowing left'],
  defaultInput: { arr: SORTED_DUP, target: 2 },
  buildSteps: ({ arr, target }) => buildBinarySearch(arr, target, 'first'),
};

export const lastOccurrenceSorted: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-bs-last-occurrence',
  title: 'Last occurrence (sorted, duplicates)',
  programNumber: 104,
  movementType: 'D',
  codeLines: ['on match: lo = mid + 1', 'keep narrowing right'],
  defaultInput: { arr: SORTED_DUP, target: 2 },
  buildSteps: ({ arr, target }) => buildBinarySearch(arr, target, 'last'),
};

export const countFrequencySorted: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-bs-count-freq',
  title: 'Count frequency (sorted)',
  programNumber: 105,
  movementType: 'D',
  codeLines: ['first = bs_first(target)', 'last = bs_last(target)', 'count = last - first + 1'],
  defaultInput: { arr: SORTED_DUP, target: 2 },
  buildSteps: ({ arr, target }) => [
    ...buildBinarySearch(arr, target, 'first'),
    ...buildBinarySearch(arr, target, 'last'),
  ],
};

export const searchRotatedSorted: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-search-rotated',
  title: 'Search in rotated sorted array',
  programNumber: 106,
  movementType: 'D',
  codeLines: ['which half is sorted?', 'narrow search range'],
  defaultInput: { arr: ROTATED, target: 0 },
  buildSteps: ({ arr, target }) => buildRotatedSearch(arr, target),
};

export const findMinRotated: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-min-rotated',
  title: 'Find min in rotated sorted array',
  programNumber: 107,
  movementType: 'D',
  codeLines: ['compare mid with hi', 'converge to rotation point'],
  defaultInput: { arr: ROTATED },
  buildSteps: ({ arr }) => buildMinRotated(arr),
};

export const findRotationCount: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-rotation-count',
  title: 'Find rotation count',
  programNumber: 108,
  movementType: 'D',
  codeLines: ['min index in rotated array', 'rotation count = min index'],
  defaultInput: { arr: ROTATED },
  buildSteps: ({ arr }) => buildMinRotated(arr),
};

export const searchInsertPosition: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-search-insert',
  title: 'Search insert position',
  programNumber: 109,
  movementType: 'D',
  codeLines: ['binary search boundary', 'return lo on miss'],
  defaultInput: { arr: SORTED, target: 5 },
  buildSteps: ({ arr, target }) => buildBinarySearch(arr, target, 'insert'),
};

export const peakBinarySearch: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-peak-binary-search',
  title: 'Peak element via binary search',
  programNumber: 110,
  movementType: 'D',
  codeLines: ['compare mid with mid+1', 'move toward peak'],
  defaultInput: { arr: [1, 3, 20, 4, 1, 0] },
  buildSteps: ({ arr }) => buildPeakBinarySearch(arr),
};

export const sqrtBinarySearch: ProblemConfig<{ n: number }> = {
  ...BASE,
  id: 'array-sqrt-binary-search',
  title: 'Square root via binary search',
  programNumber: 111,
  movementType: 'D',
  codeLines: ['lo, hi on number line', 'mid*mid vs n'],
  defaultInput: { n: 26 },
  buildSteps: ({ n }) => {
    const steps = [];
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const sq = mid * mid;
      steps.push(
        arrayStep([lo, mid, hi], 3, {
          searchRange: [lo, hi],
          comparison: `${mid}² = ${sq} vs ${n}`,
          variables: { lo, mid, hi, n },
          phase: 'Binary search on answer',
        }),
      );
      if ((mid + 1) * (mid + 1) <= n) lo = mid + 1;
      else hi = mid;
    }
    steps.push(arrayStep([lo], 4, { message: `floor(sqrt(${n})) = ${lo}`, variables: { result: lo } }));
    return steps;
  },
};

export const floorCeiling: ProblemConfig<{ arr: number[]; target: number }> = {
  ...BASE,
  id: 'array-floor-ceiling',
  title: 'Floor and ceiling in sorted array',
  programNumber: 112,
  movementType: 'D',
  codeLines: ['track floor and ceil', 'binary search bounds'],
  defaultInput: { arr: SORTED, target: 5 },
  buildSteps: ({ arr, target }) => buildFloorCeiling(arr, target),
};

export const countGreaterSorted: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-count-gt-sorted',
  title: 'Count elements > X (sorted)',
  programNumber: 113,
  movementType: 'D',
  codeLines: ['binary search upper bound', 'count = n - bound'],
  defaultInput: { arr: SORTED, x: 5 },
  buildSteps: ({ arr, x }) => buildCountGreaterSorted(arr, x),
};

export const kthSmallestBinarySearch: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-kth-smallest-bs-answer',
  title: 'Kth smallest via binary search on answer',
  programNumber: 114,
  movementType: 'D',
  codeLines: ['binary search value range', 'feasibility count <= mid'],
  defaultInput: { arr: [3, 1, 4, 1, 5, 9], k: 3 },
  buildSteps: ({ arr, k }) => buildKthSmallestBinarySearch(arr, k),
};

export const medianTwoSorted: ProblemConfig<{ a: number[]; b: number[] }> = {
  ...BASE,
  id: 'array-median-two-sorted',
  title: 'Median of two sorted arrays',
  programNumber: 115,
  movementType: 'D',
  codeLines: ['partition both arrays', 'binary search on partition i'],
  defaultInput: { a: [1, 3, 8], b: [2, 4, 6] },
  buildSteps: ({ a, b }) => buildMedianTwoSorted(a, b),
};

export const level8Problems = [
  binarySearchIterative,
  binarySearchRecursive,
  firstOccurrenceSorted,
  lastOccurrenceSorted,
  countFrequencySorted,
  searchRotatedSorted,
  findMinRotated,
  findRotationCount,
  searchInsertPosition,
  peakBinarySearch,
  sqrtBinarySearch,
  floorCeiling,
  countGreaterSorted,
  kthSmallestBinarySearch,
  medianTwoSorted,
];
