import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClientRequest } from '../models/client.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ClientsApiService {
  private readonly http = inject(HttpClient);

  getAll(organizationId: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${BASE_URL}/clients`, {
      params: { organizationId },
    });
  }

  create(data: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(`${BASE_URL}/clients`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/clients/${id}`);
  }
}
