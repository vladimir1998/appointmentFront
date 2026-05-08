import { Component, model } from '@angular/core';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-image-url-picker',
  imports: [InputComponent],
  templateUrl: './image-url-picker.component.html',
  styleUrl: './image-url-picker.component.scss',
})
export class ImageUrlPickerComponent {
  value = model<string>('');

  onError(): void {
    this.value.set('');
  }
}
