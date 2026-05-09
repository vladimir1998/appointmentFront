import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Employee } from '../../core/models/employee.model';
import { MOCK_EMPLOYEES } from '../../employees/employee-list/employee-list.mock';

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
  selector: 'app-user-list',
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class EmployeeList {
  private readonly router = inject(Router);

  users = signal<Employee[]>(MOCK_EMPLOYEES);
  loading = signal(false);
  error = signal<string | null>(null);

  searchQuery = signal('');
  filterActive = signal<'all' | 'active' | 'inactive'>('all');
  filterDropdownOpen = signal(false);

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.filterActive();
    return this.users().filter(u => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchQ = !q || fullName.includes(q) || u.user.email.toLowerCase().includes(q);
      const matchF = f === 'all' || (f === 'active' ? u.isActive : !u.isActive);
      return matchQ && matchF;
    });
  });

  avatarGradient(index: number): string {
    return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  }

  initials(user: Employee): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  selectFilter(value: 'all' | 'active' | 'inactive'): void {
    this.filterActive.set(value);
    this.filterDropdownOpen.set(false);
  }

  filterLabel(): string {
    const map = { all: 'All users', active: 'Active', inactive: 'Inactive' };
    return map[this.filterActive()];
  }

  view(user: Employee): void {
    this.router.navigate(['/employees', user.id]);
  }
}
