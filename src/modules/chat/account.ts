import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KeyHelper } from 'signal-protocol';
import * as crypto from 'crypto';
import * as Util from 'util';

const randomBytes = Util.promisify(crypto.randomBytes);

export class Account {
  constructor(private readonly http: AxiosInstance) {}

  public async create(toshiId: string) {
    const URL = '/v1/accounts';
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const registrationId = KeyHelper.generateRegistrationId();

    const passwordBuffer = await crypto.randomBytes(9);
    const password = passwordBuffer.toString('hex');

    const signalingKeyBuffer = await crypto.randomBytes(26);
    const signalingKey = signalingKeyBuffer.toString('hex');

    const authToken = Buffer.from(`${toshiId}:${password}`).toString('base64');
    const Authorization = `Basic ${authToken}`;

    const response = await this.http.put(
      URL,
      { signalingKey, registrationId, fetchesMessages: true },
      { headers: { Authorization } },
    );

    return response;
  }
}
