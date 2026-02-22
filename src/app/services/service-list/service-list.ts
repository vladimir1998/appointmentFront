import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-service-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceList implements OnInit {
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
    if (!orgId) return;

    this.loading.set(true);
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить список услуг');
        this.loading.set(false);
      },
    });
  }

  edit(service: Service): void {
    this.router.navigate(['/services', service.id, 'edit']);
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
        this.services.update((list) => list.filter((s) => s.id !== target.id));
        this.deleteTarget.set(null);
        this.deleteLoading.set(false);
      },
      error: () => {
        this.deleteLoading.set(false);
      },
    });
  }
}
