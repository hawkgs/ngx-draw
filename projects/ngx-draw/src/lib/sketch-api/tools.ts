import { Tool } from './types';

export type PenThickness = 1 | 2 | 3 | 4 | 5;
export type PenColor = 'green' | 'red' | 'blue' | 'black';
export type ToolType = 'pen' | 'eraser';

const ColorMap: { [key in PenColor]: string } = {
  green: 'green',
  red: '#f00',
  black: '#000',
  blue: 'blue',
};

export interface PenConfig {
  thickness: PenThickness;
  color: PenColor;
}

export class Pen implements Tool<PenConfig> {
  readonly type: ToolType = 'pen';
  private _ctx!: CanvasRenderingContext2D;
  private _lastPt: [number, number] = [0, 0];

  constructor(public config: PenConfig) {}

  setContext(ctx: CanvasRenderingContext2D): void {
    this._ctx = ctx;
    this._ctx.lineWidth = this.config.thickness;
    this._ctx.strokeStyle = ColorMap[this.config.color];
  }

  start(x: number, y: number): void {
    this._ctx.beginPath();
    this._lastPt = [x, y];
  }

  move(x: number, y: number): void {
    const [lastX, lastY] = this._lastPt;
    this._ctx.moveTo(lastX, lastY);
    this._ctx.lineTo(x, y);
    this._ctx.stroke();

    this._lastPt = [x, y];
  }

  stop(): void {}
}

export class Eraser implements Tool<void> {
  setContext(ctx: CanvasRenderingContext2D): void {
    throw new Error('Method not implemented.');
  }
  start(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  move(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  stop(): void {
    throw new Error('Method not implemented.');
  }
  readonly type: ToolType = 'eraser';
  readonly config: void = undefined;
}
