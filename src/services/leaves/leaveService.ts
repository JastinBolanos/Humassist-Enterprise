import { LeaveRequest, LeaveStatus } from '../../domain';

export class LeaveService {
  /**
   * Reviews a leave request by setting status and reviewer info
   */
  static reviewRequest(
    request: LeaveRequest,
    status: LeaveStatus,
    reviewerName: string,
    comments?: string
  ): LeaveRequest {
    return {
      ...request,
      status,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString().split('T')[0],
      comments: comments || (status === 'Aprobado' ? 'Aprobado conforme a la política' : 'Rechazado por necesidades operativas')
    };
  }

  /**
   * Filters pending leave requests
   */
  static getPendingLeaves(leaves: LeaveRequest[]): LeaveRequest[] {
    return leaves.filter(l => l.status === 'Pendiente');
  }

  /**
   * Calculates total days approved across requests
   */
  static calculateApprovedDays(leaves: LeaveRequest[], employeeId?: string): number {
    return leaves
      .filter(l => l.status === 'Aprobado' && (!employeeId || l.employeeId === employeeId))
      .reduce((sum, l) => sum + l.daysCount, 0);
  }
}
