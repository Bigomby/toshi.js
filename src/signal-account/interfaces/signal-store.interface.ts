import { IKeyPair } from './keypair.interface';

export interface ISignalStore<S> {
  getPassword(): Promise<string | undefined>;
  savePassword(password: string): Promise<void>;
  getSignalingKey(): Promise<string | undefined>;
  saveSignalingKey(signalingKey: string): Promise<void>;
  getIdentityKeyPair(): Promise<IKeyPair | undefined>;
  saveIdentityKeyPair(keyPair: IKeyPair): Promise<void>;
  getLocalRegistrationId(): Promise<string | undefined>;
  saveLocalRegistrationId(registrationId: string): Promise<void>;
  isTrustedIdentity(id: string, identityKey: ArrayBuffer): Promise<Boolean>;
  loadIdentityKey(id: string): Promise<ArrayBuffer | undefined>;
  saveIdentity(id: string, identityKey: ArrayBuffer);
  loadPreKey(id: string): Promise<ArrayBuffer | undefined>;
  storePreKey(id: string, keyPair: IKeyPair): void;
  removePreKey(id: string): void;
  loadSignedPreKey(id: number): Promise<IKeyPair | undefined>;
  storeSignedPreKey(id: number, keyPair: IKeyPair): void;
  removeSignedPreKey(id: number): void;
  loadSession(id: string): Promise<S | undefined>;
  storeSession(id: string, session: S): void;
  removeSession(id: string): void;
  removeAllSessions(id: string): void;
}
