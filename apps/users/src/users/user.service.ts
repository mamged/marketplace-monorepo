import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { LoginUserInput } from "@commerce/gateway";
import { RegisterUserInput } from "@commerce/gateway";
import { UserDTO } from "@commerce/shared";
import { Repository } from "typeorm";
import { UserEntity as User, UserEntity } from "./user.entity";
import { compareSync } from "bcryptjs";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>
    ) {}
    updateToCustomer(id, gateway_customer_id) {
        return this.users.update(id, {
            gateway_customer_id
        });
    }
    findById(id: string) {
        return this.users.findOneOrFail(id);
    }
    fetchUsersByIds(ids: Array<String>): Promise<UserEntity[]> {
        return this.users.findByIds(ids);
    }
    async me({ id }: any): Promise<UserDTO> {
        const user = await this.users.findOneOrFail(id, {
            relations: ["address"]
        });
        return user.toResponseObject(false);
    }
    async get(page: number = 1): Promise<UserEntity[]> {
        const options = {
            relations: ["address"],
            skip: 25 * (page - 1),
            take: 25
        };
        return this.users.find(options);
    }
    async login({ email, password }: LoginUserInput): Promise<UserDTO> {
        const user = await this.users.findOneOrFail({
            where: { email }
        });
        if (!compareSync(password, user.password)) {
            throw new RpcException(
                new NotFoundException("Invalid Credentials...")
            );
        }
        return user.toResponseObject();
    }
    async register({
        email,
        password,
        password_confirmation,
        seller,
        name
    }: RegisterUserInput): Promise<UserDTO> {
        if (password != password_confirmation) {
            throw new RpcException(
                new NotFoundException(
                    "Password and password_confirmation should match"
                )
            );
        }

        const count = await this.users.count({
            where: {
                email
            }
        });
        if (count) {
            throw new RpcException(
                new NotFoundException(
                    "email exists, please pick up another one."
                )
            );
        }
        let user = await this.users.create({
            name,
            seller,
            email,
            password
        });
        user = await this.users.save(user);
        return user.toResponseObject();
    }
}
