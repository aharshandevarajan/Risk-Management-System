import type { Risk } from '../../types';

interface Props {
  filters: {
    severity?: Risk['severity'] | '';
    status?: Risk['status'] | '';
    threatType?: Risk['threatType'] | '';
  };
  onChange: (next: Props['filters']) => void;
}

export const RiskFilters: React.FC<Props> = ({ filters, onChange }) => {
  const set = (key: keyof Props['filters'], value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const activeCount = [filters.severity, filters.status, filters.threatType].filter(Boolean).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Filters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Narrow down risks by criteria
          </p>
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({})}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Severity
          </label>
          <select
            value={filters.severity ?? ''}
            onChange={(e) => set('severity', e.target.value)}
            className="input"
          >
            <option value="">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Status
          </label>
          <select
            value={filters.status ?? ''}
            onChange={(e) => set('status', e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Mitigated">Mitigated</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Threat Type
          </label>
          <select
            value={filters.threatType ?? ''}
            onChange={(e) => set('threatType', e.target.value)}
            className="input"
          >
            <option value="">All Threats</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware">Malware</option>
            <option value="Data Breach">Data Breach</option>
            <option value="Insider Threat">Insider Threat</option>
            <option value="Weak Password">Weak Password</option>
            <option value="Network Attack">Network Attack</option>
          </select>
        </div>
      </div>
    </div>
  );
};
