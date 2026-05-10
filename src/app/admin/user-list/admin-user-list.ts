import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../core/models/user.model';
import { Employee } from '../../core/models/employee.model';
import { MOCK_USERS } from '../../users/user.mock';
import { MOCK_EMPLOYEES } from '../../employees/employee-list/employee-list.mock';

export interface UserWithEmployee {
  user: User;
  employees: Employee[];
}

const MOCK_USERS_WITH_EMPLOYEES: UserWithEmployee[] = MOCK_USERS.map(user => ({
  user,
  employees: MOCK_EMPLOYEES.filter(e => e.userId === user.id),
}));

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
  users = signal<UserWithEmployee[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

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
    this.users.set(MOCK_USERS_WITH_EMPLOYEES);
    this.loading.set(false);
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
