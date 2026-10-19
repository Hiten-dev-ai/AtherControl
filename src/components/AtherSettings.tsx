import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  UserRound, 
  LockKeyhole, 
  Key, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Save, 
  Copy,
  ChevronDown
} from 'lucide-react';

export interface AuditorUser {
  name: string;
  email: string;
  role: string;
}

interface AtherSettingsProps {
  user: AuditorUser;
  onUpdateUser: (updated: AuditorUser) => void;
  onBack: () => void;
}

const SETTINGS_GROUPS = [
  {
    name: 'Personal',
    items: [
      { id: 'profile', label: 'Profile', icon: UserRound },
      { id: 'security', label: 'Security & MFA', icon: LockKeyhole },
      { id: 'credentials', label: 'Test Credentials', icon: Key },
    ]
  },
  {
    name: 'Workspace & AI',
    items: [
      { id: 'ai', label: 'AI Engine (Gemini)', icon: Sparkles },
      { id: 'policies', label: 'Audit Policies & SLA', icon: ShieldCheck },
    ]
  }
];

export const AtherSettings: React.FC<AtherSettingsProps> = ({
  user,
  onUpdateUser,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('profile');
  const [formData, setFormData] = useState<AuditorUser>({ ...user });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeGroupItem = SETTINGS_GROUPS
    .flatMap(g => g.items)
    .find(item => item.id === selectedCategory) || SETTINGS_GROUPS[0].items[0];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSwitchAccount = (newAcc: AuditorUser) => {
    setFormData(newAcc);
    onUpdateUser(newAcc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="settings-layout">
      {/* AtherPanel Left Navigation Bar */}
      <aside className="settings-navigation">
        <div className="settings-nav-heading">
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300 bg-white"
          >
            <ArrowLeft size={16} />
            <span>Back to workspace</span>
          </button>
        </div>

        <div className="settings-category-list">
          {SETTINGS_GROUPS.map(group => (
            <div key={group.name} className="settings-category-group">
              <p>{group.name}</p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = selectedCategory === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={isActive ? 'active' : ''}
                    >
                      <span>
                        <Icon size={16} />
                      </span>
                      <strong>{item.label}</strong>
                      <ChevronRight size={14} className="sidebar-item-chevron ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* AtherPanel Right Content Panel */}
      <section className="settings-content">
        <div className="settings-panel max-w-3xl">
          <div className="settings-heading">
            <span className="eyebrow">Settings</span>
            <h1>{activeGroupItem.label}</h1>
          </div>

          {/* Profile Panel */}
          {selectedCategory === 'profile' && (
            <form onSubmit={handleSaveProfile} className="settings-card space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-bold text-base grid place-items-center">
                  {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{formData.name}</h3>
                  <p className="text-xs text-slate-500">{formData.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Auditor Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {saveSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <Check size={14} /> Preferences saved!
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Test Credentials Switcher */}
          {selectedCategory === 'credentials' && (
            <div className="settings-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Evaluation Personas</h3>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Ready to Test
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'Hiten S',
                    email: 'lead.auditor@acmecorp.io',
                    role: 'Lead Information Security Auditor',
                    level: 'Level 3: Full HITL Approval & Revoke Authority',
                    active: formData.email === 'lead.auditor@acmecorp.io'
                  },
                  {
                    name: 'Alex Morgan',
                    email: 'alex.secops@acmecorp.io',
                    role: 'SecOps Administrator',
                    level: 'Level 2: Deprovisioning Executor',
                    active: formData.email === 'alex.secops@acmecorp.io'
                  },
                  {
                    name: 'Elena Rostova',
                    email: 'elena.compliance@acmecorp.io',
                    role: 'Compliance & Audit Officer',
                    level: 'Level 1: Read-Only Auditor',
                    active: formData.email === 'elena.compliance@acmecorp.io'
                  }
                ].map((persona) => (
                  <div
                    key={persona.email}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      persona.active
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{persona.name}</span>
                        {persona.active && (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-emerald-700 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{persona.role} • {persona.email}</div>
                      
                      {/* Collapsible detail dropdown */}
                      <details className="pt-1 group">
                        <summary className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer select-none flex items-center gap-1 list-none">
                          <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                          <span>Permissions</span>
                        </summary>
                        <div className="text-[11px] text-emerald-800 font-medium mt-1">
                          {persona.level}
                        </div>
                      </details>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(persona.email, persona.email)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copy email"
                      >
                        {copiedKey === persona.email ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSwitchAccount({ name: persona.name, email: persona.email, role: persona.role })}
                        disabled={persona.active}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        {persona.active ? 'Current User' : 'Switch'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & MFA */}
          {selectedCategory === 'security' && (
            <div className="settings-card space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Session Security</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] uppercase font-semibold">Session Status</span>
                  <strong className="text-emerald-700 block mt-1 font-bold">MFA Authenticated</strong>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] uppercase font-semibold">Cryptographic Binding</span>
                  <strong className="text-slate-800 block mt-1 font-bold font-mono">sha256:8f2a...c09e</strong>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Session Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="acme_audit_session_7f18b9c240fa91176e330ad"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard('acme_audit_session_7f18b9c240fa91176e330ad', 'token')}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'token' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedKey === 'token' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Engine & Gemini Configuration */}
          {selectedCategory === 'ai' && (
            <div className="settings-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Gemini 3.5 Flash-Lite Engine</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Connected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] uppercase font-semibold">Engine Target</span>
                  <strong className="text-slate-900 block mt-0.5 font-bold">gemini-3.5-flash-lite</strong>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px] uppercase font-semibold">API Key Status</span>
                  <strong className="text-emerald-700 block mt-0.5 font-bold">Configured</strong>
                </div>
              </div>

              {/* Technical Details Collapsed Behind Dropdown */}
              <details className="pt-2 group">
                <summary className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer select-none flex items-center gap-1 list-none font-semibold">
                  <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                  <span>View Engine Parameters</span>
                </summary>
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div><strong>Temperature:</strong> 0.1 (Deterministic Guardrails)</div>
                  <div><strong>Rate Limit Strategy:</strong> Zero-Rate-Limit In-Memory Cache</div>
                  <div><strong>API Source:</strong> Google AI Studio (`GEMINI_API_KEY`)</div>
                </div>
              </details>
            </div>
          )}

          {/* Audit Policies */}
          {selectedCategory === 'policies' && (
            <div className="settings-card space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Compliance SLA & Policies</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">SOC 2 CC6.2 SLA</strong>
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                    &lt; 24h Active
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">ISO 27001 Annex A.9.2.6</strong>
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                    Enforced
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Human-in-the-Loop Threshold</strong>
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-200 text-slate-800">
                    Mandatory (TC4)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
