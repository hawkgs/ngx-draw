import { Eraser, Pen, PenColor, PenThickness, ToolType } from './tools';
import { Sketch } from './types';

export class Controller {
  private _currentTool: ToolType = 'pen';

  constructor(private _sketch: Sketch) {
    this.pickPen(1, 'black');
  }

  get currentTool(): ToolType {
    return this._currentTool;
  }

  pickPen(thickness: PenThickness, color: PenColor) {
    const t = new Pen({
      thickness,
      color,
    });
    this._sketch.pickTool(t);
    this._currentTool = 'pen';
  }

  pickEraser() {
    const t = new Eraser();
    this._sketch.pickTool(t);
    this._currentTool = 'eraser';
  }

  undo() {
    this._sketch.undo();
  }

  redo() {
    this._sketch.redo();
  }

  exportAsPng() {
    this._sketch.exportAsPng();
  }
}
