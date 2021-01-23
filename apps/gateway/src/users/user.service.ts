import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { UserDTO, UserLoginDTO } from '@commerce/shared';
import { LoginUserInput } from './input/login-user.input';
import { RegisterUserInput } from './input/register-user.input';
import { ObjectID } from 'typeorm';
import { config } from '@commerce/shared';

@Injectable()
export class UserService {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`,
    },
  })
  private client: ClientProxy;
  async get(): Promise<UserDTO[]> {
    const response = await this.client.send<UserDTO[]>('users', []);
    return response.toPromise();
  }
  async login(data: LoginUserInput): Promise<UserLoginDTO> {
    return new Promise((resolve, reject) => {
      this.client.send<UserLoginDTO>('login-user', data).subscribe(
        (response) => resolve(response),
        (error) => reject(error),
      );
    });
  }
  async register(data: RegisterUserInput): Promise<UserDTO> {
    const response = this.client.send<UserDTO>('register-user', data);
    return response.toPromise();
  }

  async fetchUsersByIds(ids: string[]): Promise<UserDTO[]> {
    const user = await this.client
      .send<UserDTO[]>('fetch-users-by-ids', ids)
      .toPromise();
    return user;
  }
  me(id: ObjectID) {
    return new Promise((resolve, reject) => {
      this.client.send<UserDTO>('current-loggedin-user', id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
}
