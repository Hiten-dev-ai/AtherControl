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
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded animate-pulse">
            <Clock className="w-3 h-3 animate-spin text-blue-600" /> In Progress
          </span>
        );
      case 'WAITING_HUMAN_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Waiting Human Approval
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            <CircleDashed className="w-3 h-3 text-slate-400" /> Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info with Ruling Margins */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Official Agent Blueprint Execution
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              6 PHASES
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic autonomous audit lifecycle mapping directly to Ziro Digital official specifications.
          </p>
        </div>

        {isWaitingApproval && (
          <button
            type="button"
            onClick={onNavigateToApprovals}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-sm cursor-pointer"
          >
            Review Pending Deprovision Tickets
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </button>
        )}
      </div>

      {/* Stepper with Ruled Vertical Margin Guide */}
      <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isActive = step.status === 'IN_PROGRESS';
          const isComplete = step.status === 'COMPLETED';
          const isWaiting = step.status === 'WAITING_HUMAN_APPROVAL';

          return (
            <div
              key={step.step}
              className={`rounded-lg border p-4 transition-all duration-150 ${
                isActive
                  ? 'border-slate-900 bg-white ring-1 ring-slate-900 shadow-sm'
                  : isWaiting
                  ? 'border-amber-300 bg-amber-50/30'
                  : isComplete
                  ? 'border-slate-200 bg-white shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-md grid place-items-center shrink-0 mt-0.5 ${
                    isComplete
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : isActive
                      ? 'bg-slate-900 border border-slate-900 text-white'
                      : isWaiting
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}>
                    {getStepIcon(step.step)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">
                        {step.label}
                      </h3>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
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

              {/* Execution Logs / Ruled Margin Console Output */}
              {step.logItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 font-mono text-xs space-y-1 pl-11">
                  <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 text-slate-700">
                    {step.logItems.map((log, lIdx) => (
                      <div 
                        key={lIdx} 
                        className={`leading-relaxed ${
                          log.startsWith('[TC1') ? 'text-rose-700 font-semibold' :
                          log.startsWith('[TC2') ? 'text-blue-700 font-semibold' :
                          log.startsWith('[TC3') ? 'text-purple-700 font-semibold' :
                          log.startsWith('[TC4') ? 'text-emerald-700 font-semibold' :
                          log.includes('PAUSED') ? 'text-amber-900 font-bold bg-amber-100/70 p-2 rounded border border-amber-300' :
                          'text-slate-600'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
