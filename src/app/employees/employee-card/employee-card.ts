import { Component, input, output } from '@angular/core';
import { Employee } from '../../core/models/employee.model';
import { ScheduleSection } from '../../common/schedule-section/schedule-section';
import { ServiceBadge } from '../../common/service-badge/service-badge';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #fcd34d, #b45309)',
  'linear-gradient(135deg, #6ee7b7, #047857)',
  'linear-gradient(135deg, #c4b5fd, #6d28d9)',
  'linear-gradient(135deg, #fda4af, #be123c)',
  'linear-gradient(135deg, #93c5fd, #1d4ed8)',
  'linear-gradient(135deg, #f9a8d4, #be185d)',
  'linear-gradient(135deg, #fdba74, #c2410c)',
];

@Component({
  selector: 'app-employee-card',
  imports: [ScheduleSection, ServiceBadge],
  templateUrl: './employee-card.html',
  styleUrl: './employee-card.scss',
})
export class EmployeeCard {
  employee = input.required<Employee>();
  index = input<number>(0);

  clicked = output<Employee>();

  avatarGradient(): string {
    return AVATAR_GRADIENTS[this.index() % AVATAR_GRADIENTS.length];
  }

  initials(): string {
    const emp = this.employee();
    return `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase();
  }

  onClick(): void {
    this.clicked.emit(this.employee());
  }
}
