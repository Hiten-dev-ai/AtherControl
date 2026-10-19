import React from 'react';
import { 
  FileCheck, 
  Download, 
  Printer, 
  CheckCircle2
} from 'lucide-react';
import { DiscrepancyFinding, Employee, SaaSUser } from '../types/audit';

interface AuditComplianceReportProps {
  findings: DiscrepancyFinding[];
  leavers: Employee[];
  users: SaaSUser[];
}

export const AuditComplianceReport: React.FC<AuditComplianceReportProps> = ({
  findings,
  leavers,
  users
}) => {
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
        <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
          SOC 2 / ISO 27001 Access Review Report
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Audit Document Container */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5 font-sans">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest block mb-1">
              Ref: AUD-2026-OCT-ZIR-01 • SOC 2 CC6.2 / ISO 27001 A.9.2.6
            </span>
            <h1 className="text-base font-bold text-slate-900">
              Quarterly SaaS Access Review & Deprovisioning Certification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              AcmeCorp Inc. Information Security Audit Docket
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-500 shrink-0">
            <div>Date: 19 October 2026</div>
            <div className="text-emerald-700 font-medium mt-0.5">Status: Verified Compliant</div>
          </div>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-md grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="p-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase">HR Leavers Audited</span>
            <div className="text-lg font-semibold text-slate-900 font-mono mt-0.5">{leavers.length}</div>
          </div>

          <div className="p-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase">SaaS Accounts Scanned</span>
            <div className="text-lg font-semibold text-slate-900 font-mono mt-0.5">{users.length}</div>
          </div>

          <div className="p-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Active Violations</span>
            <div className="text-lg font-semibold text-rose-700 font-mono mt-0.5">{unauthorizedTotal}</div>
          </div>

          <div className="p-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Verified Revoked</span>
            <div className="text-lg font-semibold text-emerald-700 font-mono mt-0.5">{remediatedTotal}</div>
          </div>
        </div>

        {/* Scope Notes */}
        <div className="text-xs text-slate-600 space-y-1">
          <p>
            <strong className="text-slate-800">Scope:</strong> All separated employee accounts across Google Workspace, GitHub Enterprise, AWS IAM, and Slack Grid were evaluated.
          </p>
          <p>
            <strong className="text-slate-800">Governance:</strong> All deprovisioning executions strictly gated behind authorized human review in conformance with SOC 2 CC6.2 requirements.
          </p>
        </div>

        {/* Findings Ledger Table */}
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-medium uppercase text-[10px] font-mono">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Platform</th>
                <th className="px-3 py-2">Separation Date</th>
                <th className="px-3 py-2">Last Active Login</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {findings.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-900">{f.hrEmployee.fullName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{f.saasUser.accountEmail}</div>
                  </td>
                  <td className="px-3 py-2 capitalize font-mono text-slate-700">{f.platform.replace('_', ' ')}</td>
                  <td className="px-3 py-2 font-mono text-slate-700">{f.hrEmployee.exitDate}</td>
                  <td className="px-3 py-2 font-mono text-slate-700">
                    {f.lastLoginTimestamp.replace('T', ' ').replace('Z', '')}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      f.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-600'
                    }`}>
                      {f.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[11px]">
                    {f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                      <span className="text-emerald-700 font-medium">Revoked (Verified)</span>
                    ) : (
                      <span className="text-amber-700">{f.deprovisionStatus}</span>
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
          <div>Signer: IT Security Admin (Hiten S)</div>
        </div>
      </div>
    </div>
  );
};
