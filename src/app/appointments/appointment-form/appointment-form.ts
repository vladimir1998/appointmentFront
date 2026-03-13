import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentsApiService } from '../../core/services/appointments-api.service';
import { ServicesApiService } from '../../core/services/services-api.service';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Service } from '../../core/models/service.model';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-appointment-form',
  imports: [FormsModule],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss',
})
export class AppointmentForm implements OnInit {
  private readonly api = inject(AppointmentsApiService);
  private readonly servicesApi = inject(ServicesApiService);
  private readonly employeesApi = inject(EmployeesApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  appointmentId: string | null = null;

  clientName = '';
  clientPhone = '';
  serviceId = '';
  employeeId = '';
  startTime = '';
  notes = '';

  services = signal<Service[]>([]);
  employees = signal<Employee[]>([]);
  refsLoading = signal(false);
  fetchLoading = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.appointmentId;

    const orgId = this.orgContext.currentOrgId();
    if (orgId) {
      this.refsLoading.set(true);
      forkJoin({
        services: this.servicesApi.getAll(orgId),
        employees: this.employeesApi.getAll(orgId),
      }).subscribe({
        next: ({ services, employees }) => {
          this.services.set(services);
          this.employees.set(employees);
          this.refsLoading.set(false);
        },
        error: () => this.refsLoading.set(false),
      });
    }

    if (this.isEdit && this.appointmentId) {
      this.fetchLoading.set(true);
      this.api.getById(this.appointmentId).subscribe({
        next: (a) => {
          this.clientName = a.clientName;
          this.clientPhone = a.clientPhone ?? '';
          this.serviceId = a.serviceId;
          this.employeeId = a.employeeId;
          this.startTime = a.startTime.slice(0, 16);
          this.notes = a.notes ?? '';
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Не удалось загрузить заказ');
          this.fetchLoading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const base = {
      clientName: this.clientName,
      ...(this.clientPhone && { clientPhone: this.clientPhone }),
      serviceId: this.serviceId,
      employeeId: this.employeeId,
      startTime: this.startTime,
      ...(this.notes && { notes: this.notes }),
    };

    const orgId = this.orgContext.currentOrgId();
    const request$ = this.isEdit
      ? this.api.update(this.appointmentId!, base)
      : this.api.create({ ...base, organizationId: orgId as string });

    request$.subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: () => {
        this.error.set('Не удалось сохранить заказ');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}
