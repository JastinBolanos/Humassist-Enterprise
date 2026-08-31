import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Banknote, 
  Clock, 
  Users, 
  KeyRound, 
  Sparkles, 
  ChevronRight,
  LogIn
} from 'lucide-react';
import { AppRole, UserSession } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { translateRoleTitle } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthModal } from './AuthModal';
import { BrandLogoMark } from './BrandLogoMark';

interface SplashViewProps {
  onStart: (role?: AppRole, session?: UserSession) => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onStart }) => {
  const { language, t } = useLanguage();
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const handleOpenLogin = () => {
    setAuthInitialMode('login');
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#D4D4D8] selection:bg-indigo-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <BrandLogoMark size="md" glowIntensity="high" />
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              HUMASSIST <span className="text-indigo-400 font-semibold">Enterprise</span>
            </span>
            <span className="text-[11px] text-zinc-400 block tracking-wider uppercase font-mono">
              {t('brand.splashTagline')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Prominent Language Switcher */}
          <LanguageSwitcher variant="pill" />

          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {t('splash.badge')}
          </span>

          <button
            id="btn-ingresar-splash-top"
            onClick={handleOpenLogin}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('splash.enterSystem')}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy and CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0A0C] border border-[#1F1F23] text-indigo-300 text-xs font-medium w-fit">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('splash.precisionPill')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              {t('splash.heroTitle1')} <br />
              <span className="text-zinc-100 font-extrabold">
                {t('splash.heroTitle2')}
              </span> <br />
              {t('splash.heroTitle3')}
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              {t('splash.heroDesc')}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="btn-empezar-splash"
                onClick={handleOpenLogin}
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 group"
              >
                <span>{t('splash.startNow')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#roles-preview"
                className="px-6 py-4 rounded-xl bg-[#0A0A0C] hover:bg-[#151518] text-zinc-200 hover:text-white font-medium text-base border border-[#1F1F23] transition-all flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-zinc-400" />
                <span>{t('splash.exploreRbac')}</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1F1F23] max-w-xl">
              <div>
                <span className="text-2xl font-bold text-white font-mono tracking-tight">99.9%</span>
                <p className="text-xs text-zinc-400 mt-0.5">{t('splash.statFiscal')}</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white font-mono tracking-tight">&lt; 0.2s</span>
                <p className="text-xs text-zinc-400 mt-0.5">{t('splash.statSpeed')}</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white font-mono tracking-tight">RBAC 5★</span>
                <p className="text-xs text-zinc-400 mt-0.5">{t('splash.statRbac')}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Dashboard Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Back Glow */}
            <div className="absolute -inset-4 bg-indigo-600/10 rounded-3xl blur-2xl -z-10" />

            {/* Corporate Imagery Card with live UI Mock */}
            <div className="rounded-2xl bg-[#0A0A0C] border border-[#1F1F23] shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Image Banner */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80"
                  alt="Centro de Operaciones Corporativas"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider bg-[#050505]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-zinc-700">
                      {t('splash.mockPayrollTitle')}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-300 font-mono bg-[#050505]/70 px-2 py-0.5 rounded">
                    {t('splash.mockPayrollPeriod')}
                  </span>
                </div>
              </div>

              {/* Floating UI Elements inside */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1F1F23]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
                      VR
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Valeria Mendoza Ruiz</h4>
                      <p className="text-xs text-zinc-400">
                        {language === 'es' ? 'Directora de Recursos Humanos' : 'Chief Human Resources Officer'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    HR Manager
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#121215] border border-[#1F1F23]">
                    <span className="text-xs text-zinc-400 block">{t('splash.mockSalary')}</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">$397,000 MXN</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">8 {language === 'es' ? 'colaboradores' : 'employees'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#121215] border border-[#1F1F23]">
                    <span className="text-xs text-zinc-400 block">{t('dashboard.kpiDailyAttendance')}</span>
                    <span className="text-lg font-bold text-indigo-300 font-mono">87.5%</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      {language === 'es' ? '7 presentes / 1 vacación' : '7 present / 1 vacation'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-xs text-zinc-300">{t('splash.mockStatus')}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {language === 'es' ? 'Activo' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards with curated imagery */}
        <section className="mt-16 pt-12 border-t border-[#1F1F23]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {language === 'es' ? 'Capacidades Principales del ERP' : 'Core ERP Capabilities'}
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              {language === 'es' 
                ? 'Arquitectura modular con soporte para flujos complejos de recursos humanos.' 
                : 'Modular architecture engineered for enterprise-grade human resources workflows.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Nóminas */}
            <div className="rounded-2xl bg-[#0A0A0C] border border-[#1F1F23] p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all group">
              <div>
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80" 
                    alt="Gestión de Nóminas" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 p-2 rounded-lg bg-indigo-600 text-white shadow">
                    <Banknote className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {t('splash.cardPayrollTitle')}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {t('splash.cardPayrollDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span>{language === 'es' ? 'Tablas & Filtros Multicriterio' : 'Multi-Filter Tables'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Asistencias */}
            <div className="rounded-2xl bg-[#0A0A0C] border border-[#1F1F23] p-5 flex flex-col justify-between hover:border-sky-500/40 transition-all group">
              <div>
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=80" 
                    alt="Control de Asistencias" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 p-2 rounded-lg bg-sky-600 text-white shadow">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                  {t('splash.cardAttendanceTitle')}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {t('splash.cardAttendanceDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs text-sky-400 font-medium">
                <span>{language === 'es' ? 'Registro en Tiempo Real' : 'Real-time Tracking'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Directorio */}
            <div className="rounded-2xl bg-[#0A0A0C] border border-[#1F1F23] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
              <div>
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=80" 
                    alt="Directorio de Empleados" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 p-2 rounded-lg bg-emerald-600 text-white shadow">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {t('splash.cardDirectoryTitle')}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {t('splash.cardDirectoryDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span>{language === 'es' ? 'Validación Estricta' : 'Strict Validation'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: RBAC */}
            <div className="rounded-2xl bg-[#0A0A0C] border border-[#1F1F23] p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all group">
              <div>
                <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80" 
                    alt="Control de Accesos RBAC" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 p-2 rounded-lg bg-purple-600 text-white shadow">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {t('splash.cardRbacTitle')}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {t('splash.cardRbacDesc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs text-purple-400 font-medium">
                <span>{language === 'es' ? 'Gobernanza Granular' : 'Granular Governance'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </section>

        {/* Roles Quick-Start Section */}
        <section id="roles-preview" className="mt-16 pt-12 border-t border-[#1F1F23] mb-12">
          <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-3xl p-6 sm:p-10">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                {language === 'es' ? 'Demostración Interactiva de Accesos' : 'Interactive Access Simulator'}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {t('splash.rolesSectionTitle')}
              </h3>
              <p className="text-sm text-zinc-400 mt-1.5">
                {t('splash.rolesSectionDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Role 1 */}
              <button
                onClick={() => onStart('super_admin')}
                className="p-4 rounded-2xl bg-[#121215] border border-[#1F1F23] hover:border-rose-500/50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    SUPER ADMIN
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-rose-300">
                    {language === 'es' ? 'Director General' : 'Chief Executive'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {language === 'es' ? 'Acceso total a nóminas, configuraciones y auditoría.' : 'Full access to payroll, configuration, and audit trails.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <span>{language === 'es' ? 'Probar Rol' : 'Test Role'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Role 2 */}
              <button
                onClick={() => onStart('hr_manager')}
                className="p-4 rounded-2xl bg-[#121215] border border-[#1F1F23] hover:border-indigo-500/50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    HR MANAGER
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-300">
                    {language === 'es' ? 'Gerente de Talento' : 'Talent Manager'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {language === 'es' ? 'Altas de personal, permisos y supervisión general.' : 'Employee onboarding, leave approvals, and oversight.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                  <span>{language === 'es' ? 'Probar Rol' : 'Test Role'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Role 3 */}
              <button
                onClick={() => onStart('payroll_specialist')}
                className="p-4 rounded-2xl bg-[#121215] border border-[#1F1F23] hover:border-emerald-500/50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PAYROLL
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-emerald-300">
                    {language === 'es' ? 'Especialista Nómina' : 'Payroll Specialist'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {language === 'es' ? 'Cálculo salarial, horas extras, ISR y dispersión.' : 'Salary computation, overtime, tax withholding, and pay.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span>{language === 'es' ? 'Probar Rol' : 'Test Role'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Role 4 */}
              <button
                onClick={() => onStart('supervisor')}
                className="p-4 rounded-2xl bg-[#121215] border border-[#1F1F23] hover:border-amber-500/50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    SUPERVISOR
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-amber-300">
                    {language === 'es' ? 'Líder Operativo' : 'Operations Lead'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {language === 'es' ? 'Control de turnos, asistencias y justificaciones.' : 'Shift management, attendance tracking, and excuses.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <span>{language === 'es' ? 'Probar Rol' : 'Test Role'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Role 5 */}
              <button
                onClick={() => onStart('employee')}
                className="p-4 rounded-2xl bg-[#121215] border border-[#1F1F23] hover:border-sky-500/50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    EMPLOYEE
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-sky-300">
                    {language === 'es' ? 'Colaborador' : 'Employee Portal'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {language === 'es' ? 'Checador de entrada/salida y recibos propios.' : 'Self-service clock in/out and personal payslips.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-sky-400 font-medium">
                  <span>{language === 'es' ? 'Probar Rol' : 'Test Role'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1F1F23] bg-[#050505] py-6 px-6 text-center text-xs text-zinc-500">
        <p>{t('splash.footerRights')}</p>
      </footer>

      {/* Authentication / Registration / Demo Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(session, customRole) => {
          if (session) {
            onStart(session.role, session);
          } else if (customRole) {
            onStart(customRole);
          } else {
            onStart('super_admin');
          }
        }}
        initialMode={authInitialMode}
      />
    </div>
  );
};
