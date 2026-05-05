import { Component, signal } from '@angular/core';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [CustomSelectComponent],
  templateUrl: './schedule-appointment.component.html',
  styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointment {
  selectedStatus = signal('Confirmed');

  statusOptions = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
}
