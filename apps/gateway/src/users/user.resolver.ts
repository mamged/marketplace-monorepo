import { Query, Resolver, Context, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UserDTO, UserLoginDTO } from "@commerce/shared";
import { LoginUser } from "./login-user.validation";
import { RegisterUser } from "./register-user.validation";
import { AuthGuard } from "../middlewares/auth.guard";
import { SellerGuard } from "../middlewares/seller.guard";
import { UserService } from "./user.service";
import { UserEntity } from "@commerce/users";

@Resolver("User")
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
                console.log(err);
            });
    }
    @Mutation(returns=> LoginUser)
    register(@Args("data") data: RegisterUser): Promise<UserDTO> {
        return this.userService.register(data);
    }

    @Query(returns=> UserEntity)
    @UseGuards(new AuthGuard())
    me(@Context("user") user: any) {
        return this.userService.me(user.id);
    }
}
