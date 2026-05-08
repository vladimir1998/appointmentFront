import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type CategoryPillIcon =
  | 'flask'
  | 'tooth'
  | 'eye'
  | 'chat'
  | 'scan'
  | 'heart';

const ICON_PATHS: Record<CategoryPillIcon, string> = {
  flask:
    '<path d="M9 2v6L4 18a2 2 0 0 0 1.8 2.9h12.4A2 2 0 0 0 20 18L15 8V2"/><line x1="9" y1="2" x2="15" y2="2"/>',
  tooth:
    '<path d="M12 5.5c-2 0-3-1-5-1-2 0-3.5 1.5-3.5 4 0 3 1 4 1.5 6.5.5 2.5.5 5 2 5 1 0 1.5-1 2-3 .5-2 1-3 3-3s2.5 1 3 3c.5 2 1 3 2 3 1.5 0 1.5-2.5 2-5 .5-2.5 1.5-3.5 1.5-6.5 0-2.5-1.5-4-3.5-4-2 0-3 1-5 1z"/>',
  eye:
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  chat:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  scan:
    '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
  heart:
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>',
};

@Component({
  selector: 'app-category-pill',
  imports: [],
  templateUrl: './category-pill.html',
  styleUrl: './category-pill.scss',
})
export class CategoryPill {
  @Input() icon: CategoryPillIcon = 'flask';
  @Input() text: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  get iconHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICON_PATHS[this.icon] ?? '');
  }
}
