import express from 'express';
import cors from 'cors';
import { INITIAL_HR_LEAVERS } from '../src/data/hrLeavers.js';
import { INITIAL_MOCK_USERS } from '../src/data/mockConsoles.js';
import { IdentityResolver } from '../src/services/identityResolver.js';
import { TestCaseRunner } from '../src/services/testSuiteRunner.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory state for mock backend
let mockUsers = JSON.parse(JSON.stringify(INITIAL_MOCK_USERS));
let hrLeavers = JSON.parse(JSON.stringify(INITIAL_HR_LEAVERS));
let auditFindings = IdentityResolver.auditLeavers(hrLeavers, mockUsers);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    agent: 'Leaver Access Review Auditor',
    version: '1.0.0',
    mode: 'Autonomous with Human-in-the-Loop',
    hackathon: 'Ziro Digital Agentic AI Hackathon 2026'
  });
});

app.get('/api/hr/leavers', (req, res) => {
  res.json({ count: hrLeavers.length, leavers: hrLeavers });
});

app.get('/api/consoles/users', (req, res) => {
  const platform = req.query.platform as string;
  const filtered = platform ? mockUsers.filter((u: any) => u.platform === platform) : mockUsers;
  res.json({ count: filtered.length, users: filtered });
});

app.post('/api/audit/run', (req, res) => {
  auditFindings = IdentityResolver.auditLeavers(hrLeavers, mockUsers);
  res.json({
    message: 'Audit executed successfully',
    totalFindings: auditFindings.length,
    activeViolations: auditFindings.filter(f => f.status === 'UNAUTHORIZED_ACTIVE').length,
    findings: auditFindings
  });
});

app.get('/api/audit/findings', (req, res) => {
  res.json({ findings: auditFindings });
});

app.post('/api/deprovision/approve/:ticketId', (req, res) => {
  const { ticketId } = req.params;
  const approver = req.body.approver || 'IT Security Admin';

  const finding = auditFindings.find(f => f.ticketId === ticketId);
  if (!finding) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Update mock user in console
  const user = mockUsers.find((u: any) => u.platform === finding.platform && u.accountEmail.toLowerCase() === finding.saasUser.accountEmail.toLowerCase());
  if (user) {
    user.status = user.platform === 'slack' || user.platform === 'github' ? 'DEACTIVATED' : 'SUSPENDED';
  }

  finding.status = 'DEPROVISIONED';
  finding.deprovisionStatus = 'VERIFIED_REVOKED';
  finding.verificationTimestamp = new Date().toISOString();

  res.json({
    message: `Ticket ${ticketId} approved and verified revoked.`,
    userStatus: user?.status,
    approver,
    verifiedAt: finding.verificationTimestamp
  });
});

app.get('/api/test-suite/run', (req, res) => {
  const results = TestCaseRunner.runAllTests();
  res.json({
    totalTests: results.length,
    passed: results.filter(r => r.passed).length,
    results
  });
});

app.post('/api/reset', (req, res) => {
  mockUsers = JSON.parse(JSON.stringify(INITIAL_MOCK_USERS));
  hrLeavers = JSON.parse(JSON.stringify(INITIAL_HR_LEAVERS));
  auditFindings = IdentityResolver.auditLeavers(hrLeavers, mockUsers);
  res.json({ message: 'Environment reset to initial state' });
});

app.listen(PORT, () => {
  console.log(`[Leaver Access Auditor API] Server running on http://localhost:${PORT}`);
});
