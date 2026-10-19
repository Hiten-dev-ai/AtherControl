import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  UserCheck, 
  FileText,
  Workflow
} from 'lucide-react';

interface TutorialGuideProps {
  onNavigateToTab: (tabId: string) => void;
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  badge: string;
  tabTarget: string;
  tabLabel: string;
  description: string;
  keyRule: string;
  hackathonEvidence: string;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({ onNavigateToTab, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: 'Phase 1: Ingest HR Roster & Define Audit Boundaries',
      badge: 'Data Ingestion',
      tabTarget: 'agent',
      tabLabel: 'Agent Blueprint',
      description: 'The auditor begins by establishing the authoritative ground truth from enterprise HRIS (Workday/BambooHR). It extracts employee separation dates, persistent work emails, and legal name changes to form the unalterable compliance boundary.',
      keyRule: 'SOC 2 CC6.2 Mandate: All accounts belonging to departed personnel must be identified within a strict 24-hour SLA.',
      hackathonEvidence: 'Evaluates 6 departed employees across multiple departments.'
    },
    {
      title: 'Phase 2: SaaS Reconnaissance & Discrepancy Detection',
      badge: 'TC1 • TC2 • TC3',
      tabTarget: 'discrepancies',
      tabLabel: 'Discrepancy Matrix',
      description: 'The agent audits live consoles (Google Workspace, GitHub, AWS IAM, Slack) comparing active credentials against the HR separation roster. It detects unauthorized active credentials and flags critical post-exit logins.',
      keyRule: 'Critical Identity Rules: Flags Marcus Vance post-exit login on GitHub (TC1), matches Sarah Jenkins-Hayes through married surname resolution (TC2), and strictly excludes system bots (TC3).',
      hackathonEvidence: '11 unauthorized active accounts flagged, 4 service accounts excluded with 0 false positives.'
    },
    {
      title: 'Phase 3: Human-in-the-Loop Deprovisioning Gate',
      badge: 'TC4 Safety Gate',
      tabTarget: 'hitl',
      tabLabel: 'HITL Approvals Queue',
      description: 'Enterprise compliance strictly prohibits fully un-monitored destructive account deletions. The agent automatically stages deprovisioning tickets with tailored remediation payloads, pausing for administrator sign-off before executing.',
      keyRule: 'Zero-Trust Safeguard: Prevents automated outages or accidental deletion of mission-critical accounts without human verification.',
      hackathonEvidence: '11 staged tickets awaiting approval. Demonstrates staged state transition to verified revocation (TC4).'
    },
    {
      title: 'Phase 4: Gemini 3.5 Flash-Lite Security Copilot',
      badge: 'Live AI Reasoning',
      tabTarget: 'copilot',
      tabLabel: 'AI Security Copilot',
      description: 'Using the live Gemini 3.5 Flash-Lite API via Google AI Studio, the auditor computes blast-radius severity scores, correlates privilege sets across cloud providers, and answers ad-hoc auditor queries in natural language.',
      keyRule: 'Executive Threat Intelligence: Evaluates real-world insider threat and data exfiltration vectors for high-privilege leavers.',
      hackathonEvidence: 'Real-time structured reasoning, blast-radius scoring, and regulatory impact assessment.'
    },
    {
      title: 'Phase 5: Automated Verification & SOC 2 Certification',
      badge: 'Audit Docket',
      tabTarget: 'report',
      tabLabel: 'Compliance Report',
      description: 'Following authorized approval, the agent executes API revocations and re-queries SaaS consoles to verify that accounts transitioned to SUSPENDED. It compiles an external-auditor certification docket exportable as JSON or PDF.',
      keyRule: 'Compliance Finality: Generates cryptographically traceable audit records mapped to SOC 2 CC6.2 and ISO/IEC 27001 A.9.2.6.',
      hackathonEvidence: 'Ready-to-sign formal audit report and automated re-query verification logs.'
    }
  ];

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigateToTab(steps[nextIdx].tabTarget);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateToTab(steps[prevIdx].tabTarget);
    }
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    onNavigateToTab(steps[idx].tabTarget);
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/70 p-4 shadow-xs mb-4">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-blue-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 text-white grid place-items-center shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Interactive Auditor Tutorial & Demonstration Walkthrough
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Guided tour of the autonomous workflow, security reasoning, and official hackathon validation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-white/80 transition-colors cursor-pointer"
          title="Dismiss tutorial"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Pills Navigation */}
      <div className="flex items-center gap-1.5 my-3 overflow-x-auto no-scrollbar">
        {steps.map((s, idx) => {
          const isSelected = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectStep(idx)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : isPast
                  ? 'bg-blue-100/80 text-blue-900 hover:bg-blue-200/80'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>0{idx + 1}.</span>
              <span className="hidden sm:inline">{s.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Current Step Content */}
      <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span>{currentStep.title}</span>
          </h3>

          <button
            type="button"
            onClick={() => onNavigateToTab(currentStep.tabTarget)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
          >
            <span>Open {currentStep.tabLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {currentStep.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Core Rule:</span>
            <span>{currentStep.keyRule}</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Evidence in Demo:</span>
            <span className="font-medium text-slate-900">{currentStep.hackathonEvidence}</span>
          </div>
        </div>
      </div>

      {/* Bottom Prev / Next Navigation Controls */}
      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Phase</span>
        </button>

        <div className="flex items-center gap-2">
          {currentStepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 shadow-xs transition-colors cursor-pointer"
            >
              <span>Next Phase ({steps[currentStepIndex + 1].badge})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Tutorial</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
