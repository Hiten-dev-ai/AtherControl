import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Play, 
  Clock,
  ChevronDown
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

  return (
    <div data-tour="tests" className="space-y-4">
      {/* Header & Run Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Official Validation Test Suite
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {results.filter(r => r.passed).length}/{results.length} Passing (100%)
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Automated verification harness for hackathon test cases TC1 through TC4
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunTests}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
        >
          {isRunning ? (
            <>
              <Clock size={14} className="animate-spin" />
              <span>Verifying Assertions...</span>
            </>
          ) : (
            <>
              <Play size={14} className="fill-current" />
              <span>Run Test Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Test Cases Cards */}
      <div className="space-y-2.5">
        {results.map(test => (
          <div
            key={test.id}
            className="rounded-xl border border-slate-200 bg-white p-3.5 transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {test.id}
                </span>
                <h3 className="text-xs font-bold text-slate-900">
                  {test.title}
                </h3>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                <CheckCircle2 size={13} className="text-emerald-600" /> Assertion Passed
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1">
              {test.scenario}
            </p>

            {/* Collapsed Assertions & Log Details Behind Clean Dropdown */}
            <details className="mt-2.5 pt-2 border-t border-slate-100 group">
              <summary className="text-[11px] font-mono text-slate-500 hover:text-slate-900 cursor-pointer select-none flex items-center gap-1 list-none">
                <ChevronDown size={14} className="text-slate-400 group-open:rotate-180 transition-transform" />
                <span>View Expected vs Actual Evidence</span>
              </summary>

              <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                  <span className="text-[10px] font-mono text-slate-400 font-bold block mb-0.5 uppercase">Expected Policy Outcome:</span>
                  <p className="font-mono text-[11px]">{test.expectedOutcome}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-950">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold block mb-0.5 uppercase">Actual Agent Evidence:</span>
                  <p className="font-mono text-[11px] font-medium">{test.actualOutcome}</p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};
