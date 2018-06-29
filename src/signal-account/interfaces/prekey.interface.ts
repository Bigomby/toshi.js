export interface PreKey {
  registrationId: number;
  identityKey: ArrayBuffer;
  signedPreKey: {
    keyId: number;
    publicKey: ArrayBuffer;
    signature: ArrayBuffer;
  };
  preKey: {
    keyId: number;
    publicKey: ArrayBuffer;
  };
}
