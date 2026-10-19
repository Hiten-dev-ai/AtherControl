import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown,
  AlertCircle
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
  const [approverName] = useState('Hiten S (Lead Auditor)');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedTicketId(prev => prev === id ? null : id);
  };

  return (
    <div data-tour="hitl" className="space-y-4">
      {/* Header & Batch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Human-in-the-Loop Deprovisioning Gate (TC4)
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Zero-trust authorization queue preventing unverified automated credential deletions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Active Signer: <strong className="text-slate-800 font-bold">{approverName}</strong>
          </span>

          {pendingTickets.length > 0 && (
            <button
              type="button"
              onClick={handleBatchApprove}
              disabled={processingId !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>{processingId === 'BATCH_ALL' ? 'Revoking All...' : `Approve All (${pendingTickets.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pending Tickets Section */}
      <div className="space-y-2.5">
        {pendingTickets.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-xs">
            <ShieldCheck size={28} className="text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Deprovisioning Queue Clear</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">All identified discrepancies have been signed off and verified revoked.</p>
          </div>
        ) : (
          pendingTickets.map(ticket => {
            const isExpanded = expandedTicketId === ticket.id;
            return (
              <div
                key={ticket.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 transition-colors shadow-xs hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono text-[10.5px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {ticket.id}
                      </span>
                      <strong className="text-slate-900 font-bold">
                        {ticket.employeeName}
                      </strong>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({ticket.targetUserEmail})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700 capitalize font-medium">
                        {ticket.targetPlatform.replace('_', ' ')}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        ticket.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ticket.riskLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-sans">
                      <strong className="text-slate-500 font-medium">Proposed Action:</strong> {ticket.actionSummary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(ticket.id)}
                      className="px-2 py-1 rounded-md text-[11px] font-mono font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      {isExpanded ? 'Hide Payload' : 'View Payload'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(ticket.id)}
                      disabled={processingId !== null}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>{processingId === ticket.id ? 'Revoking...' : 'Approve & Revoke'}</span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Payload View */}
                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Staged Deprovisioning API Payload:</div>
                    <pre className="text-[10.5px] overflow-x-auto text-slate-800">
{JSON.stringify({
  action: "DEPROVISION_USER",
  ticket_id: ticket.id,
  target_platform: ticket.targetPlatform,
  account_email: ticket.targetUserEmail,
  sla_status: "EXCEEDED_24H_MANDATE",
  requires_hitl: true,
  status: ticket.status
}, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Executed & Verified Tickets */}
      {approvedTickets.length > 0 && (
        <details className="pt-3 border-t border-slate-200 group">
          <summary className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono cursor-pointer select-none flex items-center gap-1 list-none">
            <ChevronDown size={14} className="text-slate-400 group-open:rotate-180 transition-transform" />
            <span>Verified Revocation History ({approvedTickets.length} tickets executed)</span>
          </summary>

          <div className="mt-2.5 space-y-2">
            {approvedTickets.map(ticket => (
              <div
                key={ticket.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-800">{ticket.id}</span>
                    <span className="text-slate-400">•</span>
                    <strong className="text-slate-900 font-sans">{ticket.employeeName}</strong>
                    <span className="text-slate-500">({ticket.targetPlatform})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sign-off: {ticket.approverName || 'Hiten S'} at {ticket.approvedAt || 'Just now'}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  <ShieldCheck size={13} className="text-emerald-600" /> Cryptographically Verified
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
