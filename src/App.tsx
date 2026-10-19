import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  UserX, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AgentExecutionStream } from './components/AgentExecutionStream';
import { DiscrepancyTable } from './components/DiscrepancyTable';
import { HITLApprovalQueue } from './components/HITLApprovalQueue';
import { MockConsolesViewer } from './components/MockConsolesViewer';
import { TestCasesRunner } from './components/TestCasesRunner';
import { AuditComplianceReport } from './components/AuditComplianceReport';

import { INITIAL_HR_LEAVERS } from './data/hrLeavers';
import { INITIAL_MOCK_USERS } from './data/mockConsoles';
import { AuditAgent, AuditAgentState } from './services/auditAgent';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('agent');
  const agentRef = useRef<AuditAgent | null>(null);
  const [agentState, setAgentState] = useState<AuditAgentState>(() => {
    const agent = new AuditAgent(INITIAL_HR_LEAVERS, INITIAL_MOCK_USERS, s => setAgentState(s));
    agentRef.current = agent;
    return agent.getState();
  });

  // Re-instantiate agent when resetting
  const handleReset = () => {
    const agent = new AuditAgent(INITIAL_HR_LEAVERS, INITIAL_MOCK_USERS, s => setAgentState(s));
    agentRef.current = agent;
    setAgentState(agent.getState());
  };

  const handleRunAudit = () => {
    if (agentRef.current) {
      agentRef.current.runAudit();
    }
  };

  const handleApproveTicket = async (ticketId: string, approverName: string) => {
    if (agentRef.current) {
      await agentRef.current.approveTicket(ticketId, approverName);
    }
  };

  const handleApproveAll = async (approverName: string) => {
    if (agentRef.current) {
      await agentRef.current.approveAllTickets(approverName);
    }
  };

  // Run initial audit cycle on mount for instant polish
  useEffect(() => {
    if (agentRef.current && agentState.steps[0].status === 'IDLE') {
      agentRef.current.runAudit();
    }
  }, []);

  const pendingCount = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
  const verifiedCount = agentState.findings.filter(f => f.deprovisionStatus === 'VERIFIED_REVOKED').length;
  const postLoginCount = agentState.findings.filter(f => f.hasPostDepartureLogin && f.status === 'UNAUTHORIZED_ACTIVE').length;

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        agentState={agentState}
        onRunAudit={handleRunAudit}
        onReset={handleReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Summary Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-surface-800 bg-surface-900 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                HR Leavers Tracked
              </span>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-0.5">
                {agentState.leavers.length}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                100% Identity Resolved
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-800/40 grid place-items-center text-blue-400 shrink-0">
              <UserX className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-xl border border-surface-800 bg-surface-900 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                Active Violations
              </span>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-0.5">
                {agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length}
              </div>
              <span className="text-[11px] text-rose-400/80 font-mono">
                {postLoginCount} Post-Exit Logins (TC1)
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-800/40 grid place-items-center text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-xl border border-surface-800 bg-surface-900 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Pending HITL Gate
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
                {pendingCount}
              </div>
              <span className="text-[11px] text-amber-400/80 font-mono">
                Awaiting Sign-off (TC4)
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/40 grid place-items-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-xl border border-surface-800 bg-surface-900 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Remediated & Verified
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {verifiedCount}
              </div>
              <span className="text-[11px] text-emerald-400/80 font-mono">
                SOC 2 Compliant
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 grid place-items-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'agent' && (
          <AgentExecutionStream
            steps={agentState.steps}
            currentStepIndex={agentState.currentStepIndex}
            isRunning={agentState.isRunning}
            isWaitingApproval={agentState.isWaitingApproval}
            onNavigateToApprovals={() => setActiveTab('hitl')}
          />
        )}

        {activeTab === 'discrepancies' && (
          <DiscrepancyTable
            findings={agentState.findings}
            onSelectTicket={() => setActiveTab('hitl')}
          />
        )}

        {activeTab === 'hitl' && (
          <HITLApprovalQueue
            tickets={agentState.tickets}
            onApproveTicket={handleApproveTicket}
            onApproveAll={handleApproveAll}
          />
        )}

        {activeTab === 'consoles' && (
          <MockConsolesViewer
            users={agentState.saasUsers}
          />
        )}

        {activeTab === 'testsuite' && (
          <TestCasesRunner />
        )}

        {activeTab === 'report' && (
          <AuditComplianceReport
            findings={agentState.findings}
            leavers={agentState.leavers}
            users={agentState.saasUsers}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800 bg-surface-900/60 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div>
            Ziro Digital National Agentic AI Hackathon 2026 • Problem ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
          </div>
          <div>
            Built by Hiten S (R.M.K College of Engineering and Technology)
          </div>
        </div>
      </footer>
    </div>
  );
};
