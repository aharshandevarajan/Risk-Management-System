import { FormEvent, useState } from 'react';
import type { Risk } from '../../types';

interface Props {
  onCreated: (risk: Risk) => void;
}

const threatTypes: Risk['threatType'][] = [
  'Phishing',
  'Malware',
  'Data Breach',
  'Insider Threat',
  'Weak Password',
  'Network Attack',
];

const assets: Risk['affectedAsset'][] = [
  'Server',
  'Database',
  'Network',
  'Employee Device',
  'Web App',
];

interface Draft {
  threatType: Risk['threatType'] | '';
  affectedAsset: Risk['affectedAsset'] | '';
  description: string;
  likelihood: number;
  impact: number;
}

export const RiskForm: React.FC<Props> = ({ onCreated }) => {
  const [draft, setDraft] = useState<Draft>({
    threatType: '',
    affectedAsset: '',
    description: '',
    likelihood: 3,
    impact: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const riskScore = draft.likelihood * draft.impact;
  const severity =
    riskScore >= 13 ? 'High' : riskScore >= 6 ? 'Medium' : 'Low';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!draft.threatType || !draft.affectedAsset || !draft.description) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(
        (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') +
          '/risks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('cyber-risk-token')}`,
          },
          body: JSON.stringify({
            threatType: draft.threatType,
            affectedAsset: draft.affectedAsset,
            description: draft.description,
            likelihood: draft.likelihood,
            impact: draft.impact,
          }),
        }
      );

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(body?.message || 'Failed to create risk');
      }

      const created = (await res.json()) as Risk;
      onCreated(created);
      setDraft({
        threatType: '',
        affectedAsset: '',
        description: '',
        likelihood: 3,
        impact: 3,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Report New Risk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture threats early for security team triage
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Risk Score</div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {riskScore}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Severity</div>
            <div
              className={`text-xl font-black ${
                severity === 'High'
                  ? 'text-red-400'
                  : severity === 'Medium'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
              }`}
            >
              {severity}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Threat Type
          </label>
          <select
            value={draft.threatType}
            onChange={(e) =>
              update('threatType', e.target.value as Draft['threatType'])
            }
            className="input"
          >
            <option value="">Select threat type</option>
            {threatTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Affected Asset
          </label>
          <select
            value={draft.affectedAsset}
            onChange={(e) =>
              update('affectedAsset', e.target.value as Draft['affectedAsset'])
            }
            className="input"
          >
            <option value="">Select asset</option>
            {assets.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
          Description
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder="Describe the threat, affected systems, and context..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Likelihood (1–5)
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={draft.likelihood}
            onChange={(e) => update('likelihood', Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-slate-500">Low</span>
            <span className="font-bold text-indigo-400">{draft.likelihood}</span>
            <span className="text-slate-500">High</span>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Impact (1–5)
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={draft.impact}
            onChange={(e) => update('impact', Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-slate-500">Low</span>
            <span className="font-bold text-purple-400">{draft.impact}</span>
            <span className="text-slate-500">High</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-500">
          Severity = Likelihood × Impact
        </p>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Risk
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 text-red-300 ring-1 ring-red-500/50 text-sm font-medium">
          {error}
        </div>
      )}
    </form>
  );
};
