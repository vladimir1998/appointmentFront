import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
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
import { AppointmentList } from './appointments/appointment-list/appointment-list';
import { AppointmentForm } from './appointments/appointment-form/appointment-form';
import { Components } from './components/components';
import { Example } from './example/example';
import { ServiceCatalog } from './catalog/service-catalog';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'components', component: Components },
      { path: 'example', component: Example },
      { path: 'catalog', component: ServiceCatalog },
      { path: 'dashboard/:orgId', component: Dashboard },
      { path: 'organizations', component: OrganizationList },
      { path: 'organizations/create', component: OrganizationCreate },
      { path: 'services', component: ServiceList },
      { path: 'services/create', component: ServiceForm },
      { path: 'services/:id/edit', component: ServiceForm },
      { path: 'employees', component: EmployeeList },
      { path: 'employees/create', component: EmployeeForm },
      { path: 'employees/:id/edit', component: EmployeeForm },
      { path: 'positions', component: PositionList },
      { path: 'positions/create', component: PositionForm },
      { path: 'positions/:id/edit', component: PositionForm },
      { path: 'appointments', component: AppointmentList },
      { path: 'appointments/create', component: AppointmentForm },
      { path: 'appointments/:id/edit', component: AppointmentForm },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
