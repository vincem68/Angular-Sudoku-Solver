import { Component, AfterViewInit } from '@angular/core';
import { BoxComponent } from './box/box.component';
import { GridDataService } from '../../services/grid-data.service';
import Space from '../../classes/Space';
import solve from '../../solve';

@Component({
  selector: 'board',
  imports: [BoxComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements AfterViewInit {

  constructor(private gridData: GridDataService){}


  //grid that stores Space objects in row order, seen as the actual corresponding grid
  rows: Space[][] = [[],[],[],[],[],[],[],[],[]];
  //transpose of rows grid, for easier column value lookup, stores same objects as rows in column order
  columns: Space[][] = [[],[],[],[],[],[],[],[],[]];
  //for easier box value lookup, stores same Space objects on box order
  boxes: Space[][] = [[],[],[],[],[],[],[],[],[]];

  buttonDisabled: boolean = true; //property to make Solve button disabled or not

  ngAfterViewInit(): void {

    //popukate grids on initialization, all Space objects have coords and all possible values
    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        const space = new Space(i, j, 0);
        this.rows[i].push(space);
        this.columns[j].push(space);
        this.boxes[space.box].push(space);
      }
    }
  
    this.gridData.spaceValueStream.subscribe(coords => {
      //call function based on if we're emptying or filling a space
      if (coords.value == 0){
        this.emptyingSpace(coords.box, coords.row, coords.column);
      } else {
        this.fillingSpace(coords.box, coords.row, coords.column, coords.value);
      }
      //disable button if less than 17 spaces filled or there's invalid spaces
      if (this.gridData.getInvalidSpaceCounter() == 0 && this.gridData.getSpaceCounter() >= 17){ 
        this.buttonDisabled = false; 
      } else { this.buttonDisabled = true;}
    });
  }

  /**
   * When ngModelChange is called and we make a space empty, call this to see if we need to update any
   * spaces to be valid if that space contains the same number and there's no more than 2 occurrances
   * in both the row and column
   */
  emptyingSpace(box: number, row: number, col: number){

    this.gridData.decreaseSpaceCounter();
    //get previous value in space about to be changed
    const prevValue = this.rows[row][col].value;
    //make space empty and update its numsLeft list
    const filledValues: number[] = [];
    this.rows[row].forEach(space => { if (space.value != 0){ filledValues.push(space.value);}});
    this.columns[col].forEach(space => { if (space.value != 0){ filledValues.push(space.value);}});
    this.boxes[box].forEach(space => { if (space.value != 0){ filledValues.push(space.value);}});
    this.rows[row][col].emptySpace([1,2,3,4,5,6,7,8,9].filter(value => !filledValues.includes(value)));
    
    //check to see if there's now 1 o 0 instances of the removed number in row
    let dupValues: Space[] = this.rows[row].filter(space => space.value == prevValue);
    if (dupValues.length == 1) {
      if (this.columns[dupValues[0].col].filter(space => space.value == prevValue).length == 1
        && this.boxes[dupValues[0].box].filter(space => space.value == prevValue).length == 1){
          this.gridData.updateValidity(dupValues[0].row, dupValues[0].col, true);
      }
    }
    else if (dupValues.length == 0){
      this.rows[row].forEach(space => {
        if (this.columns[space.col].findIndex(otherSpace => otherSpace.value == prevValue) == -1 &&
          this.boxes[space.box].findIndex(otherSpace => otherSpace.value == prevValue) == -1) {
            space.addNum(prevValue);
        }
      });
    }

    dupValues = this.columns[col].filter(space => space.value == prevValue);
    if (dupValues.length == 1) {
      if (this.rows[dupValues[0].row].filter(space => space.value == prevValue).length == 1
        && this.boxes[dupValues[0].box].filter(space => space.value == prevValue).length == 1){
          this.gridData.updateValidity(dupValues[0].row, dupValues[0].col, true);
      }
    }
    else if (dupValues.length == 0){
      this.columns[col].forEach(space => {
        if (this.rows[space.row].findIndex(otherSpace => otherSpace.value == prevValue) == -1 &&
          this.boxes[space.box].findIndex(otherSpace => otherSpace.value == prevValue) == -1) {
            space.addNum(prevValue);
        }
      });
    }

    dupValues = this.boxes[box].filter(space => space.value == prevValue);
    if (dupValues.length == 1) {
      if (this.columns[dupValues[0].col].filter(space => space.value == prevValue).length == 1
        && this.rows[dupValues[0].row].filter(space => space.value == prevValue).length == 1){
          this.gridData.updateValidity(dupValues[0].row, dupValues[0].col, true);
      }
    }
    else if (dupValues.length == 0){
      this.boxes[box].forEach(space => {
        if (this.columns[space.col].findIndex(otherSpace => otherSpace.value == prevValue) == -1 &&
          this.rows[space.row].findIndex(otherSpace => otherSpace.value == prevValue) == -1) {
            space.addNum(prevValue);
        }
      });
    }
  }

  /**
   * Method called when a SpaceComponent goes from empty to having a value. Checks the row, column and
   * box of the SpaceComponent to see if there are duplicate numbers and makes them invalid if so
   */
  fillingSpace(box: number, row: number, col: number, value: number){

    this.gridData.increaseSpaceCounter();

    const dupValueSpaces: Space[] = [];
    //checkk Space's row, column and box for any duplicates
    this.rows[row].forEach(space => { if (space.value == value){ dupValueSpaces.push(space);}});
    this.columns[col].forEach(space => { if (space.value == value){ dupValueSpaces.push(space);}});
    this.boxes[box].forEach(space => { if (space.value == value){ dupValueSpaces.push(space);}});

    if (dupValueSpaces.length > 0){ //update any duplicate values
      this.gridData.updateValidity(row, col, false);
      dupValueSpaces.forEach(space => { this.gridData.updateValidity(space.row, space.col, false);});
    }
    //update the specific Space object
    this.rows[row][col].fillSpace(value);
    //update all Spaces' numsLeft lists in row, column and box
    this.rows[row].forEach(space => space.removeNum(value));
    this.columns[col].forEach(space => space.removeNum(value));
    this.boxes[box].forEach(space => space.removeNum(value));
  }

  /**
   * When Clear Board button is clicked, send signal to all SpaceComponents to empty values and become
   * valid (white) spaces
   */
  clearBoard() {
    this.gridData.setSpaceCounter(0); //set spaces filled counter to 0
    //reset all Space's numsLeft lists
    this.rows.forEach(row => { row.forEach(space => { space.emptySpace([1,2,3,4,5,6,7,8,9]);});});
    //send signal to SpaceComponents to clear value and become valid space
    this.gridData.clearSpaces();
    this.buttonDisabled = true;
  }


  async getPuzzle() {
    this.gridData.setSpaceCounter(0);
    this.gridData.resetInvalidSpaceCounter();
    //get the response puzzle
    const response: Response = await fetch("https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}");
    const obj = await response.json();
    const puzzle: number[][] = obj.newboard.grids[0].value; //get the 2D array portion of response
    
    this.rows.forEach(row => row.forEach(space => {
      space.emptySpace([1,2,3,4,5,6,7,8,9]);
    }));

    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        if (puzzle[i][j] != 0) {
          this.gridData.increaseSpaceCounter(); //increase space filled counter
          this.rows[i][j].fillSpace(puzzle[i][j]); //fill Space object value
          //update row, box and column spaces of current space
          this.rows[i].forEach(space => space.removeNum(puzzle[i][j]));
          this.columns[j].forEach(space => space.removeNum(puzzle[i][j]));
          this.boxes[3 * Math.floor(i / 3) + Math.floor(j / 3)].forEach(space => space.removeNum(puzzle[i][j]));
        }
        this.gridData.fillOutGrid(i, j, puzzle[i][j]);
      }
    }

    this.buttonDisabled = false;
  } 

  /**
   * When the Solve Puzzle button is clicked, prepareSolve is called from a separate file to solve
   * the puzzle. We get the resulting rows and columns arrays as solutions and populate
   * the grid with the solution.
   */
  solveGrid() {
    this.gridData.setSpaceCounter(81); //grid will have 81 filled spaces
    const numsLeftTable: Space[][] = [[],[],[],[],[],[],[],[],[]];
    this.rows.forEach(row => row.forEach(space => {
      if (space.value == 0){
        numsLeftTable[space.numsLeft.length - 1].push(space);
      }
    }));
    //call solve function to get solution
    solve(this.rows, this.columns, this.boxes, numsLeftTable);
    //populate SpaceComponents with their new solved values
    this.rows.forEach(row => { row.forEach(space => { 
      this.gridData.fillOutGrid(space.row, space.col, space.value);});});
  }
}