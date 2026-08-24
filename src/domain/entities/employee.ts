import { AppRole } from './rbac';

export type Department = 
  | 'Tecnología'
  | 'Finanzas'
  | 'Talento Humano'
  | 'Operaciones'
  | 'Ventas & Marketing'
  | 'Legal & Cumplimiento'
  | 'Dirección General';

export type ContractType = 'Indefinido' | 'Temporal' | 'Honorarios' | 'Prácticas';
export type EmployeeStatus = 'Activo' | 'Inactivo' | 'Licencia';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string;
  code: string; // e.g. EMP-1042
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentId: string; // DNI / CURP / RUT
  position: string;
  department: Department;
  contractType: ContractType;
  baseSalary: number;
  hireDate: string;
  status: EmployeeStatus;
  avatar: string;
  emergencyContact: EmergencyContact;
  address: string;
  bankAccount: string;
  assignedRole: AppRole;
  performanceRating: number; // 1 to 5
}
