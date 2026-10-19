import React, { useState } from 'react';
import { 
  Send, 
  Terminal, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { AiCopilotService, CopilotResponse } from '../services/aiCopilotService';
import { DiscrepancyFinding, DeprovisionTicket, Employee, SaaSUser } from '../types/audit';

interface AiSecurityCopilotProps {
  leavers: Employee[];
  findings: DiscrepancyFinding[];
  tickets: DeprovisionTicket[];
  users: SaaSUser[];
  onNavigateToTab: (tab: string) => void;
}

const SUGGESTED_QUERIES = [
  'Analyze Marcus Vance GitHub post-exit login & blast radius (TC1)',
  'Explain Sarah Jenkins-Hayes surname match & identity resolution (TC2)',
  'Why were deploy-bot and billing-service excluded from deprovisioning? (TC3)',
  'Executive Blast Radius Summary & SOC 2 CC6.2 Audit Memo'
];

export const AiSecurityCopilot: React.FC<AiSecurityCopilotProps> = ({
  leavers,
  findings,
  tickets,
  users
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<CopilotResponse | null>(null);
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);

  // Auto-run first query on mount if empty
  React.useEffect(() => {
    if (!currentResponse) {
      handleRunQuery(SUGGESTED_QUERIES[0]);
    }
  }, []);

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);
    setQuery(queryText);

    try {
      await new Promise(r => setTimeout(r, 200));
      const res = await AiCopilotService.queryAgent(queryText, { leavers, findings, tickets, users });
      setCurrentResponse(res);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRunQuery(query);
  };

  return (
    <div className="space-y-4">
      {/* Header & Query Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              AI Security Copilot
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              (Gemini 3.5 Flash-Lite)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Google AI Studio Engine
          </span>
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a security query or audit question..."
            className="flex-1 bg-white border border-slate-300 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isLoading ? <span className="animate-spin text-xs">⟳</span> : <Send className="w-3 h-3" />}
            <span>Analyze</span>
          </button>
        </form>

        {/* Suggested Queries Pills */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Suggested:</span>
          {SUGGESTED_QUERIES.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(sq)}
              className="px-2 py-0.5 text-[11px] rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Response Panel */}
      {currentResponse && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-900">
                Executive Risk Assessment
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                {currentResponse.engineUsed}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({currentResponse.latencyMs}ms)
              </span>
            </div>

            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
              currentResponse.blastRadiusScore === 'CRITICAL'
                ? 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              Blast Radius: {currentResponse.blastRadiusScore}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {currentResponse.summary}
          </p>

          {/* Evidence Grid */}
          <div>
            <h4 className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono mb-2">
              Correlated Evidence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {currentResponse.evidence.map((ev, i) => (
                <div key={i} className="p-2.5 rounded border border-slate-200 bg-slate-50/50 text-xs font-mono">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                    {ev.label}
                  </div>
                  <div className="text-slate-900 font-medium break-words">
                    {ev.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory & Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-800 block mb-1.5">
                Regulatory Impact
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentResponse.regulatoryImpact.map((reg, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-400">•</span>
                    <span>{reg}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-800 block mb-1.5">
                Remediation Actions
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentResponse.recommendedActions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-400">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Collapsible Chain of Thought */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowThoughtProcess(!showThoughtProcess)}
              className="text-xs text-slate-500 hover:text-slate-800 font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>{showThoughtProcess ? '▼ Hide' : '▶ Show'} reasoning trace ({currentResponse.thoughtProcess.length} steps)</span>
            </button>

            {showThoughtProcess && (
              <div className="mt-2.5 space-y-1.5 pl-2 border-l border-slate-200">
                {currentResponse.thoughtProcess.map((step, idx) => (
                  <div key={idx} className="text-xs font-mono text-slate-600">
                    <span className="text-slate-400 mr-1.5">0{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
