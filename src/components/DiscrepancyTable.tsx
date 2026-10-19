import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
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

  return (
    <div data-tour="matrix" className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
          SaaS Access Discrepancy Matrix
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filter === 'ALL' ? 'bg-slate-900 text-white font-medium' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNAUTHORIZED_ACTIVE')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filter === 'UNAUTHORIZED_ACTIVE' ? 'bg-slate-900 text-white font-medium' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active Violations ({findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('POST_LOGIN')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filter === 'POST_LOGIN' ? 'bg-slate-900 text-white font-medium' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Post-Exit Logins ({findings.filter(f => f.hasPostDepartureLogin && f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('REMEDIATED')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filter === 'REMEDIATED' ? 'bg-slate-900 text-white font-medium' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Remediated ({findings.filter(f => f.status === 'DEPROVISIONED').length})
          </button>
        </div>
      </div>

      {/* Ruled Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-600 font-medium uppercase text-[11px] font-mono">
            <tr>
              <th className="px-3.5 py-2">Former Employee</th>
              <th className="px-3.5 py-2">SaaS Platform</th>
              <th className="px-3.5 py-2">Separation Date</th>
              <th className="px-3.5 py-2">Last Login</th>
              <th className="px-3.5 py-2">Risk Level</th>
              <th className="px-3.5 py-2">Account Status</th>
              <th className="px-3.5 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3.5 py-6 text-center text-slate-400 font-mono">
                  No records matching selected filter.
                </td>
              </tr>
            ) : (
              filteredFindings.map(f => {
                const isUnauthorized = f.status === 'UNAUTHORIZED_ACTIVE';
                return (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2">
                      <div className="font-medium text-slate-900">
                        {f.hrEmployee.fullName}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {f.saasUser.accountEmail}
                      </div>
                      {f.hrEmployee.formerSurname && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Maiden name: {f.hrEmployee.formerSurname} (TC2)
                        </div>
                      )}
                    </td>

                    <td className="px-3.5 py-2 whitespace-nowrap">
                      <div className="font-medium text-slate-800">
                        {getPlatformLabel(f.platform)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[130px]">
                        {f.saasUser.roles[0] || 'User'}
                      </div>
                    </td>

                    <td className="px-3.5 py-2 whitespace-nowrap font-mono text-slate-700">
                      <div>{f.hrEmployee.exitDate}</div>
                      <div className="text-[10px] text-slate-400">{f.daysSinceDeparture}d ago</div>
                    </td>

                    <td className="px-3.5 py-2 whitespace-nowrap font-mono text-slate-700">
                      <div>{formatDateTime(f.lastLoginTimestamp)}</div>
                      {f.hasPostDepartureLogin && isUnauthorized && (
                        <span className="text-[10px] text-rose-700 font-semibold block">
                          Post-exit login (TC1)
                        </span>
                      )}
                    </td>

                    <td className="px-3.5 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        f.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        f.riskLevel === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {f.riskLevel}
                      </span>
                    </td>

                    <td className="px-3.5 py-2 whitespace-nowrap">
                      {isUnauthorized ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Active (Violation)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Revoked
                        </span>
                      )}
                    </td>

                    <td className="px-3.5 py-2 text-right whitespace-nowrap">
                      {f.deprovisionStatus === 'PENDING_APPROVAL' ? (
                        <button
                          type="button"
                          onClick={() => onSelectTicket && onSelectTicket(f.ticketId)}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      ) : f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                        <span className="text-[11px] font-mono text-emerald-700 flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
