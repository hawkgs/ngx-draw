import { Sketch, Tool } from './types';

export class HTMLCanvasSketch extends Sketch {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
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
    throw new Error('Method not implemented.');
  }

  moveTool(x: number, y: number): void {}

  stopApplyingTool(): void {}

  pickTool<T = unknown>(tool: Tool<T>): void {
    throw new Error('Method not implemented.');
  }
}
