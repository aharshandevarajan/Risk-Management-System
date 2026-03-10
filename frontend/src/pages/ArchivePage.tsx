import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import type { Risk } from '../types';
import { api } from '../api';

export const ArchivePage: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const { data } = await api.get<Risk[]>('/risks?showArchived=true');
        setRisks(data.filter((r) => r.archived));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchArchived();
  }, []);

  const handleUnarchive = async (id: string) => {
    try {
      await api.put(`/risks/${id}/unarchive`);
      setRisks(risks.filter((r) => r._id !== id));
    } catch {
      alert('Failed to unarchive');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start gap-4">
        <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg shadow-slate-500/40">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-black gradient-text">Archived Risks</h1>
          <p className="mt-2 text-slate-400">View and restore archived security incidents</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-100">{risks.length} Archived Items</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : risks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-400">No archived risks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {risks.map((risk) => (
              <div key={risk._id} className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-100">{risk.threatType}</h3>
                    <p className="mt-1 text-sm text-slate-400">{risk.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>{risk.affectedAsset}</span>
                      <span>|</span>
                      <span>Score: {risk.riskScore}</span>
                    </div>
                  </div>
                  <button onClick={() => handleUnarchive(risk._id)} className="btn-success micro-interaction">
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
