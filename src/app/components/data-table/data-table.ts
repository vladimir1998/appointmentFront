import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryPill, CategoryPillIcon } from '../category-pill/category-pill';
import { StatusBadge, StatusBadgeVariant } from '../status-badge/status-badge';

export type DataTableCellType =
  | 'text'
  | 'service'
  | 'category'
  | 'duration'
  | 'status'
  | 'date'
  | 'actions';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: DataTableCellType;
  /** CSS grid track value, e.g. "2.2fr", "80px". Defaults to "1fr". */
  width?: string;
}

/** Value shape for type="service" */
export interface ServiceCell {
  name: string;
  description?: string;
}

/** Value shape for type="category" */
export interface CategoryCell {
  icon: CategoryPillIcon;
  text: string;
}

/** Value shape for type="status" */
export interface StatusCell {
  variant: StatusBadgeVariant;
  text: string;
}

export interface SortEvent {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  imports: [CategoryPill, StatusBadge],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() columns: DataTableColumn[] = [];
  @Input() rows: Record<string, unknown>[] = [];

  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() editRow = new EventEmitter<Record<string, unknown>>();
  @Output() deleteRow = new EventEmitter<Record<string, unknown>>();

  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get gridTemplate(): string {
    return this.columns.map((c) => c.width ?? '1fr').join(' ');
  }

  onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ key, direction: this.sortDirection });
  }

  asService(value: unknown): ServiceCell {
    return value as ServiceCell;
  }

  asCategory(value: unknown): CategoryCell {
    return value as CategoryCell;
  }

  asStatus(value: unknown): StatusCell {
    return value as StatusCell;
  }
}
