import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
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

const CanvasMultiplicationFactor = 2;

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
  private _offset: { x: number; y: number } = { x: 0, y: 0 };

  cfg!: NgxDrawConfig;
  CMF = CanvasMultiplicationFactor;

  constructor(
    private _renderer: Renderer2,
    private _injector: Injector,
    private _zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.cfg = { ...DefaultConfig, ...(this.config ? this.config : {}) };
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;

    const { sketch, ctrl } = createSketchFactory(canvas, this._injector);
    this._sketch = sketch;

    // Note(Georgi): A change happening after the component has been checked (i.e. ngx-controls-bar)
    setTimeout(() => {
      this.controller$.next(ctrl);
    });

    this._zone.runOutsideAngular(() => {
      const cbs = [
        this._renderer.listen(canvas, 'mousedown', (e) =>
          this._onCanvasMouseDown(e),
        ),
        this._renderer.listen(canvas, 'mousemove', (e) =>
          this._onCanvasMouseMove(e),
        ),
        this._renderer.listen(canvas, 'mouseup', () => this._onCanvasMouseUp()),
      ];

      this._cbs.concat(cbs);
    });
  }

  ngOnDestroy(): void {
    this._cbs.forEach((cb) => cb());
  }

  private _onCanvasMouseDown(e: MouseEvent) {
    const { x, y } = (
      this.canvas.nativeElement as HTMLElement
    ).getBoundingClientRect();
    this._offset = { x, y };

    this._sketch.startApplyingTool(
      (e.clientX - x) * this.CMF,
      (e.clientY - y) * this.CMF,
    );
  }

  private _onCanvasMouseUp() {
    this._sketch.stopApplyingTool();
  }

  private _onCanvasMouseMove(e: MouseEvent) {
    this._sketch.moveTool(
      (e.clientX - this._offset.x) * this.CMF,
      (e.clientY - this._offset.y) * this.CMF,
    );
  }
}
