import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  Award, 
  ShieldCheck, 
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
    }, 300);
  };

  const allPassed = results.every(r => r.passed);

  return (
    <div className="space-y-6">
      {/* Header & Run Controls with Ruling Margins */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Official Hackathon Test Cases (TC1 – TC4)
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              {results.filter(r => r.passed).length}/{results.length} Passing
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory judging validation suite executing live assertions against official brief test scenarios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunTests}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
        >
          {isRunning ? (
            <>
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Running Assertions...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Re-Run Test Suite
            </>
          )}
        </button>
      </div>

      {/* Summary Banner with Ruled Margin */}
      {allPassed && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900">
              All Official Evaluation Scenarios Passed (100% Coverage)
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              Verified identity resolution, surname mutation recovery, non-human service account exclusion, and gated deprovisioning workflows.
            </p>
          </div>
        </div>
      )}

      {/* Test Cases Ruled Cards */}
      <div className="grid gap-4">
        {results.map(test => (
          <div
            key={test.id}
            className={`rounded-lg border p-4 transition-all shadow-sm ${
              test.passed
                ? 'border-slate-200 bg-white hover:border-slate-300'
                : 'border-rose-300 bg-rose-50/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                    {test.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {test.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 pt-0.5">
                  <span className="text-slate-500 font-semibold">Scenario:</span> {test.scenario}
                </p>
              </div>

              <div className="shrink-0">
                {test.passed ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PASSED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-rose-50 text-rose-800 border border-rose-300">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> FAILED
                  </span>
                )}
              </div>
            </div>

            {/* Ruled Comparison Columns */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                  Official Expected Outcome
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {test.expectedOutcome}
                </p>
              </div>

              <div className="rounded bg-emerald-50/60 p-3 border border-emerald-200">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1 font-mono">
                  Actual Agent Demonstration
                </span>
                <p className="text-emerald-900 font-medium leading-relaxed">
                  {test.actualOutcome}
                </p>
              </div>
            </div>

            {/* Raw Evidence Payload with Ruling Borders */}
            <div className="mt-2.5 font-mono text-[11px] bg-slate-50 px-3 py-2 rounded border border-slate-200 text-slate-600 flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-medium">Evidence Record:</span>{' '}
                <span className="text-slate-900 font-semibold">{test.evidence.recordId}</span> • {test.evidence.details}
              </div>
              <div className="text-slate-500">
                {test.executedAt.slice(11, 19)} UTC
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
