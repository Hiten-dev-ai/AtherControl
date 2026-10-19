"""
Official Test Suite (TC1 - TC4) Validator
Ziro Digital National Agentic AI Hackathon 2026
Assigned Problem ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
"""

import sys
from agent import HRLeaver, SaaSUser, IdentityResolver, LeaverAccessAuditor

def get_test_fixtures():
    leavers = [
        HRLeaver("EMP-1042", "Marcus Vance", "marcus.vance@acmecorp.io", "m@gmail.com", "Engineering", "Staff Infra", "2026-10-05", "RESIGNED"),
        HRLeaver("EMP-1088", "Sarah Jenkins-Hayes", "sarah.jenkins@acmecorp.io", "s@gmail.com", "Product", "Principal UX", "2026-10-09", "RESIGNED", former_surname="Jenkins"),
        HRLeaver("EMP-1104", "Alex Mercer", "alex.mercer@acmecorp.io", "a@gmail.com", "DevOps", "DevOps Engineer", "2026-10-08", "TERMINATED"),
    ]

    users = [
        # TC1: Leaver still active
        SaaSUser("gh-01", "github", "marcus.vance@acmecorp.io", "mvance", "Marcus Vance", "ACTIVE", "2026-10-18T19:44:00Z", True, ["Org Owner"]),
        # TC2: Surname changed
        SaaSUser("gw-02", "google_workspace", "sarah.jenkins@acmecorp.io", "sjenkins", "Sarah Jenkins", "ACTIVE", "2026-10-16T11:20:44Z", True, ["Figma Admin"]),
        # TC3: Service accounts
        SaaSUser("gh-03", "github", "deploy-bot@acmecorp.io", "acme-deployer", "CI/CD Service Bot", "ACTIVE", "2026-10-19T09:10:00Z", False, ["Bot"], is_service_account=True),
        SaaSUser("gw-04", "google_workspace", "billing-service@acmecorp.io", "billing-svc", "Stripe Sync Bot", "ACTIVE", "2026-10-19T03:00:00Z", False, ["Service Account"], is_service_account=True),
        # TC4: Deprovision target
        SaaSUser("sl-04", "slack", "alex.mercer@acmecorp.io", "amercer", "Alex Mercer", "ACTIVE", "2026-10-14T11:00:00Z", True, ["Member"]),
    ]
    return leavers, users


def run_tests():
    print("=" * 70)
    print("OFFICIAL TEST SUITE (TC1 - TC4) - LEAVER ACCESS REVIEW AUDITOR")
    print("=" * 70)

    leavers, users = get_test_fixtures()
    auditor = LeaverAccessAuditor(leavers, users)
    plan = auditor.run_blueprint_audit()

    # --- TC1 ---
    tc1_finding = next((f for f in auditor.findings if f.employee_name == "Marcus Vance" and f.platform == "github"), None)
    tc1_pass = tc1_finding is not None and tc1_finding.status == "UNAUTHORIZED_ACTIVE" and tc1_finding.has_post_departure_login
    print(f"\n[TC1] Leaver Still Active in a Tool:")
    print(f"  Status:   {'[PASS]' if tc1_pass else '[FAIL]'}")
    print(f"  Evidence: {tc1_finding.account_email} exited on {tc1_finding.exit_date}, logged in on {tc1_finding.last_login} (Post-Exit: {tc1_finding.has_post_departure_login})")

    # --- TC2 ---
    sarah = next(l for l in leavers if l.full_name == "Sarah Jenkins-Hayes")
    sarah_user = next(u for u in users if u.account_email == "sarah.jenkins@acmecorp.io")
    tc2_match = IdentityResolver.match_identity(sarah, sarah_user)
    tc2_pass = tc2_match["match"] and tc2_match["type"] == "SURNAME_VARIANT"
    print(f"\n[TC2] Employee Changed Surname Match:")
    print(f"  Status:   {'[PASS]' if tc2_pass else '[FAIL]'}")
    print(f"  Evidence: {tc2_match['reason']}")

    # --- TC3 ---
    service_accs = [u for u in users if IdentityResolver.is_service_account(u)]
    tc3_finding = next((f for f in auditor.findings if any(s.account_email == f.account_email for s in service_accs)), None)
    tc3_pass = len(service_accs) >= 2 and tc3_finding is None
    print(f"\n[TC3] Shared Service Account Exclusion:")
    print(f"  Status:   {'[PASS]' if tc3_pass else '[FAIL]'}")
    print(f"  Evidence: Detected & excluded {len(service_accs)} service accounts. Zero false-positive leaver alerts.")

    # --- TC4 ---
    alex_ticket = next(t for t in auditor.tickets if t["user_email"] == "alex.mercer@acmecorp.io")
    pre_status = alex_ticket["status"]
    approval_res = auditor.approve_deprovisioning(alex_ticket["ticket_id"])
    post_status = approval_res["ticket"]["status"]
    alex_saas = next(u for u in auditor.saas_users if u.account_email == "alex.mercer@acmecorp.io")
    tc4_pass = pre_status == "AWAITING_APPROVAL" and post_status == "EXECUTED_AND_VERIFIED" and alex_saas.status == "DEACTIVATED"
    print(f"\n[TC4] Deprovision Request & Human Approval Gate:")
    print(f"  Status:   {'[PASS]' if tc4_pass else '[FAIL]'}")
    print(f"  Evidence: Gated behind approval -> Executed upon sign-off -> Re-read verified status: {alex_saas.status}")

    all_pass = tc1_pass and tc2_pass and tc3_pass and tc4_pass
    print("\n" + "=" * 70)
    print(f"FINAL RESULT: {'ALL 4 TEST CASES PASSED (100% SUCCESS)' if all_pass else 'FAILURES DETECTED'}")
    print("=" * 70)
    return 0 if all_pass else 1

if __name__ == "__main__":
    sys.exit(run_tests())
