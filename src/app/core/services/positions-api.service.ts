import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePositionRequest, Position, UpdatePositionRequest } from '../models/position.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class PositionsApiService {
  private readonly http = inject(HttpClient);

  getAll(organizationId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`${BASE_URL}/positions`, {
      params: { organizationId },
    });
  }

  getById(id: string): Observable<Position> {
    return this.http.get<Position>(`${BASE_URL}/positions/${id}`);
  }

  create(data: CreatePositionRequest): Observable<Position> {
    return this.http.post<Position>(`${BASE_URL}/positions`, data);
  }

  update(id: string, data: UpdatePositionRequest): Observable<Position> {
    return this.http.patch<Position>(`${BASE_URL}/positions/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/positions/${id}`);
  }
}
