import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KeyHelper } from 'signal-protocol';
import * as crypto from 'crypto';
import * as Util from 'util';

import { SignalAccount } from '../../signal-account';

const randomBytes = Util.promisify(crypto.randomBytes);

export class Account {
  constructor(
    private readonly http: AxiosInstance,
    private readonly signalAccount: SignalAccount,
  ) {}

  public async register(toshiId: string) {
    const url = '/v1/accounts';
    const headers = await this.generateAuthHeader(toshiId);
    const accountAttributes = await this.generateAccountAttributes();

    const response = await this.http.put(url, accountAttributes, { headers });

    return response;
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private async generateAccountAttributes(): Promise<object> {
    return {
      signalingKey: await this.signalAccount.getSignalingKey(),
      registrationId: await this.signalAccount.getRegistrationId(),
      fetchesMessages: true,
    };
  }

  private async generateAuthHeader(toshiId: string): Promise<object> {
    const auth = Buffer.from(
      `${toshiId}:${await this.signalAccount.getPassword()}`,
    );
    return { Authorization: `Basic ${auth.toString('base64')}` };
  }
}
