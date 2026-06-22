import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { htmlEditButton } from 'quill-html-edit-button';

Quill.register('modules/htmlEditButton', htmlEditButton);
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { SpecialtyApiService } from '../../core/services/specialty-api.service';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { InviteApiService } from '../../core/services/invite-api.service';
import { Position } from '../../core/models/position.model';
import { Specialty } from '../../core/models/specialty.model';
import { User } from '../../core/models/user.model';
import { MOCK_EMPLOYEES } from '../../core/mocks/mock-employees';
import { Service } from '../../core/models/service.model';
import { InputComponent } from '../../common/input/input.component';
import { TextareaComponent } from '../../common/textarea/textarea.component';
import { ImageUrlPickerComponent } from '../../common/image-url-picker/image-url-picker.component';
import { AboutBlock } from '../../common/about-block/about-block';
import { WorkScheduleEntry, DayOfWeek } from '../../core/models/employee.model';

export const DAYS_OF_WEEK: { day: DayOfWeek; label: string }[] = [
  { day: 'monday',    label: 'Monday' },
  { day: 'tuesday',   label: 'Tuesday' },
  { day: 'wednesday', label: 'Wednesday' },
  { day: 'thursday',  label: 'Thursday' },
  { day: 'friday',    label: 'Friday' },
  { day: 'saturday',  label: 'Saturday' },
  { day: 'sunday',    label: 'Sunday' },
];

const DEFAULT_SCHEDULE: WorkScheduleEntry[] = DAYS_OF_WEEK.map(({ day }) => ({
  day,
  isWorking: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day),
  intervals: [{ startTime: '09:00', endTime: '18:00' }],
}));

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #fcd34d, #b45309)',
  'linear-gradient(135deg, #6ee7b7, #047857)',
  'linear-gradient(135deg, #c4b5fd, #6d28d9)',
  'linear-gradient(135deg, #fda4af, #be123c)',
  'linear-gradient(135deg, #93c5fd, #1d4ed8)',
  'linear-gradient(135deg, #f9a8d4, #be185d)',
  'linear-gradient(135deg, #fdba74, #c2410c)',
];

const MOCK_POSITIONS: Position[] = [
  { id: 'p1', name: 'Cardiologist',         permissions: [], organizationId: 'mock' },
  { id: 'p2', name: 'Dermatologist',        permissions: [], organizationId: 'mock' },
  { id: 'p3', name: 'Neurologist',          permissions: [], organizationId: 'mock' },
  { id: 'p4', name: 'Pediatrician',         permissions: [], organizationId: 'mock' },
  { id: 'p5', name: 'General Practitioner', permissions: [], organizationId: 'mock' },
  { id: 'p6', name: 'Nurse',                permissions: [], organizationId: 'mock' },
  { id: 'p7', name: 'Receptionist',         permissions: [], organizationId: 'mock' },
];

export const QUILL_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
  htmlEditButton: {
    debug: false,
    msg: 'Edit HTML',
    okText: 'Ok',
    cancelText: 'Cancel',
    buttonHTML: '&lt;&gt;',
    buttonTitle: 'Edit HTML source',
    syntax: false,
  },
};

@Component({
  selector: 'app-admin-employee-form',
  imports: [FormsModule, RouterLink, InputComponent, TextareaComponent, ImageUrlPickerComponent, QuillModule, AboutBlock],
  templateUrl: './admin-employee-form.html',
  styleUrl: './admin-employee-form.scss',
})
export class AdminEmployeeForm implements OnInit {
  private readonly api = inject(EmployeesApiService);
  private readonly positionsApi = inject(PositionsApiService);
  private readonly specialtyApi = inject(SpecialtyApiService);
  private readonly servicesApi = inject(ServicesApiService);
  private readonly inviteApi = inject(InviteApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  employeeId: string | null = null;
  linkedUser: User | null = null;

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  photo = '';
  description = '';
  about: string[] = [''];
  education: string[] = [''];
  certificates: string[] = [''];
  workSchedule: WorkScheduleEntry[] = DEFAULT_SCHEDULE.map(e => ({ ...e }));
  readonly daysOfWeek = DAYS_OF_WEEK;
  experienceYears: number | null = null;
  isActive = true;
  isPublic = false;
  positionId = '';

  readonly quillModules = QUILL_MODULES;

  positions = signal<Position[]>([]);
  positionsLoading = signal(false);
  fetchLoading = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  users = signal<User[]>([]);
  userSearch = signal('');
  userDropdownOpen = signal(false);

  services = signal<Service[]>([]);
  servicesLoading = signal(false);
  selectedServices: Service[] = [];
  serviceSearch = signal('');
  serviceDropdownOpen = signal(false);

  specialties = signal<Specialty[]>([]);
  specialtiesLoading = signal(false);
  selectedSpecialties: Specialty[] = [];
  specialtySearch = signal('');
  specialtyDropdownOpen = signal(false);

  filteredServices = computed(() => {
    const q = this.serviceSearch().toLowerCase();
    if (!q) return this.services();
    return this.services().filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  filteredSpecialties = computed(() => {
    const q = this.specialtySearch().toLowerCase();
    if (!q) return this.specialties();
    return this.specialties().filter(s => s.name.toLowerCase().includes(q));
  });

  isServiceSelected(svc: Service): boolean {
    return this.selectedServices.some(s => s.id === svc.id);
  }

  toggleService(svc: Service): void {
    if (this.isServiceSelected(svc)) {
      this.selectedServices = this.selectedServices.filter(s => s.id !== svc.id);
    } else {
      this.selectedServices = [...this.selectedServices, svc];
    }
  }

  removeService(svc: Service): void {
    this.selectedServices = this.selectedServices.filter(s => s.id !== svc.id);
  }

  isSpecialtySelected(sp: Specialty): boolean {
    return this.selectedSpecialties.some(s => s.id === sp.id);
  }

  toggleSpecialty(sp: Specialty): void {
    if (this.isSpecialtySelected(sp)) {
      this.selectedSpecialties = this.selectedSpecialties.filter(s => s.id !== sp.id);
    } else {
      this.selectedSpecialties = [...this.selectedSpecialties, sp];
    }
  }

  removeSpecialty(sp: Specialty): void {
    this.selectedSpecialties = this.selectedSpecialties.filter(s => s.id !== sp.id);
  }

  filteredUsers = computed(() => {
    const q = this.userSearch().toLowerCase();
    if (!q) return this.users();
    return this.users().filter(u =>
      u.email.toLowerCase().includes(q) ||
      `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.employeeId;

    const orgId = this.orgContext.currentOrgId();

    if (orgId) {
      this.positionsLoading.set(true);
      this.positionsApi.getAll(orgId).subscribe({
        next: (data) => {
          this.positions.set(data.length ? data : MOCK_POSITIONS);
          this.positionsLoading.set(false);
        },
        error: () => {
          this.positions.set(MOCK_POSITIONS);
          this.positionsLoading.set(false);
        },
      });
    } else {
      this.positions.set(MOCK_POSITIONS);
    }

    if (orgId) {
      this.servicesLoading.set(true);
      this.servicesApi.getAll(orgId).subscribe({
        next: (data) => {
          this.services.set(data);
          this.servicesLoading.set(false);
        },
        error: () => this.servicesLoading.set(false),
      });
    }

    this.specialtiesLoading.set(true);
    this.specialtyApi.getAll().subscribe({
      next: (data) => {
        this.specialties.set(data);
        this.specialtiesLoading.set(false);
      },
      error: () => this.specialtiesLoading.set(false),
    });

    const preselectedUserId = this.route.snapshot.queryParamMap.get('userId');

    this.inviteApi.getAll().subscribe({
      next: (invites) => {
        const accepted = invites
          .filter(i => !!i.acceptedAt)
          .map(i => i.user as unknown as User);
        const unique = accepted.filter((u, idx, arr) => arr.findIndex(x => x.id === u.id) === idx);
        this.users.set(unique);

        if (preselectedUserId) {
          const user = unique.find(u => u.id === preselectedUserId);
          if (user) this.selectUser(user);
        }
      },
      error: () => {
        this.users.set([]);
      },
    });

    if (this.isEdit && this.employeeId) {
      this.fetchLoading.set(true);
      this.api.getById(this.employeeId).subscribe({
        next: (emp) => {
          this.fillForm(emp);
          this.fetchLoading.set(false);
        },
        error: () => {
          const mock = MOCK_EMPLOYEES.find(e => e.id === this.employeeId);
          if (mock) {
            this.fillForm(mock);
          } else {
            this.error.set('Employee not found');
          }
          this.fetchLoading.set(false);
        },
      });
    }
  }

  selectUser(user: User): void {
    this.linkedUser = user;
    this.email = user.email;
    this.userSearch.set('');
    this.userDropdownOpen.set(false);
  }

  clearUser(): void {
    this.linkedUser = null;
    this.email = '';
  }

  private fillForm(emp: import('../../core/models/employee.model').Employee): void {
    this.firstName = emp.firstName ?? '';
    this.lastName = emp.lastName ?? '';
    this.email = emp.user.email;
    this.phone = emp.phone ?? '';
    this.photo = emp.photo ?? '';
    this.description = emp.description ?? '';
    this.about = emp.about?.length ? [...emp.about] : [''];
    this.education = emp.education?.length ? [...emp.education] : [''];
    this.certificates = emp.certificates?.length ? [...emp.certificates] : [''];
    this.workSchedule = emp.workSchedule?.length
      ? DAYS_OF_WEEK.map(({ day }) => {
          const found = emp.workSchedule!.find(e => e.day === day);
          return found ? { ...found } : { day, isWorking: false, intervals: [] };
        })
      : DEFAULT_SCHEDULE.map(e => ({ ...e }));
    this.experienceYears = emp.experienceYears ?? null;

    this.isActive = emp.isActive;
    this.isPublic = emp.isPublic ?? false;
    this.positionId = emp.positionId ?? '';
    this.linkedUser = emp.user;
    this.selectedServices = emp.services ? [...emp.services] : [];
    this.selectedSpecialties = emp.specialties ? [...emp.specialties] : [];
  }

  addInterval(dayIndex: number): void {
    const entry = this.workSchedule[dayIndex];
    entry.intervals = [...entry.intervals, { startTime: '09:00', endTime: '18:00' }];
  }

  removeInterval(dayIndex: number, intervalIndex: number): void {
    const entry = this.workSchedule[dayIndex];
    entry.intervals = entry.intervals.filter((_, i) => i !== intervalIndex);
  }

  addCertificate(): void {
    this.certificates = [...this.certificates, ''];
  }

  removeCertificate(index: number): void {
    this.certificates = this.certificates.filter((_, i) => i !== index);
  }

  updateCertificate(index: number, value: string): void {
    this.certificates = this.certificates.map((item, i) => i === index ? value : item);
  }

  addEducation(): void {
    this.education = [...this.education, ''];
  }

  removeEducation(index: number): void {
    this.education = this.education.filter((_, i) => i !== index);
  }

  updateEducation(index: number, value: string): void {
    this.education = this.education.map((item, i) => i === index ? value : item);
  }

  addAboutBlock(): void {
    this.about = [...this.about, ''];
  }

  removeAboutBlock(index: number): void {
    this.about = this.about.filter((_, i) => i !== index);
  }

  updateAboutBlock(index: number, value: string): void {
    this.about = this.about.map((item, i) => i === index ? value : item);
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const about = this.about.filter(b => b.trim());
    const education = this.education.filter(e => e.trim());
    const certificates = this.certificates.filter(c => c.trim());

    const request$ = this.isEdit
      ? this.api.update(this.employeeId!, {
          firstName: this.firstName,
          lastName: this.lastName,
          ...(this.email && { email: this.email }),
          ...(this.phone && { phone: this.phone }),
          ...(this.photo && { photo: this.photo }),
          ...(this.description && { description: this.description }),
          ...(about.length && { about }),
          ...(education.length && { education }),
          ...(certificates.length && { certificates }),
          workSchedule: this.workSchedule,
          serviceIds: this.selectedServices.map(s => s.id),
          specialtyIds: this.selectedSpecialties.map(s => s.id),
          isActive: this.isActive,
          isPublic: this.isPublic,
          ...(this.positionId && { positionId: this.positionId }),
          ...(this.experienceYears != null && { experienceYears: this.experienceYears }),
        })
      : this.api.create({
          userId: this.linkedUser!.id,
          ...(this.firstName && { firstName: this.firstName }),
          ...(this.lastName && { lastName: this.lastName }),
          ...(this.phone && { phone: this.phone }),
          ...(this.photo && { photo: this.photo }),
          ...(this.description && { description: this.description }),
          ...(about.length && { about }),
          ...(education.length && { education }),
          ...(certificates.length && { certificates }),
          workSchedule: this.workSchedule,
          ...(this.selectedServices.length && { serviceIds: this.selectedServices.map(s => s.id) }),
          ...(this.selectedSpecialties.length && { specialtyIds: this.selectedSpecialties.map(s => s.id) }),
          isActive: this.isActive,
          isPublic: this.isPublic,
          ...(this.positionId && { positionId: this.positionId }),
          ...(this.experienceYears != null && { experienceYears: this.experienceYears }),
          organizationId: this.orgContext.currentOrgId()!,
        });

    request$.subscribe({
      next: () => this.router.navigate(['/admin/employees']),
      error: () => {
        this.error.set('Failed to save employee');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/employees']);
  }

  get previewInitials(): string {
    const f = this.firstName?.[0] ?? '';
    const l = this.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || '?';
  }

  get previewGradient(): string {
    const seed = (this.firstName + this.lastName).length % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[seed];
  }

  get selectedPositionName(): string {
    return this.positions().find(p => p.id === this.positionId)?.name ?? '';
  }

  formatDate(iso: string | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
