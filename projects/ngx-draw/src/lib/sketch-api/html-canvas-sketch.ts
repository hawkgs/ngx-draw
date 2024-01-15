import { Pen } from './tools';
import { Sketch, Tool } from './types';

interface Operation<T> {
  path: number[][];
  tool: Tool<T>;
}

// class Operations<T> {
//   private _operations: Operation<T>[] = [];

//   add(o: Operation<T>) {
//     this._operations.push(o);
//   }
// }

export class HTMLCanvasSketch extends Sketch {
  private _tool: Tool<unknown> = new Pen({ thickness: 1, color: 'black' });
  private _ctx: CanvasRenderingContext2D;
  private _toolInUse: boolean = false;
  private _currentPath: number[][] = [];
  private _operations: Operation<unknown>[] = [];
  private _canvasState!: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  private get _canvas(): HTMLCanvasElement {
    return this._canvasElement;
  }

  undo(): void {
    throw new Error('Method not implemented.');
  }

  redo(): void {
    throw new Error('Method not implemented.');
  }

  exportAsPng(): void {
    throw new Error('Method not implemented.');
  }

  startApplyingTool(x: number, y: number): void {
    this._toolInUse = true;
    this._currentPath = [[x, y]];
    this._tool.start(x, y);
  }

  moveTool(x: number, y: number): void {
    if (!this._toolInUse) {
      return;
    }
    this._currentPath.push([x, y]);
    this._tool.move(x, y);
  }

  stopApplyingTool(): void {
    this._toolInUse = false;
    this._currentPath = [];
    this._operations.push({
      path: this._currentPath,
      tool: this._tool,
    });
  }

  pickTool<T = unknown>(tool: Tool<T>): void {
    this._tool = tool;
    this._tool.setContext(this._ctx);
  }
}
