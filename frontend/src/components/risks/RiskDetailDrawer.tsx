import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import type { Risk } from '../../types';
import { AIInsightModal } from './AIInsightModal';

interface Props {
  riskId: string;
  onClose: () => void;
  onUpdate: () => void;
}

type Tab = 'overview' | 'technical' | 'ai' | 'activity';

const statusOptions: Risk['status'][] = ['Open', 'Investigating', 'Mitigated', 'Closed'];

export const RiskDetailDrawer: React.FC<Props> = ({ riskId, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showAIModal, setShowAIModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRisk();
  }, [riskId]);

  const fetchRisk = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Risk>(`/risks/${riskId}`);
      setRisk(data);
    } catch (err) {
      console.error('Failed to fetch risk:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: Risk['status']) => {
    if (!risk) return;
    try {
      setUpdating(true);
      await api.put(`/risks/${risk._id}`, { status });
      setRisk({ ...risk, status });
      onUpdate();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!risk || !confirm('Archive this risk?')) return;
    try {
      await api.put(`/risks/${risk._id}/archive`);
      onUpdate();
      onClose();
    } catch (err) {
      alert('Failed to archive');
    }
  };

  const handleDelete = async () => {
    if (!risk || !confirm('Permanently delete this risk?')) return;
    try {
      await api.delete(`/risks/${risk._id}`);
      onUpdate();
      onClose();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'from-red-500 to-pink-500';
      case 'Medium': return 'from-amber-500 to-orange-500';
      case 'Low': return 'from-emerald-500 to-teal-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'Security Analyst' || risk?.reportedBy._id === user?.id;
  const canDelete = user?.role === 'Admin';
  const canArchive = user?.role === 'Admin' || user?.role === 'Security Analyst';

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl bg-slate-950 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex h-full items-center justify-center">
          <svg className="h-12 w-12 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl bg-slate-950 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-400">Risk not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className={`relative border-b border-slate-700/50 bg-gradient-to-r ${getSeverityColor(risk.severity)} p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{risk.severity === 'High' ? '🔴' : risk.severity === 'Medium' ? '🟡' : '🟢'}</span>
                <h2 className="text-2xl font-black text-white">{risk.threatType}</h2>
              </div>
              <p className="text-sm text-white/80">{risk.affectedAsset}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className={`badge ${risk.severity === 'High' ? 'badge-high' : risk.severity === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                  {risk.severity}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                  Score: {risk.riskScore}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/20 p-2 text-white backdrop-blur-xl transition-all hover:bg-white/30"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700/50 bg-slate-900/50 px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'technical', label: 'Technical', icon: '⚙️' },
              { id: 'ai', label: 'AI Analysis', icon: '🤖' },
              { id: 'activity', label: 'Activity', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 py-3 text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-280px)] overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="card">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Description</h3>
                <p className="text-sm leading-relaxed text-slate-200">{risk.description}</p>
              </div>

              {/* Status */}
              <div className="card">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Status</h3>
                {canEdit ? (
                  <select
                    value={risk.status}
                    onChange={(e) => handleStatusChange(e.target.value as Risk['status'])}
                    disabled={updating}
                    className="input"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-bold text-slate-200">{risk.status}</p>
                )}
              </div>

              {/* Reporter */}
              <div className="card">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Reported By</h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-black text-white">
                    {risk.reportedBy.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{risk.reportedBy.name}</p>
                    <p className="text-xs text-slate-400">{risk.reportedBy.email}</p>
                    <p className="text-xs text-slate-500">{risk.reportedBy.role}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card">
                  <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Created</h3>
                  <p className="text-sm text-slate-200">{new Date(risk.createdAt).toLocaleString()}</p>
                </div>
                <div className="card">
                  <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Last Updated</h3>
                  <p className="text-sm text-slate-200">{new Date(risk.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card">
                  <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Likelihood</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-black gradient-text">{risk.likelihood}</div>
                    <div className="text-sm text-slate-400">/ 5</div>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${(risk.likelihood / 5) * 100}%` }} />
                  </div>
                </div>

                <div className="card">
                  <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Impact</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-black gradient-text">{risk.impact}</div>
                    <div className="text-sm text-slate-400">/ 5</div>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${(risk.impact / 5) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Risk Calculation</h3>
                <div className="rounded-xl bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-indigo-400">Likelihood</span> ({risk.likelihood}) × <span className="font-bold text-purple-400">Impact</span> ({risk.impact}) = <span className="font-bold text-pink-400">Risk Score</span> ({risk.riskScore})
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              {risk.aiInsight ? (
                <div className="space-y-4">
                  <div className="card">
                    <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Summary</h3>
                    <p className="text-sm text-slate-200">{risk.aiInsight.summary}</p>
                  </div>
                  <div className="card">
                    <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Priority</h3>
                    <p className="text-sm font-bold text-slate-200">{risk.aiInsight.priority}</p>
                  </div>
                  <button onClick={() => setShowAIModal(true)} className="btn-primary w-full">
                    View Full AI Analysis
                  </button>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="mb-4 text-slate-400">No AI analysis available</p>
                  <button onClick={() => setShowAIModal(true)} className="btn-primary">
                    Generate AI Insight
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-200">Risk Created</p>
                    <p className="text-xs text-slate-400">{new Date(risk.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-200">Last Updated</p>
                    <p className="text-xs text-slate-400">{new Date(risk.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700/50 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between gap-4">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            <div className="flex gap-3">
              {canArchive && (
                <button onClick={handleArchive} className="btn-secondary">
                  📦 Archive
                </button>
              )}
              {canDelete && (
                <button onClick={handleDelete} className="btn-danger">
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <AIInsightModal risk={risk} onClose={() => setShowAIModal(false)} />
      )}
    </>
  );
};
