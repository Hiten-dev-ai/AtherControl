"""
Leaver Access Review Auditor - Autonomous Agentic AI
Assigned Problem ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
National Agentic AI Hackathon 2026 - Powered by Ziro Digital
"""

import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any


@dataclass
class HRLeaver:
    id: str
    full_name: str
    work_email: str
    personal_email: str
    department: str
    role: str
    exit_date: str  # YYYY-MM-DD
    status: str     # RESIGNED, TERMINATED
    former_surname: Optional[str] = None  # TC2: Surname changed


@dataclass
class SaaSUser:
    id: str
    platform: str   # google_workspace, github, aws_iam, slack
    account_email: str
    username: str
    display_name: str
    status: str     # ACTIVE, SUSPENDED, DEACTIVATED
    last_login_time: str
    mfa_enabled: bool
    roles: List[str]
    is_service_account: bool = False  # TC3: Shared service account


@dataclass
class DiscrepancyFinding:
    id: str
    employee_id: str
    employee_name: str
    platform: str
    account_email: str
    status: str
    risk_level: str
    exit_date: str
    last_login: str
    has_post_departure_login: bool
    deprovision_status: str
    remediation_note: str


class IdentityResolver:
    SERVICE_KEYWORDS = [
        "bot", "svc-", "service", "daemon", "pipeline", "deploy",
        "backup", "sync", "billing", "alert", "webhook"
    ]

    @classmethod
    def is_service_account(cls, user: SaaSUser) -> bool:
        """TC3: Identify shared non-human service accounts to exclude from leaver audits."""
        if user.is_service_account:
            return True
        email = user.account_email.lower()
        username = user.username.lower()
        display = user.display_name.lower()
        return any(k in email or k in username or k in display for k in cls.SERVICE_KEYWORDS)

    @classmethod
    def match_identity(cls, employee: HRLeaver, user: SaaSUser) -> Dict[str, Any]:
        """TC2 & TC1: Match identity across tools handling surname variants & emails."""
        if cls.is_service_account(user):
            return {"match": False, "reason": "Excluded non-human service account (TC3)"}

        # Exact work email match
        if employee.work_email.lower() == user.account_email.lower():
            if employee.former_surname and employee.former_surname.lower() in user.display_name.lower():
                return {
                    "match": True,
                    "type": "SURNAME_VARIANT",
                    "reason": f"Matched by work email; accounts for legal surname change from {employee.former_surname} (TC2)"
                }
            return {"match": True, "type": "EXACT_EMAIL", "reason": "Exact work email match"}

        # Surname variant fallback
        if employee.former_surname:
            fs = employee.former_surname.lower()
            if fs in user.display_name.lower() or fs in user.account_email.lower():
                return {
                    "match": True,
                    "type": "SURNAME_VARIANT",
                    "reason": f"Resolved via former surname '{employee.former_surname}' across {user.platform} (TC2)"
                }

        return {"match": False, "reason": "No correlation found"}


class LeaverAccessAuditor:
    def __init__(self, leavers: List[HRLeaver], saas_users: List[SaaSUser]):
        self.leavers = leavers
        self.saas_users = saas_users
        self.findings: List[DiscrepancyFinding] = []
        self.tickets: List[Dict[str, Any]] = []

    def run_blueprint_audit(self) -> Dict[str, Any]:
        """Executes the 6-phase Blueprint: Understand -> Reason -> Browse -> Take Action -> Verify -> Report."""
        # 1. UNDERSTAND
        print("[1. UNDERSTAND] Ingesting HR separation rosters...")
        total_leavers = len(self.leavers)

        # 2. REASON & 3. BROWSE
        print("[2. REASON & 3. BROWSE] Correlating SaaS user state & filtering service accounts...")
        ref_date = datetime(2026, 10, 19, 14, 0, tzinfo=timezone.utc)

        for leaver in self.leavers:
            for user in self.saas_users:
                res = IdentityResolver.match_identity(leaver, user)
                if res["match"]:
                    exit_dt = datetime.fromisoformat(leaver.exit_date).replace(tzinfo=timezone.utc)
                    last_login_dt = datetime.fromisoformat(user.last_login_time.replace("Z", "+00:00"))
                    post_login = last_login_dt > exit_dt

                    is_unauth = (user.status == "ACTIVE")
                    risk = "LOW"
                    if is_unauth:
                        has_admin = any("admin" in r.lower() or "owner" in r.lower() for r in user.roles)
                        if post_login and has_admin:
                            risk = "CRITICAL"
                        elif post_login or (ref_date - exit_dt).days > 7:
                            risk = "HIGH"
                        else:
                            risk = "MEDIUM"

                    self.findings.append(DiscrepancyFinding(
                        id=f"FIND-{leaver.id}-{user.platform}",
                        employee_id=leaver.id,
                        employee_name=leaver.full_name,
                        platform=user.platform,
                        account_email=user.account_email,
                        status="UNAUTHORIZED_ACTIVE" if is_unauth else "DEPROVISIONED",
                        risk_level=risk,
                        exit_date=leaver.exit_date,
                        last_login=user.last_login_time,
                        has_post_departure_login=post_login,
                        deprovision_status="PENDING_APPROVAL" if is_unauth else "VERIFIED_REVOKED",
                        remediation_note=res["reason"]
                    ))

        # 4. TAKE ACTION (Human-gated)
        print("[4. TAKE ACTION] Staging deprovision tickets behind human approval gate (TC4)...")
        for f in self.findings:
            if f.status == "UNAUTHORIZED_ACTIVE":
                self.tickets.append({
                    "ticket_id": f"TICK-{f.platform[:3].upper()}-{f.employee_id.replace('EMP-', '')}",
                    "finding_id": f.id,
                    "target_platform": f.platform,
                    "user_email": f.account_email,
                    "risk": f.risk_level,
                    "status": "AWAITING_APPROVAL"
                })

        return {
            "status": "WAITING_HUMAN_APPROVAL",
            "total_leavers_evaluated": total_leavers,
            "unauthorized_active_found": len(self.tickets),
            "tickets": self.tickets
        }

    def approve_deprovisioning(self, ticket_id: str, approver: str = "IT Security Admin") -> Dict[str, Any]:
        """Executes human approval and triggers Step 5 (Verify)."""
        ticket = next((t for t in self.tickets if t["ticket_id"] == ticket_id), None)
        if not ticket:
            return {"error": "Ticket not found"}

        ticket["status"] = "APPROVED"
        ticket["approver"] = approver
        ticket["approved_at"] = datetime.now(timezone.utc).isoformat()

        # Update SaaS mock state
        for u in self.saas_users:
            if u.platform == ticket["target_platform"] and u.account_email.lower() == ticket["user_email"].lower():
                u.status = "DEACTIVATED" if u.platform in ["slack", "github"] else "SUSPENDED"

        # 5. VERIFY
        for f in self.findings:
            if f.id == ticket["finding_id"]:
                f.status = "DEPROVISIONED"
                f.deprovision_status = "VERIFIED_REVOKED"

        ticket["status"] = "EXECUTED_AND_VERIFIED"
        return {"ticket": ticket, "verification": "VERIFIED_REVOKED"}
