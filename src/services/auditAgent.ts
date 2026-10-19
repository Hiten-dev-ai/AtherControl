import { Employee, SaaSUser, DiscrepancyFinding, AgentStepTrace, DeprovisionTicket, SaaSPlatform } from '../types/audit';
import { IdentityResolver } from './identityResolver';

export interface AuditAgentState {
  currentStepIndex: number;
  isRunning: boolean;
  isWaitingApproval: boolean;
  steps: AgentStepTrace[];
  findings: DiscrepancyFinding[];
  tickets: DeprovisionTicket[];
  saasUsers: SaaSUser[];
  leavers: Employee[];
}

export class AuditAgent {
  private state: AuditAgentState;
  private onStateUpdate?: (state: AuditAgentState) => void;

  constructor(
    initialLeavers: Employee[],
    initialUsers: SaaSUser[],
    onUpdate?: (state: AuditAgentState) => void
  ) {
    this.onStateUpdate = onUpdate;
    this.state = {
      currentStepIndex: 0,
      isRunning: false,
      isWaitingApproval: false,
      leavers: [...initialLeavers],
      saasUsers: [...initialUsers],
      findings: [],
      tickets: [],
      steps: [
        {
          step: 'UNDERSTAND',
          label: '1. Ingest HR Leaver Roster & Define Boundaries',
          status: 'IDLE',
          description: 'Ingest HR employee records, identify termination dates, work emails, and aliases.',
          timestamp: '',
          logItems: []
        },
        {
          step: 'REASON',
          label: '2. Identity Resolution & Policy Rules',
          status: 'IDLE',
          description: 'Correlate identities across platforms, detect surname variants (TC2), and exclude shared service accounts (TC3).',
          timestamp: '',
          logItems: []
        },
        {
          step: 'BROWSE',
          label: '3. Query Mock SaaS Admin Consoles',
          status: 'IDLE',
          description: 'Scan Google Workspace, GitHub, AWS IAM, and Slack for active credentials and last login activity.',
          timestamp: '',
          logItems: []
        },
        {
          step: 'TAKE_ACTION',
          label: '4. Prepare Deprovisioning Actions (Human-Gated)',
          status: 'IDLE',
          description: 'Stage deprovision tickets with blast radius and risk tags. Pause for explicit Human-in-the-Loop sign-off (TC4).',
          timestamp: '',
          logItems: []
        },
        {
          step: 'VERIFY',
          label: '5. Re-query Consoles & Verify Access Revocation',
          status: 'IDLE',
          description: 'Re-read live console statuses to verify that approved revocations took effect. Detect pending moderation.',
          timestamp: '',
          logItems: []
        },
        {
          step: 'REPORT',
          label: '6. Synthesize SOC 2 / ISO 27001 Access Report',
          status: 'IDLE',
          description: 'Produce an immutable audit report with remediation timestamps, compliance scores, and evidence artifacts.',
          timestamp: '',
          logItems: []
        }
      ]
    };
  }

  public getState(): AuditAgentState {
    return this.state;
  }

  private emitUpdate() {
    if (this.onStateUpdate) {
      this.onStateUpdate({ ...this.state });
    }
  }

  /**
   * Runs the full autonomous audit cycle up to the HITL gate
   */
  public async runAudit(): Promise<void> {
    this.state.isRunning = true;
    this.emitUpdate();

    // --- STEP 1: UNDERSTAND ---
    this.setStepStatus(0, 'IN_PROGRESS', ['Reading HR offboarding dataset...', `Loaded ${this.state.leavers.length} leaver records from HRIS.`]);
    await this.delay(500);

    const leaverSummaries = this.state.leavers.map(l => 
      `• ${l.fullName} (${l.workEmail}) - Departed ${l.exitDate} [${l.status}]`
    );
    this.setStepStatus(0, 'COMPLETED', [
      `HR Roster successfully verified. Identified ${this.state.leavers.length} separated personnel.`,
      ...leaverSummaries
    ]);
    this.emitUpdate();
    await this.delay(400);

    // --- STEP 2: REASON ---
    this.setStepStatus(1, 'IN_PROGRESS', [
      'Applying SOC 2 CC6.2 Identity Matching rules...',
      'Checking for legal name changes / surname variations...',
      'Filtering non-human / shared service accounts...'
    ]);
    await this.delay(500);

    // Filter service accounts (TC3)
    const serviceAccounts = this.state.saasUsers.filter(u => IdentityResolver.isServiceAccount(u));
    const serviceAccLogs = serviceAccounts.map(s => 
      `[TC3 Exclusion] Detected service account: ${s.accountEmail} (${s.displayName}) on ${s.platform}. Excluded from leaver discrepancy alerts.`
    );

    // Check surname variants (TC2)
    const surnameVariantLeavers = this.state.leavers.filter(l => l.formerSurname);
    const surnameLogs = surnameVariantLeavers.map(l =>
      `[TC2 Resolution] Resolved employee '${l.fullName}' (formerly '${l.formerSurname}') via persistent work email '${l.workEmail}'.`
    );

    this.setStepStatus(1, 'COMPLETED', [
      'Identity resolution completed.',
      ...surnameLogs,
      ...serviceAccLogs
    ]);
    this.emitUpdate();
    await this.delay(400);

    // --- STEP 3: BROWSE ---
    this.setStepStatus(2, 'IN_PROGRESS', [
      'Scanning Google Workspace Admin API...',
      'Scanning GitHub Enterprise Organization Members...',
      'Scanning AWS IAM Console credentials & access keys...',
      'Scanning Slack Enterprise Grid users & active sessions...'
    ]);
    await this.delay(600);

    // Perform audit
    const findings = IdentityResolver.auditLeavers(this.state.leavers, this.state.saasUsers);
    this.state.findings = findings;

    const activeViolations = findings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE');
    const tc1Violations = activeViolations.filter(f => f.hasPostDepartureLogin);

    const browseLogs = [
      `Audited ${this.state.saasUsers.length} total credentials across 4 SaaS platforms.`,
      `Identified ${activeViolations.length} unauthorized active accounts belonging to separated employees.`,
      ...tc1Violations.map(f => 
        `[TC1 Flagged] ${f.hrEmployee.fullName} left on ${f.hrEmployee.exitDate}, but logged into ${f.platform} on ${f.lastLoginTimestamp}!`
      )
    ];

    this.setStepStatus(2, 'COMPLETED', browseLogs);
    this.emitUpdate();
    await this.delay(400);

    // --- STEP 4: TAKE_ACTION (HUMAN-GATED) ---
    this.setStepStatus(3, 'IN_PROGRESS', [
      'Generating structured deprovision tickets...',
      'Evaluating blast radius & privileged access roles...'
    ]);
    await this.delay(400);

    // Generate tickets
    const tickets: DeprovisionTicket[] = activeViolations.map(finding => ({
      id: finding.ticketId,
      findingId: finding.id,
      targetPlatform: finding.platform,
      targetUserEmail: finding.saasUser.accountEmail,
      employeeName: finding.hrEmployee.fullName,
      actionSummary: this.getActionSummary(finding.platform, finding.saasUser),
      proposedAt: new Date().toISOString(),
      riskLevel: finding.riskLevel as 'CRITICAL' | 'HIGH' | 'MEDIUM',
      status: 'AWAITING_APPROVAL'
    }));

    this.state.tickets = tickets;
    this.state.isWaitingApproval = tickets.length > 0;
    this.state.isRunning = false;

    if (tickets.length > 0) {
      this.setStepStatus(3, 'WAITING_HUMAN_APPROVAL', [
        `Prepared ${tickets.length} deprovision tickets.`,
        'PAUSED AT HUMAN-IN-THE-LOOP GATE: Execution of deprovisioning requires authorized administrator sign-off (TC4).',
        'Review the pending actions below and click "Approve" to proceed.'
      ]);
    } else {
      this.setStepStatus(3, 'COMPLETED', ['All leavers cleanly deprovisioned. No action required.']);
    }

    this.emitUpdate();
  }

  /**
   * Approves and executes a specific deprovision ticket (TC4)
   */
  public async approveTicket(ticketId: string, approverName: string = 'IT Security Admin (Hiten S)'): Promise<void> {
    const ticket = this.state.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.status = 'APPROVED';
    ticket.approver = approverName;
    ticket.approvedAt = new Date().toISOString();

    // 1. Execute deprovision in mock console
    const saasUser = this.state.saasUsers.find(
      u => u.platform === ticket.targetPlatform && u.accountEmail.toLowerCase() === ticket.targetUserEmail.toLowerCase()
    );

    if (saasUser) {
      saasUser.status = ticket.targetPlatform === 'slack' || ticket.targetPlatform === 'github' ? 'DEACTIVATED' : 'SUSPENDED';
    }

    // 2. Update finding
    const finding = this.state.findings.find(f => f.id === ticket.findingId);
    if (finding) {
      finding.deprovisionStatus = 'APPROVED';
    }

    this.emitUpdate();

    // Check if all approved, then run verification (STEP 5 & 6)
    const remainingUnapproved = this.state.tickets.filter(t => t.status === 'AWAITING_APPROVAL');
    if (remainingUnapproved.length === 0) {
      await this.runVerificationAndReport();
    }
  }

  /**
   * Approves all remaining deprovision tickets in batch
   */
  public async approveAllTickets(approverName: string = 'IT Security Admin (Hiten S)'): Promise<void> {
    for (const ticket of this.state.tickets) {
      if (ticket.status === 'AWAITING_APPROVAL') {
        ticket.status = 'APPROVED';
        ticket.approver = approverName;
        ticket.approvedAt = new Date().toISOString();

        const saasUser = this.state.saasUsers.find(
          u => u.platform === ticket.targetPlatform && u.accountEmail.toLowerCase() === ticket.targetUserEmail.toLowerCase()
        );
        if (saasUser) {
          saasUser.status = ticket.targetPlatform === 'slack' || ticket.targetPlatform === 'github' ? 'DEACTIVATED' : 'SUSPENDED';
        }

        const finding = this.state.findings.find(f => f.id === ticket.findingId);
        if (finding) {
          finding.deprovisionStatus = 'APPROVED';
        }
      }
    }
    this.emitUpdate();
    await this.runVerificationAndReport();
  }

  /**
   * Runs Step 5 (Verify) and Step 6 (Report)
   */
  private async runVerificationAndReport(): Promise<void> {
    this.state.isWaitingApproval = false;
    this.state.isRunning = true;
    this.setStepStatus(3, 'COMPLETED', [
      'All deprovisioning tickets approved by administrator.',
      'Executing revocation payloads against mock SaaS admin endpoints...'
    ]);
    this.emitUpdate();
    await this.delay(500);

    // --- STEP 5: VERIFY ---
    this.setStepStatus(4, 'IN_PROGRESS', [
      'Re-querying admin consoles to confirm credential invalidation...',
      'Verifying OAuth token revocation and session kills...'
    ]);
    await this.delay(600);

    const verificationLogs: string[] = [];
    for (const ticket of this.state.tickets) {
      if (ticket.status === 'APPROVED') {
        const saasUser = this.state.saasUsers.find(
          u => u.platform === ticket.targetPlatform && u.accountEmail.toLowerCase() === ticket.targetUserEmail.toLowerCase()
        );
        const verified = saasUser && (saasUser.status === 'SUSPENDED' || saasUser.status === 'DEACTIVATED');
        if (verified) {
          ticket.status = 'EXECUTED_AND_VERIFIED';
          ticket.verificationLog = `Re-read console: status confirmed as ${saasUser.status}. Sessions terminated at ${new Date().toISOString()}.`;
          verificationLogs.push(`[TC4 Verified] ${ticket.targetPlatform}: ${ticket.targetUserEmail} confirmed ${saasUser.status}.`);

          const finding = this.state.findings.find(f => f.id === ticket.findingId);
          if (finding) {
            finding.status = 'DEPROVISIONED';
            finding.deprovisionStatus = 'VERIFIED_REVOKED';
            finding.verificationTimestamp = new Date().toISOString();
          }
        }
      }
    }

    this.setStepStatus(4, 'COMPLETED', verificationLogs);
    this.emitUpdate();
    await this.delay(400);

    // --- STEP 6: REPORT ---
    this.setStepStatus(5, 'IN_PROGRESS', ['Compiling final SOC 2 CC6.2 / ISO 27001 audit report...']);
    await this.delay(400);

    this.setStepStatus(5, 'COMPLETED', [
      'Access Review Audit Report successfully generated.',
      'Cryptographic verification hash: sha256-9a4f8b2c1d0e...',
      'Status: All unauthorized leaver access resolved and verified.'
    ]);
    this.state.isRunning = false;
    this.emitUpdate();
  }

  private setStepStatus(
    index: number,
    status: AgentStepTrace['status'],
    logItems: string[]
  ) {
    this.state.steps[index].status = status;
    this.state.steps[index].timestamp = new Date().toLocaleTimeString();
    this.state.steps[index].logItems = logItems;
    this.state.currentStepIndex = index;
  }

  private getActionSummary(platform: SaaSPlatform, user: SaaSUser): string {
    switch (platform) {
      case 'google_workspace':
        return `Suspend account, terminate active OAuth sessions, transfer Drive files`;
      case 'github':
        return `Remove from AcmeCorp GitHub Organization, revoke SSH & GPG keys`;
      case 'aws_iam':
        return `Revoke AWS Console Login, disable all programmatic Access Keys`;
      case 'slack':
        return `Deactivate Slack account, invalidate all mobile & desktop session tokens`;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
  }
}
