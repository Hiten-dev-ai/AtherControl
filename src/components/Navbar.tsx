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
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium font-mono">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Auditing SaaS Consoles...
        </span>
      );
    }
    if (agentState.isWaitingApproval) {
      const pendingCount = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {pendingCount} Approvals Required (HITL)
        </span>
      );
    }
    const hasCompleted = agentState.steps[5].status === 'COMPLETED';
    if (hasCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Deprovisioning Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium font-mono">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        Auditor Ready
      </span>
    );
  };

  const navTabs = [
    { id: 'agent', label: 'Agent Blueprint' },
    { id: 'copilot', label: 'AI Security Copilot' },
    { id: 'discrepancies', label: 'Discrepancy Matrix', badge: agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length },
    { id: 'hitl', label: 'HITL Approvals', badge: agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length },
    { id: 'consoles', label: 'Mock Consoles' },
    { id: 'testsuite', label: 'Test Suite (TC1–TC4)' },
    { id: 'report', label: 'Compliance Report' },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-slate-900 grid place-items-center text-white shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
                Leaver Access Review Auditor
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                SOC 2 / ISO 27001
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {getStatusBadge()}

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRunAudit}
                disabled={agentState.isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                {agentState.steps[0].status === 'IDLE' ? 'Run Audit' : 'Re-Run Audit'}
              </button>

              <button
                type="button"
                onClick={onReset}
                disabled={agentState.isRunning}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset state"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Ruled Tab Navigation */}
        <nav className="flex items-center gap-1 mt-3 -mb-3 overflow-x-auto no-scrollbar border-t border-slate-200 pt-1">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 font-medium'
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
