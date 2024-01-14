import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDrawModule } from 'ngx-draw';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxDrawModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo-app';
}
