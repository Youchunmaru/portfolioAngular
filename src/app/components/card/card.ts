import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

export interface CardData {
  title: string;
  subtitle: string;
  img: string;
  content: string;
  tldr: string;
  links: { name: string, link: string }[];
}

@Component({
  selector: 'app-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  cardData = input<CardData>();
}
