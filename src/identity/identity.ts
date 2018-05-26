import { ToshiWallet } from '../toshi-wallet';
import { IRegisterUserResponse } from './dtos/register-user-response.dto';
import { IRegisterUser } from './dtos/register-user.dto';
import axios from 'axios';

export class Identity {
  constructor(
    private readonly url: string,
    private readonly wallet: ToshiWallet,
  ) {}

  public async getUser(user: string) {
    const path = `/v1/user/${user}`;
    const { data } = await axios.get(`${this.url}${path}`);

    return data;
  }

  public async registerUser(
    registerUser?: IRegisterUser,
  ): Promise<IRegisterUserResponse> {
    const path = '/v2/user';
    let headers;
    let data;

    if (!registerUser) {
      headers = this.buildHeaders('', path, 'POST');
      ({ data } = await axios.post(`${this.url}${path}`, '', { headers }));

      return data;
    }

    const body = {
      description: registerUser.description,
      name: registerUser.name,
      username: registerUser.username,
      paymentAddress: registerUser.paymentAddress,
    };

    headers = this.buildHeaders(JSON.stringify(body), path, 'POST');
    ({ data } = await axios.post(`${this.url}${path}`, body, { headers }));

    return data;
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private buildHeaders(body: string, path: string, method: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = ToshiWallet.buildPayload(body, method, path, timestamp);
    const signature = this.wallet.signPayload(payload);

    return {
      'Content-Type': 'application/json',
      'Toshi-ID-Address': this.wallet.getAddress(),
      'Toshi-Signature': signature,
      'Toshi-Timestamp': timestamp,
    };
  }
}
