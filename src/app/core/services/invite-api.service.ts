import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000';

export interface InviteUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  photo: string | null;
}

export interface InviteOrganization {
  id: string;
  name: string;
}

export interface Invite {
  id: string;
  userId: string;
  user: InviteUser;
  organizationId: string;
  organization: InviteOrganization;
  invitedById: string | null;
  invitedBy: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
  sentAt: string;
  acceptedAt: string | null;
  expiresAt: string | null;
}

export interface CreateInviteRequest {
  userId: string;
  expiresAt?: string;
}

@Injectable({ providedIn: 'root' })
export class InviteApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Invite[]> {
    return this.http.get<Invite[]>(`${BASE_URL}/invites`);
  }

  create(data: CreateInviteRequest): Observable<Invite> {
    return this.http.post<Invite>(`${BASE_URL}/invites`, data);
  }

  accept(id: string): Observable<Invite> {
    return this.http.post<Invite>(`${BASE_URL}/invites/${id}/accept`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/invites/${id}`);
  }
}
