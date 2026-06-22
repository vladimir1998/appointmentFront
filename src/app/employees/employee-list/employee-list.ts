import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PublicEmployee } from '../../core/models/employee.model';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { EmployeeCard } from '../employee-card/employee-card';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, EmployeeCard],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList implements OnInit {
  private readonly router = inject(Router);
  private readonly employeesApi = inject(EmployeesApiService);
  private readonly orgContext = inject(OrganizationContextService);

  employees = signal<PublicEmployee[]>([]);
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

  ngOnInit(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.error.set('Organization not selected');
      return;
    }
    this.loading.set(true);
    this.employeesApi.getPublicByOrganization(orgId, { include: ['service'] }).subscribe({
      next: employees => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message ?? 'Failed to load employees');
        this.loading.set(false);
      },
    });
  }

  selectFilter(value: 'all' | 'active' | 'inactive'): void {
    this.filterActive.set(value);
    this.filterDropdownOpen.set(false);
  }

  filterLabel(): string {
    const map = { all: 'All employees', active: 'Active', inactive: 'Inactive' };
    return map[this.filterActive()];
  }

  view(emp: PublicEmployee): void {
    this.router.navigate(['/employees', emp.id]);
  }
}
