import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  //number of spaces filled in. Need at least 17 numbers filled.
  spaceCounter: number = 0;
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
  private updateGridSubject = new Subject<{row: number, col: number, value: number}>();
  updateGridStream = this.updateGridSubject.asObservable();
  
  //send the updated space value to the BoardComponent and the coords
  updateValue(box: number, row: number, column: number, value: number) {
    this.spaceValueSubject.next({box, row, column, value});
  }

  //update a specific space's validity if its space changes or its affected by space in box/row/column
  updateValidity(row: number, column: number, valid: boolean){
    this.spaceValiditySubject.next({row, column, valid});
  }

  //send signal to clear all spaces
  clearSpaces() {
    this.clearSpacesSubject.next(true);
  }

  //send out values from finished grid
  fillOutGrid(row: number, col: number, value: number) {
    this.updateGridSubject.next({row, col, value});
  }

  setSpaceCounter(total: number) {
    this.spaceCounter = total;
  }
  
  //decrease number of filled spaces
  decreaseSpaceCounter() {
    this.spaceCounter--;
  }

  //increase number of filled spacs
  increaseSpaceCounter() {
    this.spaceCounter++;
  }

  //return number of filled spaces
  getSpaceCounter() {
    return this.spaceCounter;
  }

  //decrease number of invalid (red) spaces
  decreaseInvalidSpaceCounter() {
    this.invalidSpaceCounter--;
  }

  //increase number of invalid (red) spaces
  increaseInvalidSpaceCounter() {
    this.invalidSpaceCounter++;
  }

  resetInvalidSpaceCounter() {
    this.invalidSpaceCounter = 0;
  }
  //return number of invalid (red) spaces
  getInvalidSpaceCounter() {
    return this.invalidSpaceCounter;
  }
}
