import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm {
  private readonly api = inject(EmployeesApiService);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  email = '';
  password = '';
  firstName = '';
  lastName = '';
  phone = '';
  position = '';

  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    this.api.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      ...(this.phone && { phone: this.phone }),
      ...(this.position && { position: this.position }),
      organizationId: this.orgContext.currentOrgId()!,
    }).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: () => {
        this.error.set('Не удалось зарегистрировать сотрудника');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
