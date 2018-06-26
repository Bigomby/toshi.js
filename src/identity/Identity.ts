import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { User } from './user';
import { Options } from './interfaces/Options.interface';
import { ToshiWallet } from '../toshi-wallet';

export class Identity {
  public readonly user: User;
  private readonly http: AxiosInstance;

  constructor(
    private readonly wallet: ToshiWallet,
    private readonly options: Options,
  ) {
    const requestSignerInterceptor = buildRequestSignerInterceptor(this.wallet);

    this.http = axios.create({
      baseURL: options.url,
      headers: { 'Content-Type': 'application/json' },
    });
    this.http.interceptors.request.use(requestSignerInterceptor);
    this.user = new User(this.http);
  }
}

function getUnixTimestamp(date: number) {
  return Math.floor(date / 1000);
}

function buildRequestSignerInterceptor(wallet: ToshiWallet) {
  return (config: AxiosRequestConfig): AxiosRequestConfig => {
    const timestamp = getUnixTimestamp(Date.now());
    const payload = ToshiWallet.buildPayload(
      JSON.stringify(config.data),
      config.method.toUpperCase(),
      config.url,
      timestamp,
    );
    const signature = wallet.signPayload(payload);

    config.headers['Toshi-ID-Address'] = wallet.getAddress();
    config.headers['Toshi-Signature'] = signature;
    config.headers['Toshi-Timestamp'] = timestamp;

    return config;
  };
}
