import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  //declare the subjects that will send data throughout the application
  private updatedSpaceSubject = new Subject<{box: number, row: number, column: number, value: number}>();
  updatedSpace = this.updatedSpaceSubject.asObservable();

  private checkRowsAndColsSubject = new Subject<{row: number, column: number, valid: boolean}>();
  checkRowsAndCols = this.checkRowsAndColsSubject.asObservable();
  
  //send the updated space value to the BoardComponent and the coords
  updateValue(box: number, row: number, column: number, value: number): void {
    this.updatedSpaceSubject.next({box, row, column, value});
  }

  //if duplicate numbers appear or disappear in rows/cols, update corresponding SpaceComponents
  updateRowsAndColumns(row: number, column: number, valid: boolean){
    this.checkRowsAndColsSubject.next({row, column, valid});
  }
}
