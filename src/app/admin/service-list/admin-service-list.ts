import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Service } from '../../core/models/service.model';
import { MOCK_SERVICES } from '../../core/mocks/mock-services';
import { MOCK_EMPLOYEES } from '../../core/mocks/mock-employees';

@Component({
  selector: 'app-admin-service-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './admin-service-list.html',
  styleUrl: './admin-service-list.scss',
})
export class AdminServiceList implements OnInit {
  private readonly api = inject(ServicesApiService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);

  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  deleteTarget = signal<Service | null>(null);
  deleteLoading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.services.set(MOCK_SERVICES);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.services.set(data.length ? data : MOCK_SERVICES);
        this.loading.set(false);
      },
      error: () => {
        this.services.set(MOCK_SERVICES);
        this.loading.set(false);
      },
    });
  }

  employeesFor(service: Service) {
    return service.employee?.length
      ? service.employee
      : MOCK_EMPLOYEES.filter(e => e.services?.some(s => s.id === service.id));
  }

  initials(firstName: string, lastName: string): string {
    return (firstName[0] ?? '') + (lastName[0] ?? '');
  }

  formatDuration(min: number, max?: number): string {
    if (max) return `${min}–${max} min`;
    return `${min} min`;
  }

  edit(service: Service): void {
    this.router.navigate(['/admin/services', service.id, 'edit']);
  }

  openDeleteModal(service: Service): void {
    this.deleteTarget.set(service);
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
        this.services.update(list => list.filter(s => s.id !== target.id));
        this.deleteTarget.set(null);
        this.deleteLoading.set(false);
      },
      error: () => {
        this.services.update(list => list.filter(s => s.id !== target.id));
        this.deleteTarget.set(null);
        this.deleteLoading.set(false);
      },
    });
  }
}
