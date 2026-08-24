import { Department } from './employee';

export type PayrollStatus = 'Pagado' | 'En Proceso' | 'Pendiente' | 'Retenido';
export type PaymentMethod = 'Transferencia Bancaria' | 'Cheque' | 'Depósito';

export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeePosition: string;
  department: Department;
  period: string; // e.g. "Quincena 2 - Agosto 2026"
  issueDate: string;
  paymentDate?: string;
  baseSalary: number; // monthly base
  periodSalary: number; // pro-rated for period
  overtimeHours: number;
  overtimePay: number;
  bonuses: number;
  commissions: number;
  totalEarnings: number;
  
  // Deductions
  taxWithholding: number; // ISR
  socialSecurity: number; // IMSS / Seguro Médico
  retirementFund: number; // AFORE / Pension
  otherDeductions: number;
  totalDeductions: number;
  
  netSalary: number;
  status: PayrollStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface PayrollSummaryMetrics {
  totalDisbursed: number;
  pendingCount: number;
  processedCount: number;
  averageNetSalary: number;
  totalTaxesWithheld: number;
}
