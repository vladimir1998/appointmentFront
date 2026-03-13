import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, RegisterEmployeeRequest, UpdateEmployeeRequest } from '../models/employee.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  private readonly http = inject(HttpClient);

  getAll(organizationId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${BASE_URL}/employees`, {
      params: { organizationId },
    });
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${BASE_URL}/employees/${id}`);
  }

  register(data: RegisterEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${BASE_URL}/employees/register`, data);
  }

  update(id: string, data: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.patch<Employee>(`${BASE_URL}/employees/${id}`, data);
  }
}
