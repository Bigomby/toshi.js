import { ISignalStore } from '../interfaces/signal-store.interface';
import { IKeyPair } from '../interfaces/keypair.interface';

export class MemorySignalStore<S> implements ISignalStore<S> {
  private signalingKey: string | undefined;
  private password: string | undefined;
  private identityKeyPair: IKeyPair | undefined;
  private localRegistrationId: string | undefined;
  private readonly identityKeys = new Map<string, ArrayBuffer>();
  private readonly preKeys = new Map<string, IKeyPair>();
  private readonly signedPreyKeys = new Map<number, IKeyPair>();
  private readonly sessions = new Map<string, S>();

  public async getSignalingKey(): Promise<string | undefined> {
    return this.signalingKey;
  }

  public async saveSignalingKey(signalingKey: string): Promise<void> {
    this.signalingKey = signalingKey;
  }

  public async getPassword(): Promise<string | undefined> {
    return this.password;
  }

  public async savePassword(password: string): Promise<void> {
    this.password = password;
  }

  public async getIdentityKeyPair(): Promise<IKeyPair | undefined> {
    return this.identityKeyPair;
  }

  public async saveIdentityKeyPair(identityKeyPair: IKeyPair) {
    this.identityKeyPair = identityKeyPair;
  }

  public async getLocalRegistrationId(): Promise<string | undefined> {
    return this.localRegistrationId;
  }

  public async saveLocalRegistrationId(
    localRegistrationId: string,
  ): Promise<void> {
    this.localRegistrationId = localRegistrationId;
  }

  public async isTrustedIdentity(
    id: string,
    identityKey: ArrayBuffer,
  ): Promise<Boolean> {
    const k = this.identityKeys.get(id);
    if (!k) {
      return false;
    }

    return identityKey.toString() === k.toString();
  }

  public async loadIdentityKey(
    identifier: string,
  ): Promise<ArrayBuffer | undefined> {
    return this.identityKeys.get(identifier);
  }

  public async saveIdentity(identifier: string, identityKey: ArrayBuffer) {
    this.identityKeys.set(identifier, identityKey);
  }

  public async loadPreKey(id: string): Promise<ArrayBuffer | undefined> {
    return this.identityKeys.get(id);
  }

  public async storePreKey(id: string, keyPair: IKeyPair): Promise<void> {
    this.preKeys.set(id, keyPair);
  }

  public async removePreKey(id: string): Promise<void> {
    this.preKeys.delete(id);
  }

  public async loadSignedPreKey(id: number): Promise<IKeyPair | undefined> {
    return this.signedPreyKeys.get(id);
  }

  public async storeSignedPreKey(id: number, keyPair: IKeyPair): Promise<void> {
    this.signedPreyKeys.set(id, keyPair);
  }

  public async removeSignedPreKey(id: number): Promise<void> {
    this.signedPreyKeys.delete(id);
  }

  public async loadSession(id: string): Promise<S | undefined> {
    return this.sessions.get(id);
  }

  public async storeSession(id: string, session: S): Promise<void> {
    this.sessions.set(id, session);
  }

  public async removeSession(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  public async removeAllSessions(id: string): Promise<void> {
    this.sessions.clear();
  }
}
