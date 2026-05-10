import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Invite {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  acceptedAt: string | null;
}

const MOCK_INVITES: Invite[] = [
  { id: 'i1',  email: 'p.brown@medcrm.com',    role: 'EMPLOYEE', sentAt: '2025-11-02T10:00:00Z', acceptedAt: '2025-11-03T08:45:00Z' },
  { id: 'i2',  email: 'c.davies@medcrm.com',   role: 'EMPLOYEE', sentAt: '2025-11-10T14:30:00Z', acceptedAt: '2025-11-11T09:12:00Z' },
  { id: 'i3',  email: 'n.garcia@medcrm.com',   role: 'MANAGER',  sentAt: '2025-12-01T09:00:00Z', acceptedAt: '2025-12-01T18:33:00Z' },
  { id: 'i4',  email: 'a.kim@medcrm.com',      role: 'EMPLOYEE', sentAt: '2026-01-15T11:20:00Z', acceptedAt: null },
  { id: 'i5',  email: 't.jones@medcrm.com',    role: 'EMPLOYEE', sentAt: '2026-01-28T08:00:00Z', acceptedAt: '2026-01-29T10:05:00Z' },
  { id: 'i6',  email: 'r.kumar@medcrm.com',    role: 'ADMIN',    sentAt: '2026-02-05T13:45:00Z', acceptedAt: null },
  { id: 'i7',  email: 'e.martin@medcrm.com',   role: 'EMPLOYEE', sentAt: '2026-02-18T16:00:00Z', acceptedAt: '2026-02-19T07:58:00Z' },
  { id: 'i8',  email: 'f.thompson@medcrm.com', role: 'EMPLOYEE', sentAt: '2026-03-03T10:10:00Z', acceptedAt: null },
  { id: 'i9',  email: 'd.white@medcrm.com',    role: 'MANAGER',  sentAt: '2026-03-20T09:30:00Z', acceptedAt: '2026-03-20T14:22:00Z' },
  { id: 'i10', email: 'l.harris@medcrm.com',   role: 'EMPLOYEE', sentAt: '2026-04-07T11:00:00Z', acceptedAt: null },
  { id: 'i11', email: 's.clark@medcrm.com',    role: 'EMPLOYEE', sentAt: '2026-04-22T15:30:00Z', acceptedAt: null },
  { id: 'i12', email: 'b.lewis@medcrm.com',    role: 'EMPLOYEE', sentAt: '2026-05-01T08:45:00Z', acceptedAt: '2026-05-02T09:10:00Z' },
];

@Component({
  selector: 'app-admin-invite-list',
  imports: [RouterLink],
  templateUrl: './admin-invite-list.html',
  styleUrl: './admin-invite-list.scss',
})
export class AdminInviteList {
  readonly invites = signal<Invite[]>(MOCK_INVITES);

  filter = signal<'all' | 'pending' | 'accepted'>('all');

  filtered = computed(() => {
    const f = this.filter();
    return this.invites().filter(i =>
      f === 'all' ? true : f === 'accepted' ? !!i.acceptedAt : !i.acceptedAt
    );
  });

  counts = computed(() => ({
    all:      this.invites().length,
    pending:  this.invites().filter(i => !i.acceptedAt).length,
    accepted: this.invites().filter(i => !!i.acceptedAt).length,
  }));

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
