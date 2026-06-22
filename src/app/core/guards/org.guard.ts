import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OrganizationContextService } from '../services/organization-context.service';

export const orgGuard: CanActivateFn = () => {
  const orgContext = inject(OrganizationContextService);
  const router = inject(Router);

  if (orgContext.currentOrgId()) {
    return true;
  }

  return router.createUrlTree(['/organizations']);
};
