import axios from 'axios';

import { Account } from './account';
import { ServiceClient } from '../../service-client/';
import { RequestSigner } from '../../request-signer';
import { IChatOptions } from './interfaces/chat-options.interface';
import { Message } from './messages';
import { Keys } from './keys';

export class Chat extends ServiceClient {
  public readonly account: Account;
  public readonly message: Message;
  public readonly keys: Keys;

  constructor(options: IChatOptions) {
    super(options.requestSigner, options);

    this.account = new Account(this.http, options.signalAccount);
    this.message = new Message(this.http, options.signalAccount);
    this.keys = new Keys(
      axios.create({ baseURL: options.url }),
      options.signalAccount,
    );
  }
}
