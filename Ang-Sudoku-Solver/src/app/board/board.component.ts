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

  rows: number[][]= [
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

  columns: number[][]= [
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

  boxUpdateSubject = new Subject<number[]>();
  boxUpdate = this.boxUpdateSubject.asObservable();

  @ViewChildren(BoxComponent) boxes = QueryList<BoxComponent>;

  ngAfterViewInit(): void {
    //update the grids
    this.gridData.changedSpaceValueCoords.subscribe(coords => {
      this.rows[coords[1]][coords[2]] = coords[3];
      this.columns[coords[2]][coords[1]] = coords[3];
    });


  }
}
