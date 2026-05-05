import { Component } from '@angular/core';
import { ScheduleAppointment } from '../common/schedule-appointment/schedule-appointment.component';
import { TodayAppointment } from '../common/today-appointment/today-appointment.component';
import { SearchInput } from './search-input/search-input';

@Component({
  selector: 'app-components',
  standalone: true,
  templateUrl: './components.html',
  styleUrl: './components.scss',
  imports: [
    ScheduleAppointment,
    TodayAppointment,
    SearchInput
  ],
})
export class Components {
}
