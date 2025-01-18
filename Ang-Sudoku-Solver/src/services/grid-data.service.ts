import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  private grid: number[][] = 
  [
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

  //grid = this.gridSubject.asObservable();

  private changedSpaceValueCoordsSubject = new Subject<number[]>();
  changedSpaceValueCoords = this.changedSpaceValueCoordsSubject.asObservable();
  
  //add the value to the grid and emit the new grid and the coords of the space changed
  addValue(box: number, row: number, column: number, value: number): void {
    //update grid
    this.grid[row][column] = value;
    //emit the coords of the space value
    this.changedSpaceValueCoordsSubject.next([box, row, column, value]);
  }
}
