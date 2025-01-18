import { Component, Input, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { SpaceComponent } from './space/space.component';
import { GridDataService } from '../../../services/grid-data.service';

@Component({
  selector: 'box',
  imports: [SpaceComponent],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent implements AfterViewInit {

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

  @ViewChildren(SpaceComponent) spaces!: QueryList<SpaceComponent>;

  constructor(private gridData: GridDataService) {}

  subGridIndex: number[][][] = [[],[],[],[],[],[],[],[],[]];

  //this makes the box component subscribe to listening for changed values of spaces
  ngAfterViewInit(): void {

    this.gridData.changedSpaceValueCoords.subscribe(coords => {

      if (coords[0] == this.boxIndex){

        const index = [coords[1],coords[2]];

        //if we make a space empty
        if (coords[3] == 0){

          //do something here to check 

          this.spaces.forEach(space => {
            //before removing from index list give validSpace class
            if (coords[1] == space.gridCoords[1] && coords[2] == space.gridCoords[2]){
              space.isValid = true;
            }
          });

          this.subGridIndex[coords[3] - 1]
            .splice(this.subGridIndex[coords[3] - 1].indexOf(index), 1);

        } else { //if we give a space a value

          this.subGridIndex[coords[3] - 1].push(index);

          if (this.subGridIndex[coords[3] - 1].length > 1){

            //get the spaces that have the row/col index
            this.spaces.forEach(space => {
              if (this.subGridIndex[coords[3] - 1].includes([space.gridCoords[1],space.gridCoords[2]])){
                space.isValid = false;
              }
            });
          }
        }
      } 

    });
  }

}
