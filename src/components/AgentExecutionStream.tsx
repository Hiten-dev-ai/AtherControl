import React from 'react';
import { 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  UserCheck, 
  ArrowRight,
  Database,
  Search,
  KeyRound,
  FileText
} from 'lucide-react';
import { AgentStepTrace, AgentStepName } from '../types/audit';

interface AgentExecutionStreamProps {
  steps: AgentStepTrace[];
  currentStepIndex: number;
  isRunning: boolean;
  isWaitingApproval: boolean;
  onNavigateToApprovals: () => void;
}

export const AgentExecutionStream: React.FC<AgentExecutionStreamProps> = ({
  steps,
  currentStepIndex,
  isRunning,
  isWaitingApproval,
  onNavigateToApprovals
}) => {
  const getStepIcon = (name: AgentStepName) => {
    switch (name) {
      case 'UNDERSTAND':
        return <Database className="w-4 h-4" />;
      case 'REASON':
        return <KeyRound className="w-4 h-4" />;
      case 'BROWSE':
        return <Search className="w-4 h-4" />;
      case 'TAKE_ACTION':
        return <UserCheck className="w-4 h-4" />;
      case 'VERIFY':
        return <ShieldAlert className="w-4 h-4" />;
      case 'REPORT':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: AgentStepTrace['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded animate-pulse">
            <Clock className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'WAITING_HUMAN_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 border border-amber-700/80 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" /> Waiting Human Approval
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-surface-900 border border-surface-800 px-2 py-0.5 rounded">
            <CircleDashed className="w-3 h-3" /> Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            Official Agent Blueprint Execution
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic 6-phase autonomous audit cycle mapping directly to official catalogue specifications.
          </p>
        </div>

        {isWaitingApproval && (
          <button
            type="button"
            onClick={onNavigateToApprovals}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
          >
            Review Pending Deprovision Tickets
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Stepper Grid */}
      <div className="grid gap-4">
        {steps.map((step, idx) => {
          const isActive = step.status === 'IN_PROGRESS';
          const isComplete = step.status === 'COMPLETED';
          const isWaiting = step.status === 'WAITING_HUMAN_APPROVAL';

          return (
            <div
              key={step.step}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isActive
                  ? 'border-blue-500/50 bg-surface-850 shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]'
                  : isWaiting
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : isComplete
                  ? 'border-surface-700 bg-surface-900'
                  : 'border-surface-800/60 bg-surface-950/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 mt-0.5 ${
                    isComplete
                      ? 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-400'
                      : isActive
                      ? 'bg-blue-950/50 border border-blue-800/60 text-blue-400'
                      : isWaiting
                      ? 'bg-amber-950/50 border border-amber-800/60 text-amber-400'
                      : 'bg-surface-800 border border-surface-700 text-slate-500'
                  }`}>
                    {getStepIcon(step.step)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-100">
                        {step.label}
                      </h3>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {step.timestamp && (
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {step.timestamp}
                  </span>
                )}
              </div>

              {/* Execution Logs / Evidence Details */}
              {step.logItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-800/70 font-mono text-xs text-slate-300 space-y-1.5 pl-11">
                  {step.logItems.map((log, lIdx) => (
                    <div 
                      key={lIdx} 
                      className={`leading-relaxed ${
                        log.startsWith('[TC1') ? 'text-rose-400 font-semibold' :
                        log.startsWith('[TC2') ? 'text-cyan-400 font-semibold' :
                        log.startsWith('[TC3') ? 'text-purple-400 font-semibold' :
                        log.startsWith('[TC4') ? 'text-emerald-400 font-semibold' :
                        log.includes('PAUSED') ? 'text-amber-300 font-bold bg-amber-950/30 p-2 rounded border border-amber-800/50' :
                        'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
