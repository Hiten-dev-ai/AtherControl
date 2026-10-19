import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  CheckCircle2, 
  Building2, 
  Copy, 
  Check, 
  Play, 
  ArrowRight,
  Key,
  ChevronDown
} from 'lucide-react';
import { AuditAgentState } from '../services/auditAgent';

interface DashboardProps {
  agentState: AuditAgentState;
  onNavigateTab: (tabId: string) => void;
  onRunAudit: () => void;
  currentUser: { name: string; email: string; role: string };
  onSwitchUser: (user: { name: string; email: string; role: string }) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  agentState,
  onNavigateTab,
  onRunAudit,
  currentUser,
  onSwitchUser
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeViolations = agentState.findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length;
  const pendingApprovals = agentState.tickets.filter(t => t.status === 'AWAITING_APPROVAL').length;
  const verifiedRevocations = agentState.findings.filter(f => f.deprovisionStatus === 'VERIFIED_REVOKED').length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const metricCards = [
    {
      label: 'Active Violations',
      value: activeViolations.toString(),
      icon: ShieldAlert,
      highlight: activeViolations > 0 ? 'text-rose-600' : 'text-emerald-700'
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals.toString(),
      icon: UserCheck,
      highlight: pendingApprovals > 0 ? 'text-amber-600' : 'text-slate-800'
    },
    {
      label: 'Revoked & Verified',
      value: verifiedRevocations.toString(),
      icon: CheckCircle2,
      highlight: 'text-emerald-700'
    },
    {
      label: 'Audited Platforms',
      value: '4',
      icon: Building2,
      highlight: 'text-slate-900'
    }
  ];

  return (
    <div className="space-y-4 dashboard-container" data-testid="dashboard-view">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            AcmeCorp Multi-SaaS Access Governance
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>SOC 2 CC6.2 SLA: 24h</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">TC1–TC4 Passing</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRunAudit}
            disabled={agentState.isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <Play size={14} className="fill-current" />
            <span>{agentState.isRunning ? 'Auditing...' : 'Run Audit'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metricCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="metric-card">
              <div className="metric-label">
                <span>{card.label}</span>
                <Icon size={18} className="text-slate-400" />
              </div>
              <strong className={card.highlight}>{card.value}</strong>
            </div>
          );
        })}
      </div>

      {/* Testing & Auditor Credentials Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white grid place-items-center">
              <Key size={14} />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Evaluation Test Personas
            </h2>
          </div>

          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active: {currentUser.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              name: 'Hiten S',
              email: 'lead.auditor@acmecorp.io',
              role: 'Lead Information Security Auditor',
              desc: 'Full approval & ticket sign-off authority (Level 3)'
            },
            {
              name: 'Alex Morgan',
              email: 'alex.secops@acmecorp.io',
              role: 'SecOps Administrator',
              desc: 'Deprovisioning execution & SaaS sync (Level 2)'
            },
            {
              name: 'Elena Rostova',
              email: 'elena.compliance@acmecorp.io',
              role: 'Compliance & Audit Officer',
              desc: 'Audit report review & compliance verification (Level 1)'
            }
          ].map(acc => {
            const isCurrent = currentUser.email === acc.email;
            return (
              <div
                key={acc.email}
                className={`p-3 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                  isCurrent ? 'border-emerald-600 bg-emerald-50/30 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900">{acc.name}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-emerald-700 text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate mb-1">{acc.role}</div>

                  {/* Collapsible detail */}
                  <details className="group">
                    <summary className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer select-none flex items-center gap-1 list-none">
                      <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                      <span>Permissions</span>
                    </summary>
                    <p className="text-[11px] text-slate-600 mt-1 leading-normal font-sans">
                      {acc.desc}
                    </p>
                  </details>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(acc.email, acc.email)}
                    className="p-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer"
                    title="Copy email"
                  >
                    {copiedKey === acc.email ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchUser(acc)}
                    disabled={isCurrent}
                    className="flex-1 py-1 px-2 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer text-center"
                  >
                    {isCurrent ? 'Current' : 'Switch'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('discrepancies')}
          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            Discrepancy Matrix
          </span>
          <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('hitl')}
          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            HITL Approval Queue
          </span>
          <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('testsuite')}
          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            Validation Test Suite
          </span>
          <ArrowRight size={15} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>
      </div>
    </div>
  );
};
