import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  private gridSubject = new BehaviorSubject<number[][]>([
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
  ]);
  grid = this.gridSubject.asObservable();

  private changedSpaceValueCoordsSubject = new Subject<number[]>();
  changedSpaceValueCoords = this.changedSpaceValueCoordsSubject.asObservable();
  
  //private invalidInputCounter: number = 0;
  
  //add the value to the grid and emit the new grid and the coords of the space changed
  addValue(box: number, row: number, column: number, value: number): void {

    //get grid and update it
    let grid = this.gridSubject.getValue();
    grid[row][column] = value;

    //emit the grid to the other components
    this.gridSubject.next(grid);

    //emit the coords of the space value
    this.changedSpaceValueCoordsSubject.next([box, row, column, value]);
  }
}
