import React, { useState } from 'react';
import { 
  Building2, 
  Github, 
  Cloud, 
  MessageSquare, 
  Shield, 
  CheckCircle2, 
  Bot
} from 'lucide-react';
import { SaaSUser, SaaSPlatform } from '../types/audit';

interface MockConsolesViewerProps {
  users: SaaSUser[];
}

export const MockConsolesViewer: React.FC<MockConsolesViewerProps> = ({ users }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SaaSPlatform>('google_workspace');

  const filteredUsers = users.filter(u => u.platform === selectedPlatform);

  const platforms: { id: SaaSPlatform; name: string; url: string; icon: React.ReactNode }[] = [
    {
      id: 'google_workspace',
      name: 'Google Workspace Admin',
      url: 'admin.google.com/acmecorp.io/users',
      icon: <Building2 className="w-4 h-4 text-rose-600" />
    },
    {
      id: 'github',
      name: 'GitHub Enterprise Org',
      url: 'github.com/orgs/acmecorp/people',
      icon: <Github className="w-4 h-4 text-slate-800" />
    },
    {
      id: 'aws_iam',
      name: 'AWS IAM Management',
      url: 'console.aws.amazon.com/iam/home#/users',
      icon: <Cloud className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'slack',
      name: 'Slack Enterprise Grid',
      url: 'acmecorp.slack.com/admin',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header with Ruling Margins */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Live Mock SaaS Admin Consoles
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Demo Target: Realistic simulation of enterprise SaaS admin consoles demonstrating live status checks and verified state mutations.
          </p>
        </div>
      </div>

      {/* Platform Switcher with Ruling Border Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {platforms.map(p => {
          const isSelected = selectedPlatform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatform(p.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.icon}
              <span>{p.name}</span>
              <span className={`font-mono text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                ({users.filter(u => u.platform === p.id).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Mock Console Browser Container */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Fake URL Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>

          <span className="text-slate-400">https://</span>
          <span className="text-slate-800 font-semibold">
            {platforms.find(p => p.id === selectedPlatform)?.url}
          </span>
          <span className="ml-auto text-[11px] text-emerald-700 font-semibold flex items-center gap-1 font-mono">
            <Shield className="w-3 h-3 text-emerald-600" /> Mock SSO API Ready
          </span>
        </div>

        {/* Users Ruled Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] font-mono">
              <tr>
                <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Account / User</th>
                <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Department / Type</th>
                <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Assigned Roles / Privileges</th>
                <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">2FA / MFA</th>
                <th className="px-4 py-3 border-r border-slate-200 last:border-r-0">Last Active Sign-In</th>
                <th className="px-4 py-3 text-right">Console Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredUsers.map(user => {
                const isSuspended = user.status === 'SUSPENDED' || user.status === 'DEACTIVATED';
                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 grid place-items-center font-bold text-slate-700 text-xs shrink-0 font-mono">
                          {user.isServiceAccount ? <Bot className="w-4 h-4 text-purple-700" /> : user.displayName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {user.displayName}
                            {user.isServiceAccount && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-50 text-purple-800 border border-purple-200 font-medium">
                                Service Account (TC3)
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500">
                            {user.accountEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap border-r border-slate-100">
                      {user.department || 'General'}
                    </td>

                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(r => (
                          <span 
                            key={r}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              /admin|owner|fullaccess/i.test(r)
                                ? 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap border-r border-slate-100">
                      {user.mfaEnabled ? (
                        <span className="text-emerald-700 font-semibold font-mono">Enforced</span>
                      ) : (
                        <span className="text-amber-700 font-semibold font-mono">Disabled</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-800 border-r border-slate-100">
                      {user.lastLoginTime.replace('T', ' ').replace('Z', '')}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold font-mono bg-slate-100 text-slate-700 border border-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          {user.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          ACTIVE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
