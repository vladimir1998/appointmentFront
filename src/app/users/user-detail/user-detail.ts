import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Employee } from '../../core/models/employee.model';
import { MOCK_EMPLOYEES } from '../../employees/employee-list/employee-list.mock';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class EmployeeDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  user = signal<Employee | null>(null);
  safeAbout = signal<SafeHtml[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = MOCK_EMPLOYEES.find(e => e.id === id) ?? null;
    this.user.set(found);
    this.safeAbout.set(
      (found?.about ?? []).map(b => this.sanitizer.bypassSecurityTrustHtml(b))
    );
  }

  back(): void {
    this.router.navigate(['/employees']);
  }

  initials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
  });
}
