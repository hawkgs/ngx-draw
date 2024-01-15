export interface Tool<T> {
  type: string;
  config: T;
}

type CanvasElement = HTMLCanvasElement;

export abstract class Sketch {
  constructor(protected _canvasElement: CanvasElement) {}

  abstract undo(): void;
  abstract redo(): void;
  abstract exportAsPng(): void;
  abstract startApplyingTool(x: number, y: number): void;
  abstract moveTool(x: number, y: number): void;
  abstract stopApplyingTool(): void;
  abstract pickTool<T = unknown>(tool: Tool<T>): void;
}
