import { Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  label       = input<string>('');
  placeholder = input<string>('');
  type        = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  value       = model<string | number | null>('');
  required    = input<boolean>(false);
  prefix      = input<string>('');
  suffix      = input<string>('');
  hint        = input<string>('');

  showPassword = signal(false);

  get resolvedType(): string {
    if (this.type() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  }

  onInput(rawValue: string): void {
    if (this.type() === 'number') {
      this.value.set(rawValue === '' ? null : +rawValue);
    } else {
      this.value.set(rawValue);
    }
  }
}
