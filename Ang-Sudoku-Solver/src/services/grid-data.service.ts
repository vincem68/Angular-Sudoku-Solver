import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  //keep track of number of invalid spaces so we know when we can't call the solve method
  invalidSpaceCounter: number = 0;

  //declare the subjects that will send data throughout the application
  private updatedSpaceValueSubject = new Subject<{box: number, row: number, column: number, value: number}>();
  updatedSpaceValue = this.updatedSpaceValueSubject.asObservable();

  private updatedSpaceValiditySubject = new Subject<{row: number, column: number, valid: boolean}>();
  updatedSpaceValidity = this.updatedSpaceValiditySubject.asObservable();
  
  //send the updated space value to the BoardComponent and the coords
  updateValue(box: number, row: number, column: number, value: number): void {
    this.updatedSpaceValueSubject.next({box, row, column, value});
  }

  //if duplicate numbers appear or disappear in rows/cols, update corresponding SpaceComponents
  updateSpaceValidity(row: number, column: number, valid: boolean){
    this.updatedSpaceValiditySubject.next({row, column, valid});
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
