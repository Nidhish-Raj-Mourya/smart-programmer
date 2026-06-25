import { makeStep, type ArraySnapshot, type Step } from '../../../engine';

export type ArrayInput = { arr: number[] };

export function arrSnap(values: number[], extra: Partial<ArraySnapshot> = {}): ArraySnapshot {
  return { kind: 'array', values: [...values], ...extra };
}

export function highlightAt(length: number, index: number): ArraySnapshot['cellStates'] {
  return Array.from({ length }, (_, i) => (i === index ? 'highlight' : 'default'));
}

export function arrayStep(
  values: number[],
  activeLine: number,
  extra: Partial<ArraySnapshot> & { message?: string; variables?: Step['variables'] },
): Step {
  const { message, variables, ...snap } = extra;
  return makeStep({
    activeLine,
    message,
    variables: variables ?? {},
    snapshot: arrSnap(values, snap),
  });
}

export const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

export const FOR_EACH = [
  'arr = list(map(int, input().split()))',
  'for i in range(len(arr)):',
  '    # process arr[i]',
];

export const FOR_EACH_VAL = [
  'arr = list(map(int, input().split()))',
  'for x in arr:',
  '    # process x',
];
