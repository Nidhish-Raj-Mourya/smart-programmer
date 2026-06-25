import './shared.css';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  hint?: string;
}

export function InputPanel({ label, value, onChange, onRun, hint }: InputPanelProps) {
  return (
    <div className="panel input-panel">
      <div className="panel-header">Input</div>
      <label className="input-label">
        {label}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onRun()}
          className="input-field"
        />
      </label>
      {hint && <p className="input-hint">{hint}</p>}
      <button type="button" className="btn-primary" onClick={onRun}>
        Run
      </button>
    </div>
  );
}
