import { makeStep, type Step } from '../../../engine';

export function numberToDigits(n: number): number[] {
  if (n === 0) return [0];
  const digits: number[] = [];
  let num = Math.abs(n);
  while (num > 0) {
    digits.unshift(num % 10);
    num = Math.floor(num / 10);
  }
  return digits;
}

export function buildDigitExtractionSteps(
  num: number,
  process: (digit: number, extracted: number[], remaining: number) => {
    message?: string;
    variables?: Record<string, string | number | boolean>;
    rebuiltDigits?: number[];
    rejectedDigits?: number[];
    phase?: 'extract' | 'compare' | 'rebuild';
  },
): Step[] {
  const steps: Step[] = [];
  let n = num;
  const extracted: number[] = [];
  const initialDigits = numberToDigits(n);

  steps.push(
    makeStep({
      activeLine: 1,
      message: `Start with num = ${num}`,
      variables: { num: n },
      snapshot: {
        kind: 'digit',
        remainingDigits: [...initialDigits],
        extractedDigits: [],
        phase: 'extract',
      },
    }),
  );

  while (n > 0) {
    const digit = n % 10;
    const remaining = Math.floor(n / 10);
    const remainingDigits = numberToDigits(remaining);

    steps.push(
      makeStep({
        activeLine: 2,
        message: `Extract digit = ${num} % 10 = ${digit}`,
        variables: { num: n, digit },
        snapshot: {
          kind: 'digit',
          remainingDigits: numberToDigits(n),
          extractedDigits: [...extracted],
          currentDigit: digit,
          phase: 'extract',
        },
      }),
    );

    const meta = process(digit, extracted, remaining);
    extracted.push(digit);

    steps.push(
      makeStep({
        activeLine: 4,
        message: meta.message ?? `num = ${n} // 10 = ${remaining}`,
        variables: { num: remaining, digit, ...meta.variables },
        snapshot: {
          kind: 'digit',
          remainingDigits: remaining === 0 ? [] : remainingDigits,
          extractedDigits: [...extracted],
          rebuiltDigits: meta.rebuiltDigits,
          rejectedDigits: meta.rejectedDigits,
          phase: meta.phase ?? 'extract',
        },
      }),
    );

    n = remaining;
  }

  return steps;
}
