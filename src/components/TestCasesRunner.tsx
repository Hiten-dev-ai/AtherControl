import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  Award, 
  ShieldCheck, 
  FileCode, 
  Terminal,
  Clock
} from 'lucide-react';
import { TestCaseResult } from '../types/audit';
import { TestCaseRunner } from '../services/testSuiteRunner';

export const TestCasesRunner: React.FC = () => {
  const [results, setResults] = useState<TestCaseResult[]>(() => TestCaseRunner.runAllTests());
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = TestCaseRunner.runAllTests();
      setResults(res);
      setIsRunning(false);
    }, 400);
  };

  const allPassed = results.every(r => r.passed);

  return (
    <div className="space-y-6">
      {/* Header & Run Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Official Hackathon Test Cases (TC1 – TC4)
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              {results.filter(r => r.passed).length}/{results.length} Passing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory judging validation suite executing live assertions against official brief test scenarios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunTests}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isRunning ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Running Assertions...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Re-Run Test Suite
            </>
          )}
        </button>
      </div>

      {/* Summary Banner */}
      {allPassed && (
        <div className="rounded-xl border border-emerald-800/80 bg-emerald-950/30 p-4 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-200">
              All Official Evaluation Scenarios Passed (100% Coverage)
            </h4>
            <p className="text-xs text-emerald-400/90 mt-0.5">
              Verified identity resolution, surname mutation recovery, non-human service account exclusion, and gated deprovisioning workflows.
            </p>
          </div>
        </div>
      )}

      {/* Test Cases Cards */}
      <div className="grid gap-4">
        {results.map(test => (
          <div
            key={test.id}
            className={`rounded-xl border p-5 transition-all ${
              test.passed
                ? 'border-surface-700 bg-surface-900 shadow-sm'
                : 'border-rose-800 bg-rose-950/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-surface-800 border border-surface-700 text-blue-400">
                    {test.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">
                    {test.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 pt-1">
                  <span className="text-slate-500 font-semibold">Scenario:</span> {test.scenario}
                </p>
              </div>

              <div className="shrink-0">
                {test.passed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                )}
              </div>
            </div>

            {/* Test Details */}
            <div className="mt-4 pt-3 border-t border-surface-800/80 grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-surface-950 p-3 border border-surface-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Official Expected Outcome
                </span>
                <p className="text-slate-300">
                  {test.expectedOutcome}
                </p>
              </div>

              <div className="rounded-lg bg-surface-950 p-3 border border-surface-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Actual Agent Demonstration
                </span>
                <p className={test.passed ? 'text-emerald-300 font-medium' : 'text-rose-400'}>
                  {test.actualOutcome}
                </p>
              </div>
            </div>

            {/* Raw Evidence Payload */}
            <div className="mt-3 font-mono text-[11px] bg-surface-950/80 px-3 py-2 rounded-lg border border-surface-800 text-slate-400 flex items-center justify-between">
              <div>
                <span className="text-slate-500">Evidence Record:</span>{' '}
                <span className="text-blue-400">{test.evidence.recordId}</span> • {test.evidence.details}
              </div>
              <div className="text-slate-600">
                {test.executedAt.slice(11, 19)} UTC
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
