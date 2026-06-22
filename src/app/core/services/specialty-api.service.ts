import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSpecialtyRequest, Specialty, UpdateSpecialtyRequest } from '../models/specialty.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class SpecialtyApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(`${BASE_URL}/specialties`);
  }

  getById(id: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${BASE_URL}/specialties/${id}`);
  }

  create(data: CreateSpecialtyRequest): Observable<Specialty> {
    return this.http.post<Specialty>(`${BASE_URL}/specialties`, data);
  }

  update(id: string, data: UpdateSpecialtyRequest): Observable<Specialty> {
    return this.http.patch<Specialty>(`${BASE_URL}/specialties/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/specialties/${id}`);
  }
}
