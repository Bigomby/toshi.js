import { ISignalStore } from '../../../signal-account/interfaces/signal-store.interface';
import { SignalAccount } from '../../../signal-account';
import { RequestSigner } from '../../../request-signer';

export interface IChatOptions {
  readonly url: string;
  readonly signalAccount: SignalAccount;
  readonly requestSigner: RequestSigner;
}
