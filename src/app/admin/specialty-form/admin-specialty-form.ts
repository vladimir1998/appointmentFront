import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialtyApiService } from '../../core/services/specialty-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';

@Component({
  selector: 'app-admin-specialty-form',
  imports: [FormsModule],
  templateUrl: './admin-specialty-form.html',
  styleUrl: './admin-specialty-form.scss',
})
export class AdminSpecialtyForm implements OnInit {
  private readonly api = inject(SpecialtyApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  specialtyId: string | null = null;

  name = '';

  loading = signal(false);
  fetchLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.specialtyId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.specialtyId;

    if (this.isEdit && this.specialtyId) {
      this.fetchLoading.set(true);
      this.api.getById(this.specialtyId).subscribe({
        next: (sp) => {
          this.name = sp.name;
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load specialty');
          this.fetchLoading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const request$ = this.isEdit
      ? this.api.update(this.specialtyId!, { name: this.name })
      : this.api.create({
          name: this.name,
          organizationId: this.orgContext.currentOrgId() ?? undefined,
        });

    request$.subscribe({
      next: () => this.router.navigate(['/admin/specialties']),
      error: () => {
        this.error.set('Failed to save specialty');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/specialties']);
  }
}
