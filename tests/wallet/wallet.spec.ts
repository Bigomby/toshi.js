import { ToshiWallet } from '../../src/toshi-wallet';

const MNEMONIC =
  'false hen huge trumpet begin lyrics power daring zebra danger tonight gold';
const ADDRESS = '0xcab1bf54c25f2cb1e9da715d2f453aeb0dc33fc2';

describe('Toshi Wallet', () => {
  it('should create Wallet from valid mnemonic', () => {
    expect(() => ToshiWallet.fromMnemonic(MNEMONIC)).not.toThrow();
  });

  it('Fail to create ToshiWallet from invalid mnemonic', () => {
    expect(() =>
      ToshiWallet.fromMnemonic('all your base are belong to us'),
    ).toThrow('Invalid BIP39 mnemonic');
  });

  it('should get address from wallet', () => {
    const wallet = ToshiWallet.fromMnemonic(MNEMONIC);
    expect(wallet.getAddress()).toEqual(ADDRESS);
  });

  it('should build payload', () => {
    const wallet = ToshiWallet.fromMnemonic(MNEMONIC);

    const body =
      '{"custom": {"name": "Mr Tester", "avatar": "https://s3.amazonaws.com/testuser/profile.jpg"}}';
    const payload = ToshiWallet.buildPayload(
      body,
      'POST',
      '/v1/user',
      1480078657,
    );

    expect(payload).toEqual(
      'POST\n/v1/user\n1480078657\nto5m3Kmk6z9OZI/Kb+/yabcfDKl47nSuspAtxnFaQsA=',
    );
  });

  it('should sign payload', () => {
    const wallet = ToshiWallet.fromMnemonic(MNEMONIC);
    const payload =
      'POST\n/v1/user\n1480078657\nto5m3Kmk6z9OZI/Kb+/yabcfDKl47nSuspAtxnFaQsA=';
    const signature = wallet.signPayload(payload);

    expect(signature).toEqual(
      '0xc073c461219c10d855aca203003f72944510a57f1ca60e4bbb627a1305ad57a21884162d5788b5188ba596122028a7092527cdf370d3af435f7d440f52197fa900',
    );
  });
});
