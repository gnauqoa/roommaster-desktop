export type EmployeeRole = 'admin' | 'receptionist' | 'manager' | 'housekeeper' | 'maintenance';
export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id: number;
  name: string;
  role: EmployeeRole;
  email: string;
  phone: string;
  status: EmployeeStatus;
}

export interface CreateEmployeeInput {
  name: string;
  role: EmployeeRole;
  email: string;
  phone: string;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  id: number;
  status?: EmployeeStatus;
}

