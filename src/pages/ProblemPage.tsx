import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStepEngine } from '../engine';
import { CodePanel } from '../components/shared/CodePanel';
import { VariableWatchPanel } from '../components/shared/VariableWatchPanel';
import { PlaybackControls } from '../components/shared/PlaybackControls';
import { InputPanel } from '../components/shared/InputPanel';
import { ApproachPanel } from '../components/shared/ApproachPanel';
import { DebuggerBar } from '../components/shared/DebuggerBar';
import { RendererSwitch } from '../components/RendererSwitch';
import { getProblemById } from '../data/modulesIndex';
import { inputHintFor, MODULE_LABELS, parseInput, serializeInput } from '../utils/inputFormat';
import './ProblemPage.css';

export function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const config = useMemo(() => (problemId ? getProblemById(problemId) : undefined), [problemId]);

  const [inputRaw, setInputRaw] = useState('');
  const [speedMs, setSpeedMs] = useState(800);
  const initialSteps = useMemo(
    () => (config ? config.buildSteps(config.defaultInput) : []),
    [config],
  );
  const engine = useStepEngine(initialSteps, speedMs);

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
    engine.reset();
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

      <DebuggerBar
        stepIndex={engine.stepIndex}
        totalSteps={engine.steps.length}
        activeLine={step?.activeLine ?? 1}
        message={step?.message}
        isPlaying={engine.isPlaying}
      />

      <div className="problem-layout">
        <aside className="problem-sidebar">
          {config.approach && <ApproachPanel approach={config.approach} />}
          <InputPanel
            label={inputHint.label}
            value={inputRaw}
            onChange={setInputRaw}
            onRun={runWithInput}
            hint={inputHint.hint}
          />
          <VariableWatchPanel
            variables={step?.variables ?? {}}
            message={undefined}
          />
          <PlaybackControls
            isPlaying={engine.isPlaying}
            isAtStart={engine.isAtStart}
            isAtEnd={engine.isAtEnd}
            stepIndex={engine.stepIndex}
            totalSteps={engine.steps.length}
            speedMs={speedMs}
            onPlay={engine.play}
            onPause={engine.pause}
            onReset={engine.reset}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onScrub={engine.goTo}
            onSpeedChange={setSpeedMs}
          />
        </aside>

        <main className="problem-main">
          <div className="visual-panel panel">
            <div className="panel-header">Simulation</div>
            {step ? (
              <RendererSwitch
                dataStructure={config.dataStructure}
                snapshot={step.snapshot}
              />
            ) : (
              <p className="empty-state">Enter input and click Run to start simulation</p>
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
