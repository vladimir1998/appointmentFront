import { Injectable, signal } from '@angular/core';

const ORG_ID_KEY = 'org_id';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function loadOrgId(): string | null {
  const id = localStorage.getItem(ORG_ID_KEY);
  if (id && UUID_RE.test(id)) return id;
  if (id) localStorage.removeItem(ORG_ID_KEY);
  return null;
}

@Injectable({ providedIn: 'root' })
export class OrganizationContextService {
  readonly currentOrgId = signal<string | null>(loadOrgId());

  set(orgId: string): void {
    localStorage.setItem(ORG_ID_KEY, orgId);
    this.currentOrgId.set(orgId);
  }

  clear(): void {
    localStorage.removeItem(ORG_ID_KEY);
    this.currentOrgId.set(null);
  }
}
