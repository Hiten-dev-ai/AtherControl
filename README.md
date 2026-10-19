# AtherControl · Leaver Access Review Auditor 🛡️
> **Autonomous Agentic AI for SaaS Identity Reconciliation, Human-Gated Deprovisioning & Access Verification**  
> **Event:** Ziro Digital National Agentic AI Hackathon 2026  
> **Participant:** Hiten S (*R.M.K College of Engineering and Technology*)  
> **Assigned Problem Statement:** Leaver Access Review Auditor (ID: `f7298732-d5be-4fc4-8c8e-f65eb6d01c7e`)  
> **Track:** Business & Productivity AI  
> **Demo Target:** Mock Admin Consoles  

---

## 🎯 Executive Overview
When employees leave an organization, orphaned SaaS access accounts create severe data breach vectors and audit non-compliance under **SOC 2 Type II (CC6.2 & CC6.3)** and **ISO/IEC 27001:2022 (Control A.9.2.6)**. Manual IT reviews struggle with fragmented identities, legal surname changes, and shared service accounts.

**AtherControl** is an autonomous AI agent system that continuously ingests HR separation data, correlates identities across enterprise SaaS consoles (Google Workspace, GitHub Enterprise, AWS IAM, Slack Enterprise Grid), flags unauthorized access, enforces a strict **Human-in-the-Loop (HITL)** approval gate for deprovisioning, and autonomously re-queries consoles to verify revocation.

---

## 🔄 Agent Execution Blueprint
The agent operates through the 6-phase deterministic architecture specified in the challenge brief:

```
[1. UNDERSTAND] Ingest HR leaver rosters (exit dates, work emails, personal emails, aliases)
       │
       ▼
[2. REASON] Correlate identities, resolve legal surname changes (TC2), filter service accounts (TC3)
       │
       ▼
[3. BROWSE] Query mock SaaS admin consoles (Google, GitHub, AWS, Slack) for active credentials & logins
       │
       ▼
[4. TAKE ACTION] Stage deprovision tickets & PAUSE at Human-in-the-Loop (HITL) gate for sign-off (TC4)
       │
       ▼
[5. VERIFY] Re-query live SaaS consoles post-approval to confirm status changed to SUSPENDED / DEACTIVATED
       │
       ▼
[6. REPORT] Synthesize audit-ready SOC 2 / ISO 27001 Access Review Report with cryptographic digest
```

---

## ✅ Official Test Cases Validation (TC1 – TC4)

All official evaluation scenarios have 100% automated test coverage in both TypeScript and Python:

| Test Case | Scenario | Official Expected Outcome | Verification Status |
| :--- | :--- | :--- | :---: |
| **TC1** | **Leaver Still Active in a Tool** | Former employee Marcus Vance (departed 2026-10-05) retains active access in GitHub & Google Workspace. Flagged with last login timestamp (`2026-10-18T19:44:00Z`). | **PASSED** ✅ |
| **TC2** | **Employee Changed Surname** | Sarah Jenkins married and is recorded in HR as "Sarah Jenkins-Hayes", while SaaS tools use "Sarah Jenkins". Resolved accurately via work email `sarah.jenkins@acmecorp.io`. | **PASSED** ✅ |
| **TC3** | **Shared Service Account** | Non-human accounts (`deploy-bot@`, `billing-service@`, `aws-backup-sync@`) identified via heuristic & metadata filtering, strictly excluded from leaver alerts. | **PASSED** ✅ |
| **TC4** | **Deprovision Request & HITL Gate** | Alex Mercer (Terminated) deprovisioning ticket prepared in pending state. Execution blocked until admin signs off; upon approval, executed and verified as DEACTIVATED. | **PASSED** ✅ |

---

## 🚀 Quickstart & How to Run

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Interactive Web Dashboard
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 4. Run Official Test Suite (CLI)
You can verify all test cases directly from the terminal:
```bash
# TypeScript Test Runner
npm run test:cli

# Python Native Agent Test Runner
python python_agent/test_suite.py
```

### 5. Launch Express REST Backend (Optional)
```bash
npm run server
```
Server runs on `http://localhost:4000` exposing `/api/audit/run`, `/api/consoles/users`, `/api/deprovision/approve/:id`, and `/api/test-suite/run`.

---

## 🖥️ System Features

1. **Live Agent Blueprint Visualizer**: Step-by-step trace showing real-time execution logs, timings, and decision rationale.
2. **Access Discrepancy Matrix**: Interactive table categorizing leavers, risk scores (CRITICAL / HIGH / MEDIUM), post-departure logins, and remediation state.
3. **Mock SaaS Admin Consoles**: Realistic browser simulation of Google Workspace, GitHub Enterprise, AWS IAM, and Slack Enterprise Grid showing live credential status changes upon revocation.
4. **Human-in-the-Loop (HITL) Action Queue**: One-click review, individual approval, and batch remediation for security administrators.
5. **Interactive TC1–TC4 Test Runner**: One-click automated evaluator rendering instant green validation badges and raw assertion evidence.
6. **Formal Access Review Audit Report**: Printable and exportable SOC 2 Type II / ISO 27001 compliance summary with cryptographic SHA256 audit digest.
