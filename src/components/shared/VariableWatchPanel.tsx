import './shared.css';

interface VariableWatchPanelProps {
  variables: Record<string, string | number | boolean>;
  message?: string;
}

export function VariableWatchPanel({ variables, message }: VariableWatchPanelProps) {
  const entries = Object.entries(variables);

  return (
    <div className="panel watch-panel">
      <div className="panel-header">Watch</div>
      {message && <p className="watch-message">{message}</p>}
      {entries.length === 0 ? (
        <p className="watch-empty">No variables yet</p>
      ) : (
        <dl className="watch-list">
          {entries.map(([key, value]) => (
            <div key={key} className="watch-row">
              <dt>{key}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
