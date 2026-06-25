import type { ProblemConfig } from '../../../engine';
import {
  buildBubbleSort,
  buildSelectionSort,
  buildInsertionSort,
  buildCountingSort,
  buildPartition,
  buildDutchFlag,
  buildMergeSorted,
  buildSingleSwapSortableCheck,
} from '../helpers/arrayBuilders';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 7 };

export const bubbleSort: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-bubble-sort',
  title: 'Bubble sort',
  programNumber: 93,
  movementType: 'B',
  codeLines: ['for i in range(n):', '    for j in range(n-i-1):', '        swap if arr[j] > arr[j+1]'],
  defaultInput: { arr: [5, 1, 4, 2, 8] },
  buildSteps: ({ arr }) => buildBubbleSort(arr),
};

export const selectionSort: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-selection-sort',
  title: 'Selection sort',
  programNumber: 94,
  movementType: 'B',
  codeLines: ['find min in unsorted', 'swap to position i'],
  defaultInput: { arr: [5, 1, 4, 2, 8] },
  buildSteps: ({ arr }) => buildSelectionSort(arr),
};

export const insertionSort: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-insertion-sort',
  title: 'Insertion sort',
  programNumber: 95,
  movementType: 'A',
  codeLines: ['key = arr[i]', 'shift right while key < arr[j]'],
  defaultInput: { arr: [5, 1, 4, 2, 8] },
  buildSteps: ({ arr }) => buildInsertionSort(arr),
};

export const countingSort: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-counting-sort',
  title: 'Counting sort (0-9 range)',
  programNumber: 96,
  movementType: 'A',
  codeLines: ['count[digit]++', 'rebuild output from counts'],
  defaultInput: { arr: [4, 2, 2, 8, 3, 3, 1] },
  buildSteps: ({ arr }) => buildCountingSort(arr),
};

export const sortZerosOnes: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sort-0-1',
  title: 'Sort 0s and 1s (single pass)',
  programNumber: 97,
  movementType: 'B',
  codeLines: ['partition: 0s left, 1s right'],
  defaultInput: { arr: [0, 1, 0, 1, 1, 0] },
  buildSteps: ({ arr }) => buildPartition(arr, (v) => v === 0, 'Zero'),
};

export const sort012: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sort-0-1-2',
  title: 'Sort 0s, 1s, 2s (Dutch Flag)',
  programNumber: 98,
  movementType: 'B',
  codeLines: ['low, mid, high pointers', 'same as Dutch Flag'],
  defaultInput: { arr: [2, 0, 2, 1, 1, 0] },
  buildSteps: ({ arr }) => buildDutchFlag(arr),
};

export const mergeSortedArrays: ProblemConfig<{ a: number[]; b: number[] }> = {
  ...BASE,
  id: 'array-merge-sorted',
  title: 'Merge two sorted arrays',
  programNumber: 99,
  movementType: 'A',
  codeLines: ['two-pointer merge', 'build sorted result'],
  defaultInput: { a: [1, 3, 5], b: [2, 4, 6] },
  buildSteps: ({ a, b }) => buildMergeSorted(a, b),
};

export const singleSwapSortable: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-single-swap-sortable',
  title: 'Sortable by single swap check',
  programNumber: 100,
  movementType: 'A',
  codeLines: ['compare with sorted copy', 'check if one swap fixes'],
  defaultInput: { arr: [1, 5, 3, 4, 2] },
  buildSteps: ({ arr }) => buildSingleSwapSortableCheck(arr),
};

export const level7Problems = [
  bubbleSort,
  selectionSort,
  insertionSort,
  countingSort,
  sortZerosOnes,
  sort012,
  mergeSortedArrays,
  singleSwapSortable,
];
