import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);

  getAll(email?: string): Observable<User[]> {
    const params: Record<string, string> = {};
    if (email) params['email'] = email;
    return this.http.get<User[]>(`${BASE_URL}/users`, { params });
  }
}
