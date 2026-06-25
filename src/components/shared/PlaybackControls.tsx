import './shared.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  stepIndex: number;
  totalSteps: number;
  speedMs: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onScrub: (index: number) => void;
  onSpeedChange: (ms: number) => void;
}

export function PlaybackControls({
  isPlaying,
  isAtStart,
  isAtEnd,
  stepIndex,
  totalSteps,
  speedMs,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onScrub,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="playback-controls panel">
      <div className="panel-header">Program control</div>
      <div className="playback-buttons">
        <button type="button" onClick={onReset} disabled={isAtStart} title="Reset">
          ⏮
        </button>
        <button type="button" onClick={onStepBackward} disabled={isAtStart} title="Step back">
          ◀
        </button>
        {isPlaying ? (
          <button type="button" onClick={onPause} title="Pause">
            ⏸
          </button>
        ) : (
          <button type="button" onClick={onPlay} disabled={totalSteps === 0} title="Play">
            ▶
          </button>
        )}
        <button type="button" onClick={onStepForward} disabled={isAtEnd || totalSteps === 0} title="Step forward">
          ▶|
        </button>
      </div>
      <div className="scrubber-row">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={stepIndex}
          onChange={(e) => onScrub(Number(e.target.value))}
          disabled={totalSteps === 0}
          className="scrubber"
        />
        <span className="step-counter">
          {totalSteps === 0 ? '0 / 0' : `${stepIndex + 1} / ${totalSteps}`}
        </span>
      </div>
      <label className="speed-control">
        Speed
        <select
          value={speedMs}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        >
          <option value={1500}>Slow</option>
          <option value={800}>Normal</option>
          <option value={400}>Fast</option>
          <option value={150}>Very fast</option>
        </select>
      </label>
    </div>
  );
}
