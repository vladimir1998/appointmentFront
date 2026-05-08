import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Service } from '../../core/models/service.model';

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Consultation',
    description: 'Initial doctor consultation, medical history review and diagnosis',
    photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=64&h=64&fit=crop',
    price: 2500,
    duration: 30,
    durationMax: undefined,
    organizationId: 'mock',
  },
  {
    id: '2',
    title: 'Teeth Cleaning',
    description: 'Professional ultrasonic teeth cleaning and polishing',
    photo: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=64&h=64&fit=crop',
    price: 4800,
    duration: 45,
    durationMax: 60,
    organizationId: 'mock',
  },
  {
    id: '3',
    title: 'ECG',
    description: 'Electrocardiogram with doctor interpretation',
    photo: undefined,
    price: 1200,
    duration: 15,
    durationMax: undefined,
    organizationId: 'mock',
  },
  {
    id: '4',
    title: 'Massage (back)',
    description: 'Therapeutic back massage — relaxing and restorative',
    photo: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=64&h=64&fit=crop',
    price: 3500,
    duration: 60,
    durationMax: 90,
    organizationId: 'mock',
  },
  {
    id: '5',
    title: 'Blood Test',
    description: 'Complete blood count with differential, basic metabolic panel',
    photo: undefined,
    price: 890,
    duration: 10,
    durationMax: undefined,
    organizationId: 'mock',
  },
  {
    id: '6',
    title: 'MRI (brain)',
    description: 'MRI brain scan with contrast, detailed radiologist report included',
    photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=64&h=64&fit=crop',
    price: 12000,
    duration: 40,
    durationMax: 60,
    organizationId: 'mock',
  },
];

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

  formatDuration(min: number, max?: number): string {
    if (max) return `${min}–${max} min`;
    return `${min} min`;
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
