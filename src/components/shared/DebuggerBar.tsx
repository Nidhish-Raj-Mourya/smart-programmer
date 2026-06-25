import './shared.css';

interface DebuggerBarProps {
  stepIndex: number;
  totalSteps: number;
  activeLine: number;
  message?: string;
  isPlaying: boolean;
}

export function DebuggerBar({ stepIndex, totalSteps, activeLine, message, isPlaying }: DebuggerBarProps) {
  return (
    <div className="debugger-bar panel">
      <div className="debugger-status">
        <span className={`debugger-pill ${isPlaying ? 'running' : 'paused'}`}>
          {isPlaying ? '▶ Running' : '⏸ Paused'}
        </span>
        <span className="debugger-step">
          Step <strong>{totalSteps === 0 ? 0 : stepIndex + 1}</strong> / {totalSteps}
        </span>
        <span className="debugger-line">
          Line <strong>{activeLine}</strong>
        </span>
      </div>
      <p className="debugger-message">
        {message ?? '▶ Run simulation, phir Step/Play — code ki highlighted line ab execute ho rahi hai (Python / Java dono sync).'}
      </p>
    </div>
  );
}
