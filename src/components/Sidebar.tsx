import React from 'react';
import { 
  LayoutDashboard, 
  Banknote, 
  Clock, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { UserSession } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export type ActiveTab = 'dashboard' | 'payroll' | 'attendance' | 'employees' | 'rbac' | 'reports';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingLeavesCount: number;
  pendingPayrollsCount: number;
  currentSession: UserSession;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingLeavesCount,
  pendingPayrollsCount,
  currentSession
}) => {
  const { t } = useLanguage();

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: t('sidebar.dashboard'),
      subtitle: t('sidebar.dashboardSub'),
      icon: LayoutDashboard,
      badge: null,
      allowed: true
    },
    {
      id: 'payroll' as ActiveTab,
      label: t('sidebar.payroll'),
      subtitle: t('sidebar.payrollSub'),
      icon: Banknote,
      badge: pendingPayrollsCount > 0 ? `${pendingPayrollsCount} ${t('sidebar.pending')}` : null,
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      allowed: true
    },
    {
      id: 'attendance' as ActiveTab,
      label: t('sidebar.attendance'),
      subtitle: t('sidebar.attendanceSub'),
      icon: Clock,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} ${t('sidebar.solic')}` : null,
      badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      allowed: true
    },
    {
      id: 'employees' as ActiveTab,
      label: t('sidebar.employees'),
      subtitle: t('sidebar.employeesSub'),
      icon: Users,
      badge: null,
      allowed: true
    },
    {
      id: 'rbac' as ActiveTab,
      label: t('sidebar.rbac'),
      subtitle: t('sidebar.rbacSub'),
      icon: ShieldCheck,
      badge: currentSession.role === 'super_admin' ? 'Admin' : null,
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      allowed: true
    },
    {
      id: 'reports' as ActiveTab,
      label: t('sidebar.reports'),
      subtitle: t('sidebar.reportsSub'),
      icon: FileSpreadsheet,
      badge: null,
      allowed: true
    }
  ];

  return (
    <aside className="w-64 bg-[#08080A] text-zinc-300 border-r border-[#1F1F23] flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-57px)]">
      {/* Navigation List */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
          {t('sidebar.modules')}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                  : 'text-zinc-400 hover:bg-[#151518] hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <div className="truncate">
                  <div className="text-xs leading-tight">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-indigo-200' : 'text-zinc-500'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Session Details */}
      <div className="p-4 border-t border-[#1F1F23] bg-[#0A0A0C]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
            HR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-100 truncate">HUMASSIST Enterprise S.A. de C.V.</p>
            <p className="text-[10px] text-zinc-400 truncate">{t('sidebar.companyLocation')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
