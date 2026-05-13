import { Component, computed, input, model, signal } from '@angular/core';

export interface PickerItem {
  id: string;
  label: string;
  sublabel?: string;
}

@Component({
  selector: 'app-multi-select-picker',
  templateUrl: './multi-select-picker.component.html',
  styleUrl: './multi-select-picker.component.scss',
})
export class MultiSelectPickerComponent {
  items = input<PickerItem[]>([]);
  selected = model<PickerItem[]>([]);
  placeholder = input<string>('Search...');

  search = signal('');
  open = signal(false);

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.items().filter(i => !q || i.label.toLowerCase().includes(q) ||
      i.sublabel?.toLowerCase().includes(q));
  });

  isSelected(item: PickerItem): boolean {
    return this.selected().some(s => s.id === item.id);
  }

  toggle(item: PickerItem): void {
    this.isSelected(item)
      ? this.selected.set(this.selected().filter(s => s.id !== item.id))
      : this.selected.set([...this.selected(), item]);
  }

  remove(item: PickerItem): void {
    this.selected.set(this.selected().filter(s => s.id !== item.id));
  }
}
