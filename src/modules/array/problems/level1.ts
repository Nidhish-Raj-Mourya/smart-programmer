import type { ProblemConfig } from '../../../engine';
import {
  arrayStep,
  DEFAULT_ARR,
  FOR_EACH,
  FOR_EACH_VAL,
} from '../helpers/arrayHelpers';

const BASE = { module: 'array' as const, dataStructure: 'array' as const };

export const displayArray: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-display',
  title: 'Input and display array',
  level: 1,
  programNumber: 1,
  movementType: 'A',
  codeLines: ['arr = list(map(int, input().split()))', 'print(arr)'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => [
    arrayStep(arr, 1, { message: 'Array loaded', variables: { length: arr.length } }),
    arrayStep(arr, 2, {
      message: 'Display complete',
      cellStates: arr.map(() => 'highlight' as const),
    }),
  ],
};

export const displayReverseReadOnly: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-display-reverse-readonly',
  title: 'Display in reverse (no modify)',
  level: 1,
  programNumber: 2,
  movementType: 'A',
  codeLines: [
    'arr = list(map(int, input().split()))',
    'for i in range(len(arr) - 1, -1, -1):',
    '    print(arr[i])',
  ],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    const steps = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      steps.push(
        arrayStep(arr, 3, {
          readOnly: true,
          pointers: { i },
          message: `Read arr[${i}] = ${arr[i]} (original untouched)`,
          variables: { i, value: arr[i] },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const sumElements: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sum',
  title: 'Sum of elements',
  level: 1,
  programNumber: 3,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    total += arr[i]'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    let total = 0;
    const steps = [arrayStep(arr, 1, { message: 'Initialize total = 0', variables: { total: 0 } })];
    for (let i = 0; i < arr.length; i++) {
      total += arr[i];
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          accumulator: total,
          accumulatorLabel: 'total',
          message: `total += ${arr[i]} → ${total}`,
          variables: { i, total },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const averageElements: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-average',
  title: 'Average of elements',
  level: 1,
  programNumber: 4,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    total += arr[i]', 'avg = total / len(arr)'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    const sumSteps = sumElements.buildSteps({ arr });
    const total = arr.reduce((a, b) => a + b, 0);
    const avg = total / arr.length;
    return [
      ...sumSteps,
      arrayStep(arr, 4, {
        message: `avg = ${total} / ${arr.length} = ${avg}`,
        variables: { total, avg, n: arr.length },
        accumulator: total,
        accumulatorLabel: 'total',
        phase: `avg = ${avg.toFixed(2)}`,
      }),
    ];
  },
};

export const countGreaterThanX: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-count-gt-x',
  title: 'Count elements > X',
  level: 1,
  programNumber: 5,
  movementType: 'A',
  codeLines: [...FOR_EACH_VAL, '    if x > X: count += 1'],
  defaultInput: { arr: DEFAULT_ARR, x: 4 },
  buildSteps: ({ arr, x }) => {
    let count = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const match = val > x;
      if (match) count++;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          comparison: `${val} > ${x} → ${match}`,
          accumulator: count,
          accumulatorOp: 'count',
          accumulatorLabel: 'count',
          message: match ? 'Match — count++' : 'Skip',
          variables: { i, x, count },
          cellStates: arr.map((_, j) => (j === i ? (match ? 'match' : 'skip') : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const countLessThanX: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-count-lt-x',
  title: 'Count elements < X',
  level: 1,
  programNumber: 6,
  movementType: 'A',
  codeLines: [...FOR_EACH_VAL, '    if x < X: count += 1'],
  defaultInput: { arr: DEFAULT_ARR, x: 4 },
  buildSteps: ({ arr, x }) => {
    let count = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const match = val < x;
      if (match) count++;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          comparison: `${val} < ${x} → ${match}`,
          accumulator: count,
          accumulatorOp: 'count',
          accumulatorLabel: 'count',
          variables: { i, x, count },
          cellStates: arr.map((_, j) => (j === i ? (match ? 'match' : 'skip') : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const countEvenOdd: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-count-even-odd',
  title: 'Count even/odd',
  level: 1,
  programNumber: 7,
  movementType: 'A',
  codeLines: [...FOR_EACH_VAL, '    if x % 2 == 0: evens += 1', '    else: odds += 1'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    let evens = 0;
    let odds = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (val % 2 === 0) evens++;
      else odds++;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          comparison: `${val} % 2 == ${val % 2}`,
          secondaryAccumulator: odds,
          secondaryLabel: 'odds',
          accumulator: evens,
          accumulatorLabel: 'evens',
          variables: { i, evens, odds },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const countSigns: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-count-signs',
  title: 'Count positive/negative/zero',
  level: 1,
  programNumber: 8,
  movementType: 'A',
  codeLines: [...FOR_EACH_VAL, '    # branch: pos / neg / zero'],
  defaultInput: { arr: [-2, 0, 3, -1, 0, 5] },
  buildSteps: ({ arr }) => {
    let pos = 0;
    let neg = 0;
    let zero = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (val > 0) pos++;
      else if (val < 0) neg++;
      else zero++;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          accumulator: pos,
          accumulatorLabel: 'positive',
          secondaryAccumulator: neg,
          secondaryLabel: 'negative',
          tertiaryAccumulator: zero,
          tertiaryLabel: 'zero',
          variables: { i, positive: pos, negative: neg, zero },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const sumEvensOnly: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sum-evens',
  title: 'Sum of even numbers only',
  level: 1,
  programNumber: 9,
  movementType: 'A',
  codeLines: [...FOR_EACH_VAL, '    if x % 2 == 0: total += x'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    let total = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const even = val % 2 === 0;
      if (even) total += val;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          comparison: even ? `${val} is even — add` : `${val} is odd — skip`,
          accumulator: total,
          accumulatorLabel: 'total',
          variables: { i, total },
          cellStates: arr.map((_, j) => (j === i ? (even ? 'match' : 'skip') : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const sumOddsOnly: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-sum-odds',
  title: 'Sum of odd numbers only',
  level: 1,
  programNumber: 10,
  movementType: 'A',
  codeLines: [...FOR_EACH_VAL, '    if x % 2 != 0: total += x'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    let total = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const odd = val % 2 !== 0;
      if (odd) total += val;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          accumulator: total,
          accumulatorLabel: 'total',
          variables: { i, total },
          cellStates: arr.map((_, j) => (j === i ? (odd ? 'match' : 'skip') : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const productElements: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-product',
  title: 'Product of all elements',
  level: 1,
  programNumber: 11,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    prod *= arr[i]'],
  defaultInput: { arr: [2, 3, 4] },
  buildSteps: ({ arr }) => {
    let prod = 1;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      prod *= arr[i];
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          accumulator: prod,
          accumulatorOp: 'product',
          accumulatorLabel: 'prod',
          message: `prod *= ${arr[i]} → ${prod}`,
          variables: { i, prod },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const elementExists: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-element-exists',
  title: 'Check if element exists',
  level: 1,
  programNumber: 12,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] == X: return True', 'return False'],
  defaultInput: { arr: DEFAULT_ARR, x: 5 },
  buildSteps: ({ arr, x }) => {
    const steps = [];
    let found = false;
    for (let i = 0; i < arr.length; i++) {
      const match = arr[i] === x;
      if (match) {
        found = true;
        steps.push(
          arrayStep(arr, 3, {
            pointers: { i },
            found: true,
            foundIndex: i,
            message: `Match at index ${i} — early exit`,
            variables: { i, x },
            cellStates: arr.map((_, j) => (j === i ? 'found' : 'default')),
          }),
        );
        break;
      }
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          comparison: `${arr[i]} == ${x} → false`,
          variables: { i, x },
          cellStates: arr.map((_, j) => (j === i ? 'skip' : 'default')),
        }),
      );
    }
    if (!found) {
      steps.push(
        arrayStep(arr, 4, {
          found: false,
          message: 'Scanned entire array — not found',
          variables: { x },
        }),
      );
    }
    return steps;
  },
};

export const level1Problems = [
  displayArray,
  displayReverseReadOnly,
  sumElements,
  averageElements,
  countGreaterThanX,
  countLessThanX,
  countEvenOdd,
  countSigns,
  sumEvensOnly,
  sumOddsOnly,
  productElements,
  elementExists,
];
