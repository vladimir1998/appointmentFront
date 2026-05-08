import { Component, signal } from '@angular/core';

interface HourRow {
  day: string;
  on: boolean;
  open: string;
  close: string;
}

@Component({
  selector: 'app-example',
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class Example {
  hours = signal<HourRow[]>([
    { day: 'monday',    on: true,  open: '08:00', close: '18:00' },
    { day: 'tuesday',   on: true,  open: '08:00', close: '18:00' },
    { day: 'wednesday', on: true,  open: '08:00', close: '18:00' },
    { day: 'thursday',  on: true,  open: '08:00', close: '18:00' },
    { day: 'friday',    on: true,  open: '08:00', close: '17:00' },
    { day: 'saturday',  on: true,  open: '09:00', close: '13:00' },
    { day: 'sunday',    on: false, open: '',      close: ''      },
  ]);

  toggleDay(index: number): void {
    this.hours.update(rows =>
      rows.map((r, i) => i === index ? { ...r, on: !r.on } : r)
    );
  }
}
