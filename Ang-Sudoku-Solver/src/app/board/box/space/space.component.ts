import { Component, Input, AfterViewInit} from '@angular/core';
import { GridDataService } from '../../../../services/grid-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'space',
  imports: [CommonModule, FormsModule],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css'
})
export class SpaceComponent implements AfterViewInit {

  /**
   * @value - the value the space will hold
   * @gridCoords - a number array that holds the box index, row index, and column index in the overall
   *  grid
   */
  value: string = "";
  @Input() gridCoords!: number[];

  inFocus: boolean = false;
  isValid: boolean = true;

  constructor(private gridData: GridDataService){ }

  ngAfterViewInit(): void {
      this.gridData.checkRowsAndCols.subscribe(signal => {
        if (signal.row == this.gridCoords[1] && signal.column == this.gridCoords[2]){
          this.isValid = signal.valid;
        }
      });
  }

  //update the grid here, check to make sure empty strings send 0s or that we don't exceed 1 digit
  update(): void {
    if (Number.isNaN(this.value)){
      this.value = "";
      return;
    }
    const numValue = (this.value == "") ? 0 : Number(this.value);
    this.gridData.updateValue(this.gridCoords[0], this.gridCoords[1], this.gridCoords[2], numValue);
  }
}
