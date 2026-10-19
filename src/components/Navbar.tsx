import React from 'react';
import { Shield, Play, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Sparkles } from 'lucide-react';
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold font-mono bg-blue-50 text-blue-800 border border-blue-200 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
          Agent Executing...
        </span>
      );
    }
    if (agentState.isWaitingApproval) {
      const pendingCount = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold font-mono bg-amber-50 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          HITL Gate: Approval Required ({pendingCount})
        </span>
      );
    }
    const hasCompleted = agentState.steps[5].status === 'COMPLETED';
    if (hasCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Audit & Deprovisioning Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold font-mono bg-slate-100 text-slate-700 border border-slate-300">
        <Terminal className="w-3.5 h-3.5 text-slate-500" />
        Agent Ready
      </span>
    );
  };

  const navTabs = [
    { id: 'agent', label: 'Agent Blueprint Trace' },
    { id: 'copilot', label: 'AI Copilot & Risk Brain', isAi: true },
    { id: 'discrepancies', label: 'Discrepancy Matrix', badge: agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length },
    { id: 'hitl', label: 'HITL Approvals', badge: agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length },
    { id: 'consoles', label: 'Mock Admin Consoles' },
    { id: 'testsuite', label: 'TC1–TC4 Test Suite' },
    { id: 'report', label: 'Compliance Audit Report' },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      {/* Editorial Ruling Margin Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 sm:px-6 py-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">DOCKET #2026-AUTODEP-SOC2</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">CONTROL: SOC 2 CC6.2 & ISO 27001 A.9.2.6</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>SYSTEM AUDIT CLOCK: LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center text-slate-800 shrink-0">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  Leaver Access Review Auditor
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Agentic AI
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Autonomous SaaS Identity Matching, Human-Gated Deprovisioning & Status Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {getStatusBadge()}

            <button
              type="button"
              onClick={onRunAudit}
              disabled={agentState.isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {agentState.steps[0].status === 'IDLE' ? 'Run Audit Cycle' : 'Re-Run Audit'}
            </button>

            <button
              type="button"
              onClick={onReset}
              disabled={agentState.isRunning}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 active:bg-slate-100 transition-colors cursor-pointer"
              title="Reset state to initial mock environment"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Reset
            </button>
          </div>
        </div>

        {/* Ruled Tab Navigation */}
        <nav className="flex items-center gap-1 mt-3 -mb-3 overflow-x-auto no-scrollbar border-t border-slate-200 pt-1.5">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-slate-900 text-slate-950 font-semibold bg-slate-50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                {tab.isAi && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                {tab.label}
                {tab.isAi && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    LLM
                  </span>
                )}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    tab.id === 'hitl' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
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
