import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  ChevronDown
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
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Agent Execution Pipeline
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            6-phase state machine with automated policy gates & HITL authorization
          </p>
        </div>

        {isWaitingApproval && (
          <button
            type="button"
            onClick={onNavigateToApprovals}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs cursor-pointer"
          >
            <span>Review Pending Approvals (TC4)</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Stepper with Ruled Vertical Margin Guide */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isActive = step.status === 'IN_PROGRESS';
          const isComplete = step.status === 'COMPLETED';
          const isWaiting = step.status === 'WAITING_HUMAN_APPROVAL';

          return (
            <div
              key={step.step}
              className={`rounded-xl border p-3.5 transition-all ${
                isActive
                  ? 'border-emerald-600 bg-white ring-1 ring-emerald-600 shadow-xs'
                  : isWaiting
                  ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                  : isComplete
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    0{idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    {step.label}
                  </h3>

                  {isComplete && (
                    <span className="text-[11px] font-mono text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 size={12} className="text-emerald-600" /> Completed
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[11px] font-mono text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Clock size={12} className="animate-spin text-emerald-600" /> Running
                    </span>
                  )}
                  {isWaiting && (
                    <span className="text-[11px] font-mono text-amber-900 font-semibold flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      <AlertTriangle size={12} className="text-amber-700" /> Pending Sign-off (TC4)
                    </span>
                  )}
                </div>

                {step.timestamp && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {step.timestamp}
                  </span>
                )}
              </div>

              {/* Collapsed Logs Behind Clean Dropdown */}
              {step.logItems.length > 0 && (
                <details className="mt-2.5 pt-2 border-t border-slate-100 group">
                  <summary className="text-[11px] font-mono text-slate-500 hover:text-slate-900 cursor-pointer select-none flex items-center gap-1.5 list-none">
                    <ChevronDown size={14} className="text-slate-400 group-open:rotate-180 transition-transform" />
                    <span>View Execution Logs & Payload ({step.logItems.length} lines)</span>
                  </summary>
                  <div className="mt-2 font-mono text-[11px] space-y-1 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {step.logItems.map((log, lIdx) => (
                      <div 
                        key={lIdx} 
                        className={`leading-relaxed ${
                          log.includes('PAUSED') ? 'text-amber-900 font-semibold bg-amber-100/60 p-1.5 rounded border border-amber-200' :
                          log.startsWith('[TC') ? 'text-slate-900 font-semibold' :
                          'text-slate-600'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
