import {Component, input} from '@angular/core';
import {MatListModule} from '@angular/material/list';

export interface ListData {
  title: string;
  secondLine: string;
  thirdLine: string;
}

@Component({
  selector: 'app-list',
  imports: [MatListModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  listData = input<ListData[]>([])
  nOfLines = input<number>(3)
}
