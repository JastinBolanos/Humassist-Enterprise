import { Department } from './employee';

export type AttendanceStatus = 'Puntual' | 'Retardo' | 'Falta' | 'Permiso' | 'Vacaciones' | 'Remoto';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: Department;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  workHours: number;
  location: string;
  notes?: string;
  verifiedBy?: string;
}

export interface AttendanceSummary {
  punctualCount: number;
  lateCount: number;
  absentCount: number;
  remoteCount: number;
  averagePunctualityRate: number;
}
