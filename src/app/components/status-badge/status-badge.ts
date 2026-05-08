import { Component, Input } from '@angular/core';

export type StatusBadgeVariant = 'success' | 'warn' | 'info' | 'danger';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  @Input() variant: StatusBadgeVariant = 'info';
  @Input() text: string = '';
}
