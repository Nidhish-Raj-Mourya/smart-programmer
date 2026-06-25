import type { ModuleInfo, ProblemConfig } from '../engine/types';
import { loopProblems } from '../modules/loops/problems';
import { arrayProblems } from '../modules/array/problems';

export const modules: ModuleInfo[] = [
  {
    id: 'loops',
    title: 'Loop Foundations',
    description: '109 programs — counters, digits, GCD, sequences, pattern printing (Module 0).',
    order: 0,
    problems: loopProblems as ProblemConfig[],
  },
  {
    id: 'array',
    title: 'Array Mastery',
    description: '125 programs — single pass, hashing, two-pointer, sliding window, binary search (Module 1). Phase 1: Levels 1–2 live.',
    order: 1,
    problems: arrayProblems as ProblemConfig[],
  },
  {
    id: 'string',
    title: 'String',
    description: 'Reuses ArrayCanvas with characters.',
    order: 2,
    problems: [],
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'LIFO visualizations — Type J.',
    order: 3,
    problems: [],
  },
  {
    id: 'queue',
    title: 'Queue',
    description: 'FIFO visualizations — Type K.',
    order: 4,
    problems: [],
  },
  {
    id: 'recursion',
    title: 'Recursion & Backtracking',
    description: 'Call stack visualizations — Type I.',
    order: 5,
    problems: [],
  },
  {
    id: 'linkedlist',
    title: 'Linked List',
    description: 'Pointer rewiring — Type L.',
    order: 6,
    problems: [],
  },
  {
    id: 'tree',
    title: 'Tree',
    description: 'Traversals — Type M.',
    order: 7,
    problems: [],
  },
  {
    id: 'graph',
    title: 'Graph',
    description: 'BFS/DFS — Types N & O.',
    order: 8,
    problems: [],
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'Table fill from dependencies — Type P.',
    order: 9,
    problems: [],
  },
];

const allProblems: ProblemConfig[] = modules.flatMap((m) => m.problems);

export function getProblemById(id: string): ProblemConfig | undefined {
  return allProblems.find((p) => p.id === id);
}
