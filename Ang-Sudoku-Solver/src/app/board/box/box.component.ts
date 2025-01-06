import { Component } from '@angular/core';
import { SpaceComponent } from './space/space.component';

@Component({
  selector: 'box',
  imports: [SpaceComponent],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

}
