import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
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

const DefaultConfig: NgxDrawConfig = {
  width: 800,
  height: 600,
};

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
export class DrawComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  @Input() config?: NgxDrawConfig;
  public controller$ = new Subject<Controller>();

  private _sketch!: Sketch;
  private _cbs: (() => void)[] = [];
  private _controller?: Controller;

  cfg!: NgxDrawConfig;

  constructor(private _renderer: Renderer2, private _zone: NgZone) {}

  ngOnInit(): void {
    this.cfg = { ...DefaultConfig, ...(this.config ? this.config : {}) };
  }

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

  private _onCanvasMouseDown(e: MouseEvent) {
    this._sketch.startApplyingTool(e.clientX, e.clientY);
  }

  private _onCanvasMouseUp(e: Event) {
    this._sketch.stopApplyingTool();
  }

  private _onCanvasMouseMove(e: MouseEvent) {
    this._sketch.moveTool(e.clientX, e.clientY);
  }
}
