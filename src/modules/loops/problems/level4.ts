import { makeStep, type ProblemConfig, type Step } from '../../../engine';

const CODE_CHECK_PRIME = [
  'n = int(input())',
  'if n < 2:',
  '    print("Not prime")',
  'else:',
  '    is_prime = True',
  '    for d in range(2, int(n**0.5) + 1):',
  '        if n % d == 0:',
  '            is_prime = False',
  '            break',
];

export const checkPrime: ProblemConfig<{ n: number }> = {
  id: 'loops-check-prime',
  title: 'Check prime',
  level: 4,
  programNumber: 38,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_CHECK_PRIME,
  defaultInput: { n: 29 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    if (n < 2) {
      return [
        makeStep({
          activeLine: 2,
          message: 'n < 2 → not prime',
          variables: { n, is_prime: false },
          snapshot: { kind: 'counter', counter: n, output: ['Not prime'] },
        }),
      ];
    }
    let isPrime = true;
    const limit = Math.floor(Math.sqrt(n));
    for (let d = 2; d <= limit; d++) {
      const divides = n % d === 0;
      if (divides) isPrime = false;
      steps.push(
        makeStep({
          activeLine: divides ? 7 : 6,
          message: divides ? `${n} % ${d} == 0 → not prime` : `Test divisor ${d}`,
          variables: { n, d, is_prime: isPrime },
          snapshot: {
            kind: 'counter',
            counter: d,
            output: divides ? ['Not prime'] : [],
            equation: `${n} % ${d} = ${n % d}`,
          },
        }),
      );
      if (divides) break;
    }
    if (isPrime) {
      steps.push(
        makeStep({
          activeLine: 5,
          message: 'No divisor found → prime',
          variables: { n, is_prime: true },
          snapshot: { kind: 'counter', counter: n, output: ['Prime'] },
        }),
      );
    }
    return steps;
  },
};

const CODE_PRINT_FACTORS = [
  'n = int(input())',
  'for i in range(1, n + 1):',
  '    if n % i == 0:',
  '        print(i)',
];

export const printAllFactors: ProblemConfig<{ n: number }> = {
  id: 'loops-print-factors',
  title: 'Print all factors',
  level: 4,
  programNumber: 42,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_PRINT_FACTORS,
  defaultInput: { n: 24 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    const output: number[] = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) {
        output.push(i);
        steps.push(
          makeStep({
            activeLine: 4,
            message: `${n} % ${i} == 0 → factor`,
            variables: { i, n },
            snapshot: { kind: 'counter', counter: i, output: [...output], equation: `${n} % ${i} = 0` },
          }),
        );
      } else {
        steps.push(
          makeStep({
            activeLine: 3,
            message: `${n} % ${i} != 0 → skip`,
            variables: { i, n },
            snapshot: {
              kind: 'counter',
              counter: i,
              output: [...output],
              skipped: [i],
              equation: `${n} % ${i} = ${n % i}`,
            },
          }),
        );
      }
    }
    return steps;
  },
};

export const level4Problems = [checkPrime, printAllFactors];
