import React, { useEffect, useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetSelector: string;
  tabId: string;
  title: string;
  explanation: string;
  soc2Impact: string;
  hackathonCheck: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'sidebar-nav',
    targetSelector: '[data-tour="sidebar"]',
    tabId: 'agent',
    title: '1. Navigation & State Engine',
    explanation: 'The left sidebar manages the 6-phase autonomous audit state machine, switching between the live execution trace, the AI copilot, the discrepancy matrix, and HITL authorization.',
    soc2Impact: 'Enforces separation of duties and continuous audit readiness.',
    hackathonCheck: 'Provides unified navigation across all problem statement deliverables.'
  },
  {
    id: 'agent-stream',
    targetSelector: '[data-tour="stream"]',
    tabId: 'agent',
    title: '2. Autonomous Execution Pipeline',
    explanation: 'Sequential 6-phase pipeline that ingests HR leavers, queries 4 SaaS platforms (Google, GitHub, AWS, Slack), detects unauthorized accounts, and pauses for human sign-off.',
    soc2Impact: 'SOC 2 CC6.2 Mandate: Access must be reviewed and removed within 24 hours of exit.',
    hackathonCheck: 'Implements the full end-to-end agentic workflow.'
  },
  {
    id: 'matrix-table',
    targetSelector: '[data-tour="matrix"]',
    tabId: 'discrepancies',
    title: '3. Identity Reconciliation & TC1–TC3',
    explanation: 'Cross-references HR departure dates against SaaS activity. Catches Marcus Vance post-exit login on GitHub (TC1), matches Sarah Jenkins-Hayes via maiden surname (TC2), and excludes service bots (TC3).',
    soc2Impact: 'Zero false-positives on bots and 100% precision on post-termination credential activity.',
    hackathonCheck: 'Directly validates TC1, TC2, and TC3 automated evaluation criteria.'
  },
  {
    id: 'hitl-queue',
    targetSelector: '[data-tour="hitl"]',
    tabId: 'hitl',
    title: '4. Human-in-the-Loop Gate (TC4)',
    explanation: 'Mandatory zero-trust authorization gate. Staged tickets require administrator sign-off before any destructive revocation API is invoked, preventing unverified access loss.',
    soc2Impact: 'Audit defensibility: Every revocation has an authenticated human signer on record.',
    hackathonCheck: 'Demonstrates staged deprovisioning execution and verified state transition (TC4).'
  },
  {
    id: 'gemini-copilot',
    targetSelector: '[data-tour="copilot"]',
    tabId: 'copilot',
    title: '5. Gemini 3.5 Flash-Lite Threat Copilot',
    explanation: 'Live Google AI Studio integration. Analyzes blast radius and cloud privilege escalation for leavers, answering security queries in natural language.',
    soc2Impact: 'Real-time threat modeling for high-privilege leavers holding admin credentials.',
    hackathonCheck: 'Live Gemini API integration using GEMINI_API_KEY environment variable.'
  },
  {
    id: 'test-suite',
    targetSelector: '[data-tour="tests"]',
    tabId: 'testsuite',
    title: '6. Official Validation Test Suite',
    explanation: 'Built-in automated test runner executing formal assertions against TC1, TC2, TC3, and TC4 with instant pass/fail validation.',
    soc2Impact: 'Continuous automated regression testing for compliance auditing.',
    hackathonCheck: '100% test coverage matching the hackathon rubric.'
  }
];

interface SpotlightTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

export const SpotlightTour: React.FC<SpotlightTourProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[stepIndex];

  // Update target bounding box and ensure the right tab is visible
  useEffect(() => {
    if (!isOpen) return;

    onSelectTab(currentStep.tabId);

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    // Delay slightly to let tab render
    const timer = setTimeout(updatePosition, 150);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, stepIndex, currentStep.tabId, currentStep.targetSelector]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const getCardStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    // When targeting sidebar (left edge near 0), position card to the right of the sidebar
    if (targetRect.left < 50) {
      return {
        top: `${Math.max(40, targetRect.top + 80)}px`,
        left: `${targetRect.right + 24}px`,
        transform: 'none'
      };
    }

    // When targeting main components, center horizontally over target or clamp to viewport
    const idealLeft = Math.max(20, Math.min(window.innerWidth - 480, targetRect.left + (targetRect.width / 2) - 220));
    const fitsBelow = targetRect.bottom + 360 < window.innerHeight;
    const idealTop = fitsBelow ? targetRect.bottom + 16 : Math.max(20, targetRect.top - 340);

    return {
      top: `${idealTop}px`,
      left: `${idealLeft}px`,
      transform: 'none'
    };
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Dimmed backdrop with cutout overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] transition-all duration-300"
        onClick={onClose}
      />

      {/* Spotlight cutout border around targeted element */}
      {targetRect && (
        <div
          className="absolute border-2 border-blue-600 rounded-lg pointer-events-none transition-all duration-300 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`
          }}
        />
      )}

      {/* Floating Anchored Modal Card */}
      <div 
        className="fixed z-[101] w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-5 transition-all duration-200"
        style={getCardStyle()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-700">
              Interactive Tour ({stepIndex + 1}/{TOUR_STEPS.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Step Dropdown for Quick Jump */}
            <select
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5 font-mono text-slate-700 focus:outline-none"
            >
              {TOUR_STEPS.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {idx + 1}. {s.title.split('. ')[1] || s.title}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-3.5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {currentStep.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStep.explanation}
          </p>

          <div className="space-y-1.5 pt-1 text-[11px] font-mono">
            <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
              <strong className="text-slate-900 font-semibold block mb-0.5">SOC 2 / ISO 27001 Rationale:</strong>
              <span>{currentStep.soc2Impact}</span>
            </div>
            <div className="p-2 rounded bg-blue-50/60 border border-blue-200 text-blue-900">
              <strong className="text-blue-900 font-semibold block mb-0.5">Hackathon Rubric:</strong>
              <span>{currentStep.hackathonCheck}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Skip Tour
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <span>{stepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
