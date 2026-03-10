import { useState } from 'react';
import type { Risk } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { AIInsightModal } from './AIInsightModal';
import { RiskDetailDrawer } from './RiskDetailDrawer';

interface Props {
  risks: Risk[];
  onStatusChange: (id: string, status: Risk['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
}

const statusOptions: Risk['status'][] = ['Open', 'Investigating', 'Mitigated', 'Closed'];

export const RiskTable: React.FC<Props> = ({ risks, onStatusChange, onDelete, onRefresh, loading }) => {
  const { user } = useAuth();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const canDelete = user?.role === 'Admin';
  const canArchive = user?.role === 'Admin' || user?.role === 'Security Analyst';
  const canUpdateStatus = (risk: Risk) =>
    (user?.role === 'Admin' || user?.role === 'Security Analyst' || risk.reportedBy._id === user?.id) ?? false;

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Archive this risk?')) return;

    try {
      setActionLoading(id);
      await api.put(`/risks/${id}/archive`);
      onRefresh();
    } catch {
      alert('Failed to archive risk');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    await onDelete(id);
  };

  const handleAIInsight = (e: React.MouseEvent, risk: Risk) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedRisk(risk);
  };

  const handleRowClick = (riskId: string) => {
    setSelectedRiskId(riskId);
  };

  return (
    <>
      <div className="card relative">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black gradient-text">Risk Registry</h2>
            <p className="mt-1 text-xs text-slate-400">
              {risks.length} {risks.length === 1 ? 'risk' : 'risks'} found
            </p>
          </div>
          {loading && (
            <svg className="h-5 w-5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Threat</th>
                <th>Asset</th>
                <th>Score</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reporter</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {risks.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <svg className="mx-auto mb-3 h-16 w-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm text-slate-400">No risks found</p>
                  </td>
                </tr>
              )}
              {risks.map((risk) => (
                <tr
                  key={risk._id}
                  onClick={() => handleRowClick(risk._id)}
                  className={`cursor-pointer transition-colors ${
                    risk.severity === 'High' ? 'bg-red-950/20 hover:bg-red-950/30' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <td className="max-w-xs">
                    <div className="text-sm font-bold text-slate-100">{risk.threatType}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-slate-400">{risk.description}</div>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-slate-300">{risk.affectedAsset}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-200">{risk.riskScore}</span>
                      <span className="text-xs text-slate-500">
                        ({risk.likelihood}x{risk.impact})
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        risk.severity === 'High'
                          ? 'badge-high'
                          : risk.severity === 'Medium'
                            ? 'badge-medium'
                            : 'badge-low'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </td>
                  <td>
                    {canUpdateStatus(risk) ? (
                      <select
                        value={risk.status}
                        onChange={(e) => onStatusChange(risk._id, e.target.value as Risk['status'])}
                        className="input micro-interaction px-2 py-1 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-medium text-slate-300">{risk.status}</span>
                    )}
                  </td>
                  <td>
                    <div className="text-xs font-medium text-slate-200">{risk.reportedBy.name}</div>
                    <div className="text-[10px] text-slate-500">{risk.reportedBy.role}</div>
                  </td>
                  <td className="text-xs text-slate-400">{new Date(risk.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAIInsight(e, risk)}
                        className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-[0.98]"
                      >
                        AI
                      </button>

                      {canArchive && (
                        <button
                          type="button"
                          onClick={(e) => handleArchive(e, risk._id)}
                          disabled={actionLoading === risk._id}
                          className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300 transition-all duration-200 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-50"
                        >
                          {actionLoading === risk._id ? '...' : 'Archive'}
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, risk._id)}
                          className="rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-[0.98]"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRisk && <AIInsightModal risk={selectedRisk} onClose={() => setSelectedRisk(null)} />}

      {selectedRiskId && (
        <RiskDetailDrawer riskId={selectedRiskId} onClose={() => setSelectedRiskId(null)} onUpdate={onRefresh} />
      )}
    </>
  );
};
