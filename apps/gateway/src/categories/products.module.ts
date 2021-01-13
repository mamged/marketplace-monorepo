import { Module, Scope } from "@nestjs/common";

import { CategoryResolver } from "./product.resolver";
import { CategoryService } from "./product.service";
import { UserDataLoader } from "../loaders/user.loader";
import { UserService } from "../users/user.service";
import { UsersModule } from "../users/users.module";

@Module({
    providers: [
        CategoryResolver,
        CategoryService,
        {
            inject: [UserService],
            useFactory: UserDataLoader.create,
            provide: UserDataLoader,
            scope: Scope.REQUEST
        }
    ],
    imports: [UsersModule],
    exports: [CategoryService]
})
export class CategoriesModule {}
