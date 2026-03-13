import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../models/appointment.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AppointmentsApiService {
  private readonly http = inject(HttpClient);

  getAll(organizationId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${BASE_URL}/appointments`, {
      params: { organizationId },
    });
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${BASE_URL}/appointments/${id}`);
  }

  create(data: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${BASE_URL}/appointments`, data);
  }

  update(id: string, data: UpdateAppointmentRequest): Observable<Appointment> {
    return this.http.patch<Appointment>(`${BASE_URL}/appointments/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/appointments/${id}`);
  }
}
