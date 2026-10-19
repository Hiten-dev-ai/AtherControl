import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  ShieldCheck 
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
  const [approverName] = useState('IT Security Admin (Hiten S)');
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
    <div data-tour="hitl" className="space-y-4">
      {/* Header & Batch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
          Human-in-the-Loop Deprovisioning Queue
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Signer: <strong className="text-slate-800 font-medium">{approverName}</strong>
          </span>

          {pendingTickets.length > 0 && (
            <button
              type="button"
              onClick={handleBatchApprove}
              disabled={processingId !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{processingId === 'BATCH_ALL' ? 'Revoking...' : `Approve All (${pendingTickets.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pending Tickets Section */}
      <div className="space-y-2">
        {pendingTickets.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-400">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-700">No pending deprovisioning tickets</p>
          </div>
        ) : (
          pendingTickets.map(ticket => (
            <div
              key={ticket.id}
              className="rounded-md border border-slate-200 bg-white p-2.5 transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono text-[11px] font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {ticket.id}
                    </span>
                    <span className="font-medium text-slate-900">
                      {ticket.employeeName}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {ticket.targetUserEmail}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 capitalize">
                      {ticket.targetPlatform.replace('_', ' ')}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${
                      ticket.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ticket.riskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="text-slate-400">Action:</span> {ticket.actionSummary}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApprove(ticket.id)}
                    disabled={processingId !== null}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{processingId === ticket.id ? 'Revoking...' : 'Approve & Revoke'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Executed & Verified Tickets */}
      {approvedTickets.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono block">
            Verified Revocation History ({approvedTickets.length})
          </span>

          <div className="space-y-1.5">
            {approvedTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-emerald-700 font-semibold">{ticket.id}</span>
                  <span className="font-medium text-slate-900">{ticket.employeeName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({ticket.targetUserEmail})</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 capitalize">{ticket.targetPlatform.replace('_', ' ')}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-mono text-[11px]">{ticket.verificationLog}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 shrink-0">
                  Verified by {ticket.approver}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
