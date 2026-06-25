import type { ProblemConfig } from '../../../engine';
import { buildDigitExtractionSteps, numberToDigits } from '../helpers/digitHelpers';

const CODE_COUNT_DIGITS = [
  'num = int(input())',
  'count = 0',
  'while num > 0:',
  '    digit = num % 10',
  '    count += 1',
  '    num = num // 10',
];

export const countDigits: ProblemConfig<{ num: number }> = {
  id: 'loops-count-digits',
  title: 'Count digits',
  level: 3,
  programNumber: 23,
  module: 'loops',
  dataStructure: 'digit',
  movementType: 'Q',
  codeLines: CODE_COUNT_DIGITS,
  defaultInput: { num: 12345 },
  buildSteps: ({ num }) => {
    let count = 0;
    return buildDigitExtractionSteps(num, (digit) => {
      count += 1;
      return { variables: { count, digit }, message: `count = ${count}` };
    });
  },
};

const CODE_SUM_DIGITS = [
  'num = int(input())',
  'total = 0',
  'while num > 0:',
  '    digit = num % 10',
  '    total += digit',
  '    num = num // 10',
];

export const sumOfDigits: ProblemConfig<{ num: number }> = {
  id: 'loops-sum-digits',
  title: 'Sum of digits',
  level: 3,
  programNumber: 24,
  module: 'loops',
  dataStructure: 'digit',
  movementType: 'Q',
  codeLines: CODE_SUM_DIGITS,
  defaultInput: { num: 1234 },
  buildSteps: ({ num }) => {
    let total = 0;
    return buildDigitExtractionSteps(num, (digit) => {
      total += digit;
      return { variables: { total, digit }, message: `total += ${digit} → ${total}` };
    });
  },
};

const CODE_REVERSE_NUMBER = [
  'num = int(input())',
  'rev = 0',
  'while num > 0:',
  '    digit = num % 10',
  '    rev = rev * 10 + digit',
  '    num = num // 10',
];

export const reverseNumber: ProblemConfig<{ num: number }> = {
  id: 'loops-reverse-number',
  title: 'Reverse a number',
  level: 3,
  programNumber: 26,
  module: 'loops',
  dataStructure: 'digit',
  movementType: 'Q',
  codeLines: CODE_REVERSE_NUMBER,
  defaultInput: { num: 1234 },
  buildSteps: ({ num }) => {
    let rev = 0;
    return buildDigitExtractionSteps(num, (digit, _ext, remaining) => {
      rev = rev * 10 + digit;
      return {
        variables: { rev, digit, num: remaining },
        rebuiltDigits: numberToDigits(rev),
        phase: 'rebuild' as const,
        message: `rev = ${rev}`,
      };
    });
  },
};

export const level3Problems = [countDigits, sumOfDigits, reverseNumber];
