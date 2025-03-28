import { Component, Input, AfterViewInit } from '@angular/core';
import { SpaceComponent } from './space/space.component';

@Component({
  selector: 'box',
  imports: [SpaceComponent],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  /**
   * Each Box component will have these vars that contains their adjacent indexes in the overall grid.
   * 
   * @boxIndex - number that represents the index of the Box the components represents
   *  --a Box is one of 9 3x3 grids in the overall 9x9 board, order goes top to bottom, left to right
   * 
   * @rowIndexes - number array that represents the row indexes of the overall grid the Box
   *  contains. Indexes are 0-8 for 2D array lookup in grid
   *  --example: Box 1 (top left) has rows 0, 1, 2. Box 4 (middle left) has rows 3, 4, 5
   * 
   * @columnIndexes - same as rowIndexes but is the indexes for the columns the Box contains
   *  --example: Box 1 (top left) has columns 0, 1, 2. Box 2 (top middle) is 3, 4, 5
   */

  @Input() boxIndex!: number;
  @Input() rowIndexes!: number[];
  @Input() columnIndexes!: number[];

}
