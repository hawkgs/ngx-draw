import { HTMLCanvasSketch } from './html-canvas-sketch';
import { Controller } from './controller';
import { Sketch } from './types';

export const createSketchFactory = (
  canvas: HTMLCanvasElement,
): { sketch: Sketch; ctrl: Controller } => {
  const sketch = new HTMLCanvasSketch(canvas);
  const ctrl = new Controller(sketch);

  return {
    sketch,
    ctrl,
  };
};
