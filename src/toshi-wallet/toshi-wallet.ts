import { Buffer } from 'buffer';
import { keccak256 } from 'js-sha3';
import { RequestData } from './interfaces/request-data.interface';
import * as secp256k1 from 'secp256k1';
import * as HDkey from 'ethereumjs-wallet/hdkey';
import * as HDWallet from 'ethereumjs-wallet';
import * as BIP39 from 'bip39';

export class ToshiWallet {
  private constructor(private readonly wallet: any) {}

  public static fromMnemonic(mnemonic: string) {
    if (!BIP39.validateMnemonic(mnemonic)) {
      throw Error('Invalid BIP39 mnemonic');
    }

    const seed: Buffer = BIP39.mnemonicToSeed(mnemonic);
    const wallet = HDkey.fromMasterSeed(seed).getWallet();

    return new ToshiWallet(wallet);
  }

  public static fromPrivateKey(privateKey: Buffer) {
    const wallet = HDWallet.fromPrivateKey(privateKey);

    return new ToshiWallet(wallet);
  }

  public static generate() {
    const wallet = HDWallet.generate();

    return new ToshiWallet(wallet);
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

  /**
   * CREATING THE PAYLOAD FOR SIGNING
   *
   * 1. If your request has no body skip to step 4.
   * 2. Take the body of your request and hash it with KECCAK-256.
   * 3. Base64 encode the result of Step 2 as a string.
   * 4. Get the request verb of the request (e.g. GET, POST, etc) as a string.
   * 5. Get the path of the request as a string.
   * 6. Get a unix timestamp representing the current time as a string.
   * 7. Take the results of steps 3-6 and concatenate them as follows:
   *
   *        {VERB}\n{PATH}\n{TIMESTAMP}\n{HASH}
   */
  public static buildPayload(
    body: string,
    method: string,
    path: string,
    timestamp: number,
  ): string {
    let encodedBody = '';

    if (body) {
      const hash = keccak256(body);
      encodedBody = Buffer.from(hash, 'hex').toString('base64');
    }

    return `${method}\n${path}\n${timestamp}\n${encodedBody}`;
  }
}
