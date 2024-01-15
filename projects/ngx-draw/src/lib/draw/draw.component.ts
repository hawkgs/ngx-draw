import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Sketch } from '../sketch-api/types';
import { createSketchFactory } from '../sketch-api/sketch-factory';
import { ToolController } from '../sketch-api/tools';

@Component({
  selector: 'ngx-draw',
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'ngxDrawRef',
})
export class DrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;

  private _sketch!: Sketch;
  private _cbs: (() => void)[] = [];

  controller!: ToolController;

  constructor(private _renderer: Renderer2, private _zone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;

    const { sketch, ctrl } = createSketchFactory(canvas);
    this._sketch = sketch;
    this.controller = ctrl;

    this._zone.runOutsideAngular(() => {
      const cbs = [
        this._renderer.listen('mousedown', canvas, (e) =>
          this._onCanvasMouseDown(e),
        ),
        this._renderer.listen('mouseup', canvas, (e) =>
          this._onCanvasMouseUp(e),
        ),
        this._renderer.listen('mousemove', canvas, (e) =>
          this._onCanvasMouseMove(e),
        ),
      ];

      this._cbs.concat(cbs);
    });
  }

  ngOnDestroy(): void {
    this._cbs.forEach((cb) => cb());
  }

  private _onCanvasMouseDown(e: Event) {
    this._sketch.startApplyingTool(0, 0);
  }

  private _onCanvasMouseUp(e: Event) {
    this._sketch.stopApplyingTool();
  }

  private _onCanvasMouseMove(e: Event) {
    this._sketch.moveTool(0, 0);
  }
}
