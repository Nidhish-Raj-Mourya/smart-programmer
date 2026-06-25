import { makeStep, type Step } from '../../../engine';

export interface NestedLoopOptions {
  n: number;
  codeLines: string[];
  outerLoopLine: number;
  innerLoopLine: number;
  printLine: number;
  outerOrder?: 'asc' | 'desc';
  getMaxCol?: (row: number, n: number) => number;
  getLeadingSpaces?: (row: number) => number;
  getCell: (row: number, col: number, maxRow: number) => string | null;
}

export function buildNestedLoopSteps(opts: NestedLoopOptions): Step[] {
  const {
    n,
    outerLoopLine,
    innerLoopLine,
    printLine,
    outerOrder = 'asc',
    getMaxCol,
    getLeadingSpaces,
    getCell,
  } = opts;

  const steps: Step[] = [];
  const lines: string[] = [];
  let currentLine = '';
  const maxRow = n;

  const rows =
    outerOrder === 'asc'
      ? Array.from({ length: n }, (_, i) => i + 1)
      : Array.from({ length: n }, (_, i) => n - i);

  for (const row of rows) {
    const spaces = getLeadingSpaces?.(row) ?? 0;
    if (spaces > 0) {
      for (let s = 0; s < spaces; s++) {
        currentLine += ' ';
        steps.push(
          makeStep({
            activeLine: innerLoopLine,
            activeInnerLine: innerLoopLine,
            message: `Leading space (${s + 1}/${spaces})`,
            variables: { row, col: s + 1, spaces },
            snapshot: {
              kind: 'outputbuilder',
              lines: [...lines],
              currentLine,
              row,
              col: s + 1,
              maxRow,
              pendingChar: ' ',
              leadingSpaces: spaces,
            },
          }),
        );
      }
    }

    const maxCol = getMaxCol ? getMaxCol(row, n) : row;
    for (let col = 1; col <= maxCol; col++) {
      const cell = getCell(row, col, maxRow);
      if (cell === null) {
        currentLine += ' ';
        steps.push(
          makeStep({
            activeLine: printLine,
            activeInnerLine: innerLoopLine,
            message: `Skip interior at (${row}, ${col})`,
            variables: { row, col },
            snapshot: {
              kind: 'outputbuilder',
              lines: [...lines],
              currentLine,
              row,
              col,
              maxRow,
              pendingChar: ' ',
            },
          }),
        );
      } else {
        currentLine += cell;
        const withSpace = col < maxCol ? currentLine + ' ' : currentLine;
        steps.push(
          makeStep({
            activeLine: printLine,
            activeInnerLine: innerLoopLine,
            message: `Print "${cell}" at row=${row}, col=${col}`,
            variables: { row, col },
            snapshot: {
              kind: 'outputbuilder',
              lines: [...lines],
              currentLine: withSpace.endsWith(' ') ? withSpace.slice(0, -1) : withSpace,
              row,
              col,
              maxRow,
              pendingChar: cell,
              leadingSpaces: spaces,
            },
          }),
        );
        if (col < maxCol) {
          currentLine += ' ';
          steps.push(
            makeStep({
              activeLine: printLine,
              activeInnerLine: innerLoopLine,
              variables: { row, col },
              snapshot: {
                kind: 'outputbuilder',
                lines: [...lines],
                currentLine,
                row,
                col,
                maxRow,
                pendingChar: ' ',
              },
            }),
          );
        }
      }
    }

    lines.push(currentLine);
    currentLine = '';
    steps.push(
      makeStep({
        activeLine: printLine + 1,
        activeInnerLine: outerLoopLine,
        message: 'Newline — row complete',
        variables: { row, col: maxCol },
        snapshot: {
          kind: 'outputbuilder',
          lines: [...lines],
          currentLine: '',
          row,
          col: maxCol,
          maxRow,
          isNewline: true,
        },
      }),
    );
  }

  return steps;
}

export function buildDiamondSteps(
  n: number,
  codeLines: string[],
  outerLoopLine: number,
  innerLoopLine: number,
  printLine: number,
  getCell: (row: number, col: number, halfHeight: number) => string | null,
): Step[] {
  const upper = buildNestedLoopSteps({
    n,
    codeLines,
    outerLoopLine,
    innerLoopLine,
    printLine,
    outerOrder: 'asc',
    getLeadingSpaces: (row) => n - row,
    getCell: (row, col) => getCell(row, col, n),
  });

  const lower = buildNestedLoopSteps({
    n: n - 1,
    codeLines,
    outerLoopLine,
    innerLoopLine,
    printLine,
    outerOrder: 'desc',
    getLeadingSpaces: (row) => row - 1,
    getCell: (row, col) => getCell(n + (n - row), col, n),
  });

  return [...upper, ...lower];
}
