import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Service, PriceType } from '../core/models/service.model';
import { ServicesApiService } from '../core/services/services-api.service';
import { OrganizationContextService } from '../core/services/organization-context.service';

@Component({
  selector: 'app-service-catalog',
  imports: [DecimalPipe],
  templateUrl: './service-catalog.html',
  styleUrl: './service-catalog.scss',
})
export class ServiceCatalog implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(ServicesApiService);
  private readonly orgContext = inject(OrganizationContextService);

  search = signal('');
  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.services();
    return this.services().filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.error.set('No organization selected');
      this.loading.set(false);
      return;
    }
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load services');
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  view(s: Service): void {
    this.router.navigate(['/services', s.id]);
  }

  formatDuration(min: number, max?: number): string {
    return max ? `${min}–${max} min` : `${min} min`;
  }

  formatPrice(s: Service): string {
    if (s.price == null) return 'By agreement';
    const fmt = (v: number) => v.toLocaleString('ru-RU');
    switch (s.priceType as PriceType) {
      case 'approximate': return `~${fmt(s.price)} ₽`;
      case 'from':        return `from ${fmt(s.price)} ₽`;
      case 'range':       return s.priceMax != null
                            ? `${fmt(s.price)} – ${fmt(s.priceMax)} ₽`
                            : `from ${fmt(s.price)} ₽`;
      default:            return `${fmt(s.price)} ₽`;
    }
  }
}
