import React from 'react';
import { PayrollItem, Employee } from '../types';
import { X, Printer, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { translateDepartment, translatePayrollStatus } from '../i18n/translations';

interface PayslipModalProps {
  payroll: PayrollItem | null;
  employee?: Employee;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ payroll, employee, onClose }) => {
  const { language, t } = useLanguage();
  if (!payroll) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 pb-16 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-3xl w-full border border-[#1F1F23] overflow-hidden my-4 text-zinc-200 shrink-0">
        
        {/* Modal Top Bar */}
        <div className="bg-[#121215] px-6 py-4 flex items-center justify-between text-white border-b border-[#1F1F23]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs tracking-wider">
              CFDI
            </div>
            <div>
              <h3 className="text-base font-bold">{t('payslip.modalTitle')}</h3>
              <p className="text-xs text-zinc-400 font-mono">{t('payslip.fiscalIdPrefix')}: {payroll.id.toUpperCase()}-2026-SAT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272a] text-xs font-semibold text-zinc-200 border border-[#27272a] transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('payslip.printBtn')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#18181B] text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Empresa y Empleado */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#1F1F23]">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                <Building2 className="w-5 h-5" />
                <span>HUMASSIST Enterprise Soluciones S.A. de C.V.</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">RFC: HME180924HT8 • {t('payslip.employerId')}: Y54-19283-10</p>
              <p className="text-xs text-zinc-400">Paseo de la Reforma 222, Piso 18, Cuauhtémoc, CDMX</p>
            </div>

            <div className="text-right sm:text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                payroll.status === 'Pagado'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {translatePayrollStatus(payroll.status, language).toUpperCase()}
              </span>
              <p className="text-xs text-zinc-400 font-mono mt-1.5">{t('payslip.period')}: {payroll.period}</p>
              <p className="text-xs text-zinc-400 font-mono">{t('payslip.issueDate')}: {payroll.issueDate}</p>
            </div>
          </div>

          {/* Datos del Colaborador */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#121215] border border-[#1F1F23] text-xs">
            <div>
              <span className="text-zinc-400 block font-medium">{t('payslip.colab')}:</span>
              <span className="font-bold text-zinc-100">{payroll.employeeName}</span>
            </div>
            <div>
              <span className="text-zinc-400 block font-medium">{t('payslip.codeDni')}:</span>
              <span className="font-mono text-zinc-100">{payroll.employeeCode} • {employee?.documentId || 'ID-REG'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block font-medium">{t('payslip.position')}:</span>
              <span className="text-zinc-100">{payroll.employeePosition}</span>
            </div>
            <div>
              <span className="text-zinc-400 block font-medium">{t('payslip.department')}:</span>
              <span className="text-zinc-100">{translateDepartment(payroll.department, language)}</span>
            </div>
          </div>

          {/* Desglose Percepciones vs Deducciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Percepciones (Ingresos) */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-500/20 pb-2 mb-3">
                {t('payslip.perceptionsTitle')}
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>{t('payslip.baseSalaryPeriod')}:</span>
                  <span className="font-mono font-medium">${payroll.periodSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {payroll.overtimeHours > 0 && (
                  <div className="flex justify-between text-zinc-300">
                    <span>{t('payslip.overtimeHoursLabel')} ({payroll.overtimeHours} hrs):</span>
                    <span className="font-mono font-medium">${payroll.overtimePay.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {payroll.bonuses > 0 && (
                  <div className="flex justify-between text-zinc-300">
                    <span>{t('payslip.productivityBonuses')}:</span>
                    <span className="font-mono font-medium">${payroll.bonuses.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {payroll.commissions > 0 && (
                  <div className="flex justify-between text-zinc-300">
                    <span>{t('payslip.commissions')}:</span>
                    <span className="font-mono font-medium">${payroll.commissions.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-emerald-500/20 flex justify-between font-bold text-emerald-300 text-sm">
                  <span>{t('payslip.grossEarnings')}:</span>
                  <span className="font-mono">${payroll.totalEarnings.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Deducciones */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-rose-500/20 pb-2 mb-3">
                {t('payslip.deductionsTitle')}
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>{t('payslip.isrTax')}:</span>
                  <span className="font-mono font-medium">-${payroll.taxWithholding.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>{t('payslip.imssHealth')}:</span>
                  <span className="font-mono font-medium">-${payroll.socialSecurity.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>{t('payslip.aforeRetirement')}:</span>
                  <span className="font-mono font-medium">-${payroll.retirementFund.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {payroll.otherDeductions > 0 && (
                  <div className="flex justify-between text-zinc-300">
                    <span>{t('payslip.otherDeductions')}:</span>
                    <span className="font-mono font-medium">-${payroll.otherDeductions.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-rose-500/20 flex justify-between font-bold text-rose-300 text-sm">
                  <span>{t('payslip.totalDeductions')}:</span>
                  <span className="font-mono">-${payroll.totalDeductions.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Gran Total Neto a Pagar */}
          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-indigo-300 font-medium block">{t('payslip.netToReceive')}:</span>
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400">
                ${payroll.netSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })} {language === 'es' ? 'MXN' : 'USD'}
              </span>
            </div>
            <div className="text-right text-xs text-indigo-200">
              <p className="font-medium">{t('payslip.paymentMethod')}: {payroll.paymentMethod}</p>
              <p className="text-[11px] text-indigo-300 font-mono">{t('payslip.account')}: {employee?.bankAccount || (language === 'es' ? 'Transferencia Bancaria SPEI' : 'Direct SPEI Wire')}</p>
            </div>
          </div>

          {/* Notas y Sello Digital */}
          {payroll.notes && (
            <div className="p-3 rounded-lg bg-[#141418] border border-[#1F1F23] text-xs text-zinc-300">
              <span className="font-bold text-zinc-100">{t('payslip.notes')}: </span>
              <span>{payroll.notes}</span>
            </div>
          )}

          {/* Timbre Fiscal / Seguridad */}
          <div className="pt-4 border-t border-[#1F1F23] flex items-center justify-between text-[10px] text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{t('payslip.complianceNotice')}</span>
            </div>
            <span className="font-mono">UUID: 9E10-4820-F829-1092-AA</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#121215] px-6 py-4 border-t border-[#1F1F23] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1f1f26] hover:bg-[#272730] text-white text-xs font-semibold border border-[#27272a] transition-colors"
          >
            {t('payslip.closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
