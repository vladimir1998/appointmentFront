import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { OrganizationList } from './organizations/organization-list/organization-list';
import { OrganizationCreate } from './organizations/organization-create/organization-create';
import { ServiceList } from './services/service-list/service-list';
import { ServiceForm } from './services/service-form/service-form';
import { EmployeeList } from './employees/employee-list/employee-list';
import { EmployeeForm } from './employees/employee-form/employee-form';
import { PositionList } from './positions/position-list/position-list';
import { PositionForm } from './positions/position-form/position-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard/:orgId', component: Dashboard },
  { path: 'organizations', component: OrganizationList },
  { path: 'organizations/create', component: OrganizationCreate },
  { path: 'services', component: ServiceList },
  { path: 'services/create', component: ServiceForm },
  { path: 'services/:id/edit', component: ServiceForm },
  { path: 'employees', component: EmployeeList },
  { path: 'employees/create', component: EmployeeForm },
  { path: 'positions', component: PositionList },
  { path: 'positions/create', component: PositionForm },
  { path: 'positions/:id/edit', component: PositionForm },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
