import React from 'react';
import { 
  Shield, 
  Workflow, 
  Sparkles, 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Play, 
  RefreshCw, 
  LogOut, 
  BookOpen, 
  Zap,
  Clock
} from 'lucide-react';
import { AuditAgentState } from '../services/auditAgent';

interface SidebarProps {
  agentState: AuditAgentState;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onRunAudit: () => void;
  onReset: () => void;
  onLogout: () => void;
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;
  auditorUser: { name: string; email: string; role: string };
}

export const Sidebar: React.FC<SidebarProps> = ({
  agentState,
  activeTab,
  setActiveTab,
  onRunAudit,
  onReset,
  onLogout,
  tutorialOpen,
  setTutorialOpen,
  auditorUser
}) => {
  const pendingCount = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
  const violationCount = agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length;

  const navItems = [
    { id: 'agent', label: 'Agent Blueprint', icon: Workflow, badge: null },
    { id: 'copilot', label: 'AI Security Copilot', icon: Sparkles, badge: 'Live AI' },
    { id: 'discrepancies', label: 'Discrepancy Matrix', icon: ShieldAlert, badge: violationCount },
    { id: 'hitl', label: 'HITL Approvals', icon: UserCheck, badge: pendingCount },
    { id: 'consoles', label: 'Mock Consoles', icon: Building2, badge: '4' },
    { id: 'testsuite', label: 'Test Suite (TC1–TC4)', icon: CheckCircle2, badge: '4/4' },
    { id: 'report', label: 'Compliance Report', icon: FileText, badge: null }
  ];

  return (
    <aside data-tour="sidebar" className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-3.5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-slate-900 grid place-items-center text-white shrink-0">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-semibold text-slate-900 truncate tracking-tight">
                Leaver Access Auditor
              </h1>
              <span className="text-[10px] font-mono text-slate-400 block truncate">
                SOC 2 • Gemini 3.5 Flash-Lite
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTutorialOpen(true)}
            className="p-1 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
            title="Start Interactive Tour"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto no-scrollbar">
        <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider px-2.5 py-1">
          Navigation
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                  isActive
                    ? 'bg-slate-800 text-slate-200'
                    : typeof item.badge === 'number' && item.badge > 0
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Control Actions */}
      <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/50">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onRunAudit}
            disabled={agentState.isRunning}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {agentState.isRunning ? (
              <>
                <Clock className="w-3 h-3 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>{agentState.steps[0].status === 'IDLE' ? 'Run Audit' : 'Re-Run Audit'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={agentState.isRunning}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            title="Reset audit environment"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Auditor Profile Card & Logout */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="min-w-0 pr-2">
            <div className="font-semibold text-slate-900 truncate text-[11px]">
              {auditorUser.name}
            </div>
            <div className="font-mono text-[10px] text-slate-500 truncate">
              {auditorUser.email}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Sign out of audit console"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
