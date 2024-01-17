import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DrawComponent } from './draw/draw.component';
import { ControlBarComponent } from './control-bar/control-bar.component';
import { FormsModule } from '@angular/forms'; // Note(Georgi): Change with reactive

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DrawComponent, ControlBarComponent],
  exports: [DrawComponent, ControlBarComponent],
})
export class NgxDrawModule {}
