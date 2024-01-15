import { Component, Input } from '@angular/core';
import { Controller } from '../sketch-api/controller';

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
}
