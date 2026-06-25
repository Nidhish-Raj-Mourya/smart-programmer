import { makeStep, type ProblemConfig, type Step } from '../../../engine';

const CODE_PRINT_1_TO_N = [
  'n = int(input())',
  'for i in range(1, n + 1):',
  '    print(i)',
];

export const print1ToN: ProblemConfig<{ n: number }> = {
  id: 'loops-print-1-to-n',
  title: 'Print 1 to N',
  level: 1,
  programNumber: 1,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_PRINT_1_TO_N,
  defaultInput: { n: 10 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    const output: number[] = [];
    for (let i = 1; i <= n; i++) {
      output.push(i);
      steps.push(
        makeStep({
          activeLine: 2,
          message: `i = ${i}, print ${i}`,
          variables: { i, n },
          snapshot: { kind: 'counter', counter: i, output: [...output] },
        }),
      );
    }
    return steps;
  },
};

const CODE_PRINT_N_TO_1 = [
  'n = int(input())',
  'for i in range(n, 0, -1):',
  '    print(i)',
];

export const printNTo1: ProblemConfig<{ n: number }> = {
  id: 'loops-print-n-to-1',
  title: 'Print N to 1 (reverse)',
  level: 1,
  programNumber: 2,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_PRINT_N_TO_1,
  defaultInput: { n: 10 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    const output: number[] = [];
    for (let i = n; i >= 1; i--) {
      output.push(i);
      steps.push(
        makeStep({
          activeLine: 2,
          message: `i = ${i}, counting down`,
          variables: { i, n },
          snapshot: { kind: 'counter', counter: i, output: [...output] },
        }),
      );
    }
    return steps;
  },
};

const CODE_FIRST_N_EVENS = [
  'n = int(input())',
  'count = 0',
  'i = 2',
  'while count < n:',
  '    print(i)',
  '    count += 1',
  '    i += 2',
];

export const firstNEvens: ProblemConfig<{ n: number }> = {
  id: 'loops-first-n-evens',
  title: 'First N even numbers',
  level: 1,
  programNumber: 3,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_FIRST_N_EVENS,
  defaultInput: { n: 5 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    const output: number[] = [];
    let i = 2;
    for (let count = 0; count < n; count++) {
      output.push(i);
      steps.push(
        makeStep({
          activeLine: 5,
          message: `Print even ${i}, then i += 2`,
          variables: { i, count: count + 1, n, step: '+2' },
          snapshot: { kind: 'counter', counter: i, output: [...output], equation: `${i} (+2 next)` },
        }),
      );
      i += 2;
    }
    return steps;
  },
};

const CODE_DIVISIBLE_BY_5 = [
  'n = int(input())',
  'for i in range(1, n + 1):',
  '    if i % 5 == 0:',
  '        print(i)',
];

export const divisibleBy5: ProblemConfig<{ n: number }> = {
  id: 'loops-divisible-by-5',
  title: 'Divisible by 5 (1 to N)',
  level: 1,
  programNumber: 5,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_DIVISIBLE_BY_5,
  defaultInput: { n: 20 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    const output: number[] = [];
    const skipped: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (i % 5 === 0) {
        output.push(i);
        steps.push(
          makeStep({
            activeLine: 4,
            message: `${i} % 5 == 0 → print`,
            variables: { i, n },
            snapshot: { kind: 'counter', counter: i, output: [...output], skipped: [...skipped] },
          }),
        );
      } else {
        skipped.push(i);
        steps.push(
          makeStep({
            activeLine: 3,
            message: `${i} % 5 != 0 → skip`,
            variables: { i, n },
            snapshot: { kind: 'counter', counter: i, output: [...output], skipped: [...skipped] },
          }),
        );
      }
    }
    return steps;
  },
};

const CODE_MULT_TABLE = [
  'n = int(input())',
  'for i in range(1, 11):',
  '    result = n * i',
  '    print(n, "×", i, "=", result)',
];

export const multiplicationTable: ProblemConfig<{ n: number }> = {
  id: 'loops-multiplication-table',
  title: 'Multiplication table (1-10)',
  level: 1,
  programNumber: 6,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_MULT_TABLE,
  defaultInput: { n: 7 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    const output: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const result = n * i;
      output.push(`${n}×${i}=${result}`);
      steps.push(
        makeStep({
          activeLine: 4,
          message: `${n} × ${i} = ${result}`,
          variables: { i, n, result },
          snapshot: {
            kind: 'counter',
            counter: i,
            output: [...output],
            equation: `${n} × ${i} = ${result}`,
          },
        }),
      );
    }
    return steps;
  },
};

export const level1Problems = [print1ToN, printNTo1, firstNEvens, divisibleBy5, multiplicationTable];
