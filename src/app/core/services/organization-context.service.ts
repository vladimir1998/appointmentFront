import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrganizationContextService {
  readonly currentOrgId = signal<string | null>(null);

  set(orgId: string): void {
    this.currentOrgId.set(orgId);
  }

  clear(): void {
    this.currentOrgId.set(null);
  }
}
