import { BaseEntity } from "typeorm";
import { UserEntity } from "./user.entity";
export declare class AddressEntity extends BaseEntity {
    id: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    zip: number;
    user: UserEntity;
}
