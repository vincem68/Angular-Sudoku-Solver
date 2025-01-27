import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  //keep track of number of invalid spaces so we know when we can't call the solve method
  invalidSpaceCounter: number = 0;

  //subject that alerts BoardComponent when a SpaceComponent value changes
  private spaceValueSubject = new Subject<{box: number, row: number, column: number, value: number}>();
  spaceValueStream = this.spaceValueSubject.asObservable();

  //subject to alert SpaceComponent to change its class depending on if value violates sudoku rule
  private spaceValiditySubject = new Subject<{row: number, column: number, valid: boolean}>();
  spaceValidityStream = this.spaceValiditySubject.asObservable();
  
  //send the updated space value to the BoardComponent and the coords
  updateValue(box: number, row: number, column: number, value: number) {
    this.spaceValueSubject.next({box, row, column, value});
  }

  //if duplicate numbers appear or disappear in rows/cols, update corresponding SpaceComponents
  updateValidity(row: number, column: number, valid: boolean){
    this.spaceValiditySubject.next({row, column, valid});
  }

  increaseCounter() {
    this.invalidSpaceCounter++;
  }

  decreaseCounter() {
    this.invalidSpaceCounter--;
  }

  getCounter() {
    return this.invalidSpaceCounter;
  }
}
