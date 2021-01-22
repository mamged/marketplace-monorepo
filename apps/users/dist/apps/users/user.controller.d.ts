import { LoginUser } from '@commerce/gateway';
import { RegisterUser } from '@commerce/gateway';
import { ObjectID } from 'typeorm';
import { UserService } from './user.service';
export declare class UserController {
  private readonly users;
  constructor(users: UserService);
  index(): Promise<import('./user.entity').UserEntity[]>;
  login(data: LoginUser): Promise<any>;
  register(data: RegisterUser): Promise<any>;
  me(id: ObjectID): Promise<any>;
  fetchUserById(id: string): Promise<import('./user.entity').UserEntity>;
  fetchUsersByIds(
    ids: Array<String>,
  ): Promise<import('./user.entity').UserEntity[]>;
  handleCreatedCustomer({
    user_id,
    gateway_customer_id,
  }: {
    user_id: any;
    gateway_customer_id: any;
  }): Promise<import('typeorm').UpdateResult>;
}
