import React from 'react';
import { 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { AgentStepTrace } from '../types/audit';

interface AgentExecutionStreamProps {
  steps: AgentStepTrace[];
  currentStepIndex: number;
  isRunning: boolean;
  isWaitingApproval: boolean;
  onNavigateToApprovals: () => void;
}

export const AgentExecutionStream: React.FC<AgentExecutionStreamProps> = ({
  steps,
  isWaitingApproval,
  onNavigateToApprovals
}) => {
  return (
    <div data-tour="stream" className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
          Audit Execution
        </h2>

        {isWaitingApproval && (
          <button
            type="button"
            onClick={onNavigateToApprovals}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Review Pending Approvals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Stepper with Ruled Vertical Margin Guide */}
      <div className="relative pl-4 space-y-2 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
        {steps.map((step, idx) => {
          const isActive = step.status === 'IN_PROGRESS';
          const isComplete = step.status === 'COMPLETED';
          const isWaiting = step.status === 'WAITING_HUMAN_APPROVAL';

          return (
            <div
              key={step.step}
              className={`rounded-md border p-2.5 transition-colors ${
                isActive
                  ? 'border-slate-900 bg-white ring-1 ring-slate-900'
                  : isWaiting
                  ? 'border-amber-300 bg-amber-50/40'
                  : isComplete
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-xs font-semibold text-slate-900">
                    {step.label}
                  </h3>

                  {isComplete && (
                    <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[11px] font-mono text-blue-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin text-blue-600" /> Running
                    </span>
                  )}
                  {isWaiting && (
                    <span className="text-[11px] font-mono text-amber-800 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Pending Sign-off
                    </span>
                  )}
                </div>

                {step.timestamp && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {step.timestamp}
                  </span>
                )}
              </div>

              {/* Execution Logs */}
              {step.logItems.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 font-mono text-xs space-y-1 text-slate-600">
                  {step.logItems.map((log, lIdx) => (
                    <div 
                      key={lIdx} 
                      className={`leading-relaxed ${
                        log.includes('PAUSED') ? 'text-amber-900 font-semibold bg-amber-50 p-1.5 rounded border border-amber-200' :
                        log.startsWith('[TC') ? 'text-slate-900 font-medium' :
                        'text-slate-600'
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
