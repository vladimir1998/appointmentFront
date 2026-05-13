import { Position } from './position.model';
import { User } from './user.model';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeInterval {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface WorkScheduleEntry {
  day: DayOfWeek;
  isWorking: boolean;
  intervals: TimeInterval[];
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
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  services?: any[];
  organizationId: string;
  organization?: any;
  positionId?: string;
  position?: Position;
  userId: string;
  user: User;
  workSchedule?: WorkScheduleEntry[];
  experienceYears?: number;
  education?: string[];
  certificates?: string[];
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
  isPublic?: boolean;
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
  isPublic?: boolean;
  positionId?: string;
  workSchedule?: WorkScheduleEntry[];
  experienceYears?: number;
  education?: string[];
  certificates?: string[];
}
