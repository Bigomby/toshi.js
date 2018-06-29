import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SignalAccount } from '../../signal-account';

export class Keys {
  constructor(
    private readonly http: AxiosInstance,
    private readonly signalAccount: SignalAccount,
  ) {}

  public async get(toshiId: string) {
    const url = '/v2/keys';
    const headers = await this.generateAuthHeader(toshiId);

    return await this.http.get(url, { headers });
  }

  public async getBundle(
    toshiId: string,
    address: string,
    deviceId: string = '*',
  ) {
    const url = `/v2/keys/${address}/${deviceId}`;
    const headers = await this.generateAuthHeader(toshiId);
    const response = await this.http.get(url, { headers });

    return response;
  }

  private async generateAuthHeader(toshiId: string): Promise<object> {
    const auth = Buffer.from(
      `${toshiId}:${await this.signalAccount.getPassword()}`,
    );
    return { Authorization: `Basic ${auth.toString('base64')}` };
  }
}
