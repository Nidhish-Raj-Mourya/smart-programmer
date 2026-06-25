import type { MovementType } from '../../engine/types';
import './shared.css';

interface CodePanelProps {
  codeLines: string[];
  activeLine: number;
  activeInnerLine?: number;
  movementType: MovementType;
  outerLoopLine?: number;
  innerLoopLine?: number;
}

export function CodePanel({
  codeLines,
  activeLine,
  activeInnerLine,
  movementType,
  outerLoopLine,
  innerLoopLine,
}: CodePanelProps) {
  const isDualHighlight = movementType === 'T';

  return (
    <div className="panel code-panel">
      <div className="panel-header">Code</div>
      <pre className="code-block">
        {codeLines.map((line, i) => {
          const lineNum = i + 1;
          const isOuter = isDualHighlight && lineNum === outerLoopLine;
          const isInner = isDualHighlight && lineNum === innerLoopLine;
          const isActive =
            !isDualHighlight
              ? lineNum === activeLine
              : lineNum === activeLine || lineNum === activeInnerLine;

          let className = 'code-line';
          if (isDualHighlight && isOuter) className += ' code-line--outer';
          if (isDualHighlight && isInner) className += ' code-line--inner';
          if (isActive && !isDualHighlight) className += ' code-line--active';
          if (isDualHighlight && lineNum === activeLine && isOuter) className += ' code-line--outer-active';
          if (isDualHighlight && lineNum === activeInnerLine && isInner) className += ' code-line--inner-active';

          return (
            <div key={lineNum} className={className}>
              <span className="line-number">{lineNum}</span>
              <span className="line-text">{line || ' '}</span>
            </div>
          );
        })}
      </pre>
      {isDualHighlight && (
        <div className="code-legend">
          <span className="legend-outer">■ Outer loop (row)</span>
          <span className="legend-inner">■ Inner loop (col)</span>
        </div>
      )}
    </div>
  );
}
