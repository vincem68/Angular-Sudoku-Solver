import { Component, AfterViewInit } from '@angular/core';
import { BoxComponent } from './box/box.component';
import SpaceCoords from '../../classes/SpaceCoords';
import prepareSolve from '../../solve';
import { GridDataService } from '../../services/grid-data.service';

@Component({
  selector: 'board',
  imports: [BoxComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements AfterViewInit {

  constructor(private gridData: GridDataService){}

  //the overall values of every grid space are stored here for checking if there are repeat numbers
  //in rows, used for the overall solving and as the main grid values
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
  //the transpose of rows, updated alongside the rows array. Represents values in columns for easier lookup
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

  //list of lists that each hold a SpaceCoords object. Each index represents one of the 9 boxes on the board.
  //whenever we add a space, make SpaceCoords object and put it in its box index
  //ex: add nonzero number at space 0,0 (very top left), add space at boxes[0] for box 0 that holds coords
  boxes: SpaceCoords[][] = [[],[],[],[],[],[],[],[],[]];

  buttonDisabled: boolean = true; //property to make Solve button disabled or not

  ngAfterViewInit(): void {
  
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
    const prevValue = this.rows[row][col];

    //make space empty in both grids
    this.rows[row][col] = 0;
    this.columns[col][row] = 0;

    //remove space from the boxes list
    this.boxes[box].splice(this.boxes[box].findIndex(space => space.row == row && space.col == col), 1);
    
    //see if there is 1 duplicate in row 
    if (this.rows[row].filter(value => value == prevValue).length == 1){
      //get column index and box index of it if yes
      const dupColIndex = this.rows[row].indexOf(prevValue);
      const dupBoxIndex = 3 * (Math.floor(row / 3)) + Math.floor(dupColIndex / 3);
      //check if also only instance of value in column and box
      if (this.columns[dupColIndex].filter(value => value == prevValue).length == 1 && 
        this.boxes[dupBoxIndex].filter(space => this.rows[space.row][space.col] == prevValue).length == 1){
          //make space valid if no duplicates in box or column
        this.gridData.updateValidity(row, dupColIndex, true);
      }
    }

    //see if 1 duplicate value in column
    if (this.columns[col].filter(value => value == prevValue).length == 1){
      //get row index of it if yes
      const dupRowIndex = this.columns[col].indexOf(prevValue);
      const dupBoxIndex = 3 * (Math.floor(dupRowIndex / 3)) + Math.floor(col / 3);
      //check if also only instance of value in row and box
      if (this.rows[dupRowIndex].filter(value => value == prevValue).length == 1 && 
        this.boxes[dupBoxIndex].filter(space => this.rows[space.row][space.col] == prevValue).length == 1){
          //space is valid if no others found
        this.gridData.updateValidity(dupRowIndex, col, true);
      }
    }

    //now finally check if 1 duplicate row in Box
    if (this.boxes[box].filter(space => this.rows[space.row][space.col] == prevValue).length == 1){
      const space: any = this.boxes[box].find(space => this.rows[space.row][space.col] == prevValue);
      //check its row and column if other duplicates are found if there's one in the box
      if (this.rows[space.row].filter(value => value == prevValue).length == 1 && 
        this.columns[space.col].filter(value => value == prevValue).length == 1){
        //make space valid if no duplicates
        this.gridData.updateValidity(space.row, space.col, true);
      }
    }
  }

  /**
   * Method called when a SpaceComponent goes from empty to having a value. Checks the row, column and
   * box of the SpaceComponent to see if there are duplicate numbers and makes them invalid if so
   */
  fillingSpace(box: number, row: number, col: number, value: number){

    this.gridData.increaseSpaceCounter();

    //see if there is occurrence of number in row already
    if (this.rows[row].indexOf(value) != -1){ //if yes, make both spaces invalid
      this.gridData.updateValidity(row, this.rows[row].indexOf(value), false);
      this.gridData.updateValidity(row, col, false);
    }

    //now check in columns
    if (this.columns[col].indexOf(value) != -1){
      this.gridData.updateValidity(this.columns[col].indexOf(value), col, false);
      this.gridData.updateValidity(row, col, false);
    }

    //check box
    if (this.boxes[box].filter(space => this.rows[space.row][space.col] == value).length > 0){
      this.gridData.updateValidity(row, col, false);
      const duplicate: any = this.boxes[box].find(space => this.rows[space.row][space.col] == value);
      this.gridData.updateValidity(duplicate.row, duplicate.col, false);
    }
    //add to box list
    this.boxes[box].push(new SpaceCoords(row, col));

    //finally, update the grids
    this.rows[row][col] = value;
    this.columns[col][row] = value;
  }

  /**
   * When Clear Board button is clicked, send signal to all SpaceComponents to empty values and become
   * valid (white) spaces
   */
  clearBoard() {
    this.gridData.setSpaceCounter(0); //set spaces filled to 0
    this.gridData.resetInvalidSpaceCounter();
    //empty the grids and bx lists
    for (let i = 0; i < 9; i++){
      this.boxes[i] = [];
      for (let j = 0; j < 9; j++){
        this.rows[i][j] = 0;
        this.columns[i][j] = 0;
      }
    }
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
    const puzzle = obj.newboard.grids[0].value; //get the 2D array portion of response
    //clear the boxValues list
    this.boxes = [[],[],[],[],[],[],[],[],[]]; //empty boxes list since we're throwing away previous values
    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        //fill up property grids with new puzzle values
        this.rows[i][j] = puzzle[i][j];
        this.columns[j][i] = puzzle[i][j];
        if (puzzle[i][j] != 0) { //if nonzero value add it to box list
          this.gridData.increaseSpaceCounter();
          this.boxes[3 * (Math.floor(i / 3)) + Math.floor(j / 3)].push(new SpaceCoords(i, j));
        }
        this.gridData.fillOutGrid(i, j, puzzle[i][j]); //change SpaceComponent value
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
    //solve puzzle
    prepareSolve(this.rows, this.columns);
    //populate grid properties with solution
    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        const boxIndex = 3 * (Math.floor(i / 3)) + Math.floor(j / 3);
        if (this.boxes[boxIndex].findIndex(space => space.row == i && space.col == j) == -1){
          this.boxes[boxIndex].push(new SpaceCoords(i, j));
        }
        this.gridData.fillOutGrid(i, j, this.rows[i][j]);
      }
    }

  }
}