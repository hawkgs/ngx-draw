import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Sketch } from '../sketch-api/types';
import { createSketchFactory } from '../sketch-api/sketch-factory';
import { Controller } from '../sketch-api/controller';
import { Subject } from 'rxjs';

export interface NgxDrawConfig {
  width: number;
  height: number;
}

@Component({
  selector: 'ngx-draw',
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'ngxDrawRef',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'ngx-draw',
  },
})
export class DrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  @Input() config!: NgxDrawConfig;
  public controller$ = new Subject<Controller>();

  private _sketch!: Sketch;
  private _cbs: (() => void)[] = [];
  private _controller?: Controller;

  constructor(private _renderer: Renderer2, private _zone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;

    const { sketch, ctrl } = createSketchFactory(canvas);
    this._sketch = sketch;
    this._controller = ctrl;

    setTimeout(() => {
      this.controller$.next(ctrl);
    });

    this._zone.runOutsideAngular(() => {
      const cbs = [
        this._renderer.listen(canvas, 'mousedown', (e) =>
          this._onCanvasMouseDown(e),
        ),
        this._renderer.listen(canvas, 'mouseup', (e) =>
          this._onCanvasMouseUp(e),
        ),
        this._renderer.listen(canvas, 'mousemove', (e) =>
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
