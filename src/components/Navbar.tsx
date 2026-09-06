import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Shield, 
  RotateCcw, 
  ChevronDown, 
  Clock, 
  ExternalLink,
  LogOut,
  User,
  Check,
  Globe
} from 'lucide-react';
import { UserSession, AppRole } from '../types';
import { USER_PROFILES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { translateRoleTitle } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BrandLogoMark } from './BrandLogoMark';
import { useScreenType } from '../hooks';

interface NavbarProps {
  currentSession: UserSession;
  onRoleChange: (role: AppRole) => void;
  onResetData: () => void;
  onReturnToSplash: () => void;
  onSearchGlobal: (query: string) => void;
  globalSearchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSession,
  onRoleChange,
  onResetData,
  onReturnToSplash,
  onSearchGlobal,
  globalSearchQuery
}) => {
  const { language, t } = useLanguage();
  const { isSmallMobile } = useScreenType();
  const [time, setTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const rolesList: { role: AppRole; title: string; desc: string }[] = [
    { 
      role: 'super_admin', 
      title: translateRoleTitle('super_admin', language), 
      desc: t('nav.roleSuperAdminDesc') 
    },
    { 
      role: 'hr_manager', 
      title: translateRoleTitle('hr_manager', language), 
      desc: t('nav.roleHrManagerDesc') 
    },
    { 
      role: 'payroll_specialist', 
      title: translateRoleTitle('payroll_specialist', language), 
      desc: t('nav.rolePayrollSpecialistDesc') 
    },
    { 
      role: 'supervisor', 
      title: translateRoleTitle('supervisor', language), 
      desc: t('nav.roleSupervisorDesc') 
    },
    { 
      role: 'employee', 
      title: translateRoleTitle('employee', language), 
      desc: t('nav.roleEmployeeDesc') 
    }
  ];

  const currentRoleDisplayTitle = translateRoleTitle(currentSession.role, language);

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A] border-b border-[#1F1F23] shadow-xs w-full max-w-full">
      <div className="px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        
        {/* Left: Brand + Environment Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div 
            id="brand-logo-btn"
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0" 
            onClick={onReturnToSplash} 
            title={t('nav.returnToSplash')}
          >
            <BrandLogoMark size="sm" />
            <div className="hidden sm:block">
              <span className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                HUMASSIST <span className="text-indigo-400 font-semibold">Enterprise</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase block">
                {t('brand.tagline')}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#141417] border border-[#222226] text-[11px] text-zinc-300 font-mono">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>{time || '13:40:00'}</span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md hidden md:block mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={globalSearchQuery}
              onChange={(e) => onSearchGlobal(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#121215] border border-[#27272a] rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            {globalSearchQuery && (
              <button
                onClick={() => onSearchGlobal('')}
                className="text-[10px] text-zinc-400 hover:text-zinc-200 absolute right-3 top-1/2 -translate-y-1/2 font-medium"
              >
                {t('nav.clear')}
              </button>
            )}
          </div>
        </div>

        {/* Right: Language Switcher, Role Switcher & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Main Language Switcher Button (ES / EN) */}
          <LanguageSwitcher variant={isSmallMobile ? 'compact' : 'pill'} />

          {/* Live RBAC Role Switcher */}
          <div className="relative">
            <button
              id="btn-role-switcher-dropdown"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold bg-[#121215] hover:bg-[#18181c] border-[#27272a] text-zinc-200 transition-all shrink-0 max-w-[130px] sm:max-w-none cursor-pointer"
              title="Cambiar rol para probar permisos RBAC / Switch role"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden lg:inline text-zinc-400 font-normal">{t('nav.activeRole')}</span>
              <span className="font-semibold text-zinc-100 truncate max-w-[60px] xs:max-w-[90px] sm:max-w-none">
                {currentRoleDisplayTitle.split('(')[0].trim()}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5 shrink-0" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-16px)] bg-[#0e0e11] rounded-xl shadow-2xl border border-[#27272a] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-[#1F1F23]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {t('nav.rbacTitle')}
                  </p>
                  <p className="text-xs text-zinc-300">{t('nav.rbacSubtitle')}</p>
                </div>
                <div className="p-1 space-y-0.5 max-h-[70vh] overflow-y-auto">
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        onRoleChange(item.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                        currentSession.role === item.role
                          ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-[#18181c] hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-zinc-100 font-semibold">{item.title}</span>
                        <span className="text-[10px] text-zinc-400 font-normal truncate">
                          {item.desc}
                        </span>
                      </div>
                      {currentSession.role === item.role && (
                        <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-demo-data"
            onClick={onResetData}
            title={t('nav.resetDataTooltip')}
            className="p-1.5 sm:p-2 rounded-lg border border-[#27272a] text-zinc-400 hover:text-indigo-400 hover:bg-[#141417] transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* User Profile / Menu */}
          <div className="relative shrink-0">
            <button
              id="btn-user-profile-menu"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 pl-1 pr-1 py-1 rounded-lg hover:bg-[#141417] transition-colors cursor-pointer"
            >
              <img
                src={currentSession.avatar}
                alt={currentSession.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                }}
                className="w-8 h-8 rounded-full object-cover border border-[#27272a] ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-100 leading-tight">
                  {currentSession.name}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {currentSession.department}
                </span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#0e0e11] rounded-xl shadow-2xl border border-[#27272a] py-2 z-50 animate-in fade-in duration-150"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-[#1F1F23]">
                  <p className="text-xs font-bold text-white">{currentSession.name}</p>
                  <p className="text-[11px] text-zinc-400">{currentSession.email}</p>
                  <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {currentRoleDisplayTitle}
                  </span>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onReturnToSplash();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
