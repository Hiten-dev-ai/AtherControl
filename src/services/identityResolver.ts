import { Employee, SaaSUser, DiscrepancyFinding, SaaSPlatform } from '../types/audit';

export interface MatchResult {
  isMatch: boolean;
  matchType?: 'EXACT_EMAIL' | 'SURNAME_VARIANT' | 'USERNAME_HEURISTIC' | 'EXCLUDED_SERVICE_ACCOUNT';
  confidence: number;
  notes: string;
}

export class IdentityResolver {
  /**
   * Evaluates if a SaaS user is a service account that should be excluded from leaver reviews (TC3)
   */
  public static isServiceAccount(user: SaaSUser): boolean {
    if (user.isServiceAccount) return true;

    const email = user.accountEmail.toLowerCase();
    const username = user.username.toLowerCase();
    const displayName = user.displayName.toLowerCase();

    const serviceKeywords = [
      'bot', 'svc-', 'service', 'daemon', 'pipeline', 'deploy',
      'backup', 'sync', 'billing', 'alert', 'webhook', 'no-reply'
    ];

    return serviceKeywords.some(kw => 
      email.includes(kw) || username.includes(kw) || displayName.includes(kw)
    );
  }

  /**
   * Matches an HR employee against a SaaS console user
   * Supports TC2: employee changed surname after marriage/legal update
   */
  public static matchIdentity(employee: Employee, user: SaaSUser): MatchResult {
    // 1. Service account check (TC3)
    if (this.isServiceAccount(user)) {
      return {
        isMatch: false,
        matchType: 'EXCLUDED_SERVICE_ACCOUNT',
        confidence: 0,
        notes: `Account ${user.accountEmail} identified as non-human/shared service account. Excluded from leaver check.`
      };
    }

    // 2. Exact email match
    if (employee.workEmail.toLowerCase() === user.accountEmail.toLowerCase()) {
      // Check if former surname was used (TC2)
      if (employee.formerSurname && !user.displayName.toLowerCase().includes(employee.fullName.toLowerCase())) {
        return {
          isMatch: true,
          matchType: 'SURNAME_VARIANT',
          confidence: 0.98,
          notes: `Matched by work email '${user.accountEmail}' despite HR name '${employee.fullName}' differing from SaaS display name '${user.displayName}' (Former surname: ${employee.formerSurname}).`
        };
      }

      return {
        isMatch: true,
        matchType: 'EXACT_EMAIL',
        confidence: 1.0,
        notes: `Direct work email match: ${employee.workEmail}`
      };
    }

    // 3. Name or username heuristics
    const normalizedEmpName = employee.fullName.toLowerCase().replace(/[^a-z]/g, '');
    const normalizedUserName = user.displayName.toLowerCase().replace(/[^a-z]/g, '');

    if (normalizedEmpName === normalizedUserName) {
      return {
        isMatch: true,
        matchType: 'EXACT_EMAIL',
        confidence: 0.95,
        notes: `Display name exact match: ${user.displayName}`
      };
    }

    // 4. Surname change variant check (TC2)
    if (employee.formerSurname) {
      const formerSurnamePattern = employee.formerSurname.toLowerCase();
      if (user.displayName.toLowerCase().includes(formerSurnamePattern) || user.accountEmail.toLowerCase().includes(formerSurnamePattern)) {
        return {
          isMatch: true,
          matchType: 'SURNAME_VARIANT',
          confidence: 0.92,
          notes: `Identity resolved via former surname '${employee.formerSurname}' across ${user.platform}`
        };
      }
    }

    return {
      isMatch: false,
      confidence: 0,
      notes: 'No identity correlation found.'
    };
  }

  /**
   * Builds discrepancy findings across all mock SaaS consoles
   */
  public static auditLeavers(
    leavers: Employee[],
    saasUsers: SaaSUser[],
    referenceDate: Date = new Date('2026-10-19T14:00:00Z')
  ): DiscrepancyFinding[] {
    const findings: DiscrepancyFinding[] = [];

    for (const leaver of leavers) {
      for (const saasUser of saasUsers) {
        const match = this.matchIdentity(leaver, saasUser);

        if (match.isMatch) {
          const exitDate = new Date(leaver.exitDate);
          const daysSinceDeparture = Math.max(0, Math.floor((referenceDate.getTime() - exitDate.getTime()) / (1000 * 60 * 60 * 24)));
          const lastLogin = new Date(saasUser.lastLoginTime);
          const hasPostDepartureLogin = lastLogin.getTime() > exitDate.getTime();

          const isUnauthorizedActive = saasUser.status === 'ACTIVE';

          // Risk calculation
          let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
          if (isUnauthorizedActive) {
            const hasAdminRole = saasUser.roles.some(r => /admin|owner|poweruser|fullaccess/i.test(r));
            if (hasPostDepartureLogin && hasAdminRole) {
              riskLevel = 'CRITICAL';
            } else if (hasPostDepartureLogin || daysSinceDeparture > 7) {
              riskLevel = 'HIGH';
            } else {
              riskLevel = 'MEDIUM';
            }
          }

          findings.push({
            id: `FIND-${leaver.id}-${saasUser.platform}-${saasUser.id}`,
            hrEmployee: leaver,
            saasUser,
            platform: saasUser.platform,
            status: isUnauthorizedActive ? 'UNAUTHORIZED_ACTIVE' : 'DEPROVISIONED',
            riskLevel,
            daysSinceDeparture,
            lastLoginTimestamp: saasUser.lastLoginTime,
            hasPostDepartureLogin,
            deprovisionStatus: isUnauthorizedActive ? 'PENDING_APPROVAL' : 'VERIFIED_REVOKED',
            ticketId: `TICK-${saasUser.platform.substring(0, 3).toUpperCase()}-${leaver.id.replace('EMP-', '')}`,
            remediationNote: match.notes
          });
        }
      }
    }

    return findings;
  }
}
