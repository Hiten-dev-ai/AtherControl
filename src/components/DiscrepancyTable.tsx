import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { DiscrepancyFinding, SaaSPlatform } from '../types/audit';

interface DiscrepancyTableProps {
  findings: DiscrepancyFinding[];
  onSelectTicket?: (ticketId: string) => void;
}

export const DiscrepancyTable: React.FC<DiscrepancyTableProps> = ({
  findings,
  onSelectTicket
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNAUTHORIZED_ACTIVE' | 'POST_LOGIN' | 'REMEDIATED'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFindings = findings.filter(f => {
    if (filter === 'UNAUTHORIZED_ACTIVE') return f.status === 'UNAUTHORIZED_ACTIVE';
    if (filter === 'POST_LOGIN') return f.hasPostDepartureLogin && f.status === 'UNAUTHORIZED_ACTIVE';
    if (filter === 'REMEDIATED') return f.status === 'DEPROVISIONED';
    return true;
  });

  const getPlatformLabel = (platform: SaaSPlatform) => {
    switch (platform) {
      case 'google_workspace': return 'Google Workspace';
      case 'github': return 'GitHub Enterprise';
      case 'aws_iam': return 'AWS IAM';
      case 'slack': return 'Slack Enterprise';
    }
  };

  const formatDateTime = (iso: string) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return iso;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div data-tour="matrix" className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            SaaS Access Discrepancy Matrix
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Identity correlation & policy violation detection (TC1, TC2, TC3)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              filter === 'ALL' ? 'bg-slate-900 text-white font-semibold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNAUTHORIZED_ACTIVE')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              filter === 'UNAUTHORIZED_ACTIVE' ? 'bg-slate-900 text-white font-semibold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active Violations ({findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('POST_LOGIN')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              filter === 'POST_LOGIN' ? 'bg-slate-900 text-white font-semibold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Post-Exit Logins ({findings.filter(f => f.hasPostDepartureLogin && f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('REMEDIATED')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              filter === 'REMEDIATED' ? 'bg-slate-900 text-white font-semibold' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Remediated ({findings.filter(f => f.status === 'DEPROVISIONED').length})
          </button>
        </div>
      </div>

      {/* Ruled Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10.5px] font-mono">
            <tr>
              <th className="px-3.5 py-2.5">Former Employee</th>
              <th className="px-3.5 py-2.5">SaaS Platform</th>
              <th className="px-3.5 py-2.5">Exit Date</th>
              <th className="px-3.5 py-2.5">Last Login</th>
              <th className="px-3.5 py-2.5">Risk Level</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Details & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3.5 py-8 text-center text-slate-400 font-mono">
                  No records matching selected filter.
                </td>
              </tr>
            ) : (
              filteredFindings.map(f => {
                const isUnauthorized = f.status === 'UNAUTHORIZED_ACTIVE';
                const isExpanded = expandedId === f.id;

                return (
                  <React.Fragment key={f.id}>
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="font-bold text-slate-900">
                          {f.hrEmployee.fullName}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          {f.saasUser.accountEmail}
                        </div>
                      </td>

                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {getPlatformLabel(f.platform)}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[130px]">
                          {f.saasUser.roles[0] || 'User'}
                        </div>
                      </td>

                      <td className="px-3.5 py-3 whitespace-nowrap font-mono text-slate-700">
                        <div>{f.hrEmployee.exitDate}</div>
                        <div className="text-[10px] text-slate-400">{f.daysSinceDeparture}d ago</div>
                      </td>

                      <td className="px-3.5 py-3 whitespace-nowrap font-mono text-slate-700">
                        <div>{formatDateTime(f.lastLoginTimestamp)}</div>
                        {f.hasPostDepartureLogin && isUnauthorized && (
                          <span className="text-[10px] text-rose-700 font-bold block">
                            Post-exit login (TC1)
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          f.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          f.riskLevel === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {f.riskLevel}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 whitespace-nowrap">
                        {isUnauthorized ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Active Violation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 size={12} className="text-emerald-600" /> Revoked
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleExpand(f.id)}
                            className="px-2 py-1 rounded-md text-[11px] font-mono font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Evidence</span>
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>

                          {f.deprovisionStatus === 'PENDING_APPROVAL' ? (
                            <button
                              type="button"
                              onClick={() => onSelectTicket && onSelectTicket(f.ticketId)}
                              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              Review
                            </button>
                          ) : f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                            <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center justify-end gap-1">
                              <ShieldCheck size={14} /> Verified
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500">
                              Approved
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Evidence Dropdown Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={7} className="px-4 py-3 border-t border-slate-100 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                                Correlation Rationale
                              </span>
                              <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                                {f.hrEmployee.formerSurname 
                                  ? `Matched via maiden surname "${f.hrEmployee.formerSurname}" against active SaaS handle (TC2).`
                                  : `Direct email and employee ID correlation matched HR departure record.`}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                                SaaS Role & Permissions
                              </span>
                              <div className="text-[11px] text-slate-700 truncate">
                                Roles: {f.saasUser.roles.join(', ') || 'Standard Member'}
                              </div>
                              <div className="text-[10.5px] text-slate-500 mt-1">
                                Platform ID: {f.saasUser.id}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                                Policy SLA Status
                              </span>
                              <div className={`text-[11px] font-bold ${isUnauthorized ? 'text-rose-700' : 'text-emerald-700'}`}>
                                {isUnauthorized ? `Exceeded 24h SLA by ${f.daysSinceDeparture} days` : 'Remediation Verified'}
                              </div>
                              <div className="text-[10.5px] text-slate-500 mt-1">
                                Deprovisioning Ticket: {f.ticketId}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
