import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { GridDataService } from '../../../../services/grid-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'space',
  imports: [CommonModule],
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

  inFocus: boolean = false;
  isValid: boolean = true;

  constructor(private gridData: GridDataService){ }

  //update the grid here, check to make sure empty strings send 0s or that we don't exceed 1 digit
  update(): void {
    const numValue = (this.value == "") ? 0 : Number(this.value);
    this.gridData.addValue(this.gridCoords[0], this.gridCoords[1], this.gridCoords[2], numValue);
  }
}
