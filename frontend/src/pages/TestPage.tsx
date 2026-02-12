import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export const TestPage: React.FC = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<string>('');

  const testArchive = async () => {
    try {
      const { data } = await api.get('/risks');
      if (data.length > 0) {
        await api.put(`/risks/${data[0]._id}/archive`);
        setResult('✓ Archive works!');
      } else {
        setResult('No risks to archive');
      }
    } catch (err: any) {
      setResult('✗ Archive failed: ' + err.message);
    }
  };

  const testDelete = async () => {
    try {
      const { data } = await api.get('/risks');
      if (data.length > 0) {
        await api.delete(`/risks/${data[0]._id}`);
        setResult('✓ Delete works!');
      } else {
        setResult('No risks to delete');
      }
    } catch (err: any) {
      setResult('✗ Delete failed: ' + err.message);
    }
  };

  const testAI = async () => {
    try {
      const { data } = await api.get('/risks/ai/report');
      setResult('✓ AI works! Report: ' + data.report?.substring(0, 100));
    } catch (err: any) {
      setResult('✗ AI failed: ' + err.message);
    }
  };

  const testImport = async () => {
    try {
      const csvContent = 'description,affectedAsset,threatType,likelihood,impact\nTest risk,Server,Malware,4,5';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'test.csv');

      const { data } = await api.post('/risks/import', formData);
      setResult('✓ Import works! Imported: ' + data.imported);
    } catch (err: any) {
      setResult('✗ Import failed: ' + err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-black gradient-text mb-4">Feature Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Your Role: <strong>{user?.role}</strong></p>
            <p className="text-xs text-slate-500">Admin/Security Analyst can use all features</p>
          </div>

          <div className="grid gap-3">
            <button onClick={testImport} className="btn-primary">
              Test CSV Import
            </button>
            <button onClick={testArchive} className="btn-secondary">
              Test Archive
            </button>
            <button onClick={testDelete} className="btn-danger">
              Test Delete
            </button>
            <button onClick={testAI} className="btn-success">
              Test AI
            </button>
          </div>

          {result && (
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <p className="text-sm text-slate-300">{result}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
