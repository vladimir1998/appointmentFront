import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateServiceRequest, Service, UpdateServiceRequest } from '../models/service.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ServicesApiService {
  private readonly http = inject(HttpClient);

  getAll(organizationId: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${BASE_URL}/services`, {
      params: { organizationId },
    });
  }

  getById(id: string): Observable<Service> {
    return this.http.get<Service>(`${BASE_URL}/services/${id}`);
  }

  create(data: CreateServiceRequest): Observable<Service> {
    return this.http.post<Service>(`${BASE_URL}/services`, data);
  }

  update(id: string, data: UpdateServiceRequest): Observable<Service> {
    return this.http.patch<Service>(`${BASE_URL}/services/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/services/${id}`);
  }
}
