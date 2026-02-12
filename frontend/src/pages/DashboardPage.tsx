import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { RiskSeverityChart } from '../components/charts/RiskSeverityChart';
import { RiskStatusChart } from '../components/charts/RiskStatusChart';
import type { RiskSummary } from '../types';
import { api } from '../api';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get<RiskSummary>('/risks/summary');
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 p-12 backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative z-10">
          <h1 className="mb-4 text-6xl font-black">
            <span className="gradient-text">Security Command Center</span>
          </h1>
          <p className="text-xl text-slate-400">
            Real-time threat intelligence • AI-powered insights • Automated response
          </p>
          <div className="mt-8 flex gap-4">
            <button className="btn-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report Incident
            </button>
            <button className="btn-secondary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mb-12 grid gap-6 md:grid-cols-4">
        <div className="metric-card slide-in">
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total</span>
            </div>
            <div className="mb-2 text-5xl font-black gradient-text">
              {summary?.total ?? (loading ? '...' : 0)}
            </div>
            <p className="text-sm font-bold text-slate-400">Active Threats</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="metric-card slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Open</span>
            </div>
            <div className="mb-2 text-5xl font-black text-amber-400">
              {summary?.open ?? (loading ? '...' : 0)}
            </div>
            <p className="text-sm font-bold text-slate-400">Pending Review</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${summary ? (summary.open / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="metric-card slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Closed</span>
            </div>
            <div className="mb-2 text-5xl font-black text-emerald-400">
              {summary?.closed ?? (loading ? '...' : 0)}
            </div>
            <p className="text-sm font-bold text-slate-400">Resolved</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${summary ? (summary.closed / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="metric-card slide-in pulse-glow" style={{ animationDelay: '0.3s' }}>
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/50">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Critical</span>
            </div>
            <div className="mb-2 text-5xl font-black text-red-400">
              {summary?.highSeverity ?? (loading ? '...' : 0)}
            </div>
            <p className="text-sm font-bold text-slate-400">High Priority</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full animate-pulse bg-gradient-to-r from-red-500 to-pink-500" style={{ width: `${summary ? (summary.highSeverity / summary.total) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {summary && (
          <>
            <div className="slide-in" style={{ animationDelay: '0.4s' }}>
              <RiskSeverityChart data={summary.severityDistribution} />
            </div>
            <div className="slide-in" style={{ animationDelay: '0.5s' }}>
              <RiskStatusChart data={summary.statusDistribution} />
            </div>
          </>
        )}
      </div>

      {/* Recent Incidents */}
      <div className="card slide-in" style={{ animationDelay: '0.6s' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black gradient-text">Recent Incidents</h2>
            <p className="mt-1 text-sm text-slate-400">Latest security events requiring attention</p>
          </div>
          <div className="badge badge-medium">
            {summary?.recent.length || 0} Active
          </div>
        </div>

        <div className="space-y-4">
          {summary?.recent.map((risk, i) => (
            <div
              key={risk._id}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-950/50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20"
              style={{ animationDelay: `${0.7 + i * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-2xl">{risk.severity === 'High' ? '🔴' : risk.severity === 'Medium' ? '🟡' : '🟢'}</span>
                    <h3 className="text-lg font-black text-slate-100">{risk.threatType}</h3>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-sm font-bold text-slate-400">{risk.affectedAsset}</span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-slate-300">{risk.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>👤 {risk.reportedBy.name}</span>
                    <span>•</span>
                    <span>📅 {new Date(risk.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="rounded-xl bg-slate-900 px-4 py-2 text-center">
                    <div className="text-xs font-bold text-slate-400">Risk Score</div>
                    <div className="text-2xl font-black gradient-text">{risk.riskScore}</div>
                  </div>
                  <span className={`badge ${risk.severity === 'High' ? 'badge-high' : risk.severity === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                    {risk.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {(!summary || summary.recent.length === 0) && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900">
                <svg className="h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-slate-400">All Clear!</p>
              <p className="text-sm text-slate-500">No recent incidents to display</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
