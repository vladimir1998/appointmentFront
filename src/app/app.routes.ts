import { Routes } from '@angular/router';
import { orgGuard } from './core/guards/org.guard';
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
import { EmployeeList } from './employees/employee-list/employee-list';
import { EmployeeDetail } from './employees/employee-detail/employee-detail';
import { AdminInvite } from './admin/invite/admin-invite';
import { AdminUserList } from './admin/user-list/admin-user-list';
import { AdminInviteList } from './admin/invite-list/admin-invite-list';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminSpecialtyList } from './admin/specialty-list/admin-specialty-list';
import { AdminSpecialtyForm } from './admin/specialty-form/admin-specialty-form';
import { AdminAppointmentList } from './admin/appointment-list/admin-appointment-list';
import { Components } from './components/components';
import { Example } from './example/example';
import { ServiceCatalog } from './catalog/service-catalog';
import { ServiceDetail } from './services/service-detail/service-detail';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [orgGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'invite', component: AdminInvite },
      { path: 'invites', component: AdminInviteList },
      { path: 'users', component: AdminUserList },
      { path: 'employees', component: AdminEmployeeList },
      { path: 'employees/create', component: AdminEmployeeForm },
      { path: 'employees/:id/edit', component: AdminEmployeeForm },
      { path: 'services', component: AdminServiceList },
      { path: 'services/create', component: AdminServiceForm },
      { path: 'services/:id/edit', component: AdminServiceForm },
      { path: 'positions', component: AdminPositionList },
      { path: 'positions/create', component: AdminPositionForm },
      { path: 'positions/:id/edit', component: AdminPositionForm },
      { path: 'specialties', component: AdminSpecialtyList },
      { path: 'specialties/create', component: AdminSpecialtyForm },
      { path: 'specialties/:id/edit', component: AdminSpecialtyForm },
      { path: 'appointments', component: AdminAppointmentList },
    ],
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'organizations', component: OrganizationList },
      { path: 'organizations/create', component: OrganizationCreate },
      { path: 'dashboard/:orgId', component: Dashboard },
      { path: 'services', component: ServiceCatalog, canActivate: [orgGuard] },
      { path: 'services/:id', component: ServiceDetail, canActivate: [orgGuard] },
      { path: 'employees', component: EmployeeList, canActivate: [orgGuard] },
      { path: 'employees/:id', component: EmployeeDetail, canActivate: [orgGuard] },
      { path: 'components', component: Components },
      { path: 'example', component: Example },
      { path: 'appointments', component: AppointmentList, canActivate: [orgGuard] },
      { path: 'appointments/create', component: AppointmentForm, canActivate: [orgGuard] },
      { path: 'appointments/:id/edit', component: AppointmentForm, canActivate: [orgGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
