import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Key,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('hiten.dev.ai@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role] = useState('Lead Information Security Auditor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Hiten S',
        email,
        role
      });
      setIsLoading(false);
    }, 350);
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Hiten S',
        email: 'hiten.dev.ai@gmail.com',
        role: 'Lead Information Security Auditor'
      });
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Shield Logo */}
        <div className="w-12 h-12 rounded-xl bg-slate-900 mx-auto flex items-center justify-center text-white shadow-sm mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-center text-xl font-bold tracking-tight text-slate-900">
          AcmeCorp Security & Compliance
        </h1>
        <p className="mt-1 text-center text-xs text-slate-500 font-mono">
          Leaver Access Review & Deprovisioning Auditor
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-slate-200 rounded-xl shadow-sm sm:px-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Auditor Sign In
              </span>
              <span className="text-[11px] text-slate-500">
                Authorized SOC 2 / ISO 27001 Access Only
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SSO Ready
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 font-mono">
                Work Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                  placeholder="auditor@acmecorp.io"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700 font-mono">
                  Authentication Token / Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">SOC 2 MFA</span>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-slate-900 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Audit Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>One-Click Demo Login (Hiten S — Lead Auditor)</span>
            </button>
          </div>

          {/* System Compliance Badges */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>SOC 2 CC6.2 Mandate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Gemini 3.5 Flash-Lite</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Human-in-the-Loop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>TC1–TC4 Automated</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400 font-mono">
          Ziro Digital Agentic AI Hackathon 2026 • Problem ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
        </p>
      </div>
    </div>
  );
};
