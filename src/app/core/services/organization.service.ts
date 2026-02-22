import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrganizationRequest, Organization } from '../models/organization.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);

  create(data: CreateOrganizationRequest): Observable<Organization> {
    return this.http.post<Organization>(`${BASE_URL}/organizations`, data);
  }

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${BASE_URL}/organizations`);
  }
}
