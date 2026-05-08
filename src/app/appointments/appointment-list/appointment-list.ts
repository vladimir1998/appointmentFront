import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentsApiService } from '../../core/services/appointments-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Appointment } from '../../core/models/appointment.model';

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'Emily Carter',    clientPhone: '+1 555-1001', serviceId: '1', employeeId: '1', startTime: '2026-05-08T09:00:00', endTime: '2026-05-08T09:30:00', status: 'Confirmed',  notes: 'First visit, please prepare full intake forms',   organizationId: 'mock', createdAt: '2026-05-01T10:00:00', updatedAt: '2026-05-01T10:00:00' },
  { id: 'a2', clientName: 'Noah Williams',   clientPhone: '+1 555-1002', serviceId: '2', employeeId: '2', startTime: '2026-05-08T10:00:00', endTime: '2026-05-08T10:45:00', status: 'Pending',    notes: undefined,                                          organizationId: 'mock', createdAt: '2026-05-02T08:30:00', updatedAt: '2026-05-02T08:30:00' },
  { id: 'a3', clientName: 'Sophia Martinez', clientPhone: '+1 555-1003', serviceId: '3', employeeId: '3', startTime: '2026-05-08T11:30:00', endTime: '2026-05-08T11:45:00', status: 'Completed',  notes: 'Follow-up required in 2 weeks',                   organizationId: 'mock', createdAt: '2026-05-02T14:00:00', updatedAt: '2026-05-02T14:00:00' },
  { id: 'a4', clientName: 'Liam Johnson',    clientPhone: '+1 555-1004', serviceId: '4', employeeId: '4', startTime: '2026-05-08T13:00:00', endTime: '2026-05-08T14:00:00', status: 'Confirmed',  notes: undefined,                                          organizationId: 'mock', createdAt: '2026-05-03T09:15:00', updatedAt: '2026-05-03T09:15:00' },
  { id: 'a5', clientName: 'Olivia Brown',    clientPhone: '+1 555-1005', serviceId: '5', employeeId: '1', startTime: '2026-05-08T14:30:00', endTime: '2026-05-08T14:40:00', status: 'Cancelled',  notes: 'Client requested cancellation',                   organizationId: 'mock', createdAt: '2026-05-03T11:00:00', updatedAt: '2026-05-04T09:00:00' },
  { id: 'a6', clientName: 'James Lee',       clientPhone: '+1 555-1006', serviceId: '6', employeeId: '7', startTime: '2026-05-09T09:30:00', endTime: '2026-05-09T10:10:00', status: 'Pending',    notes: 'Referred by Dr. Wilson',                           organizationId: 'mock', createdAt: '2026-05-04T16:00:00', updatedAt: '2026-05-04T16:00:00' },
  { id: 'a7', clientName: 'Ava Thompson',    clientPhone: '+1 555-1007', serviceId: '1', employeeId: '6', startTime: '2026-05-09T11:00:00', endTime: '2026-05-09T11:30:00', status: 'Confirmed',  notes: undefined,                                          organizationId: 'mock', createdAt: '2026-05-05T10:30:00', updatedAt: '2026-05-05T10:30:00' },
  { id: 'a8', clientName: 'Mason Clark',     clientPhone: '+1 555-1008', serviceId: '3', employeeId: '3', startTime: '2026-05-09T14:00:00', endTime: '2026-05-09T14:15:00', status: 'Completed',  notes: 'Patient reported improvement',                     organizationId: 'mock', createdAt: '2026-05-05T13:00:00', updatedAt: '2026-05-05T13:00:00' },
];

@Component({
  selector: 'app-appointment-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})
export class AppointmentList implements OnInit {
  private readonly api = inject(AppointmentsApiService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);

  appointments = signal<Appointment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  deleteTarget = signal<Appointment | null>(null);
  deleteLoading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.appointments.set(MOCK_APPOINTMENTS);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.appointments.set(data.length ? data : MOCK_APPOINTMENTS);
        this.loading.set(false);
      },
      error: () => {
        this.appointments.set(MOCK_APPOINTMENTS);
        this.loading.set(false);
      },
    });
  }

  edit(appt: Appointment): void {
    this.router.navigate(['/appointments', appt.id, 'edit']);
  }

  openDeleteModal(appt: Appointment): void {
    this.deleteTarget.set(appt);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.deleteLoading.set(true);
    this.api.delete(target.id).subscribe({
      next: () => {
        this.appointments.update((list) => list.filter((a) => a.id !== target.id));
        this.deleteTarget.set(null);
        this.deleteLoading.set(false);
      },
      error: () => {
        this.deleteLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard', this.orgContext.currentOrgId()]);
  }
}
