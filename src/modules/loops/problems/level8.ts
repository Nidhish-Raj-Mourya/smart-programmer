import type { ProblemConfig } from '../../../engine';
import { buildDiamondSteps, buildNestedLoopSteps } from '../helpers/outputBuilder';

const STAR_CODE = [
  'n = int(input())',
  'for row in range(1, n + 1):',
  '    for col in range(1, row + 1):',
  '        print("*", end=" ")',
  '    print()',
];

const OUTER = 2;
const INNER = 3;
const PRINT = 4;

export const rightTriangleStars: ProblemConfig<{ n: number }> = {
  id: 'loops-right-triangle-stars',
  title: 'Right triangle stars',
  level: 8,
  programNumber: 89,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: STAR_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 5 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: STAR_CODE,
      outerLoopLine: OUTER,
      innerLoopLine: INNER,
      printLine: PRINT,
      getCell: () => '*',
    }),
};

export const centeredPyramidStars: ProblemConfig<{ n: number }> = {
  id: 'loops-centered-pyramid-stars',
  title: 'Centered pyramid stars',
  level: 8,
  programNumber: 91,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: STAR_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 4 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: STAR_CODE,
      outerLoopLine: OUTER,
      innerLoopLine: INNER,
      printLine: PRINT,
      getLeadingSpaces: (row) => n - row,
      getCell: () => '*',
    }),
};

export const hollowSquareStars: ProblemConfig<{ n: number }> = {
  id: 'loops-hollow-square-stars',
  title: 'Hollow square stars',
  level: 8,
  programNumber: 94,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: STAR_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 5 },
  buildSteps: ({ n }) =>
    buildNestedLoopSteps({
      n,
      codeLines: STAR_CODE,
      outerLoopLine: OUTER,
      innerLoopLine: INNER,
      printLine: PRINT,
      getMaxCol: () => n,
      getCell: (row, col, maxRow) =>
        col === 1 || col === maxRow || row === 1 || row === maxRow ? '*' : null,
    }),
};

export const diamondStars: ProblemConfig<{ n: number }> = {
  id: 'loops-diamond-stars',
  title: 'Diamond stars',
  level: 8,
  programNumber: 93,
  module: 'loops',
  dataStructure: 'outputbuilder',
  movementType: 'T',
  codeLines: STAR_CODE,
  outerLoopLine: OUTER,
  innerLoopLine: INNER,
  defaultInput: { n: 3 },
  buildSteps: ({ n }) =>
    buildDiamondSteps(n, STAR_CODE, OUTER, INNER, PRINT, () => '*'),
};

export const level8Problems = [
  rightTriangleStars,
  centeredPyramidStars,
  hollowSquareStars,
  diamondStars,
];
