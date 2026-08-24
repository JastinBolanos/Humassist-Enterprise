import { AttendanceRecord, AttendanceStatus, Employee } from '../../domain';

export class AttendanceService {
  /**
   * Evaluates punctuality based on standard entry time (09:00 AM)
   */
  static evaluateStatus(date: Date = new Date()): AttendanceStatus {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Check-in after 09:15 is considered Late (Retardo)
    if (hours > 9 || (hours === 9 && minutes > 15)) {
      return 'Retardo';
    }
    return 'Puntual';
  }

  /**
   * Creates a clock-in record for an employee
   */
  static createClockInRecord(
    employee: Employee,
    location = 'Sede Corporativa Reforma',
    verifiedBy = 'Biométrico Facial'
  ): AttendanceRecord {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const status = this.evaluateStatus(now);

    return {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.code,
      department: employee.department,
      date: dateStr,
      checkIn: timeStr,
      checkOut: null,
      status,
      workHours: 0,
      location,
      verifiedBy
    };
  }

  /**
   * Calculates metrics for attendance records
   */
  static calculateSummary(records: AttendanceRecord[]) {
    const total = records.length || 1;
    const punctualCount = records.filter(r => r.status === 'Puntual').length;
    const lateCount = records.filter(r => r.status === 'Retardo').length;
    const absentCount = records.filter(r => r.status === 'Falta').length;
    const remoteCount = records.filter(r => r.status === 'Remoto').length;
    const averagePunctualityRate = Math.round((punctualCount / total) * 100);

    return {
      total,
      punctualCount,
      lateCount,
      absentCount,
      remoteCount,
      averagePunctualityRate
    };
  }
}
