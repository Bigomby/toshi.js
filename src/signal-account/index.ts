import {
  KeyHelper,
  SessionBuilder,
  SignalProtocolAddress,
} from 'signal-protocol';
import * as crypto from 'crypto';

import { ISignalStore } from './interfaces/signal-store.interface';
import { MemorySignalStore } from './stores/memory-signal-store';
import { IKeyPair } from './interfaces/keypair.interface';
import { PreKey } from './interfaces/prekey.interface';

interface ISignedPreKey {
  readonly keyId: number;
  readonly keyPair: {
    readonly pubKey: ArrayBuffer;
    readonly privKey: ArrayBuffer;
  };
  readonly signature: ArrayBuffer;
}

const PASSWORD_LENGTH = 18;
const SIGNALING_LENGTH = 52;

export class SignalAccount {
  private constructor(private readonly store: ISignalStore<any>) {}

  public static async fromStore(
    store: ISignalStore<any>,
  ): Promise<SignalAccount> {
    return new SignalAccount(store);
  }

  public static async bootstrap(
    store: ISignalStore<any> = new MemorySignalStore(),
  ): Promise<SignalAccount> {
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const registrationId = await KeyHelper.generateRegistrationId();
    const password = crypto.randomBytes(PASSWORD_LENGTH);
    const signalingKey = crypto.randomBytes(SIGNALING_LENGTH);

    const preKey = await KeyHelper.generatePreKey(1);
    const signedPreKey: ISignedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      1,
    );

    store.saveIdentityKeyPair(identityKeyPair);
    store.saveLocalRegistrationId(registrationId);
    store.savePassword(password.toString('base64'));
    store.saveSignalingKey(signalingKey.toString('base64'));
    store.storePreKey(preKey.keyId, preKey.keyPair);
    store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);

    return new SignalAccount(store);
  }

  public async getSignalingKey(): Promise<string> {
    const signalingKey = await this.store.getSignalingKey();
    if (!signalingKey) {
      throw Error('Cannot get "signalingKey" from store');
    }

    return signalingKey;
  }

  public async getRegistrationId(): Promise<string> {
    const registrationId = await this.store.getLocalRegistrationId();
    if (!registrationId) {
      throw Error('Cannot get "registrationId" from store');
    }

    return registrationId;
  }

  public async getPassword(): Promise<string> {
    const password = await this.store.getPassword();
    if (!password) {
      throw Error('Cannot get "password" from store');
    }

    return password;
  }

  public async newSession(recipientId: any, deviceId: any, preKey: PreKey) {
    const address = new SignalProtocolAddress(recipientId, deviceId);
    const sessionBuilder = new SessionBuilder(this.store, address);

    await sessionBuilder.processPreKey(preKey);
  }
}
