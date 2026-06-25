import type { ArrayCellState, ArraySnapshot, Step } from '../../../engine';
import { arrayStep } from './arrayHelpers';

type CellStates = ArrayCellState[];

function cells(length: number, fn: (i: number) => ArrayCellState): CellStates {
  return Array.from({ length }, (_, i) => fn(i));
}

function highlight(length: number, ...indices: number[]): CellStates {
  const set = new Set(indices);
  return cells(length, (i) => (set.has(i) ? 'highlight' : 'default'));
}

function swapCells(length: number, a: number, b: number): CellStates {
  return cells(length, (i) => (i === a || i === b ? 'swap' : 'default'));
}

function windowCells(length: number, lo: number, hi: number): CellStates {
  return cells(length, (i) => (i >= lo && i <= hi ? 'highlight' : 'default'));
}

function dutchRegions(length: number, low: number, _mid: number, high: number): string[] {
  return Array.from({ length }, (_, i) => {
    if (i < low) return 'low';
    if (i <= high) return 'mid';
    return 'high';
  });
}

// ─── Type B: two-pointer ───────────────────────────────────────────────────

export function buildReverseInPlace(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  let left = 0;
  let right = a.length - 1;
  while (left < right) {
    steps.push(
      arrayStep(a, 3, {
        pointers: { left, right },
        message: `Swap arr[${left}] ↔ arr[${right}]`,
        cellStates: swapCells(a.length, left, right),
        swapped: [left, right],
      }),
    );
    [a[left], a[right]] = [a[right], a[left]];
    steps.push(
      arrayStep(a, 3, {
        pointers: { left, right },
        message: 'After swap',
        cellStates: highlight(a.length, left, right),
        variables: { left, right },
      }),
    );
    left++;
    right--;
  }
  return steps;
}

export function buildSwapAt(a: number[], i: number, j: number, line = 3): Step[] {
  const arr = [...a];
  const steps = [
    arrayStep(arr, line, {
      pointers: { i, j },
      message: `Swap arr[${i}] and arr[${j}]`,
      cellStates: swapCells(arr.length, i, j),
      swapped: [i, j],
      variables: { i, j },
    }),
  ];
  [arr[i], arr[j]] = [arr[j], arr[i]];
  steps.push(
    arrayStep(arr, line, {
      message: 'Swap complete',
      cellStates: highlight(arr.length, i, j),
      variables: { i, j },
    }),
  );
  return steps;
}

export function buildSwapFirstLast(arr: number[]): Step[] {
  if (arr.length < 2) return [arrayStep(arr, 3, { message: 'Array too short to swap' })];
  return buildSwapAt(arr, 0, arr.length - 1);
}

// ─── Type A: shifts & rotation ─────────────────────────────────────────────

export function buildRotateLeft1(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  const first = a[0];
  steps.push(arrayStep(a, 3, { message: `Lift arr[0] = ${first}`, pointers: { i: 0 }, cellStates: highlight(a.length, 0) }));
  for (let i = 0; i < a.length - 1; i++) {
    a[i] = a[i + 1];
    steps.push(
      arrayStep(a, 3, {
        pointers: { i, j: i + 1 },
        message: `Shift arr[${i + 1}] → arr[${i}]`,
        cellStates: highlight(a.length, i, i + 1),
        variables: { i },
      }),
    );
  }
  a[a.length - 1] = first;
  steps.push(
    arrayStep(a, 3, {
      message: `Insert ${first} at end`,
      pointers: { end: a.length - 1 },
      cellStates: highlight(a.length, a.length - 1),
    }),
  );
  return steps;
}

export function buildRotateRight1(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  const last = a[a.length - 1];
  steps.push(
    arrayStep(a, 3, {
      message: `Lift arr[${a.length - 1}] = ${last}`,
      pointers: { i: a.length - 1 },
      cellStates: highlight(a.length, a.length - 1),
    }),
  );
  for (let i = a.length - 1; i > 0; i--) {
    a[i] = a[i - 1];
    steps.push(
      arrayStep(a, 3, {
        pointers: { i, j: i - 1 },
        message: `Shift arr[${i - 1}] → arr[${i}]`,
        cellStates: highlight(a.length, i, i - 1),
      }),
    );
  }
  a[0] = last;
  steps.push(arrayStep(a, 3, { message: `Insert ${last} at start`, pointers: { i: 0 }, cellStates: highlight(a.length, 0) }));
  return steps;
}

export function buildRotateLeftK(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  let a = [...arr];
  const times = k % Math.max(a.length, 1);
  for (let t = 0; t < times; t++) {
    const pass = buildRotateLeft1(a);
    steps.push(
      ...pass.map((s) => ({
        ...s,
        message: s.message ? `Rotate ${t + 1}/${times}: ${s.message}` : s.message,
      })),
    );
    const last = pass[pass.length - 1];
    if (last && last.snapshot.kind === 'array') a = [...(last.snapshot as ArraySnapshot).values];
  }
  return steps;
}

export function buildRotateRightK(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  let a = [...arr];
  const times = k % Math.max(a.length, 1);
  for (let t = 0; t < times; t++) {
    const pass = buildRotateRight1(a);
    steps.push(...pass);
    const last = pass[pass.length - 1];
    if (last && last.snapshot.kind === 'array') a = [...(last.snapshot as ArraySnapshot).values];
  }
  return steps;
}

export function buildCopy(src: number[]): Step[] {
  const dest: number[] = [];
  const steps: Step[] = [];
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
    steps.push(
      arrayStep(src, 3, {
        pointers: { i },
        secondaryValues: [...dest],
        message: `Copy arr[${i}] → dest[${i}]`,
        cellStates: highlight(src.length, i),
        variables: { i },
      }),
    );
  }
  return steps;
}

export function buildInsertAt(arr: number[], pos: number, val: number): Step[] {
  const steps: Step[] = [
    arrayStep(arr, 1, {
      message: `Goal: insert ${val} at index ${pos}. Pehle jagah banani hai.`,
      phase: 'Step 1 — Plan',
      variables: { pos, val, n: arr.length },
    }),
  ];

  const result = [...arr];
  steps.push(
    arrayStep(result, 2, {
      message: `Array size badhega: ${arr.length} → ${arr.length + 1}`,
      operation: 'insert',
      floatingValue: val,
      floatingAt: pos,
      variables: { oldSize: arr.length, newSize: arr.length + 1 },
    }),
  );

  result.push(0);
  for (let i = arr.length - 1; i >= pos; i--) {
    const from = i;
    const to = i + 1;
    result[to] = result[from];
    steps.push(
      arrayStep([...result], 4, {
        message: `Shift RIGHT: arr[${from}] → arr[${to}]  (value ${result[from]})`,
        operation: 'shift-right',
        pointers: { i: from, to },
        cellStates: cells(result.length, (idx) =>
          idx === from ? 'shifting' : idx === to ? 'highlight' : 'default',
        ),
        emptyIndex: pos,
        floatingValue: val,
        floatingAt: pos,
        variables: { i: from, from, to },
      }),
    );
  }

  result[pos] = val;
  steps.push(
    arrayStep(result, 6, {
      message: `Ab khali slot par value rakho: arr[${pos}] = ${val}`,
      operation: 'insert',
      pointers: { pos },
      cellStates: cells(result.length, (idx) => (idx === pos ? 'new' : 'default')),
      variables: { pos, val },
      phase: 'Done ✓',
    }),
  );

  return steps;
}

export function buildDeleteAt(arr: number[], pos: number): Step[] {
  const a = [...arr];
  const removed = a[pos];
  const steps: Step[] = [
    arrayStep(a, 1, {
      message: `Goal: delete element at index ${pos} (value = ${removed})`,
      phase: 'Step 1 — Mark for removal',
      pointers: { pos },
      removedAt: pos,
      removedValue: removed,
      cellStates: cells(a.length, (i) => (i === pos ? 'found' : 'default')),
      variables: { pos, removed },
    }),
  ];

  for (let i = pos; i < a.length - 1; i++) {
    a[i] = a[i + 1];
    steps.push(
      arrayStep([...a], 4, {
        message: `Shift LEFT: arr[${i + 1}] → arr[${i}]  (copy ${a[i]})`,
        operation: 'shift-left',
        pointers: { i, from: i + 1 },
        cellStates: cells(a.length, (idx) =>
          idx === i ? 'highlight' : idx === i + 1 ? 'shifting' : 'default',
        ),
        variables: { i, from: i + 1 },
      }),
    );
  }

  a.pop();
  steps.push(
    arrayStep(a, 6, {
      message: `Delete complete. Size: ${arr.length} → ${a.length}`,
      operation: 'delete',
      phase: 'Done ✓',
      variables: { pos, newSize: a.length },
    }),
  );

  return steps;
}

export function buildInsertSorted(sorted: number[], val: number): Step[] {
  const steps: Step[] = [];
  let pos = sorted.length;
  for (let i = 0; i < sorted.length; i++) {
    steps.push(
      arrayStep(sorted, 3, {
        pointers: { i },
        comparison: `${val} vs arr[${i}] = ${sorted[i]}`,
        message: sorted[i] > val ? 'Found insert position' : 'Continue scan',
        cellStates: highlight(sorted.length, i),
      }),
    );
    if (sorted[i] > val) {
      pos = i;
      break;
    }
  }
  return [...steps, ...buildInsertAt(sorted, pos, val)];
}

export function buildRemoveAllX(arr: number[], x: number): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  let slow = 0;
  for (let fast = 0; fast < a.length; fast++) {
    const keep = a[fast] !== x;
    if (keep) {
      a[slow] = a[fast];
      steps.push(
        arrayStep(a, 3, {
          pointers: { slow, fast },
          message: keep ? 'Keep — advance slow' : 'Skip X',
          cellStates: cells(a.length, (i) => (i === fast ? (keep ? 'match' : 'skip') : i === slow ? 'highlight' : 'default')),
          variables: { slow, fast },
        }),
      );
      slow++;
    } else {
      steps.push(
        arrayStep(a, 3, {
          pointers: { slow, fast },
          message: 'Skip X',
          cellStates: cells(a.length, (i) => (i === fast ? 'skip' : 'default')),
          variables: { slow, fast },
        }),
      );
    }
  }
  const result = a.slice(0, slow);
  steps.push(arrayStep(result, 3, { message: `Compacted length = ${slow}`, variables: { length: slow } }));
  return steps;
}

export function buildReplaceAll(arr: number[], x: number, y: number): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = 0; i < a.length; i++) {
    const match = a[i] === x;
    if (match) a[i] = y;
    steps.push(
      arrayStep(a, 3, {
        pointers: { i },
        comparison: match ? `Replace ${x} → ${y}` : 'No change',
        cellStates: cells(a.length, (j) => (j === i ? (match ? 'match' : 'default') : 'default')),
        variables: { i, x, y },
      }),
    );
  }
  return steps;
}

export function buildMerge(a: number[], b: number[]): Step[] {
  const dest: number[] = [];
  const steps: Step[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    const takeA = j >= b.length || (i < a.length && a[i] <= b[j]);
    if (takeA) {
      dest.push(a[i]);
      steps.push(
        arrayStep(a, 3, {
          pointers: { i },
          secondaryValues: [...dest],
          message: `Take A[${i}] = ${a[i]}`,
          cellStates: highlight(a.length, i),
          variables: { i, j },
        }),
      );
      i++;
    } else {
      dest.push(b[j]);
      steps.push(
        arrayStep(b, 3, {
          pointers: { j },
          secondaryValues: [...dest],
          message: `Take B[${j}] = ${b[j]}`,
          cellStates: highlight(b.length, j),
          variables: { i, j },
        }),
      );
      j++;
    }
  }
  return steps;
}

export function buildConcat(a: number[], b: number[]): Step[] {
  const result = [...a];
  const steps: Step[] = [];
  for (let j = 0; j < b.length; j++) {
    result.push(b[j]);
    steps.push(
      arrayStep(result, 3, {
        pointers: { j: a.length + j },
        message: `Append B[${j}] = ${b[j]}`,
        cellStates: highlight(result.length, a.length + j),
        variables: { j },
      }),
    );
  }
  return steps;
}

export function buildSplit(arr: number[]): Step[] {
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return [
    arrayStep(arr, 3, { message: `Split at midpoint ${mid}`, pointers: { mid }, cellStates: highlight(arr.length, mid) }),
    arrayStep(left, 3, { phase: 'Left half', secondaryValues: right, message: 'Left half extracted' }),
    arrayStep(right, 3, { phase: 'Right half', secondaryValues: left, message: 'Right half extracted' }),
  ];
}

export function buildPartition(arr: number[], predicate: (v: number) => boolean, label: string): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  let write = 0;
  for (let read = 0; read < a.length; read++) {
    const match = predicate(a[read]);
    if (match) {
      [a[write], a[read]] = [a[read], a[write]];
      steps.push(
        arrayStep(a, 3, {
          pointers: { read, write },
          message: `${label}: place arr[${read}]`,
          cellStates: cells(a.length, (i) => (i === read || i === write ? 'swap' : 'default')),
          swapped: [read, write],
          variables: { read, write },
        }),
      );
      write++;
    } else {
      steps.push(
        arrayStep(a, 3, {
          pointers: { read, write },
          message: `${label}: skip arr[${read}]`,
          cellStates: cells(a.length, (i) => (i === read ? 'skip' : 'default')),
          variables: { read, write },
        }),
      );
    }
  }
  return steps;
}

export function buildSeparateEvenOdd(arr: number[]): Step[] {
  return buildPartition(arr, (v) => v % 2 === 0, 'Even');
}

export function buildMoveZerosToEnd(arr: number[]): Step[] {
  return buildPartition(arr, (v) => v !== 0, 'Non-zero');
}

// ─── Type A: analysis ──────────────────────────────────────────────────────

export type SortedMode = 'asc' | 'desc' | 'nondec';

export function buildCheckSorted(arr: number[], mode: SortedMode): Step[] {
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    const ok =
      mode === 'asc' ? arr[i] > arr[i - 1] : mode === 'desc' ? arr[i] < arr[i - 1] : arr[i] >= arr[i - 1];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i, j: i - 1 },
        comparison: `arr[${i - 1}] vs arr[${i}] → ${ok ? 'OK' : 'VIOLATION'}`,
        message: ok ? 'Pair OK' : 'Not sorted — stop',
        cellStates: cells(arr.length, (j) => (j === i || j === i - 1 ? (ok ? 'match' : 'skip') : 'default')),
        variables: { i, sorted: ok },
      }),
    );
    if (!ok) break;
  }
  return steps;
}

export function buildCheckPalindrome(arr: number[]): Step[] {
  const steps: Step[] = [];
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const match = arr[left] === arr[right];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { left, right },
        comparison: `${arr[left]} == ${arr[right]} → ${match}`,
        message: match ? 'Match — move inward' : 'Mismatch — not palindrome',
        cellStates: cells(arr.length, (i) => (i === left || i === right ? (match ? 'match' : 'skip') : 'default')),
        variables: { left, right },
      }),
    );
    if (!match) break;
    left++;
    right--;
  }
  return steps;
}

export function buildSumAtStride(arr: number[], start: number): Step[] {
  let total = 0;
  const steps: Step[] = [];
  for (let i = start; i < arr.length; i += 2) {
    total += arr[i];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        accumulator: total,
        accumulatorLabel: 'total',
        variables: { i, total },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildSecondExtreme(arr: number[], findMax: boolean): Step[] {
  let best = findMax ? -Infinity : Infinity;
  let second = findMax ? -Infinity : Infinity;
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    if (findMax ? val > best : val < best) {
      second = best;
      best = val;
    } else if (findMax ? val > second && val < best : val < second && val > best) {
      second = val;
    }
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        runningMax: findMax ? best : undefined,
        runningMin: findMax ? undefined : best,
        secondaryAccumulator: second,
        secondaryLabel: findMax ? 'secondLargest' : 'secondSmallest',
        variables: { i, best, second },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildKthExtreme(arr: number[], k: number, findLargest: boolean): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let round = 0; round < k; round++) {
    let bestIdx = 0;
    for (let i = 1; i < a.length; i++) {
      const better = findLargest ? a[i] > a[bestIdx] : a[i] < a[bestIdx];
      if (better) bestIdx = i;
      steps.push(
        arrayStep(a, 3, {
          pointers: { i, best: bestIdx },
          message: `Round ${round + 1}: compare for ${findLargest ? 'max' : 'min'}`,
          cellStates: highlight(a.length, i, bestIdx),
          variables: { i, round: round + 1, k },
        }),
      );
    }
    steps.push(
      arrayStep(a, 3, {
        pointers: { best: bestIdx },
        message: `${findLargest ? 'Largest' : 'Smallest'} in remaining: ${a[bestIdx]}`,
        cellStates: highlight(a.length, bestIdx),
        phase: `K=${k}, found ${round + 1}`,
      }),
    );
    a[bestIdx] = findLargest ? -Infinity : Infinity;
  }
  return steps;
}

export function buildCountVsAverage(arr: number[], above: boolean): Step[] {
  const total = arr.reduce((s, v) => s + v, 0);
  const avg = total / arr.length;
  const steps: Step[] = [
    arrayStep(arr, 2, { phase: 'Phase 1: compute average', accumulator: total, accumulatorLabel: 'sum', variables: { avg } }),
  ];
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    const match = above ? arr[i] > avg : arr[i] < avg;
    if (match) count++;
    steps.push(
      arrayStep(arr, 4, {
        phase: 'Phase 2: count',
        pointers: { i },
        comparison: `${arr[i]} ${above ? '>' : '<'} ${avg.toFixed(2)}`,
        accumulator: count,
        accumulatorOp: 'count',
        accumulatorLabel: 'count',
        variables: { i, avg, count },
        cellStates: cells(arr.length, (j) => (j === i ? (match ? 'match' : 'skip') : 'default')),
      }),
    );
  }
  return steps;
}

export function buildLongestIncreasingRun(arr: number[]): Step[] {
  let best = arr.length > 0 ? 1 : 0;
  let cur = best;
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) cur++;
    else cur = 1;
    best = Math.max(best, cur);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        comparison: `${arr[i]} > ${arr[i - 1]} → run=${cur}`,
        accumulator: best,
        accumulatorLabel: 'maxRun',
        secondaryAccumulator: cur,
        secondaryLabel: 'currentRun',
        variables: { i, cur, best },
        cellStates: highlight(arr.length, i, i - 1),
      }),
    );
  }
  return steps;
}

// ─── Type B/C: two-pointer & sliding window ───────────────────────────────

export function buildPairSum(
  arr: number[],
  target: number,
  mode: 'find' | 'count' | 'all',
): Step[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: Step[] = [];
  let left = 0;
  let right = sorted.length - 1;
  let count = 0;
  const pairs: string[] = [];
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    const match = sum === target;
    steps.push(
      arrayStep(sorted, 3, {
        pointers: { left, right },
        comparison: `${sorted[left]} + ${sorted[right]} = ${sum} (target ${target})`,
        accumulator: mode === 'count' ? count : undefined,
        accumulatorLabel: mode === 'count' ? 'count' : undefined,
        positions: mode === 'all' ? pairs.map((p) => Number(p.split(',')[0])) : undefined,
        message: match ? 'Match!' : sum < target ? 'Too small — left++' : 'Too large — right--',
        cellStates: cells(sorted.length, (i) => (i === left || i === right ? (match ? 'found' : 'highlight') : 'default')),
        variables: { left, right, sum, target },
      }),
    );
    if (match) {
      if (mode === 'find') break;
      if (mode === 'count') count++;
      if (mode === 'all') pairs.push(`${left},${right}`);
      left++;
      right--;
    } else if (sum < target) left++;
    else right--;
  }
  return steps;
}

export function buildTripletSum(arr: number[], target: number): Step[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: Step[] = [];
  for (let k = 0; k < sorted.length - 2; k++) {
    steps.push(
      arrayStep(sorted, 2, {
        pointers: { k },
        phase: `Fix arr[${k}] = ${sorted[k]}`,
        cellStates: cells(sorted.length, (i) => (i === k ? 'match' : 'default')),
        variables: { k },
      }),
    );
    let left = k + 1;
    let right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[k] + sorted[left] + sorted[right];
      const match = sum === target;
      steps.push(
        arrayStep(sorted, 4, {
          pointers: { k, left, right },
          comparison: `${sorted[k]}+${sorted[left]}+${sorted[right]} = ${sum}`,
          message: match ? 'Triplet found!' : sum < target ? 'left++' : 'right--',
          cellStates: cells(sorted.length, (i) => (i === k || i === left || i === right ? 'highlight' : 'default')),
          variables: { k, left, right, sum },
        }),
      );
      if (match) break;
      if (sum < target) left++;
      else right--;
    }
  }
  return steps;
}

export function buildPairDiffCount(arr: number[], k: number): Step[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps: Step[] = [];
  let left = 0;
  let right = 1;
  let count = 0;
  while (right < sorted.length) {
    const diff = Math.abs(sorted[right] - sorted[left]);
    const match = diff === k;
    if (match) count++;
    steps.push(
      arrayStep(sorted, 3, {
        pointers: { left, right },
        comparison: `|${sorted[right]} - ${sorted[left]}| = ${diff}`,
        accumulator: count,
        accumulatorOp: 'count',
        accumulatorLabel: 'count',
        variables: { left, right, diff, k, count },
        cellStates: cells(sorted.length, (i) => (i === left || i === right ? 'highlight' : 'default')),
      }),
    );
    if (diff < k) right++;
    else left++;
    if (left === right) right++;
  }
  return steps;
}

export function buildFixedWindowSum(arr: number[], k: number, findMax: boolean): Step[] {
  const steps: Step[] = [];
  let windowSum = arr.slice(0, k).reduce((s, v) => s + v, 0);
  let best = windowSum;
  steps.push(
    arrayStep(arr, 3, {
      window: [0, k - 1],
      accumulator: windowSum,
      accumulatorLabel: 'windowSum',
      secondaryAccumulator: best,
      secondaryLabel: findMax ? 'maxSum' : 'minSum',
      cellStates: windowCells(arr.length, 0, k - 1),
      variables: { k, windowSum, best },
    }),
  );
  for (let start = 1; start <= arr.length - k; start++) {
    windowSum = windowSum - arr[start - 1] + arr[start + k - 1];
    best = findMax ? Math.max(best, windowSum) : Math.min(best, windowSum);
    const end = start + k - 1;
    steps.push(
      arrayStep(arr, 3, {
        window: [start, end],
        accumulator: windowSum,
        accumulatorLabel: 'windowSum',
        secondaryAccumulator: best,
        secondaryLabel: findMax ? 'maxSum' : 'minSum',
        cellStates: windowCells(arr.length, start, end),
        variables: { start, end, windowSum, best },
      }),
    );
  }
  return steps;
}

export function buildFirstNegativeInWindow(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  for (let start = 0; start <= arr.length - k; start++) {
    const end = start + k - 1;
    let firstNeg = -1;
    for (let j = start; j <= end; j++) {
      if (arr[j] < 0) {
        firstNeg = j;
        break;
      }
    }
    steps.push(
      arrayStep(arr, 3, {
        window: [start, end],
        foundIndex: firstNeg >= 0 ? firstNeg : undefined,
        message: firstNeg >= 0 ? `First negative at ${firstNeg}` : 'No negative in window',
        cellStates: windowCells(arr.length, start, end),
        variables: { start, end, firstNeg },
      }),
    );
  }
  return steps;
}

export function buildMaxInEveryWindow(arr: number[], k: number): Step[] {
  const steps: Step[] = [];
  for (let start = 0; start <= arr.length - k; start++) {
    const end = start + k - 1;
    let maxVal = -Infinity;
    let maxIdx = start;
    for (let j = start; j <= end; j++) {
      if (arr[j] > maxVal) {
        maxVal = arr[j];
        maxIdx = j;
      }
    }
    steps.push(
      arrayStep(arr, 3, {
        window: [start, end],
        runningMax: maxVal,
        maxIndex: maxIdx,
        cellStates: windowCells(arr.length, start, end),
        variables: { start, end, maxVal, maxIdx },
      }),
    );
  }
  return steps;
}

export function buildCountSubarraysSumK(arr: number[], k: number): Step[] {
  const prefix: Record<string, number> = { '0': 1 };
  let sum = 0;
  let count = 0;
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    const need = String(sum - k);
    count += prefix[need] ?? 0;
    const key = String(sum);
    prefix[key] = (prefix[key] ?? 0) + 1;
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        accumulator: count,
        accumulatorOp: 'count',
        accumulatorLabel: 'count',
        auxMap: { ...prefix },
        variables: { i, sum, k, count },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildVariableWindowSum(arr: number[], k: number, longest: boolean): Step[] {
  const steps: Step[] = [];
  let left = 0;
  let sum = 0;
  let bestLen = 0;
  let bestRange: [number, number] | undefined;
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum > k && left <= right) {
      sum -= arr[left];
      left++;
    }
    if (sum === k) {
      const len = right - left + 1;
      if (!longest || len > bestLen) {
        bestLen = len;
        bestRange = [left, right];
      }
    }
    steps.push(
      arrayStep(arr, 3, {
        pointers: { left, right },
        window: [left, right],
        accumulator: sum,
        accumulatorLabel: 'sum',
        secondaryAccumulator: bestLen,
        secondaryLabel: longest ? 'maxLen' : 'found',
        message: sum === k ? 'Window sum = K' : sum > k ? 'Shrink left' : 'Expand right',
        cellStates: windowCells(arr.length, left, right),
        variables: { left, right, sum, k, bestLen },
      }),
    );
    if (!longest && sum === k && bestRange) break;
  }
  return steps;
}

// ─── Type G/E/V/U advanced ─────────────────────────────────────────────────

export function buildKadane(arr: number[]): Step[] {
  let best = arr[0] ?? 0;
  let cur = arr[0] ?? 0;
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    const extend = cur + arr[i];
    cur = Math.max(arr[i], extend);
    best = Math.max(best, cur);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        comparison: `extend=${extend}, reset or take arr[${i}]`,
        accumulator: best,
        accumulatorLabel: 'maxSum',
        secondaryAccumulator: cur,
        secondaryLabel: 'curSum',
        variables: { i, cur, best },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildMaxProductSubarray(arr: number[]): Step[] {
  let maxP = arr[0] ?? 0;
  let minP = arr[0] ?? 0;
  let best = arr[0] ?? 0;
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    const v = arr[i];
    const candidates = [v, maxP * v, minP * v];
    maxP = Math.max(...candidates);
    minP = Math.min(...candidates);
    best = Math.max(best, maxP);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        runningMax: maxP,
        runningMin: minP,
        accumulator: best,
        accumulatorLabel: 'best',
        variables: { i, maxP, minP, best },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildEquilibrium(arr: number[]): Step[] {
  const total = arr.reduce((s, v) => s + v, 0);
  let leftSum = 0;
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    const rightSum = total - leftSum - arr[i];
    const eq = leftSum === rightSum;
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        comparison: `left=${leftSum}, right=${rightSum}`,
        message: eq ? 'Equilibrium index!' : 'Not equilibrium',
        accumulator: leftSum,
        accumulatorLabel: 'leftSum',
        secondaryAccumulator: rightSum,
        secondaryLabel: 'rightSum',
        variables: { i, leftSum, rightSum },
        cellStates: highlight(arr.length, i),
      }),
    );
    leftSum += arr[i];
  }
  return steps;
}

export function buildLeaders(arr: number[]): Step[] {
  let maxFromRight = -Infinity;
  const steps: Step[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    const isLeader = arr[i] >= maxFromRight;
    if (isLeader) maxFromRight = arr[i];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        runningMax: maxFromRight,
        message: isLeader ? `Leader: ${arr[i]}` : 'Not a leader',
        cellStates: cells(arr.length, (j) => (j === i ? (isLeader ? 'found' : 'skip') : 'default')),
        variables: { i },
      }),
    );
  }
  return steps;
}

export function buildPeakScan(arr: number[], collectAll: boolean, findValley = false): Step[] {
  const steps: Step[] = [];
  const peaks: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const left = i > 0 ? arr[i - 1] : -Infinity;
    const right = i < arr.length - 1 ? arr[i + 1] : -Infinity;
    const isPeak = findValley ? arr[i] < left && arr[i] < right : arr[i] > left && arr[i] > right;
    if (isPeak && collectAll) peaks.push(i);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        comparison: findValley ? `valley check at ${i}` : `peak check at ${i}`,
        message: isPeak ? (findValley ? 'Valley!' : 'Peak!') : 'Not a peak',
        positions: collectAll ? peaks : undefined,
        cellStates: cells(arr.length, (j) => (j === i ? (isPeak ? 'found' : 'default') : 'default')),
        variables: { i },
      }),
    );
    if (isPeak && !collectAll) break;
  }
  return steps;
}

export function buildMissingNumber(arr: number[]): Step[] {
  const n = arr.length;
  const expected = (n * (n + 1)) / 2;
  const actual = arr.reduce((s, v) => s + v, 0);
  const steps: Step[] = [
    arrayStep(arr, 2, { message: 'Sum formula approach', variables: { expected, actual, missing: expected - actual } }),
  ];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        accumulator: sum,
        accumulatorLabel: 'sum',
        variables: { i, sum, expected },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildFindDuplicate(arr: number[]): Step[] {
  const seen: number[] = [];
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    const dup = seen.includes(arr[i]);
    if (!dup) seen.push(arr[i]);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        auxSet: [...seen],
        duplicateFound: dup,
        message: dup ? `Duplicate: ${arr[i]}` : 'Mark index',
        cellStates: cells(arr.length, (j) => (j === i ? (dup ? 'found' : 'highlight') : 'default')),
        variables: { i },
      }),
    );
    if (dup) break;
  }
  return steps;
}

export function buildBoyerMoore(arr: number[]): Step[] {
  let candidate = arr[0];
  let count = 1;
  const steps: Step[] = [
    arrayStep(arr, 2, { candidate, voteCount: count, message: 'Initialize candidate', variables: { candidate, count } }),
  ];
  for (let i = 1; i < arr.length; i++) {
    if (count === 0) {
      candidate = arr[i];
      count = 1;
    } else if (arr[i] === candidate) count++;
    else count--;
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        candidate,
        voteCount: count,
        comparison: arr[i] === candidate ? 'Same — count++' : 'Cancel — count--',
        variables: { i, candidate, count },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildStockSingle(arr: number[]): Step[] {
  let minPrice = arr[0];
  let maxProfit = 0;
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    maxProfit = Math.max(maxProfit, arr[i] - minPrice);
    minPrice = Math.min(minPrice, arr[i]);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        runningMin: minPrice,
        accumulator: maxProfit,
        accumulatorLabel: 'maxProfit',
        variables: { i, minPrice, maxProfit },
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  return steps;
}

export function buildStockMultiple(arr: number[]): Step[] {
  let profit = 0;
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) profit += arr[i] - arr[i - 1];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        accumulator: profit,
        accumulatorLabel: 'profit',
        comparison: arr[i] > arr[i - 1] ? 'Capture valley→peak' : 'Skip',
        variables: { i, profit },
        cellStates: highlight(arr.length, i, i - 1),
      }),
    );
  }
  return steps;
}

export function buildRearrangeAlternating(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  let posSlot = 0;
  let negSlot = a.length - 1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] > 0) {
      [a[posSlot], a[i]] = [a[i], a[posSlot]];
      steps.push(
        arrayStep(a, 3, {
          pointers: { i, posSlot },
          message: 'Place positive',
          swapped: [posSlot, i],
          cellStates: swapCells(a.length, posSlot, i),
        }),
      );
      posSlot += 2;
    } else if (a[i] < 0) {
      [a[negSlot], a[i]] = [a[i], a[negSlot]];
      steps.push(
        arrayStep(a, 3, {
          pointers: { i, negSlot },
          message: 'Place negative',
          swapped: [negSlot, i],
          cellStates: swapCells(a.length, negSlot, i),
        }),
      );
      negSlot -= 2;
    }
  }
  return steps;
}

export function buildZigzag(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    const shouldBeLess = i % 2 === 0;
    const ok = shouldBeLess ? a[i] < a[i + 1] : a[i] > a[i + 1];
    if (!ok) {
      [a[i], a[i + 1]] = [a[i + 1], a[i]];
      steps.push(
        arrayStep(a, 3, {
          pointers: { i },
          message: 'Swap to fix zigzag',
          swapped: [i, i + 1],
          cellStates: swapCells(a.length, i, i + 1),
        }),
      );
    } else {
      steps.push(
        arrayStep(a, 3, {
          pointers: { i },
          message: 'Zigzag OK',
          cellStates: highlight(a.length, i, i + 1),
        }),
      );
    }
  }
  return steps;
}

export function buildDutchFlag(arr: number[]): Step[] {
  const a = [...arr];
  let low = 0;
  let mid = 0;
  let high = a.length - 1;
  const steps: Step[] = [];
  while (mid <= high) {
    steps.push(
      arrayStep(a, 3, {
        pointers: { low, mid, high },
        regionColors: dutchRegions(a.length, low, mid, high),
        variables: { low, mid, high, val: a[mid] },
        cellStates: cells(a.length, (i) => (i === mid ? 'highlight' : 'default')),
      }),
    );
    if (a[mid] === 0) {
      [a[low], a[mid]] = [a[mid], a[low]];
      low++;
      mid++;
    } else if (a[mid] === 2) {
      [a[mid], a[high]] = [a[high], a[mid]];
      high--;
    } else mid++;
  }
  return steps;
}

export function buildTrappingRain(arr: number[]): Step[] {
  const n = arr.length;
  const leftMax: number[] = new Array(n).fill(0);
  const rightMax: number[] = new Array(n).fill(0);
  const steps: Step[] = [];
  leftMax[0] = arr[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], arr[i]);
    steps.push(
      arrayStep(arr, 3, {
        phase: 'Pass 1: leftMax',
        pointers: { i },
        secondaryValues: [...leftMax],
        variables: { i, leftMax: leftMax[i] },
        cellStates: highlight(n, i),
      }),
    );
  }
  rightMax[n - 1] = arr[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], arr[i]);
    steps.push(
      arrayStep(arr, 4, {
        phase: 'Pass 2: rightMax',
        pointers: { i },
        secondaryValues: [...rightMax],
        variables: { i, rightMax: rightMax[i] },
        cellStates: highlight(n, i),
      }),
    );
  }
  let water = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.min(leftMax[i], rightMax[i]) - arr[i];
    water += Math.max(0, w);
    steps.push(
      arrayStep(arr, 5, {
        phase: 'Combine: water',
        pointers: { i },
        comparison: `water at ${i} = ${w}`,
        accumulator: water,
        accumulatorLabel: 'totalWater',
        variables: { i, water },
        cellStates: highlight(n, i),
      }),
    );
  }
  return steps;
}

export function buildContainerWater(arr: number[]): Step[] {
  let left = 0;
  let right = arr.length - 1;
  let best = 0;
  const steps: Step[] = [];
  while (left < right) {
    const area = Math.min(arr[left], arr[right]) * (right - left);
    best = Math.max(best, area);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { left, right },
        comparison: `area = ${area}`,
        accumulator: best,
        accumulatorLabel: 'maxArea',
        cellStates: cells(arr.length, (i) => (i === left || i === right ? 'highlight' : 'default')),
        variables: { left, right, area, best },
      }),
    );
    if (arr[left] < arr[right]) left++;
    else right--;
  }
  return steps;
}

export function buildMaxDifference(arr: number[]): Step[] {
  let minSoFar = arr[0];
  let bestDiff = 0;
  const steps: Step[] = [];
  for (let j = 1; j < arr.length; j++) {
    bestDiff = Math.max(bestDiff, arr[j] - minSoFar);
    minSoFar = Math.min(minSoFar, arr[j]);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { j },
        runningMin: minSoFar,
        accumulator: bestDiff,
        accumulatorLabel: 'maxDiff',
        variables: { j, minSoFar, bestDiff },
        cellStates: highlight(arr.length, j),
      }),
    );
  }
  return steps;
}

export function buildSmallestMissingPositive(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = 0; i < a.length; i++) {
    while (a[i] > 0 && a[i] <= a.length && a[a[i] - 1] !== a[i]) {
      const target = a[i] - 1;
      [a[i], a[target]] = [a[target], a[i]];
      steps.push(
        arrayStep(a, 3, {
          pointers: { i, target },
          message: `Place ${a[target]} at index ${target}`,
          swapped: [i, target],
          cellStates: swapCells(a.length, i, target),
        }),
      );
    }
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== i + 1) {
      steps.push(arrayStep(a, 4, { message: `Smallest missing = ${i + 1}`, variables: { answer: i + 1 } }));
      break;
    }
  }
  return steps;
}

// ─── Sorting ───────────────────────────────────────────────────────────────

export function buildBubbleSort(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      const swap = a[j] > a[j + 1];
      steps.push(
        arrayStep(a, 3, {
          pointers: { j },
          comparison: `${a[j]} > ${a[j + 1]} → ${swap}`,
          cellStates: cells(a.length, (k) => (k === j || k === j + 1 ? (swap ? 'swap' : 'highlight') : 'default')),
          variables: { j },
        }),
      );
      if (swap) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return steps;
}

export function buildSelectionSort(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
      steps.push(
        arrayStep(a, 3, {
          pointers: { i, j, min: minIdx },
          minIndex: minIdx,
          cellStates: cells(a.length, (k) => (k === j || k === minIdx ? 'highlight' : 'default')),
          variables: { i, j, minIdx },
        }),
      );
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
    steps.push(
      arrayStep(a, 3, {
        pointers: { i },
        message: `Swap min into position ${i}`,
        swapped: [i, minIdx],
        cellStates: swapCells(a.length, i, minIdx),
      }),
    );
  }
  return steps;
}

export function buildInsertionSort(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push(arrayStep(a, 3, { pointers: { i }, message: `Insert key ${key}`, cellStates: highlight(a.length, i) }));
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      steps.push(
        arrayStep(a, 3, {
          pointers: { j },
          message: `Shift ${a[j]} right`,
          cellStates: highlight(a.length, j, j + 1),
        }),
      );
      j--;
    }
    a[j + 1] = key;
    steps.push(arrayStep(a, 3, { message: `Place ${key}`, cellStates: highlight(a.length, j + 1) }));
  }
  return steps;
}

export function buildCountingSort(arr: number[]): Step[] {
  const counts = new Array(10).fill(0);
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    counts[arr[i]]++;
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        secondaryValues: [...counts],
        message: `count[${arr[i]}]++`,
        cellStates: highlight(arr.length, i),
      }),
    );
  }
  const out: number[] = [];
  for (let d = 0; d < 10; d++) {
    while (counts[d] > 0) {
      out.push(d);
      counts[d]--;
      steps.push(
        arrayStep(out, 4, {
          secondaryValues: [...counts],
          message: `Output ${d}`,
          phase: 'Fill output',
        }),
      );
    }
  }
  return steps;
}

export function buildMergeSorted(a: number[], b: number[]): Step[] {
  return buildMerge(a, b);
}

export function buildSingleSwapSortableCheck(arr: number[]): Step[] {
  const sorted = [...arr].sort((x, y) => x - y);
  const mismatches: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== sorted[i]) mismatches.push(i);
  }
  const steps: Step[] = [
    arrayStep(arr, 2, {
      secondaryValues: sorted,
      message: 'Compare with sorted copy',
      variables: { mismatches: mismatches.length },
    }),
  ];
  if (mismatches.length === 2) {
    const [i, j] = mismatches;
    const swapped = [...arr];
    [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
    const ok = swapped.every((v, k) => v === sorted[k]);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i, j },
        message: ok ? 'Single swap fixes order' : 'Swap insufficient',
        swapped: [i, j],
        variables: { sortable: ok },
      }),
    );
  }
  return steps;
}

// ─── Type D: binary search ─────────────────────────────────────────────────

export function buildBinarySearch(arr: number[], target: number, mode: 'find' | 'first' | 'last' | 'insert' = 'find'): Step[] {
  const a = [...arr].sort((x, y) => x - y);
  let lo = 0;
  let hi = a.length - 1;
  let result = -1;
  const steps: Step[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const cmp = a[mid] - target;
    steps.push(
      arrayStep(a, 3, {
        pointers: { lo, mid, hi },
        searchRange: [lo, hi],
        comparison: `arr[${mid}] = ${a[mid]} vs ${target}`,
        cellStates: cells(a.length, (i) => (i === mid ? 'highlight' : i >= lo && i <= hi ? 'match' : 'default')),
        variables: { lo, mid, hi, target },
      }),
    );
    if (cmp === 0) {
      result = mid;
      if (mode === 'find') break;
      if (mode === 'first') hi = mid - 1;
      else if (mode === 'last') lo = mid + 1;
      else break;
    } else if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  if (mode === 'insert' && result === -1) {
    steps.push(arrayStep(a, 4, { message: `Insert position ${lo}`, variables: { insertAt: lo } }));
  }
  return steps;
}

export function buildRotatedSearch(arr: number[], target: number): Step[] {
  let lo = 0;
  let hi = arr.length - 1;
  const steps: Step[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { lo, mid, hi },
        searchRange: [lo, hi],
        comparison: 'Which half is sorted?',
        cellStates: cells(arr.length, (i) => (i === mid ? 'highlight' : 'default')),
        variables: { lo, mid, hi },
      }),
    );
    if (arr[mid] === target) break;
    if (arr[lo] <= arr[mid]) {
      if (target >= arr[lo] && target < arr[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (target > arr[mid] && target <= arr[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return steps;
}

export function buildMinRotated(arr: number[]): Step[] {
  let lo = 0;
  let hi = arr.length - 1;
  const steps: Step[] = [];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { lo, mid, hi },
        searchRange: [lo, hi],
        comparison: `arr[mid]=${arr[mid]} vs arr[hi]=${arr[hi]}`,
        variables: { lo, mid, hi },
      }),
    );
    if (arr[mid] > arr[hi]) lo = mid + 1;
    else hi = mid;
  }
  steps.push(arrayStep(arr, 4, { message: `Min at index ${lo}`, foundIndex: lo, variables: { minIndex: lo } }));
  return steps;
}

export function buildPeakBinarySearch(arr: number[]): Step[] {
  let lo = 0;
  let hi = arr.length - 1;
  const steps: Step[] = [];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push(
      arrayStep(arr, 3, {
        pointers: { lo, mid, hi },
        searchRange: [lo, hi],
        comparison: `arr[${mid}] vs arr[${mid + 1}]`,
        variables: { lo, mid, hi },
      }),
    );
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  steps.push(arrayStep(arr, 4, { foundIndex: lo, message: `Peak at ${lo}` }));
  return steps;
}

export function buildFloorCeiling(arr: number[], target: number): Step[] {
  const a = [...arr].sort((x, y) => x - y);
  let lo = 0;
  let hi = a.length - 1;
  let floor = -1;
  let ceil = -1;
  const steps: Step[] = [];
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === target) {
      floor = ceil = mid;
      break;
    }
    if (a[mid] < target) {
      floor = mid;
      lo = mid + 1;
    } else {
      ceil = mid;
      hi = mid - 1;
    }
    steps.push(
      arrayStep(a, 3, {
        pointers: { lo, mid, hi },
        searchRange: [lo, hi],
        variables: { floor, ceil, target },
        cellStates: highlight(a.length, mid),
      }),
    );
  }
  return steps;
}

export function buildCountGreaterSorted(arr: number[], x: number): Step[] {
  const a = [...arr].sort((u, v) => u - v);
  let lo = 0;
  let hi = a.length;
  const steps: Step[] = [];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push(
      arrayStep(a, 3, {
        pointers: { lo, mid, hi },
        searchRange: [lo, hi - 1],
        comparison: `arr[${mid}] vs ${x}`,
        variables: { lo, mid, hi },
      }),
    );
    if (a[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  steps.push(arrayStep(a, 4, { message: `Count > X = ${a.length - lo}`, variables: { count: a.length - lo } }));
  return steps;
}

export function buildKthSmallestBinarySearch(arr: number[], k: number): Step[] {
  let lo = Math.min(...arr);
  let hi = Math.max(...arr);
  const steps: Step[] = [];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    for (const v of arr) if (v <= mid) count++;
    steps.push(
      arrayStep(arr, 3, {
        searchRange: [lo, hi],
        comparison: `feasibility: count<=${mid} is ${count}`,
        variables: { lo, hi, mid, count, k },
        phase: 'Binary search on answer',
      }),
    );
    if (count < k) lo = mid + 1;
    else hi = mid;
  }
  return steps;
}

export function buildMedianTwoSorted(a: number[], b: number[]): Step[] {
  const steps: Step[] = [];
  if (a.length > b.length) return buildMedianTwoSorted(b, a);
  const m = a.length;
  const n = b.length;
  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeftA = i === 0 ? -Infinity : a[i - 1];
    const minRightA = i === m ? Infinity : a[i];
    const maxLeftB = j === 0 ? -Infinity : b[j - 1];
    const minRightB = j === n ? Infinity : b[j];
    steps.push(
      arrayStep(a, 3, {
        secondaryValues: b,
        comparison: `partition i=${i}, j=${j}`,
        variables: { i, j, maxLeftA, minRightA, maxLeftB, minRightB },
        phase: 'Partition both arrays',
      }),
    );
    if (maxLeftA <= minRightB && maxLeftB <= minRightA) break;
    if (maxLeftA > minRightB) hi = i - 1;
    else lo = i + 1;
  }
  return steps;
}

// ─── Level 9 advanced ──────────────────────────────────────────────────────

export function buildLongestConsecutive(arr: number[]): Step[] {
  const set = new Set(arr);
  const steps: Step[] = [];
  let best = 0;
  for (const num of arr) {
    if (!set.has(num - 1)) {
      let cur = num;
      let len = 1;
      while (set.has(cur + 1)) {
        cur++;
        len++;
      }
      best = Math.max(best, len);
      steps.push(
        arrayStep(arr, 3, {
          auxSet: [...set],
          accumulator: best,
          accumulatorLabel: 'maxLen',
          message: `Chain from ${num}, len=${len}`,
          variables: { num, len, best },
        }),
      );
    }
  }
  return steps;
}

export function buildProductExceptSelf(arr: number[]): Step[] {
  const n = arr.length;
  const prefix: number[] = new Array(n).fill(1);
  const suffix: number[] = new Array(n).fill(1);
  const steps: Step[] = [];
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * arr[i - 1];
    steps.push(
      arrayStep(arr, 3, {
        phase: 'Pass 1: prefix',
        pointers: { i },
        secondaryValues: [...prefix],
        variables: { i },
        cellStates: highlight(n, i),
      }),
    );
  }
  suffix[n - 1] = 1;
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * arr[i + 1];
    steps.push(
      arrayStep(arr, 4, {
        phase: 'Pass 2: suffix',
        pointers: { i },
        secondaryValues: [...suffix],
        variables: { i },
        cellStates: highlight(n, i),
      }),
    );
  }
  const out = prefix.map((p, i) => p * suffix[i]);
  steps.push(arrayStep(out, 5, { phase: 'Combine', message: 'prefix × suffix', secondaryValues: out }));
  return steps;
}

export function buildFisherYates(arr: number[]): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
    steps.push(
      arrayStep(a, 3, {
        pointers: { i, j },
        message: `Swap with random j=${j}`,
        swapped: [i, j],
        phase: `Unshuffled region ends at ${i}`,
        cellStates: swapCells(a.length, i, j),
        variables: { i, j },
      }),
    );
  }
  return steps;
}

export function buildNextPermutation(arr: number[], previous = false): Step[] {
  const a = [...arr];
  const steps: Step[] = [];
  let i = a.length - 2;
  while (i >= 0 && (previous ? a[i] <= a[i + 1] : a[i] >= a[i + 1])) i--;
  steps.push(
    arrayStep(a, 2, {
      phase: 'Phase 1: pivot',
      pointers: { i },
      message: i >= 0 ? `Pivot at ${i}` : 'Already first/last permutation',
      cellStates: highlight(a.length, i),
    }),
  );
  if (i < 0) return steps;
  let j = a.length - 1;
  while (previous ? a[j] >= a[i] : a[j] <= a[i]) j--;
  steps.push(
    arrayStep(a, 3, {
      phase: 'Phase 2: successor',
      pointers: { i, j },
      swapped: [i, j],
      cellStates: swapCells(a.length, i, j),
    }),
  );
  [a[i], a[j]] = [a[j], a[i]];
  let left = i + 1;
  let right = a.length - 1;
  while (left < right) {
    [a[left], a[right]] = [a[right], a[left]];
    steps.push(
      arrayStep(a, 4, {
        phase: 'Phase 3: reverse suffix',
        pointers: { left, right },
        swapped: [left, right],
        cellStates: swapCells(a.length, left, right),
      }),
    );
    left++;
    right--;
  }
  return steps;
}

export function buildMaxXorSubarray(arr: number[]): Step[] {
  let best = 0;
  const steps: Step[] = [];
  for (let i = 0; i < arr.length; i++) {
    let xor = 0;
    for (let j = i; j < arr.length; j++) {
      xor ^= arr[j];
      best = Math.max(best, xor);
      steps.push(
        arrayStep(arr, 3, {
          window: [i, j],
          comparison: `xor=${xor}`,
          accumulator: best,
          accumulatorLabel: 'maxXor',
          cellStates: windowCells(arr.length, i, j),
          variables: { i, j, xor, best },
        }),
      );
    }
  }
  return steps;
}

export function buildCountInversions(arr: number[]): Step[] {
  const steps: Step[] = [];
  function mergeSort(a: number[], offset: number): number[] {
    if (a.length <= 1) return a;
    const mid = Math.floor(a.length / 2);
    steps.push(
      arrayStep(a, 2, {
        phase: 'Split',
        message: `Split [${offset}..${offset + a.length - 1}]`,
        secondaryValues: a,
        variables: { offset, len: a.length },
      }),
    );
    const left = mergeSort(a.slice(0, mid), offset);
    const right = mergeSort(a.slice(mid), offset + mid);
    const merged: number[] = [];
    let i = 0;
    let j = 0;
    let inv = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i++]);
      } else {
        merged.push(right[j++]);
        inv += left.length - i;
        steps.push(
          arrayStep(merged, 3, {
            phase: 'Merge: inversion',
            comparison: `cross inversion +${left.length - i}`,
            accumulator: inv,
            accumulatorLabel: 'inversions',
            secondaryValues: [...left, ...right],
          }),
        );
      }
    }
    return merged.concat(left.slice(i), right.slice(j));
  }
  mergeSort([...arr], 0);
  return steps;
}

export function buildTripletsZero(arr: number[]): Step[] {
  return buildTripletSum(arr, 0);
}

export function buildLIS(arr: number[]): Step[] {
  const dp = new Array(arr.length).fill(1);
  const steps: Step[] = [];
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
      steps.push(
        arrayStep(arr, 3, {
          pointers: { i, j },
          secondaryValues: [...dp],
          comparison: `arr[${j}] < arr[${i}]`,
          variables: { i, j, dp_i: dp[i] },
          cellStates: highlight(arr.length, i, j),
        }),
      );
    }
  }
  steps.push(arrayStep(arr, 4, { secondaryValues: dp, accumulator: Math.max(...dp), accumulatorLabel: 'LIS' }));
  return steps;
}

export function buildMaxCircularSubarray(arr: number[]): Step[] {
  const steps: Step[] = [
    ...buildKadane(arr),
    ...buildKadane(arr.map((v) => -v)),
    arrayStep(arr, 5, {
      message: 'Combine: max(normal, total - minSubarray)',
      variables: { total: arr.reduce((s, v) => s + v, 0) },
      phase: 'Circular result',
    }),
  ];
  return steps;
}

export function buildTwoMissingNumbers(arr: number[]): Step[] {
  const n = arr.length + 2;
  const expected = (n * (n + 1)) / 2;
  const actual = arr.reduce((s, v) => s + v, 0);
  const steps: Step[] = [
    arrayStep(arr, 2, { message: 'Sum approach for two missing', variables: { expected, actual } }),
  ];
  let sum = 0;
  let xorAll = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    xorAll ^= arr[i];
    steps.push(
      arrayStep(arr, 3, {
        pointers: { i },
        accumulator: sum,
        accumulatorLabel: 'sum',
        secondaryAccumulator: xorAll,
        secondaryLabel: 'xor',
        variables: { i },
      }),
    );
  }
  return steps;
}
