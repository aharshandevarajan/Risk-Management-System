import { useState, useEffect } from 'react';
import { api } from '../../api';
import type { Risk } from '../../types';

interface AIInsight {
  summary: string;
  rootCause: string;
  businessImpact: string;
  probabilityExplanation: string;
  mitigation: string;
  prevention: string;
  priority: string;
  suggestedOwner: string;
  generatedAt: string;
}

interface Props {
  risk: Risk;
  onClose: () => void;
}

export const AIInsightModal: React.FC<Props> = ({ risk, onClose }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [cached, setCached] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchInsight();
  }, []);

  const fetchInsight = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/risks/${risk._id}/ai-insight`);
      setInsight(data.insight);
      setCached(data.cached);
    } catch (err) {
      console.error('Failed to fetch insight:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const { data } = await api.post(`/risks/${risk._id}/ai-insight/regenerate`);
      setInsight(data.insight);
      setCached(false);
    } catch (err) {
      console.error('Failed to regenerate:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleExportPDF = () => {
    const content = `
AI RISK INSIGHT REPORT
Generated: ${new Date().toLocaleString()}

RISK: ${risk.threatType}
ASSET: ${risk.affectedAsset}
SEVERITY: ${risk.severity}

${insight ? `
SUMMARY:
${insight.summary}

ROOT CAUSE:
${insight.rootCause}

BUSINESS IMPACT:
${insight.businessImpact}

PROBABILITY EXPLANATION:
${insight.probabilityExplanation}

MITIGATION:
${insight.mitigation}

PREVENTION:
${insight.prevention}

PRIORITY: ${insight.priority}
SUGGESTED OWNER: ${insight.suggestedOwner}
` : ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-insight-${risk._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = () => {
    switch (risk.severity) {
      case 'High': return 'from-red-500 to-pink-500';
      case 'Medium': return 'from-amber-500 to-orange-500';
      case 'Low': return 'from-emerald-500 to-teal-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl animate-in slide-in-from-bottom duration-500">
        {/* Header */}
        <div className={`relative overflow-hidden border-b border-slate-700/50 bg-gradient-to-r ${getSeverityColor()} p-6`}>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">🤖 AI Risk Insight</h2>
                <p className="mt-1 text-sm text-white/80">{risk.threatType} • {risk.affectedAsset}</p>
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
            <div className="mt-4 flex items-center gap-3">
              <span className={`badge ${risk.severity === 'High' ? 'badge-high' : risk.severity === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                {risk.severity} Severity
              </span>
              <span className="text-xs text-white/60">
                Risk Score: {risk.riskScore}
              </span>
              {cached && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                  📦 Cached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="mb-4 h-12 w-12 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-slate-400">Analyzing risk with AI...</p>
            </div>
          ) : insight ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-indigo-400">Executive Summary</h3>
                <p className="text-sm leading-relaxed text-slate-200">{insight.summary}</p>
              </div>

              {/* Priority & Owner */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Priority Level</h4>
                  <p className="text-sm font-bold text-slate-100">{insight.priority}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Suggested Owner</h4>
                  <p className="text-sm font-bold text-slate-100">{insight.suggestedOwner}</p>
                </div>
              </div>

              {/* Root Cause */}
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Root Cause Analysis</h3>
                <p className="text-sm leading-relaxed text-slate-300">{insight.rootCause}</p>
              </div>

              {/* Business Impact */}
              <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-pink-500/10 p-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-red-400">Business Impact</h3>
                <p className="text-sm leading-relaxed text-slate-200">{insight.businessImpact}</p>
              </div>

              {/* Probability */}
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Probability Explanation</h3>
                <p className="text-sm leading-relaxed text-slate-300">{insight.probabilityExplanation}</p>
              </div>

              {/* Mitigation */}
              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-emerald-400">Recommended Mitigation</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">{insight.mitigation}</p>
              </div>

              {/* Prevention */}
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-400">Prevention Strategy</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{insight.prevention}</p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-slate-400">Failed to generate insight</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {insight?.generatedAt && `Generated: ${new Date(insight.generatedAt).toLocaleString()}`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                disabled={!insight}
                className="btn-secondary text-xs"
              >
                📄 Export
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating || loading}
                className="btn-primary text-xs"
              >
                {regenerating ? '🔄 Regenerating...' : '🔄 Regenerate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
