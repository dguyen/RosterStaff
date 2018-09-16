import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shift-view',
  templateUrl: './shift-view.component.html',
  styleUrls: ['./shift-view.component.scss']
})
export class ShiftViewComponent {
  @Input() data;
  @Input() allowAccept;
  showList = true;

  constructor() { }
}
