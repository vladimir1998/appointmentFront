import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { PermissionsApiService, Permission } from '../../core/services/permissions-api.service';

interface PermissionGroup {
  module: string;
  perms: Permission[];
}

@Component({
  selector: 'app-position-form',
  imports: [FormsModule],
  templateUrl: './position-form.html',
  styleUrl: './position-form.scss',
})
export class PositionForm implements OnInit {
  private readonly api = inject(PositionsApiService);
  private readonly permissionsApi = inject(PermissionsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  positionId: string | null = null;

  name = '';
  selectedPermissions = signal<Set<string>>(new Set());

  permissions = signal<Permission[]>([]);
  permissionsLoading = signal(false);

  loading = signal(false);
  fetchLoading = signal(false);
  error = signal<string | null>(null);

  groupedPermissions = computed<PermissionGroup[]>(() => {
    const groups = new Map<string, Permission[]>();
    for (const perm of this.permissions()) {
      const module = perm.value.split(':')[0];
      if (!groups.has(module)) groups.set(module, []);
      groups.get(module)!.push(perm);
    }
    return Array.from(groups.entries()).map(([module, perms]) => ({ module, perms }));
  });

  ngOnInit(): void {
    this.positionId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.positionId;

    this.permissionsLoading.set(true);
    this.permissionsApi.getAll().subscribe({
      next: (data) => {
        this.permissions.set(data);
        this.permissionsLoading.set(false);
      },
      error: () => this.permissionsLoading.set(false),
    });

    if (this.isEdit && this.positionId) {
      this.fetchLoading.set(true);
      this.api.getById(this.positionId).subscribe({
        next: (position) => {
          this.name = position.name;
          const ids = (position.permissions as any[]).map((p: any) =>
            typeof p === 'string' ? p : p.id
          );
          this.selectedPermissions.set(new Set(ids));
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load position');
          this.fetchLoading.set(false);
        },
      });
    }
  }

  isChecked(id: string): boolean {
    return this.selectedPermissions().has(id);
  }

  togglePermission(id: string): void {
    const next = new Set(this.selectedPermissions());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedPermissions.set(next);
  }

  isModuleAllChecked(perms: Permission[]): boolean {
    return perms.every(p => this.selectedPermissions().has(p.id));
  }

  toggleModule(perms: Permission[]): void {
    const allChecked = this.isModuleAllChecked(perms);
    const next = new Set(this.selectedPermissions());
    perms.forEach(p => allChecked ? next.delete(p.id) : next.add(p.id));
    this.selectedPermissions.set(next);
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const permissions = Array.from(this.selectedPermissions());

    const request$ = this.isEdit
      ? this.api.update(this.positionId!, { name: this.name, permissions })
      : this.api.create({
          name: this.name,
          permissions,
          organizationId: this.orgContext.currentOrgId()!,
        });

    request$.subscribe({
      next: () => this.router.navigate(['/admin/positions']),
      error: () => {
        this.error.set('Failed to save position');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/positions']);
  }
}
