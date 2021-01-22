import { Query, Resolver, Context, Mutation, Args, PickType } from "@nestjs/graphql";
import { SetMetadata, UseGuards } from "@nestjs/common";
import { UserDTO, UserLoginDTO } from "@commerce/shared";
import { LoginUserInput } from "./input/login-user.input";
import { RegisterUserInput } from "./input/register-user.input";
import { AuthGuard } from "../middlewares/auth.guard";
import { SellerGuard } from "../middlewares/seller.guard";
import { UserService } from "./user.service";
import { UserEntity } from "@commerce/users";
import { RolesGuard } from "../middlewares/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { AuthTokenSchema } from "./schema/authtoken.schema";
import { RegisterUserSchema } from "./schema/register-user-schema";
import { UserSchema } from "./schema/me.schema";

@Resolver(()=> UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(returns=> UserEntity)
    users(): Promise<UserDTO[]> {
        return this.userService.get();
    }

    @Mutation(returns=> AuthTokenSchema)
    login(
        @Args("data") data: LoginUserInput
    ): Promise<void | UserLoginDTO> {
        return this.userService
            .login(data)
            .then(user => user)
            .catch(err => {
                console.log('login mutation', err);
            });
    }
    @Mutation(returns=> RegisterUserSchema)
    register(@Args("data") data: RegisterUserInput): Promise<UserDTO> {
        return this.userService.register(data);
    }

    @Query(returns=> UserSchema)
    @UseGuards(new AuthGuard())
    @Roles("adminx")
    me(@Context("user") user: any) {
        return this.userService.me(user.id);
    }
}
