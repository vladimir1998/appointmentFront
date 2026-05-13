import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ServicesApiService } from '../../core/services/services-api.service';
import { OrganizationContextService } from '../../core/services/organization-context.service';
import { MOCK_SERVICES } from '../../core/mocks/mock-services';
import { MOCK_EMPLOYEES } from '../../core/mocks/mock-employees';
import { Employee } from '../../core/models/employee.model';
import { InputComponent } from '../../common/input/input.component';
import { TextareaComponent } from '../../common/textarea/textarea.component';
import { ImageUrlPickerComponent } from '../../common/image-url-picker/image-url-picker.component';
import { AboutBlock } from '../../common/about-block/about-block';

@Component({
  selector: 'app-admin-service-form',
  imports: [FormsModule, DecimalPipe, QuillModule, InputComponent, TextareaComponent, ImageUrlPickerComponent, AboutBlock],
  templateUrl: './admin-service-form.html',
  styleUrl: './admin-service-form.scss',
})
export class AdminServiceForm implements OnInit {
  private readonly api = inject(ServicesApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgContext = inject(OrganizationContextService);

  isEdit = false;
  serviceId: string | null = null;

  title = '';
  description = '';
  photo = '';
  price: number | null = null;
  duration: number | null = null;
  durationMax: number | null = null;
  about: string[] = [''];


  selectedEmployees: Employee[] = [];
  employeeSearch = signal('');
  employeeDropdownOpen = signal(false);
  availableEmployees = signal<Employee[]>([]);

  filteredEmployees = computed(() => {
    const q = this.employeeSearch().toLowerCase();
    return this.availableEmployees()
      .filter(e => !q || `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.position?.name?.toLowerCase().includes(q));
  });

  isEmployeeSelected(emp: Employee): boolean {
    return this.selectedEmployees.some(e => e.id === emp.id);
  }

  toggleEmployee(emp: Employee): void {
    this.isEmployeeSelected(emp)
      ? this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== emp.id)
      : this.selectedEmployees = [...this.selectedEmployees, emp];
  }

  removeEmployee(emp: Employee): void {
    this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== emp.id);
  }

  loading = signal(false);
  fetchLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.serviceId;
    this.availableEmployees.set(MOCK_EMPLOYEES);

    if (this.isEdit && this.serviceId) {
      this.fetchLoading.set(true);
      this.api.getById(this.serviceId).subscribe({
        next: (service) => {
          this.title = service.title;
          this.description = service.description;
          this.photo = service.photo ?? '';
          this.price = service.price;
          this.duration = service.duration;
          this.durationMax = service.durationMax ?? null;
          this.about = service.about?.length ? [...service.about] : [''];
          this.selectedEmployees = service.employee ? [...service.employee] : [];
          this.fetchLoading.set(false);
        },
        error: () => {
          const mock = MOCK_SERVICES.find(s => s.id === this.serviceId);
          if (mock) {
            this.title = mock.title;
            this.description = mock.description;
            this.photo = mock.photo ?? '';
            this.price = mock.price;
            this.duration = mock.duration;
            this.durationMax = mock.durationMax ?? null;
            this.about = mock.about?.length ? [...mock.about] : [''];
            this.selectedEmployees = mock.employee ? [...mock.employee] : [];
          } else {
            this.error.set('Failed to load service');
          }
          this.fetchLoading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const about = this.about.filter(b => b.trim());

    const base = {
      title: this.title,
      description: this.description,
      ...(this.photo && { photo: this.photo }),
      price: this.price!,
      duration: this.duration!,
      ...(this.durationMax != null && { durationMax: this.durationMax }),
      ...(about.length && { about }),
    };

    const request$ = this.isEdit
      ? this.api.update(this.serviceId!, base)
      : this.api.create({ ...base, organizationId: this.orgContext.currentOrgId()! });

    request$.subscribe({
      next: () => this.router.navigate(['/admin/services']),
      error: () => {
        this.error.set('Failed to save service');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/services']);
  }

  addAboutBlock(): void { this.about = [...this.about, '']; }

  removeAboutBlock(index: number): void { this.about = this.about.filter((_, i) => i !== index); }

  updateAboutBlock(index: number, value: string): void {
    this.about = this.about.map((item, i) => i === index ? value : item);
  }

  get priceStr(): string { return this.price?.toString() ?? ''; }
  set priceStr(v: string) { this.price = v !== '' ? +v : null; }

  get durationStr(): string { return this.duration?.toString() ?? ''; }
  set durationStr(v: string) { this.duration = v !== '' ? +v : null; }

  get durationMaxStr(): string { return this.durationMax?.toString() ?? ''; }
  set durationMaxStr(v: string) { this.durationMax = v !== '' ? +v : null; }
}
