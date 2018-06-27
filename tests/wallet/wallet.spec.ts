import { Wallet } from '../../src/wallet';

const MNEMONIC =
  'false hen huge trumpet begin lyrics power daring zebra danger tonight gold';
const ADDRESS = '0xcab1bf54c25f2cb1e9da715d2f453aeb0dc33fc2';

describe('Wallet', () => {
  it('should create Wallet from valid mnemonic', () => {
    expect(() => Wallet.fromMnemonic(MNEMONIC)).not.toThrow();
  });

  it('Fail to create Wallet from invalid mnemonic', () => {
    expect(() => Wallet.fromMnemonic('all your base are belong to us')).toThrow(
      'Invalid BIP39 mnemonic',
    );
  });

  it('should get address from wallet', () => {
    const wallet = Wallet.fromMnemonic(MNEMONIC);
    expect(wallet.getAddress()).toEqual(ADDRESS);
  });

  it('should sign payload', () => {
    const wallet = Wallet.fromMnemonic(MNEMONIC);
    const payload =
      'POST\n/v1/user\n1480078657\nto5m3Kmk6z9OZI/Kb+/yabcfDKl47nSuspAtxnFaQsA=';
    const signature = wallet.signPayload(payload);

    expect(signature).toEqual(
      '0xc073c461219c10d855aca203003f72944510a57f1ca60e4bbb627a1305ad57a21884162d5788b5188ba596122028a7092527cdf370d3af435f7d440f52197fa900',
    );
  });
});
