import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Key
} from 'lucide-react';
import { OnboardingTourModal } from './OnboardingTourModal';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: string }, triggerTour?: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('hiten.dev.ai@gmail.com');
  const [password, setPassword] = useState('SuperSecretAuditorPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [role] = useState('Lead Information Security Auditor');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  const proceedLogin = (user: { name: string; email: string; role: string }) => {
    const skipTour = localStorage.getItem('skip_audit_tour') === 'true';
    if (skipTour) {
      onLogin(user, false);
    } else {
      setPendingUser(user);
      setShowOnboardingPrompt(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      proceedLogin({
        name: 'Hiten S',
        email,
        role
      });
    }, 300);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      proceedLogin({
        name: 'Hiten S',
        email: 'hiten.dev.ai@gmail.com',
        role: 'Lead Information Security Auditor'
      });
    }, 200);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans">
      <OnboardingTourModal
        isOpen={showOnboardingPrompt}
        onStartTour={() => {
          setShowOnboardingPrompt(false);
          if (pendingUser) onLogin(pendingUser, true);
        }}
        onSkip={() => {
          setShowOnboardingPrompt(false);
          if (pendingUser) onLogin(pendingUser, false);
        }}
      />

      <section className="login-card w-full max-w-[420px] p-8 bg-white border border-[#dce3e8] rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-1">
          <div className="w-12 h-12 rounded-xl bg-slate-900 grid place-items-center text-white shadow-xs">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-[10.5px] font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            ATHERCONTROL
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase block">
            ATHERCONTROL SECURITY
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#18252e] mt-0.5">
            Welcome back.
          </h1>
          <p className="text-xs text-[#5b6b77] mt-1 font-mono">
            Your access review. Your compliance. Your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#18252e] font-mono mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#dce3e8] rounded-lg bg-white text-[#18252e] focus:outline-none focus:border-emerald-600 transition-colors"
              placeholder="auditor@acmecorp.io"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#18252e] font-mono">
                Password / Token
              </label>
              <span className="text-[10px] text-slate-400 font-mono">SOC 2 MFA</span>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-xs border border-[#dce3e8] rounded-lg bg-white text-[#18252e] focus:outline-none focus:border-emerald-600 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Audit Workspace'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full py-2.5 px-3 rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-emerald-700" />
            <span>One-Click Demo Login (Hiten S — Lead Auditor)</span>
          </button>
        </div>

        {/* Hackathon Compliance Badges */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10.5px] font-mono text-[#5b6b77]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span>SOC 2 CC6.2 Mandate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span>Gemini 3.5 Flash-Lite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span>Human-in-the-Loop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span>TC1–TC4 Automated</span>
          </div>
        </div>
      </section>

      <p className="mt-4 text-center text-[11px] text-[#5b6b77] font-mono">
        Ziro Digital Agentic AI Hackathon 2026 • Problem ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
      </p>
    </main>
  );
};
