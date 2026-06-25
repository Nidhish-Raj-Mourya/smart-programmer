import { useCallback, useEffect, useRef, useState } from 'react';
import type { Step } from './types';

const DEFAULT_INTERVAL_MS = 800;

export interface StepEngineState {
  steps: Step[];
  stepIndex: number;
  currentStep: Step | null;
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goTo: (index: number) => void;
  setSteps: (steps: Step[]) => void;
}

export function useStepEngine(initialSteps: Step[], intervalMs = DEFAULT_INTERVAL_MS): StepEngineState {
  const [steps, setStepsState] = useState<Step[]>(initialSteps);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clamp = useCallback(
    (index: number) => Math.max(0, Math.min(index, Math.max(0, steps.length - 1))),
    [steps.length],
  );

  const setSteps = useCallback((next: Step[]) => {
    setStepsState(next);
    setStepIndex(0);
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);
  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (stepIndex >= steps.length - 1) setStepIndex(0);
    setIsPlaying(true);
  }, [stepIndex, steps.length]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((i) => clamp(i + 1));
  }, [clamp]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((i) => clamp(i - 1));
  }, [clamp]);

  const goTo = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setStepIndex(clamp(index));
    },
    [clamp],
  );

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    intervalRef.current = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [isPlaying, steps.length, intervalMs]);

  const currentStep = steps.length > 0 ? steps[stepIndex] ?? null : null;

  return {
    steps,
    stepIndex,
    currentStep,
    isPlaying,
    isAtStart: stepIndex === 0,
    isAtEnd: steps.length === 0 || stepIndex >= steps.length - 1,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    goTo,
    setSteps,
  };
}

export function makeStep(
  partial: Omit<Step, 'variables'> & { variables?: Step['variables'] },
): Step {
  const { variables, ...rest } = partial;
  return { ...rest, variables: variables ?? {} };
}
