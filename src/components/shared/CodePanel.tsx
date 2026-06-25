import { useState } from 'react';
import type { MovementType } from '../../engine/types';
import './shared.css';

type CodeLanguage = 'python' | 'java';

interface CodePanelProps {
  codeLines: string[];
  javaCodeLines?: string[];
  javaLineOffset?: number;
  activeLine: number;
  activeInnerLine?: number;
  movementType: MovementType;
  outerLoopLine?: number;
  innerLoopLine?: number;
}

function mapLine(line: number, lang: CodeLanguage, offset: number): number {
  return lang === 'java' ? line + offset : line;
}

export function CodePanel({
  codeLines,
  javaCodeLines,
  javaLineOffset = 5,
  activeLine,
  activeInnerLine,
  movementType,
  outerLoopLine,
  innerLoopLine,
}: CodePanelProps) {
  const [lang, setLang] = useState<CodeLanguage>('python');
  const hasJava = Boolean(javaCodeLines?.length);
  const displayLines = lang === 'java' && javaCodeLines ? javaCodeLines : codeLines;
  const isDualHighlight = movementType === 'T';

  const hl = mapLine(activeLine, lang, javaLineOffset);
  const hlInner = activeInnerLine ? mapLine(activeInnerLine, lang, javaLineOffset) : undefined;
  const outerLine = outerLoopLine ? mapLine(outerLoopLine, lang, javaLineOffset) : undefined;
  const innerLine = innerLoopLine ? mapLine(innerLoopLine, lang, javaLineOffset) : undefined;

  return (
    <div className="panel code-panel">
      <div className="code-panel-toolbar">
        <span className="panel-header code-panel-title">Code · debugger sync</span>
        {hasJava && (
          <div className="code-lang-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={lang === 'python'}
              className={`code-lang-tab ${lang === 'python' ? 'code-lang-tab--active' : ''}`}
              onClick={() => setLang('python')}
            >
              Python
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={lang === 'java'}
              className={`code-lang-tab ${lang === 'java' ? 'code-lang-tab--active' : ''}`}
              onClick={() => setLang('java')}
            >
              Java
            </button>
          </div>
        )}
      </div>
      <pre className="code-block">
        {displayLines.map((line, i) => {
          const lineNum = i + 1;
          const isOuter = isDualHighlight && lineNum === outerLine;
          const isInner = isDualHighlight && lineNum === innerLine;
          const isActive =
            !isDualHighlight
              ? lineNum === hl
              : lineNum === hl || lineNum === hlInner;

          let className = 'code-line';
          if (isDualHighlight && isOuter) className += ' code-line--outer';
          if (isDualHighlight && isInner) className += ' code-line--inner';
          if (isActive && !isDualHighlight) className += ' code-line--active';
          if (isDualHighlight && lineNum === hl && isOuter) className += ' code-line--outer-active';
          if (isDualHighlight && lineNum === hlInner && isInner) className += ' code-line--inner-active';

          return (
            <div key={`${lang}-${lineNum}`} className={className}>
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
