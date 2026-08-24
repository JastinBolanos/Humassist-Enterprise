import { AppRole, UserPermissions, UserSession } from '../../domain';

export class RBACService {
  /**
   * Checks if a user session has a specific permission
   */
  static hasPermission(session: UserSession | null, permissionKey: keyof UserPermissions): boolean {
    if (!session) return false;
    return Boolean(session.permissions[permissionKey]);
  }

  /**
   * Validates if user can manage or view confidential salary data
   */
  static canViewSalaries(session: UserSession | null): boolean {
    return this.hasPermission(session, 'canViewAllSalaries');
  }

  /**
   * Validates if user can authorize, reject, or modify payroll items
   */
  static canEditPayroll(session: UserSession | null): boolean {
    return this.hasPermission(session, 'canEditPayroll');
  }

  /**
   * Validates if user can approve or reject leaves
   */
  static canApproveLeaves(session: UserSession | null): boolean {
    return this.hasPermission(session, 'canApproveLeaves');
  }

  /**
   * Validates if user can manage employee records
   */
  static canManageEmployees(session: UserSession | null): boolean {
    return this.hasPermission(session, 'canManageEmployees');
  }

  /**
   * Validates if user can configure enterprise RBAC matrices
   */
  static canConfigureRoles(session: UserSession | null): boolean {
    return this.hasPermission(session, 'canConfigureRoles');
  }

  /**
   * Validates if user can export analytical reports
   */
  static canExportReports(session: UserSession | null): boolean {
    return this.hasPermission(session, 'canExportReports');
  }

  /**
   * Returns human-readable role badge styling
   */
  static getRoleBadgeClasses(role: AppRole): string {
    switch (role) {
      case 'super_admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'hr_manager':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'payroll_specialist':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'supervisor':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'employee':
      default:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  }
}
