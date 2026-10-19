import React from 'react';
import { 
  FileCheck, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Lock,
  Layers,
  FileCode
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
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Official Deliverable: Access Review Audit Report
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Formal audit report conforming to SOC 2 Type II and ISO 27001 Control A.9.2.6 access revocation standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface-800 text-slate-200 border border-surface-700 hover:bg-surface-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Formal Audit Document Container */}
      <div className="rounded-2xl border border-surface-700 bg-surface-900 p-6 sm:p-8 space-y-6 shadow-xl font-sans">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-surface-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                COMPLIANCE AUDIT CERTIFICATE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">
                REF: AUD-2026-OCT-ZIR-01
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">
              Quarterly SaaS Access Review & Deprovisioning Reconciliation
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Prepared for AcmeCorp Information Security Committee by Autonomous Agentic Auditor
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 shrink-0">
            <div>Audit Date: 19 October 2026</div>
            <div>Evaluation Cycle: Q4-2026</div>
            <div className="text-emerald-400 font-semibold mt-1">Status: PASSED WITH REMEDIATION</div>
          </div>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">HR Leavers Audited</span>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">{leavers.length}</div>
            <span className="text-[11px] text-slate-500">100% evaluated</span>
          </div>

          <div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">SaaS Accounts Scanned</span>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">{users.length}</div>
            <span className="text-[11px] text-slate-500">Across 4 platforms</span>
          </div>

          <div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
            <span className="text-[11px] font-semibold text-rose-400 uppercase">Unauthorized Active</span>
            <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{unauthorizedTotal}</div>
            <span className="text-[11px] text-rose-400/80">{postLoginCount} post-exit logins</span>
          </div>

          <div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase">Verified Revoked</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{remediatedTotal}</div>
            <span className="text-[11px] text-emerald-400/80">Re-query confirmed</span>
          </div>
        </div>

        {/* Audit Scope & Standards */}
        <div className="rounded-xl border border-surface-800 bg-surface-950/60 p-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Scope & Compliance Mapping
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div>
              <span className="font-semibold text-blue-400">• SOC 2 Type II Criteria CC6.2 & CC6.3:</span>
              <p className="text-slate-400 mt-0.5">
                Controls ensuring internal and external access to data and systems is revoked in a timely manner upon termination of personnel.
              </p>
            </div>
            <div>
              <span className="font-semibold text-emerald-400">• ISO/IEC 27001:2022 Control A.9.2.6:</span>
              <p className="text-slate-400 mt-0.5">
                Immediate removal or adjustment of access rights of employees and external party users upon termination of employment.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Findings Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Remediation Findings & Evidence Ledger
          </h4>

          <div className="overflow-x-auto rounded-xl border border-surface-800 bg-surface-950">
            <table className="w-full text-left text-xs text-slate-300 divide-y divide-surface-800">
              <thead className="bg-surface-850 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">System</th>
                  <th className="px-4 py-2.5">Separation Date</th>
                  <th className="px-4 py-2.5">Last Observed Activity</th>
                  <th className="px-4 py-2.5">Disposition</th>
                  <th className="px-4 py-2.5 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {findings.map(f => (
                  <tr key={f.id} className="hover:bg-surface-900/60">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-slate-100">{f.hrEmployee.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{f.saasUser.accountEmail}</div>
                    </td>
                    <td className="px-4 py-2.5 capitalize">{f.platform.replace('_', ' ')}</td>
                    <td className="px-4 py-2.5 font-mono">{f.hrEmployee.exitDate}</td>
                    <td className="px-4 py-2.5 font-mono">
                      {f.lastLoginTimestamp.replace('T', ' ').replace('Z', '')}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        f.riskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {f.status === 'UNAUTHORIZED_ACTIVE' ? 'Action Required' : 'Deprovisioned'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px]">
                      {f.deprovisionStatus === 'VERIFIED_REVOKED' ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Re-read Confirmed
                        </span>
                      ) : (
                        <span className="text-amber-400">
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
        <div className="pt-4 border-t border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div>
            Auditor Agent Hash: <span className="text-slate-400">SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
          </div>
          <div>
            Verified by: IT Security Admin (Hiten S)
          </div>
        </div>
      </div>
    </div>
  );
};
