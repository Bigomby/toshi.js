import { AxiosInstance } from 'axios';

import { IUser, ICreateUser, IUpdateUser } from './interfaces/user.interface';
import { ServiceClient } from '../../service-client';

export class User {
  constructor(private readonly http: AxiosInstance) {}

  public async create(user?: ICreateUser): Promise<IUser> {
    const { data } = await this.http.post('/v2/user', user);
    return data;
  }

  public async update(user: IUpdateUser): Promise<IUser> {
    const { data } = await this.http.put('/v2/user', user);
    return data;
  }

  public async get(userId: string): Promise<IUser> {
    const { data } = await this.http.get(`/v1/user/${userId}`);
    return data;
  }

  public async updateById(userId: string, user: IUpdateUser): Promise<IUser> {
    const { data } = await this.http.put(`/v2/user/${userId}`, user);
    return data;
  }
}
