import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList implements OnInit {
  private readonly api = inject(EmployeesApiService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);

  employees = signal<Employee[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) return;

    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить список сотрудников');
        this.loading.set(false);
      },
    });
  }

  edit(emp: Employee): void {
    this.router.navigate(['/employees', emp.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard', this.orgContext.currentOrgId()]);
  }
}
