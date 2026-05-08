import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Employee } from '../../core/models/employee.model';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #fcd34d, #b45309)',
  'linear-gradient(135deg, #6ee7b7, #047857)',
  'linear-gradient(135deg, #c4b5fd, #6d28d9)',
  'linear-gradient(135deg, #fda4af, #be123c)',
  'linear-gradient(135deg, #93c5fd, #1d4ed8)',
  'linear-gradient(135deg, #f9a8d4, #be185d)',
  'linear-gradient(135deg, #fdba74, #c2410c)',
];

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', firstName: 'James',  lastName: 'Wilson',  phone: '+1 555-0101', role: 'EMPLOYEE', isActive: true,  userId: 'm1', organizationId: 'mock', positionId: 'p1', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm1', email: 'j.wilson@medcrm.com'  }, position: { id: 'p1', name: 'Cardiology',       organizationId: 'mock', permissions: [] } },
  { id: '2', firstName: 'Amara',  lastName: 'Okafor',  phone: '+1 555-0102', role: 'EMPLOYEE', isActive: true,  userId: 'm2', organizationId: 'mock', positionId: 'p2', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm2', email: 'a.okafor@medcrm.com'  }, position: { id: 'p2', name: 'Dermatology',      organizationId: 'mock', permissions: [] } },
  { id: '3', firstName: 'Raj',    lastName: 'Patel',   phone: '+1 555-0103', role: 'EMPLOYEE', isActive: true,  userId: 'm3', organizationId: 'mock', positionId: 'p3', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm3', email: 'r.patel@medcrm.com'   }, position: { id: 'p3', name: 'Neurology',        organizationId: 'mock', permissions: [] } },
  { id: '4', firstName: 'Lisa',   lastName: 'Park',    phone: '+1 555-0104', role: 'EMPLOYEE', isActive: true,  userId: 'm4', organizationId: 'mock', positionId: 'p4', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm4', email: 'l.park@medcrm.com'    }, position: { id: 'p4', name: 'Pediatrics',       organizationId: 'mock', permissions: [] } },
  { id: '5', firstName: 'Maria',  lastName: 'Santos',  phone: '+1 555-0105', role: 'EMPLOYEE', isActive: false, userId: 'm5', organizationId: 'mock', positionId: 'p5', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm5', email: 'm.santos@medcrm.com'  }, position: { id: 'p5', name: 'Orthopedics',      organizationId: 'mock', permissions: [] } },
  { id: '6', firstName: 'Henrik', lastName: 'Larsson', phone: '+1 555-0106', role: 'EMPLOYEE', isActive: true,  userId: 'm6', organizationId: 'mock', positionId: 'p6', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm6', email: 'h.larsson@medcrm.com' }, position: { id: 'p6', name: 'General Practice', organizationId: 'mock', permissions: [] } },
  { id: '7', firstName: 'Yuki',   lastName: 'Tanaka',  phone: '+1 555-0107', role: 'EMPLOYEE', isActive: true,  userId: 'm7', organizationId: 'mock', positionId: 'p1', createdAt: '', updatedAt: '', deletedAt: null, user: { id: 'm7', email: 'y.tanaka@medcrm.com'  }, position: { id: 'p1', name: 'Cardiology',       organizationId: 'mock', permissions: [] } },
];

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList implements OnInit {
  private readonly api = inject(EmployeesApiService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);

  employees = signal<Employee[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  searchQuery = signal('');
  selectedPosition = signal('');
  specDropdownOpen = signal(false);

  positions = computed(() =>
    [...new Set(
      this.employees().map(e => e.position?.name).filter(Boolean) as string[]
    )].sort()
  );

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const pos = this.selectedPosition();
    return this.employees().filter(e => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchQ = !q || fullName.includes(q) || (e.position?.name?.toLowerCase().includes(q) ?? false);
      const matchP = !pos || e.position?.name === pos;
      return matchQ && matchP;
    });
  });

  ngOnInit(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.employees.set(MOCK_EMPLOYEES);
      this.loading.set(false);
      return;
    }

    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.employees.set(data.length ? data : MOCK_EMPLOYEES);
        this.loading.set(false);
      },
      error: () => {
        this.employees.set(MOCK_EMPLOYEES);
        this.loading.set(false);
      },
    });
  }

  avatarGradient(index: number): string {
    return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  }

  initials(emp: Employee): string {
    return `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase();
  }

  selectPosition(pos: string): void {
    this.selectedPosition.set(pos);
    this.specDropdownOpen.set(false);
  }

  edit(emp: Employee): void {
    this.router.navigate(['/employees', emp.id, 'edit']);
  }
}
