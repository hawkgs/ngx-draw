import { Sketch, Tool } from './types';

type PenThickness = 1 | 2 | 3 | 4 | 5;
type PenColor = 'green' | 'red' | 'blue' | 'black';

export interface PenConfig {
  thickness: PenThickness;
  color: PenColor;
}

export class Pen implements Tool<PenConfig> {
  type: string = 'pen';

  constructor(public config: PenConfig) {}
}

export class Eraser implements Tool<void> {
  type: string = 'pen';
  config: void = undefined;
}

export class ToolController {
  constructor(private _sketch: Sketch) {}

  pickPen(thickness: PenThickness, color: PenColor) {
    const t = new Pen({
      thickness,
      color,
    });
    this._sketch.pickTool(t);
  }

  pickEraser() {
    const t = new Eraser();
    this._sketch.pickTool(t);
  }
}
