import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Position } from '../../core/models/position.model';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit {
  private readonly api = inject(EmployeesApiService);
  private readonly positionsApi = inject(PositionsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  employeeId: string | null = null;

  email = '';
  password = '';
  firstName = '';
  lastName = '';
  phone = '';
  positionId = '';

  positions = signal<Position[]>([]);
  positionsLoading = signal(false);
  fetchLoading = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.employeeId;

    const orgId = this.orgContext.currentOrgId();

    if (orgId) {
      this.positionsLoading.set(true);
      this.positionsApi.getAll(orgId).subscribe({
        next: (data) => {
          this.positions.set(data);
          this.positionsLoading.set(false);
        },
        error: () => this.positionsLoading.set(false),
      });
    }

    if (this.isEdit && this.employeeId) {
      this.fetchLoading.set(true);
      this.api.getById(this.employeeId).subscribe({
        next: (emp) => {
          this.firstName = emp.firstName;
          this.lastName = emp.lastName;
          this.email = emp.user.email;
          this.phone = emp.phone ?? '';
          this.positionId = emp.positionId ?? '';
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Не удалось загрузить данные сотрудника');
          this.fetchLoading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const request$ = this.isEdit
      ? this.api.update(this.employeeId!, {
          firstName: this.firstName,
          lastName: this.lastName,
          ...(this.phone && { phone: this.phone }),
          ...(this.positionId && { positionId: this.positionId }),
        })
      : this.api.register({
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          ...(this.phone && { phone: this.phone }),
          ...(this.positionId && { positionId: this.positionId }),
          organizationId: this.orgContext.currentOrgId()!,
        });

    request$.subscribe({
      next: () => this.router.navigate(['/employees']),
      error: () => {
        this.error.set('Не удалось сохранить данные сотрудника');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
