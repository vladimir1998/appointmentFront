import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  label       = input<string>('');
  placeholder = input<string>('');
  value       = model<string>('');
  required    = input<boolean>(false);
  rows        = input<number>(3);
  hint        = input<string>('');
}
