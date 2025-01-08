import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GridDataService } from '../../../../services/grid-data.service';

@Component({
  selector: 'space',
  imports: [],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css'
})
export class SpaceComponent {

  /**
   * @value - the value the space will hold
   * @gridCoords - a number array that holds the box index, row index, and column index in the overall
   *  grid
   */
  @Input() value: string = "";
  @Input() gridCoords!: number[];
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  divFocus: boolean = false;

  constructor(private gridData: GridDataService){ }

  inFocus(): void {
    this.divFocus = !this.divFocus;
  }
}
