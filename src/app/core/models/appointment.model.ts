export interface Appointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  serviceId: string;
  employeeId: string;
  startTime: string;
  endTime?: string;
  notes?: string;
  status: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  clientName: string;
  clientPhone?: string;
  serviceId: string;
  employeeId: string;
  startTime: string;
  notes?: string;
  organizationId: string;
}

export interface UpdateAppointmentRequest {
  clientName?: string;
  clientPhone?: string;
  serviceId?: string;
  employeeId?: string;
  startTime?: string;
  notes?: string;
  status?: string;
}
