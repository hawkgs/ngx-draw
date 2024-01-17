import { Tool } from './types';

export type PenThickness = 1 | 2 | 3 | 4 | 5;
export type PenColor = 'green' | 'red' | 'blue' | 'black' | 'yellow';
export type ToolType = 'pen' | 'eraser';

const ColorMap: { [key in PenColor]: string } = {
  green: '#57a31d',
  red: '#eb4034',
  black: '#171717',
  blue: '#125cc4',
  yellow: '#ffc400',
};

const EraserThickness = 10;

export interface PenConfig {
  thickness: PenThickness;
  color: PenColor;
}

export class Pen implements Tool<PenConfig> {
  readonly type: ToolType = 'pen';
  private _ctx!: CanvasRenderingContext2D;
  private _lastPt: [number, number] = [0, 0];

  constructor(public config: PenConfig) {}

  setup(ctx: CanvasRenderingContext2D): void {
    this._ctx = ctx;

    this._ctx.lineWidth = this.config.thickness;
    this._ctx.strokeStyle = ColorMap[this.config.color];
    this._ctx.lineCap = 'round';
    this._ctx.lineJoin = 'round';
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

  copy(): Tool<PenConfig> {
    return new Pen({
      color: this.config.color,
      thickness: this.config.thickness,
    });
  }
}

export class Eraser implements Tool<void> {
  readonly type: ToolType = 'eraser';
  readonly config: void = undefined;
  private _ctx!: CanvasRenderingContext2D;
  private _lastPt: [number, number] = [0, 0];

  setup(ctx: CanvasRenderingContext2D): void {
    this._ctx = ctx;

    this._ctx.lineWidth = EraserThickness;
    this._ctx.lineCap = 'round';
    this._ctx.lineJoin = 'round';
  }

  start(x: number, y: number): void {
    this._ctx.globalCompositeOperation = 'destination-out';
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

  stop(): void {
    this._ctx.globalCompositeOperation = 'source-over';
  }

  copy(): Tool<void> {
    return new Eraser();
  }
}
