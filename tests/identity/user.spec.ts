import axios from 'axios';
import * as tk from 'timekeeper';
import * as nock from 'nock';

import Fixtures from '../fixtures';
import { Identity, ToshiWallet } from '../../src';

describe('User', () => {
  const wallet = ToshiWallet.fromMnemonic(Fixtures.mnemonic);
  const { user: User } = new Identity(wallet, { url: Fixtures.baseUrl });
  tk.freeze(new Date(Fixtures.time));

  it('Get user info', async () => {
    const reqheaders = {
      'toshi-id-address': '0xcab1bf54c25f2cb1e9da715d2f453aeb0dc33fc2',
      'toshi-signature':
        '0x7278f643aaf333e3251e32c74ad79113bd2572b855f73811dd6aca910243e48f394fad1887b7093e83f15927fe32ec32e940423a8654caec956339167339634b01',
      'toshi-timestamp': (Fixtures.time / 1000).toString(),
    };

    nock(Fixtures.baseUrl, { reqheaders })
      .get('/v1/user/bigomby')
      .reply(200, Fixtures.user);

    const user = await User.get('bigomby');
    expect(user).toMatchObject(Fixtures.user);
  });

  it('Register new user without providing user info', async () => {
    const reqheaders = {
      'toshi-id-address': '0xcab1bf54c25f2cb1e9da715d2f453aeb0dc33fc2',
      'toshi-signature':
        '0x10d89dfc52e553315236667bc39e02eb5e3805e168438b866ab211f1a0841bb12ab536d7949ac7ea70ceda87f7d2ae5051b0cb7482e2ca017de78ab662ae8baa01',
      'toshi-timestamp': (Fixtures.time / 1000).toString(),
    };

    nock(Fixtures.baseUrl, { reqheaders })
      .post('/v2/user')
      .reply(200, Fixtures.user);

    const user = await User.create();
    expect(user).toEqual(Fixtures.user);
  });

  it('Register new user providing user info', async () => {
    const reqheaders = {
      'toshi-id-address': '0xcab1bf54c25f2cb1e9da715d2f453aeb0dc33fc2',
      'toshi-signature':
        '0x4d935b22956576a31d3cafe2994baa152b1371f300e88fe7dae4e30fca43afd9596749da0129895ee30b61fe93aea42e246c441969f97d7ec2da2a37d34d751300',
      'toshi-timestamp': (Fixtures.time / 1000).toString(),
    };

    nock(Fixtures.baseUrl, { reqheaders })
      .post('/v2/user')
      .reply(200, Fixtures.user);

    const user = await User.create({
      username: 'user12345',
      name: 'Satoshi Nakamoto',
      description: 'Hi there!',
      payment_address: '0x307736E32903BB22D5915E6dD4E29684f562a83d',
    });

    expect(user).toEqual(Fixtures.user);
  });
});
