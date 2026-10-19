import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onStartTour,
  onSkip
}) => {
  const [doNotAskAgain, setDoNotAskAgain] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    if (doNotAskAgain) {
      localStorage.setItem('skip_audit_tour', 'true');
    }
    onStartTour();
  };

  const handleDismiss = () => {
    if (doNotAskAgain) {
      localStorage.setItem('skip_audit_tour', 'true');
    }
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white grid place-items-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-800">
              AUDITOR ONBOARDING
            </span>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Welcome, Lead Auditor!
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Would you like a 1-minute interactive walkthrough of the autonomous leaver review pipeline and HITL sign-off gates?
        </p>

        <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={doNotAskAgain}
            onChange={(e) => setDoNotAskAgain(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
          />
          <span>Do not ask again</span>
        </label>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Go Straight to Dashboard
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
          >
            <span>Start Interactive Tour</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
