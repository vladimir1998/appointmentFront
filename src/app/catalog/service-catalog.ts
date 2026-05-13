import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Service } from '../core/models/service.model';
import { MOCK_SERVICES } from '../core/mocks/mock-services';

@Component({
  selector: 'app-service-catalog',
  imports: [DecimalPipe],
  templateUrl: './service-catalog.html',
  styleUrl: './service-catalog.scss',
})
export class ServiceCatalog {
  search = signal('');
  services = signal<Service[]>(MOCK_SERVICES);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.services();
    return this.services().filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  formatDuration(min: number, max?: number): string {
    return max ? `${min}–${max} min` : `${min} min`;
  }
}
