import React, { useState } from 'react';
import { 
  Building2, 
  Github, 
  Cloud, 
  MessageSquare, 
  Shield, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
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
      icon: <Building2 className="w-4 h-4 text-red-400" />
    },
    {
      id: 'github',
      name: 'GitHub Enterprise Org',
      url: 'github.com/orgs/acmecorp/people',
      icon: <Github className="w-4 h-4 text-slate-300" />
    },
    {
      id: 'aws_iam',
      name: 'AWS IAM Management',
      url: 'console.aws.amazon.com/iam/home#/users',
      icon: <Cloud className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'slack',
      name: 'Slack Enterprise Grid',
      url: 'acmecorp.slack.com/admin',
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Live Mock SaaS Admin Consoles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official Demo Target: Realistic simulation of enterprise SaaS admin consoles demonstrating live status checks and verified state mutations.
          </p>
        </div>
      </div>

      {/* Platform Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {platforms.map(p => {
          const isSelected = selectedPlatform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatform(p.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-surface-800 text-slate-100 border-blue-500/60 shadow-sm'
                  : 'bg-surface-900 text-slate-400 border-surface-800 hover:text-slate-200 hover:bg-surface-850'
              }`}
            >
              {p.icon}
              <span>{p.name}</span>
              <span className="font-mono text-[10px] text-slate-500">
                ({users.filter(u => u.platform === p.id).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Mock Console Browser Container */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-lg">
        {/* Fake URL Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-950 border-b border-surface-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-600">https://</span>
          <span className="text-slate-300">
            {platforms.find(p => p.id === selectedPlatform)?.url}
          </span>
          <span className="ml-auto text-[11px] text-emerald-400 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Secure SSO Mock Endpoint
          </span>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 divide-y divide-surface-800">
            <thead className="bg-surface-850 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Account / User</th>
                <th className="px-4 py-3">Department / Type</th>
                <th className="px-4 py-3">Assigned Roles / Privileges</th>
                <th className="px-4 py-3">2FA / MFA</th>
                <th className="px-4 py-3">Last Active Sign-In</th>
                <th className="px-4 py-3 text-right">Console Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60 font-sans">
              {filteredUsers.map(user => {
                const isSuspended = user.status === 'SUSPENDED' || user.status === 'DEACTIVATED';
                return (
                  <tr key={user.id} className="hover:bg-surface-850/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-surface-800 grid place-items-center font-bold text-slate-300 text-xs shrink-0">
                          {user.isServiceAccount ? <Bot className="w-4 h-4 text-purple-400" /> : user.displayName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            {user.displayName}
                            {user.isServiceAccount && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                                Service Account (TC3)
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400">
                            {user.accountEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {user.department || 'General'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(r => (
                          <span 
                            key={r}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              /admin|owner|fullaccess/i.test(r)
                                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                                : 'bg-surface-800 text-slate-300 border border-surface-700'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.mfaEnabled ? (
                        <span className="text-emerald-400 font-medium">Enforced</span>
                      ) : (
                        <span className="text-amber-400 font-medium">Disabled</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-300">
                      {user.lastLoginTime.replace('T', ' ').replace('Z', '')}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {user.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
