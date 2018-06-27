import { User } from './user';
import { ServiceClient } from '../../service-client/';

export class Identity extends ServiceClient {
  public readonly user = new User(this.http);
}
