import { useEffect } from 'react';
import type { ProblemApproach } from '../../engine/types';
import './shared.css';

interface ApproachPanelProps {
  approach: ProblemApproach;
  open: boolean;
  onClose: () => void;
}

export function ApproachPanel({ approach, open, onClose }: ApproachPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="guide-overlay" role="presentation" onClick={onClose}>
      <aside
        className="guide-drawer panel"
        role="dialog"
        aria-modal="true"
        aria-label="How to solve"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="guide-drawer-header">
          <h2 className="guide-drawer-title">How to solve</h2>
          <button type="button" className="guide-close" onClick={onClose} aria-label="Close guide">
            ✕
          </button>
        </header>

        <div className="guide-drawer-body">
          <section className="approach-section approach-section--problem">
            <h3 className="approach-heading">1. Problem</h3>
            <p className="approach-text">{approach.problem}</p>
          </section>

          <section className="approach-section">
            <h3 className="approach-heading">2. Variables</h3>
            <ul className="approach-vars">
              {approach.variables.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </section>

          <section className="approach-section approach-section--approach">
            <h3 className="approach-heading">3. Algorithm (step-by-step)</h3>
            <ol className="approach-steps">
              {approach.approach.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="approach-section approach-section--solution">
            <h3 className="approach-heading">4. Solution logic</h3>
            <p className="approach-text solution-text">{approach.solution}</p>
          </section>

          {approach.tip && (
            <section className="approach-tip">
              <strong>Tip:</strong> {approach.tip}
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
