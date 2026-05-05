import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OrganizationContextService } from '../services/organization-context.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const orgContext = inject(OrganizationContextService);

  const token = authService.getAccessToken();
  const orgId = orgContext.currentOrgId();

  let outReq = req;
  if (token || orgId) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (orgId) headers['X-Organization-Id'] = orgId;
    outReq = req.clone({ setHeaders: headers });
  }

  return next(outReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return authService.refresh().pipe(
          switchMap((res) => {
            const retryHeaders: Record<string, string> = {
              Authorization: `Bearer ${res.access_token}`,
            };
            if (orgId) retryHeaders['X-Organization-Id'] = orgId;
            return next(req.clone({ setHeaders: retryHeaders }));
          }),
          catchError((refreshError) => throwError(() => refreshError))
        );
      }
      return throwError(() => error);
    })
  );
};
