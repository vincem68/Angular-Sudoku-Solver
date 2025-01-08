import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  private grid: number[][]; //the overall grid that contains the values, all initialized to 0 (empty)
  private invalidInputCounter: number; //the number of invalid inputs the board currently holds

  constructor() { 
    
    this.grid = [
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

    this.invalidInputCounter = 0;
  }

  //have Box components call this method whenever a space has their value changed
  public getValue(row: number, column: number){
    return this.grid[row][column];
  }

  //use this in the space component given its coordinates
  public addNumber(row: number, column: number, number: number) {
    this.grid[row][column] = number;
  }
}
