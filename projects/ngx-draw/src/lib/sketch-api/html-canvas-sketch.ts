import { Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { Pen } from './tools';
import { Sketch, Tool } from './types';

const HistorySize = 20;

interface Operation<T> {
  path: number[];
  tool: Tool<T>;
}

export class HTMLCanvasSketch extends Sketch {
  private _tool: Tool<unknown> = new Pen({ thickness: 1, color: 'black' });
  private _ctx: CanvasRenderingContext2D;
  private _toolInUse: boolean = false;
  private _currentPath: number[] = [];
  private _history: Operation<unknown>[] = [];
  private _historyOffset: number = 0;
  private _renderer: Renderer2;
  private _cacheCanvas: HTMLCanvasElement;
  private _cacheCtx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, injector: Injector) {
    super(canvas);

    this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const rendererFactory = injector.get(RendererFactory2);
    this._renderer = rendererFactory.createRenderer(null, null);
    this._cacheCanvas = this._copyCanvas(this._canvas);
    this._cacheCtx = this._cacheCanvas.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
  }

  private get _canvas(): HTMLCanvasElement {
    return this._canvasElement;
  }

  undo(): void {
    if (this._history.length + this._historyOffset === 0) {
      return;
    }

    this._historyOffset--;
    this._applyHistoryChange();
  }

  redo(): void {
    if (this._historyOffset === 0) {
      return;
    }

    this._historyOffset++;
    this._applyHistoryChange();
  }

  exportAsPng(): void {
    throw new Error('Method not implemented.');
  }

  startApplyingTool(x: number, y: number): void {
    this._resetHistory();

    this._toolInUse = true;
    this._tool.start(x, y);
    this._currentPath = [x, y];
  }

  moveTool(x: number, y: number): void {
    if (!this._toolInUse) {
      return;
    }

    this._tool.move(x, y);
    this._currentPath.push(x, y);
  }

  stopApplyingTool(): void {
    this._tool.stop();
    this._toolInUse = false;

    this._addHistoryOperation({
      path: [...this._currentPath],
      tool: this._tool.copy(),
    });

    this._currentPath = [];
  }

  pickTool<T = unknown>(tool: Tool<T>): void {
    this._tool = tool;
    this._tool.setup(this._ctx);
  }

  clear() {
    this._clearCanvas();
    this._clearCacheCanvas();
    this._toolInUse = false;
    this._currentPath = [];
    this._history = [];
  }

  private _clearCanvas() {
    const { width, height } = this._canvas;
    this._ctx.clearRect(0, 0, width, height);
  }

  private _clearCacheCanvas() {
    const { width, height } = this._cacheCanvas;
    this._cacheCtx.clearRect(0, 0, width, height);
  }

  private _copyCanvas(
    source: HTMLCanvasElement,
    dest?: HTMLCanvasElement,
  ): HTMLCanvasElement {
    if (!dest) {
      dest = this._renderer.createElement('canvas') as HTMLCanvasElement;
      dest.width = this._canvas.width;
      dest.height = this._canvas.height;
    }

    const destCtx = dest.getContext('2d');
    destCtx?.drawImage(source, 0, 0);

    return dest;
  }

  private _resetHistory() {
    if (this._historyOffset < 0) {
      const hisLen = this._history.length;
      const opIdx = hisLen + this._historyOffset;

      this._history.splice(opIdx, hisLen);

      this._historyOffset = 0;
    }
  }

  private _addHistoryOperation(op: Operation<unknown>) {
    this._history.push(op);

    if (this._history.length > HistorySize) {
      const first = this._history.shift() as Operation<unknown>;
      this._applyOperation(first, this._cacheCtx);
    }
  }

  private _applyHistoryChange() {
    const opIdx = this._history.length + this._historyOffset;

    this._clearCanvas();
    this._copyCanvas(this._cacheCanvas, this._canvas);

    for (let i = 0; i < opIdx; i += 1) {
      this._applyOperation(this._history[i], this._ctx);
    }
  }

  private _applyOperation(
    op: Operation<unknown>,
    ctx: CanvasRenderingContext2D,
  ) {
    op.tool.setup(ctx);
    op.tool.start(op.path[0], op.path[1]);

    for (let i = 3; i < op.path.length; i += 2) {
      op.tool.move(op.path[i - 1], op.path[i]);
    }

    op.tool.stop();
  }
}
