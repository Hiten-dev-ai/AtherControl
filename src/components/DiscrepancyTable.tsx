import React, { useState } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
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

  const getPlatformBadge = (platform: SaaSPlatform) => {
    switch (platform) {
      case 'google_workspace':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">Google Workspace</span>;
      case 'github':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-300 font-mono">GitHub Enterprise</span>;
      case 'aws_iam':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">AWS IAM</span>;
      case 'slack':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">Slack Grid</span>;
    }
  };

  const getRiskBadge = (risk: DiscrepancyFinding['riskLevel']) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-50 text-rose-800 border border-rose-300">
            <AlertOctagon className="w-3 h-3 text-rose-600" /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-rose-50/70 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-amber-50 text-amber-800 border border-amber-200">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-slate-100 text-slate-600 border border-slate-200">
            LOW
          </span>
        );
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
    <div className="space-y-4">
      {/* Header & Filter Controls with Ruling Margins */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Access Discrepancy Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Reconciles HR employee departure logs against live SaaS credentials, highlighting unauthorized access and post-departure logins.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
              filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNAUTHORIZED_ACTIVE')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
              filter === 'UNAUTHORIZED_ACTIVE' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active Violations ({findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('POST_LOGIN')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
              filter === 'POST_LOGIN' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Post-Departure Logins ({findings.filter(f => f.hasPostDepartureLogin && f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('REMEDIATED')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
              filter === 'REMEDIATED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Remediated ({findings.filter(f => f.status === 'DEPROVISIONED').length})
          </button>
        </div>
      </div>

      {/* Ruled Editorial Ledger Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] font-mono">
            <tr>
              <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Former Employee</th>
              <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Target SaaS Tool</th>
              <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Departure Date</th>
              <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Last Active Login</th>
              <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Risk Assessment</th>
              <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Account Status</th>
              <th className="px-4 py-3 text-right">HITL Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-sans">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-mono">
                  No findings matching selected filter. Run audit cycle above to populate matrix.
                </td>
              </tr>
            ) : (
              filteredFindings.map(f => {
                const isUnauthorized = f.status === 'UNAUTHORIZED_ACTIVE';
                return (
                  <tr 
                    key={f.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3.5 border-r border-slate-100">
                      <div className="font-semibold text-slate-900">
                        {f.hrEmployee.fullName}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {f.saasUser.accountEmail}
                      </div>
                      {f.hrEmployee.formerSurname && (
                        <div className="text-[10px] text-blue-700 font-mono font-medium mt-0.5">
                          Surname change: formerly {f.hrEmployee.formerSurname} (TC2)
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 border-r border-slate-100">
                      {getPlatformBadge(f.platform)}
                      <div className="text-[11px] text-slate-500 mt-1 font-mono truncate max-w-[140px]">
                        {f.saasUser.roles.join(', ')}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap border-r border-slate-100">
                      <div className="font-mono text-slate-900 font-medium">
                        {f.hrEmployee.exitDate}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {f.daysSinceDeparture} days ago
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap border-r border-slate-100">
                      <div className="font-mono text-slate-900 font-medium">
                        {formatDateTime(f.lastLoginTimestamp)}
                      </div>
                      {f.hasPostDepartureLogin && isUnauthorized && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-rose-700 mt-0.5">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Post-exit login detected (TC1)
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap border-r border-slate-100">
                      {getRiskBadge(f.riskLevel)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap border-r border-slate-100">
                      {isUnauthorized ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold font-mono bg-rose-50 text-rose-800 border border-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          ACTIVE (Violation)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {f.saasUser.status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {f.deprovisionStatus === 'PENDING_APPROVAL' ? (
                        <button
                          type="button"
                          onClick={() => onSelectTicket && onSelectTicket(f.ticketId)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                        >
                          Review Ticket
                        </button>
                      ) : f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                        <span className="text-[11px] font-mono font-semibold text-emerald-700 flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Revoked
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-blue-700 font-semibold">
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
