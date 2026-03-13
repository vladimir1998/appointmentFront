import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentsApiService } from '../../core/services/appointments-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Appointment } from '../../core/models/appointment.model';

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
    if (!orgId) return;

    this.loading.set(true);
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить список заказов');
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
