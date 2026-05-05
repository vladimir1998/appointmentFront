import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import {
  PERMISSIONS_CONFIG,
  PermissionModule,
  permissionKey,
} from '../../core/config/permissions.config';

@Component({
  selector: 'app-position-form',
  imports: [FormsModule],
  templateUrl: './position-form.html',
  styleUrl: './position-form.scss',
})
export class PositionForm implements OnInit {
  private readonly api = inject(PositionsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  readonly permissionsConfig: PermissionModule[] = PERMISSIONS_CONFIG;
  readonly permissionKey = permissionKey;

  isEdit = false;
  positionId: string | null = null;

  name = '';
  selectedPermissions = signal<Set<string>>(new Set());

  loading = signal(false);
  fetchLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.positionId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.positionId;

    if (this.isEdit && this.positionId) {
      this.fetchLoading.set(true);
      this.api.getById(this.positionId).subscribe({
        next: (position) => {
          this.name = position.name;
          this.selectedPermissions.set(new Set(position.permissions));
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Не удалось загрузить должность');
          this.fetchLoading.set(false);
        },
      });
    }
  }

  isChecked(moduleKey: string, actionKey: string): boolean {
    return this.selectedPermissions().has(permissionKey(moduleKey, actionKey));
  }

  togglePermission(moduleKey: string, actionKey: string): void {
    const key = permissionKey(moduleKey, actionKey);
    const next = new Set(this.selectedPermissions());
    next.has(key) ? next.delete(key) : next.add(key);
    this.selectedPermissions.set(next);
  }

  isModuleAllChecked(mod: PermissionModule): boolean {
    return mod.actions.every((a) =>
      this.selectedPermissions().has(permissionKey(mod.key, a.key))
    );
  }

  toggleModule(mod: PermissionModule): void {
    const allChecked = this.isModuleAllChecked(mod);
    const next = new Set(this.selectedPermissions());
    mod.actions.forEach((a) => {
      const key = permissionKey(mod.key, a.key);
      allChecked ? next.delete(key) : next.add(key);
    });
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
      next: () => this.router.navigate(['/positions']),
      error: () => {
        this.error.set('Не удалось сохранить должность');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
