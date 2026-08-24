import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  FileText, 
  Star, 
  Grid, 
  List, 
  Eye, 
  Lock, 
  HeartHandshake
} from 'lucide-react';
import { Employee, Department, ContractType, AppRole, UserSession, PayrollItem, AttendanceRecord } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  translateDepartment, 
  translateContractType, 
  translateEmployeeStatus, 
  translateRoleTitle 
} from '../i18n/translations';

interface EmployeesViewProps {
  employees: Employee[];
  payrolls: PayrollItem[];
  attendances: AttendanceRecord[];
  currentSession: UserSession;
  onAddEmployee: (newEmployee: Employee) => void;
  isNewEmployeeModalOpen: boolean;
  setIsNewEmployeeModalOpen: (open: boolean) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  payrolls,
  attendances,
  currentSession,
  onAddEmployee,
  isNewEmployeeModalOpen,
  setIsNewEmployeeModalOpen
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Employee 360 Profile Modal
  const [profileModalEmployee, setProfileModalEmployee] = useState<Employee | null>(null);

  // New Employee Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentId: '',
    position: '',
    department: 'Tecnología' as Department,
    contractType: 'Indefinido' as ContractType,
    baseSalary: 45000,
    hireDate: new Date().toISOString().split('T')[0],
    assignedRole: 'employee' as AppRole,
    address: '',
    bankAccount: '',
    emergencyName: '',
    emergencyRel: 'Familiar',
    emergencyPhone: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.code.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.documentId.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
      if (selectedContract !== 'all' && emp.contractType !== selectedContract) return false;
      if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;

      return true;
    });
  }, [employees, searchQuery, selectedDept, selectedContract, selectedStatus]);

  // Validate and submit new employee form
  const handleSubmitNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      errors.firstName = language === 'es' ? 'El nombre es obligatorio (mínimo 2 caracteres).' : 'First name is required (min 2 chars).';
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      errors.lastName = language === 'es' ? 'Los apellidos son obligatorios.' : 'Last name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = language === 'es' ? 'Ingresa un correo electrónico corporativo válido.' : 'Enter a valid corporate email.';
    }

    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = language === 'es' ? 'Ingresa un teléfono válido (al menos 10 dígitos).' : 'Enter a valid phone number (at least 10 digits).';
    }

    if (!formData.documentId.trim() || formData.documentId.length < 8) {
      errors.documentId = language === 'es' ? 'Ingresa un Documento / CURP / DNI válido (mínimo 8 caracteres).' : 'Enter a valid Tax ID / SSN (min 8 chars).';
    }

    if (!formData.position.trim()) {
      errors.position = language === 'es' ? 'El cargo / puesto es obligatorio.' : 'Position title is required.';
    }

    if (formData.baseSalary <= 0 || isNaN(formData.baseSalary)) {
      errors.baseSalary = language === 'es' ? 'El sueldo mensual debe ser mayor a 0.' : 'Monthly salary must be greater than 0.';
    }

    if (!formData.bankAccount.trim() || formData.bankAccount.replace(/\D/g, '').length < 10) {
      errors.bankAccount = language === 'es' ? 'Ingresa una cuenta bancaria / CLABE válida (mínimo 10 dígitos).' : 'Enter a valid bank account number (min 10 digits).';
    }

    if (!formData.emergencyName.trim()) {
      errors.emergencyName = language === 'es' ? 'El nombre del contacto de emergencia es obligatorio.' : 'Emergency contact name is required.';
    }

    if (!formData.emergencyPhone.trim() || formData.emergencyPhone.replace(/\D/g, '').length < 10) {
      errors.emergencyPhone = language === 'es' ? 'El teléfono de emergencia debe tener al menos 10 dígitos.' : 'Emergency phone must have at least 10 digits.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newEmpCode = `EMP-${1000 + employees.length + 1}`;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      code: newEmpCode,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      documentId: formData.documentId.trim().toUpperCase(),
      position: formData.position.trim(),
      department: formData.department,
      contractType: formData.contractType,
      baseSalary: formData.baseSalary,
      hireDate: formData.hireDate,
      status: 'Activo',
      avatar: formData.avatarUrl,
      emergencyContact: {
        name: formData.emergencyName.trim(),
        relationship: formData.emergencyRel,
        phone: formData.emergencyPhone.trim()
      },
      address: formData.address.trim() || (language === 'es' ? 'Sede Principal HUMASSIST Enterprise' : 'HUMASSIST Enterprise HQ'),
      bankAccount: formData.bankAccount.trim(),
      assignedRole: formData.assignedRole,
      performanceRating: 5.0
    };

    onAddEmployee(newEmp);
    setIsNewEmployeeModalOpen(false);
    setFormErrors({});
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t('employees.title')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {filteredEmployees.length} {t('employees.colabCount')}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t('employees.sub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentSession.permissions.canManageEmployees ? (
            <button
              id="btn-add-new-emp-view"
              onClick={() => setIsNewEmployeeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('employees.addNewBtn')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141418] border border-[#1F1F23] text-xs text-zinc-400">
              <Lock className="w-3.5 h-3.5" />
              <span>{t('employees.readOnly')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0A0A0C] rounded-2xl p-4 sm:p-5 border border-[#1F1F23] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('employees.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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

          <div>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">{t('employees.allContracts')}</option>
              <option value="Indefinido">{translateContractType('Indefinido', language)}</option>
              <option value="Temporal">{translateContractType('Temporal', language)}</option>
              <option value="Honorarios">{translateContractType('Honorarios', language)}</option>
              <option value="Prácticas">{translateContractType('Prácticas', language)}</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">{t('payroll.allStatuses')}</option>
              <option value="Activo">{translateEmployeeStatus('Activo', language)}</option>
              <option value="Licencia">{translateEmployeeStatus('Licencia', language)}</option>
              <option value="Inactivo">{translateEmployeeStatus('Inactivo', language)}</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#141418] p-1 rounded-xl shrink-0 self-end md:self-auto border border-[#1F1F23]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#1e1e24] text-indigo-400 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#1e1e24] text-indigo-400 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Employees Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredEmployees.map((emp) => {
            const canSeeSalary = currentSession.permissions.canViewAllSalaries || emp.email === currentSession.email;

            return (
              <div 
                key={emp.id}
                className="bg-[#0A0A0C] rounded-2xl border border-[#1F1F23] p-5 shadow-xs hover:border-indigo-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={`${emp.firstName} ${emp.lastName}`}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-[#27272a] group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0A0C]"></span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#141418] text-zinc-300 font-mono border border-[#1F1F23]">
                      {emp.code}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs font-medium text-indigo-400 mt-0.5">
                      {emp.position}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {translateDepartment(emp.department, language)} • {translateContractType(emp.contractType, language)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F1F23] space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1F1F23] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-medium">{t('employees.baseSalaryLabel')}</span>
                    <span className="text-xs font-bold font-mono text-zinc-100">
                      {canSeeSalary ? `$${emp.baseSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')} ${language === 'es' ? 'MXN' : 'USD'}` : '••••••••'}
                    </span>
                  </div>

                  <button
                    onClick={() => setProfileModalEmployee(emp)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold text-xs transition-colors flex items-center gap-1 border border-indigo-500/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('employees.viewProfileBtn')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#0A0A0C] rounded-2xl border border-[#1F1F23] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121215] border-b border-[#1F1F23] text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">{t('employees.colColab')}</th>
                  <th className="p-4">{t('employees.colDni')}</th>
                  <th className="p-4">{t('employees.colPositionDept')}</th>
                  <th className="p-4">{t('employees.colContract')}</th>
                  <th className="p-4">{t('employees.colBaseSalary')}</th>
                  <th className="p-4">{t('employees.colHireDate')}</th>
                  <th className="p-4">{t('employees.colPerformance')}</th>
                  <th className="p-4 text-right">{t('employees.colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F23] text-zinc-300">
                {filteredEmployees.map((emp) => {
                  const canSeeSalary = currentSession.permissions.canViewAllSalaries || emp.email === currentSession.email;

                  return (
                    <tr key={emp.id} className="hover:bg-[#121216] transition-colors">
                      <td className="p-4 font-semibold text-zinc-100">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-[#27272a]" />
                          <div>
                            <span>{emp.firstName} {emp.lastName}</span>
                            <span className="text-[10px] text-zinc-400 block font-mono">{emp.code} • {emp.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-zinc-400">{emp.documentId}</td>
                      <td className="p-4">
                        <span className="font-medium text-zinc-200 block">{emp.position}</span>
                        <span className="text-[11px] text-zinc-400">{translateDepartment(emp.department, language)}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#141418] text-zinc-300 border border-[#1F1F23]">
                          {translateContractType(emp.contractType, language)}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-100">
                        {canSeeSalary ? `$${emp.baseSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')}` : '••••••'}
                      </td>
                      <td className="p-4 font-mono text-zinc-400">{emp.hireDate}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{emp.performanceRating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setProfileModalEmployee(emp)}
                          className="px-2.5 py-1 rounded-lg bg-[#141418] hover:bg-indigo-500/20 hover:text-indigo-300 text-zinc-300 font-semibold border border-[#27272a]"
                        >
                          {t('employees.view360')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Expediente 360° del Empleado */}
      {profileModalEmployee && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 pb-16 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-2xl w-full border border-[#1F1F23] overflow-hidden my-4 text-xs text-zinc-200 shrink-0">
            {/* Header */}
            <div className="bg-[#121215] px-6 py-5 flex items-center justify-between text-white border-b border-[#1F1F23]">
              <div className="flex items-center gap-4">
                <img
                  src={profileModalEmployee.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50"
                />
                <div>
                  <h3 className="text-base font-bold">{profileModalEmployee.firstName} {profileModalEmployee.lastName}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{profileModalEmployee.position} • {translateDepartment(profileModalEmployee.department, language)}</p>
                  <span className="text-[10px] text-zinc-400 font-mono">{t('employees.profileCode')} {profileModalEmployee.code}</span>
                </div>
              </div>
              <button
                onClick={() => setProfileModalEmployee(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Informacion Contractual */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  {t('employees.laborInfoTitle')}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#121215] border border-[#1F1F23]">
                  <div>
                    <span className="text-zinc-400 block">{t('employees.contractTypeLabel')}</span>
                    <span className="font-bold text-zinc-100">{translateContractType(profileModalEmployee.contractType, language)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">{t('employees.hireDateLabel')}</span>
                    <span className="font-mono text-zinc-100">{profileModalEmployee.hireDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">{t('employees.dniLabel')}</span>
                    <span className="font-mono text-zinc-100">{profileModalEmployee.documentId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">{t('employees.monthlySalaryLabel')}</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {currentSession.permissions.canViewAllSalaries || profileModalEmployee.email === currentSession.email
                        ? `$${profileModalEmployee.baseSalary.toLocaleString(language === 'es' ? 'es-MX' : 'en-US')} ${language === 'es' ? 'MXN' : 'USD'}`
                        : '••••••••'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">{t('employees.performanceLabel')}</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {profileModalEmployee.performanceRating} / 5.0 ({language === 'es' ? 'Excelente' : 'Excellent'})
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">{t('employees.systemRoleLabel')}</span>
                    <span className="font-bold text-indigo-400">{translateRoleTitle(profileModalEmployee.assignedRole, language)}</span>
                  </div>
                </div>
              </div>

              {/* Contacto & Emergencias */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                  {t('employees.contactInfoTitle')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#121215] border border-[#1F1F23]">
                  <div>
                    <span className="text-zinc-400 block">{t('employees.addressLabel')}</span>
                    <span className="font-medium text-zinc-200">{profileModalEmployee.address}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">{t('employees.bankAccountLabel')}</span>
                    <span className="font-mono text-zinc-200">{profileModalEmployee.bankAccount}</span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-[#1F1F23]">
                    <span className="text-zinc-400 block">{t('employees.emergencyContactOfficial')}</span>
                    <span className="font-bold text-zinc-100">
                      {profileModalEmployee.emergencyContact.name} ({profileModalEmployee.emergencyContact.relationship}) - {profileModalEmployee.emergencyContact.phone}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#121215] px-6 py-4 border-t border-[#1F1F23] flex justify-end">
              <button
                onClick={() => setProfileModalEmployee(null)}
                className="px-4 py-2 rounded-xl bg-[#1f1f26] text-white font-bold text-xs border border-[#27272a]"
              >
                {t('employees.closeProfile')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Formulario de Alta de Colaborador con Validaciones */}
      {isNewEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 pb-16 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-2xl w-full border border-[#1F1F23] overflow-hidden my-4 text-xs text-zinc-200 shrink-0">
            <div className="bg-[#121215] px-6 py-4 flex items-center justify-between text-white border-b border-[#1F1F23]">
              <div>
                <h3 className="text-base font-bold">{t('employees.modalNewEmpTitle')}</h3>
                <p className="text-xs text-zinc-400">{t('employees.modalNewEmpSub')}</p>
              </div>
              <button
                onClick={() => setIsNewEmployeeModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewEmployee} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Sección 1: Datos Personales */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  {t('employees.sectionPersonal')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.firstName')} *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Ej: Sofia"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.firstName && <p className="text-rose-400 text-[11px] mt-1">{formErrors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.lastName')} *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Ej: Ramírez Galván"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.lastName && <p className="text-rose-400 text-[11px] mt-1">{formErrors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.corpEmail')} *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sofia.ramirez@humassist.com"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.email && <p className="text-rose-400 text-[11px] mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.mobilePhone')} *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.phone && <p className="text-rose-400 text-[11px] mt-1">{formErrors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.taxId')} *</label>
                    <input
                      type="text"
                      value={formData.documentId}
                      onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                      placeholder="RAMS960812HDF..."
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono uppercase text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.documentId && <p className="text-rose-400 text-[11px] mt-1">{formErrors.documentId}</p>}
                  </div>
                </div>
              </div>

              {/* Sección 2: Puesto y Salario */}
              <div className="pt-3 border-t border-[#1F1F23]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  {t('employees.sectionJob')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.positionTitle')} *</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Ej: Senior Data Engineer"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.position && <p className="text-rose-400 text-[11px] mt-1">{formErrors.position}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.department')} *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200"
                    >
                      <option value="Tecnología" className="bg-[#121215] text-zinc-200">{translateDepartment('Tecnología', language)}</option>
                      <option value="Finanzas" className="bg-[#121215] text-zinc-200">{translateDepartment('Finanzas', language)}</option>
                      <option value="Talento Humano" className="bg-[#121215] text-zinc-200">{translateDepartment('Talento Humano', language)}</option>
                      <option value="Operaciones" className="bg-[#121215] text-zinc-200">{translateDepartment('Operaciones', language)}</option>
                      <option value="Ventas & Marketing" className="bg-[#121215] text-zinc-200">{translateDepartment('Ventas & Marketing', language)}</option>
                      <option value="Legal & Cumplimiento" className="bg-[#121215] text-zinc-200">{translateDepartment('Legal & Cumplimiento', language)}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.contractType')} *</label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200"
                    >
                      <option value="Indefinido" className="bg-[#121215] text-zinc-200">{translateContractType('Indefinido', language)}</option>
                      <option value="Temporal" className="bg-[#121215] text-zinc-200">{translateContractType('Temporal', language)}</option>
                      <option value="Honorarios" className="bg-[#121215] text-zinc-200">{translateContractType('Honorarios', language)}</option>
                      <option value="Prácticas" className="bg-[#121215] text-zinc-200">{translateContractType('Prácticas', language)}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.monthlySalary')} *</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                    />
                    {formErrors.baseSalary && <p className="text-rose-400 text-[11px] mt-1">{formErrors.baseSalary}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.bankClabe')} *</label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      placeholder="CLABE: 01218000..."
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.bankAccount && <p className="text-rose-400 text-[11px] mt-1">{formErrors.bankAccount}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.systemRole')} *</label>
                    <select
                      value={formData.assignedRole}
                      onChange={(e) => setFormData({ ...formData, assignedRole: e.target.value as AppRole })}
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-semibold text-zinc-200"
                    >
                      <option value="employee" className="bg-[#121215] text-zinc-200">{translateRoleTitle('employee', language)}</option>
                      <option value="supervisor" className="bg-[#121215] text-zinc-200">{translateRoleTitle('supervisor', language)}</option>
                      <option value="payroll_specialist" className="bg-[#121215] text-zinc-200">{translateRoleTitle('payroll_specialist', language)}</option>
                      <option value="hr_manager" className="bg-[#121215] text-zinc-200">{translateRoleTitle('hr_manager', language)}</option>
                      <option value="super_admin" className="bg-[#121215] text-zinc-200">{translateRoleTitle('super_admin', language)}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 3: Contacto de Emergencia */}
              <div className="pt-3 border-t border-[#1F1F23]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  {t('employees.sectionEmergency')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.emergencyName')} *</label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      placeholder="Familiar cercano"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.emergencyName && <p className="text-rose-400 text-[11px] mt-1">{formErrors.emergencyName}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.emergencyRelationship')} *</label>
                    <input
                      type="text"
                      value={formData.emergencyRel}
                      onChange={(e) => setFormData({ ...formData, emergencyRel: e.target.value })}
                      placeholder="Esposo / Madre / Hermano"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">{t('employees.emergencyPhone')} *</label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="+52 55 9876 5432"
                      className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                    />
                    {formErrors.emergencyPhone && <p className="text-rose-400 text-[11px] mt-1">{formErrors.emergencyPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setIsNewEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f26] text-zinc-300 font-semibold border border-[#27272a]"
                >
                  {t('employees.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-sm"
                >
                  {t('employees.saveAndRegister')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
