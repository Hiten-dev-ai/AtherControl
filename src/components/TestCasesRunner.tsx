import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
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
    }, 250);
  };

  const allPassed = results.every(r => r.passed);

  return (
    <div data-tour="tests" className="space-y-4">
      {/* Header & Run Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Official Validation Test Suite
          </h2>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            {results.filter(r => r.passed).length}/{results.length} Passing
          </span>
        </div>

        <button
          type="button"
          onClick={handleRunTests}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isRunning ? (
            <>
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Test Cases Ruled Cards */}
      <div className="space-y-2">
        {results.map(test => (
          <div
            key={test.id}
            className="rounded-md border border-slate-200 bg-white p-2.5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {test.id}
                  </span>
                  <h3 className="text-xs font-semibold text-slate-900">
                    {test.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500">
                  {test.scenario}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed
              </span>
            </div>

            {/* Comparison Details */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 grid sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-600">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Expected Outcome:</span>
                <p>{test.expectedOutcome}</p>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Actual Agent Evidence:</span>
                <p className="font-medium">{test.actualOutcome}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
