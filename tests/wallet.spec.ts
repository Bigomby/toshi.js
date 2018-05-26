import { ToshiWallet } from '../src/toshi-wallet';

const MNEMONIC =
  'false hen huge trumpet begin lyrics power daring zebra danger tonight gold';

test('Create Wallet from mnemonic', () => {
  expect(() => ToshiWallet.fromMnemonic(MNEMONIC)).not.toThrow();
});

test('Fail to create ToshiWallet from mnemonic', () => {
  expect(() =>
    ToshiWallet.fromMnemonic('all your base are belong to us'),
  ).toThrow('Invalid BIP39 mnemonic');
});

test('Get address from wallet', () => {
  const wallet = ToshiWallet.fromMnemonic(MNEMONIC);

  expect(wallet.getAddress()).toEqual(
    '0xcab1bf54c25f2cb1e9da715d2f453aeb0dc33fc2',
  );
});

test('Build payload', () => {
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
