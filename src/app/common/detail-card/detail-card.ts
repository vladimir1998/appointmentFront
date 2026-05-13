import { Component, input } from '@angular/core';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.html',
  styleUrl: './detail-card.scss',
})
export class DetailCard {
  title = input.required<string>();
}
