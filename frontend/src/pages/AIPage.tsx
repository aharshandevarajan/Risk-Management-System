import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AIInsights } from '../components/ai/AIInsights';

export const AIPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start gap-4">
        <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/40">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="5" width="14" height="14" rx="3" />
            <path d="M9 9h6v6H9z" />
            <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
          </svg>
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-4xl font-black text-transparent">
            AI-Powered Insights
          </h1>
          <p className="mt-2 text-slate-400">Intelligent risk analysis and predictions powered by Gemini AI</p>
        </div>
      </div>

      <AIInsights />
    </DashboardLayout>
  );
};
