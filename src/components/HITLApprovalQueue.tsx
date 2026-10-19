import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { DeprovisionTicket } from '../types/audit';

interface HITLApprovalQueueProps {
  tickets: DeprovisionTicket[];
  onApproveTicket: (ticketId: string, approverName: string) => Promise<void>;
  onApproveAll: (approverName: string) => Promise<void>;
}

export const HITLApprovalQueue: React.FC<HITLApprovalQueueProps> = ({
  tickets,
  onApproveTicket,
  onApproveAll
}) => {
  const [approverName, setApproverName] = useState('IT Security Admin (Hiten S)');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingTickets = tickets.filter(t => t.status === 'AWAITING_APPROVAL');
  const approvedTickets = tickets.filter(t => t.status === 'APPROVED' || t.status === 'EXECUTED_AND_VERIFIED');

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await onApproveTicket(id, approverName);
    } finally {
      setProcessingId(null);
    }
  };

  const handleBatchApprove = async () => {
    setProcessingId('BATCH_ALL');
    try {
      await onApproveAll(approverName);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Batch Controls with Ruling Margins */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Human-in-the-Loop (HITL) Deprovisioning Gate
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Policy Rule (TC4): Autonomous execution of credential revocation strictly pauses until human authorization is confirmed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Approver: <span className="text-slate-800 font-semibold">{approverName}</span>
          </div>

          {pendingTickets.length > 0 && (
            <button
              type="button"
              onClick={handleBatchApprove}
              disabled={processingId !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {processingId === 'BATCH_ALL' ? 'Executing Deprovisioning...' : `Batch Approve All (${pendingTickets.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Pending Tickets Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Staged Deprovision Requests Awaiting Approval</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            {pendingTickets.length} pending
          </span>
        </h3>

        {pendingTickets.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-800">No pending deprovision tickets</p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Either all unauthorized accounts have been revoked, or no audit cycle has been run.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {pendingTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {ticket.employeeName}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        ({ticket.targetUserEmail})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {ticket.targetPlatform.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        ticket.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border border-rose-300' : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {ticket.riskLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 pl-0.5">
                      <span className="text-slate-500 font-medium">Proposed Action:</span> {ticket.actionSummary}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="text-slate-500 font-medium">AI Blast Radius:</span>
                      {ticket.targetPlatform === 'github' && (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                          Critical • Source code exfiltration, GPG/SSH keys, Org Admin
                        </span>
                      )}
                      {ticket.targetPlatform === 'aws_iam' && (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                          Critical • Production cloud infrastructure, PowerUserAccess, CLI API keys
                        </span>
                      )}
                      {ticket.targetPlatform === 'google_workspace' && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          High • Corporate email, Google Drive files, OAuth SSO token persistence
                        </span>
                      )}
                      {ticket.targetPlatform === 'slack' && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                          Moderate • Confidential executive channels, internal message history
                        </span>
                      )}
                      <span className="text-slate-400">SOC 2 CC6.2 Mandate</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(ticket.id)}
                      disabled={processingId !== null}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {processingId === ticket.id ? 'Revoking...' : 'Approve & Revoke'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Executed & Verified Tickets */}
      {approvedTickets.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>Executed & Verified Deprovision History</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              {approvedTickets.length} verified
            </span>
          </h3>

          <div className="grid gap-2">
            {approvedTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-emerald-800 font-bold">{ticket.id}</span>
                  <span className="font-semibold text-slate-900">{ticket.employeeName}</span>
                  <span className="text-slate-500 font-mono">({ticket.targetUserEmail})</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-700 font-medium">{ticket.targetPlatform.replace('_', ' ')}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-mono">{ticket.verificationLog}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-500 shrink-0">
                  Approved by {ticket.approver} at {ticket.approvedAt?.slice(11, 19)} UTC
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
