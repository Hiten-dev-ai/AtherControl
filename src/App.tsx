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
  Activity,
  Search,
  Settings as SettingsIcon,
  BookOpen
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { SpotlightTour } from './components/SpotlightTour';
import { Dashboard } from './components/Dashboard';
import { AgentExecutionStream } from './components/AgentExecutionStream';
import { DiscrepancyTable } from './components/DiscrepancyTable';
import { HITLApprovalQueue } from './components/HITLApprovalQueue';
import { MockConsolesViewer } from './components/MockConsolesViewer';
import { TestCasesRunner } from './components/TestCasesRunner';
import { AuditComplianceReport } from './components/AuditComplianceReport';
import { AiSecurityCopilot } from './components/AiSecurityCopilot';
import { AtherSettings } from './components/AtherSettings';

import { INITIAL_HR_LEAVERS } from './data/hrLeavers';
import { INITIAL_MOCK_USERS } from './data/mockConsoles';
import { AuditAgent, AuditAgentState } from './services/auditAgent';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  agent: 'Agent Blueprint',
  copilot: 'AI Security Copilot',
  discrepancies: 'Discrepancy Matrix',
  hitl: 'HITL Approvals',
  consoles: 'Mock Consoles',
  testsuite: 'Validation Test Suite (TC1–TC4)',
  report: 'Compliance Report',
  settings: 'Settings'
};

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [auditorUser, setAuditorUser] = useState({
    name: 'Hiten S',
    email: 'hiten.dev.ai@gmail.com',
    role: 'Lead Information Security Auditor'
  });
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const lastPage = useRef<string>('dashboard');
  
  const agentRef = useRef<AuditAgent | null>(null);
  const [agentState, setAgentState] = useState<AuditAgentState>(() => {
    const agent = new AuditAgent(INITIAL_HR_LEAVERS, INITIAL_MOCK_USERS, s => setAgentState(s));
    agentRef.current = agent;
    return agent.getState();
  });

  // Track last non-settings page for the Back button
  useEffect(() => {
    if (activeTab !== 'settings') {
      lastPage.current = activeTab;
    }
  }, [activeTab]);

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

  // Show Login Page if not logged in
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={(user, triggerTour) => {
          setAuditorUser(user);
          setIsLoggedIn(true);
          if (triggerTour) {
            setTimeout(() => setTutorialOpen(true), 300);
          }
        }}
      />
    );
  }

  const pageTitle = PAGE_TITLES[activeTab] || 'Audit Workspace';

  return (
    <div className="workspace-container">
      {/* AtherPanel Left Navigation Sidebar */}
      <Sidebar
        agentState={agentState}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => setIsLoggedIn(false)}
        tutorialOpen={tutorialOpen}
        setTutorialOpen={setTutorialOpen}
        auditorUser={auditorUser}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* AtherPanel Topbar */}
        <header className="workspace-topbar">
          <div className="flex items-center gap-3">
            <h1 className="ribbon-title">{pageTitle}</h1>
          </div>

          {/* AtherPanel Search Bar */}
          <div className="hidden md:flex items-center relative max-w-sm w-full">
            <Search size={15} className="absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search leavers, SaaS accounts, tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/70 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-sans"
            />
          </div>

          {/* AtherPanel Topbar Actions */}
          <div className="ribbon-actions">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              <span className={`w-2 h-2 rounded-full ${agentState.isRunning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'}`} />
              <span>{agentState.isRunning ? 'Auditing...' : 'Audit Ready'}</span>
            </span>

            <button
              type="button"
              onClick={() => setTutorialOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Start Interactive Tour"
            >
              <BookOpen size={14} />
              <span>Tour</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto">
          {/* Spotlight Interactive Tour Modal */}
          <SpotlightTour
            isOpen={tutorialOpen}
            onClose={() => setTutorialOpen(false)}
            onSelectTab={(t) => setActiveTab(t)}
          />

          {/* Render Active View */}
          {activeTab === 'settings' ? (
            <AtherSettings
              user={auditorUser}
              onUpdateUser={setAuditorUser}
              onBack={() => setActiveTab(lastPage.current || 'dashboard')}
            />
          ) : (
            <div className="max-w-6xl w-full mx-auto px-6 py-6 space-y-6">
              {activeTab === 'dashboard' && (
                <Dashboard
                  agentState={agentState}
                  onNavigateTab={(t) => setActiveTab(t)}
                  onRunAudit={handleRunAudit}
                  currentUser={auditorUser}
                  onSwitchUser={setAuditorUser}
                />
              )}

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
                  agentState={agentState}
                  onSelectTicket={() => setActiveTab('hitl')}
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
                  mockUsers={agentState.mockUsers}
                  onReset={handleReset}
                />
              )}

              {activeTab === 'testsuite' && (
                <TestCasesRunner />
              )}

              {activeTab === 'report' && (
                <AuditComplianceReport
                  agentState={agentState}
                  onNavigateTab={(t) => setActiveTab(t)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
