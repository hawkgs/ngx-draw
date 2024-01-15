type CanvasElement = HTMLCanvasElement;
type CanvasContext = CanvasRenderingContext2D;

export interface Tool<T> {
  type: string;
  config: T;

  setContext(ctx: CanvasContext): void;
  start(x: number, y: number): void;
  move(x: number, y: number): void;
  stop(): void;
}

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
