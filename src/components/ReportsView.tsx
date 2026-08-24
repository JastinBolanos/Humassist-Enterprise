import React from 'react';
import { 
  Download
} from 'lucide-react';
import { PayrollItem, Employee, AttendanceRecord, UserSession } from '../types';
import { DEPARTMENTS } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { translateDepartment } from '../i18n/translations';

interface ReportsViewProps {
  payrolls: PayrollItem[];
  employees: Employee[];
  attendances: AttendanceRecord[];
  currentSession: UserSession;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  payrolls,
  employees,
  attendances,
  currentSession
}) => {
  const { language, t } = useLanguage();

  // Export CSV Helper
  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Handlers
  const exportPayrollCSV = () => {
    const headers = language === 'es' 
      ? ['ID', 'Colaborador', 'Codigo', 'Puesto', 'Departamento', 'Periodo', 'SueldoBase', 'HorasExtras', 'Bonos', 'BrutoTotal', 'ISR', 'IMSS', 'Afore', 'Neto', 'Estado']
      : ['ID', 'Employee', 'Code', 'Position', 'Department', 'Period', 'BaseSalary', 'Overtime', 'Bonuses', 'GrossTotal', 'TaxWithholding', 'SocialSecurity', 'RetirementFund', 'NetSalary', 'Status'];
    
    const rows = payrolls.map(p => [
      p.id,
      `"${p.employeeName}"`,
      p.employeeCode,
      `"${p.employeePosition}"`,
      `"${translateDepartment(p.department, language)}"`,
      `"${p.period}"`,
      p.baseSalary,
      p.overtimePay,
      p.bonuses,
      p.totalEarnings,
      p.taxWithholding,
      p.socialSecurity,
      p.retirementFund,
      p.netSalary,
      p.status
    ]);
    downloadCSV(`Payroll_HUMASSIST_Enterprise_${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
  };

  const exportEmployeesCSV = () => {
    const headers = language === 'es'
      ? ['ID', 'Codigo', 'Nombre', 'Apellidos', 'Email', 'Telefono', 'Documento', 'Puesto', 'Departamento', 'Contrato', 'SueldoBase', 'FechaIngreso', 'Estado']
      : ['ID', 'Code', 'FirstName', 'LastName', 'Email', 'Phone', 'TaxID', 'Position', 'Department', 'Contract', 'BaseSalary', 'HireDate', 'Status'];

    const rows = employees.map(e => [
      e.id,
      e.code,
      `"${e.firstName}"`,
      `"${e.lastName}"`,
      e.email,
      `"${e.phone}"`,
      e.documentId,
      `"${e.position}"`,
      `"${translateDepartment(e.department, language)}"`,
      e.contractType,
      e.baseSalary,
      e.hireDate,
      e.status
    ]);
    downloadCSV(`Employees_HUMASSIST_Enterprise_${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
  };

  const exportAttendanceCSV = () => {
    const headers = language === 'es'
      ? ['ID', 'Colaborador', 'Codigo', 'Departamento', 'Fecha', 'Entrada', 'Salida', 'HorasTrabajadas', 'Estado', 'Ubicacion']
      : ['ID', 'Employee', 'Code', 'Department', 'Date', 'CheckIn', 'CheckOut', 'HoursWorked', 'Status', 'Location'];

    const rows = attendances.map(a => [
      a.id,
      `"${a.employeeName}"`,
      a.employeeCode,
      `"${translateDepartment(a.department, language)}"`,
      a.date,
      a.checkIn || '',
      a.checkOut || '',
      a.workHours,
      a.status,
      `"${a.location}"`
    ]);
    downloadCSV(`Daily_Attendance_${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
  };

  const totalTax = payrolls.reduce((acc, curr) => acc + curr.taxWithholding, 0);
  const totalIMSS = payrolls.reduce((acc, curr) => acc + curr.socialSecurity, 0);
  const totalAfore = payrolls.reduce((acc, curr) => acc + curr.retirementFund, 0);
  const totalOvertime = payrolls.reduce((acc, curr) => acc + curr.overtimePay, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t('reports.title')}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {t('reports.sub')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportPayrollCSV}
            className="px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f26] text-zinc-200 border border-[#27272a] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('reports.exportPayrollCsv')}</span>
          </button>
          <button
            onClick={exportEmployeesCSV}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('reports.exportEmployeesCsv')}</span>
          </button>
        </div>
      </div>

      {/* Analytical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t('reports.taxWithholdings')}
          </span>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-rose-400">
              ${totalTax.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              {t('reports.avgEffectiveRate')}
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t('reports.socialSecurityContributions')}
          </span>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              ${totalIMSS.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              {t('reports.imssHealthInsurance')}
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t('reports.retirementFund')}
          </span>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              ${totalAfore.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              {t('reports.severanceOldAge')}
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t('reports.overtimeExpense')}
          </span>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-amber-400">
              ${totalOvertime.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              {t('reports.overtimeRegistered')}
            </span>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-[#0A0A0C] rounded-2xl border border-[#1F1F23] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#1F1F23] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              {t('reports.deptBreakdownTitle')}
            </h3>
            <p className="text-xs text-zinc-400">{t('reports.deptBreakdownSub')}</p>
          </div>
          <button
            onClick={exportAttendanceCSV}
            className="px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f26] text-zinc-300 border border-[#27272a] font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('reports.exportAttendanceCsv')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121215] border-b border-[#1F1F23] text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">{t('reports.colDepartment')}</th>
                <th className="p-4">{t('reports.colDeptLead')}</th>
                <th className="p-4">{t('reports.colActiveCount')}</th>
                <th className="p-4">{t('reports.colMonthlyBudget')}</th>
                <th className="p-4">{t('reports.colRealPayroll')}</th>
                <th className="p-4">{t('reports.colBudgetStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F23] text-zinc-300">
              {DEPARTMENTS.map((dept) => {
                const deptEmployees = employees.filter(e => e.department === dept.name);
                const deptPayrolls = payrolls.filter(p => p.department === dept.name);
                const realCost = deptPayrolls.reduce((acc, curr) => acc + curr.totalEarnings, 0);

                return (
                  <tr key={dept.name} className="hover:bg-[#121216]">
                    <td className="p-4 font-bold text-zinc-100">{translateDepartment(dept.name, language)}</td>
                    <td className="p-4 text-zinc-400">{dept.lead}</td>
                    <td className="p-4 font-mono font-medium text-zinc-300">{deptEmployees.length} {t('reports.activeStaffSuffix')}</td>
                    <td className="p-4 font-mono text-zinc-300">${dept.budget.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')} {language === 'es' ? 'MXN' : 'USD'}</td>
                    <td className="p-4 font-mono font-bold text-indigo-400">
                      ${realCost.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')} {language === 'es' ? 'MXN' : 'USD'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t('reports.withinBudget')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
