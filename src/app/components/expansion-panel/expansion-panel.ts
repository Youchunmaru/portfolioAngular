import {ChangeDetectionStrategy, Component, input, viewChild} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';

export interface Panel {
  title: string;
  description: string;
  content: string;
}

@Component({
  selector: 'app-expansion-panel',
  imports: [MatExpansionModule],
  templateUrl: './expansion-panel.html',
  styleUrl: './expansion-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanel {
  accordion = viewChild.required(MatAccordion)
  panels = input<Panel[]>([])
}
