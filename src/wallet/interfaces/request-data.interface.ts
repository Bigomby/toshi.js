export interface RequestData {
  readonly body: string;
  readonly method: string;
  readonly path: string;
  readonly timestamp: number;
}
