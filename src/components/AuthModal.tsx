import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  User, 
  Phone, 
  FileText, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  LogIn,
  KeyRound
} from 'lucide-react';
import { AppRole, UserSession } from '../types';
import { USER_PROFILES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { translateRoleTitle } from '../i18n/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session?: UserSession, customRole?: AppRole) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'register_submitted'>(initialMode);
  
  // Login State - Empty by default, no hints given
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Register State (Comprehensive fields requested by user)
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regCompany, setRegCompany] = useState<string>('');
  const [regRfc, setRegRfc] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPosition, setRegPosition] = useState<string>('');
  const [regCompanySize, setRegCompanySize] = useState<string>('11-50');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regFormError, setRegFormError] = useState<string | null>(null);

  // Submitted Info
  const [submittedData, setSubmittedData] = useState<{
    company: string;
    email: string;
    ticketId: string;
  } | null>(null);

  if (!isOpen) return null;

  // Handle direct Login - Intentionally restricted: blocks login without giving hints
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError(
        language === 'es'
          ? 'Por favor ingrese su correo electrónico corporativo y contraseña.'
          : 'Please enter your corporate email address and password.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Strictly rejected: no one can enter directly through this form and no hints are exposed
      setLoginError(
        language === 'es'
          ? 'Acceso denegado: Credenciales no autorizadas en el servidor corporativo. Si requiere acceso, solicite registro empresarial o contacte a Soporte.'
          : 'Access denied: Unauthorized credentials on the corporate server. If you require access, please request enterprise onboarding or contact Support.'
      );
    }, 650);
  };

  // Handle Registration Submit (sends to support for manual onboarding)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegFormError(null);

    if (!regFullName.trim() || !regEmail.trim() || !regCompany.trim() || !regPhone.trim()) {
      setRegFormError(
        language === 'es' 
          ? 'Por favor completa todos los campos requeridos marcados con (*).'
          : 'Please complete all required fields marked with (*).'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const ticketId = `SUP-${Math.floor(100000 + Math.random() * 900000)}-SAT`;
      setSubmittedData({
        company: regCompany,
        email: regEmail,
        ticketId
      });
      setMode('register_submitted');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-8 pt-16 sm:pt-24 pb-16 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-xl w-full border border-[#1F1F23] overflow-hidden my-4 text-zinc-200 relative shrink-0">
        
        {/* Close Button */}
        <button
          id="btn-auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#121215] hover:bg-[#1f1f26] text-zinc-400 hover:text-white transition-colors z-10 border border-[#27272a]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[#1F1F23] bg-gradient-to-b from-[#121215] to-[#0A0A0C]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold text-lg">
              H
            </div>
            <div>
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                HUMASSIST ENTERPRISE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {mode === 'login' && (language === 'es' ? 'Iniciar Sesión' : 'Sign In')}
                {mode === 'register' && (language === 'es' ? 'Solicitud de Registro Empresarial' : 'Enterprise Registration')}
                {mode === 'register_submitted' && (language === 'es' ? 'Solicitud Enviada a Soporte' : 'Request Sent to Support')}
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {mode === 'login' && (
              language === 'es' 
                ? 'Ingresa con tus credenciales corporativas autorizadas.' 
                : 'Sign in with your authorized corporate credentials.'
            )}
            {mode === 'register' && (
              language === 'es' 
                ? 'Ingresa los datos de tu empresa para la validación y alta manual por el equipo de soporte.' 
                : 'Enter your organization details for compliance validation and manual onboarding by support.'
            )}
            {mode === 'register_submitted' && (
              language === 'es'
                ? 'Tu solicitud ha sido radicada. Revisa los detalles a continuación.'
                : 'Your ticket has been generated. Review the details below.'
            )}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {language === 'es' ? 'Correo Electrónico Corporativo' : 'Corporate Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-sm text-white placeholder-zinc-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    {language === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <span className="text-[11px] text-zinc-400 hover:text-zinc-300 cursor-pointer">
                    {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-sm text-white placeholder-zinc-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-auth-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{language === 'es' ? 'Iniciar Sesión' : 'Sign In'}</span>
                  </>
                )}
              </button>

              {/* Options Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1F1F23]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0A0A0C] text-zinc-500 font-medium">
                    {language === 'es' ? 'Opciones de acceso' : 'Access options'}
                  </span>
                </div>
              </div>

              {/* Register Button Link */}
              <div className="text-center">
                <button
                  id="btn-go-to-register"
                  type="button"
                  onClick={() => setMode('register')}
                  className="w-full py-2.5 rounded-xl bg-[#121215] hover:bg-[#18181e] text-zinc-200 hover:text-white text-xs font-semibold border border-[#27272a] transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>
                    {language === 'es' ? '¿No tienes cuenta? Regístrate aquí' : "Don't have an account? Register here"}
                  </span>
                </button>
              </div>

              {/* Requested Demonstration Card/Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-indigo-950/40 border border-indigo-500/30 text-left">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white">
                      {language === 'es'
                        ? '¿No eres cliente y necesitas conocer la app?'
                        : 'Not a customer yet and need to explore the app?'}
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                      {language === 'es'
                        ? 'Ve una demostración completa de su flujo en tiempo real (Nóminas, Asistencias, Directorio 360° y Matriz RBAC).'
                        : 'Experience a full live demonstration of all features (Payroll, Attendance, 360° Profiles, and RBAC matrix).'}
                    </p>
                    <button
                      id="btn-auth-demo-flow"
                      type="button"
                      onClick={() => {
                        onLoginSuccess(USER_PROFILES.super_admin);
                        onClose();
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all hover:scale-[1.02]"
                    >
                      <span>
                        {language === 'es' ? 'Ver demostración de su flujo' : 'Explore Full Demo Flow'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </form>
          )}

          {/* MODE 2: REGISTER (EXTENSIVE FORM WITH SUPPORT NOTICE) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Notice that registration goes to support for manual approval */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block">
                    {language === 'es' ? 'Validación de Seguridad y Cumplimiento:' : 'Security & Compliance Onboarding:'}
                  </span>
                  <span>
                    {language === 'es'
                      ? 'Al enviar tus datos, la solicitud se canaliza a Soporte Técnico para validación fiscal y registro manual de la empresa.'
                      : 'Upon submission, your application will be routed to Technical Support for fiscal compliance and manual account provisioning.'}
                  </span>
                </div>
              </div>

              {regFormError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regFormError}</span>
                </div>
              )}

              {/* Grid with fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Nombre Completo */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Nombre Completo *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Lic. Roberto Sánchez"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                {/* Correo Corporativo */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Correo Corporativo *' : 'Business Email *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="roberto@miempresa.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                {/* Empresa / Razón Social */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Empresa / Razón Social *' : 'Company / Legal Entity *'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      placeholder="Tecnologías del Norte S.A. de C.V."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                {/* RFC / Tax ID */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'RFC / Identificador Fiscal' : 'Tax ID / Fiscal ID'}
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regRfc}
                      onChange={(e) => setRegRfc(e.target.value.toUpperCase())}
                      placeholder="TNO200115XX9"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500 font-mono"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Teléfono de Contacto *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                {/* Cargo */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Cargo o Puesto' : 'Job Title'}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regPosition}
                      onChange={(e) => setRegPosition(e.target.value)}
                      placeholder="Director de Recursos Humanos"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

                {/* Tamaño de Plantilla */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Número de Empleados' : 'Staff Size'}
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={regCompanySize}
                      onChange={(e) => setRegCompanySize(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white"
                    >
                      <option value="1-10">1 - 10 {language === 'es' ? 'colaboradores' : 'employees'}</option>
                      <option value="11-50">11 - 50 {language === 'es' ? 'colaboradores' : 'employees'}</option>
                      <option value="51-200">51 - 200 {language === 'es' ? 'colaboradores' : 'employees'}</option>
                      <option value="201-500">201 - 500 {language === 'es' ? 'colaboradores' : 'employees'}</option>
                      <option value="500+">500+ {language === 'es' ? 'colaboradores' : 'employees'}</option>
                    </select>
                  </div>
                </div>

                {/* Contraseña Sugerida */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    {language === 'es' ? 'Contraseña Provisional' : 'Provisional Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121215] border border-[#27272a] focus:border-indigo-500 focus:outline-hidden text-xs text-white placeholder-zinc-500"
                    />
                  </div>
                </div>

              </div>

              {/* Submit to Support Button */}
              <div className="pt-2">
                <button
                  id="btn-auth-register-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {language === 'es' 
                          ? 'Enviar Solicitud a Soporte para Registro Manual' 
                          : 'Submit Request to Support for Manual Onboarding'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Back to Login */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-zinc-400 hover:text-white font-medium transition-colors"
                >
                  {language === 'es' ? '← Ya tengo una cuenta • Iniciar Sesión' : '← Already have an account • Sign In'}
                </button>
              </div>

            </form>
          )}

          {/* MODE 3: SUBMITTED CONFIRMATION (Sent to support message) */}
          {mode === 'register_submitted' && submittedData && (
            <div className="text-center py-2 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {language === 'es' ? '¡Solicitud Registrada en Soporte!' : 'Request Registered with Support!'}
                </h3>
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  {language === 'es'
                    ? `Hemos recibido los datos corporativos de ${submittedData.company}. La solicitud ha sido enviada al equipo de soporte técnico para validación fiscal y alta manual.`
                    : `We have received company details for ${submittedData.company}. Your application has been dispatched to technical support for fiscal verification and manual registration.`}
                </p>
              </div>

              {/* Ticket Details */}
              <div className="p-4 rounded-xl bg-[#121215] border border-[#1F1F23] text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>{language === 'es' ? 'Folio de Radicación:' : 'Support Ticket ID:'}</span>
                  <span className="font-mono font-bold text-indigo-400">{submittedData.ticketId}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>{language === 'es' ? 'Correo de Notificación:' : 'Notification Email:'}</span>
                  <span className="font-mono text-zinc-200">{submittedData.email}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>{language === 'es' ? 'Estado del Trámite:' : 'Status:'}</span>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    {language === 'es' ? 'En cola de validación manual' : 'Queued for manual validation'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5 pt-2 max-w-md mx-auto">
                <button
                  id="btn-auth-submitted-login"
                  onClick={() => {
                    // Log in immediately with demo/temporary session so user can explore
                    onLoginSuccess({
                      id: `usr-reg-${Date.now()}`,
                      role: 'super_admin',
                      roleTitle: 'Director General',
                      department: 'Dirección General',
                      name: regFullName || 'Usuario Solicitante',
                      email: submittedData.email,
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                      permissions: USER_PROFILES.super_admin.permissions
                    });
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {language === 'es' 
                      ? 'Iniciar Sesión en Modo Demostración Inmediata' 
                      : 'Sign In with Immediate Demo Mode'}
                  </span>
                </button>

                <button
                  onClick={() => setMode('login')}
                  className="w-full py-2.5 rounded-xl bg-[#141418] hover:bg-[#1f1f26] text-zinc-300 hover:text-white text-xs font-semibold border border-[#27272a] transition-colors"
                >
                  {language === 'es' ? 'Volver a Iniciar Sesión' : 'Back to Sign In'}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
