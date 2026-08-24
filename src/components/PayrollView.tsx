import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Plus, 
  Eye, 
  ArrowUpDown, 
  CheckSquare, 
  Square,
  Lock,
  SlidersHorizontal
} from 'lucide-react';
import { PayrollItem, Employee, UserSession, PayrollStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { translateDepartment, translatePayrollStatus } from '../i18n/translations';

interface PayrollViewProps {
  payrolls: PayrollItem[];
  employees: Employee[];
  currentSession: UserSession;
  onUpdatePayrollStatus: (id: string, newStatus: PayrollStatus) => void;
  onBatchPay: (ids: string[]) => void;
  onAddNewPayroll: (newPayroll: PayrollItem) => void;
  onViewPayslip: (payroll: PayrollItem) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payrolls,
  employees,
  currentSession,
  onUpdatePayrollStatus,
  onBatchPay,
  onAddNewPayroll,
  onViewPayslip
}) => {
  const { language, t } = useLanguage();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof PayrollItem>('employeeName');
  const [sortAsc, setSortAsc] = useState(true);

  // Selection for Batch Actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modal State for New/Adjust Payroll Form
  const [isNewPayrollModalOpen, setIsNewPayrollModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || '',
    period: 'Quincena 2 - Agosto 2026',
    baseSalary: employees[0]?.baseSalary || 45000,
    overtimeHours: 0,
    bonuses: 0,
    commissions: 0,
    notes: '',
    paymentMethod: 'Transferencia Bancaria' as const
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Periods available
  const periods = useMemo(() => {
    return Array.from(new Set(payrolls.map(p => p.period)));
  }, [payrolls]);

  // Handle employee selection change in form
  const handleEmployeeSelectChange = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    setFormData(prev => ({
      ...prev,
      employeeId: empId,
      baseSalary: emp ? emp.baseSalary : 40000
    }));
  };

  // Filter and Sort Logic
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(item => {
      // Permission filter: if employee role, can only see their own
      if (currentSession.role === 'employee') {
        const emp = employees.find(e => e.email === currentSession.email);
        if (emp && item.employeeId !== emp.id) return false;
      }

      // Search Query
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.employeePosition.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Department Filter
      if (selectedDept !== 'all' && item.department !== selectedDept) return false;

      // Status Filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      // Period Filter
      if (selectedPeriod !== 'all' && item.period !== selectedPeriod) return false;

      // Salary Range Filter
      if (selectedSalaryRange === 'low' && item.netSalary >= 22000) return false;
      if (selectedSalaryRange === 'mid' && (item.netSalary < 22000 || item.netSalary > 30000)) return false;
      if (selectedSalaryRange === 'high' && item.netSalary <= 30000) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [payrolls, searchQuery, selectedDept, selectedStatus, selectedPeriod, selectedSalaryRange, sortField, sortAsc, currentSession, employees]);

  // Batch Select Handlers
  const handleSelectAll = () => {
    if (selectedRowIds.length === filteredPayrolls.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredPayrolls.map(p => p.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchPayAction = () => {
    if (selectedRowIds.length === 0) return;
    onBatchPay(selectedRowIds);
    setSelectedRowIds([]);
  };

  // Form Validation & Submit
  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.employeeId) {
      errors.employeeId = language === 'es' ? 'Debes seleccionar un colaborador.' : 'Please select an employee.';
    }

    if (formData.baseSalary <= 0 || isNaN(formData.baseSalary)) {
      errors.baseSalary = language === 'es' ? 'El sueldo base mensual debe ser un número positivo.' : 'Monthly base salary must be a positive number.';
    }

    if (formData.overtimeHours < 0 || formData.overtimeHours > 40) {
      errors.overtimeHours = language === 'es' ? 'Las horas extras deben estar entre 0 y 40 horas.' : 'Overtime hours must be between 0 and 40.';
    }

    if (formData.bonuses < 0) {
      errors.bonuses = language === 'es' ? 'El bono no puede ser negativo.' : 'Bonus cannot be negative.';
    }

    if (formData.commissions < 0) {
      errors.commissions = language === 'es' ? 'Las comisiones no pueden ser negativas.' : 'Commissions cannot be negative.';
    }

    if ((formData.overtimeHours > 0 || formData.bonuses > 0) && !formData.notes.trim()) {
      errors.notes = language === 'es' 
        ? 'Ingresa una justificación en las observaciones para las horas extras/bonos.' 
        : 'Please enter audit notes explaining the overtime/bonus adjustment.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Calculation formulas
    const emp = employees.find(e => e.id === formData.employeeId);
    const periodSalary = formData.baseSalary / 2;
    const hourlyRate = (formData.baseSalary / 30) / 8;
    const overtimePay = Math.round(formData.overtimeHours * hourlyRate * 2);
    const totalEarnings = periodSalary + overtimePay + formData.bonuses + formData.commissions;

    // Deductions: ISR ~17%, IMSS ~4.5%, Afore ~3.5%
    const taxWithholding = Math.round(totalEarnings * 0.17);
    const socialSecurity = Math.round(totalEarnings * 0.045);
    const retirementFund = Math.round(periodSalary * 0.035);
    const totalDeductions = taxWithholding + socialSecurity + retirementFund;
    const netSalary = totalEarnings - totalDeductions;

    const newRecord: PayrollItem = {
      id: `pay-gen-${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Colaborador',
      employeeCode: emp ? emp.code : 'EMP-9999',
      employeePosition: emp ? emp.position : 'General',
      department: emp ? emp.department : 'Talento Humano',
      period: formData.period,
      issueDate: new Date().toISOString().split('T')[0],
      baseSalary: formData.baseSalary,
      periodSalary,
      overtimeHours: formData.overtimeHours,
      overtimePay,
      bonuses: formData.bonuses,
      commissions: formData.commissions,
      totalEarnings,
      taxWithholding,
      socialSecurity,
      retirementFund,
      otherDeductions: 0,
      totalDeductions,
      netSalary,
      status: 'Pendiente',
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    };

    onAddNewPayroll(newRecord);
    setIsNewPayrollModalOpen(false);
    setFormErrors({});
  };

  const handleSort = (field: keyof PayrollItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t('payroll.title')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              {filteredPayrolls.length} {t('payroll.recordsCount')}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t('payroll.sub')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentSession.permissions.canEditPayroll ? (
            <button
              id="btn-new-payroll"
              onClick={() => setIsNewPayrollModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('payroll.newAdjustmentBtn')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121215] border border-[#1F1F23] text-xs text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t('payroll.readOnlyMode')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-[#0A0A0C] rounded-2xl p-4 sm:p-5 border border-[#1F1F23] shadow-xs space-y-4">
        
        {/* Top Filter Row: Search + Fast Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-payroll-search"
              type="text"
              placeholder={t('payroll.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          {/* Department Select */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            >
              <option value="all">{t('payroll.allDepts')}</option>
              <option value="Tecnología">{translateDepartment('Tecnología', language)}</option>
              <option value="Finanzas">{translateDepartment('Finanzas', language)}</option>
              <option value="Talento Humano">{translateDepartment('Talento Humano', language)}</option>
              <option value="Operaciones">{translateDepartment('Operaciones', language)}</option>
              <option value="Ventas & Marketing">{translateDepartment('Ventas & Marketing', language)}</option>
              <option value="Legal & Cumplimiento">{translateDepartment('Legal & Cumplimiento', language)}</option>
            </select>
          </div>

          {/* Status Select */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            >
              <option value="all">{t('payroll.allStatuses')}</option>
              <option value="Pagado">{translatePayrollStatus('Pagado', language)}</option>
              <option value="En Proceso">{translatePayrollStatus('En Proceso', language)}</option>
              <option value="Pendiente">{translatePayrollStatus('Pendiente', language)}</option>
              <option value="Retenido">{translatePayrollStatus('Retenido', language)}</option>
            </select>
          </div>

          {/* Period Select */}
          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            >
              <option value="all">{t('payroll.allPeriods')}</option>
              {periods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Bottom Filter Row: Salary Range + Reset + Batch Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1F1F23] text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t('payroll.netRange')}
            </span>
            <button
              onClick={() => setSelectedSalaryRange('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSalaryRange === 'all' ? 'bg-indigo-600 text-white' : 'bg-[#141418] text-zinc-400 hover:bg-[#1f1f26] border border-[#27272a]'
              }`}
            >
              {t('payroll.rangeAll')}
            </button>
            <button
              onClick={() => setSelectedSalaryRange('low')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSalaryRange === 'low' ? 'bg-indigo-600 text-white' : 'bg-[#141418] text-zinc-400 hover:bg-[#1f1f26] border border-[#27272a]'
              }`}
            >
              &lt; $22,000
            </button>
            <button
              onClick={() => setSelectedSalaryRange('mid')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSalaryRange === 'mid' ? 'bg-indigo-600 text-white' : 'bg-[#141418] text-zinc-400 hover:bg-[#1f1f26] border border-[#27272a]'
              }`}
            >
              $22k - $30k
            </button>
            <button
              onClick={() => setSelectedSalaryRange('high')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSalaryRange === 'high' ? 'bg-indigo-600 text-white' : 'bg-[#141418] text-zinc-400 hover:bg-[#1f1f26] border border-[#27272a]'
              }`}
            >
              &gt; $30,000
            </button>
          </div>

          {/* Batch Action Bar if rows selected */}
          {selectedRowIds.length > 0 && currentSession.permissions.canEditPayroll && (
            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
              <span className="text-indigo-300 font-semibold text-xs">
                {selectedRowIds.length} {t('payroll.selectedCount')}
              </span>
              <button
                id="btn-batch-pay-action"
                onClick={handleBatchPayAction}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('payroll.batchPayBtn')}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Advanced Payroll Table */}
      <div className="bg-[#0A0A0C] rounded-2xl border border-[#1F1F23] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121215] border-b border-[#1F1F23] text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                {currentSession.permissions.canEditPayroll && (
                  <th className="p-4 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      {selectedRowIds.length === filteredPayrolls.length && filteredPayrolls.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('employeeName')}>
                  <div className="flex items-center gap-1">
                    <span>{t('payroll.colEmployee')}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4">{t('payroll.colDept')}</th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('periodSalary')}>
                  <div className="flex items-center gap-1">
                    <span>{t('payroll.colBase')}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4">{t('payroll.colOvertimeBonuses')}</th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('totalEarnings')}>
                  <div className="flex items-center gap-1">
                    <span>{t('payroll.colTotalEarnings')}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('totalDeductions')}>
                  <div className="flex items-center gap-1">
                    <span>{t('payroll.colDeductions')}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('netSalary')}>
                  <div className="flex items-center gap-1">
                    <span>{t('payroll.colNetSalary')}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4">{t('payroll.colStatus')}</th>
                <th className="p-4 text-right">{t('payroll.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F23] text-zinc-300">
              {filteredPayrolls.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-zinc-500">
                    {t('payroll.noRecords')}
                  </td>
                </tr>
              ) : (
                filteredPayrolls.map((payroll) => {
                  const emp = employees.find(e => e.id === payroll.employeeId);
                  const isSelected = selectedRowIds.includes(payroll.id);
                  const canSeeSalary = currentSession.permissions.canViewAllSalaries || (emp?.email === currentSession.email);

                  return (
                    <tr 
                      key={payroll.id} 
                      className={`hover:bg-[#121216] transition-colors ${isSelected ? 'bg-indigo-950/20' : ''}`}
                    >
                      {currentSession.permissions.canEditPayroll && (
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleRow(payroll.id)}
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}

                      {/* Colaborador */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={payroll.employeeName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-[#27272a]"
                          />
                          <div>
                            <span className="font-bold text-zinc-100 block">{payroll.employeeName}</span>
                            <span className="text-[11px] text-zinc-400 font-mono">{payroll.employeeCode} • {payroll.employeePosition}</span>
                          </div>
                        </div>
                      </td>

                      {/* Departamento */}
                      <td className="p-4">
                        <span className="text-zinc-300">{translateDepartment(payroll.department, language)}</span>
                      </td>

                      {/* Base Quincenal */}
                      <td className="p-4 font-mono">
                        {canSeeSalary ? (
                          `$${payroll.periodSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}`
                        ) : (
                          `••••••`
                        )}
                      </td>

                      {/* Extras */}
                      <td className="p-4 font-mono">
                        {canSeeSalary ? (
                          payroll.overtimePay > 0 || payroll.bonuses > 0 ? (
                            <span className="text-emerald-400 font-semibold">
                              +${(payroll.overtimePay + payroll.bonuses + payroll.commissions).toLocaleString(language === 'es' ? 'es-MX' : 'en-US')}
                            </span>
                          ) : (
                            <span className="text-zinc-500">$0.00</span>
                          )
                        ) : (
                          `••••••`
                        )}
                      </td>

                      {/* Bruto Total */}
                      <td className="p-4 font-mono font-medium">
                        {canSeeSalary ? (
                          `$${payroll.totalEarnings.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}`
                        ) : (
                          `••••••`
                        )}
                      </td>

                      {/* Deducciones */}
                      <td className="p-4 font-mono text-rose-400">
                        {canSeeSalary ? (
                          `-$${payroll.totalDeductions.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}`
                        ) : (
                          `••••••`
                        )}
                      </td>

                      {/* Neto a Pagar */}
                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        {canSeeSalary ? (
                          `$${payroll.netSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}`
                        ) : (
                          `••••••••`
                        )}
                      </td>

                      {/* Estado */}
                      <td className="p-4">
                        {currentSession.permissions.canEditPayroll ? (
                          <select
                            value={payroll.status}
                            onChange={(e) => onUpdatePayrollStatus(payroll.id, e.target.value as PayrollStatus)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              payroll.status === 'Pagado'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : payroll.status === 'En Proceso'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-[#18181B] text-zinc-300 border-[#27272a]'
                            }`}
                          >
                            <option value="Pagado" className="bg-[#121215] text-zinc-200">{translatePayrollStatus('Pagado', language)}</option>
                            <option value="En Proceso" className="bg-[#121215] text-zinc-200">{translatePayrollStatus('En Proceso', language)}</option>
                            <option value="Pendiente" className="bg-[#121215] text-zinc-200">{translatePayrollStatus('Pendiente', language)}</option>
                            <option value="Retenido" className="bg-[#121215] text-zinc-200">{translatePayrollStatus('Retenido', language)}</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            payroll.status === 'Pagado'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : payroll.status === 'En Proceso'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-[#18181B] text-zinc-300 border-[#27272a]'
                          }`}>
                            {translatePayrollStatus(payroll.status, language)}
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onViewPayslip(payroll)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-indigo-600 hover:text-white text-zinc-300 font-semibold text-xs transition-colors inline-flex items-center gap-1.5 border border-[#27272a]"
                          title="Ver y Descargar Recibo CFDI"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('payroll.payslipBtn')}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nuevo Ajuste / Generación de Nómina con Validaciones */}
      {isNewPayrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-xl w-full border border-[#1F1F23] overflow-hidden my-8">
            <div className="bg-[#121215] px-6 py-4 flex items-center justify-between text-white border-b border-[#1F1F23]">
              <div>
                <h3 className="text-base font-bold">{t('payroll.modalTitle')}</h3>
                <p className="text-xs text-zinc-400">{t('payroll.modalSub')}</p>
              </div>
              <button
                onClick={() => setIsNewPayrollModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleValidateAndSubmit} className="p-6 space-y-4 text-xs">
              {/* Colaborador */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  {t('payroll.assignedColab')}
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => handleEmployeeSelectChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-[#121215] text-zinc-200">
                      {emp.firstName} {emp.lastName} ({emp.code}) - {translateDepartment(emp.department, language)}
                    </option>
                  ))}
                </select>
                {formErrors.employeeId && (
                  <p className="text-rose-400 text-[11px] mt-1">{formErrors.employeeId}</p>
                )}
              </div>

              {/* Periodo */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  {t('payroll.payrollPeriod')}
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200"
                />
              </div>

              {/* Sueldo Base Mensual */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {t('payroll.monthlyBaseSalary')}
                  </label>
                  <input
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                  />
                  {formErrors.baseSalary && (
                    <p className="text-rose-400 text-[11px] mt-1">{formErrors.baseSalary}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {t('payroll.overtimeHours')}
                  </label>
                  <input
                    type="number"
                    value={formData.overtimeHours}
                    onChange={(e) => setFormData({ ...formData, overtimeHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                  />
                  {formErrors.overtimeHours && (
                    <p className="text-rose-400 text-[11px] mt-1">{formErrors.overtimeHours}</p>
                  )}
                </div>
              </div>

              {/* Bonos y Comisiones */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {t('payroll.productivityBonus')}
                  </label>
                  <input
                    type="number"
                    value={formData.bonuses}
                    onChange={(e) => setFormData({ ...formData, bonuses: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {t('payroll.commercialCommissions')}
                  </label>
                  <input
                    type="number"
                    value={formData.commissions}
                    onChange={(e) => setFormData({ ...formData, commissions: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  {t('payroll.justificationNotes')}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('payroll.justificationPlaceholder')}
                  className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                />
                {formErrors.notes && (
                  <p className="text-rose-400 text-[11px] mt-1">{formErrors.notes}</p>
                )}
              </div>

              {/* Dynamic Live Preview Box */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5 font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>{t('payroll.livePreviewBase')}</span>
                  <span className="text-zinc-200">${(formData.baseSalary / 2).toLocaleString(language === 'es' ? 'es-MX' : 'en-US')}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>{t('payroll.livePreviewDeductions')}</span>
                  <span className="text-rose-400">-${Math.round((formData.baseSalary / 2 + formData.bonuses + formData.commissions) * 0.215).toLocaleString(language === 'es' ? 'es-MX' : 'en-US')}</span>
                </div>
                <div className="pt-2 border-t border-indigo-500/30 flex justify-between font-bold text-zinc-100 text-sm">
                  <span>{t('payroll.livePreviewNet')}</span>
                  <span className="text-emerald-400">${Math.round((formData.baseSalary / 2 + formData.bonuses + formData.commissions) * 0.785).toLocaleString(language === 'es' ? 'es-MX' : 'en-US')}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setIsNewPayrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f26] text-zinc-300 font-semibold transition-colors border border-[#27272a]"
                >
                  {t('payroll.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm"
                >
                  {t('payroll.generateAndSave')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
