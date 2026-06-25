import type { GcdSnapshot } from '../../engine/types';
import './renderers.css';

interface GcdCanvasProps {
  snapshot: GcdSnapshot;
}

export function GcdCanvas({ snapshot }: GcdCanvasProps) {
  const { a, b, remainder, done, formula } = snapshot;

  return (
    <div className="renderer gcd-canvas">
      <div className="gcd-pair">
        <div className="gcd-box">
          <span className="gcd-label">a</span>
          <span className="gcd-value">{a}</span>
        </div>
        <div className="gcd-op">a % b = {remainder ?? '—'}</div>
        <div className="gcd-box">
          <span className="gcd-label">b</span>
          <span className="gcd-value">{b}</span>
        </div>
      </div>
      {formula && <div className="gcd-formula">{formula}</div>}
      {done && (
        <div className="gcd-result">
          GCD = <strong>{a}</strong>
        </div>
      )}
    </div>
  );
}
