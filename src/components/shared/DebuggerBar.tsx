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
      <p className="debugger-message">{message ?? 'Press Run or Step to begin execution'}</p>
    </div>
  );
}
