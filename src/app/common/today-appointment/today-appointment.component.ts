import { Component, signal } from '@angular/core';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

@Component({
  selector: 'app-today-appointment',
  standalone: true,
  imports: [CustomSelectComponent],
  templateUrl: './today-appointment.component.html',
  styleUrl: './today-appointment.component.scss',
})
export class TodayAppointment {
  selectedStatus = signal('Confirmed');

  statusOptions = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
}
