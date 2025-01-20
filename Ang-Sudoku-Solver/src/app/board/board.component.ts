import { Component, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { BoxComponent } from './box/box.component';
import { GridDataService } from '../../services/grid-data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'board',
  imports: [BoxComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements AfterViewInit {

  /**
   * 
   */

  constructor(private gridData: GridDataService){}

  rows: number[][] = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ];

  columns: number[][] = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ];

  ngAfterViewInit(): void {
  
    this.gridData.updatedSpace.subscribe(coords => {
      //call function based on if we're emptying or filling a space
      if (coords.value == 0){
        this.emptyingSpace(coords.row, coords.column, coords.value);
      } else {
        this.fillingSpace(coords.row, coords.column, coords.value);
      }
    });
  }

  //use when we empty a space to contain empty string
  emptyingSpace(row: number, col: number, value: number){
    //get previous value in space about to be changed
    const prevValue = this.rows[row][col];
    const rowSpacesToUpdate: number[] = [];
    const colSpacesToUpdate: number[] = [];

      //make space empty
      this.rows[row][col] = value;
      this.columns[col][row] = value;

      //gather any spaces that have old value in row and column
      for (let i = 0; i < 9; i++){
        if (this.rows[row][i] == prevValue){
          rowSpacesToUpdate.push(i);
        }
        if (this.columns[col][i] == prevValue){
          colSpacesToUpdate.push(i);
        }
      }

      if (rowSpacesToUpdate.length == 1){
        this.gridData.updateRowsAndColumns(row, rowSpacesToUpdate[0], true);
      }
      if (colSpacesToUpdate.length == 1){
        this.gridData.updateRowsAndColumns(colSpacesToUpdate[0], col, true);
      }
  }


  fillingSpace(row: number, col: number, value: number){

    //go through row, find first instance of duplicate entry
    for (let i = 0; i < 9; i++){
      if (this.rows[row][i] == value){
        this.gridData.updateRowsAndColumns(row, i, false);
        this.gridData.updateRowsAndColumns(row, col, false);
        break;
      }
    }

    //now do the same in columns
    for (let i = 0; i < 9; i++){
      if (this.columns[col][i] == value){
        this.gridData.updateRowsAndColumns(i, col, false);
        this.gridData.updateRowsAndColumns(row, col, false);
        break;
      }
    }

    //finally, update the grid
    this.rows[row][col] = value;
    this.columns[col][row] = value;
  }

  //link the function from the solve file
}
