import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Position } from '../../core/models/position.model';

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
    if (!orgId) return;

    this.loading.set(true);
    this.api.getAll(orgId).subscribe({
      next: (data) => {
        this.positions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить должности');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard', this.orgContext.currentOrgId()]);
  }

  edit(position: Position): void {
    this.router.navigate(['/positions', position.id, 'edit']);
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
