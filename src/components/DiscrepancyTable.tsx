import React, { useState } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar,
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
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/40 text-red-300 border border-red-800/40">Google Workspace</span>;
      case 'github':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">GitHub Enterprise</span>;
      case 'aws_iam':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40">AWS IAM</span>;
      case 'slack':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">Slack Grid</span>;
    }
  };

  const getRiskBadge = (risk: DiscrepancyFinding['riskLevel']) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
            <AlertOctagon className="w-3 h-3" /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/50 text-rose-400 border border-rose-800/50">
            <AlertTriangle className="w-3 h-3" /> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/40 text-amber-300 border border-amber-800/40">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
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
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Access Discrepancy Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Reconciles HR employee departure logs against live SaaS credentials, highlighting unauthorized access and post-departure logins.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'ALL' ? 'bg-surface-700 text-slate-100' : 'bg-surface-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNAUTHORIZED_ACTIVE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'UNAUTHORIZED_ACTIVE' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-surface-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Violations ({findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('POST_LOGIN')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'POST_LOGIN' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-surface-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Post-Departure Logins ({findings.filter(f => f.hasPostDepartureLogin && f.status === 'UNAUTHORIZED_ACTIVE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('REMEDIATED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === 'REMEDIATED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-surface-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Remediated ({findings.filter(f => f.status === 'DEPROVISIONED').length})
          </button>
        </div>
      </div>

      {/* Discrepancy Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-800 bg-surface-900 shadow-sm">
        <table className="w-full text-left text-xs text-slate-300 divide-y divide-surface-800">
          <thead className="bg-surface-850 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Former Employee</th>
              <th className="px-4 py-3">Target SaaS Tool</th>
              <th className="px-4 py-3">Departure Date</th>
              <th className="px-4 py-3">Last Active Login</th>
              <th className="px-4 py-3">Risk Assessment</th>
              <th className="px-4 py-3">Account Status</th>
              <th className="px-4 py-3 text-right">HITL Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60 font-sans">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No findings matching selected filter. Run audit cycle above to populate matrix.
                </td>
              </tr>
            ) : (
              filteredFindings.map(f => {
                const isUnauthorized = f.status === 'UNAUTHORIZED_ACTIVE';
                return (
                  <tr 
                    key={f.id}
                    className="hover:bg-surface-850/60 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-100">
                        {f.hrEmployee.fullName}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {f.saasUser.accountEmail}
                      </div>
                      {f.hrEmployee.formerSurname && (
                        <div className="text-[10px] text-cyan-400 mt-0.5">
                          Surname change: formerly {f.hrEmployee.formerSurname} (TC2)
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {getPlatformBadge(f.platform)}
                      <div className="text-[11px] text-slate-400 mt-1 font-mono truncate max-w-[140px]">
                        {f.saasUser.roles.join(', ')}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono text-slate-200">
                        {f.hrEmployee.exitDate}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {f.daysSinceDeparture} days ago
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono text-slate-200">
                        {formatDateTime(f.lastLoginTimestamp)}
                      </div>
                      {f.hasPostDepartureLogin && isUnauthorized && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 mt-0.5">
                          <AlertTriangle className="w-3 h-3" /> Post-exit login detected (TC1)
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getRiskBadge(f.riskLevel)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {isUnauthorized ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/70 text-rose-300 border border-rose-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          ACTIVE (Violation)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> {f.saasUser.status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {f.deprovisionStatus === 'PENDING_APPROVAL' ? (
                        <button
                          type="button"
                          onClick={() => onSelectTicket && onSelectTicket(f.ticketId)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                        >
                          Review Ticket
                        </button>
                      ) : f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified Revoked
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-blue-400">
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
