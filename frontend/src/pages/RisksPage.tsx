import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import type { Risk } from '../types';
import { api } from '../api';
import { RiskFilters } from '../components/risks/RiskFilters';
import { RiskForm } from '../components/risks/RiskForm';
import { RiskTable } from '../components/risks/RiskTable';
import { CsvOperations } from '../components/risks/CsvOperations';

export const RisksPage: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    severity?: Risk['severity'] | '';
    status?: Risk['status'] | '';
    threatType?: Risk['threatType'] | '';
  }>({});

  const fetchRisks = async () => {
    setError(null);
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.status) params.set('status', filters.status);
      if (filters.threatType) params.set('threatType', filters.threatType);

      const { data } = await api.get<Risk[]>(
        `/risks${params.toString() ? `?${params.toString()}` : ''}`,
      );
      setRisks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load risks right now.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRisks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.severity, filters.status, filters.threatType]);

  const handleCreated = (risk: Risk) => {
    setRisks((prev) => [risk, ...prev]);
  };

  const handleStatusChange = async (id: string, status: Risk['status']) => {
    try {
      setRisks((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r)),
      );
      await api.put(`/risks/${id}`, { status });
      await fetchRisks();
    } catch {
      await fetchRisks();
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this risk?',
      )
    ) {
      return;
    }
    try {
      await api.delete(`/risks/${id}`);
      setRisks((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Unable to delete this risk right now.',
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Risk Management
        </h1>
        <p className="text-slate-400 mt-2">Monitor, track, and mitigate security threats</p>
      </div>

      <div className="space-y-6">
        <CsvOperations onImportSuccess={fetchRisks} />
        <RiskFilters filters={filters} onChange={setFilters} />
        <RiskForm onCreated={handleCreated} />
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 text-red-300 ring-1 ring-red-500/50 text-sm font-medium">
            {error}
          </div>
        )}
        <RiskTable
          risks={risks}
          loading={loading}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onRefresh={fetchRisks}
        />
      </div>
    </DashboardLayout>
  );
};

