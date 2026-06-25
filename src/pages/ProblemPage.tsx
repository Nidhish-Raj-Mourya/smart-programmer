import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStepEngine } from '../engine';
import { CodePanel } from '../components/shared/CodePanel';
import { VariableWatchPanel } from '../components/shared/VariableWatchPanel';
import { PlaybackControls } from '../components/shared/PlaybackControls';
import { InputPanel } from '../components/shared/InputPanel';
import { RendererSwitch } from '../components/RendererSwitch';
import { getProblemById } from '../data/modulesIndex';
import { inputHintFor, MODULE_LABELS, parseInput, serializeInput } from '../utils/inputFormat';
import './ProblemPage.css';

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const config = useMemo(() => (problemId ? getProblemById(problemId) : undefined), [problemId]);

  const [inputRaw, setInputRaw] = useState('');
  const initialSteps = useMemo(
    () => (config ? config.buildSteps(config.defaultInput) : []),
    [config],
  );
  const engine = useStepEngine(initialSteps);

  useEffect(() => {
    if (!config) return;
    setInputRaw(serializeInput(config.defaultInput));
    engine.setSteps(config.buildSteps(config.defaultInput));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when problem changes
  }, [config]);

  const runWithInput = useCallback(() => {
    if (!config) return;
    const parsed = parseInput(inputRaw, config.defaultInput);
    engine.setSteps(config.buildSteps(parsed as never));
  }, [config, inputRaw, engine]);

  if (!config) {
    return (
      <div className="problem-page">
        <p>Problem not found.</p>
        <Link to="/">← Back home</Link>
      </div>
    );
  }

  const step = engine.currentStep;
  const inputHint = inputHintFor(config.defaultInput);

  return (
    <div className="problem-page">
      <header className="problem-header">
        <Link to="/" className="back-link">
          ← Smart Programmer
        </Link>
        <div>
          <span className="module-badge">
            {MODULE_LABELS[config.module]} · Level {config.level ?? '—'}
          </span>
          <h1>{config.title}</h1>
          <p className="problem-meta">
            #{config.programNumber ?? '—'} · Type {config.movementType} · {config.dataStructure}
          </p>
        </div>
      </header>

      <div className="problem-layout">
        <aside className="problem-sidebar">
          <InputPanel
            label={inputHint.label}
            value={inputRaw}
            onChange={setInputRaw}
            onRun={runWithInput}
            hint={inputHint.hint}
          />
          <VariableWatchPanel
            variables={step?.variables ?? {}}
            message={step?.message}
          />
          <PlaybackControls
            isPlaying={engine.isPlaying}
            isAtStart={engine.isAtStart}
            isAtEnd={engine.isAtEnd}
            stepIndex={engine.stepIndex}
            totalSteps={engine.steps.length}
            onPlay={engine.play}
            onPause={engine.pause}
            onReset={engine.reset}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onScrub={engine.goTo}
          />
        </aside>

        <main className="problem-main">
          <div className="visual-panel panel">
            <div className="panel-header">Visualization</div>
            {step ? (
              <RendererSwitch
                dataStructure={config.dataStructure}
                snapshot={step.snapshot}
              />
            ) : (
              <p>No steps</p>
            )}
          </div>

          <CodePanel
            codeLines={config.codeLines}
            activeLine={step?.activeLine ?? 1}
            activeInnerLine={step?.activeInnerLine}
            movementType={config.movementType}
            outerLoopLine={config.outerLoopLine}
            innerLoopLine={config.innerLoopLine}
          />
        </main>
      </div>
    </div>
  );
}
