import axios, { AxiosRequestConfig } from 'axios';
import { Wallet } from '../wallet';
import { keccak256 } from 'js-sha3';

export type AxiosInterceptor = (
  config: AxiosRequestConfig,
) => AxiosRequestConfig;

export class RequestSigner {
  constructor(private readonly wallet: Wallet) {}

  public getInterceptor(): AxiosInterceptor {
    return (config: AxiosRequestConfig): AxiosRequestConfig => {
      const timestamp = this.getUnixTimestamp(Date.now());
      const payload = this.buildPayload(
        JSON.stringify(config.data),
        config.method.toUpperCase(),
        config.url,
        timestamp,
      );
      const signature = this.wallet.signPayload(payload);

      config.headers['Toshi-ID-Address'] = this.wallet.getAddress();
      config.headers['Toshi-Signature'] = signature;
      config.headers['Toshi-Timestamp'] = timestamp;

      return config;
    };
  }

  private getUnixTimestamp(date: number) {
    return Math.floor(date / 1000);
  }

  /**
   * CREATING THE PAYLOAD FOR SIGNING
   *
   * 1. If your request has no body skip to step 4.
   * 2. Take the body of your request and hash it with KECCAK-256.
   * 3. Base64 encode the result of Step 2 as a string.
   * 4. Get the request verb of the request (e.g. GET, POST, etc) as a string.
   * 5. Get the path of the request as a string.
   * 6. Get a unix timestamp representing the current time as a string.
   * 7. Take the results of steps 3-6 and concatenate them as follows:
   *
   *        {VERB}\n{PATH}\n{TIMESTAMP}\n{HASH}
   */
  private buildPayload(
    body: string,
    method: string,
    path: string,
    timestamp: number,
  ): string {
    let encodedBody = '';

    if (body) {
      const hash = keccak256(body);
      encodedBody = Buffer.from(hash, 'hex').toString('base64');
    }

    return `${method}\n${path}\n${timestamp}\n${encodedBody}`;
  }
}
