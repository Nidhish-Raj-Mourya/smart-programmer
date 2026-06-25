import { makeStep, type ProblemConfig, type Step } from '../../../engine';

const CODE_FIBONACCI = [
  'n = int(input())',
  'a, b = 0, 1',
  'terms = [a, b]',
  'for i in range(2, n):',
  '    next_term = a + b',
  '    terms.append(next_term)',
  '    a, b = b, next_term',
];

export const fibonacci: ProblemConfig<{ n: number }> = {
  id: 'loops-fibonacci',
  title: 'Fibonacci (first N terms)',
  level: 6,
  programNumber: 59,
  module: 'loops',
  dataStructure: 'sequence',
  movementType: 'S',
  codeLines: CODE_FIBONACCI,
  defaultInput: { n: 8 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    if (n <= 0) return steps;
    let a = 0;
    let b = 1;
    const terms: number[] = n >= 1 ? [0] : [];
    if (n >= 2) terms.push(1);

    steps.push(
      makeStep({
        activeLine: 3,
        message: 'Seed terms: 0, 1',
        variables: { a, b, n },
        snapshot: { kind: 'sequence', terms: [...terms] },
      }),
    );

    for (let i = 2; i < n; i++) {
      const next = a + b;
      const len = terms.length;
      steps.push(
        makeStep({
          activeLine: 5,
          message: `next = ${a} + ${b} = ${next}`,
          variables: { a, b, next_term: next, i },
          snapshot: {
            kind: 'sequence',
            terms: [...terms],
            highlightIndices: [len - 2, len - 1],
          },
        }),
      );
      terms.push(next);
      a = b;
      b = next;
      steps.push(
        makeStep({
          activeLine: 6,
          message: `Append ${next}`,
          variables: { a, b, next_term: next },
          snapshot: { kind: 'sequence', terms: [...terms] },
        }),
      );
    }
    return steps;
  },
};

const CODE_TRIBONACCI = [
  'n = int(input())',
  'a, b, c = 0, 0, 1',
  'terms = [a, b, c]',
  'for i in range(3, n):',
  '    next_term = a + b + c',
  '    terms.append(next_term)',
  '    a, b, c = b, c, next_term',
];

export const tribonacci: ProblemConfig<{ n: number }> = {
  id: 'loops-tribonacci',
  title: 'Tribonacci (first N terms)',
  level: 6,
  programNumber: 70,
  module: 'loops',
  dataStructure: 'sequence',
  movementType: 'S',
  codeLines: CODE_TRIBONACCI,
  defaultInput: { n: 8 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    let a = 0;
    let b = 0;
    let c = 1;
    const terms = n >= 3 ? [0, 0, 1] : n === 2 ? [0, 0] : n === 1 ? [0] : [];

    for (let i = 3; i < n; i++) {
      const next = a + b + c;
      const len = terms.length;
      steps.push(
        makeStep({
          activeLine: 5,
          message: `next = ${a} + ${b} + ${c} = ${next}`,
          variables: { a, b, c, next_term: next },
          snapshot: {
            kind: 'sequence',
            terms: [...terms],
            highlightIndices: [len - 3, len - 2, len - 1],
          },
        }),
      );
      terms.push(next);
      a = b;
      b = c;
      c = next;
    }

    if (steps.length === 0 && terms.length > 0) {
      steps.push(
        makeStep({
          activeLine: 3,
          message: 'Initial terms',
          variables: { n },
          snapshot: { kind: 'sequence', terms: [...terms] },
        }),
      );
    }

    return steps;
  },
};

export const level6Problems = [fibonacci, tribonacci];
