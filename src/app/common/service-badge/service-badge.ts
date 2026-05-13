import { Component, input } from '@angular/core';

@Component({
  selector: 'app-service-badge',
  templateUrl: './service-badge.html',
  styleUrl: './service-badge.scss',
})
export class ServiceBadge {
  label = input.required<string>();
  more = input<number | null>(null);
}
