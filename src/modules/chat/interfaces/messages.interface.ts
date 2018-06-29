export interface IMessage {
  readonly type: number;
  readonly destination: string;
  readonly destinationDeviceId: number;
  readonly destinationRegistrationId: number;
  readonly body: string;
  readonly content: string;
  readonly relay?: string;
  readonly timestamp: number;
}
