import { Position } from './position.model';
import { Specialty } from './specialty.model';
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

export interface PublicService {
  id: string;
  title: string;
  description?: string;
  photo?: string;
  price?: number;
  duration?: number;
  durationMax?: number;
}

export interface PublicEmployee {
  id: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  description?: string;
  phone?: string;
  workSchedule?: WorkScheduleEntry[];
  experienceYears?: number;
  isActive: boolean;
  isPublic?: boolean;
  user: { email: string };
  position?: { id: string; name: string };
  services?: PublicService[];
  specialties?: { id: string; name: string }[];
  about?: string[];
  education?: string[];
  certificates?: string[];
}

export interface Employee {
  id: string;
  firstName?: string;
  lastName?: string;
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
  specialties?: Specialty[];
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

export interface CreateEmployeeRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photo?: string;
  description?: string;
  about?: string[];
  education?: string[];
  certificates?: string[];
  workSchedule?: WorkScheduleEntry[];
  serviceIds?: string[];
  specialtyIds?: string[];
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
  serviceIds?: string[];
  specialtyIds?: string[];
}
