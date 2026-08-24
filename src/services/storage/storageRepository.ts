import { AttendanceRecord, Employee, LeaveRequest, PayrollItem } from '../../domain';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PAYROLL, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES 
} from '../../data/mockData';

const STORAGE_KEYS = {
  EMPLOYEES: 'humassist_employees',
  PAYROLLS: 'humassist_payrolls',
  ATTENDANCES: 'humassist_attendances',
  LEAVES: 'humassist_leaves'
} as const;

export class StorageRepository {
  static getEmployees(): Employee[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || localStorage.getItem('nova_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }

  static saveEmployees(employees: Employee[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to save employees to storage', e);
    }
  }

  static getPayrolls(): PayrollItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYROLLS) || localStorage.getItem('nova_payrolls');
      return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
    } catch {
      return INITIAL_PAYROLL;
    }
  }

  static savePayrolls(payrolls: PayrollItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYROLLS, JSON.stringify(payrolls));
    } catch (e) {
      console.error('Failed to save payrolls to storage', e);
    }
  }

  static getAttendances(): AttendanceRecord[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCES) || localStorage.getItem('nova_attendances');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  }

  static saveAttendances(attendances: AttendanceRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCES, JSON.stringify(attendances));
    } catch (e) {
      console.error('Failed to save attendances to storage', e);
    }
  }

  static getLeaves(): LeaveRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES) || localStorage.getItem('nova_leaves');
      return saved ? JSON.parse(saved) : INITIAL_LEAVES;
    } catch {
      return INITIAL_LEAVES;
    }
  }

  static saveLeaves(leaves: LeaveRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
    } catch (e) {
      console.error('Failed to save leaves to storage', e);
    }
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.PAYROLLS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCES);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem('nova_employees');
    localStorage.removeItem('nova_payrolls');
    localStorage.removeItem('nova_attendances');
    localStorage.removeItem('nova_leaves');
  }
}
