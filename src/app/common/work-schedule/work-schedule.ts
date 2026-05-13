import { Component, computed, input } from '@angular/core';
import { WorkScheduleEntry, DayOfWeek, TimeInterval } from '../../core/models/employee.model';

const DAY_ORDER: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

const DAY_LABEL: Record<DayOfWeek, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

export interface ScheduleGroup {
  days: string;   // e.g. "Mon–Wed" or "Fri"
  intervals: TimeInterval[];
}

@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.html',
  styleUrl: './work-schedule.scss',
})
export class WorkSchedule {
  schedule = input<WorkScheduleEntry[]>([]);

  groups = computed<ScheduleGroup[]>(() => {
    const sorted = [...this.schedule()]
      .filter(e => e.isWorking && e.intervals.length > 0)
      .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

    const groups: ScheduleGroup[] = [];
    let i = 0;

    while (i < sorted.length) {
      const start = sorted[i];
      const startKey = JSON.stringify(start.intervals);
      let j = i + 1;

      // Extend group while next entry is consecutive and has identical intervals
      while (
        j < sorted.length &&
        JSON.stringify(sorted[j].intervals) === startKey &&
        DAY_ORDER.indexOf(sorted[j].day) === DAY_ORDER.indexOf(sorted[j - 1].day) + 1
      ) {
        j++;
      }

      const slice = sorted.slice(i, j);
      const first = DAY_LABEL[slice[0].day];
      const last  = DAY_LABEL[slice[slice.length - 1].day];
      groups.push({
        days: slice.length > 1 ? `${first}–${last}` : first,
        intervals: start.intervals,
      });

      i = j;
    }

    return groups;
  });
}
