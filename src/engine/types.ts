export type ModuleId =
  | 'loops'
  | 'array'
  | 'string'
  | 'stack'
  | 'queue'
  | 'linkedlist'
  | 'recursion'
  | 'tree'
  | 'graph'
  | 'dp';

export type DataStructure =
  | 'counter'
  | 'outputbuilder'
  | 'digit'
  | 'sequence'
  | 'gcd'
  | 'array'
  | 'stack'
  | 'queue'
  | 'linkedlist'
  | 'tree'
  | 'graph'
  | 'callstack'
  | 'dptable';

export type MovementType =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
  | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P'
  | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X';

export type ArrayCellState = 'default' | 'highlight' | 'match' | 'skip' | 'swap' | 'found';

export interface ArraySnapshot {
  kind: 'array';
  values: number[];
  cellStates?: ArrayCellState[];
  readOnly?: boolean;
  pointers?: Record<string, number>;
  swapped?: [number, number];
  found?: boolean;
  foundIndex?: number;
  positions?: number[];
  accumulator?: number;
  accumulatorOp?: 'sum' | 'product' | 'count';
  accumulatorLabel?: string;
  secondaryAccumulator?: number;
  secondaryLabel?: string;
  tertiaryAccumulator?: number;
  tertiaryLabel?: string;
  runningMax?: number;
  runningMin?: number;
  maxIndex?: number;
  minIndex?: number;
  comparison?: string;
  auxMap?: Record<string, number>;
  auxSet?: number[];
  duplicateFound?: boolean;
  phase?: string;
}

export interface CounterSnapshot {
  kind: 'counter';
  counter: number;
  output: (number | string)[];
  skipped?: number[];
  equation?: string;
  accumulator?: number;
  accumulatorOp?: 'sum' | 'product' | 'count';
  accumulatorLabel?: string;
  secondaryAccumulator?: number;
  secondaryLabel?: string;
}

export interface DigitSnapshot {
  kind: 'digit';
  remainingDigits: number[];
  extractedDigits: number[];
  currentDigit?: number;
  rebuiltDigits?: number[];
  rejectedDigits?: number[];
  phase?: 'extract' | 'compare' | 'rebuild';
}

export interface GcdSnapshot {
  kind: 'gcd';
  a: number;
  b: number;
  remainder?: number;
  done?: boolean;
  formula?: string;
}

export interface SequenceSnapshot {
  kind: 'sequence';
  terms: number[];
  highlightIndices?: number[];
  fadingIndices?: number[];
  accumulator?: number;
  increment?: number;
  multiplier?: number;
  signFlip?: boolean;
}

export interface OutputBuilderSnapshot {
  kind: 'outputbuilder';
  lines: string[];
  currentLine: string;
  row: number;
  col: number;
  maxRow?: number;
  maxCol?: number;
  pendingChar?: string;
  isNewline?: boolean;
  leadingSpaces?: number;
}

export type StepSnapshot =
  | CounterSnapshot
  | DigitSnapshot
  | GcdSnapshot
  | SequenceSnapshot
  | OutputBuilderSnapshot
  | ArraySnapshot
  | Record<string, unknown>;

export interface Step {
  activeLine: number;
  activeInnerLine?: number;
  message?: string;
  variables: Record<string, string | number | boolean>;
  snapshot: StepSnapshot;
}

export type BuildStepsFn<TInput = unknown> = (input: TInput) => Step[];

export interface ProblemConfig<TInput = unknown> {
  id: string;
  title: string;
  level?: number;
  programNumber?: number;
  module: ModuleId;
  dataStructure: DataStructure;
  movementType: MovementType;
  codeLines: string[];
  outerLoopLine?: number;
  innerLoopLine?: number;
  defaultInput: TInput;
  buildSteps: BuildStepsFn<TInput>;
}

export interface ModuleInfo {
  id: ModuleId;
  title: string;
  description: string;
  order: number;
  problems: ProblemConfig<unknown>[];
}
