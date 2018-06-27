import { Account } from './account';
import { ServiceClient } from '../../service-client/';

export class Chat extends ServiceClient {
  public readonly account = new Account(this.http);
}
