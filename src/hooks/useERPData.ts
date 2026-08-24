import { useState, useEffect, useCallback } from 'react';
import { 
  Employee, 
  PayrollItem, 
  AttendanceRecord, 
  LeaveRequest, 
  PayrollStatus 
} from '../domain';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_PAYROLL, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES 
} from '../data/mockData';
import { 
  StorageRepository, 
  PayrollCalculator, 
  AttendanceService, 
  LeaveService 
} from '../services';

export function useERPData() {
  const [employees, setEmployees] = useState<Employee[]>(() => StorageRepository.getEmployees());
  const [payrolls, setPayrolls] = useState<PayrollItem[]>(() => StorageRepository.getPayrolls());
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() => StorageRepository.getAttendances());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => StorageRepository.getLeaves());

  // Automatic synchronization to persistent storage layer
  useEffect(() => {
    StorageRepository.saveEmployees(employees);
  }, [employees]);

  useEffect(() => {
    StorageRepository.savePayrolls(payrolls);
  }, [payrolls]);

  useEffect(() => {
    StorageRepository.saveAttendances(attendances);
  }, [attendances]);

  useEffect(() => {
    StorageRepository.saveLeaves(leaves);
  }, [leaves]);

  // Employee business use case
  const addEmployee = useCallback((newEmp: Employee) => {
    setEmployees(prev => [newEmp, ...prev]);

    // Domain Rule: Automatically generate initial biweekly payroll calculation
    const initialPayroll = PayrollCalculator.createInitialPayrollForEmployee(newEmp);
    setPayrolls(prev => [initialPayroll, ...prev]);
  }, []);

  // Payroll business use cases
  const updatePayrollStatus = useCallback((id: string, newStatus: PayrollStatus) => {
    setPayrolls(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  }, []);

  const batchPay = useCallback((ids: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    setPayrolls(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'Pagado', paymentDate: today } : p));
  }, []);

  const addNewPayroll = useCallback((newPayroll: PayrollItem) => {
    setPayrolls(prev => [newPayroll, ...prev]);
  }, []);

  // Attendance business use cases
  const recordClockIn = useCallback((employee: Employee) => {
    const record = AttendanceService.createClockInRecord(employee);
    setAttendances(prev => [record, ...prev]);
    return record;
  }, []);

  // Leave business use cases
  const approveLeave = useCallback((leaveId: string, reviewerName: string, comments?: string) => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? LeaveService.reviewRequest(l, 'Aprobado', reviewerName, comments) : l));
  }, []);

  const rejectLeave = useCallback((leaveId: string, reviewerName: string, comments?: string) => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? LeaveService.reviewRequest(l, 'Rechazado', reviewerName, comments) : l));
  }, []);

  const requestLeave = useCallback((newLeave: LeaveRequest) => {
    setLeaves(prev => [newLeave, ...prev]);
  }, []);

  // Reset to original company seed data
  const resetDemoData = useCallback(() => {
    setEmployees(INITIAL_EMPLOYEES);
    setPayrolls(INITIAL_PAYROLL);
    setAttendances(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    StorageRepository.clearAll();
  }, []);

  return {
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
  };
}
