import { Department } from './employee';

export type LeaveType = 'Vacaciones' | 'Incapacidad Médica' | 'Asunto Personal' | 'Duelo' | 'Paternidad/Maternidad';
export type LeaveStatus = 'Aprobado' | 'Pendiente' | 'Rechazado';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: Department;
  type: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}
