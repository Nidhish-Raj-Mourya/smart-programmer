import type { DigitSnapshot } from '../../engine/types';
import './renderers.css';

interface DigitCanvasProps {
  snapshot: DigitSnapshot;
}

function DigitBox({ digit, variant }: { digit: number; variant?: 'extracted' | 'rejected' | 'rebuilt' }) {
  return <span className={`digit-box${variant ? ` digit-box--${variant}` : ''}`}>{digit}</span>;
}

export function DigitCanvas({ snapshot }: DigitCanvasProps) {
  const {
    remainingDigits,
    extractedDigits,
    currentDigit,
    rebuiltDigits = [],
    rejectedDigits = [],
    phase = 'extract',
  } = snapshot;

  return (
    <div className="renderer digit-canvas">
      <div className="digit-row">
        <div className="section-label">Number (num)</div>
        <div className="digit-tray">
          {remainingDigits.length === 0 ? (
            <span className="digit-empty">0</span>
          ) : (
            remainingDigits.map((d, i) => (
              <DigitBox
                key={`rem-${i}-${d}`}
                digit={d}
                variant={i === remainingDigits.length - 1 && phase === 'extract' ? undefined : undefined}
              />
            ))
          )}
        </div>
      </div>

      {currentDigit !== undefined && (
        <div className="digit-extract-arrow">↓ digit = num % 10</div>
      )}

      {currentDigit !== undefined && (
        <div className="digit-row highlight">
          <div className="section-label">Extracted digit</div>
          <DigitBox digit={currentDigit} variant="extracted" />
        </div>
      )}

      {extractedDigits.length > 0 && (
        <div className="digit-row">
          <div className="section-label">Extracted tray</div>
          <div className="digit-tray">
            {extractedDigits.map((d, i) => (
              <DigitBox key={`ext-${i}`} digit={d} variant="extracted" />
            ))}
          </div>
        </div>
      )}

      {rebuiltDigits.length > 0 && (
        <div className="digit-row">
          <div className="section-label">Rebuilt number</div>
          <div className="digit-tray">
            {rebuiltDigits.map((d, i) => (
              <DigitBox key={`reb-${i}`} digit={d} variant="rebuilt" />
            ))}
          </div>
        </div>
      )}

      {rejectedDigits.length > 0 && (
        <div className="digit-row">
          <div className="section-label">Rejected</div>
          <div className="digit-tray">
            {rejectedDigits.map((d, i) => (
              <DigitBox key={`rej-${i}`} digit={d} variant="rejected" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
