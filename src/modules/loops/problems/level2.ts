import { makeStep, type ProblemConfig, type Step } from '../../../engine';
import { buildDigitExtractionSteps } from '../helpers/digitHelpers';

const CODE_SUM_FIRST_N = [
  'n = int(input())',
  'total = 0',
  'for i in range(1, n + 1):',
  '    total += i',
  'print(total)',
];

export const sumFirstN: ProblemConfig<{ n: number }> = {
  id: 'loops-sum-first-n',
  title: 'Sum of first N naturals',
  level: 2,
  programNumber: 10,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_SUM_FIRST_N,
  defaultInput: { n: 10 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    let total = 0;
    for (let i = 1; i <= n; i++) {
      total += i;
      steps.push(
        makeStep({
          activeLine: 4,
          message: `total += ${i} → ${total}`,
          variables: { i, total, n },
          snapshot: {
            kind: 'counter',
            counter: i,
            output: [],
            accumulator: total,
            accumulatorOp: 'sum',
            accumulatorLabel: 'total',
          },
        }),
      );
    }
    return steps;
  },
};

const CODE_FACTORIAL = [
  'n = int(input())',
  'fact = 1',
  'for i in range(1, n + 1):',
  '    fact *= i',
  'print(fact)',
];

export const factorial: ProblemConfig<{ n: number }> = {
  id: 'loops-factorial',
  title: 'Factorial (N!)',
  level: 2,
  programNumber: 16,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_FACTORIAL,
  defaultInput: { n: 6 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    let fact = 1;
    for (let i = 1; i <= n; i++) {
      fact *= i;
      steps.push(
        makeStep({
          activeLine: 4,
          message: `fact *= ${i} → ${fact}`,
          variables: { i, fact, n },
          snapshot: {
            kind: 'counter',
            counter: i,
            output: [],
            accumulator: fact,
            accumulatorOp: 'product',
            accumulatorLabel: 'fact',
          },
        }),
      );
    }
    return steps;
  },
};

const CODE_SUM_EVEN_ODD = [
  'n = int(input())',
  'even_sum = 0',
  'odd_sum = 0',
  'for i in range(1, n + 1):',
  '    if i % 2 == 0:',
  '        even_sum += i',
  '    else:',
  '        odd_sum += i',
];

export const sumEvenOddSeparately: ProblemConfig<{ n: number }> = {
  id: 'loops-sum-even-odd',
  title: 'Sum even + odd separately',
  level: 2,
  programNumber: 20,
  module: 'loops',
  dataStructure: 'counter',
  movementType: 'A',
  codeLines: CODE_SUM_EVEN_ODD,
  defaultInput: { n: 10 },
  buildSteps: ({ n }) => {
    const steps: Step[] = [];
    let evenSum = 0;
    let oddSum = 0;
    for (let i = 1; i <= n; i++) {
      if (i % 2 === 0) evenSum += i;
      else oddSum += i;
      steps.push(
        makeStep({
          activeLine: i % 2 === 0 ? 6 : 8,
          message: i % 2 === 0 ? `Even: even_sum += ${i}` : `Odd: odd_sum += ${i}`,
          variables: { i, even_sum: evenSum, odd_sum: oddSum, n },
          snapshot: {
            kind: 'counter',
            counter: i,
            output: [],
            accumulator: evenSum,
            accumulatorLabel: 'even_sum',
            secondaryAccumulator: oddSum,
            secondaryLabel: 'odd_sum',
          },
        }),
      );
    }
    return steps;
  },
};

const CODE_LARGEST_DIGIT = [
  'num = int(input())',
  'max_digit = 0',
  'while num > 0:',
  '    digit = num % 10',
  '    if digit > max_digit:',
  '        max_digit = digit',
  '    num = num // 10',
];

export const largestDigit: ProblemConfig<{ num: number }> = {
  id: 'loops-largest-digit',
  title: 'Largest digit in number',
  level: 2,
  programNumber: 21,
  module: 'loops',
  dataStructure: 'digit',
  movementType: 'Q',
  codeLines: CODE_LARGEST_DIGIT,
  defaultInput: { num: 45892 },
  buildSteps: ({ num }) => {
    let maxDigit = 0;
    return buildDigitExtractionSteps(num, (digit) => {
      const isNewMax = digit > maxDigit;
      if (isNewMax) maxDigit = digit;
      return {
        variables: { max_digit: maxDigit, digit },
        message: isNewMax ? `New max: ${maxDigit}` : `${digit} ≤ max=${maxDigit}`,
      };
    });
  },
};

export const level2Problems = [sumFirstN, factorial, sumEvenOddSeparately, largestDigit];
