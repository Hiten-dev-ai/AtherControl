import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DeprovisionTicket, SaaSPlatform } from '../types/audit';

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
      {/* Header & Batch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            Human-in-the-Loop (HITL) Deprovisioning Gate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official Policy Rule (TC4): Autonomous execution of credential revocation strictly pauses until human authorization is confirmed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono">
            Approver: <span className="text-slate-200 font-semibold">{approverName}</span>
          </div>

          {pendingTickets.length > 0 && (
            <button
              type="button"
              onClick={handleBatchApprove}
              disabled={processingId !== null}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {processingId === 'BATCH_ALL' ? 'Executing Deprovisioning...' : `Batch Approve All (${pendingTickets.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Pending Tickets Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <span>Staged Deprovision Requests Awaiting Approval</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-950 text-amber-300 border border-amber-800">
            {pendingTickets.length} pending
          </span>
        </h3>

        {pendingTickets.length === 0 ? (
          <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-8 text-center text-slate-400">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-200">No pending deprovision tickets</p>
            <p className="text-xs text-slate-500 mt-1">
              Either all unauthorized accounts have been revoked, or no audit cycle has been run.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {pendingTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-xl border border-surface-800 bg-surface-900 p-4 transition-all hover:border-surface-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-100">
                        {ticket.employeeName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({ticket.targetUserEmail})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-surface-800 text-slate-300 border border-surface-700">
                        {ticket.targetPlatform.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ticket.riskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {ticket.riskLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 pl-0.5">
                      <span className="text-slate-500">Proposed Action:</span> {ticket.actionSummary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(ticket.id)}
                      disabled={processingId !== null}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
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
        <div className="space-y-3 pt-4 border-t border-surface-800">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>Executed & Verified Deprovision History</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              {approvedTickets.length} verified
            </span>
          </h3>

          <div className="grid gap-2">
            {approvedTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-xl border border-surface-800/80 bg-surface-950/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-emerald-400 font-bold">{ticket.id}</span>
                  <span className="font-semibold text-slate-200">{ticket.employeeName}</span>
                  <span className="text-slate-400 font-mono">({ticket.targetUserEmail})</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{ticket.targetPlatform.replace('_', ' ')}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{ticket.verificationLog}</span>
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
