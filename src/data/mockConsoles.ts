import { SaaSUser } from '../types/audit';

export const INITIAL_MOCK_USERS: SaaSUser[] = [
  // --- Google Workspace Admin Console ---
  {
    id: 'gw-01',
    platform: 'google_workspace',
    accountEmail: 'marcus.vance@acmecorp.io',
    username: 'marcus.vance',
    displayName: 'Marcus Vance',
    status: 'ACTIVE', // TC1: Left 2026-10-05, still active!
    lastLoginTime: '2026-10-17T08:32:15Z', // 2 days ago! Post-departure!
    mfaEnabled: true,
    roles: ['Super Admin', 'Security Auditor'],
    department: 'Engineering'
  },
  {
    id: 'gw-02',
    platform: 'google_workspace',
    accountEmail: 'sarah.jenkins@acmecorp.io',
    username: 'sarah.jenkins',
    displayName: 'Sarah Jenkins', // TC2: In SaaS her name is Sarah Jenkins, but HR has Sarah Jenkins-Hayes
    status: 'ACTIVE',
    lastLoginTime: '2026-10-16T11:20:44Z',
    mfaEnabled: true,
    roles: ['Core User', 'Figma Org Admin'],
    department: 'Product & Design'
  },
  {
    id: 'gw-03',
    platform: 'google_workspace',
    accountEmail: 'alex.mercer@acmecorp.io',
    username: 'alex.mercer',
    displayName: 'Alex Mercer', // TC4: Primary deprovision test user
    status: 'ACTIVE',
    lastLoginTime: '2026-10-14T09:12:00Z',
    mfaEnabled: true,
    roles: ['DevOps Operator'],
    department: 'Security & DevOps'
  },
  {
    id: 'gw-04',
    platform: 'google_workspace',
    accountEmail: 'billing-service@acmecorp.io',
    username: 'billing-service',
    displayName: 'Stripe & QuickBooks Sync Bot', // TC3: Shared Service Account
    status: 'ACTIVE',
    lastLoginTime: '2026-10-19T03:00:00Z',
    mfaEnabled: false,
    roles: ['Service Account User'],
    isServiceAccount: true,
    department: 'Finance Infrastructure'
  },
  {
    id: 'gw-05',
    platform: 'google_workspace',
    accountEmail: 'priya.sharma@acmecorp.io',
    username: 'priya.sharma',
    displayName: 'Priya Sharma',
    status: 'SUSPENDED', // Already properly deprovisioned
    lastLoginTime: '2026-09-30T17:00:00Z',
    mfaEnabled: true,
    roles: ['HR Specialist'],
    department: 'Human Resources'
  },
  {
    id: 'gw-06',
    platform: 'google_workspace',
    accountEmail: 'hiten.dev@acmecorp.io',
    username: 'hiten.dev',
    displayName: 'Hiten S (Active IT Admin)',
    status: 'ACTIVE',
    lastLoginTime: '2026-10-19T08:00:00Z',
    mfaEnabled: true,
    roles: ['Super Admin', 'IAM Lead'],
    department: 'IT Operations'
  },

  // --- GitHub Enterprise Admin Console ---
  {
    id: 'gh-01',
    platform: 'github',
    accountEmail: 'marcus.vance@acmecorp.io',
    username: 'mvance-infra',
    displayName: 'Marcus Vance',
    status: 'ACTIVE', // TC1: Still has Org Owner & write access to infra repos!
    lastLoginTime: '2026-10-18T19:44:00Z', // Yesterday! Post-departure!
    mfaEnabled: true,
    roles: ['Organization Owner', 'Repo Admin: terraform-core'],
    department: 'Engineering'
  },
  {
    id: 'gh-02',
    platform: 'github',
    accountEmail: 'alex.mercer@acmecorp.io',
    username: 'alexmercer-devops',
    displayName: 'Alex Mercer',
    status: 'ACTIVE',
    lastLoginTime: '2026-10-15T10:11:00Z',
    mfaEnabled: true,
    roles: ['Triage Member', 'Repo: k8s-clusters'],
    department: 'Security & DevOps'
  },
  {
    id: 'gh-03',
    platform: 'github',
    accountEmail: 'deploy-bot@acmecorp.io',
    username: 'acme-deployer-app',
    displayName: 'CI/CD Deployment Service Bot', // TC3: Shared Service Account
    status: 'ACTIVE',
    lastLoginTime: '2026-10-19T09:10:00Z',
    mfaEnabled: false,
    roles: ['Machine User', 'Token Access: Repo Write'],
    isServiceAccount: true,
    department: 'Engineering Tools'
  },
  {
    id: 'gh-04',
    platform: 'github',
    accountEmail: 'priya.sharma@acmecorp.io',
    username: 'psharma-hr',
    displayName: 'Priya Sharma',
    status: 'DEACTIVATED',
    lastLoginTime: '2026-09-29T16:00:00Z',
    mfaEnabled: true,
    roles: ['Member'],
    department: 'Human Resources'
  },

  // --- AWS IAM Console ---
  {
    id: 'aws-01',
    platform: 'aws_iam',
    accountEmail: 'elena.rostova@acmecorp.io',
    username: 'elena.rostova',
    displayName: 'Elena Rostova',
    status: 'ACTIVE', // Left 21 days ago, IAM Console & Access Keys still active!
    lastLoginTime: '2026-10-15T21:05:00Z',
    mfaEnabled: true,
    roles: ['AdministratorAccess', 'VPC-Peering-Admin'],
    department: 'Cloud Platform'
  },
  {
    id: 'aws-02',
    platform: 'aws_iam',
    accountEmail: 'marcus.vance@acmecorp.io',
    username: 'mvance-admin',
    displayName: 'Marcus Vance',
    status: 'ACTIVE',
    lastLoginTime: '2026-10-16T12:00:00Z',
    mfaEnabled: true,
    roles: ['PowerUserAccess'],
    department: 'Engineering'
  },
  {
    id: 'aws-03',
    platform: 'aws_iam',
    accountEmail: 'aws-backup-sync@acmecorp.io',
    username: 'svc-s3-glacier-sync',
    displayName: 'AWS Automated Backup Service Role', // TC3: Service Account
    status: 'ACTIVE',
    lastLoginTime: '2026-10-19T06:00:00Z',
    mfaEnabled: false,
    roles: ['S3FullAccess', 'BackupOperator'],
    isServiceAccount: true,
    department: 'Cloud Infrastructure'
  },
  {
    id: 'aws-04',
    platform: 'aws_iam',
    accountEmail: 'alex.mercer@acmecorp.io',
    username: 'alex.mercer',
    displayName: 'Alex Mercer',
    status: 'ACTIVE',
    lastLoginTime: '2026-10-13T18:40:00Z',
    mfaEnabled: true,
    roles: ['EC2ContainerRegistryPowerUser'],
    department: 'Security & DevOps'
  },

  // --- Slack Enterprise Grid ---
  {
    id: 'sl-01',
    platform: 'slack',
    accountEmail: 'david.kim@acmecorp.io',
    username: 'dkim',
    displayName: 'David Kim',
    status: 'ACTIVE', // Left 7 days ago, still chatting in Slack!
    lastLoginTime: '2026-10-18T22:15:00Z',
    mfaEnabled: true,
    roles: ['Member', 'Channels: #finance-restricted, #exec-leadership'],
    department: 'Finance & Operations'
  },
  {
    id: 'sl-02',
    platform: 'slack',
    accountEmail: 'sarah.jenkins@acmecorp.io',
    username: 'sjenkins',
    displayName: 'Sarah Jenkins', // TC2: Sarah Jenkins-Hayes
    status: 'ACTIVE',
    lastLoginTime: '2026-10-17T15:20:00Z',
    mfaEnabled: true,
    roles: ['Workspace Member'],
    department: 'Product & Design'
  },
  {
    id: 'sl-03',
    platform: 'slack',
    accountEmail: 'alert-pager-bot@acmecorp.io',
    username: 'pagerduty-incident-bot',
    displayName: 'Incident Escalation Bot', // TC3: Service Account
    status: 'ACTIVE',
    lastLoginTime: '2026-10-19T09:00:00Z',
    mfaEnabled: false,
    roles: ['Bot User'],
    isServiceAccount: true,
    department: 'Engineering Ops'
  },
  {
    id: 'sl-04',
    platform: 'slack',
    accountEmail: 'alex.mercer@acmecorp.io',
    username: 'amercer',
    displayName: 'Alex Mercer',
    status: 'ACTIVE',
    lastLoginTime: '2026-10-14T11:00:00Z',
    mfaEnabled: true,
    roles: ['Workspace Member'],
    department: 'Security & DevOps'
  }
];
