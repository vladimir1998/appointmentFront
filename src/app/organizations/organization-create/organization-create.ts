import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from '../../core/services/organization.service';

@Component({
  selector: 'app-organization-create',
  imports: [FormsModule],
  templateUrl: './organization-create.html',
  styleUrl: './organization-create.scss',
})
export class OrganizationCreate {
  private readonly organizationService = inject(OrganizationService);
  private readonly router = inject(Router);

  name = '';
  description = '';
  logo = '';
  error = signal<string | null>(null);
  loading = signal(false);

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const payload = {
      name: this.name,
      ...(this.description && { description: this.description }),
      ...(this.logo && { logo: this.logo }),
    };

    this.organizationService.create(payload).subscribe({
      next: () => this.router.navigate(['/organizations']),
      error: () => {
        this.error.set('Не удалось создать организацию');
        this.loading.set(false);
      },
    });
  }
}
