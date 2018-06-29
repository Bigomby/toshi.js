import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { SignalAccount } from '../../signal-account';
import { IMessage } from './interfaces/messages.interface';

export class Message {
  constructor(
    private readonly http: AxiosInstance,
    private readonly signalAccount: SignalAccount,
  ) {}

  public async send(toshiId: string, destination: string, message: IMessage) {
    const url = `/v1/messages/${destination}`;
    const headers = await this.generateAuthHeader(toshiId);

    return await this.http.put(url, { messages: [message] }, { headers });
  }

  private async generateAuthHeader(toshiId: string): Promise<object> {
    const auth = Buffer.from(
      `${toshiId}:${await this.signalAccount.getPassword()}`,
    );
    return { Authorization: `Basic ${auth.toString('base64')}` };
  }
}
