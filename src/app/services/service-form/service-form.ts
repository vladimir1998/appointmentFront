import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';

@Component({
  selector: 'app-service-form',
  imports: [FormsModule],
  templateUrl: './service-form.html',
  styleUrl: './service-form.scss',
})
export class ServiceForm implements OnInit {
  private readonly api = inject(ServicesApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  serviceId: string | null = null;

  title = '';
  description = '';
  photo = '';
  price: number | null = null;
  duration: number | null = null;
  durationMax: number | null = null;

  loading = signal(false);
  fetchLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.serviceId;

    if (this.isEdit && this.serviceId) {
      this.fetchLoading.set(true);
      this.api.getById(this.serviceId).subscribe({
        next: (service) => {
          this.title = service.title;
          this.description = service.description;
          this.photo = service.photo ?? '';
          this.price = service.price;
          this.duration = service.duration;
          this.durationMax = service.durationMax ?? null;
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Не удалось загрузить услугу');
          this.fetchLoading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const base = {
      title: this.title,
      description: this.description,
      ...(this.photo && { photo: this.photo }),
      price: this.price!,
      duration: this.duration!,
      ...(this.durationMax != null && { durationMax: this.durationMax }),
    };

    const request$ = this.isEdit
      ? this.api.update(this.serviceId!, base)
      : this.api.create({ ...base, organizationId: this.orgContext.currentOrgId()! });

    request$.subscribe({
      next: () => this.router.navigate(['/services']),
      error: () => {
        this.error.set('Не удалось сохранить услугу');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/services']);
  }
}
