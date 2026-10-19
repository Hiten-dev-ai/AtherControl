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
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { TutorialGuide } from './components/TutorialGuide';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [auditorUser, setAuditorUser] = useState({
    name: 'Hiten S',
    email: 'hiten.dev.ai@gmail.com',
    role: 'Lead Information Security Auditor'
  });
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(true);
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

  // Run initial audit cycle on mount for instant state polish
  useEffect(() => {
    if (agentRef.current && agentState.steps[0].status === 'IDLE') {
      agentRef.current.runAudit();
    }
  }, []);

  const pendingCount = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
  const verifiedCount = agentState.findings.filter(f => f.deprovisionStatus === 'VERIFIED_REVOKED').length;

  // Show Login Page if not logged in
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={(user) => {
          setAuditorUser(user);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Enterprise Left Sidebar Navigation */}
      <Sidebar
        agentState={agentState}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunAudit={handleRunAudit}
        onReset={handleReset}
        onLogout={() => setIsLoggedIn(false)}
        tutorialOpen={tutorialOpen}
        setTutorialOpen={setTutorialOpen}
        auditorUser={auditorUser}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 space-y-4">
          {/* Interactive Tutorial Guide Walkthrough (Dismissible) */}
          {tutorialOpen && (
            <TutorialGuide
              onNavigateToTab={(tabId) => setActiveTab(tabId)}
              onClose={() => setTutorialOpen(false)}
            />
          )}

          {/* Minimalist Ruled Metric Strip */}
          <div className="bg-white border border-slate-200 rounded-md grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="px-4 py-2.5">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                HR Leavers
              </span>
              <div className="text-lg font-semibold font-mono text-slate-900 mt-0.5">
                {agentState.leavers.length}
              </div>
            </div>

            <div className="px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                  Active Violations
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
              <div className="text-lg font-semibold font-mono text-rose-600 mt-0.5">
                {agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length}
              </div>
            </div>

            <div className="px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                  Pending Approvals
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="text-lg font-semibold font-mono text-slate-900 mt-0.5">
                {pendingCount}
              </div>
            </div>

            <div className="px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                  Remediated & Verified
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-lg font-semibold font-mono text-emerald-600 mt-0.5">
                {verifiedCount}
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
              onNavigateToTab={(t) => setActiveTab(t)}
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
      </div>
    </div>
  );
};
