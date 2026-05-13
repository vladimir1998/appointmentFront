import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Employee } from '../../core/models/employee.model';
import { MOCK_EMPLOYEES } from '../../core/mocks/mock-employees';
import { EmployeeCard } from '../employee-card/employee-card';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, EmployeeCard],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private readonly router = inject(Router);

  employees = signal<Employee[]>(MOCK_EMPLOYEES);
  loading = signal(false);
  error = signal<string | null>(null);

  searchQuery = signal('');
  filterActive = signal<'all' | 'active' | 'inactive'>('all');
  filterDropdownOpen = signal(false);

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.filterActive();
    return this.employees().filter(e => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchQ = !q || fullName.includes(q) || e.user.email.toLowerCase().includes(q);
      const matchF = f === 'all' || (f === 'active' ? e.isActive : !e.isActive);
      return matchQ && matchF;
    });
  });

  selectFilter(value: 'all' | 'active' | 'inactive'): void {
    this.filterActive.set(value);
    this.filterDropdownOpen.set(false);
  }

  filterLabel(): string {
    const map = { all: 'All employees', active: 'Active', inactive: 'Inactive' };
    return map[this.filterActive()];
  }

  view(emp: Employee): void {
    this.router.navigate(['/employees', emp.id]);
  }
}
