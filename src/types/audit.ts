export type SaaSPlatform = 'google_workspace' | 'github' | 'slack' | 'aws_iam';

export interface Employee {
  id: string;
  fullName: string;
  formerSurname?: string; // For TC2: Employee changed surname
  workEmail: string;
  personalEmail: string;
  department: string;
  role: string;
  exitDate: string; // ISO date string (YYYY-MM-DD)
  status: 'TERMINATED' | 'RESIGNED' | 'CONTRACT_ENDED';
  separationReason: string;
}

export interface SaaSUser {
  id: string;
  platform: SaaSPlatform;
  accountEmail: string;
  username: string;
  displayName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  lastLoginTime: string; // ISO timestamp
  mfaEnabled: boolean;
  roles: string[];
  isServiceAccount?: boolean; // For TC3: Shared service account
  department?: string;
  managedBy?: string;
}

export interface DiscrepancyFinding {
  id: string;
  hrEmployee: Employee;
  saasUser: SaaSUser;
  platform: SaaSPlatform;
  status: 'UNAUTHORIZED_ACTIVE' | 'DEPROVISIONED' | 'EXEMPTED_SERVICE_ACCOUNT';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  daysSinceDeparture: number;
  lastLoginTimestamp: string;
  hasPostDepartureLogin: boolean;
  deprovisionStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'VERIFIED_REVOKED';
  ticketId: string;
  remediationNote?: string;
  verificationTimestamp?: string;
}

export type AgentStepName = 'UNDERSTAND' | 'REASON' | 'BROWSE' | 'TAKE_ACTION' | 'VERIFY' | 'REPORT';

export interface AgentStepTrace {
  step: AgentStepName;
  label: string;
  status: 'IDLE' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING_HUMAN_APPROVAL' | 'FAILED';
  description: string;
  timestamp: string;
  logItems: string[];
  findingsFound?: number;
}

export interface DeprovisionTicket {
  id: string;
  findingId: string;
  targetPlatform: SaaSPlatform;
  targetUserEmail: string;
  employeeName: string;
  actionSummary: string;
  proposedAt: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'AWAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED_AND_VERIFIED';
  approver?: string;
  approvedAt?: string;
  verificationLog?: string;
}

export interface TestCaseResult {
  id: 'TC1' | 'TC2' | 'TC3' | 'TC4';
  title: string;
  scenario: string;
  expectedOutcome: string;
  actualOutcome: string;
  passed: boolean;
  evidence: {
    recordId: string;
    details: string;
    matchedField?: string;
    lastLogin?: string;
    actionState?: string;
    beforeStatus?: string;
    afterStatus?: string;
  };
  executedAt: string;
}

export interface AuditReportData {
  reportId: string;
  generatedAt: string;
  auditorAgentVersion: string;
  complianceStandards: string[];
  summary: {
    totalHRLeavers: number;
    totalSaaSSystemsChecked: number;
    totalAccountsScanned: number;
    unauthorizedActiveAccounts: number;
    postDepartureLoginsDetected: number;
    serviceAccountsExcluded: number;
    surnameMatchesResolved: number;
    deprovisionTicketsCreated: number;
    deprovisionTicketsApproved: number;
    deprovisionTicketsVerified: number;
  };
  findings: DiscrepancyFinding[];
  testCaseResults: TestCaseResult[];
}
