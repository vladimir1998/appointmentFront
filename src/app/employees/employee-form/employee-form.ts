import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { PositionsApiService } from '../../core/services/positions-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { Position } from '../../core/models/position.model';
import { InputComponent } from '../../common/input/input.component';
import { TextareaComponent } from '../../common/textarea/textarea.component';
import { ImageUrlPickerComponent } from '../../common/image-url-picker/image-url-picker.component';

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
};

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule, InputComponent, TextareaComponent, ImageUrlPickerComponent, QuillModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit {
  private readonly api = inject(EmployeesApiService);
  private readonly positionsApi = inject(PositionsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  employeeId: string | null = null;

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  photo = '';
  description = '';
  about: string[] = [''];
  isActive = true;
  positionId = '';

  readonly quillModules = QUILL_MODULES;

  positions = signal<Position[]>([]);
  positionsLoading = signal(false);
  fetchLoading = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

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

    if (this.isEdit && this.employeeId) {
      this.fetchLoading.set(true);
      this.api.getById(this.employeeId).subscribe({
        next: (emp) => {
          this.firstName = emp.firstName;
          this.lastName = emp.lastName;
          this.email = emp.user.email;
          this.phone = emp.phone ?? '';
          this.photo = emp.photo ?? '';
          this.description = emp.description ?? '';
          this.about = emp.about?.length ? [...emp.about] : [''];
          this.isActive = emp.isActive;
          this.positionId = emp.positionId ?? '';
          this.fetchLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load employee');
          this.fetchLoading.set(false);
        },
      });
    }
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

    const request$ = this.isEdit
      ? this.api.update(this.employeeId!, {
          firstName: this.firstName,
          lastName: this.lastName,
          ...(this.email && { email: this.email }),
          ...(this.phone && { phone: this.phone }),
          ...(this.photo && { photo: this.photo }),
          ...(this.description && { description: this.description }),
          ...(about.length && { about }),
          isActive: this.isActive,
          ...(this.positionId && { positionId: this.positionId }),
        })
      : this.api.register({
          email: this.email,
          password: '',
          firstName: this.firstName,
          lastName: this.lastName,
          ...(this.phone && { phone: this.phone }),
          ...(this.photo && { photo: this.photo }),
          ...(this.description && { description: this.description }),
          ...(about.length && { about }),
          isActive: this.isActive,
          ...(this.positionId && { positionId: this.positionId }),
          organizationId: this.orgContext.currentOrgId()!,
        });

    request$.subscribe({
      next: () => this.router.navigate(['/employees']),
      error: () => {
        this.error.set('Failed to save employee');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
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
}
