import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicEmployee } from '../../core/models/employee.model';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { ServiceBadge } from '../../common/service-badge/service-badge';
import { DetailCard } from '../../common/detail-card/detail-card';
import { ScheduleSection } from '../../common/schedule-section/schedule-section';

@Component({
  selector: 'app-employee-detail',
  imports: [ServiceBadge, DetailCard, ScheduleSection],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss',
})
export class EmployeeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly employeesApi = inject(EmployeesApiService);
  private readonly orgContext = inject(OrganizationContextService);

  employee = signal<PublicEmployee | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  safeAbout = signal<SafeHtml[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const orgId = this.orgContext.currentOrgId();
    if (!id || !orgId) {
      this.error.set('Invalid parameters');
      return;
    }
    this.loading.set(true);
    this.employeesApi.getPublicById(orgId, id).subscribe({
      next: employee => {
        this.employee.set(employee);
        this.safeAbout.set(
          (employee.about ?? []).map(b => this.sanitizer.bypassSecurityTrustHtml(b))
        );
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message ?? 'Failed to load employee');
        this.loading.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/employees']);
  }

  specialtyNames = computed(() =>
    (this.employee()?.specialties ?? []).map(s => s.name).join(', ')
  );

  initials = computed(() => {
    const e = this.employee();
    if (!e) return '?';
    return `${e.firstName?.[0] ?? ''}${e.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  });
}
