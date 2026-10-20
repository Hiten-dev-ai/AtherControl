import React, { useEffect, useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetSelector: string;
  tabId: string;
  title: string;
  text: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'sidebar-nav',
    targetSelector: '[data-tour="sidebar"]',
    tabId: 'dashboard',
    title: '1. Dashboard & Navigation',
    text: 'The left sidebar and dashboard display real-time access violation metrics, active SaaS consoles, and auditor personas. Use this central hub to monitor overall SOC 2 compliance.'
  },
  {
    id: 'agent-stream',
    targetSelector: '[data-tour="stream"]',
    tabId: 'agent',
    title: '2. Autonomous Execution Pipeline',
    text: 'This 6-phase autonomous state machine ingests HR leavers, queries SaaS APIs, and correlates active credentials. It automatically pauses at Human-in-the-Loop gates before invoking revocation APIs.'
  },
  {
    id: 'matrix-table',
    targetSelector: '[data-tour="matrix"]',
    tabId: 'discrepancies',
    title: '3. Discrepancy Matrix (TC1–TC3)',
    text: 'Cross-references departure dates against SaaS activity to flag unauthorized leaver accounts (TC1 & TC2). Non-human service bot accounts are automatically excluded to eliminate false positives (TC3).'
  },
  {
    id: 'hitl-queue',
    targetSelector: '[data-tour="hitl"]',
    tabId: 'hitl',
    title: '4. HITL Approval Gate (TC4)',
    text: 'Zero-trust authorization gate requiring authenticated human sign-off before deprovisioning actions execute. Approved tickets trigger verified API revocations in compliance with TC4.'
  },
  {
    id: 'gemini-copilot',
    targetSelector: '[data-tour="copilot"]',
    tabId: 'copilot',
    title: '5. Gemini 3.5 Flash-Lite Copilot',
    text: 'Powered by live Google AI Studio integration to analyze blast radius and high-privilege IAM roles. Ask questions about leaver risks or regulatory compliance in natural language.'
  },
  {
    id: 'test-suite',
    targetSelector: '[data-tour="tests"]',
    tabId: 'testsuite',
    title: '6. Validation Test Suite',
    text: 'Built-in automated test suite executing formal assertions for TC1 through TC4 with instant validation. Access Settings to customize auditor profiles, test credentials, and compliance policies.'
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

    const timer = setTimeout(updatePosition, 180);
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

    // Position next to sidebar when targeting sidebar
    if (targetRect.left < 50) {
      return {
        top: `${Math.max(30, targetRect.top + 70)}px`,
        left: `${targetRect.right + 20}px`,
        transform: 'none'
      };
    }

    const idealLeft = Math.max(20, Math.min(window.innerWidth - 440, targetRect.left + (targetRect.width / 2) - 210));
    const fitsBelow = targetRect.bottom + 220 < window.innerHeight;
    const idealTop = fitsBelow ? targetRect.bottom + 14 : Math.max(20, targetRect.top - 200);

    return {
      top: `${idealTop}px`,
      left: `${idealLeft}px`,
      transform: 'none'
    };
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto overflow-hidden">
      {/* Spotlight cutout outline with massive outer shadow - inside is 100% sharp and unblurred */}
      {targetRect ? (
        <div
          className="fixed border-2 border-emerald-500 rounded-lg pointer-events-none transition-all duration-200 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`
          }}
        />
      ) : (
        <div 
          className="fixed inset-0 bg-slate-950/60 transition-all duration-200"
          onClick={onClose}
        />
      )}

      {/* Invisible backdrop to capture clicks outside card */}
      <div 
        className="fixed inset-0 bg-transparent"
        onClick={onClose}
      />

      {/* Floating Anchored Modal Card (Condensed strictly to 1-2 sentences) */}
      <div 
        className="fixed z-[101] w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-4 transition-all duration-150"
        style={getCardStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              Interactive Tour ({stepIndex + 1}/{TOUR_STEPS.length})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              aria-label="Select tour step"
              className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-mono text-slate-700 focus:outline-none"
            >
              {TOUR_STEPS.map((s, idx) => (
                <option key={s.id} value={idx}>
                  Step {idx + 1}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close tour"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content Body: Exactly 1 to 2 sentences */}
        <div className="py-3 space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {currentStep.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {currentStep.text}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Skip
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
            >
              <span>{stepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
