import { AttendanceRecord, Employee, LeaveRequest, PayrollItem } from '../../domain';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PAYROLL, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES 
} from '../../data/mockData';

const STORAGE_KEYS = {
  EMPLOYEES: 'humassist_employees_v2',
  PAYROLLS: 'humassist_payrolls_v2',
  ATTENDANCES: 'humassist_attendances_v2',
  LEAVES: 'humassist_leaves_v2'
} as const;

export class StorageRepository {
  static getEmployees(): Employee[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (!saved) return INITIAL_EMPLOYEES;
      const parsed: Employee[] = JSON.parse(saved);
      let updated = false;
      const employees = parsed.map(emp => {
        if (emp.id === 'emp-7' && (emp.avatar?.includes('1628157582853-a796fa650a6a') || !emp.avatar)) {
          updated = true;
          return { ...emp, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' };
        }
        return emp;
      });
      if (updated) {
        this.saveEmployees(employees);
      }
      return employees;
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
      const saved = localStorage.getItem(STORAGE_KEYS.PAYROLLS);
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
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCES);
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
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
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
    localStorage.removeItem('humassist_employees');
    localStorage.removeItem('humassist_payrolls');
    localStorage.removeItem('humassist_attendances');
    localStorage.removeItem('humassist_leaves');
    localStorage.removeItem('nova_employees');
    localStorage.removeItem('nova_payrolls');
    localStorage.removeItem('nova_attendances');
    localStorage.removeItem('nova_leaves');
  }
}
