import { Injector, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Pen } from './tools';
import { Sketch, Tool } from './types';

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

  constructor(canvas: HTMLCanvasElement, injector: Injector) {
    super(canvas);

    this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const rendererFactory = injector.get(RendererFactory2);
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  private get _canvas(): HTMLCanvasElement {
    return this._canvasElement;
  }

  undo(): void {
    if (this._history.length + this._historyOffset === 0) {
      return;
    }

    this._historyOffset--;
    const opIdx = this._history.length + this._historyOffset;

    this._clearCanvas();

    for (let i = 0; i < opIdx; i += 1) {
      this._applyOperation(this._history[i]);
    }
  }

  redo(): void {
    if (this._historyOffset === 0) {
      return;
    }

    this._historyOffset++;
    const opIdx = this._history.length + this._historyOffset;

    this._clearCanvas();

    for (let i = 0; i < opIdx; i += 1) {
      this._applyOperation(this._history[i]);
    }
  }

  exportAsPng(): void {
    throw new Error('Method not implemented.');
  }

  startApplyingTool(x: number, y: number): void {
    if (this._historyOffset < 0) {
      const hisLen = this._history.length;
      const opIdx = hisLen + this._historyOffset;

      this._history.splice(opIdx, hisLen);

      this._historyOffset = 0;
    }

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

    this._history.push({
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
    this._toolInUse = false;
    this._currentPath = [];
    this._history = [];
  }

  private _clearCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private _applyOperation(op: Operation<unknown>) {
    op.tool.setup(this._ctx);
    op.tool.start(op.path[0], op.path[1]);

    for (let i = 3; i < op.path.length; i += 2) {
      op.tool.move(op.path[i - 1], op.path[i]);
    }

    op.tool.stop();
  }
}
