import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Search, 
  Plus, 
  Compass, 
  Check, 
  X 
} from 'lucide-react';
import { AttendanceRecord, LeaveRequest, Employee, UserSession, LeaveType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  translateDepartment, 
  translateAttendanceStatus, 
  translateLeaveType, 
  translateLeaveStatus 
} from '../i18n/translations';

interface AttendanceViewProps {
  attendances: AttendanceRecord[];
  leaves: LeaveRequest[];
  employees: Employee[];
  currentSession: UserSession;
  onClockAction: (type: 'in' | 'out' | 'lunch') => void;
  onApproveLeave: (leaveId: string, comments?: string) => void;
  onRejectLeave: (leaveId: string, comments?: string) => void;
  onRequestLeave: (newLeave: LeaveRequest) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendances,
  leaves,
  employees,
  currentSession,
  onClockAction,
  onApproveLeave,
  onRejectLeave,
  onRequestLeave
}) => {
  const { language, t } = useLanguage();

  // Live time for clock widget
  const [liveTime, setLiveTime] = useState<string>('');
  const [clockStatus, setClockStatus] = useState<'working' | 'out' | 'lunch'>('working');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, [language]);

  // Filter states for attendance table
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-08-22');

  // Leave filter & Modal state
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('all');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Vacaciones' as LeaveType,
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    reason: ''
  });
  const [leaveErrors, setLeaveErrors] = useState<Record<string, string>>({});

  // Rejection comment modal
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  // Filtered Attendance List
  const filteredAttendances = useMemo(() => {
    return attendances.filter(record => {
      // Permission filter: If employee, only their own records
      if (currentSession.role === 'employee') {
        const emp = employees.find(e => e.email === currentSession.email);
        if (emp && record.employeeId !== emp.id) return false;
      }

      const q = attendanceSearch.toLowerCase();
      const matchesSearch = 
        record.employeeName.toLowerCase().includes(q) ||
        record.employeeCode.toLowerCase().includes(q) ||
        record.location.toLowerCase().includes(q) ||
        (record.notes && record.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedDept !== 'all' && record.department !== selectedDept) return false;
      if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
      if (selectedDate && record.date !== selectedDate) return false;

      return true;
    });
  }, [attendances, attendanceSearch, selectedDept, selectedStatus, selectedDate, currentSession, employees]);

  // Filtered Leaves List
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      if (currentSession.role === 'employee') {
        const emp = employees.find(e => e.email === currentSession.email);
        if (emp && l.employeeId !== emp.id) return false;
      }
      if (leaveStatusFilter !== 'all' && l.status !== leaveStatusFilter) return false;
      return true;
    });
  }, [leaves, leaveStatusFilter, currentSession, employees]);

  // Handle Leave Form Submit
  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!leaveForm.reason.trim() || leaveForm.reason.trim().length < 10) {
      errors.reason = language === 'es' 
        ? 'Ingresa una justificación detallada (mínimo 10 caracteres).' 
        : 'Please provide detailed justification (minimum 10 characters).';
    }

    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);

    if (end < start) {
      errors.endDate = language === 'es' 
        ? 'La fecha de fin no puede ser anterior a la de inicio.' 
        : 'End date cannot be prior to start date.';
    }

    if (Object.keys(errors).length > 0) {
      setLeaveErrors(errors);
      return;
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const currentEmp = employees.find(e => e.email === currentSession.email) || employees[0];

    const newRequest: LeaveRequest = {
      id: `leave-req-${Date.now()}`,
      employeeId: currentEmp.id,
      employeeName: `${currentEmp.firstName} ${currentEmp.lastName}`,
      employeeCode: currentEmp.code,
      department: currentEmp.department,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      daysCount: diffDays,
      reason: leaveForm.reason,
      status: 'Pendiente',
      requestedAt: new Date().toISOString().split('T')[0]
    };

    onRequestLeave(newRequest);
    setIsLeaveModalOpen(false);
    setLeaveErrors({});
    setLeaveForm({
      type: 'Vacaciones',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      reason: ''
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Biometric Clock Widget & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 cols: Live Clock-in Terminal */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0d0d12] via-[#141424] to-[#0d0d12] text-white rounded-2xl p-6 border border-[#1F1F23] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                {t('attendance.terminalTitle')}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
                {liveTime || '13:40:00'}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300 mt-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t('attendance.activePeriod')}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#09090b]/80 border border-[#1F1F23] flex items-center gap-2.5 text-xs text-zinc-300">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-100">{t('attendance.gpsLocation')}</p>
                <p className="text-[10px] text-zinc-400">{t('attendance.ipValidated')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-[#1F1F23]">
            <p className="text-[11px] text-zinc-400 mb-2 font-medium">
              {t('attendance.registerEventFor')} {currentSession.name}:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-clock-in"
                onClick={() => {
                  setClockStatus('working');
                  onClockAction('in');
                }}
                className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center shadow-sm"
              >
                {t('attendance.clockInBtn')}
              </button>
              <button
                id="btn-clock-lunch"
                onClick={() => {
                  setClockStatus('lunch');
                  onClockAction('lunch');
                }}
                className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors text-center shadow-sm"
              >
                {t('attendance.lunchBtn')}
              </button>
              <button
                id="btn-clock-out"
                onClick={() => {
                  setClockStatus('out');
                  onClockAction('out');
                }}
                className="py-2.5 px-2 rounded-xl bg-[#18181B] hover:bg-[#27272a] text-zinc-200 font-bold text-xs transition-colors text-center shadow-sm border border-[#27272a]"
              >
                {t('attendance.clockOutBtn')}
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Shift Summary & Key Indicators */}
        <div className="lg:col-span-7 bg-[#0A0A0C] rounded-2xl p-6 border border-[#1F1F23] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F23]">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('attendance.daySummary')}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {t('attendance.daySummarySub')}
                </p>
              </div>
              <button
                id="btn-request-leave"
                onClick={() => setIsLeaveModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('attendance.requestLeaveBtn')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-emerald-400 font-semibold block">{t('attendance.statPunctual')}</span>
                <span className="text-2xl font-bold font-mono text-emerald-300 mt-1 block">5</span>
                <span className="text-[10px] text-emerald-400">{t('attendance.statPunctualSub')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs text-amber-400 font-semibold block">{t('attendance.statLate')}</span>
                <span className="text-2xl font-bold font-mono text-amber-300 mt-1 block">1</span>
                <span className="text-[10px] text-amber-400">{t('attendance.statLateSub')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <span className="text-xs text-sky-400 font-semibold block">{t('attendance.statHomeOffice')}</span>
                <span className="text-2xl font-bold font-mono text-sky-300 mt-1 block">2</span>
                <span className="text-[10px] text-sky-400">{t('attendance.statHomeOfficeSub')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-xs text-purple-400 font-semibold block">{t('attendance.statVacation')}</span>
                <span className="text-2xl font-bold font-mono text-purple-300 mt-1 block">1</span>
                <span className="text-[10px] text-purple-400">{t('attendance.statVacationSub')}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F1F23] flex items-center justify-between text-xs text-zinc-400">
            <span>{t('attendance.officialTolerance')}</span>
            <span className="font-semibold text-indigo-400">{t('attendance.shiftHours')}</span>
          </div>
        </div>

      </div>

      {/* Section 1: Asistencia Master Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">
              {t('attendance.dailyAttendanceTable')}
            </h3>
            <p className="text-xs text-zinc-400">
              {t('attendance.dailyAttendanceSub')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0A0A0C] rounded-2xl p-4 border border-[#1F1F23] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('attendance.searchColabPlaceholder')}
              value={attendanceSearch}
              onChange={(e) => setAttendanceSearch(e.target.value)}
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">{t('payroll.allStatuses')}</option>
              <option value="Puntual">{translateAttendanceStatus('Puntual', language)}</option>
              <option value="Retardo">{translateAttendanceStatus('Retardo', language)}</option>
              <option value="Falta">{translateAttendanceStatus('Falta', language)}</option>
              <option value="Vacaciones">{translateAttendanceStatus('Vacaciones', language)}</option>
              <option value="Remoto">{translateAttendanceStatus('Remoto', language)}</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 font-mono"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0A0A0C] rounded-2xl border border-[#1F1F23] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121215] border-b border-[#1F1F23] text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">{t('attendance.colEmployee')}</th>
                  <th className="p-4">{t('attendance.colDept')}</th>
                  <th className="p-4">{t('attendance.colDate')}</th>
                  <th className="p-4">{t('attendance.colCheckIn')}</th>
                  <th className="p-4">{t('attendance.colCheckOut')}</th>
                  <th className="p-4">{t('attendance.colEffectiveHours')}</th>
                  <th className="p-4">{t('attendance.colLocationMethod')}</th>
                  <th className="p-4">{t('attendance.colStatus')}</th>
                  <th className="p-4">{t('attendance.colNotes')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F23] text-zinc-300">
                {filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-zinc-500">
                      {t('attendance.noAttendanceRecords')}
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((rec) => {
                    const emp = employees.find(e => e.id === rec.employeeId);
                    return (
                      <tr key={rec.id} className="hover:bg-[#121216] transition-colors">
                        <td className="p-4 font-semibold text-zinc-100">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={emp?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                              alt="" 
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-[#27272a]" 
                            />
                            <div>
                              <span>{rec.employeeName}</span>
                              <span className="text-[10px] text-zinc-400 block font-mono">{rec.employeeCode}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-300">{translateDepartment(rec.department, language)}</td>
                        <td className="p-4 font-mono text-zinc-400">{rec.date}</td>
                        <td className="p-4 font-mono font-bold text-zinc-100">{rec.checkIn || '--:--'}</td>
                        <td className="p-4 font-mono text-zinc-400">{rec.checkOut || '--:--'}</td>
                        <td className="p-4 font-mono">{rec.workHours > 0 ? `${rec.workHours} hrs` : '-'}</td>
                        <td className="p-4 text-zinc-300">
                          <div>
                            <span>{rec.location}</span>
                            {rec.verifiedBy && (
                              <span className="text-[10px] text-zinc-500 block">{rec.verifiedBy}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            rec.status === 'Puntual'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : rec.status === 'Retardo'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : rec.status === 'Remoto'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                              : rec.status === 'Vacaciones'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {translateAttendanceStatus(rec.status, language)}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-400 italic max-w-xs truncate">
                          {rec.notes || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: Gestión de Solicitudes de Permiso y Vacaciones */}
      <div className="space-y-4 pt-6 border-t border-[#1F1F23]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">
              {t('attendance.leavesSectionTitle')}
            </h3>
            <p className="text-xs text-zinc-400">
              {t('attendance.leavesSectionSub')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={leaveStatusFilter}
              onChange={(e) => setLeaveStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#0A0A0C] border border-[#1F1F23] rounded-xl text-zinc-300"
            >
              <option value="all">{t('attendance.allLeaves')}</option>
              <option value="Pendiente">{t('attendance.pendingLeaves')}</option>
              <option value="Aprobado">{t('attendance.approvedLeaves')}</option>
              <option value="Rechazado">{t('attendance.rejectedLeaves')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeaves.length === 0 ? (
            <div className="col-span-3 p-8 bg-[#0A0A0C] rounded-2xl border border-[#1F1F23] text-center text-zinc-500 text-xs">
              {t('attendance.noLeavesFound')}
            </div>
          ) : (
            filteredLeaves.map((req) => (
              <div key={req.id} className="bg-[#0A0A0C] rounded-2xl p-5 border border-[#1F1F23] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F1F23]">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {translateLeaveType(req.type, language)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      req.status === 'Aprobado'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : req.status === 'Rechazado'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {translateLeaveStatus(req.status, language)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-white">{req.employeeName}</h4>
                    <p className="text-[11px] text-zinc-400">{translateDepartment(req.department, language)} • {req.employeeCode}</p>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-[#121215] border border-[#1F1F23] text-xs space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>{t('attendance.periodLabel')}</span>
                      <span className="font-mono font-medium text-zinc-200">{req.startDate} {t('attendance.toLabel')} {req.endDate}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>{t('attendance.requestedDaysLabel')}</span>
                      <span className="font-bold text-indigo-400">{req.daysCount} {t('attendance.workingDaysSuffix')}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-3 italic bg-[#121215]/60 p-2.5 rounded-lg border border-[#1F1F23]">
                    "{req.reason}"
                  </p>

                  {req.comments && (
                    <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
                      <span className="font-semibold text-amber-200">{t('attendance.managerCommentLabel')} </span>
                      {req.comments}
                    </div>
                  )}
                </div>

                {/* Approver Actions */}
                {req.status === 'Pendiente' && currentSession.permissions.canApproveLeaves && (
                  <div className="pt-3 border-t border-[#1F1F23] flex items-center gap-2">
                    <button
                      onClick={() => onApproveLeave(req.id, language === 'es' ? 'Aprobado conforme al reglamento interno' : 'Approved according to internal policy')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('attendance.approveBtn')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setRejectModalId(req.id);
                        setRejectComment('');
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-1 border border-rose-500/20"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t('attendance.rejectBtn')}</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Solicitar Permiso / Vacaciones */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-lg w-full border border-[#1F1F23] overflow-hidden my-8 text-xs">
            <div className="bg-[#121215] px-6 py-4 flex items-center justify-between text-white border-b border-[#1F1F23]">
              <div>
                <h3 className="text-base font-bold">{t('attendance.modalLeaveTitle')}</h3>
                <p className="text-xs text-zinc-400">{t('attendance.modalLeaveSub')}</p>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  {t('attendance.absenceType')}
                </label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value as LeaveType })}
                  className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="Vacaciones" className="bg-[#121215] text-zinc-200">{language === 'es' ? 'Vacaciones Anuales' : 'Annual Vacation'}</option>
                  <option value="Incapacidad Médica" className="bg-[#121215] text-zinc-200">{language === 'es' ? 'Incapacidad Médica (Certificado)' : 'Medical Sick Leave'}</option>
                  <option value="Asunto Personal" className="bg-[#121215] text-zinc-200">{language === 'es' ? 'Asunto Personal' : 'Personal Matter'}</option>
                  <option value="Duelo" className="bg-[#121215] text-zinc-200">{language === 'es' ? 'Duelo Familiar' : 'Bereavement'}</option>
                  <option value="Paternidad/Maternidad" className="bg-[#121215] text-zinc-200">{language === 'es' ? 'Licencia de Paternidad / Maternidad' : 'Parental / Maternity Leave'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {t('attendance.startDate')}
                  </label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {t('attendance.endDate')}
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl font-mono text-zinc-200"
                  />
                  {leaveErrors.endDate && (
                    <p className="text-rose-400 text-[11px] mt-1">{leaveErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  {t('attendance.reasonJustification')}
                </label>
                <textarea
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder={t('attendance.reasonPlaceholder')}
                  className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
                />
                {leaveErrors.reason && (
                  <p className="text-rose-400 text-[11px] mt-1">{leaveErrors.reason}</p>
                )}
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-indigo-200">
                <span className="font-bold block">{t('attendance.legalNoticeTitle')}</span>
                <span>{t('attendance.legalNoticeBody')}</span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1F1F23]">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f26] text-zinc-300 font-semibold border border-[#27272a]"
                >
                  {t('attendance.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {t('attendance.sendRequest')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rechazar con Comentario */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0A0A0C] rounded-2xl shadow-2xl max-w-md w-full border border-[#1F1F23] p-6 text-xs space-y-4">
            <h3 className="text-base font-bold text-white">{t('attendance.rejectModalTitle')}</h3>
            <p className="text-zinc-400">{t('attendance.rejectModalSub')}</p>
            
            <textarea
              rows={3}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder={t('attendance.rejectCommentPlaceholder')}
              className="w-full px-3 py-2 bg-[#121215] border border-[#1F1F23] rounded-xl text-zinc-200 placeholder:text-zinc-500"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1F1F23]">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 rounded-xl bg-[#141418] text-zinc-300 font-semibold border border-[#27272a]"
              >
                {t('attendance.cancel')}
              </button>
              <button
                onClick={() => {
                  if (rejectModalId) {
                    onRejectLeave(rejectModalId, rejectComment || (language === 'es' ? 'Rechazado por necesidades de cobertura de área' : 'Rejected due to area coverage requirements'));
                    setRejectModalId(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {t('attendance.confirmReject')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
