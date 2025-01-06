import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  private grid: number[][]; 

  constructor() { 
    
    //this overall 2D array to represent the grid, initialized all spaces as 0 (empty)
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
  }

  //put methods here to let components grab row and column data
  public getRow(row: number){
    return this.grid[row];
  }

  public getColumn(column: number){
    let col: number[] = [];
    this.grid.forEach(row => col.push(row[column]));
    return col;
  }

  public addNumber(row: number, column: number, number: number) {
    this.grid[row][column] = number;
  }
}
