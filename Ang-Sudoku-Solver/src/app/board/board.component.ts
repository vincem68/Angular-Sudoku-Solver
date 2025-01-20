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
   * The idea of the Board Component will be to keep a record of all rows and columns and see if
   * any updates by the changedSpaceValueCoords subject results in duplicate values in rows/columns
   * @param gridData 
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

      //first check to see if we're making a space empty
      if (coords.value == 0){

      }

      if (this.rows[coords.row].includes(coords.value)){

      }

      //finally update the two grids after checking everything
      this.rows[coords.row][coords.column] = coords.value;
      this.columns[coords.column][coords.row] = coords.value;

    });
  }

  //link the function from the solve file
  /*
  solveGrid(){
    solve(this.rows, this.columns);
  } */
}
