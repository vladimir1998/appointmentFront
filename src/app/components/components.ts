import { Component } from '@angular/core';
import { ScheduleAppointment } from '../common/schedule-appointment/schedule-appointment.component';
import { TodayAppointment } from '../common/today-appointment/today-appointment.component';
import { SearchInput } from './search-input/search-input';
import { StatusBadge } from './status-badge/status-badge';
import { CategoryPill } from './category-pill/category-pill';
import { DataTable, DataTableColumn } from './data-table/data-table';

@Component({
  selector: 'app-components',
  standalone: true,
  templateUrl: './components.html',
  styleUrl: './components.scss',
  imports: [
    ScheduleAppointment,
    TodayAppointment,
    SearchInput,
    StatusBadge,
    CategoryPill,
    DataTable,
  ],
})
export class Components {
  tableColumns: DataTableColumn[] = [
    { key: 'service',  label: 'Service',  sortable: true, type: 'service',  width: '2.2fr' },
    { key: 'category', label: 'Category', sortable: true, type: 'category', width: '1.2fr' },
    { key: 'price',    label: 'Price',    sortable: true, type: 'text',     width: '0.7fr' },
    { key: 'duration', label: 'Duration',               type: 'duration', width: '0.8fr' },
    { key: 'status',   label: 'Status',                 type: 'status',   width: '0.8fr' },
    { key: 'created',  label: 'Created',  sortable: true, type: 'date',     width: '1fr'   },
    { key: 'actions',  label: 'Actions',                type: 'actions',  width: '80px'  },
  ];

  tableRows = [
    {
      service:  { name: 'Allergy Testing Panel', description: 'Comprehensive skin prick or blood-based allergy' },
      category: { icon: 'flask', text: 'Diagnostics' },
      price:    '$ 350',
      duration: '60 min',
      status:   { variant: 'success', text: 'Active' },
      created:  '2025-12-01',
    },
    {
      service:  { name: 'Dental Check-up', description: 'Full oral examination and cleaning' },
      category: { icon: 'tooth', text: 'Dentistry' },
      price:    '$ 120',
      duration: '45 min',
      status:   { variant: 'info', text: 'Inactive' },
      created:  '2025-11-15',
    },
    {
      service:  { name: 'Eye Examination', description: 'Vision acuity and pressure test' },
      category: { icon: 'eye', text: 'Ophthalmology' },
      price:    '$ 90',
      duration: '30 min',
      status:   { variant: 'warn', text: 'Pending' },
      created:  '2025-10-22',
    },
  ];
}
