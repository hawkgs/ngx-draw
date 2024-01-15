import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DrawComponent } from './draw/draw.component';
import { ControlBarComponent } from './control-bar/control-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DrawComponent, ControlBarComponent],
  exports: [DrawComponent, ControlBarComponent],
})
export class NgxDrawModule {}
