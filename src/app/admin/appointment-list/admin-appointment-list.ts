import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Appointment } from '../../core/models/appointment.model';
import { Employee } from '../../core/models/employee.model';
import { Service } from '../../core/models/service.model';
import { AppointmentsApiService } from '../../core/services/appointments-api.service';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';

export interface AppointmentRow {
  appointment: Appointment;
  serviceName: string;
  employeeName: string;
}

@Component({
  selector: 'app-admin-appointment-list',
  imports: [],
  templateUrl: './admin-appointment-list.html',
  styleUrl: './admin-appointment-list.scss',
})
export class AdminAppointmentList implements OnInit {
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly employeesApi = inject(EmployeesApiService);
  private readonly servicesApi = inject(ServicesApiService);
  private readonly orgContext = inject(OrganizationContextService);

  rows = signal<AppointmentRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter(({ appointment, serviceName, employeeName }) =>
      appointment.clientName.toLowerCase().includes(q) ||
      (appointment.clientPhone ?? '').includes(q) ||
      serviceName.toLowerCase().includes(q) ||
      employeeName.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.error.set('No organization selected');
      this.loading.set(false);
      return;
    }

    forkJoin({
      appointments: this.appointmentsApi.getAll(orgId),
      employees: this.employeesApi.getAll(),
      services: this.servicesApi.getAll(orgId),
    }).subscribe({
      next: ({ appointments, employees, services }) => {
        const empMap = new Map<string, Employee>(employees.map(e => [e.id, e]));
        const svcMap = new Map<string, Service>(services.map(s => [s.id, s]));

        this.rows.set(appointments.map(a => ({
          appointment: a,
          serviceName: svcMap.get(a.serviceId)?.title ?? '—',
          employeeName: (() => {
            const e = empMap.get(a.employeeId);
            return e ? `${e.firstName} ${e.lastName}` : '—';
          })(),
        })));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load appointments');
        this.loading.set(false);
      },
    });
  }

  formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return map[status] ?? status;
  }
}
