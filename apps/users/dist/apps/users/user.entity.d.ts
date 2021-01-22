import { BaseEntity } from 'typeorm';
import { AddressEntity } from './address.entity';
export declare class UserEntity extends BaseEntity {
  id: string;
  seller: boolean;
  name: string;
  email: string;
  password: string;
  gateway_customer_id: string;
  created_at: Date;
  updated_at: Date;
  address: AddressEntity;
  hashPassword(): Promise<void>;
  private get token();
  toResponseObject(showToken?: boolean): any;
}
