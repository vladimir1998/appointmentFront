import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrganizationService } from '../../core/services/organization.service';
import { Organization } from '../../core/models/organization.model';


@Component({
  selector: 'app-organization-list',
  imports: [RouterLink],
  templateUrl: './organization-list.html',
  styleUrl: './organization-list.scss',
})
export class OrganizationList implements OnInit {
  private readonly organizationService = inject(OrganizationService);
  private readonly router = inject(Router);

  organizations = signal<Organization[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.organizationService.getAll().subscribe({
      next: (data) => {
        this.organizations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load organizations');
        this.loading.set(false);
      },
    });
  }

  selectOrganization(org: Organization): void {
    this.router.navigate(['/dashboard', org.id]);
  }
}
