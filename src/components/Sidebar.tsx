import React from 'react';
import { 
  LayoutDashboard,
  Workflow, 
  Sparkles, 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Settings as SettingsIcon,
  LogOut, 
  BookOpen, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { AuditAgentState } from '../services/auditAgent';

interface SidebarProps {
  agentState: AuditAgentState;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onLogout: () => void;
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;
  auditorUser: { name: string; email: string; role: string };
}

export const Sidebar: React.FC<SidebarProps> = ({
  agentState,
  activeTab,
  setActiveTab,
  onLogout,
  setTutorialOpen,
  auditorUser
}) => {
  const pendingCount = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
  const violationCount = agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'agent', label: 'Agent Blueprint', icon: Workflow, badge: null },
    { id: 'copilot', label: 'AI Security Copilot', icon: Sparkles, badge: 'Live AI' },
    { id: 'discrepancies', label: 'Discrepancy Matrix', icon: ShieldAlert, badge: violationCount > 0 ? violationCount : null },
    { id: 'hitl', label: 'HITL Approvals', icon: UserCheck, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'consoles', label: 'Mock Consoles', icon: Building2, badge: '4' },
    { id: 'testsuite', label: 'Test Suite (TC1–TC4)', icon: CheckCircle2, badge: '4/4' },
    { id: 'report', label: 'Compliance Report', icon: FileText, badge: null }
  ];

  const initials = auditorUser.name
    .split(/\s+/)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside data-tour="sidebar" className="workspace-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo-badge">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="sidebar-brand-copy">
          <strong>AtherPanel</strong>
          <small>LEAVER ACCESS REVIEW</small>
        </div>
      </div>

      {/* Main Navigation Items (Prominent Scaled Tabs) */}
      <nav className="sidebar-navigation">
        <span className="sidebar-section-label">Audit Workspace</span>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="sidebar-item-icon">
                <Icon size={20} />
              </span>
              <span className="sidebar-item-label">{item.label}</span>

              {item.badge !== null && (
                <span className={`text-[11px] font-sans px-2 py-0.2 rounded-full font-bold ml-auto ${
                  isActive
                    ? 'bg-emerald-900 text-emerald-100'
                    : typeof item.badge === 'number' && item.badge > 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}

              <ChevronRight size={15} className="sidebar-item-chevron" />
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom: Settings & Profile */}
      <div className="sidebar-bottom">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
          title="Settings"
          aria-label="Settings"
        >
          <span className="sidebar-item-icon">
            <SettingsIcon size={20} />
          </span>
          <span className="sidebar-item-label">Settings</span>
          <ChevronRight size={15} className="sidebar-item-chevron" />
        </button>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {initials}
          </div>
          <div className="profile-copy">
            <strong>{auditorUser.name}</strong>
            <small>{auditorUser.role}</small>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sign out of audit console"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
};
