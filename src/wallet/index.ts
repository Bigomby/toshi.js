import { Buffer } from 'buffer';
import { keccak256 } from 'js-sha3';
import { RequestData } from './interfaces/request-data.interface';
import * as secp256k1 from 'secp256k1';
import * as HDkey from 'ethereumjs-wallet/hdkey';
import * as HDWallet from 'ethereumjs-wallet';
import * as BIP39 from 'bip39';

export class Wallet {
  private constructor(private readonly wallet: any) {}

  public static fromMnemonic(mnemonic: string) {
    if (!BIP39.validateMnemonic(mnemonic)) {
      throw Error('Invalid BIP39 mnemonic');
    }

    const seed: Buffer = BIP39.mnemonicToSeed(mnemonic);
    const wallet = HDkey.fromMasterSeed(seed).getWallet();

    return new Wallet(wallet);
  }

  public static fromPrivateKey(privateKey: Buffer | string) {
    const wallet = HDWallet.fromPrivateKey(privateKey);

    return new Wallet(wallet);
  }

  public static generate() {
    const wallet = HDWallet.generate();

    return new Wallet(wallet);
  }

  public getAddress(): string {
    return '0x' + this.wallet.getAddress().toString('hex');
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  /**
   * SIGNING THE PAYLOAD
   *
   * 1. Hash the payload with Keccak-256 encoding.
   * 2. Sign the encoded payload with a private key using recoverable ECDSA.
   * 3. Serialize and convert the result from step 2 to a hex string.
   */
  public signPayload(payload: string): string {
    const hash = keccak256(payload);
    const buffer = Buffer.from(hash, 'hex');
    const obj = secp256k1.sign(buffer, this.wallet.getPrivateKey());

    return (
      '0x' +
      obj.signature.toString('hex') +
      obj.recovery.toString().padStart(2, '0')
    );
  }
}
