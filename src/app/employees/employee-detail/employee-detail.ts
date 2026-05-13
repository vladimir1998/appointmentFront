import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Employee } from '../../core/models/employee.model';
import { MOCK_EMPLOYEES } from '../../core/mocks/mock-employees';
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

  employee = signal<Employee | null>(null);
  safeAbout = signal<SafeHtml[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = MOCK_EMPLOYEES.find(e => e.id === id) ?? null;
    this.employee.set(found);
    this.safeAbout.set(
      (found?.about ?? []).map(b => this.sanitizer.bypassSecurityTrustHtml(b))
    );
  }

  back(): void {
    this.router.navigate(['/employees']);
  }

  initials = computed(() => {
    const e = this.employee();
    if (!e) return '?';
    return `${e.firstName[0]}${e.lastName[0]}`.toUpperCase();
  });
}
