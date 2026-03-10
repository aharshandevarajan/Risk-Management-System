import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';

interface TrendPayload {
  trend: string;
  vulnerableAreas: string[];
  predictions: string[];
  recommendations: string[];
  lastUpdated?: string;
  metrics?: {
    total: number;
    highSeverity: number;
    openCount: number;
    updatedLast24h: number;
  };
}

const AUTO_REFRESH_MS = 30000;

const CardLogo: React.FC<{ variant: 'ai' | 'trend' }> = ({ variant }) => {
  if (variant === 'trend') {
    return (
      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19V5" />
        <path d="M20 19H4" />
        <path d="M7 14l3-3 3 2 4-5" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  );
};

const safeList = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
};

export const AIInsights: React.FC = () => {
  const [trends, setTrends] = useState<TrendPayload | null>(null);
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const buildLocalReport = (payload: TrendPayload | null) => {
    if (!payload) {
      return 'Risk posture is stable. Keep monitoring active, maintain remediation SLAs, and validate controls weekly.';
    }

    const topAreas = (payload.vulnerableAreas || []).slice(0, 3).join(', ') || 'core systems';
    const topPred = (payload.predictions || [])[0] || 'No dominant threat pattern detected.';
    const topRec = (payload.recommendations || [])[0] || 'Maintain active monitoring and periodic reviews.';

    return [
      `Risk posture is currently ${payload.trend || 'Stable'}. Concentration is highest in ${topAreas}, which should remain under prioritized monitoring and remediation workflows.`,
      `${topPred} Recommended next action: ${topRec}`,
    ].join('\n\n');
  };

  const normalizeTrend = (payload: TrendPayload): TrendPayload => {
    const fallbacks = {
      vulnerableAreas: ['Identity systems', 'External attack surface'],
      predictions: ['Likely increase in phishing and credential attacks over the next cycle.'],
      recommendations: ['Raise alerting sensitivity for high-risk assets and accelerate critical patching.'],
    };

    return {
      trend: payload?.trend?.trim() || 'Stable',
      vulnerableAreas: safeList(payload?.vulnerableAreas, fallbacks.vulnerableAreas),
      predictions: safeList(payload?.predictions, fallbacks.predictions),
      recommendations: safeList(payload?.recommendations, fallbacks.recommendations),
      lastUpdated: payload?.lastUpdated,
      metrics: payload?.metrics,
    };
  };

  const fetchAIData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const [trendsRes, reportRes] = await Promise.all([
        api.get<TrendPayload>('/risks/ai/trends'),
        api.get<{ report: string }>('/risks/ai/report'),
      ]);

      const trendData = normalizeTrend(trendsRes.data);
      const rawReport = (reportRes.data.report || '').trim();
      const staleFallbackMessage = rawReport.toLowerCase().includes('unable to generate report at this time');

      setTrends(trendData);
      setReport(staleFallbackMessage || !rawReport ? buildLocalReport(trendData) : rawReport);
      setLastRefresh(new Date());
    } catch (err: any) {
      const message = err.response?.data?.message || 'Unable to load AI insights right now.';
      setError(message);
      setTrends(null);
      setReport('');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAIData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      void fetchAIData(false);
    }, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshLabel = useMemo(() => {
    if (!lastRefresh) return 'Never';
    return lastRefresh.toLocaleTimeString();
  }, [lastRefresh]);

  if (loading) {
    return (
      <div className="card flex h-64 items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 ring-1 ring-red-500/40">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Tracked Risks</p>
          <p className="mt-1 text-2xl font-black text-slate-100">{trends?.metrics?.total ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
          <p className="text-xs uppercase tracking-wider text-red-300">High Severity</p>
          <p className="mt-1 text-2xl font-black text-red-300">{trends?.metrics?.highSeverity ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-xs uppercase tracking-wider text-amber-300">Open/Investigating</p>
          <p className="mt-1 text-2xl font-black text-amber-300">{trends?.metrics?.openCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-wider text-emerald-300">Updated 24h</p>
          <p className="mt-1 text-2xl font-black text-emerald-300">{trends?.metrics?.updatedLast24h ?? 0}</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <CardLogo variant="ai" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-black text-transparent">
                AI Executive Report
              </h2>
              <p className="text-xs text-slate-400">Generated from current risk data</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                autoRefresh ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/40 text-slate-300'
              }`}
            >
              {autoRefresh ? 'Live ON' : 'Live OFF'}
            </button>
            <button onClick={() => void fetchAIData()} className="btn-secondary micro-interaction px-4 py-2 text-xs">
              Refresh
            </button>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <span className={`inline-block h-2 w-2 rounded-full ${autoRefresh ? 'animate-pulse bg-emerald-400' : 'bg-slate-500'}`} />
          Last refresh: {refreshLabel}
          {trends?.lastUpdated ? ` | Data updated: ${new Date(trends.lastUpdated).toLocaleTimeString()}` : ''}
        </div>
        <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{report || 'No report available yet.'}</p>
        </div>
      </div>

      {trends && (
        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
              <CardLogo variant="trend" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-black text-transparent">
                AI Trend Analysis
              </h2>
              <p className="text-xs text-slate-400">Predictive insights</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Overall Trend</p>
              <p className="text-lg font-black text-indigo-300">{trends.trend || 'Stable'}</p>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-pink-500/10 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Vulnerable Areas</p>
              <div className="space-y-1">
                {trends.vulnerableAreas.map((area, i) => (
                  <p key={`${area}-${i}`} className="text-sm font-bold text-red-300">
                    - {area}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">AI Predictions</p>
            <div className="space-y-2">
              {trends.predictions.map((pred, i) => (
                <div key={`${pred}-${i}`} className="flex items-start gap-2">
                  <span className="mt-1 text-purple-400">{'>'}</span>
                  <p className="text-sm text-slate-300">{pred}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">AI Recommendations</p>
            <div className="space-y-2">
              {trends.recommendations.map((rec, i) => (
                <div key={`${rec}-${i}`} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-400">+</span>
                  <p className="text-sm text-slate-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
