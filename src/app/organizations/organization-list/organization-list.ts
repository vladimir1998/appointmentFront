import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrganizationService } from '../../core/services/organization.service';
import { Organization } from '../../core/models/organization.model';

const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'mock-1', name: 'MedCRM Clinic',         description: 'Full-service outpatient clinic offering consultations, diagnostics and preventive care', logo: undefined },
  { id: 'mock-2', name: 'City Medical Center',   description: 'Multi-specialty medical center serving the downtown area since 2010',                   logo: undefined },
  { id: 'mock-3', name: 'Family Health Hub',     description: 'Primary care and family medicine practice focused on long-term patient relationships',   logo: undefined },
];

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
        this.organizations.set(data.length ? data : MOCK_ORGANIZATIONS);
        this.loading.set(false);
      },
      error: () => {
        this.organizations.set(MOCK_ORGANIZATIONS);
        this.loading.set(false);
      },
    });
  }

  selectOrganization(org: Organization): void {
    this.router.navigate(['/dashboard', org.id]);
  }
}
