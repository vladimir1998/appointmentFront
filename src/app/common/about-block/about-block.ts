import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { QUILL_MODULES } from '../../admin/employee-form/admin-employee-form';

@Component({
  selector: 'app-about-block',
  imports: [FormsModule, QuillModule],
  templateUrl: './about-block.html',
  styleUrl: './about-block.scss',
})
export class AboutBlock {
  index = input.required<number>();
  value = input.required<string>();
  canRemove = input(false);
  placeholder = input('Write a block...');

  valueChange = output<string>();
  remove = output<void>();

  readonly quillModules = QUILL_MODULES;
}
