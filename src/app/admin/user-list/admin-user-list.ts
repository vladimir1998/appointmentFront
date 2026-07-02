import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { User } from '../../core/models/user.model';
import { Employee } from '../../core/models/employee.model';
import { Client } from '../../core/models/client.model';
import { UsersApiService } from '../../core/services/users-api.service';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { ClientsApiService } from '../../core/services/clients-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';

export interface UserWithEmployee {
  user: User;
  employees: Employee[];
  client: Client | null;
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #fcd34d, #b45309)',
  'linear-gradient(135deg, #6ee7b7, #047857)',
  'linear-gradient(135deg, #c4b5fd, #6d28d9)',
  'linear-gradient(135deg, #fda4af, #be123c)',
  'linear-gradient(135deg, #93c5fd, #1d4ed8)',
  'linear-gradient(135deg, #f9a8d4, #be185d)',
  'linear-gradient(135deg, #fdba74, #c2410c)',
];

@Component({
  selector: 'app-admin-user-list',
  imports: [RouterLink],
  templateUrl: './admin-user-list.html',
  styleUrl: './admin-user-list.scss',
})
export class AdminUserList implements OnInit {
  private readonly usersApi = inject(UsersApiService);
  private readonly employeesApi = inject(EmployeesApiService);
  private readonly clientsApi = inject(ClientsApiService);
  private readonly orgContext = inject(OrganizationContextService);

  users = signal<UserWithEmployee[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  assigningUserId = signal<string | null>(null);
  deletingUserId = signal<string | null>(null);

  searchQuery = signal('');

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.users();
    return this.users().filter(({ user }) =>
      user.email.toLowerCase().includes(q) ||
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase().includes(q) ||
      (user.phone ?? '').includes(q)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    const orgId = this.orgContext.currentOrgId();

    if (!orgId) {
      this.error.set('No organization selected');
      this.loading.set(false);
      return;
    }

    forkJoin({
      users: this.usersApi.getAll(),
      employees: this.employeesApi.getAll(),
      clients: this.clientsApi.getAll(orgId),
    }).subscribe({
      next: ({ users, employees, clients }) => {
        this.users.set(users.map(user => ({
          user,
          employees: employees.filter(e => e.userId === user.id),
          client: clients.find(c => c.userId === user.id) ?? null,
        })));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  assignAsCustomer(item: UserWithEmployee): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId || this.assigningUserId()) return;

    this.assigningUserId.set(item.user.id);
    this.clientsApi.create({
      firstName: item.user.firstName ?? item.user.email,
      lastName: item.user.lastName ?? '',
      phone: item.user.phone,
      userId: item.user.id,
      organizationId: orgId,
    }).subscribe({
      next: (client) => {
        this.users.update(list =>
          list.map(u => u.user.id === item.user.id ? { ...u, client } : u)
        );
        this.assigningUserId.set(null);
      },
      error: () => {
        this.assigningUserId.set(null);
      },
    });
  }

  removeCustomer(item: UserWithEmployee): void {
    if (!item.client || this.assigningUserId()) return;

    this.assigningUserId.set(item.user.id);
    this.clientsApi.remove(item.client.id).subscribe({
      next: () => {
        this.users.update(list =>
          list.map(u => u.user.id === item.user.id ? { ...u, client: null } : u)
        );
        this.assigningUserId.set(null);
      },
      error: () => {
        this.assigningUserId.set(null);
      },
    });
  }

  deleteUser(item: UserWithEmployee): void {
    if (this.deletingUserId()) return;
    if (!confirm(`Delete user ${item.user.email}? This action cannot be undone.`)) return;

    this.deletingUserId.set(item.user.id);
    this.usersApi.remove(item.user.id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.user.id !== item.user.id));
        this.deletingUserId.set(null);
      },
      error: () => {
        this.deletingUserId.set(null);
      },
    });
  }

  avatarGradient(index: number): string {
    return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  }

  initials(user: User): string {
    const f = user.firstName?.[0] ?? user.email[0];
    const l = user.lastName?.[0] ?? '';
    return (f + l).toUpperCase();
  }

  formatDate(iso: string | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
