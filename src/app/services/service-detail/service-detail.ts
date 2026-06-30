import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Service, PriceType } from '../../core/models/service.model';
import { Employee } from '../../core/models/employee.model';
import { ServicesApiService } from '../../core/services/services-api.service';
import { DetailCard } from '../../common/detail-card/detail-card';

@Component({
  selector: 'app-service-detail',
  imports: [DetailCard],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly api = inject(ServicesApiService);

  service = signal<Service | null>(null);
  safeAbout = signal<SafeHtml[]>([]);
  employees = signal<Employee[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Service not found');
      this.loading.set(false);
      return;
    }

    this.api.getById(id).subscribe({
      next: (service) => {
        this.service.set(service);
        this.safeAbout.set(
          (service.about ?? []).map(b => this.sanitizer.bypassSecurityTrustHtml(b))
        );
        this.employees.set(service.employees ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load service');
        this.loading.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/services']);
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

  formatDuration(min: number, max?: number): string {
    return max ? `${min}–${max} min` : `${min} min`;
  }

  empInitials(firstName: string | undefined, lastName: string | undefined): string {
    return ((firstName?.[0] ?? '') + (lastName?.[0] ?? '')).toUpperCase() || '?';
  }
}
