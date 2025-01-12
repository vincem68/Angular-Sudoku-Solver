import { Component, Input, OnInit } from '@angular/core';
import { SpaceComponent } from './space/space.component';
import { GridDataService } from '../../../services/grid-data.service';

@Component({
  selector: 'box',
  imports: [SpaceComponent],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent implements OnInit {

  /**
   * Each Box component will have these vars that contains their adjacent indexes in the overall grid.
   * @boxIndex - number that represents the index of the Box the components represents
   *  --a Box is one of 9 3x3 grids in the overall 9x9 board, order goes top to bottom, left to right
   * @rowIndexes - number array that represents the row indexes of the overall grid the Box
   *  contains. Indexes are 0-8 for 2D array lookup in grid
   *  --example: Box 1 (top left) has rows 0, 1, 2. Box 4 (middle left) has rows 3, 4, 5
   * @columnIndexes - same as rowIndexes but is the indexes for the columns the Box contains
   *  --example: Box 1 (top left) has columns 0, 1, 2. Box 2 (top middle) is 3, 4, 5
   */
  @Input() boxIndex!: number;
  @Input() rowIndexes!: number[];
  @Input() columnIndexes!: number[];

  constructor(private gridData: GridDataService) {}

  boxSubGrid: number[][] = 
    [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ];

  //this makes the box component subscribe to listening for changed values of spaces
  ngOnInit(): void {
    this.gridData.grid.subscribe(newGrid => {

      this.boxSubGrid[0] = newGrid[this.rowIndexes[0]]
        .slice(this.columnIndexes[0], this.columnIndexes[2] + 1);

      this.boxSubGrid[1] = newGrid[this.rowIndexes[1]]
      .slice(this.columnIndexes[0], this.columnIndexes[2] + 1);

      this.boxSubGrid[2] = newGrid[this.rowIndexes[2]]
        .slice(this.columnIndexes[0], this.columnIndexes[2] + 1);
    });

    this.gridData.changedSpaceValueCoords.subscribe(coords => {

      if (coords[0] == this.boxIndex){
        this.checkBoxForInvalidNumber(coords[3]);
      } 

    });
  }

  //check the 3x3 Box to make sure no duplicates in 3x3 Box
  checkBoxForInvalidNumber(value: number){
    let counter = 0;
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (this.boxSubGrid[i][j] == value){
          counter++;
        }
      }
    }

    if (counter > 1){
      //do something here to make spaces with that value red
    }
  }

}
