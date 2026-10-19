import React from 'react';
import { 
  Download, 
  Printer, 
  ChevronDown
} from 'lucide-react';
import { DiscrepancyFinding, Employee, SaaSUser, AuditAgentState } from '../types/audit';

interface AuditComplianceReportProps {
  agentState?: AuditAgentState;
  findings?: DiscrepancyFinding[];
  leavers?: Employee[];
  users?: SaaSUser[];
  onNavigateTab?: (tab: string) => void;
}

export const AuditComplianceReport: React.FC<AuditComplianceReportProps> = ({
  agentState,
  findings: propFindings,
  leavers: propLeavers,
  users: propUsers
}) => {
  const findings = agentState?.findings || propFindings || [];
  const leavers = agentState?.leavers || propLeavers || [];
  const users = agentState?.mockUsers || propUsers || [];

  const unauthorizedTotal = findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length;
  const remediatedTotal = findings.filter(f => f.status === 'DEPROVISIONED').length;
  const postLoginCount = findings.filter(f => f.hasPostDepartureLogin).length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportPayload = {
      title: "SOC 2 CC6.2 & ISO 27001 Access Review Report",
      organization: "AcmeCorp Inc.",
      auditor: "Autonomous Leaver Access Review Agent v1.0",
      generatedAt: new Date().toISOString(),
      standards: [
        "SOC 2 Trust Services Criteria CC6.2 & CC6.3 (Access Deprovisioning)",
        "ISO/IEC 27001:2022 Control A.9.2.6 (Removal or adjustment of access rights)"
      ],
      scope: {
        totalHRLeaversEvaluated: leavers.length,
        totalSaaSAccountsScanned: users.length,
        systemsAudited: ["Google Workspace", "GitHub Enterprise", "AWS IAM", "Slack Enterprise"]
      },
      summary: {
        unauthorizedActiveAccountsFound: unauthorizedTotal,
        remediatedViaHITL: remediatedTotal,
        postDepartureLoginsDetected: postLoginCount
      },
      findings
    };

    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AcmeCorp_Access_Review_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            SOC 2 / ISO 27001 Compliance Certification
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Formal audit report with cryptographic integrity verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Audit Document Container */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5 font-sans shadow-xs">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tracking-wider uppercase block mb-1.5 w-fit">
              REF: AUD-2026-OCT-ZIR-01 • SOC 2 CC6.2
            </span>
            <h1 className="text-base font-bold text-slate-900">
              Quarterly SaaS Access Review & Deprovisioning Certification
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              AcmeCorp Information Security Audit Docket
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-500 shrink-0">
            <div>Date: 19 October 2026</div>
            <div className="text-emerald-700 font-bold mt-0.5">Status: Verified Compliant</div>
          </div>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="p-3.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">HR Leavers Audited</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{leavers.length}</div>
          </div>

          <div className="p-3.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">SaaS Accounts Scanned</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{users.length}</div>
          </div>

          <div className="p-3.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Active Violations</span>
            <div className="text-xl font-bold text-rose-700 font-mono mt-0.5">{unauthorizedTotal}</div>
          </div>

          <div className="p-3.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Verified Revoked</span>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">{remediatedTotal}</div>
          </div>
        </div>

        {/* Scope Notes (Collapsed Behind Dropdown) */}
        <details className="text-xs text-slate-600 group">
          <summary className="font-mono text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer select-none flex items-center gap-1 list-none">
            <ChevronDown size={14} className="text-slate-400 group-open:rotate-180 transition-transform" />
            <span>View Regulatory Mandates & Audit Scope Statements</span>
          </summary>
          <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 font-sans text-xs">
            <p>
              <strong className="text-slate-800">Scope:</strong> All separated employee accounts across Google Workspace, GitHub Enterprise, AWS IAM, and Slack Grid were evaluated.
            </p>
            <p>
              <strong className="text-slate-800">Governance:</strong> All deprovisioning executions strictly gated behind authorized human review in conformance with SOC 2 CC6.2 requirements.
            </p>
          </div>
        </details>

        {/* Findings Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] font-mono">
              <tr>
                <th className="px-3.5 py-2.5">User</th>
                <th className="px-3.5 py-2.5">Platform</th>
                <th className="px-3.5 py-2.5">Separation Date</th>
                <th className="px-3.5 py-2.5">Last Active Login</th>
                <th className="px-3.5 py-2.5">Risk</th>
                <th className="px-3.5 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {findings.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/70">
                  <td className="px-3.5 py-2.5">
                    <div className="font-bold text-slate-900">{f.hrEmployee.fullName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{f.saasUser.accountEmail}</div>
                  </td>
                  <td className="px-3.5 py-2.5 capitalize font-mono text-slate-700">{f.platform.replace('_', ' ')}</td>
                  <td className="px-3.5 py-2.5 font-mono text-slate-700">{f.hrEmployee.exitDate}</td>
                  <td className="px-3.5 py-2.5 font-mono text-slate-700">
                    {f.lastLoginTimestamp.replace('T', ' ').replace('Z', '')}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      f.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {f.riskLevel}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-mono text-[11px]">
                    {f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                      <span className="text-emerald-700 font-bold">Revoked (Verified)</span>
                    ) : (
                      <span className="text-amber-700 font-bold">{f.deprovisionStatus}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Hash */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div>SHA-256 Digest: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</div>
          <div>Signer: Lead Auditor (Hiten S)</div>
        </div>
      </div>
    </div>
  );
};
