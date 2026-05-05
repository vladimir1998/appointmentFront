import { Component, input, output, signal } from '@angular/core';

export interface StatusStyle {
  icon: string;
  bgColor: string;
  color: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
})
export class CustomSelectComponent {
  options = input<string[]>(['Pending', 'Cancelled', 'Completed']);
  value = input<string>('Pending');
  valueChange = output<string>();

  selectOpen = signal(false);

  toggleSelect() {
    this.selectOpen.update((v) => !v);
  }

  onSelectBlur() {
    setTimeout(() => this.selectOpen.set(false), 150);
  }

  selectOption(opt: string) {
    this.valueChange.emit(opt);
    this.selectOpen.set(false);
  }

  getStatusIcon(status: string): StatusStyle {
    const icons: Record<string, StatusStyle> = {
      Pending: {
        icon: '/warning-icon.png',
        bgColor: '#FFFBEB',
        color: '#F59E0B',
      },
      Cancelled: {
        icon: '/error-icon.png',
        bgColor: '#FEF2F2',
        color: '#EF4444',
      },
      Completed: {
        icon: '/success-icon.png',
        bgColor: '#F0FDF4',
        color: '#22C55E',
      },
    };
    return icons[status] ?? icons['Pending'];
  }
}
