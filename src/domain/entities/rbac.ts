export type AppRole = 'super_admin' | 'hr_manager' | 'payroll_specialist' | 'supervisor' | 'employee';

export interface UserPermissions {
  canViewAllSalaries: boolean;
  canEditPayroll: boolean;
  canApproveLeaves: boolean;
  canManageEmployees: boolean;
  canConfigureRoles: boolean;
  canExportReports: boolean;
  canClockInOut: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  roleTitle: string;
  department: string;
  avatar: string;
  permissions: UserPermissions;
}

export interface RolePermissionMatrix {
  role: AppRole;
  name: string;
  description: string;
  badgeColor: string;
  permissions: {
    label: string;
    key: keyof UserPermissions;
    granted: boolean;
  }[];
}
