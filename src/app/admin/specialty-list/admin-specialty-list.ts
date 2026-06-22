import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SpecialtyApiService } from '../../core/services/specialty-api.service';
import { Specialty } from '../../core/models/specialty.model';

@Component({
  selector: 'app-admin-specialty-list',
  imports: [RouterLink],
  templateUrl: './admin-specialty-list.html',
  styleUrl: './admin-specialty-list.scss',
})
export class AdminSpecialtyList implements OnInit {
  private readonly api = inject(SpecialtyApiService);
  private readonly router = inject(Router);

  specialties = signal<Specialty[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  deleteTarget = signal<Specialty | null>(null);
  deleteLoading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        this.specialties.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load specialties');
        this.loading.set(false);
      },
    });
  }

  edit(sp: Specialty): void {
    this.router.navigate(['/admin/specialties', sp.id, 'edit']);
  }

  openDeleteModal(sp: Specialty): void {
    this.deleteTarget.set(sp);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.deleteLoading.set(true);
    this.api.delete(target.id).subscribe({
      next: () => {
        this.specialties.update(list => list.filter(s => s.id !== target.id));
        this.deleteTarget.set(null);
        this.deleteLoading.set(false);
      },
      error: () => {
        this.deleteLoading.set(false);
      },
    });
  }
}
