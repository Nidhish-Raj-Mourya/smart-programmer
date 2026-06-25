import type { ArraySnapshot } from '../../engine/types';
import './renderers.css';

interface ArrayCanvasProps {
  snapshot: ArraySnapshot;
}

function cellClass(state: string | undefined): string {
  switch (state) {
    case 'highlight':
      return ' array-cell--highlight';
    case 'match':
      return ' array-cell--match';
    case 'skip':
      return ' array-cell--skip';
    case 'swap':
      return ' array-cell--swap';
    case 'found':
      return ' array-cell--found';
    default:
      return '';
  }
}

export function ArrayCanvas({ snapshot }: ArrayCanvasProps) {
  const {
    values,
    cellStates = [],
    readOnly,
    pointers = {},
    swapped,
    found,
    foundIndex,
    positions = [],
    accumulator,
    accumulatorOp = 'sum',
    accumulatorLabel,
    secondaryAccumulator,
    secondaryLabel,
    tertiaryAccumulator,
    tertiaryLabel,
    runningMax,
    runningMin,
    maxIndex,
    minIndex,
    comparison,
    auxMap,
    auxSet,
    duplicateFound,
    phase,
  } = snapshot;

  const opIcon = accumulatorOp === 'product' ? '×' : accumulatorOp === 'count' ? '#' : '+';

  return (
    <div className="renderer array-canvas">
      {readOnly && <span className="array-badge array-badge--readonly">Read-only scan</span>}
      {phase && <span className="array-badge array-badge--phase">{phase}</span>}
      {found !== undefined && (
        <span className={`array-badge ${found ? 'array-badge--found' : 'array-badge--miss'}`}>
          {found ? `Found${foundIndex !== undefined ? ` at index ${foundIndex}` : ''}` : 'Not found'}
        </span>
      )}
      {duplicateFound !== undefined && (
        <span className={`array-badge ${duplicateFound ? 'array-badge--found' : ''}`}>
          {duplicateFound ? 'Duplicate detected' : 'No duplicates'}
        </span>
      )}

      <div className="array-row-wrap">
        <div className="array-cells">
          {values.map((val, i) => (
            <div key={i} className="array-cell-group">
              {Object.entries(pointers).map(
                ([name, idx]) =>
                  idx === i && (
                    <span key={name} className="array-pointer">
                      {name} ↓
                    </span>
                  ),
              )}
              <div className={`array-cell${cellClass(cellStates[i])}${swapped && (swapped[0] === i || swapped[1] === i) ? ' array-cell--swap' : ''}`}>
                <span className="array-index">{i}</span>
                <span className="array-value">{val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {comparison && <div className="array-comparison">{comparison}</div>}

      <div className="array-trackers">
        {accumulator !== undefined && accumulatorLabel && (
          <div className="array-tracker">
            <span className="acc-icon">{opIcon}</span>
            {accumulatorLabel}: <strong>{accumulator}</strong>
          </div>
        )}
        {secondaryAccumulator !== undefined && secondaryLabel && (
          <div className="array-tracker secondary">
            {secondaryLabel}: <strong>{secondaryAccumulator}</strong>
          </div>
        )}
        {tertiaryAccumulator !== undefined && tertiaryLabel && (
          <div className="array-tracker tertiary">
            {tertiaryLabel}: <strong>{tertiaryAccumulator}</strong>
          </div>
        )}
        {runningMax !== undefined && (
          <div className="array-tracker">
            max: <strong>{runningMax}</strong>
            {maxIndex !== undefined && ` @ ${maxIndex}`}
          </div>
        )}
        {runningMin !== undefined && (
          <div className="array-tracker">
            min: <strong>{runningMin}</strong>
            {minIndex !== undefined && ` @ ${minIndex}`}
          </div>
        )}
      </div>

      {positions.length > 0 && (
        <div className="array-positions">
          <span className="section-label">Positions</span>
          <div className="output-stream">
            {positions.map((p) => (
              <span key={p} className="output-chip">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {(auxMap || auxSet) && (
        <div className="array-aux">
          <span className="section-label">{auxMap ? 'Frequency map' : 'Seen set'}</span>
          {auxMap && (
            <table className="aux-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(auxMap).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {auxSet && (
            <div className="aux-set">
              {auxSet.length === 0 ? (
                <span className="watch-empty">∅</span>
              ) : (
                auxSet.map((v) => (
                  <span key={v} className="output-chip">
                    {v}
                  </span>
                ))
              )}
              <span className="aux-set-size">size = {auxSet.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
