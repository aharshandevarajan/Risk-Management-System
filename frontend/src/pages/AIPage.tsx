import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AIInsights } from '../components/ai/AIInsights';

export const AIPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
          AI-Powered Insights
        </h1>
        <p className="text-slate-400 mt-2">Intelligent risk analysis and predictions powered by Gemini AI</p>
      </div>

      <AIInsights />
    </DashboardLayout>
  );
};
