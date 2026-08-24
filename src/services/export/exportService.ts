import { AttendanceRecord, Employee, PayrollItem } from '../../domain';

export class ExportService {
  /**
   * Helper to trigger download of a generated CSV in the browser
   */
  private static downloadCSV(filename: string, csvContent: string): void {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generates and downloads a CSV of the Payroll history
   */
  static exportPayrollToCSV(payrolls: PayrollItem[], filename = 'reporte_nominas_humassist_enterprise.csv'): void {
    const headers = [
      'ID Nómina',
      'Código Empleado',
      'Nombre',
      'Cargo',
      'Departamento',
      'Período',
      'Sueldo Base Mensual',
      'Percepciones Período',
      'Horas Extra (Hrs)',
      'Pago Horas Extra',
      'Bonos',
      'Comisiones',
      'Total Percepciones',
      'Retención ISR',
      'IMSS',
      'AFORE',
      'Otras Deducciones',
      'Total Deducciones',
      'Sueldo Neto a Pagar',
      'Estado',
      'Método de Pago',
      'Fecha Emisión'
    ];

    const rows = payrolls.map(p => [
      p.id,
      p.employeeCode,
      `"${p.employeeName}"`,
      `"${p.employeePosition}"`,
      `"${p.department}"`,
      `"${p.period}"`,
      p.baseSalary,
      p.periodSalary,
      p.overtimeHours,
      p.overtimePay,
      p.bonuses,
      p.commissions,
      p.totalEarnings,
      p.taxWithholding,
      p.socialSecurity,
      p.retirementFund,
      p.otherDeductions,
      p.totalDeductions,
      p.netSalary,
      p.status,
      p.paymentMethod,
      p.issueDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadCSV(filename, csvContent);
  }

  /**
   * Generates and downloads a CSV of the Employee directory
   */
  static exportEmployeesToCSV(employees: Employee[], filename = 'directorio_plantilla_humassist_enterprise.csv'): void {
    const headers = [
      'Código',
      'Nombre Completo',
      'Documento/CURP',
      'Correo',
      'Teléfono',
      'Cargo',
      'Departamento',
      'Tipo Contrato',
      'Sueldo Base Mensual',
      'Fecha Ingreso',
      'Estado',
      'Desempeño'
    ];

    const rows = employees.map(e => [
      e.code,
      `"${e.firstName} ${e.lastName}"`,
      e.documentId,
      e.email,
      e.phone,
      `"${e.position}"`,
      `"${e.department}"`,
      e.contractType,
      e.baseSalary,
      e.hireDate,
      e.status,
      `${e.performanceRating}/5`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadCSV(filename, csvContent);
  }

  /**
   * Generates and downloads a CSV of Attendance records
   */
  static exportAttendanceToCSV(records: AttendanceRecord[], filename = 'registro_asistencias_humassist_enterprise.csv'): void {
    const headers = [
      'ID',
      'Código Empleado',
      'Nombre',
      'Departamento',
      'Fecha',
      'Entrada',
      'Salida',
      'Estado',
      'Horas Trabajadas',
      'Sede / Ubicación',
      'Método Verificación'
    ];

    const rows = records.map(r => [
      r.id,
      r.employeeCode,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      r.checkIn || '--',
      r.checkOut || '--',
      r.status,
      r.workHours,
      `"${r.location}"`,
      `"${r.verifiedBy || 'Manual'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadCSV(filename, csvContent);
  }
}
