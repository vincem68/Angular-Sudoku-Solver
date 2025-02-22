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

  @Input() gridCoords!: number[];

  inFocus: boolean = false;
  isValid: boolean = true;
  value: string = "";

  constructor(private gridData: GridDataService){ }

  ngAfterViewInit(): void {
      this.gridData.spaceValidityStream.subscribe(signal => {
        if (signal.row == this.gridCoords[1] && signal.column == this.gridCoords[2]){
          if (this.isValid == true && signal.valid == false){
            this.gridData.increaseInvalidSpaceCounter();
          }
          if (this.isValid == false && signal.valid == true){
            this.gridData.decreaseInvalidSpaceCounter();
          }
          this.isValid = signal.valid;
        }
      });

      this.gridData.clearSpacesStream.subscribe(signal => {
        this.isValid = signal;
        this.value = "";
      });

      this.gridData.updateGridStream.subscribe(signal => {
        if (this.gridCoords[1] == signal.row && this.gridCoords[2] == signal.col) {
          this.isValid = true; //whether generating puzzle or getting solution, all spaces are valid
          this.value = (signal.value == 0) ? "" : signal.value.toString();
        }
      })
  }

  //update the grid here, check to make sure empty strings send 0s or that we don't exceed 1 digit
  update(): void {
    if (Number.isNaN(Number(this.value)) || this.value == "0"){ //take care of inputs not 1-9
      this.value = "";
      return;
    }
    if (this.value == ""){ //if empty space then always valid
      this.isValid = true;
      this.gridData.decreaseInvalidSpaceCounter();
    }
    const numValue = (this.value == "") ? 0 : Number(this.value);
    this.gridData.updateValue(this.gridCoords[0], this.gridCoords[1], this.gridCoords[2], numValue);
  }
}
