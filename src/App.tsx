import React, { useState } from 'react';
import { 
  Employee, 
  PayrollItem, 
  LeaveRequest, 
  UserSession, 
  AppRole, 
  PayrollStatus 
} from './domain';
import { USER_PROFILES } from './data/mockData';
import { 
  SplashView, 
  Navbar, 
  Sidebar, 
  ActiveTab, 
  DashboardView, 
  PayrollView, 
  AttendanceView, 
  EmployeesView, 
  RBACView, 
  ReportsView, 
  PayslipModal, 
  ToastContainer 
} from './components';
import { useToast, useRBACSession, useERPData } from './hooks';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { translateRoleTitle } from './i18n/translations';

function AppContent() {
  const { language, t } = useLanguage();

  // Navigation & Splash State
  const [isInSplash, setIsInSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Modals State
  const [viewingPayslip, setViewingPayslip] = useState<PayrollItem | null>(null);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState<boolean>(false);

  // Clean Architecture Hooks: Notifications, RBAC Session, and ERP Domain Data
  const { toasts, addToast, dismissToast } = useToast();
  const { currentSession, switchRole, setCustomSession } = useRBACSession('super_admin');
  const {
    employees,
    payrolls,
    attendances,
    leaves,
    addEmployee,
    updatePayrollStatus,
    batchPay,
    addNewPayroll,
    recordClockIn,
    approveLeave,
    rejectLeave,
    requestLeave,
    resetDemoData
  } = useERPData();

  // Start System from Splash View
  const handleStartFromSplash = (role?: AppRole, session?: UserSession) => {
    if (session) {
      setCustomSession(session);
      addToast(
        language === 'es' ? 'Sesión Iniciada Exitosamente' : 'Signed In Successfully',
        language === 'es' 
          ? `Bienvenido/a ${session.name} (${translateRoleTitle(session.role, 'es')}).` 
          : `Welcome ${session.name} (${translateRoleTitle(session.role, 'en')}).`,
        'success'
      );
    } else if (role && USER_PROFILES[role]) {
      switchRole(role);
      addToast(
        language === 'es' ? 'Bienvenido a HUMASSIST Enterprise' : 'Welcome to HUMASSIST Enterprise',
        language === 'es' 
          ? `Has ingresado con el perfil de ${translateRoleTitle(USER_PROFILES[role].role, 'es')}.` 
          : `You have signed in with the profile of ${translateRoleTitle(USER_PROFILES[role].role, 'en')}.`,
        'info'
      );
    } else {
      switchRole('super_admin');
      addToast(
        language === 'es' ? 'Demostración de Flujo Activa' : 'Live Demo Active',
        language === 'es' 
          ? 'Sesión activa como Super Administrador. Explora todos los módulos del ERP.' 
          : 'Active session as Super Admin. Explore all ERP modules.',
        'success'
      );
    }
    setIsInSplash(false);
  };

  // Role Switching with notification
  const handleRoleChange = (role: AppRole) => {
    if (USER_PROFILES[role]) {
      switchRole(role);
      addToast(
        language === 'es' ? 'Permisos RBAC Actualizados' : 'RBAC Permissions Updated',
        language === 'es'
          ? `Cambiado a perfil: ${translateRoleTitle(role, 'es')}. La interfaz y accesos se adaptaron instantáneamente.`
          : `Switched to role: ${translateRoleTitle(role, 'en')}. Interface and permissions adapted immediately.`,
        'info'
      );
    }
  };

  // Reset demo company data
  const handleResetData = () => {
    resetDemoData();
    switchRole('super_admin');
    addToast(
      language === 'es' ? 'Datos Restablecidos' : 'Data Reset',
      language === 'es' ? 'Se han restaurado los datos originales de la empresa.' : 'Company original demo data has been restored.',
      'warning'
    );
  };

  // Payroll Handlers
  const handleUpdatePayrollStatus = (id: string, newStatus: PayrollStatus) => {
    updatePayrollStatus(id, newStatus);
    addToast(
      language === 'es' ? 'Estado de Nómina Actualizado' : 'Payroll Status Updated',
      language === 'es' ? `El registro ha cambiado a: ${newStatus}` : `Record updated to: ${newStatus}`,
      'success'
    );
  };

  const handleBatchPay = (ids: string[]) => {
    batchPay(ids);
    addToast(
      language === 'es' ? 'Dispersión Masiva Completada' : 'Batch Payment Completed',
      language === 'es' ? `Se han marcado ${ids.length} nóminas como pagadas exitosamente.` : `Successfully marked ${ids.length} payrolls as paid.`,
      'success'
    );
  };

  const handleAddNewPayroll = (newPayroll: PayrollItem) => {
    addNewPayroll(newPayroll);
    addToast(
      language === 'es' ? 'Nómina Registrada' : 'Payroll Registered',
      language === 'es' ? `Se generó el recibo quincenal para ${newPayroll.employeeName}.` : `Biweekly payslip created for ${newPayroll.employeeName}.`,
      'success'
    );
  };

  // Employee Handlers
  const handleAddEmployee = (newEmp: Employee) => {
    addEmployee(newEmp);
    addToast(
      language === 'es' ? 'Colaborador Registrado' : 'Employee Registered',
      language === 'es' ? `${newEmp.firstName} ${newEmp.lastName} ha sido dado de alta en la plantilla.` : `${newEmp.firstName} ${newEmp.lastName} has been onboarded to staff.`,
      'success'
    );
  };

  // Clock Actions
  const handleClockAction = (type: 'in' | 'out' | 'lunch') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const emp = employees.find(e => e.email === currentSession.email) || employees[0];

    if (type === 'in') {
      recordClockIn(emp);
      addToast(
        language === 'es' ? 'Entrada Registrada' : 'Clock-In Registered',
        language === 'es' ? `Check-in confirmado a las ${timeStr} para ${emp.firstName}.` : `Check-in confirmed at ${timeStr} for ${emp.firstName}.`,
        'success'
      );
    } else if (type === 'out') {
      addToast(
        language === 'es' ? 'Salida Registrada' : 'Clock-Out Registered',
        language === 'es' ? `Jornada concluida a las ${timeStr}. ¡Hasta mañana!` : `Shift ended at ${timeStr}. Have a great evening!`,
        'info'
      );
    } else {
      addToast(
        language === 'es' ? 'Pausa Registrada' : 'Meal Break Registered',
        language === 'es' ? `Pausa de almuerzo iniciada a las ${timeStr}.` : `Meal break started at ${timeStr}.`,
        'info'
      );
    }
  };

  // Leave Handlers
  const handleApproveLeave = (leaveId: string, comments?: string) => {
    approveLeave(leaveId, currentSession.name, comments);
    addToast(
      language === 'es' ? 'Solicitud Aprobada' : 'Request Approved',
      language === 'es' ? 'El permiso ha sido autorizado y notificado al colaborador.' : 'Leave authorized and employee notified.',
      'success'
    );
  };

  const handleRejectLeave = (leaveId: string, comments?: string) => {
    rejectLeave(leaveId, currentSession.name, comments);
    addToast(
      language === 'es' ? 'Solicitud Rechazada' : 'Request Rejected',
      language === 'es' ? 'Se ha registrado el rechazo y el motivo de jefatura.' : 'Rejection and manager justification recorded.',
      'error'
    );
  };

  const handleRequestLeave = (newLeave: LeaveRequest) => {
    requestLeave(newLeave);
    addToast(
      language === 'es' ? 'Solicitud Enviada' : 'Request Submitted',
      language === 'es' ? 'Tu solicitud de permiso ha sido enviada para revisión.' : 'Your leave request has been submitted for review.',
      'info'
    );
  };

  // If in Splash screen, show the splash view
  if (isInSplash) {
    return (
      <>
        <SplashView onStart={handleStartFromSplash} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // Pending counts for sidebar badges
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pendiente').length;
  const pendingPayrollsCount = payrolls.filter(p => p.status === 'Pendiente' || p.status === 'En Proceso').length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#D4D4D8] flex flex-col selection:bg-indigo-600 selection:text-white font-sans w-full max-w-full overflow-x-hidden">
      
      {/* Top Navbar */}
      <Navbar
        currentSession={currentSession}
        onRoleChange={handleRoleChange}
        onResetData={handleResetData}
        onReturnToSplash={() => setIsInSplash(true)}
        onSearchGlobal={setGlobalSearchQuery}
        globalSearchQuery={globalSearchQuery}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto min-w-0">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingLeavesCount={pendingLeavesCount}
          pendingPayrollsCount={pendingPayrollsCount}
          currentSession={currentSession}
        />

        {/* Mobile Tab Bar */}
        <div className="md:hidden bg-[#0A0A0A] text-zinc-300 px-3 py-2 flex items-center overflow-x-auto text-xs border-b border-[#1F1F23] gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            {t('sidebar.dashboard')}
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${activeTab === 'payroll' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            {t('sidebar.payroll')}
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${activeTab === 'attendance' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            {t('sidebar.attendance')}
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${activeTab === 'employees' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            {t('sidebar.employees')}
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${activeTab === 'rbac' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            {t('sidebar.rbac')}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 ${activeTab === 'reports' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            {t('sidebar.reports')}
          </button>
        </div>

        {/* Dynamic Main View Container */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              payrolls={payrolls}
              attendances={attendances}
              leaves={leaves}
              currentSession={currentSession}
              onNavigate={setActiveTab}
              onClockInModal={() => handleClockAction('in')}
              onNewEmployeeModal={() => setIsNewEmployeeModalOpen(true)}
            />
          )}

          {activeTab === 'payroll' && (
            <PayrollView
              payrolls={payrolls}
              employees={employees}
              currentSession={currentSession}
              onUpdatePayrollStatus={handleUpdatePayrollStatus}
              onBatchPay={handleBatchPay}
              onAddNewPayroll={handleAddNewPayroll}
              onViewPayslip={(p) => setViewingPayslip(p)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              attendances={attendances}
              leaves={leaves}
              employees={employees}
              currentSession={currentSession}
              onClockAction={handleClockAction}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onRequestLeave={handleRequestLeave}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              employees={employees}
              payrolls={payrolls}
              attendances={attendances}
              currentSession={currentSession}
              onAddEmployee={handleAddEmployee}
              isNewEmployeeModalOpen={isNewEmployeeModalOpen}
              setIsNewEmployeeModalOpen={setIsNewEmployeeModalOpen}
            />
          )}

          {activeTab === 'rbac' && (
            <RBACView
              currentSession={currentSession}
              onSwitchRole={handleRoleChange}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              payrolls={payrolls}
              employees={employees}
              attendances={attendances}
              currentSession={currentSession}
            />
          )}
        </main>
      </div>

      {/* Payslip Digital Modal */}
      {viewingPayslip && (
        <PayslipModal
          payroll={viewingPayslip}
          employee={employees.find(e => e.id === viewingPayslip.employeeId)}
          onClose={() => setViewingPayslip(null)}
        />
      )}

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
