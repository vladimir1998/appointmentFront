import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, RegisterEmployeeRequest } from '../models/employee.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  private readonly http = inject(HttpClient);

  register(data: RegisterEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${BASE_URL}/employees/register`, data);
  }
}
