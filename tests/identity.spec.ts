import { Identity, ToshiWallet } from '../src';

const BASE_URL = 'https://identity.development.service.toshi.org';

const MNEMONIC =
  'false hen huge trumpet begin lyrics power daring zebra danger tonight gold';

test('Get user info', async () => {
  const wallet = ToshiWallet.fromMnemonic(MNEMONIC);
  const client = new Identity(BASE_URL, wallet);

  const response = await client.getUser('bigomby');

  expect(response).toMatchObject({
    name: 'Diego Fernández',
    username: 'Bigomby',
    about: '',
    location: 'Sevilla',
    toshi_id: '0x32d1751b9208cd9807615d6bbaa1c3338dbfd305',
    payment_address: '0x8a5b0efdf5285f7efe3ce53b0873c9f1b879c3ed',
  });
});

test('Register new user providing user info', async () => {
  const wallet = ToshiWallet.generate();
  const client = new Identity(BASE_URL, wallet);

  const username = Math.random()
    .toString(36)
    .substring(5);
  const content = {
    username,
    name: 'John Doe',
    description: 'I am John Doe',
    paymentAddress: '0x307736E32903BB22D5915E6dD4E29684f562a83d',
  };

  expect(client.registerUser(content)).resolves;
});

test('Register new user without providing user info', async () => {
  const wallet = ToshiWallet.generate();
  const client = new Identity(BASE_URL, wallet);

  expect(async () => await client.registerUser()).not.toThrow();
});
