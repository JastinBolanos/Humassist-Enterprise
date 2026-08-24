import React from 'react';
import { 
  Banknote, 
  Users, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Employee, PayrollItem, AttendanceRecord, LeaveRequest, UserSession } from '../types';
import { DEPARTMENTS } from '../data/mockData';
import { ActiveTab } from './Sidebar';
import { useLanguage } from '../i18n/LanguageContext';
import { translateDepartment, translateRoleTitle, translateAttendanceStatus } from '../i18n/translations';

interface DashboardViewProps {
  employees: Employee[];
  payrolls: PayrollItem[];
  attendances: AttendanceRecord[];
  leaves: LeaveRequest[];
  currentSession: UserSession;
  onNavigate: (tab: ActiveTab) => void;
  onClockInModal: () => void;
  onNewEmployeeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  payrolls,
  attendances,
  leaves,
  currentSession,
  onNavigate,
  onClockInModal,
  onNewEmployeeModal
}) => {
  const { language, t } = useLanguage();

  // Compute Key Metrics
  const totalPayrollCost = payrolls.reduce((acc, curr) => acc + curr.totalEarnings, 0);
  const totalNetDisbursed = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);
  const paidCount = payrolls.filter(p => p.status === 'Pagado').length;
  const pendingPayrollCount = payrolls.filter(p => p.status === 'Pendiente' || p.status === 'En Proceso').length;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Activo').length;

  const todayPresent = attendances.filter(a => a.status === 'Puntual' || a.status === 'Retardo' || a.status === 'Remoto').length;
  const attendanceRate = totalEmployees > 0 ? ((todayPresent / totalEmployees) * 100).toFixed(1) : '100';

  const pendingLeaves = leaves.filter(l => l.status === 'Pendiente');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner: Greeting & Quick Status */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d0d12] via-[#141424] to-[#0d0d12] text-white p-6 sm:p-8 border border-[#1F1F23] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('dashboard.bannerPill')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('dashboard.welcome')} {currentSession.name}
            </h1>
            <p className="text-sm text-zinc-300 mt-1.5 max-w-xl">
              {t('dashboard.roleDesc')} <span className="text-indigo-400 font-semibold">{translateRoleTitle(currentSession.role, language)}</span>. 
              {' '}{t('dashboard.monitorDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {currentSession.permissions.canClockInOut && (
              <button
                id="btn-dash-clockin"
                onClick={onClockInModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>{t('dashboard.clockBtn')}</span>
              </button>
            )}

            {currentSession.permissions.canManageEmployees && (
              <button
                id="btn-dash-new-emp"
                onClick={onNewEmployeeModal}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('dashboard.newEmployeeBtn')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle Decorative Gradient */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Nómina */}
        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t('dashboard.kpiPayroll')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            {currentSession.permissions.canViewAllSalaries ? (
              <>
                <span className="text-2xl font-bold font-mono text-zinc-100">
                  ${totalPayrollCost.toLocaleString(language === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5 font-mono">
                  {t('dashboard.kpiNet')} ${totalNetDisbursed.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')} {language === 'es' ? 'MXN' : 'USD'}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold font-mono text-zinc-100">
                  ••••••••••
                </span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">
                  {t('dashboard.kpiRestricted')}
                </span>
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {paidCount} {t('dashboard.kpiPaidOf')} {payrolls.length} {t('dashboard.kpiPaidSuffix')}
            </span>
            <button 
              onClick={() => onNavigate('payroll')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{t('dashboard.kpiViewTable')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI 2: Plantilla */}
        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t('dashboard.kpiActiveStaff')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {activeEmployees} {t('dashboard.kpiStaffSuffix')}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
              {t('dashboard.kpiFormalContracts')}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs">
            <span className="text-zinc-400">{t('dashboard.kpiDeptsCount')}</span>
            <button 
              onClick={() => onNavigate('employees')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{t('dashboard.kpiDirectory')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI 3: Asistencia Hoy */}
        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t('dashboard.kpiDailyAttendance')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {attendanceRate}%
            </span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              {todayPresent} {t('dashboard.kpiActiveToday')}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">{t('dashboard.kpiRemoteVacation')}</span>
            <button 
              onClick={() => onNavigate('attendance')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{t('dashboard.kpiDetail')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI 4: Solicitudes Pendientes */}
        <div className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t('dashboard.kpiLeavesIncidents')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {pendingLeaves.length} {t('dashboard.kpiPendingCount')}
            </span>
            <span className="text-[11px] text-amber-400 font-medium block mt-0.5">
              {t('dashboard.kpiRequireReview')}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs">
            <span className="text-zinc-400">{language === 'es' ? '1 Médico • 1 Personal' : '1 Medical • 1 Personal'}</span>
            <button 
              onClick={() => onNavigate('attendance')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{t('dashboard.kpiReview')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Actionable Incidents Banner */}
      {pendingPayrollCount > 0 && currentSession.permissions.canEditPayroll && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                {t('dashboard.pendingPayrollAlert')} {pendingPayrollCount} {t('dashboard.pendingPayrollAlertSuffix')}
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {t('dashboard.pendingPayrollSub')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('payroll')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shrink-0"
          >
            {t('dashboard.goToPayroll')}
          </button>
        </div>
      )}

      {/* Main Grid: Department Distribution & Attendance Today */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Department Budget & Headcount */}
        <div className="lg:col-span-7 bg-[#0A0A0C] rounded-2xl p-6 border border-[#1F1F23] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#1F1F23]">
            <div>
              <h3 className="text-base font-bold text-white">
                {t('dashboard.deptDistribution')}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t('dashboard.deptDistributionSub')}
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 font-mono">
              {t('dashboard.unitsCount')}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {DEPARTMENTS.map((dept) => {
              const deptEmployees = employees.filter(e => e.department === dept.name);
              const deptSalary = deptEmployees.reduce((acc, curr) => acc + curr.baseSalary, 0);
              const percent = totalPayrollCost > 0 ? (deptSalary / (totalPayrollCost * 2)) * 100 : 20;

              return (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">{translateDepartment(dept.name, language)}</span>
                      <span className="text-[10px] text-zinc-500">({deptEmployees.length} {t('dashboard.colabSuffix')})</span>
                    </div>
                    <div className="font-mono font-bold text-zinc-100">
                      {currentSession.permissions.canViewAllSalaries ? (
                        `$${deptSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')} ${t('dashboard.monthSuffix')}`
                      ) : (
                        `••••••`
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#16161c] rounded-full h-2 overflow-hidden border border-[#222228]">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Today's Attendance Feed */}
        <div className="lg:col-span-5 bg-[#0A0A0C] rounded-2xl p-6 border border-[#1F1F23] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F23]">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('dashboard.attendanceToday')}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {t('dashboard.attendanceTodaySub')}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {t('dashboard.live')}
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {attendances.slice(0, 5).map((record) => (
                <div 
                  key={record.id} 
                  className="p-3 rounded-xl bg-[#121215] border border-[#1F1F23] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-100 truncate">{record.employeeName}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{record.location}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      record.status === 'Puntual'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : record.status === 'Retardo'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : record.status === 'Remoto'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {translateAttendanceStatus(record.status, language)}
                    </span>
                    <span className="text-[11px] text-zinc-400 block font-mono mt-0.5">
                      {record.checkIn || t('dashboard.unclocked')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#1F1F23]">
            <button
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 rounded-xl bg-[#141418] hover:bg-[#1c1c22] text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#27272a]"
            >
              <span>{t('dashboard.fullAttendanceReport')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
