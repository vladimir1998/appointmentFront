import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Service } from '../core/models/service.model';

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Consultation',
    description: 'Initial doctor consultation, medical history review and diagnosis',
    photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=240&fit=crop',
    price: 2500,
    duration: 30,
    durationMax: undefined,
    organizationId: 'mock',
  },
  {
    id: '2',
    title: 'Teeth Cleaning',
    description: 'Professional ultrasonic teeth cleaning and polishing',
    photo: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=240&fit=crop',
    price: 4800,
    duration: 45,
    durationMax: 60,
    organizationId: 'mock',
  },
  {
    id: '3',
    title: 'ECG',
    description: 'Electrocardiogram with doctor interpretation',
    photo: undefined,
    price: 1200,
    duration: 15,
    durationMax: undefined,
    organizationId: 'mock',
  },
  {
    id: '4',
    title: 'Massage (back)',
    description: 'Therapeutic back massage — relaxing and restorative',
    photo: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=240&fit=crop',
    price: 3500,
    duration: 60,
    durationMax: 90,
    organizationId: 'mock',
  },
  {
    id: '5',
    title: 'Blood Test',
    description: 'Complete blood count with differential, basic metabolic panel',
    photo: undefined,
    price: 890,
    duration: 10,
    durationMax: undefined,
    organizationId: 'mock',
  },
  {
    id: '6',
    title: 'MRI (brain)',
    description: 'MRI brain scan with contrast, detailed radiologist report included',
    photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=240&fit=crop',
    price: 12000,
    duration: 40,
    durationMax: 60,
    organizationId: 'mock',
  },
];

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
