import { HTMLCanvasSketch } from './html-canvas-sketch';
import { ToolController } from './tools';
import { Sketch } from './types';

export const createSketchFactory = (
  canvas: HTMLCanvasElement,
): { sketch: Sketch; ctrl: ToolController } => {
  const sketch = new HTMLCanvasSketch(canvas);
  const ctrl = new ToolController(sketch);

  return {
    sketch,
    ctrl,
  };
};
