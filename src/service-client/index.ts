import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Wallet } from '../wallet';
import { ClientOptions } from '../options';
import { AxiosInterceptor } from '../request-signer';

export abstract class ServiceClient {
  constructor(
    private readonly requestSignerInterceptor: AxiosInterceptor,
    private readonly options: ClientOptions,
    protected readonly http = axios.create({ baseURL: options.url }),
  ) {
    http.interceptors.request.use(requestSignerInterceptor);
  }
}
