import type { ProblemConfig } from '../../../engine';
import { buildDiamondSteps, buildNestedLoopSteps } from '../helpers/outputBuilder';

const PATTERN_CODE = [
  'n = int(input())',
  'for row in range(1, n + 1):',
  '    for col in range(1, row + 1):',
  '        print(value, end=" ")',
  '    print()',
];

const OUTER = 2;
const INNER = 3;
const PRINT = 4;

export const rightTriangleNumbers: ProblemConfig<{ n: number }> = {
  id: 'loops-right-triangle-numbers',
  title: 'Right triangle numbers (1, 1 2, 1 2 3...)',
  level: 7,
  programNumber: 72,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: PATTERN_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 5 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: PATTERN_CODE,
      outerLoopLine: OUTER,
      innerLoopLine: INNER,
      printLine: PRINT,
      getCell: (_row, col) => String(col),
    }),
};

export const invertedTriangleNumbers: ProblemConfig<{ n: number }> = {
  id: 'loops-inverted-triangle-numbers',
  title: 'Inverted right triangle numbers',
  level: 7,
  programNumber: 76,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: [
    'n = int(input())',
    'for row in range(n, 0, -1):',
    '    for col in range(1, row + 1):',
    '        print(col, end=" ")',
    '    print()',
  ],
  outerLoopLine: 2,
  innerLoopLine: 3,
  defaultInput: { n: 5 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: PATTERN_CODE,
      outerLoopLine: 2,
      innerLoopLine: 3,
      printLine: 4,
      outerOrder: 'desc',
      getCell: (_row, col) => String(col),
    }),
};

export const centeredPyramidNumbers: ProblemConfig<{ n: number }> = {
  id: 'loops-centered-pyramid-numbers',
  title: 'Centered number pyramid',
  level: 7,
  programNumber: 77,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: PATTERN_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 4 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: PATTERN_CODE,
      outerLoopLine: OUTER,
      innerLoopLine: INNER,
      printLine: PRINT,
      getLeadingSpaces: (row) => n - row,
      getCell: (_row, col) => String(col),
    }),
};

export const hollowSquareNumbers: ProblemConfig<{ n: number }> = {
  id: 'loops-hollow-square-numbers',
  title: 'Hollow square with numbers',
  level: 7,
  programNumber: 80,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: [
    'n = int(input())',
    'for row in range(1, n + 1):',
    '    for col in range(1, n + 1):',
    '        if col==1 or col==n or row==1 or row==n:',
    '            print(col, end=" ")',
    '        else:',
    '            print(" ", end=" ")',
    '    print()',
  ],
  outerLoopLine: 2,
  innerLoopLine: 3,
  defaultInput: { n: 5 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: PATTERN_CODE,
      outerLoopLine: 2,
      innerLoopLine: 3,
      printLine: 4,
      getMaxCol: () => n,
      getCell: (row, col, maxRow) =>
        col === 1 || col === maxRow || row === 1 || row === maxRow ? String(col) : null,
    }),
};

export const diamondNumbers: ProblemConfig<{ n: number }> = {
  id: 'loops-diamond-numbers',
  title: 'Number diamond',
  level: 7,
  programNumber: 78,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: PATTERN_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 3 },
  buildSteps: ({ n }) =>
    buildDiamondSteps(n, PATTERN_CODE, OUTER, INNER, PRINT, (_row, col) => String(col)),
};

export const level7Problems = [
  rightTriangleNumbers,
  invertedTriangleNumbers,
  centeredPyramidNumbers,
  hollowSquareNumbers,
  diamondNumbers,
];
