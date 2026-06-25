import type { ProblemConfig } from '../../../engine';
import {
  buildKadane,
  buildMaxProductSubarray,
  buildEquilibrium,
  buildLeaders,
  buildPeakScan,
  buildMissingNumber,
  buildFindDuplicate,
  buildTwoMissingNumbers,
  buildBoyerMoore,
  buildStockSingle,
  buildStockMultiple,
  buildRearrangeAlternating,
  buildZigzag,
  buildDutchFlag,
  buildTrappingRain,
  buildContainerWater,
  buildMaxDifference,
  buildSmallestMissingPositive,
} from '../helpers/arrayBuilders';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 6 };

export const maxSubarraySum: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-kadane',
  title: 'Max subarray sum (Kadane\'s)',
  programNumber: 73,
  movementType: 'G',
  codeLines: ['cur = max(arr[i], cur + arr[i])', 'best = max(best, cur)'],
  defaultInput: { arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  buildSteps: ({ arr }) => buildKadane(arr),
};

export const maxProductSubarray: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-max-product-subarray',
  title: 'Max product subarray',
  programNumber: 74,
  movementType: 'G',
  codeLines: ['track max and min product', 'handle sign flips'],
  defaultInput: { arr: [2, 3, -2, 4] },
  buildSteps: ({ arr }) => buildMaxProductSubarray(arr),
};

export const equilibriumIndex: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-equilibrium',
  title: 'Equilibrium index',
  programNumber: 75,
  movementType: 'A',
  codeLines: ['leftSum == rightSum at i', 'single pass with total'],
  defaultInput: { arr: [-7, 1, 5, 2, -4, 3, 0] },
  buildSteps: ({ arr }) => buildEquilibrium(arr),
};

export const leaderElements: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-leaders',
  title: 'Leader elements',
  programNumber: 76,
  movementType: 'A',
  codeLines: ['scan right-to-left', 'track max from right'],
  defaultInput: { arr: [16, 17, 4, 3, 5, 2] },
  buildSteps: ({ arr }) => buildLeaders(arr),
};

export const peakElement: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-peak',
  title: 'Peak element',
  programNumber: 77,
  movementType: 'A',
  codeLines: ['compare with neighbors', 'return first peak'],
  defaultInput: { arr: [1, 3, 2, 4, 1] },
  buildSteps: ({ arr }) => buildPeakScan(arr, false, false),
};

export const findAllPeaks: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-all-peaks',
  title: 'Find all peaks',
  programNumber: 78,
  movementType: 'A',
  codeLines: ['compare with neighbors', 'collect all peaks'],
  defaultInput: { arr: [1, 3, 2, 4, 1, 0, 5] },
  buildSteps: ({ arr }) => buildPeakScan(arr, true, false),
};

export const valleyElement: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-valley',
  title: 'Valley element',
  programNumber: 79,
  movementType: 'A',
  codeLines: ['compare with neighbors', 'find valley'],
  defaultInput: { arr: [5, 3, 4, 2, 6] },
  buildSteps: ({ arr }) => buildPeakScan(arr, false, true),
};

export const missingNumber: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-missing-number',
  title: 'Missing number (1 to N)',
  programNumber: 80,
  movementType: 'E',
  codeLines: ['expected = n*(n+1)/2', 'missing = expected - sum'],
  defaultInput: { arr: [3, 0, 1] },
  buildSteps: ({ arr }) => buildMissingNumber(arr),
};

export const findDuplicate: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-find-duplicate',
  title: 'Find duplicate number',
  programNumber: 81,
  movementType: 'E',
  codeLines: ['mark indices or Floyd cycle', 'return duplicate'],
  defaultInput: { arr: [1, 3, 4, 2, 2] },
  buildSteps: ({ arr }) => buildFindDuplicate(arr),
};

export const twoMissingNumbers: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-two-missing',
  title: 'Find two missing numbers',
  programNumber: 82,
  movementType: 'E',
  codeLines: ['sum and xor tricks', 'derive two missing'],
  defaultInput: { arr: [1, 2, 4, 6, 3, 7, 8] },
  buildSteps: ({ arr }) => buildTwoMissingNumbers(arr),
};

export const majorityElement: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-majority-boyer-moore',
  title: 'Majority element (Boyer-Moore)',
  programNumber: 83,
  movementType: 'V',
  codeLines: ['candidate, count = arr[0], 1', 'cancel or reinforce each element'],
  defaultInput: { arr: [2, 2, 1, 1, 1, 2, 2] },
  buildSteps: ({ arr }) => buildBoyerMoore(arr),
};

export const stockBuySellSingle: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-stock-single',
  title: 'Stock buy/sell (single transaction)',
  programNumber: 84,
  movementType: 'G',
  codeLines: ['minPrice, maxProfit trackers', 'update each day'],
  defaultInput: { arr: [7, 1, 5, 3, 6, 4] },
  buildSteps: ({ arr }) => buildStockSingle(arr),
};

export const stockBuySellMultiple: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-stock-multiple',
  title: 'Stock buy/sell (multiple transactions)',
  programNumber: 85,
  movementType: 'G',
  codeLines: ['capture every valley-to-peak', 'sum all gains'],
  defaultInput: { arr: [7, 1, 5, 3, 6, 4] },
  buildSteps: ({ arr }) => buildStockMultiple(arr),
};

export const rearrangeAlternating: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-rearrange-alt-pos-neg',
  title: 'Rearrange alternating pos/neg',
  programNumber: 86,
  movementType: 'A',
  codeLines: ['posSlot, negSlot pointers', 'place positives and negatives'],
  defaultInput: { arr: [1, -2, 3, -4, 5, -6] },
  buildSteps: ({ arr }) => buildRearrangeAlternating(arr),
};

export const zigzagRearrangement: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-zigzag',
  title: 'Zig-zag rearrangement',
  programNumber: 87,
  movementType: 'A',
  codeLines: ['for i in range(n-1):', '    swap if zigzag violated'],
  defaultInput: { arr: [4, 3, 7, 8, 6, 2, 1] },
  buildSteps: ({ arr }) => buildZigzag(arr),
};

export const dutchNationalFlag: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-dutch-flag',
  title: 'Dutch National Flag (0,1,2)',
  programNumber: 88,
  movementType: 'B',
  codeLines: ['low, mid, high = 0, 0, n-1', '3-region partition'],
  defaultInput: { arr: [2, 0, 2, 1, 1, 0] },
  buildSteps: ({ arr }) => buildDutchFlag(arr),
};

export const trappingRainwater: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-trapping-rain',
  title: 'Trapping rainwater',
  programNumber: 89,
  movementType: 'U',
  codeLines: ['pass 1: leftMax', 'pass 2: rightMax', 'combine water'],
  defaultInput: { arr: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },
  buildSteps: ({ arr }) => buildTrappingRain(arr),
};

export const containerMostWater: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-container-water',
  title: 'Container with most water',
  programNumber: 90,
  movementType: 'B',
  codeLines: ['left, right converging', 'area = min(h)*width'],
  defaultInput: { arr: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
  buildSteps: ({ arr }) => buildContainerWater(arr),
};

export const maxDifference: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-max-difference',
  title: 'Max difference (arr[j]-arr[i], j>i)',
  programNumber: 91,
  movementType: 'A',
  codeLines: ['minSoFar tracker', 'maxDiff = max(arr[j]-minSoFar)'],
  defaultInput: { arr: [7, 1, 5, 3, 6, 4] },
  buildSteps: ({ arr }) => buildMaxDifference(arr),
};

export const smallestMissingPositive: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-smallest-missing-positive',
  title: 'Smallest missing positive',
  programNumber: 92,
  movementType: 'E',
  codeLines: ['place each value at index val-1', 'find first mismatch'],
  defaultInput: { arr: [3, 4, -1, 1] },
  buildSteps: ({ arr }) => buildSmallestMissingPositive(arr),
};

export const level6Problems = [
  maxSubarraySum,
  maxProductSubarray,
  equilibriumIndex,
  leaderElements,
  peakElement,
  findAllPeaks,
  valleyElement,
  missingNumber,
  findDuplicate,
  twoMissingNumbers,
  majorityElement,
  stockBuySellSingle,
  stockBuySellMultiple,
  rearrangeAlternating,
  zigzagRearrangement,
  dutchNationalFlag,
  trappingRainwater,
  containerMostWater,
  maxDifference,
  smallestMissingPositive,
];
