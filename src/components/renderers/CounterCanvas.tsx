import type { CounterSnapshot } from '../../engine/types';
import './renderers.css';

interface CounterCanvasProps {
  snapshot: CounterSnapshot;
}

export function CounterCanvas({ snapshot }: CounterCanvasProps) {
  const {
    counter,
    output,
    skipped = [],
    equation,
    accumulator,
    accumulatorOp = 'sum',
    accumulatorLabel = 'sum',
    secondaryAccumulator,
    secondaryLabel,
  } = snapshot;

  const opIcon = accumulatorOp === 'product' ? '×' : accumulatorOp === 'count' ? '#' : '+';

  return (
    <div className="renderer counter-canvas">
      <div className="counter-section">
        <div className="section-label">Counter (i)</div>
        <div className="counter-value">{counter}</div>
        {equation && <div className="equation">{equation}</div>}
      </div>

      {(accumulator !== undefined || secondaryAccumulator !== undefined) && (
        <div className="accumulator-row">
          {accumulator !== undefined && (
            <div className="accumulator-box">
              <span className="acc-icon">{opIcon}</span>
              <span className="acc-label">{accumulatorLabel}</span>
              <span className="acc-value">{accumulator}</span>
            </div>
          )}
          {secondaryAccumulator !== undefined && secondaryLabel && (
            <div className="accumulator-box secondary">
              <span className="acc-icon">+</span>
              <span className="acc-label">{secondaryLabel}</span>
              <span className="acc-value">{secondaryAccumulator}</span>
            </div>
          )}
        </div>
      )}

      <div className="output-section">
        <div className="section-label">Output</div>
        <div className="output-stream">
          {output.length === 0 ? (
            <span className="output-empty">—</span>
          ) : (
            output.map((item, i) => (
              <span key={i} className="output-chip">
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {skipped.length > 0 && (
        <div className="skipped-section">
          <div className="section-label">Skipped</div>
          <div className="output-stream">
            {skipped.map((n) => (
              <span key={n} className="output-chip skipped">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
