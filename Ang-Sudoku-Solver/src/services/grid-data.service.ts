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

  //subject to clear all spaces, empty values and make them valid. Just sends true
  private clearSpacesSubject = new Subject<boolean>();
  clearSpacesStream = this.clearSpacesSubject.asObservable();

  //subject to get finished grid values to their corresponding spaces
  private finishedGridSubject = new Subject<{row: number, col: number, value: number}>();
  finishedGridStream = this.finishedGridSubject.asObservable();
  
  //send the updated space value to the BoardComponent and the coords
  updateValue(box: number, row: number, column: number, value: number) {
    this.spaceValueSubject.next({box, row, column, value});
  }

  //if duplicate numbers appear or disappear in rows/cols, update corresponding SpaceComponents
  updateValidity(row: number, column: number, valid: boolean){
    this.spaceValiditySubject.next({row, column, valid});
  }

  //send signal to clear all spaces
  clearSpaces() {
    this.invalidSpaceCounter = 0;
    this.clearSpacesSubject.next(true);
  }

  //send out values from finished grid
  fillOutFinishedGrid(row: number, col: number, value: number) {
    this.finishedGridSubject.next({row, col, value});
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
