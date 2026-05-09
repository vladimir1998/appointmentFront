import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
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
  selector: 'app-admin-employee-list',
  imports: [RouterLink],
  templateUrl: './admin-employee-list.html',
  styleUrl: './admin-employee-list.scss',
})
export class AdminEmployeeList implements OnInit {
  private readonly api = inject(EmployeesApiService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);

  employees = signal<Employee[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  searchQuery = signal('');
  selectedPosition = signal('');
  specDropdownOpen = signal(false);

  positions = computed(() =>
    [...new Set(
      this.employees().map(e => e.position?.name).filter(Boolean) as string[]
    )].sort()
  );

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const pos = this.selectedPosition();
    return this.employees().filter(e => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchQ = !q || fullName.includes(q) || (e.position?.name?.toLowerCase().includes(q) ?? false);
      const matchP = !pos || e.position?.name === pos;
      return matchQ && matchP;
    });
  });

  ngOnInit(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.employees.set(MOCK_EMPLOYEES);
      this.loading.set(false);
      return;
    }

    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.employees.set(data.length ? data : MOCK_EMPLOYEES);
        this.loading.set(false);
      },
      error: () => {
        this.employees.set(MOCK_EMPLOYEES);
        this.loading.set(false);
      },
    });
  }

  avatarGradient(index: number): string {
    return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  }

  initials(emp: Employee): string {
    return `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase();
  }

  selectPosition(pos: string): void {
    this.selectedPosition.set(pos);
    this.specDropdownOpen.set(false);
  }

  edit(emp: Employee): void {
    this.router.navigate(['/admin/employees', emp.id, 'edit']);
  }
}
