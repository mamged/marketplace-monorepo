import { Query, Resolver, Context, Mutation, Args } from "@nestjs/graphql";
import { SetMetadata, UseGuards } from "@nestjs/common";
import { UserDTO, UserLoginDTO } from "@commerce/shared";
import { LoginUser } from "./login-user.validation";
import { RegisterUser } from "./register-user.validation";
import { AuthGuard } from "../middlewares/auth.guard";
import { SellerGuard } from "../middlewares/seller.guard";
import { UserService } from "./user.service";
import { UserEntity } from "@commerce/users";
import { RolesGuard } from "../middlewares/roles.guard";
import { Roles } from "../decorators/roles.decorator";

@Resolver(()=> LoginUser)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(returns=> UserEntity)
    users(): Promise<UserDTO[]> {
        return this.userService.get();
    }

    @Mutation(returns=> LoginUser)
    login(
        @Args("data") data: LoginUser
    ): Promise<void | UserLoginDTO> {
        return this.userService
            .login(data)
            .then(user => user)
            .catch(err => {
                console.log('login mutation', err);
            });
    }
    @Mutation(returns=> LoginUser)
    register(@Args("data") data: RegisterUser): Promise<UserDTO> {
        return this.userService.register(data);
    }

    @Query(returns=> UserEntity)
    @UseGuards(new AuthGuard())
    @Roles("adminx")
    me(@Context("user") user: any) {
        return this.userService.me(user.id);
    }
}
