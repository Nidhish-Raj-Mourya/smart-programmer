import { buildExplanation } from '../explain/explanationEngine';
import { getCodeSolutionForId } from '../explain/codeSolutionCatalog';
import type { ProblemConfig } from '../engine/types';

/** Har problem ko algorithm guide + Python/Java solutions deta hai */
export function enrichProblem(p: ProblemConfig): ProblemConfig {
  const code = getCodeSolutionForId(p.id);

  return {
    ...p,
    approach: buildExplanation(p),
    codeLines: code?.python ?? p.codeLines,
    javaCodeLines: code?.java,
    javaLineOffset: code?.javaLineOffset ?? 5,
  };
}
