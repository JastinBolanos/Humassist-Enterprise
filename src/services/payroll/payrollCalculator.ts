import { Employee, PayrollItem, PayrollSummaryMetrics } from '../../domain';

export class PayrollCalculator {
  /**
   * Calculates the pro-rated period salary (e.g. biweekly = monthly / 2)
   */
  static calculatePeriodSalary(baseSalary: number): number {
    return Math.round(baseSalary / 2);
  }

  /**
   * Calculates standard Mexican ISR tax withholding (~17% effective tier)
   */
  static calculateTaxWithholding(periodSalary: number): number {
    return Math.round(periodSalary * 0.17);
  }

  /**
   * Calculates IMSS Social Security employee deduction (~4.5%)
   */
  static calculateSocialSecurity(periodSalary: number): number {
    return Math.round(periodSalary * 0.045);
  }

  /**
   * Calculates AFORE Retirement fund employee contribution (~3.5%)
   */
  static calculateRetirementFund(periodSalary: number): number {
    return Math.round(periodSalary * 0.035);
  }

  /**
   * Calculates overtime compensation based on hourly rate and double time multiplier
   */
  static calculateOvertimePay(baseSalary: number, hours: number): number {
    if (hours <= 0) return 0;
    const hourlyRate = (baseSalary / 30) / 8;
    return Math.round(hourlyRate * hours * 2);
  }

  /**
   * Generates a fully calculated initial payroll record for a new employee
   */
  static createInitialPayrollForEmployee(employee: Employee, periodName = 'Quincena 2 - Agosto 2026'): PayrollItem {
    const periodSalary = this.calculatePeriodSalary(employee.baseSalary);
    const taxWithholding = this.calculateTaxWithholding(periodSalary);
    const socialSecurity = this.calculateSocialSecurity(periodSalary);
    const retirementFund = this.calculateRetirementFund(periodSalary);
    const totalDeductions = taxWithholding + socialSecurity + retirementFund;
    const netSalary = periodSalary - totalDeductions;

    return {
      id: `pay-gen-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeCode: employee.code,
      employeePosition: employee.position,
      department: employee.department,
      period: periodName,
      issueDate: new Date().toISOString().split('T')[0],
      baseSalary: employee.baseSalary,
      periodSalary,
      overtimeHours: 0,
      overtimePay: 0,
      bonuses: 0,
      commissions: 0,
      totalEarnings: periodSalary,
      taxWithholding,
      socialSecurity,
      retirementFund,
      otherDeductions: 0,
      totalDeductions,
      netSalary,
      status: 'Pendiente',
      paymentMethod: 'Transferencia Bancaria'
    };
  }

  /**
   * Calculates aggregated metrics across a list of payroll items
   */
  static calculateMetrics(payrolls: PayrollItem[]): PayrollSummaryMetrics {
    const totalDisbursed = payrolls
      .filter(p => p.status === 'Pagado')
      .reduce((sum, p) => sum + p.netSalary, 0);

    const pendingCount = payrolls.filter(p => p.status === 'Pendiente').length;
    const processedCount = payrolls.filter(p => p.status === 'Pagado' || p.status === 'En Proceso').length;
    const totalTaxesWithheld = payrolls.reduce((sum, p) => sum + p.taxWithholding, 0);
    const averageNetSalary = payrolls.length > 0
      ? Math.round(payrolls.reduce((sum, p) => sum + p.netSalary, 0) / payrolls.length)
      : 0;

    return {
      totalDisbursed,
      pendingCount,
      processedCount,
      averageNetSalary,
      totalTaxesWithheld
    };
  }
}
