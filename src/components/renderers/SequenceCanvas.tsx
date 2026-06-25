import type { SequenceSnapshot } from '../../engine/types';
import './renderers.css';

interface SequenceCanvasProps {
  snapshot: SequenceSnapshot;
}

export function SequenceCanvas({ snapshot }: SequenceCanvasProps) {
  const { terms, highlightIndices = [], fadingIndices = [], accumulator, signFlip } = snapshot;

  return (
    <div className="renderer sequence-canvas">
      <div className="section-label">Sequence</div>
      <div className="sequence-row">
        {terms.map((term, i) => {
          const isHighlight = highlightIndices.includes(i);
          const isFading = fadingIndices.includes(i);
          return (
            <div key={i} className="sequence-term-wrap">
              {isHighlight && highlightIndices.length > 1 && (
                <div className="sequence-deps">
                  {highlightIndices
                    .filter((idx) => idx !== i)
                    .map((idx) => (
                      <span key={idx} className="dep-arrow">
                        ← term[{idx}]
                      </span>
                    ))}
                </div>
              )}
              <span
                className={`sequence-term${isHighlight ? ' highlight' : ''}${isFading ? ' fading' : ''}`}
              >
                {term}
              </span>
            </div>
          );
        })}
      </div>
      {accumulator !== undefined && (
        <div className="sequence-acc">
          Running sum: <strong>{accumulator}</strong>
        </div>
      )}
      {signFlip !== undefined && (
        <div className="sequence-sign">Sign: {signFlip ? '−' : '+'}</div>
      )}
    </div>
  );
}
