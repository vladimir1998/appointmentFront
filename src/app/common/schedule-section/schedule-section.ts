import { Component, input } from '@angular/core';
import { WorkScheduleEntry } from '../../core/models/employee.model';
import { WorkSchedule } from '../work-schedule/work-schedule';

@Component({
  selector: 'app-schedule-section',
  imports: [WorkSchedule],
  templateUrl: './schedule-section.html',
  styleUrl: './schedule-section.scss',
})
export class ScheduleSection {
  schedule = input.required<WorkScheduleEntry[]>();
}
