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
import { AiSecurityCopilot } from './components/AiSecurityCopilot';

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
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar
        agentState={agentState}
        onRunAudit={handleRunAudit}
        onReset={handleReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Ruling Margin KPI Summary Grid */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                HR Leavers Tracked
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
                {agentState.leavers.length}
              </div>
              <span className="text-[11px] text-slate-600 font-mono">
                100% Identity Resolved
              </span>
            </div>
            <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 grid place-items-center text-slate-700 shrink-0">
              <UserX className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider font-mono">
                Active Violations
              </span>
              <div className="text-2xl font-bold font-mono text-rose-700 mt-0.5">
                {agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length}
              </div>
              <span className="text-[11px] text-rose-600 font-mono">
                {postLoginCount} Post-Exit Logins (TC1)
              </span>
            </div>
            <div className="w-9 h-9 rounded-md bg-rose-50 border border-rose-200 grid place-items-center text-rose-700 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider font-mono">
                Pending HITL Gate
              </span>
              <div className="text-2xl font-bold font-mono text-amber-700 mt-0.5">
                {pendingCount}
              </div>
              <span className="text-[11px] text-amber-600 font-mono">
                Awaiting Sign-off (TC4)
              </span>
            </div>
            <div className="w-9 h-9 rounded-md bg-amber-50 border border-amber-200 grid place-items-center text-amber-700 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider font-mono">
                Remediated & Verified
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">
                {verifiedCount}
              </div>
              <span className="text-[11px] text-emerald-600 font-mono">
                SOC 2 Compliant
              </span>
            </div>
            <div className="w-9 h-9 rounded-md bg-emerald-50 border border-emerald-200 grid place-items-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
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

        {activeTab === 'copilot' && (
          <AiSecurityCopilot
            leavers={agentState.leavers}
            findings={agentState.findings}
            tickets={agentState.tickets}
            users={agentState.saasUsers}
            onNavigateToTab={setActiveTab}
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
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
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
