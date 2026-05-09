import { Position } from './position.model';

export interface EmployeeUser {
  id: string;
  email: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photo?: string;
  description?: string;
  about?: string[];
  role: string;
  isActive: boolean;
  userId: string;
  organizationId: string;
  positionId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: EmployeeUser;
  position?: Position;
}

export interface RegisterEmployeeRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photo?: string;
  description?: string;
  about?: string[];
  isActive?: boolean;
  positionId?: string;
  organizationId: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photo?: string;
  description?: string;
  about?: string[];
  isActive?: boolean;
  positionId?: string;
}
