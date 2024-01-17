import { Component, Input } from '@angular/core';
import { Controller } from '../sketch-api/controller';
import { PenColor, PenThickness } from '../sketch-api/tools';

@Component({
  selector: 'ngx-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrl: './control-bar.component.scss',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'ngx-control-bar',
  },
})
export class ControlBarComponent {
  @Input() controller!: Controller | null;
  thickness: PenThickness = 2;
  color: PenColor = 'black';

  selectPen() {
    this.controller?.pickPen(this.thickness, this.color);
  }
}
