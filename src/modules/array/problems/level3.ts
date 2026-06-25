import type { ProblemConfig } from '../../../engine';
import { DEFAULT_ARR } from '../helpers/arrayHelpers';
import {
  buildReverseInPlace,
  buildSwapAt,
  buildSwapFirstLast,
  buildRotateLeft1,
  buildRotateRight1,
  buildRotateLeftK,
  buildRotateRightK,
  buildCopy,
  buildInsertAt,
  buildDeleteAt,
  buildInsertSorted,
  buildRemoveAllX,
  buildReplaceAll,
  buildMerge,
  buildConcat,
  buildSplit,
  buildSeparateEvenOdd,
  buildMoveZerosToEnd,
} from '../helpers/arrayBuilders';

const BASE = { module: 'array' as const, dataStructure: 'array' as const, level: 3 };

export const reverseInPlace: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-reverse-inplace',
  title: 'Reverse array (in-place)',
  programNumber: 28,
  movementType: 'B',
  codeLines: ['left, right = 0, len(arr)-1', 'while left < right:', '    swap arr[left], arr[right]', '    left++; right--'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildReverseInPlace(arr),
};

export const swapFirstLast: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-swap-first-last',
  title: 'Swap first and last',
  programNumber: 29,
  movementType: 'B',
  codeLines: ['swap arr[0], arr[-1]'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildSwapFirstLast(arr),
};

export const swapAtPositions: ProblemConfig<{ arr: number[]; i: number; j: number }> = {
  ...BASE,
  id: 'array-swap-at',
  title: 'Swap at positions i, j',
  programNumber: 30,
  movementType: 'B',
  codeLines: ['i, j = map(int, input().split())', 'swap arr[i], arr[j]'],
  defaultInput: { arr: DEFAULT_ARR, i: 1, j: 5 },
  buildSteps: ({ arr, i, j }) => buildSwapAt(arr, i, j),
};

export const rotateLeft1: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-rotate-left-1',
  title: 'Rotate left by 1',
  programNumber: 31,
  movementType: 'A',
  codeLines: ['first = arr[0]', 'shift all left', 'arr[-1] = first'],
  defaultInput: { arr: [1, 2, 3, 4, 5] },
  buildSteps: ({ arr }) => buildRotateLeft1(arr),
};

export const rotateRight1: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-rotate-right-1',
  title: 'Rotate right by 1',
  programNumber: 32,
  movementType: 'A',
  codeLines: ['last = arr[-1]', 'shift all right', 'arr[0] = last'],
  defaultInput: { arr: [1, 2, 3, 4, 5] },
  buildSteps: ({ arr }) => buildRotateRight1(arr),
};

export const rotateLeftK: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-rotate-left-k',
  title: 'Rotate left by K',
  programNumber: 33,
  movementType: 'A',
  codeLines: ['k = int(input())', 'for _ in range(k % n):', '    rotate left by 1'],
  defaultInput: { arr: [1, 2, 3, 4, 5], k: 2 },
  buildSteps: ({ arr, k }) => buildRotateLeftK(arr, k),
};

export const rotateRightK: ProblemConfig<{ arr: number[]; k: number }> = {
  ...BASE,
  id: 'array-rotate-right-k',
  title: 'Rotate right by K',
  programNumber: 34,
  movementType: 'A',
  codeLines: ['k = int(input())', 'for _ in range(k % n):', '    rotate right by 1'],
  defaultInput: { arr: [1, 2, 3, 4, 5], k: 2 },
  buildSteps: ({ arr, k }) => buildRotateRightK(arr, k),
};

export const copyArray: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-copy',
  title: 'Copy array to another',
  programNumber: 35,
  movementType: 'A',
  codeLines: ['dest = []', 'for x in arr:', '    dest.append(x)'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => buildCopy(arr),
};

export const insertAtPosition: ProblemConfig<{ arr: number[]; pos: number; val: number }> = {
  ...BASE,
  id: 'array-insert-at',
  title: 'Insert at position i',
  programNumber: 36,
  movementType: 'A',
  codeLines: [
    '# Insert val at index pos',
    'n = len(arr)',
    '# Step 1: shift right — peeche se aage loop',
    'for i in range(n - 1, pos - 1, -1):',
    '    arr[i + 1] = arr[i]   # ek slot right shift',
    '# Step 2: nayi value rakho',
    'arr[pos] = val',
  ],
  defaultInput: { arr: [10, 20, 30, 40, 50], pos: 2, val: 25 },
  buildSteps: ({ arr, pos, val }) => buildInsertAt(arr, pos, val),
  approach: {
    what: 'Array mein beech mein naya number daalna — pehle jagah banao, phir value set karo.',
    variables: ['arr', 'pos', 'val', 'i', 'n'],
    steps: [
      'Size 1 badhao (n+1 slots).',
      'i = n-1 se pos tak — arr[i+1] = arr[i] (right shift).',
      'arr[pos] = val.',
    ],
    tip: 'Loop ulta chalao (n-1 → pos) warna data overwrite ho jayega!',
  },
};

export const deleteAtPosition: ProblemConfig<{ arr: number[]; pos: number }> = {
  ...BASE,
  id: 'array-delete-at',
  title: 'Delete at position i',
  programNumber: 37,
  movementType: 'A',
  codeLines: [
    '# Delete element at index pos',
    'removed = arr[pos]',
    '# Shift left — gap band karo',
    'for i in range(pos, n - 1):',
    '    arr[i] = arr[i + 1]',
    'arr.pop()',
  ],
  defaultInput: { arr: [10, 20, 30, 40, 50], pos: 2 },
  buildSteps: ({ arr, pos }) => buildDeleteAt(arr, pos),
  approach: {
    what: 'Ek index ka element hatao — baaki sab ek step left aayenge.',
    variables: ['arr', 'pos', 'i', 'n', 'removed'],
    steps: [
      'removed = arr[pos] note karo.',
      'i = pos se end tak: arr[i] = arr[i+1].',
      'Last slot hatao (pop).',
    ],
    tip: 'Left shift mein loop aage ki taraf chalta hai (pos → end).',
  },
};

export const insertInSorted: ProblemConfig<{ arr: number[]; val: number }> = {
  ...BASE,
  id: 'array-insert-sorted',
  title: 'Insert in sorted array',
  programNumber: 38,
  movementType: 'A',
  codeLines: ['find position', 'shift and insert val'],
  defaultInput: { arr: [1, 3, 5, 7], val: 4 },
  buildSteps: ({ arr, val }) => buildInsertSorted(arr, val),
};

export const removeAllX: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-remove-all-x',
  title: 'Remove all occurrences of X',
  programNumber: 39,
  movementType: 'B',
  codeLines: ['slow = 0', 'for fast in range(n):', '    if arr[fast] != X: compact'],
  defaultInput: { arr: [1, 2, 1, 3, 1, 4], x: 1 },
  buildSteps: ({ arr, x }) => buildRemoveAllX(arr, x),
};

export const replaceAllXY: ProblemConfig<{ arr: number[]; x: number; y: number }> = {
  ...BASE,
  id: 'array-replace-all',
  title: 'Replace all X with Y',
  programNumber: 40,
  movementType: 'A',
  codeLines: ['for i in range(n):', '    if arr[i] == X: arr[i] = Y'],
  defaultInput: { arr: [1, 2, 1, 3, 1], x: 1, y: 9 },
  buildSteps: ({ arr, x, y }) => buildReplaceAll(arr, x, y),
};

export const mergeTwoArrays: ProblemConfig<{ a: number[]; b: number[] }> = {
  ...BASE,
  id: 'array-merge-two',
  title: 'Merge two arrays',
  programNumber: 41,
  movementType: 'A',
  codeLines: ['i, j = 0, 0', 'while i < len(A) or j < len(B):', '    take smaller'],
  defaultInput: { a: [1, 3, 5], b: [2, 4, 6] },
  buildSteps: ({ a, b }) => buildMerge(a, b),
};

export const concatenateArrays: ProblemConfig<{ a: number[]; b: number[] }> = {
  ...BASE,
  id: 'array-concat',
  title: 'Concatenate B at end of A',
  programNumber: 42,
  movementType: 'A',
  codeLines: ['for x in B:', '    A.append(x)'],
  defaultInput: { a: [1, 2], b: [3, 4, 5] },
  buildSteps: ({ a, b }) => buildConcat(a, b),
};

export const splitHalves: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-split-halves',
  title: 'Split into two halves',
  programNumber: 43,
  movementType: 'A',
  codeLines: ['mid = len(arr) // 2', 'left, right = arr[:mid], arr[mid:]'],
  defaultInput: { arr: [1, 2, 3, 4, 5, 6] },
  buildSteps: ({ arr }) => buildSplit(arr),
};

export const separateEvenOdd: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-separate-even-odd',
  title: 'Separate even/odd',
  programNumber: 44,
  movementType: 'B',
  codeLines: ['write = 0', 'for read in range(n):', '    if even: swap to front'],
  defaultInput: { arr: [3, 1, 4, 2, 5, 8] },
  buildSteps: ({ arr }) => buildSeparateEvenOdd(arr),
};

export const moveZerosToEnd: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-move-zeros',
  title: 'Move zeros to end',
  programNumber: 45,
  movementType: 'B',
  codeLines: ['write = 0', 'for read in range(n):', '    if arr[read] != 0: compact'],
  defaultInput: { arr: [0, 1, 0, 3, 0, 5] },
  buildSteps: ({ arr }) => buildMoveZerosToEnd(arr),
};

export const level3Problems = [
  reverseInPlace,
  swapFirstLast,
  swapAtPositions,
  rotateLeft1,
  rotateRight1,
  rotateLeftK,
  rotateRightK,
  copyArray,
  insertAtPosition,
  deleteAtPosition,
  insertInSorted,
  removeAllX,
  replaceAllXY,
  mergeTwoArrays,
  concatenateArrays,
  splitHalves,
  separateEvenOdd,
  moveZerosToEnd,
];
