import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  value: string;
}

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class PermissionsApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${BASE_URL}/permissions`);
  }
}
