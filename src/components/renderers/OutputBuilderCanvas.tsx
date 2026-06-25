import type { OutputBuilderSnapshot } from '../../engine/types';
import './renderers.css';

interface OutputBuilderCanvasProps {
  snapshot: OutputBuilderSnapshot;
}

export function OutputBuilderCanvas({ snapshot }: OutputBuilderCanvasProps) {
  const { lines, currentLine, row, col, pendingChar, isNewline, leadingSpaces } = snapshot;

  const displayLines = [...lines];
  if (currentLine || pendingChar) {
    displayLines.push(currentLine + (pendingChar ?? ''));
  }

  return (
    <div className="renderer output-builder-canvas">
      <div className="console-header">
        <span>Console Output</span>
        <span className="loop-tracker">
          row={row}, col={col}
          {leadingSpaces !== undefined && leadingSpaces > 0 && ` · spaces=${leadingSpaces}`}
        </span>
      </div>
      <div className="console-body">
        {displayLines.length === 0 ? (
          <span className="console-cursor">▌</span>
        ) : (
          displayLines.map((line, i) => (
            <div key={i} className="console-line">
              {line}
              {i === displayLines.length - 1 && !isNewline && (
                <span className="console-cursor">▌</span>
              )}
            </div>
          ))
        )}
        {isNewline && <div className="console-line newline-flash">↵ newline</div>}
      </div>
    </div>
  );
}
