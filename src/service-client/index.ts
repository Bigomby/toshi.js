import axios from 'axios';

import { Wallet } from '../wallet';
import { RequestSigner } from '../request-signer';

export abstract class ServiceClient {
  constructor(
    private readonly requestSigner: RequestSigner,
    private readonly options: any,
    protected readonly http = axios.create({ baseURL: options.url }),
  ) {
    http.interceptors.request.use(requestSigner.getInterceptor());
  }
}
