import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Register } from './register/register';
import { OrganizationList } from './organizations/organization-list/organization-list';
import { OrganizationCreate } from './organizations/organization-create/organization-create';
import { AdminEmployeeList } from './admin/employee-list/admin-employee-list';
import { AdminEmployeeForm } from './admin/employee-form/admin-employee-form';
import { AdminServiceList } from './admin/service-list/admin-service-list';
import { AdminServiceForm } from './admin/service-form/admin-service-form';
import { AdminPositionList } from './admin/position-list/admin-position-list';
import { AdminPositionForm } from './admin/position-form/admin-position-form';
import { AppointmentList } from './appointments/appointment-list/appointment-list';
import { AppointmentForm } from './appointments/appointment-form/appointment-form';
import { EmployeeList } from './users/user-list/user-list';
import { EmployeeDetail } from './users/user-detail/user-detail';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Components } from './components/components';
import { Example } from './example/example';
import { ServiceCatalog } from './catalog/service-catalog';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'employees', component: AdminEmployeeList },
      { path: 'employees/create', component: AdminEmployeeForm },
      { path: 'employees/:id/edit', component: AdminEmployeeForm },
      { path: 'services', component: AdminServiceList },
      { path: 'services/create', component: AdminServiceForm },
      { path: 'services/:id/edit', component: AdminServiceForm },
      { path: 'positions', component: AdminPositionList },
      { path: 'positions/create', component: AdminPositionForm },
      { path: 'positions/:id/edit', component: AdminPositionForm },
    ],
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'components', component: Components },
      { path: 'example', component: Example },
      { path: 'services', component: ServiceCatalog },
      { path: 'dashboard/:orgId', component: Dashboard },
      { path: 'organizations', component: OrganizationList },
      { path: 'organizations/create', component: OrganizationCreate },
      { path: 'employees', component: EmployeeList },
      { path: 'employees/:id', component: EmployeeDetail },
      { path: 'appointments', component: AppointmentList },
      { path: 'appointments/create', component: AppointmentForm },
      { path: 'appointments/:id/edit', component: AppointmentForm },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
