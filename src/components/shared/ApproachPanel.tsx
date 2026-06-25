import type { ProblemApproach } from '../../engine/types';
import './shared.css';

interface ApproachPanelProps {
  approach: ProblemApproach;
}

export function ApproachPanel({ approach }: ApproachPanelProps) {
  return (
    <div className="panel approach-panel">
      <div className="panel-header">How to solve (approach)</div>

      <section className="approach-section">
        <h3 className="approach-heading">Problem kya hai?</h3>
        <p className="approach-text">{approach.what}</p>
      </section>

      <section className="approach-section">
        <h3 className="approach-heading">Kaunse variables chahiye?</h3>
        <ul className="approach-vars">
          {approach.variables.map((v) => (
            <li key={v}>
              <code>{v}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="approach-section">
        <h3 className="approach-heading">Step-by-step approach</h3>
        <ol className="approach-steps">
          {approach.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {approach.tip && (
        <section className="approach-tip">
          <strong>Tip:</strong> {approach.tip}
        </section>
      )}
    </div>
  );
}

export function defaultApproach(
  title: string,
  inputKeys: string[],
  movementType: string,
): ProblemApproach {
  return {
    what: `${title} — is program ko step-by-step simulate karke samjho.`,
    variables: inputKeys.length > 0 ? inputKeys : ['i'],
    steps: [
      'Input lo (array ya numbers jo problem maange).',
      `Har step par ek element / index process karo (Type ${movementType}).`,
      'Variables Watch panel mein values dekho — wahi debugger ki tarah hai.',
      'Play / Step dabao — code ki highlighted line batati hai ab control kahan hai.',
    ],
    tip: 'Pehle Run dabao, phir Step-by-step chalao. Message box mein har step explain hota hai.',
  };
}
