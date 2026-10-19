import React from 'react';
import { Shield, Play, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Layers } from 'lucide-react';
import { AuditAgentState } from '../services/auditAgent';

interface NavbarProps {
  agentState: AuditAgentState;
  onRunAudit: () => void;
  onReset: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agentState,
  onRunAudit,
  onReset,
  activeTab,
  setActiveTab
}) => {
  const getStatusBadge = () => {
    if (agentState.isRunning) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Agent Executing...
        </span>
      );
    }
    if (agentState.isWaitingApproval) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700">
          <AlertTriangle className="w-3.5 h-3.5" />
          HITL Gate: Approval Required ({agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length})
        </span>
      );
    }
    const hasCompleted = agentState.steps[5].status === 'COMPLETED';
    if (hasCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Audit & Deprovisioning Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800">
        <Terminal className="w-3.5 h-3.5" />
        Agent Ready
      </span>
    );
  };

  const navTabs = [
    { id: 'agent', label: 'Agent Blueprint Trace' },
    { id: 'discrepancies', label: 'Discrepancy Matrix', badge: agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length },
    { id: 'hitl', label: 'HITL Approvals', badge: agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length },
    { id: 'consoles', label: 'Mock Admin Consoles' },
    { id: 'testsuite', label: 'TC1–TC4 Test Suite' },
    { id: 'report', label: 'Compliance Audit Report' },
  ];

  return (
    <header className="border-b border-surface-700 bg-surface-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 grid place-items-center text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight">
                  Leaver Access Review Auditor
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-surface-800 text-blue-400 border border-surface-700">
                  Agentic AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous SaaS Identity Matching, Human-Gated Deprovisioning & Status Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge()}

            <button
              type="button"
              onClick={onRunAudit}
              disabled={agentState.isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Play className="w-4 h-4 fill-current" />
              {agentState.steps[0].status === 'IDLE' ? 'Run Audit Cycle' : 'Re-Run Audit'}
            </button>

            <button
              type="button"
              onClick={onReset}
              disabled={agentState.isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-surface-800 text-slate-300 hover:bg-surface-700 border border-surface-700 active:bg-surface-600 transition-colors"
              title="Reset state to initial mock environment"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 mt-4 -mb-3 overflow-x-auto no-scrollbar border-t border-surface-800/80 pt-2">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-surface-700 text-slate-100 border border-surface-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-800/50'
                }`}
              >
                {tab.label}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    tab.id === 'hitl' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
