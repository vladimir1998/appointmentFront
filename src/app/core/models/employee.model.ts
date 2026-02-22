export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  organizationId: string;
}

export interface RegisterEmployeeRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  organizationId: string;
}
