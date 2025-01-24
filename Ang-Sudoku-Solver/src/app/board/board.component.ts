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
        this.emptyingSpace(coords.row, coords.column);
      } else {
        this.fillingSpace(coords.row, coords.column, coords.value);
      }
    });
  }

  /**
   * When ngModelChange is called and we make a space empty, call this to see if we need to update any
   * spaces to be valid if that space contains the same number and there's no more than 2 occurrances
   * in both the row and column
   * @param row 
   * @param col 
   */
  emptyingSpace(row: number, col: number){
    //get previous value in space about to be changed
    const prevValue = this.rows[row][col];

    //make space empty
    this.rows[row][col] = 0;
    this.columns[col][row] = 0;

    //see if there is a duplicate in row already
    let duplicate = this.rows[row].indexOf(prevValue);
    if (duplicate != -1){
      //if there is, see if there's a second duplicate in row
      let secondDuplicate = (duplicate == 8) ? -1 : this.rows[row].indexOf(prevValue, duplicate + 1);
      if (secondDuplicate == -1) { //if not, check that column if there's more than 1 occurrence
        let change = true;
        for (let i = 0; i < 9; i++){
          if (this.columns[duplicate][i] == prevValue && i != row){
            change = false;
          }
        }
        if (change){ //make space valid if just one occurrence in column
          this.gridData.updateSpaceValidity(row, duplicate, true);
        }
      }
    }
    //now do the same for the columns
    duplicate = this.columns[col].indexOf(prevValue);
    if (duplicate != -1) {
      let secondDuplicate = (duplicate == 8) ? -1 : this.columns[col].indexOf(prevValue, duplicate + 1);
      if (secondDuplicate == -1) { 
        let change = true;
        for (let i = 0; i < 9; i++){
          if (this.rows[duplicate][i] == prevValue && i != col){
            change = false;
          }
        }
        if (change){ 
          this.gridData.updateSpaceValidity(duplicate, col, true);
        }
      }
    }
  }


  fillingSpace(row: number, col: number, value: number){

    //see if there is occurrence of number in row already
    let duplicate = this.rows[row].indexOf(value);
    if (duplicate != -1){ //if yes, make both spaces invalid
      this.gridData.updateSpaceValidity(row, duplicate, false);
      this.gridData.updateSpaceValidity(row, col, false);
    }

    //now check in columns
    duplicate = this.columns[col].indexOf(value);
    if (duplicate != -1){
      this.gridData.updateSpaceValidity(duplicate, col, false);
      this.gridData.updateSpaceValidity(row, col, false);
    }

    //finally, update the grid
    this.rows[row][col] = value;
    this.columns[col][row] = value;
  }

  //link the function from the solve file
}
