import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DrawComponent } from './draw/draw.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DrawComponent],
  exports: [DrawComponent],
})
export class NgxDrawModule {}
