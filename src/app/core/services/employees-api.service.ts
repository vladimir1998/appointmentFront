import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, PublicEmployee } from '../models/employee.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  private readonly http = inject(HttpClient);

  getPublicByOrganization(organizationId: string, params?: { serviceId?: string; include?: string[] }): Observable<PublicEmployee[]> {
    const query = new URLSearchParams();
    if (params?.serviceId) query.set('serviceId', params.serviceId);
    params?.include?.forEach(v => query.append('include', v));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.http.get<PublicEmployee[]>(`${BASE_URL}/client-api/organizations/${organizationId}/employees${qs}`);
  }

  getPublicById(organizationId: string, id: string): Observable<PublicEmployee> {
    return this.http.get<PublicEmployee>(`${BASE_URL}/client-api/organizations/${organizationId}/employees/${id}`);
  }

  // x-organization-id передаётся автоматически через authInterceptor
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${BASE_URL}/employees`);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${BASE_URL}/employees/${id}`);
  }

  getByUserId(userId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${BASE_URL}/employees/user/${userId}`);
  }

  create(data: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${BASE_URL}/employees`, data);
  }

  update(id: string, data: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.patch<Employee>(`${BASE_URL}/employees/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/employees/${id}`);
  }
}
