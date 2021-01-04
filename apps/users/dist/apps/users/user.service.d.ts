import { LoginUser } from "@commerce/gateway";
import { RegisterUser } from "@commerce/gateway";
import { UserDTO } from "@commerce/shared";
import { Repository } from "typeorm";
import { UserEntity as User, UserEntity } from "./user.entity";
export declare class UserService {
    private readonly users;
    constructor(users: Repository<User>);
    updateToCustomer(id: any, gateway_customer_id: any): Promise<import("typeorm").UpdateResult>;
    findById(id: string): Promise<User>;
    fetchUsersByIds(ids: Array<String>): Promise<UserEntity[]>;
    me({ id }: any): Promise<UserDTO>;
    get(page?: number): Promise<UserEntity[]>;
    login({ email, password }: LoginUser): Promise<UserDTO>;
    register({ email, password, password_confirmation, seller, name }: RegisterUser): Promise<UserDTO>;
}
