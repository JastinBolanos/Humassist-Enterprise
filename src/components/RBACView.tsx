import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  X
} from 'lucide-react';
import { UserSession, AppRole } from '../types';
import { ROLE_DEFINITIONS } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { translateRoleTitle } from '../i18n/translations';

interface RBACViewProps {
  currentSession: UserSession;
  onSwitchRole: (role: AppRole) => void;
}

export const RBACView: React.FC<RBACViewProps> = ({ currentSession, onSwitchRole }) => {
  const { language, t } = useLanguage();

  const getRoleDesc = (role: AppRole) => {
    switch (role) {
      case 'super_admin':
        return language === 'es'
          ? 'Control irrestricto de toda la plataforma, configuración global, auditoría y dispersión de fondos.'
          : 'Full unrestricted control of the entire platform, global configuration, auditing and funds dispersal.';
      case 'hr_manager':
        return language === 'es'
          ? 'Administración de plantilla, gestión de contratos, aprobación de solicitudes y reportes de personal.'
          : 'Workforce management, contract administration, leave requests approval and staff reporting.';
      case 'payroll_specialist':
        return language === 'es'
          ? 'Cálculo de impuestos (ISR/IMSS), retenciones, dispersión bancaria y timbrado de recibos.'
          : 'Tax calculation (withholdings/social security), deductions, bank dispersal and receipt stamping.';
      case 'supervisor':
        return language === 'es'
          ? 'Monitoreo de asistencias, turnos de su equipo directo y validación de justificaciones.'
          : 'Attendance monitoring, direct team shifts and validation of absence justifications.';
      case 'employee':
        return language === 'es'
          ? 'Portal de autoservicio para consulta de recibos de nómina propios, registro de jornada y permisos.'
          : 'Self-service portal to view own pay slips, clock in/out shifts and submit leave requests.';
    }
  };

  const getPermissionLabel = (key: string, originalLabel: string) => {
    if (language === 'es') return originalLabel;
    switch (key) {
      case 'canViewAllSalaries': return 'View all team salaries';
      case 'canProcessPayroll': return 'Calculate & process payroll';
      case 'canManageEmployees': return 'Add/edit employee records';
      case 'canApproveLeaves': return 'Approve vacations & leaves';
      case 'canExportReports': return 'Export financial reports';
      case 'canConfigureRoles': return 'Configure global roles & RBAC';
      default: return originalLabel;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t('rbac.title')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {t('rbac.governanceBadge')}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t('rbac.sub')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#141418] text-white text-xs flex items-center gap-3 border border-[#1F1F23]">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-400 block font-mono">{t('rbac.activeSession')}</span>
            <span className="font-bold text-white">{translateRoleTitle(currentSession.role, language)}</span>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLE_DEFINITIONS.map((r) => {
          const isCurrent = currentSession.role === r.role;

          return (
            <div
              key={r.role}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#121218] border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-[#0A0A0C] border-[#1F1F23] shadow-xs hover:border-[#2e2e36]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1F1F23]">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    r.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    r.role === 'hr_manager' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    r.role === 'payroll_specialist' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    r.role === 'supervisor' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  }`}>
                    {r.role.toUpperCase()}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      <Check className="w-3 h-3" />
                      {t('rbac.activeNow')}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white">{translateRoleTitle(r.role, language)}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {getRoleDesc(r.role)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1F1F23] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    {t('rbac.assignedPermissions')}
                  </span>
                  {r.permissions.map((p) => (
                    <div key={p.key} className="flex items-center justify-between text-xs">
                      <span className={p.granted ? 'text-zinc-200 font-medium' : 'text-zinc-500 line-through'}>
                        {getPermissionLabel(p.key, p.label)}
                      </span>
                      {p.granted ? (
                        <span className="p-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="p-0.5 rounded bg-[#141418] text-zinc-600 border border-[#1F1F23]">
                          <X className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1F1F23]">
                <button
                  onClick={() => onSwitchRole(r.role)}
                  disabled={isCurrent}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white cursor-default shadow-xs'
                      : 'bg-[#141418] hover:bg-[#1f1f26] text-zinc-300 border border-[#27272a]'
                  }`}
                >
                  {isCurrent ? t('rbac.roleInUse') : t('rbac.simulateRole')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Principles Explanatory Card */}
      <div className="bg-[#0A0A0C] text-white rounded-2xl p-6 sm:p-8 border border-[#1F1F23] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">{t('rbac.principlesTitle')}</h3>
            <p className="text-xs text-zinc-400">{t('rbac.principlesSub')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-[#121215] border border-[#1F1F23] space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {t('rbac.maskingTitle')}
            </h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              {t('rbac.maskingDesc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121215] border border-[#1F1F23] space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              {t('rbac.segregationTitle')}
            </h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              {t('rbac.segregationDesc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121215] border border-[#1F1F23] space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              {t('rbac.traceabilityTitle')}
            </h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              {t('rbac.traceabilityDesc')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
