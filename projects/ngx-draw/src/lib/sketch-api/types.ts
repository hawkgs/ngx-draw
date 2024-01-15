type CanvasElement = HTMLCanvasElement;
type CanvasContext = CanvasRenderingContext2D;

export interface Tool<T> {
  type: string;
  config: T;

  setup(ctx: CanvasContext): void;
  start(x: number, y: number): void;
  move(x: number, y: number): void;
  stop(): void;
  copy(): Tool<T>;
}

export abstract class Sketch {
  constructor(protected _canvasElement: CanvasElement) {}

  abstract undo(): void;
  abstract redo(): void;
  abstract clear(): void;
  abstract exportAsPng(): void;
  abstract startApplyingTool(x: number, y: number): void;
  abstract moveTool(x: number, y: number): void;
  abstract stopApplyingTool(): void;
  abstract pickTool<T = unknown>(tool: Tool<T>): void;
}
