import { useState, useRef } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onImportSuccess: () => void;
}

export const CsvOperations: React.FC<Props> = ({ onImportSuccess }) => {
  const { user } = useAuth();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUseCsv = user?.role === 'Admin' || user?.role === 'Security Analyst';

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setImporting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post<{ imported: number }>('/risks/import', formData);

      setMessage({ type: 'success', text: `✓ Imported ${data.imported} risks!` });
      onImportSuccess();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Import failed',
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setMessage(null);
    setExporting(true);

    try {
      const response = await api.get('/risks/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `risks-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '✓ Exported!' });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Export failed',
      });
    } finally {
      setExporting(false);
    }
  };

  if (!canUseCsv) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-slate-400 mb-2">CSV operations require Admin or Security Analyst role</p>
          <p className="text-sm text-slate-500">Your role: {user?.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-black gradient-text">CSV Operations</h2>
        <p className="text-xs text-slate-400 mt-1">Bulk import/export • Your role: {user?.role}</p>
      </div>

      <div className="flex gap-4">
        <label className="btn-primary cursor-pointer">
          {importing ? 'Importing...' : '📤 Import CSV'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
        </label>

        <button onClick={handleExport} disabled={exporting} className="btn-secondary">
          {exporting ? 'Exporting...' : '📥 Export CSV'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-xl text-sm ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl bg-slate-800/30 text-xs text-slate-400">
        <strong>Supported formats:</strong> CSV (.csv) or Excel (.xlsx, .xls)<br/>
        <strong>Required columns:</strong> description, likelihood, impact<br/>
        <strong>Optional:</strong> affectedAsset, threatType, status
      </div>
    </div>
  );
};
