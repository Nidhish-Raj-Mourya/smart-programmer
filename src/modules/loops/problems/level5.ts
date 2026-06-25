import { makeStep, type ProblemConfig, type Step } from '../../../engine';

const CODE_GCD = [
  'a = int(input())',
  'b = int(input())',
  'while b != 0:',
  '    a, b = b, a % b',
  'print(a)',
];

export const gcd: ProblemConfig<{ a: number; b: number }> = {
  id: 'loops-gcd',
  title: 'GCD (Euclidean algorithm)',
  level: 5,
  programNumber: 51,
  module: 'loops',
  dataStructure: 'gcd',
  movementType: 'R',
  codeLines: CODE_GCD,
  defaultInput: { a: 48, b: 18 },
  buildSteps: ({ a: startA, b: startB }) => {
    const steps: Step[] = [];
    let a = startA;
    let b = startB;

    steps.push(
      makeStep({
        activeLine: 1,
        message: `Start: a=${a}, b=${b}`,
        variables: { a, b },
        snapshot: { kind: 'gcd', a, b },
      }),
    );

    while (b !== 0) {
      const remainder = a % b;
      steps.push(
        makeStep({
          activeLine: 4,
          message: `${a} % ${b} = ${remainder}`,
          variables: { a, b, remainder },
          snapshot: { kind: 'gcd', a, b, remainder },
        }),
      );
      a = b;
      b = remainder;
    }

    steps.push(
      makeStep({
        activeLine: 5,
        message: `GCD = ${a}`,
        variables: { a, b: 0 },
        snapshot: { kind: 'gcd', a, b: 0, done: true },
      }),
    );

    return steps;
  },
};

const CODE_LCM = [
  'a = int(input())',
  'b = int(input())',
  '# GCD first',
  'x, y = a, b',
  'while y != 0:',
  '    x, y = y, x % y',
  'gcd_val = x',
  'lcm = (a * b) // gcd_val',
  'print(lcm)',
];

export const lcm: ProblemConfig<{ a: number; b: number }> = {
  id: 'loops-lcm',
  title: 'LCM',
  level: 5,
  programNumber: 52,
  module: 'loops',
  dataStructure: 'gcd',
  movementType: 'R',
  codeLines: CODE_LCM,
  defaultInput: { a: 12, b: 18 },
  buildSteps: ({ a: A, b: B }) => {
    const gcdSteps = gcd.buildSteps({ a: A, b: B });
    let x = A;
    let y = B;
    while (y !== 0) {
      [x, y] = [y, x % y];
    }
    const gcdVal = x;
    const lcmVal = Math.floor((A * B) / gcdVal);

    return [
      ...gcdSteps,
      makeStep({
        activeLine: 8,
        message: `LCM = (${A} × ${B}) / ${gcdVal} = ${lcmVal}`,
        variables: { a: A, b: B, gcd_val: gcdVal, lcm: lcmVal },
        snapshot: {
          kind: 'gcd',
          a: gcdVal,
          b: lcmVal,
          done: true,
          formula: `LCM = (${A} × ${B}) / ${gcdVal} = ${lcmVal}`,
        },
      }),
    ];
  },
};

export const level5Problems = [gcd, lcm];
