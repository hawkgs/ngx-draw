import { HTMLCanvasSketch } from './html-canvas-sketch';
import { Controller } from './controller';
import { Sketch } from './types';
import { Injector } from '@angular/core';

export const createSketchFactory = (
  canvas: HTMLCanvasElement,
  injector: Injector,
): { sketch: Sketch; ctrl: Controller } => {
  const sketch = new HTMLCanvasSketch(canvas, injector);
  const ctrl = new Controller(sketch);

  return {
    sketch,
    ctrl,
  };
};
