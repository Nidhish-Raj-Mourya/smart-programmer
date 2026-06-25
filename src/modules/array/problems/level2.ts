import type { ProblemConfig } from '../../../engine';
import { arrayStep, DEFAULT_ARR, FOR_EACH } from '../helpers/arrayHelpers';

const BASE = { module: 'array' as const, dataStructure: 'array' as const };

function maxMinPass(arr: number[], trackIndex: boolean, findMax: boolean) {
  let best = findMax ? -Infinity : Infinity;
  let bestIdx = 0;
  const steps = [];
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    const better = findMax ? val > best : val < best;
    if (better) {
      best = val;
      bestIdx = i;
    }
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        runningMax: findMax ? best : undefined,
        runningMin: findMax ? undefined : best,
        maxIndex: findMax && trackIndex ? bestIdx : undefined,
        minIndex: !findMax && trackIndex ? bestIdx : undefined,
        message: better ? `New ${findMax ? 'max' : 'min'}: ${best}` : 'Keep current best',
        variables: { i, [findMax ? 'max' : 'min']: best, ...(trackIndex ? { index: bestIdx } : {}) },
        cellStates: arr.map((_, j) => (j === i ? 'highlight' : j === bestIdx ? 'match' : 'default')),
      }),
    );
  }
  return steps;
}

export const findMaximum: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-find-max',
  title: 'Find maximum',
  level: 2,
  programNumber: 13,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] > max: max = arr[i]'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => maxMinPass(arr, false, true),
};

export const findMinimum: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-find-min',
  title: 'Find minimum',
  level: 2,
  programNumber: 14,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] < min: min = arr[i]'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => maxMinPass(arr, false, false),
};

export const findMaxAndMin: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-find-max-min',
  title: 'Find max and min together',
  level: 2,
  programNumber: 15,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    update max and min'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => {
    let max = -Infinity;
    let min = Infinity;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (val > max) max = val;
      if (val < min) min = val;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          runningMax: max,
          runningMin: min,
          variables: { i, max, min },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const positionOfMax: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-position-max',
  title: 'Position of maximum',
  level: 2,
  programNumber: 16,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] > max: max, idx = arr[i], i'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => maxMinPass(arr, true, true),
};

export const positionOfMin: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-position-min',
  title: 'Position of minimum',
  level: 2,
  programNumber: 17,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] < min: min, idx = arr[i], i'],
  defaultInput: { arr: DEFAULT_ARR },
  buildSteps: ({ arr }) => maxMinPass(arr, true, false),
};

export const linearSearch: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-linear-search',
  title: 'Linear search',
  level: 2,
  programNumber: 18,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] == X: return i', 'return -1'],
  defaultInput: { arr: DEFAULT_ARR, x: 9 },
  buildSteps: ({ arr, x }) => {
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === x) {
        steps.push(
          arrayStep(arr, 3, {
            pointers: { i },
            found: true,
            foundIndex: i,
            message: `Return index ${i}`,
            variables: { i, x, result: i },
            cellStates: arr.map((_, j) => (j === i ? 'found' : 'default')),
          }),
        );
        return steps;
      }
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          variables: { i, x },
          cellStates: arr.map((_, j) => (j === i ? 'skip' : 'default')),
        }),
      );
    }
    steps.push(arrayStep(arr, 4, { found: false, variables: { result: -1 } }));
    return steps;
  },
};

export const countOccurrences: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-count-occurrences',
  title: 'Count occurrences of X',
  level: 2,
  programNumber: 19,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] == X: count += 1'],
  defaultInput: { arr: [1, 2, 1, 3, 1, 4], x: 1 },
  buildSteps: ({ arr, x }) => {
    let count = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === x) count++;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          accumulator: count,
          accumulatorOp: 'count',
          accumulatorLabel: 'count',
          variables: { i, x, count },
          cellStates: arr.map((_, j) => (j === i && arr[j] === x ? 'match' : j === i ? 'skip' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const firstOccurrence: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-first-occurrence',
  title: 'Find first occurrence',
  level: 2,
  programNumber: 20,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] == X: return i'],
  defaultInput: { arr: [2, 4, 1, 4, 5], x: 4 },
  buildSteps: ({ arr, x }) => linearSearch.buildSteps({ arr, x }),
};

export const lastOccurrence: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-last-occurrence',
  title: 'Find last occurrence',
  level: 2,
  programNumber: 21,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] == X: last = i  # overwrite each match'],
  defaultInput: { arr: [2, 4, 1, 4, 5], x: 4 },
  buildSteps: ({ arr, x }) => {
    let last = -1;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === x) last = i;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          foundIndex: last >= 0 ? last : undefined,
          message: arr[i] === x ? `Overwrite last = ${i}` : 'No match this step',
          variables: { i, x, last },
          cellStates: arr.map((_, j) => (j === i ? (arr[i] === x ? 'match' : 'default') : j === last ? 'found' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const allPositionsOfX: ProblemConfig<{ arr: number[]; x: number }> = {
  ...BASE,
  id: 'array-all-positions',
  title: 'Find all positions of X',
  level: 2,
  programNumber: 22,
  movementType: 'A',
  codeLines: [...FOR_EACH, '    if arr[i] == X: positions.append(i)'],
  defaultInput: { arr: [1, 2, 1, 3, 1], x: 1 },
  buildSteps: ({ arr, x }) => {
    const positions: number[] = [];
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === x) positions.push(i);
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          positions: [...positions],
          variables: { i, x },
          cellStates: arr.map((_, j) => (j === i && arr[j] === x ? 'match' : j === i ? 'default' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const checkDuplicates: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-check-duplicates',
  title: 'Check for duplicates',
  level: 2,
  programNumber: 23,
  movementType: 'F',
  codeLines: [...FOR_EACH, '    if arr[i] in seen: return True', '    seen.add(arr[i])'],
  defaultInput: { arr: [1, 2, 3, 2, 4] },
  buildSteps: ({ arr }) => {
    const seen: number[] = [];
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const dup = seen.includes(val);
      if (!dup) seen.push(val);
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          auxSet: [...seen],
          duplicateFound: dup,
          message: dup ? 'Already in seen — duplicate!' : 'Add to seen set',
          variables: { i, duplicate: dup },
          cellStates: arr.map((_, j) => (j === i ? (dup ? 'found' : 'highlight') : 'default')),
        }),
      );
      if (dup) break;
    }
    return steps;
  },
};

export const firstDuplicate: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-first-duplicate',
  title: 'Find first duplicate',
  level: 2,
  programNumber: 24,
  movementType: 'F',
  codeLines: [...FOR_EACH, '    if arr[i] in seen: return arr[i]'],
  defaultInput: { arr: [1, 2, 3, 2, 4] },
  buildSteps: ({ arr }) => {
    const seen: number[] = [];
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (seen.includes(val)) {
        steps.push(
          arrayStep(arr, 3, {
            pointers: { i },
            auxSet: [...seen],
            duplicateFound: true,
            message: `First duplicate: ${val}`,
            variables: { i, duplicate: val },
            cellStates: arr.map((_, j) => (j === i ? 'found' : 'default')),
          }),
        );
        return steps;
      }
      seen.push(val);
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          auxSet: [...seen],
          variables: { i },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const countDistinct: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-count-distinct',
  title: 'Count distinct elements',
  level: 2,
  programNumber: 25,
  movementType: 'F',
  codeLines: [...FOR_EACH, '    seen.add(arr[i])', 'return len(seen)'],
  defaultInput: { arr: [1, 2, 1, 3, 2, 4] },
  buildSteps: ({ arr }) => {
    const seen: number[] = [];
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (!seen.includes(val)) seen.push(val);
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          auxSet: [...seen],
          accumulator: seen.length,
          accumulatorOp: 'count',
          accumulatorLabel: 'distinct',
          variables: { i, distinct: seen.length },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const frequencyTable: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-frequency-table',
  title: 'Frequency of each element',
  level: 2,
  programNumber: 26,
  movementType: 'F',
  codeLines: [...FOR_EACH, '    freq[arr[i]] = freq.get(arr[i], 0) + 1'],
  defaultInput: { arr: [1, 2, 1, 3, 1, 2] },
  buildSteps: ({ arr }) => {
    const freq: Record<string, number> = {};
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const key = String(val);
      freq[key] = (freq[key] ?? 0) + 1;
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          auxMap: { ...freq },
          message: `freq[${val}] = ${freq[key]}`,
          variables: { i, [`freq_${val}`]: freq[key] },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const maxFrequencyElement: ProblemConfig<{ arr: number[] }> = {
  ...BASE,
  id: 'array-max-frequency',
  title: 'Element with max frequency',
  level: 2,
  programNumber: 27,
  movementType: 'F',
  codeLines: [...FOR_EACH, '    update freq', 'return key with max freq'],
  defaultInput: { arr: [1, 2, 1, 3, 1, 2] },
  buildSteps: ({ arr }) => {
    const freq: Record<string, number> = {};
    let bestKey = '';
    let bestCount = 0;
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const key = String(val);
      freq[key] = (freq[key] ?? 0) + 1;
      if (freq[key] > bestCount) {
        bestCount = freq[key];
        bestKey = key;
      }
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i },
          auxMap: { ...freq },
          runningMax: bestCount,
          message: `Current max freq: ${bestKey} (${bestCount})`,
          variables: { i, best: bestKey, max_freq: bestCount },
          cellStates: arr.map((_, j) => (j === i ? 'highlight' : 'default')),
        }),
      );
    }
    return steps;
  },
};

export const level2Problems = [
  findMaximum,
  findMinimum,
  findMaxAndMin,
  positionOfMax,
  positionOfMin,
  linearSearch,
  countOccurrences,
  firstOccurrence,
  lastOccurrence,
  allPositionsOfX,
  checkDuplicates,
  firstDuplicate,
  countDistinct,
  frequencyTable,
  maxFrequencyElement,
];
