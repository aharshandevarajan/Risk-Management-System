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

  const toggleSeverity = (severity: Risk['severity']) => {
    if (filters.severity === severity) {
      onChange({ ...filters, severity: undefined });
    } else {
      onChange({ ...filters, severity });
    }
  };

  const activeCount = [filters.severity, filters.status, filters.threatType].filter(Boolean).length;

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Filters
          </h2>
          <p className="mt-1 text-xs text-slate-400">Narrow down risks by criteria</p>
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({})}
            className="text-xs font-bold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">Severity</label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toggleSeverity('High')}
              className={`rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                filters.severity === 'High'
                  ? 'scale-105 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-red-500/10 text-red-300 ring-2 ring-red-500/30 hover:bg-red-500/20 hover:ring-red-500/50'
              }`}
            >
              High
            </button>
            <button
              type="button"
              onClick={() => toggleSeverity('Medium')}
              className={`rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                filters.severity === 'Medium'
                  ? 'scale-105 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-amber-500/10 text-amber-300 ring-2 ring-amber-500/30 hover:bg-amber-500/20 hover:ring-amber-500/50'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => toggleSeverity('Low')}
              className={`rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                filters.severity === 'Low'
                  ? 'scale-105 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50'
                  : 'bg-emerald-500/10 text-emerald-300 ring-2 ring-emerald-500/30 hover:bg-emerald-500/20 hover:ring-emerald-500/50'
              }`}
            >
              Low
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
            <select value={filters.status ?? ''} onChange={(e) => set('status', e.target.value)} className="input micro-interaction">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Threat Type</label>
            <select
              value={filters.threatType ?? ''}
              onChange={(e) => set('threatType', e.target.value)}
              className="input micro-interaction"
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
    </div>
  );
};
