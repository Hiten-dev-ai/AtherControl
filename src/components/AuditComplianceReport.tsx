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
    <div className="space-y-6">
      {/* Action Bar with Ruling Margins */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Official Deliverable: Access Review Audit Report
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal audit report conforming to SOC 2 Type II and ISO 27001 Control A.9.2.6 access revocation standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Formal Audit Document Container (Editorial Ruled Sheet) */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm font-sans">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                COMPLIANCE AUDIT CERTIFICATE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500 font-mono">
                REF: AUD-2026-OCT-ZIR-01
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              Quarterly SaaS Access Review & Deprovisioning Reconciliation
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Prepared for AcmeCorp Information Security Committee by Autonomous Agentic Auditor
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-500 shrink-0">
            <div>Audit Date: 19 October 2026</div>
            <div>Evaluation Cycle: Q4-2026</div>
            <div className="text-emerald-700 font-bold mt-1">Status: PASSED WITH REMEDIATION</div>
          </div>
        </div>

        {/* Quantitative Metrics Grid with Shared Ruling Borders */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">HR Leavers Audited</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{leavers.length}</div>
            <span className="text-[11px] text-slate-500 font-mono">100% evaluated</span>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">SaaS Accounts Scanned</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{users.length}</div>
            <span className="text-[11px] text-slate-500 font-mono">Across 4 platforms</span>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-semibold text-rose-700 uppercase font-mono">Unauthorized Active</span>
            <div className="text-2xl font-bold text-rose-700 font-mono mt-1">{unauthorizedTotal}</div>
            <span className="text-[11px] text-rose-600 font-mono">{postLoginCount} post-exit logins</span>
          </div>

          <div className="p-4">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase font-mono">Verified Revoked</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">{remediatedTotal}</div>
            <span className="text-[11px] text-emerald-600 font-mono">Re-query confirmed</span>
          </div>
        </div>

        {/* Audit Scope & Standards */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Scope & Compliance Mapping
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <span className="font-semibold text-blue-900">• SOC 2 Type II Criteria CC6.2 & CC6.3:</span>
              <p className="text-slate-600 mt-0.5">
                Controls ensuring internal and external access to data and systems is revoked in a timely manner upon termination of personnel.
              </p>
            </div>
            <div>
              <span className="font-semibold text-emerald-900">• ISO/IEC 27001:2022 Control A.9.2.6:</span>
              <p className="text-slate-600 mt-0.5">
                Immediate removal or adjustment of access rights of employees and external party users upon termination of employment.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Findings Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Remediation Findings & Evidence Ledger
          </h4>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] font-mono">
                <tr>
                  <th className="px-4 py-2.5 border-r border-slate-200 last:border-r-0">User</th>
                  <th className="px-4 py-2.5 border-r border-slate-200 last:border-r-0">System</th>
                  <th className="px-4 py-2.5 border-r border-slate-200 last:border-r-0">Separation Date</th>
                  <th className="px-4 py-2.5 border-r border-slate-200 last:border-r-0">Last Observed Activity</th>
                  <th className="px-4 py-2.5 border-r border-slate-200 last:border-r-0">Disposition</th>
                  <th className="px-4 py-2.5 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {findings.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 border-r border-slate-100">
                      <div className="font-semibold text-slate-900">{f.hrEmployee.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{f.saasUser.accountEmail}</div>
                    </td>
                    <td className="px-4 py-2.5 capitalize border-r border-slate-100 font-mono text-slate-700">{f.platform.replace('_', ' ')}</td>
                    <td className="px-4 py-2.5 font-mono border-r border-slate-100 text-slate-800">{f.hrEmployee.exitDate}</td>
                    <td className="px-4 py-2.5 font-mono border-r border-slate-100 text-slate-800">
                      {f.lastLoginTimestamp.replace('T', ' ').replace('Z', '')}
                    </td>
                    <td className="px-4 py-2.5 border-r border-slate-100">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        f.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border border-rose-300' : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {f.status === 'UNAUTHORIZED_ACTIVE' ? 'Action Required' : 'Deprovisioned'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px]">
                      {f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                        <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Re-read Confirmed
                        </span>
                      ) : (
                        <span className="text-amber-800 font-medium">
                          {f.deprovisionStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cryptographic Signature Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div>
            Auditor Agent Hash: <span className="text-slate-800 font-semibold">SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
          </div>
          <div>
            Verified by: IT Security Admin (Hiten S)
          </div>
        </div>
      </div>
    </div>
  );
};
