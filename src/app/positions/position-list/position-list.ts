import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Position } from '../../core/models/position.model';

const MOCK_POSITIONS: Position[] = [
  { id: 'p1', name: 'Cardiologist',         permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'appointments.edit', name: 'appointments.edit', value: 'appointments.edit' }, { id: 'services.view', name: 'services.view', value: 'services.view' }], organizationId: 'mock' },
  { id: 'p2', name: 'Dermatologist',        permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'appointments.edit', name: 'appointments.edit', value: 'appointments.edit' }, { id: 'services.view', name: 'services.view', value: 'services.view' }], organizationId: 'mock' },
  { id: 'p3', name: 'Neurologist',          permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'appointments.edit', name: 'appointments.edit', value: 'appointments.edit' }, { id: 'services.view', name: 'services.view', value: 'services.view' }], organizationId: 'mock' },
  { id: 'p4', name: 'Pediatrician',         permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'appointments.edit', name: 'appointments.edit', value: 'appointments.edit' }, { id: 'services.view', name: 'services.view', value: 'services.view' }], organizationId: 'mock' },
  { id: 'p5', name: 'General Practitioner', permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'appointments.edit', name: 'appointments.edit', value: 'appointments.edit' }, { id: 'services.view', name: 'services.view', value: 'services.view' }, { id: 'employees.view', name: 'employees.view', value: 'employees.view' }], organizationId: 'mock' },
  { id: 'p6', name: 'Nurse',                permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'services.view', name: 'services.view', value: 'services.view' }], organizationId: 'mock' },
  { id: 'p7', name: 'Receptionist',         permissions: [{ id: 'appointments.view', name: 'appointments.view', value: 'appointments.view' }, { id: 'appointments.create', name: 'appointments.create', value: 'appointments.create' }, { id: 'clients.view', name: 'clients.view', value: 'clients.view' }], organizationId: 'mock' },
];

@Component({
  selector: 'app-position-list',
  imports: [RouterLink],
  templateUrl: './position-list.html',
  styleUrl: './position-list.scss',
})
export class PositionList implements OnInit {
  private readonly api = inject(PositionsApiService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly router = inject(Router);

  positions = signal<Position[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  deleteTarget = signal<Position | null>(null);
  deleteLoading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const orgId = this.orgContext.currentOrgId();
    if (!orgId) {
      this.positions.set(MOCK_POSITIONS);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.positions.set(data.length ? data : MOCK_POSITIONS);
        this.loading.set(false);
      },
      error: () => {
        this.positions.set(MOCK_POSITIONS);
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard', this.orgContext.currentOrgId()]);
  }

  edit(position: Position): void {
    this.router.navigate(['/admin/positions', position.id, 'edit']);
  }

  openDeleteModal(position: Position): void {
    this.deleteTarget.set(position);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.deleteLoading.set(true);
    this.api.delete(target.id).subscribe({
      next: () => {
        this.positions.update((list) => list.filter((p) => p.id !== target.id));
        this.deleteTarget.set(null);
        this.deleteLoading.set(false);
      },
      error: () => {
        this.deleteLoading.set(false);
      },
    });
  }
}
