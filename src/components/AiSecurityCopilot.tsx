import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  BrainCircuit, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  FileCheck2, 
  Cpu, 
  Flame
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
  users,
  onNavigateToTab
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<CopilotResponse | null>(null);
  const [showThoughtProcess, setShowThoughtProcess] = useState(true);

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
      await new Promise(r => setTimeout(r, 250));
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
    <div className="space-y-6">
      {/* Header Banner with Ruled Editorial Margins */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 grid place-items-center text-purple-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  AI Security & Compliance Copilot
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-purple-50 text-purple-800 border border-purple-200">
                  Gemini 3.8 Flash • Agentic Core
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Autonomous blast-radius analysis, identity discrepancy synthesis, and SOC 2 / ISO 27001 auditor justifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous State: <strong className="text-slate-900">Online</strong></span>
          </div>
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything (e.g. 'Marcus Vance blast radius', 'Explain TC3 service bot rules', 'SOC 2 audit status')..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-spin text-sm">⟳</span>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Analyze</span>
          </button>
        </form>

        {/* Suggested Queries Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Quick Prompts:
          </span>
          {SUGGESTED_QUERIES.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(sq)}
              className="px-2.5 py-1 text-xs rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-mono transition-all text-left cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Response Panel */}
      {currentResponse && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Executive Summary & Blast Radius Badge */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="w-5 h-5 text-purple-700" />
                <span className="text-sm font-bold text-slate-900">
                  Agent Executive Assessment
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">
                  Engine: <strong className="text-slate-800">{currentResponse.engineUsed}</strong> ({currentResponse.latencyMs}ms)
                </span>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-xs font-bold bg-rose-50 text-rose-800 border-rose-300">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>BLAST RADIUS: {currentResponse.blastRadiusScore}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-sans">
              {currentResponse.summary}
            </p>

            {/* Correlated Evidence Matrix with Ruled Margin Cells */}
            <div>
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono mb-2">
                Correlated Audit Evidence
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {currentResponse.evidence.map((ev, i) => {
                  let badgeStyle = 'bg-slate-50 border-slate-200 text-slate-800';
                  if (ev.type === 'danger') badgeStyle = 'bg-rose-50 border-rose-200 text-rose-900';
                  if (ev.type === 'warning') badgeStyle = 'bg-amber-50 border-amber-200 text-amber-900';
                  if (ev.type === 'success') badgeStyle = 'bg-emerald-50 border-emerald-200 text-emerald-900';
                  if (ev.type === 'info') badgeStyle = 'bg-blue-50 border-blue-200 text-blue-900';

                  return (
                    <div key={i} className={`p-3 rounded border ${badgeStyle} text-xs font-mono`}>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                        {ev.label}
                      </div>
                      <div className="font-semibold break-words">
                        {ev.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regulatory & Recommended Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono mb-2">
                  <FileCheck2 className="w-4 h-4 text-blue-700" />
                  <span>Regulatory Impact</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {currentResponse.regulatoryImpact.map((reg, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-700 font-mono mt-0.5">•</span>
                      <span>{reg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Autonomous Remediation Plan</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {currentResponse.recommendedActions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-mono mt-0.5">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Collapsible Chain of Thought */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setShowThoughtProcess(!showThoughtProcess)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-mono font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span>Agent Deep Chain-of-Thought Trace ({currentResponse.thoughtProcess.length} Reasoning Steps)</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {showThoughtProcess ? '[Collapse Trace]' : '[Expand Trace]'}
              </span>
            </button>

            {showThoughtProcess && (
              <div className="px-5 pb-4 pt-1 border-t border-slate-200 space-y-2">
                {currentResponse.thoughtProcess.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-mono text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-900 font-bold shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                    <span className="leading-relaxed">{step}</span>
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
