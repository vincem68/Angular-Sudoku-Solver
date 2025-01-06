import { Component } from '@angular/core';

@Component({
  selector: 'space',
  imports: [],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css'
})
export class SpaceComponent {

  value: string = " ";

  divFocus: boolean = false;

  inFocus(): void {
    this.divFocus = !this.divFocus;
  }
}
